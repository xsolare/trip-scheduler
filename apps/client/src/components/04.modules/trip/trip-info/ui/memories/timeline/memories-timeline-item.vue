<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/kit-image-viewer'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { KitImage } from '~/components/01.kit/kit-image'
import { KitImageViewer, useImageViewer } from '~/components/01.kit/kit-image-viewer'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitTimeField } from '~/components/01.kit/kit-time-field'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'

interface Props {
  memory: Memory
  galleryImages?: ImageViewerImage[]
  isUnsorted?: boolean
  isViewMode?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  galleryImages: () => [],
  isUnsorted: false,
  isViewMode: false,
})

const store = useModuleStore(['memories', 'data'])
const { updateMemory, deleteMemory } = store.memories
const { getSelectedDay } = storeToRefs(store.data)

const memoryComment = ref(props.memory.comment || '')
// ИЗМЕНЕНО: Эта функция теперь будет вызываться по событию blur
function saveComment() {
  if (memoryComment.value !== props.memory.comment) {
    updateMemory({ id: props.memory.id, comment: memoryComment.value })
  }
}

const isTimeEditing = ref(false)
const timeEditorRef = ref<HTMLElement | null>(null)
const editingTime = shallowRef<Time | null>(null)

function handleTimeClick() {
  if (props.isViewMode)
    return
  isTimeEditing.value = true
  if (props.memory.timestamp) {
    const d = new Date(props.memory.timestamp)
    editingTime.value = new Time(d.getHours(), d.getMinutes())
  }
  else {
    editingTime.value = new Time()
  }
}

function saveTime() {
  if (!isTimeEditing.value || !editingTime.value || !getSelectedDay.value)
    return

  const datePart = getSelectedDay.value.date.split('T')[0]
  const timePart = `${editingTime.value.hour.toString().padStart(2, '0')}:${editingTime.value.minute.toString().padStart(2, '0')}:00`
  const localDateTimeString = `${datePart}T${timePart}`
  const newTimestamp = new Date(localDateTimeString).toISOString()

  updateMemory({ id: props.memory.id, timestamp: newTimestamp })
  isTimeEditing.value = false
}

const displayTime = computed(() => {
  if (!props.memory.timestamp)
    return ''
  return new Date(props.memory.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
})

function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm('Вы уверены, что хотите удалить это воспоминание?')) {
    deleteMemory(props.memory.id)
  }
}

const imageViewer = useImageViewer()
const activeViewerComment = ref('')
const activeViewerTime = shallowRef<Time | null>(null)

watch(imageViewer.currentImage, (newImage) => {
  if (newImage?.meta?.memory) {
    const mem: Memory = newImage.meta.memory
    activeViewerComment.value = mem.comment || ''
    if (mem.timestamp) {
      const d = new Date(mem.timestamp)
      activeViewerTime.value = new Time(d.getHours(), d.getMinutes())
    }
    else {
      activeViewerTime.value = null
    }
  }
}, { deep: true })

function openImageViewer() {
  if (isTimeEditing.value)
    return

  const imageList = props.galleryImages ?? []
  if (imageList.length === 0)
    return

  const startIndex = imageList.findIndex(img => img.meta?.memory?.id === props.memory.id)

  if (startIndex !== -1) {
    imageViewer.open(imageList, startIndex)
  }
}

// ИЗМЕНЕНО: Эта функция теперь будет вызываться по событию blur
function saveViewerComment() {
  const memory = imageViewer.currentImage.value?.meta?.memory
  if (memory && activeViewerComment.value !== (memory.comment || '')) {
    updateMemory({ id: memory.id, comment: activeViewerComment.value })
  }
}

function saveViewerTime() {
  const memory = imageViewer.currentImage.value?.meta?.memory
  const day = getSelectedDay.value
  if (!memory || !activeViewerTime.value || !day)
    return

  const dayDate = new Date(day.date)
  const newTimestamp = new Date(
    dayDate.getFullYear(),
    dayDate.getMonth(),
    dayDate.getDate(),
    activeViewerTime.value.hour,
    activeViewerTime.value.minute,
  ).toISOString()

  if (newTimestamp !== memory.timestamp) {
    updateMemory({ id: memory.id, timestamp: newTimestamp })
  }
}

onClickOutside(timeEditorRef, saveTime)
</script>

