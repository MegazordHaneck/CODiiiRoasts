/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROAST_URL?: string;
  readonly VITE_SPEAK_URL?: string;
  readonly VITE_ADMIN_PIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
