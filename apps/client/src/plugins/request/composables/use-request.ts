import type { Ref } from 'vue'
import type { UseRequestOptions, UseRequestReturn } from '../models/types'
import { getDatabaseService } from '../lib/service'
import { useRequestStore } from '../store/request.store'

/**
 * Реактивный composable для безопасного выполнения операций с базой данных.
 * Делегирует управление состоянием (загрузка, ошибка) в Pinia store.
 *
 * @param options - Объект с параметрами операции.
 * @returns Объект с реактивными данными и функцией `execute`.
 */
export function useRequest<T>(
  options: UseRequestOptions<T>,
): UseRequestReturn<T> {
  const {
    key,
    fn,
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
  } = options

  const store = useRequestStore()
  const data = ref<T | null>(initialData) as Ref<T | null>

  const databaseService = getDatabaseService()

  if (!store.statuses.has(key)) {
    store.setStatus(key, 'idle')
  }

  const execute = async () => {
    store.setStatus(key, 'pending')
    store.setError(key, null)

    try {
      const dbService = await databaseService
      const result = await fn(dbService)

      data.value = result
      store.setStatus(key, 'success')
      await onSuccess?.(result)

      return { data: result, error: null }
    }
    catch (e) {
      store.setError(key, e)
      store.setStatus(key, 'error')
      console.error(`[useRequest Error] (key: ${key}):`, e)
      await onError?.(e)

      return { data: null, error: e }
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    execute,
  }
}
