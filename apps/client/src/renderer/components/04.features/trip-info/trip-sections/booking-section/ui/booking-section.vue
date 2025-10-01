<script setup lang="ts">
import type { Booking, BookingSectionContent } from '../models/types'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitTabs } from '~/components/01.kit/kit-tabs'
import { useBookingSection } from '../composables'
import AttractionCard from './cards/attraction-card.vue'
import FlightCard from './cards/flight-card.vue'
import HotelCard from './cards/hotel-card.vue'
import TrainCard from './cards/train-card.vue'

interface Props {
  section: {
    id: string
    type: 'booking'
    content: BookingSectionContent
  }
  readonly: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'updateSection', value: { id: string, type: 'booking', content: BookingSectionContent }): void
}>()

const {
  activeTab,
  bookingGroups,
  tabItems,
  addBooking,
  deleteBooking,
  bookings,
  updateBooking,
  updateBookingsForGroup,
  bookingTypeConfigs,
} = useBookingSection(props, emit)

const cardComponents = {
  flight: FlightCard,
  hotel: HotelCard,
  train: TrainCard,
  attraction: AttractionCard,
}

function getCardComponent(type: Booking['type']) {
  return cardComponents[type]
}

function formatAddButtonLabel(label: string): string {
  const words = label.toLowerCase().split(' ')
  const lastWord = words[words.length - 1]

  // Простое правило для единственного числа
  if (lastWord.endsWith('ы')) {
    words[words.length - 1] = lastWord.slice(0, -1)
  }
  else if (lastWord.endsWith('а')) {
    words[words.length - 1] = `${lastWord.slice(0, -1)}о`
  }
  return `Добавить ${words.join(' ')}`
}
</script>

<template>
  <div class="booking-section">
    <div v-if="!readonly" class="actions-panel">
      <KitBtn
        v-for="(config, type) in bookingTypeConfigs"
        :key="type"
        :icon="config.icon"
        color="secondary"
        @click="addBooking(type)"
      >
        {{ formatAddButtonLabel(config.label) }}
      </KitBtn>
    </div>

    <div v-if="bookings.length > 0 && tabItems.length > 0" class="tabs-container">
      <KitTabs v-model="activeTab" :items="tabItems">
        <template v-for="tab in tabItems" :key="tab.id" #[tab.id]>
          <draggable
            :model-value="bookingGroups[tab.id] || []"
            item-key="id"
            handle=".drag-handle"
            ghost-class="ghost-item"
            :disabled="readonly"
            class="bookings-grid"
            @update:model-value="updateBookingsForGroup(tab.id, $event)"
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
