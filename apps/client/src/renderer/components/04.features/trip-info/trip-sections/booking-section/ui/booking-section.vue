<script setup lang="ts">
import type { Booking, BookingSectionContent } from '../models/types'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitTabs } from '~/components/01.kit/kit-tabs'
import { useBookingSection } from '../composables'
import FlightCard from './cards/flight-card.vue'
import HotelCard from './cards/hotel-card.vue'

interface Props {
  section: {
    id: string
    type: 'booking'
    content: BookingSectionContent
  }
  readonly: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['updateSection'])

const {
  activeTab,
  bookingGroups,
  tabItems,
  addBooking,
  deleteBooking,
  bookings,
  updateBooking,
  updateBookingsForGroup,
} = useBookingSection(props, emit)

const cardComponents = {
  flight: FlightCard,
  hotel: HotelCard,
}

function getCardComponent(type: Booking['type']) {
  return cardComponents[type]
}
</script>

<template>
  <div class="booking-section">
    <div v-if="!readonly" class="actions-panel">
      <KitBtn icon="mdi:airplane" @click="addBooking('flight')">
        Добавить авиабилет
      </KitBtn>
      <KitBtn icon="mdi:hotel" color="secondary" @click="addBooking('hotel')">
        Добавить отель
      </KitBtn>
    </div>

    <div v-if="bookings.length > 0" class="tabs-container">
      <KitTabs v-model="activeTab" :items="tabItems">
        <template #flight>
          <draggable
            :model-value="bookingGroups.flight || []"
            item-key="id"
            handle=".drag-handle"
            ghost-class="ghost-item"
            :disabled="readonly"
            class="bookings-grid"
            @update:model-value="updateBookingsForGroup('flight', $event)"
          >
            <template #item="{ element: booking }">
              <component
                :is="getCardComponent(booking.type)"
                :booking="booking"
                :readonly="readonly"
                @delete="deleteBooking(booking.id)"
                @update:booking="updateBooking"
              />
            </template>
          </draggable>
        </template>
        <template #hotel>
          <draggable
            :model-value="bookingGroups.hotel || []"
            item-key="id"
            handle=".drag-handle"
            ghost-class="ghost-item"
            :disabled="readonly"
            class="bookings-grid"
            @update:model-value="updateBookingsForGroup('hotel', $event)"
          >
            <template #item="{ element: booking }">
              <component
                :is="getCardComponent(booking.type)"
                :booking="booking"
                :readonly="readonly"
                @delete="deleteBooking(booking.id)"
                @update:booking="updateBooking"
              />
            </template>
          </draggable>
        </template>
      </KitTabs>
    </div>

    <div v-else class="empty-state">
      <Icon icon="mdi:ticket-confirmation-outline" class="empty-icon" />
      <p>Пока нет ни одного бронирования.</p>
      <p v-if="!readonly">
        Нажмите на кнопки выше, чтобы добавить информацию.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.booking-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actions-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.bookings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.ghost-item {
  opacity: 0.5;
  background: var(--bg-accent-color);
  border-radius: var(--r-m);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  margin-top: 1rem;
  text-align: center;
  color: var(--fg-tertiary-color);
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-m);
  border: 2px dashed var(--border-secondary-color);
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}
</style>
