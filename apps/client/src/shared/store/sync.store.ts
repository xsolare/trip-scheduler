export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline'

interface SyncState {
  status: SyncStatus
  lastSyncTime: string | null
  pendingCount: number
  cloudCount: number
  autoSyncEnabled: boolean
  wifiOnlySync: boolean
  error: string | null
}

export const useSyncStore = defineStore('sync', {
  state: (): SyncState => ({
    status: 'idle',
    lastSyncTime: null,
    pendingCount: 0,
    cloudCount: 0,
    autoSyncEnabled: true,
    wifiOnlySync: false,
    error: null,
  }),

  actions: {
    async forceSync() {
      this.status = 'syncing'
      this.error = null

      try {
        // TODO
        // Имитация синхронизации
        await new Promise(resolve => setTimeout(resolve, 2000))

        this.status = 'success'
        this.lastSyncTime = new Date().toISOString()
        this.pendingCount = 0
        this.cloudCount += this.pendingCount

        // Автоматически сбрасываем статус через 3 секунды
        setTimeout(() => {
          if (this.status === 'success') {
            this.status = 'idle'
          }
        }, 3000)
      }
      catch (error) {
        this.status = 'error'
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка'
      }
    },

    toggleAutoSync() {
      this.autoSyncEnabled = !this.autoSyncEnabled
    },

    async clearCache() {
      this.pendingCount = 0
      this.lastSyncTime = null
      this.status = 'idle'
    },

    setOfflineMode(offline: boolean) {
      this.status = offline ? 'offline' : 'idle'
    },

    incrementPendingCount() {
      this.pendingCount++
    },
  },
})
