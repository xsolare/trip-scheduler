import antfu from '@antfu/eslint-config'
import storybook from 'eslint-plugin-storybook'

export default antfu({
  vue: true,
  formatters: true,
  ignores: [
    '**/.vitestcache/**',
    '**/e2e-**/**',
    'auto-imports.d.ts',
    'bun.lock',
  ],
  plugins: [storybook],
})
