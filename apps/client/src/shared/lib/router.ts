import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { AppRouteNames, AppRoutePaths } from '~/shared/constants/routes'

const TripInfo = () => import('~/pages/trip/[id]/index.vue')
const TripList = () => import('~/pages/trip/list.vue')

const NotFound = () => import('~/pages/not-found.vue')
const Root = () => import('~/pages/root.vue')

const SignIn = () => import('~/pages/auth/sign-in.vue')
const SignUp = () => import('~/pages/auth/sign-up.vue')
const AuthCallback = () => import('~/pages/auth/callback.vue')
const ForgotPassword = () => import('~/pages/auth/forgot-password.vue')

const routes: RouteRecordRaw[] = [
  {
    path: AppRoutePaths.Root,
    name: AppRouteNames.Root,
    component: Root,
    meta: {
      transition: 'smooth-appear',
    },
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
    path: AppRoutePaths.Auth.Callback,
    name: AppRouteNames.AuthCallback,
    component: AuthCallback,
    meta: { layout: 'empty' },
  },
  {
    path: AppRoutePaths.Auth.ForgotPassword,
    name: AppRouteNames.ForgotPassword,
    component: ForgotPassword,
    meta: { layout: 'empty' },
  },
  {
    path: AppRoutePaths.Trip.List,
    name: AppRouteNames.TripList,
    component: TripList,
    meta: {
      layout: 'default',
    },
  },
  {
    path: AppRoutePaths.Trip.Info(':id'),
    name: AppRouteNames.TripInfo,
    component: TripInfo,
    meta: {
      layout: 'default',
    },
  },
  {
    path: AppRoutePaths.NotFound,
    name: AppRouteNames.NotFound,
    component: NotFound,
    meta: {
      layout: 'default',
      transition: 'smooth-appear',
    },
  },
]

const router: Router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
