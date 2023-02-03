/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.3.0-alpha1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index.js'
import { ScopedEventHandler } from './dom/event-handler.js'
import BaseComponent from './base-component.js'

/**
 * Constants
 */

const NAME = 'button'

const CLASS_NAME_ACTIVE = 'active'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]'
const EVENT_CLICK = 'click'

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE))
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this)

      if (config === 'toggle') {
        data[config]()
      }
    })
  }
}

/**
 * Data API implementation
 */

new ScopedEventHandler(document, Button.EVENT_KEY, true).on(EVENT_CLICK, SELECTOR_DATA_TOGGLE, event => {
  event.preventDefault()

  const button = event.target.closest(SELECTOR_DATA_TOGGLE)
  const data = Button.getOrCreateInstance(button)

  data.toggle()
})

/**
 * jQuery
 */

defineJQueryPlugin(Button)

export default Button
