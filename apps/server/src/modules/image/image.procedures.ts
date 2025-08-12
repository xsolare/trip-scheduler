import { publicProcedure } from '~/lib/trpc'
import { GetImagesByTripIdInputSchema, UploadImageInputSchema } from './image.schemas'
import { imageService } from './image.service'

export const imageProcedures = {
  listByTrip: publicProcedure
    .input(GetImagesByTripIdInputSchema)
    .query(async ({ input }) => {
      return imageService.getByTripId(input.tripId)
    }),

  upload: publicProcedure
    .input(UploadImageInputSchema)
    .mutation(async ({ input }) => {
      const { tripId, imageUrl, placement } = input
      return imageService.create(tripId, imageUrl, placement)
    }),
}
