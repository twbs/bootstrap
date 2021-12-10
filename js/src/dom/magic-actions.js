/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from './event-handler'
import { getElementFromSelector, isDisabled } from '../util/index'

const parseAction = action => {
  const split = action.split(':')
  const pluginName = split[1]
  return {
    onEvent: split[0],
    pluginName: pluginName.charAt(0).toUpperCase() + pluginName.slice(1),
    method: split[2]
  }
}

const supportedEvents = [
  'keyup',
  'keydown',
  'mousedown',
  'mouseup',
  'click',
  'mouseenter',
  'mouseleave',
  'click',
  'focus'
]

const enableMagicActions = () => {
  for (const eventName of supportedEvents) {
    enableMagicActionForEvent(eventName)
  }
}

const enableMagicActionForEvent = onEvent => {
  eventAction(onEvent, `[data-bs-act^="${onEvent}:"]`, data => {
    const action = parseAction(data.event.target.getAttribute('data-bs-act'))

    const plugin = window.bootstrap[action.pluginName] || null
    if (!plugin) {
      throw new TypeError(`You are trying to use plugin "${action.pluginName}", which it doesn't exist in our library`)
    }

    const instance = plugin.getOrCreateInstance(data.target)
    instance[action.method]()
  })
}

const eventActionOnPlugin = (Plugin, onEvent, stringSelector, method, callback = null) => {
  eventAction(`${onEvent}.${Plugin.NAME}`, stringSelector, data => {
    const instance = Plugin.getOrCreateInstance(data.target)
    if (typeof callback === 'function') {
      callback({ ...data, instance })
    }

    instance[method]()
  })
}

const eventAction = (onEvent, stringSelector, callback) => {
  EventHandler.on(document, onEvent, stringSelector, event => {
    const eventTarget = event.target

    if (['A', 'AREA'].includes(eventTarget.tagName)) {
      event.preventDefault()
    }

    if (isDisabled(eventTarget)) {
      return
    }

    const target = getElementFromSelector(eventTarget) || eventTarget
    callback({ target, event })
  })
}

const enableDismissTrigger = (component, method = 'hide') => {
  const name = component.NAME
  eventAction(`click.${name}`, `[data-bs-dismiss="${name}"]`, event => {
    const target = getElementFromSelector(event.target) || event.target.closest(`.${name}`)
    const instance = component.getOrCreateInstance(target)

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]()
  })
}

export {
  enableDismissTrigger,
  enableMagicActions,
  eventActionOnPlugin
}
