/*!
  * Bootstrap md-focusTrap.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../dom/md-selector-engine'), require('./md-index')) :
  typeof define === 'function' && define.amd ? define(['../dom/md-selector-engine', './md-index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MdFocusTrap = factory(global.MdSelectorEngine, global.mdIndex));
})(this, (function (MdSelectorEngine, mdIndex) { 'use strict';

  class FocusTrap {
    constructor(element, options = {}, toggler) {
      this._element = element;
      this._toggler = toggler;
      this._event = options.event || 'blur';
      this._condition = options.condition || (() => true);
      this._selector = options.selector || 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      this._onlyVisible = options.onlyVisible || false;
      this._focusableElements = [];
      this._firstElement = null;
      this._lastElement = null;
      this.handler = e => {
        if (this._condition(e) && e.target === this._lastElement) {
          e.preventDefault();
          this._firstElement.focus();
        }
      };
    }
    trap() {
      this._setElements();
      this._init();
      this._setFocusTrap();
    }
    disable() {
      for (const element of this._focusableElements) {
        element.removeEventListener(this._event, this.handler);
      }
      if (this._toggler) {
        this._toggler.focus();
      }
    }
    update() {
      this._setElements();
      this._setFocusTrap();
    }
    _init() {
      const handler = e => {
        if (!this._firstElement || e.key !== 'Tab' || this._focusableElements.includes(e.target)) {
          return;
        }
        e.preventDefault();
        this._firstElement.focus();
        window.removeEventListener('keydown', handler);
      };
      window.addEventListener('keydown', handler);
    }
    _filterVisible(elements) {
      return elements.filter(el => {
        if (!mdIndex.isVisible(el)) {
          return false;
        }
        const ancestors = MdSelectorEngine.parents(el, '*');
        for (const ancestor of ancestors) {
          const style = window.getComputedStyle(ancestor);
          if (style && (style.display === 'none' || style.visibility === 'hidden')) {
            return false;
          }
        }
        return true;
      });
    }
    _setElements() {
      this._focusableElements = MdSelectorEngine.find(this._selector, this._element);
      if (this._onlyVisible) {
        this._focusableElements = this._filterVisible(this._focusableElements);
      }
      this._firstElement = this._focusableElements[0];
      this._lastElement = this._focusableElements[this._focusableElements.length - 1];
    }
    _setFocusTrap() {
      for (const [i, element] of this._focusableElements.entries()) {
        if (i === this._focusableElements.length - 1) {
          element.addEventListener(this._event, this.handler);
        } else {
          element.removeEventListener(this._event, this.handler);
        }
      }
    }
  }

  return FocusTrap;

}));
//# sourceMappingURL=md-focusTrap.js.map
