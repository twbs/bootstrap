/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'button'
const VERSION = '5.0.0-alpha1'
const DATA_KEY = 'bs.button'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_FOCUS = 'focus'

const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]'
const SELECTOR_DATA_TOGGLE = '[data-toggle="buttons"]'
const SELECTOR_INPUT = 'input:not([type="hidden"])'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_BUTTON = '.btn'

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_FOCUS_DATA_API = `focus${EVENT_KEY}${DATA_API_KEY}`
const EVENT_BLUR_DATA_API = `blur${EVENT_KEY}${DATA_API_KEY}`

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Button {
  constructor(element) {
    this._element = element
    Data.setData(element, DATA_KEY, this)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  toggle() {
    let triggerChangeEvent = true
    let addAriaPressed = true

    const rootElement = this._element.closest(SELECTOR_DATA_TOGGLE)

    if (rootElement) {
      const input = SelectorEngine.findOne(SELECTOR_INPUT, this._element)

      if (input && input.type === 'radio') {
        if (input.checked &&
          this._element.classList.contains(CLASS_NAME_ACTIVE)) {
          triggerChangeEvent = false
        } else {
          const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE, rootElement)

          if (activeElement) {
            activeElement.classList.remove(CLASS_NAME_ACTIVE)
          }
        }

        if (triggerChangeEvent) {
          if (input.hasAttribute('disabled') ||
            rootElement.hasAttribute('disabled') ||
            input.classList.contains(CLASS_NAME_DISABLED) ||
            rootElement.classList.contains(CLASS_NAME_DISABLED)) {
            return
          }

          input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE)
          EventHandler.trigger(input, 'change')
        }

        input.focus()
        addAriaPressed = false
      }
    }

    if (addAriaPressed) {
      this._element.setAttribute('aria-pressed',
        !this._element.classList.contains(CLASS_NAME_ACTIVE))
    }

    if (triggerChangeEvent) {
      this._element.classList.toggle(CLASS_NAME_ACTIVE)
    }
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)

      if (!data) {
        data = new Button(this)
      }

      if (config === 'toggle') {
        data[config]()
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
  event.preventDefault()

  const button = event.target.closest(SELECTOR_BUTTON)

  let data = Data.getData(button, DATA_KEY)
  if (!data) {
    data = new Button(button)
  }

  data.toggle()
})

EventHandler.on(document, EVENT_FOCUS_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
  const button = event.target.closest(SELECTOR_BUTTON)

  if (button) {
    button.classList.add(CLASS_NAME_FOCUS)
  }
})

EventHandler.on(document, EVENT_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
  const button = event.target.closest(SELECTOR_BUTTON)

  if (button) {
    button.classList.remove(CLASS_NAME_FOCUS)
  }
})

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .button to jQuery only if jQuery is present
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Button.jQueryInterface
  $.fn[NAME].Constructor = Button

  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Button.jQueryInterface
  }
}

export default Button
