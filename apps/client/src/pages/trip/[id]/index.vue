<script setup lang="ts">
import { PushBack } from '~/components/02.shared/push-back/index'
import { TripInfo } from '~/components/04.modules/trip/trip-info'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import { useDisplay } from '~/shared/composables/use-display'

const store = useModuleStore(['ui'])
const { mdAndDown } = useDisplay()

const { isDaysPanelPinned } = storeToRefs(store.ui)

const hasFetchError = ref(false)
</script>

<template>
  <section
    class="content-wrapper"
    :class="[{ isPanelPinned: isDaysPanelPinned && !mdAndDown }, { 'has-error': hasFetchError }]"
  >
    <PushBack />
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
