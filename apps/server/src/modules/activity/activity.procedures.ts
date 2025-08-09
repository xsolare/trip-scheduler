import { CreateActivityInputSchema, DeleteActivityInputSchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { activityRepository } from '~/repositories/activity.repository'

export const activityProcedures = {
  /**
   * Мутация для создания новой активности.
   */
  create: t.procedure
    .input(CreateActivityInputSchema)
    .mutation(async ({ input }) => {
      return await activityRepository.create(input)
    }),

  /**
   * Мутация для удаления активности.
   */
  delete: t.procedure
    .input(DeleteActivityInputSchema)
    .mutation(async ({ input }) => {
      return await activityRepository.delete(input.id)
    }),
}
