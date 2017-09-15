import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import SelectorEngine from './dom/selectorEngine'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Carousel = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                    = 'carousel'
  const VERSION                 = '4.0.0'
  const DATA_KEY                = 'bs.carousel'
  const EVENT_KEY               = `.${DATA_KEY}`
  const DATA_API_KEY            = '.data-api'
  const JQUERY_NO_CONFLICT      = $.fn[NAME]
  const ARROW_LEFT_KEYCODE      = 37 // KeyboardEvent.which value for left arrow key
  const ARROW_RIGHT_KEYCODE     = 39 // KeyboardEvent.which value for right arrow key
  const TOUCHEVENT_COMPAT_WAIT  = 500 // Time for mouse compat events to fire after touch
  const MILLISECONDS_MULTIPLIER = 1000

  const Default = {
    interval : 5000,
    keyboard : true,
    slide    : false,
    pause    : 'hover',
    wrap     : true
  }

  const DefaultType = {
    interval : '(number|boolean)',
    keyboard : 'boolean',
    slide    : '(boolean|string)',
    pause    : '(string|boolean)',
    wrap     : 'boolean'
  }

  const Direction = {
    NEXT     : 'next',
    PREV     : 'prev',
    LEFT     : 'left',
    RIGHT    : 'right'
  }

  const Event = {
    SLIDE          : `slide${EVENT_KEY}`,
    SLID           : `slid${EVENT_KEY}`,
    KEYDOWN        : `keydown${EVENT_KEY}`,
    MOUSEENTER     : `mouseenter${EVENT_KEY}`,
    MOUSELEAVE     : `mouseleave${EVENT_KEY}`,
    TOUCHEND       : `touchend${EVENT_KEY}`,
    LOAD_DATA_API  : `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    CAROUSEL : 'carousel',
    ACTIVE   : 'active',
    SLIDE    : 'slide',
    RIGHT    : 'carousel-item-right',
    LEFT     : 'carousel-item-left',
    NEXT     : 'carousel-item-next',
    PREV     : 'carousel-item-prev',
    ITEM     : 'carousel-item'
  }

  const Selector = {
    ACTIVE      : '.active',
    ACTIVE_ITEM : '.active.carousel-item',
    ITEM        : '.carousel-item',
    NEXT_PREV   : '.carousel-item-next, .carousel-item-prev',
    INDICATORS  : '.carousel-indicators',
    DATA_SLIDE  : '[data-slide], [data-slide-to]',
    DATA_RIDE   : '[data-ride="carousel"]'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel {
    constructor(element, config) {
      this._items              = null
      this._interval           = null
      this._activeElement      = null

      this._isPaused           = false
      this._isSliding          = false

      this.touchTimeout        = null

      this._config            = this._getConfig(config)
      this._element           = element
      this._indicatorsElement = SelectorEngine.findOne(Selector.INDICATORS, this._element)
      this._transitionDuration = this._getTransitionDuration()

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
        this._slide(Direction.NEXT)
      }
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && Util.isVisible(this._element)) {
        this.next()
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV)
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true
      }

      if (SelectorEngine.findOne(Selector.NEXT_PREV, this._element) &&
        Util.supportsTransitionEnd()) {
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
      this._activeElement = SelectorEngine.findOne(Selector.ACTIVE_ITEM, this._element)
      const activeIndex = this._getItemIndex(this._activeElement)

      if (index > this._items.length - 1 || index < 0) {
        return
      }

      if (this._isSliding) {
        EventHandler.one(this._element, Event.SLID, () => this.to(index))
        return
      }

      if (activeIndex === index) {
        this.pause()
        this.cycle()
        return
      }

      const direction = index > activeIndex
        ? Direction.NEXT
        : Direction.PREV

      this._slide(direction, this._items[index])
    }

    dispose() {
      EventHandler.off(this._element, EVENT_KEY)
      Data.removeData(this._element, DATA_KEY)

      this._items             = null
      this._config            = null
      this._element           = null
      this._interval          = null
      this._isPaused          = null
      this._isSliding         = null
      this._activeElement     = null
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

    _getTransitionDuration() {
      // Get transition-duration of first element in the carousel
      let transitionDuration = $(this._element).find(Selector.ITEM).css('transition-duration')

      // Return 0 carousel item is not found
      if (!transitionDuration) {
        return 0
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0]

      // Multiply by 1000 if transition-duration is defined in seconds
      return transitionDuration.indexOf('ms') > -1
        ? parseFloat(transitionDuration)
        : parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler
          .on(this._element, Event.KEYDOWN, (event) => this._keydown(event))
      }

      if (this._config.pause === 'hover') {
        EventHandler
          .on(this._element, Event.MOUSEENTER, (event) => this.pause(event))
        EventHandler
          .on(this._element, Event.MOUSELEAVE, (event) => this.cycle(event))
        if ('ontouchstart' in document.documentElement) {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          EventHandler
            .on(this._element, Event.TOUCHEND, () => {
              this.pause()
              if (this.touchTimeout) {
                clearTimeout(this.touchTimeout)
              }
              this.touchTimeout = setTimeout((event) => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
            })
        }
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
      this._items = Util.makeArray(SelectorEngine.find(Selector.ITEM, element.parentNode))
      return this._items.indexOf(element)
    }

    _getItemByDirection(direction, activeElement) {
      const isNextDirection = direction === Direction.NEXT
      const isPrevDirection = direction === Direction.PREV
      const activeIndex     = this._getItemIndex(activeElement)
      const lastItemIndex   = this._items.length - 1
      const isGoingToWrap   = isPrevDirection && activeIndex === 0 ||
                              isNextDirection && activeIndex === lastItemIndex

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement
      }

      const delta     = direction === Direction.PREV ? -1 : 1
      const itemIndex = (activeIndex + delta) % this._items.length

      return itemIndex === -1
        ? this._items[this._items.length - 1] : this._items[itemIndex]
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget)
      const fromIndex   = this._getItemIndex(SelectorEngine.findOne(Selector.ACTIVE_ITEM, this._element))

      return EventHandler.trigger(this._element, Event.SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      })
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const indicators = SelectorEngine.find(Selector.ACTIVE, this._indicatorsElement)
        for (let i = 0; i < indicators.length; i++) {
          indicators[i].classList.remove(ClassName.ACTIVE)
        }

        const nextIndicator = this._indicatorsElement.children[
          this._getItemIndex(element)
        ]

        if (nextIndicator) {
          nextIndicator.classList.add(ClassName.ACTIVE)
        }
      }
    }

    _slide(direction, element) {
      const activeElement = SelectorEngine.findOne(Selector.ACTIVE_ITEM, this._element)
      const activeElementIndex = this._getItemIndex(activeElement)
      const nextElement = element || activeElement &&
        this._getItemByDirection(direction, activeElement)

      const nextElementIndex = this._getItemIndex(nextElement)
      const isCycling = Boolean(this._interval)

      let directionalClassName
      let orderClassName
      let eventDirectionName

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT
        orderClassName = ClassName.NEXT
        eventDirectionName = Direction.LEFT
      } else {
        directionalClassName = ClassName.RIGHT
        orderClassName = ClassName.PREV
        eventDirectionName = Direction.RIGHT
      }

      if (nextElement && nextElement.classList.contains(ClassName.ACTIVE)) {
        this._isSliding = false
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

      if (Util.supportsTransitionEnd() &&
        this._element.classList.contains(ClassName.SLIDE)) {

        nextElement.classList.add(orderClassName)

        Util.reflow(nextElement)

        activeElement.classList.add(directionalClassName)
        nextElement.classList.add(directionalClassName)

        EventHandler
          .one(activeElement, Util.TRANSITION_END, () => {
            nextElement.classList.remove(directionalClassName)
            nextElement.classList.remove(orderClassName)
            nextElement.classList.add(ClassName.ACTIVE)

            activeElement.classList.remove(ClassName.ACTIVE)
            activeElement.classList.remove(orderClassName)
            activeElement.classList.remove(directionalClassName)

            this._isSliding = false

            setTimeout(() => {
              EventHandler.trigger(this._element, Event.SLID, {
                relatedTarget: nextElement,
                direction: eventDirectionName,
                from: activeElementIndex,
                to: nextElementIndex
              })
            }, 0)
          })

        Util.emulateTransitionEnd(activeElement, TRANSITION_DURATION)
      } else {
        activeElement.classList.remove(ClassName.ACTIVE)
        nextElement.classList.add(ClassName.ACTIVE)

        this._isSliding = false
        EventHandler.trigger(this._element, Event.SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        })
      }

      if (isCycling) {
        this.cycle()
      }
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = Data.getData(this, DATA_KEY)
        let _config = {
          ...Default,
          ...Data.getData(this, DATA_KEY)
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
          Data.setData(this, DATA_KEY, data)
        }

        if (typeof config === 'number') {
          data.to(config)
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError(`No method named "${action}"`)
          }
          data[action]()
        } else if (_config.interval) {
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

      const target = SelectorEngine.findOne(selector)

      if (!target || !target.classList.contains(ClassName.CAROUSEL)) {
        return
      }

      const config = {
        ...Util.getDataAttributes(target),
        ...Util.getDataAttributes(this)
      }
      const slideIndex = this.getAttribute('data-slide-to')

      if (slideIndex) {
        config.interval = false
      }

      Carousel._jQueryInterface.call($(target), config)

      if (slideIndex) {
        Data.getData(target, DATA_KEY).to(slideIndex)
      }

      event.preventDefault()
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler
    .on(document, Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler)

  EventHandler.on(window, Event.LOAD_DATA_API, () => {
    const carousels = Util.makeArray(SelectorEngine.find(Selector.DATA_RIDE))
    for (let i = 0; i < carousels.length; i++) {
      Carousel._jQueryInterface.call($(carousels[i]), Data.getData(carousels[i], DATA_KEY))
    }
  })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Carousel._jQueryInterface
  $.fn[NAME].Constructor = Carousel
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Carousel._jQueryInterface
  }

  return Carousel
})()

export default Carousel
