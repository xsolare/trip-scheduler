import type { InjectionKey, Ref } from 'vue'
import type { IDatabaseClient } from '~/shared/services/database/model/types'

// Тип для сервиса, который мы будем передавать
export type DatabaseService = Promise<IDatabaseClient>

// Опции, которые принимает наш плагин при установке
export interface RequestPluginOptions {
  databaseService: DatabaseService
}

// Ключ для Provide / Inject. Обеспечивает типобезопасность.
export const DatabaseServiceKey: InjectionKey<DatabaseService> = Symbol('DatabaseService')

/** Тип для функции, выполняющей запрос к БД */
export type DatabaseFn<T> = (db: IDatabaseClient) => Promise<T>

/** Опции для composable `useRequest` */
export interface UseRequestOptions<T> {
  /** Уникальный ключ для операции. Используется для отслеживания состояния. */
  key: string

  /** Функция, выполняющая асинхронную операцию с базой данных. */
  fn: DatabaseFn<T>

  /**
   * Следует ли выполнять операцию немедленно при инициализации.
   * @default true
   */
  immediate?: boolean

  /**
   * Начальное значение для `data` до первого выполнения.
   * @default null
   */
  initialData?: T | null

  /**
   * Коллбэк, который вызывается при успешном завершении операции.
   * @param result - Результат выполнения `fn`.
   */
  onSuccess?: (result: T) => void | Promise<void>

  /**
   * Коллбэк, который вызывается при ошибке во время операции.
   * @param error - Перехваченная ошибка.
   */
  onError?: (error: unknown) => void | Promise<void>
}

/** Возвращаемое значение из `useRequest` */
export interface UseRequestReturn<T> {
  /** Реактивная переменная, хранящая данные, полученные от `fn`. */
  data: Ref<T | null>

  /**
   * Функция для ручного запуска (или повторного запуска) операции.
   * Возвращает Promise с результатом.
   */
  execute: () => Promise<{ data: T | null, error: unknown | null }>
}
