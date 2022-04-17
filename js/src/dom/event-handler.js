/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery } from '../util/index'

/**
 * Constants
 */

const stripNameRegex = /\..*/
const stripUidRegex = /::\d+$/
const eventRegistry = {} // Events storage
let uidEvent = 1
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
}

const nativeEvents = new Set([
  'click',
  'dblclick',
  'mouseup',
  'mousedown',
  'contextmenu',
  'mousewheel',
  'DOMMouseScroll',
  'mouseover',
  'mouseout',
  'mousemove',
  'selectstart',
  'selectend',
  'keydown',
  'keypress',
  'keyup',
  'orientationchange',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerleave',
  'pointercancel',
  'gesturestart',
  'gesturechange',
  'gestureend',
  'focus',
  'blur',
  'change',
  'reset',
  'select',
  'submit',
  'focusin',
  'focusout',
  'load',
  'unload',
  'beforeunload',
  'resize',
  'move',
  'DOMContentLoaded',
  'readystatechange',
  'error',
  'abort',
  'scroll'
])

/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++
}

function getElementEvents(element) {
  const uid = makeEventUid(element)

  element.uidEvent = uid
  eventRegistry[uid] = eventRegistry[uid] || {}

  return eventRegistry[uid]
}

function bootstrapHandler(meta, fn) {
  return function (event) {
    hydrateObj(event, { delegateTarget: meta.explicitOriginalTarget })

    if (meta.oneOff) {
      EventHandler.off(meta.explicitOriginalTarget, event.type, fn)
    }

    return fn.apply(meta.explicitOriginalTarget, [event])
  }
}

function bootstrapDelegationHandler(meta, fn) {
  return function (event) {
    const domElements = meta.explicitOriginalTarget.querySelectorAll(meta.delegationSelector)

    for (let { target } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue
        }

        hydrateObj(event, { delegateTarget: target })

        if (meta.oneOff) {
          EventHandler.off(meta.explicitOriginalTarget, event.type, meta.delegationSelector, fn)
        }

        return fn.apply(target, [event])
      }
    }
  }
}

function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events)
    .find(event => event.callable === callable && event.delegationSelector === delegationSelector)
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return
  }

  const parameters = new Parameters(handler, delegationFunction)
  const meta = new EventMeta(element, originalTypeEvent, parameters, oneOff)
  let { callable, isDelegated, delegationSelector } = parameters
  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || (event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget))) {
          return fn.call(this, event)
        }
      }
    }

    callable = wrapFunction(callable)
  }

  const events = getElementEvents(element)
  const handlers = events[meta.name] || (events[meta.name] = {})
  const previousFunction = findHandler(handlers, callable, delegationSelector)

  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff

    return
  }

  const uid = makeEventUid(callable, meta.namespace)
  const fn = isDelegated ?
    bootstrapDelegationHandler(meta, callable) :
    bootstrapHandler(meta, callable)

  handlers[uid] = hydrateObj(hydrateObj(fn, meta), { callable, uidEvent: uid })

  element.addEventListener(meta.name, handlers[uid], isDelegated)
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector)

  if (!fn) {
    return
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector))
  delete events[typeEvent][fn.uidEvent]
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {}

  for (const handlerKey of Object.keys(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey]
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector)
    }
  }
}

const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false)
  },

  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true)
  },

  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return
    }

    const parameters = new Parameters(handler, delegationFunction)
    const meta = new EventMeta(element, originalTypeEvent, parameters)
    const { callable, delegationSelector } = parameters

    const events = getElementEvents(element)
    const storeElementEvent = events[meta.name] || {}

    if (callable) {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return
      }

      removeHandler(element, events, meta.name, callable, delegationSelector)
      return
    }

    if (meta.isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, meta.namespace)
      }
    }

    for (const keyHandlers of Object.keys(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '')

      if (!meta.namespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers]
        removeHandler(element, events, meta.name, event.callable, event.delegationSelector)
      }
    }
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null
    }

    const meta = new EventMeta(element, event)
    const $ = getjQuery()

    let jQueryEvent = null
    let bubbles = true
    let nativeDispatch = true
    let defaultPrevented = false

    if (meta.namespace && $) {
      jQueryEvent = $.Event(event, args)

      $(element).trigger(jQueryEvent)
      bubbles = !jQueryEvent.isPropagationStopped()
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped()
      defaultPrevented = jQueryEvent.isDefaultPrevented()
    }

    let evt = new Event(meta.name, { bubbles, cancelable: true })
    evt = hydrateObj(evt, args)

    if (defaultPrevented) {
      evt.preventDefault()
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt)
    }

    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault()
    }

    return evt
  }
}

function Parameters(handler, delegationFunction) {
  this.isDelegated = typeof handler === 'string'
  this.callable = this.isDelegated ?
    delegationFunction :
    (handler || delegationFunction) // todo: tooltip passes `false` instead of selector, so we need to check
  this.delegationSelector = this.isDelegated ? handler : null
}

function EventMeta(element, eventName, parameters = {}, oneOff = false) {
  this.givenName = eventName
  this.isNamespace = eventName.startsWith('.')

  const namespaces = eventName.split('.')
  let name = namespaces.shift()

  if (!this.isNamespace) {
    name = customEvents[name] || name
    name = nativeEvents.has(name) ? name : eventName
  }

  this.name = this.isNamespace ? null : name
  this.namespace = namespaces.join('.')
  this.explicitOriginalTarget = element
  this.delegationSelector = parameters.delegationSelector
  this.oneOff = oneOff
}

function hydrateObj(obj, meta) {
  for (const [key, value] of Object.entries(meta || {})) {
    try {
      obj[key] = value
    } catch {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value
        }
      })
    }
  }

  return obj
}

export default EventHandler
