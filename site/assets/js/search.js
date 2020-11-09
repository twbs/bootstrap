// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function () {
  'use strict'

  if (!window.docsearch) {
    return
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
  })
})()
