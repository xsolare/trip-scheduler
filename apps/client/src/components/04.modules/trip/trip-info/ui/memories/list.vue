<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useFileDialog } from '@vueuse/core'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import { TripImagePlacement } from '~/shared/types/models/trip'
import MemoriesItem from './item.vue'

const { memories, gallery, data: tripData } = useModuleStore(['memories', 'gallery', 'data'])
const { timelineMemories, unsortedMemories, isLoading } = storeToRefs(memories)

const { open, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: true,
})

const isUploading = ref(false)

onChange(async (files) => {
  if (!files)
    return
  isUploading.value = true
  const tripId = tripData.currentTripId
  if (!tripId)
    return

  // Последовательная загрузка файлов
  for (const file of Array.from(files)) {
    // TODO: Добавить логику извлечения EXIF на клиенте
    // const exifData = await ExifReader.load(file);
    // const timestamp = exifData.DateTimeOriginal?.value;

    // Пока без EXIF, timestamp будет null
    await gallery.uploadImage(file, TripImagePlacement.MEMORIES)
  }

  // Перезагружаем воспоминания, чтобы отобразить новые
  memories.fetchMemories(tripId)
  isUploading.value = false
})

function handleAddTextNote() {
  const tripId = tripData.currentTripId
  if (!tripId)
    return

  const newComment = prompt('Введите текст заметки:')
  if (newComment) {
    memories.createMemory({
      tripId,
      comment: newComment,
      timestamp: new Date().toISOString(), // Используем текущее время для заметки
    })
  }
}

const sortedDates = computed(() => {
  return Object.keys(timelineMemories.value).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
})
</script>

<template>
  <div class="memories-list">
    <!-- Блок загрузки -->
    <div class="upload-section">
      <button class="upload-button" :disabled="isUploading" @click="() => open()">
        <Icon :icon="isUploading ? 'mdi:loading' : 'mdi:upload'" :class="{ spin: isUploading }" />
        <span>{{ isUploading ? 'Загрузка...' : 'Загрузить фотографии' }}</span>
      </button>
      <button class="add-note-button" @click="handleAddTextNote">
        <Icon icon="mdi:note-plus-outline" />
        <span>Добавить заметку</span>
      </button>
    </div>

    <!-- Блок для несортированных фото -->
    <div v-if="unsortedMemories.length > 0" class="unsorted-section">
      <h4>Фотографии для сортировки</h4>
      <p>Добавьте дату и время, чтобы эти фото появились в вашей ленте.</p>
      <div class="unsorted-grid">
        <MemoriesItem
          v-for="memory in unsortedMemories"
          :key="memory.id"
          :memory="memory"
          is-unsorted
        />
      </div>
    </div>

    <!-- Лента воспоминаний -->
    <div v-if="sortedDates.length > 0" class="timeline-section">
      <div v-for="date in sortedDates" :key="date" class="timeline-group">
        <h3 class="timeline-date">
          {{ new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </h3>
        <div class="timeline-items">
          <MemoriesItem
            v-for="memory in timelineMemories[date]"
            :key="memory.id"
            :memory="memory"
          />
        </div>
      </div>
    </div>

    <!-- Состояние загрузки или пустое состояние -->
    <div v-if="isLoading" class="state-info">
      Загрузка воспоминаний...
    </div>
    <div v-else-if="memories.memories.length === 0" class="state-info">
      <p>Здесь пока пусто.</p>
      <p>Добавьте свои первые фотографии или заметки, чтобы создать ленту воспоминаний!</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Стили будут добавлены в отдельном файле или ниже */
.memories-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.upload-section {
  display: flex;
  gap: 16px;
  padding: 24px;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-l);
  border: 1px solid var(--border-secondary-color);
}

.upload-button,
.add-note-button {
  flex: 1;
  padding: 16px;
  border-radius: var(--r-s);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.upload-button {
  background-color: transparent;
  border: 2px dashed var(--border-primary-color);
  color: var(--fg-accent-color);

  &:hover:not(:disabled) {
    background-color: var(--bg-hover-color);
    border-color: var(--fg-accent-color);
  }
}

.add-note-button {
  background-color: var(--bg-tertiary-color);
  border: 2px solid var(--bg-tertiary-color);
  color: var(--fg-primary-color);

  &:hover:not(:disabled) {
    background-color: var(--bg-hover-color);
  }
}

.unsorted-section {
  padding: 16px;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-m);
  h4 {
    margin: 0 0 4px;
  }
  p {
    margin: 0 0 16px;
    color: var(--fg-secondary-color);
    font-size: 0.9rem;
  }
}

.unsorted-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.timeline-group {
  position: relative;
  padding-left: 24px;
  border-left: 2px solid var(--border-secondary-color);
  margin-bottom: 32px;

  &:last-child {
    border-left-color: transparent;
  }
}

.timeline-date {
  position: relative;
  top: -8px;
  left: -37px;
  display: inline-block;
  background-color: var(--bg-primary-color);
  padding: 4px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--fg-secondary-color);
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.state-info {
  text-align: center;
  padding: 40px;
  color: var(--fg-secondary-color);
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
