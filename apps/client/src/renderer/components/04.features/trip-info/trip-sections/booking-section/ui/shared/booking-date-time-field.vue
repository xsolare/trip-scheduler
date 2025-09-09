<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { vMaska } from 'maska/vue'
import { computed } from 'vue'
import { KitInput } from '~/components/01.kit/kit-input'

interface Props {
  label: string
  icon?: string
  readonly: boolean
  placeholder?: string
  type?: 'date' | 'datetime'
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  placeholder: '...',
  type: 'date',
})

const modelValue = defineModel<string>()

const mask = computed(() => {
  if (props.type === 'datetime') {
    return '##.## ##:##'
  }
  return '##.##'
})

const effectivePlaceholder = computed(() => {
  if (props.placeholder !== '...')
    return props.placeholder
  if (props.type === 'datetime')
    return 'ДД.ММ ЧЧ:ММ'
  return 'ДД.ММ'
})

/**
 * Форматирует значение даты/времени для режима "только для чтения".
 */
const formattedValue = computed(() => {
  if (!modelValue.value)
    return props.placeholder

  const cleanDateString = modelValue.value.replace(/\[.*\]/, '')
  const date = new Date(cleanDateString)

  if (Number.isNaN(date.getTime()))
    return modelValue.value

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  }

  if (props.type === 'datetime') {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('ru-RU', options).format(date)
})
</script>

<template>
  <div class="booking-field">
    <!-- Readonly View -->
    <div v-if="props.readonly" class="readonly-wrapper">
      <label class="field-label">
        {{ label }}
      </label>
      <div class="readonly-content">
        <Icon v-if="icon" :icon="icon" class="field-icon" />
        <span :class="modelValue ? 'readonly-value' : 'readonly-placeholder'">
          {{ formattedValue }}
        </span>
      </div>
    </div>

    <!-- Editable View -->
    <KitInput
      v-else
      v-model="modelValue"
      v-maska
      :data-maska="mask"
      :label="label"
      :icon="icon"
      :placeholder="effectivePlaceholder"
      :disabled="readonly"
      size="sm"
    />
  </div>
</template>

<style scoped lang="scss">
.readonly-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field-label {
  font-size: 0.75rem;
  margin-left: 2px;
  color: var(--fg-tertiary-color);
  font-weight: 500;
}

.readonly-content {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  box-sizing: border-box;
  padding: 6px 2px;
}

.field-icon {
  font-size: 1rem;
  color: var(--fg-secondary-color);
  flex-shrink: 0;
}

.readonly-value {
  color: var(--fg-primary-color);
  line-height: 1.4;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.readonly-placeholder {
  color: var(--fg-tertiary-color);
}

.booking-field:deep(.kit-input-group) {
  gap: 2px;
}
.booking-field:deep(label) {
  font-size: 0.75rem;
  margin-left: 2px;
}
.booking-field:deep(input) {
  height: 36px;
  background-color: var(--bg-tertiary-color);
  &:focus {
    background-color: var(--bg-primary-color);
  }
}
</style>
