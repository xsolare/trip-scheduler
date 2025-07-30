export enum AppRouteNames {
  Index = 'Index',
  Plan = 'Plan',
  TripMain = 'TripMain',
  NotFound = 'NotFound',
}

export const AppRoutePaths = {
  Index: '/',
  Plan: (id: string) => `/plans/${id}`,
  TripMain: '/trip',
  NotFound: '/not-found',
}
