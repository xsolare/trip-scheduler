/* eslint-disable no-console */
import type { IMemoryRepository } from '../../model/types'
import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { v4 as uuidv4 } from 'uuid'
import { throttle } from '../../lib/decorators'

// Локальное хранилище для мок-данных
const mockMemories: Memory[] = []

export class MemoryRepository implements IMemoryRepository {
  @throttle(300)
  async getByTripId(tripId: string): Promise<Memory[]> {
    console.log(`[Mock] Fetching memories for trip: ${tripId}`)
    return Promise.resolve(mockMemories.filter(m => m.tripId === tripId))
  }

  @throttle(500)
  async create(data: CreateMemoryInput): Promise<Memory> {
    console.log('[Mock] Creating memory:', data)
    const newMemory: Memory = {
      ...data,
      id: uuidv4(),
      timestamp: data.timestamp || null,
      comment: data.comment || null,
      imageId: data.imageId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockMemories.push(newMemory)
    return Promise.resolve(newMemory)
  }

  @throttle(400)
  async update(data: UpdateMemoryInput): Promise<Memory> {
    console.log('[Mock] Updating memory:', data)
    const index = mockMemories.findIndex(m => m.id === data.id)
    if (index !== -1) {
      mockMemories[index] = { ...mockMemories[index], ...data, updatedAt: new Date().toISOString() }
      return Promise.resolve(mockMemories[index])
    }
    return Promise.reject(new Error('Memory not found'))
  }

  @throttle(600)
  async delete(id: string): Promise<Memory> {
    console.log(`[Mock] Deleting memory: ${id}`)
    const index = mockMemories.findIndex(m => m.id === id)
    if (index !== -1) {
      const deleted = mockMemories.splice(index, 1)
      return Promise.resolve(deleted[0])
    }
    return Promise.reject(new Error('Memory not found'))
  }
}
