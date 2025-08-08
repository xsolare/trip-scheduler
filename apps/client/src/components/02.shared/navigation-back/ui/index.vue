<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="navigation-back-container">
    <button class="navigation-back-btn" @click="goBack">
      <Icon icon="mdi:arrow-left" />
      <span>Назад</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.navigation-back-container {
  display: flex;
  margin-bottom: 16px;
}

.navigation-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--fg-secondary-color);
  border-radius: 8px;
  opacity: 0.7;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  .iconify {
    font-size: 1.1rem;
  }

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-accent-color);
    border-color: var(--border-primary-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--bg-overlay-primary-color);
    opacity: 1;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px var(--bg-overlay-primary-color);
  }
}
</style>