<template>
  <div
    class="memory-item"
    :class="{ 'is-photo': memory.imageId, 'is-note': !memory.imageId, 'is-unsorted': isUnsorted }"
  >
    <template v-if="memory.imageId && memory?.image?.url">
      <!-- ... Часть с фото остается без изменений ... -->
      <div class="photo-wrapper" @click="openImageViewer">
        <KitImage :src="memory!.image!.url" object-fit="cover" />
        <div class="photo-overlay">
          <div v-if="memoryComment" class="memory-comment-overlay">
            <p>{{ memoryComment }}</p>
          </div>
          <div v-if="!isUnsorted && displayTime" class="memory-meta-badge">
            <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor-inline">
              <KitTimeField v-if="editingTime" v-model="editingTime" />
              <button class="save-time-btn-inline" @click.stop="saveTime">
                <Icon icon="mdi:check" />
              </button>
            </div>
            <span v-else @click.stop="handleTimeClick">{{ displayTime }}</span>
          </div>
          <div class="memory-actions">
            <button v-if="!isViewMode" title="Удалить" @click.stop="handleDelete">
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="isUnsorted" class="unsorted-time-setter">
        <Icon height="18" width="18" icon="mdi:clock-plus-outline" />
        <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor-container">
          <KitTimeField v-if="editingTime" v-model="editingTime" />
          <button class="save-time-btn" @click="saveTime">
            OK
          </button>
        </div>
        <div v-else class="time-placeholder" @click="handleTimeClick">
          <span>Введите время</span>
        </div>
      </div>
    </template>

    <template v-if="!memory.imageId">
      <div class="memory-content">
        <div class="memory-comment">
          <KitInlineMdEditorWrapper
            v-model="memoryComment"
            :readonly="isViewMode"
            :features="{
              'block-edit': false,
              'image-block': false,
              'list-item': false,
              'link-tooltip': false,
              'toolbar': false,
            }"
            placeholder="Заметка..."
            class="comment-editor"
            @blur="saveComment"
          />
        </div>
      </div>
      <div class="note-footer" :class="{ isEditing: !isViewMode }">
        <div v-if="!isUnsorted && displayTime" class="memory-meta">
          <span>{{ displayTime }}</span>
        </div>
        <div v-if="!isViewMode" class="memory-actions is-note-actions">
          <button title="Удалить" @click="handleDelete">
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      </div>
    </template>

    <KitImageViewer
      v-model:visible="imageViewer.isOpen.value"
      v-model:current-index="imageViewer.currentIndex.value"
      :images="imageViewer.images.value"
      :close-on-overlay-click="true"
    >
      <template #footer="{ image }">
        <div
          v-if="image.meta?.memory"
          class="viewer-custom-footer"
          :class="{ 'is-readonly': isViewMode }"
        >
          <div class="viewer-comment-section">
            <KitInlineMdEditorWrapper
              v-model="activeViewerComment"
              :readonly="isViewMode"
              :features="{
                'block-edit': false,
                'image-block': false,
                'list-item': false,
                'link-tooltip': false,
                'toolbar': false,
              }"
              placeholder="Комментарий..."
              class="viewer-comment-editor"
              @blur="saveViewerComment"
            />
          </div>
          <div class="viewer-time-section">
            <div class="viewer-time-display">
              <KitTimeField
                v-model="activeViewerTime"
                :readonly="isViewMode"
                @blur="saveViewerTime"
              />
              <Icon height="18" width="18" icon="mdi:clock-outline" class="time-icon" />
            </div>
          </div>
        </div>
      </template>
    </KitImageViewer>
  </div>
</template>

<!-- ИЗМЕНЕНО: Стили адаптированы для KitInlineMdEditorWrapper -->
<style scoped lang="scss">
.memory-item {
  position: relative;
  border-radius: var(--r-m);
  background-color: var(--bg-secondary-color);
  overflow: hidden;

  &.is-note {
    position: relative;
    display: flex;
    padding: 4px;
    gap: 8px;
    min-height: auto;
    grid-column: 1 / -1;
    width: 100%;

    .note-footer {
      position: absolute;
      bottom: 4px;
      right: 16px;
      gap: 12px;
      width: auto;

      &.isEditing {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        bottom: 0px;
        right: 0px;

        .memory-meta {
          margin-top: auto;
        }
      }
      &:not(.isEditing) {
        right: 4px;
        background-color: var(--bg-secondary-color);
        border-radius: var(--r-full);
        border: 1px solid var(--border-secondary-color);
        padding: 0 8px;
      }
    }
  }

  &.is-photo {
    display: flex;
    flex-direction: column;
    height: 300px;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--s-m);
    }
  }

  &.is-unsorted {
    height: auto;
    cursor: default;
  }
}

