/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODO_DATOS?: 'local' | 'http';
  readonly VITE_API_URL?: string;
  readonly VITE_LATENCIA_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
