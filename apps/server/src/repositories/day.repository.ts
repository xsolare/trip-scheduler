import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { days } from '~/db/schema'

// eslint-disable-next-line unused-imports/no-unused-vars
const queryForTypeInference = db.query.days.findMany({
  with: {
    activities: true,
  },
})

type DayWithActivities = Awaited<typeof queryForTypeInference>[number]

function transformDay(day: DayWithActivities) {
  return {
    ...day,
    description: day.description ?? '',
    activities: day.activities.map((activity) => {
      return {
        ...activity,
        startTime: activity.startTime ?? '',
        endTime: activity.endTime ?? '',
        sections: activity.sections ?? [],
      }
    }),
  }
}

export const dayRepository = {
  /**
   * Получает все дни и их активности для конкретного путешествия.
   * @param tripId - ID путешествия.
   * @returns Массив дней с вложенными активностями.
   */
  async getByTripId(tripId: string) {
    const result: DayWithActivities[] = await db.query.days.findMany({
      where: eq(days.tripId, tripId),
      with: {
        activities: true,
      },
    })

    return result.map(transformDay)
  },

  /**
   * Получает один день по его ID.
   * @param id - ID дня.
   * @returns Объект дня с активностями или null, если не найден.
   */
  async getById(id: string) {
    const result: DayWithActivities | undefined = await db.query.days.findFirst({
      where: eq(days.id, id),
      with: {
        activities: true,
      },
    })

    if (!result) {
      return null
    }

    return transformDay(result)
  },
}
