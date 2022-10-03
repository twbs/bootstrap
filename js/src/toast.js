/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin, reflow } from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import { enableDismissTrigger } from './util/component-functions'
import FocusTrap from './util/focustrap'

/**
 * Constants
 */

const NAME = 'toast'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`
const ESCAPE_KEY = 'Escape'

const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_HIDE = 'hide' // @deprecated - kept here only for backwards compatibility
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'

const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number',
  keyboard: 'boolean',
  focus: 'boolean'
}

const Default = {
  animation: true,
  autohide: true,
  delay: 5000,
  keyboard: true,
  focus: true
}

/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._timeout = null
    this._hasMouseInteraction = false
    this._hasKeyboardInteraction = false
    this._focustrap = new FocusTrap({
      trapElement: this._element
    })
    this._setListeners()
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
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

    if (this._config.focus) {
      this._focustrap.activate()
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING)
      EventHandler.trigger(this._element, EVENT_SHOWN)

      this._maybeScheduleHide()
    }

    this._element.classList.remove(CLASS_NAME_HIDE) // @deprecated
    reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING)

    this._queueCallback(complete, this._element, this._config.animation)
  }

  hide() {
    if (!this.isShown()) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    this._focustrap.deactivate()
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE) // @deprecated
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW)
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }

    this._element.classList.add(CLASS_NAME_SHOWING)
    this._queueCallback(complete, this._element, this._config.animation)
  }

  dispose() {
    this._clearTimeout()

    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW)
    }

    this._focustrap.deactivate()
    super.dispose()
  }

  toggle() {
    return this.isShown() ? this.hide() : this.show()
  }

  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW)
  }

  // Private

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
      case 'mouseout': {
        this._hasMouseInteraction = isInteracting
        break
      }

      case 'focusin':
      case 'focusout': {
        this._hasKeyboardInteraction = isInteracting
        break
      }

      default: {
        break
      }
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
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true))
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false))
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true))
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false))
    // add esc event to close toast
    EventHandler.on(document, EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return
      }

      if (this._config.keyboard) {
        event.preventDefault()
        this._clearTimeout()
        this.hide()
      }
    })
  }

  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config)

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
 * Data API implementation
 */

enableDismissTrigger(Toast)

/**
 * jQuery
 */

defineJQueryPlugin(Toast)

export default Toast
