import type { Activity, Day } from '~/shared/types/models/activity'
import type { Trip, TripImage, TripImagePlacement } from '~/shared/types/models/trip'

export interface ITripRepository {
  getAll: () => Promise<Trip[]>
  getById: (id: string) => Promise<Trip | null>
}

export interface IDayRepository {
  getByTripId: (tripId: string) => Promise<Day[]>
  createNewDay: (dayData: Omit<Day, 'id'>) => Promise<Day>
  updateDayDetails: (id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>) => Promise<Day>
  deleteDay: (id: string) => Promise<void>
}

export interface IActivityRepository {
  create: (activityData: Omit<Activity, 'id'>) => Promise<Activity>
  update: (activityData: Activity) => Promise<Activity>
  remove: (id: string) => Promise<Activity>
}

export interface IFileRepository {
  uploadFile: (file: File, tripId: string, placement: TripImagePlacement) => Promise<TripImage>
  listImageByTrip: (tripId: string) => Promise<TripImage[]>
  addImage: (tripId: string, imageUrl: string) => Promise<TripImage>
}

// Интерфейс для всей базы данных
export interface IDatabaseClient {
  trips: ITripRepository
  days: IDayRepository
  files: IFileRepository
  activities: IActivityRepository

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
