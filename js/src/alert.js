import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Alert = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'alert'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.alert'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150

  const Selector = {
    DISMISS : '[data-dismiss="alert"]'
  }

  const Event = {
    CLOSE          : `close${EVENT_KEY}`,
    CLOSED         : `closed${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    ALERT : 'alert',
    FADE  : 'fade',
    IN    : 'in'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    close(element) {
      element = element || this._element

      let rootElement = this._getRootElement(element)
      let customEvent = this._triggerCloseEvent(rootElement)

      if (customEvent.isDefaultPrevented()) {
        return
      }

      this._removeElement(rootElement)
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }


    // private

    _getRootElement(element) {
      let selector = Util.getSelectorFromElement(element)
      let parent   = false

      if (selector) {
        parent = $(selector)[0]
      }

      if (!parent) {
        parent = $(element).closest(`.${ClassName.ALERT}`)[0]
      }

      return parent
    }

    _triggerCloseEvent(element) {
      let closeEvent = $.Event(Event.CLOSE)

      $(element).trigger(closeEvent)
      return closeEvent
    }

    _removeElement(element) {
      $(element).removeClass(ClassName.IN)

      if (!Util.supportsTransitionEnd() ||
          !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element)
        return
      }

      $(element)
        .one(Util.TRANSITION_END, $.proxy(this._destroyElement, this, element))
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    _destroyElement(element) {
      $(element)
        .detach()
        .trigger(Event.CLOSED)
        .remove()
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let $element = $(this)
        let data     = $element.data(DATA_KEY)

        if (!data) {
          data = new Alert(this)
          $element.data(DATA_KEY, data)
        }

        if (config === 'close') {
          data[config](this)
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault()
        }

        alertInstance.close(this)
      }
    }

  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(
    Event.CLICK_DATA_API,
    Selector.DISMISS,
    Alert._handleDismiss(new Alert())
  )


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Alert._jQueryInterface
  $.fn[NAME].Constructor = Alert
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Alert._jQueryInterface
  }

  return Alert

})(jQuery)

export default Alert
