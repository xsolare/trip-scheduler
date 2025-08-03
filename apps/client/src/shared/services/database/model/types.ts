import type { Day } from '~/shared/types/models/activity'
import type { Trip } from '~/shared/types/models/trip'

export interface ITripRepository {
  getAll: () => Promise<Trip[]>
  getById: (id: string) => Promise<Trip | null>
}

export interface IDayRepository {
  getByTripId: (tripId: string) => Promise<Day[]>
}

// Интерфейс для всей базы данных
export interface IDatabaseClient {
  trips: ITripRepository
  days: IDayRepository

  initDb: () => Promise<this>

  // Методы синхронизации
  getUnsyncedChanges: () => Promise<any[]>
  markAsSynced: (logIds: number[]) => Promise<void>
  testConnection: () => Promise<boolean>
}

// Режимы работы
export enum DatabaseMode {
  REAL = 'real',
  MOCK = 'mock',
}
