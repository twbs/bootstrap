(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './util', 'jquery'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./util'), require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Util, global.$);
    global.tab = mod.exports;
  }
})(this, function (exports, module, _util, _jquery) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Util = _interopRequireDefault(_util);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var _$ = _interopRequireDefault(_jquery);

  var Tab = (function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'tab';
    var VERSION = '4.0.0-alpha.2';
    var DATA_KEY = 'bs.tab';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = _$['default'].fn[NAME];
    var TRANSITION_DURATION = 150;

    var Event = {
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
    };

    var ClassName = {
      DROPDOWN_MENU: 'dropdown-menu',
      ACTIVE: 'active',
      FADE: 'fade',
      IN: 'in'
    };

    var Selector = {
      A: 'a',
      LI: 'li',
      DROPDOWN: '.dropdown',
      UL: 'ul:not(.dropdown-menu)',
      FADE_CHILD: '> .nav-item .fade, > .fade',
      ACTIVE: '.active',
      ACTIVE_CHILD: '> .nav-item > .active, > .active',
      DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
      DROPDOWN_TOGGLE: '.dropdown-toggle',
      DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Tab = (function () {
      function Tab(element) {
        _classCallCheck(this, Tab);

        this._element = element;
      }

      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Tab, [{
        key: 'show',

        // public

        value: function show() {
          var _this = this;

          if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && (0, _$['default'])(this._element).hasClass(ClassName.ACTIVE)) {
            return;
          }

          var target = undefined;
          var previous = undefined;
          var ulElement = (0, _$['default'])(this._element).closest(Selector.UL)[0];
          var selector = _Util['default'].getSelectorFromElement(this._element);

          if (ulElement) {
            previous = _$['default'].makeArray((0, _$['default'])(ulElement).find(Selector.ACTIVE));
            previous = previous[previous.length - 1];
          }

          var hideEvent = _$['default'].Event(Event.HIDE, {
            relatedTarget: this._element
          });

          var showEvent = _$['default'].Event(Event.SHOW, {
            relatedTarget: previous
          });

          if (previous) {
            (0, _$['default'])(previous).trigger(hideEvent);
          }

          (0, _$['default'])(this._element).trigger(showEvent);

          if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
            return;
          }

          if (selector) {
            target = (0, _$['default'])(selector)[0];
          }

          this._activate(this._element, ulElement);

          var complete = function complete() {
            var hiddenEvent = _$['default'].Event(Event.HIDDEN, {
              relatedTarget: _this._element
            });

            var shownEvent = _$['default'].Event(Event.SHOWN, {
              relatedTarget: previous
            });

            (0, _$['default'])(previous).trigger(hiddenEvent);
            (0, _$['default'])(_this._element).trigger(shownEvent);
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
          _$['default'].removeClass(this._element, DATA_KEY);
          this._element = null;
        }

        // private

      }, {
        key: '_activate',
        value: function _activate(element, container, callback) {
          var active = (0, _$['default'])(container).find(Selector.ACTIVE_CHILD)[0];
          var isTransitioning = callback && _Util['default'].supportsTransitionEnd() && (active && (0, _$['default'])(active).hasClass(ClassName.FADE) || Boolean((0, _$['default'])(container).find(Selector.FADE_CHILD)[0]));

          var complete = _$['default'].proxy(this._transitionComplete, this, element, active, isTransitioning, callback);

          if (active && isTransitioning) {
            (0, _$['default'])(active).one(_Util['default'].TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            complete();
          }

          if (active) {
            (0, _$['default'])(active).removeClass(ClassName.IN);
          }
        }
      }, {
        key: '_transitionComplete',
        value: function _transitionComplete(element, active, isTransitioning, callback) {
          if (active) {
            (0, _$['default'])(active).removeClass(ClassName.ACTIVE);

            var dropdownChild = (0, _$['default'])(active).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

            if (dropdownChild) {
              (0, _$['default'])(dropdownChild).removeClass(ClassName.ACTIVE);
            }

            active.setAttribute('aria-expanded', false);
          }

          (0, _$['default'])(element).addClass(ClassName.ACTIVE);
          element.setAttribute('aria-expanded', true);

          if (isTransitioning) {
            _Util['default'].reflow(element);
            (0, _$['default'])(element).addClass(ClassName.IN);
          } else {
            (0, _$['default'])(element).removeClass(ClassName.FADE);
          }

          if (element.parentNode && (0, _$['default'])(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

            var dropdownElement = (0, _$['default'])(element).closest(Selector.DROPDOWN)[0];
            if (dropdownElement) {
              (0, _$['default'])(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
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
            var $this = (0, _$['default'])(this);
            var data = $this.data(DATA_KEY);

            if (!data) {
              data = data = new Tab(this);
              $this.data(DATA_KEY, data);
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
        key: 'VERSION',
        get: function get() {
          return VERSION;
        }
      }]);

      return Tab;
    })();

    (0, _$['default'])(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault();
      Tab._jQueryInterface.call((0, _$['default'])(this), 'show');
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    _$['default'].fn[NAME] = Tab._jQueryInterface;
    _$['default'].fn[NAME].Constructor = Tab;
    _$['default'].fn[NAME].noConflict = function () {
      _$['default'].fn[NAME] = JQUERY_NO_CONFLICT;
      return Tab._jQueryInterface;
    };

    return Tab;
  })(jQuery);

  module.exports = Tab;
});
