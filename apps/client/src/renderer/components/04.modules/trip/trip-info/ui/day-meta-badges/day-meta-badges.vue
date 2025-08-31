<script setup lang="ts">
import type { DayMetaInfo } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { v4 as uuidv4 } from 'uuid'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitInput } from '~/components/01.kit/kit-input'

interface Props {
  meta: DayMetaInfo[]
  readonly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:meta'])

const confirm = useConfirm()

// --- State ---
const isEditorOpen = ref(false)
const isViewerOpen = ref(false)
const currentItem = ref<DayMetaInfo | null>(null)
const isNewItem = ref(false)
const iconSearchQuery = ref('')

// --- Constants ---
const defaultColors = [
  'var(--bg-secondary-color)',
  'var(--bg-tertiary-color)',
  '#FFADAD',
  '#FFD6A5',
  '#FDFFB6',
  '#CAFFBF',
  '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
]
const iconList = [
  // Transport
  'mdi:walk',
  'mdi:car',
  'mdi:train',
  'mdi:airplane',
  'mdi:bus',
  'mdi:taxi',
  'mdi:ferry',
  'mdi:bike',
  // Accommodation & Food
  'mdi:bed',
  'mdi:food-fork-drink',
  'mdi:coffee-outline',
  'mdi:store-outline',
  'mdi:tent',
  // Activities & Sights
  'mdi:camera-outline',
  'mdi:map-marker-outline',
  'mdi:hiking',
  'mdi:swim',
  'mdi:beach',
  'mdi:shopping-outline',
  'mdi:music-note-outline',
  'mdi:party-popper',
  // General & Info
  'mdi:currency-usd',
  'mdi:ticket-confirmation-outline',
  'mdi:weather-sunny',
  'mdi:weather-night',
  'mdi:flag-variant-outline',
  'mdi:information-outline',
  'mdi:run-fast',
  'mdi:bank-outline',
  'mdi:gas-station-outline',
  'mdi:fire',
  'mdi:heart-outline',
  'mdi:star-outline',
  'mdi:check-circle-outline',
  'mdi:alert-circle-outline',
  'mdi:help-circle-outline',
  'mdi:account-group-outline',
  'mdi:phone-outline',
  'mdi:link-variant',
  'mdi:calendar-blank-outline',
]

// --- Computed ---
const currentItemContent = computed({
  get: () => currentItem.value?.content ?? '',
  set: (value) => {
    if (currentItem.value)
      currentItem.value.content = value
  },
})

const filteredIcons = computed(() => {
  if (!iconSearchQuery.value)
    return iconList
  return iconList.filter(icon => icon.toLowerCase().includes(iconSearchQuery.value.toLowerCase()))
})

// --- Methods ---
function getContrastColor(hexcolor: string | undefined): string {
  if (!hexcolor)
    return '#000000'
  hexcolor = hexcolor.replace('#', '')
  const r = Number.parseInt(hexcolor.substring(0, 2), 16)
  const g = Number.parseInt(hexcolor.substring(2, 4), 16)
  const b = Number.parseInt(hexcolor.substring(4, 6), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? '#000000' : '#FFFFFF'
}

function openEditor(item?: DayMetaInfo) {
  isNewItem.value = !item
  currentItem.value = { ...(item || { id: uuidv4(), title: '', color: defaultColors[0], icon: 'mdi:information-outline', content: '' }) }
  isEditorOpen.value = true
}

function openViewer(item: DayMetaInfo) {
  if (!item.content)
    return
  currentItem.value = item
  isViewerOpen.value = true
}

function handleSave() {
  if (!currentItem.value?.title)
    return

  let newMeta: DayMetaInfo[]
  if (isNewItem.value) {
    newMeta = [...props.meta, currentItem.value]
  }
  else {
    newMeta = props.meta.map(m => (m.id === currentItem.value!.id ? currentItem.value! : m))
  }
  emit('update:meta', newMeta)
  closeEditor()
}

async function handleDelete(item: DayMetaInfo) {
  const isConfirmed = await confirm({
    title: `Удалить "${item.title}"?`,
    description: 'Это действие нельзя будет отменить.',
  })
  if (isConfirmed) {
    const newMeta = props.meta.filter(m => m.id !== item.id)
    emit('update:meta', newMeta)
  }
}

function closeEditor() {
  isEditorOpen.value = false
  currentItem.value = null
}

function closeViewer() {
  isViewerOpen.value = false
  currentItem.value = null
}
</script>

<template>
  <div class="day-meta-badges-container">
    <div class="badges-wrapper">
      <div v-for="item in meta" :key="item.id" class="badge-wrapper">
        <button
          class="badge"
          :style="{
            backgroundColor: `${item.color}70`,
            color: getContrastColor(item.color),
            borderColor: `${item.color}50`,
          }"
          @click="openViewer(item)"
        >
          <Icon v-if="item.icon" :icon="item.icon" class="badge-icon" />
          <div class="badge-text">
            <span class="badge-title">{{ item.title }}</span>
            <span v-if="item.subtitle" class="badge-subtitle">{{ item.subtitle }}</span>
          </div>
        </button>
        <div v-if="!readonly" class="badge-actions">
          <button class="action-btn edit" title="Редактировать" @click="openEditor(item)">
            <Icon icon="mdi:pencil-outline" />
          </button>
          <button class="action-btn delete" title="Удалить" @click="handleDelete(item)">
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      </div>
    </div>

