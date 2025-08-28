import type { IDatabaseWrapper } from '../../clients/sql.client'
import type { IMemoryRepository } from '../../model/types'
import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import { v4 as uuidv4 } from 'uuid'

export class MemoryRepository implements IMemoryRepository {
  constructor(private db: IDatabaseWrapper) { }

  async getByTripId(tripId: string): Promise<Memory[]> {
    const results = await this.db.select<Memory[]>(
      `SELECT m.*, ti.url as imageUrl
       FROM memories m
       LEFT JOIN trip_images ti ON m.image_id = ti.id
       WHERE m.trip_id = $1
       ORDER BY m.timestamp DESC, m.created_at DESC`,
      [tripId],
    )
    return results
  }

  async create(data: CreateMemoryInput): Promise<Memory> {
    const newId = uuidv4()
    await this.db.execute(
      'INSERT INTO memories (id, trip_id, timestamp, comment, image_id) VALUES ($1, $2, $3, $4, $5)',
      [newId, data.tripId, data.timestamp, data.comment, data.imageId],
    )
    const newMemory = await this.getById(newId)
    if (!newMemory)
      throw new Error('Failed to create or retrieve memory')
    return newMemory
  }

  async update(data: UpdateMemoryInput): Promise<Memory> {
    await this.db.execute(
      'UPDATE memories SET timestamp = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [data.timestamp, data.comment, data.id],
    )
    const updatedMemory = await this.getById(data.id)
    if (!updatedMemory)
      throw new Error('Failed to update or retrieve memory')
    return updatedMemory
  }

  async delete(id: string): Promise<Memory> {
    const memoryToDelete = await this.getById(id)
    if (!memoryToDelete)
      throw new Error('Memory to delete not found')
    await this.db.execute('DELETE FROM memories WHERE id = $1', [id])
    return memoryToDelete
  }

  private async getById(id: string): Promise<Memory | null> {
    const result = await this.db.select<Memory[]>(
      `SELECT m.*, ti.url as imageUrl
       FROM memories m
       LEFT JOIN trip_images ti ON m.image_id = ti.id
       WHERE m.id = $1`,
      [id],
    )
    return result[0] || null
  }
}
