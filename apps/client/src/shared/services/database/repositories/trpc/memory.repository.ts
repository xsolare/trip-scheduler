import type { IMemoryRepository } from '../../model/types'
import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { trpc } from '~/shared/services/trpc/trpc.service'

export class MemoryRepository implements IMemoryRepository {
  async getByTripId(tripId: string): Promise<Memory[]> {
    const result = await trpc.memory.listByTrip.query({ tripId })
    return result as Memory[]
  }

  async create(data: CreateMemoryInput): Promise<Memory> {
    const result = await trpc.memory.create.mutate(data)
    return result as Memory
  }

  async update(data: UpdateMemoryInput): Promise<Memory> {
    const result = await trpc.memory.update.mutate(data)
    return result as Memory
  }

  async delete(id: string): Promise<Memory> {
    const result = await trpc.memory.delete.mutate({ id })
    return result as Memory
  }
}
