/*!
  * Bootstrap toast.js v5.0.0-beta3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./dom/data.js'), require('./dom/event-handler.js'), require('./dom/manipulator.js'), require('./base-component.js')) :
  typeof define === 'function' && define.amd ? define(['./dom/data', './dom/event-handler', './dom/manipulator', './base-component'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Toast = factory(global.Data, global.EventHandler, global.Manipulator, global.Base));
}(this, (function (Data, EventHandler, Manipulator, BaseComponent) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  var EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  var Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
  var BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement = obj => (obj[0] || obj).nodeType;

  const emulateTransitionEnd = (element, duration) => {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    function listener() {
      called = true;
      element.removeEventListener(TRANSITION_END, listener);
    }

    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(element);
      }
    }, emulatedDuration);
  };

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: ` + `Option "${property}" provided type "${valueType}" ` + `but expected type "${expectedTypes}".`);
      }
    });
  };

  const reflow = element => element.offsetHeight;

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  const defineJQueryPlugin = (name, plugin) => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta3): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent__default['default'] {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;

      this._setListeners();
    } // Getters


    static get DefaultType() {
      return DefaultType;
    }

    static get Default() {
      return Default;
    }

    static get DATA_KEY() {
      return DATA_KEY;
    } // Public


    show() {
      const showEvent = EventHandler__default['default'].trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.add(CLASS_NAME_SHOW);

        EventHandler__default['default'].trigger(this._element, EVENT_SHOWN);

        if (this._config.autohide) {
          this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay);
        }
      };

      this._element.classList.remove(CLASS_NAME_HIDE);

      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOWING);

      if (this._config.animation) {
        const transitionDuration = getTransitionDurationFromElement(this._element);
        EventHandler__default['default'].one(this._element, 'transitionend', complete);
        emulateTransitionEnd(this._element, transitionDuration);
      } else {
        complete();
      }
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const hideEvent = EventHandler__default['default'].trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);

        EventHandler__default['default'].trigger(this._element, EVENT_HIDDEN);
      };

      this._element.classList.remove(CLASS_NAME_SHOW);

      if (this._config.animation) {
        const transitionDuration = getTransitionDurationFromElement(this._element);
        EventHandler__default['default'].one(this._element, 'transitionend', complete);
        emulateTransitionEnd(this._element, transitionDuration);
      } else {
        complete();
      }
    }

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      EventHandler__default['default'].off(this._element, EVENT_CLICK_DISMISS);
      super.dispose();
      this._config = null;
    } // Private


    _getConfig(config) {
      config = { ...Default,
        ...Manipulator__default['default'].getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }

    _setListeners() {
      EventHandler__default['default'].on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
    }

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data__default['default'].get(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */


  defineJQueryPlugin(NAME, Toast);

  return Toast;

})));
//# sourceMappingURL=toast.js.map
