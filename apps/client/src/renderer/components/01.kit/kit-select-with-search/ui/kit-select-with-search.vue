<script setup lang="ts" generic="T extends string | number | object">
import type { KitDropdownItem } from '~/components/01.kit/kit-dropdown'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { nextTick } from 'vue'
import { KitInput } from '~/components/01.kit/kit-input'

const props = withDefaults(defineProps<{
  modelValue: T | T[] | null
  items: KitDropdownItem<T>[]
  label?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  loading?: boolean
  multiple?: boolean
  creatable?: boolean
  icon?: string
}>(), {
  label: '',
  placeholder: 'Выберите значение...',
  disabled: false,
  clearable: true,
  loading: false,
  multiple: false,
  creatable: false,
  icon: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: T | T[] | null): void
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<InstanceType<typeof KitInput> | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')

const selectedItems = computed(() => {
  if (!props.modelValue)
    return []

  const modelValues = (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) as any[]

  return modelValues
    .map((value) => {
      const existingItem = props.items.find(item => item.value === value)
      return existingItem || { value, label: String(value) }
    })
    .filter(item => item.label)
})

const singleSelectedItemLabel = computed(() => {
  if (props.multiple || !props.modelValue)
    return ''
  return props.items.find(item => item.value === props.modelValue)?.label || ''
})

watch(singleSelectedItemLabel, (newLabel) => {
  if (!isOpen.value)
    searchQuery.value = newLabel
}, { immediate: true })

const filteredItems = computed(() => {
  if (!searchQuery.value)
    return props.items

  return props.items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function handleOpen() {
  if (props.disabled || isOpen.value)
    return
  isOpen.value = true
  if (!props.multiple)
    searchQuery.value = ''

  nextTick(() => {
    ;(searchInputRef.value?.$el as HTMLInputElement)?.focus()
  })
}

function handleClose() {
  if (!isOpen.value)
    return
  isOpen.value = false
  if (!props.multiple)
    searchQuery.value = singleSelectedItemLabel.value
  else
    searchQuery.value = ''
}

onClickOutside(wrapperRef, handleClose)

function selectItem(item: KitDropdownItem<T>) {
  if (props.multiple) {
    const model = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = model.findIndex(v => v === item.value)
    if (index === -1)
      model.push(item.value)

    emit('update:modelValue', model)
    searchQuery.value = ''
  }
  else {
    emit('update:modelValue', item.value)
    handleClose()
  }
}

function removeItem(itemValue: T) {
  if (!props.multiple || !Array.isArray(props.modelValue))
    return
  const model = props.modelValue.filter(v => v !== itemValue)
  emit('update:modelValue', model)
}

function clearSelection() {
  emit('update:modelValue', props.multiple ? [] : null)
  searchQuery.value = ''
  handleOpen()
}

function isSelected(item: KitDropdownItem<T>): boolean {
  if (props.multiple)
    return Array.isArray(props.modelValue) && props.modelValue.includes(item.value)

  return props.modelValue === item.value
}

function handleAddNewItem() {
  if (!props.creatable || !props.multiple || !searchQuery.value.trim())
    return

  const newValue = searchQuery.value.trim()
  const model = (Array.isArray(props.modelValue) ? [...props.modelValue] : []) as string[]

  if (!model.some(v => String(v).toLowerCase() === newValue.toLowerCase())) {
    model.push(newValue)
    emit('update:modelValue', model as any)
  }
  searchQuery.value = ''
}
</script>

<template>
  <div ref="wrapperRef" class="kit-select-with-search" :class="{ 'is-disabled': disabled }">
    <label v-if="label">{{ label }}</label>

    <!-- Режим с чипами (multiple) -->
    <div v-if="multiple" class="chip-input-wrapper" :class="{ 'is-focused': isOpen, 'has-icon': !!icon }" @click="handleOpen">
      <Icon v-if="icon" :icon="icon" class="main-icon" />
      <div v-for="item in selectedItems" :key="String(item.value)" class="chip">
        <span>{{ item.label }}</span>
        <Icon icon="mdi:close-circle" class="chip-remove-icon" @click.stop="removeItem(item.value)" />
      </div>
      <input
        v-if="isOpen || selectedItems.length === 0"
        ref="searchInputRef"
        v-model="searchQuery"
        :placeholder="selectedItems.length === 0 ? placeholder : ''"
        :disabled="disabled"
        class="search-input"
        autocomplete="off"
        @focus="handleOpen"
        @click.stop="handleOpen"
        @keydown.enter.prevent="handleAddNewItem"
      >
      <button
        v-if="clearable && selectedItems.length > 0 && !disabled"
        class="clear-btn"
        aria-label="Очистить выбор"
        @click.stop="clearSelection"
      >
        <Icon icon="mdi:close" />
      </button>
    </div>

    <!-- Одиночный режим -->
    <div v-else class="input-wrapper">
      <KitInput
        ref="searchInputRef"
        v-model="searchQuery"
        :placeholder="placeholder"
        :disabled="disabled"
        :icon="icon"
        autocomplete="off"
        @focus="handleOpen"
        @click="handleOpen"
      />
      <button
        v-if="clearable && modelValue !== null && !disabled"
        class="clear-btn"
        aria-label="Очистить выбор"
        @click.stop="clearSelection"
      >
        <Icon icon="mdi:close" />
      </button>
    </div>

    <!-- Общий выпадающий список -->
    <Transition name="fade-dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <ul v-if="filteredItems.length > 0 && !loading" class="dropdown-list">
          <li
            v-for="item in filteredItems"
            :key="String(item.value)"
            class="dropdown-item"
            :class="{ 'is-active': isSelected(item), 'is-disabled': multiple && isSelected(item) }"
            @mousedown.prevent="selectItem(item)"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="item-icon" />
            <span>{{ item.label }}</span>
            <Icon v-if="multiple && isSelected(item)" icon="mdi:check" class="item-check-icon" />
          </li>
        </ul>
        <div v-else-if="loading" class="dropdown-state">
          Загрузка...
        </div>
        <div v-else class="dropdown-state">
          Ничего не найдено
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
// ... (общие стили)
.kit-select-with-search {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
    padding-left: 4px;
  }
}

.input-wrapper {
  position: relative;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--fg-tertiary-color);
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  z-index: 3;

  &:hover {
    color: var(--fg-primary-color);
    background-color: var(--bg-hover-color);
  }
}

// ... (стили выпадающего списка)
.dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: var(--r-m);
  z-index: 100;
  box-shadow: var(--s-l);
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 6px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--r-s);
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.95rem;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &.is-active {
    background-color: var(--bg-accent-overlay-color);
    color: var(--fg-accent-color);
    font-weight: 500;
  }

  &.is-disabled {
    cursor: default;
    opacity: 0.7;
    background-color: transparent;
  }
}

.item-icon {
  font-size: 1.1rem;
  color: var(--fg-secondary-color);
}

.item-check-icon {
  margin-left: auto;
  font-size: 1.1rem;
}

.dropdown-state {
  padding: 16px;
  text-align: center;
  color: var(--fg-secondary-color);
}

.chip-input-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 40px 6px 12px;
  min-height: 46px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
  cursor: text;
  transition: border-color 0.2s;
  position: relative;

  &.has-icon {
    padding-left: 40px;
  }

  &.is-focused {
    border-color: var(--border-focus-color);
  }

  .main-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--fg-tertiary-color);
    font-size: 1.25rem;
  }

  .search-input {
    flex-grow: 1;
    border: none;
    background: none;
    outline: none;
    color: var(--fg-primary-color);
    font-size: 1rem;
    min-width: 120px;
    padding: 4px 0;
  }
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-accent-color);
  color: var(--fg-on-accent-color);
  padding: 4px 8px;
  border-radius: var(--r-s);
  font-size: 0.875rem;
  font-weight: 500;

  .chip-remove-icon {
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
