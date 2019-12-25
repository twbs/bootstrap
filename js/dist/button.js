/*!
  * Bootstrap button.js v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./dom/data.js'), require('./dom/event-handler.js'), require('./dom/selector-engine.js')) :
  typeof define === 'function' && define.amd ? define(['./dom/data.js', './dom/event-handler.js', './dom/selector-engine.js'], factory) :
  (global = global || self, global.Button = factory(global.Data, global.EventHandler, global.SelectorEngine));
}(this, (function (Data, EventHandler, SelectorEngine) { 'use strict';

  Data = Data && Object.prototype.hasOwnProperty.call(Data, 'default') ? Data['default'] : Data;
  EventHandler = EventHandler && Object.prototype.hasOwnProperty.call(EventHandler, 'default') ? EventHandler['default'] : EventHandler;
  SelectorEngine = SelectorEngine && Object.prototype.hasOwnProperty.call(SelectorEngine, 'default') ? SelectorEngine['default'] : SelectorEngine;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var getjQuery = function getjQuery() {
    var _window = window,
        jQuery = _window.jQuery;

    if (jQuery && !document.body.hasAttribute('data-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'button';
  var VERSION = '4.3.1';
  var DATA_KEY = 'bs.button';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var CLASS_NAME_ACTIVE = 'active';
  var CLASS_NAME_BUTTON = 'btn';
  var CLASS_NAME_DISABLED = 'disabled';
  var CLASS_NAME_FOCUS = 'focus';
  var SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]';
  var SELECTOR_DATA_TOGGLE = '[data-toggle="buttons"]';
  var SELECTOR_INPUT = 'input:not([type="hidden"])';
  var SELECTOR_ACTIVE = '.active';
  var SELECTOR_BUTTON = '.btn';
  var EVENT_CLICK_DATA_API = "click" + EVENT_KEY + DATA_API_KEY;
  var EVENT_FOCUS_DATA_API = "focus" + EVENT_KEY + DATA_API_KEY;
  var EVENT_BLUR_DATA_API = "blur" + EVENT_KEY + DATA_API_KEY;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Button = /*#__PURE__*/function () {
    function Button(element) {
      this._element = element;
      Data.setData(element, DATA_KEY, this);
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = SelectorEngine.closest(this._element, SELECTOR_DATA_TOGGLE);

      if (rootElement) {
        var input = SelectorEngine.findOne(SELECTOR_INPUT, this._element);

        if (input && input.type === 'radio') {
          if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
            triggerChangeEvent = false;
          } else {
            var activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE, rootElement);

            if (activeElement) {
              activeElement.classList.remove(CLASS_NAME_ACTIVE);
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains(CLASS_NAME_DISABLED) || rootElement.classList.contains(CLASS_NAME_DISABLED)) {
              return;
            }

            input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE);
            EventHandler.trigger(input, 'change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE));
      }

      if (triggerChangeEvent) {
        this._element.classList.toggle(CLASS_NAME_ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      Data.removeData(this._element, DATA_KEY);
      this._element = null;
    } // Static
    ;

    Button.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = Data.getData(this, DATA_KEY);

        if (!data) {
          data = new Button(this);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    Button.getInstance = function getInstance(element) {
      return Data.getData(element, DATA_KEY);
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!button.classList.contains(CLASS_NAME_BUTTON)) {
      button = SelectorEngine.closest(button, SELECTOR_BUTTON);
    }

    var data = Data.getData(button, DATA_KEY);

    if (!data) {
      data = new Button(button);
    }

    data.toggle();
  });
  EventHandler.on(document, EVENT_FOCUS_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    var button = SelectorEngine.closest(event.target, SELECTOR_BUTTON);

    if (button) {
      button.classList.add(CLASS_NAME_FOCUS);
    }
  });
  EventHandler.on(document, EVENT_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    var button = SelectorEngine.closest(event.target, SELECTOR_BUTTON);

    if (button) {
      button.classList.remove(CLASS_NAME_FOCUS);
    }
  });
  var $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .button to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Button.jQueryInterface;
    $.fn[NAME].Constructor = Button;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Button.jQueryInterface;
    };
  }

  return Button;

})));
//# sourceMappingURL=button.js.map
