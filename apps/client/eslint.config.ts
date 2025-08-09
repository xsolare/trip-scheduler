import antfu from '@antfu/eslint-config'
import storybook from 'eslint-plugin-storybook'

export default antfu({
  vue: true,
  formatters: true,
  ignores: [
    '**/.vitestcache/**',
    '**/e2e-**/**',
    '**/src-tauri/**',
    'auto-imports.d.ts',
  ],
  plugins: [storybook],
})
