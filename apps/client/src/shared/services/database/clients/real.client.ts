import type Database from '@tauri-apps/plugin-sql'
import type { IActivityRepository, IAuthRepository, IDatabaseClient, IDayRepository, IFileRepository, IMemoryRepository, ITripRepository } from '../model/types.ts'
import { getDb } from '../connection.ts'
import { AuthRepository } from '../repositories/real/auth.repository.ts'
import { DayRepository } from '../repositories/real/day.repository.ts'
import { FileRepository } from '../repositories/real/file.repository.ts'
import { MemoryRepository } from '../repositories/real/memory.repository.ts'
import { TripRepository } from '../repositories/real/trip.repository.ts'
import { ActivityRepository } from '../repositories/trpc/activity.repository.ts'

class RealDatabaseClient implements IDatabaseClient {
  db!: Database

  files!: IFileRepository
  trips!: ITripRepository
  days!: IDayRepository
  activities!: IActivityRepository
  memories!: IMemoryRepository
  auth!: IAuthRepository

  async initDb(): Promise<this> {
    this.db = await getDb()

    this.trips = new TripRepository(this.db)
    this.days = new DayRepository(this.db)
    this.files = new FileRepository()
    this.activities = new ActivityRepository()
    this.memories = new MemoryRepository(this.db)
    this.auth = new AuthRepository()

    return this
  }

  async getUnsyncedChanges(): Promise<Array<{
    id: number
    tableName: string
    recordId: string
    operation: string
    timestamp: string
  }>> {
    return this.db.select('SELECT * FROM sync_log WHERE synced = 0 ORDER BY timestamp ASC') || []
  }

  async markAsSynced(logIds: number[]): Promise<void> {
    if (logIds.length === 0)
      return

    const placeholders = logIds.map(() => '?').join(',')
    await this.db.execute(`UPDATE sync_log SET synced = 1 WHERE id IN (${placeholders})`, logIds)
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.db.select('SELECT 1')
      return true
    }
    catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }
}

export { RealDatabaseClient }
