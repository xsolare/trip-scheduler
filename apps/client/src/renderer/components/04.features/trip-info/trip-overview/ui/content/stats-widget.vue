<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  durationDays: number
  cityCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="info-widget-card stats-widget">
    <div class="stat-item">
      <Icon icon="mdi:calendar-range" class="stat-icon" />
      <div class="stat-text">
        <span class="stat-value">{{ durationDays }}</span>
        <span class="stat-label">{{ durationDays === 1 ? 'День' : (durationDays > 1 && durationDays < 5 ? 'Дня' : 'Дней') }}</span>
      </div>
    </div>
    <div class="stat-divider" />
    <div class="stat-item">
      <Icon icon="mdi:city-variant-outline" class="stat-icon" />
      <div class="stat-text">
        <span class="stat-value">{{ cityCount }}</span>
        <span class="stat-label">{{ cityCount === 1 ? 'Город' : (cityCount > 1 && cityCount < 5 ? 'Города' : 'Городов') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-widget {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1.5rem 1rem;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}
.stat-icon {
  font-size: 2rem;
  color: var(--fg-accent-color);
}
.stat-text {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--fg-primary-color);
  line-height: 1;
}
.stat-label {
  font-size: 0.8rem;
  color: var(--fg-secondary-color);
}
.stat-divider {
  width: 1px;
  height: 40px;
  background-color: var(--border-secondary-color);
}
</style>
