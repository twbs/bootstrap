/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VERCEL?: string
  readonly VERCEL_ENV?: string
  readonly VERCEL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
