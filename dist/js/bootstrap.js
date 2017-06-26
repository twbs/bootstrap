/*!
 * Bootstrap v4.0.0-beta (https://getbootstrap.com)
 * Copyright 2011-2017 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
	(factory((global.bootstrap = global.bootstrap || {}),global.$,global.Popper));
}(this, (function (exports,$,Popper) { 'use strict';

$ = $ && 'default' in $ ? $['default'] : $;
Popper = Popper && 'default' in Popper ? Popper['default'] : Popper;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Private TransitionEnd Helpers
 * ------------------------------------------------------------------------
 */

var transition = false;

var MAX_UID = 1000000;

var TransitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
  transition: 'transitionend'

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
};function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function isElement(obj) {
  return (obj[0] || obj).nodeType;
}

function getSpecialTransitionEndEvent() {
  return {
    bindType: transition.end,
    delegateType: transition.end,
    handle: function handle(event) {
      if ($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
      }
      return undefined;
    }
  };
}

function transitionEndTest() {
  if (window.QUnit) {
    return false;
  }

  var el = document.createElement('bootstrap');

  for (var name in TransitionEndEvent) {
    if (el.style[name] !== undefined) {
      return {
        end: TransitionEndEvent[name]
      };
    }
  }

  return false;
}

function transitionEndEmulator(duration) {
  var _this = this;

  var called = false;

  $(this).one(Util.TRANSITION_END, function () {
    called = true;
  });

  setTimeout(function () {
    if (!called) {
      Util.triggerTransitionEnd(_this);
    }
  }, duration);

  return this;
}

function setTransitionEndSupport() {
  transition = transitionEndTest();

  $.fn.emulateTransitionEnd = transitionEndEmulator;

  if (Util.supportsTransitionEnd()) {
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
}

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

var Util = {

  TRANSITION_END: 'bsTransitionEnd',

  getUID: function getUID(prefix) {
    do {
      // eslint-disable-next-line no-bitwise
      prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
    } while (document.getElementById(prefix));
    return prefix;
  },
  getSelectorFromElement: function getSelectorFromElement(element) {
    var selector = element.getAttribute('data-target');
    if (!selector || selector === '#') {
      selector = element.getAttribute('href') || '';
    }

    try {
      var $selector = $(selector);
      return $selector.length > 0 ? selector : null;
    } catch (error) {
      return null;
    }
  },
  reflow: function reflow(element) {
    return element.offsetHeight;
  },
  triggerTransitionEnd: function triggerTransitionEnd(element) {
    $(element).trigger(transition.end);
  },
  supportsTransitionEnd: function supportsTransitionEnd() {
    return Boolean(transition);
  },
  typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
    for (var property in configTypes) {
      if (configTypes.hasOwnProperty(property)) {
        var expectedTypes = configTypes[property];
        var value = config[property];
        var valueType = value && isElement(value) ? 'element' : toType(value);

        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
        }
      }
    }
  },
  nodeEnv: function nodeEnv() {
    try {
      // Thanks to iliakan https://goo.gl/Hi4DcC
      // eslint-disable-next-line no-undef
      return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
    } catch (e) {
      return false;
    }
  }
};

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    setTransitionEndSupport();
  });
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'alert';
var VERSION = '4.0.0-beta';
var DATA_KEY = 'bs.alert';
var EVENT_KEY = '.' + DATA_KEY;
var DATA_API_KEY = '.data-api';
var JQUERY_NO_CONFLICT = $.fn[NAME];
var TRANSITION_DURATION = 150;

var Selector = {
  DISMISS: '[data-dismiss="alert"]'
};

var Event = {
  CLOSE: 'close' + EVENT_KEY,
  CLOSED: 'closed' + EVENT_KEY,
  CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
};

var ClassName = {
  ALERT: 'alert',
  FADE: 'fade',
  SHOW: 'show'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Alert = function () {
  function Alert(element) {
    classCallCheck(this, Alert);

    this._element = element;
  }

  // getters

  createClass(Alert, [{
    key: 'close',


    // public

    value: function close(element) {
      element = element || this._element;

      var rootElement = this._getRootElement(element);
      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }

    // private

  }, {
    key: '_getRootElement',
    value: function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = $(selector)[0];
      }

      if (!parent) {
        parent = $(element).closest('.' + ClassName.ALERT)[0];
      }

      return parent;
    }
  }, {
    key: '_triggerCloseEvent',
    value: function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);

      $(element).trigger(closeEvent);
      return closeEvent;
    }
  }, {
    key: '_removeElement',
    value: function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!Util.supportsTransitionEnd() || !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);
        return;
      }

      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(TRANSITION_DURATION);
    }
  }, {
    key: '_destroyElement',
    value: function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    }
  }, {
    key: '_handleDismiss',
    value: function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME] = Alert._jQueryInterface;
      $.fn[NAME].Constructor = Alert;
      $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Alert._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION;
    }
  }]);
  return Alert;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Alert._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$1 = 'button';
var VERSION$1 = '4.0.0-beta';
var DATA_KEY$1 = 'bs.button';
var EVENT_KEY$1 = '.' + DATA_KEY$1;
var DATA_API_KEY$1 = '.data-api';
var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];

var ClassName$1 = {
  ACTIVE: 'active',
  BUTTON: 'btn',
  FOCUS: 'focus'
};

var Selector$1 = {
  DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
  DATA_TOGGLE: '[data-toggle="buttons"]',
  INPUT: 'input',
  ACTIVE: '.active',
  BUTTON: '.btn'
};

var Event$1 = {
  CLICK_DATA_API: 'click' + EVENT_KEY$1 + DATA_API_KEY$1,
  FOCUS_BLUR_DATA_API: 'focus' + EVENT_KEY$1 + DATA_API_KEY$1 + ' ' + ('blur' + EVENT_KEY$1 + DATA_API_KEY$1)

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Button = function () {
  function Button(element) {
    classCallCheck(this, Button);

    this._element = element;
  }

  // getters

  createClass(Button, [{
    key: 'toggle',


    // public

    value: function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(Selector$1.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = $(this._element).find(Selector$1.INPUT)[0];

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && $(this._element).hasClass(ClassName$1.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = $(rootElement).find(Selector$1.ACTIVE)[0];

              if (activeElement) {
                $(activeElement).removeClass(ClassName$1.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }
            input.checked = !$(this._element).hasClass(ClassName$1.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !$(this._element).hasClass(ClassName$1.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName$1.ACTIVE);
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event$1.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
        event.preventDefault();

        var button = event.target;

        if (!$(button).hasClass(ClassName$1.BUTTON)) {
          button = $(button).closest(Selector$1.BUTTON);
        }

        Button._jQueryInterface.call($(button), 'toggle');
      }).on(Event$1.FOCUS_BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
        var button = $(event.target).closest(Selector$1.BUTTON)[0];
        $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));
      });

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$1] = Button._jQueryInterface;
      $.fn[NAME$1].Constructor = Button;
      $.fn[NAME$1].noConflict = function () {
        $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
        return Button._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$1;
    }
  }]);
  return Button;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Button._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$2 = 'carousel';
