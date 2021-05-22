/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  reflow,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import BaseComponent from './base-component'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'toast'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_HIDE = 'hide'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'

const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
}

const Default = {
  animation: true,
  autohide: true,
  delay: 5000
}

const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element)

    this._config = this._getConfig(config)
    this._timeout = null
    this._hasMouseInteraction = false
    this._hasKeyboardInteraction = false
    this._setListeners()
  }

  // Getters

  static get DefaultType() {
    return DefaultType
  }

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  // Public

  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW)

    if (showEvent.defaultPrevented) {
      return
    }

    this._clearTimeout()

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE)
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING)
      this._element.classList.add(CLASS_NAME_SHOW)

      EventHandler.trigger(this._element, EVENT_SHOWN)

      this._maybeScheduleHide()
    }

    this._element.classList.remove(CLASS_NAME_HIDE)
    reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOWING)

    this._queueCallback(complete, this._element, this._config.animation)
  }

  hide() {
    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE)
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }

    this._element.classList.remove(CLASS_NAME_SHOW)
    this._queueCallback(complete, this._element, this._config.animation)
  }

  dispose() {
    this._clearTimeout()

    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this._element.classList.remove(CLASS_NAME_SHOW)
    }

    super.dispose()
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' && config ? config : {})
    }

    typeCheckConfig(NAME, config, this.constructor.DefaultType)

    return config
  }

  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return
    }

    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return
    }

    this._timeout = setTimeout(() => {
      this.hide()
    }, this._config.delay)
  }

  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        this._hasMouseInteraction = isInteracting
        break
      case 'focusin':
      case 'focusout':
        this._hasKeyboardInteraction = isInteracting
        break
      default:
        break
    }

    if (isInteracting) {
      this._clearTimeout()
      return
    }

    const nextElement = event.relatedTarget
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return
    }

    this._maybeScheduleHide()
  }

  _setListeners() {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide())
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true))
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false))
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true))
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false))
  }

  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.get(this, DATA_KEY)
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
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Toast to jQuery only if jQuery is present
 */

defineJQueryPlugin(Toast)

export default Toast
