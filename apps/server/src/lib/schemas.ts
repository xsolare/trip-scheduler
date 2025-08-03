import { z } from 'zod'

// Trip schemas
export const TripSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  days: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  cities: z.array(z.string()),
  status: z.enum(['completed', 'planned', 'draft']),
  budget: z.number(),
  currency: z.string(),
  participants: z.array(z.string()),
  tags: z.array(z.string()),
  visibility: z.enum(['public', 'private']),
})

export const CreateTripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cities: z.array(z.string()).optional(),
})

export const UpdateTripSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Day schemas
export const ActivitySectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  text: z.string(),
})

export const ActivitySchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  sections: z.array(ActivitySectionSchema),
})

export const DaySchema = z.object({
  id: z.string(),
  tripId: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  activities: z.array(ActivitySchema),
})

// Common schemas
export const IdParamSchema = z.object({
  id: z.string(),
})

export const TripIdParamSchema = z.object({
  tripId: z.string(),
})

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
})
