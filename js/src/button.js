/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { jQuery as $ } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import SelectorEngine from './dom/selectorEngine'

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
  BUTTON: 'btn',
  FOCUS: 'focus'
}

const Selector = {
  DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
  BUTTON: '.btn'
}

const Event = {
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
  FOCUS_DATA_API: `focus${EVENT_KEY}${DATA_API_KEY}`,
  BLUR_DATA_API: `blur${EVENT_KEY}${DATA_API_KEY}`
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

EventHandler.on(document, Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, event => {
  event.preventDefault()

  let button = event.target
  if (!button.classList.contains(ClassName.BUTTON)) {
    button = SelectorEngine.closest(button, Selector.BUTTON)
  }

  let data = Data.getData(button, DATA_KEY)
  if (!data) {
    data = new Button(button)
    Data.setData(button, DATA_KEY, data)
  }

  data.toggle()
})

EventHandler.on(document, Event.FOCUS_DATA_API, Selector.DATA_TOGGLE_CARROT, event => {
  const button = SelectorEngine.closest(event.target, Selector.BUTTON)
  button.classList.add(ClassName.FOCUS)
})

EventHandler.on(document, Event.BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, event => {
  const button = SelectorEngine.closest(event.target, Selector.BUTTON)
  button.classList.remove(ClassName.FOCUS)
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
