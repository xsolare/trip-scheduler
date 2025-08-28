import type { z } from 'zod'
import type { CreateTripInputSchema, ListTripsInputSchema, UpdateTripInputSchema } from './trip.schemas'
import { createTRPCError } from '~/lib/trpc'
import { tripRepository } from '~/repositories/trip.repository'

export const tripService = {
  async getAll(filters?: z.infer<typeof ListTripsInputSchema>, userId?: string) {
    return await tripRepository.getAll(filters, userId)
  },

  async getUniqueCities() {
    return await tripRepository.getUniqueCities()
  },

  async getUniqueTags(query?: string) {
    return await tripRepository.getUniqueTags(query)
  },

  async getById(id: string) {
    const trip = await tripRepository.getById(id)
    if (!trip) {
      throw createTRPCError('NOT_FOUND', `Путешествие с ID ${id} не найдено.`)
    }
    return trip
  },

  async getByIdWithDays(id: string) {
    const trip = await tripRepository.getByIdWithDays(id)
    if (!trip) {
      throw createTRPCError('NOT_FOUND', `Путешествие с ID ${id} не найдено.`)
    }
    return trip
  },

  async create(data: z.infer<typeof CreateTripInputSchema>, userId: string) {
    return await tripRepository.create(data, userId)
  },

  async update(id: string, details: z.infer<typeof UpdateTripInputSchema>['details']) {
    const updatedTrip = await tripRepository.update(id, details)
    if (!updatedTrip) {
      throw createTRPCError('NOT_FOUND', `Путешествие с ID ${id} не найдено.`)
    }
    return updatedTrip
  },

  async delete(id: string) {
    const deletedTrip = await tripRepository.delete(id)
    if (!deletedTrip) {
      throw createTRPCError('NOT_FOUND', `Путешествие с ID ${id} не найдено.`)
    }
    return deletedTrip
  },
}
