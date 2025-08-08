<script setup lang="ts">
import type { ITrip } from '../models/types'
import TripCard from './trip-card/card-item.vue'

interface Props {
  trips: ITrip[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:trips'])

const handleTripUpdate = (updatedTrip: ITrip) => {
  const updatedTrips = props.trips.map(trip =>
    trip.id === updatedTrip.id ? updatedTrip : trip
  )

  emit('update:trips', updatedTrips)
}
</script>

<template>
  <div class="trip-list">
    <TripCard v-for="trip in trips" :key="trip.id" v-bind="trip" @update:trip="handleTripUpdate" />
  </div>
</template>

<style scoped>
.trip-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 0px;

}
</style>