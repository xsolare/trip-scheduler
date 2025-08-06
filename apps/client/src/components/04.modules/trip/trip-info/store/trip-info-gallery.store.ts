import type { TripImage } from '~/shared/types/models/trip'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest, useRequestStatus } from '~/plugins/request'

export enum ETripGalleryKeys {
  FETCH_IMAGES = 'gallery:fetch-images',
  UPLOAD_IMAGE = 'gallery:upload-image',
}

/**
 * Стор для управления галереей и изображениями на странице путешествия.
 */
export const useTripInfoGalleryStore = defineStore('tripInfo-gallery', () => {
  // --- STATE ---
  const tripImages = ref<TripImage[]>([])
  const currentTripId = ref<string | null>(null)

  // --- GETTERS ---
  const isFetchingImages = useRequestStatus(ETripGalleryKeys.FETCH_IMAGES)
  const isUploadingImage = useRequestStatus(ETripGalleryKeys.UPLOAD_IMAGE)

  // --- ACTIONS ---
  function setTripId(tripId: string) {
    if (currentTripId.value !== tripId) {
      currentTripId.value = tripId
      tripImages.value = []
      fetchTripImages()
    }
  }

  function fetchTripImages() {
    const tripId = currentTripId.value
    if (!tripId)
      return

    useRequest<TripImage[]>({
      key: ETripGalleryKeys.FETCH_IMAGES,
      fn: db => db.files.listImageByTrip(tripId),
      immediate: true,
      onSuccess: (result) => {
        tripImages.value = result
      },
    })
  }

  // @ts-expect-error nice
  // eslint-disable-next-line unused-imports/no-unused-vars
  async function uploadImage(file: File): Promise<TripImage | null> {
    const tripId = currentTripId.value
    if (!tripId) {
      console.error('Trip ID не установлен для загрузки изображения.')
      return null
    }

    // const { data } = await useRequest<TripImage>({
    //   key: ETripGalleryKeys.UPLOAD_IMAGE,
    //   fn: db => db.files.uploadTripImage(tripId, file), // Предполагаемый метод API
    //   immediate: true,
    //   onSuccess: (newImage) => {
    //     // Добавляем новое изображение в общий список
    //     tripImages.value.push(newImage)
    //   },
    //   onError: (error) => {
    //     console.error(`Ошибка при загрузке изображения для путешествия ${tripId}:`, error)
    //     // Здесь можно показать уведомление пользователю
    //   },
    // }).execute()

    // return data
  }

  function reset() {
    tripImages.value = []
    currentTripId.value = null
  }

  return {
    tripImages,
    isUploadingImage,
    isFetchingImages,
    setTripId,
    fetchTripImages,
    uploadImage,
    reset,
  }
})
