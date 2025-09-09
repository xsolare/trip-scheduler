import type { KitDropdownItem } from '~/components/01.kit/kit-dropdown'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import type { TripSection } from '~/shared/types/models/trip'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'
import { useIconPicker } from './use-icon-picker'

export function useTripInfoLayout() {
  const store = useModuleStore(['sections'])
  const { sortedSections } = storeToRefs(store.sections)
  const confirm = useConfirm()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const router = useRouter()
  const route = useRoute()

  const activeTabId = ref<string>((route.query.section as string) || 'daily-route')
  const isDrawerOpen = ref(false)
  const isLayoutDropdownOpen = ref(false)
  const isHeaderDropdownOpen = ref(false)
  const navigationWrapperRef = ref(null)
  const mainNavigationRef = ref<HTMLElement>()
  const isNavigationVisible = ref(true)

  const isEditSectionDialogOpen = ref(false)
  const sectionToEdit = ref<{ id: string, title: string, icon: string } | null>(null)

  const {
    iconSearchQuery: iconSearchQueryEdit,
    filteredIcons: filteredIconsEdit,
  } = useIconPicker()

  const tabItems = computed((): ViewSwitcherItem<string>[] => {
    const dailyRouteTab: ViewSwitcherItem<string> = {
      id: 'daily-route',
      label: 'Маршрут по дням',
      icon: 'mdi:calendar-month-outline',
    }
    const sectionTabs: ViewSwitcherItem<string>[] = sortedSections.value.map((section: TripSection) => ({
      id: section.id,
      label: section.title,
      icon: section.icon || 'mdi:file-document-outline',
    }))
    return [dailyRouteTab, ...sectionTabs]
  })

  watchEffect(() => {
    const sectionIdFromQuery = route.query.section as string
    if (sectionIdFromQuery && tabItems.value.some(item => item.id === sectionIdFromQuery)) {
      if (activeTabId.value !== sectionIdFromQuery) {
        activeTabId.value = sectionIdFromQuery
      }
    }
    else if (!sectionIdFromQuery && activeTabId.value !== 'daily-route') {
      activeTabId.value = 'daily-route'
    }
  })

  const activeTab = computed(() => tabItems.value.find(item => item.id === activeTabId.value))

  const menuItems = computed((): KitDropdownItem[] => {
    const baseItems: KitDropdownItem[] = [
      { value: 'share', label: 'Поделиться', icon: 'mdi:share-variant-outline' },
    ]

    // Если выбрана какая-либо секция (а не "Маршрут по дням")
    if (activeTab.value && activeTab.value.id !== 'daily-route') {
      const sectionActions: KitDropdownItem[] = [
        { value: 'edit', label: 'Редактировать', icon: 'mdi:pencil-outline' },
        { value: 'clear', label: 'Очистить', icon: 'mdi:broom' },
        { value: 'delete', label: 'Удалить', icon: 'mdi:trash-can-outline' },
      ]
      return [...sectionActions, ...baseItems]
    }

    return baseItems
  })

  // --- МЕТОДЫ (METHODS) ---
  function selectSection(id: string) {
    activeTabId.value = id
    isDrawerOpen.value = false
    isLayoutDropdownOpen.value = false
    isHeaderDropdownOpen.value = false

    const currentQuery = { ...route.query }

    if (activeTabId.value === 'daily-route') {
      delete currentQuery.section
      router.push({ query: currentQuery })
    }
    else {
      router.push({ query: { ...currentQuery, section: activeTabId.value } })
    }
  }

  function handleCurrentSectionClick() {
    if (isMobile.value)
      isDrawerOpen.value = true
    else
      isLayoutDropdownOpen.value = !isLayoutDropdownOpen.value
  }

  function handleHeaderCurrentSectionClick() {
    if (isMobile.value)
      isDrawerOpen.value = true
    else
      isHeaderDropdownOpen.value = !isHeaderDropdownOpen.value
  }

  function openEditDialog() {
    if (!activeTab.value || activeTab.value.id === 'daily-route')
      return
    const section = sortedSections.value.find((s: TripSection) => s.id === activeTab.value!.id)
    if (!section)
      return
    sectionToEdit.value = {
      id: section.id,
      title: section.title,
      icon: section.icon || 'mdi:file-document-outline',
    }
    iconSearchQueryEdit.value = ''
    isEditSectionDialogOpen.value = true
  }

  async function handleUpdateSection() {
    if (!sectionToEdit.value || !sectionToEdit.value.title.trim())
      return
    const section = sortedSections.value.find((s: TripSection) => s.id === sectionToEdit.value!.id)
    if (section) {
      await store.sections.updateSection({
        ...section,
        title: sectionToEdit.value.title,
        icon: sectionToEdit.value.icon,
      })
    }
    isEditSectionDialogOpen.value = false
  }

  async function handleClearSection() {
    if (!activeTab.value || activeTab.value.id === 'daily-route')
      return

    const isConfirmed = await confirm({
      title: `Очистить раздел "${activeTab.value.label}"?`,
      description: 'Все содержимое раздела будет удалено, но сам раздел останется.',
      confirmText: 'Очистить',
      type: 'danger',
    })
    if (isConfirmed)
      await store.sections.clearSection(activeTab.value.id)
  }

  async function handleDeleteSection() {
    if (!activeTab.value || activeTab.value.id === 'daily-route')
      return
    const isConfirmed = await confirm({
      title: `Удалить раздел "${activeTab.value.label}"?`,
      description: 'Это действие нельзя отменить.',
      confirmText: 'Удалить',
      type: 'danger',
    })
    if (isConfirmed) {
      const sectionIdToDelete = activeTab.value.id
      selectSection('daily-route')
      await store.sections.deleteSection(sectionIdToDelete)
    }
  }

  function handleMenuAction(item: KitDropdownItem | string) {
    const value = typeof item === 'object' && item !== null ? item.value : item
    if (!value)
      return

    switch (value) {
      case 'share':
        // eslint-disable-next-line no-console
        console.log('Share action triggered for:', activeTab.value?.label)
        break
      case 'edit':
        openEditDialog()
        break
      case 'clear':
        handleClearSection()
        break
      case 'delete':
        handleDeleteSection()
        break
    }
  }

  function navigate(direction: 'prev' | 'next') {
    const currentIndex = tabItems.value.findIndex(item => item.id === activeTabId.value)
    if (currentIndex === -1)
      return
    const totalItems = tabItems.value.length
    let nextIndex
    if (direction === 'next')
      nextIndex = (currentIndex + 1) % totalItems
    else
      nextIndex = (currentIndex - 1 + totalItems) % totalItems

    selectSection(tabItems.value[nextIndex].id)
  }

  watch(isNavigationVisible, (isVisible) => {
    if (!isVisible)
      isLayoutDropdownOpen.value = false
  })

  watch(isEditSectionDialogOpen, (isOpen) => {
    if (!isOpen)
      sectionToEdit.value = null
  })

  onClickOutside(navigationWrapperRef, () => {
    isLayoutDropdownOpen.value = false
  })

  onMounted(() => {
    if (!mainNavigationRef.value)
      return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNavigationVisible.value = entry.isIntersecting
      },
      { threshold: 0.1 },
    )

    observer.observe(mainNavigationRef.value)

    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return {
    // Refs
    navigationWrapperRef,
    mainNavigationRef,

    // State
    isMobile,
    activeTabId,
    isDrawerOpen,
    isLayoutDropdownOpen,
    isHeaderDropdownOpen,
    isNavigationVisible,
    isEditSectionDialogOpen,
    sectionToEdit,
    iconSearchQueryEdit,

    // Computed
    tabItems,
    activeTab,
    menuItems,
    filteredIconsEdit,

    // Methods
    selectSection,
    handleCurrentSectionClick,
    handleHeaderCurrentSectionClick,
    handleMenuAction,
    navigate,
    openEditDialog,
    handleUpdateSection,
  }
}

export type TripInfoLayout = ReturnType<typeof useTripInfoLayout>
