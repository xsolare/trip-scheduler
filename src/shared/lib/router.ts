import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { AppRouteNames, AppRoutePaths } from '~/shared/types/routes'

const Index = () => import('~/pages/index.vue')
const Plan = () => import('~/pages/plans/[id]/plan-id.vue')
const TripMain = () => import('~/pages/trip.vue')
const NotFound = () => import('~/pages/not-found.vue')

const routes: RouteRecordRaw[] = [
  {
    path: AppRoutePaths.Index,
    name: AppRouteNames.Index,
    component: Index,
    meta: {
      layout: 'default',
    },
  },
  {
    path: AppRoutePaths.Plan(':id'),
    name: AppRouteNames.Plan,
    component: Plan,
    meta: {
      layout: 'default',
    },
  },
  {
    path: AppRoutePaths.TripMain,
    name: AppRouteNames.TripMain,
    component: TripMain,
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
