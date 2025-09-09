import type { z } from 'zod'
import type { CreateTripSectionInputSchema, ReorderTripSectionsInputSchema, UpdateTripSectionInputSchema } from './trip-section.schemas'
import { createTRPCError } from '~/lib/trpc'
import { tripSectionRepository } from '~/repositories/trip-section.repository'

export const tripSectionService = {
  async create(data: z.infer<typeof CreateTripSectionInputSchema>) {
    return await tripSectionRepository.create(data)
  },

  async update(data: z.infer<typeof UpdateTripSectionInputSchema>) {
    const { id, ...updateData } = data
    const updatedSection = await tripSectionRepository.update(id, updateData)
    if (!updatedSection) {
      throw createTRPCError('NOT_FOUND', `Раздел с ID ${id} не найден.`)
    }
    return updatedSection
  },

  async delete(id: string) {
    const deletedSection = await tripSectionRepository.delete(id)
    if (!deletedSection) {
      throw createTRPCError('NOT_FOUND', `Раздел с ID ${id} не найден.`)
    }
    return deletedSection
  },

  async reorder(data: z.infer<typeof ReorderTripSectionsInputSchema>) {
    await tripSectionRepository.reorder(data.tripId, data.updates)
    return { success: true }
  },
}
