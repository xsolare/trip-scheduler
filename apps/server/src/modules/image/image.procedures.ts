import { publicProcedure } from '~/lib/trpc'
import { GetImagesByTripIdInputSchema } from './image.schemas'
import { imageService } from './image.service'

export const imageProcedures = {
  listByTrip: publicProcedure
    .input(GetImagesByTripIdInputSchema)
    .query(async ({ input }) => {
      return imageService.getByTripId(input.tripId, input.placement)
    }),
}
