/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { jQuery as $ } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'button'
const VERSION = '4.3.1'
const DATA_KEY = 'bs.button'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const ClassName = {
  ACTIVE: 'active',
  BUTTON: 'btn'
}

const Selector = {
  BUTTON: '.btn[data-toggle="button"]'
}

const Event = {
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
}

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
    if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
      this._element.setAttribute('aria-pressed',
        !this._element.classList.contains(ClassName.ACTIVE))

      this._element.classList.toggle(ClassName.ACTIVE)
    }
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Static

  static _jQueryInterface(config) {
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

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, Event.CLICK_DATA_API, Selector.BUTTON, event => {
  let button = event.target
  if (!button.classList.contains(ClassName.BUTTON)) {
    // the event.target is a child element of the actual toggle button
    button = SelectorEngine.closest(button, Selector.BUTTON)
  }

  let data = Data.getData(button, DATA_KEY)
  if (!data) {
    data = new Button(button)
    Data.setData(button, DATA_KEY, data)
  }

  data.toggle()
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .button to jQuery only if jQuery is present
 */

if (typeof $ !== 'undefined') {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Button._jQueryInterface
  $.fn[NAME].Constructor = Button

  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Button._jQueryInterface
  }
}

export default Button
