/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NETLIFY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
