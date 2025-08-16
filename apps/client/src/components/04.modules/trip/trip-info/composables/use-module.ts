import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useTripInfoMemoriesStore } from '../store/trip-info-memories.store'
import { useTripInfoGalleryStore } from '../store/trip-info-route-gallery.store'
import { useTripInfoUiStore } from '../store/trip-info-ui.store'
import { useTripInfoStore } from '../store/trip-info.store'

const moduleStores = {
  data: useTripInfoStore,
  ui: useTripInfoUiStore,
  routeGallery: useTripInfoGalleryStore,
  memories: useTripInfoMemoriesStore,
}

export const useModuleStore = createStoreHook(moduleStores)
