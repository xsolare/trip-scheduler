import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tripscheduler.app',
  appName: 'TripScheduler',
  webDir: 'dist',
  server: {
    url: 'http://localhost:1420',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
    },
  },
}

export default config
