import type { UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import { autoImportOptions } from './utils'

export default {
  plugins: [
    Vue({}),
    AutoImport(autoImportOptions),
    Icons({
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader(
          fileURLToPath(new URL('../src/assets/svg', import.meta.url)),
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
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
} satisfies UserConfig
