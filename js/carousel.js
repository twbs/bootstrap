/** =======================================================================
 * Bootstrap: carousel.js v4.0.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's carousel. A slideshow component for cycling
 * through elements, like a carousel. Nested carousels are not supported.
 *
 * Public Methods & Properties:
 *
 *   + $.carousel
 *   + $.carousel.noConflict
 *   + $.carousel.Constructor
 *   + $.carousel.Constructor.VERSION
 *   + $.carousel.Constructor.Defaults
 *   + $.carousel.Constructor.Defaults.interval
 *   + $.carousel.Constructor.Defaults.pause
 *   + $.carousel.Constructor.Defaults.wrap
 *   + $.carousel.Constructor.Defaults.keyboard
 *   + $.carousel.Constructor.Defaults.slide
 *   + $.carousel.Constructor.prototype.next
 *   + $.carousel.Constructor.prototype.prev
 *   + $.carousel.Constructor.prototype.pause
 *   + $.carousel.Constructor.prototype.cycle
 *
 * ========================================================================
 */

'use strict';


/**
 * Our carousel class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
var Carousel = function (element, opt_config) {

  /** @private {Element} */
  this._element = $(element)[0]

  /** @private {Element} */
  this._indicatorsElement = $(this._element).find(Carousel._Selector.INDICATORS)[0]

  /** @private {?Object} */
  this._config = opt_config || null

  /** @private {boolean} */
  this._isPaused = false

  /** @private {boolean} */
  this._isSliding = false

  /** @private {?number} */
  this._interval = null

  /** @private {?Element} */
  this._activeElement = null

  /** @private {?Array} */
  this._items = null

  this._addEventListeners()

}


/**
 * @const
 * @type {string}
 */
Carousel['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Carousel['Defaults'] = {
  'interval' : 5000,
  'pause'    : 'hover',
  'wrap'     : true,
  'keyboard' : true,
  'slide'    : false
}


/**
 * @const
 * @type {string}
 * @private
 */
Carousel._NAME  = 'carousel'


/**
 * @const
 * @type {string}
 * @private
 */
Carousel._DATA_KEY = 'bs.carousel'


/**
 * @const
 * @type {number}
 * @private
 */
Carousel._TRANSITION_DURATION = 600


/**
 * @const
 * @enum {string}
 * @private
 */
