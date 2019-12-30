/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  TRANSITION_END,
  emulateTransitionEnd,
  getTransitionDurationFromElement,
  reflow,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'toast'
const VERSION = '4.3.1'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`

const Event = {
  CLICK_DISMISS: `click.dismiss${EVENT_KEY}`,
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`
}

const ClassName = {
  FADE: 'fade',
  HIDE: 'hide',
  SHOW: 'show',
  SHOWING: 'showing'
}

const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
}

const Default = {
  animation: true,
  autohide: true,
  delay: 500
}

const Selector = {
  DATA_DISMISS: '[data-dismiss="toast"]'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast {
  constructor(element, config) {
    this._element = element
    this._config = this._getConfig(config)
    this._timeout = null
    this._setListeners()
    Data.setData(element, DATA_KEY, this)
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
    const showEvent = EventHandler.trigger(this._element, Event.SHOW)

    if (showEvent.defaultPrevented) {
      return
    }

    if (this._config.animation) {
      this._element.classList.add(ClassName.FADE)
    }

    const complete = () => {
      this._element.classList.remove(ClassName.SHOWING)
      this._element.classList.add(ClassName.SHOW)

      EventHandler.trigger(this._element, Event.SHOWN)

      if (this._config.autohide) {
        this._timeout = setTimeout(() => {
          this.hide()
        }, this._config.delay)
      }
    }

    this._element.classList.remove(ClassName.HIDE)
    reflow(this._element)
    this._element.classList.add(ClassName.SHOWING)
    if (this._config.animation) {
      const transitionDuration = getTransitionDurationFromElement(this._element)

      EventHandler.one(this._element, TRANSITION_END, complete)
      emulateTransitionEnd(this._element, transitionDuration)
    } else {
      complete()
    }
  }

  hide() {
    if (!this._element.classList.contains(ClassName.SHOW)) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, Event.HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    const complete = () => {
      this._element.classList.add(ClassName.HIDE)
      EventHandler.trigger(this._element, Event.HIDDEN)
    }

    this._element.classList.remove(ClassName.SHOW)
    if (this._config.animation) {
      const transitionDuration = getTransitionDurationFromElement(this._element)

      EventHandler.one(this._element, TRANSITION_END, complete)
      emulateTransitionEnd(this._element, transitionDuration)
    } else {
      complete()
    }
  }

  dispose() {
    clearTimeout(this._timeout)
    this._timeout = null

    if (this._element.classList.contains(ClassName.SHOW)) {
      this._element.classList.remove(ClassName.SHOW)
    }

    EventHandler.off(this._element, Event.CLICK_DISMISS)
    Data.removeData(this._element, DATA_KEY)

    this._element = null
    this._config = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...typeof config === 'object' && config ? config : {}
    }

    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _setListeners() {
    EventHandler.on(
      this._element,
      Event.CLICK_DISMISS,
      Selector.DATA_DISMISS,
      () => this.hide()
    )
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data) {
        data = new Toast(this, _config)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](this)
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 *  add .toast to jQuery only if jQuery is present
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Toast.jQueryInterface
  $.fn[NAME].Constructor = Toast
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Toast.jQueryInterface
  }
}

export default Toast
