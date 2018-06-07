import EventHandler from './eventHandler'

const Polyfill = (() => {
  // defaultPrevented is broken in IE.
  // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
  const workingDefaultPrevented = (() => {
    const e = document.createEvent('CustomEvent')
    e.initEvent('Bootstrap', true, true)
    e.preventDefault()
    return e.defaultPrevented
  })()

  let defaultPreventedPreservedOnDispatch = true

  // CustomEvent polyfill for IE (see: https://mzl.la/2v76Zvn)
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = (event, params) => {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: null
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
  } else {
    // MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached
    defaultPreventedPreservedOnDispatch = (() => {
      const e = new CustomEvent('Bootstrap', {
        cancelable: true
      })

      const element = document.createElement('div')
      element.addEventListener('Bootstrap', () => null)

      e.preventDefault()
      element.dispatchEvent(e)
      return e.defaultPrevented
    })()
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

  // focusin and focusout polyfill
  if (typeof window.onfocusin === 'undefined') {
    (() => {
      function listenerFocus(event) {
        EventHandler.trigger(event.target, 'focusin')
      }
      function listenerBlur(event) {
        EventHandler.trigger(event.target, 'focusout')
      }
      EventHandler.on(document, 'focus', 'input', listenerFocus)
      EventHandler.on(document, 'blur', 'input', listenerBlur)
    })()
  }

  return {
    get defaultPreventedPreservedOnDispatch() {
      return defaultPreventedPreservedOnDispatch
    }
  }
})()

export default Polyfill