Carousel._Direction = {
  NEXT     : 'next',
  PREVIOUS : 'prev'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Carousel._Event = {
  SLIDE : 'slide.bs.carousel',
  SLID  : 'slid.bs.carousel'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Carousel._ClassName = {
  CAROUSEL : 'carousel',
  ACTIVE   : 'active',
  SLIDE    : 'slide',
  RIGHT    : 'right',
  LEFT     : 'left',
  ITEM     : 'carousel-item'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Carousel._Selector = {
  ACTIVE      : '.active',
  ACTIVE_ITEM : '.active.carousel-item',
  ITEM        : '.carousel-item',
  NEXT_PREV   : '.next, .prev',
  INDICATORS  : '.carousel-indicators'
}


/**
 * @const
 * @type {Function}
 * @private
 */
Carousel._JQUERY_NO_CONFLICT = $.fn[Carousel._NAME]


/**
 * @param {Object=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Carousel._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(Carousel._DATA_KEY)
    var config = $.extend({}, Carousel['Defaults'], $(this).data(), typeof opt_config == 'object' && opt_config)
    var action = typeof opt_config == 'string' ? opt_config : config.slide

    if (!data) {
      data = new Carousel(this, config)
      $(this).data(Carousel._DATA_KEY, data)
    }

    if (typeof opt_config == 'number') {
      data.to(opt_config)

    } else if (action) {
      data[action]()

    } else if (config.interval) {
      data['pause']()
      data['cycle']()
    }
  })
}


/**
 * Click handler for data api
 * @param {Event} event
 * @this {Element}
 * @private
 */
Carousel._dataApiClickHandler = function (event) {
  var selector = Bootstrap.getSelectorFromElement(this)

  if (!selector) {
    return
  }

  var target = $(selector)[0]

  if (!target || !$(target).hasClass(Carousel._ClassName.CAROUSEL)) {
    return
  }

  var config = $.extend({}, $(target).data(), $(this).data())

  var slideIndex = this.getAttribute('data-slide-to')
  if (slideIndex) {
    config.interval = false
  }

  Carousel._jQueryInterface.call($(target), config)

  if (slideIndex) {
    $(target).data(Carousel._DATA_KEY).to(slideIndex)
  }

  event.preventDefault()
}


/**
 * Advance the carousel to the next slide
 */
Carousel.prototype['next'] = function () {
  if (!this._isSliding) {
    this._slide(Carousel._Direction.NEXT)
  }
}


/**
 * Return the carousel to the previous slide
 */
Carousel.prototype['prev'] = function () {
  if (!this._isSliding) {
    this._slide(Carousel._Direction.PREVIOUS)
  }
}


/**
 * Pause the carousel cycle
 * @param {Event=} opt_event
 */
Carousel.prototype['pause'] = function (opt_event) {
  if (!opt_event) {
    this._isPaused = true
  }

  if ($(this._element).find(Carousel._Selector.NEXT_PREV)[0] && Bootstrap.transition) {
    $(this._element).trigger(Bootstrap.transition.end)
    this['cycle'](true)
  }

  clearInterval(this._interval)
  this._interval = null
}


/**
 * Cycle to the next carousel item
 * @param {Event|boolean=} opt_event
 */
Carousel.prototype['cycle'] = function (opt_event) {
  if (!opt_event) {
    this._isPaused = false
  }

  if (this._interval) {
    clearInterval(this._interval)
    this._interval = null
  }

  if (this._config['interval'] && !this._isPaused) {
    this._interval = setInterval(this['next'].bind(this), this._config['interval'])
  }
}


/**
 * @return {Object}
 */
Carousel.prototype['getConfig'] = function () {
  return this._config
}


/**
 * Move active carousel item to specified index
 * @param {number} index
 */
Carousel.prototype.to = function (index) {
  this._activeElement = $(this._element).find(Carousel._Selector.ACTIVE_ITEM)[0]

  var activeIndex = this._getItemIndex(this._activeElement)

  if (index > (this._items.length - 1) || index < 0) {
    return
  }

  if (this._isSliding) {
    $(this._element).one(Carousel._Event.SLID, function () { this.to(index) }.bind(this))
    return
  }

  if (activeIndex == index) {
    this['pause']()
    this['cycle']()
    return
  }

  var direction = index > activeIndex ?
    Carousel._Direction.NEXT :
    Carousel._Direction.PREVIOUS

  this._slide(direction, this._items[index])
}


/**
 * Add event listeners to root element
 * @private
 */
Carousel.prototype._addEventListeners = function () {
  if (this._config['keyboard']) {
    $(this._element).on('keydown.bs.carousel', this._keydown.bind(this))
  }

  if (this._config['pause'] == 'hover' && !('ontouchstart' in document.documentElement)) {
    $(this._element)
      .on('mouseenter.bs.carousel', this['pause'].bind(this))
      .on('mouseleave.bs.carousel', this['cycle'].bind(this))
  }
}


/**
 * Keydown handler
 * @param {Event} event
 * @private
 */
Carousel.prototype._keydown = function (event) {
  event.preventDefault()

  if (/input|textarea/i.test(event.target.tagName)) return

  switch (event.which) {
    case 37: this['prev'](); break
    case 39: this['next'](); break
    default: return
  }
}


/**
 * Get item index
 * @param {Element} element
 * @return {number}
 * @private
 */
Carousel.prototype._getItemIndex = function (element) {
  this._items = $.makeArray($(element).parent().find(Carousel._Selector.ITEM))

  return this._items.indexOf(element)
}


/**
 * Get next displayed item based on direction
 * @param {Carousel._Direction} direction
 * @param {Element} activeElement
 * @return {Element}
 * @private
 */
Carousel.prototype._getItemByDirection = function (direction, activeElement) {
  var activeIndex   = this._getItemIndex(activeElement)
  var isGoingToWrap = (direction === Carousel._Direction.PREVIOUS && activeIndex === 0) ||
                      (direction === Carousel._Direction.NEXT && activeIndex == (this._items.length - 1))

  if (isGoingToWrap && !this._config['wrap']) {
    return activeElement
  }

  var delta     = direction == Carousel._Direction.PREVIOUS ? -1 : 1
  var itemIndex = (activeIndex + delta) % this._items.length

  return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex]
}


/**
 * Trigger slide event on element
 * @param {Element} relatedTarget
 * @param {Carousel._ClassName} directionalClassname
 * @return {$.Event}
 * @private
 */
Carousel.prototype._triggerSlideEvent = function (relatedTarget, directionalClassname) {
  var slideEvent = $.Event(Carousel._Event.SLIDE, {
    relatedTarget: relatedTarget,
    direction: directionalClassname
  })

  $(this._element).trigger(slideEvent)

  return slideEvent
}


/**
 * Set the active indicator if available
 * @param {Element} element
 * @private
 */
Carousel.prototype._setActiveIndicatorElement = function (element) {
  if (this._indicatorsElement) {
    $(this._indicatorsElement)
      .find(Carousel._Selector.ACTIVE)
      .removeClass(Carousel._ClassName.ACTIVE)

    var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)]
    if (nextIndicator) {
      $(nextIndicator).addClass(Carousel._ClassName.ACTIVE)
    }
  }
}


