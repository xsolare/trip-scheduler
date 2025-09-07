import type { IDatabaseWrapper } from '../../clients/sql.client'
import type { ITripSectionRepository } from '../../model/types'
import type { TripSection, TripSectionType } from '~/shared/types/models/trip'
import { v4 as uuidv4 } from 'uuid'

export class TripSectionRepository implements ITripSectionRepository {
  constructor(private db: IDatabaseWrapper) { }

  async create(data: { tripId: string, type: TripSectionType, title: string, icon: string | null, content: any }): Promise<TripSection> {
    const newId = uuidv4()
    const [{ maxOrder }] = await this.db.select<{ maxOrder: number | null }[]>(
      'SELECT MAX("order") as maxOrder FROM trip_sections WHERE trip_id = $1',
      [data.tripId],
    )
    const nextOrder = (maxOrder ?? -1) + 1
    const now = new Date().toISOString()

    await this.db.execute(
      'INSERT INTO trip_sections (id, trip_id, type, title, icon, content, "order", created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [newId, data.tripId, data.type, data.title, data.icon, JSON.stringify(data.content), nextOrder, now, now],
    )
    const [result] = await this.db.select<TripSection[]>('SELECT * from trip_sections where id = $1', [newId])
    return result
  }

  async update(data: { id: string, title?: string, icon?: string | null, content?: any }): Promise<TripSection> {
    const { id, ...updateData } = data
    const entries = Object.entries(updateData).filter(([, value]) => value !== undefined)
    if (entries.length === 0) {
      const [current] = await this.db.select<TripSection[]>('SELECT * from trip_sections where id = $1', [id])
      return current
    }

    const setClauses = entries.map(([key], index) => `"${key}" = $${index + 1}`).join(', ')
    const values = entries.map(([, value]) => (typeof value === 'object' ? JSON.stringify(value) : value))

    await this.db.execute(
      `UPDATE trip_sections SET ${setClauses}, updated_at = $${entries.length + 1} WHERE id = $${entries.length + 2}`,
      [...values, new Date().toISOString(), id],
    )

    const [updated] = await this.db.select<TripSection[]>('SELECT * from trip_sections where id = $1', [id])
    return updated
  }

  async delete(id: string): Promise<TripSection> {
    const [toDelete] = await this.db.select<TripSection[]>('SELECT * from trip_sections where id = $1', [id])
    if (!toDelete)
      throw new Error(`Section with id ${id} not found`)
    await this.db.execute('DELETE FROM trip_sections WHERE id = $1', [id])
    return toDelete
  }
}
