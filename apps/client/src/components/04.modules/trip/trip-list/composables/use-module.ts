import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useTripListStore } from '../store/trip-list.store'

const moduleStores = {
  tripList: useTripListStore,
}

export const useModuleStore = createStoreHook(moduleStores)
