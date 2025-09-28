<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { Trip } from '~/shared/types/models/trip'
import { parseDate } from '@internationalized/date'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitInput } from '~/components/01.kit/kit-input'
import { CalendarPopover } from '~/components/02.shared/calendar-popover'

interface Props {
  visible: boolean
  trip: Trip | null
}
const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'save'])

const editableTrip = ref<Partial<Trip>>({})

const isChanged = computed(() => {
  if (!props.trip)
    return false
  return JSON.stringify(props.trip) !== JSON.stringify(editableTrip.value)
})

watch(() => props.visible, (isVisible) => {
  if (isVisible && props.trip) {
    editableTrip.value = JSON.parse(JSON.stringify(props.trip))
  }
})

const toYyyyMmDd = (date: string | Date) => new Date(date).toISOString().split('T')[0]

const startDate = computed({
  get: () => parseDate(toYyyyMmDd(editableTrip.value.startDate!)),
  set: (date: CalendarDate | null) => {
    if (date)
      editableTrip.value.startDate = date.toDate('UTC').toISOString()
  },
})
const endDate = computed({
  get: () => parseDate(toYyyyMmDd(editableTrip.value.endDate!)),
  set: (date: CalendarDate | null) => {
    if (date)
      editableTrip.value.endDate = date.toDate('UTC').toISOString()
  },
})

const cities = computed({
  get: () => editableTrip.value.cities?.join(', ') || '',
  set: (value) => {
    editableTrip.value.cities = value.split(',').map(c => c.trim()).filter(Boolean)
  },
})

function handleSave() {
  emit('save', editableTrip.value)
  emit('update:visible', false)
}
</script>

<template>
  <KitDialogWithClose
    :visible="visible"
    title="Редактировать путешествие"
    icon="mdi:pencil-outline"
    :max-width="500"
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-if="editableTrip" class="edit-trip-form">
      <KitInput v-model="editableTrip.title" label="Название" />
      <KitInput v-model="editableTrip.description" type="textarea" label="Описание" />
      <KitInput v-model="cities" label="Города (через запятую)" />
      <div class="date-pickers">
        <div class="date-picker">
          <label>Дата начала</label>
          <CalendarPopover v-model="startDate">
            <template #trigger>
              <button class="date-trigger">
                {{ startDate?.toString() }}
              </button>
            </template>
          </CalendarPopover>
        </div>
        <div class="date-picker">
          <label>Дата окончания</label>
          <CalendarPopover v-model="endDate">
            <template #trigger>
              <button class="date-trigger">
                {{ endDate?.toString() }}
              </button>
            </template>
          </CalendarPopover>
        </div>
      </div>
      <div class="form-actions">
        <KitBtn variant="outlined" color="secondary" @click="$emit('update:visible', false)">
          Отмена
        </KitBtn>
        <KitBtn :disabled="!isChanged" @click="handleSave">
          Сохранить
        </KitBtn>
      </div>
    </div>
  </KitDialogWithClose>
</template>

<style lang="scss" scoped>
.edit-trip-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.date-pickers {
  display: flex;
  gap: 1rem;
}

.date-picker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
}

.date-trigger {
  width: 100%;
  padding: 12px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: var(--r-s);
  color: var(--fg-primary-color);
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--border-focus-color);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);
}
</style>
