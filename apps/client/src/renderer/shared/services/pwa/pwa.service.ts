/* eslint-disable no-console */
/**
 * Инициализирует периодическую проверку обновлений Service Worker.
 */
export async function initializePwaUpdater(): Promise<void> {
  const isStandaloneApp = !!(window as any)?.electronAPI || import.meta.env.VITE_IS_ELECTRON === 'true'
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
    const intervalMS = 60 * 1 * 1000 // 1 минута

    registerSW({
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
  }
  catch (e) {
    console.error('Failed to initialize PWA updater:', e)
  }
}
