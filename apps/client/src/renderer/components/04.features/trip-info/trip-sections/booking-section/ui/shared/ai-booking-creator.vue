<script setup lang="ts">
import type { Booking, BookingType } from '../../models/types'
import { Icon } from '@iconify/vue'
import { useFileDialog } from '@vueuse/core'
import { computed, onUnmounted, ref } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitInput } from '~/components/01.kit/kit-input'
import { KitSelectWithSearch } from '~/components/01.kit/kit-select-with-search'
import { useRequest, useRequestStatus } from '~/plugins/request'
import { BOOKING_TYPES_CONFIG } from '../../composables'
import AttractionCard from '../cards/attraction-card.vue'
import FlightCard from '../cards/flight-card.vue'
import HotelCard from '../cards/hotel-card.vue'
import TrainCard from '../cards/train-card.vue'

type CreatorState = 'upload' | 'loading' | 'preview' | 'error'

const emit = defineEmits<{
  (e: 'save', booking: Omit<Booking, 'id'>): void
  (e: 'close'): void
}>()

const state = ref<CreatorState>('upload')
const error = ref<string | null>(null)

const selectedType = ref<BookingType>('flight')
const notes = ref<string>('')
const generatedBooking = ref<Booking | null>(null)

const uploadedFile = computed(() => files.value?.[0])

const { files, open, reset: resetFile } = useFileDialog({
  accept: '.png,.jpg,.jpeg,.pdf',
  multiple: false,
})

const bookingTypeOptions = Object.entries(BOOKING_TYPES_CONFIG).map(([key, value]) => ({
  value: key as BookingType,
  label: value.label,
  icon: value.icon,
}))

const selectedTypeIcon = computed(() => {
  return BOOKING_TYPES_CONFIG[selectedType.value]?.icon
})

const cardComponents = {
  flight: FlightCard,
  hotel: HotelCard,
  train: TrainCard,
  attraction: AttractionCard,
}
const previewCardComponent = computed(() => {
  return generatedBooking.value ? cardComponents[generatedBooking.value.type] : null
})

function resetState() {
  state.value = 'upload'
  error.value = null
  notes.value = ''
  resetFile()
  generatedBooking.value = null
}

const GENERATE_BOOKING_KEY = 'booking:generate'
const isLoading = useRequestStatus(GENERATE_BOOKING_KEY)

async function handleGenerate() {
  if (!uploadedFile.value) {
    useToast().error('Пожалуйста, выберите файл для анализа.')
    return
  }
  state.value = 'loading'
  error.value = null

  try {
    const formData = new FormData()
    formData.append('file', uploadedFile.value)
    formData.append('bookingType', selectedType.value)
    formData.append('notes', notes.value)

    const response = await useRequest({
      key: GENERATE_BOOKING_KEY,
      fn: db => db.llm.generateBookingFromData(formData),
    })

    if (!response) {
      throw new Error('Не удалось получить ответ от сервера.')
    }

    const bookingConfig = BOOKING_TYPES_CONFIG[response.type as BookingType]
    generatedBooking.value = {
      ...response,
      icon: bookingConfig.icon,
      title: response.title || bookingConfig.defaultTitle,
    } as Booking

    state.value = 'preview'
  }
  catch (e: any) {
    console.error('AI booking generation failed:', e)
    error.value = e.message || 'Не удалось распознать данные. Пожалуйста, попробуйте другой файл или добавьте больше информации в заметках.'
    state.value = 'error'
  }
}

function handleSave() {
  if (generatedBooking.value) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...bookingData } = generatedBooking.value
    emit('save', bookingData)
  }
}

function updatePreviewBooking(updatedBooking: Booking) {
  generatedBooking.value = updatedBooking
}

onUnmounted(() => {
  resetState()
})
</script>

