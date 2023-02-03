/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.3.0-alpha1): util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Config from './config.js'
import { ScopedEventHandler } from '../dom/event-handler.js'
import { execute } from './index.js'

/**
 * Constants
 */

const NAME = 'swipe'
const EVENT_KEY = '.bs.swipe'
const EVENT_TOUCHSTART = 'touchstart'
const EVENT_TOUCHMOVE = 'touchmove'
const EVENT_TOUCHEND = 'touchend'
const EVENT_POINTERDOWN = 'pointerdown'
const EVENT_POINTERUP = 'pointerup'
const POINTER_TYPE_TOUCH = 'touch'
const POINTER_TYPE_PEN = 'pen'
const CLASS_NAME_POINTER_EVENT = 'pointer-event'
const SWIPE_THRESHOLD = 40

const Default = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
}

const DefaultType = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
}

/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super()
    this._element = element

    if (!element || !Swipe.isSupported()) {
      return
    }

    this._config = this._getConfig(config)
    this._deltaX = 0
    this._supportPointerEvents = Boolean(window.PointerEvent)
    this._events = new ScopedEventHandler(this._element, EVENT_KEY)
    this._initEvents()
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
  dispose() {
    this._events.off()
  }

  // Private
  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX

      return
    }

    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX
    }
  }

  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX
    }

    this._handleSwipe()
    execute(this._config.endCallback)
  }

  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ?
      0 :
      event.touches[0].clientX - this._deltaX
  }

  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX)

    if (absDeltaX <= SWIPE_THRESHOLD) {
      return
    }

    const direction = absDeltaX / this._deltaX

    this._deltaX = 0

    if (!direction) {
      return
    }

    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback)
  }

  _initEvents() {
    if (this._supportPointerEvents) {
      this._events.on(EVENT_POINTERDOWN, event => this._start(event))
      this._events.on(EVENT_POINTERUP, event => this._end(event))

      this._element.classList.add(CLASS_NAME_POINTER_EVENT)
    } else {
      this._events.on(EVENT_TOUCHSTART, event => this._start(event))
      this._events.on(EVENT_TOUCHMOVE, event => this._move(event))
      this._events.on(EVENT_TOUCHEND, event => this._end(event))
    }
  }

  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)
  }

  // Static
  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
  }
}

export default Swipe
