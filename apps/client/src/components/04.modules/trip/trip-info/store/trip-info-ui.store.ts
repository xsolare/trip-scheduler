import type { RemovableRef } from '@vueuse/core'
import type { ActiveView, InteractionMode } from '../models/types'
import { useStorage } from '@vueuse/core'

export interface ITripInfoUiState {
  isDaysPanelOpen: boolean
  isDaysPanelPinned: boolean
  activeView: RemovableRef<ActiveView>
  interactionMode: RemovableRef<InteractionMode>
}

/**
 * Стор для управления состоянием UI на странице информации о путешествии.
 */
export const useTripInfoUiStore = defineStore('tripInfoUi', {
  state: (): ITripInfoUiState => ({
    isDaysPanelOpen: false,
    isDaysPanelPinned: false,
    activeView: useStorage<ActiveView>('trip-active-view', 'plan'),
    interactionMode: useStorage<InteractionMode>('tripinfo-interaction-mode', 'view'),
  }),

  getters: {
    /**
     * Проверяет, находится ли пользователь в режиме просмотра.
     * @param state - Текущее состояние стора.
     */
    isViewMode: state => state.interactionMode === 'view',
  },

  actions: {
    openDaysPanel() {
      this.isDaysPanelOpen = true
    },

    closeDaysPanel() {
      this.isDaysPanelOpen = false
    },

    toggleDaysPanelPinned() {
      this.isDaysPanelPinned = !this.isDaysPanelPinned
    },

    setInteractionMode(mode: 'view' | 'edit') {
      this.interactionMode = mode
    },

    setActiveView(view: ActiveView) {
      this.activeView = view
    },

    reset() {
      this.isDaysPanelOpen = false
      this.isDaysPanelPinned = false
      this.activeView = 'plan'
      this.interactionMode = 'view'
    },
  },
})
