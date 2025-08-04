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

    return result as Trip[]
  }

  /**
   * Получает одно путешествие по его ID.
   * @param id - Уникальный идентификатор путешествия.
   * @returns Promise<Trip | null> - Объект путешествия или null, если не найдено.
   */
  async getById(id: string): Promise<Trip | null> {
    const result = await trpc.trip.byId.query({ id })

    return result as Trip | null
  }
}

export { TripRepository }
