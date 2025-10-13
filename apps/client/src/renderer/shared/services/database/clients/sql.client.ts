import type { IAccountRepository, IActivityRepository, IAuthRepository, ICommentRepository, ICommunityRepository, IDatabaseClient, IDayRepository, IFileRepository, ILLMRepository, IMemoryRepository, ITripRepository, ITripSectionRepository } from '../model/types.ts'
import { AccountRepository } from '../repositories/sql/account.repository.ts'
import { ActivityRepository } from '../repositories/sql/activity.repository.ts'
import { AuthRepository } from '../repositories/sql/auth.repository.ts'
import { CommentRepository } from '../repositories/sql/comment.repository.ts'
import { CommunityRepository } from '../repositories/sql/community.repository.ts'
import { DayRepository } from '../repositories/sql/day.repository.ts'
import { FileRepository } from '../repositories/sql/file.repository.ts'
import { LLMRepository } from '../repositories/sql/llm.repository.ts'
import { MemoryRepository } from '../repositories/sql/memory.repository.ts'
import { TripSectionRepository } from '../repositories/sql/trip-section.repository.ts'
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

  account!: IAccountRepository
  tripSections!: ITripSectionRepository
  files!: IFileRepository
  trips!: ITripRepository
  days!: IDayRepository
  activities!: IActivityRepository
  memories!: IMemoryRepository
  auth!: IAuthRepository
  comments!: ICommentRepository
  community!: ICommunityRepository
  llm!: ILLMRepository

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

    this.account = new AccountRepository()
    this.tripSections = new TripSectionRepository(this.db)
    this.trips = new TripRepository(this.db)
    this.days = new DayRepository(this.db)
    this.files = new FileRepository()
    this.activities = new ActivityRepository()
    this.memories = new MemoryRepository(this.db)
    this.auth = new AuthRepository()
    this.comments = new CommentRepository()
    this.community = new CommunityRepository()
    this.llm = new LLMRepository()

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
    return this.db.select('SELECT * FROM sync_log WHERE synced = 0 ORDER BY timestamp ASC')
  }

  async markAsSynced(logIds: number[]): Promise<void> {
    const placeholders = logIds.map(() => '?').join(',')
    await this.db.execute(`UPDATE sync_log SET synced = 1 WHERE id IN (${placeholders})`, logIds)
  }
}

export { SqlDatabaseClient }
