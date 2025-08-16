<script setup lang="ts">
import type { ITrip } from '../../../models/types'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'

const props = defineProps<{
  modelValue: boolean
  trip: ITrip
}>()

const emit = defineEmits(['update:modelValue', 'update:trip'])

const editedTrip = ref({
  ...props.trip,
  citiesString: props.trip.cities?.join(', ') || '',
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(() => props.trip, (newTrip) => {
  editedTrip.value = {
    ...newTrip,
    citiesString: newTrip.cities?.join(', ') || '',
  }
}, { deep: true })

function saveChanges() {
  if (!editedTrip.value.title?.trim()) {
    return
  }
  if (!editedTrip.value.id) {
    console.error('Отсутствует ID поездки')
    return
  }

  const citiesArray = editedTrip.value.citiesString
    .split(',')
    .map(city => city.trim())
    .filter(city => city)

  emit('update:trip', {
    ...editedTrip.value,
    cities: citiesArray,
  })
  closeModal()
}

function closeModal() {
  isOpen.value = false
}
</script>

<template>
  <KitDialogWithClose :visible="isOpen" title="Редактирование путешествия" @update:visible="isOpen = $event">
    <div class="modal-body">
      <div class="form-group">
        <label>Название*</label>
        <input v-model="editedTrip.title" class="form-input" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Дата начала*</label>
          <input v-model="editedTrip.startDate" type="date" class="form-input" required>
        </div>
        <div class="form-group">
          <label>Дата окончания*</label>
          <input v-model="editedTrip.endDate" type="date" class="form-input" required :min="editedTrip.startDate">
        </div>
      </div>

      <div class="form-group">
        <label>Города</label>
        <input
          v-model="editedTrip.citiesString" class="form-input"
          placeholder="Введите через запятую: Москва, Санкт-Петербург, Сочи"
        >
        <small class="hint-text">Перечислите города через запятую</small>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Бюджет</label>
          <input v-model.number="editedTrip.budget" type="number" class="form-input" min="0">
        </div>
        <div class="form-group">
          <label>Валюта</label>
          <select v-model="editedTrip.currency" class="form-input">
            <option value="RUB">
              RUB
            </option>
            <option value="USD">
              USD
            </option>
            <option value="EUR">
              EUR
            </option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Статус</label>
        <select v-model="editedTrip.status" class="form-input">
          <option value="draft">
            Черновик
          </option>
          <option value="planned">
            Запланировано
          </option>
          <option value="in-progress">
            В процессе
          </option>
          <option value="completed">
            Завершено
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Видимость</label>
        <select v-model="editedTrip.visibility" class="form-input">
          <option value="private">
            Приватное
          </option>
          <option value="shared">
            Доступ по ссылке
          </option>
          <option value="public">
            Публичное
          </option>
        </select>
      </div>
    </div>

    <div class="modal-footer">
      <KitBtn variant="outlined" color="secondary" class="action-btn" @click="closeModal">
        <template #icon>
          <Icon icon="mdi:close" />
        </template>
        Отменить
      </KitBtn>
      <KitBtn color="primary" class="action-btn" @click="saveChanges">
        <template #icon>
          <Icon icon="mdi:content-save" />
        </template>
        Сохранить
      </KitBtn>
    </div>
  </KitDialogWithClose>
</template>

<style scoped>
.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  min-width: 120px;
}

.hint-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
