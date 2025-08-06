/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MOCK_MODE: string
  readonly VITE_APP_TRPC_MODE: string
  readonly VITE_APP_TRPC_URL: string
  readonly VITE_APP_REQUEST_THROTTLE: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
