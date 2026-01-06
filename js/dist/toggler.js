/*!
  * Bootstrap toggler.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./base-component.js'), require('./dom/event-handler.js'), require('./util/component-functions.js')) :
  typeof define === 'function' && define.amd ? define(['./base-component', './dom/event-handler', './util/component-functions'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Toggler = factory(global.BaseComponent, global.EventHandler, global.ComponentFunctions));
})(this, (function (BaseComponent, EventHandler, componentFunctions_js) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap toggler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'toggler';
  const DATA_KEY = 'bs.toggler';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_TOGGLE = `toggle${EVENT_KEY}`;
  const EVENT_TOGGLED = `toggled${EVENT_KEY}`;
  const EVENT_CLICK = 'click';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="toggler"]';
  const DefaultType = {
    attribute: 'string',
    value: '(string|number|boolean)'
  };
  const Default = {
    attribute: 'class',
    value: null
  };

  /**
   * Class definition
   */

  class Toggler extends BaseComponent {
    // Getters
    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }

    // Public
    toggle() {
      const toggleEvent = EventHandler.trigger(this._element, EVENT_TOGGLE);
      if (toggleEvent.defaultPrevented) {
        return;
      }
      this._execute();
      EventHandler.trigger(this._element, EVENT_TOGGLED);
    }

    // Private
    _execute() {
      const {
        attribute,
        value
      } = this._config;
      if (attribute === 'id') {
        return; // You have to be kidding
      }
      if (attribute === 'class') {
        this._element.classList.toggle(value);
        return;
      }

      // Compare as strings since getAttribute() always returns a string
      if (this._element.getAttribute(attribute) === String(value)) {
        this._element.removeAttribute(attribute);
        return;
      }
      this._element.setAttribute(attribute, value);
    }
  }

  /**
   * Data API implementation
   */

  componentFunctions_js.eventActionOnPlugin(Toggler, EVENT_CLICK, SELECTOR_DATA_TOGGLE, 'toggle');

  return Toggler;

}));
//# sourceMappingURL=toggler.js.map
