import { defineConfig } from 'astro/config'

import { bootstrap } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { algoliaPlugin } from './src/plugins/algolia-plugin'
import { stackblitzPlugin } from './src/plugins/stackblitz-plugin'

const isDev = process.env.NODE_ENV === 'development'

const site = isDev
  ? // In development mode, use the local dev server.
    'http://localhost:4321'
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
  integrations: [bootstrap()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism'
  },
  site,
  vite: {
    plugins: [algoliaPlugin(), stackblitzPlugin()]
  }
})
