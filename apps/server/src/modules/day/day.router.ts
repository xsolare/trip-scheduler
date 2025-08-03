import { z } from 'zod'
import { DaySchema, TripIdParamSchema } from '~/lib/schemas'
import { publicProcedure, router } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

export const dayRouter = router({
  getByTripId: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/days/by-trip/{tripId}',
        tags: ['days'],
        summary: 'Get days by trip ID',
        description: 'Retrieve all days for a specific trip',
      },
    })
    .input(TripIdParamSchema)
    .output(DaySchema.array())
    .query(async ({ input }) => {
      return await dayRepository.getByTripId(input.tripId)
    }),
})
