<script setup lang="ts">
import type { Booking, FlightData, FlightSegment } from '../../models/types'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { KitAnimatedTooltip } from '~/components/01.kit/kit-animated-tooltip'
import BookingCardWrapper from '../shared/booking-card-wrapper.vue'
import BookingDateTimeField from '../shared/booking-date-time-field.vue'
import BookingField from '../shared/booking-field.vue'
import BookingTextareaField from '../shared/booking-textarea-field.vue'

interface Props {
  booking: Booking & { type: 'flight' }
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['delete', 'update:booking'])

// --- COMPUTED PROPERTIES ---

const segments = computed(() => props.booking.data.segments || [])
const firstSegment = computed(() => segments.value[0])
const lastSegment = computed(() => segments.value[segments.value.length - 1])

/**
 * Форматирует дату и время для отображения
 */
function formatDateTime(isoString?: string) {
  if (!isoString)
    return { time: '', date: '' }
  const date = new Date(isoString)
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' })
  return { time, date: dateStr }
}

/**
 * Преобразует миллисекунды в строку "Чч Мм"
 */
function formatDuration(ms: number) {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.round((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}ч ${minutes}м`
}

/**
 * Общая продолжительность всего путешествия в миллисекундах.
 * Это 100% нашей временной шкалы.
 */
const totalDurationMs = computed(() => {
  if (!firstSegment.value?.departureDateTime || !lastSegment.value?.arrivalDateTime)
    return 0
  return new Date(lastSegment.value.arrivalDateTime).getTime() - new Date(firstSegment.value.departureDateTime).getTime()
})

/**
 * Общая продолжительность в отформатированном виде.
 */
const totalDurationFormatted = computed(() => {
  return formatDuration(totalDurationMs.value)
})

/**
 * Создает плоский массив всех "частей" путешествия (полеты и пересадки)
 * с рассчитанной шириной в процентах для визуализации.
 */
const journeySegments = computed(() => {
  if (totalDurationMs.value === 0 || segments.value.length === 0)
    return []

  const journeyParts = []
  const totalMs = totalDurationMs.value

  for (let i = 0; i < segments.value.length; i++) {
    const segment = segments.value[i]

    // Добавляем полетный сегмент
    const flightDurationMs = new Date(segment.arrivalDateTime!).getTime() - new Date(segment.departureDateTime!).getTime()
    journeyParts.push({
      type: 'flight',
      widthPercent: (flightDurationMs / totalMs) * 100,
      tooltip: `В полете: ${formatDuration(flightDurationMs)}`,
    })

    // Добавляем сегмент пересадки (если это не последний полет)
    if (i < segments.value.length - 1) {
      const nextSegment = segments.value[i + 1]
      const layoverDurationMs = new Date(nextSegment.departureDateTime!).getTime() - new Date(segment.arrivalDateTime!).getTime()
      journeyParts.push({
        type: 'layover',
        widthPercent: (layoverDurationMs / totalMs) * 100,
        tooltip: `Пересадка: ${formatDuration(layoverDurationMs)}`,
      })
    }
  }

  return journeyParts
})

/**
 * Продолжительность одного сегмента
 */
function segmentDuration(segment: FlightSegment) {
  if (!segment.departureDateTime || !segment.arrivalDateTime)
    return ''
  return formatDuration(
    new Date(segment.arrivalDateTime).getTime() - new Date(segment.departureDateTime).getTime(),
  )
}

function updateTitle(newTitle: string) {
  emit('update:booking', { ...props.booking, title: newTitle })
}

function updateDataField<K extends keyof FlightData>(key: K, value: FlightData[K]) {
  emit('update:booking', {
    ...props.booking,
    data: { ...props.booking.data, [key]: value },
  })
}

/**
 * Обновляет поле в конкретном сегменте перелета.
 * @param segmentIndex - Индекс сегмента в массиве.
 * @param key - Ключ поля в объекте сегмента.
 * @param value - Новое значение.
 */
function updateSegmentField<K extends keyof FlightSegment>(segmentIndex: number, key: K, value: FlightSegment[K]) {
  const newSegments = JSON.parse(JSON.stringify(props.booking.data.segments || []))
  if (newSegments[segmentIndex]) {
    newSegments[segmentIndex][key] = value
    emit('update:booking', {
      ...props.booking,
      data: {
        ...props.booking.data,
        segments: newSegments,
      },
    })
  }
}
</script>

<template>
  <BookingCardWrapper
    :title="booking.title"
    :icon="booking.icon"
    :readonly="readonly"
    @delete="$emit('delete')"
    @update:title="updateTitle"
  >
    <div v-if="firstSegment" class="card-content">
      <div class="time-info">
        <div class="time">
          {{ formatDateTime(firstSegment.departureDateTime).time }}
        </div>
        <div class="city">
          {{ firstSegment.departureCity }}
        </div>
        <div class="date">
          {{ formatDateTime(firstSegment.departureDateTime).date }}
        </div>
      </div>

      <div class="route-visualizer">
        <div class="total-duration">
          В пути: {{ totalDurationFormatted }}
        </div>
        <div class="route-line">
          <template v-for="(part, index) in journeySegments" :key="index">
            <!-- Оборачиваем каждый сегмент в тултип -->
            <KitAnimatedTooltip
              :name="part.tooltip"
              :style="{ width: `${part.widthPercent}%` }"
              :offset="6"
            >
              <div
                class="journey-part"
                :class="{
                  'part-flight': part.type === 'flight',
                  'part-layover': part.type === 'layover',
                }"
              />
            </KitAnimatedTooltip>
          </template>
        </div>
        <div class="airports">
          <span>{{ firstSegment.departureAirport }}</span>
          <span>{{ lastSegment.arrivalAirport }}</span>
        </div>
      </div>

      <div class="time-info arrival">
        <div class="time">
          {{ formatDateTime(lastSegment.arrivalDateTime).time }}
        </div>
        <div class="city">
          {{ lastSegment.arrivalCity }}
        </div>
        <div class="date">
          {{ formatDateTime(lastSegment.arrivalDateTime).date }}
        </div>
      </div>
    </div>

    <template #details>
      <div class="details-grid">
        <template v-for="(segment, index) in segments" :key="segment.flightNumber">
          <!-- Layover Info Block -->
          <div v-if="index > 0" class="layover-details span-2">
            <Icon icon="mdi:clock-outline" />
            Пересадка в г. {{ segments[index - 1].arrivalCity }} ({{ segments[index - 1].arrivalAirport }})
            <span>{{ formatDuration(new Date(segment.departureDateTime!).getTime() - new Date(segments[index - 1].arrivalDateTime!).getTime()) }}</span>
          </div>

          <!-- Segment Details -->
          <div class="segment-header span-2">
            Рейс {{ index + 1 }}
          </div>
          <BookingField :model-value="segment.airline" label="Авиакомпания" icon="mdi:compass-rose" :readonly="readonly" @update:model-value="updateSegmentField(index, 'airline', $event)" />
          <BookingField :model-value="segment.flightNumber" label="Номер рейса" icon="mdi:pound" :readonly="readonly" @update:model-value="updateSegmentField(index, 'flightNumber', $event)" />
          <BookingField :model-value="segment.departureCity" label="Город вылета" icon="mdi:city-variant-outline" :readonly="readonly" @update:model-value="updateSegmentField(index, 'departureCity', $event)" />
          <BookingField :model-value="segment.arrivalCity" label="Город прилета" icon="mdi:city-variant-outline" :readonly="readonly" @update:model-value="updateSegmentField(index, 'arrivalCity', $event)" />
          <BookingField :model-value="segment.departureAirport" label="Аэропорт вылета (IATA)" icon="mdi:airplane-takeoff" :readonly="readonly" @update:model-value="updateSegmentField(index, 'departureAirport', $event)" />
          <BookingField :model-value="segment.arrivalAirport" label="Аэропорт прилета (IATA)" icon="mdi:airplane-landing" :readonly="readonly" @update:model-value="updateSegmentField(index, 'arrivalAirport', $event)" />
          <BookingDateTimeField :model-value="segment.departureDateTime" label="Дата и время вылета" icon="mdi:clock-start" :readonly="readonly" type="datetime" @update:model-value="updateSegmentField(index, 'departureDateTime', $event)" />
          <BookingDateTimeField :model-value="segment.arrivalDateTime" label="Дата и время прилета" icon="mdi:clock-end" :readonly="readonly" type="datetime" @update:model-value="updateSegmentField(index, 'arrivalDateTime', $event)" />
          <BookingField :model-value="segment.terminalDeparture" label="Терминал вылета" icon="mdi:gate" :readonly="readonly" @update:model-value="updateSegmentField(index, 'terminalDeparture', $event)" />
          <BookingField :model-value="segment.terminalArrival" label="Терминал прилета" icon="mdi:gate" :readonly="readonly" @update:model-value="updateSegmentField(index, 'terminalArrival', $event)" />
          <BookingField :model-value="segment.aircraft" label="Самолет" icon="mdi:airplane" :readonly="readonly" @update:model-value="updateSegmentField(index, 'aircraft', $event)" />
          <BookingField :model-value="segmentDuration(segment)" label="В пути" icon="mdi:timer-sand" readonly />
        </template>

        <KitDivider class="span-2" />

        <BookingField
          :model-value="booking.data.bookingReference"
          label="Номер бронирования"
          icon="mdi:barcode-scan"
          :readonly="readonly"
          class="span-2"
          @update:model-value="updateDataField('bookingReference', $event)"
        />
        <BookingTextareaField
          :model-value="booking.data.notes"
          label="Заметки"
          icon="mdi:note-text-outline"
          :readonly="readonly"
          class="span-2"
          @update:model-value="updateDataField('notes', $event)"
        />
      </div>
    </template>
  </BookingCardWrapper>
</template>

<style scoped lang="scss">
.card-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 1rem;
}

.time-info {
  text-align: left;
  .time {
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.1;
  }
  .city {
    font-size: 1rem;
    font-weight: 500;
  }
  .date {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
  }
  &.arrival {
    text-align: right;
  }
}

.route-visualizer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 150px;
}

.total-duration {
  font-size: 0.8rem;
  color: var(--fg-tertiary-color);
  background-color: var(--bg-tertiary-color);
  padding: 2px 8px;
  border-radius: var(--r-full);
}

.route-line {
  width: 100%;
  height: 4px;
  background-color: var(--border-secondary-color);
  display: flex;
  align-items: center;
  position: relative;
  margin: 8px 0;

  > :first-child {
    border-top-left-radius: var(--r-full);
    border-bottom-left-radius: var(--r-full);
  }
  > :last-child {
    border-top-right-radius: var(--r-full);
    border-bottom-right-radius: var(--r-full);
  }

  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--fg-tertiary-color);
    z-index: 2;
  }
  &::after {
    content: '';
    position: absolute;
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--fg-tertiary-color);
    z-index: 2;
  }

  :deep(.tooltip-name) {
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.journey-part {
  width: 100%;
  height: 100%;
  transition: filter 0.2s ease;
  height: 4px;
  border-radius: var(--r-full);

  &.part-flight {
    background-color: var(--fg-accent-color);
  }

  &.part-layover {
    background-image: linear-gradient(
      45deg,
      var(--bg-tertiary-color) 25%,
      transparent 25%,
      transparent 50%,
      var(--bg-tertiary-color) 50%,
      var(--bg-tertiary-color) 75%,
      transparent 75%,
      transparent 100%
    );
    background-size: 8px 8px;
    cursor: pointer;
  }
}

.airports {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--fg-accent-color);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
}

.span-2 {
  grid-column: span 2 / span 2;
}

.segment-header {
  font-weight: 600;
  margin-top: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--border-secondary-color);
}

.layover-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-tertiary-color);
  padding: 0.5rem 0.75rem;
  border-radius: var(--r-s);
  font-size: 0.9rem;
  margin-top: 1rem;
  span {
    margin-left: auto;
    font-weight: 600;
  }
}

@media (max-width: 600px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: span 1 / span 1;
  }
}
</style>
