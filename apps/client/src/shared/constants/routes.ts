export enum AppRouteNames {
  Root = 'root',

  NotFound = 'not-found',

  TripInfo = 'trip-info',
  TripList = 'trip-list',
}

export const AppRoutePaths = {
  Root: '/',

  NotFound: '/:catchAll(.*)?',

  Trip: {
    List: `/trips`,
    Info: (id: string) => `/trip/${id}`,
  },
}
