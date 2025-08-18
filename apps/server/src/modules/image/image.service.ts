import type { tripImagePlacementEnum } from 'db/schema'
import type { ImageMetadata } from '~/repositories/image.repository'
import { imageRepository } from '~/repositories/image.repository'

type Placement = (typeof tripImagePlacementEnum.enumValues)[number]

export const imageService = {
  /**
   * Сервисный метод для создания изображения.
   * Принимает все данные и передает их в репозиторий.
   */
  async create(
    tripId: string,
    url: string,
    placement: Placement,
    metadata: ImageMetadata,
  ) {
    return await imageRepository.create(tripId, url, placement, metadata)
  },

  /**
   * Получает все изображения для путешествия.
   */
  async getByTripId(tripId: string, placement?: Placement) {
    return await imageRepository.getByTripId(tripId, placement)
  },
}
