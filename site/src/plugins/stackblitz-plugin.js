import { getConfig } from '../libs/config.ts'

/**
 * Vite plugin to replace placeholder values in stackblitz.js with actual configuration values
 */
export function stackblitzPlugin() {
  const config = getConfig()

  return {
    name: 'stackblitz-config-replacer',
    transform(code, id) {
      if (id.includes('stackblitz.js')) {
        return code
          .replace(/__CSS_CDN__/g, config.cdn.css)
          .replace(/__JS_BUNDLE_CDN__/g, config.cdn.js_bundle)
          .replace(/__DOCS_VERSION__/g, config.docs_version)
      }

      return code
    }
  }
}
