'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
      var selector = Util.getSelectorFromElement(element);

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

      if (!Util.supportsTransitionEnd() || !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);
        return;
      }

      $(element).one(Util.TRANSITION_END, this._destroyElement.bind(this, element)).emulateTransitionEnd(TRANSITION_DURATION);
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
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
//# sourceMappingURL=alert.js.map