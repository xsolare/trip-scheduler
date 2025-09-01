import { z } from 'zod'

const ActivitySectionBaseSchema = z.object({
  id: z.string(),
  isAttached: z.boolean().optional(),
  title: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

const ActivitySectionTextSchema = ActivitySectionBaseSchema.extend({
  type: z.literal('description'),
  text: z.string(),
})

const ActivitySectionGallerySchema = ActivitySectionBaseSchema.extend({
  type: z.literal('gallery'),
  imageUrls: z.array(z.string()),
})

const ActivitySectionGeolocationSchema = ActivitySectionBaseSchema.extend({
  type: z.literal('geolocation'),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
})

export const ActivitySectionSchema = z.discriminatedUnion('type', [
  ActivitySectionTextSchema,
  ActivitySectionGallerySchema,
  ActivitySectionGeolocationSchema,
])

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  sections: z.array(ActivitySectionSchema),
  tag: z.enum(['transport', 'walk', 'food', 'attraction', 'relax']).optional(),
  dayId: z.string().uuid(),
  status: z.enum(['none', 'completed', 'skipped']).default('none').optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
})

export const CreateActivityInputSchema = ActivitySchema.pick({
  dayId: true,
  title: true,
  startTime: true,
  endTime: true,
  tag: true,
  sections: true,
  status: true,
  rating: true,
})

export const UpdateActivityInputSchema = ActivitySchema

export const DeleteActivityInputSchema = z.object({
  id: z.string().uuid(),
})
