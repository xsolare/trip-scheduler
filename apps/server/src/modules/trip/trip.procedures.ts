import { z } from 'zod'
import { CreateTripInputSchema, GetTripsByIdInputSchema, TripSchema, UpdateTripInputSchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { tripRepository } from '~/repositories/trip.repository'

export const tripProcedures = {
  /**
   * Получение списка всех путешествий.
   */
  list: t.procedure
    .input(z.void())
    .output(z.array(TripSchema))
    .query(async () => {
      const trips = await tripRepository.getAll()
      return trips.map(trip => ({
        ...trip,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        cities: trip.cities as string[],
        participants: trip.participants as string[],
        tags: trip.tags as string[],
      }))
    }),

  /**
   * Получение одного путешествия по ID.
   */
  getById: t.procedure
    .input(GetTripsByIdInputSchema)
    .output(TripSchema.nullable())
    .query(async ({ input }) => {
      const trip = await tripRepository.getById(input.tripId)
      if (!trip)
        return null

      return {
        ...trip,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        cities: trip.cities as string[],
        participants: trip.participants as string[],
        tags: trip.tags as string[],
      }
    }),

  /**
   * Получение путешествия со всеми днями и активностями.
   */
  getByIdWithDays: t.procedure
    .input(GetTripsByIdInputSchema)
    .query(async ({ input }) => {
      const trip = await tripRepository.getByIdWithDays(input.tripId)
      if (!trip)
        return null

      return {
        ...trip,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        cities: trip.cities as string[],
        participants: trip.participants as string[],
        tags: trip.tags as string[],
        days: trip.days.map(day => ({
          ...day,
        })),
      }
    }),

  /**
   * Обновление данных путешествия.
   */
  update: t.procedure
    .input(UpdateTripInputSchema)
    .mutation(async ({ input }) => {
      return await tripRepository.update(input.id, input.details)
    }),

  create: t.procedure
    .input(CreateTripInputSchema)
    .mutation(async ({ input }) => {
      return await tripRepository.create(input)
    }),

  delete: t.procedure
    .input(z.string())
    .mutation(async ({ input: tripId }) => {
      return await tripRepository.delete(tripId)
    }),
}
