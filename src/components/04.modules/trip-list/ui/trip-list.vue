<script setup lang="ts">
import { PLANS } from '../mock'
import TripCard from './trip-card/index.vue'
</script>

<template>
  <TripCard
    v-for="plan in PLANS"
    :key="plan.id"
    :="plan"
  />
</template>
