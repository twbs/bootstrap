import { fileURLToPath } from 'node:url'

import { defineConfig } from 'astro/config'
import astroBrokenLinksChecker from 'astro-broken-links-checker'
import bootstrapLight from 'bootstrap-vscode-theme/themes/bootstrap-light.json'
import bootstrapDark from 'bootstrap-vscode-theme/themes/bootstrap-dark.json'
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'

import { bootstrap } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { algoliaPlugin } from './src/plugins/algolia-plugin'
import { stackblitzPlugin } from './src/plugins/stackblitz-plugin'

// Resolve `@bootstrap` to the same on-disk Bootstrap bundle the docs ship, so
// every docs script imports from a single module instance (no duplicated
// component registries). Mirrors the `@bootstrap` alias in `tsconfig.json`.
const bootstrapBundlePath = fileURLToPath(new URL('../dist/js/bootstrap.bundle.js', import.meta.url))

const isDev = process.env.NODE_ENV === 'development'

const site = isDev
  ? // In development mode, use the local dev server.
    'http://localhost:9001'
  : process.env.DEPLOY_PRIME_URL !== undefined
    ? // If deploying on Netlify, use the `DEPLOY_PRIME_URL` environment variable.
      process.env.DEPLOY_PRIME_URL
    : // Otherwise, use the `baseURL` value defined in the `config.yml` file.
      getConfig().baseURL

// https://astro.build/config
export default defineConfig({
  build: {
    assets: `docs/${getConfig().docs_version}/assets`
  },
  integrations: [
    bootstrap(),
    astroBrokenLinksChecker({
      checkExternalLinks: false,
      cacheExternalLinks: false,
      throwError: true,
      linkCheckerDir: '.link-checker'
    })
  ],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: { ...bootstrapLight, name: '' },
        dark: { ...bootstrapDark, name: '' }
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        {
          name: 'add-language-attribute',
          pre(node) {
            const lang = this.options.lang
            if (lang) {
              node.properties['dataLanguage'] = lang
            }
          }
        }
      ]
    }
  },
  devToolbar: {
    enabled: false
  },
  site,
  vite: {
    plugins: [algoliaPlugin(), stackblitzPlugin()],
    resolve: {
      alias: {
        '@bootstrap': bootstrapBundlePath
      }
    }
  }
})
