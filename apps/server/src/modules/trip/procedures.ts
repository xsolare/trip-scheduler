import { z } from 'zod'
import { t } from '~/lib/trpc'

const TripSchema = z.object({
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

export const tripProcedures = {
  list: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/trips',
        tags: ['trip'],
        summary: 'Get a list of trips',
      },
    })
    .input(z.void())
    .output(z.array(TripSchema))
    .query(async () => {
      return await tripRepository.getAll()
    }),

  byId: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/trips/{id}',
        tags: ['trip'],
        summary: 'Get a trip by its ID',
      },
    })
    .input(z.object({ id: z.string() }))
    .output(TripSchema.nullable())
    .query(async ({ input }) => {
      return tripRepository.getById(input.id)
    }),

  create: t.procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/trips',
        tags: ['trip'],
        summary: 'Create a new trip',
      },
    })
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      cities: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const newTrip = {
        id: Math.random().toString(36).substring(7),
        imageUrl: '/images/mock-new.jpg',
        days: 0,
        status: 'draft' as const,
        budget: 0,
        currency: 'RUB',
        participants: [],
        tags: [],
        visibility: 'private' as const,
        ...input,
      }

      return newTrip
    }),

  update: t.procedure
    .meta({
      openapi: {
        method: 'PATCH',
        path: '/trips/{id}',
        tags: ['trip'],
        summary: 'Update a trip',
      },
    })
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const trip = await tripRepository.getById(input.id)
      if (!trip)
        throw new Error('Trip not found')

      return {
        ...trip,
        ...input,
      }
    }),

  delete: t.procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/trips/{id}',
        tags: ['trip'],
        summary: 'Delete a trip',
      },
    })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // eslint-disable-next-line no-console
      console.log('Deleting trip:', input.id)
      return { success: true }
    }),
}
