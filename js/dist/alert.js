import $ from 'jquery';
import Util from './util';

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
    babelHelpers.classCallCheck(this, Alert);

    this._element = element;
  }

  // getters

  babelHelpers.createClass(Alert, [{
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
    key: 'VERSION',
    get: function get() {
      return VERSION;
    }
  }]);
  return Alert;
}();

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

export default Alert;
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
//# sourceMappingURL=alert.js.map