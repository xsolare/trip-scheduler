import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useTripInfoGalleryStore } from '../store/trip-info-gallery.store'
import { useTripInfoUiStore } from '../store/trip-info-ui.store'
import { useTripInfoStore } from '../store/trip-info.store'

const moduleStores = {
  data: useTripInfoStore,
  ui: useTripInfoUiStore,
  gallery: useTripInfoGalleryStore,
}

export const useModuleStore = createStoreHook(moduleStores)
