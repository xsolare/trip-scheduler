<script setup lang="ts">
import { MOCK_TRIPS } from '../../../../shared/services/database/repositories-mock/trip.mock'
import TripCard from './trip-card/index.vue'
</script>

<template>
  <TripCard
    v-for="plan in MOCK_TRIPS"
    :key="plan.id"
    :="plan"
  />
</template>
