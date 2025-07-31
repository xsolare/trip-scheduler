import { getActivitiesForDay, getAllTrips, getDaysForTrip, getUnsyncedChanges, markAsSynced } from './db'

interface SyncConfig {
  apiEndpoint: string
  apiKey?: string
  userId?: string
}

export class SyncManager {
  private config: SyncConfig
  private isOnline = navigator.onLine

  constructor(config: SyncConfig) {
    this.config = config
    this.setupOnlineListener()
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncToServer() // Автоматическая синхронизация при восстановлении связи
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Отправка локальных изменений на сервер
  async syncToServer(): Promise<{ success: boolean, error?: string }> {
    if (!this.isOnline) {
      return { success: false, error: 'Нет подключения к интернету' }
    }

    try {
      const changes = await getUnsyncedChanges()

      if (changes.length === 0) {
        return { success: true }
      }

      // Отправляем изменения на сервер
      const response = await fetch(`${this.config.apiEndpoint} /sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey} ` }),
        },
        body: JSON.stringify({
          userId: this.config.userId,
          changes,
        }),
      })

      if (response.ok) {
        const syncedIds = changes.map(change => change.id)
        await markAsSynced(syncedIds)
        return { success: true }
      }
      else {
        return { success: false, error: 'Ошибка сервера при синхронизации' }
      }
    }
    catch (error) {
      return { success: false, error: `Ошибка синхронизации: ${error} ` }
    }
  }

  // Получение изменений с сервера
  async syncFromServer(): Promise<{ success: boolean, error?: string }> {
    if (!this.isOnline) {
      return { success: false, error: 'Нет подключения к интернету' }
    }

    try {
      const response = await fetch(`${this.config.apiEndpoint} /sync/pull`, {
        method: 'GET',
        headers: {
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey} ` }),
        },
      })

      if (response.ok) {
        const serverData = await response.json()
        // Здесь нужно реализовать логику слияния данных
        // This is where you'd implement conflict resolution
        return { success: true }
      }
      else {
        return { success: false, error: 'Ошибка получения данных с сервера' }
      }
    }
    catch (error) {
      return { success: false, error: `Ошибка синхронизации: ${error} ` }
    }
  }

  // Полная двусторонняя синхронизация
  async fullSync(): Promise<{ success: boolean, error?: string }> {
    if (!this.isOnline) {
      return { success: false, error: 'Нет подключения к интернету' }
    }

    try {
      // Сначала отправляем локальные изменения
      const pushResult = await this.syncToServer()
      if (!pushResult.success) {
        return pushResult
      }

      // Затем получаем изменения с сервера
      const pullResult = await this.syncFromServer()
      return pullResult
    }
    catch (error) {
      return { success: false, error: `Ошибка полной синхронизации: ${error} ` }
    }
  }

  // Экспорт всех данных для бэкапа
  async exportAllData(): Promise<{
    trips: any[]
    days: any[]
    activities: any[]
    timestamp: string
  }> {
    const trips = await getAllTrips()
    const allDays: any[] = []
    const allActivities: any[] = []

    for (const trip of trips) {
      const days = await getDaysForTrip(trip.id)
      allDays.push(...days)

      for (const day of days) {
        const activities = await getActivitiesForDay(day.id)
        allActivities.push(...activities)
      }
    }

    return {
      trips,
      days: allDays,
      activities: allActivities,
      timestamp: new Date().toISOString(),
    }
  }

  // Получение статуса синхронизации
  async getSyncStatus(): Promise<{
    isOnline: boolean
    unsyncedChanges: number
    lastSyncTime?: string
  }> {
    const changes = await getUnsyncedChanges()

    return {
      isOnline: this.isOnline,
      unsyncedChanges: changes.length,
      lastSyncTime: localStorage.getItem('lastSyncTime') || undefined,
    }
  }
}