<template>
  <div class="ai-creator-content">
    <!-- UPLOAD STATE -->
    <div v-if="state === 'upload' || state === 'error'" class="upload-view">
      <p class="description">
        Выберите тип бронирования, прикрепите файл (билет, ваучер в .pdf, .png, .jpg) и добавьте заметки.
        ИИ постарается автоматически заполнить все поля.
      </p>
      <KitSelectWithSearch
        v-model="selectedType"
        label="Тип бронирования"
        :items="bookingTypeOptions"
        :icon="selectedTypeIcon"
        :clearable="false"
        placeholder="Выберите тип бронирования"
      />
      <div class="file-input-area" @click="open()">
        <Icon icon="mdi:cloud-upload-outline" />
        <p v-if="!uploadedFile">
          Нажмите, чтобы выбрать файл, или перетащите его сюда
        </p>
        <p v-else class="file-name">
          {{ uploadedFile.name }} ({{ (uploadedFile.size / 1024).toFixed(1) }} KB)
        </p>
        <span>Поддерживаются: .png, .jpg, .jpeg, .pdf</span>
      </div>
      <KitInput
        v-model="notes"
        type="textarea"
        label="Дополнительная информация"
        placeholder="Например: 'Это билет для Ивана, место у окна' или 'Отель для двоих'"
        :rows="3"
      />
      <div v-if="state === 'error' && error" class="error-message">
        <Icon icon="mdi:alert-circle-outline" />
        <span>{{ error }}</span>
      </div>
      <div class="dialog-actions">
        <KitBtn variant="text" @click="$emit('close')">
          Отмена
        </KitBtn>
        <KitBtn :disabled="!uploadedFile || isLoading" :loading="isLoading" @click="handleGenerate">
          Сгенерировать
        </KitBtn>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="state === 'loading'" class="loading-view">
      <Icon icon="svg-spinners:3-dots-fade" />
      <p>Анализирую документ...</p>
      <span>Это может занять до 30 секунд.</span>
    </div>

    <!-- PREVIEW STATE -->
    <div v-if="state === 'preview' && generatedBooking && previewCardComponent" class="preview-view">
      <p class="description">
        Проверьте и при необходимости исправьте данные, которые удалось распознать.
      </p>
      <div class="preview-card-wrapper">
        <Component
          :is="previewCardComponent"
          :booking="generatedBooking"
          :readonly="false"
          @update:booking="updatePreviewBooking"
        />
      </div>
      <div class="dialog-actions">
        <KitBtn variant="outlined" @click="resetState">
          Назад
        </KitBtn>
        <KitBtn @click="handleSave">
          Сохранить бронирование
        </KitBtn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai-creator-content {
  min-height: 350px;
  display: flex;
  flex-direction: column;
}

.upload-view,
.preview-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  :deep(){
    .delete-btn,
    .kit-editable-controls{

    display: none;
    }
  }
}

.description {
  font-size: 0.9rem;
  color: var(--fg-secondary-color);
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.file-input-area {
  border: 2px dashed var(--border-secondary-color);
  border-radius: var(--r-m);
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border-focus-color);
    background-color: var(--bg-tertiary-color);
  }

  .iconify {
    font-size: 2.5rem;
    color: var(--fg-tertiary-color);
    margin-bottom: 0.5rem;
  }
  p {
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
  .file-name {
    color: var(--fg-accent-color);
  }
  span {
    font-size: 0.8rem;
    color: var(--fg-tertiary-color);
    margin-top: 0.25rem;
  }
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);
}

.loading-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 1rem;
  color: var(--fg-secondary-color);

  .iconify {
    font-size: 3rem;
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
  }

  span {
    font-size: 0.9rem;
  }
}

.preview-card-wrapper {
  background-color: var(--bg-primary-color);
  border-radius: var(--r-l);
  padding: 0.5rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-error-color);
  color: var(--fg-error-color);
  padding: 0.75rem 1rem;
  border-radius: var(--r-s);
  font-size: 0.9rem;

  .iconify {
    font-size: 1.2rem;
  }
}
</style>
