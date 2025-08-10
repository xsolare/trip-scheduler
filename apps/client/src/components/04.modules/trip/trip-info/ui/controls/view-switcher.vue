<script setup lang="ts">
import type { ActiveView } from '../../models/types'
import { Icon } from '@iconify/vue'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'

const store = useModuleStore(['ui'])
const { activeView } = storeToRefs(store.ui)

const views: { id: ActiveView, name: string, icon: string }[] = [
  { id: 'plan', name: 'План', icon: 'mdi:clipboard-text-outline' },
  { id: 'memories', name: 'Воспоминания', icon: 'mdi:camera-iris' },
]

const switcherRef = ref<HTMLElement | null>(null)
const buttonRefs = ref<Record<string, HTMLElement>>({})

const gliderStyle = computed(() => {
  const currentViewId = activeView.value
  const activeButton = buttonRefs.value[currentViewId]

  if (!activeButton || !switcherRef.value)
    return {}

  const switcherRect = switcherRef.value.getBoundingClientRect()
  const buttonRect = activeButton.getBoundingClientRect()

  const offsetLeft = buttonRect.left - switcherRect.left

  return {
    width: `${buttonRect.width}px`,
    transform: `translateX(${offsetLeft}px)`,
  }
})
</script>

<template>
  <div ref="switcherRef" class="view-switcher">
    <div class="glider" :style="gliderStyle" />

    <button
      v-for="view in views"
      :key="view.id"
      :ref="el => (buttonRefs[view.id] = el as HTMLElement)"
      class="switch-button"
      :class="{ active: activeView === view.id }"
      @click="store.ui.setActiveView(view.id)"
    >
      <Icon :icon="view.icon" />
      <span>{{ view.name }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.view-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid var(--border-secondary-color);
  margin: 16px 0;
  user-select: none;
}

.glider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  height: calc(100% - 8px);
  background-color: var(--bg-primary-color);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.switch-button {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--fg-secondary-color);
  background-color: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;

  .iconify {
    font-size: 1.1rem;
  }

  &.active {
    color: var(--fg-accent-color);
    font-weight: 600;
  }

  &:not(.active):hover {
    color: var(--fg-primary-color);
  }
}

@include media-down(sm) {
  .view-switcher {
    display: flex;
    width: 100%;
  }
  .switch-button {
    flex: 1;
    justify-content: center;
  }
}
</style>
