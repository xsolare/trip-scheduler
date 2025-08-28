import { useThemeStore } from '~/shared/store/theme.store'

/**
 * Применяет палитру (цветов или радиусов) как CSS переменные к указанному элементу.
 * @param element - HTML-элемент, к которому применяются стили.
 * @param palette - Объект с ключами-именами переменных и значениями.
 */
function applyPalette(element: HTMLElement, palette: Record<string, string>) {
  for (const key in palette) {
    element.style.setProperty(`--${key}`, palette[key])
  }
}

/**
 * Инициализирует наблюдатель, который отслеживает изменения в теме
 * и динамически применяет CSS-переменные к `<html>`.
 *
 * Эта функция должна вызываться только на стороне клиента.
 */
export function setupCssVariablesUpdater() {
  const themeStore = useThemeStore()

  watchEffect(() => {
    const htmlElement = document.documentElement

    if (themeStore.isCustomThemeActive) {
      htmlElement.setAttribute('data-theme', 'custom')

      applyPalette(htmlElement, themeStore.customThemePalette)
      applyPalette(htmlElement, themeStore.customThemeRadius)
      applyPalette(htmlElement, themeStore.customThemeShadows)
    }
    else {
      htmlElement.setAttribute('data-theme', themeStore.activeThemeName)
      htmlElement.style.cssText = ''
    }
  })
}
