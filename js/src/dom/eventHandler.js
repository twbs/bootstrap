/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/eventHandler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

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
    element.dispatchEvent(eventToDispatch)

    return eventToDispatch
  }
}

export default EventHandler
