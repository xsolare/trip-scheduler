<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  city: string
}

defineProps<Props>()

// TODO: Заменить на реальный API-запрос погоды
const mockForecast = [
  { day: 'ПН', icon: 'mdi:weather-sunny', temp: '+15°' },
  { day: 'ВТ', icon: 'mdi:weather-partly-cloudy', temp: '+12°' },
  { day: 'СР', icon: 'mdi:weather-rainy', temp: '+10°' },
  { day: 'ЧТ', icon: 'mdi:weather-cloudy', temp: '+11°' },
  { day: 'ПТ', icon: 'mdi:weather-sunny', temp: '+16°' },
]
</script>

<template>
  <div class="info-widget-card weather-widget">
    <h3 class="widget-title">
      Прогноз погоды в г. {{ city }}
    </h3>
    <div class="forecast-list">
      <div v-for="day in mockForecast" :key="day.day" class="forecast-item">
        <span class="day-label">{{ day.day }}</span>
        <Icon :icon="day.icon" class="weather-icon" />
        <span class="temp-label">{{ day.temp }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.widget-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--fg-primary-color);
  margin: 0 0 1rem;
}
.forecast-list {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--r-m);
  background-color: var(--bg-tertiary-color);
  flex-grow: 1;
}
.day-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--fg-secondary-color);
}
.weather-icon {
  font-size: 1.75rem;
  color: var(--fg-accent-color);
}
.temp-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--fg-primary-color);
}
</style>
