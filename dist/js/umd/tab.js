(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './util'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./util'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Util);
    global.tab = mod.exports;
  }
})(this, function (exports, module, _util) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Util = _interopRequire(_util);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Tab = (function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'tab';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.tab';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 150;

    var Event = {
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + '' + DATA_API_KEY
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
      LI_DROPDOWN: 'li.dropdown',
      UL: 'ul:not(.dropdown-menu)',
      FADE_CHILD: '> .fade',
      ACTIVE: '.active',
      ACTIVE_CHILD: '> .active',
      DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
      DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu > .active'
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

      _createClass(Tab, [{
        key: 'show',

        // public

        value: function show() {
          var _this = this;

          if (this._element.parentNode && this._element.parentNode.nodeType == Node.ELEMENT_NODE && $(this._element).parent().hasClass(ClassName.ACTIVE)) {
            return;
          }

          var target = undefined;
          var previous = undefined;
          var ulElement = $(this._element).closest(Selector.UL)[0];
          var selector = _Util.getSelectorFromElement(this._element);

          if (ulElement) {
            previous = $.makeArray($(ulElement).find(Selector.ACTIVE));
            previous = previous[previous.length - 1];

            if (previous) {
              previous = $(previous).find(Selector.A)[0];
            }
          }

          var hideEvent = $.Event(Event.HIDE, {
            relatedTarget: this._element
          });

          var showEvent = $.Event(Event.SHOW, {
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

          this._activate($(this._element).closest(Selector.LI)[0], ulElement);

          var complete = function complete() {
            var hiddenEvent = $.Event(Event.HIDDEN, {
              relatedTarget: _this._element
            });

            var shownEvent = $.Event(Event.SHOWN, {
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
          $.removeClass(this._element, DATA_KEY);
          this._element = null;
        }
      }, {
        key: '_activate',

        // private

        value: function _activate(element, container, callback) {
          var active = $(container).find(Selector.ACTIVE_CHILD)[0];
          var isTransitioning = callback && _Util.supportsTransitionEnd() && (active && $(active).hasClass(ClassName.FADE) || !!$(container).find(Selector.FADE_CHILD)[0]);

          var complete = $.proxy(this._transitionComplete, this, element, active, isTransitioning, callback);

          if (active && isTransitioning) {
            $(active).one(_Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            complete();
          }

          if (active) {
            $(active).removeClass(ClassName.IN);
          }
        }
      }, {
        key: '_transitionComplete',
        value: function _transitionComplete(element, active, isTransitioning, callback) {
          if (active) {
            $(active).removeClass(ClassName.ACTIVE);

            var dropdownChild = $(active).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];
            if (dropdownChild) {
              $(dropdownChild).removeClass(ClassName.ACTIVE);
            }

            var activeToggle = $(active).find(Selector.DATA_TOGGLE)[0];
            if (activeToggle) {
              activeToggle.setAttribute('aria-expanded', false);
            }
          }

          $(element).addClass(ClassName.ACTIVE);

          var elementToggle = $(element).find(Selector.DATA_TOGGLE)[0];
          if (elementToggle) {
            elementToggle.setAttribute('aria-expanded', true);
          }

          if (isTransitioning) {
            _Util.reflow(element);
            $(element).addClass(ClassName.IN);
          } else {
            $(element).removeClass(ClassName.FADE);
          }

          if (element.parentNode && $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

            var dropdownElement = $(element).closest(Selector.LI_DROPDOWN)[0];
            if (dropdownElement) {
              $(dropdownElement).addClass(ClassName.ACTIVE);
            }

            elementToggle = $(element).find(Selector.DATA_TOGGLE)[0];
            if (elementToggle) {
              elementToggle.setAttribute('aria-expanded', true);
            }
          }

          if (callback) {
            callback();
          }
        }
      }], [{
        key: 'VERSION',

        // getters

        get: function () {
          return VERSION;
        }
      }, {
        key: 'Default',
        get: function () {
          return Default;
        }
      }, {
        key: '_jQueryInterface',

        // static

        value: function _jQueryInterface(config) {
          return this.each(function () {
            var $this = $(this);
            var data = $this.data(DATA_KEY);

            if (!data) {
              data = data = new Tab(this);
              $this.data(DATA_KEY, data);
            }

            if (typeof config === 'string') {
              data[config]();
            }
          });
        }
      }]);

      return Tab;
    })();

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault();
      Tab._jQueryInterface.call($(this), 'show');
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Tab._jQueryInterface;
    $.fn[NAME].Constructor = Tab;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tab._jQueryInterface;
    };

    return Tab;
  })(jQuery);

  module.exports = Tab;
});