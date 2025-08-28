import type { IActivityRepository, IAuthRepository, IDatabaseClient, IDayRepository, IFileRepository, IMemoryRepository, ITripRepository } from '../model/types.ts'
import { ActivityRepository } from '../repositories/sql/activity.repository.ts'
import { AuthRepository } from '../repositories/sql/auth.repository.ts'
import { DayRepository } from '../repositories/sql/day.repository.ts'
import { FileRepository } from '../repositories/sql/file.repository.ts'
import { MemoryRepository } from '../repositories/sql/memory.repository.ts'
import { TripRepository } from '../repositories/sql/trip.repository.ts'

export interface IDatabaseWrapper {
  select: <T>(sql: string, params?: any[]) => Promise<T>
  execute: (
    sql: string,
    params?: any[]
  ) => Promise<{ rowsAffected: number, lastInsertId: number }>
}

class SqlDatabaseClient implements IDatabaseClient {
  db!: IDatabaseWrapper

  files!: IFileRepository
  trips!: ITripRepository
  days!: IDayRepository
  activities!: IActivityRepository
  memories!: IMemoryRepository
  auth!: IAuthRepository

  async initDb(): Promise<this> {
    if (!window.electronAPI) {
      throw new Error(
        'Electron API is not available. Ensure you are in an Electron environment and the preload script is correctly configured.',
      )
    }

    this.db = {
      select: async (sql, params) => {
        const { data, error } = await window.electronAPI.db.query(sql, params)
        if (error)
          throw new Error(error)
        return data as any
      },
      execute: async (sql, params) => {
        const { data, error } = await window.electronAPI.db.execute(sql, params)
        if (error)
          throw new Error(error)
        return data
      },
    }

    this.trips = new TripRepository(this.db)
    this.days = new DayRepository(this.db)
    this.files = new FileRepository()
    this.activities = new ActivityRepository()
    this.memories = new MemoryRepository(this.db)
    this.auth = new AuthRepository() // This is a mock, doesn't use the DB

    return this
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

  async getUnsyncedChanges(): Promise<any[]> {
    // This logic needs to be implemented using the new DB wrapper if needed
    return this.db.select('SELECT * FROM sync_log WHERE synced = 0 ORDER BY timestamp ASC')
  }

  async markAsSynced(logIds: number[]): Promise<void> {
    const placeholders = logIds.map(() => '?').join(',')
    await this.db.execute(`UPDATE sync_log SET synced = 1 WHERE id IN (${placeholders})`, logIds)
  }
}

export { SqlDatabaseClient }
