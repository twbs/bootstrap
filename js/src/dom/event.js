/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/event.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Event = {
  on(element, event, handler) {
    if (typeof event !== 'string') {
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
    Event.on(element, event, complete)
  },

  trigger(element, event) {
    if (typeof event !== 'string') {
      return
    }

    const eventToDispatch = new CustomEvent(event, {
      bubbles: true,
      cancelable: true
    })
    element.dispatchEvent(eventToDispatch)
  }
}

export default Event
