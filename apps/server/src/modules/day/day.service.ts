import type { z } from 'zod'
import type { CreateDayInputSchema, UpdateDayInputSchema } from './day.schemas'
import { createTRPCError } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

export const dayService = {
  async getByTripId(id: string) {
    const day = await dayRepository.getByTripId(id)
    if (!day) {
      throw createTRPCError('NOT_FOUND', `День с ID ${id} не найден.`)
    }
    return day
  },

  async create(data: z.infer<typeof CreateDayInputSchema>) {
    return await dayRepository.create(data)
  },

  async update(id: string, details: z.infer<typeof UpdateDayInputSchema>['details']) {
    const updatedDay = await dayRepository.update(id, details)
    if (!updatedDay) {
      throw createTRPCError('NOT_FOUND', `День с ID ${id} не найден.`)
    }
    return updatedDay
  },

  async delete(id: string) {
    const deletedDay = await dayRepository.delete(id)
    if (!deletedDay) {
      throw createTRPCError('NOT_FOUND', `День с ID ${id} не найден.`)
    }
    return deletedDay
  },
}
