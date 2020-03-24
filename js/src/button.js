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
  INPUT                : 'input:not([type="hidden"])',
  ACTIVE               : '.active',
  BUTTON               : '.btn'
}

const Event = {
  CHANGE_DATA_API     : `change${EVENT_KEY}${DATA_API_KEY}`,
  CLICK_DATA_API      : `click${EVENT_KEY}${DATA_API_KEY}`,
  FOCUS_BLUR_DATA_API : `focus${EVENT_KEY}${DATA_API_KEY} ` +
                        `blur${EVENT_KEY}${DATA_API_KEY}`,
  LOAD_DATA_API       : `load${EVENT_KEY}${DATA_API_KEY}`
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Button {
  constructor(element) {
    this._element = element
    this._input = element.querySelector(Selector.INPUT)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  get checked() {
    if (this._input) {
      return this._input.checked
    }
    return this._element.getAttribute('aria-pressed') === 'true'
  }

  get disabled() {
    return this._element.hasAttribute('disabled') ||
      this._element.classList.contains('disabled') ||
      this._input && (
        this._input.hasAttribute('disabled') ||
        this._input.classList.contains('disabled')
      )
  }

  // Setters

  set checked(c) {
    if (this.disabled) {
      return
    }

    if (this._input) {
      this._input.checked = c
      $(this._input).trigger('change')
    } else {
      this._element.setAttribute('aria-pressed', c)
      this._update()
    }
  }

  // Public

  toggle() {
    this.checked = !this.checked
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Private

  /**
   * _update toggles the "active" class on the button according to the checked
   * status of the toggle.
   * @return {void}
   */
  _update() {
    this._element.classList.toggle(ClassName.ACTIVE, this.checked)
  }

  // Static

  static _jQueryInterface(config) {
    switch (config) {
      case 'checked':
      case 'disabled':
        if (!this.length) {
          return
        }
        return get(this[0], config)
      default:
        return this.each(function () {
          return get(this, config)
        })
    }

    function get(e, config) {
      let data = $(e).data(DATA_KEY)
      if (!data) {
        data = new Button(e)
        $(e).data(DATA_KEY, data)
      }

      switch (config) {
        case 'toggle':
        case '_update':
          return data[config]()
        default:
          return data[config]
      }
    }
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
    Button._jQueryInterface.call(t.closest(Selector.BUTTON), '_update')
  })
  .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
    // Find the containing .btn.
    let btn = $(event.target)
    if (!btn.hasClass(ClassName.BUTTON)) {
      btn = btn.closest(Selector.BUTTON)
    }

    // Don't allow disabled buttons to be toggled.
    if (Button._jQueryInterface.call(btn, 'disabled')) {
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

$(window).on(Event.LOAD_DATA_API, () => {
  // Ensure correct active class is set to match the controls' actual values/states.
  Button._jQueryInterface.call($(Selector.DATA_TOGGLE + ', ' + Selector.DATA_TOGGLES_BUTTONS), '_update')
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
