import path from 'node:path'
import mdx from '@astrojs/mdx'
import type { AstroIntegration } from 'astro'
import autoImport from 'astro-auto-import'
import { rehypeBsTable } from './rehype'
import { remarkBsParam, remarkBsDocsref } from './remark'

// TODO(HiDeoo) Fix path when moving to `site`
// The docs directory path relative to the root of the project.
const docsDirectory = './site-new'

// A list of components that should be auto imported in all pages for convenience.
// Note: updating this list requires a restart of the dev server.
const autoImportedComponents = [
  'src/components/GuideFooter.mdx',
  'src/components/JsDataAttributes.mdx',
  'src/components/callouts/InfoNpmStarter.mdx',
  'src/components/shortcodes/AddedIn.astro',
  'src/components/shortcodes/BsTable.astro',
  'src/components/shortcodes/Callout.astro',
  'src/components/shortcodes/CalloutDeprecatedDarkVariants.astro',
  'src/components/shortcodes/Code.astro',
  'src/components/shortcodes/DeprecatedIn.astro',
  'src/components/shortcodes/JsDismiss.astro',
  'src/components/shortcodes/Placeholder.astro',
  'src/components/shortcodes/Table.astro',
]

export function bootstrap(): AstroIntegration[] {
  return [
    bootstrap_auto_import(),
    {
      name: 'bootstrap-integration',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            markdown: {
              rehypePlugins: [rehypeBsTable],
              remarkPlugins: [remarkBsParam, remarkBsDocsref],
            },
          })
        },
      },
    },
    mdx(),
  ]
}

function bootstrap_auto_import() {
  return autoImport({
    imports: autoImportedComponents.map((componentPath) => `./${path.posix.join(docsDirectory, componentPath)}`),
  })
}
