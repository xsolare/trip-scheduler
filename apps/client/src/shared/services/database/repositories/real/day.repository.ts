import type Database from '@tauri-apps/plugin-sql'
import type { IDayRepository } from '~/shared/services/database/model/types'
import type { Day } from '~/shared/types/models/activity'

class DayRepository implements IDayRepository {
  constructor(private db: Database) { }

  async getByTripId(tripId: string): Promise<Day[]> {
    const results = await this.db.select<any[]>(
      'SELECT * FROM days WHERE trip_id = $1 ORDER BY date ASC',
      [tripId],
    )

    return results.map(day => ({
      ...day,
      activities: JSON.parse(day.activities || '[]'),
    }))
  }
}

export { DayRepository }
