import type { ComputedRef, Ref } from 'vue'
import type { IDatabaseClient } from '~/shared/services/database/model/types'
import databaseServicePromise from '~/shared/services/database'

/** Возможные статусы асинхронной операции */
type DatabaseStatus = 'idle' | 'pending' | 'success' | 'error'

/** Тип для функции, выполняющей запрос к БД */
type DatabaseFn<T> = (db: IDatabaseClient) => Promise<T>

/** Опции для composable `useDatabase` */
export interface UseDatabaseOptions<T> {
  /** Функция, выполняющая асинхронную операцию с базой данных. */
  fn: DatabaseFn<T>

  /**
   * Уникальный ключ для операции. Используется для логгирования ошибок.
   * @optional
   */
  key?: string

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

/** Возвращаемое значение из `useDatabase` */
export interface UseDatabaseReturn<T> {
  /** Реактивная переменная, хранящая данные, полученные от `fn`. */
  data: Ref<T | null>

  /** Текущий статус операции ('idle', 'pending', 'success', 'error'). */
  status: Ref<DatabaseStatus>

  /** Реактивная переменная, хранящая ошибку, если она произошла. */
  error: Ref<unknown | null>

  /** Computed-свойство, `true` если операция в процессе выполнения. */
  isPending: ComputedRef<boolean>

  /** Computed-свойство, `true` если операция завершена (успешно или с ошибкой). */
  isFinished: ComputedRef<boolean>

  /**
   * Функция для ручного запуска (или повторного запуска) операции.
   * Возвращает Promise с результатом.
   */
  execute: () => Promise<{ data: T | null, error: unknown | null }>
}

/**
 * Реактивный composable для безопасного выполнения операций с базой данных.
 * Управляет состоянием (данные, загрузка, ошибка) и предоставляет
 * инструменты для взаимодействия с ним.
 *
 * @param options - Объект с параметрами операции.
 * @returns Объект с реактивными переменными и функцией `execute`.
 */
export function useDatabase<T>(
  options: UseDatabaseOptions<T>,
): UseDatabaseReturn<T> {
  const {
    fn,
    key,
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
  } = options

  const data = ref<T | null>(initialData)
  const status = ref<DatabaseStatus>('idle')
  const error = ref<unknown | null>(null)

  const isPending = computed(() => status.value === 'pending')
  const isFinished = computed(() => status.value === 'success' || status.value === 'error')

  const execute = async () => {
    status.value = 'pending'
    error.value = null

    try {
      const dbService = await databaseServicePromise
      const result = await fn(dbService)

      data.value = result
      status.value = 'success'
      await onSuccess?.(result)

      return { data: result, error: null }
    }
    catch (e) {
      error.value = e
      status.value = 'error'
      const errorKey = key ? ` (key: ${key})` : ''
      console.error(`[useDatabase Error]${errorKey}:`, e)
      await onError?.(e)

      return { data: null, error: e }
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data: data as Ref<T | null>,
    status,
    error,
    isPending,
    isFinished,
    execute,
  }
}
