/*!
  * Bootstrap color.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Color = {}));
})(this, (function (exports) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Material Style (v3.0.0): color.js
   * Licensed under MIT (https://github.com/materialstyle/materialstyle/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const getColor = color => {
    const label = document.createElement('label');
    label.className = `text-${color}`;
    label.style.display = 'none';
    document.querySelector('body').append(label);
    const style = getComputedStyle(label);
    color = style.color;
    label.remove();
    return color;
  };
  const getBaseColor = element => {
    let base = element.className.match(/base-\S+/);
    let baseColor;
    if (base) {
      base = base[0].replace('base-', '');
      baseColor = getColor(base);
    }
    return baseColor;
  };
  const getPrimaryColor = element => {
    let primary = element.className.match(/primary-\S+/);
    let primaryColor;
    if (primary) {
      primary = primary[0].replace('primary-', '');
      primaryColor = getColor(primary);
    }
    return primaryColor;
  };

  exports.getBaseColor = getBaseColor;
  exports.getColor = getColor;
  exports.getPrimaryColor = getPrimaryColor;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=color.js.map
