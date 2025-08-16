<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { getLocalTimeZone, parseDate, Time } from '@internationalized/date'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitImage } from '~/components/01.kit/kit-image'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitTimeField } from '~/components/01.kit/kit-time-field'
import { useToast } from '~/components/01.kit/kit-toast'
import { CalendarPopover } from '~/components/02.shared/calendar-popover'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'

const props = defineProps<{ memory: Memory }>()

const { memories: memoriesStore, data: tripDataStore } = useModuleStore(['memories', 'data'])
const { getSelectedDay, getAllDays } = storeToRefs(tripDataStore)
const toast = useToast()

const comment = ref(props.memory.comment || '')
const memoryDate = computed(() => (props.memory.timestamp ? new Date(props.memory.timestamp) : null))

const selectedDate = shallowRef<CalendarDate>(
  memoryDate.value
    ? parseDate(memoryDate.value.toISOString().split('T')[0])
    : parseDate(getSelectedDay.value!.date.split('T')[0]),
)

const selectedTime = shallowRef<Time>(
  memoryDate.value
    ? new Time(memoryDate.value.getHours(), memoryDate.value.getMinutes())
    : new Time(12, 0),
)

const isSaving = ref(false)
const isDeleting = ref(false)

const validTripDates = computed(() => {
  if (!getAllDays.value)
    return new Set<string>()

  const dates = getAllDays.value.map(day => day.date.split('T')[0])

  return new Set(dates)
})

watch(getSelectedDay, (newDay) => {
  if (newDay && !props.memory.timestamp)
    selectedDate.value = parseDate(newDay.date.split('T')[0])
})

const selectedDateFormatted = computed(() => {
  const date = selectedDate.value.toDate(getLocalTimeZone())
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}.${month}.${day}`
})

async function handleApply() {
  if (!selectedDate.value || !selectedTime.value)
    return

  const selectedDateStr = selectedDate.value.toString()
  if (!validTripDates.value.has(selectedDateStr)) {
    toast.error('Выбранная дата не существует в рамках этого путешествия.')
    return
  }

  isSaving.value = true
  try {
    const datePart = selectedDate.value.toString()
    const timePart = `${selectedTime.value.hour.toString().padStart(2, '0')}:${selectedTime.value.minute.toString().padStart(2, '0')}:00`
    const newTimestamp = `${datePart}T${timePart}.000Z`

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

async function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm('Вы уверены, что хотите удалить это воспоминание?')) {
    isDeleting.value = true
    try {
      await memoriesStore.deleteMemory(props.memory.id)
    }
    finally {
      isDeleting.value = false
    }
  }
}

function handleResetDate() {
  if (getSelectedDay.value)
    selectedDate.value = parseDate(getSelectedDay.value.date.split('T')[0])
}

function applyOriginalDate() {
  memoriesStore.applyOriginalTimestamp(props.memory.id)
}

function removeDate() {
  memoriesStore.removeTimestamp(props.memory.id)
}

function saveComment() {
  if (comment.value !== props.memory.comment)
    memoriesStore.updateMemory({ id: props.memory.id, comment: comment.value })
}
</script>

<template>
  <div class="processing-card">
    <div class="image-container">
      <KitImage :src="memory.image?.url" class="card-image" :alt="comment || 'Фото для сортировки'" />
    </div>

    <div class="card-content">
      <!-- <div v-if="hasOriginalDate" class="original-date-info">
        <Icon icon="mdi:calendar-alert" class="info-icon" />
        <span class="info-text">Снято: <strong>{{ originalDateFormatted }}</strong></span>
        <div class="info-actions">
          <KitBtn variant="outlined" color="primary" @click="applyOriginalDate">
            Принять дату
          </KitBtn>
          <KitBtn variant="outlined" color="secondary" @click="removeDate">
            Убрать дату
          </KitBtn>
        </div>
      </div> -->

      <div class="comment-editor-wrapper">
        <KitInlineMdEditorWrapper
          v-model="comment"
          placeholder="Добавьте комментарий..."
          :features="{
            'block-edit': false,
            'image-block': false,
            'list-item': false,
            'link-tooltip': false,
            'toolbar': false,
          }"
          class="comment-editor"
          @blur="saveComment"
        />
      </div>

      <div class="assignment-controls">
        <div class="date-time-selectors">
          <CalendarPopover v-model="selectedDate">
            <template #trigger>
              <KitBtn
                variant="outlined"
                color="secondary"
                icon="mdi:calendar-blank-outline"
                class="date-selector"
              >
                {{ selectedDateFormatted }}
              </KitBtn>
            </template>
            <template #footer>
              <KitBtn
                variant="solid"
                color="secondary"
                class="reset-date-in-popover"
                icon="mdi:calendar-refresh-outline"
                @click="handleResetDate"
              >
                Сбросить на текущий день
              </KitBtn>
            </template>
          </CalendarPopover>

          <!-- Выбор времени -->
          <div class="time-selector">
            <Icon icon="mdi:clock-outline" />
            <KitTimeField v-model="selectedTime" />
          </div>
        </div>

        <div class="action-buttons">
          <KitBtn
            variant="outlined"
            color="secondary"
            :disabled="isDeleting"
            title="Удалить"
            class="delete-btn"
            @click="handleDelete"
          >
            <Icon v-if="isDeleting" icon="mdi:loading" class="spin" />
            <Icon v-else icon="mdi:trash-can-outline" />
          </KitBtn>
          <KitBtn
            color="primary"
            :disabled="isSaving"
            class="apply-btn"
            @click="handleApply"
          >
            <Icon v-if="isSaving" icon="mdi:loading" class="spin" />
            <span v-else>Применить</span>
          </KitBtn>
        </div>
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
    box-shadow: var(--s-m);
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
  gap: 4px;
  flex-grow: 1;
}

.comment-editor-wrapper {
  flex-grow: 1;
  border-bottom: 1px solid var(--border-secondary-color);
}

.comment-editor :deep(.milkdown) .editor {
  padding: 4px;
  min-height: 24px;
}

.assignment-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.date-time-selectors {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: stretch;
  width: 100%;
}

.date-selector,
.time-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: var(--r-s);
  font-size: 0.8rem;
  font-family: inherit;
  color: var(--fg-secondary-color);
  flex-grow: 0;
  flex-shrink: 0;
  height: 34px;
  box-sizing: border-box;
  border: none;
}

.date-selector {
  color: var(--fg-primary-color);
  font-weight: 400;
  padding: 6px 8px !important;
}

.time-selector {
  flex-grow: 1;

  :deep(.kit-time-field) {
    background-color: transparent;
    border: none;
    padding: 0;
    color: var(--fg-primary-color);
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.delete-btn {
  min-width: 38px;
  padding: 0.625rem !important;

  &:hover:not(:disabled) {
    background-color: var(--bg-error-color) !important;
    color: var(--fg-error-color) !important;
    border-color: var(--border-error-color) !important;
  }
}

.apply-btn {
  flex-grow: 1;
}

.reset-date-in-popover {
  width: 100%;
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
