// apps/client/src/components/04.modules/trip/trip-info/store/trip-info-memories.store.ts

import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { defineStore } from 'pinia'
import { useRequest, useRequestStatus } from '~/plugins/request'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { useTripInfoGalleryStore } from './trip-info-gallery.store'
import { useTripInfoStore } from './trip-info.store'

/**
 * Ключи запросов, используемые в сторе воспоминаний.
 */
export enum ETripMemoriesKeys {
  FETCH = 'memories:fetch',
  CREATE = 'memories:create',
  UPDATE = 'memories:update',
  DELETE = 'memories:delete',
  APPLY_TIMESTAMP = 'memories:apply-timestamp',
  REMOVE_TIMESTAMP = 'memories:remove-timestamp',
}

export const useTripInfoMemoriesStore = defineStore('tripInfoMemories', {
  state: () => ({
    memories: [] as Memory[],
    currentTripId: null as string | null,
  }),

  getters: {
    /**
     * Статус загрузки списка воспоминаний.
     */
    isLoading: () => useRequestStatus(ETripMemoriesKeys.FETCH).value,

    /**
     * Получает отсортированные воспоминания для выбранного дня.
     * В эту ленту попадают только те воспоминания, у которых `timestamp` соответствует дате выбранного дня.
     */
    memoriesForSelectedDay(state): Memory[] {
      const tripInfoStore = useTripInfoStore()
      const selectedDay = tripInfoStore.getSelectedDay
      if (!selectedDay)
        return []

      const selectedDateStr = new Date(selectedDay.date).toISOString().split('T')[0]

      return state.memories
        .filter((m) => {
          if (!m.timestamp)
            return false // Исключаем воспоминания без даты
          const memoryDateStr = new Date(m.timestamp).toISOString().split('T')[0]
          return memoryDateStr === selectedDateStr
        })
        .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())
    },

    /**
     * Геттер для получения воспоминаний, требующих обработки (раздел "Фотографии для сортировки").
     * Сюда попадают фотографии:
     * 1. Без временной метки (`timestamp` is null).
     * 2. С временной меткой, дата которой НЕ совпадает с выбранным днем.
     */
    memoriesToProcess(state): Memory[] {
      const tripInfoStore = useTripInfoStore()
      const selectedDay = tripInfoStore.getSelectedDay
      if (!selectedDay)
        return []

      const selectedDateStr = new Date(selectedDay.date).toISOString().split('T')[0]

      return state.memories.filter((m) => {
        // В обработку попадают только фотографии.
        if (!m.imageId)
          return false

        // Сценарий 1: Фотография без какой-либо временной метки.
        if (!m.timestamp)
          return true

        // Сценарий 2: Фотография с временной меткой, но из другого дня.
        const memoryDateStr = new Date(m.timestamp).toISOString().split('T')[0]
        return memoryDateStr !== selectedDateStr
      })
    },
  },

  actions: {
    /**
     * Загружает воспоминания для указанного путешествия.
     * @param tripId - ID путешествия.
     */
    fetchMemories(tripId: string) {
      if (this.currentTripId === tripId && this.memories.length > 0)
        return

      this.currentTripId = tripId

      useRequest<Memory[]>({
        key: `${ETripMemoriesKeys.FETCH}:${tripId}`,
        fn: db => db.memories.getByTripId(tripId),
        onSuccess: (result) => {
          this.memories = result
        },
      })
    },

    /**
     * Создает новое воспоминание.
     * @param data - Данные для создания.
     */
    async createMemory(data: CreateMemoryInput) {
      await useRequest({
        key: ETripMemoriesKeys.CREATE,
        fn: db => db.memories.create(data),
        onSuccess: (newMemory) => {
          this.memories.push(newMemory)
        },
      })
    },

    /**
     * Обновляет существующее воспоминание.
     * @param data - Данные для обновления, включая ID.
     */
    async updateMemory(data: UpdateMemoryInput) {
      const memory = this.memories.find(m => m.id === data.id)
      if (!memory)
        return

      const originalMemory = { ...memory }
      // Оптимистичное обновление
      Object.assign(memory, data)

      await useRequest({
        key: `${ETripMemoriesKeys.UPDATE}:${data.id}`,
        fn: db => db.memories.update(data),
        onError: () => {
          // Откат в случае ошибки
          Object.assign(memory, originalMemory)
        },
      })
    },

    /**
     * Удаляет воспоминание по ID.
     * @param id - ID воспоминания для удаления.
     */
    async deleteMemory(id: string) {
      const index = this.memories.findIndex(m => m.id === id)
      if (index > -1) {
        const [removedMemory] = this.memories.splice(index, 1)

        await useRequest({
          key: `${ETripMemoriesKeys.DELETE}:${id}`,
          fn: db => db.memories.delete(id),
          onError: () => {
            // Откат в случае ошибки
            this.memories.splice(index, 0, removedMemory)
          },
        })
      }
    },

    /**
     * Применяет к воспоминанию временную метку, взятую из EXIF-данных (`takenAt`)
     * связанного с ним изображения. Используется для кнопки "Принять дату".
     * @param memoryId - ID воспоминания.
     */
    async applyOriginalTimestamp(memoryId: string) {
      const memory = this.memories.find(m => m.id === memoryId)
      if (!memory || !memory.imageId)
        return

      const originalMemory = { ...memory }

      // Для оптимистичного обновления находим `takenAt` в галерее
      const galleryStore = useTripInfoGalleryStore()
      const image = galleryStore.tripImages.find(img => img.id === memory.imageId)
      if (image && image.takenAt) {
        memory.timestamp = image.takenAt
      }

      await useRequest({
        key: `${ETripMemoriesKeys.APPLY_TIMESTAMP}:${memoryId}`,
        fn: () => trpc.memory.applyTakenAt.mutate({ id: memoryId }),
        onSuccess: (updatedMemory) => {
          // Финальное обновление данными с сервера
          if (updatedMemory)
            Object.assign(memory, updatedMemory)
        },
        onError: () => {
          // Откат в случае ошибки
          Object.assign(memory, originalMemory)
        },
      })
    },

    /**
     * Отвязывает воспоминание от даты, устанавливая `timestamp` в `null`.
     * Используется для кнопки "Убрать дату", чтобы фото снова стало "неотсортированным".
     * @param memoryId - ID воспоминания.
     */
    async removeTimestamp(memoryId: string) {
      const memory = this.memories.find(m => m.id === memoryId)
      if (!memory)
        return

      const originalTimestamp = memory.timestamp
      memory.timestamp = null // Оптимистичное обновление

      await useRequest({
        key: `${ETripMemoriesKeys.REMOVE_TIMESTAMP}:${memoryId}`,
        fn: () => trpc.memory.unassignDate.mutate({ id: memoryId }),
        onError: () => {
          // Откат в случае ошибки
          memory.timestamp = originalTimestamp
        },
      })
    },

    /**
     * Сбрасывает состояние стора.
     */
    reset() {
      this.memories = []
      this.currentTripId = null
    },
  },
})
