import type { InjectionKey } from 'vue'
import type { IDatabaseClient } from '~/shared/services/database/model/types'

export type DatabaseService = Promise<IDatabaseClient>

export interface RequestPluginOptions {
  databaseService: DatabaseService
}

export const DatabaseServiceKey: InjectionKey<DatabaseService> = Symbol('DatabaseService')

export type DatabaseFn<T> = (db: IDatabaseClient, signal: AbortSignal) => Promise<T>

export interface UseRequestOptions<T> {
  key: string
  fn: DatabaseFn<T>
  initialData?: T | null
  force?: boolean
  cache?: boolean
  abortOnUnmount?: boolean
  cancelPrevious?: boolean
  onSuccess?: (result: T) => void | Promise<void>
  onError?: (error: unknown) => void | Promise<void>
  onAbort?: () => void | Promise<void>
}
