/* eslint-disable unused-imports/no-unused-vars */
import type { Memory } from '~/shared/types/models/memory'
import { defineStore } from 'pinia'

export enum ETripMemoriesKeys {
  FETCH = 'memories:fetch',
  CREATE = 'memories:create',
  DELETE = 'memories:delete',
}

interface TripInfoMemoriesState {
  memories: Memory[]
  currentDayId: string | null
  isLoading: boolean
}

export const useTripInfoMemoriesStore = defineStore('tripInfoMemories', {
  state: (): TripInfoMemoriesState => ({
    memories: [],
    currentDayId: null,
    isLoading: false,
  }),

  // GETTERS: Вычисляемые свойства на основе состояния.
  getters: {
    sortedMemories: (state): Memory[] => {
      // TODO
    },
  },

  // ACTIONS: Методы для изменения состояния.
  actions: {
    fetchMemories(dayId: string) {
      if (this.currentDayId === dayId && this.memories.length > 0)
        return

      this.currentDayId = dayId
      this.isLoading = true // Устанавливаем флаг загрузки

      // useRequest<Memory[]>({
      //   key: `${ETripMemoriesKeys.FETCH}:${dayId}`,
      //   fn: db => db.memories.getByDayId(dayId),
      //   onSuccess: (result) => {
      //     this.memories = result
      //   },
      //   onError: () => {
      //     this.memories = [] // Очищаем в случае ошибки
      //   },
      // }).execute().finally(() => {
      //   this.isLoading = false // Снимаем флаг загрузки в любом случае
      // })
    },

    async addComment(dayId: string, text: string) {
      // TODO: Реализовать логику добавления комментария,
      // включая оптимистичное обновление и вызов useRequest.
      // this.memories.push(optimisticComment);
      // useRequest(...).execute()
    },

    async addPhoto(dayId: string, tripImageId: string, url: string) {
      // TODO: Логика добавления фото
    },

    async deleteMemory(memoryId: string) {
      // TODO: Логика удаления, включая оптимистичное удаление из this.memories
    },

    reset() {
      this.memories = []
      this.currentDayId = null
      this.isLoading = false
    },
  },
})
