/*!
 * Bootstrap v4.0.0-alpha (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/** =======================================================================
 * Bootstrap: util.js v4.0.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's private util helper. Adds private util
 * helpers for things like accesibility and transitions. These methods are
 * shared across all bootstrap plugins.
 * ========================================================================
 */

'use strict';


/**
 * @type {Object}
 */
var Bootstrap = {}


/**
 * @const
 * @type {string}
 */
Bootstrap.TRANSITION_END = 'bsTransitionEnd'


/**
 * @const
 * @type {Object}
 */
Bootstrap.TransitionEndEvent = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd otransitionend',
  'transition'       : 'transitionend'
}


/**
 * @param {Function} childConstructor
 * @param {Function} parentConstructor
 */
Bootstrap.inherits = function(childConstructor, parentConstructor) {
  /** @constructor */
  function tempConstructor() {}
  tempConstructor.prototype = parentConstructor.prototype
  childConstructor.prototype = new tempConstructor()
  /** @override */
  childConstructor.prototype.constructor = childConstructor
}


/**
 * @param {Element} element
 * @return {string|null}
 */
Bootstrap.getSelectorFromElement = function (element) {
  var selector = element.getAttribute('data-target')

  if (!selector) {
    selector = element.getAttribute('href') || ''
    selector = /^#[a-z]/i.test(selector) ? selector : null
  }

  return selector
}


/**
 * @param {string} prefix
 * @return {string}
 */
Bootstrap.getUID = function (prefix) {
  do prefix += ~~(Math.random() * 1000000)
  while (document.getElementById(prefix))
  return prefix
}


/**
 * @return {Object}
 */
Bootstrap.getSpecialTransitionEndEvent = function () {
  return {
    bindType: Bootstrap.transition.end,
    delegateType: Bootstrap.transition.end,
    handle: /** @param {jQuery.Event} event */ (function (event) {
      if ($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments)
      }
    })
  }
}


/**
 * @param {Element} element
 */
Bootstrap.reflow = function (element) {
  new Function('bs',"return bs")(element.offsetHeight)
}


/**
 * @return {Object|boolean}
 */
Bootstrap.transitionEndTest = function () {
  if (window['QUnit']) {
    return false
  }

  var el = document.createElement('bootstrap')
  for (var name in Bootstrap.TransitionEndEvent) {
    if (el.style[name] !== undefined) {
      return { end: Bootstrap.TransitionEndEvent[name] }
    }
  }
  return false
}


/**
 * @param {number} duration
 * @this {Element}
 * @return {Object}
 */
Bootstrap.transitionEndEmulator = function (duration) {
  var called = false

  $(this).one(Bootstrap.TRANSITION_END, function () {
    called = true
  })

  var callback = function () {
    if (!called) {
      $(this).trigger(Bootstrap.transition.end)
    }
  }.bind(this)

  setTimeout(callback, duration)

  return this
}


/**
 * ------------------------------------------------------------------------
 * jQuery Interface
 * ------------------------------------------------------------------------
 */

$.fn.emulateTransitionEnd = Bootstrap.transitionEndEmulator

$(function () {
  Bootstrap.transition = Bootstrap.transitionEndTest()

  if (!Bootstrap.transition) {
    return
  }

  $.event.special[Bootstrap.TRANSITION_END] = Bootstrap.getSpecialTransitionEndEvent()
})

$(document).on('mq4hsChange', function (e) {
  $(document.documentElement).toggleClass('bs-true-hover', e.trueHover)
})

/*!
 * mq4-hover-shim v0.1.0
 * https://github.com/twbs/mq4-hover-shim
 * Copyright (c) 2014-2015 Christopher Rebert
 * Licensed under the MIT License (https://github.com/twbs/mq4-hover-shim/blob/master/LICENSE).
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mq4HoverShim=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };




/**
* Does this UA's primary pointer support true hovering
* OR does the UA at least not try to quirkily emulate hovering,
* such that :hover CSS styles are appropriate?
* Essentially tries to shim the `@media (hover: hover)` CSS media query feature.
* @public
* @returns {boolean}
* @since 0.0.1
*/
exports.supportsTrueHover = supportsTrueHover;
/*eslint-env browser */
/*eslint no-var:2*/
/* jshint browser: true, esnext: true */
/* jshint -W080 */
/**
* @module mq4HoverShim
* @requires jquery
*/
var $ = (function () {
    try {
        var jQuery = _interopRequireWildcard(require("jquery"));

        return jQuery;
    } catch (importErr) {
        var globaljQuery = window.$ || window.jQuery || window.Zepto;
        if (!globaljQuery) {
            throw new Error("mq4HoverShim needs jQuery (or similar)");
        }
        return globaljQuery;
    }
})();

/** @type {boolean|undefined} */
var canTrulyHover = undefined;

/**
* @private
* @fires mq4HoverShim#mq4hsChange
*/
function triggerEvent() {
    $(document).trigger($.Event("mq4hsChange", { bubbles: false, trueHover: canTrulyHover }));
}

// IIFE so we can use `return`s to avoid deeply-nested if-s
(function () {
    if (!window.matchMedia) {
        // Opera Mini, IE<=9, Android<=2.3, ancient, or obscure; per http://caniuse.com/#feat=matchmedia

        // Opera Mini, Android, and IE Mobile don't support true hovering, so they're what we'll check for.
        // Other browsers are either:
        // (a) obscure
        // (b) touch-based but old enough not to attempt to emulate hovering
        // (c) old desktop browsers that do support true hovering

        // Explanation of this UA regex:
        // IE Mobile <9 seems to always have "Windows CE", "Windows Phone", or "IEMobile" in its UA string.
        // IE Mobile 9 in desktop view doesn't include "IEMobile" or "Windows Phone" in the UA string,
        // but it instead includes "XBLWP7" and/or "ZuneWP7".
        canTrulyHover = !/Opera Mini|Android|IEMobile|Windows (Phone|CE)|(XBL|Zune)WP7/.test(navigator.userAgent);

        // Since there won't be any event handlers to fire our events, do the one-and-only firing of it here and now.
        triggerEvent();
        return;
    }

    // CSSWG Media Queries Level 4 draft
    //     http://drafts.csswg.org/mediaqueries/#hover
    var HOVER_NONE = "(hover: none),(-moz-hover: none),(-ms-hover: none),(-webkit-hover: none)";
    var HOVER_ON_DEMAND = "(hover: on-demand),(-moz-hover: on-demand),(-ms-hover: on-demand),(-webkit-hover: on-demand)";
    var HOVER_HOVER = "(hover: hover),(-moz-hover: hover),(-ms-hover: hover),(-webkit-hover: hover)";
    if (window.matchMedia("" + HOVER_NONE + "," + HOVER_ON_DEMAND + "," + HOVER_HOVER).matches) {
        // Browser understands the `hover` media feature
        var hoverCallback = function (mql) {
            var doesMatch = mql.matches;
            if (doesMatch !== canTrulyHover) {
                canTrulyHover = doesMatch;
                triggerEvent();
            }
        };
        var atHoverQuery = window.matchMedia(HOVER_HOVER);
        atHoverQuery.addListener(hoverCallback);
        hoverCallback(atHoverQuery);
        return;
    }

    // Check for touch support instead.
    // Touch generally implies that hovering is merely emulated,
    // which doesn't count as true hovering support for our purposes
    // due to the quirkiness of the emulation (e.g. :hover being sticky).

    // W3C Pointer Events PR, 16 December 2014
    //     http://www.w3.org/TR/2014/PR-pointerevents-20141216/
    // Prefixed in IE10, per http://caniuse.com/#feat=pointer
    if (window.PointerEvent || window.MSPointerEvent) {
        // Browser supports Pointer Events

        // Browser supports touch if it has touch points
        /* jshint -W018 */
        canTrulyHover = !((window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) > 0);
        /* jshint +W018 */
        triggerEvent();
        return;
    }

    // Mozilla's -moz-touch-enabled
    //     https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries#-moz-touch-enabled
    var touchEnabledQuery = window.matchMedia("(touch-enabled),(-moz-touch-enabled),(-ms-touch-enabled),(-webkit-touch-enabled)");
    if (touchEnabledQuery.matches) {
        canTrulyHover = false;
        triggerEvent();
        return;
    }

    // W3C Touch Events REC, 10 October 2013
    //     http://www.w3.org/TR/2013/REC-touch-events-20131010/
    if ("ontouchstart" in window) {
        canTrulyHover = false;
        triggerEvent();
        return;
    }

    // UA's pointer is non-touch and thus likely either supports true hovering or at least does not try to emulate it.
    canTrulyHover = true;
    triggerEvent();
})();function supportsTrueHover() {
    return canTrulyHover;
}
exports.__esModule = true;
},{"jquery":undefined}]},{},[1])(1)
});
/** =======================================================================
 * Bootstrap: alert.js v4.0.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's generic alert component. Add dismiss
 * functionality to all alert messages with this plugin.
 *
 * Public Methods & Properties:
 *
 *   + $.alert
 *   + $.alert.noConflict
 *   + $.alert.Constructor
 *   + $.alert.Constructor.VERSION
 *   + $.alert.Constructor.prototype.close
 *
 * ========================================================================
 */

'use strict';


/**
 * Our Alert class.
 * @param {Element=} opt_element
 * @constructor
 */
var Alert = function (opt_element) {
  if (opt_element) {
    $(opt_element).on('click', Alert._DISMISS_SELECTOR, Alert._handleDismiss(this))
  }
}


/**
 * @const
 * @type {string}
 */
Alert['VERSION'] = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Alert._NAME = 'alert'


/**
 * @const
 * @type {string}
 * @private
 */
Alert._DATA_KEY = 'bs.alert'


/**
 * @const
 * @type {string}
 * @private
 */
Alert._DISMISS_SELECTOR = '[data-dismiss="alert"]'


/**
 * @const
 * @type {number}
 * @private
 */
Alert._TRANSITION_DURATION = 150


/**
 * @const
 * @type {Function}
 * @private
 */
