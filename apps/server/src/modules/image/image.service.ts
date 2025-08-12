import type { tripImagePlacementEnum } from '~/../db/schema'
import { imageRepository } from '~/repositories/image.repository'

type Placement = (typeof tripImagePlacementEnum.enumValues)[number]

export const imageService = {
  async create(tripId: string, url: string, placement: Placement) {
    return await imageRepository.create(tripId, url, placement)
  },

  async getByTripId(tripId: string) {
    return await imageRepository.getByTripId(tripId)
  },
}
