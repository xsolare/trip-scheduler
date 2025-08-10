<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon?: string
  variant?: 'solid' | 'outlined'
  color?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  disabled: false,
})

const componentClasses = computed(() => [
  'kit-btn',
  `kit-btn--${props.variant}`,
  `kit-btn--color-${props.color}`,
])
</script>

<template>
  <button
    :class="componentClasses"
    :disabled="props.disabled"
    type="button"
  >
    <span class="kit-btn__content">
      <Icon v-if="props.icon" :icon="props.icon" />
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
.kit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--r-2xs);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  & * {
    pointer-events: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow:
      0 7px 14px rgba(50, 50, 93, 0.1),
      0 3px 6px rgba(0, 0, 0, 0.08);
  }

  &:not(:disabled):active {
    transform: translateY(0px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  &--solid {
    &.kit-btn--color-primary {
      background-color: var(--fg-accent-color);
      border-color: var(--fg-accent-color);
      color: var(--fg-inverted-color);

      &:not(:disabled):hover {
        background-color: var(--bg-action-hover-color);
        border-color: var(--bg-action-hover-color);
      }
    }
    &.kit-btn--color-secondary {
      background-color: var(--bg-tertiary-color);
      color: var(--fg-primary-color);

      &:not(:disabled):hover {
        background-color: var(--bg-hover-color);
      }
    }
  }

  &--outlined {
    background-color: transparent;
    box-shadow: none;

    &.kit-btn--color-primary {
      border-color: var(--fg-accent-color);
      color: var(--fg-accent-color);

      &:not(:disabled):hover {
        background-color: var(--bg-disabled-color);
      }
    }
    &.kit-btn--color-secondary {
      border-color: var(--border-secondary-color);
      color: var(--fg-secondary-color);
      &:not(:disabled):hover {
        background-color: var(--bg-hover-color);
        color: var(--fg-primary-color);
        border-color: var(--border-hover-color);
      }
    }
  }
}

.kit-btn__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
