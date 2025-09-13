<script setup lang="ts">
import type { Booking } from '../models/types'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitTabs } from '~/components/01.kit/kit-tabs'
import { useBookingSection } from '../composables/use-booking-section'
import AttractionCard from './cards/attraction-card.vue'
import FlightCard from './cards/flight-card.vue'
import HotelCard from './cards/hotel-card.vue'
import TrainCard from './cards/train-card.vue'

interface Props {
  bookings: Booking[]
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible'])

const { activeTab, bookingGroups, tabItems } = useBookingSection({
  section: {
    id: 'day-bookings-modal',
    type: 'booking',
    content: { bookings: props.bookings },
  },
  readonly: true,
}, () => {})
</script>

<template>
  <KitDialogWithClose
    :visible="visible"
    title="Бронирования на этот день"
    icon="mdi:ticket-confirmation-outline"
    :max-width="800"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="day-bookings-content">
      <KitTabs v-if="tabItems.length > 0" v-model="activeTab" :items="tabItems">
        <template v-for="tab in tabItems" :key="tab.id" #[tab.id]>
          <div class="bookings-grid">
            <div v-for="booking in bookingGroups[tab.id]" :key="booking.id">
              <FlightCard v-if="booking.type === 'flight'" :booking="booking" :readonly="true" />
              <HotelCard v-else-if="booking.type === 'hotel'" :booking="booking" :readonly="true" />
              <TrainCard v-else-if="booking.type === 'train'" :booking="booking" :readonly="true" />
              <AttractionCard v-else-if="booking.type === 'attraction'" :booking="booking" :readonly="true" />
            </div>
          </div>
        </template>
      </KitTabs>
    </div>
  </KitDialogWithClose>
</template>

<style scoped lang="scss">
.day-bookings-content {
  padding-top: 1rem;
}
.bookings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
