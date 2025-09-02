<script setup lang="ts">
import type { TripSection } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'

interface Props {
  section: TripSection
}
defineProps<Props>()
</script>

<template>
  <div class="placeholder-container">
    <Icon :icon="section.icon || 'mdi:help-circle-outline'" class="placeholder-icon" />
    <h3 class="placeholder-title">
      Раздел "{{ section.title }}" ({{ section.type }})
    </h3>
    <p class="placeholder-message">
      Отображение для этого типа раздела находится в разработке.
    </p>
    <pre class="placeholder-content">{{ JSON.stringify(section.content, null, 2) }}</pre>
  </div>
</template>

<style scoped lang="scss">
.placeholder-container {
  padding: 48px;
  text-align: center;
  border: 2px dashed var(--border-secondary-color);
  border-radius: var(--r-l);
  color: var(--fg-secondary-color);
  margin-top: 24px;
}
.placeholder-icon {
  font-size: 3rem;
  opacity: 0.5;
  margin-bottom: 1rem;
}
.placeholder-title {
  font-size: 1.25rem;
  color: var(--fg-primary-color);
  margin-bottom: 0.5rem;
}
.placeholder-message {
  margin-bottom: 1.5rem;
}
.placeholder-content {
  max-width: 100%;
  overflow: auto;
  text-align: left;
  background-color: var(--bg-tertiary-color);
  padding: 1rem;
  border-radius: var(--r-s);
  font-size: 0.8rem;
  color: var(--fg-tertiary-color);
}
</style>
