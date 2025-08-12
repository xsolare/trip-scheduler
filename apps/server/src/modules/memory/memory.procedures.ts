import z from 'zod'
import { publicProcedure } from '~/lib/trpc'
import { memoryRepository } from '~/repositories/memory.repository'
import {
  CreateMemoryInputSchema,
  DeleteMemoryInputSchema,
  UpdateMemoryInputSchema,
} from './memory.schemas'
import { memoryService } from './memory.service'

export const memoryProcedures = {
  getByTripId: publicProcedure
    .input(z.object({ tripId: z.string().uuid() }))
    .query(async ({ input }) => {
      return memoryService.getByTripId(input.tripId)
    }),

  create: publicProcedure
    .input(CreateMemoryInputSchema)
    .mutation(async ({ input }) => {
      return memoryService.create(input)
    }),

  update: publicProcedure
    .input(UpdateMemoryInputSchema)
    .mutation(async ({ input }) => {
      return memoryService.update(input)
    }),

  delete: publicProcedure
    .input(DeleteMemoryInputSchema)
    .mutation(async ({ input }) => {
      return memoryService.delete(input.id)
    }),

  // TODO service
  applyTakenAt: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return await memoryRepository.applyTakenAtTimestamp(input.id)
    }),

  unassignDate: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return await memoryRepository.unassignTimestamp(input.id)
    }),
}
