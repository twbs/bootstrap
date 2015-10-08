/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): spinner.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Spinner = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  const NAME               = 'spinner'
  const VERSION            = '4.0.0'
  const DATA_KEY           = 'bs.spinner'
  const EVENT_KEY          = `.${DATA_KEY}`
  const DATA_API_KEY       = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  const ANIMATION_DURATION = 600

  const Selector = {
    DATA_SPY : '[data-spy="spinner"]'
  }

  const ClassName = {
    FALLBACK      : 'spinner-fallback',
    FALLBACK_SPIN : 'spinner-fallback-spin'
  }

  const Event = {
    LOAD_DATA_API : `load${EVENT_KEY}${DATA_API_KEY}`
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Spinner {

    constructor(element) {
      this._element = element
      this._timer   = null

      this._createAnimation()
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    destroy() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // private

    _isOldIe() {
      // This is test for < IE9
      return true
      // return document.all && !window.atob
    }

    _rotate(element) {
      const $element = $(element)

      $({ deg: 0 }).animate({ deg: 360 }, {
        duration: ANIMATION_DURATION,
        easing: 'linear',
        step: now => {
          $element.css({
            transform: 'rotate(' + now + 'deg)'
          })
        },
        complete: (() => {
          this._rotate(element)
        }).bind(this)
      })
    }

    _createAnimation() {
      if (!this._isOldIe()) {
        return false
      }

      const $spinner = $(this._element)
      const $spin    = $("<div/>", {
        'class': ClassName.FALLBACK_SPIN
      })

      $spinner.addClass(ClassName.FALLBACK)
      $spinner.append($spin)
      this._rotate($spin[0])
      return $spinner
    }

    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let $element = $(this)
        let data     = $element.data(DATA_KEY)

        if (!data && /destroy/.test(config)) {
          return
        }

        if (!data) {
          data = new Spinner(this)
          $element.data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
          }
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

  $(window).on(Event.LOAD_DATA_API, () => {
    let spinners = $.makeArray($(Selector.DATA_SPY))

    for (let i = spinners.length; i--;) {
      let $spinner = $(spinners[i])
      Spinner._jQueryInterface.call($spinner, $spinner.data())
    }
  })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Spinner._jQueryInterface
  $.fn[NAME].Constructor = Spinner
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Spinner._jQueryInterface
  }

  return Spinner

})(jQuery)

export default Spinner
