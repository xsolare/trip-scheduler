<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  title: string
  icon: string
  current: number
  limit: number
  unit: 'items' | 'bytes'
}

const props = defineProps<Props>()

const formattedCurrent = computed(() => {
  if (props.unit === 'bytes')
    return formatBytes(props.current)
  return props.current.toString()
})

const formattedLimit = computed(() => {
  if (props.unit === 'bytes')
    return formatBytes(props.limit)
  return props.limit.toString()
})

const percentage = computed(() => {
  if (props.limit === 0)
    return 0
  return Math.min(100, (props.current / props.limit) * 100)
})

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Байт'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
</script>

<template>
  <div class="quota-widget">
    <div class="widget-header">
      <div class="title">
        <Icon :icon="icon" />
        <span>{{ title }}</span>
      </div>
      <div class="usage">
        <strong>{{ formattedCurrent }}</strong> / {{ formattedLimit }}
      </div>
    </div>
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{ width: `${percentage}%` }"
        :class="{ 'is-full': percentage >= 100, 'is-high': percentage > 80 && percentage < 100 }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.quota-widget {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: var(--bg-secondary-color);
  padding: 12px;
  border-radius: var(--r-m);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--fg-secondary-color);
  font-weight: 500;
}

.usage {
  color: var(--fg-primary-color);
  strong {
    font-weight: 600;
  }
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--fg-accent-color);
  border-radius: var(--r-full);
  transition: width 0.5s ease-in-out;

  &.is-high {
    background-color: var(--fg-warning-color);
  }
  &.is-full {
    background-color: var(--fg-error-color);
  }
}
</style>
