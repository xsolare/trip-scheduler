import type { ChecklistGroup, ChecklistItem, ChecklistSectionContent, ChecklistTab } from '../models/types'
import { useDebounceFn } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, watch } from 'vue'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'

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
  const confirm = useConfirm()

  // --- Локальное состояние ---
  const items = ref<ChecklistItem[]>(JSON.parse(JSON.stringify(props.section.content?.items || [])))
  const groups = ref<ChecklistGroup[]>(JSON.parse(JSON.stringify(props.section.content?.groups || [])))
  const activeTab = ref<ChecklistTab>('preparation')

  const tabItems = [
    { id: 'preparation', label: 'Подготовка', icon: 'mdi:briefcase-check-outline' },
    { id: 'in-trip', label: 'В путешествии', icon: 'mdi:map-marker-path' },
  ]

  // --- Логика ---
  const debouncedUpdate = useDebounceFn(() => {
    emit('updateSection', {
      ...props.section,
      content: { items: items.value, groups: groups.value },
    })
  }, 700)

  // --- Управление элементами ---
  function addItem(text: string, tab: ChecklistTab, groupId: string | null = null) {
    if (props.readonly || !text.trim())
      return

    items.value.unshift({
      id: uuidv4(),
      text,
      completed: false,
      type: tab,
      groupId,
    })
  }

  function deleteItem(id: string) {
    if (props.readonly)
      return
    items.value = items.value.filter(item => item.id !== id)
  }

  function updateItem(updatedItem: ChecklistItem) {
    if (props.readonly)
      return
    const index = items.value.findIndex(i => i.id === updatedItem.id)
    if (index !== -1)
      items.value[index] = updatedItem
  }

  // --- Управление группами ---
  function addGroup(tab: ChecklistTab) {
    if (props.readonly)
      return
    groups.value.unshift({
      id: uuidv4(),
      name: 'Новая группа',
      icon: 'mdi:tag-outline',
      type: tab,
    })
  }

  async function deleteGroup(id: string) {
    if (props.readonly)
      return

    const isConfirmed = await confirm({
      title: 'Удалить группу?',
      description: 'Все задачи внутри этой группы также будут удалены. Это действие необратимо.',
      confirmText: 'Удалить',
      type: 'danger',
    })

    if (isConfirmed) {
      groups.value = groups.value.filter(g => g.id !== id)
      // Удаляем все элементы, принадлежащие этой группе
      items.value = items.value.filter(item => item.groupId !== id)
    }
  }

  function updateGroup(updatedGroup: ChecklistGroup) {
    if (props.readonly)
      return
    const index = groups.value.findIndex(g => g.id === updatedGroup.id)
    if (index !== -1)
      groups.value[index] = updatedGroup
  }

  // --- Вычисляемые свойства ---
  const currentTabItems = computed(() => items.value.filter(item => item.type === activeTab.value))
  const currentTabGroups = computed(() => groups.value.filter(group => group.type === activeTab.value))
  const currentTabUngroupedItems = computed(() => currentTabItems.value.filter(item => !item.groupId))

  const itemsByGroupId = computed(() => {
    return currentTabItems.value.reduce((acc, item) => {
      if (item.groupId) {
        if (!acc[item.groupId])
          acc[item.groupId] = []

        acc[item.groupId].push(item)
      }
      return acc
    }, {} as Record<string, ChecklistItem[]>)
  })

  const progress = computed(() => {
    const relevantItems = currentTabItems.value
    const total = relevantItems.length
    if (total === 0)
      return 0
    const completed = relevantItems.filter(item => item.completed).length
    return Math.round((completed / total) * 100)
  })

  // --- Наблюдатели ---
  watch([items, groups], () => {
    debouncedUpdate()
  }, { deep: true })

  return {
    items,
    groups,
    activeTab,
    tabItems,
    progress,
    currentTabGroups,
    currentTabUngroupedItems,
    itemsByGroupId,
    addItem,
    deleteItem,
    updateItem,
    addGroup,
    deleteGroup,
    updateGroup,
  }
}
