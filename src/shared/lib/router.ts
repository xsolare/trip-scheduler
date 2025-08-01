import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { AppRouteNames, AppRoutePaths } from '~/shared/types/routes'

const TripInfo = () => import('~/pages/trip/[id]/index.vue')
const TripList = () => import('~/pages/trip/list.vue')

const NotFound = () => import('~/pages/not-found.vue')
const Root = () => import('~/pages/root.vue')

const routes: RouteRecordRaw[] = [
  {
    path: AppRoutePaths.Root,
    name: AppRouteNames.Root,
    component: Root,
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
    },
  },
]

const router: Router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
