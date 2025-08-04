import { z } from 'zod'
import { DaySchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

export const dayProcedures = {
  getByTripId: t.procedure
    .input(z.object({ tripId: z.string() }))
    .output(z.array(DaySchema))
    .query(async ({ input }) => {
      return dayRepository.getByTripId(input.tripId)
    }),
}
