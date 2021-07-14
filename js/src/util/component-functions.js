import EventHandler from '../dom/event-handler'
import { getElementFromSelector, isDisabled } from './index'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

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

    const target = getElementFromSelector(this) || this.closest(`.${name}`)
    const instance = component.getOrCreateInstance(target)

    instance[method]() // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
  })
}

export {
  enableDismissTrigger
}
