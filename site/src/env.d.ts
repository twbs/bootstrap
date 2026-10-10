/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'astro-broken-links-checker' {
  import type { AstroIntegration } from 'astro'

  interface Options {
    cacheExternalLinks?: boolean
    checkExternalLinks?: boolean
    linkCheckerDir?: string
    throwError?: boolean
  }

  export default function astroBrokenLinksChecker(options?: Options): AstroIntegration
}

interface ImportMetaEnv {
  readonly VERCEL?: string
  readonly VERCEL_ENV?: string
  readonly VERCEL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
