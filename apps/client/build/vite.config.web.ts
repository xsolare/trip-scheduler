import { defineConfig, mergeConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import baseConfig from './vite.config.base'

// Конфигурация для Web и PWA
export default defineConfig(mergeConfig(baseConfig, {
  base: '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
      },
      manifest: {
        name: 'Trip Scheduler',
        short_name: 'TripScheduler',
        description: 'Ваш планировщик путешествий',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
  },
}))
