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
