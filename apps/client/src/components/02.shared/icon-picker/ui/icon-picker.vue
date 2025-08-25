<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'

interface Props {
  modelValue: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const pickerButton = ref<HTMLButtonElement | null>(null)
const dropdownPanel = ref<HTMLDivElement | null>(null)

const iconList = [
  'mdi:map-marker',
  'mdi:camera',
  'mdi:image-multiple',
  'mdi:file-document-outline',
  'mdi:format-list-bulleted',
  'mdi:car',
  'mdi:walk',
  'mdi:train',
  'mdi:airplane',
  'mdi:food',
  'mdi:fire',
  'mdi:information-outline',
  'mdi:check',
  'mdi:close',
  'mdi:flag',
  'mdi:star',
]

const sizeClass = computed(() => `size-${props.size}`)

function selectIcon(icon: string) {
  emit('update:modelValue', icon)
  isOpen.value = false
}

function togglePicker() {
  isOpen.value = !isOpen.value
}

onClickOutside(dropdownPanel, () => {
  isOpen.value = false
}, { ignore: [pickerButton] })

// --- ЛОГИКА ПОЗИЦИОНИРОВАНИЯ ---
async function updateDropdownPosition() {
  // Убедимся, что DOM обновился и элемент dropdownPanel доступен
  await nextTick()

  if (!dropdownPanel.value)
    return

  // Сбрасываем transform, чтобы получить реальные размеры и положение
  dropdownPanel.value.style.transform = 'translateX(-50%)'

  const dropdownRect = dropdownPanel.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth

  let shiftX = 0

  // Проверка выхода за правый край
  if (dropdownRect.right > viewportWidth) {
    shiftX = viewportWidth - dropdownRect.right - 8 // 8px отступ от края
  }
  // Проверка выхода за левый край
  if (dropdownRect.left < 0) {
    shiftX = -dropdownRect.left + 8 // 8px отступ от края
  }

  // Если нужен сдвиг, применяем его
  if (shiftX !== 0) {
    dropdownPanel.value.style.transform = `translateX(calc(-50% + ${shiftX}px))`
  }
}

// Следим за состоянием isOpen. Когда оно становится true, обновляем позицию.
watch(isOpen, (isNowOpen) => {
  if (isNowOpen) {
    updateDropdownPosition()
  }
})
</script>

<template>
  <div class="icon-picker-wrapper">
    <button
      ref="pickerButton"
      class="picker-button"
      :class="sizeClass"
      @click="togglePicker"
    >
      <Icon width="20" height="20" :icon="props.modelValue || 'mdi:image-off-outline'" class="main-icon" />
      <Icon icon="mdi:chevron-down" class="chevron" :class="{ rotated: isOpen }" />
    </button>

    <Transition name="fade">
      <div
        v-if="isOpen"
        ref="dropdownPanel"
        class="icon-dropdown"
      >
        <div class="icon-grid">
          <button
            v-for="icon in iconList"
            :key="icon"
            class="icon-option"
            :class="{ selected: icon === props.modelValue }"
            @click="selectIcon(icon)"
          >
            <Icon :icon="icon" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.icon-picker-wrapper {
  position: relative;
}

.picker-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-s);
  cursor: pointer;
  color: var(--fg-primary-color);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--border-primary-color);
  }

  .chevron {
    transition: transform 0.2s ease;
    flex-shrink: 0;
    &.rotated {
      transform: rotate(180deg);
    }
  }

  .main-icon {
    margin-right: 4px;
  }

  &.size-sm {
    height: 38px;
    padding: 0 10px;

    .main-icon {
      font-size: 1.2rem;
    }
  }
  &.size-md {
    height: 46px;
    padding: 0 12px;
    width: 62px;
    .main-icon {
      font-size: 1.4rem;
    }
  }
  &.size-lg {
    height: 54px;
    padding: 0 14px;
    width: 70px;
    .main-icon {
      font-size: 1.6rem;
    }
  }
}

.icon-dropdown {
  // --- CSS для базового центрирования ---
  position: absolute;
  top: calc(100% + 4px); // Отступ 4px снизу от кнопки
  left: 50%; // Центрируем по горизонтали
  transform: translateX(-50%); // Компенсируем сдвиг влево на 50% своей ширины

  min-width: 184px;
  padding: 8px;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-m);
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 8px;
}

.icon-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-s);
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--fg-secondary-color);
  cursor: pointer;
  font-size: 1.4rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }
  &.selected {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}
</style>
