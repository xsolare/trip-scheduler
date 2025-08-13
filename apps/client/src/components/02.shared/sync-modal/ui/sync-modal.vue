<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useSyncStore } from '~/shared/store/sync.store'

const props = defineProps<{
  modelValue?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const syncStore = useSyncStore()
const modalRef = ref<HTMLElement | null>(null)
const isOpen = computed({
  get: () => props.modelValue || false,
  set: value => emit('update:modelValue', value),
})

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
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1)
    return 'Только что'

  if (diffMinutes < 60)
    return `${diffMinutes} мин назад`

  if (diffHours < 24)
    return `${diffHours} ч назад`

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

function handleClose() {
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleClose()
  }
}

function handleClickOutside(event: MouseEvent) {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay">
      <div ref="modalRef" class="sync-modal">
        <div class="modal-header">
          <h3>Синхронизация</h3>
          <button class="close-button" @click="handleClose">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div class="modal-content">
          <div class="sync-status">
            <div class="sync-status-header">
              <Icon
                :icon="syncStatusConfig.icon"
                class="sync-status-icon"
                :class="[{ spinning: syncStatusConfig.spin }]"
                :style="{ color: syncStatusConfig.color }"
              />
              <div class="sync-status-info">
                <div class="sync-status-label">
                  {{ syncStatusConfig.label }}
                </div>
                <div class="sync-status-time">
                  {{ formatLastSync }}
                </div>
              </div>
            </div>
          </div>

          <div class="sync-stats">
            <div class="sync-stats-item">
              <Icon icon="mdi:database-sync" class="stat-icon" />
              <span>Несинхронизированно: {{ syncStore.pendingCount }}</span>
            </div>
            <div class="sync-stats-item">
              <Icon icon="mdi:cloud-check" class="sync-stats-icon" />
              <span>В облаке: {{ syncStore.cloudCount }}</span>
            </div>
          </div>

          <hr class="divider">

          <div class="actions-section">
            <button
              class="sync-action"
              :disabled="syncStore.status === 'syncing'"
              @click="handleForceSync"
            >
              <Icon icon="mdi:refresh" class="action-icon" />
              <span>Принудительная синхронизация</span>
            </button>

            <button
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
            </button>

            <button
              class="sync-action danger"
              @click="handleClearCache"
            >
              <Icon icon="mdi:delete-sweep" class="action-icon" />
              <span>Очистить локальный кэш</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-secondary-color);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--fg-primary-color);
    }
  }

  &-content {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
  }
}

.sync {
  &-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--r-xs);
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

  &-icon {
    font-size: 16px;
    transition: transform 0.2s ease;

    &.spinning {
      animation: spin 1s linear infinite;
    }
  }

  &-modal {
    background: var(--bg-primary-color);
    border: 1px solid var(--border-primary-color);
    border-radius: var(--r-m);
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    width: 100%;
    max-width: 400px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &-status {
    &-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    &-icon {
      font-size: 20px;
      margin-top: 2px;

      &.spinning {
        animation: spin 1s linear infinite;
      }
    }

    &-info {
      flex: 1;
    }

    &-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--fg-primary-color);
      line-height: 1.4;
    }

    &-time {
      font-size: 14px;
      color: var(--fg-muted-color);
      margin-top: 4px;
    }
  }

  &-stats {
    margin: 20px 0;

    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      font-size: 14px;
      color: var(--fg-secondary-color);
    }

    &-icon {
      font-size: 16px;
      color: var(--fg-muted-color);
    }
  }

  &-action {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border-radius: var(--r-xs);
    font-size: 14px;
    color: var(--fg-primary-color);
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    text-align: left;
    user-select: none;

    &:hover:not(:disabled) {
      background-color: var(--bg-hover-color);
    }

    &:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.danger {
      color: var(--fg-error-color);

      &:hover:not(:disabled) {
        background-color: var(--bg-error-color);
      }
    }

    .action-icon {
      font-size: 16px;
      flex-shrink: 0;
    }
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

.close-button {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--r-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--fg-muted-color);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .icon {
    font-size: 20px;
  }
}

.divider {
  border: 0;
  height: 1px;
  background-color: var(--border-secondary-color);
  margin: 16px 0;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .sync-modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }
}
</style>
