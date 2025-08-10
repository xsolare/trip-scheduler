import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { defineStore } from 'pinia'
import { useRequest, useRequestStatus } from '~/plugins/request'

export enum ETripMemoriesKeys {
  FETCH = 'memories:fetch',
  CREATE = 'memories:create',
  UPDATE = 'memories:update',
  DELETE = 'memories:delete',
}

export const useTripInfoMemoriesStore = defineStore('tripInfoMemories', {
  state: () => ({
    memories: [] as Memory[],
    currentTripId: null as string | null,
  }),

  getters: {
    isLoading: () => useRequestStatus(ETripMemoriesKeys.FETCH).value,

    // Воспоминания с временной меткой для таймлайна
    timelineMemories(state): Record<string, Memory[]> {
      const grouped: Record<string, Memory[]> = {}
      const sorted = state.memories
        .filter(m => m.timestamp)
        .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())

      for (const memory of sorted) {
        const date = new Date(memory.timestamp!).toISOString().split('T')[0]
        if (!grouped[date])
          grouped[date] = []

        grouped[date].push(memory)
      }
      return grouped
    },

    // Воспоминания без временной метки
    unsortedMemories: (state): Memory[] => {
      return state.memories.filter(m => !m.timestamp && m.imageId)
    },
  },

  actions: {
    fetchMemories(tripId: string) {
      if (this.currentTripId === tripId)
        return

      this.currentTripId = tripId

      useRequest<Memory[]>({
        key: `${ETripMemoriesKeys.FETCH}:${tripId}`,
        fn: db => db.memories.getByTripId(tripId),
        onSuccess: (result) => {
          this.memories = result
        },
      }).execute()
    },

    async createMemory(data: CreateMemoryInput) {
      await useRequest({
        key: ETripMemoriesKeys.CREATE,
        fn: db => db.memories.create(data),
        onSuccess: (newMemory) => {
          this.memories.push(newMemory)
        },
      }).execute()
    },

    async updateMemory(data: UpdateMemoryInput) {
      const memory = this.memories.find(m => m.id === data.id)
      if (!memory)
        return

      const originalMemory = { ...memory }
      Object.assign(memory, data) // Optimistic update

      await useRequest({
        key: `${ETripMemoriesKeys.UPDATE}:${data.id}`,
        fn: db => db.memories.update(data),
        onError: () => {
          Object.assign(memory, originalMemory) // Revert on error
        },
      }).execute()
    },

    async deleteMemory(id: string) {
      const index = this.memories.findIndex(m => m.id === id)
      if (index > -1)
        this.memories.splice(index, 1) // Optimistic delete

      await useRequest({
        key: `${ETripMemoriesKeys.DELETE}:${id}`,
        fn: db => db.memories.delete(id),
      }).execute()
    },

    reset() {
      this.memories = []
      this.currentTripId = null
    },
  },
})
