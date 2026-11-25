/**
 * --------------------------------------------------------------------------
 * Bootstrap button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import { defineJQueryPlugin } from './util/index.js'

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
const EVENT_DOM_CONTENT_LOADED_DATA_API = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`

/**
 * Private functions
 */

function initializeAriaPressed(element) {
  if (!element.hasAttribute('aria-pressed')) {
    element.setAttribute('aria-pressed', element.classList.contains(CLASS_NAME_ACTIVE))
  }
}

function initializeToggleButtons() {
  for (const button of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
    initializeAriaPressed(button)
  }
}

/**
 * Class definition
 */

class Button extends BaseComponent {
  constructor(element) {
    super(element)

    if (this._element) {
      initializeAriaPressed(this._element)
    }
  }

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

EventHandler.on(document, EVENT_DOM_CONTENT_LOADED_DATA_API, initializeToggleButtons)

if (document.readyState !== 'loading') {
  initializeToggleButtons()
}

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
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
