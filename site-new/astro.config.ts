import { defineConfig } from 'astro/config'

import { bootstrap } from './src/libs/astro'
import { getConfig } from './src/libs/config'

// https://astro.build/config
export default defineConfig({
  integrations: [bootstrap()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
  },
  site: getConfig().baseURL,
})
