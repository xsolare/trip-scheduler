import { createModuleStoreHook } from '~/shared/lib/create-module-store-hook'

import { useTripInfoGalleryStore } from '../store/trip-info-gallery.store'
import { useTripInfoUiStore } from '../store/trip-info-ui.store'
import { useTripInfoStore } from '../store/trip-info.store'

const moduleStores = {
  data: useTripInfoStore,
  ui: useTripInfoUiStore,
  gallery: useTripInfoGalleryStore,
}

export const useModuleStore = createModuleStoreHook(moduleStores)
