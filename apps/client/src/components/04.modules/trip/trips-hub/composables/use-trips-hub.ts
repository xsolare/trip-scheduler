import type { InjectionKey } from 'vue'
import type { ITrip } from '../models/types'
import { useRouter } from 'vue-router'
import { useToast } from '~/components/01.kit/kit-toast'
import { useRequest, useRequestError, useRequestStatus } from '~/plugins/request'
import { AppRoutePaths } from '~/shared/constants/routes'
import { TripStatus, TripVisibility } from '~/shared/types/models/trip'

export type TripsHubTab = 'my' | 'public'
export type TDisplayMode = 'grid' | 'flex'

enum ETripHubKeys {
  FETCH_ALL = 'trips:fetch-all',
  CREATE = 'trips:create',
  DELETE = 'trips:delete',
}

function getDefaultTripData() {
  return {
    title: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    cities: [],
    status: TripStatus.PLANNED,
    visibility: TripVisibility.PRIVATE,
  }
}

export function useTripsHub() {
  // State
  const trips = ref<ITrip[]>([])
  const isInitialized = ref(false)
  const activeTab = ref<TripsHubTab>('my')
  const searchQuery = ref('')
  const isCreateModalOpen = ref(false)
  const newTripData = ref(getDefaultTripData())
  const displayMode = ref<TDisplayMode>('flex')

  // Computed (getters)
  const isLoading = computed(() => useRequestStatus(ETripHubKeys.FETCH_ALL).value)
  const isCreating = computed(() => useRequestStatus(ETripHubKeys.CREATE).value)
  const fetchError = computed(() => useRequestError(ETripHubKeys.FETCH_ALL).value)

  const filteredMyTrips = computed(() => {
    if (!searchQuery.value) {
      return trips.value
    }
    const lowerCaseQuery = searchQuery.value.toLowerCase()
    return trips.value.filter(trip =>
      trip.title.toLowerCase().includes(lowerCaseQuery)
      || trip.cities.some(city => city.toLowerCase().includes(lowerCaseQuery)),
    )
  })

  const currentTrips = computed((): ITrip[] => {
    if (activeTab.value === 'my') {
      return filteredMyTrips.value
    }

    return []
  })

  async function fetchTrips(force = false) {
    if (isInitialized.value) {
      return
    }

    await useRequest({
      force,
      key: ETripHubKeys.FETCH_ALL,
      fn: db => db.trips.getAll(),
      onSuccess: (result) => {
        trips.value = result.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
        )
        isInitialized.value = true
      },
      onError: (error) => {
        trips.value = []
        useToast().error(`Не удалось загрузить список путешествий: ${error}`)
      },
    })
  }

  async function createTrip() {
    const router = useRouter()
    const toast = useToast()

    const newTrip = await useRequest({
      key: ETripHubKeys.CREATE,
      fn: db => db.trips.create(newTripData.value),
      onSuccess: (createdTrip) => {
        trips.value.unshift(createdTrip)
        toast.success(`Путешествие "${createdTrip.title}" создано!`)
        router.push(AppRoutePaths.Trip.Info(createdTrip.id))
        closeCreateModal()
      },
      onError: (error) => {
        toast.error(`Ошибка при создании путешествия: ${error}`)
      },
    })
    return newTrip
  }

  function deleteTrip(tripId: string) {
    const toast = useToast()
    const tripIndex = trips.value.findIndex(t => t.id === tripId)
    if (tripIndex === -1)
      return

    const [removedTrip] = trips.value.splice(tripIndex, 1)
    toast.info(`Путешествие "${removedTrip.title}" удалено.`)

    useRequest({
      key: `${ETripHubKeys.DELETE}:${tripId}`,
      fn: db => db.trips.delete(tripId),
      onError: (error) => {
        trips.value.splice(tripIndex, 0, removedTrip)
        toast.error(`Не удалось удалить путешествие: ${error}`)
      },
    })
  }

  function setActiveTab(tab: TripsHubTab) {
    if (activeTab.value === tab)
      return

    activeTab.value = tab

    // Перезапрашиваем данные при смене типа списка
    fetchTrips(true)
  }

  function setDisplayMode(mode: TDisplayMode) {
    displayMode.value = mode
  }

  function openCreateModal() {
    isCreateModalOpen.value = true
  }

  function closeCreateModal() {
    isCreateModalOpen.value = false
    setTimeout(() => {
      newTripData.value = getDefaultTripData()
    }, 300)
  }

  return {
    // State
    trips: readonly(trips),
    isInitialized: readonly(isInitialized),
    activeTab,
    searchQuery,
    isCreateModalOpen,
    newTripData,
    displayMode,

    // Computed
    isLoading,
    isCreating,
    fetchError,
    filteredMyTrips,
    currentTrips,

    // Actions
    fetchTrips,
    createTrip,
    deleteTrip,
    setActiveTab,
    setDisplayMode,
    openCreateModal,
    closeCreateModal,
  }
}

export type TripsHubComposable = ReturnType<typeof useTripsHub>
export const TripsHubKey: InjectionKey<TripsHubComposable> = Symbol('TripsHub')
