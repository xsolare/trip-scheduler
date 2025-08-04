import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import baseConfig from './vite.config.base'

// Конфигурация для Web и PWA
export default defineConfig(mergeConfig(baseConfig, {
  base: '/',
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'service-worker',
      filename: 'sw.ts',
      registerType: 'prompt',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Trip Scheduler',
        short_name: 'TripScheduler',
        description: 'Ваш планировщик путешествий',
        theme_color: '#ffffff',
        lang: 'ru',
        icons: [{
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        }, {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        }, {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        }, {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        }],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [],
        navigateFallback: null,
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        navigateFallbackDenylist: [/^\/api\//],
        sourcemap: true,
      },
      injectManifest: {
        globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
        globIgnores: ['emojis/**', 'manifest**.webmanifest'],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        dontCacheBustURLsMatching: /\.\w{8}\./,
        additionalManifestEntries: [{
          url: '/',
          revision: new Date().toString(),
          // revision: import.meta.env.APP_VERSION || new Date().toString(),
        }],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../src', import.meta.url)),
      '@tauri-apps/plugin-sql': fileURLToPath(new URL('../stubs/tauri-sql-stub.ts', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
  },
}))
