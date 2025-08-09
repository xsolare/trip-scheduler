import { z } from 'zod'
import { CreateDayInputSchema, GetTripsByIdInputSchema, UpdateDayInputSchema } from '~/lib/schemas'
import { createTRPCError, t } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

export const dayProcedures = {
  getByTripId: t.procedure
    .input(GetTripsByIdInputSchema)
    .query(async ({ input }) => {
      const days = await dayRepository.getByTripId(input.tripId)

      return days.map(day => ({
        ...day,
      }))
    }),

  getById: t.procedure
    .input(z.object({ dayId: z.string().uuid() }))
    .query(async ({ input }) => {
      const day = await dayRepository.getById(input.dayId)
      if (!day)
        return null

      return {
        ...day,
      }
    }),

  createNewDay: t.procedure
    .input(CreateDayInputSchema)
    .mutation(async ({ input }) => {
      const dateForDb = new Date(input.date).toISOString().split('T')[0]
      const newDay = await dayRepository.create({
        ...input,
        date: dateForDb,
        description: input.description || '',
      })
      return newDay
    }),

  updateDayDetails: t.procedure
    .input(UpdateDayInputSchema)
    .mutation(async ({ input }) => {
      try {
        const updatedDay = await dayRepository.update(input.id, input.details)
        if (!updatedDay) {
          throw createTRPCError('NOT_FOUND', `День с ID ${input.id} не найден.`)
        }
        return updatedDay
      }
      catch (error) {
        console.error('Ошибка при обновлении дня:', error)
        throw createTRPCError('INTERNAL_SERVER_ERROR', 'Не удалось обновить день.')
      }
    }),
}
