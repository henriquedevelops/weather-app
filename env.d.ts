/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_WEATHER_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
