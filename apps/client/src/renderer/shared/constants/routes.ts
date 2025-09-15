export enum AppRouteNames {
  Root = 'root',
  About = 'about',

  NotFound = 'not-found',

  TripInfo = 'trip-info',
  TripList = 'trip-list',

  SignIn = 'sign-in',
  SignUp = 'sign-up',
  ForgotPassword = 'forgot-password',
  AuthCallback = 'auth-callback',

  AccountQuota = 'account-quota',
  AccountStorage = 'account-storage',
  AccountProfile = 'account-profile',
  AccountSettings = 'account-settings',

  CommunitiesList = 'communities-list',
  CommunityInfo = 'community-info',
}

export const AppRoutePaths = {
  Root: '/',
  About: '/about',

  NotFound: '/:catchAll(.*)?',

  Trip: {
    List: `/trips`,
    Info: (id: string) => `/trip/${id}`,
  },

  Auth: {
    SignIn: '/auth/sign-in',
    SignUp: '/auth/sign-up',
    ForgotPassword: '/auth/forgot-password',
    Callback: '/auth/callback',
  },

  Account: {
    Quota: '/account/quota',
    Storage: '/account/storage',
    Profile: '/account/profile',
    Settings: '/account/settings',
  },

  Communities: {
    List: '/communities',
    Info: (id: string) => `/communities/${id}`,
  },
}
