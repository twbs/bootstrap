import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selectorEngine'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Button = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'button'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.button'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'

  const ClassName = {
    ACTIVE : 'active',
    BUTTON : 'btn',
    FOCUS  : 'focus'
  }

  const Selector = {
    DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
    DATA_TOGGLE        : '[data-toggle="buttons"]',
    INPUT              : 'input',
    ACTIVE             : '.active',
    BUTTON             : '.btn'
  }

  const Event = {
    CLICK_DATA_API      : `click${EVENT_KEY}${DATA_API_KEY}`,
    FOCUS_DATA_API      : `focus${EVENT_KEY}${DATA_API_KEY}`,
    BLUR_DATA_API       : `blur${EVENT_KEY}${DATA_API_KEY}`
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
      let triggerChangeEvent = true
      let addAriaPressed = true

      const rootElement = SelectorEngine.closest(
        this._element,
        Selector.DATA_TOGGLE
      )

      if (rootElement) {
        const input = SelectorEngine.findOne(Selector.INPUT, this._element)

        if (input) {
          if (input.type === 'radio') {
            if (input.checked &&
              this._element.classList.contains(ClassName.ACTIVE)) {
              triggerChangeEvent = false
            } else {
              const activeElement = SelectorEngine.findOne(Selector.ACTIVE, rootElement)

              if (activeElement) {
                activeElement.classList.remove(ClassName.ACTIVE)
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') ||
              rootElement.hasAttribute('disabled') ||
              input.classList.contains('disabled') ||
              rootElement.classList.contains('disabled')) {
              return
            }
            Manipulator.setChecked(input, !this._element.classList.contains(ClassName.ACTIVE))
            EventHandler.trigger(input, 'change')
          }

          input.focus()
          addAriaPressed = false
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed',
          !this._element.classList.contains(ClassName.ACTIVE))
      }

      if (triggerChangeEvent) {
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
          Data.setData(this, DATA_KEY, data)
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

  EventHandler.on(document,
    Event.CLICK_DATA_API,
    Selector.DATA_TOGGLE_CARROT, (event) => {
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

  EventHandler.on(document,
    Event.FOCUS_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      const button = SelectorEngine.closest(event.target, Selector.BUTTON)
      button.classList.add(ClassName.FOCUS)
    })

  EventHandler.on(document,
    Event.BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      const button = SelectorEngine.closest(event.target, Selector.BUTTON)
      button.classList.remove(ClassName.FOCUS)
    })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .button to jQuery only if jQuery is present
   */
  if (typeof window.$ !== 'undefined' || typeof window.jQuery !== 'undefined') {
    const $                   = window.$ || window.jQuery
    const JQUERY_NO_CONFLICT  = $.fn[NAME]
    $.fn[NAME]                = Button._jQueryInterface
    $.fn[NAME].Constructor    = Button

    $.fn[NAME].noConflict  = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT
      return Button._jQueryInterface
    }
  }

  return Button

})()

export default Button
