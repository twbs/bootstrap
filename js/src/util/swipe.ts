/**
 * --------------------------------------------------------------------------
 * Bootstrap util/swipe.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler, { type BootstrapEvent } from '../dom/event-handler.js'
import Config from './config.js'
import { execute } from './index.js'

/**
 * Constants
 */

const NAME = 'swipe'
const EVENT_KEY = '.bs.swipe'
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`
const EVENT_TOUCHEND = `touchend${EVENT_KEY}`
const EVENT_TOUCHCANCEL = `touchcancel${EVENT_KEY}`
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`
const EVENT_POINTERUP = `pointerup${EVENT_KEY}`
const EVENT_POINTERCANCEL = `pointercancel${EVENT_KEY}`
const POINTER_TYPE_TOUCH = 'touch'
const POINTER_TYPE_PEN = 'pen'
const CLASS_NAME_POINTER_EVENT = 'pointer-event'
const SWIPE_THRESHOLD = 40

type SwipeConfig = {
  endCallback: (() => void) | null
  leftCallback: (() => void) | null
  rightCallback: (() => void) | null
  upCallback: (() => void) | null
  downCallback: (() => void) | null
}

const Default: SwipeConfig = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null,
  upCallback: null,
  downCallback: null
}

const DefaultType = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)',
  upCallback: '(function|null)',
  downCallback: '(function|null)'
}

/**
 * Class definition
 */

class Swipe extends Config {
  protected declare _element: HTMLElement
  protected declare _config: SwipeConfig
  protected declare _deltaX: number
  protected declare _deltaY: number
  protected declare _supportPointerEvents: boolean
  protected declare _pointerId: number | null
  protected declare _touchStart: Touch | null

  constructor(element: HTMLElement | null, config?: Partial<SwipeConfig> | null) {
    super()
    this._element = element as HTMLElement

    if (!element || !Swipe.isSupported()) {
      return
    }

    this._config = this._getConfig(config) as SwipeConfig
    this._deltaX = 0
    this._deltaY = 0
    this._pointerId = null
    this._touchStart = null
    this._supportPointerEvents = Boolean(window.PointerEvent)
    this._initEvents()
  }

  // Getters
  static override get Default(): SwipeConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  dispose(): void {
    EventHandler.off(this._element, EVENT_KEY)
    this._element?.classList.remove(CLASS_NAME_POINTER_EVENT)
  }

  // Private
  protected _start(event: BootstrapEvent): void {
    if (!this._supportPointerEvents) {
      this._touchStart = event.touches.length === 1 ? event.touches[0] : null
      this._deltaX = 0
      this._deltaY = 0
      return
    }

    if (this._eventIsPointerPenTouch(event)) {
      this._pointerId = event.pointerId
      this._deltaX = event.clientX
      this._deltaY = event.clientY
    }
  }

  protected _end(event: BootstrapEvent): void {
    if (this._supportPointerEvents) {
      if (!this._eventIsPointerPenTouch(event) || this._pointerId !== event.pointerId) {
        return
      }

      this._pointerId = null
      this._deltaX = event.clientX - this._deltaX
      this._deltaY = event.clientY - this._deltaY
    } else if (!this._touchStart) {
      return
    }

    this._touchStart = null
    this._handleSwipe()
    execute(this._config.endCallback)
  }

  protected _move(event: BootstrapEvent): void {
    if (event.touches.length !== 1) {
      this._touchStart = null
    }

    if (!this._touchStart) {
      return
    }

    this._deltaX = event.touches[0].clientX - this._touchStart.clientX
    this._deltaY = event.touches[0].clientY - this._touchStart.clientY
  }

  protected _handleSwipe(): void {
    const absDeltaX = Math.abs(this._deltaX)
    const absDeltaY = Math.abs(this._deltaY)

    // Determine primary axis: whichever has greater movement wins
    if (absDeltaY > absDeltaX && absDeltaY > SWIPE_THRESHOLD) {
      // Vertical swipe
      const direction = this._deltaY > 0 ? 'down' : 'up'
      this._deltaX = 0
      this._deltaY = 0
      execute(direction === 'down' ? this._config.downCallback : this._config.upCallback)
      return
    }

    if (absDeltaX > SWIPE_THRESHOLD) {
      // Horizontal swipe
      const direction = absDeltaX / this._deltaX
      this._deltaX = 0
      this._deltaY = 0

      if (!direction) {
        return
      }

      execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback)
      return
    }

    this._deltaX = 0
    this._deltaY = 0
  }

  protected _initEvents(): void {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event))
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event))
      EventHandler.on(this._element, EVENT_POINTERCANCEL, event => {
        if (this._pointerId === event.pointerId) {
          this._pointerId = null
        }
      })

      this._element.classList.add(CLASS_NAME_POINTER_EVENT)
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event))
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event))
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event))
      EventHandler.on(this._element, EVENT_TOUCHCANCEL, () => {
        this._touchStart = null
      })
    }
  }

  protected _eventIsPointerPenTouch(event: BootstrapEvent): boolean {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)
  }

  // Static
  static isSupported(): boolean {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
  }
}

export default Swipe
export type { SwipeConfig }
