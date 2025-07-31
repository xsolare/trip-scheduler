import { SyncManager } from '~/shared/lib/sync'

const syncManager = new SyncManager({
  apiEndpoint: 'https://your-api.com/api', // TODO
  apiKey: 'your-api-key', // TODO
  userId: 'current-user-id', // TODO
})

export function useSync() {
  const isOnline = ref(navigator.onLine)
  const isSyncing = ref(false)
  const syncStatus = ref<{
    isOnline: boolean
    unsyncedChanges: number
    lastSyncTime?: string
  }>({
    isOnline: navigator.onLine,
    unsyncedChanges: 0,
  })

  // Обновление статуса синхронизации
  const updateSyncStatus = async () => {
    try {
      syncStatus.value = await syncManager.getSyncStatus()
    }
    catch (error) {
      console.error('Ошибка получения статуса синхронизации:', error)
    }
  }

  // Обновление статуса подключения
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    updateSyncStatus()
  }

  // Ручная синхронизация
  const manualSync = async (): Promise<{ success: boolean, message: string }> => {
    if (isSyncing.value) {
      return { success: false, message: 'Синхронизация уже выполняется' }
    }

    isSyncing.value = true

    try {
      const result = await syncManager.fullSync()

      if (result.success) {
        localStorage.setItem('lastSyncTime', new Date().toISOString())
        await updateSyncStatus()
        return { success: true, message: 'Синхронизация завершена успешно' }
      }
      else {
        return { success: false, message: result.error || 'Ошибка синхронизации' }
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      }
    }
    finally {
      isSyncing.value = false
    }
  }

  // Экспорт данных для бэкапа
  const exportData = async (): Promise<Blob> => {
    const data = await syncManager.exportAllData()
    const jsonString = JSON.stringify(data, null, 2)
    return new Blob([jsonString], { type: 'application/json' })
  }

  // Инициализация
  onMounted(() => {
    // Слушатели для статуса подключения
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Начальное обновление статуса
    updateSyncStatus()

    // Автоматическая синхронизация каждые 5 минут (если онлайн)
    const syncInterval = setInterval(async () => {
      if (isOnline.value && !isSyncing.value && syncStatus.value.unsyncedChanges > 0) {
        await syncManager.syncToServer()
        await updateSyncStatus()
      }
    }, 5 * 60 * 1000)

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(syncInterval)
    })
  })

  return {
    isOnline: readonly(isOnline),
    isSyncing: readonly(isSyncing),
    syncStatus: readonly(syncStatus),
    manualSync,
    exportData,
    updateSyncStatus,
  }
}
