import type { IDatabaseWrapper } from '../../clients/sql.client'
import type { ITripRepository } from '~/shared/services/database/model/types'
import type { CreateTripInput, Trip, TripWithDays, UpdateTripInput } from '~/shared/types/models/trip'
import { v4 as uuidv4 } from 'uuid'
import { TripStatus, TripVisibility } from '~/shared/types/models/trip'

class TripRepository implements ITripRepository {
  constructor(private db: IDatabaseWrapper) { }

  async getUniqueCities(): Promise<string[]> {
    const results = await this.db.select<{ cities: string }[]>('SELECT cities FROM trips')
    const allCities = results.flatMap((row: any) => JSON.parse(row.cities || '[]'))
    const uniqueCities = [...new Set(allCities)]
    return uniqueCities as string[]
  }

  async getUniqueTags(params: { query?: string }): Promise<string[]> {
    const results = await this.db.select<{ tags: string }[]>('SELECT tags FROM trips')
    const allTags = results.flatMap((row: any) => JSON.parse(row.tags || '[]'))
    let uniqueTags = [...new Set(allTags)]

    if (params.query) {
      const queryLower = params.query.toLowerCase()
      uniqueTags = uniqueTags.filter((tag: unknown) => (tag as string).toLowerCase().includes(queryLower))
    }

    return uniqueTags as string[]
  }

  async getAll(): Promise<Trip[]> {
    const results = await this.db.select<any[]>('SELECT * FROM trips ORDER BY created_at DESC') // Сортируем по дате создания, как на сервере

    return results.map(this.mapTrip)
  }

  async getById(id: string): Promise<Trip | null> {
    const result = await this.db.select<any[]>('SELECT * FROM trips WHERE id = $1', [id])
    if (result.length === 0)
      return null

    return this.mapTrip(result[0])
  }

  async getByIdWithDays(id: string): Promise<TripWithDays | null> {
    const tripResult = await this.db.select<any[]>('SELECT * FROM trips WHERE id = $1', [id])
    if (tripResult.length === 0)
      return null

    const daysResult = await this.db.select<any[]>('SELECT * FROM days WHERE trip_id = $1 ORDER BY date ASC', [id])

    const trip = this.mapTrip(tripResult[0])

    const days = daysResult.map((day: any) => ({
      ...day,
      activities: JSON.parse(day.activities || '[]'),
    }))

    return { ...trip, days }
  }

  async create(data: CreateTripInput): Promise<Trip> {
    const newId = uuidv4()
    const now = new Date().toISOString()
    const newTrip: Trip = {
      id: newId,
      title: data.title,
      description: data.description || null,
      imageUrl: null,
      startDate: (data.startDate || now).toString(),
      endDate: (data.endDate || now).toString(),
      cities: [],
      status: TripStatus.PLANNED,
      budget: null,
      currency: 'RUB',
      participants: [],
      tags: [],
      visibility: TripVisibility.PRIVATE,
      createdAt: now,
      updatedAt: now,
      sections: [],
    }

    await this.db.execute(
      `INSERT INTO trips (id, title, description, start_date, end_date, cities, participants, tags, created_at, updated_at, status, visibility) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        newTrip.id,
        newTrip.title,
        newTrip.description,
        newTrip.startDate,
        newTrip.endDate,
        JSON.stringify(newTrip.cities),
        JSON.stringify(newTrip.participants),
        JSON.stringify(newTrip.tags),
        newTrip.createdAt,
        newTrip.updatedAt,
        newTrip.status,
        newTrip.visibility,
      ],
    )

    return newTrip
  }

  async update(id: string, details: UpdateTripInput): Promise<Trip> {
    const fieldsToUpdate = Object.keys(details)
    if (fieldsToUpdate.length === 0) {
      const currentTrip = await this.getById(id)
      if (!currentTrip)
        throw new Error('Trip not found for update')
      return currentTrip
    }

    const setClauses = fieldsToUpdate.map((key, index) => `${this.camelToSnakeCase(key)} = $${index + 1}`)
    const values = fieldsToUpdate.map((key) => {
      const value = details[key as keyof UpdateTripInput]
      return Array.isArray(value) ? JSON.stringify(value) : value
    })

    const query = `UPDATE trips SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fieldsToUpdate.length + 1}`
    await this.db.execute(query, [...values, id])

    const updatedTrip = await this.getById(id)
    if (!updatedTrip)
      throw new Error('Failed to retrieve trip after update')
    return updatedTrip
  }

  async delete(id: string): Promise<Trip> {
    const tripToDelete = await this.getById(id)
    if (!tripToDelete)
      throw new Error('Trip to delete not found')

    await this.db.execute('DELETE FROM trips WHERE id = $1', [id])

    return tripToDelete
  }

  private mapTrip(trip: any): Trip {
    return {
      ...trip,
      cities: JSON.parse(trip.cities || '[]'),
      participants: JSON.parse(trip.participants || '[]'),
      tags: JSON.parse(trip.tags || '[]'),
    }
  }

  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  }
}

export { TripRepository }
