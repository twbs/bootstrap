'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var ToolTip = (function ($) {

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
    attachment: 'top',
    offset: '0 0',
    constraints: null
  };

  var HorizontalMirror = {
    LEFT: 'right',
    CENTER: 'center',
    RIGHT: 'left'
  };

  var VerticalMirror = {
    TOP: 'bottom',
    MIDDLE: 'middle',
    BOTTOM: 'top'
  };

  var VerticalDefault = {
    LEFT: 'middle',
    CENTER: 'bottom',
    RIGHT: 'middle'
  };

  var HorizontalDefault = {
    TOP: 'center',
    MIDDLE: 'left',
    BOTTOM: 'center'
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
    TOOLTIP_INNER: '.tooltip-inner',
    TOOLTIP_ARROW: '.tooltip-arrow'
  };

  var TetherClass = {
    'element': false,
    'enabled': false
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

      // protected
      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;
      this.tether = null;

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

        if (event) {
          context = $(event.currentTarget).data(DATA_KEY);

          if (!context) {
            context = new this.constructor(event.currentTarget, this._getDelegateConfig());
            $(event.currentTarget).data(DATA_KEY, context);
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
          $(_this.element).off(Selector.TOOLTIP).removeData(DATA_KEY);
        });
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        var showEvent = $.Event(Event.SHOW);

        if (this.isWithContent() && this._isEnabled) {
          $(this.element).trigger(showEvent);

          var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

          if (showEvent.isDefaultPrevented() || !isInTheDom) {
            return;
          }

          var tip = this.getTipElement();
          var tipId = Util.getUID(NAME);

          tip.setAttribute('id', tipId);
          this.element.setAttribute('aria-describedby', tipId);

          this.setContent();

          if (this.config.animation) {
            $(tip).addClass(ClassName.FADE);
          }

          var attachment = typeof this.config.attachment === 'function' ? this.config.attachment.call(this, tip, this.element) : this.config.attachment;

          attachment = this.getAttachment(attachment);

          $(tip).data(DATA_KEY, this);

          this.element.parentNode.insertBefore(tip, this.element.nextSibling);
          $(this.element).trigger(Event.INSERTED);

          this.tether = new Tether({
            element: this.tip,
            target: this.element,
            attachment: attachment,
            classes: TetherClass,
            classPrefix: CLASS_PREFIX,
            offset: this.config.offset,
            constraints: this.config.constraints
          });

          Util.reflow(tip);
          this.tether.position();

          $(tip).addClass(ClassName.IN);

          var complete = function complete() {
            var prevHoverState = _this2._hoverState;
            _this2._hoverState = null;

            $(_this2.element).trigger(Event.SHOWN);

            if (prevHoverState === HoverState.OUT) {
              _this2._leave(null, _this2);
            }
          };

          Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE) ? $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION) : complete();
        }
      }
    }, {
      key: 'hide',
      value: function hide(callback) {
        var _this3 = this;

        var tip = this.getTipElement();
        var hideEvent = $.Event(Event.HIDE);
        var complete = function complete() {
          if (_this3._hoverState !== HoverState.IN && tip.parentNode) {
            tip.parentNode.removeChild(tip);
          }

          _this3.element.removeAttribute('aria-describedby');
          $(_this3.element).trigger(Event.HIDDEN);
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

        if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {

          $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
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
      key: 'getAttachment',
      value: function getAttachment(attachmentString) {
        var attachmentArray = attachmentString.split(' ');
        var normalizedAttachment = {};

        if (!attachmentArray.length) {
          throw new Error('Tooltip requires attachment');
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = attachmentArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var attachment = _step.value;

            attachment = attachment.toUpperCase();

            if (HorizontalMirror[attachment]) {
              normalizedAttachment.horizontal = HorizontalMirror[attachment];
            }

            if (VerticalMirror[attachment]) {
              normalizedAttachment.vertical = VerticalMirror[attachment];
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!normalizedAttachment.horizontal && !normalizedAttachment.vertical) {
          throw new Error('Tooltip requires valid attachment');
        }

        if (!normalizedAttachment.horizontal) {
          normalizedAttachment.horizontal = HorizontalDefault[normalizedAttachment.vertical.toUpperCase()];
        }

        if (!normalizedAttachment.vertical) {
          normalizedAttachment.vertical = VerticalDefault[normalizedAttachment.horizontal.toUpperCase()];
        }

        return [normalizedAttachment.vertical, normalizedAttachment.horizontal].join(' ');
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
      key: 'removeTetherClasses',
      value: function removeTetherClasses(i, css) {
        return ((css.baseVal || css).match(new RegExp('(^|\\s)' + CLASS_PREFIX + '-\\S+', 'g')) || []).join(' ');
      }
    }, {
      key: 'cleanupTether',
      value: function cleanupTether() {
        if (this.tether) {
          this.tether.destroy();

          // clean up after tether's junk classes
          // remove after they fix issue
          // (https://github.com/HubSpot/tether/issues/36)
          $(this.element).removeClass(this.removeTetherClasses);
          $(this.tip).removeClass(this.removeTetherClasses);
        }
      }
    }, {
      key: '_setListeners',

      // private

      value: function _setListeners() {
        var _this4 = this;

        var triggers = this.config.trigger.split(' ');

        triggers.forEach(function (trigger) {
          if (trigger === 'click') {
            $(_this4.element).on(Event.CLICK, _this4.config.selector, _this4.toggle.bind(_this4));
          } else if (trigger !== 'manual') {
            var eventIn = trigger == 'hover' ? Event.MOUSEENTER : Event.FOCUSIN;
            var eventOut = trigger == 'hover' ? Event.MOUSELEAVE : Event.FOCUSOUT;

            $(_this4.element).on(eventIn, _this4.config.selector, _this4._enter.bind(_this4)).on(eventOut, _this4.config.selector, _this4._leave.bind(_this4));
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
        context = context || $(event.currentTarget).data(DATA_KEY);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(DATA_KEY, context);
        }

        if (event) {
          context._activeTrigger[event.type == 'focusin' ? 'focus' : 'hover'] = true;
        }

        if ($(context.getTipElement()).hasClass('in') || context._hoverState === 'in') {
          context._hoverState = 'in';
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
        context = context || $(event.currentTarget).data(DATA_KEY);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(DATA_KEY, context);
        }

        if (event) {
          context._activeTrigger[event.type == 'focusout' ? 'focus' : 'hover'] = false;
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
        config = $.extend({}, Default, $(this.element).data(), config);

        if (config.delay && typeof config.delay === 'number') {
          config.delay = {
            'show': config.delay,
            'hide': config.delay
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
            if (Default[key] !== value) {
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
//# sourceMappingURL=tooltip.js.map