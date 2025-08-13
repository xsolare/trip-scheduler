import type { z } from 'zod'
import type { CreateMemoryInputSchema, UpdateMemoryInputSchema } from './memory.schemas'
import { createTRPCError } from '~/lib/trpc'
import { memoryRepository } from '~/repositories/memory.repository'

export const memoryService = {
  async create(data: z.infer<typeof CreateMemoryInputSchema>) {
    return await memoryRepository.create(data)
  },

  async update(data: z.infer<typeof UpdateMemoryInputSchema>) {
    const updatedMemory = await memoryRepository.update(data)
    if (!updatedMemory) {
      throw createTRPCError('NOT_FOUND', `Воспоминание с ID ${data.id} не найдено.`)
    }
    return updatedMemory
  },

  async delete(id: string) {
    const deletedMemory = await memoryRepository.delete(id)
    if (!deletedMemory) {
      throw createTRPCError('NOT_FOUND', `Воспоминание с ID ${id} не найдено.`)
    }
    return deletedMemory
  },

  async getByTripId(tripId: string) {
    return await memoryRepository.getByTripId(tripId)
  },

}
