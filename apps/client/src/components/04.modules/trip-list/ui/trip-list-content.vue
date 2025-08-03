<script setup lang="ts">
import type { ITrip } from '../models/types'
import TripCard from './trip-card/card-item.vue'

interface Props {
  trips: ITrip[]
}

defineProps<Props>()
</script>

<template>
  <TripCard
    v-for="trip in trips"
    :key="trip.id"
    :="trip"
  />
</template>
