import { computed, watch } from 'vue'
import { useThemeStore } from '~/shared/store/theme.store'

/**
 * Composable, который отслеживает изменения темы
 * и автоматически обновляет мета-тег 'theme-color'.
 */
export function useThemeMetaUpdater() {
  const themeStore = useThemeStore()

  const themeColor = computed(() => {
    switch (themeStore.activeThemeName) {
      case 'light':
        return '#e8eaeb'
      case 'dark':
        return '#121314'
      case 'custom':
        return themeStore.customThemePalette['bg-secondary-color'] || '#e8eaeb'
      default:
        return '#e8eaeb'
    }
  })

  watch(themeColor, (newColor) => {
    let metaTag = document.querySelector('meta[name="theme-color"]')

    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = 'theme-color'
      document.head.appendChild(metaTag)
    }

    metaTag.setAttribute('content', newColor)
  }, {
    immediate: true,
  })
}
