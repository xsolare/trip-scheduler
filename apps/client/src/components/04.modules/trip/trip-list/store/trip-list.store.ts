import type { CreateTripInput, Trip } from '~/shared/types/models/trip'
import { useRouter } from 'vue-router'
import { useToast } from '~/components/01.kit/kit-toast'
import { useRequest, useRequestError, useRequestStatus, useRequestStore } from '~/plugins/request'

export enum ETripListKeys {
  FETCH_ALL = 'trips:fetch-all',
  CREATE = 'trips:create',
  DELETE = 'trips:delete',
  UPDATE = 'trips:update',
}

export const useTripListStore = defineStore('tripList', {

  state: () => ({
    trips: [] as Trip[],
    isInitialized: false,
  }),

  getters: {
    isLoading: () => useRequestStatus(ETripListKeys.FETCH_ALL).value,
    isCreating: () => useRequestStatus(ETripListKeys.CREATE).value,
    fetchError: () => useRequestError(ETripListKeys.FETCH_ALL).value,
  },

  actions: {
    /**
     * Загружает список всех путешествий с сервера.
     * @param force - Если true, выполнит запрос даже если данные уже есть.
     */
    async fetchTrips(force = false) {
      if (this.isInitialized && !force) {
        return
      }

      const toast = useToast()

      await useRequest<Trip[]>({
        key: ETripListKeys.FETCH_ALL,
        fn: db => db.trips.getAll(),
        onSuccess: (result) => {
          this.trips = result.sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
          )
          this.isInitialized = true
        },
        onError: (error) => {
          this.trips = []
          toast.error(`Не удалось загрузить список путешествий: ${error}`)
          console.error('Ошибка при загрузке списка путешествий:', error)
        },
      })
    },

    /**
     * Создает новое путешествие и переходит на его страницу.
     * @param data - Данные для создания путешествия.
     */
    async createTrip(data: CreateTripInput) {
      const router = useRouter()
      const toast = useToast()

      const newTrip = await useRequest<Trip>({
        key: ETripListKeys.CREATE,
        fn: db => db.trips.create(data),
        onSuccess: (createdTrip) => {
          this.trips.unshift(createdTrip)
          toast.success(`Путешествие "${createdTrip.title}" создано!`)
          router.push({ name: 'trip-info', params: { id: createdTrip.id } })
        },
        onError: (error) => {
          toast.error(`Ошибка при создании путешествия: ${error}`)
        },
      })

      return newTrip
    },

    /**
     * Удаляет путешествие с оптимистичным обновлением UI.
     * @param tripId - ID путешествия для удаления.
     */
    deleteTrip(tripId: string) {
      const toast = useToast()
      const tripIndex = this.trips.findIndex(t => t.id === tripId)
      if (tripIndex === -1)
        return

      const [removedTrip] = this.trips.splice(tripIndex, 1)
      toast.info(`Путешествие "${removedTrip.title}" удалено.`)

      useRequest({
        key: `${ETripListKeys.DELETE}:${tripId}`,
        fn: db => db.trips.delete(tripId),
        onError: (error) => {
          this.trips.splice(tripIndex, 0, removedTrip)
          toast.error(`Не удалось удалить путешествие: ${error}`)
        },
      })
    },

    /**
     * Обновляет информацию о путешествии в списке.
     * @param updatedTripData - Частичные или полные данные обновленного путешествия.
     */
    updateTripInList(updatedTripData: Partial<Trip> & { id: string }) {
      const trip = this.trips.find(t => t.id === updatedTripData.id)
      if (trip)
        Object.assign(trip, updatedTripData)
    },

    /**
     * Сбрасывает состояние стора.
     */
    reset() {
      this.trips = []
      this.isInitialized = false
      const requestStore = useRequestStore()
      Object.values(ETripListKeys).forEach(key => requestStore.reset(key))
    },
  },
})
