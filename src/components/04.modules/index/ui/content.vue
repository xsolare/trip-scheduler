<script setup lang="ts">
import { PLANS } from '../mock'
import TravelCard from './travel-card/index.vue'
</script>

<template>
  <TravelCard v-for="plan in PLANS" :key="plan.id" :="plan" />
</template>
