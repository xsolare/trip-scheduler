import { z } from 'zod'
import { t } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

const ActivitySectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  text: z.string(),
})

const ActivitySchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  sections: z.array(ActivitySectionSchema),
})

const DaySchema = z.object({
  id: z.string(),
  tripId: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  activities: z.array(ActivitySchema),
})

export const dayProcedures = {
  getByTripId: t.procedure
    .input(z.object({ tripId: z.string() }))
    .output(z.array(DaySchema))
    .query(async ({ input }) => {
      return dayRepository.getByTripId(input.tripId)
    }),
}
