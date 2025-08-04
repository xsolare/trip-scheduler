import type { ITripRepository } from '../../model/types'
import type { Trip } from '~/shared/types/models/trip'
import { MOCK_TRIPS } from './trip.mock'

class TripRepository implements ITripRepository {
  async getAll(): Promise<Trip[]> {
    return Promise.resolve(MOCK_TRIPS)
  }

  async getById(id: string): Promise<Trip | null> {
    const trip = MOCK_TRIPS.find(t => t.id === id) || null
    return Promise.resolve(trip)
  }
}

export { TripRepository }
