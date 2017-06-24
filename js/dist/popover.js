import $ from 'jquery';
import Tooltip from './tooltip';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'popover';
var VERSION = '4.0.0-beta';
var DATA_KEY = 'bs.popover';
var EVENT_KEY = '.' + DATA_KEY;
var JQUERY_NO_CONFLICT = $.fn[NAME];
var CLASS_PREFIX = 'bs-popover';
var BSCLS_PREFIX_REGEX = new RegExp('(^|\\s)' + CLASS_PREFIX + '\\S+', 'g');

var Default = $.extend({}, Tooltip.Default, {
  placement: 'right',
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
});

var DefaultType = $.extend({}, Tooltip.DefaultType, {
  content: '(string|element|function)'
});

var ClassName = {
  FADE: 'fade',
  SHOW: 'show'
};

var Selector = {
  TITLE: '.popover-header',
  CONTENT: '.popover-body'
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

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};
var Popover = function (_Tooltip) {
  babelHelpers.inherits(Popover, _Tooltip);

  function Popover() {
    babelHelpers.classCallCheck(this, Popover);
    return babelHelpers.possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).apply(this, arguments));
  }

  babelHelpers.createClass(Popover, [{
    key: 'isWithContent',


    // overrides

    value: function isWithContent() {
      return this.getTitle() || this._getContent();
    }
  }, {
    key: 'addAttachmentClass',
    value: function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + '-' + attachment);
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

      // we use append for html objects to maintain js events
      this.setElementContent($tip.find(Selector.TITLE), this.getTitle());
      this.setElementContent($tip.find(Selector.CONTENT), this._getContent());

      $tip.removeClass(ClassName.FADE + ' ' + ClassName.SHOW);
    }

    // private

  }, {
    key: '_getContent',
    value: function _getContent() {
      return this.element.getAttribute('data-content') || (typeof this.config.content === 'function' ? this.config.content.call(this.element) : this.config.content);
    }
  }, {
    key: '_cleanTipClass',
    value: function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }

    // static

  }], [{
    key: '_jQueryInterface',
    value: function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);
        var _config = (typeof config === 'undefined' ? 'undefined' : babelHelpers.typeof(config)) === 'object' ? config : null;

        if (!data && /destroy|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
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


    // getters

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
  return Popover;
}(Tooltip);

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

export default Popover;
$.fn[NAME] = Popover._jQueryInterface;
$.fn[NAME].Constructor = Popover;
$.fn[NAME].noConflict = function () {
  $.fn[NAME] = JQUERY_NO_CONFLICT;
  return Popover._jQueryInterface;
};
//# sourceMappingURL=popover.js.map