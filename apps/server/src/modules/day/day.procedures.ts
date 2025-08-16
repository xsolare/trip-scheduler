import { protectedProcedure, publicProcedure } from '~/lib/trpc'
import {
  CreateDayInputSchema,
  DeleteDayInputSchema,
  GetDayByIdInputSchema,
  UpdateDayInputSchema,
} from './day.schemas'
import { dayService } from './day.service'

export const dayProcedures = {
  getByTripId: publicProcedure
    .input(GetDayByIdInputSchema)
    .query(async ({ input }) => {
      return dayService.getByTripId(input.tripId)
    }),

  create: protectedProcedure
    .input(CreateDayInputSchema)
    .mutation(async ({ input }) => {
      return dayService.create(input)
    }),

  update: protectedProcedure
    .input(UpdateDayInputSchema)
    .mutation(async ({ input }) => {
      return dayService.update(input.id, input.details)
    }),

  delete: protectedProcedure
    .input(DeleteDayInputSchema)
    .mutation(async ({ input }) => {
      return dayService.delete(input.id)
    }),
}
