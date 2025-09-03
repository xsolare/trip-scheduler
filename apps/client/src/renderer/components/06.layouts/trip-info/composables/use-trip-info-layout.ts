import type { InjectionKey } from 'vue'
import type { KitDropdownItem } from '~/components/01.kit/kit-dropdown'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import type { TripSection } from '~/shared/types/models/trip'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'

// --- ИКОНЫ И КОНСТАНТЫ ---
const iconList = [
  'mdi:walk',
  'mdi:car',
  'mdi:train',
  'mdi:airplane',
  'mdi:bus',
  'mdi:taxi',
  'mdi:ferry',
  'mdi:bike',
  'mdi:bed',
  'mdi:food-fork-drink',
  'mdi:coffee-outline',
  'mdi:store-outline',
  'mdi:tent',
  'mdi:camera-outline',
  'mdi:map-marker-outline',
  'mdi:hiking',
  'mdi:swim',
  'mdi:beach',
  'mdi:shopping-outline',
  'mdi:music-note-outline',
  'mdi:party-popper',
  'mdi:currency-usd',
  'mdi:ticket-confirmation-outline',
  'mdi:weather-sunny',
  'mdi:weather-night',
  'mdi:flag-variant-outline',
  'mdi:information-outline',
  'mdi:run-fast',
  'mdi:bank-outline',
  'mdi:gas-station-outline',
  'mdi:fire',
  'mdi:heart-outline',
  'mdi:star-outline',
  'mdi:check-circle-outline',
  'mdi:alert-circle-outline',
  'mdi:help-circle-outline',
  'mdi:account-group-outline',
  'mdi:phone-outline',
  'mdi:link-variant',
  'mdi:calendar-blank-outline',
  'mdi:file-document-outline',
]

export function useTripInfoLayout() {
  const store = useModuleStore(['sections'])
  const { sortedSections } = storeToRefs(store.sections)
  const confirm = useConfirm()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const activeTabId = ref<string>('daily-route')
  const isDrawerOpen = ref(false)
  const isLayoutDropdownOpen = ref(false)
  const isHeaderDropdownOpen = ref(false)
  const navigationWrapperRef = ref(null)
  const mainNavigationRef = ref<HTMLElement>()
  const isNavigationVisible = ref(true)

  const isAddSectionDialogOpen = ref(false)
  const newSectionTitle = ref('')
  const newSectionIcon = ref('mdi:file-document-outline')
  const iconSearchQuery = ref('')

  const isEditSectionDialogOpen = ref(false)
  const sectionToEdit = ref<{ id: string, title: string, icon: string } | null>(null)
  const iconSearchQueryEdit = ref('')

  const filteredIcons = computed(() => {
    if (!iconSearchQuery.value)
      return iconList
    return iconList.filter(icon => icon.toLowerCase().includes(iconSearchQuery.value.toLowerCase()))
  })

  const filteredIconsEdit = computed(() => {
    if (!iconSearchQueryEdit.value)
      return iconList
    return iconList.filter(icon => icon.toLowerCase().includes(iconSearchQueryEdit.value.toLowerCase()))
  })

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

  const activeTab = computed(() => tabItems.value.find(item => item.id === activeTabId.value))

  const isCurrentTabEditable = computed(() => {
    if (!activeTab.value || activeTab.value.id === 'daily-route')
      return false
    const section = sortedSections.value.find((s: TripSection) => s.id === activeTab.value!.id)
    if (!section)
      return false
    const nonEditableLabels = ['Бронирования', 'Финансы']
    return !nonEditableLabels.includes(section.title)
  })

  const menuItems = computed((): KitDropdownItem[] => {
    const items: KitDropdownItem[] = [
      { value: 'share', label: 'Поделиться', icon: 'mdi:share-variant-outline' },
    ]
    if (isCurrentTabEditable.value) {
      items.push(
        { value: 'edit', label: 'Редактировать', icon: 'mdi:pencil-outline' },
        { value: 'delete', label: 'Удалить', icon: 'mdi:trash-can-outline' },
      )
    }
    return items
  })

  // --- МЕТОДЫ (METHODS) ---
  function selectSection(id: string) {
    activeTabId.value = id
    isDrawerOpen.value = false
    isLayoutDropdownOpen.value = false
    isHeaderDropdownOpen.value = false
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

  function openAddSectionDialog() {
    isAddSectionDialogOpen.value = true
    isHeaderDropdownOpen.value = false
    isLayoutDropdownOpen.value = false
  }

  async function handleAddSection() {
    if (!newSectionTitle.value.trim())
      return

    // @ts-expect-error Сделать позже
    await store.sections.createSection({
      title: newSectionTitle.value,
      icon: newSectionIcon.value,
    })
    isAddSectionDialogOpen.value = false
  }

  function openEditDialog() {
    if (!activeTab.value || !isCurrentTabEditable.value)
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

  async function handleDeleteSection() {
    if (!activeTab.value || !isCurrentTabEditable.value)
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

  function handleMenuAction(item: KitDropdownItem) {
    if (!item.value)
      return
    switch (item.value) {
      case 'share':
        // eslint-disable-next-line no-console
        console.log('Share action triggered for:', activeTab.value?.label)
        break
      case 'edit':
        openEditDialog()
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

    activeTabId.value = tabItems.value[nextIndex].id
  }

  watch(isAddSectionDialogOpen, (isOpen) => {
    if (!isOpen) {
      newSectionTitle.value = ''
      newSectionIcon.value = 'mdi:file-document-outline'
      iconSearchQuery.value = ''
    }
  })

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
    isAddSectionDialogOpen,
    newSectionTitle,
    newSectionIcon,
    iconSearchQuery,
    isEditSectionDialogOpen,
    sectionToEdit,
    iconSearchQueryEdit,

    // Computed
    tabItems,
    activeTab,
    menuItems,
    filteredIcons,
    filteredIconsEdit,

    // Methods
    selectSection,
    handleCurrentSectionClick,
    handleHeaderCurrentSectionClick,
    openAddSectionDialog,
    handleAddSection,
    handleMenuAction,
    navigate,
    openEditDialog,
    handleUpdateSection,
  }
}

export type TripInfoLayout = ReturnType<typeof useTripInfoLayout>
export const TripInfoLayoutKey: InjectionKey<TripInfoLayout> = Symbol('TripInfoLayout')
