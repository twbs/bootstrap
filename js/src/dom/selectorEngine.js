/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/selectorEngine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const SelectorEngine = {
  matches: Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector,

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
    let ancestor = element
    if (!document.documentElement.contains(element)) {
      return null
    }

    do {
      if (SelectorEngine.matches.call(ancestor, selector)) {
        return ancestor
      }

      ancestor = ancestor.parentElement
    } while (ancestor !== null)

    return null
  }
}

export default SelectorEngine
