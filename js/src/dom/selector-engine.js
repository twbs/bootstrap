/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha1): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { find as findFn, findOne } from './polyfill'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NODE_TEXT = 3

const SelectorEngine = {
  matches(element, selector) {
    return element.matches(selector)
  },

  find(selector, element = document.documentElement) {
    return [].concat(...findFn.call(element, selector))
  },

  findOne(selector, element = document.documentElement) {
    return findOne.call(element, selector)
  },

  children(element, selector) {
    const children = [].concat(...element.children)

    return children.filter(child => child.matches(selector))
  },

  parents(element, selector) {
    const parents = []

    let ancestor = element.parentNode

    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
      if (this.matches(ancestor, selector)) {
        parents.push(ancestor)
      }

      ancestor = ancestor.parentNode
    }

    return parents
  },

  prev(element, selector) {
    let previous = element.previousElementSibling

    while (previous) {
      if (previous.matches(selector)) {
        return [previous]
      }

      previous = previous.previousElementSibling
    }

    return []
  },

  next(element, selector) {
    let next = element.nextElementSibling

    while (next) {
      if (this.matches(next, selector)) {
        return [next]
      }

      next = next.nextElementSibling
    }

    return []
  }
}

export default SelectorEngine
