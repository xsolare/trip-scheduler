import { z } from 'zod'
import { DaySchema } from '../day/day.schemas'

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
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TripWithDaysSchema = TripSchema.extend({
  days: z.array(DaySchema),
})

export const GetTripByIdInputSchema = z.object({
  tripId: z.string().uuid(),
})

export const UpdateTripInputSchema = z.object({
  id: z.string().uuid(),
  details: TripSchema.pick({
    title: true,
    description: true,
    startDate: true,
    endDate: true,
    cities: true,
    status: true,
    budget: true,
    currency: true,
    participants: true,
    tags: true,
    visibility: true,
  }).partial(),
})

export const CreateTripInputSchema = TripSchema.pick({
  title: true,
}).extend({
  description: z.string().optional(),
  startDate: z.union([z.date(), z.string()]).optional(),
  endDate: z.union([z.date(), z.string()]).optional(),
})
