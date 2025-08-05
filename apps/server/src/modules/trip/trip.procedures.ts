import { z } from 'zod'
import { GetTripsByIdInputSchema, TripSchema, TripWithDaysSchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { tripRepository } from '~/repositories/trip.repository'

export const tripProcedures = {
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

  getByIdWithDays: t.procedure
    .input(GetTripsByIdInputSchema)
    .output(TripWithDaysSchema.nullable())
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
          date: new Date(day.date),
        })),
      }
    }),
}
