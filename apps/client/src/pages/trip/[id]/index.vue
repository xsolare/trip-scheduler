<script setup lang="ts">
import { TripInfo } from '~/components/04.modules/trip-info'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { useDisplay } from '~/shared/composables/use-display'

const tripStore = useTripStore()
const { isDaysPanelPinned } = storeToRefs(tripStore)
const { mdAndDown } = useDisplay()
</script>

<template>
  <section class="content-wrapper" :class="{ isPanelPinned: isDaysPanelPinned && !mdAndDown }">
    <TripInfo />
  </section>
</template>

<style lang="scss" scoped>
.content-wrapper {
  &.isPanelPinned {
    @media (max-width: 1800px) {
      margin-left: 400px;
    }
  }
}
</style>
