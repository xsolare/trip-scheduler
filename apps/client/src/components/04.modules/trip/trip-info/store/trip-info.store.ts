/* eslint-disable no-console */
import type { IActivity, IDay } from '../models/types'
import { defineStore } from 'pinia'
import { useToast } from '~/components/01.kit/kit-toast'
import { useRequest, useRequestError, useRequestStatus, useRequestStore } from '~/plugins/request'
import { getActivityDuration, minutesToTime, timeToMinutes } from '../lib/helpers'

export enum ETripInfoKeys {
  FETCH_DAYS = 'trip:fetch-days',
  ADD_DAY = 'trip:add-day',
  UPDATE_DAY = 'trip:update-day',
  DELETE_DAY = 'trip:delete-day',

  ADD_ACTIVITY = 'trip:add-activity',
  UPDATE_ACTIVITY = 'trip:update-activity',
  REMOVE_ACTIVITY = 'trip:remove-activity',
}

/**
 * Стор для управления ДАННЫМИ о конкретном путешествии,
 * включая его дни и активности.
 */
export const useTripInfoStore = defineStore('tripInfo', {
  // --- STATE ---
  state: (): {
    days: IDay[]
    currentTripId: string | null
    currentDayId: string | null
  } => ({
    days: [],
    currentTripId: null,
    currentDayId: null,
  }),

  // --- GETTERS ---
  getters: {
    isLoading: () => useRequestStatus(ETripInfoKeys.FETCH_DAYS).value,
    fetchError: () => useRequestError(ETripInfoKeys.FETCH_DAYS).value,
    isLoadingUpdateDay: () => useRequestStatus(ETripInfoKeys.UPDATE_DAY).value,
    isLoadingNewDay: () => useRequestStatus(ETripInfoKeys.ADD_DAY).value,
    isLoadingUpdateActivity: () => useRequestStatus(ETripInfoKeys.UPDATE_ACTIVITY).value,

    getAllDays(state): IDay[] {
      return state.days
    },

    getSelectedDay(state): IDay | null {
      if (!state.currentDayId)
        return null

      return state.days.find(day => day.id === state.currentDayId) ?? null
    },

    getActivitiesForSelectedDay(): IActivity[] {
      return this.getSelectedDay?.activities
        .slice()
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)) ?? []
    },

    currentDayIndex(state): number {
      if (!state.currentDayId || !state.days)
        return -1
      return state.days.findIndex(day => day.id === state.currentDayId)
    },

    getPreviousDayId(): string | null {
      if (this.currentDayIndex > 0)
        return this.days[this.currentDayIndex - 1].id
      return null
    },

    getNextDayId(): string | null {
      if (this.currentDayIndex !== -1 && this.currentDayIndex < this.days.length - 1)
        return this.days[this.currentDayIndex + 1].id
      return null
    },
  },

  // --- ACTIONS ---
  actions: {
    setCurrentDay(dayId: string): void {
      this.currentDayId = dayId
    },

    selectNextDay() {
      if (this.getNextDayId)
        this.setCurrentDay(this.getNextDayId)
    },

    selectPreviousDay() {
      if (this.getPreviousDayId)
        this.setCurrentDay(this.getPreviousDayId)
    },

    fetchDaysForTrip(tripId: string, initialDayIdFromQuery?: string) {
      this.currentTripId = tripId

      useRequest({
        key: ETripInfoKeys.FETCH_DAYS,
        fn: db => db.days.getByTripId(tripId),
        immediate: true,
        onSuccess: (result) => {
          const sortedDays = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          this.days = sortedDays
          const dayFromQueryIsValid = initialDayIdFromQuery && sortedDays.some(d => d.id === initialDayIdFromQuery)

          if (dayFromQueryIsValid) {
            this.currentDayId = initialDayIdFromQuery
          }
          else {
            this.currentDayId = sortedDays.length > 0 ? sortedDays[0].id : null
          }
        },
        onError: (error) => {
          this.days = []
          this.currentDayId = null

          console.error(`Ошибка при загрузке дней для путешествия ${tripId}: `, error)
          useToast().error(`Ошибка при загрузке дней для путешествия: ${error}`)
        },
      })
    },

    updateDayDetails(dayId: string, details: Partial<Pick<IDay, 'title' | 'description' | 'date'>>) {
      const dayIndex = this.days.findIndex(d => d.id === dayId)
      if (dayIndex === -1) {
        console.error('Не удалось найти день для обновления:', dayId)
        useToast().error(`Не удалось найти день для обновления`)
        return
      }
      const originalDay = { ...this.days[dayIndex] }

      Object.assign(this.days[dayIndex], details)

      if (details.date)
        this.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      useRequest({
        key: ETripInfoKeys.UPDATE_DAY,
        fn: db => db.days.updateDayDetails(dayId, details),
        onSuccess: (updatedDayFromServer) => {
          const finalDayIndex = this.days.findIndex(d => d.id === dayId)
          if (finalDayIndex !== -1)
            this.days[finalDayIndex] = { ...this.days[finalDayIndex], ...updatedDayFromServer }
        },
        onError: (error) => {
          const dayToRevertIndex = this.days.findIndex(d => d.id === dayId)
          if (dayToRevertIndex !== -1)
            this.days[dayToRevertIndex] = originalDay

          if (details.date)
            this.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

          console.error(`Ошибка при обновлении дня ${dayId}: `, error)
          useToast().error(`Ошибка при обновлении дня: ${error}`)
        },
      })
    },

    addActivity(dayId: string, activityData: Omit<IActivity, 'id'>) {
      const day = this.days.find(d => d.id === dayId)
      if (!day) {
        console.error('Не удалось найти день для добавления активности:', dayId)
        useToast().error(`Не удалось найти день для добавления активности`)
        return
      }

      // 1. Создаем временную активность для немедленного отображения в UI
      const tempId = `temp-activity-${Date.now()}`
      const optimisticActivity: IActivity = {
        ...activityData,
        id: tempId,
      }

      // 2. Оптимистично добавляем в стор
      day.activities.push(optimisticActivity)

      // 3. Отправляем запрос на сервер
      useRequest({
        key: `${ETripInfoKeys.ADD_ACTIVITY}:${tempId}`,
        fn: db => db.activities.create(activityData),
        onSuccess: (createdActivityFromServer) => {
          const tempActivity = day.activities.find(a => a.id === tempId)
          if (tempActivity) {
            Object.assign(tempActivity, createdActivityFromServer)
          }
          console.log(`Активность ${createdActivityFromServer.id} успешно создана.`)
        },
        onError: (error) => {
          const activityIndex = day.activities.findIndex(a => a.id === tempId)
          if (activityIndex !== -1) {
            day.activities.splice(activityIndex, 1)
          }

          console.error(`Ошибка при создании активности: `, error)
          useToast().error(`Ошибка при создании активности: ${error}`)
        },
      })
    },

    removeActivity(dayId: string, activityId: string) {
      const day = this.days.find(d => d.id === dayId)
      if (!day) {
        console.error('Не удалось найти день для удаления активности:', dayId)
        useToast().error(`Не удалось найти день для удаления активности.`)
        return
      }

      const activityIndex = day.activities.findIndex(a => a.id === activityId)
      if (activityIndex === -1) {
        console.error('Не удалось найти активность для удаления:', activityId)
        useToast().error(`Не удалось найти активность для удаления.`)
        return
      }

      // 1. Оптимистично удаляем активность из стора
      const removedActivity = day.activities.splice(activityIndex, 1)[0]

      // 2. Отправляем запрос на сервер
      useRequest({
        key: `${ETripInfoKeys.REMOVE_ACTIVITY}:${activityId}`,
        fn: db => db.activities.remove(activityId),
        onSuccess: () => {
          console.log(`Активность ${activityId} успешно удалена с сервера.`)
        },
        onError: (error) => {
          // 3. При ошибке откатываем изменения (возвращаем активность)
          if (day)
            day.activities.splice(activityIndex, 0, removedActivity)

          console.error(`Ошибка при удалении активности ${activityId}: `, error)
          useToast().error(`Ошибка при удалении активности: ${error}`)
        },

      })
    },

    updateActivity(dayId: string, updatedActivity: IActivity) {
      const day = this.days.find(d => d.id === dayId)
      if (!day)
        return

      const activityIndex = day.activities.findIndex(a => a.id === updatedActivity.id)
      if (activityIndex === -1)
        return

      // 1. Сохраняем оригинальное состояние и оптимистично обновляем
      const originalActivity = JSON.parse(JSON.stringify(day.activities[activityIndex]))
      day.activities[activityIndex] = updatedActivity

      // 2. Отправляем запрос на сервер
      useRequest({
        key: ETripInfoKeys.UPDATE_ACTIVITY,
        fn: db => db.activities.update(updatedActivity),
        onSuccess: (activityFromServer) => {
          const finalIndex = day.activities.findIndex(a => a.id === activityFromServer.id)
          if (finalIndex !== -1)
            day.activities[finalIndex] = activityFromServer
        },
        onError: (error) => {
          // 3. В случае ошибки откатываем изменения
          const revertIndex = day.activities.findIndex(a => a.id === updatedActivity.id)
          if (revertIndex !== -1)
            day.activities[revertIndex] = originalActivity

          console.error(`Ошибка при обновлении активности ${updatedActivity.id}: `, error)
          useToast().error(`Ошибка при обновлении активности: ${error}`)
        },
      })
    },

    addNewDay() {
      if (!this.currentTripId) {
        console.error('Невозможно добавить день: ID путешествия не установлен.')
        useToast().error(`Невозможно добавить день: ID путешествия не установлен.`)
        return
      }

      const lastDay = [...this.days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).pop()
      const newDate = lastDay ? new Date(lastDay.date) : new Date()

      if (lastDay)
        newDate.setDate(newDate.getDate() + 1)

      const newDayData: Omit<IDay, 'id'> = {
        tripId: this.currentTripId,
        title: `День ${this.days.length + 1}`,
        description: '',
        date: newDate.toISOString(),
        activities: [],
      }

      const tempId = `temp-day-${Date.now()}`
      const dayWithTempId = { ...newDayData, id: tempId }

      this.days.push(dayWithTempId)
      this.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      this.currentDayId = tempId

      useRequest({
        key: ETripInfoKeys.ADD_DAY,
        fn: db => db.days.createNewDay(newDayData),
        onSuccess: (createdDay) => {
          const tempDayIndex = this.days.findIndex(d => d.id === tempId)
          if (tempDayIndex !== -1) {
            this.days[tempDayIndex] = { ...this.days[tempDayIndex], ...createdDay }
            if (this.currentDayId === tempId)
              this.currentDayId = createdDay.id
          }
        },
        onError: (error) => {
          const tempDayIndex = this.days.findIndex(d => d.id === tempId)
          if (tempDayIndex !== -1)
            this.days.splice(tempDayIndex, 1)

          if (this.currentDayId === tempId)
            this.currentDayId = this.days.length > 0 ? this.days[this.days.length - 1].id : null

          console.error('Ошибка при добавлении нового дня:', error)
          useToast().error(`Ошибка при добавлении нового дня: ${error}`)
        },
      })
    },

    deleteDay() {
      if (!this.currentDayId) {
        console.error('Невозможно удалить день: день не выбран.')
        useToast().error(`Невозможно удалить день: день не выбран.`)
        return
      }

      const dayIdToDelete = this.currentDayId
      const dayIndex = this.days.findIndex(d => d.id === dayIdToDelete)
      if (dayIndex === -1) {
        console.error('Не удалось найти день для удаления:', dayIdToDelete)
        useToast().error(`Не удалось найти день для удаления.`)
        return
      }

      const deletedDay = this.days[dayIndex]
      const originalCurrentDayId = this.currentDayId

      this.days.splice(dayIndex, 1)

      if (this.days.length > 0) {
        const newIndex = Math.min(dayIndex, this.days.length - 1)
        this.currentDayId = this.days[newIndex].id
      }
      else {
        this.currentDayId = null
      }

      useRequest({
        key: ETripInfoKeys.DELETE_DAY,
        fn: db => db.days.deleteDay(dayIdToDelete),
        onSuccess: () => {
          console.log(`День ${dayIdToDelete} успешно удален с сервера.`)
        },
        onError: (error) => {
          this.days.splice(dayIndex, 0, deletedDay)
          this.currentDayId = originalCurrentDayId

          console.error(`Ошибка при удалении дня ${dayIdToDelete}: `, error)
          useToast().error(`Ошибка при удалении дня: ${error}`)
        },
      })
    },

    reorderActivities(newOrder: IActivity[]) {
      const day = this.days.find(d => d.id === this.currentDayId)
      if (!day)
        return

      if (newOrder.length === 0) {
        day.activities = []
        return
      }

      const originalSortedActivities = this.getActivitiesForSelectedDay
      const anchorStartTimeMinutes = originalSortedActivities.length > 0
        ? timeToMinutes(originalSortedActivities[0].startTime)
        : 9 * 60

      const GAP_BETWEEN_ACTIVITIES_MINUTES = 15
      const recalculatedActivities: IActivity[] = []
      let lastEndTimeMinutes = anchorStartTimeMinutes - GAP_BETWEEN_ACTIVITIES_MINUTES

      for (const activity of newOrder) {
        const duration = getActivityDuration(activity)
        const newStartTimeMinutes = lastEndTimeMinutes + GAP_BETWEEN_ACTIVITIES_MINUTES
        const newEndTimeMinutes = newStartTimeMinutes + duration

        recalculatedActivities.push({
          ...activity,
          startTime: minutesToTime(newStartTimeMinutes),
          endTime: minutesToTime(newEndTimeMinutes),
        })

        lastEndTimeMinutes = newEndTimeMinutes
      }

      day.activities = recalculatedActivities
      // TODO: Отправить batch-запрос на обновление на бэкенд
    },

    reset() {
      this.days = []
      this.currentTripId = null
      this.currentDayId = null

      const requestStore = useRequestStore()
      Object.values(ETripInfoKeys).forEach(key => requestStore.reset(key))
    },
  },
})
