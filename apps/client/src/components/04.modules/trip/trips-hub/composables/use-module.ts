import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useTripHubStore } from '../store/trips-hub.store'

const moduleStores = {
  hub: useTripHubStore,
}

export const useModuleStore = createStoreHook(moduleStores)
