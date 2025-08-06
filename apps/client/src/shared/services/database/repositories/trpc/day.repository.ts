import type { IDayRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import { trpc } from '~/shared/services/trpc/trpc.service'

/**
 * Реализация репозитория для Дней (Days), использующая tRPC.
 */
class DayRepository implements IDayRepository {
  /**
   * Получает все дни для конкретного путешествия.
   * @param tripId - Уникальный идентификатор путешествия.
   * @returns Promise<Day[]> - Массив дней.
   */
  async getByTripId(tripId: string): Promise<Day[]> {
    const result = await trpc.day.getByTripId.query({ tripId })

    if (import.meta.env.VITE_APP_REQUEST_THROTTLE)
      await new Promise(r => setTimeout(() => r(true), 1_500))

    return result as Day[]
  }
}

export { DayRepository }
