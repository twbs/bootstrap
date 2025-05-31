/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler.js'
import SelectorEngine from '../dom/selector-engine.js'
import { isDisabled } from './index.js'

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`
  const name = component.NAME

  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault()
    }

    if (isDisabled(this)) {
      return
    }

    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`)
    const instance = component.getOrCreateInstance(target)

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]()
  })
}

const eventActionOnPlugin = (Plugin, onEvent, stringSelector, method, callback = null) => {
  eventAction(`${onEvent}.${Plugin.NAME}`, stringSelector, data => {
    const instances = data.targets.filter(Boolean).map(element => Plugin.getOrCreateInstance(element))
    if (typeof callback === 'function') {
      callback({ ...data, instances })
    }

    for (const instance of instances) {
      instance[method]()
    }
  })
}

const eventAction = (onEvent, stringSelector, callback) => {
  const selector = `${stringSelector}:not(.disabled):not(:disabled)`
  EventHandler.on(document, onEvent, selector, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault()
    }

    const selector = SelectorEngine.getSelectorFromElement(this)
    const targets = selector ? SelectorEngine.find(selector) : [this]

    callback({ targets, event })
  })
}

export {
  enableDismissTrigger,
  eventActionOnPlugin
}
