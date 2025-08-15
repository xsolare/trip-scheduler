<script setup lang="ts">
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { useModuleStore } from '../../composables/use-module'

const store = useModuleStore(['hub'])
const {
  isCreateModalOpen,
  newTripData,
  isCreating,
} = storeToRefs(store.hub)

const isFormValid = computed(() => {
  return newTripData.value.title.trim().length > 0
})
</script>

<template>
  <KitDialogWithClose
    v-model:visible="isCreateModalOpen"
    title="Новое путешествие"
    icon="mdi:map-plus-outline"
    :max-width="500"
  >
    <div class="create-trip-flow">
      <StepBasicInfo v-model="newTripData" />

      <div class="flow-actions">
        <KitBtn
          variant="outlined"
          color="secondary"
          @click="store.hub.closeCreateModal"
        >
          Отмена
        </KitBtn>
        <KitBtn
          :disabled="!isFormValid || isCreating"
          :loading="isCreating"
          @click="store.hub.createTrip"
        >
          Создать и перейти
        </KitBtn>
      </div>
    </div>
  </KitDialogWithClose>
</template>

<style lang="scss" scoped>
.create-trip-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.flow-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-secondary-color);
}
</style>
