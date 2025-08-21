import type { Pinia } from 'pinia'
import { useAuthStore } from '~/shared/store/auth.store'

/**
 * Плагин восстановления сессии.
 * Выполняется один раз при загрузке приложения.
 * @param pinia - Экземпляр Pinia.
 */
export async function restoreSession(pinia: Pinia): Promise<void> {
  const authStore = useAuthStore(pinia)

  if (authStore.isInitialized) {
    return
  }

  try {
    if (authStore.tokenPair?.accessToken) {
      await authStore.me()
    }

    else if (authStore.tokenPair?.refreshToken) {
      await authStore.refresh()
      await authStore.me()
    }
  }
  catch (error) {
    console.error('Не удалось восстановить сессию:', error)
    authStore.clearAuth()
  }
  finally {
    authStore.isInitialized = true
  }
}
