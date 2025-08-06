import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaCfg } from './cfg/pwa'
import baseConfig from './vite.config.base'

// Конфигурация для Web и PWA
export default defineConfig(mergeConfig(baseConfig, {
  base: '/',
  plugins: [
    VitePWA(pwaCfg),
  ],
  server: {
    port: 1420,
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
