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
      if (!document.documentElement.contains(element)) {
        return null
      }

      do {
        if (fnMatches.call(ancestor, selector)) {
          return ancestor
        }

        ancestor = ancestor.parentElement
      } while (ancestor !== null)

      return null
    }
  } else {
    // eslint-disable-next-line arrow-body-style
    fnClosest = (element, selector) => {
      return element.closest(selector)
    }
  }

  return {
    matches(element, selector) {
      return fnMatches.call(element, selector)
    },

    find(selector, element = document) {
      if (typeof selector !== 'string') {
        return null
      }

      if (selector.indexOf('#') === 0) {
        return SelectorEngine.findOne(selector, element)
      }

      return element.querySelectorAll(selector)
    },

    findOne(selector, element = document) {
      if (typeof selector !== 'string') {
        return null
      }

      let selectorType = 'querySelector'
      if (selector.indexOf('#') === 0) {
        selectorType = 'getElementById'
        selector = selector.substr(1, selector.length)
      }

      return element[selectorType](selector)
    },

    closest(element, selector) {
      return fnClosest(element, selector)
    }
  }
})()

export default SelectorEngine
