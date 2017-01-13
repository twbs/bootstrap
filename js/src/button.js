/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Button = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'button'
  const VERSION             = '4.0.0-alpha.6'
  const DATA_KEY            = 'bs.button'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]

  const CLASS_NAME_ACTIVE = 'active'
  const CLASS_NAME_BUTTON = 'btn'
  const CLASS_NAME_FOCUS = 'focus'

  const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]'
  const SELECTOR_DATA_TOGGLE = '[data-toggle="buttons"]'
  const SELECTOR_INPUT = 'input'
  const SELECTOR_ACTIVE = '.active'
  const SELECTOR_BUTTON = '.btn'

  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
  const EVENT_FOCUS_BLUR_DATA_API = `focus${EVENT_KEY}${DATA_API_KEY} blur${EVENT_KEY}${DATA_API_KEY}`

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    toggle() {
      let triggerChangeEvent = true
      const rootElement      = $(this._element).closest(
        SELECTOR_DATA_TOGGLE
      )[0]

      if (rootElement) {
        const input = $(this._element).find(SELECTOR_INPUT)[0]

        if (input) {
          if (input.type === 'radio') {
            if (input.checked &&
              $(this._element).hasClass(CLASS_NAME_ACTIVE)) {
              triggerChangeEvent = false

            } else {
              const activeElement = $(rootElement).find(SELECTOR_ACTIVE)[0]

              if (activeElement) {
                $(activeElement).removeClass(CLASS_NAME_ACTIVE)
              }
            }
          }

          if (triggerChangeEvent) {
            input.checked = !$(this._element).hasClass(CLASS_NAME_ACTIVE)
            $(input).trigger('change')
          }

          input.focus()
        }

      }

      this._element.setAttribute('aria-pressed',
        !$(this._element).hasClass(CLASS_NAME_ACTIVE))

      if (triggerChangeEvent) {
        $(this._element).toggleClass(CLASS_NAME_ACTIVE)
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }


    // static

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
    .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, (event) => {
      event.preventDefault()

      let button = event.target

      if (!$(button).hasClass(CLASS_NAME_BUTTON)) {
        button = $(button).closest(SELECTOR_BUTTON)
      }

      Button._jQueryInterface.call($(button), 'toggle')
    })
    .on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, (event) => {
      const button = $(event.target).closest(SELECTOR_BUTTON)[0]
      $(button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type))
    })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Button._jQueryInterface
  $.fn[NAME].Constructor = Button
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Button._jQueryInterface
  }

  return Button

})(jQuery)

export default Button