Alert._JQUERY_NO_CONFLICT = $.fn[Alert._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Alert._Event = {
  CLOSE  : 'close.bs.alert',
  CLOSED : 'closed.bs.alert'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Alert._ClassName = {
  ALERT : 'alert',
  FADE  : 'fade',
  IN    : 'in'
}


/**
 * Provides the jQuery Interface for the alert component.
 * @param {string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Alert._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var $this = $(this)
    var data  = $this.data(Alert._DATA_KEY)

    if (!data) {
      data = new Alert(this)
      $this.data(Alert._DATA_KEY, data)
    }

    if (opt_config === 'close') {
      data[opt_config](this)
    }
  })
}


/**
 * Close the alert component
 * @param {Alert} alertInstance
 * @return {Function}
 * @private
 */
Alert._handleDismiss = function (alertInstance) {
  return function (event) {
    if (event) {
      event.preventDefault()
    }

    alertInstance['close'](this)
  }
}


/**
 * Close the alert component
 * @param {Element} element
 */
Alert.prototype['close'] = function (element) {
  var rootElement = this._getRootElement(element)
  var customEvent = this._triggerCloseEvent(rootElement)

  if (customEvent.isDefaultPrevented()) return

  this._removeElement(rootElement)
}


/**
 * Tries to get the alert's root element
 * @return {Element}
 * @private
 */
Alert.prototype._getRootElement = function (element) {
  var parent   = false
  var selector = Bootstrap.getSelectorFromElement(element)

  if (selector) {
    parent = $(selector)[0]
  }

  if (!parent) {
    parent = $(element).closest('.' + Alert._ClassName.ALERT)[0]
  }

  return parent
}


/**
 * Trigger close event on element
 * @return {$.Event}
 * @private
 */
Alert.prototype._triggerCloseEvent = function (element) {
  var closeEvent = $.Event(Alert._Event.CLOSE)
  $(element).trigger(closeEvent)
  return closeEvent
}


/**
 * Trigger closed event and remove element from dom
 * @private
 */
Alert.prototype._removeElement = function (element) {
  $(element).removeClass(Alert._ClassName.IN)

  if (!Bootstrap.transition || !$(element).hasClass(Alert._ClassName.FADE)) {
    this._destroyElement(element)
    return
  }

  $(element)
    .one(Bootstrap.TRANSITION_END, this._destroyElement.bind(this, element))
    .emulateTransitionEnd(Alert._TRANSITION_DURATION)
}


/**
 * clean up any lingering jquery data and kill element
 * @private
 */
Alert.prototype._destroyElement = function (element) {
  $(element)
    .detach()
    .trigger(Alert._Event.CLOSED)
    .remove()
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
$.fn[Alert._NAME] = Alert._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Alert._NAME]['Constructor'] = Alert


/**
 * @return {Function}
 */
$.fn[Alert._NAME]['noConflict'] = function () {
  $.fn[Alert._NAME] = Alert._JQUERY_NO_CONFLICT
  return Alert._jQueryInterface
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.alert.data-api', Alert._DISMISS_SELECTOR, Alert._handleDismiss(new Alert))

/** =======================================================================
 * Bootstrap: button.js v4.0.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's generic button component.
 *
 * Note (@fat): Deprecated "setState" – imo, better solutions for managing a
 * buttons state should exist outside this plugin.
 *
 * Public Methods & Properties:
 *
 *   + $.button
 *   + $.button.noConflict
 *   + $.button.Constructor
 *   + $.button.Constructor.VERSION
 *   + $.button.Constructor.prototype.toggle
 *
 * ========================================================================
 */

'use strict';


/**
 * Our Button class.
 * @param {Element!} element
 * @constructor
 */
var Button = function (element) {

  /** @private {Element} */
  this._element = element

}


/**
 * @const
 * @type {string}
 */
Button['VERSION']  = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Button._NAME  = 'button'


/**
 * @const
 * @type {string}
 * @private
 */
Button._DATA_KEY = 'bs.button'


/**
 * @const
 * @type {Function}
 * @private
 */
Button._JQUERY_NO_CONFLICT = $.fn[Button._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Button._ClassName = {
  ACTIVE : 'active',
  BUTTON : 'btn',
  FOCUS  : 'focus'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Button._Selector = {
  DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
  DATA_TOGGLE        : '[data-toggle="buttons"]',
  INPUT              : 'input',
  ACTIVE             : '.active',
  BUTTON             : '.btn'
}


/**
 * Provides the jQuery Interface for the Button component.
 * @param {string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Button._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data  = $(this).data(Button._DATA_KEY)

    if (!data) {
      data = new Button(this)
      $(this).data(Button._DATA_KEY, data)
    }

    if (opt_config === 'toggle') {
      data[opt_config]()
    }
  })
}


/**
 * Toggle's the button active state
 */
Button.prototype['toggle'] = function () {
  var triggerChangeEvent = true
  var rootElement = $(this._element).closest(Button._Selector.DATA_TOGGLE)[0]

  if (rootElement) {
    var input = $(this._element).find(Button._Selector.INPUT)[0]
    if (input) {
      if (input.type == 'radio') {
        if (input.checked && $(this._element).hasClass(Button._ClassName.ACTIVE)) {
          triggerChangeEvent = false
        } else {
          var activeElement = $(rootElement).find(Button._Selector.ACTIVE)[0]
          if (activeElement) {
            $(activeElement).removeClass(Button._ClassName.ACTIVE)
          }
        }
      }

      if (triggerChangeEvent) {
        input.checked = !$(this._element).hasClass(Button._ClassName.ACTIVE)
        $(this._element).trigger('change')
      }
    }
  } else {
    this._element.setAttribute('aria-pressed', !$(this._element).hasClass(Button._ClassName.ACTIVE))
  }

  if (triggerChangeEvent) {
    $(this._element).toggleClass(Button._ClassName.ACTIVE)
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
$.fn[Button._NAME] = Button._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Button._NAME]['Constructor'] = Button


/**
 * @const
 * @type {Function}
 */
$.fn[Button._NAME]['noConflict'] = function () {
  $.fn[Button._NAME] = Button._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on('click.bs.button.data-api', Button._Selector.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault()

    var button = event.target

    if (!$(button).hasClass(Button._ClassName.BUTTON)) {
      button = $(button).closest(Button._Selector.BUTTON)
    }

    Button._jQueryInterface.call($(button), 'toggle')
  })
  .on('focus.bs.button.data-api blur.bs.button.data-api', Button._Selector.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Button._Selector.BUTTON)[0]
    $(button).toggleClass(Button._ClassName.FOCUS, /^focus(in)?$/.test(event.type))
  })

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

/** =======================================================================
 * Bootstrap: collapse.js v4.0.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's collapse plugin. Flexible support for
 * collapsible components like accordions and navigation.
 *
 * Public Methods & Properties:
 *
 *   + $.carousel
 *   + $.carousel.noConflict
 *   + $.carousel.Constructor
 *   + $.carousel.Constructor.VERSION
 *   + $.carousel.Constructor.Defaults
 *   + $.carousel.Constructor.Defaults.toggle
 *   + $.carousel.Constructor.Defaults.trigger
 *   + $.carousel.Constructor.Defaults.parent
 *   + $.carousel.Constructor.prototype.toggle
 *   + $.carousel.Constructor.prototype.show
 *   + $.carousel.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our collapse class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
var Collapse = function (element, opt_config) {

  /** @private {Element} */
  this._element  = element

  /** @private {Object} */
  this._config = $.extend({}, Collapse['Defaults'], opt_config)

  /** @private {Element} */
  this._trigger = typeof this._config['trigger'] == 'string' ?
    $(this._config['trigger'])[0] : this._config['trigger']

  /** @private {boolean} */
  this._isTransitioning = false

  /** @private {?Element} */
  this._parent = this._config['parent'] ? this._getParent() : null

  if (!this._config['parent']) {
    this._addAriaAndCollapsedClass(this._element, this._trigger)
  }

  if (this._config['toggle']) {
    this['toggle']()
  }

}


/**
 * @const
 * @type {string}
 */
Collapse['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Collapse['Defaults'] = {
  'toggle'  : true,
  'trigger' : '[data-toggle="collapse"]',
  'parent'  : null
}


/**
 * @const
 * @type {string}
 * @private
 */
Collapse._NAME = 'collapse'


/**
 * @const
 * @type {string}
 * @private
 */
Collapse._DATA_KEY = 'bs.collapse'


/**
 * @const
 * @type {number}
 * @private
 */
Collapse._TRANSITION_DURATION = 600


/**
 * @const
 * @type {Function}
 * @private
 */
Collapse._JQUERY_NO_CONFLICT = $.fn[Collapse._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Event = {
  SHOW   : 'show.bs.collapse',
  SHOWN  : 'shown.bs.collapse',
  HIDE   : 'hide.bs.collapse',
  HIDDEN : 'hidden.bs.collapse'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._ClassName = {
  IN         : 'in',
  COLLAPSE   : 'collapse',
  COLLAPSING : 'collapsing',
  COLLAPSED  : 'collapsed'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Dimension = {
  WIDTH  : 'width',
  HEIGHT : 'height'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Selector = {
  ACTIVES : '.panel > .in, .panel > .collapsing'
}


/**
 * Provides the jQuery Interface for the alert component.
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Collapse._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var $this   = $(this)
    var data    = $this.data(Collapse._DATA_KEY)
    var config = $.extend({}, Collapse['Defaults'], $this.data(), typeof opt_config == 'object' && opt_config)

    if (!data && config['toggle'] && opt_config == 'show') {
      config['toggle'] = false
    }

    if (!data) {
      data = new Collapse(this, config)
      $this.data(Collapse._DATA_KEY, data)
    }

    if (typeof opt_config == 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Function for getting target element from element
 * @return {Element}
 * @private
 */
Collapse._getTargetFromElement = function (element) {
  var selector = Bootstrap.getSelectorFromElement(element)

  return selector ? $(selector)[0] : null
}


/**
 * Toggles the collapse element based on the presence of the 'in' class
 */
Collapse.prototype['toggle'] = function () {
  if ($(this._element).hasClass(Collapse._ClassName.IN)) {
    this['hide']()
  } else {
    this['show']()
  }
}


/**
 * Show's the collapsing element
 */
Collapse.prototype['show'] = function () {
  if (this._isTransitioning || $(this._element).hasClass(Collapse._ClassName.IN)) {
    return
  }

  var activesData, actives

  if (this._parent) {
    actives = $.makeArray($(Collapse._Selector.ACTIVES))
    if (!actives.length) {
      actives = null
    }
  }

  if (actives) {
    activesData = $(actives).data(Collapse._DATA_KEY)
    if (activesData && activesData._isTransitioning) {
      return
    }
  }

  var startEvent = $.Event(Collapse._Event.SHOW)
  $(this._element).trigger(startEvent)
  if (startEvent.isDefaultPrevented()) {
    return
  }

  if (actives) {
    Collapse._jQueryInterface.call($(actives), 'hide')
    if (!activesData) {
      $(actives).data(Collapse._DATA_KEY, null)
    }
  }

  var dimension = this._getDimension()

  $(this._element)
    .removeClass(Collapse._ClassName.COLLAPSE)
    .addClass(Collapse._ClassName.COLLAPSING)

  this._element.style[dimension] = 0
  this._element.setAttribute('aria-expanded', true)

  if (this._trigger) {
    $(this._trigger).removeClass(Collapse._ClassName.COLLAPSED)
    this._trigger.setAttribute('aria-expanded', true)
  }

  this['setTransitioning'](true)

  var complete = function () {
    $(this._element)
      .removeClass(Collapse._ClassName.COLLAPSING)
      .addClass(Collapse._ClassName.COLLAPSE)
      .addClass(Collapse._ClassName.IN)

    this._element.style[dimension] = ''

    this['setTransitioning'](false)

    $(this._element).trigger(Collapse._Event.SHOWN)
  }.bind(this)

  if (!Bootstrap.transition) {
    complete()
    return
  }

  var scrollSize = 'scroll' + (dimension[0].toUpperCase() + dimension.slice(1))

  $(this._element)
    .one(Bootstrap.TRANSITION_END, complete)
    .emulateTransitionEnd(Collapse._TRANSITION_DURATION)

  this._element.style[dimension] = this._element[scrollSize] + 'px'
}


/**
 * Hides's the collapsing element
 */
Collapse.prototype['hide'] = function () {
  if (this._isTransitioning || !$(this._element).hasClass(Collapse._ClassName.IN)) {
    return
  }

  var startEvent = $.Event(Collapse._Event.HIDE)
  $(this._element).trigger(startEvent)
  if (startEvent.isDefaultPrevented()) return

  var dimension = this._getDimension()
  var offsetDimension = dimension === Collapse._Dimension.WIDTH ?
    'offsetWidth' : 'offsetHeight'

  this._element.style[dimension] = this._element[offsetDimension] + 'px'

  Bootstrap.reflow(this._element)

  $(this._element)
    .addClass(Collapse._ClassName.COLLAPSING)
    .removeClass(Collapse._ClassName.COLLAPSE)
    .removeClass(Collapse._ClassName.IN)

  this._element.setAttribute('aria-expanded', false)

  if (this._trigger) {
    $(this._trigger).addClass(Collapse._ClassName.COLLAPSED)
    this._trigger.setAttribute('aria-expanded', false)
  }

  this['setTransitioning'](true)

  var complete = function () {
    this['setTransitioning'](false)
    $(this._element)
      .removeClass(Collapse._ClassName.COLLAPSING)
      .addClass(Collapse._ClassName.COLLAPSE)
      .trigger(Collapse._Event.HIDDEN)

  }.bind(this)

  this._element.style[dimension] = 0

  if (!Bootstrap.transition) {
    return complete()
  }

  $(this._element)
    .one(Bootstrap.TRANSITION_END, complete)
    .emulateTransitionEnd(Collapse._TRANSITION_DURATION)
}



/**
 * @param {boolean} isTransitioning
 */
Collapse.prototype['setTransitioning'] = function (isTransitioning) {
  this._isTransitioning = isTransitioning
}


/**
 * Returns the collapsing dimension
 * @return {string}
 * @private
 */
Collapse.prototype._getDimension = function () {
  var hasWidth = $(this._element).hasClass(Collapse._Dimension.WIDTH)
  return hasWidth ? Collapse._Dimension.WIDTH : Collapse._Dimension.HEIGHT
}


/**
 * Returns the parent element
 * @return {Element}
 * @private
 */
Collapse.prototype._getParent = function () {
  var selector = '[data-toggle="collapse"][data-parent="' + this._config['parent'] + '"]'
  var parent = $(this._config['parent'])[0]
  var elements = /** @type {Array.<Element>} */ ($.makeArray($(parent).find(selector)))

  for (var i = 0; i < elements.length; i++) {
    this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(elements[i]), elements[i])
  }

  return parent
}


/**
 * Returns the parent element
 * @param {Element} element
 * @param {Element} trigger
 * @private
 */
Collapse.prototype._addAriaAndCollapsedClass = function (element, trigger) {
  if (element) {
    var isOpen = $(element).hasClass(Collapse._ClassName.IN)
    element.setAttribute('aria-expanded', isOpen)

    if (trigger) {
      trigger.setAttribute('aria-expanded', isOpen)
      $(trigger).toggleClass(Collapse._ClassName.COLLAPSED, !isOpen)
    }
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
$.fn[Collapse._NAME] = Collapse._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME]['Constructor'] = Collapse


/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME]['noConflict'] = function () {
  $.fn[Collapse._NAME] = Collapse._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (event) {
  event.preventDefault()

  var target = Collapse._getTargetFromElement(this)

  var data = $(target).data(Collapse._DATA_KEY)
  var config = data ? 'toggle' : $.extend({}, $(this).data(), { trigger: this })

  Collapse._jQueryInterface.call($(target), config)
})

/** =======================================================================
 * Bootstrap: dropdown.js v4.0.0
 * http://getbootstrap.com/javascript/#dropdown
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Add dropdown menus to nearly anything with this simple
 * plugin, including the navbar, tabs, and pills.
 *
 * Public Methods & Properties:
 *
 *   + $.dropdown
 *   + $.dropdown.noConflict
 *   + $.dropdown.Constructor
 *   + $.dropdown.Constructor.VERSION
 *   + $.dropdown.Constructor.prototype.toggle
 *
 * ========================================================================
 */

'use strict';


/**
 * Our dropdown class.
 * @param {Element!} element
 * @constructor
 */
var Dropdown = function (element) {
  $(element).on('click.bs.dropdown', this['toggle'])
}


/**
 * @const
 * @type {string}
 */
Dropdown['VERSION'] = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Dropdown._NAME = 'dropdown'


/**
 * @const
 * @type {string}
 * @private
 */
Dropdown._DATA_KEY = 'bs.dropdown'


/**
 * @const
 * @type {Function}
 * @private
 */
Dropdown._JQUERY_NO_CONFLICT = $.fn[Dropdown._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Dropdown._Event = {
  HIDE   : 'hide.bs.dropdown',
  HIDDEN : 'hidden.bs.dropdown',
  SHOW   : 'show.bs.dropdown',
  SHOWN  : 'shown.bs.dropdown'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Dropdown._ClassName = {
  BACKDROP : 'dropdown-backdrop',
  DISABLED : 'disabled',
  OPEN     : 'open'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Dropdown._Selector = {
  BACKDROP      : '.dropdown-backdrop',
  DATA_TOGGLE   : '[data-toggle="dropdown"]',
  FORM_CHILD    : '.dropdown form',
  ROLE_MENU     : '[role="menu"]',
  ROLE_LISTBOX  : '[role="listbox"]',
  NAVBAR_NAV    : '.navbar-nav',
  VISIBLE_ITEMS : '[role="menu"] li:not(.divider) a, [role="listbox"] li:not(.divider) a'
}


/**
 * Provides the jQuery Interface for the alert component.
 * @param {string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Dropdown._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data  = $(this).data(Dropdown._DATA_KEY)

    if (!data) {
      $(this).data(Dropdown._DATA_KEY, (data = new Dropdown(this)))
    }

    if (typeof opt_config === 'string') {
      data[opt_config].call(this)
    }
  })
}


/**
 * @param {Event=} opt_event
 * @private
 */
Dropdown._clearMenus = function (opt_event) {
  if (opt_event && opt_event.which == 3) {
    return
  }

  var backdrop = $(Dropdown._Selector.BACKDROP)[0]
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop)
  }

  var toggles = /** @type {Array.<Element>} */ ($.makeArray($(Dropdown._Selector.DATA_TOGGLE)))

  for (var i = 0; i < toggles.length; i++) {
    var parent = Dropdown._getParentFromElement(toggles[i])
    var relatedTarget = { 'relatedTarget': toggles[i] }

    if (!$(parent).hasClass(Dropdown._ClassName.OPEN)) {
      continue
    }

    var hideEvent = $.Event(Dropdown._Event.HIDE, relatedTarget)
    $(parent).trigger(hideEvent)
    if (hideEvent.isDefaultPrevented()) {
      continue
    }

    toggles[i].setAttribute('aria-expanded', 'false')

    $(parent)
      .removeClass(Dropdown._ClassName.OPEN)
      .trigger(Dropdown._Event.HIDDEN, relatedTarget)
  }
}


/**
 * @param {Element} element
 * @return {Element}
 * @private
 */
Dropdown._getParentFromElement = function (element) {
  var selector = Bootstrap.getSelectorFromElement(element)

  if (selector) {
    var parent = $(selector)[0]
  }

  return /** @type {Element} */ (parent || element.parentNode)
}


/**
 * @param {Event} event
 * @this {Element}
 * @private
 */
Dropdown._dataApiKeydownHandler = function (event) {
  if (!/(38|40|27|32)/.test(event.which) || /input|textarea/i.test(event.target.tagName)) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  if (this.disabled || $(this).hasClass(Dropdown._ClassName.DISABLED)) {
    return
  }

  var parent  = Dropdown._getParentFromElement(this)
  var isActive = $(parent).hasClass(Dropdown._ClassName.OPEN)

  if ((!isActive && event.which != 27) || (isActive && event.which == 27)) {
    if (event.which == 27) {
      var toggle = $(parent).find(Dropdown._Selector.DATA_TOGGLE)[0]
      $(toggle).trigger('focus')
    }
    $(this).trigger('click')
    return
  }

  var items = $.makeArray($(Dropdown._Selector.VISIBLE_ITEMS))

  items = items.filter(function (item) {
    return item.offsetWidth || item.offsetHeight
  })

  if (!items.length) {
    return
  }

  var index = items.indexOf(event.target)

  if (event.which == 38 && index > 0)                index--                        // up
  if (event.which == 40 && index < items.length - 1) index++                        // down
  if (!~index)                                       index = 0

  items[index].focus()
}


/**
 * Toggles the dropdown
 * @this {Element}
 * @return {boolean|undefined}
 */
Dropdown.prototype['toggle'] = function () {
  if (this.disabled || $(this).hasClass(Dropdown._ClassName.DISABLED)) {
    return
  }

  var parent   = Dropdown._getParentFromElement(this)
  var isActive = $(parent).hasClass(Dropdown._ClassName.OPEN)

  Dropdown._clearMenus()

  if (isActive) {
    return false
  }

  if ('ontouchstart' in document.documentElement && !$(parent).closest(Dropdown._Selector.NAVBAR_NAV).length) {
    // if mobile we use a backdrop because click events don't delegate
    var dropdown       = document.createElement('div')
    dropdown.className = Dropdown._ClassName.BACKDROP
    this.parentNode.insertBefore(this, dropdown)
    $(dropdown).on('click', Dropdown._clearMenus)
  }

  var relatedTarget = { 'relatedTarget': this }
  var showEvent     = $.Event(Dropdown._Event.SHOW, relatedTarget)

  $(parent).trigger(showEvent)

  if (showEvent.isDefaultPrevented()) {
    return
  }

  this.focus()
  this.setAttribute('aria-expanded', 'true')

  $(parent).toggleClass(Dropdown._ClassName.OPEN)

  $(parent).trigger(Dropdown._Event.SHOWN, relatedTarget)

  return false
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
$.fn[Dropdown._NAME] = Dropdown._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Dropdown._NAME]['Constructor'] = Dropdown


/**
 * @const
 * @type {Function}
 */
$.fn[Dropdown._NAME]['noConflict'] = function () {
  $.fn[Dropdown._NAME] = Dropdown._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on('click.bs.dropdown.data-api',   Dropdown._clearMenus)
  .on('click.bs.dropdown.data-api',   Dropdown._Selector.FORM_CHILD,   function (e) { e.stopPropagation() })
  .on('click.bs.dropdown.data-api',   Dropdown._Selector.DATA_TOGGLE,  Dropdown.prototype['toggle'])
  .on('keydown.bs.dropdown.data-api', Dropdown._Selector.DATA_TOGGLE,  Dropdown._dataApiKeydownHandler)
  .on('keydown.bs.dropdown.data-api', Dropdown._Selector.ROLE_MENU,    Dropdown._dataApiKeydownHandler)
  .on('keydown.bs.dropdown.data-api', Dropdown._Selector.ROLE_LISTBOX, Dropdown._dataApiKeydownHandler)

/** =======================================================================
 * Bootstrap: modal.js v4.0.0
 * http://getbootstrap.com/javascript/#modal
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's modal plugin. Modals are streamlined, but
 * flexible, dialog prompts with the minimum required functionality and
 * smart defaults.
 *
 * Public Methods & Properties:
 *
 *   + $.modal
 *   + $.modal.noConflict
 *   + $.modal.Constructor
 *   + $.modal.Constructor.VERSION
 *   + $.modal.Constructor.Defaults
 *   + $.modal.Constructor.Defaults.backdrop
 *   + $.modal.Constructor.Defaults.keyboard
 *   + $.modal.Constructor.Defaults.show
 *   + $.modal.Constructor.prototype.toggle
 *   + $.modal.Constructor.prototype.show
 *   + $.modal.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our modal class.
 * @param {Element} element
 * @param {Object} config
 * @constructor
 */
var Modal = function (element, config) {

  /** @private {Object} */
  this._config = config

  /** @private {Element} */
  this._element = element

  /** @private {Element} */
  this._backdrop = null

  /** @private {boolean} */
  this._isShown = false

  /** @private {boolean} */
  this._isBodyOverflowing = false

  /** @private {number} */
  this._scrollbarWidth = 0

}


/**
 * @const
 * @type {string}
 */
Modal['VERSION']  = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Modal['Defaults'] = {
  'backdrop' : true,
  'keyboard' : true,
  'show'     : true
}


/**
 * @const
 * @type {string}
 * @private
 */
Modal._NAME = 'modal'


/**
 * @const
 * @type {string}
 * @private
 */
Modal._DATA_KEY = 'bs.modal'


/**
 * @const
 * @type {number}
 * @private
 */
Modal._TRANSITION_DURATION = 300


/**
 * @const
 * @type {number}
 * @private
 */
Modal._BACKDROP_TRANSITION_DURATION = 150


/**
 * @const
 * @type {Function}
 * @private
 */
Modal._JQUERY_NO_CONFLICT = $.fn[Modal._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Modal._Event = {
  HIDE   : 'hide.bs.modal',
  HIDDEN : 'hidden.bs.modal',
  SHOW   : 'show.bs.modal',
  SHOWN  : 'shown.bs.modal'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Modal._ClassName = {
  BACKDROP : 'modal-backdrop',
  OPEN     : 'modal-open',
  FADE     : 'fade',
  IN       : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Modal._Selector = {
  DIALOG             : '.modal-dialog',
  DATA_TOGGLE        : '[data-toggle="modal"]',
  DATA_DISMISS       : '[data-dismiss="modal"]',
  SCROLLBAR_MEASURER : 'modal-scrollbar-measure'
}



/**
 * Provides the jQuery Interface for the alert component.
 * @param {Object|string=} opt_config
 * @param {Element=} opt_relatedTarget
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Modal._jQueryInterface = function Plugin(opt_config, opt_relatedTarget) {
  return this.each(function () {
    var data   = $(this).data(Modal._DATA_KEY)
    var config = $.extend({}, Modal['Defaults'], $(this).data(), typeof opt_config == 'object' && opt_config)

    if (!data) {
      data = new Modal(this, config)
      $(this).data(Modal._DATA_KEY, data)
    }

    if (typeof opt_config == 'string') {
      data[opt_config](opt_relatedTarget)

    } else if (config['show']) {
      data['show'](opt_relatedTarget)
    }
  })
}


/**
 * @param {Element} relatedTarget
 */
Modal.prototype['toggle'] = function (relatedTarget) {
  return this._isShown ? this['hide']() : this['show'](relatedTarget)
}


/**
 * @param {Element} relatedTarget
 */
Modal.prototype['show'] = function (relatedTarget) {
  var showEvent = $.Event(Modal._Event.SHOW, { relatedTarget: relatedTarget })

  $(this._element).trigger(showEvent)

  if (this._isShown || showEvent.isDefaultPrevented()) {
    return
  }

  this._isShown = true

  this._checkScrollbar()
  this._setScrollbar()

  $(document.body).addClass(Modal._ClassName.OPEN)

  this._escape()
  this._resize()

  $(this._element).on('click.dismiss.bs.modal', Modal._Selector.DATA_DISMISS, this['hide'].bind(this))

  this._showBackdrop(this._showElement.bind(this, relatedTarget))
}


/**
 * @param {Event} event
 */
Modal.prototype['hide'] = function (event) {
  if (event) {
    event.preventDefault()
  }

  var hideEvent = $.Event(Modal._Event.HIDE)

  $(this._element).trigger(hideEvent)

  if (!this._isShown || hideEvent.isDefaultPrevented()) {
    return
  }

  this._isShown = false

  this._escape()
  this._resize()

  $(document).off('focusin.bs.modal')

  $(this._element).removeClass(Modal._ClassName.IN)
  this._element.setAttribute('aria-hidden', true)

  $(this._element).off('click.dismiss.bs.modal')

  if (Bootstrap.transition && $(this._element).hasClass(Modal._ClassName.FADE)) {
    $(this._element)
      .one(Bootstrap.TRANSITION_END, this._hideModal.bind(this))
      .emulateTransitionEnd(Modal._TRANSITION_DURATION)
  } else {
    this._hideModal()
  }
}


/**
 * @param {Element} relatedTarget
 * @private
 */
Modal.prototype._showElement = function (relatedTarget) {
  var transition = Bootstrap.transition && $(this._element).hasClass(Modal._ClassName.FADE)

  if (!this._element.parentNode || this._element.parentNode.nodeType != Node.ELEMENT_NODE) {
    document.body.appendChild(this._element) // don't move modals dom position
  }

  this._element.style.display = 'block'
  this._element.scrollTop = 0

  if (this._config['backdrop']) {
    this._adjustBackdrop()
  }

  if (transition) {
    Bootstrap.reflow(this._element)
  }

  $(this._element).addClass(Modal._ClassName.IN)
  this._element.setAttribute('aria-hidden', false)

  this._enforceFocus()

  var shownEvent = $.Event(Modal._Event.SHOWN, { relatedTarget: relatedTarget })

  var transitionComplete = function () {
    this._element.focus()
    $(this._element).trigger(shownEvent)
  }.bind(this)

  if (transition) {
    var dialog = $(this._element).find(Modal._Selector.DIALOG)[0]
    $(dialog)
      .one(Bootstrap.TRANSITION_END, transitionComplete)
      .emulateTransitionEnd(Modal._TRANSITION_DURATION)
  } else {
    transitionComplete()
  }
}



/**
 * @private
 */
Modal.prototype._enforceFocus = function () {
  $(document)
    .off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', function (e) {
      if (this._element !== e.target && !$(this._element).has(e.target).length) {
        this._element.focus()
      }
    }.bind(this))
}


/**
 * @private
 */
Modal.prototype._escape = function () {
  if (this._isShown && this._config['keyboard']) {
    $(this._element).on('keydown.dismiss.bs.modal', function (event) {
      if (event.which === 27) {
        this['hide']()
      }
    }.bind(this))

  } else if (!this._isShown) {
    $(this._element).off('keydown.dismiss.bs.modal')
  }
}


/**
 * @private
 */
Modal.prototype._resize = function () {
  if (this._isShown) {
    $(window).on('resize.bs.modal', this._handleUpdate.bind(this))
  } else {
    $(window).off('resize.bs.modal')
  }
}


/**
 * @private
 */
Modal.prototype._hideModal = function () {
  this._element.style.display = 'none'
  this._showBackdrop(function () {
    $(document.body).removeClass(Modal._ClassName.OPEN)
    this._resetAdjustments()
    this._resetScrollbar()
    $(this._element).trigger(Modal._Event.HIDDEN)
  }.bind(this))
}


/**
 * @private
 */
Modal.prototype._removeBackdrop = function () {
  if (this._backdrop) {
    this._backdrop.parentNode.removeChild(this._backdrop)
    this._backdrop = null
  }
}


/**
 * @param {Function} callback
 * @private
 */
Modal.prototype._showBackdrop = function (callback) {
  var animate = $(this._element).hasClass(Modal._ClassName.FADE) ? Modal._ClassName.FADE : ''

  if (this._isShown && this._config['backdrop']) {
    var doAnimate = Bootstrap.transition && animate

    this._backdrop = document.createElement('div')
    this._backdrop.className = Modal._ClassName.BACKDROP

    if (animate) {
      $(this._backdrop).addClass(animate)
    }

    $(this._element).prepend(this._backdrop)

    $(this._backdrop).on('click.dismiss.bs.modal', function (event) {
      if (event.target !== event.currentTarget) return
      this._config['backdrop'] === 'static'
        ? this._element.focus()
        : this['hide']()
    }.bind(this))

    if (doAnimate) {
      Bootstrap.reflow(this._backdrop)
    }

    $(this._backdrop).addClass(Modal._ClassName.IN)

    if (!callback) {
      return
    }

    if (!doAnimate) {
      callback()
      return
    }

    $(this._backdrop)
      .one(Bootstrap.TRANSITION_END, callback)
      .emulateTransitionEnd(Modal._BACKDROP_TRANSITION_DURATION)

  } else if (!this._isShown && this._backdrop) {
    $(this._backdrop).removeClass(Modal._ClassName.IN)

    var callbackRemove = function () {
      this._removeBackdrop()
      if (callback) {
        callback()
      }
    }.bind(this)

    if (Bootstrap.transition && $(this._element).hasClass(Modal._ClassName.FADE)) {
      $(this._backdrop)
        .one(Bootstrap.TRANSITION_END, callbackRemove)
        .emulateTransitionEnd(Modal._BACKDROP_TRANSITION_DURATION)
    } else {
      callbackRemove()
    }

  } else if (callback) {
    callback()
  }
}


/**
 * ------------------------------------------------------------------------
 * the following methods are used to handle overflowing modals
 * todo (fat): these should probably be refactored into a
 * ------------------------------------------------------------------------
 */


/**
 * @private
 */
Modal.prototype._handleUpdate = function () {
  if (this._config['backdrop']) this._adjustBackdrop()
  this._adjustDialog()
}

/**
 * @private
 */
Modal.prototype._adjustBackdrop = function () {
  this._backdrop.style.height = 0 // todo (fat): no clue why we do this
  this._backdrop.style.height = this._element.scrollHeight + 'px'
}


/**
 * @private
 */
Modal.prototype._adjustDialog = function () {
  var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight

  if (!this._isBodyOverflowing && isModalOverflowing) {
    this._element.style.paddingLeft = this._scrollbarWidth + 'px'
  }

  if (this._isBodyOverflowing && !isModalOverflowing) {
    this._element.style.paddingRight = this._scrollbarWidth + 'px'
  }
}


/**
 * @private
 */
Modal.prototype._resetAdjustments = function () {
  this._element.style.paddingLeft = ''
  this._element.style.paddingRight = ''
}


/**
 * @private
 */
Modal.prototype._checkScrollbar = function () {
  this._isBodyOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
  this._scrollbarWidth = this._getScrollbarWidth()
}


/**
 * @private
 */
Modal.prototype._setScrollbar = function () {
  var bodyPadding = parseInt(($(document.body).css('padding-right') || 0), 10)

  if (this._isBodyOverflowing) {
    document.body.style.paddingRight = bodyPadding + this._scrollbarWidth + 'px'
  }
}


/**
 * @private
 */
Modal.prototype._resetScrollbar = function () {
  document.body.style.paddingRight = ''
}


/**
 * @private
 */
Modal.prototype._getScrollbarWidth = function () { // thx walsh
  var scrollDiv = document.createElement('div')
  scrollDiv.className = Modal._Selector.SCROLLBAR_MEASURER
  document.body.appendChild(scrollDiv)
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
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
$.fn[Modal._NAME] = Modal._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Modal._NAME]['Constructor'] = Modal


/**
 * @const
 * @type {Function}
 */
$.fn[Modal._NAME]['noConflict'] = function () {
  $.fn[Modal._NAME] = Modal._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.modal.data-api', Modal._Selector.DATA_TOGGLE, function (event) {
  var selector = Bootstrap.getSelectorFromElement(this)

  if (selector) {
    var target = $(selector)[0]
  }

  var config = $(target).data(Modal._DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data())

  if (this.tagName == 'A') {
    event.preventDefault()
  }

  var $target = $(target).one(Modal._Event.SHOW, function (showEvent) {
    if (showEvent.isDefaultPrevented()) {
      return // only register focus restorer if modal will actually get shown
    }

    $target.one(Modal._Event.HIDDEN, function () {
      if ($(this).is(':visible')) {
        this.focus()
      }
    }.bind(this))
  }.bind(this))

  Modal._jQueryInterface.call($(target), config, this)
})

/** =======================================================================
 * Bootstrap: scrollspy.js v4.0.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's scrollspy plugin.
 *
 * Public Methods & Properties:
 *
 *   + $.scrollspy
 *   + $.scrollspy.noConflict
 *   + $.scrollspy.Constructor
 *   + $.scrollspy.Constructor.VERSION
 *   + $.scrollspy.Constructor.Defaults
 *   + $.scrollspy.Constructor.Defaults.offset
 *   + $.scrollspy.Constructor.prototype.refresh
 *
 * ========================================================================
 */

'use strict';


/**
 * Our scrollspy class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
function ScrollSpy(element, opt_config) {

  /** @private {Element|Window} */
  this._scrollElement = element.tagName == 'BODY' ? window : element

  /** @private {Object} */
  this._config = $.extend({}, ScrollSpy['Defaults'], opt_config)

  /** @private {string} */
  this._selector = (this._config.target || '') + ' .nav li > a'

  /** @private {Array} */
  this._offsets = []

  /** @private {Array} */
  this._targets = []

  /** @private {Element} */
  this._activeTarget = null

  /** @private {number} */
  this._scrollHeight = 0

  $(this._scrollElement).on('scroll.bs.scrollspy', this._process.bind(this))

  this['refresh']()

  this._process()
}


/**
 * @const
 * @type {string}
 */
ScrollSpy['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
ScrollSpy['Defaults'] = {
  'offset': 10
}


/**
 * @const
 * @type {string}
 * @private
 */
ScrollSpy._NAME = 'scrollspy'


/**
 * @const
 * @type {string}
 * @private
 */
ScrollSpy._DATA_KEY = 'bs.scrollspy'


/**
 * @const
 * @type {Function}
 * @private
 */
ScrollSpy._JQUERY_NO_CONFLICT = $.fn[ScrollSpy._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
ScrollSpy._Event = {
  ACTIVATE: 'activate.bs.scrollspy'
}


/**
 * @const
 * @enum {string}
 * @private
 */
ScrollSpy._ClassName = {
  DROPDOWN_MENU : 'dropdown-menu',
  ACTIVE        : 'active'
}


/**
 * @const
 * @enum {string}
 * @private
 */
ScrollSpy._Selector = {
  DATA_SPY    : '[data-spy="scroll"]',
  ACTIVE      : '.active',
  LI_DROPDOWN : 'li.dropdown',
  LI          : 'li'
}


/**
 * @param {Object=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
ScrollSpy._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(ScrollSpy._DATA_KEY)
    var config = typeof opt_config === 'object' && opt_config || null

    if (!data) {
      data = new ScrollSpy(this, config)
      $(this).data(ScrollSpy._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Refresh the scrollspy target cache
 */
ScrollSpy.prototype['refresh'] = function () {
  var offsetMethod = 'offset'
  var offsetBase   = 0

  if (this._scrollElement !== this._scrollElement.window) {
    offsetMethod = 'position'
    offsetBase   = this._getScrollTop()
  }

  this._offsets = []
  this._targets = []

  this._scrollHeight = this._getScrollHeight()

  var targets = /** @type {Array.<Element>} */ ($.makeArray($(this._selector)))

  targets
    .map(function (element, index) {
      var target
      var targetSelector = Bootstrap.getSelectorFromElement(element)

      if (targetSelector) {
        target = $(targetSelector)[0]
      }

      if (target && (target.offsetWidth || target.offsetHeight)) {
        // todo (fat): remove sketch reliance on jQuery position/offset
        return [$(target)[offsetMethod]().top + offsetBase, targetSelector]
      }
    })
    .filter(function (item) { return item })
    .sort(function (a, b) { return a[0] - b[0] })
    .forEach(function (item, index) {
      this._offsets.push(item[0])
      this._targets.push(item[1])
    }.bind(this))
}


/**
 * @private
 */
ScrollSpy.prototype._getScrollTop = function () {
  return this._scrollElement === window ?
      this._scrollElement.scrollY : this._scrollElement.scrollTop
}


/**
 * @private
 */
ScrollSpy.prototype._getScrollHeight = function () {
  return this._scrollElement.scrollHeight
      || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}


/**
 * @private
 */
ScrollSpy.prototype._process = function () {
  var scrollTop    = this._getScrollTop() + this._config.offset
  var scrollHeight = this._getScrollHeight()
  var maxScroll    = this._config.offset + scrollHeight - this._scrollElement.offsetHeight

  if (this._scrollHeight != scrollHeight) {
    this['refresh']()
  }

  if (scrollTop >= maxScroll) {
    var target = this._targets[this._targets.length - 1]

    if (this._activeTarget != target) {
      this._activate(target)
    }
  }

  if (this._activeTarget && scrollTop < this._offsets[0]) {
    this._activeTarget = null
    this._clear()
    return
  }

  for (var i = this._offsets.length; i--;) {
    var isActiveTarget = this._activeTarget != this._targets[i]
        && scrollTop >= this._offsets[i]
        && (!this._offsets[i + 1] || scrollTop < this._offsets[i + 1])

    if (isActiveTarget) {
      this._activate(this._targets[i])
    }
  }
}


/**
 * @param {Element} target
 * @private
 */
ScrollSpy.prototype._activate = function (target) {
  this._activeTarget = target

  this._clear()

  var selector = this._selector
      + '[data-target="' + target + '"],'
      + this._selector + '[href="' + target + '"]'

  // todo (fat): this seems horribly wrong… getting all raw li elements up the tree ,_,
  var parentListItems = $(selector).parents(ScrollSpy._Selector.LI)

  for (var i = parentListItems.length; i--;) {
    $(parentListItems[i]).addClass(ScrollSpy._ClassName.ACTIVE)

    var itemParent = parentListItems[i].parentNode

    if (itemParent && $(itemParent).hasClass(ScrollSpy._ClassName.DROPDOWN_MENU)) {
      var closestDropdown = $(itemParent).closest(ScrollSpy._Selector.LI_DROPDOWN)[0]
      $(closestDropdown).addClass(ScrollSpy._ClassName.ACTIVE)
    }
  }

  $(this._scrollElement).trigger(ScrollSpy._Event.ACTIVATE, {
    relatedTarget: target
  })
}


/**
 * @private
 */
ScrollSpy.prototype._clear = function () {
  var activeParents = $(this._selector).parentsUntil(this._config.target, ScrollSpy._Selector.ACTIVE)

  for (var i = activeParents.length; i--;) {
    $(activeParents[i]).removeClass(ScrollSpy._ClassName.ACTIVE)
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
$.fn[ScrollSpy._NAME] = ScrollSpy._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[ScrollSpy._NAME]['Constructor'] = ScrollSpy


/**
 * @const
 * @type {Function}
 */
$.fn[ScrollSpy._NAME]['noConflict'] = function () {
  $.fn[ScrollSpy._NAME] = ScrollSpy._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(window).on('load.bs.scrollspy.data-api', function () {
  var scrollSpys = /** @type {Array.<Element>} */ ($.makeArray($(ScrollSpy._Selector.DATA_SPY)))

  for (var i = scrollSpys.length; i--;) {
    var $spy = $(scrollSpys[i])
    ScrollSpy._jQueryInterface.call($spy, /** @type {Object|null} */ ($spy.data()))
  }
})

/** =======================================================================
 * Bootstrap: tooltip.js v4.0.0
 * http://getbootstrap.com/javascript/#tooltip
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's tooltip plugin.
 * (Inspired by jQuery.tipsy by Jason Frame)
 *
 * Public Methods & Properties:
 *
 *   + $.tooltip
 *   + $.tooltip.noConflict
 *   + $.tooltip.Constructor
 *   + $.tooltip.Constructor.VERSION
 *   + $.tooltip.Constructor.Defaults
 *   + $.tooltip.Constructor.Defaults.container
 *   + $.tooltip.Constructor.Defaults.animation
 *   + $.tooltip.Constructor.Defaults.placement
 *   + $.tooltip.Constructor.Defaults.selector
 *   + $.tooltip.Constructor.Defaults.template
 *   + $.tooltip.Constructor.Defaults.trigger
 *   + $.tooltip.Constructor.Defaults.title
 *   + $.tooltip.Constructor.Defaults.delay
 *   + $.tooltip.Constructor.Defaults.html
 *   + $.tooltip.Constructor.Defaults.viewport
 *   + $.tooltip.Constructor.Defaults.viewport.selector
 *   + $.tooltip.Constructor.Defaults.viewport.padding
 *   + $.tooltip.Constructor.prototype.enable
 *   + $.tooltip.Constructor.prototype.disable
 *   + $.tooltip.Constructor.prototype.destroy
 *   + $.tooltip.Constructor.prototype.toggleEnabled
 *   + $.tooltip.Constructor.prototype.toggle
 *   + $.tooltip.Constructor.prototype.show
 *   + $.tooltip.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our tooltip class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
var Tooltip = function (element, opt_config) {

  /** @private {boolean} */
  this._isEnabled = true

  /** @private {number} */
  this._timeout = 0

  /** @private {string} */
  this._hoverState = ''

  /** @protected {Element} */
  this.element = element

  /** @protected {Object} */
  this.config = this._getConfig(opt_config)

  /** @protected {Element} */
  this.tip = null

  /** @protected {Element} */
  this.arrow = null

  if (this.config['viewport']) {

    /** @private {Element} */
    this._viewport = $(this.config['viewport']['selector'] || this.config['viewport'])[0]

  }

  this._setListeners()
}


/**
 * @const
 * @type {string}
 */
Tooltip['VERSION']  = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Tooltip['Defaults'] = {
  'container' : false,
  'animation' : true,
  'placement' : 'top',
  'selector'  : false,
  'template'  : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  'trigger'   : 'hover focus',
  'title'     : '',
  'delay'     : 0,
  'html'      : false,
  'viewport': {
    'selector': 'body',
    'padding' : 0
  }
}


/**
 * @const
 * @enum {string}
 * @protected
 */
Tooltip.Direction = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
}


/**
 * @const
 * @type {string}
 * @private
 */
Tooltip._NAME = 'tooltip'


/**
 * @const
 * @type {string}
 * @private
 */
Tooltip._DATA_KEY = 'bs.tooltip'


/**
 * @const
 * @type {number}
 * @private
 */
Tooltip._TRANSITION_DURATION = 150


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._HoverState = {
  IN: 'in',
  OUT: 'out'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._Event = {
  HIDE   : 'hide.bs.tooltip',
  HIDDEN : 'hidden.bs.tooltip',
  SHOW   : 'show.bs.tooltip',
  SHOWN  : 'shown.bs.tooltip'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._ClassName = {
  FADE : 'fade',
  IN   : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._Selector = {
  TOOLTIP       : '.tooltip',
  TOOLTIP_INNER : '.tooltip-inner',
  TOOLTIP_ARROW : '.tooltip-arrow'
}


/**
 * @const
 * @type {Function}
 * @private
 */
Tooltip._JQUERY_NO_CONFLICT = $.fn[Tooltip._NAME]


/**
 * @param {Object=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Tooltip._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(Tooltip._DATA_KEY)
    var config = typeof opt_config == 'object' ? opt_config : null

    if (!data && opt_config == 'destroy') {
      return
    }

    if (!data) {
      data = new Tooltip(this, config)
      $(this).data(Tooltip._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Enable tooltip
 */
Tooltip.prototype['enable'] = function () {
  this._isEnabled = true
}


/**
 * Disable tooltip
 */
Tooltip.prototype['disable'] = function () {
  this._isEnabled = false
}


/**
 * Toggle the tooltip enable state
 */
Tooltip.prototype['toggleEnabled'] = function () {
  this._isEnabled = !this._isEnabled
}

/**
 * Toggle the tooltips display
 * @param {Event} opt_event
 */
Tooltip.prototype['toggle'] = function (opt_event) {
  var context = this
  var dataKey = this.getDataKey()

  if (opt_event) {
    context = $(opt_event.currentTarget).data(dataKey)

    if (!context) {
      context = new this.constructor(opt_event.currentTarget, this._getDelegateConfig())
      $(opt_event.currentTarget).data(dataKey, context)
    }
  }

  $(context.getTipElement()).hasClass(Tooltip._ClassName.IN) ?
    context._leave(null, context) :
    context._enter(null, context)
}


/**
 * Remove tooltip functionality
 */
Tooltip.prototype['destroy'] = function () {
  clearTimeout(this._timeout)
  this['hide'](function () {
    $(this.element)
      .off(Tooltip._Selector.TOOLTIP)
      .removeData(this.getDataKey())
  }.bind(this))
}


/**
 * Show the tooltip
 * todo (fat): ~fuck~ this is a big function - refactor out all of positioning logic
 * and replace with external lib
 */
Tooltip.prototype['show'] = function () {
  var showEvent = $.Event(this.getEventObject().SHOW)

  if (this.isWithContent() && this._isEnabled) {
    $(this.element).trigger(showEvent)

    var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element)

    if (showEvent.isDefaultPrevented() || !isInTheDom) {
      return
    }

    var tip   = this.getTipElement()
    var tipId = Bootstrap.getUID(this.getName())

    tip.setAttribute('id', tipId)
    this.element.setAttribute('aria-describedby', tipId)

    this.setContent()

    if (this.config['animation']) {
      $(tip).addClass(Tooltip._ClassName.FADE)
    }

    var placement = typeof this.config['placement'] == 'function' ?
      this.config['placement'].call(this, tip, this.element) :
      this.config['placement']

    var autoToken = /\s?auto?\s?/i
    var isWithAutoPlacement = autoToken.test(placement)

    if (isWithAutoPlacement) {
      placement = placement.replace(autoToken, '') || Tooltip.Direction.TOP
    }

    if (tip.parentNode && tip.parentNode.nodeType == Node.ELEMENT_NODE) {
      tip.parentNode.removeChild(tip)
    }

    tip.style.top     = 0
    tip.style.left    = 0
    tip.style.display = 'block'

    $(tip).addClass(Tooltip._NAME + '-' + placement)

    $(tip).data(this.getDataKey(), this)

    if (this.config['container']) {
      $(this.config['container'])[0].appendChild(tip)
    } else {
      this.element.parentNode.insertBefore(tip, this.element.nextSibling)
    }

    var position            = this._getPosition()
    var actualWidth         = tip.offsetWidth
    var actualHeight        = tip.offsetHeight

    var calculatedPlacement = this._getCalculatedAutoPlacement(isWithAutoPlacement, placement, position, actualWidth, actualHeight)
    var calculatedOffset    = this._getCalculatedOffset(calculatedPlacement, position, actualWidth, actualHeight)

    this._applyCalculatedPlacement(calculatedOffset, calculatedPlacement)

    var complete = function () {
      var prevHoverState = this.hoverState
      $(this.element).trigger(this.getEventObject().SHOWN)
      this.hoverState = null

      if (prevHoverState == 'out') this._leave(null, this)
    }.bind(this)

    Bootstrap.transition && $(this._tip).hasClass(Tooltip._ClassName.FADE) ?
      $(this._tip)
        .one(Bootstrap.TRANSITION_END, complete)
        .emulateTransitionEnd(Tooltip._TRANSITION_DURATION) :
      complete()
  }
}


/**
 * Hide the tooltip breh
 */
Tooltip.prototype['hide'] = function (callback) {
  var tip       = this.getTipElement()
  var hideEvent = $.Event(this.getEventObject().HIDE)

  var complete  = function () {
    if (this._hoverState != Tooltip._HoverState.IN) {
      tip.parentNode.removeChild(tip)
    }

    this.element.removeAttribute('aria-describedby')
    $(this.element).trigger(this.getEventObject().HIDDEN)

    if (callback) {
      callback()
    }
  }.bind(this)

  $(this.element).trigger(hideEvent)

  if (hideEvent.isDefaultPrevented()) return

  $(tip).removeClass(Tooltip._ClassName.IN)

  if (Bootstrap.transition && $(this._tip).hasClass(Tooltip._ClassName.FADE)) {
    $(tip)
      .one(Bootstrap.TRANSITION_END, complete)
      .emulateTransitionEnd(Tooltip._TRANSITION_DURATION)
  } else {
    complete()
  }

  this._hoverState = ''
}


/**
 * @return {string}
 */
Tooltip.prototype['getHoverState'] = function (callback) {
  return this._hoverState
}


/**
 * @return {string}
 * @protected
 */
Tooltip.prototype.getName = function () {
  return Tooltip._NAME
}


/**
 * @return {string}
 * @protected
 */
Tooltip.prototype.getDataKey = function () {
  return Tooltip._DATA_KEY
}


/**
 * @return {Object}
 * @protected
 */
Tooltip.prototype.getEventObject = function () {
  return Tooltip._Event
}


/**
 * @return {string}
 * @protected
 */
Tooltip.prototype.getTitle = function () {
  var title = this.element.getAttribute('data-original-title')

  if (!title) {
    title = typeof this.config['title'] === 'function' ?
      this.config['title'].call(this.element) :
      this.config['title']
  }

  return /** @type {string} */ (title)
}


/**
 * @return {Element}
 * @protected
 */
Tooltip.prototype.getTipElement = function () {
  return (this._tip = this._tip || $(this.config['template'])[0])
}


/**
 * @return {Element}
 * @protected
 */
Tooltip.prototype.getArrowElement = function () {
  return (this.arrow = this.arrow || $(this.getTipElement()).find(Tooltip._Selector.TOOLTIP_ARROW)[0])
}


/**
 * @return {boolean}
 * @protected
 */
Tooltip.prototype.isWithContent = function () {
  return !!this.getTitle()
}


/**
 * @protected
 */
Tooltip.prototype.setContent = function () {
  var tip   = this.getTipElement()
  var title = this.getTitle()

  $(tip).find(Tooltip._Selector.TOOLTIP_INNER)[0][this.config['html'] ? 'innerHTML' : 'innerText'] = title

  $(tip)
    .removeClass(Tooltip._ClassName.FADE)
    .removeClass(Tooltip._ClassName.IN)

  for (var direction in Tooltip.Direction) {
    $(tip).removeClass(Tooltip._NAME + '-' + direction)
  }
}


/**
 * @private
 */
Tooltip.prototype._setListeners = function () {
  var triggers = this.config['trigger'].split(' ')

  triggers.forEach(function (trigger) {
    if (trigger == 'click') {
      $(this.element).on('click.bs.tooltip', this.config['selector'], this['toggle'].bind(this))

    } else if (trigger != 'manual') {
      var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
      var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

      $(this.element)
        .on(eventIn  + '.bs.tooltip', this.config['selector'], this._enter.bind(this))
        .on(eventOut + '.bs.tooltip', this.config['selector'], this._leave.bind(this))
    }
  }.bind(this))

  if (this.config['selector']) {
    this.config = $.extend({}, this.config, { 'trigger': 'manual', 'selector': '' })
  } else {
    this._fixTitle()
  }
}


/**
 * @param {Object=} opt_config
 * @return {Object}
 * @private
 */
Tooltip.prototype._getConfig = function (opt_config) {
  var config = $.extend({}, this.constructor['Defaults'], $(this.element).data(), opt_config)

  if (config['delay'] && typeof config['delay'] == 'number') {
    config['delay'] = {
      'show': config['delay'],
      'hide': config['delay']
    }
  }

  return config
}


/**
 * @return {Object}
 * @private
 */
Tooltip.prototype._getDelegateConfig = function () {
  var config  = {}
  var defaults = this.constructor['Defaults']

  if (this.config) {
    for (var key in this.config) {
      var value = this.config[key]
      if (defaults[key] != value) config[key] = value
    }
  }

  return config
}



/**
 * @param {boolean} isWithAutoPlacement
 * @param {string} placement
 * @param {Object} position
 * @param {number} actualWidth
 * @param {number} actualHeight
 * @return {string}
 * @private
 */
Tooltip.prototype._getCalculatedAutoPlacement = function (isWithAutoPlacement, placement, position, actualWidth, actualHeight) {
  if (isWithAutoPlacement) {
    var originalPlacement = placement
    var container         = this.config['container'] ? $(this.config['container'])[0] : this.element.parentNode
    var containerDim      = this._getPosition(/** @type {Element} */ (container))

    placement = placement == Tooltip.Direction.BOTTOM && position.bottom + actualHeight > containerDim.bottom ? Tooltip.Direction.TOP    :
                placement == Tooltip.Direction.TOP    && position.top    - actualHeight < containerDim.top    ? Tooltip.Direction.BOTTOM :
                placement == Tooltip.Direction.RIGHT  && position.right  + actualWidth  > containerDim.width  ? Tooltip.Direction.LEFT   :
                placement == Tooltip.Direction.LEFT   && position.left   - actualWidth  < containerDim.left   ? Tooltip.Direction.RIGHT  :
                placement

    $(this._tip)
      .removeClass(Tooltip._NAME + '-' + originalPlacement)
      .addClass(Tooltip._NAME + '-' + placement)
  }

  return placement
}


/**
 * @param {string} placement
 * @param {Object} position
 * @param {number} actualWidth
 * @param {number} actualHeight
 * @return {{left: number, top: number}}
 * @private
 */
Tooltip.prototype._getCalculatedOffset = function (placement, position, actualWidth, actualHeight) {
  return placement == Tooltip.Direction.BOTTOM ? { top: position.top + position.height,   left: position.left + position.width / 2 - actualWidth / 2  } :
         placement == Tooltip.Direction.TOP    ? { top: position.top - actualHeight,      left: position.left + position.width / 2 - actualWidth / 2  } :
         placement == Tooltip.Direction.LEFT   ? { top: position.top + position.height / 2 - actualHeight / 2, left: position.left - actualWidth      } :
      /* placement == Tooltip.Direction.RIGHT */ { top: position.top + position.height / 2 - actualHeight / 2, left: position.left + position.width   }
}


/**
 * @param {string} placement
 * @param {Object} position
 * @param {number} actualWidth
 * @param {number} actualHeight
 * @return {Object}
 * @private
 */
Tooltip.prototype._getViewportAdjustedDelta = function (placement, position, actualWidth, actualHeight) {
  var delta = { top: 0, left: 0 }

  if (!this._viewport) {
    return delta
  }

  var viewportPadding    = this.config['viewport'] && this.config['viewport']['padding'] || 0
  var viewportDimensions = this._getPosition(this._viewport)

  if (placement === Tooltip.Direction.RIGHT || placement === Tooltip.Direction.LEFT) {
    var topEdgeOffset    = position.top - viewportPadding - viewportDimensions.scroll
    var bottomEdgeOffset = position.top + viewportPadding - viewportDimensions.scroll + actualHeight

    if (topEdgeOffset < viewportDimensions.top) { // top overflow
      delta.top = viewportDimensions.top - topEdgeOffset

    } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
      delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
    }

  } else {
    var leftEdgeOffset  = position.left - viewportPadding
    var rightEdgeOffset = position.left + viewportPadding + actualWidth

    if (leftEdgeOffset < viewportDimensions.left) { // left overflow
      delta.left = viewportDimensions.left - leftEdgeOffset

    } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
      delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
    }
  }

  return delta
}


/**
 * @param {Element=} opt_element
 * @return {Object}
 * @private
 */
Tooltip.prototype._getPosition = function (opt_element) {
  var element   = opt_element || this.element
  var isBody    = element.tagName == 'BODY'
  var rect      = element.getBoundingClientRect()
  var offset    = isBody ? { top: 0, left: 0 } : $(element).offset()
  var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : this.element.scrollTop }
  var outerDims = isBody ? { width: window.innerWidth, height: window.innerHeight } : null

  return $.extend({}, rect, scroll, outerDims, offset)
}


/**
 * @param {{left: number, top: number}} offset
 * @param {string} placement
 * @private
 */
Tooltip.prototype._applyCalculatedPlacement = function (offset, placement) {
  var tip    = this.getTipElement()
  var width  = tip.offsetWidth
  var height = tip.offsetHeight

  // manually read margins because getBoundingClientRect includes difference
  var marginTop  = parseInt(tip.style.marginTop, 10)
  var marginLeft = parseInt(tip.style.marginLeft, 10)

  // we must check for NaN for ie 8/9
  if (isNaN(marginTop))  {
    marginTop  = 0
  }
  if (isNaN(marginLeft)) {
    marginLeft = 0
  }

  offset.top  = offset.top  + marginTop
  offset.left = offset.left + marginLeft

  // $.fn.offset doesn't round pixel values
  // so we use setOffset directly with our own function B-0
  $.offset.setOffset(tip, $.extend({
    using: function (props) {
      tip.style.top  = Math.round(props.top)  + 'px'
      tip.style.left = Math.round(props.left) + 'px'
    }
  }, offset), 0)

  $(tip).addClass(Tooltip._ClassName.IN)

  // check to see if placing tip in new offset caused the tip to resize itself
  var actualWidth  = tip.offsetWidth
  var actualHeight = tip.offsetHeight

  if (placement == Tooltip.Direction.TOP && actualHeight != height) {
    offset.top = offset.top + height - actualHeight
  }

  var delta = this._getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

  if (delta.left) {
    offset.left += delta.left
  } else {
    offset.top  += delta.top
  }

  var isVertical          = placement === Tooltip.Direction.TOP || placement === Tooltip.Direction.BOTTOM
  var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
  var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

  $(tip).offset(offset)

  this._replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical)
}


/**
 * @param {number} delta
 * @param {number} dimension
 * @param {boolean} isHorizontal
 * @private
 */
Tooltip.prototype._replaceArrow = function (delta, dimension, isHorizontal) {
  var arrow = this.getArrowElement()

  arrow.style[isHorizontal ? 'left' : 'top'] =  50 * (1 - delta / dimension) + '%'
  arrow.style[isHorizontal ? 'top'  : 'left'] = ''
}



/**
 * @private
 */
Tooltip.prototype._fixTitle = function () {
  if (this.element.getAttribute('title') || typeof this.element.getAttribute('data-original-title') != 'string') {
    this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '')
    this.element.setAttribute('title', '')
  }
}


/**
 * @param {Event=} opt_event
 * @param {Object=} opt_context
 * @private
 */
Tooltip.prototype._enter = function (opt_event, opt_context) {
  var dataKey = this.getDataKey()
  var context = opt_context || $(opt_event.currentTarget).data(dataKey)

  if (context && context._tip && context._tip.offsetWidth) {
    context._hoverState = Tooltip._HoverState.IN
    return
  }

  if (!context) {
    context = new this.constructor(opt_event.currentTarget, this._getDelegateConfig())
    $(opt_event.currentTarget).data(dataKey, context)
  }

  clearTimeout(context._timeout)

  context._hoverState = Tooltip._HoverState.IN

  if (!context.config['delay'] || !context.config['delay']['show']) {
    context['show']()
    return
  }

  context._timeout = setTimeout(function () {
    if (context._hoverState == Tooltip._HoverState.IN) {
      context['show']()
    }
  }, context.config['delay']['show'])
}


/**
 * @param {Event=} opt_event
 * @param {Object=} opt_context
 * @private
 */
Tooltip.prototype._leave = function (opt_event, opt_context) {
  var dataKey = this.getDataKey()
  var context = opt_context || $(opt_event.currentTarget).data(dataKey)

  if (!context) {
    context = new this.constructor(opt_event.currentTarget, this._getDelegateConfig())
    $(opt_event.currentTarget).data(dataKey, context)
  }

  clearTimeout(context._timeout)

  context._hoverState = Tooltip._HoverState.OUT

  if (!context.config['delay'] || !context.config['delay']['hide']) {
    context['hide']()
    return
  }

  context._timeout = setTimeout(function () {
    if (context._hoverState == Tooltip._HoverState.OUT) {
      context['hide']()
    }
  }, context.config['delay']['hide'])
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
$.fn[Tooltip._NAME] = Tooltip._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Tooltip._NAME]['Constructor'] = Tooltip


/**
 * @const
 * @type {Function}
 */
$.fn[Tooltip._NAME]['noConflict'] = function () {
  $.fn[Tooltip._NAME] = Tooltip._JQUERY_NO_CONFLICT
  return this
}

/** =======================================================================
 * Bootstrap: popover.js v4.0.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's popover plugin - extends tooltip.
 *
 * Public Methods & Properties:
 *
 *   + $.popover
 *   + $.popover.noConflict
 *   + $.popover.Constructor
 *   + $.popover.Constructor.VERSION
 *   + $.popover.Constructor.Defaults
 *   + $.popover.Constructor.Defaults.container
 *   + $.popover.Constructor.Defaults.animation
 *   + $.popover.Constructor.Defaults.placement
 *   + $.popover.Constructor.Defaults.selector
 *   + $.popover.Constructor.Defaults.template
 *   + $.popover.Constructor.Defaults.trigger
 *   + $.popover.Constructor.Defaults.title
 *   + $.popover.Constructor.Defaults.content
 *   + $.popover.Constructor.Defaults.delay
 *   + $.popover.Constructor.Defaults.html
 *   + $.popover.Constructor.Defaults.viewport
 *   + $.popover.Constructor.Defaults.viewport.selector
 *   + $.popover.Constructor.Defaults.viewport.padding
 *   + $.popover.Constructor.prototype.enable
 *   + $.popover.Constructor.prototype.disable
 *   + $.popover.Constructor.prototype.destroy
 *   + $.popover.Constructor.prototype.toggleEnabled
 *   + $.popover.Constructor.prototype.toggle
 *   + $.popover.Constructor.prototype.show
 *   + $.popover.Constructor.prototype.hide
 *
 * ========================================================================
 */


'use strict';


if (!Tooltip) throw new Error('Popover requires tooltip.js')


/**
 * Our tooltip class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 * @extends {Tooltip}
 */
var Popover = function (element, opt_config) {
  Tooltip.apply(this, arguments)
}
Bootstrap.inherits(Popover, Tooltip)


/**
 * @const
 * @type {string}
 */
Popover['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Popover['Defaults'] = $.extend({}, $.fn['tooltip']['Constructor']['Defaults'], {
  'placement': 'right',
  'trigger': 'click',
  'content': '',
  'template': '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
})


/**
 * @const
 * @type {string}
 * @private
 */
Popover._NAME = 'popover'


/**
 * @const
 * @type {string}
 * @private
 */
Popover._DATA_KEY = 'bs.popover'


/**
 * @const
 * @enum {string}
 * @private
 */
Popover._Event = {
  HIDE   : 'hide.bs.popover',
  HIDDEN : 'hidden.bs.popover',
  SHOW   : 'show.bs.popover',
  SHOWN  : 'shown.bs.popover'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Popover._ClassName = {
  FADE : 'fade',
  IN  : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Popover._Selector = {
  TITLE   : '.popover-title',
  CONTENT : '.popover-content',
  ARROW   : '.popover-arrow'
}


/**
 * @const
 * @type {Function}
 * @private
 */
Popover._JQUERY_NO_CONFLICT = $.fn[Popover._NAME]


/**
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Popover._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(Popover._DATA_KEY)
    var config = typeof opt_config === 'object' ? opt_config : null

    if (!data && opt_config === 'destroy') {
      return
    }

    if (!data) {
      data = new Popover(this, config)
      $(this).data(Popover._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * @return {string}
 * @protected
 */
Popover.prototype.getName = function () {
  return Popover._NAME
}


/**
 * @override
 */
Popover.prototype.getDataKey = function () {
  return Popover._DATA_KEY
}


/**
 * @override
 */
Popover.prototype.getEventObject = function () {
  return Popover._Event
}


/**
 * @override
 */
Popover.prototype.getArrowElement = function () {
  return (this.arrow = this.arrow || $(this.getTipElement()).find(Popover._Selector.ARROW)[0])
}


/**
 * @override
 */
Popover.prototype.setContent = function () {
  var tip          = this.getTipElement()
  var title        = this.getTitle()
  var content      = this._getContent()
  var titleElement = $(tip).find(Popover._Selector.TITLE)[0]

  if (titleElement) {
    titleElement[this.config['html'] ? 'innerHTML' : 'innerText'] = title
  }

  // we use append for html objects to maintain js events
  $(tip).find(Popover._Selector.CONTENT).children().detach().end()[
    this.config['html'] ? (typeof content == 'string' ? 'html' : 'append') : 'text'
  ](content)

  $(tip)
    .removeClass(Popover._ClassName.FADE)
    .removeClass(Popover._ClassName.IN)

  for (var direction in Tooltip.Direction) {
    $(tip).removeClass(Popover._NAME + '-' + Tooltip.Direction[direction])
  }
}


/**
 * @override
 */
Popover.prototype.isWithContent = function () {
  return this.getTitle() || this._getContent()
}


/**
 * @override
 */
Popover.prototype.getTipElement = function () {
  return (this.tip = this.tip || $(this.config['template'])[0])
}


/**
 * @private
 */
Popover.prototype._getContent = function () {
  return this.element.getAttribute('data-content')
    || (typeof this.config['content'] == 'function' ?
          this.config['content'].call(this.element) :
          this.config['content'])
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
$.fn[Popover._NAME] = Popover._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Popover._NAME]['Constructor'] = Popover


/**
 * @const
 * @type {Function}
 */
$.fn[Popover._NAME]['noConflict'] = function () {
  $.fn[Popover._NAME] = Popover._JQUERY_NO_CONFLICT
  return this
}

/** =======================================================================
 * Bootstrap: tab.js v4.0.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's tab plugin. Tab O_O
 *
 * Public Methods & Properties:
 *
 *   + $.tab
 *   + $.tab.noConflict
 *   + $.tab.Constructor
 *   + $.tab.Constructor.VERSION
 *   + $.tab.Constructor.prototype.show
 *
 * ========================================================================
 */


'use strict';

/**
 * Our Tab class.
 * @param {Element!} element
 * @constructor
 */
var Tab = function (element) {

  /** @type {Element} */
  this._element = element

}


/**
 * @const
 * @type {string}
 */
Tab['VERSION'] = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Tab._NAME = 'tab'


/**
 * @const
 * @type {string}
 * @private
 */
Tab._DATA_KEY = 'bs.tab'


/**
 * @const
 * @type {number}
 * @private
 */
Tab._TRANSITION_DURATION = 150


/**
 * @const
 * @enum {string}
 * @private
 */
Tab._Event = {
  HIDE   : 'hide.bs.tab',
  HIDDEN : 'hidden.bs.tab',
  SHOW   : 'show.bs.tab',
  SHOWN  : 'shown.bs.tab'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tab._ClassName = {
  DROPDOWN_MENU : 'dropdown-menu',
  ACTIVE        : 'active',
  FADE          : 'fade',
  IN            : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tab._Selector = {
  A                     : 'a',
  LI                    : 'li',
  LI_DROPDOWN           : 'li.dropdown',
  UL                    : 'ul:not(.dropdown-menu)',
  FADE_CHILD            : ':scope > .fade',
  ACTIVE                : '.active',
  ACTIVE_CHILD          : ':scope > .active',
  DATA_TOGGLE           : '[data-toggle="tab"], [data-toggle="pill"]',
  DROPDOWN_ACTIVE_CHILD : ':scope > .dropdown-menu > .active'
}


/**
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Tab._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var $this = $(this)
    var data  = $this.data(Tab._DATA_KEY)

    if (!data) {
      data = data = new Tab(this)
      $this.data(Tab._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Show the tab
 */
Tab.prototype['show'] = function () {
  if ( this._element.parentNode
    && this._element.parentNode.nodeType == Node.ELEMENT_NODE
    && $(this._element).parent().hasClass(Tab._ClassName.ACTIVE)) {
    return
  }

  var ulElement = $(this._element).closest(Tab._Selector.UL)[0]
  var selector  = Bootstrap.getSelectorFromElement(this._element)

  if (ulElement) {
    var previous = /** @type {Array.<Element>} */ ($.makeArray($(ulElement).find(Tab._Selector.ACTIVE)))
    previous = previous[previous.length - 1]

    if (previous) {
      previous = $(previous).find('a')[0]
    }
  }

  var hideEvent = $.Event(Tab._Event.HIDE, {
    relatedTarget: this._element
  })

  var showEvent = $.Event(Tab._Event.SHOW, {
    relatedTarget: previous
  })

  if (previous) {
    $(previous).trigger(hideEvent)
  }

  $(this._element).trigger(showEvent)

  if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

  if (selector) {
    var target = $(selector)[0]
  }

  this._activate($(this._element).closest(Tab._Selector.LI)[0], ulElement)

  var complete = function () {
    var hiddenEvent = $.Event(Tab._Event.HIDDEN, {
      relatedTarget: this._element
    })

    var shownEvent  = $.Event(Tab._Event.SHOWN, {
      relatedTarget: previous
    })

    $(previous).trigger(hiddenEvent)
    $(this._element).trigger(shownEvent)
  }.bind(this)

  if (target) {
    this._activate(target, /** @type {Element} */ (target.parentNode), complete)
  } else {
    complete()
  }
}


/**
 * @param {Element} element
 * @param {Element} container
 * @param {Function=} opt_callback
 * @private
 */
Tab.prototype._activate = function (element, container, opt_callback) {
  var active          = $(container).find(Tab._Selector.ACTIVE_CHILD)[0]
  var isTransitioning = opt_callback
    && Bootstrap.transition
    && ((active && $(active).hasClass(Tab._ClassName.FADE))
       || !!$(container).find(Tab._Selector.FADE_CHILD)[0])

  var complete = this._transitionComplete.bind(this, element, active, isTransitioning, opt_callback)

  if (active && isTransitioning) {
    $(active)
      .one(Bootstrap.TRANSITION_END, complete)
      .emulateTransitionEnd(Tab._TRANSITION_DURATION)

  } else {
    complete()
  }

  if (active) {
    $(active).removeClass(Tab._ClassName.IN)
  }
}


/**
 * @param {Element} element
 * @param {Element} active
 * @param {boolean} isTransitioning
 * @param {Function=} opt_callback
 * @private
 */
Tab.prototype._transitionComplete = function (element, active, isTransitioning, opt_callback) {
  if (active) {
    $(active).removeClass(Tab._ClassName.ACTIVE)

    var dropdownChild = $(active).find(Tab._Selector.DROPDOWN_ACTIVE_CHILD)[0]
    if (dropdownChild) {
      $(dropdownChild).removeClass(Tab._ClassName.ACTIVE)
    }

    var activeToggle = $(active).find(Tab._Selector.DATA_TOGGLE)[0]
    if (activeToggle) {
      activeToggle.setAttribute('aria-expanded', false)
    }
  }

  $(element).addClass(Tab._ClassName.ACTIVE)

  var elementToggle = $(element).find(Tab._Selector.DATA_TOGGLE)[0]
  if (elementToggle) {
    elementToggle.setAttribute('aria-expanded', true)
  }

  if (isTransitioning) {
    Bootstrap.reflow(element)
    $(element).addClass(Tab._ClassName.IN)
  } else {
    $(element).removeClass(Tab._ClassName.FADE)
  }

  if (element.parentNode && $(element.parentNode).hasClass(Tab._ClassName.DROPDOWN_MENU)) {
    var dropdownElement = $(element).closest(Tab._Selector.LI_DROPDOWN)[0]
    if (dropdownElement) {
      $(dropdownElement).addClass(Tab._ClassName.ACTIVE)
    }

    elementToggle = $(element).find(Tab._Selector.DATA_TOGGLE)[0]
    if (elementToggle) {
      elementToggle.setAttribute('aria-expanded', true)
    }
  }

  if (opt_callback) {
    opt_callback()
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
$.fn[Tab._NAME] = Tab._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Tab._NAME]['Constructor'] = Tab


/**
 * @const
 * @type {Function}
 */
$.fn[Tab._NAME]['noConflict'] = function () {
  $.fn[Tab._NAME] = Tab._JQUERY_NO_CONFLICT
  return this
}



// TAB DATA-API
// ============

var clickHandler = function (e) {
  e.preventDefault()
  Tab._jQueryInterface.call($(this), 'show')
}

$(document)
  .on('click.bs.tab.data-api', Tab._Selector.DATA_TOGGLE, clickHandler)
