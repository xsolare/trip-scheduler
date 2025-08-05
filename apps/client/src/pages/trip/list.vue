<script setup lang="ts">
import { TripList } from '~/components/04.modules/trip/trip-list/index'

const hasFetchError = ref(false)
</script>

<template>
  <section
    class="content-wrapper"
    :class="{ 'has-error': hasFetchError }"
  >
    <TripList @update:has-error="hasFetchError = $event" />
  </section>
</template>

<style lang="scss" scoped>
.content-wrapper {
  transition: background-color 0.2s ease;

  &.has-error {
    background: transparent;
  }
}
</style>
