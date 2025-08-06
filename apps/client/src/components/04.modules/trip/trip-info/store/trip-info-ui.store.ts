/**
 * Стор для управления состоянием UI на странице информации о путешествии.
 */
export const useTripInfoUiStore = defineStore('tripInfo-ui', () => {
  // STATE
  const isDaysPanelOpen = ref<boolean>(false)
  const isDaysPanelPinned = ref<boolean>(false)
  const interactionMode = ref<'view' | 'edit'>('view')

  // GETTERS
  const isViewMode = computed(() => interactionMode.value === 'view')

  // ACTIONS
  function openDaysPanel() {
    isDaysPanelOpen.value = true
  }

  function closeDaysPanel() {
    isDaysPanelOpen.value = false
  }

  function toggleDaysPanelPinned() {
    isDaysPanelPinned.value = !isDaysPanelPinned.value
  }

  function setInteractionMode(mode: 'view' | 'edit') {
    interactionMode.value = mode
  }

  function reset() {
    isDaysPanelOpen.value = false
    isDaysPanelPinned.value = false
    interactionMode.value = 'edit'
  }

  return {
    // State & Getters
    isDaysPanelOpen,
    isDaysPanelPinned,
    interactionMode,
    isViewMode,
    // Actions
    openDaysPanel,
    closeDaysPanel,
    toggleDaysPanelPinned,
    setInteractionMode,
    reset,
  }
})
