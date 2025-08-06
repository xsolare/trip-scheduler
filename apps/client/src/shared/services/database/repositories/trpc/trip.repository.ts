import type { ITripRepository } from '../../model/types'
import type { Trip } from '~/shared/types/models/trip'
import { trpc } from '~/shared/services/trpc/trpc.service'

/**
 * Реализация репозитория для Путешествий (Trips), использующая tRPC для взаимодействия с сервером.
 */
class TripRepository implements ITripRepository {
  /**
   * Получает все путешествия с сервера.
   * @returns Promise<Trip[]> - Массив путешествий.
   */
  async getAll(): Promise<Trip[]> {
    const result = await trpc.trip.list.query()

    if (import.meta.env.VITE_APP_REQUEST_THROTTLE)
      await new Promise(r => setTimeout(() => r(true), 1_500))


    return result as Trip[]
  }

  /**
   * Получает одно путешествие по его ID.
   * @param id - Уникальный идентификатор путешествия.
   * @returns Promise<Trip | null> - Объект путешествия или null, если не найдено.
   */
  async getById(tripId: string): Promise<Trip | null> {
    const result = await trpc.trip.getById.query({ tripId })

    return result as Trip | null
  }
}

export { TripRepository }
