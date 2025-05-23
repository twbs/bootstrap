import type { AstroInstance } from 'astro'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { getDocsFsPath } from './path'

export const exampleFrontmatterSchema = z.object({
  body_class: z.string().optional(),
  direction: z.literal('rtl').optional(),
  extra_css: z.string().array().optional(),
  extra_js: z
    .object({
      async: z.boolean().optional(),
      integrity: z.string().optional(),
      src: z.string()
    })
    .array()
    .optional(),
  html_class: z.string().optional(),
  include_js: z.boolean().optional(),
  title: z.string()
})

export type ExampleFrontmatter = z.infer<typeof exampleFrontmatterSchema>

export function getExamplesAssets() {
  const source = path.join(getDocsFsPath(), 'src/assets/examples')

  return getExamplesAssetsRecursively(source)
}

export function getAliasedExamplesPages(pages: AstroInstance[]) {
  return pages.filter(isAliasedAstroInstance)
}

export function getExampleNameFromPagePath(examplePath: string) {
  const matches = examplePath.match(/([^/]+)\/(?:[^/]+)\.astro$/)

  if (!matches || !matches[1]) {
    throw new Error(`Failed to get example name from path: '${examplePath}'.`)
  }

  return matches[1]
}

function getExamplesAssetsRecursively(source: string, assets: string[] = []) {
  const entries = fs.readdirSync(source, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isFile() && !entry.name.endsWith('.astro')) {
      assets.push(sanitizeAssetPath(path.join(source, entry.name)))
    } else if (entry.isDirectory()) {
      getExamplesAssetsRecursively(path.join(source, entry.name), assets)
    }
  }

  return assets
}

function sanitizeAssetPath(assetPath: string) {
  const matches = assetPath.match(/([^\/\\]+[\/\\][^\/\\]+\.\w+)$/)

  if (!matches || !matches[1]) {
    throw new Error(`Failed to get example asset path from path: '${assetPath}'.`)
  }

  return matches[1].replaceAll('\\', '/')
}

function isAliasedAstroInstance(page: AstroInstance): page is AliasedAstroInstance {
  return (page as AliasedAstroInstance).aliases !== undefined
}

type AliasedAstroInstance = AstroInstance & { aliases: string | string[] }
