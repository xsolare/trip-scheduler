import type { IDayRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { throttle } from '../../lib/decorators'

/**
 * Реализация репозитория для Дней (Days), использующая tRPC.
 */
class DayRepository implements IDayRepository {
  /**
   * Получает все дни для конкретного путешествия.
   * @param tripId - Уникальный идентификатор путешествия.
   * @returns Promise<Day[]> - Массив дней.
   */
  @throttle(1_000)
  async getByTripId(tripId: string): Promise<Day[]> {
    const result = await trpc.day.getByTripId.query({ tripId })

    return result as Day[]
  }

  /**
   * Создает новый день через tRPC мутацию.
   * @param dayData - Данные нового дня.
   * @returns Promise<Day> - Созданный день с ID от сервера.
   */
  @throttle(1_000)
  async createNewDay(dayData: Omit<Day, 'id'>): Promise<Day> {
    const newDay = await trpc.day.createNewDay.mutate(dayData)

    return newDay as Day
  }

  @throttle(1_000)
  async deleteDay(id: string): Promise<void> {
    await trpc.day.deleteDay.mutate({ id })
  }

  @throttle(1_000)
  async updateDayDetails(id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>): Promise<Day> {
    const result = await trpc.day.updateDayDetails.mutate({
      id,
      details,
    })

    return result as unknown as Day
  }
}

export { DayRepository }
