export function variableNameToHumanReadable(name: string): string {
  const translations: Record<string, string> = {
    color: 'Цвет',
    bg: 'Фон',
    fg: 'Текст',
    border: 'Граница',
    primary: 'Основной',
    secondary: 'Второстепенный',
    tertiary: 'Третичный',
    accent: 'Акцент',
    header: 'Заголовок',
    focus: 'Фокус',
    hover: 'Наведение',
    disabled: 'Отключенный',
    success: 'Успех',
    warning: 'Предупреждение',
    error: 'Ошибка',
    info: 'Информация',
    highlight: 'Подсветка',
    pressed: 'Нажатие',
    action: 'Действие',
    inverted: 'Инвертированный',
    muted: 'Приглушенный',
    overlay: 'Наложение',
    button: 'Кнопка',
  }

  return name
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => translations[word.toLowerCase()] || word)
    .join(' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}
