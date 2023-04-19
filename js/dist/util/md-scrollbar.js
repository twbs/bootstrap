/*!
  * Bootstrap md-scrollbar.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('../dom/selector-engine'), require('../dom/manipulator')) :
  typeof define === 'function' && define.amd ? define(['exports', '../dom/selector-engine', '../dom/manipulator'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MdScrollbar = {}, global.MdSelectorEngine, global.Manipulator));
})(this, (function (exports, MdSelectorEngine, Manipulator) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';
  const getWidth = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  };
  const hide = (width = getWidth()) => {
    _disableOverFlow();
    // give padding to element to balances the hidden scrollbar width
    _setElementAttributes('body', 'paddingRight', calculatedValue => calculatedValue + width);
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements, to keep shown fullwidth
    _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);
    _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
  };
  const _disableOverFlow = () => {
    const actualValue = document.body.style.overflow;
    if (actualValue) {
      Manipulator.setDataAttribute(document.body, 'overflow', actualValue);
    }
    document.body.style.overflow = 'hidden';
  };
  const _setElementAttributes = (selector, styleProp, callback) => {
    const scrollbarWidth = getWidth();
    MdSelectorEngine.find(selector).forEach(element => {
      if (element !== document.body && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      const actualValue = element.style[styleProp];
      const calculatedValue = window.getComputedStyle(element)[styleProp];
      Manipulator.setDataAttribute(element, styleProp, actualValue);
      element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
    });
  };
  const reset = () => {
    _resetElementAttributes('body', 'overflow');
    _resetElementAttributes('body', 'paddingRight');
    _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');
    _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
  };
  const _resetElementAttributes = (selector, styleProp) => {
    MdSelectorEngine.find(selector).forEach(element => {
      const value = Manipulator.getDataAttribute(element, styleProp);
      if (typeof value === 'undefined') {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    });
  };
  const isBodyOverflowing = () => {
    return getWidth() > 0;
  };

  exports.getWidth = getWidth;
  exports.hide = hide;
  exports.isBodyOverflowing = isBodyOverflowing;
  exports.reset = reset;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=md-scrollbar.js.map
