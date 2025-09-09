<script setup lang="ts">
import type { Booking, HotelData } from '../../models/types'
import { ref } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import BookingCardWrapper from '../shared/booking-card-wrapper.vue'
import BookingDateTimeField from '../shared/booking-date-time-field.vue'
import BookingField from '../shared/booking-field.vue'
import BookingLocationField from '../shared/booking-location-field.vue'
import BookingTextareaField from '../shared/booking-textarea-field.vue'

interface Props {
  booking: Booking & { type: 'hotel' }
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['delete', 'update:booking'])

const isLocationPickerOpen = ref(false)

function updateDataField<K extends keyof HotelData>(key: K, value: HotelData[K]) {
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
      <BookingField :model-value="booking.data.hotelName" label="Название отеля" icon="mdi:office-building-outline" :readonly="readonly" class="span-2" @update:model-value="updateDataField('hotelName', $event)" />
      <div class="address-field-wrapper span-2">
        <BookingField :model-value="booking.data.address" label="Адрес (текстом)" icon="mdi:map-marker-radius-outline" :readonly="readonly" @update:model-value="updateDataField('address', $event)" />
        <KitBtn v-if="!readonly" icon="mdi:map-marker-outline" title="Указать на карте" @click="isLocationPickerOpen = true" />
      </div>
      <BookingDateTimeField :model-value="booking.data.checkInDate" label="Дата заезда" icon="mdi:calendar-arrow-right" :readonly="readonly" type="date" @update:model-value="updateDataField('checkInDate', $event)" />
      <BookingDateTimeField :model-value="booking.data.checkOutDate" label="Дата выезда" icon="mdi:calendar-arrow-left" :readonly="readonly" type="date" @update:model-value="updateDataField('checkOutDate', $event)" />
    </div>

    <template #details>
      <div class="details-grid">
        <BookingField :model-value="booking.data.roomType" label="Тип номера" icon="mdi:bed-outline" :readonly="readonly" @update:model-value="updateDataField('roomType', $event)" />
        <BookingField :model-value="booking.data.guests" label="Количество гостей" icon="mdi:account-group-outline" :readonly="readonly" @update:model-value="updateDataField('guests', $event)" />
        <BookingField :model-value="booking.data.confirmationNumber" label="Номер подтверждения" icon="mdi:barcode-scan" :readonly="readonly" class="span-2" @update:model-value="updateDataField('confirmationNumber', $event)" />
        <BookingField :model-value="booking.data.phone" label="Телефон" icon="mdi:phone-outline" :readonly="readonly" @update:model-value="updateDataField('phone', $event)" />
        <BookingField :model-value="booking.data.email" label="Email" icon="mdi:email-outline" :readonly="readonly" @update:model-value="updateDataField('email', $event)" />
        <BookingField :model-value="booking.data.website" label="Веб-сайт" icon="mdi:web" :readonly="readonly" class="span-2" @update:model-value="updateDataField('website', $event)" />
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
    v-model:visible="isLocationPickerOpen"
    :model-value="booking.data.location"
    label="Локация отеля"
    :readonly="readonly"
    @update:model-value="updateDataField('location', $event)"
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

.address-field-wrapper {
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
