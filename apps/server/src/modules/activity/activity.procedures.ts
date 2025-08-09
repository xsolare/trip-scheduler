import { CreateActivityInputSchema, DeleteActivityInputSchema, UpdateActivityInputSchema } from '~/lib/schemas'
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
   * Обновляет существующую активность.
   */
  update: t.procedure
    .input(UpdateActivityInputSchema)
    .mutation(({ input }) => {
      return activityRepository.update(input)
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
