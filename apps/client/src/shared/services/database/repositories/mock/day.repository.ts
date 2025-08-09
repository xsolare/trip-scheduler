import type { IDayRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import { throttle } from '../../lib/decorators'
import { MOCK_DAYS } from './data/trip.mock'

class DayRepository implements IDayRepository {
  @throttle(1_000)
  async getByTripId(tripId: string): Promise<Day[]> {
    const days = MOCK_DAYS.filter(d => d.tripId === tripId)

    return Promise.resolve(days)
  }

  @throttle(1_000)
  async createNewDay(dayData: Omit<Day, 'id'>): Promise<Day> {
    const newDay: Day = {
      ...dayData,
      id: `mock-day-${Date.now()}`,
    }
    MOCK_DAYS.push(newDay)

    return Promise.resolve(newDay)
  }

  @throttle(1_000)
  async deleteDay(id: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`[Mock] Deleting day with id: ${id}`)
    const dayIndex = MOCK_DAYS.findIndex(d => d.id === id)
    if (dayIndex !== -1)
      MOCK_DAYS.splice(dayIndex, 1)

    return Promise.resolve()
  }

  @throttle(1_000)
  async updateDayDetails(_id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>): Promise<Day> {
    return Promise.resolve(details as Day)
  }
}

export { DayRepository }
