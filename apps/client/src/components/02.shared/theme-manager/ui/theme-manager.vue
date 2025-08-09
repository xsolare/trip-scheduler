<script setup lang="ts">
import type { ThemeType } from '~/shared/types/models/theme'
import { DialogWithClose } from '~/components/01.kit/dialog-with-close'
import ThemeChooser from './sections/theme-chooser.vue'
import ThemeEditor from './sections/theme-editor.vue'

const store = useAppStore(['theme'])
const { isCreatorOpen, activeThemeName } = storeToRefs(store.theme)

const showCustomizer = ref(false)
const jsonInput = ref<HTMLInputElement | null>(null)

function selectTheme(themeName: ThemeType) {
  store.theme.setTheme(themeName)
  if (themeName !== 'custom') {
    showCustomizer.value = false
  }
}

function openCustomizer() {
  store.theme.setTheme('custom')
  showCustomizer.value = true
}

function closeCreator() {
  showCustomizer.value = false
  store.theme.closeCreator()
}

function triggerJsonUpload() {
  jsonInput.value?.click()
}

function handleJsonUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      store.theme.applyCustomPalette(json)
    }
    catch (error) {
      console.error('Ошибка при разборе JSON:', error)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <DialogWithClose
    v-model:visible="isCreatorOpen"
    :title="showCustomizer ? 'Редактор пользовательской темы' : 'Выбор темы оформления'"
  >
    <ThemeChooser
      v-if="!showCustomizer"
      :active-theme-name="activeThemeName"
      @select-theme="selectTheme"
      @open-customizer="openCustomizer"
    />

    <ThemeEditor
      v-else
      @back="showCustomizer = false"
      @apply="closeCreator"
      @reset="store.theme.resetCustomTheme"
      @upload="triggerJsonUpload"
    />

    <input
      ref="jsonInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleJsonUpload"
    >
  </DialogWithClose>
</template>

<style lang="scss" scoped>
/*
  Здесь могут остаться только самые общие стили,
  если они не были перенесены в дочерние компоненты.
  В идеале этот блок может быть пустым.
*/
</style>
