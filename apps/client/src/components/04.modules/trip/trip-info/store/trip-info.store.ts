import type { IActivity, IDay } from '../models/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest, useRequestError, useRequestStatus, useRequestStore } from '~/plugins/request'
import { timeToMinutes } from '../lib/helpers'

export enum ETripInfoKeys {
  FETCH_DAYS = 'trip:fetch-days',
  ADD_DAY = 'trip:add-day',
  UPDATE_DAY = 'trip:update-day',

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
    // 1. Оптимистичное обновление UI
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    // const originalDay = { ...day }
    Object.assign(day, details)
    if (details.date)
      days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // 2. Запрос в фоне
    // TODO
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
  }

  function addNewDay() {
    if (!currentTripId.value)
      return
    const lastDay = days.value[days.value.length - 1]
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
    days.value.push({ ...newDayData, id: tempId })
    currentDayId.value = tempId

    // TODO
  }

  function reorderActivities(dayId: string, newOrder: IActivity[]): void {
    const day = days.value.find(d => d.id === dayId)
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
    reorderActivities,
    reset,
  }
})
