import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '~/db'
import { activities, days } from '~/db/schema'

type Day = typeof days.$inferSelect
type DayInsert = typeof days.$inferInsert

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

  /**
   * Обновляет детали дня (название, описание, дата).
   * @param id - ID дня для обновления.
   * @param details - Объект с данными для обновления.
   * @returns Обновленный объект дня.
   */
  async update(id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>) {
    const [updatedDay] = await db
      .update(days)
      .set({ ...details, updatedAt: new Date() })
      .where(eq(days.id, id))
      .returning()

    return updatedDay
  },

  /**
   * Создает новый день для путешествия.
   * @param dayData - Данные для создания дня.
   * @returns Созданный объект дня.
   */
  async create(dayData: Omit<DayInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const [newDay] = await db
      .insert(days)
      .values({
        ...dayData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return { ...newDay, activities: [] }
  },

}
