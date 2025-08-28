import type { IDatabaseWrapper } from '../../clients/sql.client'
import type { IDayRepository } from '~/shared/services/database/model/types'
import type { Day } from '~/shared/types/models/activity'
import { v4 as uuidv4 } from 'uuid'

class DayRepository implements IDayRepository {
  constructor(private db: IDatabaseWrapper) { }

  async getByTripId(tripId: string): Promise<Day[]> {
    const results = await this.db.select<any[]>(
      'SELECT * FROM days WHERE trip_id = $1 ORDER BY date ASC',
      [tripId],
    )

    return results.map((day: any) => ({
      ...day,
      activities: JSON.parse(day.activities || '[]'),
    }))
  }

  async createNewDay(dayData: Omit<Day, 'id' | 'activities'>): Promise<Day> {
    const newId = uuidv4()
    const newDay: Day = { ...dayData, id: newId, activities: [] }

    await this.db.execute(
      'INSERT INTO days (id, trip_id, date, title, description, activities) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        newDay.id,
        newDay.tripId,
        newDay.date,
        newDay.title,
        newDay.description,
        JSON.stringify(newDay.activities),
      ],
    )

    return newDay
  }

  async deleteDay(id: string): Promise<Day> {
    const dayToDelete = await this.db.select<Day[]>('SELECT * FROM days WHERE id = $1', [id])
    if (dayToDelete.length === 0) {
      throw new Error(`Day with id ${id} not found`)
    }

    await this.db.execute('DELETE FROM days WHERE id = $1', [id])

    return dayToDelete[0]
  }

  async updateDayDetails(_id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>): Promise<Day> {
    return Promise.resolve(details as Day)
  }
}

export { DayRepository }
