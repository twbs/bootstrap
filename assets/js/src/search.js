// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function () {
  'use strict'

  if (!window.docsearch) {
    return
  }

  var inputElement = document.getElementById('search-input')
  var siteDocsVersion = inputElement.getAttribute('data-docs-version')

  window.docsearch({
    apiKey: '5990ad008512000bba2cf951ccf0332f',
    indexName: 'bootstrap',
    inputSelector: '#search-input',
    algoliaOptions: {
      facetFilters: ['version:' + siteDocsVersion]
    },
    handleSelected: function (input, event, suggestion) {
      var url = suggestion.url
      url = suggestion.isLvl1 ? url.split('#')[0] : url
      // If it's a title we remove the anchor so it does not jump.
      window.location.href = url
    },
    transformData: function (hits) {
      return hits.map(function (hit) {
        // When in production, return the result as is,
        // otherwise remove our url from it.
        var siteurl = inputElement.getAttribute('data-siteurl')
        var urlRE = /^https?:\/\/getbootstrap\.com/

        hit.url = siteurl.match(urlRE) ? hit.url : hit.url.replace(urlRE, '')

        return hit
      })
    },
    debug: false // Set debug to true if you want to inspect the dropdown
  })
}())
