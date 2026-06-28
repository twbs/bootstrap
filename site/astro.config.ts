import { fileURLToPath } from 'node:url'

import { defineConfig } from 'astro/config'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import { unified } from '@astrojs/markdown-remark'
import astroBrokenLinksChecker from 'astro-broken-links-checker'
import bootstrapLight from 'bootstrap-vscode-theme/themes/bootstrap-light.json'
import bootstrapDark from 'bootstrap-vscode-theme/themes/bootstrap-dark.json'
import type { Element, Text } from 'hast'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'

import { bootstrap } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { rehypeBsTable } from './src/libs/rehype'
import { remarkBsConfig, remarkBsDocsref } from './src/libs/remark'
import { stackblitzPlugin } from './src/plugins/stackblitz-plugin'

// Resolve `@bootstrap` to the same on-disk Bootstrap bundle the docs ship, so
// every docs script imports from a single module instance (no duplicated
// component registries). Mirrors the `@bootstrap` alias in `tsconfig.json`.
const bootstrapBundlePath = fileURLToPath(new URL('../dist/js/bootstrap.bundle.js', import.meta.url))

const isDev = process.env.NODE_ENV === 'development'

// Allow the dev/preview server port to be overridden via `PORT` (falling back to
// 9001) so multiple worktrees can run side by side without colliding.
const port = Number.parseInt(process.env.PORT ?? '', 10) || 9001
const headingsRangeRegex = new RegExp(`^h[${getConfig().anchors.min}-${getConfig().anchors.max}]$`)

const site = isDev
  ? // In development mode, use the local dev server.
    `http://localhost:${port}`
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
    processor: unified({
      smartypants: false,
      rehypePlugins: [
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            content: [{ type: 'text', value: ' ' }],
            properties: (element: Element) => ({
              class: 'anchor-link',
              ariaLabel: `Link to this section: ${(element.children[0] as Text).value}`
            }),
            test: (element: Element) => element.tagName.match(headingsRangeRegex)
          }
        ],
        rehypeBsTable
      ],
      remarkPlugins: [remarkBsConfig, remarkBsDocsref]
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: { ...bootstrapLight, name: '', type: 'light' },
        dark: { ...bootstrapDark, name: '', type: 'dark' }
      },
      defaultColor: 'light-dark()',
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
  server: {
    port
  },
  site,
  vite: {
    plugins: [stackblitzPlugin()],
    resolve: {
      alias: {
        '@bootstrap': bootstrapBundlePath
      }
    }
  }
})
