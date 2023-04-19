/*!
  * Bootstrap md-manipulator.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MdManipulator = factory());
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta2): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }
    if (val === 'false') {
      return false;
    }
    if (val === Number(val).toString()) {
      return Number(val);
    }
    if (val === '' || val === 'null') {
      return null;
    }
    return val;
  }
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }
  const MdManipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },
    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },
    getDataAttributes(element) {
      if (!element) {
        return {};
      }
      const attributes = {
        ...element.dataset
      };
      Object.keys(attributes).filter(key => key.startsWith('mdb')).forEach(key => {
        let pureKey = key.replace(/^mdb/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(attributes[key]);
      });
      return attributes;
    },
    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },
    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },
    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    },
    style(element, style) {
      Object.assign(element.style, style);
    },
    toggleClass(element, className) {
      if (!element) {
        return;
      }
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      } else {
        element.classList.add(className);
      }
    },
    addClass(element, className) {
      if (element.classList.contains(className)) return;
      element.classList.add(className);
    },
    addStyle(element, style) {
      Object.keys(style).forEach(property => {
        element.style[property] = style[property];
      });
    },
    removeClass(element, className) {
      if (!element.classList.contains(className)) return;
      element.classList.remove(className);
    },
    hasClass(element, className) {
      return element.classList.contains(className);
    }
  };

  return MdManipulator;

}));
//# sourceMappingURL=md-manipulator.js.map
