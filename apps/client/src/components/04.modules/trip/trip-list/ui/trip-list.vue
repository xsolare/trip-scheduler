<script setup lang="ts">
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'

import { useTripList } from '../composables/use-trip-list'
import TripListEmpty from './states/trip-list-empty.vue'
import TripListSkeleton from './states/trip-list-skeleton.vue'
import TripListContent from './trip-list-content.vue'

const emit = defineEmits(['update:hasError'])
const { trips, isLoading, fetchError, fetchTrips } = useTripList()

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

const displayData = computed(() => (trips.value && trips.value.length > 0) ? trips.value : null)
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading"
    :error="fetchError"
    :data="displayData"
    :retry-handler="fetchTrips"
    transition="slide-up"
    class="trip-list-wrapper"
  >
    <template #loading>
      <TripListSkeleton />
    </template>

    <template #success="{ data }">
      <TripListContent :trips="data" />
    </template>

    <template #empty>
      <TripListEmpty />
    </template>
  </AsyncStateWrapper>
</template>

<style lang="scss" scoped>
.trip-list-wrapper {
  height: 100%;
}
</style>
