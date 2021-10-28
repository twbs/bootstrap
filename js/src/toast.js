/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.1): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * Constants
 */

const NAME = 'toast'
const VERSION = '4.6.1'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT = $.fn[NAME]

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_HIDE = 'hide'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'

const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`

const SELECTOR_DATA_DISMISS = '[data-dismiss="toast"]'

const Default = {
  animation: true,
  autohide: true,
  delay: 500
}

const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
}

/**
 * Class definition
 */

class Toast {
  constructor(element, config) {
    this._element = element
    this._config = this._getConfig(config)
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

  static get Default() {
    return Default
  }

  // Public
  show() {
    const showEvent = $.Event(EVENT_SHOW)

    $(this._element).trigger(showEvent)
    if (showEvent.isDefaultPrevented()) {
      return
    }

    this._clearTimeout()

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE)
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING)
      this._element.classList.add(CLASS_NAME_SHOW)

      $(this._element).trigger(EVENT_SHOWN)

      if (this._config.autohide) {
        this._timeout = setTimeout(() => {
          this.hide()
        }, this._config.delay)
      }
    }

    this._element.classList.remove(CLASS_NAME_HIDE)
    Util.reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOWING)
    if (this._config.animation) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  hide() {
    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const hideEvent = $.Event(EVENT_HIDE)

    $(this._element).trigger(hideEvent)
    if (hideEvent.isDefaultPrevented()) {
      return
    }

    this._close()
  }

  dispose() {
    this._clearTimeout()

    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this._element.classList.remove(CLASS_NAME_SHOW)
    }

    $(this._element).off(EVENT_CLICK_DISMISS)

    $.removeData(this._element, DATA_KEY)
    this._element = null
    this._config = null
  }

  // Private
  _getConfig(config) {
    config = {
      ...Default,
      ...$(this._element).data(),
      ...(typeof config === 'object' && config ? config : {})
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _setListeners() {
    $(this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide())
  }

  _close() {
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE)
      $(this._element).trigger(EVENT_HIDDEN)
    }

    this._element.classList.remove(CLASS_NAME_SHOW)
    if (this._config.animation) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  // Static
  static _jQueryInterface(config) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)
      const _config = typeof config === 'object' && config

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
 * jQuery
 */

$.fn[NAME] = Toast._jQueryInterface
$.fn[NAME].Constructor = Toast
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Toast._jQueryInterface
}

export default Toast
