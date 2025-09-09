import type { IMemoryRepository } from '../../model/types'
import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { v4 as uuidv4 } from 'uuid'

// Simple in-memory store
const memories: Memory[] = []

export class MemoryRepository implements IMemoryRepository {
  async getByTripId(tripId: string): Promise<Memory[]> {
    return memories.filter(m => m.tripId === tripId)
  }

  async create(data: CreateMemoryInput): Promise<Memory> {
    const newMemory: Memory = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: null, // Mocks don't need complex relations for this fix
    }
    memories.push(newMemory)
    return newMemory
  }

  async update(data: UpdateMemoryInput): Promise<Memory> {
    const memory = memories.find(m => m.id === data.id)
    if (!memory)
      throw new Error('Memory not found')
    Object.assign(memory, data, { updatedAt: new Date().toISOString() })
    return memory
  }

  async delete(id: string): Promise<Memory> {
    const index = memories.findIndex(m => m.id === id)
    if (index === -1)
      throw new Error('Memory not found')
    return memories.splice(index, 1)[0]
  }

  async applyTakenAtTimestamp(id: string): Promise<Memory> {
    const memory = memories.find(m => m.id === id)
    if (!memory)
      throw new Error('Memory not found')
    // In a mock, we can't easily access the related image's takenAt.
    // So we'll just set it to the current time as a placeholder.
    memory.timestamp = new Date().toISOString()
    memory.updatedAt = new Date().toISOString()
    return memory
  }

  async unassignTimestamp(id: string): Promise<Memory> {
    const memory = memories.find(m => m.id === id)
    if (!memory)
      throw new Error('Memory not found')
    memory.timestamp = null
    memory.updatedAt = new Date().toISOString()
    return memory
  }
}
