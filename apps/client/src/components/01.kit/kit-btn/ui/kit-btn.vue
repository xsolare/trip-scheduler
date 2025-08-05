<script setup lang="ts">
interface Props {
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
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease;

  & * {
    pointer-events: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--solid {
    &.kit-btn--color-primary {
      background-color: var(--fg-accent-color);
      color: #fff;

      &:not(:disabled):hover {
        background-color: var(--bg-action-hover-color);
      }
    }
    &.kit-btn--color-secondary {
      background-color: var(--bg-tertiary-color);
      color: var(--fg-primary-color);

      &:not(:disabled):hover {
        background-color: var(--bg-hover-color);
      }
    }
    transition: all 0.2s ease-in-out;
  }

  &--outlined {
    background-color: transparent;

    &.kit-btn--color-primary {
      border-color: var(--fg-accent-color);
      color: var(--fg-accent-color);

      &:not(:disabled):hover {
        background-color: rgba(var(--fg-accent-color-rgb), 0.1);
      }
    }
    &.kit-btn--color-secondary {
      border-color: var(--border-secondary-color);
      color: var(--fg-secondary-color);
      &:not(:disabled):hover {
        background-color: var(--bg-hover-color);
        border-color: var(--border-primary-color);
      }
    }
    transition: all 0.2s ease-in-out;
  }
}

.kit-btn__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
