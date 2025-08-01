import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from '@rsbuild/core'
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginVue } from '@rsbuild/plugin-vue'
import pluginAutoImport from 'unplugin-auto-import/rspack'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/rspack'
import { autoImportOptions } from './build/utils'

// eslint-disable-next-line node/prefer-global/process
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginSass({
      sassLoaderOptions: {
        additionalData: `
          @use '~/assets/scss/_setup.scss' as *;
        `,
      },
    }),
    pluginCssMinimizer(),
  ],

  server: {
    port: 1420,
    host: host || 'localhost',
  },

  // performance: {
  //   bundleAnalyze: {
  //     generateStatsFile: true,
  //     openAnalyzer: true,
  //     analyzerMode: 'static',
  //   },
  // },

  dev: {
    hmr: !!host,
    client: {
      port: 1420,
      host: host || 'localhost',
    },
  },

  html: {
    template: './index.html',
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
    include: ['**/*.js', '**/*.json', '**/*.jsx', '**/*.mjs', '**/*.ts', '**/*.tsx', '**/*.vue'],
  },

  tools: {
    rspack: {
      plugins: [
        pluginAutoImport(autoImportOptions),
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
    },
    lightningcssLoader: false,
  },

})
