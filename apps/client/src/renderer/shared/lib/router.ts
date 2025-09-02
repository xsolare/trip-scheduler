import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { AppRouteNames, AppRoutePaths } from '~/shared/constants/routes'
import { useAuthStore } from '~/shared/store/auth.store'

// --- Компоненты страниц ---
const Root = () => import('~/pages/root.vue')
const NotFound = () => import('~/pages/not-found.vue')

// --- Аутентификация ---
const SignIn = () => import('~/pages/auth/sign-in.vue')
const SignUp = () => import('~/pages/auth/sign-up.vue')
const AuthCallback = () => import('~/pages/auth/callback.vue')
const ForgotPassword = () => import('~/pages/auth/forgot-password.vue')

// --- Путешествия ---
const TripList = () => import('~/pages/trip/list.vue')
const TripInfo = () => import('~/pages/trip/[id]/index.vue')

const routes: RouteRecordRaw[] = [
  {
    path: AppRoutePaths.Root,
    name: AppRouteNames.Root,
    component: Root,
  },
  {
    path: AppRoutePaths.Auth.SignIn,
    name: AppRouteNames.SignIn,
    component: SignIn,
    meta: { layout: 'empty' },
  },
  {
    path: AppRoutePaths.Auth.SignUp,
    name: AppRouteNames.SignUp,
    component: SignUp,
    meta: { layout: 'empty' },
  },
  {
    path: AppRoutePaths.Auth.ForgotPassword,
    name: AppRouteNames.ForgotPassword,
    component: ForgotPassword,
    meta: { layout: 'empty' },
  },
  {
    path: AppRoutePaths.Auth.Callback,
    name: AppRouteNames.AuthCallback,
    component: AuthCallback,
    meta: { layout: 'empty' },
  },

  // --- Основные маршруты приложения (требуют авторизации) ---
  {
    path: AppRoutePaths.Trip.List,
    name: AppRouteNames.TripList,
    component: TripList,
    meta: { layout: 'default' },
  },
  {
    path: AppRoutePaths.Trip.Info(':id'),
    name: AppRouteNames.TripInfo,
    component: TripInfo,
    meta: { layout: 'trip-info' },
  },

  // --- Системные маршруты ---
  {
    path: AppRoutePaths.NotFound,
    name: AppRouteNames.NotFound,
    component: NotFound,
    meta: { layout: 'default' },
  },
]

const router: Router = createRouter({
  history: createWebHistory('/'),
  routes,
})

// --- Глобальный навигационный гард ---
router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await new Promise<void>((resolve) => {
      const unsubscribe = authStore.$subscribe((_, state) => {
        if (state.isInitialized) {
          unsubscribe()
          resolve()
        }
      })
    })
  }

  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: AppRouteNames.SignIn })
  }

  next()
})

export default router
