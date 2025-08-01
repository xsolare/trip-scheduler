<script setup lang="ts">
import TripCardSkeleton from '../trip-card/card-skeleton.vue'
</script>

<template>
  <TripCardSkeleton v-for="i in 3" :key="i" />
</template>
