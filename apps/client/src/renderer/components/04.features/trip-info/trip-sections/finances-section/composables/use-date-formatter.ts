/**
 * Простой composable для форматирования дат.
 */
export function useDateFormatter() {
  const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
    return new Intl.DateTimeFormat('ru-RU', options).format(new Date(dateString))
  }

  return { formatDate }
}
