import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { autoImportOptions } from './build/utils'

// eslint-disable-next-line node/prefer-global/process
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  base: './',

  plugins: [
    Vue({
    }),
    AutoImport(autoImportOptions),
    Icons({
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader(
          fileURLToPath(new URL('./src/assets/svg', import.meta.url)),
          svg => svg.replace(/\.svg$/, ''),
        ),
      },
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '~/assets/scss/_setup.scss' as *;`,
      },
    },
  },

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

  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
