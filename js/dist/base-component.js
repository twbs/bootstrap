/*!
  * Bootstrap base-component.js v5.2.3 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./dom/data'), require('./util/index'), require('./dom/event-handler'), require('./util/config')) :
  typeof define === 'function' && define.amd ? define(['./dom/data', './util/index', './dom/event-handler', './util/config'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.BaseComponent = factory(global.Data, global.Index, global.EventHandler, global.Config));
})(this, (function (Data, index, EventHandler, Config) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.2.3): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * Constants
   */

  const VERSION = '5.2.3';
  /**
   * Class definition
   */

  class BaseComponent extends Config__default.default {
    constructor(element, config) {
      super();
      element = index.getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      this._config = this._getConfig(config);
      Data__default.default.set(this._element, this.constructor.DATA_KEY, this);
    } // Public


    dispose() {
      Data__default.default.remove(this._element, this.constructor.DATA_KEY);
      EventHandler__default.default.off(this._element, this.constructor.EVENT_KEY);

      for (const propertyName of Object.getOwnPropertyNames(this)) {
        this[propertyName] = null;
      }
    }

    _queueCallback(callback, element, isAnimated = true) {
      index.executeAfterTransition(callback, element, isAnimated);
    }

    _getConfig(config) {
      config = this._mergeConfigObj(config, this._element);
      config = this._configAfterMerge(config);

      this._typeCheckConfig(config);

      return config;
    } // Static


    static getInstance(element) {
      return Data__default.default.get(index.getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }

    static get VERSION() {
      return VERSION;
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

    static eventName(name) {
      return `${name}${this.EVENT_KEY}`;
    }

  }

  return BaseComponent;

}));
//# sourceMappingURL=base-component.js.map
