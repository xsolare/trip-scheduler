import type { IPlacesRepository } from '../../model/types'
import type { Place, PlaceTag } from '~/shared/types/models/place'

export class PlacesRepository implements IPlacesRepository {
  async getPlacesByCity(_city: string, _filters?: { tags?: string[] }): Promise<Place[]> {
    console.warn('SQL PlacesRepository.getPlacesByCity is not implemented.')
    return Promise.resolve([])
  }

  async getAvailableTags(_city: string): Promise<PlaceTag[]> {
    console.warn('SQL PlacesRepository.getAvailableTags is not implemented.')
    return Promise.resolve([])
  }
}
