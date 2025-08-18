import { protectedProcedure } from '~/lib/trpc'
import {
  CreateActivityInputSchema,
  DeleteActivityInputSchema,
  UpdateActivityInputSchema,
} from './activity.schemas'
import { activityService } from './activity.service'

export const activityProcedures = {
  create: protectedProcedure
    .input(CreateActivityInputSchema)
    .mutation(async ({ input }) => {
      return activityService.create(input)
    }),

  update: protectedProcedure
    .input(UpdateActivityInputSchema)
    .mutation(async ({ input }) => {
      return activityService.update(input)
    }),

  delete: protectedProcedure
    .input(DeleteActivityInputSchema)
    .mutation(async ({ input }) => {
      return activityService.delete(input.id)
    }),
}
