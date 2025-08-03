/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_MOCK_MODE: string
  readonly VITE_APP_TRPC_MODE: string
}
