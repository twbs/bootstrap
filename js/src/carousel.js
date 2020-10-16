/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'carousel'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.carousel'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ARROW_LEFT_KEYCODE = 37 // KeyboardEvent.which value for left arrow key
const ARROW_RIGHT_KEYCODE = 39 // KeyboardEvent.which value for right arrow key
const TOUCHEVENT_COMPAT_WAIT = 500 // Time for mouse compat events to fire after touch
const SWIPE_THRESHOLD = 40

const Default = {
  interval: 5000,
  keyboard: true,
  slide: false,
  pause: 'hover',
  wrap: true,
  touch: true
}

const DefaultType = {
  interval: '(number|boolean)',
  keyboard: 'boolean',
  slide: '(boolean|string)',
  pause: '(string|boolean)',
  wrap: 'boolean',
  touch: 'boolean'
}

const DIRECTION_NEXT = 'next'
const DIRECTION_PREV = 'prev'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

const EVENT_SLIDE = `slide${EVENT_KEY}`
const EVENT_SLID = `slid${EVENT_KEY}`
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`
const EVENT_TOUCHEND = `touchend${EVENT_KEY}`
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`
const EVENT_POINTERUP = `pointerup${EVENT_KEY}`
const EVENT_DRAG_START = `dragstart${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_CAROUSEL = 'carousel'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_SLIDE = 'slide'
const CLASS_NAME_RIGHT = 'carousel-item-right'
const CLASS_NAME_LEFT = 'carousel-item-left'
const CLASS_NAME_NEXT = 'carousel-item-next'
const CLASS_NAME_PREV = 'carousel-item-prev'
const CLASS_NAME_POINTER_EVENT = 'pointer-event'

const SELECTOR_ACTIVE = '.active'
const SELECTOR_ACTIVE_ITEM = '.active.carousel-item'
const SELECTOR_ITEM = '.carousel-item'
const SELECTOR_ITEM_IMG = '.carousel-item img'
const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev'
const SELECTOR_INDICATORS = '.carousel-indicators'
const SELECTOR_DATA_SLIDE = '[data-slide], [data-slide-to]'
const SELECTOR_DATA_RIDE = '[data-ride="carousel"]'

const PointerType = {
  TOUCH: 'touch',
  PEN: 'pen'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Carousel {
  constructor(element, config) {
    this._items = null
    this._interval = null
    this._activeElement = null
    this._isPaused = false
    this._isSliding = false
    this.touchTimeout = null
    this.touchStartX = 0
    this.touchDeltaX = 0

    this._config = this._getConfig(config)
    this._element = element
    this._indicatorsElement = this._element.querySelector(SELECTOR_INDICATORS)
    this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
    this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent)

    this._addEventListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  next() {
    if (!this._isSliding) {
      this._slide(DIRECTION_NEXT)
    }
  }

  nextWhenVisible() {
    const $element = $(this._element)
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden &&
      ($element.is(':visible') && $element.css('visibility') !== 'hidden')) {
      this.next()
    }
  }

  prev() {
    if (!this._isSliding) {
      this._slide(DIRECTION_PREV)
    }
  }

  pause(event) {
    if (!event) {
      this._isPaused = true
    }

    if (this._element.querySelector(SELECTOR_NEXT_PREV)) {
      Util.triggerTransitionEnd(this._element)
      this.cycle(true)
    }

    clearInterval(this._interval)
    this._interval = null
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false
    }

    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }

    if (this._config.interval && !this._isPaused) {
      this._interval = setInterval(
        (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
        this._config.interval
      )
    }
  }

  to(index) {
    this._activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM)

    const activeIndex = this._getItemIndex(this._activeElement)

    if (index > this._items.length - 1 || index < 0) {
      return
    }

    if (this._isSliding) {
      $(this._element).one(EVENT_SLID, () => this.to(index))
      return
    }

    if (activeIndex === index) {
      this.pause()
      this.cycle()
      return
    }

    const direction = index > activeIndex ?
      DIRECTION_NEXT :
      DIRECTION_PREV

    this._slide(direction, this._items[index])
  }

  dispose() {
    $(this._element).off(EVENT_KEY)
    $.removeData(this._element, DATA_KEY)

    this._items = null
    this._config = null
    this._element = null
    this._interval = null
    this._isPaused = null
    this._isSliding = null
    this._activeElement = null
    this._indicatorsElement = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX)

    if (absDeltax <= SWIPE_THRESHOLD) {
      return
    }

    const direction = absDeltax / this.touchDeltaX

    this.touchDeltaX = 0

    // swipe left
    if (direction > 0) {
      this.prev()
    }

    // swipe right
    if (direction < 0) {
      this.next()
    }
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      $(this._element).on(EVENT_KEYDOWN, event => this._keydown(event))
    }

    if (this._config.pause === 'hover') {
      $(this._element)
        .on(EVENT_MOUSEENTER, event => this.pause(event))
        .on(EVENT_MOUSELEAVE, event => this.cycle(event))
    }

    if (this._config.touch) {
      this._addTouchEventListeners()
    }
  }

  _addTouchEventListeners() {
    if (!this._touchSupported) {
      return
    }

    const start = event => {
      if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
        this.touchStartX = event.originalEvent.clientX
      } else if (!this._pointerEvent) {
        this.touchStartX = event.originalEvent.touches[0].clientX
      }
    }

    const move = event => {
      // ensure swiping with one touch and not pinching
      if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
        this.touchDeltaX = 0
      } else {
        this.touchDeltaX = event.originalEvent.touches[0].clientX - this.touchStartX
      }
    }

    const end = event => {
      if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
        this.touchDeltaX = event.originalEvent.clientX - this.touchStartX
      }

      this._handleSwipe()
      if (this._config.pause === 'hover') {
        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause()
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout)
        }

        this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
      }
    }

    $(this._element.querySelectorAll(SELECTOR_ITEM_IMG))
      .on(EVENT_DRAG_START, e => e.preventDefault())

    if (this._pointerEvent) {
      $(this._element).on(EVENT_POINTERDOWN, event => start(event))
      $(this._element).on(EVENT_POINTERUP, event => end(event))

      this._element.classList.add(CLASS_NAME_POINTER_EVENT)
    } else {
      $(this._element).on(EVENT_TOUCHSTART, event => start(event))
      $(this._element).on(EVENT_TOUCHMOVE, event => move(event))
      $(this._element).on(EVENT_TOUCHEND, event => end(event))
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return
    }

    switch (event.which) {
      case ARROW_LEFT_KEYCODE:
        event.preventDefault()
        this.prev()
        break
      case ARROW_RIGHT_KEYCODE:
        event.preventDefault()
        this.next()
        break
      default:
    }
  }

  _getItemIndex(element) {
    this._items = element && element.parentNode ?
      [].slice.call(element.parentNode.querySelectorAll(SELECTOR_ITEM)) :
      []
    return this._items.indexOf(element)
  }

  _getItemByDirection(direction, activeElement) {
    const isNextDirection = direction === DIRECTION_NEXT
    const isPrevDirection = direction === DIRECTION_PREV
    const activeIndex = this._getItemIndex(activeElement)
    const lastItemIndex = this._items.length - 1
    const isGoingToWrap = isPrevDirection && activeIndex === 0 ||
                            isNextDirection && activeIndex === lastItemIndex

    if (isGoingToWrap && !this._config.wrap) {
      return activeElement
    }

    const delta = direction === DIRECTION_PREV ? -1 : 1
    const itemIndex = (activeIndex + delta) % this._items.length

    return itemIndex === -1 ?
      this._items[this._items.length - 1] : this._items[itemIndex]
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget)
    const fromIndex = this._getItemIndex(this._element.querySelector(SELECTOR_ACTIVE_ITEM))
    const slideEvent = $.Event(EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    })

    $(this._element).trigger(slideEvent)

    return slideEvent
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const indicators = [].slice.call(this._indicatorsElement.querySelectorAll(SELECTOR_ACTIVE))
      $(indicators).removeClass(CLASS_NAME_ACTIVE)

      const nextIndicator = this._indicatorsElement.children[
        this._getItemIndex(element)
      ]

      if (nextIndicator) {
        $(nextIndicator).addClass(CLASS_NAME_ACTIVE)
      }
    }
  }

  _slide(direction, element) {
    const activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM)
    const activeElementIndex = this._getItemIndex(activeElement)
    const nextElement = element || activeElement &&
      this._getItemByDirection(direction, activeElement)
    const nextElementIndex = this._getItemIndex(nextElement)
    const isCycling = Boolean(this._interval)

    let directionalClassName
    let orderClassName
    let eventDirectionName

    if (direction === DIRECTION_NEXT) {
      directionalClassName = CLASS_NAME_LEFT
      orderClassName = CLASS_NAME_NEXT
      eventDirectionName = DIRECTION_LEFT
    } else {
      directionalClassName = CLASS_NAME_RIGHT
      orderClassName = CLASS_NAME_PREV
      eventDirectionName = DIRECTION_RIGHT
    }

    if (nextElement && $(nextElement).hasClass(CLASS_NAME_ACTIVE)) {
      this._isSliding = false
      return
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName)
    if (slideEvent.isDefaultPrevented()) {
      return
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return
    }

    this._isSliding = true

    if (isCycling) {
      this.pause()
    }

    this._setActiveIndicatorElement(nextElement)

    const slidEvent = $.Event(EVENT_SLID, {
      relatedTarget: nextElement,
      direction: eventDirectionName,
      from: activeElementIndex,
      to: nextElementIndex
    })

    if ($(this._element).hasClass(CLASS_NAME_SLIDE)) {
      $(nextElement).addClass(orderClassName)

      Util.reflow(nextElement)

      $(activeElement).addClass(directionalClassName)
      $(nextElement).addClass(directionalClassName)

      const nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10)
      if (nextElementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval
        this._config.interval = nextElementInterval
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval
      }

      const transitionDuration = Util.getTransitionDurationFromElement(activeElement)

      $(activeElement)
        .one(Util.TRANSITION_END, () => {
          $(nextElement)
            .removeClass(`${directionalClassName} ${orderClassName}`)
            .addClass(CLASS_NAME_ACTIVE)

          $(activeElement).removeClass(`${CLASS_NAME_ACTIVE} ${orderClassName} ${directionalClassName}`)

          this._isSliding = false

          setTimeout(() => $(this._element).trigger(slidEvent), 0)
        })
        .emulateTransitionEnd(transitionDuration)
    } else {
      $(activeElement).removeClass(CLASS_NAME_ACTIVE)
      $(nextElement).addClass(CLASS_NAME_ACTIVE)

      this._isSliding = false
      $(this._element).trigger(slidEvent)
    }

    if (isCycling) {
      this.cycle()
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      let _config = {
        ...Default,
        ...$(this).data()
      }

      if (typeof config === 'object') {
        _config = {
          ..._config,
          ...config
        }
      }

      const action = typeof config === 'string' ? config : _config.slide

      if (!data) {
        data = new Carousel(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'number') {
        data.to(config)
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`)
        }

        data[action]()
      } else if (_config.interval && _config.ride) {
        data.pause()
        data.cycle()
      }
    })
  }

  static _dataApiClickHandler(event) {
    const selector = Util.getSelectorFromElement(this)

    if (!selector) {
      return
    }

    const target = $(selector)[0]

    if (!target || !$(target).hasClass(CLASS_NAME_CAROUSEL)) {
      return
    }

    const config = {
      ...$(target).data(),
      ...$(this).data()
    }
    const slideIndex = this.getAttribute('data-slide-to')

    if (slideIndex) {
      config.interval = false
    }

    Carousel._jQueryInterface.call($(target), config)

    if (slideIndex) {
      $(target).data(DATA_KEY).to(slideIndex)
    }

    event.preventDefault()
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, Carousel._dataApiClickHandler)

$(window).on(EVENT_LOAD_DATA_API, () => {
  const carousels = [].slice.call(document.querySelectorAll(SELECTOR_DATA_RIDE))
  for (let i = 0, len = carousels.length; i < len; i++) {
    const $carousel = $(carousels[i])
    Carousel._jQueryInterface.call($carousel, $carousel.data())
  }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Carousel._jQueryInterface
$.fn[NAME].Constructor = Carousel
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Carousel._jQueryInterface
}

export default Carousel
