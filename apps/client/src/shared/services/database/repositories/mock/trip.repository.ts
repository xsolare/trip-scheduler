import type { ITripRepository } from '../../model/types'
import type { Trip } from '~/shared/types/models/trip'
import { throttle } from '../../lib/decorators'
import { MOCK_TRIPS } from './data/trip.mock'

class TripRepository implements ITripRepository {
  @throttle(1500)
  async getAll(): Promise<Trip[]> {
    return Promise.resolve(MOCK_TRIPS)
  }

  @throttle(1500)
  async getById(id: string): Promise<Trip | null> {
    const trip = MOCK_TRIPS.find(t => t.id === id) || null

    return Promise.resolve(trip)
  }
}

export { TripRepository }
