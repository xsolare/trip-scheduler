import { publicProcedure } from '~/lib/trpc'
import {
  CreateActivityInputSchema,
  DeleteActivityInputSchema,
  UpdateActivityInputSchema,
} from './activity.schemas'
import { activityService } from './activity.service'

export const activityProcedures = {
  create: publicProcedure
    .input(CreateActivityInputSchema)
    .mutation(async ({ input }) => {
      return activityService.create(input)
    }),

  update: publicProcedure
    .input(UpdateActivityInputSchema)
    .mutation(async ({ input }) => {
      return activityService.update(input)
    }),

  delete: publicProcedure
    .input(DeleteActivityInputSchema)
    .mutation(async ({ input }) => {
      return activityService.delete(input.id)
    }),
}
