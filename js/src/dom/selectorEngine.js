import Polyfill from './polyfill'
import Util from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): dom/selectorEngine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const SelectorEngine = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const closest = Polyfill.closest
  const find = Polyfill.find
  const findOne = Polyfill.findOne

  return {
    matches(element, selector) {
      return element.matches(selector)
    },

    find(selector, element = document.documentElement) {
      if (typeof selector !== 'string') {
        return null
      }

      return find.call(element, selector)
    },

    findOne(selector, element = document.documentElement) {
      if (typeof selector !== 'string') {
        return null
      }

      return findOne.call(element, selector)
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
        if (ancestor.matches(selector)) {
          parents.push(ancestor)
        }

        ancestor = ancestor.parentNode
      }

      return parents
    },

    closest(element, selector) {
      if (typeof selector !== 'string') {
        return null
      }

      return closest(element, selector)
    },

    prev(element, selector) {
      if (typeof selector !== 'string') {
        return null
      }

      const siblings = []

      let previous = element.previousSibling
      while (previous) {
        if (previous.matches(selector)) {
          siblings.push(previous)
        }

        previous = previous.previousSibling
      }

      return siblings
    }
  }
})()

export default SelectorEngine
