import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'
import IconsResolver from 'unplugin-icons/resolver'

export const autoImportOptionsCfg: AutoImportOptions = {
  imports: [
    'vue',
    'vue-router',
    'pinia',
    '@vueuse/core',
  ],
  dirs: [
    './components/01.kit/',
    './components/02.domain/',
    './components/03.shared/',
    './components/04.modules/',
    './components/05.layouts/',
    //
    './src/shared/lib/',
    './src/shared/types/',
    './src/shared/composables/',
    './src/shared/constants/',
  ],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/src-tauri/**',
  ],
  resolvers: [
    IconsResolver({
      prefix: 'Icon',
      customCollections: ['custom'],
      enabledCollections: ['mdi'],
    }),
  ],
  dts: './src/shared/types/dts/auto-imports.d.ts',
  vueTemplate: true,
  eslintrc: {
    enabled: true,
    filepath: './.eslintrc-auto-import.json',
  },
}
