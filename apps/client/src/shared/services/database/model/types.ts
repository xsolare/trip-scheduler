import type { Activity, Day } from '~/shared/types/models/activity'
import type { SignInPayload, TokenPair, User } from '~/shared/types/models/auth'
import type { CreateMemoryInput, Memory, UpdateMemoryInput } from '~/shared/types/models/memory'
import type { CreateTripInput, Trip, TripImage, TripImagePlacement, TripStatus, TripWithDays, UpdateTripInput } from '~/shared/types/models/trip'

export interface TripListFilters {
  search?: string
  statuses?: TripStatus[]
  tags?: string[]
  cities?: string[]
  userIds?: string[]
}

export interface ITripRepository {
  getAll: (filters?: TripListFilters) => Promise<Trip[]>
  getById: (id: string) => Promise<Trip | null>
  getByIdWithDays: (id: string) => Promise<TripWithDays | null>
  create: (data: CreateTripInput) => Promise<Trip>
  update: (id: string, details: UpdateTripInput) => Promise<Trip>
  delete: (id: string) => Promise<Trip>
  getUniqueCities: () => Promise<string[]>
  getUniqueTags: (params: { query?: string }) => Promise<string[]>
}

export interface IDayRepository {
  getByTripId: (tripId: string) => Promise<Day[]>
  createNewDay: (dayData: Omit<Day, 'id' | 'activities'>) => Promise<Day>
  updateDayDetails: (id: string, details: Partial<Pick<Day, 'title' | 'description' | 'date'>>) => Promise<Day>
  deleteDay: (id: string) => Promise<Day>
}

export interface IActivityRepository {
  create: (activityData: Omit<Activity, 'id'>) => Promise<Activity>
  update: (activityData: Activity) => Promise<Activity>
  remove: (id: string) => Promise<Activity>
}

export interface IFileRepository {
  uploadFile: (file: File, tripId: string, placement: TripImagePlacement, timestamp?: string | null, comment?: string | null) => Promise<TripImage>
  listImageByTrip: (tripId: string, placement: TripImagePlacement) => Promise<TripImage[]>
}

export interface IAuthRepository {
  signIn: (payload: SignInPayload) => Promise<{ user: User, token: TokenPair }>
  signOut: () => Promise<void>
  refresh: (refreshToken: string) => Promise<{ token: TokenPair }>
  me: () => Promise<User>
}

// Интерфейс для всей базы данных
export interface IDatabaseClient {
  trips: ITripRepository
  days: IDayRepository
  files: IFileRepository
  activities: IActivityRepository
  memories: IMemoryRepository
  auth: IAuthRepository

  initDb: () => Promise<this>

  // Методы синхронизации
  getUnsyncedChanges: () => Promise<any[]>
  markAsSynced: (logIds: number[]) => Promise<void>
  testConnection: () => Promise<boolean>
}

export interface IMemoryRepository {
  getByTripId: (tripId: string) => Promise<Memory[]>
  create: (data: CreateMemoryInput) => Promise<Memory>
  update: (data: UpdateMemoryInput) => Promise<Memory>
  delete: (id: string) => Promise<Memory>
}

// Режимы работы
export enum DatabaseMode {
  REAL = 'real',
  MOCK = 'mock',
}
