<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useSync } from '~/shared/composables/use-sync'

const { isOnline, isSyncing, syncStatus, manualSync } = useSync()

async function handleManualSync() {
  const result = await manualSync()

  if (result.success) {
    // Можно показать уведомление об успехе
    console.log(result.message)
  }
  else {
    // Можно показать уведомление об ошибке
    console.error(result.message)
  }
}

function formatLastSync(timestamp?: string) {
  if (!timestamp)
    return 'Никогда'

  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1)
    return 'Только что'
  if (diffInMinutes < 60)
    return `${diffInMinutes} мин. назад`
  if (diffInMinutes < 1440)
    return `${Math.floor(diffInMinutes / 60)} ч. назад`
  return `${Math.floor(diffInMinutes / 1440)} дн. назад`
}
</script>

<template>
  <div class="sync-indicator">
    <button
      class="sync-button"
      :class="{
        online: isOnline,
        offline: !isOnline,
        syncing: isSyncing,
      }"
      :disabled="isSyncing"
      :title="isOnline ? 'Синхронизация доступна' : 'Нет подключения к интернету'"
      @click="handleManualSync"
    >
      <Icon
        v-if="isSyncing"
        icon="mdi:loading"
        class="sync-icon spinning"
      />
      <Icon
        v-else-if="isOnline"
        icon="mdi:cloud-sync"
        class="sync-icon"
      />
      <Icon
        v-else
        icon="mdi:cloud-off-outline"
        class="sync-icon"
      />
    </button>

    <div class="sync-info">
      <div class="connection-status">
        <span
          class="status-dot"
          :class="{ online: isOnline, offline: !isOnline }"
        />
        {{ isOnline ? 'Онлайн' : 'Офлайн' }}
      </div>

      <div v-if="syncStatus.unsyncedChanges > 0" class="unsynced-badge">
        {{ syncStatus.unsyncedChanges }}
      </div>

      <div class="last-sync">
        Синхронизация: {{ formatLastSync(syncStatus.lastSyncTime) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sync-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  font-size: 0.875rem;
}

.sync-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;

  &.online {
    background-color: rgba(34, 197, 94, 0.1);
    color: rgb(34, 197, 94);

    &:hover {
      background-color: rgba(34, 197, 94, 0.2);
    }
  }

  &.offline {
    background-color: rgba(239, 68, 68, 0.1);
    color: rgb(239, 68, 68);
  }

  &.syncing {
    background-color: rgba(59, 130, 246, 0.1);
    color: rgb(59, 130, 246);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.sync-icon {
  font-size: 1.25rem;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

.sync-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: var(--fg-primary-color);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.online {
    background-color: rgb(34, 197, 94);
  }

  &.offline {
    background-color: rgb(239, 68, 68);
  }
}

.unsynced-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background-color: rgb(239, 68, 68);
  color: white;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.last-sync {
  color: var(--fg-secondary-color);
  font-size: 0.75rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
