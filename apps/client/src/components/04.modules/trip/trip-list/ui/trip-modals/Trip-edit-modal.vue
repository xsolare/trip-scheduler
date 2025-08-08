<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ITrip } from '../../models/types'
import { DialogWithClose } from '~/components/01.kit/dialog-with-close'
import { KitBtn } from '~/components/01.kit/kit-btn'

const props = defineProps<{
  modelValue: boolean
  trip: ITrip
}>()



const emit = defineEmits(['update:modelValue', 'save'])

const editedTrip = ref<ITrip>(JSON.parse(JSON.stringify(props.trip)))

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

watch(() => props.trip, (newTrip) => {
  editedTrip.value = JSON.parse(JSON.stringify(newTrip))
}, { deep: true })

const saveChanges = () => {
  if (!editedTrip.value.title?.trim()) {
    alert('Название не может быть пустым')
    return
  }
  emit('save', { ...editedTrip.value })
  closeModal()
}

const closeModal = () => {
  isOpen.value = false
}
</script>

<template>
  <DialogWithClose :visible="isOpen" @update:visible="isOpen = $event" title="Редактирование путешествия">
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
        <input v-model="editedTrip.cities" class="form-input" placeholder="Введите через запятую">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Бюджет</label>
          <input v-model.number="editedTrip.budget" type="number" class="form-input" min="0">
        </div>
        <div class="form-group">
          <label>Валюта</label>
          <select v-model="editedTrip.currency" class="form-input">
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Статус</label>
        <select v-model="editedTrip.status" class="form-input">
          <option value="draft">Черновик</option>
          <option value="planned">Запланировано</option>
          <option value="in-progress">В процессе</option>
          <option value="completed">Завершено</option>
        </select>
      </div>

      <div class="form-group">
        <label>Видимость</label>
        <select v-model="editedTrip.visibility" class="form-input">
          <option value="private">Приватное</option>
          <option value="shared">Доступ по ссылке</option>
          <option value="public">Публичное</option>
        </select>
      </div>
    </div>

    <div class="modal-footer">
      <KitBtn variant="outlined" color="secondary" @click="closeModal" class="action-btn">
        <template #icon>
          <Icon icon="mdi:close" />
        </template>
        Отменить
      </KitBtn>
      <KitBtn color="primary" @click="saveChanges" class="action-btn">
        <template #icon>
          <Icon icon="mdi:content-save" />
        </template>
        Сохранить
      </KitBtn>
    </div>
  </DialogWithClose>
</template>

<style scoped>
.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
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
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  min-width: 120px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>