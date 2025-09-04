import { useDebounceFn } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, ref, watch } from 'vue'

// --- Типы ---
export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface ChecklistSectionContent {
  items: ChecklistItem[]
}

interface UseChecklistSectionProps {
  section: {
    id: string
    type: 'checklist'
    content: ChecklistSectionContent
  }
  readonly: boolean
}

/**
 * Хук для управления логикой секции чек-листа.
 * @param props - Входящие параметры компонента.
 * @param emit - Функция для отправки событий.
 */
export function useChecklistSection(
  props: UseChecklistSectionProps,
  emit: (event: 'updateSection', payload: any) => void,
) {
  // --- Локальное состояние ---
  const items = ref<ChecklistItem[]>(JSON.parse(JSON.stringify(props.section.content?.items || [])))
  const newItemText = ref('')
  const newItemInputRef = ref<HTMLInputElement | null>(null)

  // --- Логика ---
  const debouncedUpdate = useDebounceFn(() => {
    emit('updateSection', {
      ...props.section,
      content: { items: items.value },
    })
  }, 700)

  /**
   * Добавляет новый элемент в список.
   */
  async function addItem() {
    if (props.readonly || !newItemText.value.trim())
      return

    items.value.push({
      id: uuidv4(),
      text: newItemText.value,
      completed: false,
    })
    newItemText.value = ''
    await nextTick()
    newItemInputRef.value?.focus()
  }

  /**
   * Удаляет элемент из списка по ID.
   * @param id - ID элемента для удаления.
   */
  function deleteItem(id: string) {
    if (props.readonly)
      return
    items.value = items.value.filter(item => item.id !== id)
  }

  /**
   * Обновляет текст элемента.
   * @param id - ID элемента для обновления.
   * @param newText - Новый текст элемента.
   */
  function updateItemText(id: string, newText: string) {
    if (props.readonly)
      return
    const item = items.value.find(i => i.id === id)
    if (item)
      item.text = newText
  }

  // --- Вычисляемые свойства ---
  const progress = computed(() => {
    const total = items.value.length
    if (total === 0)
      return 0
    const completed = items.value.filter(item => item.completed).length
    return Math.round((completed / total) * 100)
  })

  // --- Наблюдатели ---
  watch(items, () => {
    debouncedUpdate()
  }, { deep: true })

  watch(() => props.section.content, (newContent) => {
    if (JSON.stringify(newContent?.items) !== JSON.stringify(items.value))
      items.value = JSON.parse(JSON.stringify(newContent?.items || []))
  }, { deep: true })

  return {
    items,
    newItemText,
    newItemInputRef,
    progress,
    addItem,
    deleteItem,
    updateItemText,
  }
}
