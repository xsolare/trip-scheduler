import type Database from '@tauri-apps/plugin-sql'
import type { ITripRepository } from '~/shared/services/database/model/types'
import type { Trip } from '~/shared/types/models/trip'

class TripRepository implements ITripRepository {
  constructor(private db: Database) {

  }

  async getAll(): Promise<Trip[]> {
    const results = await this.db.select<any[]>('SELECT * FROM trips ORDER BY start_date DESC')

    return results.map(trip => ({
      ...trip,
      cities: JSON.parse(trip.cities || '[]'),
      participants: JSON.parse(trip.participants || '[]'),
      tags: JSON.parse(trip.tags || '[]'),
    }))
  }

  async getById(id: string): Promise<Trip | null> {
    const result = await this.db.select<any[]>('SELECT * FROM trips WHERE id = $1', [id])

    if (result.length === 0)
      return null
    const trip = result[0]

    return {
      ...trip,
      cities: JSON.parse(trip.cities || '[]'),
      participants: JSON.parse(trip.participants || '[]'),
      tags: JSON.parse(trip.tags || '[]'),
    }
  }
}

export { TripRepository }
