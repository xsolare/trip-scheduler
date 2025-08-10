import { z } from 'zod'

const ActivitySectionBaseSchema = z.object({
  id: z.string(),
  isAttached: z.boolean().optional(),
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
  tag: z.enum(['transport', 'walk', 'food', 'attraction', 'relax']).nullable().optional(),
  dayId: z.string().uuid(),
})

export const CreateActivityInputSchema = ActivitySchema.pick({
  dayId: true,
  title: true,
  startTime: true,
  endTime: true,
  tag: true,
  sections: true,
})

export const UpdateActivityInputSchema = ActivitySchema

export const DeleteActivityInputSchema = z.object({
  id: z.string().uuid(),
})

export const DaySchema = z.object({
  id: z.string().uuid(),
  date: z.union([z.string()]),
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

export const GetTripsByIdInputSchema = z.object({
  tripId: z.string().uuid(),
})

export const DeleteDayInputSchema = z.object({
  id: z.string().uuid(),
})

export const CreateDayInputSchema = DaySchema.pick({
  tripId: true,
  title: true,
  description: true,
  date: true,
})

export const UpdateDayInputSchema = z.object({
  id: z.string().uuid(),
  details: DaySchema.pick({ title: true, description: true, date: true }).partial(),
})
