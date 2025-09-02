<script setup lang="ts">
import type { TripSection } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'
import { v4 as uuidv4 } from 'uuid'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitInput } from '~/components/01.kit/kit-input'
import { KitSelectWithSearch } from '~/components/01.kit/kit-select-with-search'
import { useModuleStore } from '~/components/04.modules/trip-info/composables/use-module'

interface Props {
  section: TripSection
}
const props = defineProps<Props>()

interface Booking {
  id: string
  type: string
  title: string
  details: Record<string, any>
  dayIds: string[]
}

const { sections: sectionsStore, ui: uiStore, data: dataStore } = useModuleStore(['sections', 'ui', 'data'])
const { isViewMode } = storeToRefs(uiStore)
const { getAllDays } = storeToRefs(dataStore)

const bookingTypes = [
  { value: 'hotel', label: 'Отель', icon: 'mdi:bed-outline' },
  { value: 'flight', label: 'Авиабилет', icon: 'mdi:airplane' },
  { value: 'transport', label: 'Транспорт', icon: 'mdi:car-outline' },
  { value: 'activity', label: 'Мероприятие', icon: 'mdi:ticket-outline' },
  { value: 'other', label: 'Другое', icon: 'mdi:shape-outline' },
]

const dayOptions = computed(() => getAllDays.value.map(day => ({
  value: day.id,
  label: `${day.title} (${new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })})`,
})))

const isModalOpen = ref(false)
const currentBooking = ref<Booking | null>(null)
const isEditing = ref(false)

const bookings = computed(() => (props.section.content?.items as Booking[]) || [])

function getBookingTypeInfo(type: string) {
  return bookingTypes.find(t => t.value === type) || bookingTypes.find(t => t.value === 'other')!
}

function openBookingModal(booking: Booking | null = null) {
  isEditing.value = !!booking
  currentBooking.value = booking
    ? { ...booking }
    : {
        id: uuidv4(),
        type: 'hotel',
        title: '',
        details: {},
        dayIds: [],
      }
  isModalOpen.value = true
}

function saveBooking() {
  const newBookings = [...bookings.value]
  if (isEditing.value) {
    const index = newBookings.findIndex(b => b.id === currentBooking.value!.id)
    if (index !== -1) {
      newBookings[index] = currentBooking.value!
    }
  }
  else {
    newBookings.push(currentBooking.value!)
  }
  const updatedSection = {
    ...props.section,
    content: { items: newBookings },
  }
  sectionsStore.updateSection(updatedSection)
  isModalOpen.value = false
}

function deleteBooking(bookingId: string) {
  const newBookings = bookings.value.filter((b: any) => b.id !== bookingId)
  const updatedSection = {
    ...props.section,
    content: { items: newBookings },
  }
  sectionsStore.updateSection(updatedSection)
}
</script>

<template>
  <div class="bookings-section">
    <div v-if="!isViewMode" class="section-actions">
      <KitBtn icon="mdi:plus" @click="openBookingModal()">
        Добавить бронирование
      </KitBtn>
    </div>

    <div v-if="bookings.length > 0" class="bookings-grid">
      <div v-for="booking in bookings" :key="booking.id" class="booking-card">
        <div class="card-header">
          <div class="card-title">
            <Icon :icon="getBookingTypeInfo(booking.type).icon" class="title-icon" />
            <span>{{ booking.title || 'Без названия' }}</span>
          </div>
          <div v-if="!isViewMode" class="card-actions">
            <button class="action-btn" @click="openBookingModal(booking)">
              <Icon icon="mdi:pencil-outline" />
            </button>
            <button class="action-btn" @click="deleteBooking(booking.id)">
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Здесь можно будет добавить отображение деталей -->
        </div>
        <div v-if="booking.dayIds && booking.dayIds.length > 0" class="card-footer">
          <Icon icon="mdi:calendar-check-outline" class="footer-icon" />
          <span>{{ booking.dayIds.length }} дн.</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <Icon icon="mdi:book-multiple-outline" class="empty-icon" />
      <p>Здесь пока нет бронирований.</p>
      <span v-if="!isViewMode">Нажмите "Добавить", чтобы создать первое.</span>
    </div>

    <!-- Модальное окно для добавления/редактирования -->
    <KitDialogWithClose v-if="currentBooking" v-model:visible="isModalOpen" :title="isEditing ? 'Редактировать' : 'Новое бронирование'">
      <div class="modal-form">
        <KitSelectWithSearch v-model="currentBooking.type" :items="bookingTypes" label="Тип бронирования" />
        <KitInput v-model="currentBooking.title" label="Название" placeholder="Например, Отель 'Grand Budapest'" />
        <KitSelectWithSearch v-model="currentBooking.dayIds" :items="dayOptions" label="Привязать к дням (необязательно)" multiple />
        <!-- Сюда можно будет добавить поля для деталей в зависимости от типа -->
        <div class="modal-actions">
          <KitBtn variant="text" @click="isModalOpen = false">
            Отмена
          </KitBtn>
          <KitBtn @click="saveBooking">
            Сохранить
          </KitBtn>
        </div>
      </div>
    </KitDialogWithClose>
  </div>
</template>

<style scoped lang="scss">
.bookings-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.booking-card {
  background: var(--bg-secondary-color);
  border-radius: var(--r-m);
  border: 1px solid var(--border-secondary-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--fg-primary-color);
}
.card-actions {
  display: flex;
  gap: 0.25rem;
  .action-btn {
    /* Стили для кнопок редактирования/удаления */
  }
}
.card-footer {
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-primary-color);
  font-size: 0.8rem;
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--fg-secondary-color);
  .empty-icon {
    font-size: 2.5rem;
    opacity: 0.5;
  }
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);
}
</style>
