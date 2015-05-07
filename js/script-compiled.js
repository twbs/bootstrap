'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

/**
 * --------------------------------------------------------------------------
 * Constants
 * --------------------------------------------------------------------------
 */

var NAME = 'alert';
var VERSION = '4.0.0';
var DATA_KEY = 'bs.alert';
var JQUERY_NO_CONFLICT = $.fn[NAME];
var TRANSITION_DURATION = 150;

var Selector = {
  DISMISS: '[data-dismiss="alert"]'
};

var Event = {
  CLOSE: 'close.bs.alert',
  CLOSED: 'closed.bs.alert',
  CLICK: 'click.bs.alert.data-api'
};

var ClassName = {
  ALERT: 'alert',
  FADE: 'fade',
  IN: 'in'
};

/**
 * --------------------------------------------------------------------------
 * Class Definition
 * --------------------------------------------------------------------------
 */

var Alert = (function () {
  function Alert(element) {
    _classCallCheck(this, Alert);

    if (element) {
      this.element = element;
    }
  }

  _createClass(Alert, [{
    key: 'close',

    // public

    value: function close(element) {
      var rootElement = this._getRootElement(element);
      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    }
  }, {
    key: '_getRootElement',

    // private

    value: function _getRootElement(element) {
      var parent = false;
      var selector = _util2['default'].getSelectorFromElement(element);

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
      $(element).removeClass(ClassName.IN);

      if (!_util2['default'].supportsTransitionEnd() || !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);
        return;
      }

      $(element).one(_util2['default'].TRANSITION_END, this._destroyElement.bind(this, element)).emulateTransitionEnd(TRANSITION_DURATION);
    }
  }, {
    key: '_destroyElement',
    value: function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    }
  }], [{
    key: '_jQueryInterface',

    // static

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
  }]);

  return Alert;
})();

exports.Alert = Alert;

/**
 * --------------------------------------------------------------------------
 * Data Api implementation
 * --------------------------------------------------------------------------
 */

$(document).on(Event.CLICK, Selector.DISMISS, Alert._handleDismiss(new Alert()));

/**
 * --------------------------------------------------------------------------
 * jQuery
 * --------------------------------------------------------------------------
 */

$.fn[NAME] = Alert._jQueryInterface;
$.fn[NAME].Constructor = Alert;
$.fn[NAME].noConflict = function () {
  $.fn[NAME] = Alert._JQUERY_NO_CONFLICT;
  return Alert._jQueryInterface;
};
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

var Util = {

  TRANSITION_END: 'bsTransitionEnd',

  getUID: function getUID(prefix) {
    do prefix += ~ ~(Math.random() * 1000000); while (document.getElementById(prefix));
    return prefix;
  },

  getSelectorFromElement: function getSelectorFromElement(element) {
    var selector = element.getAttribute('data-target');

    if (!selector) {
      selector = element.getAttribute('href') || '';
      selector = /^#[a-z]/i.test(selector) ? selector : null;
    }

    return selector;
  },

  reflow: function reflow(element) {
    new Function('bs', 'return bs')(element.offsetHeight);
  },

  supportsTransitionEnd: function supportsTransitionEnd() {
    return !!transition;
  }

};

exports['default'] = Util;

/**
 * --------------------------------------------------------------------------
 * Private TransitionEnd Helpers
 * --------------------------------------------------------------------------
 */

var transition = false;

var TransitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
  transition: 'transitionend'
};

function getSpecialTransitionEndEvent() {
  return {
    bindType: transition.end,
    delegateType: transition.end,
    handle: function handle(event) {
      if ($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments);
      }
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
      return { end: TransitionEndEvent[name] };
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
      $(_this).trigger(transition.end);
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

setTransitionEndSupport();
module.exports = exports['default'];
