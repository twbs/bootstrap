import { getConfig } from '../libs/config.ts'

/**
 * Vite plugin to replace placeholder values in search.js with actual configuration values
 */
export function algoliaPlugin() {
  const config = getConfig()

  return {
    name: 'algolia-config-replacer',
    transform(code, id) {
      if (id.includes('search.js')) {
        return code
          .replace(/__API_KEY__/g, config.algolia.api_key)
          .replace(/__INDEX_NAME__/g, config.algolia.index_name)
          .replace(/__APP_ID__/g, config.algolia.app_id)
      }

      return code
    }
  }
}
