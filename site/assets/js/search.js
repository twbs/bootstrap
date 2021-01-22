// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function () {
  'use strict'

  var inputElement = document.getElementById('search-input')

  if (!window.docsearch || !inputElement) {
    return
  }

  var siteDocsVersion = inputElement.getAttribute('data-bd-docs-version')

  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault()
      inputElement.focus()
    }
  })

  window.docsearch({
    apiKey: '5990ad008512000bba2cf951ccf0332f',
    indexName: 'bootstrap',
    inputSelector: '#search-input',
    algoliaOptions: {
      facetFilters: ['version:' + siteDocsVersion]
    },
    transformData: function (hits) {
      return hits.map(function (hit) {
        var liveUrl = 'https://getbootstrap.com/'

        hit.url = window.location.origin.startsWith(liveUrl) ?
          // On production, return the result as is
          hit.url :
          // On development or Netlify, replace `hit.url` with a trailing slash,
          // so that the result link is relative to the server root
          hit.url.replace(liveUrl, '/')

        // Prevent jumping to first header
        if (hit.anchor === 'content') {
          hit.url = hit.url.replace(/#content$/, '')
          hit.anchor = null
        }

        return hit
      })
    },
    // Set debug to `true` if you want to inspect the dropdown
    debug: false
  })
})()
