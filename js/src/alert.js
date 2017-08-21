/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import SelectorEngine from './dom/selectorEngine'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                = 'alert'
const VERSION             = '4.3.1'
const DATA_KEY            = 'bs.alert'
const EVENT_KEY           = `.${DATA_KEY}`
const DATA_API_KEY        = '.data-api'
const JQUERY_NO_CONFLICT  = $.fn[NAME]

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
  SHOW  : 'show'
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

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  close(element) {
    let rootElement = this._element
    if (element) {
      rootElement = this._getRootElement(element)
    }

    const customEvent = this._triggerCloseEvent(rootElement)

    if (customEvent.defaultPrevented) {
      return
    }

    this._removeElement(rootElement)
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Private

  _getRootElement(element) {
    const selector = Util.getSelectorFromElement(element)
    let parent     = false

    if (selector) {
      const tmpSelected = SelectorEngine.find(selector)
      parent = tmpSelected[0]
    }

    if (!parent) {
      parent = SelectorEngine.closest(element, `.${ClassName.ALERT}`)
    }

    return parent
  }

  _triggerCloseEvent(element) {
    return EventHandler.trigger(element, Event.CLOSE)
  }

  _removeElement(element) {
    element.classList.remove(ClassName.SHOW)

    if (!element.classList.contains(ClassName.FADE)) {
      this._destroyElement(element)
      return
    }

    const transitionDuration = Util.getTransitionDurationFromElement(element)

    EventHandler
      .one(element, Util.TRANSITION_END, (event) => this._destroyElement(element, event))
    Util.emulateTransitionEnd(element, transitionDuration)
  }

  _destroyElement(element) {
    EventHandler.trigger(element, Event.CLOSED)
    element.parentNode.removeChild(element)
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)

      if (!data) {
        data = new Alert(this)
        Data.setData(this, DATA_KEY, data)
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
$.fn[NAME].noConflict  = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Alert._jQueryInterface
}

export default Alert
