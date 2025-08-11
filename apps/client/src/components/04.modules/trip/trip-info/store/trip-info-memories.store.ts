import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { defineStore } from 'pinia'
import { useRequest, useRequestStatus } from '~/plugins/request'
import { useTripInfoStore } from './trip-info.store'

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

    memoriesForSelectedDay(state): Memory[] {
      const tripInfoStore = useTripInfoStore()
      const selectedDay = tripInfoStore.getSelectedDay
      if (!selectedDay)
        return []

      const selectedDateStr = new Date(selectedDay.date).toISOString().split('T')[0]

      return state.memories
        .filter(m => m.timestamp && new Date(m.timestamp).toISOString().split('T')[0] === selectedDateStr)
        .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())
    },

    unsortedMemories: (state): Memory[] => {
      return state.memories.filter(m => m.imageId && !m.timestamp)
    },
  },

  actions: {
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
      Object.assign(memory, data)

      await useRequest({
        key: `${ETripMemoriesKeys.UPDATE}:${data.id}`,
        fn: db => db.memories.update(data),
        onError: () => {
          Object.assign(memory, originalMemory) 
        },
      }).execute()
    },

    async deleteMemory(id: string) {
      const index = this.memories.findIndex(m => m.id === id)
      if (index > -1) {
        const [removedMemory] = this.memories.splice(index, 1) 

        await useRequest({
          key: `${ETripMemoriesKeys.DELETE}:${id}`,
          fn: db => db.memories.delete(id),
          onError: () => {
            this.memories.splice(index, 0, removedMemory)
          },
        }).execute()
      }
    },

    reset() {
      this.memories = []
      this.currentTripId = null
    },
  },
})
