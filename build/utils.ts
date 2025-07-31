import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'

export const autoImportOptions: AutoImportOptions = {
  imports: [
    'vue-router',
    '@vueuse/core',
    'vue',
    'pinia',
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
  ],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/src-tauri/**',
  ],
  dts: './src/types/dts/auto-imports.d.ts',
}
