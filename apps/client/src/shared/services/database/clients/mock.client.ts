import type { IActivityRepository, IDatabaseClient, IDayRepository, IFileRepository, ITripRepository } from '../model/types'
import { DayRepository } from '../repositories/mock/day.repository'
import { TripRepository } from '../repositories/mock/trip.repository'
import { FileRepository } from '../repositories/real/file.repository'
import { ActivityRepository } from '../repositories/trpc/activity.repository'

class MockDatabaseClient implements IDatabaseClient {
  files!: IFileRepository
  trips!: ITripRepository
  days!: IDayRepository
  activities!: IActivityRepository

  async initDb(): Promise<this> {
    this.trips = new TripRepository()
    this.days = new DayRepository()
    this.files = new FileRepository()
    this.activities = new ActivityRepository()

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
