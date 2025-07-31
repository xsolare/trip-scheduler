import type { IActivity, IDay } from '../models/types'
import { timeToMinutes } from '../lib/helpers'

function useTrip() {
  // --- State ---
  const days = ref<IDay[]>([])
  const currentTripId = ref<string | null>(null)
  const currentDayId = ref<string | null>(null)

  const {
    status: fetchStatus,
    error: fetchError,
    execute: fetchDays,
  } = useDatabase({
    immediate: false,
    fn: (db) => {
      if (!currentTripId.value) {
        return Promise.resolve([])
      }
      return db.days.getByTripId(currentTripId.value)
    },
    onSuccess: (result) => {
      const sortedDays = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      days.value = sortedDays
      if (sortedDays.length > 0)
        currentDayId.value = sortedDays[0].id
      else
        currentDayId.value = null
    },
    onError: () => {
      days.value = []
      currentDayId.value = null
    },
  })

  // --- Getters ---
  const getAllDays = computed((): IDay[] => days.value)

  const getSelectedDay = computed((): IDay | null => {
    return days.value.find(day => day.id === currentDayId.value) ?? null
  })

  const getActivitiesForSelectedDay = computed((): IActivity[] => {
    return getSelectedDay.value?.activities
      .slice()
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)) ?? []
  })

  const isLoading = computed(() => fetchStatus.value === 'pending')

  // --- Actions ---

  /**
   * Основной метод для инициализации стора. Загружает дни для указанной поездки.
   * @param tripId - ID путешествия.
   */
  async function fetchDaysForTrip(tripId: string) {
    currentTripId.value = tripId
    await fetchDays()
  }

  function setCurrentDay(dayId: string): void {
    currentDayId.value = dayId
  }

  /**
   * Обновляет детали дня с оптимистичным UI и сохранением в БД.
   */
  async function updateDayDetails(dayId: string, details: { title?: string, description?: string }) {
    const dayIndex = days.value.findIndex(d => d.id === dayId)
    if (dayIndex === -1)
      return

    const originalDay = { ...days.value[dayIndex] }
    days.value[dayIndex] = { ...originalDay, ...details }

    // TODO
    // await useDatabase({
    //   immediate: true,
    //   key: `update-day-${dayId}`,
    //   fn: db => db.days.update(dayId, details),
    //   onSuccess: () => { },
    //   onError: (error) => {
    //     days.value[dayIndex] = originalDay
    //     console.error('Не удалось обновить день. Изменения отменены.', error)
    //   },
    // })
  }

  /**
   * Добавляет новую активность.
   */
  async function addActivity(dayId: string, activity: IActivity) {
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

    // TODO
    // await useDatabase({
    //   key: `add-activity-${activity.id}`,
    //   fn: db => db.activities.create(dayId, activity),
    //   onError: (error) => {
    //     day.activities.pop()
    //     console.error('Не удалось добавить активность.', error)
    //   },
    // })
  }

  /**
   * Удаляет активность.
   */
  async function removeActivity(dayId: string, activityId: string) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const index = day.activities.findIndex(a => a.id === activityId)
    if (index === -1)
      // eslint-disable-next-line no-useless-return
      return

    // const removedActivity = day.activities.splice(index, 1)[0]

    // await useDatabase({
    //   key: `remove-activity-${activityId}`,
    //   fn: (db) => db.activities.delete(activityId),
    //   onError: (error) => {
    //     // 3. Откат
    //     day.activities.splice(index, 0, removedActivity)
    //     console.error('Не удалось удалить активность.', error)
    //   },
    // })
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
    currentTripId,
    fetchStatus,
    fetchError,
    // Getters
    getAllDays,
    getSelectedDay,
    getActivitiesForSelectedDay,
    isLoading,
    // Actions
    fetchDaysForTrip,
    setCurrentDay,
    updateDayDetails,
    addActivity,
    removeActivity,
    updateActivity,
    reorderActivities,
  }
}

export { useTrip }
