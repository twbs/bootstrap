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
    global.tooltip = mod.exports;
  }
})(this, function (exports, module, _util) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Util = _interopRequire(_util);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Tooltip = (function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'tooltip';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.tooltip';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 150;
    var CLASS_PREFIX = 'bs-tether';

    var Default = {
      animation: true,
      template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: '0 0',
      constraints: null
    };

    var AttachmentMap = {
      TOP: 'bottom center',
      RIGHT: 'middle left',
      BOTTOM: 'top center',
      LEFT: 'middle right'
    };

    var HoverState = {
      IN: 'in',
      OUT: 'out'
    };

    var Event = {
      HIDE: 'hide.bs.tooltip',
      HIDDEN: 'hidden.bs.tooltip',
      SHOW: 'show.bs.tooltip',
      SHOWN: 'shown.bs.tooltip',
      INSERTED: 'inserted.bs.tooltip',
      CLICK: 'click.bs.tooltip',
      FOCUSIN: 'focusin.bs.tooltip',
      FOCUSOUT: 'focusout.bs.tooltip',
      MOUSEENTER: 'mouseenter.bs.tooltip',
      MOUSELEAVE: 'mouseleave.bs.tooltip'
    };

    var ClassName = {
      FADE: 'fade',
      IN: 'in'
    };

    var Selector = {
      TOOLTIP: '.tooltip',
      TOOLTIP_INNER: '.tooltip-inner'
    };

    var TetherClass = {
      element: false,
      enabled: false
    };

    var Trigger = {
      HOVER: 'hover',
      FOCUS: 'focus',
      CLICK: 'click',
      MANUAL: 'manual'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Tooltip = (function () {
      function Tooltip(element, config) {
        _classCallCheck(this, Tooltip);

        // private
        this._isEnabled = true;
        this._timeout = 0;
        this._hoverState = '';
        this._activeTrigger = {};
        this._tether = null;

        // protected
        this.element = element;
        this.config = this._getConfig(config);
        this.tip = null;

        this._setListeners();
      }

      _createClass(Tooltip, [{
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
          var context = this;
          var dataKey = this.constructor.DATA_KEY;

          if (event) {
            context = $(event.currentTarget).data(dataKey);

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
            $(context.getTipElement()).hasClass(ClassName.IN) ? context._leave(null, context) : context._enter(null, context);
          }
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          var _this = this;

          clearTimeout(this._timeout);
          this.hide(function () {
            $(_this.element).off('.' + _this.constructor.NAME).removeData(_this.constructor.DATA_KEY);

            if (_this.tip) {
              $(_this.tip).detach();
            }

            _this.tip = null;
          });
        }
      }, {
        key: 'show',
        value: function show() {
          var _this2 = this;

          var showEvent = $.Event(this.constructor.Event.SHOW);

          if (this.isWithContent() && this._isEnabled) {
            $(this.element).trigger(showEvent);

            var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

            if (showEvent.isDefaultPrevented() || !isInTheDom) {
              return;
            }

            var tip = this.getTipElement();
            var tipId = _Util.getUID(this.constructor.NAME);

            tip.setAttribute('id', tipId);
            this.element.setAttribute('aria-describedby', tipId);

            this.setContent();

            if (this.config.animation) {
              $(tip).addClass(ClassName.FADE);
            }

            var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

            var attachment = this._getAttachment(placement);

            $(tip).data(this.constructor.DATA_KEY, this).appendTo(document.body);

            $(this.element).trigger(this.constructor.Event.INSERTED);

            this._tether = new Tether({
              element: tip,
              target: this.element,
              attachment: attachment,
              classes: TetherClass,
              classPrefix: CLASS_PREFIX,
              offset: this.config.offset,
              constraints: this.config.constraints
            });

            _Util.reflow(tip);
            this._tether.position();

            $(tip).addClass(ClassName.IN);

            var complete = function complete() {
              var prevHoverState = _this2._hoverState;
              _this2._hoverState = null;

              $(_this2.element).trigger(_this2.constructor.Event.SHOWN);

              if (prevHoverState === HoverState.OUT) {
                _this2._leave(null, _this2);
              }
            };

            _Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE) ? $(this.tip).one(_Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION) : complete();
          }
        }
      }, {
        key: 'hide',
        value: function hide(callback) {
          var _this3 = this;

          var tip = this.getTipElement();
          var hideEvent = $.Event(this.constructor.Event.HIDE);
          var complete = function complete() {
            if (_this3._hoverState !== HoverState.IN && tip.parentNode) {
              tip.parentNode.removeChild(tip);
            }

            _this3.element.removeAttribute('aria-describedby');
            $(_this3.element).trigger(_this3.constructor.Event.HIDDEN);
            _this3.cleanupTether();

            if (callback) {
              callback();
            }
          };

          $(this.element).trigger(hideEvent);

          if (hideEvent.isDefaultPrevented()) {
            return;
          }

          $(tip).removeClass(ClassName.IN);

          if (_Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {

            $(tip).one(_Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            complete();
          }

          this._hoverState = '';
        }
      }, {
        key: 'isWithContent',

        // protected

        value: function isWithContent() {
          return !!this.getTitle();
        }
      }, {
        key: 'getTipElement',
        value: function getTipElement() {
          return this.tip = this.tip || $(this.config.template)[0];
        }
      }, {
        key: 'setContent',
        value: function setContent() {
          var tip = this.getTipElement();
          var title = this.getTitle();
          var method = this.config.html ? 'innerHTML' : 'innerText';

          $(tip).find(Selector.TOOLTIP_INNER)[0][method] = title;

          $(tip).removeClass(ClassName.FADE).removeClass(ClassName.IN);

          this.cleanupTether();
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
      }, {
        key: 'cleanupTether',
        value: function cleanupTether() {
          if (this._tether) {
            this._tether.destroy();

            // clean up after tether's junk classes
            // remove after they fix issue
            // (https://github.com/HubSpot/tether/issues/36)
            $(this.element).removeClass(this._removeTetherClasses);
            $(this.tip).removeClass(this._removeTetherClasses);
          }
        }
      }, {
        key: '_getAttachment',

        // private

        value: function _getAttachment(placement) {
          return AttachmentMap[placement.toUpperCase()];
        }
      }, {
        key: '_setListeners',
        value: function _setListeners() {
          var _this4 = this;

          var triggers = this.config.trigger.split(' ');

          triggers.forEach(function (trigger) {
            if (trigger === 'click') {
              $(_this4.element).on(_this4.constructor.Event.CLICK, _this4.config.selector, $.proxy(_this4.toggle, _this4));
            } else if (trigger !== Trigger.MANUAL) {
              var eventIn = trigger == Trigger.HOVER ? _this4.constructor.Event.MOUSEENTER : _this4.constructor.Event.FOCUSIN;
              var eventOut = trigger == Trigger.HOVER ? _this4.constructor.Event.MOUSELEAVE : _this4.constructor.Event.FOCUSOUT;

              $(_this4.element).on(eventIn, _this4.config.selector, $.proxy(_this4._enter, _this4)).on(eventOut, _this4.config.selector, $.proxy(_this4._leave, _this4));
            }
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
        key: '_removeTetherClasses',
        value: function _removeTetherClasses(i, css) {
          return ((css.baseVal || css).match(new RegExp('(^|\\s)' + CLASS_PREFIX + '-\\S+', 'g')) || []).join(' ');
        }
      }, {
        key: '_fixTitle',
        value: function _fixTitle() {
          var titleType = typeof this.element.getAttribute('data-original-title');
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
            context._activeTrigger[event.type == 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
          }

          if ($(context.getTipElement()).hasClass(ClassName.IN) || context._hoverState === HoverState.IN) {
            context._hoverState = HoverState.IN;
            return;
          }

          clearTimeout(context._timeout);

          context._hoverState = HoverState.IN;

          if (!context.config.delay || !context.config.delay.show) {
            context.show();
            return;
          }

          context._timeout = setTimeout(function () {
            if (context._hoverState === HoverState.IN) {
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
            context._activeTrigger[event.type == 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
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

          return config;
        }
      }, {
        key: '_getDelegateConfig',
        value: function _getDelegateConfig() {
          var config = {};

          if (this.config) {
            for (var key in this.config) {
              var value = this.config[key];
              if (this.constructor.Default[key] !== value) {
                config[key] = value;
              }
            }
          }

          return config;
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
        key: 'NAME',
        get: function () {
          return NAME;
        }
      }, {
        key: 'DATA_KEY',
        get: function () {
          return DATA_KEY;
        }
      }, {
        key: 'Event',
        get: function () {
          return Event;
        }
      }, {
        key: '_jQueryInterface',

        // static

        value: function _jQueryInterface(config) {
          return this.each(function () {
            var data = $(this).data(DATA_KEY);
            var _config = typeof config === 'object' ? config : null;

            if (!data && /destroy|hide/.test(config)) {
              return;
            }

            if (!data) {
              data = new Tooltip(this, _config);
              $(this).data(DATA_KEY, data);
            }

            if (typeof config === 'string') {
              data[config]();
            }
          });
        }
      }]);

      return Tooltip;
    })();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Tooltip._jQueryInterface;
    $.fn[NAME].Constructor = Tooltip;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tooltip._jQueryInterface;
    };

    return Tooltip;
  })(jQuery);

  module.exports = Tooltip;
});