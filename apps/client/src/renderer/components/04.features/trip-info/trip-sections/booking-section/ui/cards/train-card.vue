<script setup lang="ts">
import type { Booking, TrainData } from '../../models/types'
import BookingCardWrapper from '../shared/booking-card-wrapper.vue'
import BookingField from '../shared/booking-field.vue'
import BookingTextareaField from '../shared/booking-textarea-field.vue'

interface Props {
  booking: Booking & { type: 'train' }
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['delete', 'update:booking'])

function updateDataField<K extends keyof TrainData>(key: K, value: TrainData[K]) {
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
      <BookingField :model-value="booking.data.departureStation" label="Станция отправления" icon="mdi:map-marker-radius-outline" :readonly="readonly" @update:model-value="updateDataField('departureStation', $event)" />
      <BookingField :model-value="booking.data.arrivalStation" label="Станция прибытия" icon="mdi:map-marker-radius-outline" :readonly="readonly" @update:model-value="updateDataField('arrivalStation', $event)" />
      <BookingField :model-value="booking.data.departureDateTime" label="Дата и время отправления" icon="mdi:calendar-clock" :readonly="readonly" @update:model-value="updateDataField('departureDateTime', $event)" />
      <BookingField :model-value="booking.data.arrivalDateTime" label="Дата и время прибытия" icon="mdi:calendar-clock" :readonly="readonly" @update:model-value="updateDataField('arrivalDateTime', $event)" />
    </div>

    <template #details>
      <div class="details-grid">
        <BookingField :model-value="booking.data.trainNumber" label="Номер поезда" icon="mdi:pound" :readonly="readonly" @update:model-value="updateDataField('trainNumber', $event)" />
        <BookingField :model-value="booking.data.bookingReference" label="Номер бронирования" icon="mdi:barcode-scan" :readonly="readonly" @update:model-value="updateDataField('bookingReference', $event)" />
        <BookingField :model-value="booking.data.carriage" label="Вагон" icon="mdi:train-car" :readonly="readonly" @update:model-value="updateDataField('carriage', $event)" />
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
