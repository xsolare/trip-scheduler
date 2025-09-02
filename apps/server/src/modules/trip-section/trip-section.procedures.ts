import { protectedProcedure } from '~/lib/trpc'
import {
  CreateTripSectionInputSchema,
  DeleteTripSectionInputSchema,
  ReorderTripSectionsInputSchema,
  UpdateTripSectionInputSchema,
} from './trip-section.schemas'
import { tripSectionService } from './trip-section.service'

export const tripSectionProcedures = {
  create: protectedProcedure
    .input(CreateTripSectionInputSchema)
    .mutation(({ input }) => tripSectionService.create(input)),

  update: protectedProcedure
    .input(UpdateTripSectionInputSchema)
    .mutation(({ input }) => tripSectionService.update(input)),

  delete: protectedProcedure
    .input(DeleteTripSectionInputSchema)
    .mutation(({ input }) => tripSectionService.delete(input.id)),

  reorder: protectedProcedure
    .input(ReorderTripSectionsInputSchema)
    .mutation(({ input }) => tripSectionService.reorder(input)),
}
