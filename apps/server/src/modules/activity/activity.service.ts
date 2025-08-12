import type { z } from 'zod'
import type { CreateActivityInputSchema, UpdateActivityInputSchema } from './activity.schemas'
import { createTRPCError } from '~/lib/trpc'
import { activityRepository } from '~/repositories/activity.repository'

export const activityService = {
  async create(data: z.infer<typeof CreateActivityInputSchema>) {
    return await activityRepository.create(data)
  },

  async update(data: z.infer<typeof UpdateActivityInputSchema>) {
    const updatedActivity = await activityRepository.update(data)
    if (!updatedActivity) {
      throw createTRPCError('NOT_FOUND', `Активность с ID ${data.id} не найдена.`)
    }
    return updatedActivity
  },

  async delete(id: string) {
    const deletedActivity = await activityRepository.delete(id)
    if (!deletedActivity) {
      throw createTRPCError('NOT_FOUND', `Активность с ID ${id} не найдена.`)
    }
    return deletedActivity
  },
}
