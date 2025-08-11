import { CreateMemoryInputSchema, DeleteMemoryInputSchema, GetTripsByIdInputSchema, UpdateMemoryInputSchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { memoryRepository } from '~/repositories/memory.repository'

export const memoryProcedures = {
  listByTrip: t.procedure
    .input(GetTripsByIdInputSchema)
    .query(async ({ input }) => {
      return await memoryRepository.getByTripId(input.tripId)
    }),

  create: t.procedure
    .input(CreateMemoryInputSchema)
    .mutation(async ({ input }) => {
      return await memoryRepository.create(input)
    }),

  update: t.procedure
    .input(UpdateMemoryInputSchema)
    .mutation(async ({ input }) => {
      return await memoryRepository.update(input)
    }),

  delete: t.procedure
    .input(DeleteMemoryInputSchema)
    .mutation(async ({ input }) => {
      return await memoryRepository.delete(input.id)
    }),
}
