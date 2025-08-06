import type { IDayRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import { MOCK_DAYS } from './day.mock'

class DayRepository implements IDayRepository {
  async getByTripId(tripId: string): Promise<Day[]> {
    const days = MOCK_DAYS.filter(d => d.tripId === tripId)

    if (import.meta.env.VITE_APP_REQUEST_THROTTLE)
      await new Promise(r => setTimeout(() => r(true), 1_500))


    return Promise.resolve(days)
  }
}

export { DayRepository }
