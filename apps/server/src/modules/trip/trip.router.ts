import { z } from 'zod'
import {
  CreateTripSchema,
  IdParamSchema,
  SuccessResponseSchema,
  TripSchema,
  UpdateTripSchema,
} from '~/lib/schemas'
import { createTRPCError, publicProcedure, router } from '~/lib/trpc'
import { tripRepository } from '~/repositories/trip.repository'

export const tripRouter = router({
  list: publicProcedure
    .input(z.object({ tripId: z.string() }))
    .output(TripSchema.array())
    .query(async () => {
      return await tripRepository.getAll()
    }),

  byId: publicProcedure
    .input(IdParamSchema)
    .output(TripSchema.nullable())
    .query(async ({ input }) => {
      const trip = await tripRepository.getById(input.id)
      if (!trip) {
        createTRPCError('NOT_FOUND', `Trip with id ${input.id} not found`)
      }
      return trip
    }),

  create: publicProcedure
    .input(CreateTripSchema)
    .output(TripSchema)
    .mutation(async ({ input }) => {
      const newTrip = {
        imageUrl: '/images/mock-new.jpg',
        days: 0,
        status: 'draft' as const,
        budget: 0,
        currency: 'RUB',
        participants: [],
        tags: [],
        visibility: 'private' as const,
        startDate: '',
        endDate: '',
        cities: [],
        description: '',
        ...input,
      }

      return await tripRepository.create(newTrip)
    }),

  update: publicProcedure
    .input(UpdateTripSchema)
    .output(TripSchema)
    .mutation(async ({ input }) => {
      const { id, ...updates } = input
      const updatedTrip = await tripRepository.update(id, updates)

      if (!updatedTrip) {
        createTRPCError('NOT_FOUND', `Trip with id ${id} not found`)
      }

      return updatedTrip!
    }),

  delete: publicProcedure
    .input(IdParamSchema)
    .output(SuccessResponseSchema)
    .mutation(async ({ input }) => {
      const success = await tripRepository.delete(input.id)

      if (!success) {
        createTRPCError('NOT_FOUND', `Trip with id ${input.id} not found`)
      }

      return { success: true }
    }),
})
