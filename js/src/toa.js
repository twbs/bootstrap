/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): toa.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import Base from './base'
import EventHandler from './dom/event-handler'

const NAME = 'toast'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_HIDE = 'hide' // @deprecated - kept here only for backwards compatibility
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'
//
// const TEMPLATE = '<slot></slot>'

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

export default class Toa extends Base {
  constructor() {
    super()
    console.log(this._config) // eslint-disable-line no-console
    this.classList.add('toast', 'p-2')
    this.setAttribute('role', 'alert')
    this.setAttribute('aria-live', 'assertlive')
    this.setAttribute('aria-atomic', 'true')
    this._timeout = null
    this._hasMouseInteraction = false
    this._hasKeyboardInteraction = false
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  show() {
    const showEvent = EventHandler.trigger(this, EVENT_SHOW)

    if (showEvent.defaultPrevented) {
      return
    }

    this._clearTimeout()

    if (this._config.animation) {
      this.classList.add(CLASS_NAME_FADE)
    }

    const complete = () => {
      this.classList.remove(CLASS_NAME_SHOWING)
      EventHandler.trigger(this, EVENT_SHOWN)

      this._maybeScheduleHide()
    }

    this.classList.remove(CLASS_NAME_HIDE) // @deprecated
    // reflow(this)
    this.style.display = 'block'
    this.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING)

    this._queueCallback(complete, this, this._config.animation)
  }

  hide() {
    if (!this.isShown()) {
      return
    }

    const hideEvent = EventHandler.trigger(this, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    const complete = () => {
      this.classList.add(CLASS_NAME_HIDE) // @deprecated
      this.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW)
      EventHandler.trigger(this, EVENT_HIDDEN)
      this.style.removeProperty('display')
    }

    this.classList.add(CLASS_NAME_SHOWING)
    this._queueCallback(complete, this, this._config.animation)
  }

  isShown() {
    return this.classList.contains(CLASS_NAME_SHOW)
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
    if (this === nextElement || this.contains(nextElement)) {
      return
    }

    this._maybeScheduleHide()
  }

  _setListeners() {
    EventHandler.on(this, EVENT_MOUSEOVER, event => this._onInteraction(event, true))
    EventHandler.on(this, EVENT_MOUSEOUT, event => this._onInteraction(event, false))
    EventHandler.on(this, EVENT_FOCUSIN, event => this._onInteraction(event, true))
    EventHandler.on(this, EVENT_FOCUSOUT, event => this._onInteraction(event, false))
  }

  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  connectedCallback() {
    this._setListeners()
    this.show()
  }

  //
  // static get observedAttributes() {
  //   return ['duration'];
  // }
  //
  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (name === 'duration') {
  //     this.duration = newValue;
  //   }
  // }
}
