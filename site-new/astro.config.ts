import { defineConfig } from 'astro/config'

import { bootstrap } from './src/libs/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [bootstrap()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
  },
  site: 'https://getbootstrap.com/',
})
