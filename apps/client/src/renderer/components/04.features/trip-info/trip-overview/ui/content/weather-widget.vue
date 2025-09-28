<script setup lang="ts">
import type { PropType } from 'vue'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue'

interface WeatherData {
  average: number | null
  min: number | null
  max: number | null
}

const props = defineProps({
  cities: {
    type: Array as PropType<string[]>,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
})

const selectedCity = ref<string | null>(null)
const weatherData = ref<WeatherData>({ average: null, min: null, max: null })
const isLoading = ref(false)
const error = ref<string | null>(null)

const monthName = computed(() => {
  if (!props.startDate)
    return ''
  const date = new Date(props.startDate)
  return date.toLocaleString('ru-RU', { month: 'long' })
})

async function fetchWeatherForCity(city: string) {
  if (!city || !props.startDate)
    return
  isLoading.value = true
  error.value = null
  weatherData.value = { average: null, min: null, max: null }

  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`)
    if (!geoResponse.ok)
      throw new Error('Не удалось получить координаты города.')
    const geoData = await geoResponse.json()
    if (!geoData.results || geoData.results.length === 0)
      throw new Error(`Город '${city}' не найден.`)
    const { latitude, longitude } = geoData.results[0]

    const tripDate = new Date(props.startDate)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const isFutureTrip = tripDate > currentDate

    const year = tripDate.getFullYear()
    const month = tripDate.getMonth()
    const startDateOfMonth = new Date(Date.UTC(year, month, 1)).toISOString().split('T')[0]
    const endDateOfMonth = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0]

    let weatherApiData

    if (isFutureTrip) {
      const climateResponse = await fetch(`https://climate-api.open-meteo.com/v1/climate?latitude=${latitude}&longitude=${longitude}&start_date=${startDateOfMonth}&end_date=${endDateOfMonth}&daily=temperature_2m_mean&models=FGOALS_f3_H`)
      if (!climateResponse.ok)
        throw new Error('Не удалось загрузить климатический прогноз.')
      weatherApiData = await climateResponse.json()

      if (weatherApiData.daily && weatherApiData.daily.temperature_2m_mean) {
        const temperatures = weatherApiData.daily.temperature_2m_mean.filter((t: number | null) => t !== null) as number[]
        if (temperatures.length > 0) {
          const sum = temperatures.reduce((a, b) => a + b, 0)
          weatherData.value = {
            average: Math.round(sum / temperatures.length),
            min: Math.round(Math.min(...temperatures)),
            max: Math.round(Math.max(...temperatures)),
          }
        }
        else {
          throw new Error('Нет данных о средней температуре.')
        }
      }
      else {
        throw new Error('Данные о температуре отсутствуют в ответе API.')
      }
    }
    else {
      const archiveResponse = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDateOfMonth}&end_date=${endDateOfMonth}&monthly=temperature_2m_mean,temperature_2m_max,temperature_2m_min&timezone=auto`)
      if (!archiveResponse.ok)
        throw new Error('Не удалось загрузить архив погоды.')
      weatherApiData = await archiveResponse.json()

      if (weatherApiData.monthly) {
        weatherData.value = {
          average: weatherApiData.monthly.temperature_2m_mean?.[0] !== null ? Math.round(weatherApiData.monthly.temperature_2m_mean[0]) : null,
          min: weatherApiData.monthly.temperature_2m_min?.[0] !== null ? Math.round(weatherApiData.monthly.temperature_2m_min[0]) : null,
          max: weatherApiData.monthly.temperature_2m_max?.[0] !== null ? Math.round(weatherApiData.monthly.temperature_2m_max[0]) : null,
        }
      }
      else {
        throw new Error('Данные о температуре отсутствуют в ответе API.')
      }
    }
  }
  catch (e: any) {
    console.error('Weather widget error:', e)
    error.value = e.message || 'Произошла ошибка при запросе погоды.'
  }
  finally {
    isLoading.value = false
  }
}

watch(selectedCity, (newCity) => {
  if (newCity) {
    fetchWeatherForCity(newCity)
  }
})

onMounted(() => {
  if (props.cities.length > 0) {
    selectedCity.value = props.cities[0]
  }
})
</script>

<template>
  <div class="info-widget-card weather-widget">
    <h3 class="widget-title">
      Средняя погода в {{ monthName }}
    </h3>
    <div v-if="cities.length > 1" class="city-selector-wrapper">
      <Icon icon="mdi:city-variant-outline" />
      <select v-model="selectedCity" class="city-selector">
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>
    <div class="forecast-display">
      <div v-if="isLoading" class="state-info">
        <Icon icon="mdi:loading" class="spin" />
        <span>Загрузка прогноза...</span>
      </div>
      <div v-else-if="error" class="state-info error">
        <Icon icon="mdi:alert-circle-outline" />
        <span>{{ error }}</span>
      </div>
      <div v-else-if="weatherData.average !== null" class="weather-summary">
        <div class="summary-item">
          <span class="label">Мин.</span>
          <span class="value">{{ weatherData.min }}°C</span>
        </div>
        <div class="summary-item average">
          <span class="label">Сред.</span>
          <span class="value">{{ weatherData.average }}°C</span>
        </div>
        <div class="summary-item">
          <span class="label">Макс.</span>
          <span class="value">{{ weatherData.max }}°C</span>
        </div>
      </div>
      <div v-else class="state-info">
        <span>Нет данных для отображения</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
  display: flex;
  flex-direction: column;
}
.widget-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--fg-primary-color);
  margin: 0 0 1rem;
}
.city-selector-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-m);
  padding: 4px 12px;
  margin-bottom: 1rem;
  color: var(--fg-secondary-color);
  flex-shrink: 0;
}
.city-selector {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--fg-primary-color);
  cursor: pointer;
}
.forecast-display {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-m);
  padding: 1rem;
}
.state-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--fg-secondary-color);
  text-align: center;
  flex-grow: 1;

  &.error {
    color: var(--fg-error-color);
  }
  .spin {
    animation: spin 1s linear infinite;
  }
}

.weather-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  width: 100%;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  .label {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    margin-bottom: 0.25rem;
  }
  .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--fg-primary-color);
  }
  &.average {
    .value {
      font-size: 2.5rem;
      color: var(--fg-accent-color);
    }
    .label {
      font-size: 1rem;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
