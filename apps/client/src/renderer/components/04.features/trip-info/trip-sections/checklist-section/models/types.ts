/**
 * Определяет, к какому этапу путешествия относится задача или группа.
 */
export type ChecklistTab = 'preparation' | 'in-trip'

/**
 * Элемент чек-листа.
 */
export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  type: ChecklistTab
  groupId: string | null
  // --- НОВЫЕ ПОЛЯ ---
  description?: string // Описание или заметка к задаче
  priority?: 'normal' | 'high' // Приоритет задачи
  link?: string // Внешняя ссылка
}

/**
 * Группа для элементов чек-листа.
 */
export interface ChecklistGroup {
  id: string
  name: string
  icon: string
  type: ChecklistTab
}

/**
 * Структура контента для секции чек-листа.
 */
export interface ChecklistSectionContent {
  items: ChecklistItem[]
  groups: ChecklistGroup[]
}
