import Polyfill from './polyfill'
import Util from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): dom/selectorEngine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const closest = Polyfill.closest
const matchesFn = Polyfill.matches
const find = Polyfill.find
const findOne = Polyfill.findOne
const nodeText = 3

const SelectorEngine = {
  matches(element, selector) {
    return matchesFn.call(element, selector)
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
    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== nodeText) {
      if (this.matches(ancestor, selector)) {
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
    while (previous && previous.nodeType === Node.ELEMENT_NODE && previous.nodeType !== nodeText) {
      if (this.matches(previous, selector)) {
        siblings.push(previous)
      }

      previous = previous.previousSibling
    }

    return siblings
  }
}

export default SelectorEngine
