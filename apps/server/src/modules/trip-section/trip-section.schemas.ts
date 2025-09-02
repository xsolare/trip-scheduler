import { z } from 'zod'
import { tripSectionTypeEnum } from '~/../db/schema'

export const TripSectionSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  type: z.enum(tripSectionTypeEnum.enumValues),
  title: z.string(),
  icon: z.string().nullable(),
  content: z.any(), // z.any() для гибкости jsonb
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateTripSectionInputSchema = TripSectionSchema.pick({
  tripId: true,
  type: true,
  title: true,
  icon: true,
}).extend({
  content: z.any().optional(),
})

export const UpdateTripSectionInputSchema = TripSectionSchema.pick({
  id: true,
}).merge(TripSectionSchema.pick({
  title: true,
  icon: true,
  content: true,
}).partial())

export const DeleteTripSectionInputSchema = TripSectionSchema.pick({
  id: true,
})

export const ReorderTripSectionsInputSchema = z.object({
  tripId: z.string().uuid(),
  updates: z.array(z.object({
    id: z.string().uuid(),
    order: z.number(),
  })),
})
