import type { IActivityRepository, IAuthRepository, IDatabaseClient, IDayRepository, IFileRepository, IMemoryRepository, ITripRepository } from '../model/types'
import { AuthRepository } from '../repositories/mock/auth.repository'
import { DayRepository } from '../repositories/mock/day.repository'
import { MemoryRepository } from '../repositories/mock/memory.repository'
import { TripRepository } from '../repositories/mock/trip.repository'
import { FileRepository } from '../repositories/real/file.repository'
import { ActivityRepository } from '../repositories/trpc/activity.repository'

class MockDatabaseClient implements IDatabaseClient {
  files!: IFileRepository
  trips!: ITripRepository
  days!: IDayRepository
  activities!: IActivityRepository
  memories!: IMemoryRepository
  auth!: IAuthRepository

  async initDb(): Promise<this> {
    this.trips = new TripRepository()
    this.days = new DayRepository()
    this.files = new FileRepository()
    this.activities = new ActivityRepository()
    this.memories = new MemoryRepository()
    this.auth = new AuthRepository()

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
