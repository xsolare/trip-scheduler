import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useAbortRequest, useRequest, useRequestStatus } from '~/plugins/request'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { TripImagePlacement } from '~/shared/types/models/trip'
import { getLocalDate } from '../lib/helpers'
import { useTripInfoStore } from './trip-info.store'

export interface IProcessingMemory {
  tempId: string
  file: File
  previewUrl: string
  status: 'uploading' | 'error' | 'success'
  error?: string
}

export enum ETripMemoriesKeys {
  FETCH = 'memories:fetch',
  CREATE = 'memories:create',
  UPDATE = 'memories:update',
  DELETE = 'memories:delete',
  UPLOAD = 'memories:upload',
  APPLY_TIMESTAMP = 'memories:apply-timestamp',
  REMOVE_TIMESTAMP = 'memories:remove-timestamp',
}

export interface ITripInfoMemoriesState {
  memories: Memory[]
  processingMemories: Map<string, IProcessingMemory>
  currentTripId: string | null
}

export const useTripInfoMemoriesStore = defineStore('tripInfoMemories', {
  state: (): ITripInfoMemoriesState => ({
    memories: [],
    processingMemories: new Map(),
    currentTripId: null,
  }),

  getters: {
    isLoadingMemories: () => useRequestStatus(ETripMemoriesKeys.FETCH).value,
    isCreateMemory: () => useRequestStatus(ETripMemoriesKeys.CREATE).value,

    /**
     * Геттер для получения списка загружаемых в данный момент воспоминаний.
     */
    getProcessingMemories(state): IProcessingMemory[] {
      return Array.from(state.processingMemories.values())
    },

    /**
     * Получает отсортированные воспоминания для выбранного дня.
     * В эту ленту попадают только те воспоминания, у которых `timestamp` соответствует дате выбранного дня.
     */
    memoriesForSelectedDay(state): Memory[] {
      const tripInfoStore = useTripInfoStore()
      const selectedDay = tripInfoStore.getSelectedDay
      if (!selectedDay)
        return []

      // Дата выбранного дня в формате YYYY-MM-DD (в UTC, чтобы избежать смещений)
      const selectedDateStr = new Date(selectedDay.date).toISOString().split('T')[0]

      return state.memories
        .filter((m) => {
          if (!m.timestamp)
            return false

          // `m.timestamp` это строка "2025-08-17T12:00:00.000Z"
          // Просто берем из нее дату
          const memoryDateStr = m.timestamp.split('T')[0]

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
      return state.memories.filter((m) => {
        if (!m.imageId)
          return false

        return !m.timestamp
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
        abortOnUnmount: true,
        fn: db => db.memories.getByTripId(tripId),
        onSuccess: (result) => {
          this.memories = result
        },
      })
    },

    /**
     * Новая экшен для загрузки файла, создания изображения и последующего создания воспоминания.
     * @param file - Файл для загрузки.
     */
    async uploadMemoryImage(file: File) {
      const tripInfoStore = useTripInfoStore()
      const tripId = tripInfoStore.currentTripId
      if (!tripId) {
        console.error('Trip ID не установлен для загрузки воспоминания.')
        return
      }

      const tempId = uuidv4()
      const previewUrl = URL.createObjectURL(file)
      const requestKey = `${ETripMemoriesKeys.UPLOAD}:${tempId}`

      // 1. Оптимистичное добавление в очередь на обработку
      this.processingMemories.set(tempId, {
        tempId,
        file,
        previewUrl,
        status: 'uploading',
      })

      await useRequest<Memory>({
        key: requestKey,
        fn: async (db) => {
          const newImage = await db.files.uploadFile(file, tripId, TripImagePlacement.MEMORIES)
          const selectedDay = tripInfoStore.getSelectedDay

          const getTimestamp = () => {
            if (!newImage.takenAt)
              return null

            const imageDate = (newImage.metadata?.timezoneOffset)
              ? getLocalDate(newImage.takenAt, newImage.metadata?.timezoneOffset)
              : new Date(newImage.takenAt)

            const imageDateStr = imageDate.toISOString().split('T')[0]

            if (!selectedDay)
              return null

            const selectedDayStr = new Date(selectedDay.date).toISOString().split('T')[0]

            if (imageDateStr === selectedDayStr)
              return imageDate.toISOString()

            return null
          }

          return await db.memories.create({
            tripId,
            imageId: newImage.id,
            timestamp: getTimestamp(),
          })
        },
        onSuccess: (newMemory) => {
          this.memories.push(newMemory)
          URL.revokeObjectURL(previewUrl)
          this.processingMemories.delete(tempId)
        },
        onError: (error) => {
          console.error(`Ошибка при загрузке воспоминания (tempId: ${tempId}):`, error)
          const processingItem = this.processingMemories.get(tempId)
          if (processingItem) {
            processingItem.status = 'error'
            processingItem.error = (error as Error).message || 'Неизвестная ошибка'
          }
        },
        onAbort: () => {
          URL.revokeObjectURL(previewUrl)
          this.processingMemories.delete(tempId)
        },
      })
    },

    /**
     * Отменяет загрузку конкретного воспоминания.
     * @param tempId - Временный ID загружаемого элемента.
     */
    cancelMemoryUpload(tempId: string) {
      const { abort } = useAbortRequest()
      const requestKey = `${ETripMemoriesKeys.UPLOAD}:${tempId}`
      abort(requestKey)
    },

    /**
     * Повторяет загрузку для элемента, который завершился с ошибкой.
     * @param tempId - Временный ID элемента.
     */
    retryMemoryUpload(tempId: string) {
      const processingItem = this.processingMemories.get(tempId)
      if (processingItem && processingItem.status === 'error') {
        // Удаляем старый элемент и запускаем загрузку заново
        this.processingMemories.delete(tempId)
        this.uploadMemoryImage(processingItem.file)
      }
    },

    /**
     * Удаляет элемент из очереди обработки.
     * @param tempId - Временный ID элемента.
     */
    removeProcessingMemory(tempId: string) {
      const item = this.processingMemories.get(tempId)
      if (item) {
        URL.revokeObjectURL(item.previewUrl)
        this.processingMemories.delete(tempId)
      }
    },

    /**
     * Создает новое воспоминание (для текстовых заметок).
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

      // Для этого действия нам не нужно лезть в другой стор,
      // так как `takenAt` приходит с сервера при создании.
      // Мы можем просто вызвать мутацию.

      await useRequest({
        key: `${ETripMemoriesKeys.APPLY_TIMESTAMP}:${memoryId}`,
        fn: () => trpc.memory.applyTakenAt.mutate({ id: memoryId }),
        onSuccess: (updatedMemory) => {
          if (updatedMemory)
            Object.assign(memory, updatedMemory)
        },
        onError: () => {
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
      // При сбросе также отменяем все текущие загрузки
      this.getProcessingMemories.forEach(p => this.cancelMemoryUpload(p.tempId))

      this.memories = []
      this.processingMemories.clear()
      this.currentTripId = null
    },
  },
})
