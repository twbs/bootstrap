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
  /* global Tether */

  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Util = _interopRequireDefault(_util);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Tooltip = (function ($) {

    /**
     * Check for Tether dependency
     * Tether - http://github.hubspot.com/tether/
     */
    if (window.Tether === undefined) {
      throw new Error('Bootstrap tooltips require Tether (http://github.hubspot.com/tether/)');
    }

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'tooltip';
    var VERSION = '4.0.0-alpha';
    var DATA_KEY = 'bs.tooltip';
    var EVENT_KEY = '.' + DATA_KEY;
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
      constraints: []
    };

    var DefaultType = {
      animation: 'boolean',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string',
      delay: '(number|object)',
      html: 'boolean',
      selector: '(string|boolean)',
      placement: '(string|function)',
      offset: 'string',
      constraints: 'array'
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
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      INSERTED: 'inserted' + EVENT_KEY,
      CLICK: 'click' + EVENT_KEY,
      FOCUSIN: 'focusin' + EVENT_KEY,
      FOCUSOUT: 'focusout' + EVENT_KEY,
      MOUSEENTER: 'mouseenter' + EVENT_KEY,
      MOUSELEAVE: 'mouseleave' + EVENT_KEY
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

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      // getters

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

            if ($(this.getTipElement()).hasClass(ClassName.IN)) {
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

          this.cleanupTether();

          $.removeData(this.element, this.constructor.DATA_KEY);

          $(this.element).off(this.constructor.EVENT_KEY);

          if (this.tip) {
            $(this.tip).remove();
          }

          this._isEnabled = null;
          this._timeout = null;
          this._hoverState = null;
          this._activeTrigger = null;
          this._tether = null;

          this.element = null;
          this.config = null;
          this.tip = null;
        }
      }, {
        key: 'show',
        value: function show() {
          var _this = this;

          var showEvent = $.Event(this.constructor.Event.SHOW);

          if (this.isWithContent() && this._isEnabled) {
            $(this.element).trigger(showEvent);

            var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

            if (showEvent.isDefaultPrevented() || !isInTheDom) {
              return;
            }

            var tip = this.getTipElement();
            var tipId = _Util['default'].getUID(this.constructor.NAME);

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
              attachment: attachment,
              element: tip,
              target: this.element,
              classes: TetherClass,
              classPrefix: CLASS_PREFIX,
              offset: this.config.offset,
              constraints: this.config.constraints,
              addTargetClasses: false
            });

            _Util['default'].reflow(tip);
            this._tether.position();

            $(tip).addClass(ClassName.IN);

            var complete = function complete() {
              var prevHoverState = _this._hoverState;
              _this._hoverState = null;

              $(_this.element).trigger(_this.constructor.Event.SHOWN);

              if (prevHoverState === HoverState.OUT) {
                _this._leave(null, _this);
              }
            };

            if (_Util['default'].supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
              $(this.tip).one(_Util['default'].TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
              return;
            }

            complete();
          }
        }
      }, {
        key: 'hide',
        value: function hide(callback) {
          var _this2 = this;

          var tip = this.getTipElement();
          var hideEvent = $.Event(this.constructor.Event.HIDE);
          var complete = function complete() {
            if (_this2._hoverState !== HoverState.IN && tip.parentNode) {
              tip.parentNode.removeChild(tip);
            }

            _this2.element.removeAttribute('aria-describedby');
            $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);
            _this2.cleanupTether();

            if (callback) {
              callback();
            }
          };

          $(this.element).trigger(hideEvent);

          if (hideEvent.isDefaultPrevented()) {
            return;
          }

          $(tip).removeClass(ClassName.IN);

          if (_Util['default'].supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {

            $(tip).one(_Util['default'].TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            complete();
          }

          this._hoverState = '';
        }

        // protected

      }, {
        key: 'isWithContent',
        value: function isWithContent() {
          return Boolean(this.getTitle());
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

          this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());

          $tip.removeClass(ClassName.FADE).removeClass(ClassName.IN);

          this.cleanupTether();
        }
      }, {
        key: 'setElementContent',
        value: function setElementContent($element, content) {
          var html = this.config.html;
          if (typeof content === 'object' && (content.nodeType || content.jquery)) {
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
      }, {
        key: 'cleanupTether',
        value: function cleanupTether() {
          if (this._tether) {
            this._tether.destroy();
          }
        }

        // private

      }, {
        key: '_getAttachment',
        value: function _getAttachment(placement) {
          return AttachmentMap[placement.toUpperCase()];
        }
      }, {
        key: '_setListeners',
        value: function _setListeners() {
          var _this3 = this;

          var triggers = this.config.trigger.split(' ');

          triggers.forEach(function (trigger) {
            if (trigger === 'click') {
              $(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, $.proxy(_this3.toggle, _this3));
            } else if (trigger !== Trigger.MANUAL) {
              var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
              var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;

              $(_this3.element).on(eventIn, _this3.config.selector, $.proxy(_this3._enter, _this3)).on(eventOut, _this3.config.selector, $.proxy(_this3._leave, _this3));
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
            context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
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

          _Util['default'].typeCheckConfig(NAME, config, this.constructor.DefaultType);

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

        // static

      }], [{
        key: '_jQueryInterface',
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
      }, {
        key: 'Default',
        get: function get() {
          return Default;
        }
      }, {
        key: 'NAME',
        get: function get() {
          return NAME;
        }
      }, {
        key: 'DATA_KEY',
        get: function get() {
          return DATA_KEY;
        }
      }, {
        key: 'Event',
        get: function get() {
          return Event;
        }
      }, {
        key: 'EVENT_KEY',
        get: function get() {
          return EVENT_KEY;
        }
      }, {
        key: 'DefaultType',
        get: function get() {
          return DefaultType;
        }
      }]);

      return Tooltip;
    })();

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
