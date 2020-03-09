/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { find as findFn, findOne } from './polyfill'
import { makeArray } from '../util/index'

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
    return findFn.call(element, selector)
  },

  findOne(selector, element = document.documentElement) {
    return findOne.call(element, selector)
  },

  children(element, selector) {
    const children = makeArray(element.children)

    return children.filter(child => this.matches(child, selector))
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

  closest(element, selector) {
    return element.closest(selector)
  },

  prev(element, selector) {
    let previous = element.previousElementSibling

    while (previous) {
      if (this.matches(previous, selector)) {
        return [previous]
      }

      previous = previous.previousElementSibling
    }

    return []
  }
}

export default SelectorEngine
