<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Activity } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { useFileDialog } from '@vueuse/core'
import { computed, ref } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitTimeField } from '~/components/01.kit/kit-time-field'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-module'
import { memoryToViewerImage } from '~/components/05.modules/trip-info/lib/helpers'
import ProcessingQueue from './processing/processing-queue.vue'
import UploadingQueue from './processing/uploading-queue.vue'
import MemoriesTimeline from './timeline/memories-timeline.vue'

const { memories, data: tripData, ui } = useModuleStore(['memories', 'data', 'ui'])
const { memoriesForSelectedDay, memoriesToProcess, getProcessingMemories, isLoadingMemories: isLoading } = storeToRefs(memories)

const { getActivitiesForSelectedDay } = storeToRefs(tripData)
const { isViewMode } = storeToRefs(ui)

const { open: openFileDialog, onChange, reset } = useFileDialog({
  accept: 'image/*',
  multiple: true,
})

const isProcessing = computed(() => getProcessingMemories.value.length > 0)

const galleryImages = computed<ImageViewerImage[]>(() => {
  return memoriesForSelectedDay.value
    .map(memory => memoryToViewerImage(memory))
    .filter((img): img is NonNullable<typeof img> => !!img)
})

const isAddNoteModalVisible = ref(false)
const newNoteText = ref('')
const newNoteTime = shallowRef<Time | null>(null)

function handleAddTextNote() {
  newNoteText.value = ''
  newNoteTime.value = new Time(12, 0)
  isAddNoteModalVisible.value = true
}

function onModalClose() {
  isAddNoteModalVisible.value = false
}

function saveNewNote() {
  if (!newNoteTime.value)
    return

  const tripId = tripData.currentTripId
  const day = tripData.getSelectedDay
  if (!tripId || !day || !newNoteText.value.trim())
    return

  const datePart = day.date.split('T')[0]
  const timePart = `${newNoteTime.value.hour.toString().padStart(2, '0')}:${newNoteTime.value.minute.toString().padStart(2, '0')}:00`
  const newTimestamp = `${datePart}T${timePart}.000Z`

  memories.createMemory({
    tripId,
    comment: newNoteText.value.trim(),
    timestamp: newTimestamp,
  })
  onModalClose()
}

function handleUpdateActivity({ activity, data }: { activity: Activity, data: Partial<Activity> }) {
  tripData.updateActivity(activity.dayId, { ...activity, ...data })
}

onChange((files) => {
  if (!files || files.length === 0)
    return

  Array.from(files).forEach(file => memories.uploadMemoryImage(file))

  reset()
})
</script>

<template>
  <div class="memories-list">
    <div v-if="!isViewMode" class="upload-section">
      <button class="upload-button" :disabled="isProcessing" @click="() => openFileDialog()">
        <Icon :icon="isProcessing ? 'mdi:loading' : 'mdi:camera-plus-outline'" :class="{ spin: isProcessing }" />
        <span>{{ isProcessing ? `Загрузка (${getProcessingMemories.length})...` : 'Загрузить фотографии' }}</span>
      </button>
      <button class="add-note-button" @click="handleAddTextNote">
        <Icon icon="mdi:note-plus-outline" />
        <span>Добавить заметку</span>
      </button>
    </div>

    <!-- Новый компонент для отображения процесса загрузки -->
    <UploadingQueue
      v-if="isProcessing"
      :processing-memories="getProcessingMemories"
      @cancel="memories.cancelMemoryUpload"
      @retry="memories.retryMemoryUpload"
      @remove="memories.removeProcessingMemory"
    />

    <ProcessingQueue v-if="!isViewMode && memoriesToProcess.length > 0" />

    <MemoriesTimeline
      v-if="memoriesForSelectedDay.length > 0 || getActivitiesForSelectedDay.length > 0"
      :activities="getActivitiesForSelectedDay"
      :memories="memoriesForSelectedDay"
      :is-view-mode="isViewMode"
      :gallery-images="galleryImages"
      @update-activity="handleUpdateActivity"
    />

    <div v-if="isLoading" class="state-info">
      Загрузка воспоминаний...
    </div>
    <div v-else-if="memories.memories.length === 0 && !isProcessing" class="state-info">
      <p>В этом дне пока нет воспоминаний.</p>
      <p>Добавьте свои первые фотографии или заметки, чтобы создать ленту этого дня!</p>
    </div>

    <KitDialogWithClose
      v-model:visible="isAddNoteModalVisible"
      title="Добавить заметку"
      icon="mdi:note-plus-outline"
      @update:visible="!$event && onModalClose()"
    >
      <div class="add-note-content">
        <textarea v-model="newNoteText" placeholder="Введите текст заметки..." class="note-textarea" />
        <div class="time-picker">
          <label for="note-time">Время:</label>
          <KitTimeField id="note-time" v-model="newNoteTime" />
        </div>
      </div>
      <div class="add-note-footer">
        <KitBtn variant="text" @click="onModalClose">
          Отмена
        </KitBtn>
        <KitBtn :disabled="!newNoteText.trim()" @click="saveNewNote">
          Сохранить
        </KitBtn>
      </div>
    </KitDialogWithClose>
  </div>
</template>

<style scoped lang="scss">
.memories-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-l);
  border: 1px solid var(--border-secondary-color);
  margin-top: 16px;

  @include media-up(sm) {
    flex-direction: row;
  }
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
  &:disabled {
    cursor: wait;
    opacity: 0.7;
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

.state-info {
  text-align: center;
  padding: 48px 24px;
  color: var(--fg-secondary-color);
  border: 2px dashed var(--border-secondary-color);
  border-radius: var(--r-l);
  p {
    margin: 0;
    line-height: 1.6;
    &:first-child {
      font-weight: 500;
      font-size: 1.1rem;
      color: var(--fg-primary-color);
      margin-bottom: 8px;
    }
  }
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

.add-note-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}
.note-textarea {
  width: 100%;
  min-height: 120px;
  border-radius: var(--r-s);
  border: 1px solid var(--border-secondary-color);
  background-color: var(--bg-primary-color);
  color: var(--fg-primary-color);
  padding: 8px;
  font-family: inherit;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: var(--fg-accent-color);
  }
}
.time-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--fg-secondary-color);
}
.add-note-footer {
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
