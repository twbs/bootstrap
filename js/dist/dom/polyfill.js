/*!
  * Bootstrap polyfill.js v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Polyfill = factory());
}(this, function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var MAX_UID = 1000000;
  var _window = window,
      jQuery = _window.jQuery; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var getUID = function getUID(prefix) {
    do {
      // eslint-disable-next-line no-bitwise
      prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
    } while (document.getElementById(prefix));

    return prefix;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): dom/polyfill.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /* istanbul ignore next */

  var Polyfill = function () {
    // MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached
    var defaultPreventedPreservedOnDispatch = function () {
      var e = new CustomEvent('Bootstrap', {
        cancelable: true
      });
      var element = document.createElement('div');
      element.addEventListener('Bootstrap', function () {
        return null;
      });
      e.preventDefault();
      element.dispatchEvent(e);
      return e.defaultPrevented;
    }();

    var find = Element.prototype.querySelectorAll;
    var findOne = Element.prototype.querySelector;
    var scopeSelectorRegex = /:scope\b/;

    var supportScopeQuery = function () {
      var element = document.createElement('div');

      try {
        element.querySelectorAll(':scope *');
      } catch (error) {
        return false;
      }

      return true;
    }();

    if (!supportScopeQuery) {
      find = function find(selector) {
        if (!scopeSelectorRegex.test(selector)) {
          return this.querySelectorAll(selector);
        }

        var hasId = Boolean(this.id);

        if (!hasId) {
          this.id = getUID('scope');
        }

        var nodeList = null;

        try {
          selector = selector.replace(scopeSelectorRegex, "#" + this.id);
          nodeList = this.querySelectorAll(selector);
        } finally {
          if (!hasId) {
            this.removeAttribute('id');
          }
        }

        return nodeList;
      };

      findOne = function findOne(selector) {
        if (!scopeSelectorRegex.test(selector)) {
          return this.querySelector(selector);
        }

        var matches = find.call(this, selector);

        if (typeof matches[0] !== 'undefined') {
          return matches[0];
        }

        return null;
      };
    }

    return {
      defaultPreventedPreservedOnDispatch: defaultPreventedPreservedOnDispatch,
      find: find,
      findOne: findOne
    };
  }();

  return Polyfill;

}));
//# sourceMappingURL=polyfill.js.map
