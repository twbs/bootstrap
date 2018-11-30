/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME               = 'toast'
const VERSION            = '4.1.3'
const DATA_KEY           = 'bs.toast'
const EVENT_KEY          = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT = $.fn[NAME]

const Event = {
  CLICK_DISMISS : `click.dismiss${EVENT_KEY}`,
  HIDE          : `hide${EVENT_KEY}`,
  HIDDEN        : `hidden${EVENT_KEY}`,
  SHOW          : `show${EVENT_KEY}`,
  SHOWN         : `shown${EVENT_KEY}`
}

const ClassName = {
  FADE : 'fade',
  HIDE : 'hide',
  SHOW : 'show'
}

const DefaultType = {
  animation : 'boolean',
  autohide  : 'boolean',
  delay     : 'number'
}

const Default = {
  animation : true,
  autohide  : true,
  delay     : 500
}

const Selector = {
  DATA_DISMISS : '[data-dismiss="toast"]'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast {
  constructor(element, config) {
    this._element = element
    this._config  = this._getConfig(config)
    this._timeout = null
    this._setListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  show() {
    $(this._element).trigger(Event.SHOW)

    if (this._config.animation) {
      this._element.classList.add(ClassName.FADE)
    }

    const complete = () => {
      $(this._element).trigger(Event.SHOWN)

      if (this._config.autohide) {
        this.hide()
      }
    }

    this._element.classList.add(ClassName.SHOW)
    if (this._config.animation) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  hide(withoutTimeout) {
    if (!this._element.classList.contains(ClassName.SHOW)) {
      return
    }

    $(this._element).trigger(Event.HIDE)

    if (withoutTimeout) {
      this._close()
    } else {
      this._timeout = setTimeout(() => {
        this._close()
      }, this._config.delay)
    }
  }

  dispose() {
    clearTimeout(this._timeout)
    this._timeout = null

    if (this._element.classList.contains(ClassName.SHOW)) {
      this._element.classList.remove(ClassName.SHOW)
    }

    $(this._element).off(Event.CLICK_DISMISS)

    $.removeData(this._element, DATA_KEY)
    this._element = null
    this._config  = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...$(this._element).data(),
      ...typeof config === 'object' && config ? config : {}
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _setListeners() {
    $(this._element).on(
      Event.CLICK_DISMISS,
      Selector.DATA_DISMISS,
      () => this.hide(true)
    )
  }

  _close() {
    const complete = () => {
      $(this._element).trigger(Event.HIDDEN)
    }

    this._element.classList.remove(ClassName.SHOW)

    if (this._config.animation) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      const $element = $(this)
      let data       = $element.data(DATA_KEY)
      const _config  = typeof config === 'object' && config

      if (!data) {
        data = new Toast(this, _config)
        $element.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](this)
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME]             = Toast._jQueryInterface
$.fn[NAME].Constructor = Toast
$.fn[NAME].noConflict  = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Toast._jQueryInterface
}

export default Toast
