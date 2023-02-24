import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  site: 'https://getbootstrap.com/',
})
