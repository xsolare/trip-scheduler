<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  durationDays: number
  cityCount: number
  participantCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="info-widget-card stats-widget">
    <div class="stat-item">
      <div class="icon-wrapper">
        <Icon icon="mdi:calendar-range" class="stat-icon" />
      </div>
      <div class="stat-text">
        <span class="stat-value">{{ durationDays }}</span>
        <span class="stat-label">{{ durationDays === 1 ? 'День' : (durationDays > 1 && durationDays < 5 ? 'Дня' : 'Дней') }}</span>
      </div>
    </div>
    <div class="stat-item">
      <div class="icon-wrapper">
        <Icon icon="mdi:city-variant-outline" class="stat-icon" />
      </div>
      <div class="stat-text">
        <span class="stat-value">{{ cityCount }}</span>
        <span class="stat-label">{{ cityCount === 1 ? 'Город' : (cityCount > 1 && cityCount < 5 ? 'Города' : 'Городов') }}</span>
      </div>
    </div>
    <div class="stat-item">
      <div class="icon-wrapper">
        <Icon icon="mdi:account-group-outline" class="stat-icon" />
      </div>
      <div class="stat-text">
        <span class="stat-value">{{ participantCount }}</span>
        <span class="stat-label">{{ participantCount === 1 ? 'Участник' : (participantCount > 1 && participantCount < 5 ? 'Участника' : 'Участников') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-widget {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1rem 0.5rem;
  border-radius: var(--r-m);
  background-color: var(--bg-tertiary-color);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--s-m);
    background-color: var(--bg-hover-color);
  }
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  transition: all 0.2s ease;
}

.stat-item:hover .icon-wrapper {
  background-color: var(--bg-accent-color-translucent);
  border-color: var(--fg-accent-color);
}

.stat-icon {
  font-size: 1.75rem;
  color: var(--fg-accent-color);
  transition: color 0.2s ease;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--fg-primary-color);
  line-height: 1.1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--fg-secondary-color);
}
</style>
