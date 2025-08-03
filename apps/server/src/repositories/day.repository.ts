import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { days } from '~/db/schema'

export const dayRepository = {
  /**
   * Получает все дни и их активности для конкретного путешествия.
   * @param tripId - ID путешествия.
   * @returns Массив дней с вложенными активностями.
   */
  async getByTripId(tripId: string) {
    const result = await db.query.days.findMany({
      where: eq(days.tripId, tripId),
      with: {
        activities: true,
      },
    })
    return result
  },

  /**
   * Получает один день по его ID.
   * @param id - ID дня.
   * @returns Объект дня с активностями или undefined, если не найден.
   */
  async getById(id: string) {
    const result = await db.query.days.findFirst({
      where: eq(days.id, id),
      with: {
        activities: true,
      },
    })
    return result || null
  },

}
