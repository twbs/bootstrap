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
    global.dropdown = mod.exports;
  }
})(this, function (exports, module, _util, _jquery) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Util = _interopRequireDefault(_util);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var _$ = _interopRequireDefault(_jquery);

  var Dropdown = (function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'dropdown';
    var VERSION = '4.0.0-alpha.2';
    var DATA_KEY = 'bs.dropdown';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = _$['default'].fn[NAME];

    var Event = {
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      CLICK: 'click' + EVENT_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
      KEYDOWN_DATA_API: 'keydown' + EVENT_KEY + DATA_API_KEY
    };

    var ClassName = {
      BACKDROP: 'dropdown-backdrop',
      DISABLED: 'disabled',
      OPEN: 'open'
    };

    var Selector = {
      BACKDROP: '.dropdown-backdrop',
      DATA_TOGGLE: '[data-toggle="dropdown"]',
      FORM_CHILD: '.dropdown form',
      ROLE_MENU: '[role="menu"]',
      ROLE_LISTBOX: '[role="listbox"]',
      NAVBAR_NAV: '.navbar-nav',
      VISIBLE_ITEMS: '[role="menu"] li:not(.disabled) a, ' + '[role="listbox"] li:not(.disabled) a'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Dropdown = (function () {
      function Dropdown(element) {
        _classCallCheck(this, Dropdown);

        this._element = element;

        this._addEventListeners();
      }

      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Dropdown, [{
        key: 'toggle',

        // public

        value: function toggle() {
          if (this.disabled || (0, _$['default'])(this).hasClass(ClassName.DISABLED)) {
            return false;
          }

          var parent = Dropdown._getParentFromElement(this);
          var isActive = (0, _$['default'])(parent).hasClass(ClassName.OPEN);

          Dropdown._clearMenus();

          if (isActive) {
            return false;
          }

          if ('ontouchstart' in document.documentElement && !(0, _$['default'])(parent).closest(Selector.NAVBAR_NAV).length) {

            // if mobile we use a backdrop because click events don't delegate
            var dropdown = document.createElement('div');
            dropdown.className = ClassName.BACKDROP;
            (0, _$['default'])(dropdown).insertBefore(this);
            (0, _$['default'])(dropdown).on('click', Dropdown._clearMenus);
          }

          var relatedTarget = { relatedTarget: this };
          var showEvent = _$['default'].Event(Event.SHOW, relatedTarget);

          (0, _$['default'])(parent).trigger(showEvent);

          if (showEvent.isDefaultPrevented()) {
            return false;
          }

          this.focus();
          this.setAttribute('aria-expanded', 'true');

          (0, _$['default'])(parent).toggleClass(ClassName.OPEN);
          (0, _$['default'])(parent).trigger(_$['default'].Event(Event.SHOWN, relatedTarget));

          return false;
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          _$['default'].removeData(this._element, DATA_KEY);
          (0, _$['default'])(this._element).off(EVENT_KEY);
          this._element = null;
        }

        // private

      }, {
        key: '_addEventListeners',
        value: function _addEventListeners() {
          (0, _$['default'])(this._element).on(Event.CLICK, this.toggle);
        }

        // static

      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
          return this.each(function () {
            var data = (0, _$['default'])(this).data(DATA_KEY);

            if (!data) {
              (0, _$['default'])(this).data(DATA_KEY, data = new Dropdown(this));
            }

            if (typeof config === 'string') {
              if (data[config] === undefined) {
                throw new Error('No method named "' + config + '"');
              }
              data[config].call(this);
            }
          });
        }
      }, {
        key: '_clearMenus',
        value: function _clearMenus(event) {
          if (event && event.which === 3) {
            return;
          }

          var backdrop = (0, _$['default'])(Selector.BACKDROP)[0];
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }

          var toggles = _$['default'].makeArray((0, _$['default'])(Selector.DATA_TOGGLE));

          for (var i = 0; i < toggles.length; i++) {
            var _parent = Dropdown._getParentFromElement(toggles[i]);
            var relatedTarget = { relatedTarget: toggles[i] };

            if (!(0, _$['default'])(_parent).hasClass(ClassName.OPEN)) {
              continue;
            }

            if (event && event.type === 'click' && /input|textarea/i.test(event.target.tagName) && _$['default'].contains(_parent, event.target)) {
              continue;
            }

            var hideEvent = _$['default'].Event(Event.HIDE, relatedTarget);
            (0, _$['default'])(_parent).trigger(hideEvent);
            if (hideEvent.isDefaultPrevented()) {
              continue;
            }

            toggles[i].setAttribute('aria-expanded', 'false');

            (0, _$['default'])(_parent).removeClass(ClassName.OPEN).trigger(_$['default'].Event(Event.HIDDEN, relatedTarget));
          }
        }
      }, {
        key: '_getParentFromElement',
        value: function _getParentFromElement(element) {
          var parent = undefined;
          var selector = _Util['default'].getSelectorFromElement(element);

          if (selector) {
            parent = (0, _$['default'])(selector)[0];
          }

          return parent || element.parentNode;
        }
      }, {
        key: '_dataApiKeydownHandler',
        value: function _dataApiKeydownHandler(event) {
          if (!/(38|40|27|32)/.test(event.which) || /input|textarea/i.test(event.target.tagName)) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          if (this.disabled || (0, _$['default'])(this).hasClass(ClassName.DISABLED)) {
            return;
          }

          var parent = Dropdown._getParentFromElement(this);
          var isActive = (0, _$['default'])(parent).hasClass(ClassName.OPEN);

          if (!isActive && event.which !== 27 || isActive && event.which === 27) {

            if (event.which === 27) {
              var toggle = (0, _$['default'])(parent).find(Selector.DATA_TOGGLE)[0];
              (0, _$['default'])(toggle).trigger('focus');
            }

            (0, _$['default'])(this).trigger('click');
            return;
          }

          var items = _$['default'].makeArray((0, _$['default'])(Selector.VISIBLE_ITEMS));

          items = items.filter(function (item) {
            return item.offsetWidth || item.offsetHeight;
          });

          if (!items.length) {
            return;
          }

          var index = items.indexOf(event.target);

          if (event.which === 38 && index > 0) {
            // up
            index--;
          }

          if (event.which === 40 && index < items.length - 1) {
            // down
            index++;
          }

          if (index < 0) {
            index = 0;
          }

          items[index].focus();
        }
      }, {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        }
      }]);

      return Dropdown;
    })();

    (0, _$['default'])(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.ROLE_MENU, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.ROLE_LISTBOX, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, Dropdown.prototype.toggle).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
      e.stopPropagation();
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    _$['default'].fn[NAME] = Dropdown._jQueryInterface;
    _$['default'].fn[NAME].Constructor = Dropdown;
    _$['default'].fn[NAME].noConflict = function () {
      _$['default'].fn[NAME] = JQUERY_NO_CONFLICT;
      return Dropdown._jQueryInterface;
    };

    return Dropdown;
  })(jQuery);

  module.exports = Dropdown;
});
