import type Database from '@tauri-apps/plugin-sql'
import type { IDayRepository } from '~/shared/services/database/model/types'
import type { Day } from '~/shared/types/models/activity'
import { v4 as uuidv4 } from 'uuid'
import { throttle } from '../../lib/decorators'
import { logOperation } from '../../lib/helpers'

class DayRepository implements IDayRepository {
  constructor(private db: Database) { }

  @throttle(1_000)
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

  @throttle(1_000)
  async createNewDay(dayData: Omit<Day, 'id'>): Promise<Day> {
    const newId = uuidv4()
    const newDay: Day = { ...dayData, id: newId }

    await this.db.execute(
      'INSERT INTO days (id, trip_id, date, title, description, activities) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        newId,
        dayData.tripId,
        dayData.date,
        dayData.title,
        dayData.description,
        JSON.stringify(dayData.activities),
      ],
    )

    await logOperation('days', newId, 'CREATE')

    return newDay
  }

  @throttle(1_000)
  async deleteDay(id: string): Promise<void> {
    await this.db.execute('DELETE FROM days WHERE id = $1', [id])
    await logOperation('days', id, 'DELETE')
  }

  @throttle(1_000)
  async updateDayDetails(_id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>): Promise<Day> {
    return Promise.resolve(details as Day)
  }
}

export { DayRepository }
