<script setup lang="ts">
import {
  TimeFieldInput,
  TimeFieldRoot,
} from 'reka-ui'
import { Time } from '@internationalized/date'

const model = defineModel<string>({ required: true })

const timeValue = computed({
  get() {
    if (!model.value || !/^\d{2}:\d{2}$/.test(model.value))
      return null
    const [hour, minute] = model.value.split(':').map(Number)
    return new Time(hour, minute)
  },
  set(v) {
    if (v)
      model.value = `${String(v.hour).padStart(2, '0')}:${String(v.minute).padStart(2, '0')}`
  },
})
</script>

<template>
  <TimeFieldRoot v-model="timeValue" class="time-field-root">
    <TimeFieldInput
      class="time-field-input"
      part="dayPeriod"
      hour-cycle="24"
    />
  </TimeFieldRoot>
</template>

<style scoped lang="scss">
.time-field-root {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid var(--border-secondary-color);
  border-radius: 6px;
  background-color: var(--bg-secondary-color);
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--border-primary-color);
  }

  &[data-focus-within] {
    border-color: var(--fg-accent-color);
    box-shadow: 0 0 0 1px var(--fg-accent-color);
  }
}

.time-field-input {
  :deep([data-radix-vue-collection-item]) {
    padding: 2px;
    border-radius: 2px;
    font-variant-numeric: tabular-nums;

    &[data-focused] {
      background-color: var(--fg-accent-color);
      color: var(--bg-primary-color);
      outline: none;
    }

    &[data-placeholder] {
      color: var(--fg-secondary-color);
    }
  }

  :deep([data-segment="literal"]) {
    margin: 0 1px;
  }
}
</style>
