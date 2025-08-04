import type { IActivity, IDay } from '../models/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDatabase } from '~/shared/composables/use-database'
import { timeToMinutes } from '../lib/helpers'

/**
 * Стор для управления состоянием информации о конкретном путешествии,
 * включая его дни и активности.
 */
export const useTripStore = defineStore('tripInfo', () => {
  // --- STATE ---

  const days = ref<IDay[]>([])
  const currentTripId = ref<string | null>(null)
  const currentDayId = ref<string | null>(null)
  const fetchStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
  const fetchError = ref<unknown | null>(null)

  // UI State
  const isDaysPanelOpen = ref<boolean>(false)
  const isDaysPanelPinned = ref<boolean>(false)
  const interactionMode = ref<'view' | 'edit'>('edit')

  // --- GETTERS ---

  const isLoading = computed(() => fetchStatus.value === 'pending')
  const isViewMode = computed(() => interactionMode.value === 'view')
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

  // --- PRIVATE HELPERS ---

  function findDayAndIndex(dayId: string) {
    const dayIndex = days.value.findIndex(d => d.id === dayId)
    if (dayIndex === -1) {
      console.warn(`День с ID "${dayId}" не найден.`)
      return null
    }
    return { day: days.value[dayIndex], index: dayIndex }
  }

  // --- ACTIONS ---

  /**
   * Открывает панель дней.
   */
  function openDaysPanel() {
    isDaysPanelOpen.value = true
  }

  /**
   * Закрывает панель дней.
   */
  function closeDaysPanel() {
    isDaysPanelOpen.value = false
  }

  /**
   * Переключает состояние закрепления панели.
   */
  function toggleDaysPanelPinned() {
    isDaysPanelPinned.value = !isDaysPanelPinned.value
  }

  /**
   * Устанавливает режим взаимодействия.
   */
  function setInteractionMode(mode: 'view' | 'edit') {
    interactionMode.value = mode
  }

  /**
   * Загружает дни для указанного путешествия.
   */
  async function fetchDaysForTrip(tripId: string) {
    currentTripId.value = tripId
    fetchStatus.value = 'pending'
    fetchError.value = null

    await useDatabase({
      immediate: true,
      fn: db => db.days.getByTripId(tripId),
      onSuccess: (result) => {
        const sortedDays = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        days.value = sortedDays
        currentDayId.value = sortedDays.length > 0 ? sortedDays[0].id : null
        fetchStatus.value = 'success'
      },
      onError: (error) => {
        days.value = []
        currentDayId.value = null
        fetchError.value = error
        fetchStatus.value = 'error'
        console.error(`Ошибка при загрузке дней для путешествия ${tripId}:`, error)
      },
    })
  }

  /**
   * Устанавливает текущий выбранный день.
   */
  function setCurrentDay(dayId: string): void {
    currentDayId.value = dayId
  }

  /**
   * Обновляет детали дня с оптимистичным UI и откатом при ошибке.
   */
  async function updateDayDetails(dayId: string, details: { title?: string, description?: string, date?: string }) {
    const result = findDayAndIndex(dayId)
    if (!result)
      return

    const { index } = result
    const originalDay = { ...days.value[index] }

    // 1. Оптимистичное обновление
    days.value[index] = { ...originalDay, ...details }

    // Если была изменена дата, пересортируем массив дней
    if (details.date)
      days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // 2. Асинхронная операция с обработчиками
    // await useDatabase({
    //   immediate: true,
    //   key: `update-day-${dayId}`,
    //   fn: db => db.days.update(dayId, details), // Предполагаем, что метод .update существует
    //   onSuccess: () => {
    //     // console.log('День успешно обновлен.');
    //   },
    //   onError: (error) => {
    //     // 3. Откат изменений при ошибке
    //     days.value[index] = originalDay
    //     // Если была изменена дата, нужно снова отсортировать
    //     if (details.date) {
    //        days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    //     }
    //     console.error('Не удалось обновить день. Изменения отменены.', error)
    //     // Рекомендуется показать пользователю уведомление об ошибке
    //   },
    // })
  }

  /**
   * Добавляет новую активность в день.
   */
  async function addActivity(dayId: string, activity: Omit<IActivity, 'id'>) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const tempId = `temp-activity-${Date.now()}`
    const newActivity: IActivity = { ...activity, id: tempId }

    // Оптимистичное добавление
    day.activities.push(newActivity)

    // await useDatabase({
    //   immediate: true,
    //   key: `add-activity-${activity.id}`,
    //   fn: db => db.activities.create(dayId, activity), // Предполагаем, что метод .create существует
    //   onError: (error) => {
    //     day.activities.pop() // Откат
    //     console.error('Не удалось добавить активность.', error)
    //     // Показать уведомление пользователю
    //   },
    // })
  }

  /**
   * Удаляет активность из дня.
   */
  async function removeActivity(dayId: string, activityId: string) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const index = day.activities.findIndex(a => a.id === activityId)
    if (index === -1)
      return null

    // const removedActivity = day.activities.splice(index, 1)[0] // Оптимистичное удаление

    // await useDatabase({
    //   immediate: true,
    //   key: `remove-activity-${activityId}`,
    //   fn: db => db.activities.delete(activityId), // Предполагаем, что метод .delete существует
    //   onError: (error) => {
    //     day.activities.splice(index, 0, removedActivity) // Откат
    //     console.error('Не удалось удалить активность.', error)
    //     // Показать уведомление пользователю
    //   },
    // })
  }

  /**
   * Обновляет данные существующей активности.
   */
  async function updateActivity(dayId: string, updatedActivity: IActivity) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const activityIndex = day.activities.findIndex(a => a.id === updatedActivity.id)
    if (activityIndex === -1)
      return

    // ... (логика проверки на пересечение) ...

    // Оптимистичное обновление
    day.activities[activityIndex] = updatedActivity

    // const originalActivity = day.activities[activityIndex]

    // await useDatabase({
    //   immediate: true,
    //   key: `update-activity-${updatedActivity.id}`,
    //   fn: db => db.activities.update(updatedActivity.id, updatedActivity),
    //   onError: (error) => {
    //     day.activities[activityIndex] = originalActivity // Откат
    //     console.error('Не удалось обновить активность.', error)
    //   },
    // })
  }

  /**
   * Добавляет новый день в путешествие.
   */
  async function addNewDay() {
    if (!currentTripId.value)
      return
    const lastDay = days.value[days.value.length - 1]
    const newDate = lastDay ? new Date(lastDay.date) : new Date()
    if (lastDay)
      newDate.setDate(newDate.getDate() + 1)

    const newDay: Omit<IDay, 'id'> = {
      tripId: currentTripId.value,
      title: `День ${days.value.length + 1}`,
      description: '',
      date: newDate.toISOString(),
      activities: [],
    }

    // Временный ID для оптимистичного UI
    const tempId = `temp-day-${Date.now()}`
    const dayWithTempId: IDay = { ...newDay, id: tempId }
    days.value.push(dayWithTempId)
    currentDayId.value = tempId

    // await useDatabase({
    //   immediate: true,
    //   key: `add-day-${tempId}`,
    //   fn: db => db.days.create(newDay),
    //   onSuccess: (createdDay) => {
    //     // Заменяем временный день на настоящий из БД
    //     const dayIndex = days.value.findIndex(d => d.id === tempId)
    //     if (dayIndex !== -1) {
    //       days.value[dayIndex] = createdDay
    //       currentDayId.value = createdDay.id
    //     }
    //   },
    //   onError: (error) => {
    //     // Откат
    //     days.value = days.value.filter(d => d.id !== tempId)
    //     console.error('Не удалось создать день.', error)
    //   },
    // })
  }

  /**
   * Изменяет порядок активностей в дне.
   */
  function reorderActivities(dayId: string, newOrder: IActivity[]): void {
    const result = findDayAndIndex(dayId)
    if (!result)
      return

    result.day.activities = newOrder
    // При необходимости можно добавить сохранение порядка на бэкенд
  }

  return {
    // State
    days,
    currentTripId,
    currentDayId,
    fetchStatus,
    fetchError,
    isDaysPanelOpen,
    isDaysPanelPinned,
    interactionMode,

    // Getters
    isLoading,
    getAllDays,
    getSelectedDay,
    getActivitiesForSelectedDay,
    isViewMode,

    // Actions
    openDaysPanel,
    closeDaysPanel,
    toggleDaysPanelPinned,
    addNewDay,
    fetchDaysForTrip,
    setCurrentDay,
    updateDayDetails,
    addActivity,
    removeActivity,
    updateActivity,
    reorderActivities,
    setInteractionMode,
  }
})
