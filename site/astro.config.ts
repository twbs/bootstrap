import { defineConfig } from 'astro/config'
import bootstrapLight from 'bootstrap-vscode-theme/themes/bootstrap-light.json'
import bootstrapDark from 'bootstrap-vscode-theme/themes/bootstrap-dark.json'
import { transformerNotationDiff } from '@shikijs/transformers'

import { bootstrap } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { algoliaPlugin } from './src/plugins/algolia-plugin'
import { stackblitzPlugin } from './src/plugins/stackblitz-plugin'

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
  integrations: [bootstrap()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: bootstrapLight,
        dark: bootstrapDark
      },
      transformers: [
        transformerNotationDiff(),
        {
          name: 'add-language-attribute',
          pre(node) {
            // Add data-language attribute to pre tag so Code component can access it
            const lang = this.options.lang
            if (lang) {
              node.properties['dataLanguage'] = lang
            }
          }
        }
      ]
    }
  },
  site,
  vite: {
    plugins: [algoliaPlugin(), stackblitzPlugin()]
  }
})
