/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.4.1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                = 'button'
const VERSION             = '4.4.1'
const DATA_KEY            = 'bs.button'
const EVENT_KEY           = `.${DATA_KEY}`
const DATA_API_KEY        = '.data-api'
const JQUERY_NO_CONFLICT  = $.fn[NAME]

const ClassName = {
  ACTIVE : 'active',
  BUTTON : 'btn',
  FOCUS  : 'focus'
}

const Selector = {
  DATA_TOGGLE_CARROT   : '[data-toggle^="button"]',
  DATA_TOGGLES         : '[data-toggle="buttons"]',
  DATA_TOGGLE          : '[data-toggle="button"]',
  DATA_TOGGLES_BUTTONS : '[data-toggle="buttons"] .btn',
  DATA_TOGGLES_INPUTS  : '[data-toggle="buttons"] input:not([type="hidden"])',
  DATA_TOGGLE_BUTTONS  : '[data-toggle="button"], [data-toggle="buttons"] .btn',
  INPUT                : 'input:not([type="hidden"])',
  ACTIVE               : '.active',
  BUTTON               : '.btn'
}

const Event = {
  CHANGE_DATA_API        : `change${EVENT_KEY}${DATA_API_KEY}`,
  CLICK_DATA_API         : `click${EVENT_KEY}${DATA_API_KEY}`,
  FOCUS_BLUR_DATA_API    : `focus${EVENT_KEY}${DATA_API_KEY} ` +
                           `blur${EVENT_KEY}${DATA_API_KEY}`,
  LOAD_PAGESHOW_DATA_API : `load${EVENT_KEY}${DATA_API_KEY} ` +
                           `pageshow${EVENT_KEY}${DATA_API_KEY}`
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Button {
  constructor(element) {
    this._element = element
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  toggle() {
    if (Button._disabled(this._element)) {
      return
    }

    const c = !Button._checked(this._element)
    const input = this._element.querySelector(Selector.INPUT)
    if (input) {
      input.checked = c
      $(input).trigger('change')
    } else {
      this._element.setAttribute('aria-pressed', c)
      Button._update(this._element)
    }
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Static

  static _update(e) {
    e.classList.toggle(ClassName.ACTIVE, Button._checked(e))
  }

  static _checked(e) {
    const input = e.querySelector(Selector.INPUT)
    if (input) {
      return input.checked
    }
    return e.getAttribute('aria-pressed') === 'true'
  }

  static _disabled(e) {
    if (e.hasAttribute('disabled') || e.classList.contains('disabled')) {
      return true
    }

    const input = e.querySelector(Selector.INPUT)
    return input && (
      input.hasAttribute('disabled') ||
      input.classList.contains('disabled')
    )
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      if (!data) {
        data = new Button(this)
        $(this).data(DATA_KEY, data)
      }

      if (config === 'toggle') {
        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on(Event.CHANGE_DATA_API, Selector.DATA_TOGGLES_INPUTS, function (event) {
    // Update all related inputs on change.
    let t = $(this)
    if (event.target.type === 'radio') {
      t = t.add(document.getElementsByName(event.target.name))
    }
    t.closest(Selector.BUTTON).each(function () {
      Button._update(this)
    })
  })
  .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
    // Find the containing .btn.
    let btn = $(event.target)
    if (!btn.hasClass(ClassName.BUTTON)) {
      btn = btn.closest(Selector.BUTTON)
    }
    if (!btn.length) {
      return
    }

    // Don't allow disabled buttons to be toggled.
    if (Button._disabled(btn[0])) {
      event.preventDefault() // work around Firefox bug #1540995
      return
    }

    // label.btn > input will trigger a change event for the same click so we
    // don't repeat the toggle here.
    if (event.target.tagName === 'INPUT' || btn.length && btn[0].tagName === 'LABEL') {
      return
    }

    // Toggle the btn.
    Button._jQueryInterface.call(btn, 'toggle')

    // div.btn may not accept focus, so we give it to its input.
    btn.find(Selector.INPUT).trigger('focus')
  })
  .on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
    // Add/remove class "focus" on focus[in]/focusout events.
    $(event.target)
      .closest(Selector.BUTTON)
      .toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type))
  })

$(window).on(Event.LOAD_PAGESHOW_DATA_API, () => {
  // Ensure correct active class is set to match the controls' actual values/states.
  $(Selector.DATA_TOGGLE_BUTTONS).each(function () {
    Button._update(this)
  })
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Button._jQueryInterface
$.fn[NAME].Constructor = Button
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Button._jQueryInterface
}

export default Button
