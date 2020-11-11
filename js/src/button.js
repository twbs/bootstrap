/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha3): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery, onDOMContentLoaded } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'button'
const VERSION = '5.0.0-alpha3'
const DATA_KEY = 'bs.button'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_TOGGLE = '[data-toggle="button"]'

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

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
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE))
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

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
  event.preventDefault()

  const button = event.target.closest(SELECTOR_DATA_TOGGLE)

  let data = Data.getData(button, DATA_KEY)
  if (!data) {
    data = new Button(button)
  }

  data.toggle()
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Button to jQuery only if jQuery is present
 */

onDOMContentLoaded(() => {
  const $ = getjQuery()
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
})

export default Button
