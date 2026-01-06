/*!
  * Bootstrap v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vanilla-calendar-pro'), require('@floating-ui/dom')) :
  typeof define === 'function' && define.amd ? define(['vanilla-calendar-pro', '@floating-ui/dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.vanillaCalendarPro, global.FloatingUIDOM));
})(this, (function (vanillaCalendarPro, dom) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * Constants
   */

  const elementMap = new Map();
  const Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }
      const instanceMap = elementMap.get(element);

      // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used
      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }
      instanceMap.set(key, instance);
    },
    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }
      return null;
    },
    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }
      const instanceMap = elementMap.get(element);
      instanceMap.delete(key);

      // free up element references if there are no instances left for an element
      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * Constants
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage
  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

  /**
   * Private methods
   */

  function makeEventUid(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }
  function getElementEvents(element) {
    const uid = makeEventUid(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }
  function bootstrapHandler(element, fn) {
    return function handler(event) {
      hydrateObj(event, {
        delegateTarget: element
      });
      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }
      return fn.apply(element, [event]);
    };
  }
  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);
      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (const domElement of domElements) {
          if (domElement !== target) {
            continue;
          }
          hydrateObj(event, {
            delegateTarget: target
          });
          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn);
          }
          return fn.apply(target, [event]);
        }
      }
    };
  }
  function findHandler(events, callable, delegationSelector = null) {
    return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
  }
  function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
    const isDelegated = typeof handler === 'string';
    // TODO: tooltip passes `false` instead of selector, so we need to check
    const callable = isDelegated ? delegationFunction : handler || delegationFunction;
    let typeEvent = getTypeEvent(originalTypeEvent);
    if (!nativeEvents.has(typeEvent)) {
      typeEvent = originalTypeEvent;
    }
    return [isDelegated, callable, typeEvent];
  }
  function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

    // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does
    if (originalTypeEvent in customEvents) {
      const wrapFunction = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };
      callable = wrapFunction(callable);
    }
    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
    if (previousFunction) {
      previousFunction.oneOff = previousFunction.oneOff && oneOff;
      return;
    }
    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, isDelegated);
  }
  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    if (!fn) {
      return;
    }
    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }
  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
      if (handlerKey.includes(namespace)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  }
  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }
  const EventHandler = {
    on(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, false);
    },
    one(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, true);
    },
    off(element, originalTypeEvent, handler, delegationFunction) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
      const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getElementEvents(element);
      const storeElementEvent = events[typeEvent] || {};
      const isNamespace = originalTypeEvent.startsWith('.');
      if (typeof callable !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!Object.keys(storeElementEvent).length) {
          return;
        }
        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
        return;
      }
      if (isNamespace) {
        for (const elementEvent of Object.keys(events)) {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }
      for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');
        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
      }
    },
    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }
      const evt = hydrateObj(new Event(event, {
        bubbles: true,
        cancelable: true
      }), args);
      element.dispatchEvent(evt);
      return evt;
    }
  };
  function hydrateObj(obj, meta = {}) {
    for (const [key, value] of Object.entries(meta)) {
      try {
        obj[key] = value;
      } catch {
        Object.defineProperty(obj, key, {
          configurable: true,
          get() {
            return value;
          }
        });
      }
    }
    return obj;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  function normalizeData(value) {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (value === Number(value).toString()) {
      return Number(value);
    }
    if (value === '' || value === 'null') {
      return null;
    }
    if (typeof value !== 'string') {
      return value;
    }
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return value;
    }
  }
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }
  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },
    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },
    getDataAttributes(element) {
      if (!element) {
        return {};
      }
      const attributes = {};
      const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
      for (const key of bsKeys) {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      }
      return attributes;
    },
    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const MAX_UID = 1_000_000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend';

  /**
   * Properly escape IDs selectors to handle weird IDs
   * @param {string} selector
   * @returns {string}
   */
  const parseSelector = selector => {
    if (selector && window.CSS && window.CSS.escape) {
      // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
      selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
    }
    return selector;
  };

  // Shout-out Angus Croll (https://goo.gl/pxwQGp)
  const toType = object => {
    if (object === null || object === undefined) {
      return `${object}`;
    }
    return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
  };

  /**
   * Public Util API
   */

  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
  };
  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    }

    // Get transition-duration of the element
    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };
  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };
  const isElement = object => {
    if (!object || typeof object !== 'object') {
      return false;
    }
    return typeof object.nodeType !== 'undefined';
  };
  const getElement = object => {
    if (isElement(object)) {
      return object;
    }
    if (typeof object === 'string' && object.length > 0) {
      return document.querySelector(parseSelector(object));
    }
    return null;
  };
  const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
      return false;
    }
    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    // Handle `details` element as its content may falsie appear visible when it is closed
    const closedDetails = element.closest('details:not([open])');
    if (!closedDetails) {
      return elementIsVisible;
    }
    if (closedDetails !== element) {
      const summary = element.closest('summary');
      if (summary && summary.parentNode !== closedDetails) {
        return false;
      }
      if (summary === null) {
        return false;
      }
    }
    return elementIsVisible;
  };
  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    if (element.classList.contains('disabled')) {
      return true;
    }
    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }
    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };
  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    }

    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
      return element;
    }

    // when we don't find a shadow root
    if (!element.parentNode) {
      return null;
    }
    return findShadowRoot(element.parentNode);
  };
  const noop = () => {};

  /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */
  const reflow = element => {
    element.offsetHeight; // eslint-disable-line no-unused-expressions
  };
  const isRTL = () => document.documentElement.dir === 'rtl';
  const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
    return typeof possibleCallback === 'function' ? possibleCallback.call(...args) : defaultValue;
  };
  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }
    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;
    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }
      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };
    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };

  /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */
  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    const listLength = list.length;
    let index = list.indexOf(activeElement);

    // if the element does not exist in the list return an element
    // depending on the direction and if cycle is allowed
    if (index === -1) {
      return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
    }
    index += shouldGetNext ? 1 : -1;
    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
    }
    return list[Math.max(0, Math.min(index, listLength - 1))];
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/config.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Class definition
   */

  class Config {
    // Getters
    static get Default() {
      return {};
    }
    static get DefaultType() {
      return {};
    }
    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      return config;
    }
    _mergeConfigObj(config, element) {
      const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

      return {
        ...this.constructor.Default,
        ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
        ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
        ...(typeof config === 'object' ? config : {})
      };
    }
    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
      for (const [property, expectedTypes] of Object.entries(configTypes)) {
        const value = config[property];
        const valueType = isElement(value) ? 'element' : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const VERSION = '5.3.8';

  /**
   * Class definition
   */

  class BaseComponent extends Config {
    constructor(element, config) {
      super();
      element = getElement(element);
      if (!element) {
        return;
      }
      this._element = element;
      this._config = this._getConfig(config);
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    // Public
    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      for (const propertyName of Object.getOwnPropertyNames(this)) {
        this[propertyName] = null;
      }
    }

    // Private
    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config, this._element);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }

    // Static
    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
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

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');
    if (!selector || selector === '#') {
      let hrefAttribute = element.getAttribute('href');

      // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273
      if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
        return null;
      }

      // Just in case some CMS puts out a full URL with the anchor appended
      if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
        hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
      }
      selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
    }
    return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
  };
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },
    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },
    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },
    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode.closest(selector);
      while (ancestor) {
        parents.push(ancestor);
        ancestor = ancestor.parentNode.closest(selector);
      }
      return parents;
    },
    prev(element, selector) {
      let previous = element.previousElementSibling;
      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }
        previous = previous.previousElementSibling;
      }
      return [];
    },
    // TODO: this is now unused; remove later along with prev()
    next(element, selector) {
      let next = element.nextElementSibling;
      while (next) {
        if (next.matches(selector)) {
          return [next];
        }
        next = next.nextElementSibling;
      }
      return [];
    },
    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
    },
    getSelectorFromElement(element) {
      const selector = getSelector(element);
      if (selector) {
        return SelectorEngine.findOne(selector) ? selector : null;
      }
      return null;
    },
    getElementFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.findOne(selector) : null;
    },
    getMultipleElementsFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.find(selector) : [];
    }
  };

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
      if (isDisabled(this)) {
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

  /**
   * --------------------------------------------------------------------------
   * Bootstrap alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$j = 'alert';
  const DATA_KEY$e = 'bs.alert';
  const EVENT_KEY$f = `.${DATA_KEY$e}`;
  const EVENT_CLOSE = `close${EVENT_KEY$f}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$f}`;
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$7 = 'show';

  /**
   * Class definition
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$j;
    }

    // Public
    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
      if (closeEvent.defaultPrevented) {
        return;
      }
      this._element.classList.remove(CLASS_NAME_SHOW$7);
      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$4);
      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
    }

    // Private
    _destroyElement() {
      this._element.remove();
      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
    }
  }

  /**
   * Data API implementation
   */

  enableDismissTrigger(Alert, 'close');

  /**
   * --------------------------------------------------------------------------
   * Bootstrap button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$i = 'button';
  const DATA_KEY$d = 'bs.button';
  const EVENT_KEY$e = `.${DATA_KEY$d}`;
  const DATA_API_KEY$9 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$9 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$e}${DATA_API_KEY$9}`;

  /**
   * Class definition
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$i;
    }

    // Public
    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DATA_TOGGLE$9, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$9);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/swipe.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$h = 'swipe';
  const EVENT_KEY$d = '.bs.swipe';
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$d}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$d}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$d}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$d}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$d}`;
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SWIPE_THRESHOLD = 40;
  const Default$g = {
    endCallback: null,
    leftCallback: null,
    rightCallback: null
  };
  const DefaultType$g = {
    endCallback: '(function|null)',
    leftCallback: '(function|null)',
    rightCallback: '(function|null)'
  };

  /**
   * Class definition
   */

  class Swipe extends Config {
    constructor(element, config) {
      super();
      this._element = element;
      if (!element || !Swipe.isSupported()) {
        return;
      }
      this._config = this._getConfig(config);
      this._deltaX = 0;
      this._supportPointerEvents = Boolean(window.PointerEvent);
      this._initEvents();
    }

    // Getters
    static get Default() {
      return Default$g;
    }
    static get DefaultType() {
      return DefaultType$g;
    }
    static get NAME() {
      return NAME$h;
    }

    // Public
    dispose() {
      EventHandler.off(this._element, EVENT_KEY$d);
    }

    // Private
    _start(event) {
      if (!this._supportPointerEvents) {
        this._deltaX = event.touches[0].clientX;
        return;
      }
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX;
      }
    }
    _end(event) {
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX - this._deltaX;
      }
      this._handleSwipe();
      execute(this._config.endCallback);
    }
    _move(event) {
      this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
    }
    _handleSwipe() {
      const absDeltaX = Math.abs(this._deltaX);
      if (absDeltaX <= SWIPE_THRESHOLD) {
        return;
      }
      const direction = absDeltaX / this._deltaX;
      this._deltaX = 0;
      if (!direction) {
        return;
      }
      execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
    }
    _initEvents() {
      if (this._supportPointerEvents) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
      }
    }
    _eventIsPointerPenTouch(event) {
      return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
    }

    // Static
    static isSupported() {
      return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$g = 'carousel';
  const DATA_KEY$c = 'bs.carousel';
  const EVENT_KEY$c = `.${DATA_KEY$c}`;
  const DATA_API_KEY$8 = '.data-api';
  const ARROW_LEFT_KEY$2 = 'ArrowLeft';
  const ARROW_RIGHT_KEY$2 = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$c}`;
  const EVENT_SLID = `slid${EVENT_KEY$c}`;
  const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$c}`;
  const EVENT_MOUSEENTER$2 = `mouseenter${EVENT_KEY$c}`;
  const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$c}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$c}`;
  const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$c}${DATA_API_KEY$8}`;
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$c}${DATA_API_KEY$8}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY$2]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY$2]: DIRECTION_LEFT
  };
  const Default$f = {
    interval: 5000,
    keyboard: true,
    pause: 'hover',
    ride: false,
    touch: true,
    wrap: true
  };
  const DefaultType$f = {
    interval: '(number|boolean)',
    // TODO:v6 remove boolean support
    keyboard: 'boolean',
    pause: '(string|boolean)',
    ride: '(boolean|string)',
    touch: 'boolean',
    wrap: 'boolean'
  };

  /**
   * Class definition
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._interval = null;
      this._activeElement = null;
      this._isSliding = false;
      this.touchTimeout = null;
      this._swipeHelper = null;
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._addEventListeners();
      if (this._config.ride === CLASS_NAME_CAROUSEL) {
        this.cycle();
      }
    }

    // Getters
    static get Default() {
      return Default$f;
    }
    static get DefaultType() {
      return DefaultType$f;
    }
    static get NAME() {
      return NAME$g;
    }

    // Public
    next() {
      this._slide(ORDER_NEXT);
    }
    nextWhenVisible() {
      // FIXME TODO use `document.visibilityState`
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }
    prev() {
      this._slide(ORDER_PREV);
    }
    pause() {
      if (this._isSliding) {
        triggerTransitionEnd(this._element);
      }
      this._clearInterval();
    }
    cycle() {
      this._clearInterval();
      this._updateInterval();
      this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
    }
    _maybeEnableCycle() {
      if (!this._config.ride) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
        return;
      }
      this.cycle();
    }
    to(index) {
      const items = this._getItems();
      if (index > items.length - 1 || index < 0) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }
      const activeIndex = this._getItemIndex(this._getActive());
      if (activeIndex === index) {
        return;
      }
      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
      this._slide(order, items[index]);
    }
    dispose() {
      if (this._swipeHelper) {
        this._swipeHelper.dispose();
      }
      super.dispose();
    }

    // Private
    _configAfterMerge(config) {
      config.defaultInterval = config.interval;
      return config;
    }
    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
      }
      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER$2, () => this.pause());
        EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
      }
      if (this._config.touch && Swipe.isSupported()) {
        this._addTouchEventListeners();
      }
    }
    _addTouchEventListeners() {
      for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
        EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
      }
      const endCallBack = () => {
        if (this._config.pause !== 'hover') {
          return;
        }

        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause();
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      };
      const swipeConfig = {
        leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
        rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
        endCallback: endCallBack
      };
      this._swipeHelper = new Swipe(this._element, swipeConfig);
    }
    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        this._slide(this._directionToOrder(direction));
      }
    }
    _getItemIndex(element) {
      return this._getItems().indexOf(element);
    }
    _setActiveIndicatorElement(index) {
      if (!this._indicatorsElement) {
        return;
      }
      const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute('aria-current');
      const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
      if (newActiveIndicator) {
        newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
        newActiveIndicator.setAttribute('aria-current', 'true');
      }
    }
    _updateInterval() {
      const element = this._activeElement || this._getActive();
      if (!element) {
        return;
      }
      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
      this._config.interval = elementInterval || this._config.defaultInterval;
    }
    _slide(order, element = null) {
      if (this._isSliding) {
        return;
      }
      const activeElement = this._getActive();
      const isNext = order === ORDER_NEXT;
      const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
      if (nextElement === activeElement) {
        return;
      }
      const nextElementIndex = this._getItemIndex(nextElement);
      const triggerEvent = eventName => {
        return EventHandler.trigger(this._element, eventName, {
          relatedTarget: nextElement,
          direction: this._orderToDirection(order),
          from: this._getItemIndex(activeElement),
          to: nextElementIndex
        });
      };
      const slideEvent = triggerEvent(EVENT_SLIDE);
      if (slideEvent.defaultPrevented) {
        return;
      }
      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        // TODO: change tests that use empty divs to avoid this check
        return;
      }
      const isCycling = Boolean(this._interval);
      this.pause();
      this._isSliding = true;
      this._setActiveIndicatorElement(nextElementIndex);
      this._activeElement = nextElement;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);
      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
        this._isSliding = false;
        triggerEvent(EVENT_SLID);
      };
      this._queueCallback(completeCallBack, activeElement, this._isAnimated());
      if (isCycling) {
        this.cycle();
      }
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_SLIDE);
    }
    _getActive() {
      return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    }
    _getItems() {
      return SelectorEngine.find(SELECTOR_ITEM, this._element);
    }
    _clearInterval() {
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }
    _directionToOrder(direction) {
      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }
      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }
    _orderToDirection(order) {
      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }
      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_SLIDE, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }
    event.preventDefault();
    const carousel = Carousel.getOrCreateInstance(target);
    const slideIndex = this.getAttribute('data-bs-slide-to');
    if (slideIndex) {
      carousel.to(slideIndex);
      carousel._maybeEnableCycle();
      return;
    }
    if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
      carousel.next();
      carousel._maybeEnableCycle();
      return;
    }
    carousel.prev();
    carousel._maybeEnableCycle();
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
    for (const carousel of carousels) {
      Carousel.getOrCreateInstance(carousel);
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$f = 'collapse';
  const DATA_KEY$b = 'bs.collapse';
  const EVENT_KEY$b = `.${DATA_KEY$b}`;
  const DATA_API_KEY$7 = '.data-api';
  const EVENT_SHOW$7 = `show${EVENT_KEY$b}`;
  const EVENT_SHOWN$7 = `shown${EVENT_KEY$b}`;
  const EVENT_HIDE$7 = `hide${EVENT_KEY$b}`;
  const EVENT_HIDDEN$7 = `hidden${EVENT_KEY$b}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
  const SELECTOR_DATA_TOGGLE$8 = '[data-bs-toggle="collapse"]';
  const Default$e = {
    parent: null,
    toggle: true
  };
  const DefaultType$e = {
    parent: '(null|element)',
    toggle: 'boolean'
  };

  /**
   * Class definition
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isTransitioning = false;
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$8);
      for (const elem of toggleList) {
        const selector = SelectorEngine.getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
        if (selector !== null && filterElement.length) {
          this._triggerArray.push(elem);
        }
      }
      this._initializeChildren();
      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
      }
      if (this._config.toggle) {
        this.toggle();
      }
    }

    // Getters
    static get Default() {
      return Default$e;
    }
    static get DefaultType() {
      return DefaultType$e;
    }
    static get NAME() {
      return NAME$f;
    }

    // Public
    toggle() {
      if (this._isShown()) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
      }
      let activeChildren = [];

      // find active children
      if (this._config.parent) {
        activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
          toggle: false
        }));
      }
      if (activeChildren.length && activeChildren[0]._isTransitioning) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$7);
      if (startEvent.defaultPrevented) {
        return;
      }
      for (const activeInstance of activeChildren) {
        activeInstance.hide();
      }
      const dimension = this._getDimension();
      this._element.classList.remove(CLASS_NAME_COLLAPSE);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;
      this._addAriaAndCollapsedClass(this._triggerArray, true);
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$6);
        this._element.style[dimension] = '';
        EventHandler.trigger(this._element, EVENT_SHOWN$7);
      };
      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      this._queueCallback(complete, this._element, true);
      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }
    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$7);
      if (startEvent.defaultPrevented) {
        return;
      }
      const dimension = this._getDimension();
      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$6);
      for (const trigger of this._triggerArray) {
        const element = SelectorEngine.getElementFromSelector(trigger);
        if (element && !this._isShown(element)) {
          this._addAriaAndCollapsedClass([trigger], false);
        }
      }
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE);
        EventHandler.trigger(this._element, EVENT_HIDDEN$7);
      };
      this._element.style[dimension] = '';
      this._queueCallback(complete, this._element, true);
    }

    // Private
    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$6);
    }
    _configAfterMerge(config) {
      config.toggle = Boolean(config.toggle); // Coerce string values
      config.parent = getElement(config.parent);
      return config;
    }
    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
    }
    _initializeChildren() {
      if (!this._config.parent) {
        return;
      }
      const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$8);
      for (const element of children) {
        const selected = SelectorEngine.getElementFromSelector(element);
        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      }
    }
    _getFirstLevelChildren(selector) {
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      // remove children if greater depth
      return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
    }
    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
      }
      for (const element of triggerArray) {
        element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
        element.setAttribute('aria-expanded', isOpen);
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE$8, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }
    for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
      Collapse.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap datepicker.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$e = 'datepicker';
  const DATA_KEY$a = 'bs.datepicker';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$6 = '.data-api';
  const EVENT_CHANGE = `change${EVENT_KEY$a}`;
  const EVENT_SHOW$6 = `show${EVENT_KEY$a}`;
  const EVENT_SHOWN$6 = `shown${EVENT_KEY$a}`;
  const EVENT_HIDE$6 = `hide${EVENT_KEY$a}`;
  const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$a}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
  const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY$a}${DATA_API_KEY$6}`;
  const SELECTOR_DATA_TOGGLE$7 = '[data-bs-toggle="datepicker"]';
  const HIDE_DELAY = 100; // ms delay before hiding after selection

  const Default$d = {
    datepickerTheme: null,
    // 'light', 'dark', 'auto' - explicit theme for datepicker popover only
    dateMin: null,
    dateMax: null,
    dateFormat: null,
    // Intl.DateTimeFormat options, or function(date, locale) => string
    displayElement: null,
    // Element to show formatted date (defaults to element for buttons)
    displayMonthsCount: 1,
    // Number of months to display side-by-side
    firstWeekday: 1,
    // Monday
    inline: false,
    // Render calendar inline (no popup)
    locale: 'default',
    positionElement: null,
    // Element to position calendar relative to (defaults to input)
    selectedDates: [],
    selectionMode: 'single',
    // 'single', 'multiple', 'multiple-ranged'
    placement: 'left',
    // 'left', 'center', 'right', 'auto'
    vcpOptions: {} // Pass-through for any VCP option
  };
  const DefaultType$d = {
    datepickerTheme: '(null|string)',
    dateMin: '(null|string|number|object)',
    dateMax: '(null|string|number|object)',
    dateFormat: '(null|object|function)',
    displayElement: '(null|string|element|boolean)',
    displayMonthsCount: 'number',
    firstWeekday: 'number',
    inline: 'boolean',
    locale: 'string',
    positionElement: '(null|string|element)',
    selectedDates: 'array',
    selectionMode: 'string',
    placement: 'string',
    vcpOptions: 'object'
  };

  /**
   * Class definition
   */

  class Datepicker extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._calendar = null;
      this._isShown = false;
      this._initCalendar();
    }

    // Getters
    static get Default() {
      return Default$d;
    }
    static get DefaultType() {
      return DefaultType$d;
    }
    static get NAME() {
      return NAME$e;
    }

    // Public
    toggle() {
      if (this._config.inline) {
        return; // Inline calendars are always visible
      }
      return this._isShown ? this.hide() : this.show();
    }
    show() {
      if (this._config.inline) {
        return; // Inline calendars are always visible
      }
      if (!this._calendar || isDisabled(this._element) || this._isShown) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._calendar.show();
      this._isShown = true;
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    }
    hide() {
      if (this._config.inline) {
        return; // Inline calendars are always visible
      }
      if (!this._calendar || !this._isShown) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._calendar.hide();
      this._isShown = false;
      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    }
    dispose() {
      if (this._themeObserver) {
        this._themeObserver.disconnect();
        this._themeObserver = null;
      }
      if (this._calendar) {
        this._calendar.destroy();
      }
      this._calendar = null;
      super.dispose();
    }
    getSelectedDates() {
      const dates = this._calendar?.context?.selectedDates;
      return dates ? [...dates] : [];
    }
    setSelectedDates(dates) {
      if (this._calendar) {
        this._calendar.set({
          selectedDates: dates
        });
      }
    }

    // Private
    _initCalendar() {
      this._isInput = this._element.tagName === 'INPUT';
      this._isInline = this._config.inline;

      // For inline mode, look for a hidden input child to bind to
      if (this._isInline && !this._isInput) {
        this._boundInput = this._element.querySelector('input[type="hidden"], input[name]');
      }
      this._positionElement = this._resolvePositionElement();
      this._displayElement = this._resolveDisplayElement();
      const calendarOptions = this._buildCalendarOptions();

      // Create calendar on the position element (for correct popup positioning)
      // but value updates still go to this._element (the input)
      this._calendar = new vanillaCalendarPro.Calendar(this._positionElement, calendarOptions);
      this._calendar.init();

      // Watch for theme changes on ancestor elements (for live theme switching)
      this._setupThemeObserver();

      // Set initial value if input has a value
      if (this._isInput && this._element.value) {
        this._parseInputValue();
      }

      // Populate input/display with preselected dates
      this._updateDisplayWithSelectedDates();
    }
    _updateDisplayWithSelectedDates() {
      const {
        selectedDates
      } = this._config;
      if (!selectedDates || selectedDates.length === 0) {
        return;
      }
      const formattedDate = this._formatDateForInput(selectedDates);
      if (this._isInput) {
        this._element.value = formattedDate;
      }
      if (this._boundInput) {
        this._boundInput.value = selectedDates.join(',');
      }
      if (this._displayElement) {
        this._displayElement.textContent = formattedDate;
      }
    }
    _resolvePositionElement() {
      let {
        positionElement
      } = this._config;
      if (typeof positionElement === 'string') {
        positionElement = document.querySelector(positionElement);
      }

      // Use input's parent if in form-adorn
      if (!positionElement && this._isInput && !this._isInline) {
        const parent = this._element.closest('.form-adorn');
        if (parent) {
          positionElement = parent;
        }
      }
      return positionElement || this._element;
    }
    _resolveDisplayElement() {
      const {
        displayElement
      } = this._config;
      if (typeof displayElement === 'string') {
        return document.querySelector(displayElement);
      }

      // For buttons/non-inputs (not inline), look for a [data-bs-datepicker-display] child
      if (displayElement === true || displayElement === null && !this._isInput && !this._isInline) {
        const displayChild = this._element.querySelector('[data-bs-datepicker-display]');
        return displayChild || this._element;
      }
      return displayElement;
    }
    _getThemeAncestor() {
      return this._element.closest('[data-bs-theme]');
    }
    _getEffectiveTheme() {
      // Priority: explicit datepickerTheme config > inherited from ancestor > none
      const {
        datepickerTheme
      } = this._config;
      if (datepickerTheme) {
        return datepickerTheme;
      }
      const ancestor = this._getThemeAncestor();
      return ancestor?.getAttribute('data-bs-theme') || null;
    }
    _syncThemeAttribute(element) {
      if (!element) {
        return;
      }
      const theme = this._getEffectiveTheme();
      if (theme) {
        // Copy theme to popover (needed because VCP appends to body, breaking CSS inheritance)
        element.setAttribute('data-bs-theme', theme);
      } else {
        // No theme - remove attribute to allow natural inheritance
        element.removeAttribute('data-bs-theme');
      }
    }
    _setupThemeObserver() {
      // Watch for theme changes on ancestor elements
      const ancestor = this._getThemeAncestor();
      if (!ancestor || this._config.datepickerTheme) {
        // No ancestor to watch, or explicit datepickerTheme overrides
        return;
      }
      this._themeObserver = new MutationObserver(() => {
        this._syncThemeAttribute(this._calendar?.context?.mainElement);
      });
      this._themeObserver.observe(ancestor, {
        attributes: true,
        attributeFilter: ['data-bs-theme']
      });
    }
    _buildCalendarOptions() {
      // Get theme for VCP - use 'system' for auto-detection if no explicit theme
      const theme = this._getEffectiveTheme();
      // VCP uses 'system' for auto, Bootstrap uses 'auto'
      const vcpTheme = !theme || theme === 'auto' ? 'system' : theme;
      const calendarOptions = {
        ...this._config.vcpOptions,
        inputMode: !this._isInline,
        positionToInput: this._config.placement,
        firstWeekday: this._config.firstWeekday,
        locale: this._config.locale,
        selectionDatesMode: this._config.selectionMode,
        selectedDates: this._config.selectedDates,
        displayMonthsCount: this._config.displayMonthsCount,
        type: this._config.displayMonthsCount > 1 ? 'multiple' : 'default',
        selectedTheme: vcpTheme,
        themeAttrDetect: '[data-bs-theme]',
        onClickDate: (self, event) => this._handleDateClick(self, event),
        onInit: self => {
          this._syncThemeAttribute(self.context.mainElement);
        },
        onShow: () => {
          this._isShown = true;
          this._syncThemeAttribute(this._calendar.context.mainElement);
        },
        onHide: () => {
          this._isShown = false;
        }
      };

      // Navigate to the month of the first selected date
      if (this._config.selectedDates.length > 0) {
        const firstDate = this._parseDate(this._config.selectedDates[0]);
        calendarOptions.selectedMonth = firstDate.getMonth();
        calendarOptions.selectedYear = firstDate.getFullYear();
      }
      if (this._config.dateMin) {
        calendarOptions.dateMin = this._config.dateMin;
      }
      if (this._config.dateMax) {
        calendarOptions.dateMax = this._config.dateMax;
      }
      return calendarOptions;
    }
    _handleDateClick(self, event) {
      const selectedDates = [...self.context.selectedDates];
      if (selectedDates.length > 0) {
        const formattedDate = this._formatDateForInput(selectedDates);
        if (this._isInput) {
          this._element.value = formattedDate;
        }
        if (this._boundInput) {
          this._boundInput.value = selectedDates.join(',');
        }
        if (this._displayElement) {
          this._displayElement.textContent = formattedDate;
        }
      }
      EventHandler.trigger(this._element, EVENT_CHANGE, {
        dates: selectedDates,
        event
      });
      this._maybeHideAfterSelection(selectedDates);
    }
    _maybeHideAfterSelection(selectedDates) {
      if (this._isInline) {
        return;
      }
      const shouldHide = this._config.selectionMode === 'single' && selectedDates.length > 0 || this._config.selectionMode === 'multiple-ranged' && selectedDates.length >= 2;
      if (shouldHide) {
        setTimeout(() => this.hide(), HIDE_DELAY);
      }
    }
    _parseDate(dateStr) {
      const [year, month, day] = dateStr.split('-');
      return new Date(year, month - 1, day);
    }
    _formatDate(dateStr) {
      const date = this._parseDate(dateStr);
      const locale = this._config.locale === 'default' ? undefined : this._config.locale;
      const {
        dateFormat
      } = this._config;

      // Custom function formatter
      if (typeof dateFormat === 'function') {
        return dateFormat(date, locale);
      }

      // Intl.DateTimeFormat options object
      if (dateFormat && typeof dateFormat === 'object') {
        return new Intl.DateTimeFormat(locale, dateFormat).format(date);
      }

      // Default: locale-aware formatting
      return date.toLocaleDateString(locale);
    }
    _formatDateForInput(dates) {
      if (dates.length === 0) {
        return '';
      }
      if (dates.length === 1) {
        return this._formatDate(dates[0]);
      }

      // For date ranges, use en-dash; for multiple dates, use comma
      const separator = this._config.selectionMode === 'multiple-ranged' ? ' – ' : ', ';
      return dates.map(d => this._formatDate(d)).join(separator);
    }
    _parseInputValue() {
      // Try to parse the input value as a date
      const value = this._element.value.trim();
      if (!value) {
        return;
      }
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        this._calendar.set({
          selectedDates: [formatted]
        });
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$7, function (event) {
    // Only handle if not an input (inputs use focus)
    // Skip inline datepickers (they're always visible)
    if (this.tagName === 'INPUT' || this.dataset.bsInline === 'true') {
      return;
    }
    event.preventDefault();
    Datepicker.getOrCreateInstance(this).toggle();
  });
  EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE$7, function () {
    // Handle focus for input elements
    if (this.tagName !== 'INPUT') {
      return;
    }
    Datepicker.getOrCreateInstance(this).show();
  });

  // Auto-initialize inline datepickers on DOMContentLoaded
  EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$a}${DATA_API_KEY$6}`, () => {
    for (const element of document.querySelectorAll(`${SELECTOR_DATA_TOGGLE$7}[data-bs-inline="true"]`)) {
      Datepicker.getOrCreateInstance(element);
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dialog.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$d = 'dialog';
  const DATA_KEY$9 = 'bs.dialog';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$5 = '.data-api';
  const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
  const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$9}`;
  const EVENT_CANCEL = `cancel${EVENT_KEY$9}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
  const CLASS_NAME_STATIC = 'dialog-static';
  const CLASS_NAME_OPEN = 'dialog-open';
  const CLASS_NAME_NONMODAL = 'dialog-nonmodal';
  const SELECTOR_DATA_TOGGLE$6 = '[data-bs-toggle="dialog"]';
  const SELECTOR_OPEN_MODAL_DIALOG = 'dialog.dialog[open]:not(.dialog-nonmodal)';
  const Default$c = {
    backdrop: true,
    // true (click dismisses) or 'static' (click does nothing) - only applies to modal dialogs
    keyboard: true,
    modal: true // true uses showModal(), false uses show() for non-modal dialogs
  };
  const DefaultType$c = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    modal: 'boolean'
  };

  /**
   * Class definition
   */

  class Dialog extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isTransitioning = false;
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$c;
    }
    static get DefaultType() {
      return DefaultType$c;
    }
    static get NAME() {
      return NAME$d;
    }

    // Public
    toggle(relatedTarget) {
      return this._element.open ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._element.open || this._isTransitioning) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isTransitioning = true;
      if (this._config.modal) {
        // Modal dialog: use showModal() for focus trapping, backdrop, and top layer
        this._element.showModal();
        // Prevent body scroll for modal dialogs
        document.body.classList.add(CLASS_NAME_OPEN);
      } else {
        // Non-modal dialog: use show() - no backdrop, no focus trap, no top layer
        this._element.classList.add(CLASS_NAME_NONMODAL);
        this._element.show();
      }
      this._queueCallback(() => {
        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$5, {
          relatedTarget
        });
      }, this._element, this._isAnimated());
    }
    hide() {
      if (!this._element.open || this._isTransitioning) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._isTransitioning = true;
      this._queueCallback(() => this._hideDialog(), this._element, this._isAnimated());
    }
    dispose() {
      EventHandler.off(this._element, EVENT_KEY$9);
      super.dispose();
    }
    handleUpdate() {
      // Provided for API consistency with Modal.
      // Native dialogs handle their own positioning.
    }

    // Private
    _hideDialog() {
      this._element.close();
      this._element.classList.remove(CLASS_NAME_NONMODAL);
      this._isTransitioning = false;

      // Only restore body scroll if no other modal dialogs are open
      if (!document.querySelector(SELECTOR_OPEN_MODAL_DIALOG)) {
        document.body.classList.remove(CLASS_NAME_OPEN);
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$5);
    }
    _isAnimated() {
      return this._element.classList.contains('fade');
    }
    _triggerBackdropTransition() {
      const hidePreventedEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
      if (hidePreventedEvent.defaultPrevented) {
        return;
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.classList.remove(CLASS_NAME_STATIC);
      }, this._element);
    }
    _addEventListeners() {
      // Handle native cancel event (Escape key) - only fires for modal dialogs
      EventHandler.on(this._element, 'cancel', event => {
        // Prevent native close behavior - we'll handle it
        event.preventDefault();
        if (!this._config.keyboard) {
          this._triggerBackdropTransition();
          return;
        }
        EventHandler.trigger(this._element, EVENT_CANCEL);
        this.hide();
      });

      // Handle Escape key for non-modal dialogs (native cancel doesn't fire for show())
      EventHandler.on(this._element, 'keydown', event => {
        if (event.key !== 'Escape' || this._config.modal) {
          return;
        }
        event.preventDefault();
        if (!this._config.keyboard) {
          return;
        }
        EventHandler.trigger(this._element, EVENT_CANCEL);
        this.hide();
      });

      // Handle backdrop clicks (only applies to modal dialogs)
      // Native <dialog> fires click on the dialog element when backdrop is clicked
      EventHandler.on(this._element, 'click', event => {
        // Only handle clicks directly on the dialog (backdrop area)
        // Non-modal dialogs don't have a backdrop
        if (event.target !== this._element || !this._config.modal) {
          return;
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }

        // Default: click backdrop to dismiss
        this.hide();
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$6, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    EventHandler.one(target, EVENT_SHOW$5, showEvent => {
      if (showEvent.defaultPrevented) {
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$5, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });

    // Get config from trigger's data attributes
    const config = Manipulator.getDataAttributes(this);

    // Check if trigger is inside an open dialog
    const currentDialog = this.closest('dialog[open]');
    const shouldSwap = currentDialog && currentDialog !== target;
    if (shouldSwap) {
      // Open new dialog first (its backdrop appears over current)
      const newDialog = Dialog.getOrCreateInstance(target, config);
      newDialog.show(this);

      // Close the current dialog (no backdrop flash since new one is already open)
      const currentInstance = Dialog.getInstance(currentDialog);
      if (currentInstance) {
        currentInstance.hide();
      }
      return;
    }
    const data = Dialog.getOrCreateInstance(target, config);
    data.toggle(this);
  });
  enableDismissTrigger(Dialog);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/floating-ui.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Breakpoints for responsive placement (matches SCSS $grid-breakpoints)
   */
  const BREAKPOINTS = {
    sm: 576,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  /**
   * Parse a placement string that may contain responsive prefixes
   * Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
   *
   * @param {string} placementString - The placement string to parse
   * @param {string} defaultPlacement - The default placement to use for xs/base
   * @returns {object|null} - Object with breakpoint keys and placement values, or null if not responsive
   */
  const parseResponsivePlacement = (placementString, defaultPlacement = 'bottom') => {
    // Check if placement contains responsive prefixes (e.g., "bottom-start md:top-end")
    if (!placementString || !placementString.includes(':')) {
      return null;
    }

    // Parse the placement string into breakpoint-keyed object
    const parts = placementString.split(/\s+/);
    const placements = {
      xs: defaultPlacement
    }; // Default fallback

    for (const part of parts) {
      if (part.includes(':')) {
        // Responsive placement like "md:top-end"
        const [breakpoint, placement] = part.split(':');
        if (BREAKPOINTS[breakpoint] !== undefined) {
          placements[breakpoint] = placement;
        }
      } else {
        // Base placement (no prefix = xs/default)
        placements.xs = part;
      }
    }
    return placements;
  };

  /**
   * Get the active placement for the current viewport width
   *
   * @param {object} responsivePlacements - Object with breakpoint keys and placement values
   * @param {string} defaultPlacement - Fallback placement
   * @returns {string} - The active placement for current viewport
   */
  const getResponsivePlacement = (responsivePlacements, defaultPlacement = 'bottom') => {
    if (!responsivePlacements) {
      return defaultPlacement;
    }

    // Get current viewport width
    const viewportWidth = window.innerWidth;

    // Find the largest breakpoint that matches
    let activePlacement = responsivePlacements.xs || defaultPlacement;

    // Check breakpoints in order (sm, md, lg, xl, 2xl)
    const breakpointOrder = ['sm', 'md', 'lg', 'xl', '2xl'];
    for (const breakpoint of breakpointOrder) {
      const minWidth = BREAKPOINTS[breakpoint];
      if (viewportWidth >= minWidth && responsivePlacements[breakpoint]) {
        activePlacement = responsivePlacements[breakpoint];
      }
    }
    return activePlacement;
  };

  /**
   * Create media query listeners for responsive placement changes
   *
   * @param {Function} callback - Callback to run when breakpoint changes
   * @returns {Array} - Array of { mql, handler } objects for cleanup
   */
  const createBreakpointListeners = callback => {
    const listeners = [];
    for (const breakpoint of Object.keys(BREAKPOINTS)) {
      const minWidth = BREAKPOINTS[breakpoint];
      const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
      mql.addEventListener('change', callback);
      listeners.push({
        mql,
        handler: callback
      });
    }
    return listeners;
  };

  /**
   * Clean up media query listeners
   *
   * @param {Array} listeners - Array of { mql, handler } objects
   */
  const disposeBreakpointListeners = listeners => {
    for (const {
      mql,
      handler
    } of listeners) {
      mql.removeEventListener('change', handler);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$c = 'dropdown';
  const DATA_KEY$8 = 'bs.dropdown';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const TAB_KEY$1 = 'Tab';
  const ARROW_UP_KEY$1 = 'ArrowUp';
  const ARROW_DOWN_KEY$1 = 'ArrowDown';
  const ARROW_LEFT_KEY$1 = 'ArrowLeft';
  const ARROW_RIGHT_KEY$1 = 'ArrowRight';
  const HOME_KEY$1 = 'Home';
  const END_KEY$1 = 'End';
  const ENTER_KEY = 'Enter';
  const SPACE_KEY = ' ';
  const RIGHT_MOUSE_BUTTON = 2;

  // Hover intent delay (ms) - grace period before closing submenu
  const SUBMENU_CLOSE_DELAY = 100;
  const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$5 = 'show';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
  const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$5}.${CLASS_NAME_SHOW$5}`;
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_SUBMENU = '.dropdown-submenu';
  const SELECTOR_SUBMENU_TOGGLE = '.dropdown-submenu > .dropdown-item';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-item:not(.disabled):not(:disabled)';

  // Default logical placement (uses start/end which get resolved to left/right based on RTL)
  const DEFAULT_PLACEMENT = 'bottom-start';
  const SUBMENU_PLACEMENT = 'end-start';

  // Resolve logical placement (start/end) to physical (left/right) based on RTL
  const resolveLogicalPlacement = placement => {
    if (isRTL()) {
      // RTL: start → right, end → left
      return placement.replace(/^start(?=-|$)/, 'right').replace(/^end(?=-|$)/, 'left');
    }

    // LTR: start → left, end → right
    return placement.replace(/^start(?=-|$)/, 'left').replace(/^end(?=-|$)/, 'right');
  };

  // Helper for barycentric coordinate calculation (point in triangle check)
  const triangleSign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const Default$b = {
    autoClose: true,
    boundary: 'clippingParents',
    display: 'dynamic',
    offset: [0, 2],
    floatingConfig: null,
    placement: DEFAULT_PLACEMENT,
    reference: 'toggle',
    // Submenu options
    submenuTrigger: 'both',
    // 'click', 'hover', or 'both'
    submenuDelay: SUBMENU_CLOSE_DELAY
  };
  const DefaultType$b = {
    autoClose: '(boolean|string)',
    boundary: '(string|element)',
    display: 'string',
    offset: '(array|string|function)',
    floatingConfig: '(null|object|function)',
    placement: 'string',
    reference: '(string|element|object)',
    submenuTrigger: 'string',
    submenuDelay: 'number'
  };

  /**
   * Class definition
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      if (typeof dom.computePosition === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Floating UI (https://floating-ui.com)');
      }
      super(element, config);
      this._floatingCleanup = null;
      this._mediaQueryListeners = [];
      this._responsivePlacements = null;
      this._parent = this._element.parentNode; // dropdown wrapper
      this._isSubmenu = this._parent.classList.contains('dropdown-submenu');
      this._openSubmenus = new Map(); // Map of submenu element -> cleanup function
      this._submenuCloseTimeouts = new Map(); // Map of submenu element -> timeout ID
      this._hoverIntentData = null; // For safe triangle calculation

      // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
      this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);

      // Parse responsive placements on init
      this._parseResponsivePlacements();

      // Set up submenu event listeners
      this._setupSubmenuListeners();
    }

    // Getters
    static get Default() {
      return Default$b;
    }
    static get DefaultType() {
      return DefaultType$b;
    }
    static get NAME() {
      return NAME$c;
    }

    // Public
    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (isDisabled(this._element) || this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._createFloating();

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, 'mouseover', noop);
        }
      }
      this._element.focus();
      this._element.setAttribute('aria-expanded', 'true');
      this._menu.classList.add(CLASS_NAME_SHOW$5);
      this._element.classList.add(CLASS_NAME_SHOW$5);
      this._parent.classList.add(CLASS_NAME_SHOW$5);
      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
    }
    hide() {
      if (isDisabled(this._element) || !this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      this._completeHide(relatedTarget);
    }
    dispose() {
      this._disposeFloating();
      this._disposeMediaQueryListeners();
      this._closeAllSubmenus();
      this._clearAllSubmenuTimeouts();
      super.dispose();
    }
    update() {
      if (this._floatingCleanup) {
        this._updateFloatingPosition();
      }
    }

    // Private
    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);
      if (hideEvent.defaultPrevented) {
        return;
      }

      // Close all open submenus first
      this._closeAllSubmenus();

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, 'mouseover', noop);
        }
      }
      this._disposeFloating();
      this._menu.classList.remove(CLASS_NAME_SHOW$5);
      this._element.classList.remove(CLASS_NAME_SHOW$5);
      this._parent.classList.remove(CLASS_NAME_SHOW$5);
      this._element.setAttribute('aria-expanded', 'false');
      Manipulator.removeDataAttribute(this._menu, 'placement');
      Manipulator.removeDataAttribute(this._menu, 'display');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
    }
    _getConfig(config) {
      config = super._getConfig(config);
      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Floating UI virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$c.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }
      return config;
    }
    _createFloating() {
      if (this._config.display === 'static') {
        Manipulator.setDataAttribute(this._menu, 'display', 'static');
        return;
      }
      let referenceElement = this._element;
      if (this._config.reference === 'parent') {
        referenceElement = this._parent;
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }

      // Initial position update
      this._updateFloatingPosition(referenceElement);

      // Set up auto-update for scroll/resize
      this._floatingCleanup = dom.autoUpdate(referenceElement, this._menu, () => this._updateFloatingPosition(referenceElement));
    }
    async _updateFloatingPosition(referenceElement = null) {
      if (!this._menu) {
        return;
      }
      if (!referenceElement) {
        if (this._config.reference === 'parent') {
          referenceElement = this._parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        } else {
          referenceElement = this._element;
        }
      }
      const placement = this._getPlacement();
      const middleware = this._getFloatingMiddleware();
      const floatingConfig = this._getFloatingConfig(placement, middleware);
      await this._applyFloatingPosition(referenceElement, this._menu, floatingConfig.placement, floatingConfig.middleware);
    }
    _isShown() {
      return this._menu.classList.contains(CLASS_NAME_SHOW$5);
    }
    _getPlacement() {
      // If we have responsive placements, find the appropriate one for current viewport
      const placement = this._responsivePlacements ? getResponsivePlacement(this._responsivePlacements, DEFAULT_PLACEMENT) : this._config.placement;

      // Resolve logical placements (start/end) to physical (left/right) based on RTL
      return resolveLogicalPlacement(placement);
    }
    _parseResponsivePlacements() {
      this._responsivePlacements = parseResponsivePlacement(this._config.placement, DEFAULT_PLACEMENT);
      if (this._responsivePlacements) {
        this._setupMediaQueryListeners();
      }
    }
    _setupMediaQueryListeners() {
      this._disposeMediaQueryListeners();
      this._mediaQueryListeners = createBreakpointListeners(() => {
        if (this._isShown()) {
          this._updateFloatingPosition();
        }
      });
    }
    _disposeMediaQueryListeners() {
      disposeBreakpointListeners(this._mediaQueryListeners);
      this._mediaQueryListeners = [];
    }
    _getOffset() {
      const {
        offset: offsetConfig
      } = this._config;
      if (typeof offsetConfig === 'string') {
        return offsetConfig.split(',').map(value => Number.parseInt(value, 10));
      }
      if (typeof offsetConfig === 'function') {
        // Floating UI passes different args, adapt the interface for offset function callbacks
        return ({
          placement,
          rects
        }) => {
          const result = offsetConfig({
            placement,
            reference: rects.reference,
            floating: rects.floating
          }, this._element);
          return result;
        };
      }
      return offsetConfig;
    }
    _getFloatingMiddleware() {
      const offsetValue = this._getOffset();
      const middleware = [
      // Offset middleware - handles distance from reference
      dom.offset(typeof offsetValue === 'function' ? offsetValue : {
        mainAxis: offsetValue[1] || 0,
        crossAxis: offsetValue[0] || 0
      }),
      // Flip middleware - handles fallback placements
      dom.flip({
        fallbackPlacements: this._getFallbackPlacements()
      }),
      // Shift middleware - prevents overflow
      dom.shift({
        boundary: this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary
      })];
      return middleware;
    }
    _getFallbackPlacements() {
      // Get appropriate fallback placements based on current placement
      // Fallbacks should preserve alignment (start/end) when possible
      const placement = this._getPlacement();

      // Handle all possible Floating UI placements
      const fallbackMap = {
        bottom: ['top', 'bottom-start', 'bottom-end', 'top-start', 'top-end'],
        'bottom-start': ['top-start', 'bottom-end', 'top-end'],
        'bottom-end': ['top-end', 'bottom-start', 'top-start'],
        top: ['bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
        'top-start': ['bottom-start', 'top-end', 'bottom-end'],
        'top-end': ['bottom-end', 'top-start', 'bottom-start'],
        right: ['left', 'right-start', 'right-end', 'left-start', 'left-end'],
        'right-start': ['left-start', 'right-end', 'left-end', 'top-start', 'bottom-start'],
        'right-end': ['left-end', 'right-start', 'left-start', 'top-end', 'bottom-end'],
        left: ['right', 'left-start', 'left-end', 'right-start', 'right-end'],
        'left-start': ['right-start', 'left-end', 'right-end', 'top-start', 'bottom-start'],
        'left-end': ['right-end', 'left-start', 'right-start', 'top-end', 'bottom-end']
      };
      return fallbackMap[placement] || ['top', 'bottom', 'right', 'left'];
    }
    _getFloatingConfig(placement, middleware) {
      const defaultConfig = {
        placement,
        middleware
      };
      return {
        ...defaultConfig,
        ...execute(this._config.floatingConfig, [undefined, defaultConfig])
      };
    }
    _disposeFloating() {
      if (this._floatingCleanup) {
        this._floatingCleanup();
        this._floatingCleanup = null;
      }
    }

    // Shared helper for positioning any floating element
    async _applyFloatingPosition(reference, floating, placement, middleware) {
      if (!floating.isConnected) {
        return null;
      }
      const {
        x,
        y,
        placement: finalPlacement
      } = await dom.computePosition(reference, floating, {
        placement,
        middleware
      });
      if (!floating.isConnected) {
        return null;
      }
      Object.assign(floating.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        margin: '0'
      });
      Manipulator.setDataAttribute(floating, 'placement', finalPlacement);
      return finalPlacement;
    }

    // -------------------------------------------------------------------------
    // Submenu handling
    // -------------------------------------------------------------------------

    _setupSubmenuListeners() {
      // Set up hover listeners for submenu triggers
      if (this._config.submenuTrigger === 'hover' || this._config.submenuTrigger === 'both') {
        EventHandler.on(this._menu, 'mouseenter', SELECTOR_SUBMENU_TOGGLE, event => {
          this._onSubmenuTriggerEnter(event);
        });
        EventHandler.on(this._menu, 'mouseleave', SELECTOR_SUBMENU, event => {
          this._onSubmenuLeave(event);
        });

        // Track mouse movement for safe triangle calculation
        EventHandler.on(this._menu, 'mousemove', event => {
          this._trackMousePosition(event);
        });
      }

      // Set up click listener for submenu triggers
      if (this._config.submenuTrigger === 'click' || this._config.submenuTrigger === 'both') {
        EventHandler.on(this._menu, 'click', SELECTOR_SUBMENU_TOGGLE, event => {
          this._onSubmenuTriggerClick(event);
        });
      }
    }
    _onSubmenuTriggerEnter(event) {
      const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
      if (!trigger) {
        return;
      }
      const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
      const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
      if (!submenu) {
        return;
      }

      // Cancel any pending close timeout for this submenu
      this._cancelSubmenuCloseTimeout(submenu);

      // Close other open submenus at the same level
      this._closeSiblingSubmenus(submenuWrapper);

      // Open this submenu
      this._openSubmenu(trigger, submenu, submenuWrapper);
    }
    _onSubmenuLeave(event) {
      const submenuWrapper = event.target.closest(SELECTOR_SUBMENU);
      const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
      if (!submenu || !this._openSubmenus.has(submenu)) {
        return;
      }

      // Check if we're moving toward the submenu (safe triangle)
      if (this._isMovingTowardSubmenu(event, submenu)) {
        return;
      }

      // Schedule submenu close with delay
      this._scheduleSubmenuClose(submenu, submenuWrapper);
    }
    _onSubmenuTriggerClick(event) {
      const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
      if (!trigger) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
      const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
      if (!submenu) {
        return;
      }

      // Toggle submenu
      if (this._openSubmenus.has(submenu)) {
        this._closeSubmenu(submenu, submenuWrapper);
      } else {
        this._closeSiblingSubmenus(submenuWrapper);
        this._openSubmenu(trigger, submenu, submenuWrapper);
      }
    }
    _openSubmenu(trigger, submenu, submenuWrapper) {
      if (this._openSubmenus.has(submenu)) {
        return;
      }

      // Set ARIA attributes
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-haspopup', 'true');

      // Position and show submenu
      submenu.classList.add(CLASS_NAME_SHOW$5);
      submenuWrapper.classList.add(CLASS_NAME_SHOW$5);

      // Set up Floating UI positioning for submenu
      const cleanup = this._createSubmenuFloating(trigger, submenu, submenuWrapper);
      this._openSubmenus.set(submenu, cleanup);

      // Set up mouseenter on submenu to cancel close timeout
      EventHandler.on(submenu, 'mouseenter', () => {
        this._cancelSubmenuCloseTimeout(submenu);
      });
    }
    _closeSubmenu(submenu, submenuWrapper) {
      if (!this._openSubmenus.has(submenu)) {
        return;
      }

      // Close any nested submenus first
      const nestedSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} ${SELECTOR_MENU}.${CLASS_NAME_SHOW$5}`, submenu);
      for (const nested of nestedSubmenus) {
        const nestedWrapper = nested.closest(SELECTOR_SUBMENU);
        this._closeSubmenu(nested, nestedWrapper);
      }

      // Get the trigger
      const trigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, submenuWrapper);

      // Clean up Floating UI
      const cleanup = this._openSubmenus.get(submenu);
      if (cleanup) {
        cleanup();
      }
      this._openSubmenus.delete(submenu);

      // Remove event listeners
      EventHandler.off(submenu, 'mouseenter');

      // Update ARIA and visibility
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
      submenu.classList.remove(CLASS_NAME_SHOW$5);
      submenuWrapper.classList.remove(CLASS_NAME_SHOW$5);

      // Clear inline styles
      submenu.style.position = '';
      submenu.style.left = '';
      submenu.style.top = '';
      submenu.style.margin = '';
    }
    _closeAllSubmenus() {
      for (const [submenu] of this._openSubmenus) {
        const submenuWrapper = submenu.closest(SELECTOR_SUBMENU);
        this._closeSubmenu(submenu, submenuWrapper);
      }
    }
    _closeSiblingSubmenus(currentSubmenuWrapper) {
      // Find all sibling submenu wrappers and close their menus
      const parent = currentSubmenuWrapper.parentNode;
      const siblingSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} > ${SELECTOR_MENU}.${CLASS_NAME_SHOW$5}`, parent);
      for (const siblingMenu of siblingSubmenus) {
        const siblingWrapper = siblingMenu.closest(SELECTOR_SUBMENU);
        if (siblingWrapper !== currentSubmenuWrapper) {
          this._closeSubmenu(siblingMenu, siblingWrapper);
        }
      }
    }
    _createSubmenuFloating(trigger, submenu, submenuWrapper) {
      const referenceElement = submenuWrapper;
      const placement = resolveLogicalPlacement(SUBMENU_PLACEMENT);
      const middleware = [dom.offset({
        mainAxis: 0,
        crossAxis: -4
      }), dom.flip({
        fallbackPlacements: [resolveLogicalPlacement('start-start'), resolveLogicalPlacement('end-end'), resolveLogicalPlacement('start-end')]
      }), dom.shift({
        padding: 8
      })];
      const updatePosition = () => this._applyFloatingPosition(referenceElement, submenu, placement, middleware);
      updatePosition();
      return dom.autoUpdate(referenceElement, submenu, updatePosition);
    }
    _scheduleSubmenuClose(submenu, submenuWrapper) {
      this._cancelSubmenuCloseTimeout(submenu);
      const timeoutId = setTimeout(() => {
        this._closeSubmenu(submenu, submenuWrapper);
        this._submenuCloseTimeouts.delete(submenu);
      }, this._config.submenuDelay);
      this._submenuCloseTimeouts.set(submenu, timeoutId);
    }
    _cancelSubmenuCloseTimeout(submenu) {
      const timeoutId = this._submenuCloseTimeouts.get(submenu);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this._submenuCloseTimeouts.delete(submenu);
      }
    }
    _clearAllSubmenuTimeouts() {
      for (const timeoutId of this._submenuCloseTimeouts.values()) {
        clearTimeout(timeoutId);
      }
      this._submenuCloseTimeouts.clear();
    }

    // -------------------------------------------------------------------------
    // Hover intent / Safe triangle
    // -------------------------------------------------------------------------

    _trackMousePosition(event) {
      this._hoverIntentData = {
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now()
      };
    }
    _isMovingTowardSubmenu(event, submenu) {
      if (!this._hoverIntentData) {
        return false;
      }
      const submenuRect = submenu.getBoundingClientRect();
      const currentPos = {
        x: event.clientX,
        y: event.clientY
      };
      const lastPos = {
        x: this._hoverIntentData.x,
        y: this._hoverIntentData.y
      };

      // Create a triangle from current position to submenu edges
      // The triangle represents the "safe zone" for diagonal movement
      const isRtl = isRTL();

      // Determine which edge of the submenu to target based on direction
      const targetX = isRtl ? submenuRect.right : submenuRect.left;
      const topCorner = {
        x: targetX,
        y: submenuRect.top
      };
      const bottomCorner = {
        x: targetX,
        y: submenuRect.bottom
      };

      // Check if cursor is moving toward the submenu
      // by checking if the current position is within the safe triangle
      return this._pointInTriangle(currentPos, lastPos, topCorner, bottomCorner);
    }
    _pointInTriangle(point, v1, v2, v3) {
      // Barycentric coordinate method to check if point is inside triangle
      const d1 = triangleSign(point, v1, v2);
      const d2 = triangleSign(point, v2, v3);
      const d3 = triangleSign(point, v3, v1);
      const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
      const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
      return !(hasNeg && hasPos);
    }

    // -------------------------------------------------------------------------
    // Keyboard navigation
    // -------------------------------------------------------------------------

    _selectMenuItem({
      key,
      target
    }) {
      // Get items only from the current menu level (not nested submenus)
      // If target is inside a menu, use that menu; otherwise use the main menu
      const currentMenu = target.closest(SELECTOR_MENU) || this._menu;
      const items = SelectorEngine.find(`:scope > li > ${SELECTOR_VISIBLE_ITEMS}, :scope > ${SELECTOR_VISIBLE_ITEMS}`, currentMenu).filter(element => isVisible(element));
      if (!items.length) {
        return;
      }

      // if target isn't included in items (e.g. when expanding the dropdown)
      // allow cycling to get the last item in case key equals ARROW_UP_KEY
      getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
    }
    _handleSubmenuKeydown(event) {
      const {
        key,
        target
      } = event;
      const isRtl = isRTL();

      // Determine the "enter submenu" and "exit submenu" keys based on RTL
      const enterKey = isRtl ? ARROW_LEFT_KEY$1 : ARROW_RIGHT_KEY$1;
      const exitKey = isRtl ? ARROW_RIGHT_KEY$1 : ARROW_LEFT_KEY$1;

      // Check if target is a submenu trigger
      const submenuWrapper = target.closest(SELECTOR_SUBMENU);
      const isSubmenuTrigger = submenuWrapper && target.matches(SELECTOR_SUBMENU_TOGGLE);

      // Handle Enter/Space on submenu trigger
      if ((key === ENTER_KEY || key === SPACE_KEY) && isSubmenuTrigger) {
        event.preventDefault();
        event.stopPropagation();
        const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
        if (submenu) {
          this._closeSiblingSubmenus(submenuWrapper);
          this._openSubmenu(target, submenu, submenuWrapper);
          // Focus first item in submenu
          requestAnimationFrame(() => {
            const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS, submenu);
            if (firstItem) {
              firstItem.focus();
            }
          });
        }
        return true;
      }

      // Handle Right arrow (or Left in RTL) - enter submenu
      if (key === enterKey && isSubmenuTrigger) {
        event.preventDefault();
        event.stopPropagation();
        const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
        if (submenu) {
          this._closeSiblingSubmenus(submenuWrapper);
          this._openSubmenu(target, submenu, submenuWrapper);
          // Focus first item in submenu
          requestAnimationFrame(() => {
            const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS, submenu);
            if (firstItem) {
              firstItem.focus();
            }
          });
        }
        return true;
      }

      // Handle Left arrow (or Right in RTL) - exit submenu
      if (key === exitKey) {
        const currentMenu = target.closest(SELECTOR_MENU);
        const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU);
        if (parentSubmenuWrapper) {
          event.preventDefault();
          event.stopPropagation();
          const parentTrigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper);
          this._closeSubmenu(currentMenu, parentSubmenuWrapper);
          if (parentTrigger) {
            parentTrigger.focus();
          }
          return true;
        }
      }

      // Handle Home/End keys
      if (key === HOME_KEY$1 || key === END_KEY$1) {
        event.preventDefault();
        event.stopPropagation();
        const currentMenu = target.closest(SELECTOR_MENU);
        const items = SelectorEngine.find(`:scope > li > ${SELECTOR_VISIBLE_ITEMS}, :scope > ${SELECTOR_VISIBLE_ITEMS}`, currentMenu).filter(element => isVisible(element));
        if (items.length) {
          const targetItem = key === HOME_KEY$1 ? items[0] : items[items.length - 1];
          targetItem.focus();
        }
        return true;
      }
      return false;
    }
    static clearMenus(event) {
      if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
        return;
      }
      const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
      for (const toggle of openToggles) {
        const context = Dropdown.getInstance(toggle);
        if (!context || context._config.autoClose === false) {
          continue;
        }
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);
        if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
          continue;
        }

        // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
        if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
          continue;
        }
        const relatedTarget = {
          relatedTarget: context._element
        };
        if (event.type === 'click') {
          relatedTarget.clickEvent = event;
        }
        context._completeHide(relatedTarget);
      }
    }
    static dataApiKeydownHandler(event) {
      // If not a relevant key => not a dropdown command
      const isInput = /input|textarea/i.test(event.target.tagName);
      const isEscapeEvent = event.key === ESCAPE_KEY$1;
      const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
      const isLeftOrRightEvent = [ARROW_LEFT_KEY$1, ARROW_RIGHT_KEY$1].includes(event.key);
      const isHomeOrEndEvent = [HOME_KEY$1, END_KEY$1].includes(event.key);
      const isEnterOrSpaceEvent = [ENTER_KEY, SPACE_KEY].includes(event.key);

      // Allow Enter/Space only on submenu triggers
      const isSubmenuTrigger = event.target.matches(SELECTOR_SUBMENU_TOGGLE);
      if (!isUpOrDownEvent && !isEscapeEvent && !isLeftOrRightEvent && !isHomeOrEndEvent && !(isEnterOrSpaceEvent && isSubmenuTrigger)) {
        return;
      }
      if (isInput && !isEscapeEvent) {
        return;
      }

      // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$5) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$5)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$5)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$5, event.delegateTarget.parentNode);
      if (!getToggleButton) {
        return;
      }
      const instance = Dropdown.getOrCreateInstance(getToggleButton);

      // Handle submenu navigation first
      if ((isLeftOrRightEvent || isHomeOrEndEvent || isEnterOrSpaceEvent && isSubmenuTrigger) && instance._handleSubmenuKeydown(event)) {
        return;
      }

      // Handle Up/Down navigation
      if (isUpOrDownEvent) {
        event.preventDefault();
        event.stopPropagation();
        instance.show();
        instance._selectMenuItem(event);
        return;
      }

      // Handle Escape
      if (isEscapeEvent && instance._isShown()) {
        event.preventDefault();
        event.stopPropagation();

        // If in a submenu, close just that submenu
        const currentMenu = event.target.closest(SELECTOR_MENU);
        const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU);
        if (parentSubmenuWrapper && instance._openSubmenus.size > 0) {
          const parentTrigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper);
          instance._closeSubmenu(currentMenu, parentSubmenuWrapper);
          if (parentTrigger) {
            parentTrigger.focus();
          }
          return;
        }

        // Otherwise close the whole dropdown
        instance.hide();
        getToggleButton.focus();
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$5, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$2, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$5, function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$b = 'backdrop';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$b}`;
  const Default$a = {
    className: 'modal-backdrop',
    clickCallback: null,
    isAnimated: false,
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    rootElement: 'body' // give the choice to place backdrop under different elements
  };
  const DefaultType$a = {
    className: 'string',
    clickCallback: '(function|null)',
    isAnimated: 'boolean',
    isVisible: 'boolean',
    rootElement: '(element|string)'
  };

  /**
   * Class definition
   */

  class Backdrop extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    // Getters
    static get Default() {
      return Default$a;
    }
    static get DefaultType() {
      return DefaultType$a;
    }
    static get NAME() {
      return NAME$b;
    }

    // Public
    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._append();
      const element = this._getElement();
      if (this._config.isAnimated) {
        reflow(element);
      }
      element.classList.add(CLASS_NAME_SHOW$4);
      this._emulateAnimation(() => {
        execute(callback);
      });
    }
    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._getElement().classList.remove(CLASS_NAME_SHOW$4);
      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    }
    dispose() {
      if (!this._isAppended) {
        return;
      }
      EventHandler.off(this._element, EVENT_MOUSEDOWN);
      this._element.remove();
      this._isAppended = false;
    }

    // Private
    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = this._config.className;
        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$3);
        }
        this._element = backdrop;
      }
      return this._element;
    }
    _configAfterMerge(config) {
      // use getElement() with the default "body" to get a fresh Element on each instantiation
      config.rootElement = getElement(config.rootElement);
      return config;
    }
    _append() {
      if (this._isAppended) {
        return;
      }
      const element = this._getElement();
      this._config.rootElement.append(element);
      EventHandler.on(element, EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }
    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$a = 'focustrap';
  const DATA_KEY$7 = 'bs.focustrap';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const EVENT_FOCUSIN$3 = `focusin${EVENT_KEY$7}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';
  const Default$9 = {
    autofocus: true,
    trapElement: null // The element to trap focus inside of
  };
  const DefaultType$9 = {
    autofocus: 'boolean',
    trapElement: 'element'
  };

  /**
   * Class definition
   */

  class FocusTrap extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
    }

    // Getters
    static get Default() {
      return Default$9;
    }
    static get DefaultType() {
      return DefaultType$9;
    }
    static get NAME() {
      return NAME$a;
    }

    // Public
    activate() {
      if (this._isActive) {
        return;
      }
      if (this._config.autofocus) {
        this._config.trapElement.focus();
      }
      EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop
      EventHandler.on(document, EVENT_FOCUSIN$3, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
    }
    deactivate() {
      if (!this._isActive) {
        return;
      }
      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$7);
    }

    // Private
    _handleFocusin(event) {
      const {
        trapElement
      } = this._config;
      if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
        return;
      }
      const elements = SelectorEngine.focusableChildren(trapElement);
      if (elements.length === 0) {
        trapElement.focus();
      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
      } else {
        elements[0].focus();
      }
    }
    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
      }
      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';
  const PROPERTY_PADDING = 'padding-right';
  const PROPERTY_MARGIN = 'margin-right';

  /**
   * Class definition
   */

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    }

    // Public
    getWidth() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
    hide() {
      const width = this.getWidth();
      this._disableOverFlow();
      // give padding to element to balance the hidden scrollbar width
      this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
      // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
      this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
      this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
    }
    reset() {
      this._resetElementAttributes(this._element, 'overflow');
      this._resetElementAttributes(this._element, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
    }
    isOverflowing() {
      return this.getWidth() > 0;
    }

    // Private
    _disableOverFlow() {
      this._saveInitialAttribute(this._element, 'overflow');
      this._element.style.overflow = 'hidden';
    }
    _setElementAttributes(selector, styleProperty, callback) {
      const scrollbarWidth = this.getWidth();
      const manipulationCallBack = element => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
        }
        this._saveInitialAttribute(element, styleProperty);
        const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
        element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _saveInitialAttribute(element, styleProperty) {
      const actualValue = element.style.getPropertyValue(styleProperty);
      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProperty, actualValue);
      }
    }
    _resetElementAttributes(selector, styleProperty) {
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProperty);
        // We only want to remove the property if the value is `null`; the value can also be zero
        if (value === null) {
          element.style.removeProperty(styleProperty);
          return;
        }
        Manipulator.removeDataAttribute(element, styleProperty);
        element.style.setProperty(styleProperty, value);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _applyManipulationCallback(selector, callBack) {
      if (isElement(selector)) {
        callBack(selector);
        return;
      }
      for (const sel of SelectorEngine.find(selector, this._element)) {
        callBack(sel);
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$9 = 'offcanvas';
  const DATA_KEY$6 = 'bs.offcanvas';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const ESCAPE_KEY = 'Escape';
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_SHOWING$1 = 'showing';
  const CLASS_NAME_HIDING = 'hiding';
  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$6}`;
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="offcanvas"]';
  const Default$8 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$8 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    scroll: 'boolean'
  };

  /**
   * Class definition
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$8;
    }
    static get DefaultType() {
      return DefaultType$8;
    }
    static get NAME() {
      return NAME$9;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._backdrop.show();
      if (!this._config.scroll) {
        new ScrollBarHelper().hide();
      }
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      this._element.classList.add(CLASS_NAME_SHOWING$1);
      const completeCallBack = () => {
        if (!this._config.scroll || this._config.backdrop) {
          this._focustrap.activate();
        }
        this._element.classList.add(CLASS_NAME_SHOW$3);
        this._element.classList.remove(CLASS_NAME_SHOWING$1);
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };
      this._queueCallback(completeCallBack, this._element, true);
    }
    hide() {
      if (!this._isShown) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._focustrap.deactivate();
      this._element.blur();
      this._isShown = false;
      this._element.classList.add(CLASS_NAME_HIDING);
      this._backdrop.hide();
      const completeCallback = () => {
        this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
        this._element.removeAttribute('aria-modal');
        this._element.removeAttribute('role');
        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
        }
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      };
      this._queueCallback(completeCallback, this._element, true);
    }
    dispose() {
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }

    // Private
    _initializeBackDrop() {
      const clickCallback = () => {
        if (this._config.backdrop === 'static') {
          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
          return;
        }
        this.hide();
      };

      // 'static' option will be translated to true, and booleans will keep their value
      const isVisible = Boolean(this._config.backdrop);
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: isVisible ? clickCallback : null
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (event.key !== ESCAPE_KEY) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$4, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$3, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    });

    // avoid conflict when clicking a toggler of an offcanvas, while another is open
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
    if (alreadyOpen && alreadyOpen !== target) {
      Offcanvas.getInstance(alreadyOpen).hide();
    }
    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
      Offcanvas.getOrCreateInstance(selector).show();
    }
  });
  EventHandler.on(window, EVENT_RESIZE, () => {
    for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
      if (getComputedStyle(element).position !== 'fixed') {
        Offcanvas.getOrCreateInstance(element).hide();
      }
    }
  });
  enableDismissTrigger(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap strength.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$8 = 'strength';
  const DATA_KEY$5 = 'bs.strength';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_STRENGTH_CHANGE = `strengthChange${EVENT_KEY$5}`;
  const SELECTOR_DATA_STRENGTH = '[data-bs-strength]';
  const STRENGTH_LEVELS = ['weak', 'fair', 'good', 'strong'];
  const Default$7 = {
    input: null,
    // Selector or element for password input
    minLength: 8,
    messages: {
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong'
    },
    weights: {
      minLength: 1,
      extraLength: 1,
      lowercase: 1,
      uppercase: 1,
      numbers: 1,
      special: 1,
      multipleSpecial: 1,
      longPassword: 1
    },
    thresholds: [2, 4, 6],
    // weak ≤2, fair ≤4, good ≤6, strong >6
    scorer: null // Custom scoring function (password) => number
  };
  const DefaultType$7 = {
    input: '(string|element|null)',
    minLength: 'number',
    messages: 'object',
    weights: 'object',
    thresholds: 'array',
    scorer: '(function|null)'
  };

  /**
   * Class definition
   */

  class Strength extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._input = this._getInput();
      this._segments = SelectorEngine.find('.strength-segment', this._element);
      this._textElement = SelectorEngine.findOne('.strength-text', this._element.parentElement);
      this._currentStrength = null;
      if (this._input) {
        this._addEventListeners();
        // Check initial value
        this._evaluate();
      }
    }

    // Getters
    static get Default() {
      return Default$7;
    }
    static get DefaultType() {
      return DefaultType$7;
    }
    static get NAME() {
      return NAME$8;
    }

    // Public
    getStrength() {
      return this._currentStrength;
    }
    evaluate() {
      this._evaluate();
    }

    // Private
    _getInput() {
      if (this._config.input) {
        return typeof this._config.input === 'string' ? SelectorEngine.findOne(this._config.input) : this._config.input;
      }

      // Look for preceding password input
      const parent = this._element.parentElement;
      return SelectorEngine.findOne('input[type="password"]', parent);
    }
    _addEventListeners() {
      EventHandler.on(this._input, 'input', () => this._evaluate());
      EventHandler.on(this._input, 'change', () => this._evaluate());
    }
    _evaluate() {
      const password = this._input.value;
      const score = this._calculateScore(password);
      const strength = this._scoreToStrength(score);
      if (strength !== this._currentStrength) {
        this._currentStrength = strength;
        this._updateUI(strength, score);
        EventHandler.trigger(this._element, EVENT_STRENGTH_CHANGE, {
          strength,
          score,
          password: password.length > 0 ? '***' : '' // Don't expose actual password
        });
      }
    }
    _calculateScore(password) {
      if (!password) {
        return 0;
      }

      // Use custom scorer if provided
      if (typeof this._config.scorer === 'function') {
        return this._config.scorer(password);
      }
      const {
        weights
      } = this._config;
      let score = 0;

      // Length scoring
      if (password.length >= this._config.minLength) {
        score += weights.minLength;
      }
      if (password.length >= this._config.minLength + 4) {
        score += weights.extraLength;
      }

      // Character variety
      if (/[a-z]/.test(password)) {
        score += weights.lowercase;
      }
      if (/[A-Z]/.test(password)) {
        score += weights.uppercase;
      }
      if (/\d/.test(password)) {
        score += weights.numbers;
      }

      // Special characters
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += weights.special;
      }

      // Extra points for more special chars or length
      if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += weights.multipleSpecial;
      }
      if (password.length >= 16) {
        score += weights.longPassword;
      }
      return score;
    }
    _scoreToStrength(score) {
      if (score === 0) {
        return null;
      }
      const [weak, fair, good] = this._config.thresholds;
      if (score <= weak) {
        return 'weak';
      }
      if (score <= fair) {
        return 'fair';
      }
      if (score <= good) {
        return 'good';
      }
      return 'strong';
    }
    _updateUI(strength) {
      // Update data attribute on element
      if (strength) {
        this._element.dataset.bsStrength = strength;
      } else {
        delete this._element.dataset.bsStrength;
      }

      // Update segmented meter
      const strengthIndex = strength ? STRENGTH_LEVELS.indexOf(strength) : -1;
      for (const [index, segment] of this._segments.entries()) {
        if (index <= strengthIndex) {
          segment.classList.add('active');
        } else {
          segment.classList.remove('active');
        }
      }

      // Update text feedback
      if (this._textElement) {
        if (strength && this._config.messages[strength]) {
          this._textElement.textContent = this._config.messages[strength];
          this._textElement.dataset.bsStrength = strength;

          // Also set the color via inheriting from parent or using CSS variable
          const colorMap = {
            weak: 'danger',
            fair: 'warning',
            good: 'info',
            strong: 'success'
          };
          this._textElement.style.setProperty('--strength-color', `var(--${colorMap[strength]}-text)`);
        } else {
          this._textElement.textContent = '';
          delete this._textElement.dataset.bsStrength;
        }
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$5}${DATA_API_KEY$2}`, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_STRENGTH)) {
      Strength.getOrCreateInstance(element);
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap otp-input.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$7 = 'otpInput';
  const DATA_KEY$4 = 'bs.otp-input';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const DATA_API_KEY$1 = '.data-api';
  const EVENT_COMPLETE = `complete${EVENT_KEY$4}`;
  const EVENT_INPUT = `input${EVENT_KEY$4}`;
  const SELECTOR_DATA_OTP = '[data-bs-otp]';
  const SELECTOR_INPUT = 'input';
  const Default$6 = {
    length: 6,
    mask: false
  };
  const DefaultType$6 = {
    length: 'number',
    mask: 'boolean'
  };

  /**
   * Class definition
   */

  class OtpInput extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._inputs = SelectorEngine.find(SELECTOR_INPUT, this._element);
      this._setupInputs();
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$6;
    }
    static get DefaultType() {
      return DefaultType$6;
    }
    static get NAME() {
      return NAME$7;
    }

    // Public
    getValue() {
      return this._inputs.map(input => input.value).join('');
    }
    setValue(value) {
      const chars = String(value).split('');
      for (const [index, input] of this._inputs.entries()) {
        input.value = chars[index] || '';
      }
      this._checkComplete();
    }
    clear() {
      for (const input of this._inputs) {
        input.value = '';
      }
      this._inputs[0]?.focus();
    }
    focus() {
      // Focus first empty input, or last input if all filled
      const emptyInput = this._inputs.find(input => !input.value);
      if (emptyInput) {
        emptyInput.focus();
      } else {
        this._inputs.at(-1)?.focus();
      }
    }

    // Private
    _setupInputs() {
      for (const input of this._inputs) {
        // Set attributes for proper OTP handling
        input.setAttribute('maxlength', '1');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '\\d*');

        // First input gets autocomplete for browser OTP autofill
        if (input === this._inputs[0]) {
          input.setAttribute('autocomplete', 'one-time-code');
        } else {
          input.setAttribute('autocomplete', 'off');
        }

        // Mask input if configured
        if (this._config.mask) {
          input.setAttribute('type', 'password');
        }
      }
    }
    _addEventListeners() {
      for (const [index, input] of this._inputs.entries()) {
        EventHandler.on(input, 'input', event => this._handleInput(event, index));
        EventHandler.on(input, 'keydown', event => this._handleKeydown(event, index));
        EventHandler.on(input, 'paste', event => this._handlePaste(event));
        EventHandler.on(input, 'focus', event => this._handleFocus(event));
      }
    }
    _handleInput(event, index) {
      const input = event.target;

      // Only allow digits
      if (!/^\d*$/.test(input.value)) {
        input.value = input.value.replace(/\D/g, '');
      }
      const {
        value
      } = input;

      // Handle multi-character input (some browsers/autofill)
      if (value.length > 1) {
        // Distribute characters across inputs
        const chars = value.split('');
        input.value = chars[0] || '';
        for (let i = 1; i < chars.length && index + i < this._inputs.length; i++) {
          this._inputs[index + i].value = chars[i];
        }

        // Focus appropriate input
        const nextIndex = Math.min(index + chars.length, this._inputs.length - 1);
        this._inputs[nextIndex].focus();
      } else if (value && index < this._inputs.length - 1) {
        // Auto-advance to next input
        this._inputs[index + 1].focus();
      }
      EventHandler.trigger(this._element, EVENT_INPUT, {
        value: this.getValue(),
        index
      });
      this._checkComplete();
    }
    _handleKeydown(event, index) {
      const {
        key
      } = event;
      switch (key) {
        case 'Backspace':
          {
            if (!this._inputs[index].value && index > 0) {
              // Move to previous input and clear it
              event.preventDefault();
              this._inputs[index - 1].value = '';
              this._inputs[index - 1].focus();
            }
            break;
          }
        case 'Delete':
          {
            // Clear current and shift remaining values left
            event.preventDefault();
            for (let i = index; i < this._inputs.length - 1; i++) {
              this._inputs[i].value = this._inputs[i + 1].value;
            }
            this._inputs.at(-1).value = '';
            break;
          }
        case 'ArrowLeft':
          {
            if (index > 0) {
              event.preventDefault();
              this._inputs[index - 1].focus();
            }
            break;
          }
        case 'ArrowRight':
          {
            if (index < this._inputs.length - 1) {
              event.preventDefault();
              this._inputs[index + 1].focus();
            }
            break;
          }

        // No default
      }
    }
    _handlePaste(event) {
      event.preventDefault();
      const pastedData = (event.clipboardData || window.clipboardData).getData('text');
      const digits = pastedData.replace(/\D/g, '').slice(0, this._inputs.length);
      if (digits) {
        this.setValue(digits);

        // Focus last filled input or last input
        const lastIndex = Math.min(digits.length, this._inputs.length) - 1;
        this._inputs[lastIndex].focus();
      }
    }
    _handleFocus(event) {
      // Select the content on focus for easy replacement
      event.target.select();
    }
    _checkComplete() {
      const value = this.getValue();
      const isComplete = value.length === this._inputs.length && this._inputs.every(input => input.value !== '');
      if (isComplete) {
        EventHandler.trigger(this._element, EVENT_COMPLETE, {
          value
        });
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$4}${DATA_API_KEY$1}`, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) {
      OtpInput.getOrCreateInstance(element);
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  // js-docs-start allow-list
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    dd: [],
    div: [],
    dl: [],
    dt: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  // js-docs-end allow-list

  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

  /**
   * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
   * contexts.
   *
   * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
   */
  const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
  const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();
    if (allowedAttributeList.includes(attributeName)) {
      if (uriAttributes.has(attributeName)) {
        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
      }
      return true;
    }

    // Check if a regular expression validates the attribute.
    return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }
    if (sanitizeFunction && typeof sanitizeFunction === 'function') {
      return sanitizeFunction(unsafeHtml);
    }
    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
    for (const element of elements) {
      const elementName = element.nodeName.toLowerCase();
      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue;
      }
      const attributeList = [].concat(...element.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
      for (const attribute of attributeList) {
        if (!allowedAttribute(attribute, allowedAttributes)) {
          element.removeAttribute(attribute.nodeName);
        }
      }
    }
    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/template-factory.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$6 = 'TemplateFactory';
  const Default$5 = {
    allowList: DefaultAllowlist,
    content: {},
    // { selector : text ,  selector2 : text2 , }
    extraClass: '',
    html: false,
    sanitize: true,
    sanitizeFn: null,
    template: '<div></div>'
  };
  const DefaultType$5 = {
    allowList: 'object',
    content: 'object',
    extraClass: '(string|function)',
    html: 'boolean',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    template: 'string'
  };
  const DefaultContentType = {
    entry: '(string|element|function|null)',
    selector: '(string|element)'
  };

  /**
   * Class definition
   */

  class TemplateFactory extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
    }

    // Getters
    static get Default() {
      return Default$5;
    }
    static get DefaultType() {
      return DefaultType$5;
    }
    static get NAME() {
      return NAME$6;
    }

    // Public
    getContent() {
      return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
    }
    hasContent() {
      return this.getContent().length > 0;
    }
    changeContent(content) {
      this._checkContent(content);
      this._config.content = {
        ...this._config.content,
        ...content
      };
      return this;
    }
    toHtml() {
      const templateWrapper = document.createElement('div');
      templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
      for (const [selector, text] of Object.entries(this._config.content)) {
        this._setContent(templateWrapper, text, selector);
      }
      const template = templateWrapper.children[0];
      const extraClass = this._resolvePossibleFunction(this._config.extraClass);
      if (extraClass) {
        template.classList.add(...extraClass.split(' '));
      }
      return template;
    }

    // Private
    _typeCheckConfig(config) {
      super._typeCheckConfig(config);
      this._checkContent(config.content);
    }
    _checkContent(arg) {
      for (const [selector, content] of Object.entries(arg)) {
        super._typeCheckConfig({
          selector,
          entry: content
        }, DefaultContentType);
      }
    }
    _setContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);
      if (!templateElement) {
        return;
      }
      content = this._resolvePossibleFunction(content);
      if (!content) {
        templateElement.remove();
        return;
      }
      if (isElement(content)) {
        this._putElementInTemplate(getElement(content), templateElement);
        return;
      }
      if (this._config.html) {
        templateElement.innerHTML = this._maybeSanitize(content);
        return;
      }
      templateElement.textContent = content;
    }
    _maybeSanitize(arg) {
      return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [undefined, this]);
    }
    _putElementInTemplate(element, templateElement) {
      if (this._config.html) {
        templateElement.innerHTML = '';
        templateElement.append(element);
        return;
      }
      templateElement.textContent = element.textContent;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$5 = 'tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="tooltip"]';
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  const EVENT_HIDE$2 = 'hide';
  const EVENT_HIDDEN$2 = 'hidden';
  const EVENT_SHOW$2 = 'show';
  const EVENT_SHOWN$2 = 'shown';
  const EVENT_INSERTED = 'inserted';
  const EVENT_CLICK$3 = 'click';
  const EVENT_FOCUSIN$2 = 'focusin';
  const EVENT_FOCUSOUT$1 = 'focusout';
  const EVENT_MOUSEENTER$1 = 'mouseenter';
  const EVENT_MOUSELEAVE = 'mouseleave';
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$4 = {
    allowList: DefaultAllowlist,
    animation: true,
    boundary: 'clippingParents',
    container: false,
    customClass: '',
    delay: 0,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    html: false,
    offset: [0, 6],
    placement: 'top',
    floatingConfig: null,
    sanitize: true,
    sanitizeFn: null,
    selector: false,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    title: '',
    trigger: 'hover focus'
  };
  const DefaultType$4 = {
    allowList: 'object',
    animation: 'boolean',
    boundary: '(string|element)',
    container: '(string|element|boolean)',
    customClass: '(string|function)',
    delay: '(number|object)',
    fallbackPlacements: 'array',
    html: 'boolean',
    offset: '(array|string|function)',
    placement: '(string|function)',
    floatingConfig: '(null|object|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    selector: '(string|boolean)',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string'
  };

  /**
   * Class definition
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof dom.computePosition === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Floating UI (https://floating-ui.com)');
      }
      super(element, config);

      // Private
      this._isEnabled = true;
      this._timeout = 0;
      this._isHovered = null;
      this._activeTrigger = {};
      this._floatingCleanup = null;
      this._templateFactory = null;
      this._newContent = null;
      this._mediaQueryListeners = [];
      this._responsivePlacements = null;

      // Protected
      this.tip = null;
      this._parseResponsivePlacements();
      this._setListeners();
      if (!this._config.selector) {
        this._fixTitle();
      }
    }

    // Getters
    static get Default() {
      return Default$4;
    }
    static get DefaultType() {
      return DefaultType$4;
    }
    static get NAME() {
      return NAME$5;
    }

    // Public
    enable() {
      this._isEnabled = true;
    }
    disable() {
      this._isEnabled = false;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle() {
      if (!this._isEnabled) {
        return;
      }
      if (this._isShown()) {
        this._leave();
        return;
      }
      this._enter();
    }
    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
      if (this._element.getAttribute('data-bs-original-title')) {
        this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
      }
      this._disposeFloating();
      this._disposeMediaQueryListeners();
      super.dispose();
    }
    async show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }
      if (!(this._isWithContent() && this._isEnabled)) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }
      this._disposeFloating();
      const tip = this._getTipElement();
      this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
      const {
        container
      } = this._config;
      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
      }
      await this._createFloating(tip);
      tip.classList.add(CLASS_NAME_SHOW$2);

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, 'mouseover', noop);
        }
      }
      const complete = () => {
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
        if (this._isHovered === false) {
          this._leave();
        }
        this._isHovered = false;
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    hide() {
      if (!this._isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
      if (hideEvent.defaultPrevented) {
        return;
      }
      const tip = this._getTipElement();
      tip.classList.remove(CLASS_NAME_SHOW$2);

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, 'mouseover', noop);
        }
      }
      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      this._isHovered = null; // it is a trick to support manual triggering

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }
        if (!this._isHovered) {
          this._disposeFloating();
        }
        this._element.removeAttribute('aria-describedby');
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    update() {
      if (this._floatingCleanup && this.tip) {
        this._updateFloatingPosition();
      }
    }

    // Protected
    _isWithContent() {
      return Boolean(this._getTitle());
    }
    _getTipElement() {
      if (!this.tip) {
        this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
      }
      return this.tip;
    }
    _createTipElement(content) {
      const tip = this._getTemplateFactory(content).toHtml();

      // TODO: remove this check in v6
      if (!tip) {
        return null;
      }
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      // TODO: v6 the following can be achieved with CSS only
      tip.classList.add(`bs-${this.constructor.NAME}-auto`);
      const tipId = getUID(this.constructor.NAME).toString();
      tip.setAttribute('id', tipId);
      if (this._isAnimated()) {
        tip.classList.add(CLASS_NAME_FADE$2);
      }
      return tip;
    }
    setContent(content) {
      this._newContent = content;
      if (this._isShown()) {
        this._disposeFloating();
        this.show();
      }
    }
    _getTemplateFactory(content) {
      if (this._templateFactory) {
        this._templateFactory.changeContent(content);
      } else {
        this._templateFactory = new TemplateFactory({
          ...this._config,
          // the `content` var has to be after `this._config`
          // to override config.content in case of popover
          content,
          extraClass: this._resolvePossibleFunction(this._config.customClass)
        });
      }
      return this._templateFactory;
    }
    _getContentForTemplate() {
      return {
        [SELECTOR_TOOLTIP_INNER]: this._getTitle()
      };
    }
    _getTitle() {
      return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
    }

    // Private
    _initializeOnDelegatedTarget(event) {
      return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }
    _isAnimated() {
      return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
    }
    _isShown() {
      return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
    }
    _getPlacement(tip) {
      // If we have responsive placements, get the one for current viewport
      if (this._responsivePlacements) {
        const placement = getResponsivePlacement(this._responsivePlacements, 'top');
        return AttachmentMap[placement.toUpperCase()] || placement;
      }

      // Execute placement (can be a function)
      const placement = execute(this._config.placement, [this, tip, this._element]);
      return AttachmentMap[placement.toUpperCase()] || placement;
    }
    _parseResponsivePlacements() {
      // Only parse if placement is a string (not a function)
      if (typeof this._config.placement !== 'string') {
        this._responsivePlacements = null;
        return;
      }
      this._responsivePlacements = parseResponsivePlacement(this._config.placement, 'top');
      if (this._responsivePlacements) {
        this._setupMediaQueryListeners();
      }
    }
    _setupMediaQueryListeners() {
      this._disposeMediaQueryListeners();
      this._mediaQueryListeners = createBreakpointListeners(() => {
        if (this._isShown()) {
          this._updateFloatingPosition();
        }
      });
    }
    _disposeMediaQueryListeners() {
      disposeBreakpointListeners(this._mediaQueryListeners);
      this._mediaQueryListeners = [];
    }
    async _createFloating(tip) {
      const placement = this._getPlacement(tip);
      const arrowElement = tip.querySelector(`.${this.constructor.NAME}-arrow`);

      // Initial position update
      await this._updateFloatingPosition(tip, placement, arrowElement);

      // Set up auto-update for scroll/resize
      this._floatingCleanup = dom.autoUpdate(this._element, tip, () => this._updateFloatingPosition(tip, null, arrowElement));
    }
    async _updateFloatingPosition(tip = this.tip, placement = null, arrowElement = null) {
      if (!tip) {
        return;
      }
      if (!placement) {
        placement = this._getPlacement(tip);
      }
      if (!arrowElement) {
        arrowElement = tip.querySelector(`.${this.constructor.NAME}-arrow`);
      }
      const middleware = this._getFloatingMiddleware(arrowElement);
      const floatingConfig = this._getFloatingConfig(placement, middleware);
      const {
        x,
        y,
        placement: finalPlacement,
        middlewareData
      } = await dom.computePosition(this._element, tip, floatingConfig);

      // Apply position to tooltip
      Object.assign(tip.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`
      });

      // Ensure arrow is absolutely positioned within tooltip
      if (arrowElement) {
        arrowElement.style.position = 'absolute';
      }

      // Set placement attribute for CSS arrow styling
      Manipulator.setDataAttribute(tip, 'placement', finalPlacement);

      // Position arrow along the edge (center it) if present
      // The CSS handles which edge to place it on via data-bs-placement
      if (arrowElement && middlewareData.arrow) {
        const {
          x: arrowX,
          y: arrowY
        } = middlewareData.arrow;
        const isVertical = finalPlacement.startsWith('top') || finalPlacement.startsWith('bottom');

        // Only set the cross-axis position (centering along the edge)
        // The main-axis position (which edge) is handled by CSS
        Object.assign(arrowElement.style, {
          left: isVertical && arrowX !== null ? `${arrowX}px` : '',
          top: !isVertical && arrowY !== null ? `${arrowY}px` : '',
          // Reset the other axis to let CSS handle it
          right: '',
          bottom: ''
        });
      }
    }
    _getOffset() {
      const {
        offset
      } = this._config;
      if (typeof offset === 'string') {
        return offset.split(',').map(value => Number.parseInt(value, 10));
      }
      if (typeof offset === 'function') {
        // Floating UI passes different args, adapt the interface for offset function callbacks
        return ({
          placement,
          rects
        }) => {
          const result = offset({
            placement,
            reference: rects.reference,
            floating: rects.floating
          }, this._element);
          return result;
        };
      }
      return offset;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [this._element, this._element]);
    }
    _getFloatingMiddleware(arrowElement) {
      const offsetValue = this._getOffset();
      const middleware = [
      // Offset middleware - handles distance from reference
      dom.offset(typeof offsetValue === 'function' ? offsetValue : {
        mainAxis: offsetValue[1] || 0,
        crossAxis: offsetValue[0] || 0
      }),
      // Flip middleware - handles fallback placements
      dom.flip({
        fallbackPlacements: this._config.fallbackPlacements
      }),
      // Shift middleware - prevents overflow
      dom.shift({
        boundary: this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary
      })];

      // Arrow middleware - positions the arrow element
      if (arrowElement) {
        middleware.push(dom.arrow({
          element: arrowElement
        }));
      }
      return middleware;
    }
    _getFloatingConfig(placement, middleware) {
      const defaultConfig = {
        placement,
        middleware
      };
      return {
        ...defaultConfig,
        ...execute(this._config.floatingConfig, [undefined, defaultConfig])
      };
    }
    _setListeners() {
      const triggers = this._config.trigger.split(' ');
      for (const trigger of triggers) {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$3), this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK]);
            context.toggle();
          });
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER$1) : this.constructor.eventName(EVENT_FOCUSIN$2);
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
          EventHandler.on(this._element, eventIn, this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
            context._enter();
          });
          EventHandler.on(this._element, eventOut, this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
            context._leave();
          });
        }
      }
      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };
      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    }
    _fixTitle() {
      const title = this._element.getAttribute('title');
      if (!title) {
        return;
      }
      if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
        this._element.setAttribute('aria-label', title);
      }
      this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
      this._element.removeAttribute('title');
    }
    _enter() {
      if (this._isShown() || this._isHovered) {
        this._isHovered = true;
        return;
      }
      this._isHovered = true;
      this._setTimeout(() => {
        if (this._isHovered) {
          this.show();
        }
      }, this._config.delay.show);
    }
    _leave() {
      if (this._isWithActiveTrigger()) {
        return;
      }
      this._isHovered = false;
      this._setTimeout(() => {
        if (!this._isHovered) {
          this.hide();
        }
      }, this._config.delay.hide);
    }
    _setTimeout(handler, timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(handler, timeout);
    }
    _isWithActiveTrigger() {
      return Object.values(this._activeTrigger).includes(true);
    }
    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      for (const dataAttribute of Object.keys(dataAttributes)) {
        if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
          delete dataAttributes[dataAttribute];
        }
      }
      config = {
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      config.container = config.container === false ? document.body : getElement(config.container);
      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }
      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }
      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }
      return config;
    }
    _getDelegateConfig() {
      const config = {};
      for (const [key, value] of Object.entries(this._config)) {
        if (this.constructor.Default[key] !== value) {
          config[key] = value;
        }
      }
      config.selector = false;
      config.trigger = 'manual';

      // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`
      return config;
    }
    _disposeFloating() {
      if (this._floatingCleanup) {
        this._floatingCleanup();
        this._floatingCleanup = null;
      }
      if (this.tip) {
        this.tip.remove();
        this.tip = null;
      }
    }
  }

  /**
   * Data API implementation - auto-initialize tooltips
   */

  const initTooltip = event => {
    const target = event.target.closest(SELECTOR_DATA_TOGGLE$3);
    if (!target) {
      return;
    }

    // Get or create instance and trigger the appropriate action
    const tooltip = Tooltip.getOrCreateInstance(target);

    // For focus events, manually trigger enter to show
    if (event.type === 'focusin') {
      tooltip._activeTrigger.focus = true;
      tooltip._enter();
    }
  };
  EventHandler.on(document, EVENT_FOCUSIN$2, SELECTOR_DATA_TOGGLE$3, initTooltip);
  EventHandler.on(document, EVENT_MOUSEENTER$1, SELECTOR_DATA_TOGGLE$3, initTooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$4 = 'popover';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="popover"]';
  const EVENT_CLICK$2 = 'click';
  const EVENT_FOCUSIN$1 = 'focusin';
  const EVENT_MOUSEENTER = 'mouseenter';
  const Default$3 = {
    ...Tooltip.Default,
    content: '',
    offset: [0, 8],
    placement: 'right',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
    trigger: 'click'
  };
  const DefaultType$3 = {
    ...Tooltip.DefaultType,
    content: '(null|string|element|function)'
  };

  /**
   * Class definition
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$3;
    }
    static get DefaultType() {
      return DefaultType$3;
    }
    static get NAME() {
      return NAME$4;
    }

    // Overrides
    _isWithContent() {
      return this._getTitle() || this._getContent();
    }

    // Private
    _getContentForTemplate() {
      return {
        [SELECTOR_TITLE]: this._getTitle(),
        [SELECTOR_CONTENT]: this._getContent()
      };
    }
    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }
  }

  /**
   * Data API implementation - auto-initialize popovers
   */

  const initPopover = event => {
    const target = event.target.closest(SELECTOR_DATA_TOGGLE$2);
    if (!target) {
      return;
    }

    // Prevent default for click events to avoid navigation
    if (event.type === 'click') {
      event.preventDefault();
    }

    // Get or create instance
    const popover = Popover.getOrCreateInstance(target);

    // Trigger the appropriate action based on event type
    if (event.type === 'click') {
      popover.toggle();
    } else if (event.type === 'focusin') {
      popover._activeTrigger.focus = true;
      popover._enter();
    }
  };

  // Support click (default), hover, and focus triggers
  EventHandler.on(document, EVENT_CLICK$2, SELECTOR_DATA_TOGGLE$2, initPopover);
  EventHandler.on(document, EVENT_FOCUSIN$1, SELECTOR_DATA_TOGGLE$2, initPopover);
  EventHandler.on(document, EVENT_MOUSEENTER, SELECTOR_DATA_TOGGLE$2, initPopover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$3 = 'scrollspy';
  const DATA_KEY$3 = 'bs.scrollspy';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_ACTIVATE = `activate${EVENT_KEY$3}`;
  const EVENT_CLICK$1 = `click${EVENT_KEY$3}`;
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$3}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_TARGET_LINKS = '[href]';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const Default$2 = {
    offset: null,
    // TODO: v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: '0px 0px -25%',
    smoothScroll: false,
    target: null,
    threshold: [0.1, 0.5, 1]
  };
  const DefaultType$2 = {
    offset: '(number|null)',
    // TODO v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: 'string',
    smoothScroll: 'boolean',
    target: 'element',
    threshold: 'array'
  };

  /**
   * Class definition
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element, config);

      // this._element is the observablesContainer and config.target the menu links wrapper
      this._targetLinks = new Map();
      this._observableSections = new Map();
      this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
      this._activeTarget = null;
      this._observer = null;
      this._previousScrollData = {
        visibleEntryTop: 0,
        parentScrollTop: 0
      };
      this.refresh(); // initialize
    }

    // Getters
    static get Default() {
      return Default$2;
    }
    static get DefaultType() {
      return DefaultType$2;
    }
    static get NAME() {
      return NAME$3;
    }

    // Public
    refresh() {
      this._initializeTargetsAndObservables();
      this._maybeEnableSmoothScroll();
      if (this._observer) {
        this._observer.disconnect();
      } else {
        this._observer = this._getNewObserver();
      }
      for (const section of this._observableSections.values()) {
        this._observer.observe(section);
      }
    }
    dispose() {
      this._observer.disconnect();
      super.dispose();
    }

    // Private
    _configAfterMerge(config) {
      // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
      config.target = getElement(config.target) || document.body;

      // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
      config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
      if (typeof config.threshold === 'string') {
        config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
      }
      return config;
    }
    _maybeEnableSmoothScroll() {
      if (!this._config.smoothScroll) {
        return;
      }

      // unregister any previous listeners
      EventHandler.off(this._config.target, EVENT_CLICK$1);
      EventHandler.on(this._config.target, EVENT_CLICK$1, SELECTOR_TARGET_LINKS, event => {
        const observableSection = this._observableSections.get(event.target.hash);
        if (observableSection) {
          event.preventDefault();
          const root = this._rootElement || window;
          const height = observableSection.offsetTop - this._element.offsetTop;
          if (root.scrollTo) {
            root.scrollTo({
              top: height,
              behavior: 'smooth'
            });
            return;
          }

          // Chrome 60 doesn't support `scrollTo`
          root.scrollTop = height;
        }
      });
    }
    _getNewObserver() {
      const options = {
        root: this._rootElement,
        threshold: this._config.threshold,
        rootMargin: this._config.rootMargin
      };
      return new IntersectionObserver(entries => this._observerCallback(entries), options);
    }

    // The logic of selection
    _observerCallback(entries) {
      const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
      const activate = entry => {
        this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
        this._process(targetElement(entry));
      };
      const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
      const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
      this._previousScrollData.parentScrollTop = parentScrollTop;
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          this._activeTarget = null;
          this._clearActiveClass(targetElement(entry));
          continue;
        }
        const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
        // if we are scrolling down, pick the bigger offsetTop
        if (userScrollsDown && entryIsLowerThanPrevious) {
          activate(entry);
          // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
          if (!parentScrollTop) {
            return;
          }
          continue;
        }

        // if we are scrolling up, pick the smallest offsetTop
        if (!userScrollsDown && !entryIsLowerThanPrevious) {
          activate(entry);
        }
      }
    }
    _initializeTargetsAndObservables() {
      this._targetLinks = new Map();
      this._observableSections = new Map();
      const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
      for (const anchor of targetLinks) {
        // ensure that the anchor has an id and is not disabled
        if (!anchor.hash || isDisabled(anchor)) {
          continue;
        }
        const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

        // ensure that the observableSection exists & is visible
        if (isVisible(observableSection)) {
          this._targetLinks.set(decodeURI(anchor.hash), anchor);
          this._observableSections.set(anchor.hash, observableSection);
        }
      }
    }
    _process(target) {
      if (this._activeTarget === target) {
        return;
      }
      this._clearActiveClass(this._config.target);
      this._activeTarget = target;
      target.classList.add(CLASS_NAME_ACTIVE$1);
      this._activateParents(target);
      EventHandler.trigger(this._element, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }
    _activateParents(target) {
      // Activate dropdown parents
      if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
        return;
      }
      for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
          item.classList.add(CLASS_NAME_ACTIVE$1);
        }
      }
    }
    _clearActiveClass(parent) {
      parent.classList.remove(CLASS_NAME_ACTIVE$1);
      const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
      for (const node of activeNodes) {
        node.classList.remove(CLASS_NAME_ACTIVE$1);
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
      ScrollSpy.getOrCreateInstance(spy);
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$2 = 'tab';
  const DATA_KEY$2 = 'bs.tab';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const EVENT_HIDE$1 = `hide${EVENT_KEY$2}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$2}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$2}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$2}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$2}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}`;
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const HOME_KEY = 'Home';
  const END_KEY = 'End';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const CLASS_DROPDOWN = 'dropdown';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
  const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
  const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
  const SELECTOR_OUTER = '.nav-item, .list-group-item';
  const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
  const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE$1}`;
  const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

  /**
   * Class definition
   */

  class Tab extends BaseComponent {
    constructor(element) {
      super(element);
      this._parent = this._element.closest(SELECTOR_TAB_PANEL);
      if (!this._parent) {
        return;
        // TODO: should throw exception in v6
        // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
      }

      // Set up initial aria attributes
      this._setInitialAttributes(this._parent, this._getChildren());
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
    }

    // Getters
    static get NAME() {
      return NAME$2;
    }

    // Public
    show() {
      // Shows this elem and deactivate the active sibling if exists
      const innerElem = this._element;
      if (this._elemIsActive(innerElem)) {
        return;
      }

      // Search for active tab on same parent to deactivate it
      const active = this._getActiveElem();
      const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
        relatedTarget: innerElem
      }) : null;
      const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
        relatedTarget: active
      });
      if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
        return;
      }
      this._deactivate(active, innerElem);
      this._activate(innerElem, active);
    }

    // Private
    _activate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.add(CLASS_NAME_ACTIVE);
      this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

      const complete = () => {
        if (element.getAttribute('role') !== 'tab') {
          element.classList.add(CLASS_NAME_SHOW$1);
          return;
        }
        element.removeAttribute('tabindex');
        element.setAttribute('aria-selected', true);
        this._toggleDropDown(element, true);
        EventHandler.trigger(element, EVENT_SHOWN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _deactivate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.remove(CLASS_NAME_ACTIVE);
      element.blur();
      this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

      const complete = () => {
        if (element.getAttribute('role') !== 'tab') {
          element.classList.remove(CLASS_NAME_SHOW$1);
          return;
        }
        element.setAttribute('aria-selected', false);
        element.setAttribute('tabindex', '-1');
        this._toggleDropDown(element, false);
        EventHandler.trigger(element, EVENT_HIDDEN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _keydown(event) {
      if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
        return;
      }
      event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
      event.preventDefault();
      const children = this._getChildren().filter(element => !isDisabled(element));
      let nextActiveElement;
      if ([HOME_KEY, END_KEY].includes(event.key)) {
        nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
      } else {
        const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
        nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
      }
      if (nextActiveElement) {
        nextActiveElement.focus({
          preventScroll: true
        });
        Tab.getOrCreateInstance(nextActiveElement).show();
      }
    }
    _getChildren() {
      // collection of inner elements
      return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
    }
    _getActiveElem() {
      return this._getChildren().find(child => this._elemIsActive(child)) || null;
    }
    _setInitialAttributes(parent, children) {
      this._setAttributeIfNotExists(parent, 'role', 'tablist');
      for (const child of children) {
        this._setInitialAttributesOnChild(child);
      }
    }
    _setInitialAttributesOnChild(child) {
      child = this._getInnerElement(child);
      const isActive = this._elemIsActive(child);
      const outerElem = this._getOuterElement(child);
      child.setAttribute('aria-selected', isActive);
      if (outerElem !== child) {
        this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
      }
      if (!isActive) {
        child.setAttribute('tabindex', '-1');
      }
      this._setAttributeIfNotExists(child, 'role', 'tab');

      // set attributes to the related panel too
      this._setInitialAttributesOnTargetPanel(child);
    }
    _setInitialAttributesOnTargetPanel(child) {
      const target = SelectorEngine.getElementFromSelector(child);
      if (!target) {
        return;
      }
      this._setAttributeIfNotExists(target, 'role', 'tabpanel');
      if (child.id) {
        this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
      }
    }
    _toggleDropDown(element, open) {
      const outerElem = this._getOuterElement(element);
      if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
        return;
      }
      const toggle = (selector, className) => {
        const element = SelectorEngine.findOne(selector, outerElem);
        if (element) {
          element.classList.toggle(className, open);
        }
      };
      toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
      toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
      outerElem.setAttribute('aria-expanded', open);
    }
    _setAttributeIfNotExists(element, attribute, value) {
      if (!element.hasAttribute(attribute)) {
        element.setAttribute(attribute, value);
      }
    }
    _elemIsActive(elem) {
      return elem.classList.contains(CLASS_NAME_ACTIVE);
    }

    // Try to get the inner element (usually the .nav-link)
    _getInnerElement(elem) {
      return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
    }

    // Try to get the outer element (usually the .nav-item)
    _getOuterElement(elem) {
      return elem.closest(SELECTOR_OUTER) || elem;
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE$1, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    Tab.getOrCreateInstance(this).show();
  });

  /**
   * Initialize on focus
   */
  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
      Tab.getOrCreateInstance(element);
    }
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$1 = 'toast';
  const DATA_KEY$1 = 'bs.toast';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY$1}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY$1}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY$1}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY$1}`;
  const EVENT_HIDE = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN = `shown${EVENT_KEY$1}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType$1 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default$1 = {
    animation: true,
    autohide: true,
    delay: 5000
  };

  /**
   * Class definition
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;
      this._setListeners();
    }

    // Getters
    static get Default() {
      return Default$1;
    }
    static get DefaultType() {
      return DefaultType$1;
    }
    static get NAME() {
      return NAME$1;
    }

    // Public
    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._clearTimeout();
      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);
        EventHandler.trigger(this._element, EVENT_SHOWN);
        this._maybeScheduleHide();
      };
      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    hide() {
      if (!this.isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
        this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };
      this._element.classList.add(CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    dispose() {
      this._clearTimeout();
      if (this.isShown()) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }
      super.dispose();
    }
    isShown() {
      return this._element.classList.contains(CLASS_NAME_SHOW);
    }

    // Private
    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }
      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }
      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }
    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          {
            this._hasMouseInteraction = isInteracting;
            break;
          }
        case 'focusin':
        case 'focusout':
          {
            this._hasKeyboardInteraction = isInteracting;
            break;
          }
      }
      if (isInteracting) {
        this._clearTimeout();
        return;
      }
      const nextElement = event.relatedTarget;
      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }
      this._maybeScheduleHide();
    }
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  /**
   * Data API implementation
   */

  enableDismissTrigger(Toast);

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

  eventActionOnPlugin(Toggler, EVENT_CLICK, SELECTOR_DATA_TOGGLE, 'toggle');

  /**
   * --------------------------------------------------------------------------
   * Bootstrap index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Datepicker,
    Dialog,
    Dropdown,
    Offcanvas,
    Strength,
    OtpInput,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Toggler,
    Tooltip
  };

  return index_umd;

}));
//# sourceMappingURL=bootstrap.js.map
