import { z } from 'zod'

export const GetImagesByTripIdInputSchema = z.object({
  tripId: z.string().uuid(),
  placement: z.enum(['route', 'memories']).optional(),
})
