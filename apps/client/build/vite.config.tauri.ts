import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config.base'

// eslint-disable-next-line node/prefer-global/process
const host = process.env.TAURI_DEV_HOST

// Эта конфигурация Tauri
export default defineConfig(mergeConfig(baseConfig, {
  base: './',
  server: {
    port: 1420,
    host: host || 'localhost',
    hmr: host
      ? {
        protocol: 'ws',
        host,
        port: 1420,
      }
      : true,
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      external: ['virtual:pwa-register'],
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_DISABLE_PWA': true,
  },
}))
