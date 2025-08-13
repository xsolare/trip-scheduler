<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  label?: string
  icon?: string
  type?: 'text' | 'email' | 'password' | 'number'
  name?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: undefined,
  type: 'text',
  name: undefined,
  placeholder: '',
  disabled: false,
  required: false,
  error: null,
})

const model = defineModel<string | number>()

const id = `kit-input-${Math.random().toString(36).substring(2, 9)}`

const isPasswordVisible = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<template>
  <div class="kit-input-group" :class="{ 'has-error': !!error }">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="kit-input-wrapper">
      <Icon v-if="icon" :icon="icon" class="input-icon-prefix" />
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="{ 'has-prefix-icon': !!icon }"
      >
      <div class="input-icon-append">
        <button
          v-if="type === 'password'"
          type="button"
          class="icon-btn"
          @click="isPasswordVisible = !isPasswordVisible"
        >
          <Icon :icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
        </button>
        <slot v-else name="append" />
      </div>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.kit-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
}

.kit-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .input-icon-prefix {
    position: absolute;
    left: 12px;
    color: var(--fg-tertiary-color);
    pointer-events: none;
    z-index: 1;
  }

  input {
    width: 100%;
    padding: 12px 12px;
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-primary-color);
    border-radius: var(--r-s);
    color: var(--fg-primary-color);
    font-size: 1rem;
    transition: border-color 0.2s;

    &.has-prefix-icon {
      padding-left: 40px;
    }

    &:focus {
      outline: none;
      border-color: var(--border-focus-color);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .input-icon-append {
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
    height: 100%;
    z-index: 1;

    .icon-btn {
      display: flex;
      color: var(--fg-secondary-color);

      &:hover {
        color: var(--fg-primary-color);
      }
    }
  }
}

.has-error {
  label {
    color: var(--fg-error-color);
  }
  input {
    border-color: var(--border-error-color) !important;
  }
}

.error-message {
  font-size: 0.8rem;
  color: var(--fg-error-color);
  margin-top: 2px;
}
</style>
