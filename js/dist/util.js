(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Util = factory());
}(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.3): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */
  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        selector = (element.getAttribute('href') || '').trim();
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = window.getComputedStyle(element).transitionDuration;
      var floatTransitionDuration = parseFloat(transitionDuration); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      element.dispatchEvent(new Event(Util.TRANSITION_END));
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    emulateTransitionEnd: function emulateTransitionEnd(element, duration) {
      setTimeout(function () {
        Util.triggerTransitionEnd(element);
      }, duration);
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    makeArray: function makeArray(nodeList) {
      if (typeof nodeList === 'undefined' || nodeList === null) {
        return [];
      }

      var strRepresentation = Object.prototype.toString.call(nodeList);

      if (strRepresentation === '[object NodeList]' || strRepresentation === '[object HTMLCollection]' || strRepresentation === '[object Array]') {
        return Array.prototype.slice.call(nodeList);
      }

      return [nodeList];
    },
    isVisible: function isVisible(element) {
      if (typeof element === 'undefined' || element === null) {
        return false;
      }

      if (element.style !== null && element.parentNode !== null && typeof element.parentNode.style !== 'undefined') {
        return element.style.display !== 'none' && element.parentNode.style.display !== 'none' && element.style.visibility !== 'hidden';
      }

      return false;
    },
    noop: function noop() {
      // eslint-disable-next-line no-empty-function
      return function () {};
    },

    get jQuery() {
      return window.$ || window.jQuery;
    }

  };

  return Util;

})));
//# sourceMappingURL=util.js.map
