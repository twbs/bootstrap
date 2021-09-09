/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElementFromSelector,
  getNextActiveElement,
  isRTL,
  isVisible,
  reflow,
  triggerTransitionEnd
} from './util/index'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'
import Swipe from './util/swipe'
import BaseComponent from './base-component'

/**
 * Constants
 */

const NAME = 'carousel'
const DATA_KEY = 'bs.carousel'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const ARROW_LEFT_KEY = 'ArrowLeft'
const ARROW_RIGHT_KEY = 'ArrowRight'
const TOUCHEVENT_COMPAT_WAIT = 500 // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next'
const ORDER_PREV = 'prev'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

const EVENT_SLIDE = `slide${EVENT_KEY}`
const EVENT_SLID = `slid${EVENT_KEY}`
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`
const EVENT_DRAG_START = `dragstart${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_CAROUSEL = 'carousel'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_SLIDE = 'slide'
const CLASS_NAME_END = 'carousel-item-end'
const CLASS_NAME_START = 'carousel-item-start'
const CLASS_NAME_NEXT = 'carousel-item-next'
const CLASS_NAME_PREV = 'carousel-item-prev'

const SELECTOR_ACTIVE = '.active'
const SELECTOR_ACTIVE_ITEM = '.active.carousel-item'
const SELECTOR_ITEM = '.carousel-item'
const SELECTOR_ITEM_IMG = '.carousel-item img'
const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev'
const SELECTOR_INDICATORS = '.carousel-indicators'
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]'
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]'

const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT
}

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

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._items = null
    this._interval = null
    this._activeElement = null
    this._isPaused = false
    this._isSliding = false
    this.touchTimeout = null
    this._swipeHelper = null

    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element)
    this._addEventListeners()
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
  next() {
    this._slide(ORDER_NEXT)
  }

  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next()
    }
  }

  prev() {
    this._slide(ORDER_PREV)
  }

  pause(event) {
    if (!event) {
      this._isPaused = true
    }

    if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
      triggerTransitionEnd(this._element)
      this.cycle(true)
    }

    this._clearInterval()
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false
    }

    this._clearInterval()
    if (this._config.interval && !this._isPaused) {
      this._updateInterval()

      this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval)
    }
  }

  to(index) {
    this._activeElement = this._getActive()
    const activeIndex = this._getItemIndex(this._activeElement)

    if (index > this._items.length - 1 || index < 0) {
      return
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index))
      return
    }

    if (activeIndex === index) {
      this.pause()
      this.cycle()
      return
    }

    const order = index > activeIndex ?
      ORDER_NEXT :
      ORDER_PREV

    this._slide(order, this._items[index])
  }

  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose()
    }

    super.dispose()
  }

  // Private
  _configAfterMerge(config) {
    config.defaultInterval = config.interval
    return config
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event))
    }

    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event))
      EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event))
    }

    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners()
    }
  }

  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault())
    }

    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return
      }

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

    const swipeConfig = {
      leftCallback: () => this._slide(DIRECTION_LEFT),
      rightCallback: () => this._slide(DIRECTION_RIGHT),
      endCallback: endCallBack
    }

    this._swipeHelper = new Swipe(this._element, swipeConfig)
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return
    }

    const direction = KEY_TO_DIRECTION[event.key]
    if (direction) {
      event.preventDefault()
      this._slide(direction)
    }
  }

  _getItemIndex(element) {
    this._items = element && element.parentNode ?
      SelectorEngine.find(SELECTOR_ITEM, element.parentNode) :
      []

    return this._items.indexOf(element)
  }

  _getItemByOrder(order, activeElement) {
    const isNext = order === ORDER_NEXT
    return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap)
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget)
    const fromIndex = this._getItemIndex(this._getActive())

    return EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    })
  }

  _setActiveIndicatorElement(element) {
    if (!this._indicatorsElement) {
      return
    }

    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement)

    activeIndicator.classList.remove(CLASS_NAME_ACTIVE)
    activeIndicator.removeAttribute('aria-current')

    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${this._getItemIndex(element)}"]`, this._indicatorsElement)

    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE)
      newActiveIndicator.setAttribute('aria-current', 'true')
    }
  }

  _updateInterval() {
    const element = this._activeElement || this._getActive()

    if (!element) {
      return
    }

    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10)

    this._config.interval = elementInterval || this._config.defaultInterval
  }

  _slide(directionOrOrder, element) {
    const order = this._directionToOrder(directionOrOrder)
    const activeElement = this._getActive()
    const activeElementIndex = this._getItemIndex(activeElement)
    const nextElement = element || this._getItemByOrder(order, activeElement)

    const nextElementIndex = this._getItemIndex(nextElement)
    const isCycling = Boolean(this._interval)

    const isNext = order === ORDER_NEXT
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV
    const eventDirectionName = this._orderToDirection(order)

    if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE)) {
      this._isSliding = false
      return
    }

    if (this._isSliding) {
      return
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName)
    if (slideEvent.defaultPrevented) {
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
    this._activeElement = nextElement

    const triggerSlidEvent = () => {
      EventHandler.trigger(this._element, EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      })
    }

    if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
      nextElement.classList.add(orderClassName)

      reflow(nextElement)

      activeElement.classList.add(directionalClassName)
      nextElement.classList.add(directionalClassName)

      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName)
        nextElement.classList.add(CLASS_NAME_ACTIVE)

        activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName)

        this._isSliding = false

        setTimeout(triggerSlidEvent, 0)
      }

      this._queueCallback(completeCallBack, activeElement, true)
    } else {
      activeElement.classList.remove(CLASS_NAME_ACTIVE)
      nextElement.classList.add(CLASS_NAME_ACTIVE)

      this._isSliding = false
      triggerSlidEvent()
    }

    if (isCycling) {
      this.cycle()
    }
  }

  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element)
  }

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }
  }

  _directionToOrder(direction) {
    if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
      return direction
    }

    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT
    }

    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV
  }

  _orderToDirection(order) {
    if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
      return order
    }

    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT
    }

    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT
  }

  // Static
  static carouselInterface(element, config) {
    const data = Carousel.getOrCreateInstance(element, config)

    let { _config } = data
    if (typeof config === 'object') {
      _config = {
        ..._config,
        ...config
      }
    }

    const action = typeof config === 'string' ? config : _config.slide

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
  }

  static jQueryInterface(config) {
    return this.each(function () {
      Carousel.carouselInterface(this, config)
    })
  }

  static dataApiClickHandler(event) {
    const target = getElementFromSelector(this)

    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return
    }

    const config = {
      ...Manipulator.getDataAttributes(this)
    }
    const slideIndex = this.getAttribute('data-bs-slide-to')

    if (slideIndex) {
      config.interval = false
    }

    Carousel.carouselInterface(target, config)

    if (slideIndex) {
      Carousel.getInstance(target).to(slideIndex)
    }

    event.preventDefault()
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler)

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE)

  for (const carousel of carousels) {
    Carousel.carouselInterface(carousel, Carousel.getInstance(carousel))
  }
})

/**
 * jQuery
 */

defineJQueryPlugin(Carousel)

export default Carousel
