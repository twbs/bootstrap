/*!
  * Bootstrap alert.js v5.3.3 (https://getbootstrap.com/)
  * Copyright 2011-2024 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./base-component.js'), require('./dom/event-handler.js'), require('./util/component-functions.js'), require('./util/index.js')) :
  typeof define === 'function' && define.amd ? define(['./base-component', './dom/event-handler', './util/component-functions', './util/index'], factory) :
  (global = globalThis || global || self, global.Alert = factory(global.BaseComponent, global.EventHandler, global.ComponentFunctions, global.Index));
})(this, (function (BaseComponent, EventHandler, componentFunctions, index) { 
  'use strict';

  const NAME = 'alert', DATA_KEY = 'bs.alert', EVENT_CLOSE = `close.${DATA_KEY}`, EVENT_CLOSED = `closed.${DATA_KEY}`, CLASS_FADE = 'fade', CLASS_SHOW = 'show';

  const triggerEvent = (el, evt) => {
    try { return EventHandler.trigger(el, evt); } catch { return false; }
  };

  class Alert extends BaseComponent {
    static get NAME() { return NAME; }
    close() {
      const closeEvent = triggerEvent(this._element, EVENT_CLOSE);
      if (closeEvent.defaultPrevented) return;
      this._element.classList.remove(CLASS_SHOW);
      this._queueCallback(() => this._destroyElement(), this._element, this._element.classList.contains(CLASS_FADE));
    }
    _destroyElement() {
      try { this._element.remove(); triggerEvent(this._element, EVENT_CLOSED); } finally { this.dispose(); }
    }
    static jQueryInterface(config) {
      return this.each(function () {
        const instance = Alert.getOrCreateInstance(this);
        if (typeof config === 'string') {
          if (typeof instance[config] === 'undefined') throw new TypeError(`No method named "${config}"`);
          instance[config](this);
        }
      });
    }
  }

  componentFunctions.enableDismissTrigger(Alert, 'close');
  index.defineJQueryPlugin(Alert);
  
  return Alert;
}));

