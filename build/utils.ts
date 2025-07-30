import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'

// Plugins options

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
  ],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/src-tauri/**', 
  ],
  dts: './src/types/dts/auto-imports.d.ts',
}
