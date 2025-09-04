<script setup lang="ts">
import type { LocationCoords } from '../../models/types'
import { ref, watch } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitInput } from '~/components/01.kit/kit-input'

interface Props {
  modelValue: LocationCoords | undefined
  label: string
  readonly: boolean
  visible: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'update:visible'])

const tempCoords = ref<LocationCoords>({ lat: 0, lon: 0 })

watch(() => props.visible, (isOpen) => {
  if (isOpen) {
    // При открытии устанавливаем временные координаты из modelValue или по умолчанию
    tempCoords.value = { ...(props.modelValue || { lat: 55.75, lon: 37.61 }) }
  }
})

function saveLocation() {
  emit('update:modelValue', { ...tempCoords.value })
  emit('update:visible', false)
}

function closeModal() {
  emit('update:visible', false)
}
</script>

<template>
  <KitDialogWithClose
    :visible="visible"
    :title="label"
    icon="mdi:map-marker"
    :max-width="800"
    @update:visible="closeModal"
  >
    <div class="location-picker-content">
      <div class="map-placeholder">
        <p>Интерактивная карта для выбора точки.</p>
        <p>Так как полная реализация карты выходит за рамки доработки кода, здесь представлен интерфейс для ручного ввода координат.</p>
      </div>
      <div class="coords-inputs">
        <KitInput v-model="tempCoords.lat" label="Широта (Lat)" type="number" />
        <KitInput v-model="tempCoords.lon" label="Долгота (Lon)" type="number" />
      </div>
      <div class="dialog-actions">
        <KitBtn variant="outlined" @click="closeModal">
          Отмена
        </KitBtn>
        <KitBtn @click="saveLocation">
          Сохранить
        </KitBtn>
      </div>
    </div>
  </KitDialogWithClose>
</template>

<style scoped lang="scss">
.location-picker-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px;
}
.map-placeholder {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-m);
  color: var(--fg-secondary-color);
  text-align: center;
  padding: 1rem;
}
.coords-inputs {
  display: flex;
  gap: 1rem;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);
}
</style>
