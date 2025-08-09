<script setup lang="ts">
import type { ITrip } from '../models/types'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { useTripList } from '../composables/use-trip-list'
import TripListEmpty from './states/trip-list-empty.vue'
import TripListSkeleton from './states/trip-list-skeleton.vue'
import TripListContent from './trip-list-content.vue'

const emit = defineEmits(['update:hasError', 'update:trip'])

const { trips, isLoading, fetchError, fetchTrips } = useTripList()

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

function handleTripsUpdate(updatedTrips: ITrip[]) {
  trips.value = updatedTrips
  emit('update:trip', trips.value)
}

const displayData = computed(() => (trips.value && trips.value.length > 0) ? trips.value : null)
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading" :error="fetchError" :data="displayData" :retry-handler="fetchTrips"
    transition="slide-up" class="trip-list-wrapper"
  >
    <template #loading>
      <TripListSkeleton />
    </template>

    <template #success="{ data }">
      <TripListContent :trips="data" @update:trip="handleTripsUpdate" />
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