var VERSION$2 = '4.0.0-beta';
var DATA_KEY$2 = 'bs.carousel';
var EVENT_KEY$2 = '.' + DATA_KEY$2;
var DATA_API_KEY$2 = '.data-api';
var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
var TRANSITION_DURATION$1 = 600;
var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key
var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key
var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

var Default = {
  interval: 5000,
  keyboard: true,
  slide: false,
  pause: 'hover',
  wrap: true
};

var DefaultType = {
  interval: '(number|boolean)',
  keyboard: 'boolean',
  slide: '(boolean|string)',
  pause: '(string|boolean)',
  wrap: 'boolean'
};

var Direction = {
  NEXT: 'next',
  PREV: 'prev',
  LEFT: 'left',
  RIGHT: 'right'
};

var Event$2 = {
  SLIDE: 'slide' + EVENT_KEY$2,
  SLID: 'slid' + EVENT_KEY$2,
  KEYDOWN: 'keydown' + EVENT_KEY$2,
  MOUSEENTER: 'mouseenter' + EVENT_KEY$2,
  MOUSELEAVE: 'mouseleave' + EVENT_KEY$2,
  TOUCHEND: 'touchend' + EVENT_KEY$2,
  LOAD_DATA_API: 'load' + EVENT_KEY$2 + DATA_API_KEY$2,
  CLICK_DATA_API: 'click' + EVENT_KEY$2 + DATA_API_KEY$2
};

var ClassName$2 = {
  CAROUSEL: 'carousel',
  ACTIVE: 'active',
  SLIDE: 'slide',
  RIGHT: 'carousel-item-right',
  LEFT: 'carousel-item-left',
  NEXT: 'carousel-item-next',
  PREV: 'carousel-item-prev',
  ITEM: 'carousel-item'
};

var Selector$2 = {
  ACTIVE: '.active',
  ACTIVE_ITEM: '.active.carousel-item',
  ITEM: '.carousel-item',
  NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
  INDICATORS: '.carousel-indicators',
  DATA_SLIDE: '[data-slide], [data-slide-to]',
  DATA_RIDE: '[data-ride="carousel"]'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Carousel = function () {
  function Carousel(element, config) {
    classCallCheck(this, Carousel);

    this._items = null;
    this._interval = null;
    this._activeElement = null;

    this._isPaused = false;
    this._isSliding = false;

    this.touchTimeout = null;

    this._config = this._getConfig(config);
    this._element = $(element)[0];
    this._indicatorsElement = $(this._element).find(Selector$2.INDICATORS)[0];

    this._addEventListeners();
  }

  // getters

  createClass(Carousel, [{
    key: 'next',


    // public

    value: function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    }
  }, {
    key: 'nextWhenVisible',
    value: function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    }
  }, {
    key: 'prev',
    value: function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    }
  }, {
    key: 'pause',
    value: function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if ($(this._element).find(Selector$2.NEXT_PREV)[0] && Util.supportsTransitionEnd()) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }
  }, {
    key: 'cycle',
    value: function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }
  }, {
    key: 'to',
    value: function to(index) {
      var _this = this;

      this._activeElement = $(this._element).find(Selector$2.ACTIVE_ITEM)[0];

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event$2.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $(this._element).off(EVENT_KEY$2);
      $.removeData(this._element, DATA_KEY$2);

      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }

    // private

  }, {
    key: '_getConfig',
    value: function _getConfig(config) {
      config = $.extend({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    }
  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event$2.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(Event$2.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event$2.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });
        if ('ontouchstart' in document.documentElement) {
          // if it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          $(this._element).on(Event$2.TOUCHEND, function () {
            _this2.pause();
            if (_this2.touchTimeout) {
              clearTimeout(_this2.touchTimeout);
            }
            _this2.touchTimeout = setTimeout(function (event) {
              return _this2.cycle(event);
            }, TOUCHEVENT_COMPAT_WAIT + _this2._config.interval);
          });
        }
      }
    }
  }, {
    key: '_keydown',
    value: function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;
        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;
        default:
          return;
      }
    }
  }, {
    key: '_getItemIndex',
    value: function _getItemIndex(element) {
      this._items = $.makeArray($(element).parent().find(Selector$2.ITEM));
      return this._items.indexOf(element);
    }
  }, {
    key: '_getItemByDirection',
    value: function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;
      var activeIndex = this._getItemIndex(activeElement);
      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;

      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    }
  }, {
    key: '_triggerSlideEvent',
    value: function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);
      var fromIndex = this._getItemIndex($(this._element).find(Selector$2.ACTIVE_ITEM)[0]);
      var slideEvent = $.Event(Event$2.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });

      $(this._element).trigger(slideEvent);

      return slideEvent;
    }
  }, {
    key: '_setActiveIndicatorElement',
    value: function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $(this._indicatorsElement).find(Selector$2.ACTIVE).removeClass(ClassName$2.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName$2.ACTIVE);
        }
      }
    }
  }, {
    key: '_slide',
    value: function _slide(direction, element) {
      var _this3 = this;

      var activeElement = $(this._element).find(Selector$2.ACTIVE_ITEM)[0];
      var activeElementIndex = this._getItemIndex(activeElement);
      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);
      var nextElementIndex = this._getItemIndex(nextElement);
      var isCycling = Boolean(this._interval);

      var directionalClassName = void 0;
      var orderClassName = void 0;
      var eventDirectionName = void 0;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName$2.LEFT;
        orderClassName = ClassName$2.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName$2.RIGHT;
        orderClassName = ClassName$2.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event$2.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName$2.SLIDE)) {

        $(nextElement).addClass(orderClassName);

        Util.reflow(nextElement);

        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);

        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + ' ' + orderClassName).addClass(ClassName$2.ACTIVE);

          $(activeElement).removeClass(ClassName$2.ACTIVE + ' ' + orderClassName + ' ' + directionalClassName);

          _this3._isSliding = false;

          setTimeout(function () {
            return $(_this3._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(TRANSITION_DURATION$1);
      } else {
        $(activeElement).removeClass(ClassName$2.ACTIVE);
        $(nextElement).addClass(ClassName$2.ACTIVE);

        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);
        var _config = $.extend({}, Default, $(this).data());

        if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
          $.extend(_config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (data[action] === undefined) {
            throw new Error('No method named "' + action + '"');
          }
          data[action]();
        } else if (_config.interval) {
          data.pause();
          data.cycle();
        }
      });
    }
  }, {
    key: '_dataApiClickHandler',
    value: function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {
        return;
      }

      var config = $.extend({}, $(target).data(), $(this).data());
      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY$2).to(slideIndex);
      }

      event.preventDefault();
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event$2.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);

      $(window).on(Event$2.LOAD_DATA_API, function () {
        $(Selector$2.DATA_RIDE).each(function () {
          var $carousel = $(this);
          Carousel._jQueryInterface.call($carousel, $carousel.data());
        });
      });

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$2] = Carousel._jQueryInterface;
      $.fn[NAME$2].Constructor = Carousel;
      $.fn[NAME$2].noConflict = function () {
        $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
        return Carousel._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$2;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default;
    }
  }]);
  return Carousel;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Carousel._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$3 = 'collapse';
