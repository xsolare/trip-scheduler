import type { ActiveView } from '../models/types'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

/**
 * Стор для управления состоянием UI на странице информации о путешествии.
 */
export const useTripInfoUiStore = defineStore('tripInfoUi', {
  state: () => ({
    isDaysPanelOpen: false,
    isDaysPanelPinned: false,
    activeView: useStorage<ActiveView>('trip-active-view', 'plan'),
    interactionMode: useStorage<'view' | 'edit'>(
      'tripinfo-interaction-mode',
      'view',
    ),
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
