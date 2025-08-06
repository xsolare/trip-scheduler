import type { App } from 'vue'
import { useThemeStore } from '~/shared/store/theme.store'

export const themePlugin = {
  install(app: App) {
    const pinia = app.config.globalProperties.$pinia
    if (!pinia) {
      console.error('Theme plugin requires Pinia to be installed first.')
      return
    }

    const themeStore = useThemeStore(pinia)

    themeStore.loadInitialTheme()

    watchEffect(() => {
      const htmlElement = document.documentElement

      htmlElement.style.cssText = ''

      if (themeStore.isCustomThemeActive) {
        // Устанавливаем data-theme в 'custom', чтобы некоторые стили могли адаптироваться
        // если это будет необходимо, но при этом применяем переменные напрямую.
        htmlElement.setAttribute('data-theme', 'custom')
        const palette = themeStore.customThemePalette
        for (const key in palette) {
          htmlElement.style.setProperty(`--${key}`, palette[key])
        }
      }
      else {
        htmlElement.setAttribute('data-theme', themeStore.activeThemeName)
      }
    })
  },
}
