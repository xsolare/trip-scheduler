import { z } from 'zod'
import { DaySchema, GetTripsByIdInputSchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

export const dayProcedures = {
  getByTripId: t.procedure
    .input(GetTripsByIdInputSchema)
    .output(z.array(DaySchema))
    .query(async ({ input }) => {
      const days = await dayRepository.getByTripId(input.tripId)

      return days.map(day => ({
        ...day,
        date: new Date(day.date),
      }))
    }),

  getById: t.procedure
    .input(z.object({ dayId: z.string().uuid() }))
    .output(DaySchema.nullable())
    .query(async ({ input }) => {
      const day = await dayRepository.getById(input.dayId)
      if (!day)
        return null

      return {
        ...day,
        date: new Date(day.date),
      }
    }),
}
