import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { activities, days, trips } from '~/db/schema'

export const tripRepository = {
  /**
   * Получает все путешествия.
   */
  async getAll() {
    return await db
      .select()
      .from(trips)
      .orderBy(trips.createdAt)
  },

  /**
   * Получает путешествие по ID.
   */
  async getById(id: string) {
    const result = await db
      .select()
      .from(trips)
      .where(eq(trips.id, id))
      .limit(1)

    return result[0] || null
  },

  /**
   * Получает путешествие со всеми днями и активностями.
   */
  async getByIdWithDays(id: string) {
    return await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        days: {
          orderBy: days.date,
          with: {
            activities: {
              orderBy: activities.startTime,
            },
          },
        },
      },
    })
  },
}
