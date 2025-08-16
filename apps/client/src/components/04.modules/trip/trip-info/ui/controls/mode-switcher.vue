<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'

const { ui } = useModuleStore(['ui'])
const { isViewMode } = storeToRefs(ui)

const buttonConfig = computed(() => {
  if (isViewMode.value) {
    return {
      icon: 'mdi:pencil-outline',
      title: 'Перейти в режим редактирования',
    }
  }
  return {
    icon: 'mdi:eye-outline',
    title: 'Перейти в режим просмотра',
  }
})

function toggleMode() {
  ui.setInteractionMode(isViewMode.value ? 'edit' : 'view')
}
</script>

<template>
  <button class="mode-button" :title="buttonConfig.title" @click="toggleMode">
    <Icon :icon="buttonConfig.icon" />
  </button>
</template>

<style scoped lang="scss">
.mode-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
  padding: 8px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}
</style>
