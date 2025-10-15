import type { IPlacesRepository } from '../../model/types';
import type { Place, PlaceTag } from '~/shared/types/models/place';
import { mockPlaces, mockTags } from './data/places';
import { throttle } from '../../lib/decorators';

export class PlacesRepository implements IPlacesRepository {
  @throttle(500)
  async getPlacesByCity(city: string, filters?: { tags?: string[] }): Promise<Place[]> {
    console.log('[Mock] Fetching places for:', city, 'with filters:', filters);
    let places = mockPlaces.filter(p => p.city === city);

    if (filters?.tags && filters.tags.length > 0) {
      places = places.filter(p =>
        filters.tags!.every(tagId => p.tags.some(pt => pt.id === tagId))
      );
    }
    return Promise.resolve(places);
  }

  @throttle(300)
  async getAvailableTags(_city: string): Promise<PlaceTag[]> {
    console.log('[Mock] Fetching tags');
    return Promise.resolve(mockTags);
  }
}