var VERSION$3 = '4.0.0-beta';
var DATA_KEY$3 = 'bs.collapse';
var EVENT_KEY$3 = '.' + DATA_KEY$3;
var DATA_API_KEY$3 = '.data-api';
var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
var TRANSITION_DURATION$2 = 600;

var Default$1 = {
  toggle: true,
  parent: ''
};

var DefaultType$1 = {
  toggle: 'boolean',
  parent: 'string'
};

var Event$3 = {
  SHOW: 'show' + EVENT_KEY$3,
  SHOWN: 'shown' + EVENT_KEY$3,
  HIDE: 'hide' + EVENT_KEY$3,
  HIDDEN: 'hidden' + EVENT_KEY$3,
  CLICK_DATA_API: 'click' + EVENT_KEY$3 + DATA_API_KEY$3
};

var ClassName$3 = {
  SHOW: 'show',
  COLLAPSE: 'collapse',
  COLLAPSING: 'collapsing',
  COLLAPSED: 'collapsed'
};

var Dimension = {
  WIDTH: 'width',
  HEIGHT: 'height'
};

var Selector$3 = {
  ACTIVES: '.show, .collapsing',
  DATA_TOGGLE: '[data-toggle="collapse"]'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Collapse = function () {
  function Collapse(element, config) {
    classCallCheck(this, Collapse);

    this._isTransitioning = false;
    this._element = element;
    this._config = this._getConfig(config);
    this._triggerArray = $.makeArray($('[data-toggle="collapse"][href="#' + element.id + '"],' + ('[data-toggle="collapse"][data-target="#' + element.id + '"]')));
    var tabToggles = $(Selector$3.DATA_TOGGLE);
    for (var i = 0; i < tabToggles.length; i++) {
      var elem = tabToggles[i];
      var selector = Util.getSelectorFromElement(elem);
      if (selector !== null && $(selector).filter(element).length > 0) {
        this._triggerArray.push(elem);
      }
    }

    this._parent = this._config.parent ? this._getParent() : null;

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._element, this._triggerArray);
    }

    if (this._config.toggle) {
      this.toggle();
    }
  }

  // getters

  createClass(Collapse, [{
    key: 'toggle',


    // public

    value: function toggle() {
      if ($(this._element).hasClass(ClassName$3.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var actives = void 0;
      var activesData = void 0;

      if (this._parent) {
        actives = $.makeArray($(this._parent).children().children(Selector$3.ACTIVES));
        if (!actives.length) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).data(DATA_KEY$3);
        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event$3.SHOW);
      $(this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives), 'hide');
        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);

      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);

        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(Event$3.SHOWN);
      };

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = 'scroll' + capitalizedDimension;

      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION$2);

      this._element.style[dimension] = this._element[scrollSize] + 'px';
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event$3.HIDE);
      $(this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + 'px';

      Util.reflow(this._element);

      $(this._element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);

      if (this._triggerArray.length) {
        for (var i = 0; i < this._triggerArray.length; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);
          if (selector !== null) {
            var $elem = $(selector);
            if (!$elem.hasClass(ClassName$3.SHOW)) {
              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);
        $(_this2._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);
      };

      this._element.style[dimension] = '';

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION$2);
    }
  }, {
    key: 'setTransitioning',
    value: function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY$3);

      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }

    // private

  }, {
    key: '_getConfig',
    value: function _getConfig(config) {
      config = $.extend({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // coerce string values
      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    }
  }, {
    key: '_getDimension',
    value: function _getDimension() {
      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    }
  }, {
    key: '_getParent',
    value: function _getParent() {
      var _this3 = this;

      var parent = $(this._config.parent)[0];
      var selector = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';

      $(parent).find(selector).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });

      return parent;
    }
  }, {
    key: '_addAriaAndCollapsedClass',
    value: function _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        var isOpen = $(element).hasClass(ClassName$3.SHOW);

        if (triggerArray.length) {
          $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
        }
      }
    }

    // static

  }], [{
    key: '_getTargetFromElement',
    value: function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? $(selector)[0] : null;
    }
  }, {
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$3);
        var _config = $.extend({}, Default$1, $this.data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event$3.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {
        if (!/input|textarea/i.test(event.target.tagName)) {
          event.preventDefault();
        }

        var $trigger = $(this);
        var selector = Util.getSelectorFromElement(this);
        $(selector).each(function () {
          var $target = $(this);
          var data = $target.data(DATA_KEY$3);
          var config = data ? 'toggle' : $trigger.data();
          Collapse._jQueryInterface.call($target, config);
        });
      });

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$3] = Collapse._jQueryInterface;
      $.fn[NAME$3].Constructor = Collapse;
      $.fn[NAME$3].noConflict = function () {
        $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
        return Collapse._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$3;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default$1;
    }
  }]);
  return Collapse;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Collapse._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$4 = 'dropdown';
var VERSION$4 = '4.0.0-beta';
var DATA_KEY$4 = 'bs.dropdown';
var EVENT_KEY$4 = '.' + DATA_KEY$4;
var DATA_API_KEY$4 = '.data-api';
var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + '|' + ARROW_DOWN_KEYCODE + '|' + ESCAPE_KEYCODE);

var Event$4 = {
  HIDE: 'hide' + EVENT_KEY$4,
  HIDDEN: 'hidden' + EVENT_KEY$4,
  SHOW: 'show' + EVENT_KEY$4,
  SHOWN: 'shown' + EVENT_KEY$4,
  CLICK: 'click' + EVENT_KEY$4,
  CLICK_DATA_API: 'click' + EVENT_KEY$4 + DATA_API_KEY$4,
  KEYDOWN_DATA_API: 'keydown' + EVENT_KEY$4 + DATA_API_KEY$4,
  KEYUP_DATA_API: 'keyup' + EVENT_KEY$4 + DATA_API_KEY$4
};

var ClassName$4 = {
  DISABLED: 'disabled',
  SHOW: 'show',
  DROPUP: 'dropup',
  MENURIGHT: 'dropdown-menu-right',
  MENULEFT: 'dropdown-menu-left'
};

var Selector$4 = {
  DATA_TOGGLE: '[data-toggle="dropdown"]',
  FORM_CHILD: '.dropdown form',
  MENU: '.dropdown-menu',
  NAVBAR_NAV: '.navbar-nav',
  VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
};

