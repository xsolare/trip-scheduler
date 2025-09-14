import type { TripImage } from '~/shared/types/models/trip'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from '~/components/01.kit/kit-toast'
import { useRequest, useRequestError, useRequestStatus } from '~/plugins/request'
import { useAuthStore } from '~/shared/store/auth.store'

// Mock-данные для Trip, чтобы не усложнять зависимости
interface SimpleTrip {
  id: string
  title: string
}

// Расширяем TripImage, чтобы хранить связанный SimpleTrip
interface TripImageWithTrip extends TripImage {
  trip?: SimpleTrip
}

export enum EStorageKeys {
  FETCH_FILES = 'storage:fetch-files',
  DELETE_FILE = 'storage:delete-file',
}

export const useStorageStore = defineStore('storage', () => {
  const authStore = useAuthStore()
  const toast = useToast()

  const files = ref<TripImageWithTrip[]>([])
  const filters = ref({
    search: '',
    tripId: null as string | null,
    type: null as string | null,
  })
  const sortBy = ref({ key: 'createdAt', order: 'desc' as 'asc' | 'desc' })
  const viewMode = ref<'grid' | 'list'>('grid')

  const isLoading = useRequestStatus(EStorageKeys.FETCH_FILES)
  const error = useRequestError(EStorageKeys.FETCH_FILES)

  const fetchFiles = async () => {
    await useRequest({
      key: EStorageKeys.FETCH_FILES,
      fn: db => db.files.getAllUserFiles(),
      onSuccess: (data) => {
        files.value = data as TripImageWithTrip[]
      },
    })
  }

  const deleteFile = async (fileId: string) => {
    const originalFiles = [...files.value]
    const fileToDelete = files.value.find(f => f.id === fileId)

    // Оптимистичное удаление
    files.value = files.value.filter(f => f.id !== fileId)

    await useRequest({
      key: `${EStorageKeys.DELETE_FILE}:${fileId}`,
      fn: db => db.files.deleteFile(fileId),
      onSuccess: () => {
        toast.success('Файл успешно удален.')
        if (fileToDelete?.sizeBytes) {
          authStore.decrementStorageUsage(fileToDelete.sizeBytes)
        }
      },
      onError: (e) => {
        toast.error('Не удалось удалить файл.')
        files.value = originalFiles // Откат
        console.error(e)
      },
    })
  }

  const filteredAndSortedFiles = computed(() => {
    let result = [...files.value]

    // Фильтрация
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(f => f.originalName?.toLowerCase().includes(search))
    }
    // ... другие фильтры

    // Сортировка
    result.sort((a, b) => {
      const aVal = a[sortBy.value.key as keyof TripImageWithTrip]
      const bVal = b[sortBy.value.key as keyof TripImageWithTrip]
      const order = sortBy.value.order === 'asc' ? 1 : -1
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return (aVal - bVal) * order
      if (typeof aVal === 'string' && typeof bVal === 'string')
        return aVal.localeCompare(bVal) * order
      return 0
    })

    return result
  })

  const totalStorageUsed = computed(() => {
    return files.value.reduce((acc, file) => acc + (file.sizeBytes || 0), 0)
  })

  const tripsForFilter = computed(() => {
    const tripsMap = new Map<string, string>()
    files.value.forEach((file) => {
      if (file.trip) {
        tripsMap.set(file.trip.id, file.trip.title)
      }
    })
    return Array.from(tripsMap.entries()).map(([id, title]) => ({ value: id, label: title }))
  })

  return {
    files,
    filters,
    sortBy,
    viewMode,
    isLoading,
    error,
    fetchFiles,
    deleteFile,
    filteredAndSortedFiles,
    totalStorageUsed,
    tripsForFilter,
  }
})
