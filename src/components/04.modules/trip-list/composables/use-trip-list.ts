import type { ITrip } from '../models/types'

export function useTripList() {
  const {
    data: trips,
    status: fetchStatus,
    error: fetchError,
    execute: fetchTrips,
  } = useDatabase<ITrip[]>({
    initialData: [],
    immediate: true,
    fn: db => db.trips.getAll(),
  })

  const isLoading = computed(() => fetchStatus.value === 'pending')

  return {
    trips,
    isLoading,
    fetchError,
    fetchTrips,
  }
}