var AttachmentMap = {
  TOP: 'top-start',
  TOPEND: 'top-end',
  BOTTOM: 'bottom-start',
  BOTTOMEND: 'bottom-end'
};

var Default$2 = {
  placement: AttachmentMap.BOTTOM,
  offset: 0,
  flip: true
};

var DefaultType$2 = {
  placement: 'string',
  offset: '(number|string)',
  flip: 'boolean'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Dropdown = function () {
  function Dropdown(element, config) {
    classCallCheck(this, Dropdown);

    this._element = element;
    this._popper = null;
    this._config = this._getConfig(config);
    this._menu = this._getMenuElement();
    this._inNavbar = this._detectNavbar();

    this._addEventListeners();
  }

  // getters

  createClass(Dropdown, [{
    key: 'toggle',


    // public

    value: function toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);
      var isActive = $(this._menu).hasClass(ClassName$4.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      var element = this._element;
      // for dropup with alignment we use the parent as popper container
      if ($(parent).hasClass(ClassName$4.DROPUP)) {
        if ($(this._menu).hasClass(ClassName$4.MENULEFT) || $(this._menu).hasClass(ClassName$4.MENURIGHT)) {
          element = parent;
        }
      }
      this._popper = new Popper(element, this._menu, this._getPopperConfig());

      // if this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement && !$(parent).closest(Selector$4.NAVBAR_NAV).length) {
        $('body').children().on('mouseover', null, $.noop);
      }

      this._element.focus();
      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY$4);
      $(this._element).off(EVENT_KEY$4);
      this._element = null;
      this._menu = null;
      if (this._popper !== null) {
        this._popper.destroy();
      }
      this._popper = null;
    }
  }, {
    key: 'update',
    value: function update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }

    // private

  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      var _this = this;

      $(this._element).on(Event$4.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();
        _this.toggle();
      });
    }
  }, {
    key: '_getConfig',
    value: function _getConfig(config) {
      var elementData = $(this._element).data();
      if (elementData.placement !== undefined) {
        elementData.placement = AttachmentMap[elementData.placement.toUpperCase()];
      }

      config = $.extend({}, this.constructor.Default, $(this._element).data(), config);

      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      return config;
    }
  }, {
    key: '_getMenuElement',
    value: function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);
        this._menu = $(parent).find(Selector$4.MENU)[0];
      }
      return this._menu;
    }
  }, {
    key: '_getPlacement',
    value: function _getPlacement() {
      var $parentDropdown = $(this._element).parent();
      var placement = this._config.placement;

      // Handle dropup
      if ($parentDropdown.hasClass(ClassName$4.DROPUP) || this._config.placement === AttachmentMap.TOP) {
        placement = AttachmentMap.TOP;
        if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }
      return placement;
    }
  }, {
    key: '_detectNavbar',
    value: function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    }
  }, {
    key: '_getPopperConfig',
    value: function _getPopperConfig() {
      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: {
            offset: this._config.offset
          },
          flip: {
            enabled: this._config.flip
          }
        }

        // Disable Popper.js for Dropdown in Navbar
      };if (this._inNavbar) {
        popperConfig.modifiers.applyStyle = {
          enabled: !this._inNavbar
        };
      }

      return popperConfig;
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);
        var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    }
  }, {
    key: '_clearMenus',
    value: function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = $.makeArray($(Selector$4.DATA_TOGGLE));
      for (var i = 0; i < toggles.length; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);
        var context = $(toggles[i]).data(DATA_KEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;
        if (!$(parent).hasClass(ClassName$4.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);
        if (hideEvent.isDefaultPrevented()) {
          continue;
        }

        // if this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');

        $(dropdownMenu).removeClass(ClassName$4.SHOW);
        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
      }
    }
  }, {
    key: '_getParentFromElement',
    value: function _getParentFromElement(element) {
      var parent = void 0;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = $(selector)[0];
      }

      return parent || element.parentNode;
    }
  }, {
    key: '_dataApiKeydownHandler',
    value: function _dataApiKeydownHandler(event) {
      if (!REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE || /input|textarea/i.test(event.target.tagName)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);
      var isActive = $(parent).hasClass(ClassName$4.SHOW);

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

        if (event.which === ESCAPE_KEYCODE) {
          var toggle = $(parent).find(Selector$4.DATA_TOGGLE)[0];
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = $(parent).find(Selector$4.VISIBLE_ITEMS).get();

      if (!items.length) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event$4.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event$4.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler).on(Event$4.CLICK_DATA_API + ' ' + Event$4.KEYUP_DATA_API, Dropdown._clearMenus).on(Event$4.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {
        event.preventDefault();
        event.stopPropagation();
        Dropdown._jQueryInterface.call($(this), 'toggle');
      }).on(Event$4.CLICK_DATA_API, Selector$4.FORM_CHILD, function (e) {
        e.stopPropagation();
      });

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$4] = Dropdown._jQueryInterface;
      $.fn[NAME$4].Constructor = Dropdown;
      $.fn[NAME$4].noConflict = function () {
        $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
        return Dropdown._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$4;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default$2;
    }
  }, {
    key: 'DefaultType',
    get: function get$$1() {
      return DefaultType$2;
    }
  }]);
  return Dropdown;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Dropdown._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$5 = 'modal';
var VERSION$5 = '4.0.0-beta';
var DATA_KEY$5 = 'bs.modal';
var EVENT_KEY$5 = '.' + DATA_KEY$5;
var DATA_API_KEY$5 = '.data-api';
var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
var TRANSITION_DURATION$3 = 300;
var BACKDROP_TRANSITION_DURATION = 150;
var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

var Default$3 = {
  backdrop: true,
  keyboard: true,
  focus: true,
  show: true
};

var DefaultType$3 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean',
  show: 'boolean'
};

var Event$5 = {
  HIDE: 'hide' + EVENT_KEY$5,
  HIDDEN: 'hidden' + EVENT_KEY$5,
  SHOW: 'show' + EVENT_KEY$5,
  SHOWN: 'shown' + EVENT_KEY$5,
  FOCUSIN: 'focusin' + EVENT_KEY$5,
  RESIZE: 'resize' + EVENT_KEY$5,
  CLICK_DISMISS: 'click.dismiss' + EVENT_KEY$5,
  KEYDOWN_DISMISS: 'keydown.dismiss' + EVENT_KEY$5,
  MOUSEUP_DISMISS: 'mouseup.dismiss' + EVENT_KEY$5,
  MOUSEDOWN_DISMISS: 'mousedown.dismiss' + EVENT_KEY$5,
  CLICK_DATA_API: 'click' + EVENT_KEY$5 + DATA_API_KEY$5
};

var ClassName$5 = {
  SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
  BACKDROP: 'modal-backdrop',
  OPEN: 'modal-open',
  FADE: 'fade',
  SHOW: 'show'
};

