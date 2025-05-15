// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2024-2025 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

import docsearch from '@docsearch/js'

(() => {
  // These values will be replaced by Astro's Vite plugin
  const CONFIG = {
    apiKey: '__API_KEY__',
    indexName: '__INDEX_NAME__',
    appId: '__APP_ID__'
  }

  const searchElement = document.getElementById('docsearch')

  if (!searchElement) {
    return
  }

  const siteDocsVersion = searchElement.getAttribute('data-bd-docs-version')

  docsearch({
    apiKey: CONFIG.apiKey,
    indexName: CONFIG.indexName,
    appId: CONFIG.appId,
    container: searchElement,
    searchParameters: {
      facetFilters: [`version:${siteDocsVersion}`]
    },
    transformItems(items) {
      return items.map(item => {
        const liveUrl = 'https://getbootstrap.com/'

        item.url = window.location.origin.startsWith(liveUrl) ?
          // On production, return the result as is
          item.url :
          // On development or Netlify, replace `item.url` with a trailing slash,
          // so that the result link is relative to the server root
          item.url.replace(liveUrl, '/')

        // Prevent jumping to first header
        if (item.anchor === 'content') {
          item.url = item.url.replace(/#content$/, '')
          item.anchor = null
        }

        return item
      })
    }
  })
})()
