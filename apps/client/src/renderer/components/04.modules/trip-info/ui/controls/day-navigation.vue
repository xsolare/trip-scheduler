<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { nextTick } from 'vue'
import { useModuleStore } from '~/components/04.modules/trip-info/composables/use-module'

const store = useModuleStore(['data'])

const { getPreviousDayId, getNextDayId } = storeToRefs(store.data)
const { selectPreviousDay, selectNextDay } = store.data

async function handleSelectPreviousDay() {
  selectPreviousDay()
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

async function handleSelectNextDay() {
  selectNextDay()
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'instant' })
}
</script>

<template>
  <div class="day-navigation">
    <button
      class="nav-button"
      :disabled="!getPreviousDayId"
      @click="handleSelectPreviousDay"
    >
      <Icon icon="mdi:chevron-left" />
      <span class="nav-button-text">Предыдущий день</span>
    </button>
    <button
      class="nav-button"
      :disabled="!getNextDayId"
      @click="handleSelectNextDay"
    >
      <span class="nav-button-text">Следующий день</span>
      <Icon icon="mdi:chevron-right" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.day-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid var(--border-secondary-color);
  margin-top: auto;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--r-s);
  border: 1px solid var(--border-secondary-color);
  background-color: transparent;
  color: var(--fg-secondary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:not(:disabled):hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .iconify {
    font-size: 1.2rem;
  }
}

@include media-down(sm) {
  .nav-button-text {
    display: none;
  }
}
</style>
