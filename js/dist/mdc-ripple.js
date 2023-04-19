/*!
  * Bootstrap mdc-ripple.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@material/ripple')) :
  typeof define === 'function' && define.amd ? define(['@material/ripple'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MdcRipple = factory(global["@material/ripple"]));
})(this, (function (ripple) { 'use strict';

  class MDCRippled {
    constructor(element) {
      this.root = element;
      this.active = false;
      this.root.addEventListener('keydown', evt => {
        if (isSpace(evt)) {
          this.active = true;
        }
      });
      this.root.addEventListener('keyup', evt => {
        if (isSpace(evt)) {
          this.active = false;
        }
      });
      this.root.addEventListener('mouseenter', evt => {
        if (isSpace(evt)) {
          this.active = false;
        }
      });
      this.root.addEventListener('mouseleave', evt => {
        if (isSpace(evt)) {
          this.active = false;
        }
      });
      const foundation = new ripple.MDCRippleFoundation({
        ...ripple.MDCRipple.createAdapter(this),
        isSurfaceActive: () => this.active
      });
      this.ripple = new ripple.MDCRipple(this.root, foundation);
    }
  }
  function isSpace(evt) {
    return evt.key === ' ' || evt.keyCode === 32;
  }
  function addRippleToElements(selector, classToAdd) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      window.addEventListener('load', () => {
        element.unbounded = true;
        element.classList.add(classToAdd);
        return new ripple.MDCRipple(element);
      });
    }
  }
  addRippleToElements('.btn-close, .btn-icon', 'mdc-icon-button');
  addRippleToElements('.btn', 'mdc-button');

  return MDCRippled;

}));
//# sourceMappingURL=mdc-ripple.js.map
