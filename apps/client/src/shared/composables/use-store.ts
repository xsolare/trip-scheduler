import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useSyncStore } from '~/shared/store/sync.store'
import { useThemeStore } from '~/shared/store/theme.store'

const appStores = {
  sync: useSyncStore,
  theme: useThemeStore,
}

export const useAppStore = createStoreHook(appStores)
