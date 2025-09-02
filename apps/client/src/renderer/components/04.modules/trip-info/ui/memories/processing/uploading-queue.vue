<script setup lang="ts">
import type { IProcessingMemory } from '../../../store/trip-info-memories.store'
import { Icon } from '@iconify/vue'
import UploadingCard from './uploading-card.vue'

defineProps<{
  processingMemories: IProcessingMemory[]
}>()

const emit = defineEmits<{
  (e: 'cancel', tempId: string): void
  (e: 'retry', tempId: string): void
  (e: 'remove', tempId: string): void
}>()
</script>

<template>
  <div class="processing-queue">
    <div class="queue-header">
      <div class="header-content">
        <h4><Icon icon="mdi:upload-multiple" /> Загрузка файлов ({{ processingMemories.length }})</h4>
        <p>Ваши фотографии загружаются на сервер. Вы можете отменить загрузку в любой момент.</p>
      </div>
    </div>
    <div class="queue-content">
      <div class="queue-grid">
        <UploadingCard
          v-for="memory in processingMemories"
          :key="memory.tempId"
          :memory="memory"
          @cancel="emit('cancel', memory.tempId)"
          @retry="emit('retry', memory.tempId)"
          @remove="emit('remove', memory.tempId)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.processing-queue {
  padding: 24px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-l);
  margin-bottom: 32px;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-secondary-color);
  margin-bottom: 16px;

  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 8px;
    color: var(--fg-primary-color);
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--fg-secondary-color);
  }
}

.header-content {
  flex-grow: 1;
}

.queue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>
