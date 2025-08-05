<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({
  selector: 'html',
  attribute: 'data-theme',
  modes: {
    dark: 'dark',
    light: 'light',
  },
})

function toggleTheme() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

const icon = computed(() =>
  mode.value === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny',
)
</script>

<template>
  <button class="theme-switcher" @click="toggleTheme">
    <transition name="fade" mode="out-in">
      <Icon :key="icon" :icon="icon" class="theme-icon" />
    </transition>
  </button>
</template>

<style scoped lang="scss">
.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--fg-secondary-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  overflow: hidden;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-accent-color);
  }
}

.theme-icon {
  position: absolute;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
