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
        var currentUrl = getOrigin()
        var liveUrl = 'https://getbootstrap.com'

        // When in production, return the result as is,
        // otherwise remove our url from it.
        // eslint-disable-next-line no-negated-condition
        hit.url = currentUrl.indexOf(liveUrl) !== -1 ?
          hit.url :
          hit.url.replace(liveUrl, '')

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
}())
