/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.2): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'

/**
 * Constants
 */

const NAME = 'button'
const VERSION = '4.6.2'
const DATA_KEY = 'bs.button'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_BUTTON = 'btn'
const CLASS_NAME_FOCUS = 'focus'

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_FOCUS_BLUR_DATA_API = `focus${EVENT_KEY}${DATA_API_KEY} ` +
                          `blur${EVENT_KEY}${DATA_API_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]'
const SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]'
const SELECTOR_DATA_TOGGLE = '[data-toggle="button"]'
const SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn'
const SELECTOR_INPUT = 'input:not([type="hidden"])'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_BUTTON = '.btn'

/**
 * Class definition
 */

class Button {
  constructor(element) {
    this._element = element
    this.shouldAvoidTriggerChange = false
  }

  // Getters
  static get VERSION() {
    return VERSION
  }

  // Public
  toggle() {
    let triggerChangeEvent = true
    let addAriaPressed = true
    const rootElement = $(this._element).closest(SELECTOR_DATA_TOGGLES)[0]

    if (rootElement) {
      const input = this._element.querySelector(SELECTOR_INPUT)

      if (input) {
        if (input.type === 'radio') {
          if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
            triggerChangeEvent = false
          } else {
            const activeElement = rootElement.querySelector(SELECTOR_ACTIVE)

            if (activeElement) {
              $(activeElement).removeClass(CLASS_NAME_ACTIVE)
            }
          }
        }

        if (triggerChangeEvent) {
          // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE)
          }

          if (!this.shouldAvoidTriggerChange) {
            $(input).trigger('change')
          }
        }

        input.focus()
        addAriaPressed = false
      }
    }

    if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE))
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(CLASS_NAME_ACTIVE)
      }
    }
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Static
  static _jQueryInterface(config, avoidTriggerChange) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)

      if (!data) {
        data = new Button(this)
        $element.data(DATA_KEY, data)
      }

      data.shouldAvoidTriggerChange = avoidTriggerChange

      if (config === 'toggle') {
        data[config]()
      }
    })
  }
}

/**
 * Data API implementation
 */

$(document)
  .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
    let button = event.target
    const initialButton = button

    if (!$(button).hasClass(CLASS_NAME_BUTTON)) {
      button = $(button).closest(SELECTOR_BUTTON)[0]
    }

    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
      event.preventDefault() // work around Firefox bug #1540995
    } else {
      const inputBtn = button.querySelector(SELECTOR_INPUT)

      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
        event.preventDefault() // work around Firefox bug #1540995
        return
      }

      if (initialButton.tagName === 'INPUT' || button.tagName !== 'LABEL') {
        Button._jQueryInterface.call($(button), 'toggle', initialButton.tagName === 'INPUT')
      }
    }
  })
  .on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
    const button = $(event.target).closest(SELECTOR_BUTTON)[0]
    $(button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type))
  })

$(window).on(EVENT_LOAD_DATA_API, () => {
  // ensure correct active class is set to match the controls' actual values/states

  // find all checkboxes/readio buttons inside data-toggle groups
  let buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS))
  for (let i = 0, len = buttons.length; i < len; i++) {
    const button = buttons[i]
    const input = button.querySelector(SELECTOR_INPUT)
    if (input.checked || input.hasAttribute('checked')) {
      button.classList.add(CLASS_NAME_ACTIVE)
    } else {
      button.classList.remove(CLASS_NAME_ACTIVE)
    }
  }

  // find all button toggles
  buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))
  for (let i = 0, len = buttons.length; i < len; i++) {
    const button = buttons[i]
    if (button.getAttribute('aria-pressed') === 'true') {
      button.classList.add(CLASS_NAME_ACTIVE)
    } else {
      button.classList.remove(CLASS_NAME_ACTIVE)
    }
  }
})

/**
 * jQuery
 */

$.fn[NAME] = Button._jQueryInterface
$.fn[NAME].Constructor = Button
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Button._jQueryInterface
}

export default Button
