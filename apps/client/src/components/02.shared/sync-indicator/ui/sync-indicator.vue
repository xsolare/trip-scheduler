<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useSyncStore } from '~/shared/store/sync.store'

const syncStore = useSyncStore()
const isOpen = ref(false)

const syncStatusConfig = computed(() => {
  switch (syncStore.status) {
    case 'syncing':
      return {
        icon: 'mdi:sync',
        color: 'var(--color-info)',
        label: 'Синхронизация...',
        spin: true,
      }
    case 'success':
      return {
        icon: 'mdi:check-circle',
        color: 'var(--color-success)',
        label: 'Синхронизировано',
        spin: false,
      }
    case 'error':
      return {
        icon: 'mdi:alert-circle',
        color: 'var(--color-error)',
        label: 'Ошибка синхронизации',
        spin: false,
      }
    case 'offline':
      return {
        icon: 'mdi:wifi-off',
        color: 'var(--color-warning)',
        label: 'Оффлайн режим',
        spin: false,
      }
    default:
      return {
        icon: 'mdi:sync',
        color: 'var(--color-muted)',
        label: 'Ожидание синхронизации',
        spin: false,
      }
  }
})

const formatLastSync = computed(() => {
  if (!syncStore.lastSyncTime)
    return 'Никогда'

  const now = new Date()
  const lastSync = new Date(syncStore.lastSyncTime)
  const diffMs = now.getTime() - lastSync.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1)
    return 'Только что'
  if (diffMinutes < 60)
    return `${diffMinutes} мин назад`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24)
    return `${diffHours} ч назад`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} дн назад`
})

async function handleForceSync() {
  await syncStore.forceSync()
  isOpen.value = false
}

function handleToggleAutoSync() {
  syncStore.toggleAutoSync()
}

async function handleClearCache() {
  await syncStore.clearCache()
  isOpen.value = false
}
</script>

<template>
  <DropdownMenuRoot v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <button class="sync-trigger">
        <Icon
          :icon="syncStatusConfig.icon"
          class="sync-icon" :class="[{ spinning: syncStatusConfig.spin }]"
          :style="{ color: syncStatusConfig.color }"
        />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent class="sync-dropdown" align="end" :side-offset="16">
        <!-- Статус синхронизации -->
        <div class="sync-status">
          <div class="status-header">
            <Icon
              :icon="syncStatusConfig.icon"
              class="status-icon" :class="[{ spinning: syncStatusConfig.spin }]"
              :style="{ color: syncStatusConfig.color }"
            />
            <div class="status-info">
              <div class="status-label">
                {{ syncStatusConfig.label }}
              </div>
              <div class="status-time">
                {{ formatLastSync }}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator class="dropdown-separator" />

        <!-- Статистика -->
        <div class="sync-stats">
          <div class="stat-item">
            <Icon icon="mdi:database-sync" class="stat-icon" />
            <span>Несинхронизированно: {{ syncStore.pendingCount }}</span>
          </div>
          <div class="stat-item">
            <Icon icon="mdi:cloud-check" class="stat-icon" />
            <span>В облаке: {{ syncStore.cloudCount }}</span>
          </div>
        </div>

        <DropdownMenuSeparator class="dropdown-separator" />

        <!-- Действия -->
        <DropdownMenuItem
          class="sync-action"
          :disabled="syncStore.status === 'syncing'"
          @click="handleForceSync"
        >
          <Icon icon="mdi:refresh" class="action-icon" />
          <span>Принудительная синхронизация</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          class="sync-action"
          @click="handleToggleAutoSync"
        >
          <Icon
            :icon="syncStore.autoSyncEnabled ? 'mdi:pause' : 'mdi:play'"
            class="action-icon"
          />
          <span>
            {{ syncStore.autoSyncEnabled ? 'Приостановить' : 'Возобновить' }} авто-синхронизацию
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="dropdown-separator" />

        <!-- Опасные действия -->
        <DropdownMenuItem
          class="sync-action danger"
          @click="handleClearCache"
        >
          <Icon icon="mdi:delete-sweep" class="action-icon" />
          <span>Очистить локальный кэш</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss" scoped>
.sync-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &:active {
    transform: scale(0.95);
  }
}

.sync-icon {
  font-size: 16px;
  transition: transform 0.2s ease;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.sync-dropdown) {
  min-width: 280px;
  padding: 8px;
  background: var(--bg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;

  &[data-side='top'] {
    animation: slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-side='right'] {
    animation: slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-side='bottom'] {
    animation: slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-side='left'] {
    animation: slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.sync-status {
  padding: 8px;

  .status-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .status-icon {
    font-size: 20px;
    margin-top: 2px;

    &.spinning {
      animation: spin 1s linear infinite;
    }
  }

  .status-info {
    flex: 1;
  }

  .status-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--fg-primary-color);
    line-height: 1.4;
  }

  .status-time {
    font-size: 12px;
    color: var(--fg-muted-color);
    margin-top: 2px;
  }
}

.sync-stats {
  padding: 4px 8px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    font-size: 13px;
    color: var(--fg-secondary-color);

    .stat-icon {
      font-size: 14px;
      color: var(--fg-muted-color);
    }
  }
}

.sync-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--fg-primary-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background-color: var(--bg-hover-color);
  }

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &.danger {
    color: #dc2626;

    &[data-highlighted] {
      background-color: var(--bg-error-color);
    }
  }

  .action-icon {
    font-size: 14px;
  }
}

.dropdown-separator {
  height: 1px;
  background-color: var(--border-secondary-color);
  margin: 4px 0;
}

// Анимации появления
@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
