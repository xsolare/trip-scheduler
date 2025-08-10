import type { z } from 'zod'
import type { CreateActivityInputSchema, UpdateActivityInputSchema } from '~/lib/schemas'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { createTRPCError } from '~/lib/trpc'
import { db } from '../../db'
import { activities } from '../../db/schema'

type ActivityInsert = typeof activities.$inferInsert

export const activityRepository = {
  /**
   * Создает новую активность.
   * @param data - Данные для создания активности.
   * @returns Созданный объект активности.
   */
  async create(data: z.infer<typeof CreateActivityInputSchema>) {
    const [newActivity] = await db
      .insert(activities)
      .values({
        ...data,
        tag: data.tag ?? null,
        id: uuidv4(),
      } satisfies ActivityInsert)
      .returning()

    return newActivity
  },

  /**
   * Обновляет существующую активность.
   * @param data - Полный объект активности с ID.
   * @returns Обновленный объект активности.
   */
  async update(data: z.infer<typeof UpdateActivityInputSchema>) {
    const { id, ...updateData } = data
    const [updatedActivity] = await db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning()

    if (!updatedActivity)
      createTRPCError('NOT_FOUND', `Активность с ID ${id} не найдена.`)

    return updatedActivity
  },

  /**
   * Удаляет активность по ее ID.
   * @param id - ID активности для удаления.
   * @returns Объект удаленной активности.
   */
  async delete(id: string) {
    const [deletedActivity] = await db
      .delete(activities)
      .where(eq(activities.id, id))
      .returning()

    if (!deletedActivity) {
      createTRPCError('NOT_FOUND', `Активность с ID ${id} не найдена.`)
    }

    return deletedActivity
  },
}
