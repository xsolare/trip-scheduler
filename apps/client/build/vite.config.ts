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
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))
