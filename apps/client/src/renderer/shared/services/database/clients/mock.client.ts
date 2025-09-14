import type { IAccountRepository, IActivityRepository, IAuthRepository, ICommentRepository, IDatabaseClient, IDayRepository, IFileRepository, IMemoryRepository, ITripRepository, ITripSectionRepository } from '../model/types'
import { AccountRepository } from '../repositories/mock/account.repository'
import { AuthRepository } from '../repositories/mock/auth.repository'
import { CommentRepository } from '../repositories/mock/comment.repository'
import { DayRepository } from '../repositories/mock/day.repository'
import { FileRepository } from '../repositories/mock/file.repository'
import { MemoryRepository } from '../repositories/mock/memory.repository'
import { TripSectionRepository } from '../repositories/mock/trip-section.repository'
import { TripRepository } from '../repositories/mock/trip.repository'
import { ActivityRepository } from '../repositories/trpc/activity.repository'

class MockDatabaseClient implements IDatabaseClient {
  account!: IAccountRepository
  tripSections!: ITripSectionRepository
  files!: IFileRepository
  trips!: ITripRepository
  days!: IDayRepository
  activities!: IActivityRepository
  memories!: IMemoryRepository
  auth!: IAuthRepository
  comments!: ICommentRepository

  async initDb(): Promise<this> {
    this.account = new AccountRepository()
    this.tripSections = new TripSectionRepository()
    this.trips = new TripRepository()
    this.days = new DayRepository()
    this.files = new FileRepository()
    this.activities = new ActivityRepository()
    this.memories = new MemoryRepository()
    this.auth = new AuthRepository()
    this.comments = new CommentRepository()

    return this
  }

  async getUnsyncedChanges(): Promise<any[]> {
    // В моке синхронизация не предполагается
    return Promise.resolve([])
  }

  async markAsSynced(): Promise<void> {
    // В моке ничего не помечаем
    return Promise.resolve()
  }

  async testConnection(): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export { MockDatabaseClient }
