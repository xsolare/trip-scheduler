/* eslint-disable no-console */
import type { Pinia } from 'pinia'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { usePwaStore } from '~/shared/store/pwa.store'

/**
 * Инициализирует PWA и периодическую проверку обновлений.
 */
export function initializePwaUpdater(pinia: Pinia): void {
  // const isStandaloneApp = !!(window as any)?.electronAPI || import.meta.env.VITE_IS_STANDALONE === 'true'
  // const isDisabled = isStandaloneApp || import.meta.env.VITE_DISABLE_PWA

  // if (isDisabled) {
  //   console.log('PWA updater is disabled.')
  //   return
  // }

  // if (import.meta.env.DEV || !('serviceWorker' in navigator)) {
  //   return
  // }

  const pwaStore = usePwaStore(pinia)
  const intervalMS = 60 * 1 * 1000

  const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(async () => {
          if (r.installing || !navigator.onLine)
            return

          await r.update()
        }, intervalMS)
      }
    },
    onRegisterError(error) {
      console.error('Error during Service Worker registration:', error)
    },
  })

  watch(offlineReady, (value) => {
    console.log(`App ready to work offline: ${value}`)
    pwaStore.setOfflineReady(value)
  }, { immediate: true })

  watch(needRefresh, (value) => {
    console.log(`New content available, show refresh prompt: ${value}`)
    pwaStore.setNeedRefresh(value)
  }, { immediate: true })

  pwaStore.setUpdateFunction(updateServiceWorker)
}
