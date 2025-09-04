import type { Booking, BookingSectionContent } from '../models/types'
import { useDebounceFn } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, watch } from 'vue'

interface UseBookingSectionProps {
  section: {
    id: string
    type: 'booking'
    content: BookingSectionContent
  }
  readonly: boolean
}

/**
 * Хук для управления логикой секции бронирований.
 * @param props - Входящие параметры компонента.
 * @param emit - Функция для отправки событий.
 */
export function useBookingSection(
  props: UseBookingSectionProps,
  emit: (event: 'updateSection', payload: any) => void,
) {
  const bookings = ref<Booking[]>(JSON.parse(JSON.stringify(props.section.content?.bookings || [])))
  const activeTab = ref<'flight' | 'hotel' | string>('flight')

  const debouncedUpdate = useDebounceFn(() => {
    emit('updateSection', {
      ...props.section,
      content: { bookings: bookings.value },
    })
  }, 700)

  const bookingGroups = computed(() => {
    return bookings.value.reduce((acc, booking) => {
      if (!acc[booking.type]) {
        acc[booking.type] = []
      }
      acc[booking.type].push(booking)
      return acc
    }, {} as Record<string, Booking[]>)
  })

  const tabItems = computed(() => {
    const tabs = [
      { id: 'flight', label: 'Авиаперелеты', icon: 'mdi:airplane' },
      { id: 'hotel', label: 'Отели', icon: 'mdi:hotel' },
    ]
    // Устанавливаем активную вкладку на первую, где есть бронирования, если текущая пуста
    if (bookingGroups.value[activeTab.value]?.length === 0) {
      const firstNonEmptyTab = tabs.find(tab => bookingGroups.value[tab.id]?.length > 0)
      if (firstNonEmptyTab) {
        activeTab.value = firstNonEmptyTab.id
      }
    }
    return tabs
  })

  function addBooking(type: Booking['type']) {
    if (props.readonly)
      return

    const typeNameMap = { flight: 'авиабилет', hotel: 'отель' }
    const newBooking: Booking = {
      id: uuidv4(),
      type,
      icon: type === 'flight' ? 'mdi:airplane' : 'mdi:hotel',
      title: `Новый ${typeNameMap[type] || 'элемент'}`,
      data: {},
    } as Booking // Утверждаем тип
    bookings.value.unshift(newBooking)
    activeTab.value = type // Переключаемся на вкладку нового бронирования
  }

  function deleteBooking(id: string) {
    if (props.readonly)
      return
    bookings.value = bookings.value.filter(b => b.id !== id)
  }

  function updateBooking(updatedBooking: Booking) {
    const index = bookings.value.findIndex(b => b.id === updatedBooking.id)
    if (index !== -1) {
      bookings.value.splice(index, 1, updatedBooking)
    }
  }

  function updateBookingsForGroup(group: string, newBookings: Booking[]) {
    const otherBookings = bookings.value.filter(b => b.type !== group)
    bookings.value = [...otherBookings, ...newBookings]
  }

  watch(bookings, () => {
    debouncedUpdate()
  }, { deep: true })

  return {
    bookings,
    activeTab,
    bookingGroups,
    tabItems,
    addBooking,
    deleteBooking,
    updateBooking,
    updateBookingsForGroup,
  }
}
