<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/image-viewer'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { ImageViewer, useImageViewer } from '~/components/01.kit/image-viewer'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { KitImage } from '~/components/01.kit/kit-image'
import { TimeField } from '~/components/01.kit/time-field'
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

  const dayDate = new Date(getSelectedDay.value.date)
  const newTimestamp = new Date(
    dayDate.getFullYear(),
    dayDate.getMonth(),
    dayDate.getDate(),
    editingTime.value.hour,
    editingTime.value.minute,
  ).toISOString()

  updateMemory({ id: props.memory.id, timestamp: newTimestamp })
  isTimeEditing.value = false
}

onClickOutside(timeEditorRef, saveTime)

const displayTime = computed(() => {
  if (!props.memory.timestamp)
    return ''
  return new Date(props.memory.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
})

function handleDelete() {
  if (confirm('Вы уверены, что хотите удалить это воспоминание?')) {
    deleteMemory(props.memory.id)
  }
}

const imageViewer = useImageViewer()
const isEditingCommentInViewer = ref(false)
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

function handleViewerCommentClick() {
  if (props.isViewMode)
    return
  isEditingCommentInViewer.value = true
}

function saveViewerComment() {
  isEditingCommentInViewer.value = false
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
</script>

<template>
  <div
    class="memory-item"
    :class="{ 'is-photo': memory.imageId, 'is-note': !memory.imageId, 'is-unsorted': isUnsorted }"
  >
    <template v-if="memory.imageId && memory.imageUrl">
      <div class="photo-wrapper" @click="openImageViewer">
        <KitImage :src="memory.imageUrl" object-fit="cover" />
        <div class="photo-overlay">
          <div v-if="memoryComment" class="memory-comment-overlay">
            <p>{{ memoryComment }}</p>
          </div>
          <div v-if="!isUnsorted && displayTime" class="memory-meta-badge">
            <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor-inline">
              <TimeField v-if="editingTime" v-model="editingTime" />
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
        <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor-container">
          <TimeField v-if="editingTime" v-model="editingTime" />
          <button class="save-time-btn" @click="saveTime">
            OK
          </button>
        </div>
        <div v-else class="time-placeholder" @click="handleTimeClick">
          <Icon icon="mdi:clock-plus-outline" />
          <span>Введите время</span>
        </div>
      </div>
    </template>

    <template v-if="!memory.imageId">
      <div class="memory-content">
        <div class="memory-comment">
          <InlineEditorWrapper
            v-model="memoryComment"
            :readonly="isViewMode"
            placeholder="Заметка..."
            class="comment-editor"
            :features="{ 'block-edit': false }"
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

    <ImageViewer
      v-model:visible="imageViewer.isOpen.value"
      v-model:current-index="imageViewer.currentIndex.value"
      :images="imageViewer.images.value"
      :close-on-overlay-click="!isEditingCommentInViewer"
    >
      <template #footer="{ image }">
        <div v-if="!isViewMode && image.meta?.memory" class="viewer-custom-footer">
          <div class="viewer-comment-section">
            <InlineEditorWrapper
              v-if="isEditingCommentInViewer"
              v-model="activeViewerComment"
              :features="{ 'block-edit': false }"
              placeholder="Комментарий..."
              class="viewer-comment-editor"
              @blur="saveViewerComment"
            />
            <div v-else class="viewer-comment-display" @click="handleViewerCommentClick">
              <p>{{ image.meta.memory.comment || 'Комментарий...' }}</p>
              <Icon icon="mdi:pencil-outline" class="edit-icon" />
            </div>
          </div>
          <div class="viewer-time-section">
            <div class="viewer-time-display">
              <TimeField
                v-model="activeViewerTime"
                :readonly="isViewMode"
                @blur="saveViewerTime"
              />
              <Icon height="16" width="16" icon="mdi:clock-outline" class="edit-icon" />
            </div>
          </div>
        </div>

        <div v-else-if="isViewMode && image.meta?.memory" class="viewer-custom-footer-readonly">
          <p v-if="image.meta.memory.comment" class="viewer-comment-readonly">
            {{ image.meta.memory.comment }}
          </p>
          <span v-if="image.meta.memory.timestamp" class="viewer-time-readonly">
            <Icon icon="mdi:clock-outline" />
            {{ new Date(image.meta.memory.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }}
          </span>
        </div>
      </template>
    </ImageViewer>
  </div>
</template>

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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    height: 140px;
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
  color: var(--fg-inverted-color);
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
  color: var(--fg-inverted-color);
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
  .comment-editor :deep(.milkdown) {
    * {
      font-size: 0.9rem;
      color: var(--fg-primary-color);
      white-space: pre-wrap;
    }
    .editor {
      padding: 4px;
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
    color: var(--fg-inverted-color);
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
  }
  .save-time-btn {
    padding: 4px 10px;
    border-radius: var(--r-s);
    background-color: var(--fg-accent-color);
    color: var(--fg-inverted-color);
  }
}

.viewer-custom-footer {
  display: flex;
  gap: 12px;
  min-width: 210px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-radius: var(--r-m);
  color: var(--fg-inverted-color);
  max-width: 600px;
  margin: 20px auto 0;
}

.viewer-comment-section,
.viewer-time-section {
  .viewer-comment-display,
  .viewer-time-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: var(--r-s);
    cursor: pointer;
    transition: background-color 0.2s ease;
    height: 48px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    p {
      margin: 0;
      flex-grow: 1;
      font-style: italic;
      color: var(--fg-inverted-color);
    }
    .edit-icon {
      opacity: 0.6;
    }
  }

  .viewer-time-display {
    width: 100px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 100%;

    :deep(.kit-time-field) {
      background-color: transparent;
    }
  }

  .viewer-comment-editor,
  .viewer-comment-display {
    display: flex;
    align-items: center;
    min-width: 170px;
    color: var(--fg-inverted-color);
  }

  .viewer-comment-editor :deep(.milkdown) {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--r-s);
    min-width: 170px;

    .editor {
      padding: 12px;
      width: 100%;
      color: var(--fg-inverted-color);

      & > * {
        color: var(--fg-inverted-color);
      }
    }
  }
}

.viewer-custom-footer-readonly {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  border-radius: var(--r-m);
  color: var(--fg-inverted-color);
  max-width: 600px;
  margin: 20px auto 0;
  text-align: center;

  .viewer-comment-readonly {
    margin: 0;
    font-size: 0.9rem;
  }

  .viewer-time-readonly {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    opacity: 0.8;
  }
}
</style>
