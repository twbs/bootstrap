/**
 * --------------------------------------------------------------------------
 * Bootstrap button.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import { setAriaAttribute } from './util/index.js'

/**
 * Constants
 */

const NAME = 'button'
const DATA_KEY = 'bs.button'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const CLASS_NAME_ACTIVE = 'active'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]'
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static override get NAME(): string {
    return NAME
  }

  // Public
  toggle(): void {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    setAriaAttribute(this._element, 'aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE))
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
  event.preventDefault()

  const button = (event.target as Element).closest(SELECTOR_DATA_TOGGLE)
  const data = Button.getOrCreateInstance(button)

  data.toggle()
})

// A toggle button must always expose `aria-pressed`. Without it, assistive technology
// reads the control as a plain button and never announces the pressed state.
// See https://www.w3.org/WAI/ARIA/apg/patterns/button/
EventHandler.on(document, EVENT_DOM_CONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
    if (!element.hasAttribute('aria-pressed')) {
      setAriaAttribute(element, 'aria-pressed', element.classList.contains(CLASS_NAME_ACTIVE))
    }
  }
})

export default Button
