import type { ITrip } from '../models/types'
import { defineStore } from 'pinia'
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

export const useTripHubStore = defineStore('tripHub', {
  state: () => ({
    trips: [] as ITrip[],
    isInitialized: false,
    activeTab: 'my' as TripsHubTab,
    searchQuery: '',
    isCreateModalOpen: false,
    newTripData: getDefaultTripData(),
    displayMode: 'flex' as TDisplayMode,
  }),

  getters: {
    isLoading: () => useRequestStatus(ETripHubKeys.FETCH_ALL).value,
    isCreating: () => useRequestStatus(ETripHubKeys.CREATE).value,
    fetchError: () => useRequestError(ETripHubKeys.FETCH_ALL).value,

    filteredMyTrips(state) {
      if (!state.searchQuery) {
        return state.trips
      }
      const lowerCaseQuery = state.searchQuery.toLowerCase()
      return state.trips.filter(trip =>
        trip.title.toLowerCase().includes(lowerCaseQuery)
        || trip.cities.some(city => city.toLowerCase().includes(lowerCaseQuery)),
      )
    },

    currentTrips(): ITrip[] {
      if (this.activeTab === 'my') {
        return this.filteredMyTrips
      }
      // Логика для публичных путешествий
      return []
    },
  },

  actions: {
    async fetchTrips(force = false) {
      if (this.isInitialized && !force) {
        return
      }

      await useRequest<ITrip[]>({
        key: ETripHubKeys.FETCH_ALL,
        fn: db => db.trips.getAll(),
        onSuccess: (result) => {
          this.trips = result.sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
          )
          this.isInitialized = true
        },
        onError: (error) => {
          this.trips = []
          useToast().error(`Не удалось загрузить список путешествий: ${error}`)
        },
      })
    },

    async createTrip() {
      const router = useRouter()
      const toast = useToast()

      const newTrip = await useRequest<ITrip>({
        key: ETripHubKeys.CREATE,
        fn: db => db.trips.create(this.newTripData),
        onSuccess: (createdTrip) => {
          this.trips.unshift(createdTrip)
          toast.success(`Путешествие "${createdTrip.title}" создано!`)
          router.push(AppRoutePaths.Trip.Info(createdTrip.id))
          this.closeCreateModal()
        },
        onError: (error) => {
          toast.error(`Ошибка при создании путешествия: ${error}`)
        },
      })
      return newTrip
    },

    deleteTrip(tripId: string) {
      const toast = useToast()
      const tripIndex = this.trips.findIndex(t => t.id === tripId)
      if (tripIndex === -1)
        return

      const [removedTrip] = this.trips.splice(tripIndex, 1)
      toast.info(`Путешествие "${removedTrip.title}" удалено.`)

      useRequest({
        key: `${ETripHubKeys.DELETE}:${tripId}`,
        fn: db => db.trips.delete(tripId),
        onError: (error) => {
          this.trips.splice(tripIndex, 0, removedTrip)
          toast.error(`Не удалось удалить путешествие: ${error}`)
        },
      })
    },

    setActiveTab(tab: TripsHubTab) {
      if (this.activeTab === tab)
        return
      this.activeTab = tab
    },

    setDisplayMode(mode: TDisplayMode) {
      this.displayMode = mode
    },

    openCreateModal() {
      this.isCreateModalOpen = true
    },

    closeCreateModal() {
      this.isCreateModalOpen = false
      setTimeout(() => {
        this.newTripData = getDefaultTripData()
      }, 300)
    },

    reset() {
      this.activeTab = 'my'
      this.searchQuery = ''
      this.isInitialized = false
      this.trips = []
    },
  },
})
