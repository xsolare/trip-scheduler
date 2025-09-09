<script setup lang="ts">
import type { IProcessingMemory } from '../../store/trip-memories.store'
import { Icon } from '@iconify/vue'
import { KitImage } from '~/components/01.kit/kit-image'

defineProps<{
  memory: IProcessingMemory
}>()

const emit = defineEmits(['cancel', 'retry', 'remove'])
</script>

<template>
  <div class="uploading-card" :class="`status-${memory.status}`">
    <div class="image-container">
      <KitImage :src="memory.previewUrl" class="card-image" alt="Uploading preview" />
      <div class="overlay">
        <div v-if="memory.status === 'uploading'" class="status-indicator">
          <Icon width="24" height="24" icon="mdi:loading" class="spin" />
          <span>Загрузка...</span>
        </div>
        <div v-if="memory.status === 'error'" class="status-indicator error">
          <Icon width="24" height="24" icon="mdi:alert-circle-outline" />
          <span>Ошибка</span>
        </div>

        <div class="actions">
          <button v-if="memory.status === 'uploading'" title="Отменить" @click="emit('cancel')">
            <Icon icon="mdi:close" />
          </button>
          <button v-if="memory.status === 'error'" title="Повторить" @click="emit('retry')">
            <Icon icon="mdi:refresh" />
          </button>
          <button v-if="memory.status === 'error'" title="Удалить" @click="emit('remove')">
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      </div>
    </div>
    <div class="file-name" :title="memory.file.name">
      {{ memory.file.name }}
    </div>
    <div v-if="memory.error" class="error-message" :title="memory.error">
      {{ memory.error }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.uploading-card {
  border-radius: var(--r-m);
  overflow: hidden;
  border: 1px solid var(--border-secondary-color);
  background: var(--bg-tertiary-color);

  &.status-error {
    border-color: var(--border-error-color);
  }
}
.image-container {
  height: 120px;
  position: relative;
}
.card-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.status-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  &.error {
    color: var(--fg-error-color);
  }
}
.actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;

  button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  }
}
.file-name {
  padding: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.error-message {
  padding: 0 8px 8px;
  font-size: 0.75rem;
  color: var(--fg-error-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spin {
  animation: spin 1s linear infinite;
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
