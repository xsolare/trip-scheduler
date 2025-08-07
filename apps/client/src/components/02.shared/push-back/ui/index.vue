<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="pb-container">
    <button class="pb-btn" @click="goBack">
      <Icon icon="mdi:arrow-left" />
      Назад
    </button>
  </div>
</template>

<style scoped lang="scss">
.pb-container {
  display: flex;
  margin-bottom: 10px;
}

.pb-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
    transform: translateX(-4px);
  }

  &:active {
    transform: translateX(0);
  }
}
</style>
