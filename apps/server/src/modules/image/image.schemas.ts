import { tripImagePlacementEnum } from 'db/schema'
import { z } from 'zod'

export const GetImagesByTripIdInputSchema = z.object({
  tripId: z.string().uuid(),
})

export const UploadImageInputSchema = z.object({
  tripId: z.string().uuid(),
  imageUrl: z.string().url({ message: 'Неверный формат URL изображения.' }),
  placement: z.enum(tripImagePlacementEnum.enumValues),
})
