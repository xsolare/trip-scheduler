import { z } from 'zod'
import { CreateTripSchema, TripSchema, UpdateTripSchema } from '~/lib/schemas'
import { createTRPCError, t } from '~/lib/trpc'
import { tripRepository } from '~/repositories/trip.repository'

export const tripProcedures = {
  list: t.procedure
    .input(z.void())
    .output(z.array(TripSchema))
    .query(async () => {
      return tripRepository.getAll()
    }),

  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .output(TripSchema.nullable())
    .query(async ({ input }) => {
      return tripRepository.getById(input.id)
    }),

  create: t.procedure
    .input(CreateTripSchema)
    .output(TripSchema)
    .mutation(async ({ input }) => {
      const newTrip = await tripRepository.create(input)

      return newTrip
    }),

  update: t.procedure
    .input(UpdateTripSchema)
    .output(TripSchema)
    .mutation(async ({ input }) => {
      const { id, ...updates } = input
      const updatedTrip = await tripRepository.update(id, updates)
      if (!updatedTrip)
        createTRPCError('NOT_FOUND', 'Trip not found to update')

      return updatedTrip
    }),

  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await tripRepository.delete(input.id)
      return { success: true }
    }),
}
