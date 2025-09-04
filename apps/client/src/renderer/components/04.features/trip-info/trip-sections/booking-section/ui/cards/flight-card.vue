<script setup lang="ts">
import type { Booking, FlightData } from '../../models/types'
import { ref } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import BookingCardWrapper from '../shared/booking-card-wrapper.vue'
import BookingField from '../shared/booking-field.vue'
import BookingLocationField from '../shared/booking-location-field.vue'
import BookingTextareaField from '../shared/booking-textarea-field.vue'

interface Props {
  booking: Booking & { type: 'flight' }
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['delete', 'update:booking'])

const isDepartureLocationPickerOpen = ref(false)
const isArrivalLocationPickerOpen = ref(false)

function updateDataField<K extends keyof FlightData>(key: K, value: FlightData[K]) {
  emit('update:booking', {
    ...props.booking,
    data: { ...props.booking.data, [key]: value },
  })
}

function updateTitle(newTitle: string) {
  emit('update:booking', { ...props.booking, title: newTitle })
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
    <div class="card-content">
      <BookingField :model-value="booking.data.departureCity" label="Город вылета" icon="mdi:airplane-takeoff" :readonly="readonly" @update:model-value="updateDataField('departureCity', $event)" />
      <BookingField :model-value="booking.data.arrivalCity" label="Город прилета" icon="mdi:airplane-landing" :readonly="readonly" @update:model-value="updateDataField('arrivalCity', $event)" />
      <BookingField :model-value="booking.data.departureDateTime" label="Дата и время вылета" icon="mdi:calendar-clock" :readonly="readonly" @update:model-value="updateDataField('departureDateTime', $event)" />
      <BookingField :model-value="booking.data.arrivalDateTime" label="Дата и время прилета" icon="mdi:calendar-clock" :readonly="readonly" @update:model-value="updateDataField('arrivalDateTime', $event)" />
    </div>

    <template #details>
      <div class="details-grid">
        <BookingField :model-value="booking.data.airline" label="Авиакомпания" icon="mdi:compass-rose" :readonly="readonly" @update:model-value="updateDataField('airline', $event)" />
        <BookingField :model-value="booking.data.flightNumber" label="Номер рейса" icon="mdi:pound" :readonly="readonly" @update:model-value="updateDataField('flightNumber', $event)" />

        <BookingField :model-value="booking.data.departureAirport" label="Аэропорт вылета (IATA)" icon="mdi:airport" :readonly="readonly" @update:model-value="updateDataField('departureAirport', $event)" />
        <BookingField :model-value="booking.data.arrivalAirport" label="Аэропорт прилета (IATA)" icon="mdi:airport" :readonly="readonly" @update:model-value="updateDataField('arrivalAirport', $event)" />

        <div class="location-field-wrapper">
          <BookingField
            :model-value="booking.data.departureAirportLocation ? `${booking.data.departureAirportLocation.lat.toFixed(4)}, ${booking.data.departureAirportLocation.lon.toFixed(4)}` : ''"
            label="Аэропорт вылета на карте"
            icon="mdi:map-marker-outline"
            readonly
            placeholder="Не указано"
          />
          <KitBtn v-if="!readonly" icon="mdi:map-marker-plus-outline" title="Указать на карте" @click="isDepartureLocationPickerOpen = true" />
        </div>

        <div class="location-field-wrapper">
          <BookingField
            :model-value="booking.data.arrivalAirportLocation ? `${booking.data.arrivalAirportLocation.lat.toFixed(4)}, ${booking.data.arrivalAirportLocation.lon.toFixed(4)}` : ''"
            label="Аэропорт прилета на карте"
            icon="mdi:map-marker-outline"
            readonly
            placeholder="Не указано"
          />
          <KitBtn v-if="!readonly" icon="mdi:map-marker-plus-outline" title="Указать на карте" @click="isArrivalLocationPickerOpen = true" />
        </div>

        <BookingField
          :model-value="booking.data.bookingReference"
          label="Номер бронирования"
          icon="mdi:barcode-scan"
          :readonly="readonly"
          @update:model-value="updateDataField('bookingReference', $event)"
        />
        <BookingField :model-value="booking.data.seat" label="Место" icon="mdi:seat-passenger" :readonly="readonly" @update:model-value="updateDataField('seat', $event)" />
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

  <BookingLocationField
    v-if="!readonly"
    v-model:visible="isDepartureLocationPickerOpen"
    :model-value="booking.data.departureAirportLocation"
    label="Аэропорт вылета на карте"
    :readonly="readonly"
    @update:model-value="updateDataField('departureAirportLocation', $event)"
  />

  <BookingLocationField
    v-if="!readonly"
    v-model:visible="isArrivalLocationPickerOpen"
    :model-value="booking.data.arrivalAirportLocation"
    label="Аэропорт прилета на карте"
    :readonly="readonly"
    @update:model-value="updateDataField('arrivalAirportLocation', $event)"
  />
</template>

<style scoped lang="scss">
.card-content,
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
}
.span-2 {
  grid-column: span 2 / span 2;
}

.location-field-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;

  :deep(.booking-field) {
    flex-grow: 1;
  }
  .kit-btn {
    flex-shrink: 0;
    height: 36px;
  }
}

@media (max-width: 600px) {
  .card-content,
  .details-grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: span 1 / span 1;
  }
}
</style>