    <KitBtn
      v-if="!readonly"
      variant="outlined"
      icon="mdi:plus-circle-outline"
      class="add-badge-btn"
      @click="openEditor()"
    >
      Добавить инфо
    </KitBtn>

    <!-- Viewer Dialog -->
    <KitDialogWithClose
      v-if="currentItem"
      v-model:visible="isViewerOpen"
      :title="currentItem.title"
      :icon="currentItem.icon"
      :max-width="1000"
      @update:visible="!$event && closeViewer()"
    >
      <KitInlineMdEditorWrapper :model-value="currentItem.content || ''" :readonly="true" />
    </KitDialogWithClose>

    <!-- Editor Dialog -->
    <KitDialogWithClose
      v-if="currentItem"
      v-model:visible="isEditorOpen"
      :title="isNewItem ? 'Новая информация' : 'Редактирование'"
      icon="mdi:pencil-outline"
    >
      <div class="editor-form">
        <KitInput v-model="currentItem.title" label="Заголовок" placeholder="Название поля (напр. 'Темп')" />
        <KitInput v-model="currentItem.subtitle" label="Подзаголовок" placeholder="Значение поля (напр. 'Низкий')" />
        <div class="icon-picker">
          <label>Иконка</label>
          <KitInput v-model="iconSearchQuery" placeholder="Поиск иконки (напр. 'car')" icon="mdi:magnify" />
          <div class="icon-picker-grid">
            <button
              v-for="icon in filteredIcons"
              :key="icon"
              class="icon-option"
              :class="{ 'is-active': currentItem.icon === icon }"
              @click="currentItem.icon = icon"
            >
              <Icon :icon="icon" />
            </button>
          </div>
        </div>
        <div class="color-picker">
          <label>Цвет</label>
          <div class="color-options">
            <input v-model="currentItem.color" type="color" class="color-input">
            <button
              v-for="color in defaultColors"
              :key="color"
              class="color-option"
              :style="{ backgroundColor: color }"
              :class="{ 'is-active': currentItem.color === color }"
              @click="currentItem.color = color"
            />
          </div>
        </div>
        <div class="content-editor">
          <label>Содержимое (Markdown)</label>
          <KitInlineMdEditorWrapper v-model="currentItemContent" placeholder="Детальное описание, которое появится при клике..." />
        </div>
        <div class="editor-actions">
          <KitBtn variant="text" @click="closeEditor">
            Отмена
          </KitBtn>
          <KitBtn @click="handleSave">
            Сохранить
          </KitBtn>
        </div>
      </div>
    </KitDialogWithClose>
  </div>
</template>

<style scoped lang="scss">
.day-meta-badges-container {
  padding: 16px 0;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.badges-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.badge-wrapper {
  position: relative;

  &:hover .badge-actions {
    opacity: 1;
    transform: translateY(0);
  }
}

.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--r-s);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--s-m);
  }
}

.badge-icon {
  font-size: 1.1rem;
}

.badge-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.badge-title {
  font-family: 'Sansation';
  font-weight: 600;
  font-size: 1rem;
}

.badge-subtitle {
  font-family: 'Sansation';
  font-weight: 500;
  font-size: 0.9rem;
}

.badge-actions {
  position: absolute;
  top: -12px;
  right: -8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.2s ease;

  .action-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--bg-tertiary-color);
    border: 1px solid var(--border-secondary-color);
    color: var(--fg-secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px;

    &.edit:hover {
      color: var(--fg-accent-color);
      border-color: var(--fg-accent-color);
    }

    &.delete:hover {
      color: var(--fg-error-color);
      border-color: var(--fg-error-color);
    }
  }
}

.add-badge-btn {
  width: fit-content;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border-secondary-color);
}
.color-picker,
.icon-picker {
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
}
.color-options {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap; /* ИЗМЕНЕНИЕ */
}
.color-option {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--bg-primary-color);
  outline: 1px solid var(--border-secondary-color);
  cursor: pointer;
  transition: all 0.2s;
  &.is-active {
    border-color: var(--fg-accent-color);
    transform: scale(1.1);
  }
}

.color-input {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid var(--border-secondary-color);
    border-radius: 50%;
  }
}

.icon-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.icon-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
  gap: 8px;
  max-height: 142px; /* 3 rows * (36px height + 8px gap) - 8px gap */
  overflow-y: auto;
  background-color: var(--bg-secondary-color);
  padding: 8px;
  border-radius: var(--r-s);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-primary-color);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
.icon-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-s);
  border: 1px solid transparent;
  background-color: var(--bg-tertiary-color);
  color: var(--fg-secondary-color);
  cursor: pointer;
  font-size: 1.4rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }
  &.is-active {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}

.content-editor {
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
  :deep(.kit-inline-md-editor-minimal .milkdown > div) {
    border: 1px solid var(--border-primary-color);
    border-radius: var(--r-s);
    padding: 8px;
  }
}
</style>
