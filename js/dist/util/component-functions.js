/*!
  * Bootstrap component-functions.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('../dom/event-handler.js'), require('../dom/selector-engine.js'), require('./index.js')) :
  typeof define === 'function' && define.amd ? define(['exports', '../dom/event-handler', '../dom/selector-engine', './index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.SelectorEngine, global.Index));
})(this, (function (exports, EventHandler, SelectorEngine, index_js) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (index_js.isDisabled(this)) {
        return;
      }
      const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target);

      // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
      instance[method]();
    });
  };
  const eventActionOnPlugin = (Plugin, onEvent, stringSelector, method, callback = null) => {
    eventAction(`${onEvent}.${Plugin.NAME}`, stringSelector, data => {
      const instances = data.targets.filter(Boolean).map(element => Plugin.getOrCreateInstance(element));
      if (typeof callback === 'function') {
        callback({
          ...data,
          instances
        });
      }
      for (const instance of instances) {
        instance[method]();
      }
    });
  };
  const eventAction = (onEvent, stringSelector, callback) => {
    const selector = `${stringSelector}:not(.disabled):not(:disabled)`;
    EventHandler.on(document, onEvent, selector, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      const selector = SelectorEngine.getSelectorFromElement(this);
      const targets = selector ? SelectorEngine.find(selector) : [this];
      callback({
        targets,
        event
      });
    });
  };

  exports.enableDismissTrigger = enableDismissTrigger;
  exports.eventActionOnPlugin = eventActionOnPlugin;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=component-functions.js.map
