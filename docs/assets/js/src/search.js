// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function () {
  'use strict'

  var inputElement = document.getElementById('search-input')

  if (!window.docsearch || !inputElement) {
    return
  }

  function getOrigin() {
    var location = window.location
    var origin = location.origin

    if (!origin) {
      var port = location.port ? ':' + location.port : ''

      origin = location.protocol + '//' + location.hostname + port
    }

    return origin
  }

  window.docsearch({
    apiKey: 'c8948afa20e6437a6e829f7e87b9ac11',
    indexName: 'bootstrap-v3',
    inputSelector: '#search-input',
    transformData: function (hits) {
      return hits.map(function (hit) {
        var siteurl = getOrigin()
        var urlRE = /^https?:\/\/getbootstrap\.com/

        // When in production, return the result as is,
        // otherwise remove our url from it.
        hit.url = siteurl.match(urlRE) ? hit.url : hit.url.replace(urlRE, '')

        // Prevent jumping to first header
        if (hit.anchor === 'content') {
          hit.url = hit.url.replace(/#content$/, '')
          hit.anchor = null
        }

        return hit
      })
    },
    debug: false // Set debug to true if you want to inspect the dropdown
  })
}())