var Selector$5 = {
  DIALOG: '.modal-dialog',
  DATA_TOGGLE: '[data-toggle="modal"]',
  DATA_DISMISS: '[data-dismiss="modal"]',
  FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  NAVBAR_TOGGLER: '.navbar-toggler'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Modal = function () {
  function Modal(element, config) {
    classCallCheck(this, Modal);

    this._config = this._getConfig(config);
    this._element = element;
    this._dialog = $(element).find(Selector$5.DIALOG)[0];
    this._backdrop = null;
    this._isShown = false;
    this._isBodyOverflowing = false;
    this._ignoreBackdropClick = false;
    this._originalBodyPadding = 0;
    this._scrollbarWidth = 0;
  }

  // getters

  createClass(Modal, [{
    key: 'toggle',


    // public

    value: function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
  }, {
    key: 'show',
    value: function show(relatedTarget) {
      var _this = this;

      if (this._isTransitioning) {
        return;
      }

      if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName$5.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event$5.SHOW, {
        relatedTarget: relatedTarget
      });

      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();
      this._setScrollbar();

      $(document.body).addClass(ClassName$5.OPEN);

      this._setEscapeEvent();
      this._setResizeEvent();

      $(this._element).on(Event$5.CLICK_DISMISS, Selector$5.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });

      $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    }
  }, {
    key: 'hide',
    value: function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (this._isTransitioning || !this._isShown) {
        return;
      }

      var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName$5.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      var hideEvent = $.Event(Event$5.HIDE);

      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;

      this._setEscapeEvent();
      this._setResizeEvent();

      $(document).off(Event$5.FOCUSIN);

      $(this._element).removeClass(ClassName$5.SHOW);

      $(this._element).off(Event$5.CLICK_DISMISS);
      $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);

      if (transition) {

        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(TRANSITION_DURATION$3);
      } else {
        this._hideModal();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY$5);

      $(window, document, this._element, this._backdrop).off(EVENT_KEY$5);

      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._scrollbarWidth = null;
    }
  }, {
    key: 'handleUpdate',
    value: function handleUpdate() {
      this._adjustDialog();
    }

    // private

  }, {
    key: '_getConfig',
    value: function _getConfig(config) {
      config = $.extend({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    }
  }, {
    key: '_showElement',
    value: function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName$5.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // don't move modals dom position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.scrollTop = 0;

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName$5.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event$5.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }
        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION$3);
      } else {
        transitionComplete();
      }
    }
  }, {
    key: '_enforceFocus',
    value: function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event$5.FOCUSIN) // guard against infinite focus loop
      .on(Event$5.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && !$(_this4._element).has(event.target).length) {
          _this4._element.focus();
        }
      });
    }
  }, {
    key: '_setEscapeEvent',
    value: function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE$1) {
            event.preventDefault();
            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event$5.KEYDOWN_DISMISS);
      }
    }
  }, {
    key: '_setResizeEvent',
    value: function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event$5.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event$5.RESIZE);
      }
    }
  }, {
    key: '_hideModal',
    value: function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._isTransitioning = false;
      this._showBackdrop(function () {
        $(document.body).removeClass(ClassName$5.OPEN);
        _this7._resetAdjustments();
        _this7._resetScrollbar();
        $(_this7._element).trigger(Event$5.HIDDEN);
      });
    }
  }, {
    key: '_removeBackdrop',
    value: function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    }
  }, {
    key: '_showBackdrop',
    value: function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';

      if (this._isShown && this._config.backdrop) {
        var doAnimate = Util.supportsTransitionEnd() && animate;

        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName$5.BACKDROP;

        if (animate) {
          $(this._backdrop).addClass(animate);
        }

        $(this._backdrop).appendTo(document.body);

        $(this._element).on(Event$5.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }
          if (event.target !== event.currentTarget) {
            return;
          }
          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (doAnimate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(ClassName$5.SHOW);

        if (!callback) {
          return;
        }

        if (!doAnimate) {
          callback();
          return;
        }

        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName$5.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();
          if (callback) {
            callback();
          }
        };

        if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName$5.FADE)) {
          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }

    // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------

  }, {
    key: '_adjustDialog',
    value: function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + 'px';
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + 'px';
      }
    }
  }, {
    key: '_resetAdjustments',
    value: function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    }
  }, {
    key: '_checkScrollbar',
    value: function _checkScrollbar() {
      this._isBodyOverflowing = document.body.clientWidth < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    }
  }, {
    key: '_setScrollbar',
    value: function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

        // Adjust fixed content padding
        $(Selector$5.FIXED_CONTENT).each(function (index, element) {
          var actualPadding = $(element)[0].style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + 'px');
        });

        // Adjust navbar-toggler margin
        $(Selector$5.NAVBAR_TOGGLER).each(function (index, element) {
          var actualMargin = $(element)[0].style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this9._scrollbarWidth + 'px');
        });

        // Adjust body padding
        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $('body').css('padding-right');
        $('body').data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + 'px');
      }
    }
  }, {
    key: '_resetScrollbar',
    value: function _resetScrollbar() {
      // Restore fixed content padding
      $(Selector$5.FIXED_CONTENT).each(function (index, element) {
        var padding = $(element).data('padding-right');
        if (typeof padding !== 'undefined') {
          $(element).css('padding-right', padding).removeData('padding-right');
        }
      });

      // Restore navbar-toggler margin
      $(Selector$5.NAVBAR_TOGGLER).each(function (index, element) {
        var margin = $(element).data('margin-right');
        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      });

      // Restore body padding
      var padding = $('body').data('padding-right');
      if (typeof padding !== 'undefined') {
        $('body').css('padding-right', padding).removeData('padding-right');
      }
    }
  }, {
    key: '_getScrollbarWidth',
    value: function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);
        var _config = $.extend({}, Modal.Default, $(this).data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event$5.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {
        var _this10 = this;

        var target = void 0;
        var selector = Util.getSelectorFromElement(this);

        if (selector) {
          target = $(selector)[0];
        }

        var config = $(target).data(DATA_KEY$5) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());

        if (this.tagName === 'A' || this.tagName === 'AREA') {
          event.preventDefault();
        }

        var $target = $(target).one(Event$5.SHOW, function (showEvent) {
          if (showEvent.isDefaultPrevented()) {
            // only register focus restorer if modal will actually get shown
            return;
          }

          $target.one(Event$5.HIDDEN, function () {
            if ($(_this10).is(':visible')) {
              _this10.focus();
            }
          });
        });

        Modal._jQueryInterface.call($(target), config, this);
      });

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$5] = Modal._jQueryInterface;
      $.fn[NAME$5].Constructor = Modal;
      $.fn[NAME$5].noConflict = function () {
        $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
        return Modal._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$5;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default$3;
    }
  }]);
  return Modal;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Modal._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$7 = 'tooltip';
