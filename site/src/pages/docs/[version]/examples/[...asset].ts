import fs from 'node:fs'
import path from 'node:path'
import type { APIRoute } from 'astro'
import mime from 'mime'
import { getConfig } from '@libs/config'
import { getExamplesAssets } from '@libs/examples'
import { getDocsFsPath } from '@libs/path'

export function getStaticPaths() {
  const examplesAssets = getExamplesAssets()

  return examplesAssets.map((examplesAsset) => {
    return {
      params: { asset: examplesAsset, version: getConfig().docs_version }
    }
  })
}

export const GET: APIRoute = ({ params }) => {
  const asset = params.asset

  if (!asset) {
    throw new Error('Missing asset parameter while generating an example asset.')
  }

  const assetPath = path.join(getDocsFsPath(), 'src/assets/examples', asset)
  const buffer = fs.readFileSync(assetPath)
  const mimetype = mime.getType(assetPath)
  const headers: ResponseInit['headers'] = typeof mimetype === 'string' ? { 'Content-Type': mimetype } : {}

  return new Response(buffer, { headers })
}
