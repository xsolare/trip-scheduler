import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useSyncStore } from '~/shared/store/sync.store'
import { useThemeStore } from '~/shared/store/theme.store'
import { useAuthStore } from '../store/auth.store'

const appStores = {
  sync: useSyncStore,
  theme: useThemeStore,
  auth: useAuthStore,
}

export const useAppStore = createStoreHook(appStores)
