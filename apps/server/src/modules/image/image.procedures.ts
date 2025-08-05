import { z } from 'zod'
import { t } from '~/lib/trpc'
import { imageRepository } from '~/repositories/image.repository'

const UploadImageInputSchema = z.object({
  tripId: z.string().uuid(),
  imageUrl: z.string().url(),
})

// Схема для получения списка изображений
const GetImagesByTripIdInputSchema = z.object({
  tripId: z.string().uuid(),
})

export const imageProcedures = {
  /**
   * Процедура для "загрузки" (сохранения URL) изображения
   */
  upload: t.procedure
    .input(UploadImageInputSchema)
    .mutation(async ({ input }) => {
      const newImage = await imageRepository.create(input.tripId, input.imageUrl)

      return newImage
    }),

  /**
   * Процедура для получения списка всех изображений путешествия
   */
  listByTrip: t.procedure
    .input(GetImagesByTripIdInputSchema)
    .query(async ({ input }) => {
      const images = await imageRepository.getByTripId(input.tripId)

      return images
    }),
}
