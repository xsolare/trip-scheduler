import { createStoreHook } from '~/shared/lib/create-store-hook'

import { useThemeStore } from '~/shared/store/theme.store'
import { useAuthStore } from '../store/auth.store'

const appStores = {
  theme: useThemeStore,
  auth: useAuthStore,
}

export const useAppStore = createStoreHook(appStores)
