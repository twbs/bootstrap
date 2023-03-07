import fs from 'node:fs'
import path from 'node:path'
import type { APIRoute } from 'astro'
import { getConfig } from '../../../../libs/config'
import { getExamplesAssets } from '../../../../libs/examples'
import { getDocsFsPath } from '../../../../libs/path'

export function getStaticPaths() {
  const examplesAssets = getExamplesAssets()

  return examplesAssets.map((examplesAsset) => {
    return {
      params: { asset: examplesAsset, version: getConfig().docs_version },
    }
  })
}

// @ts-expect-error APIRoute response is not properly typed, it supports a buffer as body but body is typed as string.
// https://docs.astro.build/en/core-concepts/endpoints/#static-file-endpoints
export const get: APIRoute = ({ params }) => {
  const asset = params.asset

  if (!asset) {
    throw new Error('Missing asset parameter while generating an example asset.')
  }

  const assetPath = path.join(getDocsFsPath(), 'src/assets/examples', asset)
  const buffer = fs.readFileSync(assetPath)

  return {
    body: buffer,
    encoding: 'binary',
  }
}
