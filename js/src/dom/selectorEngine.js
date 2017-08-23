/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/selectorEngine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
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
if (!Element.prototype.closest) {
  Element.prototype.closest = (element, selector) => {
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
}

const fnClosest = Element.prototype.closest

const SelectorEngine = {
  matches(element, selector) {
    return fnMatches.call(element, selector)
  },

  find(selector) {
    if (typeof selector !== 'string') {
      return null
    }

    let selectorType = 'querySelectorAll'
    if (selector.indexOf('#') === 0) {
      selectorType = 'getElementById'
      selector = selector.substr(1, selector.length)
    }
    return document[selectorType](selector)
  },

  closest(element, selector) {
    return fnClosest.call(element, selector)
  }
}

export default SelectorEngine
