export interface ExampleFrontmatter {
  body_class?: string
  direction?: 'rtl' | undefined
  extra_css?: string[]
  extra_js?: { async?: boolean; src: string }[]
  html_class?: string
  include_js?: boolean
  title: string
}

export function getExamplesAssets() {
  const examplesAssets = import.meta.glob('../assets/examples/**/*.!(html)', { as: 'raw' })

  return Object.keys(examplesAssets).map((path) => {
    return sanitizeAssetPath(path)
  })
}

export function getExampleNameFromPagePath(examplePath: string) {
  const matches = examplePath.match(/([^/]+)\/(?:[^/]+)\.astro$/)

  if (!matches || !matches[1]) {
    throw new Error(`Failed to get example name from path: '${examplePath}'.`)
  }

  return matches[1]
}

function sanitizeAssetPath(assetPath: string) {
  const matches = assetPath.match(/([^\/]+\/[^\/]+\.\w+)$/)

  if (!matches || !matches[1]) {
    throw new Error(`Failed to get example asset path from path: '${assetPath}'.`)
  }

  return matches[1]
}
