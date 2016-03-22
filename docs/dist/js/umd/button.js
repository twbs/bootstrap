(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'jquery'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.$);
    global.button = mod.exports;
  }
})(this, function (exports, module, _jquery) {
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _$ = _interopRequireDefault(_jquery);

  var Button = (function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'button';
    var VERSION = '4.0.0-alpha.2';
    var DATA_KEY = 'bs.button';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = _$['default'].fn[NAME];

    var ClassName = {
      ACTIVE: 'active',
      BUTTON: 'btn',
      FOCUS: 'focus'
    };

    var Selector = {
      DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
      DATA_TOGGLE: '[data-toggle="buttons"]',
      INPUT: 'input',
      ACTIVE: '.active',
      BUTTON: '.btn'
    };

    var Event = {
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
      FOCUS_BLUR_DATA_API: 'focus' + EVENT_KEY + DATA_API_KEY + ' ' + ('blur' + EVENT_KEY + DATA_API_KEY)
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Button = (function () {
      function Button(element) {
        _classCallCheck(this, Button);

        this._element = element;
      }

      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Button, [{
        key: 'toggle',

        // public

        value: function toggle() {
          var triggerChangeEvent = true;
          var rootElement = (0, _$['default'])(this._element).closest(Selector.DATA_TOGGLE)[0];

          if (rootElement) {
            var input = (0, _$['default'])(this._element).find(Selector.INPUT)[0];

            if (input) {
              if (input.type === 'radio') {
                if (input.checked && (0, _$['default'])(this._element).hasClass(ClassName.ACTIVE)) {
                  triggerChangeEvent = false;
                } else {
                  var activeElement = (0, _$['default'])(rootElement).find(Selector.ACTIVE)[0];

                  if (activeElement) {
                    (0, _$['default'])(activeElement).removeClass(ClassName.ACTIVE);
                  }
                }
              }

              if (triggerChangeEvent) {
                input.checked = !(0, _$['default'])(this._element).hasClass(ClassName.ACTIVE);
                (0, _$['default'])(this._element).trigger('change');
              }

              input.focus();
            }
          } else {
            this._element.setAttribute('aria-pressed', !(0, _$['default'])(this._element).hasClass(ClassName.ACTIVE));
          }

          if (triggerChangeEvent) {
            (0, _$['default'])(this._element).toggleClass(ClassName.ACTIVE);
          }
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          _$['default'].removeData(this._element, DATA_KEY);
          this._element = null;
        }

        // static

      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
          return this.each(function () {
            var data = (0, _$['default'])(this).data(DATA_KEY);

            if (!data) {
              data = new Button(this);
              (0, _$['default'])(this).data(DATA_KEY, data);
            }

            if (config === 'toggle') {
              data[config]();
            }
          });
        }
      }, {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        }
      }]);

      return Button;
    })();

    (0, _$['default'])(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
      event.preventDefault();

      var button = event.target;

      if (!(0, _$['default'])(button).hasClass(ClassName.BUTTON)) {
        button = (0, _$['default'])(button).closest(Selector.BUTTON);
      }

      Button._jQueryInterface.call((0, _$['default'])(button), 'toggle');
    }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
      var button = (0, _$['default'])(event.target).closest(Selector.BUTTON)[0];
      (0, _$['default'])(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    _$['default'].fn[NAME] = Button._jQueryInterface;
    _$['default'].fn[NAME].Constructor = Button;
    _$['default'].fn[NAME].noConflict = function () {
      _$['default'].fn[NAME] = JQUERY_NO_CONFLICT;
      return Button._jQueryInterface;
    };

    return Button;
  })(jQuery);

  module.exports = Button;
});