var VERSION$7 = '4.0.0-beta';
var DATA_KEY$7 = 'bs.tooltip';
var EVENT_KEY$7 = '.' + DATA_KEY$7;
var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
var TRANSITION_DURATION$4 = 150;
var CLASS_PREFIX$1 = 'bs-tooltip';
var BSCLS_PREFIX_REGEX$1 = new RegExp('(^|\\s)' + CLASS_PREFIX$1 + '\\S+', 'g');

var DefaultType$5 = {
  animation: 'boolean',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string',
  delay: '(number|object)',
  html: 'boolean',
  selector: '(string|boolean)',
  placement: '(string|function)',
  offset: '(number|string)',
  container: '(string|element|boolean)',
  fallbackPlacement: '(string|array)'
};

var AttachmentMap$1 = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
};

var Default$5 = {
  animation: true,
  template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
  trigger: 'hover focus',
  title: '',
  delay: 0,
  html: false,
  selector: false,
  placement: 'top',
  offset: 0,
  container: false,
  fallbackPlacement: 'flip'
};

var HoverState = {
  SHOW: 'show',
  OUT: 'out'
};

var Event$7 = {
  HIDE: 'hide' + EVENT_KEY$7,
  HIDDEN: 'hidden' + EVENT_KEY$7,
  SHOW: 'show' + EVENT_KEY$7,
  SHOWN: 'shown' + EVENT_KEY$7,
  INSERTED: 'inserted' + EVENT_KEY$7,
  CLICK: 'click' + EVENT_KEY$7,
  FOCUSIN: 'focusin' + EVENT_KEY$7,
  FOCUSOUT: 'focusout' + EVENT_KEY$7,
  MOUSEENTER: 'mouseenter' + EVENT_KEY$7,
  MOUSELEAVE: 'mouseleave' + EVENT_KEY$7
};

var ClassName$7 = {
  FADE: 'fade',
  SHOW: 'show'
};

var Selector$7 = {
  TOOLTIP: '.tooltip',
  TOOLTIP_INNER: '.tooltip-inner',
  ARROW: '.arrow'
};

var Trigger = {
  HOVER: 'hover',
  FOCUS: 'focus',
  CLICK: 'click',
  MANUAL: 'manual'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Tooltip = function () {
  function Tooltip(element, config) {
    classCallCheck(this, Tooltip);


    // private
    this._isEnabled = true;
    this._timeout = 0;
    this._hoverState = '';
    this._activeTrigger = {};
    this._popper = null;

    // protected
    this.element = element;
    this.config = this._getConfig(config);
    this.tip = null;

    this._setListeners();
  }

  // getters

  createClass(Tooltip, [{
    key: 'enable',


    // public

    value: function enable() {
      this._isEnabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this._isEnabled = false;
    }
  }, {
    key: 'toggleEnabled',
    value: function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
  }, {
    key: 'toggle',
    value: function toggle(event) {
      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {

        if ($(this.getTipElement()).hasClass(ClassName$7.SHOW)) {
          this._leave(null, this);
          return;
        }

        this._enter(null, this);
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      clearTimeout(this._timeout);

      $.removeData(this.element, this.constructor.DATA_KEY);

      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;
      if (this._popper !== null) {
        this._popper.destroy();
      }
      this._popper = null;

      this.element = null;
      this.config = null;
      this.tip = null;
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);
      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);

        var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);

        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);

        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName$7.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);
        this.addAttachmentClass(attachment);

        var container = this.config.container === false ? document.body : $(this.config.container);

        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);

        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: {
              offset: this.config.offset
            },
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector$7.ARROW
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            _this._handlePopperPlacementChange(data);
          }
        });

        $(tip).addClass(ClassName$7.SHOW);

        // if this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          $('body').children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }
          var prevHoverState = _this._hoverState;
          _this._hoverState = null;

          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName$7.FADE)) {
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
        } else {
          complete();
        }
      }
    }
  }, {
    key: 'hide',
    value: function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);
      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();
        _this2.element.removeAttribute('aria-describedby');
        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);
        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName$7.SHOW);

      // if this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $('body').children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName$7.FADE)) {

        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION$4);
      } else {
        complete();
      }

      this._hoverState = '';
    }
  }, {
    key: 'update',
    value: function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }

    // protected

  }, {
    key: 'isWithContent',
    value: function isWithContent() {
      return Boolean(this.getTitle());
    }
  }, {
    key: 'addAttachmentClass',
    value: function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + '-' + attachment);
    }
  }, {
    key: 'getTipElement',
    value: function getTipElement() {
      return this.tip = this.tip || $(this.config.template)[0];
    }
  }, {
    key: 'setContent',
    value: function setContent() {
      var $tip = $(this.getTipElement());
      this.setElementContent($tip.find(Selector$7.TOOLTIP_INNER), this.getTitle());
      $tip.removeClass(ClassName$7.FADE + ' ' + ClassName$7.SHOW);
    }
  }, {
    key: 'setElementContent',
    value: function setElementContent($element, content) {
      var html = this.config.html;
      if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object' && (content.nodeType || content.jquery)) {
        // content is a DOM node or a jQuery
        if (html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }
      } else {
        $element[html ? 'html' : 'text'](content);
      }
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    }

    // private

  }, {
    key: '_getAttachment',
    value: function _getAttachment(placement) {
      return AttachmentMap$1[placement.toUpperCase()];
    }
  }, {
    key: '_setListeners',
    value: function _setListeners() {
      var _this3 = this;

      var triggers = this.config.trigger.split(' ');

      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, function (event) {
            return _this3.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;

          $(_this3.element).on(eventIn, _this3.config.selector, function (event) {
            return _this3._enter(event);
          }).on(eventOut, _this3.config.selector, function (event) {
            return _this3._leave(event);
          });
        }

        $(_this3.element).closest('.modal').on('hide.bs.modal', function () {
          return _this3.hide();
        });
      });

      if (this.config.selector) {
        this.config = $.extend({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    }
  }, {
    key: '_fixTitle',
    value: function _fixTitle() {
      var titleType = _typeof(this.element.getAttribute('data-original-title'));
      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    }
  }, {
    key: '_enter',
    value: function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;

      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName$7.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);

      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    }
  }, {
    key: '_leave',
    value: function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;

      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);

      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    }
  }, {
    key: '_isWithActiveTrigger',
    value: function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: '_getConfig',
    value: function _getConfig(config) {
      config = $.extend({}, this.constructor.Default, $(this.element).data(), config);

      if (config.delay && typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (config.title && typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (config.content && typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$7, config, this.constructor.DefaultType);

      return config;
    }
  }, {
    key: '_getDelegateConfig',
    value: function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    }
  }, {
    key: '_cleanTipClass',
    value: function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }
  }, {
    key: '_handlePopperPlacementChange',
    value: function _handlePopperPlacementChange(data) {
      this._cleanTipClass();
      this.addAttachmentClass(this._getAttachment(data.placement));
    }
  }, {
    key: '_fixTransition',
    value: function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;
      if (tip.getAttribute('x-placement') !== null) {
        return;
      }
      $(tip).removeClass(ClassName$7.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);
        var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$7] = Tooltip._jQueryInterface;
      $.fn[NAME$7].Constructor = Tooltip;
      $.fn[NAME$7].noConflict = function () {
        $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
        return Tooltip._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$7;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default$5;
    }
  }, {
    key: 'NAME',
    get: function get$$1() {
      return NAME$7;
    }
  }, {
    key: 'DATA_KEY',
    get: function get$$1() {
      return DATA_KEY$7;
    }
  }, {
    key: 'Event',
    get: function get$$1() {
      return Event$7;
    }
  }, {
    key: 'EVENT_KEY',
    get: function get$$1() {
      return EVENT_KEY$7;
    }
  }, {
    key: 'DefaultType',
    get: function get$$1() {
      return DefaultType$5;
    }
  }]);
  return Tooltip;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Tooltip._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$6 = 'popover';
