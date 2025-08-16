import { protectedProcedure, publicProcedure } from '~/lib/trpc'
import {
  CreateTripInputSchema,
  GetTripByIdInputSchema,
  UpdateTripInputSchema,
} from './trip.schemas'
import { tripService } from './trip.service'

export const tripProcedures = {
  list: publicProcedure.query(async () => {
    return tripService.getAll()
  }),

  getById: publicProcedure
    .input(GetTripByIdInputSchema)
    .query(async ({ input }) => {
      return tripService.getById(input.tripId)
    }),

  getByIdWithDays: publicProcedure
    .input(GetTripByIdInputSchema)
    .query(async ({ input }) => {
      return tripService.getByIdWithDays(input.tripId)
    }),

  create: protectedProcedure
    .input(CreateTripInputSchema)
    .mutation(async ({ input, ctx }) => {
      return tripService.create(input, ctx.user.id)
    }),

  update: publicProcedure
    .input(UpdateTripInputSchema)
    .mutation(async ({ input }) => {
      return tripService.update(input.id, input.details)
    }),

  delete: publicProcedure
    .input(GetTripByIdInputSchema)
    .mutation(async ({ input }) => {
      return tripService.delete(input.tripId)
    }),
}
