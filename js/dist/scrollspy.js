/*!
  * Bootstrap scrollspy.js v5.0.0-beta3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./dom/data.js'), require('./dom/event-handler.js'), require('./dom/manipulator.js'), require('./dom/selector-engine.js'), require('./base-component.js')) :
  typeof define === 'function' && define.amd ? define(['./dom/data', './dom/event-handler', './dom/manipulator', './dom/selector-engine', './base-component'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ScrollSpy = factory(global.Data, global.EventHandler, global.Manipulator, global.SelectorEngine, global.Base));
}(this, (function (Data, EventHandler, Manipulator, SelectorEngine, BaseComponent) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  var EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  var Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
  var SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
  var BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MAX_UID = 1000000;

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
      } // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = '#' + hrefAttr.split('#')[1];
      }

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
  };

  const isElement = obj => (obj[0] || obj).nodeType;

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
   * Bootstrap (v5.0.0-beta3): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'scrollspy';
  const DATA_KEY = 'bs.scrollspy';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const Default = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  const DefaultType = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent__default['default'] {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS}, ${this._config.target} ${SELECTOR_LIST_ITEMS}, ${this._config.target} .${CLASS_NAME_DROPDOWN_ITEM}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler__default['default'].on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
    } // Getters


    static get Default() {
      return Default;
    }

    static get DATA_KEY() {
      return DATA_KEY;
    } // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine__default['default'].find(this._selector);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine__default['default'].findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator__default['default'][offsetMethod](target).top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
      });
    }

    dispose() {
      super.dispose();
      EventHandler__default['default'].off(this._scrollElement, EVENT_KEY);
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    } // Private


    _getConfig(config) {
      config = { ...Default,
        ...(typeof config === 'object' && config ? config : {})
      };

      if (typeof config.target !== 'string' && isElement(config.target)) {
        let {
          id
        } = config.target;

        if (!id) {
          id = getUID(NAME);
          config.target.id = id;
        }

        config.target = `#${id}`;
      }

      typeCheckConfig(NAME, config, DefaultType);
      return config;
    }

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = this._selector.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);

      const link = SelectorEngine__default['default'].findOne(queries.join(','));

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine__default['default'].findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE);
        link.classList.add(CLASS_NAME_ACTIVE);
      } else {
        // Set triggered link as active
        link.classList.add(CLASS_NAME_ACTIVE);
        SelectorEngine__default['default'].parents(link, SELECTOR_NAV_LIST_GROUP).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine__default['default'].prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine__default['default'].prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine__default['default'].children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE));
          });
        });
      }

      EventHandler__default['default'].trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }

    _clear() {
      SelectorEngine__default['default'].find(this._selector).filter(node => node.classList.contains(CLASS_NAME_ACTIVE)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data__default['default'].get(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler__default['default'].on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine__default['default'].find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy, Manipulator__default['default'].getDataAttributes(spy)));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(NAME, ScrollSpy);

  return ScrollSpy;

})));
//# sourceMappingURL=scrollspy.js.map
