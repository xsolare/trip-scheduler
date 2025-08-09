import type { IActivity, IDay } from '../models/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest, useRequestError, useRequestStatus, useRequestStore } from '~/plugins/request'
import { timeToMinutes } from '../lib/helpers'

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
export const useTripInfoStore = defineStore('tripInfo', () => {
  // --- STATE ---
  const days = ref<IDay[]>([])
  const currentTripId = ref<string | null>(null)
  const currentDayId = ref<string | null>(null)

  // --- GETTERS ---
  const isLoading = useRequestStatus(ETripInfoKeys.FETCH_DAYS)
  const fetchError = useRequestError(ETripInfoKeys.FETCH_DAYS)

  const isLoadingUpdateDay = useRequestStatus(ETripInfoKeys.UPDATE_DAY)
  const isLoadingNewDay = useRequestStatus(ETripInfoKeys.ADD_DAY)

  const getAllDays = computed((): IDay[] => days.value)

  const getSelectedDay = computed((): IDay | null => {
    if (!currentDayId.value)
      return null

    return days.value.find(day => day.id === currentDayId.value) ?? null
  })

  const getActivitiesForSelectedDay = computed((): IActivity[] => {
    return getSelectedDay.value?.activities
      .slice()
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)) ?? []
  })

  // --- ACTIONS ---
  function fetchDaysForTrip(tripId: string) {
    currentTripId.value = tripId

    useRequest({
      key: ETripInfoKeys.FETCH_DAYS,
      fn: db => db.days.getByTripId(tripId),
      immediate: true,
      onSuccess: (result) => {
        const sortedDays = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        days.value = sortedDays
        currentDayId.value = sortedDays.length > 0 ? sortedDays[0].id : null
      },
      onError: (error) => {
        days.value = []
        currentDayId.value = null
        console.error(`Ошибка при загрузке дней для путешествия ${tripId}:`, error)
      },
    })
  }

  function setCurrentDay(dayId: string): void {
    currentDayId.value = dayId
  }

  function updateDayDetails(dayId: string, details: Partial<Pick<IDay, 'title' | 'description' | 'date'>>) {
    const dayIndex = days.value.findIndex(d => d.id === dayId)
    if (dayIndex === -1) {
      console.error('Не удалось найти день для обновления:', dayId)
      return
    }
    const originalDay = { ...days.value[dayIndex] }

    Object.assign(days.value[dayIndex], details)

    if (details.date) {
      days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    useRequest({
      key: ETripInfoKeys.UPDATE_DAY,
      fn: db => db.days.updateDayDetails(dayId, details),
      onSuccess: (updatedDayFromServer) => {
        const finalDayIndex = days.value.findIndex(d => d.id === dayId)
        if (finalDayIndex !== -1)
          days.value[finalDayIndex] = { ...days.value[finalDayIndex], ...updatedDayFromServer }
      },
      onError: (error) => {
        const dayToRevertIndex = days.value.findIndex(d => d.id === dayId)
        if (dayToRevertIndex !== -1)
          days.value[dayToRevertIndex] = originalDay

        if (details.date)
          days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        console.error(`Ошибка при обновлении дня ${dayId}:`, error)
      },
    })
  }

  function addActivity(dayId: string, activity: Omit<IActivity, 'id'>) {
    // 1. Оптимистичное обновление UI
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const tempId = `temp-activity-${Date.now()}`
    const newActivity: IActivity = { ...activity, id: tempId }
    day.activities.push(newActivity)

    // 2. Запрос в фоне
    // TODO

    // eslint-disable-next-line no-console
    console.log('addActivity', newActivity)
  }

  function removeActivity(dayId: string, activityId: string) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const activityIndex = day.activities.findIndex(a => a.id === activityId)
    if (activityIndex === -1)
      return null

    // const removedActivity = day.activities.splice(activityIndex, 1)[0]

    // TODO

    // eslint-disable-next-line no-console
    console.log('removeActivity', activityId)
  }

  function updateActivity(dayId: string, updatedActivity: IActivity) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const activityIndex = day.activities.findIndex(a => a.id === updatedActivity.id)
    if (activityIndex === -1)
      return null

    day.activities[activityIndex] = updatedActivity

    // TODO

    // eslint-disable-next-line no-console
    console.log('updateActivity', updatedActivity)
  }

  function addNewDay() {
    if (!currentTripId.value) {
      console.error('Невозможно добавить день: ID путешествия не установлен.')
      return
    }

    const lastDay = days.value.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).at(-1)
    const newDate = lastDay ? new Date(lastDay.date) : new Date()

    if (lastDay)
      newDate.setDate(newDate.getDate() + 1)

    const newDayData: Omit<IDay, 'id'> = {
      tripId: currentTripId.value,
      title: `День ${days.value.length + 1}`,
      description: '',
      date: newDate.toISOString(),
      activities: [],
    }

    const tempId = `temp-day-${Date.now()}`
    const dayWithTempId = { ...newDayData, id: tempId }

    days.value.push(dayWithTempId)
    days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    currentDayId.value = tempId

    useRequest({
      key: ETripInfoKeys.ADD_DAY,
      fn: db => db.days.createNewDay(newDayData),
      onSuccess: (createdDay) => {
        const tempDayIndex = days.value.findIndex(d => d.id === tempId)
        if (tempDayIndex !== -1) {
          days.value[tempDayIndex] = { ...days.value[tempDayIndex], ...createdDay }
          if (currentDayId.value === tempId)
            currentDayId.value = createdDay.id
        }
      },
      onError: (error) => {
        console.error('Ошибка при добавлении нового дня:', error)
        const tempDayIndex = days.value.findIndex(d => d.id === tempId)
        if (tempDayIndex !== -1)
          days.value.splice(tempDayIndex, 1)

        if (currentDayId.value === tempId)
          currentDayId.value = days.value.length > 0 ? days.value[days.value.length - 1].id : null
      },
    })
  }

  function deleteDay() {
    if (!currentDayId.value) {
      console.error('Невозможно удалить день: день не выбран.')
      return
    }

    const dayIdToDelete = currentDayId.value
    const dayIndex = days.value.findIndex(d => d.id === dayIdToDelete)
    if (dayIndex === -1) {
      console.error('Не удалось найти день для удаления:', dayIdToDelete)
      return
    }

    // @ts-expect-error Сделаю позже
    // eslint-disable-next-line unused-imports/no-unused-vars
    const originalDays = [...days.value]
    days.value.splice(dayIndex, 1)

    if (days.value.length > 0) {
      const newIndex = Math.min(dayIndex, days.value.length - 1)
      currentDayId.value = days.value[newIndex].id
    }
    else {
      currentDayId.value = null
    }

    // useRequest({
    //   key: ETripInfoKeys.DELETE_DAY,
    //   // @ts-expect-error - db.days.deleteDay is not defined in the provided context
    //   fn: db => db.days.deleteDay(dayIdToDelete),
    //   onError: (error) => {
    //     console.error(`Ошибка при удалении дня ${dayIdToDelete}:`, error)
    //     // Rollback
    //     days.value = originalDays
    //     currentDayId.value = dayIdToDelete
    //   },
    // })
  }

  function reorderActivities(newOrder: IActivity[]): void {
    const day = days.value.find(d => d.id === currentDayId.value)
    if (!day)
      return

    day.activities = newOrder
    // TODO
  }

  function reset() {
    days.value = []
    currentTripId.value = null
    currentDayId.value = null

    const requestStore = useRequestStore()
    Object.values(ETripInfoKeys).forEach(key => requestStore.reset(key))
  }

  return {
    days,
    currentTripId,
    currentDayId,
    isLoadingUpdateDay,
    isLoadingNewDay,
    isLoading,
    fetchError,
    getAllDays,
    getSelectedDay,
    getActivitiesForSelectedDay,
    fetchDaysForTrip,
    setCurrentDay,
    updateDayDetails,
    addActivity,
    removeActivity,
    updateActivity,
    addNewDay,
    deleteDay,
    reorderActivities,
    reset,
  }
})
