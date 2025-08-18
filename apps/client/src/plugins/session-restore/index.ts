import type { Pinia } from 'pinia'
import { useAuthStore } from '~/shared/store/auth.store'

/**
 * Асинхронный инициализатор для восстановления сессии пользователя.
 * Вызывается в main.ts после создания Pinia, но до монтирования приложения.
 * @param pinia - Экземпляр Pinia.
 */
export async function restoreSession(pinia: Pinia): Promise<void> {
  const authStore = useAuthStore(pinia)

  if (authStore.tokenPair?.refreshToken) {
    try {
      await authStore.refresh()
      await authStore.me()
    }
    catch (error) {
      console.error('Не удалось восстановить сессию:', error)
    }
  }
}
