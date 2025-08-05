<script setup lang="ts">
import { TripInfo } from '~/components/04.modules/trip-info'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { useDisplay } from '~/shared/composables/use-display'

const tripStore = useTripStore()
const { mdAndDown } = useDisplay()

const { isDaysPanelPinned } = storeToRefs(tripStore)

const hasFetchError = ref(false)
</script>

<template>
  <section
    class="content-wrapper"
    :class="[{ isPanelPinned: isDaysPanelPinned && !mdAndDown }, { 'has-error': hasFetchError }]"
  >
    <TripInfo />
  </section>
</template>

<style lang="scss" scoped>
.content-wrapper {
  transition: background-color 0.2s ease;

  &.has-error {
    background: transparent;
  }

  &.isPanelPinned {
    @media (max-width: 1800px) {
      margin-left: 440px;
    }
  }
}
</style>
