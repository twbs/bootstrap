/* istanbul ignore file */

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/polyfill.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getUID } from '../util/index'

let find = Element.prototype.querySelectorAll
let findOne = Element.prototype.querySelector

// MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached
const defaultPreventedPreservedOnDispatch = (() => {
  const e = new CustomEvent('Bootstrap', {
    cancelable: true
  })

  const element = document.createElement('div')
  element.addEventListener('Bootstrap', () => null)

  e.preventDefault()
  element.dispatchEvent(e)
  return e.defaultPrevented
})()

const scopeSelectorRegex = /:scope\b/
const supportScopeQuery = (() => {
  const element = document.createElement('div')

  try {
    element.querySelectorAll(':scope *')
  } catch (_) {
    return false
  }

  return true
})()

if (!supportScopeQuery) {
  find = function (selector) {
    if (!scopeSelectorRegex.test(selector)) {
      return this.querySelectorAll(selector)
    }

    const hasId = Boolean(this.id)

    if (!hasId) {
      this.id = getUID('scope')
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

  findOne = function (selector) {
    if (!scopeSelectorRegex.test(selector)) {
      return this.querySelector(selector)
    }

    const matches = find.call(this, selector)

    if (typeof matches[0] !== 'undefined') {
      return matches[0]
    }

    return null
  }
}

export {
  find,
  findOne,
  defaultPreventedPreservedOnDispatch
}
