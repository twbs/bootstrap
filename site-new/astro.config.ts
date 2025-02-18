import { defineConfig } from 'astro/config'

import { bootstrap } from './src/libs/astro'
import { getConfig } from './src/libs/config'

const isDev = process.env.NODE_ENV === 'development'

const site = isDev
  ? // In development mode, use the local dev server.
    'http://localhost:3000'
  : process.env.DEPLOY_PRIME_URL !== undefined
  ? // If deploying on Netlify, use the `DEPLOY_PRIME_URL` environment variable.
    process.env.DEPLOY_PRIME_URL
  : // Otherwise, use the `baseURL` value defined in the `config.yml` file.
    getConfig().baseURL

// https://astro.build/config
export default defineConfig({
  integrations: [bootstrap()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
  },
  site,
})
