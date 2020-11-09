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

  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault()
      inputElement.focus()
    }
  })

  function getOrigin() {
    var location = window.location
    var origin = location.origin

    if (!origin) {
      var port = location.port ? ':' + location.port : ''

      origin = location.protocol + '//' + location.hostname + port
    }

    return origin
  }

  function isIconHit(hit) {
    return hit.hierarchy.lvl0 === 'Bootstrap Icons'
  }

  function IconName(hit) {
    return hit.url
      .replace(/https:\/\/icons.getbootstrap.com\/icons\//g, '')
      .replace(/\/#content/g, '')
  }

  function IconSVG(hit) {
    return {
      type: 'svg',
      ref: undefined,
      constructor: undefined,
      key: undefined,
      props: {
        width: 20,
        height: 20,
        fill: 'currentColor',
        children: {
          type: 'use',
          ref: undefined,
          constructor: undefined,
          key: undefined,
          props: {
            xlinkHref:
              '/docs/5.0/assets/img/bootstrap-icons.svg#' + IconName(hit),
          },
        },
      },
    }
  }

  function Hits({ hit, children }) {
    if (isIconHit(hit)) {
      return {
        type: 'a',
        ref: undefined,
        constructor: undefined,
        key: undefined,
        props: {
          href: hit.url,
          children: {
            type: 'div',
            ref: undefined,
            constructor: undefined,
            key: undefined,
            props: {
              className: 'DocSearch-Hit-Container',
              children: [
                {
                  type: 'div',
                  ref: undefined,
                  constructor: undefined,
                  key: undefined,
                  props: {
                    className: 'DocSearch-Hit-icon',
                    children: IconSVG(hit),
                  },
                },
                {
                  type: 'div',
                  ref: undefined,
                  constructor: undefined,
                  key: undefined,
                  props: {
                    className: 'DocSearch-Hit-content-wrapper',
                    children: [
                      {
                        type: 'span',
                        ref: undefined,
                        constructor: undefined,
                        key: undefined,
                        props: {
                          className: 'DocSearch-Hit-title',
                          children: hit.hierarchy.lvl1,
                        },
                      },
                      {
                        type: 'span',
                        ref: undefined,
                        constructor: undefined,
                        key: undefined,
                        props: {
                          className: 'DocSearch-Hit-path',
                          children: 'Icon',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      }
    }

    return {
      type: 'a',
      ref: undefined,
      constructor: undefined,
      key: undefined,
      props: {
        href: hit.url,
        children,
      },
    }
  }

  window.docsearch({
    appId: 'BH4D9OD16A',
    apiKey: 'c121570761efc762fb8b433b124415fb',
    indexName: 'bootstrap-icons',
    container: '#search-input',
    hitComponent: Hits,
    // algoliaOptions: {
    //   facetFilters: ['version:' + siteDocsVersion]
    // },
    // transformData: function (hits) {
    //   return hits.map(function (hit) {
    //     var currentUrl = getOrigin()
    //     var liveUrl = 'https://getbootstrap.com/'

    //     hit.url = currentUrl.lastIndexOf(liveUrl, 0) === 0 ?
    //       // On production, return the result as is
    //       hit.url :
    //       // On development or Netlify, replace `hit.url` with a trailing slash,
    //       // so that the result link is relative to the server root
    //       hit.url.replace(liveUrl, '/')

    //     // Prevent jumping to first header
    //     if (hit.anchor === 'content') {
    //       hit.url = hit.url.replace(/#content$/, '')
    //       hit.anchor = null
    //     }

    //     return hit
    //   })
    // },
    // Set debug to `true` if you want to inspect the dropdown
    debug: false,
  })
})()
