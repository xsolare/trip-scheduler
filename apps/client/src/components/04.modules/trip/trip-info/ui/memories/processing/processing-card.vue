<script setup lang="ts">
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { computed, ref, shallowRef } from 'vue'
import { KitImage } from '~/components/01.kit/kit-image'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitTimeField } from '~/components/01.kit/kit-time-field'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'

const props = defineProps<{ memory: Memory }>()

const { memories: memoriesStore, data: tripDataStore } = useModuleStore(['memories', 'data'])
const { getSelectedDay } = storeToRefs(tripDataStore)

const isSaving = ref(false)
const comment = ref(props.memory.comment || '')
// Время по умолчанию 00:00. Пользователь должен его изменить.
const editingTime = shallowRef<Time>(new Time(0, 0))

/**
 * Проверяет, есть ли у фотографии оригинальная временная метка (из EXIF).
 */
const hasOriginalDate = computed(() => !!props.memory.timestamp)

/**
 * Форматирует оригинальную дату для отображения.
 */
const originalDateFormatted = computed(() => {
  if (!props.memory.timestamp)
    return ''

  return new Date(props.memory.timestamp).toLocaleDateString('ru-RU', {
    minute: '2-digit',
    hour: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

/**
 * Привязывает фотографию к текущему выбранному дню с указанным временем и комментарием.
 */
async function assignToCurrentDay() {
  const day = getSelectedDay.value
  if (!day)
    return

  isSaving.value = true
  try {
    const datePart = day.date.split('T')[0]
    const timePart = `${editingTime.value.hour.toString().padStart(2, '0')}:${editingTime.value.minute.toString().padStart(2, '0')}:00`
    const newTimestamp = new Date(`${datePart}T${timePart}`).toISOString()

    await memoriesStore.updateMemory({
      id: props.memory.id,
      timestamp: newTimestamp,
      comment: comment.value,
    })
  }
  finally {
    isSaving.value = false
  }
}

/**
 * Принимает оригинальную дату съемки (из EXIF) как основную.
 */
function applyOriginalDate() {
  memoriesStore.applyOriginalTimestamp(props.memory.id)
}

/**
 * Удаляет временную метку, делая фотографию полностью "неотсортированной".
 */
function removeDate() {
  memoriesStore.removeTimestamp(props.memory.id)
}

/**
 * Обновляет комментарий при потере фокуса редактором.
 */
function saveComment() {
  if (comment.value !== props.memory.comment) {
    memoriesStore.updateMemory({ id: props.memory.id, comment: comment.value })
  }
}
</script>

<template>
  <div class="processing-card">
    <div class="image-container">
      <KitImage :src="`${memory.imageUrl}`" class="card-image" :alt="comment || 'Фото для сортировки'" />
    </div>

    <div class="card-content">
      <!-- Блок появляется, если у фото есть дата, но она из другого дня -->
      <div v-if="hasOriginalDate" class="original-date-info">
        <Icon icon="mdi:calendar-alert" class="info-icon" />
        <span class="info-text">Снято: <strong>{{ originalDateFormatted }}</strong></span>
        <div class="info-actions">
          <button class="action-btn-text" @click="applyOriginalDate">
            Принять дату
          </button>
          <button class="action-btn-text secondary" @click="removeDate">
            Убрать дату
          </button>
        </div>
      </div>

      <div class="comment-editor-wrapper">
        <KitInlineMdEditorWrapper
          v-model="comment"
          placeholder="Добавьте комментарий..."
          :features="{ 'block-edit': false }"
          class="comment-editor"
          @blur="saveComment"
        />
      </div>

      <div class="time-assignment">
        <Icon icon="mdi:clock-plus-outline" />
        <KitTimeField v-model="editingTime" />
        <button class="assign-btn" :disabled="isSaving" @click="assignToCurrentDay">
          <Icon v-if="isSaving" icon="mdi:loading" class="spin" />
          <span v-else>Привязать</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.processing-card {
  border-radius: var(--r-m);
  overflow: hidden;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.image-container {
  height: 200px;
  width: 100%;
  background-color: var(--bg-tertiary-color);
}
.card-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.card-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.original-date-info {
  background-color: var(--bg-highlight-color);
  border: 1px solid var(--border-primary-color);
  border-radius: var(--r-s);
  padding: 10px;
  font-size: 0.85rem;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'icon text'
    'actions actions';
  gap: 4px 8px;
  align-items: center;

  .info-icon {
    grid-area: icon;
    color: var(--fg-accent-color);
    font-size: 1.1rem;
  }
  .info-text {
    grid-area: text;
    color: var(--fg-primary-color);
  }
  .info-actions {
    grid-area: actions;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border-secondary-color);
  }
}

.action-btn-text {
  background: none;
  border: none;
  padding: 0;
  color: var(--fg-accent-color);
  font-weight: 500;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    text-decoration: underline;
  }
  &.secondary {
    color: var(--fg-secondary-color);
  }
}

.comment-editor-wrapper {
  flex-grow: 1;
}
.comment-editor :deep(.milkdown) .editor {
  padding: 4px;
  min-height: 24px;
}

.time-assignment {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--fg-secondary-color);
}

.assign-btn {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: var(--r-s);
  background-color: var(--fg-accent-color);
  color: var(--fg-inverted-color);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background-color: var(--fg-accent-color-hover);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
</style>
