<script setup lang="ts">
import type { ITrip } from '../../models/types'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import TripListEmpty from './states/trip-list-empty.vue'
import TripListSkeleton from './states/trip-list-skeleton.vue'
import TripCard from './trip-card/card-item.vue'

interface Props {
  isLoading: boolean
  error: unknown | null
  trips: ITrip[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'retry'): void
}>()

const displayData = computed(() => (props.trips.length > 0 ? props.trips : null))
</script>

<template>
  <AsyncStateWrapper
    :loading="props.isLoading"
    :error="props.error"
    :data="displayData"
    :retry-handler="() => emit('retry')"
    transition="slide-up"
    class="trip-list-wrapper"
  >
    <!-- Состояние загрузки -->
    <template #loading>
      <TripListSkeleton />
    </template>

    <!-- Успешное состояние с данными -->
    <template #success="{ data }">
      <TripCard
        v-for="trip in data"
        :key="trip.id"
        :="trip"
      />
    </template>

    <!-- Состояние, когда данные загружены, но список пуст -->
    <template #empty>
      <TripListEmpty />
    </template>

    <!-- Состояние ошибки будет обработано внутри AsyncStateWrapper по умолчанию -->
  </AsyncStateWrapper>
</template>

<style lang="scss" scoped>
.trip-list-wrapper {
  height: 100%;
}
</style>
