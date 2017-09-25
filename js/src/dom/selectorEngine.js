import Util from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/selectorEngine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const SelectorEngine = (() => {
  /**
   * ------------------------------------------------------------------------
   * Polyfills
   * ------------------------------------------------------------------------
   */

  // matches polyfill (see: https://mzl.la/2ikXneG)
  let fnMatches = null
  if (!Element.prototype.matches) {
    fnMatches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector
  } else {
    fnMatches = Element.prototype.matches
  }

  // closest polyfill (see: https://mzl.la/2vXggaI)
  let fnClosest = null
  if (!Element.prototype.closest) {
    fnClosest = (element, selector) => {
      let ancestor = element
      do {
        if (fnMatches.call(ancestor, selector)) {
          return ancestor
        }

        ancestor = ancestor.parentElement
      } while (ancestor !== null && ancestor.nodeType === Node.ELEMENT_NODE)

      return null
    }
  } else {
    // eslint-disable-next-line arrow-body-style
    fnClosest = (element, selector) => {
      return element.closest(selector)
    }
  }

  const scopeSelectorRegex = /:scope\b/
  const supportScopeQuery = (() => {
    const element = document.createElement('div')
    try {
      element.querySelectorAll(':scope *')
    } catch (e) {
      return false
    }

    return true
  })()

  let findFn = null
  let findOneFn = null
  if (supportScopeQuery) {
    findFn = Element.prototype.querySelectorAll
    findOneFn = Element.prototype.querySelector
  } else {
    findFn = function (selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelectorAll(selector)
      }

      const hasId = Boolean(this.id)
      if (!hasId) {
        this.id = Util.getUID('scope')
      }

      let nodeList = null
      try {
        selector = selector.replace(scopeSelectorRegex, `#${this.id}`)
        nodeList = this.querySelectorAll(selector)
      } finally {
        if (!hasId) {
          this.removeAttribute('id')
        }
      }

      return nodeList
    }

    findOneFn = function (selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelector(selector)
      }

      const matches = findFn.call(this, selector)
      if (typeof matches[0] !== 'undefined') {
        return matches[0]
      }

      return null
    }
  }

  return {
    matches(element, selector) {
      return fnMatches.call(element, selector)
    },

    find(selector, element = document.documentElement) {
      if (typeof selector !== 'string') {
        return null
      }

      return findFn.call(element, selector)
    },

    findOne(selector, element = document.documentElement) {
      if (typeof selector !== 'string') {
        return null
      }

      return findOneFn.call(element, selector)
    },

    children(element, selector) {
      if (typeof selector !== 'string') {
        return null
      }

      const children = Util.makeArray(element.children)
      return children.filter((child) => this.matches(child, selector))
    },

    parents(element, selector) {
      if (typeof selector !== 'string') {
        return null
      }

      const parents = []

      let ancestor = element.parentNode
      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE) {
        if (fnMatches.call(ancestor, selector)) {
          parents.push(ancestor)
        }

        ancestor = ancestor.parentNode
      }

      return parents
    },

    closest(element, selector) {
      return fnClosest(element, selector)
    },

    prev(element, selector) {
      if (typeof selector !== 'string') {
        return null
      }

      const siblings = []

      let previous = element.previousSibling
      while (previous) {
        if (fnMatches.call(previous, selector)) {
          siblings.push(previous)
        }

        previous = previous.previousSibling
      }

      return siblings
    }
  }
})()

export default SelectorEngine