/**
 * Slide the carousel element in a direction
 * @param {Carousel._Direction} direction
 * @param {Element=} opt_nextElement
 */
Carousel.prototype._slide = function (direction, opt_nextElement) {
  var activeElement = $(this._element).find(Carousel._Selector.ACTIVE_ITEM)[0]
  var nextElement   = opt_nextElement || activeElement && this._getItemByDirection(direction, activeElement)

  var isCycling = !!this._interval

  var directionalClassName = direction == Carousel._Direction.NEXT ?
    Carousel._ClassName.LEFT :
    Carousel._ClassName.RIGHT

  if (nextElement && $(nextElement).hasClass(Carousel._ClassName.ACTIVE)) {
    this._isSliding = false
    return
  }

  var slideEvent = this._triggerSlideEvent(nextElement, directionalClassName)
  if (slideEvent.isDefaultPrevented()) {
    return
  }

  if (!activeElement || !nextElement) {
    // some weirdness is happening, so we bail (maybe throw exception here alerting user that they're dom is off
    return
  }

  this._isSliding = true

  if (isCycling) {
    this['pause']()
  }

  this._setActiveIndicatorElement(nextElement)

  var slidEvent = $.Event(Carousel._Event.SLID, { relatedTarget: nextElement, direction: directionalClassName })

  if (Bootstrap.transition && $(this._element).hasClass(Carousel._ClassName.SLIDE)) {
    $(nextElement).addClass(direction)

    Bootstrap.reflow(nextElement)

    $(activeElement).addClass(directionalClassName)
    $(nextElement).addClass(directionalClassName)

    $(activeElement)
      .one(Bootstrap.TRANSITION_END, function () {
        $(nextElement)
          .removeClass(directionalClassName)
          .removeClass(direction)

        $(nextElement).addClass(Carousel._ClassName.ACTIVE)

        $(activeElement)
          .removeClass(Carousel._ClassName.ACTIVE)
          .removeClass(direction)
          .removeClass(directionalClassName)

        this._isSliding = false

        setTimeout(function () {
          $(this._element).trigger(slidEvent)
        }.bind(this), 0)
      }.bind(this))
      .emulateTransitionEnd(Carousel._TRANSITION_DURATION)

  } else {
    $(activeElement).removeClass(Carousel._ClassName.ACTIVE)
    $(nextElement).addClass(Carousel._ClassName.ACTIVE)

    this._isSliding = false
    $(this._element).trigger(slidEvent)
  }

  if (isCycling) {
    this['cycle']()
  }
}


/**
 * ------------------------------------------------------------------------
 * jQuery Interface + noConflict implementaiton
 * ------------------------------------------------------------------------
 */

/**
 * @const
 * @type {Function}
 */
$.fn[Carousel._NAME] = Carousel._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Carousel._NAME]['Constructor'] = Carousel


/**
 * @const
 * @type {Function}
 */
$.fn[Carousel._NAME]['noConflict'] = function () {
  $.fn[Carousel._NAME] = Carousel._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', Carousel._dataApiClickHandler)

$(window).on('load', function () {
  $('[data-ride="carousel"]').each(function () {
    var $carousel = $(this)
    Carousel._jQueryInterface.call($carousel, /** @type {Object} */ ($carousel.data()))
  })
})
