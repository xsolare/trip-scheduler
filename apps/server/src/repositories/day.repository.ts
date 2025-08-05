import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { activities, days } from '~/db/schema'

export const dayRepository = {
  /**
   * Получает все дни и их активности для конкретного путешествия.
   * @param tripId - ID путешествия.
   * @returns Массив дней с вложенными активностями.
   */
  async getByTripId(tripId: string) {
    return await db.query.days.findMany({
      where: eq(days.tripId, tripId),
      orderBy: days.date,
      with: {
        activities: {
          orderBy: activities.startTime,
        },
      },
    })
  },

  /**
   * Получает день по ID с активностями.
   */
  async getById(id: string) {
    return await db.query.days.findFirst({
      where: eq(days.id, id),
      with: {
        activities: {
          orderBy: activities.startTime,
        },
      },
    })
  },
}
