import type { z } from 'zod'
import type { CreateActivityInputSchema } from '~/lib/schemas'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '~/db'
import { activities } from '~/db/schema'
import { createTRPCError } from '~/lib/trpc'

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
