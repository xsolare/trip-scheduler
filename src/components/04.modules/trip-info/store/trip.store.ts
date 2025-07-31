import type { IActivity, IDay } from '../models/types'
import { timeToMinutes } from '../lib/helpers'
import { MOCK_DAYS } from '../mock'

export const useTripStore = defineStore('trip', () => {
  // --- State ---
  const sortedDays = MOCK_DAYS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const days = ref<IDay[]>(sortedDays)
  const currentDayId = ref<string | null>(sortedDays.length > 0 ? sortedDays[0].id : null)

  // --- Getters ---
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

  // --- Actions ---
  function setCurrentDay(dayId: string): void {
    currentDayId.value = dayId
  }

  function updateDayDetails(dayId: string, details: { title?: string, description?: string }) {
    const dayIndex = days.value.findIndex(d => d.id === dayId)
    if (dayIndex !== -1)
      days.value[dayIndex] = { ...days.value[dayIndex], ...details }
  }

  function addActivity(dayId: string, activity: IActivity): void {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const newStart = timeToMinutes(activity.startTime)
    const newEnd = timeToMinutes(activity.endTime)

    const hasOverlap = day.activities.some((existing) => {
      const existingStart = timeToMinutes(existing.startTime)
      const existingEnd = timeToMinutes(existing.endTime)
      return newStart < existingEnd && newEnd > existingStart
    })

    if (hasOverlap) {
      console.error('Активность пересекается с существующей по времени')
      return
    }

    day.activities.push(activity)
  }

  function removeActivity(dayId: string, activityId: string): void {
    const day = days.value.find(d => d.id === dayId)
    if (day) {
      const index = day.activities.findIndex(a => a.id === activityId)
      if (index !== -1)
        day.activities.splice(index, 1)
    }
  }

  function updateActivity(dayId: string, updatedActivity: IActivity): void {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const activityIndex = day.activities.findIndex(a => a.id === updatedActivity.id)
    if (activityIndex === -1)
      return

    const newStart = timeToMinutes(updatedActivity.startTime)
    const newEnd = timeToMinutes(updatedActivity.endTime)

    const hasOverlap = day.activities
      .filter(act => act.id !== updatedActivity.id)
      .some((existing) => {
        const existingStart = timeToMinutes(existing.startTime)
        const existingEnd = timeToMinutes(existing.endTime)
        return newStart < existingEnd && newEnd > existingStart
      })

    if (hasOverlap) {
      console.error('Ошибка: Активность пересекается с существующей по времени. Изменения не сохранены.')
      return
    }

    day.activities[activityIndex] = updatedActivity
  }

  function reorderActivities(dayId: string, newOrder: IActivity[]): void {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    day.activities = newOrder
  }

  return {
    // State
    days,
    currentDayId,
    // Getters
    getAllDays,
    getSelectedDay,
    getActivitiesForSelectedDay,
    // Actions
    setCurrentDay,
    updateDayDetails,
    addActivity,
    removeActivity,
    updateActivity,
    reorderActivities,
  }
})
