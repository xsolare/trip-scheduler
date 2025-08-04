import type { IDatabaseClient, IDayRepository, ITripRepository } from '../model/types'
import { DayRepository } from '../repositories/mock/day.repository'
import { TripRepository } from '../repositories/mock/trip.repository'

class MockDatabaseClient implements IDatabaseClient {
  trips!: ITripRepository
  days!: IDayRepository

  async initDb(): Promise<this> {
    this.trips = new TripRepository()
    this.days = new DayRepository()

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
