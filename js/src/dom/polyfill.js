/* istanbul ignore file */

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/polyfill.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getUID } from '../util/index'

let { matches, closest } = Element.prototype
let find = Element.prototype.querySelectorAll
let findOne = Element.prototype.querySelector
let createCustomEvent = (eventName, params) => {
  const cEvent = new CustomEvent(eventName, params)

  return cEvent
}

if (typeof window.CustomEvent !== 'function') {
  createCustomEvent = (eventName, params) => {
    params = params || { bubbles: false, cancelable: false, detail: null }

    const evt = document.createEvent('CustomEvent')

    evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail)
    return evt
  }
}

const workingDefaultPrevented = (() => {
  const e = document.createEvent('CustomEvent')

  e.initEvent('Bootstrap', true, true)
  e.preventDefault()
  return e.defaultPrevented
})()

if (!workingDefaultPrevented) {
  const origPreventDefault = Event.prototype.preventDefault

  Event.prototype.preventDefault = function () {
    if (!this.cancelable) {
      return
    }

    origPreventDefault.call(this)
    Object.defineProperty(this, 'defaultPrevented', {
      get() {
        return true
      },
      configurable: true
    })
  }
}

// MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached
const defaultPreventedPreservedOnDispatch = (() => {
  const e = createCustomEvent('Bootstrap', {
    cancelable: true
  })

  const element = document.createElement('div')
  element.addEventListener('Bootstrap', () => null)

  e.preventDefault()
  element.dispatchEvent(e)
  return e.defaultPrevented
})()

if (!matches) {
  matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
}

if (!closest) {
  closest = function (selector) {
    let element = this

    do {
      if (matches.call(element, selector)) {
        return element
      }

      element = element.parentElement || element.parentNode
    } while (element !== null && element.nodeType === 1)

    return null
  }
}

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
  createCustomEvent,
  find,
  findOne,
  matches,
  closest,
  defaultPreventedPreservedOnDispatch
}
