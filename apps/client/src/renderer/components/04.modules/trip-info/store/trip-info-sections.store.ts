import type { TripSection } from '~/shared/types/models/trip'
import { defineStore } from 'pinia'
import { useToast } from '~/components/01.kit/kit-toast'
import { useRequest } from '~/plugins/request'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { TripSectionType } from '~/shared/types/models/trip'
import { useTripInfoStore } from './trip-info.store'

export enum ETripSectionsKeys {
  CREATE = 'trip-section:create',
  UPDATE = 'trip-section:update',
  DELETE = 'trip-section:delete',
}

export interface ITripInfoSectionsState {
  sections: TripSection[]
}

export const useTripInfoSectionsStore = defineStore('tripInfoSections', {
  state: (): ITripInfoSectionsState => ({
    sections: [],
  }),

  getters: {
    // Получаем отсортированные разделы
    sortedSections: (state): TripSection[] => {
      return [...state.sections].sort((a, b) => a.order - b.order)
    },
  },

  actions: {
    // Этот экшен будет вызываться из основного стора для инициализации
    setSections(sections: TripSection[]) {
      this.sections = sections
    },

    async addSection(type: TripSectionType) {
      const tripStore = useTripInfoStore()
      if (!tripStore.currentTripId) {
        useToast().error('Невозможно создать раздел: не определено путешествие.')
        return
      }

      // Определение контента и иконки по умолчанию для каждого типа раздела
      let defaultContent: any = {}
      let defaultIcon = 'mdi:file-document-outline'
      let defaultTitle = 'Новый раздел'

      switch (type) {
        case TripSectionType.NOTES:
          defaultContent = { markdown: '' }
          defaultIcon = 'mdi:note-text-outline'
          defaultTitle = 'Заметки'
          break
        case TripSectionType.BOOKINGS:
          defaultContent = { items: [] }
          defaultIcon = 'mdi:book-multiple-outline'
          defaultTitle = 'Бронирования'
          break
        case TripSectionType.CHECKLIST:
          defaultContent = { items: [] }
          defaultIcon = 'mdi:format-list-checks'
          defaultTitle = 'Чек-лист'
          break
        case TripSectionType.FINANCES:
          defaultContent = { totalBudget: 0, expenses: [] }
          defaultIcon = 'mdi:cash-multiple'
          defaultTitle = 'Финансы'
          break
      }

      // Оптимистичное добавление
      const tempId = `temp-section-${Date.now()}`
      const newSection: TripSection = {
        id: tempId,
        tripId: tripStore.currentTripId,
        type,
        title: defaultTitle,
        icon: defaultIcon,
        content: defaultContent,
        order: this.sections.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.sections.push(newSection)

      await useRequest({
        key: `${ETripSectionsKeys.CREATE}:${tempId}`,
        fn: () => trpc.tripSection.create.mutate({
          tripId: tripStore.currentTripId!,
          type,
          title: defaultTitle,
          icon: defaultIcon,
          content: defaultContent,
        }),
        onSuccess: (createdSection) => {
          const index = this.sections.findIndex(s => s.id === tempId)
          if (index !== -1 && createdSection) {
            this.sections[index] = createdSection as TripSection
          }
        },
        onError: (error) => {
          this.sections = this.sections.filter(s => s.id !== tempId)
          useToast().error(`Ошибка при создании раздела: ${error}`)
        },
      })
    },

    async updateSection(section: TripSection) {
      const index = this.sections.findIndex(s => s.id === section.id)
      if (index === -1)
        return

      const originalSection = { ...this.sections[index] }
      this.sections[index] = section // Оптимистичное обновление

      await useRequest({
        key: `${ETripSectionsKeys.UPDATE}:${section.id}`,
        fn: () => trpc.tripSection.update.mutate({
          id: section.id,
          title: section.title,
          icon: section.icon,
          content: section.content,
        }),
        onError: (error) => {
          this.sections[index] = originalSection // Откат
          useToast().error(`Ошибка при обновлении раздела: ${error}`)
        },
      })
    },

    async deleteSection(sectionId: string) {
      const index = this.sections.findIndex(s => s.id === sectionId)
      if (index === -1)
        return

      const [removedSection] = this.sections.splice(index, 1) // Оптимистичное удаление

      await useRequest({
        key: `${ETripSectionsKeys.DELETE}:${sectionId}`,
        fn: () => trpc.tripSection.delete.mutate({ id: sectionId }),
        onError: (error) => {
          this.sections.splice(index, 0, removedSection) // Откат
          useToast().error(`Ошибка при удалении раздела: ${error}`)
        },
      })
    },

    // Очистка состояния при выходе со страницы
    reset() {
      this.sections = []
    },
  },
})
