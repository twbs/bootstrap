import fs from 'node:fs'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import type { AstroIntegration } from 'astro'
import autoImport from 'astro-auto-import'
import { getConfig } from './config'
import { rehypeBsTable } from './rehype'
import { remarkBsParam, remarkBsDocsref } from './remark'

// TODO(HiDeoo) Fix path when moving to `site`
// The docs directory path relative to the root of the project.
const docsDirectory = './site-new'

// A list of directories in `src/components` that contains components that will be auto imported in all pages for
// convenience.
// Note: adding a new component to one of the existing directories requires a restart of the dev server.
const autoImportedComponentDirectories = ['callouts', 'shortcodes']

export function bootstrap(): AstroIntegration[] {
  return [
    bootstrap_auto_import(),
    {
      name: 'bootstrap-integration',
      hooks: {
        'astro:config:setup': ({ addWatchFile, updateConfig }) => {
          // Reload the config when the integration is modified.
          addWatchFile(path.join(process.cwd(), 'site-new/src/libs/astro.ts'))

          // Add the remark and rehype plugins.
          updateConfig({
            markdown: {
              rehypePlugins: [rehypeBsTable],
              remarkPlugins: [remarkBsParam, remarkBsDocsref],
            },
          })
        },
        'astro:config:done': ({}) => {
          // Copy the `dist` folder from the root of the repo containing the latest version of Bootstrap's assets to the
          // `public/docs/${docs_version}/dist` folder.
          const distDirectory = path.join(process.cwd(), 'dist')
          const docsDistDirectory = path.join(
            process.cwd(),
            docsDirectory,
            'public/docs',
            getConfig().params.docs_version,
            'dist'
          )

          fs.rmSync(docsDistDirectory, { force: true, recursive: true })
          fs.mkdirSync(docsDistDirectory, { recursive: true })
          fs.cpSync(distDirectory, docsDistDirectory, { recursive: true })
        },
      },
    },
    mdx(),
  ]
}

function bootstrap_auto_import() {
  const autoImportedComponents: string[] = []

  for (const autoImportedComponentDirectory of autoImportedComponentDirectories) {
    const components = fs.readdirSync(
      path.join(process.cwd(), docsDirectory, 'src/components', autoImportedComponentDirectory),
      {
        withFileTypes: true,
      }
    )

    for (const component of components) {
      if (component.isFile()) {
        autoImportedComponents.push(
          `./${path.posix.join(docsDirectory, 'src/components', autoImportedComponentDirectory, component.name)}`
        )
      }
    }
  }

  return autoImport({
    imports: autoImportedComponents,
  })
}
