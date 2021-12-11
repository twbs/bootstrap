/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): toggle.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import { eventActionOnPlugin } from './dom/magic-actions'

/**
 * Constants
 */

const NAME = 'toggler'
const DATA_KEY = 'bs.toggle'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_TOGGLE = `toggle${EVENT_KEY}`
const EVENT_TOGGLED = `toggled${EVENT_KEY}`

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="toggler"]'
/**
 * Class definition
 */

const DefaultType = {
  attribute: 'string',
  value: 'string'
}

const Default = {
  attribute: 'class',
  value: null
}

class Toggler extends BaseComponent {
  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Private
  toggle() {
    const toggleEvent = EventHandler.trigger(this._element, EVENT_TOGGLE)

    if (toggleEvent.defaultPrevented) {
      return
    }

    this._execute()

    EventHandler.trigger(this._element, EVENT_TOGGLED)
  }

  _execute() {
    const { attribute, value } = this._config

    if (attribute === 'id') {
      throw new Error('You have to be kidding')
    }

    if (attribute === 'class') {
      this._element.classList.toggle(value)
      return
    }

    if (this._element.getAttribute(attribute) === value) {
      this._element.removeAttribute(attribute)
      return
    }

    this._element.setAttribute(attribute, value)
  }
}

/**
 * Data API implementation
 */
eventActionOnPlugin(Toggler, 'click', SELECTOR_DATA_TOGGLE, 'toggle')

/**
 * jQuery
 */

defineJQueryPlugin(Toggler)

export default Toggler
