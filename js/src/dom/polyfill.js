import Util from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): dom/polyfill.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/* istanbul ignore next */
const Polyfill = (() => {
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

  // Event constructor shim
  if (!window.Event || typeof window.Event !== 'function') {
    const origEvent = window.Event
    window.Event = (inType, params) => {
      params = params || {}
      const e = document.createEvent('Event')
      e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable))
      return e
    }
    window.Event.prototype = origEvent.prototype
  }

  // closest polyfill (see: https://mzl.la/2vXggaI)
  let closest
  if (!Element.prototype.closest) {
    const nodeText = 3
    closest = (element, selector) => {
      let ancestor = element
      do {
        if (ancestor.matches(selector)) {
          return ancestor
        }

        ancestor = ancestor.parentElement
      } while (ancestor !== null && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== nodeText)

      return null
    }
  } else {
    closest = (element, selector) => element.closest(selector)
  }

  const supportScopeQuery = (() => {
    const element = document.createElement('div')
    try {
      element.querySelectorAll(':scope *')
    } catch (e) {
      return false
    }

    return true
  })()

  const scopeSelectorRegex = /:scope\b/
  let find = Element.prototype.querySelectorAll
  let findOne = Element.prototype.querySelector

  if (!supportScopeQuery) {
    find = function (selector) {
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

  if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
      value: (target, ...args) => {
        if (target === null || typeof target === 'undefined') {
          throw new TypeError('Cannot convert undefined or null to object')
        }

        const to = Object(target)

        for (let index = 1; index < args.length; index++) {
          const nextSource = args[index]

          if (nextSource !== null || !nextSource) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey]
              }
            }
          }
        }
        return to
      },
      writable: true,
      configurable: true
    })
  }

  return {
    defaultPreventedPreservedOnDispatch,
    focusIn: typeof window.onfocusin === 'undefined',
    closest,
    find,
    findOne
  }
})()

export default Polyfill
