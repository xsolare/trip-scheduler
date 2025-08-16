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
  timelineGroups?: any[]
}
const props = withDefaults(defineProps<Props>(), {
  galleryImages: () => [],
  isUnsorted: false,
  isViewMode: false,
  timelineGroups: () => [],
})

const store = useModuleStore(['memories', 'data'])
const { updateMemory, deleteMemory, removeTimestamp } = store.memories
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
    editingTime.value = new Time(d.getUTCHours(), d.getUTCMinutes())
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

  const newTimestamp = `${datePart}T${timePart}.000Z`

  updateMemory({ id: props.memory.id, timestamp: newTimestamp })
  isTimeEditing.value = false
}

const displayTime = computed(() => {
  if (!props.memory.timestamp)
    return ''

  const d = new Date(props.memory.timestamp)
  const hours = d.getUTCHours().toString().padStart(2, '0')
  const minutes = d.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
})

function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm('Вы уверены, что хотите удалить это воспоминание?')) {
    deleteMemory(props.memory.id)
  }
}

function handleRemoveTimestamp() {
  // eslint-disable-next-line no-alert
  if (confirm('Убрать временную метку? Воспоминание будет перемещено в блок "Фотографии для обработки".')) {
    removeTimestamp(props.memory.id)
  }
}

const imageViewer = useImageViewer()
const activeViewerComment = ref('')
const activeViewerActivityTitle = ref('')
const activeViewerTime = shallowRef<Time | null>(null)

const formattedActiveViewerTime = computed(() => {
  if (!activeViewerTime.value)
    return ''
  const hours = String(activeViewerTime.value.hour).padStart(2, '0')
  const minutes = String(activeViewerTime.value.minute).padStart(2, '0')
  return `${hours}:${minutes}`
})

watch(imageViewer.currentImage, (newImage) => {
  if (newImage?.meta?.memory) {
    const mem: Memory = newImage.meta.memory
    activeViewerComment.value = mem.comment || ''
    if (mem.timestamp) {
      const d = new Date(mem.timestamp)
      activeViewerTime.value = new Time(d.getUTCHours(), d.getUTCMinutes())
    }
    else {
      activeViewerTime.value = null
    }
    const memoryId = mem.id
    const group = props.timelineGroups?.find(g => g.memories.some((m: Memory) => m.id === memoryId))
    activeViewerActivityTitle.value = group ? group.title : ''
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

  const datePart = day.date.split('T')[0]
  const timePart = `${activeViewerTime.value.hour.toString().padStart(2, '0')}:${activeViewerTime.value.minute.toString().padStart(2, '0')}:00`

  const newTimestamp = `${datePart}T${timePart}.000Z`

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
            <button v-if="!isViewMode && memory.timestamp" title="Убрать временную метку" @click.stop="handleRemoveTimestamp">
              <Icon icon="mdi:calendar-remove-outline" />
            </button>
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
          <button v-if="memory.timestamp" title="Убрать временную метку" @click="handleRemoveTimestamp">
            <Icon icon="mdi:calendar-remove-outline" />
          </button>
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
              v-if="!isViewMode"
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
            <div v-else>
              <span class="activity-title">
                {{ activeViewerActivityTitle }}
              </span>
              <hr v-if="activeViewerComment && activeViewerActivityTitle">
              <span class="activity-comment">
                {{ activeViewerComment }}
              </span>
            </div>
          </div>
          <div class="viewer-time-section">
            <div class="viewer-time-display">
              <KitTimeField
                v-if="!isViewMode"
                v-model="activeViewerTime"
                :readonly="isViewMode"
                @blur="saveViewerTime"
              />
              <span v-else>{{ formattedActiveViewerTime }}</span>
              <Icon height="19" width="19" icon="mdi:clock-outline" class="time-icon" />
            </div>
          </div>
        </div>
      </template>
    </KitImageViewer>
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
  top: 8px;
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
  height: 28px;

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
  display: flex;
  gap: 4px;

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
    background: var(--bg-primary-color);
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-full);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--fg-inverted-color);
    transition: all 0.2s;

    &:hover {
      color: var(--fg-primary-color);
      border-color: var(--border-primary-color);
    }
  }

  button[title='Удалить'] {
    color: var(--fg-error-color);
    border-color: var(--fg-error-color);
  }

  button[title='Убрать временную метку'] {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
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
    background: rgba(0, 0, 0, 0.2);
    padding: 12px 16px;
    text-align: center;
  }
}

.viewer-comment-section {
  flex-grow: 1;
  color: white;
  opacity: 0.8;

  .activity-comment {
    font-size: 0.9rem;
  }
  .activity-title {
    font-size: 1rem;
  }

  hr {
    border: 1px solid white;
    opacity: 0.1;
    width: 90%;
    margin: 8px auto;
  }

  &:hover {
    opacity: 1;
  }
}

.viewer-time-section {
  flex-shrink: 0;
}

.viewer-comment-editor {
  :deep(.milkdown) {
    .editor {
      padding: 8px;
      border-radius: var(--r-s);
      min-height: 48px;
      transition: background-color 0.2s ease;
      color: white;

      p {
        margin: 0;
        font-size: 0.9rem;
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