.photo-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .is-unsorted & {
    height: 200px;
  }

  :deep(img) {
    transition: transform 0.3s ease;
  }

  &:hover :deep(img) {
    transform: scale(1.05);
  }
}

.photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 40%),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 30%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .photo-wrapper:hover &::before {
    opacity: 1;
  }
}

.memory-comment-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 12px 12px;
  color: white;
  font-size: 0.9rem;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  z-index: 2;

  .photo-wrapper:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  p {
    margin: 0;
    white-space: pre-wrap;
    max-height: 100px;
    overflow-y: auto;
  }
}

.memory-meta-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: var(--r-full);
  z-index: 3;
  transition: background-color 0.2s ease;

  :deep(.kit-time-field) {
    background-color: transparent;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.memory-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  width: 100%;
}

.memory-meta {
  color: var(--fg-secondary-color);
  font-size: 0.75rem;
}

.memory-comment {
  width: 100%;
  // Стили для редактора заметки
  .comment-editor {
    :deep(.milkdown .editor) {
      padding: 4px;
      font-size: 0.9rem;
      color: var(--fg-primary-color);
      white-space: pre-wrap;
      line-height: 1.5;
      min-height: 28px;
      p {
        margin: 0;
      }
      &:hover {
        background-color: var(--bg-hover-color);
      }
    }
    :deep(.prosemirror-editor-wrapper[readonly]) .editor:hover {
      background-color: transparent;
    }
  }
}

.memory-actions {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.2s ease;

  .photo-wrapper:hover & {
    opacity: 1;
  }

  &.is-note-actions {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    opacity: 0;
    transition: opacity 0.2s ease;

    .memory-item:hover & {
      opacity: 1;
    }
  }

  button {
    background: rgba(var(--bg-primary-color-rgb), 0.7);
    backdrop-filter: blur(4px);
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-full);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--fg-secondary-color);

    &:hover {
      color: var(--fg-error-color);
      border-color: var(--fg-error-color);
    }
  }
}

.time-editor-inline {
  display: flex;
  align-items: center;
  gap: 4px;

  :deep(.time-field) {
    background-color: transparent;
  }

  .save-time-btn-inline {
    background: var(--fg-accent-color);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.unsorted-time-setter {
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-tertiary-color);

  .time-placeholder {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fg-accent-color);
    cursor: pointer;
    font-weight: 500;
    font-size: 0.8rem;
  }
  .time-editor-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    .save-time-btn {
      padding: 4px 10px;
      border-radius: var(--r-s);
      background-color: var(--fg-accent-color);
      color: white;
      margin-left: auto;
    }
  }
}

.viewer-custom-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-width: 210px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  border-radius: var(--r-m);
  color: white;
  max-width: 600px;
  margin: 20px auto 0;
  transition: all 0.2s ease;
  width: 100%;

  &.is-readonly {
    gap: 8px;
    background: rgba(0, 0, 0, 0.7);
    padding: 12px 16px;
    text-align: center;
  }
}

.viewer-comment-section {
  flex-grow: 1;
  color: white;
}

.viewer-time-section {
  flex-shrink: 0;
}

// Стили для редактора в Image Viewer
.viewer-comment-editor {
  :deep(.milkdown) {
    .editor {
      padding: 8px;
      border-radius: var(--r-s);
      min-height: 48px;
      transition: background-color 0.2s ease;
      p {
        margin: 0;
      }
    }
    &:not([readonly]) .editor:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &.is-readonly {
    font-size: 1rem;
    pointer-events: none;
    :deep(.milkdown .editor) {
      padding: 0;
    }
  }
}

.viewer-time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  width: 100px;
  opacity: 0.7;

  :deep(.kit-time-field) {
    background-color: transparent;
  }

  .is-readonly & {
    font-size: 1rem;
    width: auto;
    gap: 6px;
  }
}
</style>
