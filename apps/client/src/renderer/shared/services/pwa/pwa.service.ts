/* eslint-disable no-console */
import type { Pinia } from 'pinia'
import { usePwaStore } from '~/shared/store/pwa.store'

/**
 * Инициализирует периодическую проверку обновлений Service Worker.
 * @param pinia - Экземпляр Pinia для доступа к стору.
 */
export async function initializePwaUpdater(pinia: Pinia): Promise<void> {
  const isStandaloneApp = !!(window as any)?.electronAPI || import.meta.env.VITE_IS_STANDALONE === 'true'
  const isDisabled = isStandaloneApp || import.meta.env.VITE_DISABLE_PWA

  if (isDisabled) {
    console.log('PWA updater is disabled.')
    return
  }

  if (import.meta.env.DEV || !('serviceWorker' in navigator)) {
    return
  }

  try {
    const moduleName = 'virtual:pwa-register'
    const pwaModule = await import(/* @vite-ignore */ moduleName).catch(() => null)

    if (!pwaModule) {
      console.log('PWA module not available, skipping PWA initialization.')
      return
    }

    const { registerSW } = pwaModule
    const pwaStore = usePwaStore(pinia)
    const intervalMS = 60 * 1 * 1000 // 1 минута

    const updateServiceWorker = registerSW({
      // Когда SW готов к работе в оффлайне
      onOfflineReady() {
        console.log('App ready to work offline.')
        pwaStore.setOfflineReady(true)
      },
      // Когда доступно обновление
      onNeedRefresh() {
        console.log('New content available, show refresh prompt.')
        pwaStore.setNeedRefresh(true)
      },
      // @ts-expect-error dynamic module
      onRegisteredSW(swUrl, r) {
        if (r) {
          setInterval(async () => {
            if (r.installing || !navigator)
              return
            if (('connection' in navigator) && !navigator.onLine)
              return

            const resp = await fetch(swUrl, {
              cache: 'no-store',
              headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache',
              },
            })

            if (resp?.status === 200) {
              await r.update()
            }
          }, intervalMS)
        }
      },
      onRegisterError(error: unknown) {
        console.error('Error during Service Worker registration:', error)
      },
    })

    pwaStore.setUpdateFunction(updateServiceWorker)
  }
  catch (e) {
    console.error('Failed to initialize PWA updater:', e)
  }
}
