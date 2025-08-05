import { z } from 'zod'

const ActivitySectionTextSchema = z.object({
  id: z.string(),
  type: z.literal('description'),
  text: z.string(),
})

const ActivitySectionGallerySchema = z.object({
  id: z.string(),
  type: z.literal('gallery'),
  imageUrls: z.array(z.string()),
})

export const ActivitySectionSchema = z.discriminatedUnion('type', [
  ActivitySectionTextSchema,
  ActivitySectionGallerySchema,
])

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  sections: z.array(ActivitySectionSchema),
  dayId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const DaySchema = z.object({
  id: z.string().uuid(),
  date: z.union([z.date(), z.string()]),
  title: z.string(),
  description: z.string().nullable(),
  tripId: z.string().uuid(),
  activities: z.array(ActivitySchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TripSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  description: z.string().nullable(),
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]),
  cities: z.array(z.string()),
  status: z.enum(['completed', 'planned', 'draft']),
  budget: z.number().nullable(),
  currency: z.string().nullable(),
  participants: z.array(z.string()),
  tags: z.array(z.string()),
  visibility: z.enum(['public', 'private']),
  days: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TripWithDaysSchema = TripSchema.extend({
  days: z.array(DaySchema),
})

// Входные схемы
export const GetTripsByIdInputSchema = z.object({
  tripId: z.string().uuid(),
})