var VERSION$6 = '4.0.0-beta';
var DATA_KEY$6 = 'bs.popover';
var EVENT_KEY$6 = '.' + DATA_KEY$6;
var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
var CLASS_PREFIX = 'bs-popover';
var BSCLS_PREFIX_REGEX = new RegExp('(^|\\s)' + CLASS_PREFIX + '\\S+', 'g');

var Default$4 = $.extend({}, Tooltip.Default, {
  placement: 'right',
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
});

var DefaultType$4 = $.extend({}, Tooltip.DefaultType, {
  content: '(string|element|function)'
});

var ClassName$6 = {
  FADE: 'fade',
  SHOW: 'show'
};

var Selector$6 = {
  TITLE: '.popover-header',
  CONTENT: '.popover-body'
};

var Event$6 = {
  HIDE: 'hide' + EVENT_KEY$6,
  HIDDEN: 'hidden' + EVENT_KEY$6,
  SHOW: 'show' + EVENT_KEY$6,
  SHOWN: 'shown' + EVENT_KEY$6,
  INSERTED: 'inserted' + EVENT_KEY$6,
  CLICK: 'click' + EVENT_KEY$6,
  FOCUSIN: 'focusin' + EVENT_KEY$6,
  FOCUSOUT: 'focusout' + EVENT_KEY$6,
  MOUSEENTER: 'mouseenter' + EVENT_KEY$6,
  MOUSELEAVE: 'mouseleave' + EVENT_KEY$6

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Popover = function (_Tooltip) {
  inherits(Popover, _Tooltip);

  function Popover() {
    classCallCheck(this, Popover);
    return possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).apply(this, arguments));
  }

  createClass(Popover, [{
    key: 'isWithContent',


    // overrides

    value: function isWithContent() {
      return this.getTitle() || this._getContent();
    }
  }, {
    key: 'addAttachmentClass',
    value: function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + '-' + attachment);
    }
  }, {
    key: 'getTipElement',
    value: function getTipElement() {
      return this.tip = this.tip || $(this.config.template)[0];
    }
  }, {
    key: 'setContent',
    value: function setContent() {
      var $tip = $(this.getTipElement());

      // we use append for html objects to maintain js events
      this.setElementContent($tip.find(Selector$6.TITLE), this.getTitle());
      this.setElementContent($tip.find(Selector$6.CONTENT), this._getContent());

      $tip.removeClass(ClassName$6.FADE + ' ' + ClassName$6.SHOW);
    }

    // private

  }, {
    key: '_getContent',
    value: function _getContent() {
      return this.element.getAttribute('data-content') || (typeof this.config.content === 'function' ? this.config.content.call(this.element) : this.config.content);
    }
  }, {
    key: '_cleanTipClass',
    value: function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);
        var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

        if (!data && /destroy|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$6] = Popover._jQueryInterface;
      $.fn[NAME$6].Constructor = Popover;
      $.fn[NAME$6].noConflict = function () {
        $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
        return Popover._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',


    // getters

    get: function get$$1() {
      return VERSION$6;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default$4;
    }
  }, {
    key: 'NAME',
    get: function get$$1() {
      return NAME$6;
    }
  }, {
    key: 'DATA_KEY',
    get: function get$$1() {
      return DATA_KEY$6;
    }
  }, {
    key: 'Event',
    get: function get$$1() {
      return Event$6;
    }
  }, {
    key: 'EVENT_KEY',
    get: function get$$1() {
      return EVENT_KEY$6;
    }
  }, {
    key: 'DefaultType',
    get: function get$$1() {
      return DefaultType$4;
    }
  }]);
  return Popover;
}(Tooltip);

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Popover._init();
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$8 = 'scrollspy';
var VERSION$8 = '4.0.0-beta';
var DATA_KEY$8 = 'bs.scrollspy';
var EVENT_KEY$8 = '.' + DATA_KEY$8;
var DATA_API_KEY$6 = '.data-api';
var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];

var Default$6 = {
  offset: 10,
  method: 'auto',
  target: ''
};

var DefaultType$6 = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
};

var Event$8 = {
  ACTIVATE: 'activate' + EVENT_KEY$8,
  SCROLL: 'scroll' + EVENT_KEY$8,
  LOAD_DATA_API: 'load' + EVENT_KEY$8 + DATA_API_KEY$6
};

var ClassName$8 = {
  DROPDOWN_ITEM: 'dropdown-item',
  DROPDOWN_MENU: 'dropdown-menu',
  ACTIVE: 'active'
};

var Selector$8 = {
  DATA_SPY: '[data-spy="scroll"]',
  ACTIVE: '.active',
  NAV_LIST_GROUP: '.nav, .list-group',
  NAV_LINKS: '.nav-link',
  LIST_ITEMS: '.list-group-item',
  DROPDOWN: '.dropdown',
  DROPDOWN_ITEMS: '.dropdown-item',
  DROPDOWN_TOGGLE: '.dropdown-toggle'
};

