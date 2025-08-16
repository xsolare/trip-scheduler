import type { z } from 'zod'
import type { CreateTripInputSchema, UpdateTripInputSchema } from '~/modules/trip/trip.schemas'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../db'
import { activities, days, trips } from '../../db/schema'

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

  /**
   * Обновляет детали путешествия.
   * @returns Обновленный объект путешествия или null.
   */
  async update(id: string, details: z.infer<typeof UpdateTripInputSchema>['details']) {
    const { startDate, endDate, ...restDetails } = details

    const updatePayload = {
      ...restDetails,
      updatedAt: new Date(),
      ...(startDate && {
        startDate: startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate,
      }),
      ...(endDate && {
        endDate: endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate,
      }),
    }

    const [updatedTrip] = await db
      .update(trips)
      .set(updatePayload)
      .where(eq(trips.id, id))
      .returning()

    return updatedTrip || null
  },

  /**
   * Создает новое путешествие.
   * @returns Созданный объект путешествия.
   */
  async create(data: z.infer<typeof CreateTripInputSchema>, userId: string) {
    const { startDate, endDate, ...restData } = data

    const newStartDate = (startDate instanceof Date ? startDate : new Date()).toISOString().split('T')[0]
    const newEndDate = (endDate instanceof Date ? endDate : new Date(Date.now() + 86400000)).toISOString().split('T')[0]

    const [newTrip] = await db
      .insert(trips)
      .values({
        id: uuidv4(),
        ...restData,
        userId,
        startDate: newStartDate,
        endDate: newEndDate,
      })
      .returning()

    return newTrip
  },

  /**
   * Удаляет путешествие по ID.
   * @returns Удаленный объект или null.
   */
  async delete(id: string) {
    const [deletedTrip] = await db.delete(trips).where(eq(trips.id, id)).returning()
    return deletedTrip || null
  },
}
