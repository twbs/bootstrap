/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/eventHandler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// defaultPrevented is broken in IE.
// https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
const workingDefaultPrevented = (() => {
  const e = document.createEvent('CustomEvent')
  e.initEvent('Bootstrap', true, true)
  e.preventDefault()
  return e.defaultPrevented
})()

// CustomEvent polyfill for IE (see: https://mzl.la/2v76Zvn)
if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = (event, params) => {
    params = params || {
      bubbles: false,
      cancelable: false
    }
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    if (!workingDefaultPrevented) {
      const origPreventDefault = Event.prototype.preventDefault
      evt.preventDefault = () => {
        if (!evt.cancelable) {
          return
        }

        origPreventDefault.call(evt)
        Object.defineProperty(evt, 'defaultPrevented', {
          get() {
            return true
          },
          configurable: true
        })
      }
    }
    return evt
  }

  window.CustomEvent.prototype = window.Event.prototype
}

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

const EventHandler = {
  on(element, event, handler) {
    if (typeof event !== 'string' || typeof element === 'undefined') {
      return
    }
    element.addEventListener(event, handler, false)
  },

  one(element, event, handler) {
    const complete = () => {
      /* eslint func-style: off */
      handler()
      element.removeEventListener(event, complete, false)
    }
    EventHandler.on(element, event, complete)
  },

  trigger(element, event) {
    if (typeof event !== 'string' || typeof element === 'undefined') {
      return null
    }

    const eventToDispatch = new CustomEvent(event, {
      bubbles: true,
      cancelable: true
    })

    // Add a function 'isDefaultPrevented'
    eventToDispatch.isDefaultPrevented = () => eventToDispatch.defaultPrevented
    element.dispatchEvent(eventToDispatch)

    return eventToDispatch
  }
}

export default EventHandler