var OffsetMethod = {
  OFFSET: 'offset',
  POSITION: 'position'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var ScrollSpy = function () {
  function ScrollSpy(element, config) {
    var _this = this;

    classCallCheck(this, ScrollSpy);

    this._element = element;
    this._scrollElement = element.tagName === 'BODY' ? window : element;
    this._config = this._getConfig(config);
    this._selector = this._config.target + ' ' + Selector$8.NAV_LINKS + ',' + (this._config.target + ' ' + Selector$8.LIST_ITEMS + ',') + (this._config.target + ' ' + Selector$8.DROPDOWN_ITEMS);
    this._offsets = [];
    this._targets = [];
    this._activeTarget = null;
    this._scrollHeight = 0;

    $(this._scrollElement).on(Event$8.SCROLL, function (event) {
      return _this._process(event);
    });

    this.refresh();
    this._process();
  }

  // getters

  createClass(ScrollSpy, [{
    key: 'refresh',


    // public

    value: function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement !== this._scrollElement.window ? OffsetMethod.POSITION : OffsetMethod.OFFSET;

      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;

      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;

      this._offsets = [];
      this._targets = [];

      this._scrollHeight = this._getScrollHeight();

      var targets = $.makeArray($(this._selector));

      targets.map(function (element) {
        var target = void 0;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = $(targetSelector)[0];
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) {
            // todo (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }
        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);
        _this2._targets.push(item[1]);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY$8);
      $(this._scrollElement).off(EVENT_KEY$8);

      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }

    // private

  }, {
    key: '_getConfig',
    value: function _getConfig(config) {
      config = $.extend({}, Default$6, config);

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');
        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }
        config.target = '#' + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);

      return config;
    }
  }, {
    key: '_getScrollTop',
    value: function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }
  }, {
    key: '_getScrollHeight',
    value: function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
  }, {
    key: '_getOffsetHeight',
    value: function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }
  }, {
    key: '_process',
    value: function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;
      var scrollHeight = this._getScrollHeight();
      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }
        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;
        this._clear();
        return;
      }

      for (var i = this._offsets.length; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (this._offsets[i + 1] === undefined || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }
  }, {
    key: '_activate',
    value: function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',');
      queries = queries.map(function (selector) {
        return selector + '[data-target="' + target + '"],' + (selector + '[href="' + target + '"]');
      });

      var $link = $(queries.join(','));

      if ($link.hasClass(ClassName$8.DROPDOWN_ITEM)) {
        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWN_TOGGLE).addClass(ClassName$8.ACTIVE);
        $link.addClass(ClassName$8.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName$8.ACTIVE);
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_LINKS + ', ' + Selector$8.LIST_ITEMS).addClass(ClassName$8.ACTIVE);
      }

      $(this._scrollElement).trigger(Event$8.ACTIVATE, {
        relatedTarget: target
      });
    }
  }, {
    key: '_clear',
    value: function _clear() {
      $(this._selector).filter(Selector$8.ACTIVE).removeClass(ClassName$8.ACTIVE);
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$8);
        var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$8] = ScrollSpy._jQueryInterface;
      $.fn[NAME$8].Constructor = ScrollSpy;
      $.fn[NAME$8].noConflict = function () {
        $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
        return ScrollSpy._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$8;
    }
  }, {
    key: 'Default',
    get: function get$$1() {
      return Default$6;
    }
  }]);
  return ScrollSpy;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    ScrollSpy._init();
  });

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(window).on(Event$8.LOAD_DATA_API, function () {
    var scrollSpys = $.makeArray($(Selector$8.DATA_SPY));

    for (var i = scrollSpys.length; i--;) {
      var $spy = $(scrollSpys[i]);
      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME$9 = 'tab';
var VERSION$9 = '4.0.0-beta';
var DATA_KEY$9 = 'bs.tab';
var EVENT_KEY$9 = '.' + DATA_KEY$9;
var DATA_API_KEY$7 = '.data-api';
var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
var TRANSITION_DURATION$5 = 150;

var Event$9 = {
  HIDE: 'hide' + EVENT_KEY$9,
  HIDDEN: 'hidden' + EVENT_KEY$9,
  SHOW: 'show' + EVENT_KEY$9,
  SHOWN: 'shown' + EVENT_KEY$9,
  CLICK_DATA_API: 'click' + EVENT_KEY$9 + DATA_API_KEY$7
};

var ClassName$9 = {
  DROPDOWN_MENU: 'dropdown-menu',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  FADE: 'fade',
  SHOW: 'show'
};

var Selector$9 = {
  DROPDOWN: '.dropdown',
  NAV_LIST_GROUP: '.nav, .list-group',
  ACTIVE: '.active',
  ACTIVE_UL: '> li > .active',
  DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
  DROPDOWN_TOGGLE: '.dropdown-toggle',
  DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Tab = function () {
  function Tab(element) {
    classCallCheck(this, Tab);

    this._element = element;
  }

  // getters

  createClass(Tab, [{
    key: 'show',


    // public

    value: function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName$9.ACTIVE) || $(this._element).hasClass(ClassName$9.DISABLED)) {
        return;
      }

      var target = void 0;
      var previous = void 0;
      var listElement = $(this._element).closest(Selector$9.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event$9.HIDE, {
        relatedTarget: this._element
      });

      var showEvent = $.Event(Event$9.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = $(selector)[0];
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event$9.HIDDEN, {
          relatedTarget: _this._element
        });

        var shownEvent = $.Event(Event$9.SHOWN, {
          relatedTarget: previous
        });

        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    }

    // private

  }, {
    key: '_activate',
    value: function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = void 0;
      if (container.nodeName === 'UL') {
        activeElements = $(container).find(Selector$9.ACTIVE_UL);
      } else {
        activeElements = $(container).children(Selector$9.ACTIVE);
      }

      var active = activeElements[0];
      var isTransitioning = callback && Util.supportsTransitionEnd() && active && $(active).hasClass(ClassName$9.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, isTransitioning, callback);
      };

      if (active && isTransitioning) {
        $(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION$5);
      } else {
        complete();
      }

      if (active) {
        $(active).removeClass(ClassName$9.SHOW);
      }
    }
  }, {
    key: '_transitionComplete',
    value: function _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName$9.ACTIVE);

        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName$9.ACTIVE);
        }

        active.setAttribute('aria-expanded', false);
      }

      $(element).addClass(ClassName$9.ACTIVE);
      element.setAttribute('aria-expanded', true);

      if (isTransitioning) {
        Util.reflow(element);
        $(element).addClass(ClassName$9.SHOW);
      } else {
        $(element).removeClass(ClassName$9.FADE);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWN_MENU)) {

        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];
        if (dropdownElement) {
          $(dropdownElement).find(Selector$9.DROPDOWN_TOGGLE).addClass(ClassName$9.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$9, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      $(document).on(Event$9.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {
        event.preventDefault();
        Tab._jQueryInterface.call($(this), 'show');
      });

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      $.fn[NAME$9] = Tab._jQueryInterface;
      $.fn[NAME$9].Constructor = Tab;
      $.fn[NAME$9].noConflict = function () {
        $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
        return Tab._jQueryInterface;
      };
    }
  }, {
    key: 'VERSION',
    get: function get$$1() {
      return VERSION$9;
    }
  }]);
  return Tab;
}();

if (!Util.nodeEnv()) {
  $(document).ready(function () {
    Tab._init();
  });
}

exports.Util = Util;
exports.Alert = Alert;
exports.Button = Button;
exports.Carousel = Carousel;
exports.Collapse = Collapse;
exports.Dropdown = Dropdown;
exports.Modal = Modal;
exports.Popover = Popover;
exports.Scrollspy = ScrollSpy;
exports.Tab = Tab;
exports.Tooltip = Tooltip;

Object.defineProperty(exports, '__esModule', { value: true });

})));
