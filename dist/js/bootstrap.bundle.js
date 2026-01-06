/*!
  * Bootstrap v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory());
})(this, (function () { 'use strict';

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
  const isElement$1 = object => {
    if (!object || typeof object !== 'object') {
      return false;
    }
    return typeof object.nodeType !== 'undefined';
  };
  const getElement = object => {
    if (isElement$1(object)) {
      return object;
    }
    if (typeof object === 'string' && object.length > 0) {
      return document.querySelector(parseSelector(object));
    }
    return null;
  };
  const isVisible = element => {
    if (!isElement$1(element) || element.getClientRects().length === 0) {
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
  const isRTL$1 = () => document.documentElement.dir === 'rtl';
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
      const jsonConfig = isElement$1(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

      return {
        ...this.constructor.Default,
        ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
        ...(isElement$1(element) ? Manipulator.getDataAttributes(element) : {}),
        ...(typeof config === 'object' ? config : {})
      };
    }
    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
      for (const [property, expectedTypes] of Object.entries(configTypes)) {
        const value = config[property];
        const valueType = isElement$1(value) ? 'element' : toType(value);
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
      if (isRTL$1()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }
      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }
    _orderToDirection(order) {
      if (isRTL$1()) {
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

  /*! name: vanilla-calendar-pro v3.0.5 | url: https://github.com/uvarov-frontend/vanilla-calendar-pro */
  var __defProp=Object.defineProperty,__defProps=Object.defineProperties,__getOwnPropDescs=Object.getOwnPropertyDescriptors,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(e,t,n)=>t in e?__defProp(e,t,{enumerable:true,configurable:true,writable:true,value:n}):e[t]=n,__spreadValues=(e,t)=>{for(var n in t||(t={}))__hasOwnProp.call(t,n)&&__defNormalProp(e,n,t[n]);if(__getOwnPropSymbols)for(var n of __getOwnPropSymbols(t))__propIsEnum.call(t,n)&&__defNormalProp(e,n,t[n]);return e},__spreadProps=(e,t)=>__defProps(e,__getOwnPropDescs(t)),__publicField=(e,t,n)=>(__defNormalProp(e,"symbol"!=typeof t?t+"":t,n),n);const errorMessages={notFoundSelector:e=>`${e} is not found, check the first argument passed to new Calendar.`,notInit:'The calendar has not been initialized, please initialize it using the "init()" method first.',notLocale:"You specified an incorrect language label or did not specify the required number of values ​​for «locale.weekdays» or «locale.months».",incorrectTime:"The value of the time property can be: false, 12 or 24.",incorrectMonthsCount:"For the «multiple» calendar type, the «displayMonthsCount» parameter can have a value from 2 to 12, and for all others it cannot be greater than 1."},setContext=(e,t,n)=>{e.context[t]=n;},destroy=e=>{var t,n,a,l,o;if(!e.context.isInit)throw new Error(errorMessages.notInit);e.inputMode?(null==(t=e.context.mainElement.parentElement)||t.removeChild(e.context.mainElement),null==(a=null==(n=e.context.inputElement)?void 0:n.replaceWith)||a.call(n,e.context.originalElement),setContext(e,"inputElement",void 0)):null==(o=(l=e.context.mainElement).replaceWith)||o.call(l,e.context.originalElement),setContext(e,"mainElement",e.context.originalElement),e.onDestroy&&e.onDestroy(e);},hide=e=>{e.context.isShowInInputMode&&e.context.currentType&&(e.context.mainElement.dataset.vcCalendarHidden="",setContext(e,"isShowInInputMode",false),e.context.cleanupHandlers[0]&&(e.context.cleanupHandlers.forEach((e=>e())),setContext(e,"cleanupHandlers",[])),e.onHide&&e.onHide(e));};function getOffset(e){if(!e||!e.getBoundingClientRect)return {top:0,bottom:0,left:0,right:0};const t=e.getBoundingClientRect(),n=document.documentElement;return {bottom:t.bottom,right:t.right,top:t.top+window.scrollY-n.clientTop,left:t.left+window.scrollX-n.clientLeft}}function getViewportDimensions(){return {vw:Math.max(document.documentElement.clientWidth||0,window.innerWidth||0),vh:Math.max(document.documentElement.clientHeight||0,window.innerHeight||0)}}function getWindowScrollPosition(){return {left:window.scrollX||document.documentElement.scrollLeft||0,top:window.scrollY||document.documentElement.scrollTop||0}}function calculateAvailableSpace(e){const{top:t,left:n}=getWindowScrollPosition(),{top:a,left:l}=getOffset(e),{vh:o,vw:s}=getViewportDimensions(),i=a-t,r=l-n;return {top:i,bottom:o-(i+e.clientHeight),left:r,right:s-(r+e.clientWidth)}}function getAvailablePosition(e,t,n=5){const a={top:true,bottom:true,left:true,right:true},l=[];if(!t||!e)return {canShow:a,parentPositions:l};const{bottom:o,top:s}=calculateAvailableSpace(e),{top:i,left:r}=getOffset(e),{height:c,width:d}=t.getBoundingClientRect(),{vh:u,vw:m}=getViewportDimensions(),h=m/2,p=u/2;return [{condition:i<p,position:"top"},{condition:i>p,position:"bottom"},{condition:r<h,position:"left"},{condition:r>h,position:"right"}].forEach((({condition:e,position:t})=>{e&&l.push(t);})),Object.assign(a,{top:c<=s-n,bottom:c<=o-n,left:d<=r,right:d<=m-r}),{canShow:a,parentPositions:l}}const handleDay=(e,t,n,a)=>{var l;const o=a.querySelector(`[data-vc-date="${t}"]`),s=null==o?void 0:o.querySelector("[data-vc-date-btn]");if(!o||!s)return;if((null==n?void 0:n.modifier)&&s.classList.add(...n.modifier.trim().split(" ")),!(null==n?void 0:n.html))return;const i=document.createElement("div");i.className=e.styles.datePopup,i.dataset.vcDatePopup="",i.innerHTML=e.sanitizerHTML(n.html),s.ariaExpanded="true",s.ariaLabel=`${s.ariaLabel}, ${null==(l=null==i?void 0:i.textContent)?void 0:l.replace(/^\s+|\s+(?=\s)|\s+$/g,"").replace(/&nbsp;/g," ")}`,o.appendChild(i),requestAnimationFrame((()=>{if(!i)return;const{canShow:e}=getAvailablePosition(o,i),t=e.bottom?o.offsetHeight:-i.offsetHeight,n=e.left&&!e.right?o.offsetWidth-i.offsetWidth/2:!e.left&&e.right?i.offsetWidth/2:0;Object.assign(i.style,{left:`${n}px`,top:`${t}px`});}));},createDatePopup=(e,t)=>{var n;e.popups&&(null==(n=Object.entries(e.popups))||n.forEach((([n,a])=>handleDay(e,n,a,t))));},getDate=e=>new Date(`${e}T00:00:00`),getDateString=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,parseDates=e=>e.reduce(((e,t)=>{if(t instanceof Date||"number"==typeof t){const n=t instanceof Date?t:new Date(t);e.push(n.toISOString().substring(0,10));}else t.match(/^(\d{4}-\d{2}-\d{2})$/g)?e.push(t):t.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/g,((t,n,a)=>{const l=getDate(n),o=getDate(a),s=new Date(l.getTime());for(;s<=o;s.setDate(s.getDate()+1))e.push(getDateString(s));return t}));return e}),[]),updateAttribute=(e,t,n,a="")=>{t?e.setAttribute(n,a):e.getAttribute(n)===a&&e.removeAttribute(n);},setDateModifier=(e,t,n,a,l,o,s)=>{var i,r,c,d;const u=getDate(e.context.displayDateMin)>getDate(o)||getDate(e.context.displayDateMax)<getDate(o)||(null==(i=e.context.disableDates)?void 0:i.includes(o))||!e.selectionMonthsMode&&"current"!==s||!e.selectionYearsMode&&getDate(o).getFullYear()!==t;updateAttribute(n,u,"data-vc-date-disabled"),a&&updateAttribute(a,u,"aria-disabled","true"),a&&updateAttribute(a,u,"tabindex","-1"),updateAttribute(n,!e.disableToday&&e.context.dateToday===o,"data-vc-date-today"),updateAttribute(n,!e.disableToday&&e.context.dateToday===o,"aria-current","date"),updateAttribute(n,null==(r=e.selectedWeekends)?void 0:r.includes(l),"data-vc-date-weekend");const m=(null==(c=e.selectedHolidays)?void 0:c[0])?parseDates(e.selectedHolidays):[];if(updateAttribute(n,m.includes(o),"data-vc-date-holiday"),(null==(d=e.context.selectedDates)?void 0:d.includes(o))?(n.setAttribute("data-vc-date-selected",""),a&&a.setAttribute("aria-selected","true"),e.context.selectedDates.length>1&&"multiple-ranged"===e.selectionDatesMode&&(e.context.selectedDates[0]===o&&e.context.selectedDates[e.context.selectedDates.length-1]===o?n.setAttribute("data-vc-date-selected","first-and-last"):e.context.selectedDates[0]===o?n.setAttribute("data-vc-date-selected","first"):e.context.selectedDates[e.context.selectedDates.length-1]===o&&n.setAttribute("data-vc-date-selected","last"),e.context.selectedDates[0]!==o&&e.context.selectedDates[e.context.selectedDates.length-1]!==o&&n.setAttribute("data-vc-date-selected","middle"))):n.hasAttribute("data-vc-date-selected")&&(n.removeAttribute("data-vc-date-selected"),a&&a.removeAttribute("aria-selected")),!e.context.disableDates.includes(o)&&e.enableEdgeDatesOnly&&e.context.selectedDates.length>1&&"multiple-ranged"===e.selectionDatesMode){const t=getDate(e.context.selectedDates[0]),a=getDate(e.context.selectedDates[e.context.selectedDates.length-1]),l=getDate(o);updateAttribute(n,l>t&&l<a,"data-vc-date-selected","middle");}},getLocaleString=(e,t,n)=>new Date(`${e}T00:00:00.000Z`).toLocaleString(t,n),getWeekNumber=(e,t)=>{const n=getDate(e),a=(n.getDay()-t+7)%7;n.setDate(n.getDate()+4-a);const l=new Date(n.getFullYear(),0,1),o=Math.ceil(((+n-+l)/864e5+1)/7);return {year:n.getFullYear(),week:o}},addWeekNumberForDate=(e,t,n)=>{const a=getWeekNumber(n,e.firstWeekday);a&&(t.dataset.vcDateWeekNumber=String(a.week));},setDaysAsDisabled=(e,t,n)=>{var a,l,o,s,i;const r=null==(a=e.disableWeekdays)?void 0:a.includes(n),c=e.disableAllDates&&!!(null==(l=e.context.enableDates)?void 0:l[0]);!r&&!c||(null==(o=e.context.enableDates)?void 0:o.includes(t))||(null==(s=e.context.disableDates)?void 0:s.includes(t))||(e.context.disableDates.push(t),null==(i=e.context.disableDates)||i.sort(((e,t)=>+new Date(e)-+new Date(t))));},createDate=(e,t,n,a,l,o)=>{const s=getDate(l).getDay(),i="string"==typeof e.locale&&e.locale.length?e.locale:"en",r=document.createElement("div");let c;r.className=e.styles.date,r.dataset.vcDate=l,r.dataset.vcDateMonth=o,r.dataset.vcDateWeekDay=String(s),("current"===o||e.displayDatesOutside)&&(c=document.createElement("button"),c.className=e.styles.dateBtn,c.type="button",c.role="gridcell",c.ariaLabel=getLocaleString(l,i,{dateStyle:"long",timeZone:"UTC"}),c.dataset.vcDateBtn="",c.innerText=String(a),r.appendChild(c)),e.enableWeekNumbers&&addWeekNumberForDate(e,r,l),setDaysAsDisabled(e,l,s),setDateModifier(e,t,r,c,s,l,o),n.appendChild(r),e.onCreateDateEls&&e.onCreateDateEls(e,r);},createDatesFromCurrentMonth=(e,t,n,a,l)=>{for(let o=1;o<=n;o++){const n=new Date(a,l,o);createDate(e,a,t,o,getDateString(n),"current");}},createDatesFromNextMonth=(e,t,n,a,l,o)=>{const s=o+n,i=7*Math.ceil(s/7)-s,r=l+1===12?a+1:a,c=l+1===12?"01":l+2<10?`0${l+2}`:l+2;for(let n=1;n<=i;n++){const l=n<10?`0${n}`:String(n);createDate(e,a,t,n,`${r}-${c}-${l}`,"next");}},createDatesFromPrevMonth=(e,t,n,a,l)=>{let o=new Date(n,a,0).getDate()-(l-1);const s=0===a?n-1:n,i=0===a?12:a<10?`0${a}`:a;for(let a=l;a>0;a--,o++){createDate(e,n,t,o,`${s}-${i}-${o}`,"prev");}},createWeekNumbers=(e,t,n,a,l)=>{if(!e.enableWeekNumbers)return;a.textContent="";const o=document.createElement("b");o.className=e.styles.weekNumbersTitle,o.innerText="#",o.dataset.vcWeekNumbers="title",a.appendChild(o);const s=document.createElement("div");s.className=e.styles.weekNumbersContent,s.dataset.vcWeekNumbers="content",a.appendChild(s);const i=document.createElement("button");i.type="button",i.className=e.styles.weekNumber;const r=l.querySelectorAll("[data-vc-date]"),c=Math.ceil((t+n)/7);for(let t=0;t<c;t++){const n=r[0===t?6:7*t].dataset.vcDate,a=getWeekNumber(n,e.firstWeekday);if(!a)return;const l=i.cloneNode(true);l.innerText=String(a.week),l.dataset.vcWeekNumber=String(a.week),l.dataset.vcWeekYear=String(a.year),l.role="rowheader",l.ariaLabel=`${a.week}`,s.appendChild(l);}},createDates=e=>{const t=new Date(e.context.selectedYear,e.context.selectedMonth,1),n=e.context.mainElement.querySelectorAll('[data-vc="dates"]'),a=e.context.mainElement.querySelectorAll('[data-vc-week="numbers"]');n.forEach(((n,l)=>{e.selectionDatesMode||(n.dataset.vcDatesDisabled=""),n.textContent="";const o=new Date(t);o.setMonth(o.getMonth()+l);const s=o.getMonth(),i=o.getFullYear(),r=(new Date(i,s,1).getDay()-e.firstWeekday+7)%7,c=new Date(i,s+1,0).getDate();createDatesFromPrevMonth(e,n,i,s,r),createDatesFromCurrentMonth(e,n,c,i,s),createDatesFromNextMonth(e,n,c,i,s,r),createDatePopup(e,n),createWeekNumbers(e,r,c,a[l],n);}));},layoutDefault=e=>`\n  <div class="${e.styles.header}" data-vc="header" role="toolbar" aria-label="${e.labels.navigation}">\n    <#ArrowPrev [month] />\n    <div class="${e.styles.headerContent}" data-vc-header="content">\n      <#Month />\n      <#Year />\n    </div>\n    <#ArrowNext [month] />\n  </div>\n  <div class="${e.styles.wrapper}" data-vc="wrapper">\n    <#WeekNumbers />\n    <div class="${e.styles.content}" data-vc="content">\n      <#Week />\n      <#Dates />\n      <#DateRangeTooltip />\n    </div>\n  </div>\n  <#ControlTime />\n`,layoutMonths=e=>`\n  <div class="${e.styles.header}" data-vc="header" role="toolbar" aria-label="${e.labels.navigation}">\n    <div class="${e.styles.headerContent}" data-vc-header="content">\n      <#Month />\n      <#Year />\n    </div>\n  </div>\n  <div class="${e.styles.wrapper}" data-vc="wrapper">\n    <div class="${e.styles.content}" data-vc="content">\n      <#Months />\n    </div>\n  </div>\n`,layoutMultiple=e=>`\n  <div class="${e.styles.controls}" data-vc="controls" role="toolbar" aria-label="${e.labels.navigation}">\n    <#ArrowPrev [month] />\n    <#ArrowNext [month] />\n  </div>\n  <div class="${e.styles.grid}" data-vc="grid">\n    <#Multiple>\n      <div class="${e.styles.column}" data-vc="column" role="region">\n        <div class="${e.styles.header}" data-vc="header">\n          <div class="${e.styles.headerContent}" data-vc-header="content">\n            <#Month />\n            <#Year />\n          </div>\n        </div>\n        <div class="${e.styles.wrapper}" data-vc="wrapper">\n          <#WeekNumbers />\n          <div class="${e.styles.content}" data-vc="content">\n            <#Week />\n            <#Dates />\n          </div>\n        </div>\n      </div>\n    <#/Multiple>\n    <#DateRangeTooltip />\n  </div>\n  <#ControlTime />\n`,layoutYears=e=>`\n  <div class="${e.styles.header}" data-vc="header" role="toolbar" aria-label="${e.labels.navigation}">\n    <#ArrowPrev [year] />\n    <div class="${e.styles.headerContent}" data-vc-header="content">\n      <#Month />\n      <#Year />\n    </div>\n    <#ArrowNext [year] />\n  </div>\n  <div class="${e.styles.wrapper}" data-vc="wrapper">\n    <div class="${e.styles.content}" data-vc="content">\n      <#Years />\n    </div>\n  </div>\n`,ArrowNext=(e,t)=>`<button type="button" class="${e.styles.arrowNext}" data-vc-arrow="next" aria-label="${e.labels.arrowNext[t]}"></button>`,ArrowPrev=(e,t)=>`<button type="button" class="${e.styles.arrowPrev}" data-vc-arrow="prev" aria-label="${e.labels.arrowPrev[t]}"></button>`,ControlTime=e=>e.selectionTimeMode?`<div class="${e.styles.time}" data-vc="time" role="group" aria-label="${e.labels.selectingTime}"></div>`:"",DateRangeTooltip=e=>e.onCreateDateRangeTooltip?`<div class="${e.styles.dateRangeTooltip}" data-vc-date-range-tooltip="hidden"></div>`:"",Dates=e=>`<div class="${e.styles.dates}" data-vc="dates" role="grid" aria-live="assertive" aria-label="${e.labels.dates}" ${"multiple"===e.type?"aria-multiselectable":""}></div>`,Month=e=>`<button type="button" class="${e.styles.month}" data-vc="month"></button>`,Months=e=>`<div class="${e.styles.months}" data-vc="months" role="grid" aria-live="assertive" aria-label="${e.labels.months}"></div>`,Week=e=>`<div class="${e.styles.week}" data-vc="week" role="row" aria-label="${e.labels.week}"></div>`,WeekNumbers=e=>e.enableWeekNumbers?`<div class="${e.styles.weekNumbers}" data-vc-week="numbers" role="row" aria-label="${e.labels.weekNumber}"></div>`:"",Year=e=>`<button type="button" class="${e.styles.year}" data-vc="year"></button>`,Years=e=>`<div class="${e.styles.years}" data-vc="years" role="grid" aria-live="assertive" aria-label="${e.labels.years}"></div>`,components={ArrowNext:ArrowNext,ArrowPrev:ArrowPrev,ControlTime:ControlTime,Dates:Dates,DateRangeTooltip:DateRangeTooltip,Month:Month,Months:Months,Week:Week,WeekNumbers:WeekNumbers,Year:Year,Years:Years},getComponent=e=>components[e],parseLayout=(e,t)=>t.replace(/[\n\t]/g,"").replace(/<#(?!\/?Multiple)(.*?)>/g,((t,n)=>{const a=(n.match(/\[(.*?)\]/)||[])[1],l=n.replace(/[/\s\n\t]|\[(.*?)\]/g,""),o=getComponent(l),s=o?o(e,null!=a?a:null):"";return e.sanitizerHTML(s)})).replace(/[\n\t]/g,""),parseMultipleLayout=(e,t)=>t.replace(new RegExp("<#Multiple>(.*?)<#\\/Multiple>","gs"),((t,n)=>{const a=Array(e.context.displayMonthsCount).fill(n).join("");return e.sanitizerHTML(a)})).replace(/[\n\t]/g,""),createLayouts=(e,t)=>{const n={default:layoutDefault,month:layoutMonths,year:layoutYears,multiple:layoutMultiple};if(Object.keys(n).forEach((t=>{const a=t;e.layouts[a].length||(e.layouts[a]=n[a](e));})),e.context.mainElement.className=e.styles.calendar,e.context.mainElement.dataset.vc="calendar",e.context.mainElement.dataset.vcType=e.context.currentType,e.context.mainElement.role="application",e.context.mainElement.tabIndex=0,e.context.mainElement.ariaLabel=e.labels.application,"multiple"!==e.context.currentType){if("multiple"===e.type&&t){const n=e.context.mainElement.querySelector('[data-vc="controls"]'),a=e.context.mainElement.querySelector('[data-vc="grid"]'),l=t.closest('[data-vc="column"]');return n&&e.context.mainElement.removeChild(n),a&&(a.dataset.vcGrid="hidden"),l&&(l.dataset.vcColumn=e.context.currentType),void(l&&(l.innerHTML=e.sanitizerHTML(parseLayout(e,e.layouts[e.context.currentType]))))}e.context.mainElement.innerHTML=e.sanitizerHTML(parseLayout(e,e.layouts[e.context.currentType]));}else e.context.mainElement.innerHTML=e.sanitizerHTML(parseMultipleLayout(e,parseLayout(e,e.layouts[e.context.currentType])));},setVisibilityArrows=(e,t,n,a)=>{e.style.visibility=n?"hidden":"",t.style.visibility=a?"hidden":"";},handleDefaultType=(e,t,n)=>{const a=getDate(getDateString(new Date(e.context.selectedYear,e.context.selectedMonth,1))),l=new Date(a.getTime()),o=new Date(a.getTime());l.setMonth(l.getMonth()-e.monthsToSwitch),o.setMonth(o.getMonth()+e.monthsToSwitch);const s=getDate(e.context.dateMin),i=getDate(e.context.dateMax);e.selectionYearsMode||(s.setFullYear(a.getFullYear()),i.setFullYear(a.getFullYear()));const r=!e.selectionMonthsMode||l.getFullYear()<s.getFullYear()||l.getFullYear()===s.getFullYear()&&l.getMonth()<s.getMonth(),c=!e.selectionMonthsMode||o.getFullYear()>i.getFullYear()||o.getFullYear()===i.getFullYear()&&o.getMonth()>i.getMonth()-(e.context.displayMonthsCount-1);setVisibilityArrows(t,n,r,c);},handleYearType=(e,t,n)=>{const a=getDate(e.context.dateMin),l=getDate(e.context.dateMax),o=!!(a.getFullYear()&&e.context.displayYear-7<=a.getFullYear()),s=!!(l.getFullYear()&&e.context.displayYear+7>=l.getFullYear());setVisibilityArrows(t,n,o,s);},visibilityArrows=e=>{if("month"===e.context.currentType)return;const t=e.context.mainElement.querySelector('[data-vc-arrow="prev"]'),n=e.context.mainElement.querySelector('[data-vc-arrow="next"]');if(!t||!n)return;({default:()=>handleDefaultType(e,t,n),year:()=>handleYearType(e,t,n)})["multiple"===e.context.currentType?"default":e.context.currentType]();},visibilityHandler=(e,t,n,a,l)=>{const o=new Date(a.setFullYear(e.context.selectedYear,e.context.selectedMonth+n)).getFullYear(),s=new Date(a.setMonth(e.context.selectedMonth+n)).getMonth(),i=e.context.locale.months.long[s],r=t.closest('[data-vc="column"]');r&&(r.ariaLabel=`${i} ${o}`);const c={month:{id:s,label:i},year:{id:o,label:o}};t.innerText=String(c[l].label),t.dataset[`vc${l.charAt(0).toUpperCase()+l.slice(1)}`]=String(c[l].id),t.ariaLabel=`${e.labels[l]} ${c[l].label}`;const d={month:e.selectionMonthsMode,year:e.selectionYearsMode},u=false===d[l]||"only-arrows"===d[l];u&&(t.tabIndex=-1),t.disabled=u;},visibilityTitle=e=>{const t=e.context.mainElement.querySelectorAll('[data-vc="month"]'),n=e.context.mainElement.querySelectorAll('[data-vc="year"]'),a=new Date(e.context.selectedYear,e.context.selectedMonth,1);[t,n].forEach((t=>null==t?void 0:t.forEach(((t,n)=>visibilityHandler(e,t,n,a,t.dataset.vc)))));},setYearModifier=(e,t,n,a,l)=>{var o;const s={month:"[data-vc-months-month]",year:"[data-vc-years-year]"},i={month:{selected:"data-vc-months-month-selected",aria:"aria-selected",value:"vcMonthsMonth",selectedProperty:"selectedMonth"},year:{selected:"data-vc-years-year-selected",aria:"aria-selected",value:"vcYearsYear",selectedProperty:"selectedYear"}};l&&(null==(o=e.context.mainElement.querySelectorAll(s[n]))||o.forEach((e=>{e.removeAttribute(i[n].selected),e.removeAttribute(i[n].aria);})),setContext(e,i[n].selectedProperty,Number(t.dataset[i[n].value])),visibilityTitle(e),"year"===n&&visibilityArrows(e)),a&&(t.setAttribute(i[n].selected,""),t.setAttribute(i[n].aria,"true"));},getColumnID=(e,t)=>{var n;if("multiple"!==e.type)return {currentValue:null,columnID:0};const a=e.context.mainElement.querySelectorAll('[data-vc="column"]'),l=Array.from(a).findIndex((e=>e.closest(`[data-vc-column="${t}"]`)));return {currentValue:l>=0?Number(null==(n=a[l].querySelector(`[data-vc="${t}"]`))?void 0:n.getAttribute(`data-vc-${t}`)):null,columnID:Math.max(l,0)}},createMonthEl=(e,t,n,a,l,o,s)=>{const i=t.cloneNode(false);return i.className=e.styles.monthsMonth,i.innerText=a,i.ariaLabel=l,i.role="gridcell",i.dataset.vcMonthsMonth=`${s}`,o&&(i.ariaDisabled="true"),o&&(i.tabIndex=-1),i.disabled=o,setYearModifier(e,i,"month",n===s,false),i},createMonths=(e,t)=>{var n,a;const l=null==(n=null==t?void 0:t.closest('[data-vc="header"]'))?void 0:n.querySelector('[data-vc="year"]'),o=l?Number(l.dataset.vcYear):e.context.selectedYear,s=(null==t?void 0:t.dataset.vcMonth)?Number(t.dataset.vcMonth):e.context.selectedMonth;setContext(e,"currentType","month"),createLayouts(e,t),visibilityTitle(e);const i=e.context.mainElement.querySelector('[data-vc="months"]');if(!e.selectionMonthsMode||!i)return;const r=e.monthsToSwitch>1?e.context.locale.months.long.map(((t,n)=>s-e.monthsToSwitch*n)).concat(e.context.locale.months.long.map(((t,n)=>s+e.monthsToSwitch*n))).filter((e=>e>=0&&e<=12)):Array.from(Array(12).keys()),c=document.createElement("button");c.type="button";for(let t=0;t<12;t++){const n=getDate(e.context.dateMin),a=getDate(e.context.dateMax),l=e.context.displayMonthsCount-1,{columnID:d}=getColumnID(e,"month"),u=o<=n.getFullYear()&&t<n.getMonth()+d||o>=a.getFullYear()&&t>a.getMonth()-l+d||o>a.getFullYear()||t!==s&&!r.includes(t),m=createMonthEl(e,c,s,e.context.locale.months.short[t],e.context.locale.months.long[t],u,t);i.appendChild(m),e.onCreateMonthEls&&e.onCreateMonthEls(e,m);}null==(a=e.context.mainElement.querySelector("[data-vc-months-month]:not([disabled])"))||a.focus();},TimeInput=(e,t,n,a,l)=>`\n  <label class="${t}" data-vc-time-input="${e}">\n    <input type="text" name="${e}" maxlength="2" aria-label="${n[`input${e.charAt(0).toUpperCase()+e.slice(1)}`]}" value="${a}" ${l?"disabled":""}>\n  </label>\n`,TimeRange=(e,t,n,a,l,o,s)=>`\n  <label class="${t}" data-vc-time-range="${e}">\n    <input type="range" name="${e}" min="${a}" max="${l}" step="${o}" aria-label="${n[`range${e.charAt(0).toUpperCase()+e.slice(1)}`]}" value="${s}">\n  </label>\n`,handleActions=(e,t,n,a)=>{(({hour:()=>setContext(e,"selectedHours",n),minute:()=>setContext(e,"selectedMinutes",n)}))[a](),setContext(e,"selectedTime",`${e.context.selectedHours}:${e.context.selectedMinutes}${e.context.selectedKeeping?` ${e.context.selectedKeeping}`:""}`),e.onChangeTime&&e.onChangeTime(e,t,false),e.inputMode&&e.context.inputElement&&e.context.mainElement&&e.onChangeToInput&&e.onChangeToInput(e,t);},transformTime24=(e,t)=>{var n;return (null==(n={0:{AM:"00",PM:"12"},1:{AM:"01",PM:"13"},2:{AM:"02",PM:"14"},3:{AM:"03",PM:"15"},4:{AM:"04",PM:"16"},5:{AM:"05",PM:"17"},6:{AM:"06",PM:"18"},7:{AM:"07",PM:"19"},8:{AM:"08",PM:"20"},9:{AM:"09",PM:"21"},10:{AM:"10",PM:"22"},11:{AM:"11",PM:"23"},12:{AM:"00",PM:"12"}}[Number(e)])?void 0:n[t])||String(e)},handleClickKeepingTime=(e,t,n,a,l)=>{const o=o=>{const s="AM"===e.context.selectedKeeping?"PM":"AM",i=transformTime24(e.context.selectedHours,s);Number(i)<=a&&Number(i)>=l?(setContext(e,"selectedKeeping",s),n.value=i,handleActions(e,o,e.context.selectedHours,"hour"),t.ariaLabel=`${e.labels.btnKeeping} ${e.context.selectedKeeping}`,t.innerText=e.context.selectedKeeping):e.onChangeTime&&e.onChangeTime(e,o,true);};return t.addEventListener("click",o),()=>{t.removeEventListener("click",o);}},transformTime12=e=>({0:"12",13:"01",14:"02",15:"03",16:"04",17:"05",18:"06",19:"07",20:"08",21:"09",22:"10",23:"11"}[Number(e)]||String(e)),updateInputAndRange=(e,t,n,a)=>{e.value=n,t.value=a;},updateKeepingTime$1=(e,t,n)=>{t&&n&&(setContext(e,"selectedKeeping",n),t.innerText=n);},handleInput$1=(e,t,n,a,l,o,s)=>{const i={hour:(i,r,c)=>{if(!e.selectionTimeMode)return;({12:()=>{if(!e.context.selectedKeeping)return;const d=Number(transformTime24(r,e.context.selectedKeeping));if(!(d<=o&&d>=s))return updateInputAndRange(n,t,e.context.selectedHours,e.context.selectedHours),void(e.onChangeTime&&e.onChangeTime(e,c,true));updateInputAndRange(n,t,transformTime12(r),transformTime24(r,e.context.selectedKeeping)),i>12&&updateKeepingTime$1(e,a,"PM"),handleActions(e,c,transformTime12(r),l);},24:()=>{if(!(i<=o&&i>=s))return updateInputAndRange(n,t,e.context.selectedHours,e.context.selectedHours),void(e.onChangeTime&&e.onChangeTime(e,c,true));updateInputAndRange(n,t,r,r),handleActions(e,c,r,l);}})[e.selectionTimeMode]();},minute:(a,i,r)=>{if(!(a<=o&&a>=s))return n.value=e.context.selectedMinutes,void(e.onChangeTime&&e.onChangeTime(e,r,true));n.value=i,t.value=i,handleActions(e,r,i,l);}},r=e=>{const t=Number(n.value),a=n.value.padStart(2,"0");i[l]&&i[l](t,a,e);};return n.addEventListener("change",r),()=>{n.removeEventListener("change",r);}},updateInputAndTime=(e,t,n,a,l)=>{t.value=l,handleActions(e,n,l,a);},updateKeepingTime=(e,t,n)=>{t&&(setContext(e,"selectedKeeping",n),t.innerText=n);},handleRange=(e,t,n,a,l)=>{const o=o=>{const s=Number(t.value),i=t.value.padStart(2,"0"),r="hour"===l,c=24===e.selectionTimeMode,d=s>0&&s<12;r&&!c&&updateKeepingTime(e,a,0===s||d?"AM":"PM"),updateInputAndTime(e,n,o,l,!r||c||d?i:transformTime12(t.value));};return t.addEventListener("input",o),()=>{t.removeEventListener("input",o);}},handleMouseOver=e=>e.setAttribute("data-vc-input-focus",""),handleMouseOut=e=>e.removeAttribute("data-vc-input-focus"),handleTime=(e,t)=>{const n=t.querySelector('[data-vc-time-range="hour"] input[name="hour"]'),a=t.querySelector('[data-vc-time-range="minute"] input[name="minute"]'),l=t.querySelector('[data-vc-time-input="hour"] input[name="hour"]'),o=t.querySelector('[data-vc-time-input="minute"] input[name="minute"]'),s=t.querySelector('[data-vc-time="keeping"]');if(!(n&&a&&l&&o))return;const i=e=>{e.target===n&&handleMouseOver(l),e.target===a&&handleMouseOver(o);},r=e=>{e.target===n&&handleMouseOut(l),e.target===a&&handleMouseOut(o);};return t.addEventListener("mouseover",i),t.addEventListener("mouseout",r),handleInput$1(e,n,l,s,"hour",e.timeMaxHour,e.timeMinHour),handleInput$1(e,a,o,s,"minute",e.timeMaxMinute,e.timeMinMinute),handleRange(e,n,l,s,"hour"),handleRange(e,a,o,s,"minute"),s&&handleClickKeepingTime(e,s,n,e.timeMaxHour,e.timeMinHour),()=>{t.removeEventListener("mouseover",i),t.removeEventListener("mouseout",r);}},createTime=e=>{const t=e.context.mainElement.querySelector('[data-vc="time"]');if(!e.selectionTimeMode||!t)return;const[n,a]=[e.timeMinHour,e.timeMaxHour],[l,o]=[e.timeMinMinute,e.timeMaxMinute],s=e.context.selectedKeeping?transformTime24(e.context.selectedHours,e.context.selectedKeeping):e.context.selectedHours,i="range"===e.timeControls;var r;t.innerHTML=e.sanitizerHTML(`\n    <div class="${e.styles.timeContent}" data-vc-time="content">\n      ${TimeInput("hour",e.styles.timeHour,e.labels,e.context.selectedHours,i)}\n      ${TimeInput("minute",e.styles.timeMinute,e.labels,e.context.selectedMinutes,i)}\n      ${12===e.selectionTimeMode?(r=e.context.selectedKeeping,`<button type="button" class="${e.styles.timeKeeping}" aria-label="${e.labels.btnKeeping} ${r}" data-vc-time="keeping" ${i?"disabled":""}>${r}</button>`):""}\n    </div>\n    <div class="${e.styles.timeRanges}" data-vc-time="ranges">\n      ${TimeRange("hour",e.styles.timeRange,e.labels,n,a,e.timeStepHour,s)}\n      ${TimeRange("minute",e.styles.timeRange,e.labels,l,o,e.timeStepMinute,e.context.selectedMinutes)}\n    </div>\n  `),handleTime(e,t);},createWeek=e=>{const t=e.selectedWeekends?[...e.selectedWeekends]:[],n=[...e.context.locale.weekdays.long].reduce(((n,a,l)=>[...n,{id:l,titleShort:e.context.locale.weekdays.short[l],titleLong:a,isWeekend:t.includes(l)}]),[]),a=[...n.slice(e.firstWeekday),...n.slice(0,e.firstWeekday)];e.context.mainElement.querySelectorAll('[data-vc="week"]').forEach((t=>{const n=e.onClickWeekDay?document.createElement("button"):document.createElement("b");e.onClickWeekDay&&(n.type="button"),a.forEach((a=>{const l=n.cloneNode(true);l.innerText=a.titleShort,l.className=e.styles.weekDay,l.role="columnheader",l.ariaLabel=a.titleLong,l.dataset.vcWeekDay=String(a.id),a.isWeekend&&(l.dataset.vcWeekDayOff=""),t.appendChild(l);}));}));},createYearEl=(e,t,n,a,l)=>{const o=t.cloneNode(false);return o.className=e.styles.yearsYear,o.innerText=String(l),o.ariaLabel=String(l),o.role="gridcell",o.dataset.vcYearsYear=`${l}`,a&&(o.ariaDisabled="true"),a&&(o.tabIndex=-1),o.disabled=a,setYearModifier(e,o,"year",n===l,false),o},createYears=(e,t)=>{var n;const a=(null==t?void 0:t.dataset.vcYear)?Number(t.dataset.vcYear):e.context.selectedYear;setContext(e,"currentType","year"),createLayouts(e,t),visibilityTitle(e),visibilityArrows(e);const l=e.context.mainElement.querySelector('[data-vc="years"]');if(!e.selectionYearsMode||!l)return;const o="multiple"!==e.type||e.context.selectedYear===a?0:1,s=document.createElement("button");s.type="button";for(let t=e.context.displayYear-7;t<e.context.displayYear+8;t++){const n=t<getDate(e.context.dateMin).getFullYear()+o||t>getDate(e.context.dateMax).getFullYear(),i=createYearEl(e,s,a,n,t);l.appendChild(i),e.onCreateYearEls&&e.onCreateYearEls(e,i);}null==(n=e.context.mainElement.querySelector("[data-vc-years-year]:not([disabled])"))||n.focus();},trackChangesHTMLElement=(e,t,n)=>{new MutationObserver((e=>{for(let a=0;a<e.length;a++){if(e[a].attributeName===t){n();break}}})).observe(e,{attributes:true});},haveListener={value:false,set:()=>haveListener.value=true,check:()=>haveListener.value},setTheme=(e,t)=>e.dataset.vcTheme=t,trackChangesThemeInSystemSettings=(e,t)=>{if(setTheme(e.context.mainElement,t.matches?"dark":"light"),"system"!==e.selectedTheme||haveListener.check())return;const n=e=>{const t=document.querySelectorAll('[data-vc="calendar"]');null==t||t.forEach((t=>setTheme(t,e.matches?"dark":"light")));};t.addEventListener?t.addEventListener("change",n):t.addListener(n),haveListener.set();},detectTheme=(e,t)=>{const n=e.themeAttrDetect.length?document.querySelector(e.themeAttrDetect):null,a=e.themeAttrDetect.replace(/^.*\[(.+)\]/g,((e,t)=>t));if(!n||"system"===n.getAttribute(a))return void trackChangesThemeInSystemSettings(e,t);const l=n.getAttribute(a);l?(setTheme(e.context.mainElement,l),trackChangesHTMLElement(n,a,(()=>{const t=n.getAttribute(a);t&&setTheme(e.context.mainElement,t);}))):trackChangesThemeInSystemSettings(e,t);},handleTheme=e=>{"not all"!==window.matchMedia("(prefers-color-scheme)").media?"system"===e.selectedTheme?detectTheme(e,window.matchMedia("(prefers-color-scheme: dark)")):setTheme(e.context.mainElement,e.selectedTheme):setTheme(e.context.mainElement,"light");},capitalizeFirstLetter=e=>e.charAt(0).toUpperCase()+e.slice(1).replace(/\./,""),getLocaleWeekday=(e,t,n)=>{const a=new Date(`1978-01-0${t+1}T00:00:00.000Z`),l=a.toLocaleString(n,{weekday:"short",timeZone:"UTC"}),o=a.toLocaleString(n,{weekday:"long",timeZone:"UTC"});e.context.locale.weekdays.short.push(capitalizeFirstLetter(l)),e.context.locale.weekdays.long.push(capitalizeFirstLetter(o));},getLocaleMonth=(e,t,n)=>{const a=new Date(`1978-${String(t+1).padStart(2,"0")}-01T00:00:00.000Z`),l=a.toLocaleString(n,{month:"short",timeZone:"UTC"}),o=a.toLocaleString(n,{month:"long",timeZone:"UTC"});e.context.locale.months.short.push(capitalizeFirstLetter(l)),e.context.locale.months.long.push(capitalizeFirstLetter(o));},getLocale=e=>{var t,n,a,l,o,s,i,r;if(!(e.context.locale.weekdays.short[6]&&e.context.locale.weekdays.long[6]&&e.context.locale.months.short[11]&&e.context.locale.months.long[11]))if("string"==typeof e.locale){if("string"==typeof e.locale&&!e.locale.length)throw new Error(errorMessages.notLocale);Array.from({length:7},((t,n)=>getLocaleWeekday(e,n,e.locale))),Array.from({length:12},((t,n)=>getLocaleMonth(e,n,e.locale)));}else {if(!((null==(n=null==(t=e.locale)?void 0:t.weekdays)?void 0:n.short[6])&&(null==(l=null==(a=e.locale)?void 0:a.weekdays)?void 0:l.long[6])&&(null==(s=null==(o=e.locale)?void 0:o.months)?void 0:s.short[11])&&(null==(r=null==(i=e.locale)?void 0:i.months)?void 0:r.long[11])))throw new Error(errorMessages.notLocale);setContext(e,"locale",__spreadValues({},e.locale));}},create=e=>{const t={default:()=>{createWeek(e),createDates(e);},multiple:()=>{createWeek(e),createDates(e);},month:()=>createMonths(e),year:()=>createYears(e)};handleTheme(e),getLocale(e),createLayouts(e),visibilityTitle(e),visibilityArrows(e),createTime(e),t[e.context.currentType]();},handleArrowKeys=e=>{const t=t=>{var n;const a=t.target;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t.key)||"button"!==a.localName)return;const l=Array.from(e.context.mainElement.querySelectorAll('[data-vc="calendar"] button')),o=l.indexOf(a);if(-1===o)return;const s=(i=l[o]).hasAttribute("data-vc-date-btn")?7:i.hasAttribute("data-vc-months-month")?4:i.hasAttribute("data-vc-years-year")?5:1;var i;const r=(0, {ArrowUp:()=>Math.max(0,o-s),ArrowDown:()=>Math.min(l.length-1,o+s),ArrowLeft:()=>Math.max(0,o-1),ArrowRight:()=>Math.min(l.length-1,o+1)}[t.key])();null==(n=l[r])||n.focus();};return e.context.mainElement.addEventListener("keydown",t),()=>e.context.mainElement.removeEventListener("keydown",t)},handleMonth=(e,t)=>{const n=getDate(getDateString(new Date(e.context.selectedYear,e.context.selectedMonth,1)));(({prev:()=>n.setMonth(n.getMonth()-e.monthsToSwitch),next:()=>n.setMonth(n.getMonth()+e.monthsToSwitch)}))[t](),setContext(e,"selectedMonth",n.getMonth()),setContext(e,"selectedYear",n.getFullYear()),visibilityTitle(e),visibilityArrows(e),createDates(e);},handleClickArrow=(e,t)=>{const n=t.target.closest("[data-vc-arrow]");if(n){if(["default","multiple"].includes(e.context.currentType))handleMonth(e,n.dataset.vcArrow);else if("year"===e.context.currentType&&void 0!==e.context.displayYear){const a={prev:-15,next:15}[n.dataset.vcArrow];setContext(e,"displayYear",e.context.displayYear+a),createYears(e,t.target);}e.onClickArrow&&e.onClickArrow(e,t);}},canToggleSelection=e=>void 0===e.enableDateToggle||("function"==typeof e.enableDateToggle?e.enableDateToggle(e):e.enableDateToggle),handleSelectDate=(e,t,n)=>{const a=t.dataset.vcDate,l=t.closest("[data-vc-date][data-vc-date-selected]"),o=canToggleSelection(e);if(l&&!o)return;const s=l?e.context.selectedDates.filter((e=>e!==a)):n?[...e.context.selectedDates,a]:[a];setContext(e,"selectedDates",s);},createDateRangeTooltip=(e,t,n)=>{if(!t)return;if(!n)return t.dataset.vcDateRangeTooltip="hidden",void(t.textContent="");const a=e.context.mainElement.getBoundingClientRect(),l=n.getBoundingClientRect();t.style.left=l.left-a.left+l.width/2+"px",t.style.top=l.bottom-a.top-l.height+"px",t.dataset.vcDateRangeTooltip="visible",t.innerHTML=e.sanitizerHTML(e.onCreateDateRangeTooltip(e,n,t,l,a));},state={self:null,lastDateEl:null,isHovering:false,rangeMin:void 0,rangeMax:void 0,tooltipEl:null,timeoutId:null},addHoverEffect=(e,t,n)=>{var a,l,o;if(!(null==(l=null==(a=state.self)?void 0:a.context)?void 0:l.selectedDates[0]))return;const s=getDateString(e);(null==(o=state.self.context.disableDates)?void 0:o.includes(s))||(state.self.context.mainElement.querySelectorAll(`[data-vc-date="${s}"]`).forEach((e=>e.dataset.vcDateHover="")),t.forEach((e=>e.dataset.vcDateHover="first")),n.forEach((e=>{"first"===e.dataset.vcDateHover?e.dataset.vcDateHover="first-and-last":e.dataset.vcDateHover="last";})));},removeHoverEffect=()=>{var e,t;if(!(null==(t=null==(e=state.self)?void 0:e.context)?void 0:t.mainElement))return;state.self.context.mainElement.querySelectorAll("[data-vc-date-hover]").forEach((e=>e.removeAttribute("data-vc-date-hover")));},handleHoverDatesEvent=e=>{var t,n;if(!e||!(null==(n=null==(t=state.self)?void 0:t.context)?void 0:n.selectedDates[0]))return;if(!e.closest('[data-vc="dates"]'))return state.lastDateEl=null,createDateRangeTooltip(state.self,state.tooltipEl,null),void removeHoverEffect();const a=e.closest("[data-vc-date]");if(!a||state.lastDateEl===a)return;state.lastDateEl=a,createDateRangeTooltip(state.self,state.tooltipEl,a),removeHoverEffect();const l=a.dataset.vcDate,o=getDate(state.self.context.selectedDates[0]),s=getDate(l),i=state.self.context.mainElement.querySelectorAll(`[data-vc-date="${state.self.context.selectedDates[0]}"]`),r=state.self.context.mainElement.querySelectorAll(`[data-vc-date="${l}"]`),[c,d]=o<s?[i,r]:[r,i],[u,m]=o<s?[o,s]:[s,o];for(let e=new Date(u);e<=m;e.setDate(e.getDate()+1))addHoverEffect(e,c,d);},handleHoverSelectedDatesRangeEvent=e=>{const t=null==e?void 0:e.closest("[data-vc-date-selected]");if(!t&&state.lastDateEl)return state.lastDateEl=null,void createDateRangeTooltip(state.self,state.tooltipEl,null);t&&state.lastDateEl!==t&&(state.lastDateEl=t,createDateRangeTooltip(state.self,state.tooltipEl,t));},optimizedHoverHandler=e=>t=>{const n=t.target;state.isHovering||(state.isHovering=true,requestAnimationFrame((()=>{e(n),state.isHovering=false;})));},optimizedHandleHoverDatesEvent=optimizedHoverHandler(handleHoverDatesEvent),optimizedHandleHoverSelectedDatesRangeEvent=optimizedHoverHandler(handleHoverSelectedDatesRangeEvent),handleCancelSelectionDates=e=>{state.self&&"Escape"===e.key&&(state.lastDateEl=null,setContext(state.self,"selectedDates",[]),state.self.context.mainElement.removeEventListener("mousemove",optimizedHandleHoverDatesEvent),state.self.context.mainElement.removeEventListener("keydown",handleCancelSelectionDates),createDateRangeTooltip(state.self,state.tooltipEl,null),removeHoverEffect());},handleMouseLeave=()=>{null!==state.timeoutId&&clearTimeout(state.timeoutId),state.timeoutId=setTimeout((()=>{state.lastDateEl=null,createDateRangeTooltip(state.self,state.tooltipEl,null),removeHoverEffect();}),50);},updateDisabledDates=()=>{var e,t,n,a;if(!(null==(n=null==(t=null==(e=state.self)?void 0:e.context)?void 0:t.selectedDates)?void 0:n[0])||!(null==(a=state.self.context.disableDates)?void 0:a[0]))return;const l=getDate(state.self.context.selectedDates[0]),[o,s]=state.self.context.disableDates.map((e=>getDate(e))).reduce((([e,t],n)=>[l>=n?n:e,l<n&&null===t?n:t]),[null,null]);o&&setContext(state.self,"displayDateMin",getDateString(new Date(o.setDate(o.getDate()+1)))),s&&setContext(state.self,"displayDateMax",getDateString(new Date(s.setDate(s.getDate()-1))));state.self.disableDatesPast&&!state.self.disableAllDates&&getDate(state.self.context.displayDateMin)<getDate(state.self.context.dateToday)&&setContext(state.self,"displayDateMin",state.self.context.dateToday);},handleSelectDateRange=(e,t)=>{state.self=e,state.lastDateEl=t,removeHoverEffect(),e.disableDatesGaps&&(state.rangeMin=state.rangeMin?state.rangeMin:e.context.displayDateMin,state.rangeMax=state.rangeMax?state.rangeMax:e.context.displayDateMax),e.onCreateDateRangeTooltip&&(state.tooltipEl=e.context.mainElement.querySelector("[data-vc-date-range-tooltip]"));const n=null==t?void 0:t.dataset.vcDate;if(n){const t=1===e.context.selectedDates.length&&e.context.selectedDates[0].includes(n),a=t&&!canToggleSelection(e)?[n,n]:t&&canToggleSelection(e)?[]:e.context.selectedDates.length>1?[n]:[...e.context.selectedDates,n];setContext(e,"selectedDates",a),e.context.selectedDates.length>1&&e.context.selectedDates.sort(((e,t)=>+new Date(e)-+new Date(t)));}({set:()=>(e.disableDatesGaps&&updateDisabledDates(),createDateRangeTooltip(state.self,state.tooltipEl,t),state.self.context.mainElement.removeEventListener("mousemove",optimizedHandleHoverSelectedDatesRangeEvent),state.self.context.mainElement.removeEventListener("mouseleave",handleMouseLeave),state.self.context.mainElement.removeEventListener("keydown",handleCancelSelectionDates),state.self.context.mainElement.addEventListener("mousemove",optimizedHandleHoverDatesEvent),state.self.context.mainElement.addEventListener("mouseleave",handleMouseLeave),state.self.context.mainElement.addEventListener("keydown",handleCancelSelectionDates),()=>{state.self.context.mainElement.removeEventListener("mousemove",optimizedHandleHoverDatesEvent),state.self.context.mainElement.removeEventListener("mouseleave",handleMouseLeave),state.self.context.mainElement.removeEventListener("keydown",handleCancelSelectionDates);}),reset:()=>{const[n,a]=[e.context.selectedDates[0],e.context.selectedDates[e.context.selectedDates.length-1]],l=e.context.selectedDates[0]!==e.context.selectedDates[e.context.selectedDates.length-1],o=parseDates([`${n}:${a}`]).filter((t=>!e.context.disableDates.includes(t))),s=l?e.enableEdgeDatesOnly?[n,a]:o:[e.context.selectedDates[0],e.context.selectedDates[0]];if(setContext(e,"selectedDates",s),e.disableDatesGaps&&(setContext(e,"displayDateMin",state.rangeMin),setContext(e,"displayDateMax",state.rangeMax)),state.self.context.mainElement.removeEventListener("mousemove",optimizedHandleHoverDatesEvent),state.self.context.mainElement.removeEventListener("mouseleave",handleMouseLeave),state.self.context.mainElement.removeEventListener("keydown",handleCancelSelectionDates),e.onCreateDateRangeTooltip)return e.context.selectedDates[0]||(state.self.context.mainElement.removeEventListener("mousemove",optimizedHandleHoverSelectedDatesRangeEvent),state.self.context.mainElement.removeEventListener("mouseleave",handleMouseLeave),createDateRangeTooltip(state.self,state.tooltipEl,null)),e.context.selectedDates[0]&&(state.self.context.mainElement.addEventListener("mousemove",optimizedHandleHoverSelectedDatesRangeEvent),state.self.context.mainElement.addEventListener("mouseleave",handleMouseLeave),createDateRangeTooltip(state.self,state.tooltipEl,t)),()=>{state.self.context.mainElement.removeEventListener("mousemove",optimizedHandleHoverSelectedDatesRangeEvent),state.self.context.mainElement.removeEventListener("mouseleave",handleMouseLeave);}}})[1===e.context.selectedDates.length?"set":"reset"]();},updateDateModifier=e=>{e.context.mainElement.querySelectorAll("[data-vc-date]").forEach((t=>{const n=t.querySelector("[data-vc-date-btn]"),a=t.dataset.vcDate,l=getDate(a).getDay();setDateModifier(e,e.context.selectedYear,t,n,l,a,"current");}));},handleClickDate=(e,t)=>{var n;const a=t.target,l=a.closest("[data-vc-date-btn]");if(!e.selectionDatesMode||!["single","multiple","multiple-ranged"].includes(e.selectionDatesMode)||!l)return;const o=l.closest("[data-vc-date]");(({single:()=>handleSelectDate(e,o,false),multiple:()=>handleSelectDate(e,o,true),"multiple-ranged":()=>handleSelectDateRange(e,o)}))[e.selectionDatesMode](),null==(n=e.context.selectedDates)||n.sort(((e,t)=>+new Date(e)-+new Date(t))),e.onClickDate&&e.onClickDate(e,t),e.inputMode&&e.context.inputElement&&e.context.mainElement&&e.onChangeToInput&&e.onChangeToInput(e,t);const s=a.closest('[data-vc-date-month="prev"]'),i=a.closest('[data-vc-date-month="next"]');({prev:()=>e.enableMonthChangeOnDayClick?handleMonth(e,"prev"):updateDateModifier(e),next:()=>e.enableMonthChangeOnDayClick?handleMonth(e,"next"):updateDateModifier(e),current:()=>updateDateModifier(e)})[s?"prev":i?"next":"current"]();},typeClick=["month","year"],getValue=(e,t,n)=>{const{currentValue:a,columnID:l}=getColumnID(e,t);return "month"===e.context.currentType&&l>=0?n-l:"year"===e.context.currentType&&e.context.selectedYear!==a?n-1:n},handleMultipleYearSelection=(e,t)=>{const n=getValue(e,"year",Number(t.dataset.vcYearsYear)),a=getDate(e.context.dateMin),l=getDate(e.context.dateMax),o=e.context.displayMonthsCount-1,{columnID:s}=getColumnID(e,"year"),i=e.context.selectedMonth<a.getMonth()&&n<=a.getFullYear(),r=e.context.selectedMonth>l.getMonth()-o+s&&n>=l.getFullYear(),c=n<a.getFullYear(),d=n>l.getFullYear(),u=i||c?a.getFullYear():r||d?l.getFullYear():n,m=i||c?a.getMonth():r||d?l.getMonth()-o+s:e.context.selectedMonth;setContext(e,"selectedYear",u),setContext(e,"selectedMonth",m);},handleMultipleMonthSelection=(e,t)=>{const n=t.closest('[data-vc-column="month"]').querySelector('[data-vc="year"]'),a=getValue(e,"month",Number(t.dataset.vcMonthsMonth)),l=Number(n.dataset.vcYear),o=getDate(e.context.dateMin),s=getDate(e.context.dateMax),i=a<o.getMonth()&&l<=o.getFullYear(),r=a>s.getMonth()&&l>=s.getFullYear();setContext(e,"selectedYear",l),setContext(e,"selectedMonth",i?o.getMonth():r?s.getMonth():a);},handleItemClick=(e,t,n,a)=>{var l;({year:()=>{if("multiple"===e.type)return handleMultipleYearSelection(e,a);setContext(e,"selectedYear",Number(a.dataset.vcYearsYear));},month:()=>{if("multiple"===e.type)return handleMultipleMonthSelection(e,a);setContext(e,"selectedMonth",Number(a.dataset.vcMonthsMonth));}})[n]();(({year:()=>{var n;return null==(n=e.onClickYear)?void 0:n.call(e,e,t)},month:()=>{var n;return null==(n=e.onClickMonth)?void 0:n.call(e,e,t)}}))[n](),e.context.currentType!==e.type?(setContext(e,"currentType",e.type),create(e),null==(l=e.context.mainElement.querySelector(`[data-vc="${n}"]`))||l.focus()):setYearModifier(e,a,n,true,true);},handleClickType=(e,t,n)=>{var a;const l=t.target,o=l.closest(`[data-vc="${n}"]`),s={year:()=>createYears(e,l),month:()=>createMonths(e,l)};if(o&&e.onClickTitle&&e.onClickTitle(e,t),o&&e.context.currentType!==n)return s[n]();const i=l.closest(`[data-vc-${n}s-${n}]`);if(i)return handleItemClick(e,t,n,i);const r=l.closest('[data-vc="grid"]'),c=l.closest('[data-vc="column"]');(e.context.currentType===n&&o||"multiple"===e.type&&e.context.currentType===n&&r&&!c)&&(setContext(e,"currentType",e.type),create(e),null==(a=e.context.mainElement.querySelector(`[data-vc="${n}"]`))||a.focus());},handleClickMonthOrYear=(e,t)=>{const n={month:e.selectionMonthsMode,year:e.selectionYearsMode};typeClick.forEach((a=>{n[a]&&t.target&&handleClickType(e,t,a);}));},handleClickWeekNumber=(e,t)=>{if(!e.enableWeekNumbers||!e.onClickWeekNumber)return;const n=t.target.closest("[data-vc-week-number]"),a=e.context.mainElement.querySelectorAll("[data-vc-date-week-number]");if(!n||!a[0])return;const l=Number(n.innerText),o=Number(n.dataset.vcWeekYear),s=Array.from(a).filter((e=>Number(e.dataset.vcDateWeekNumber)===l));e.onClickWeekNumber(e,l,o,s,t);},handleClickWeekDay=(e,t)=>{if(!e.onClickWeekDay)return;const n=t.target.closest("[data-vc-week-day]"),a=t.target.closest('[data-vc="column"]'),l=a?a.querySelectorAll("[data-vc-date-week-day]"):e.context.mainElement.querySelectorAll("[data-vc-date-week-day]");if(!n||!l[0])return;const o=Number(n.dataset.vcWeekDay),s=Array.from(l).filter((e=>Number(e.dataset.vcDateWeekDay)===o));e.onClickWeekDay(e,o,s,t);},handleClick=e=>{const t=t=>{handleClickArrow(e,t),handleClickWeekDay(e,t),handleClickWeekNumber(e,t),handleClickDate(e,t),handleClickMonthOrYear(e,t);};return e.context.mainElement.addEventListener("click",t),()=>e.context.mainElement.removeEventListener("click",t)},initMonthsCount=e=>{if("multiple"===e.type&&(e.displayMonthsCount<=1||e.displayMonthsCount>12))throw new Error(errorMessages.incorrectMonthsCount);if("multiple"!==e.type&&e.displayMonthsCount>1)throw new Error(errorMessages.incorrectMonthsCount);setContext(e,"displayMonthsCount",e.displayMonthsCount?e.displayMonthsCount:"multiple"===e.type?2:1);},getLocalDate=()=>{const e=new Date;return new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().substring(0,10)},resolveDate=(e,t)=>"today"===e?getLocalDate():e instanceof Date||"number"==typeof e||"string"==typeof e?parseDates([e])[0]:t,initRange=e=>{var t,n,a;const l=resolveDate(e.dateMin,e.dateMin),o=resolveDate(e.dateMax,e.dateMax),s=resolveDate(e.displayDateMin,l),i=resolveDate(e.displayDateMax,o);setContext(e,"dateToday",resolveDate(e.dateToday,e.dateToday)),setContext(e,"displayDateMin",s?getDate(l)>=getDate(s)?l:s:l),setContext(e,"displayDateMax",i?getDate(o)<=getDate(i)?o:i:o);const r=e.disableDatesPast&&!e.disableAllDates&&getDate(s)<getDate(e.context.dateToday);setContext(e,"displayDateMin",r||e.disableAllDates?e.context.dateToday:s),setContext(e,"displayDateMax",e.disableAllDates?e.context.dateToday:i),setContext(e,"disableDates",e.disableDates[0]&&!e.disableAllDates?parseDates(e.disableDates):e.disableAllDates?[e.context.displayDateMin]:[]),e.context.disableDates.length>1&&e.context.disableDates.sort(((e,t)=>+new Date(e)-+new Date(t))),setContext(e,"enableDates",e.enableDates[0]?parseDates(e.enableDates):[]),(null==(t=e.context.enableDates)?void 0:t[0])&&(null==(n=e.context.disableDates)?void 0:n[0])&&setContext(e,"disableDates",e.context.disableDates.filter((t=>!e.context.enableDates.includes(t)))),e.context.enableDates.length>1&&e.context.enableDates.sort(((e,t)=>+new Date(e)-+new Date(t))),(null==(a=e.context.enableDates)?void 0:a[0])&&e.disableAllDates&&(setContext(e,"displayDateMin",e.context.enableDates[0]),setContext(e,"displayDateMax",e.context.enableDates[e.context.enableDates.length-1])),setContext(e,"dateMin",e.displayDisabledDates?l:e.context.displayDateMin),setContext(e,"dateMax",e.displayDisabledDates?o:e.context.displayDateMax);},initSelectedDates=e=>{var t;setContext(e,"selectedDates",(null==(t=e.selectedDates)?void 0:t[0])?parseDates(e.selectedDates):[]);},displayClosestValidDate=e=>{const t=t=>{const n=new Date(t);setInitialContext(e,n.getMonth(),n.getFullYear());};if(e.displayDateMin&&"today"!==e.displayDateMin&&(n=e.displayDateMin,a=new Date,new Date(n).getTime()>a.getTime())){const n=e.selectedDates.length&&e.selectedDates[0]?parseDates(e.selectedDates)[0]:e.displayDateMin;return t(getDate(resolveDate(n,e.displayDateMin))),true}var n,a;if(e.displayDateMax&&"today"!==e.displayDateMax&&((e,t)=>new Date(e).getTime()<t.getTime())(e.displayDateMax,new Date)){const n=e.selectedDates.length&&e.selectedDates[0]?parseDates(e.selectedDates)[0]:e.displayDateMax;return t(getDate(resolveDate(n,e.displayDateMax))),true}return  false},setInitialContext=(e,t,n)=>{setContext(e,"selectedMonth",t),setContext(e,"selectedYear",n),setContext(e,"displayYear",n);},initSelectedMonthYear=e=>{var t;if(e.enableJumpToSelectedDate&&(null==(t=e.selectedDates)?void 0:t[0])&&void 0===e.selectedMonth&&void 0===e.selectedYear){const t=getDate(parseDates(e.selectedDates)[0]);return void setInitialContext(e,t.getMonth(),t.getFullYear())}if(displayClosestValidDate(e))return;const n=void 0!==e.selectedMonth&&Number(e.selectedMonth)>=0&&Number(e.selectedMonth)<12,a=void 0!==e.selectedYear&&Number(e.selectedYear)>=0&&Number(e.selectedYear)<=9999;setInitialContext(e,n?Number(e.selectedMonth):getDate(e.context.dateToday).getMonth(),a?Number(e.selectedYear):getDate(e.context.dateToday).getFullYear());},initTime=e=>{var t,n,a;if(!e.selectionTimeMode)return;if(![12,24].includes(e.selectionTimeMode))throw new Error(errorMessages.incorrectTime);const l=12===e.selectionTimeMode,o=l?/^(0[1-9]|1[0-2]):([0-5][0-9]) ?(AM|PM)?$/i:/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;let[s,i,r]=null!=(a=null==(n=null==(t=e.selectedTime)?void 0:t.match(o))?void 0:n.slice(1))?a:[];s?l&&!r&&(r="AM"):(s=l?transformTime12(String(e.timeMinHour)):String(e.timeMinHour),i=String(e.timeMinMinute),r=l?Number(transformTime12(String(e.timeMinHour)))>=12?"PM":"AM":null),setContext(e,"selectedHours",s.padStart(2,"0")),setContext(e,"selectedMinutes",i.padStart(2,"0")),setContext(e,"selectedKeeping",r),setContext(e,"selectedTime",`${e.context.selectedHours}:${e.context.selectedMinutes}${r?` ${r}`:""}`);},initAllVariables=e=>{setContext(e,"currentType",e.type),initMonthsCount(e),initRange(e),initSelectedMonthYear(e),initSelectedDates(e),initTime(e);},reset=(e,{year:t,month:n,dates:a,time:l,locale:o},s=true)=>{var i;const r={year:e.selectedYear,month:e.selectedMonth,dates:e.selectedDates,time:e.selectedTime};if(e.selectedYear=t?r.year:e.context.selectedYear,e.selectedMonth=n?r.month:e.context.selectedMonth,e.selectedTime=l?r.time:e.context.selectedTime,e.selectedDates="only-first"===a&&(null==(i=e.context.selectedDates)?void 0:i[0])?[e.context.selectedDates[0]]:true===a?r.dates:e.context.selectedDates,o){setContext(e,"locale",{months:{short:[],long:[]},weekdays:{short:[],long:[]}});}initAllVariables(e),s&&create(e),e.selectedYear=r.year,e.selectedMonth=r.month,e.selectedDates=r.dates,e.selectedTime=r.time,"multiple-ranged"===e.selectionDatesMode&&a&&handleSelectDateRange(e,null);},createToInput=e=>{const t=document.createElement("div");return t.className=e.styles.calendar,t.dataset.vc="calendar",t.dataset.vcInput="",t.dataset.vcCalendarHidden="",setContext(e,"inputModeInit",true),setContext(e,"isShowInInputMode",false),setContext(e,"mainElement",t),document.body.appendChild(e.context.mainElement),reset(e,{year:true,month:true,dates:true,time:true,locale:true}),setTimeout((()=>show(e))),e.onInit&&e.onInit(e),handleArrowKeys(e),handleClick(e)},handleInput=e=>{setContext(e,"inputElement",e.context.mainElement);const t=()=>{e.context.inputModeInit?setTimeout((()=>show(e))):createToInput(e);};return e.context.inputElement.addEventListener("click",t),e.context.inputElement.addEventListener("focus",t),()=>{e.context.inputElement.removeEventListener("click",t),e.context.inputElement.removeEventListener("focus",t);}},init=e=>(setContext(e,"originalElement",e.context.mainElement.cloneNode(true)),setContext(e,"isInit",true),e.inputMode?handleInput(e):(initAllVariables(e),create(e),e.onInit&&e.onInit(e),handleArrowKeys(e),handleClick(e))),update=(e,t)=>{if(!e.context.isInit)throw new Error(errorMessages.notInit);reset(e,__spreadValues(__spreadValues({},{year:true,month:true,dates:true,time:true,locale:true}),t),!(e.inputMode&&!e.context.inputModeInit)),e.onUpdate&&e.onUpdate(e);},replaceProperties=(e,t)=>{const n=Object.keys(t);for(let a=0;a<n.length;a++){const l=n[a];"object"!=typeof e[l]||"object"!=typeof t[l]||t[l]instanceof Date||Array.isArray(t[l])?void 0!==t[l]&&(e[l]=t[l]):replaceProperties(e[l],t[l]);}},set=(e,t,n)=>{replaceProperties(e,t),e.context.isInit&&update(e,n);};function findBestPickerPosition(e,t){const n="left";if(!t||!e)return n;const{canShow:a,parentPositions:l}=getAvailablePosition(e,t),o=a.left&&a.right;return (o&&a.bottom?"center":o&&a.top?["top","center"]:Array.isArray(l)?["bottom"===l[0]?"top":"bottom",...l.slice(1)]:l)||n}const setPosition=(e,t,n)=>{if(!e)return;const a="auto"===n?findBestPickerPosition(e,t):n,l={top:-t.offsetHeight,bottom:e.offsetHeight,left:0,center:e.offsetWidth/2-t.offsetWidth/2,right:e.offsetWidth-t.offsetWidth},o=Array.isArray(a)?a[0]:"bottom",s=Array.isArray(a)?a[1]:a;t.dataset.vcPosition=o;const{top:i,left:r}=getOffset(e),c=i+l[o];let d=r+l[s];const{vw:u}=getViewportDimensions();if(d+t.clientWidth>u){const e=window.innerWidth-document.body.clientWidth;d=u-t.clientWidth-e;}else d<0&&(d=0);Object.assign(t.style,{left:`${d}px`,top:`${c}px`});},show=e=>{if(e.context.isShowInInputMode)return;if(!e.context.currentType)return void e.context.mainElement.click();setContext(e,"cleanupHandlers",[]),setContext(e,"isShowInInputMode",true),setPosition(e.context.inputElement,e.context.mainElement,e.positionToInput),e.context.mainElement.removeAttribute("data-vc-calendar-hidden");const t=()=>{setPosition(e.context.inputElement,e.context.mainElement,e.positionToInput);};window.addEventListener("resize",t),e.context.cleanupHandlers.push((()=>window.removeEventListener("resize",t)));const n=t=>{"Escape"===t.key&&hide(e);};document.addEventListener("keydown",n),e.context.cleanupHandlers.push((()=>document.removeEventListener("keydown",n)));const a=t=>{t.target===e.context.inputElement||e.context.mainElement.contains(t.target)||hide(e);};document.addEventListener("click",a,{capture:true}),e.context.cleanupHandlers.push((()=>document.removeEventListener("click",a,{capture:true}))),e.onShow&&e.onShow(e);},labels={application:"Calendar",navigation:"Calendar Navigation",arrowNext:{month:"Next month",year:"Next list of years"},arrowPrev:{month:"Previous month",year:"Previous list of years"},month:"Select month, current selected month:",months:"List of months",year:"Select year, current selected year:",years:"List of years",week:"Days of the week",weekNumber:"Numbers of weeks in a year",dates:"Dates in the current month",selectingTime:"Selecting a time ",inputHour:"Hours",inputMinute:"Minutes",rangeHour:"Slider for selecting hours",rangeMinute:"Slider for selecting minutes",btnKeeping:"Switch AM/PM, current position:"},styles={calendar:"vc",controls:"vc-controls",grid:"vc-grid",column:"vc-column",header:"vc-header",headerContent:"vc-header__content",month:"vc-month",year:"vc-year",arrowPrev:"vc-arrow vc-arrow_prev",arrowNext:"vc-arrow vc-arrow_next",wrapper:"vc-wrapper",content:"vc-content",months:"vc-months",monthsMonth:"vc-months__month",years:"vc-years",yearsYear:"vc-years__year",week:"vc-week",weekDay:"vc-week__day",weekNumbers:"vc-week-numbers",weekNumbersTitle:"vc-week-numbers__title",weekNumbersContent:"vc-week-numbers__content",weekNumber:"vc-week-number",dates:"vc-dates",date:"vc-date",dateBtn:"vc-date__btn",datePopup:"vc-date__popup",dateRangeTooltip:"vc-date-range-tooltip",time:"vc-time",timeContent:"vc-time__content",timeHour:"vc-time__hour",timeMinute:"vc-time__minute",timeKeeping:"vc-time__keeping",timeRanges:"vc-time__ranges",timeRange:"vc-time__range"};class OptionsCalendar{constructor(){__publicField(this,"type","default"),__publicField(this,"inputMode",false),__publicField(this,"positionToInput","left"),__publicField(this,"firstWeekday",1),__publicField(this,"monthsToSwitch",1),__publicField(this,"themeAttrDetect","html[data-theme]"),__publicField(this,"locale","en"),__publicField(this,"dateToday","today"),__publicField(this,"dateMin","1970-01-01"),__publicField(this,"dateMax","2470-12-31"),__publicField(this,"displayDateMin"),__publicField(this,"displayDateMax"),__publicField(this,"displayDatesOutside",true),__publicField(this,"displayDisabledDates",false),__publicField(this,"displayMonthsCount"),__publicField(this,"disableDates",[]),__publicField(this,"disableAllDates",false),__publicField(this,"disableDatesPast",false),__publicField(this,"disableDatesGaps",false),__publicField(this,"disableWeekdays",[]),__publicField(this,"disableToday",false),__publicField(this,"enableDates",[]),__publicField(this,"enableEdgeDatesOnly",true),__publicField(this,"enableDateToggle",true),__publicField(this,"enableWeekNumbers",false),__publicField(this,"enableMonthChangeOnDayClick",true),__publicField(this,"enableJumpToSelectedDate",false),__publicField(this,"selectionDatesMode","single"),__publicField(this,"selectionMonthsMode",true),__publicField(this,"selectionYearsMode",true),__publicField(this,"selectionTimeMode",false),__publicField(this,"selectedDates",[]),__publicField(this,"selectedMonth"),__publicField(this,"selectedYear"),__publicField(this,"selectedHolidays",[]),__publicField(this,"selectedWeekends",[0,6]),__publicField(this,"selectedTime"),__publicField(this,"selectedTheme","system"),__publicField(this,"timeMinHour",0),__publicField(this,"timeMaxHour",23),__publicField(this,"timeMinMinute",0),__publicField(this,"timeMaxMinute",59),__publicField(this,"timeControls","all"),__publicField(this,"timeStepHour",1),__publicField(this,"timeStepMinute",1),__publicField(this,"sanitizerHTML",(e=>e)),__publicField(this,"onClickDate"),__publicField(this,"onClickWeekDay"),__publicField(this,"onClickWeekNumber"),__publicField(this,"onClickTitle"),__publicField(this,"onClickMonth"),__publicField(this,"onClickYear"),__publicField(this,"onClickArrow"),__publicField(this,"onChangeTime"),__publicField(this,"onChangeToInput"),__publicField(this,"onCreateDateRangeTooltip"),__publicField(this,"onCreateDateEls"),__publicField(this,"onCreateMonthEls"),__publicField(this,"onCreateYearEls"),__publicField(this,"onInit"),__publicField(this,"onUpdate"),__publicField(this,"onDestroy"),__publicField(this,"onShow"),__publicField(this,"onHide"),__publicField(this,"popups",{}),__publicField(this,"labels",__spreadValues({},labels)),__publicField(this,"layouts",{default:"",multiple:"",month:"",year:""}),__publicField(this,"styles",__spreadValues({},styles));}}const _Calendar=class e extends OptionsCalendar{constructor(t,n){var a;super(),__publicField(this,"init",(()=>init(this))),__publicField(this,"update",(e=>update(this,e))),__publicField(this,"destroy",(()=>destroy(this))),__publicField(this,"show",(()=>show(this))),__publicField(this,"hide",(()=>hide(this))),__publicField(this,"set",((e,t)=>set(this,e,t))),__publicField(this,"context"),this.context=__spreadProps(__spreadValues({},this.context),{locale:{months:{short:[],long:[]},weekdays:{short:[],long:[]}}}),setContext(this,"mainElement","string"==typeof t?null!=(a=e.memoizedElements.get(t))?a:this.queryAndMemoize(t):t),n&&replaceProperties(this,n);}queryAndMemoize(t){const n=document.querySelector(t);if(!n)throw new Error(errorMessages.notFoundSelector(t));return e.memoizedElements.set(t,n),n}};__publicField(_Calendar,"memoizedElements",new Map);let Calendar=_Calendar;

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
      this._calendar = new Calendar(this._positionElement, calendarOptions);
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
   * Custom positioning reference element.
   * @see https://floating-ui.com/docs/virtual-elements
   */

  const min = Math.min;
  const max = Math.max;
  const round = Math.round;
  const floor = Math.floor;
  const createCoords = v => ({
    x: v,
    y: v
  });
  const oppositeSideMap = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  const oppositeAlignmentMap = {
    start: 'end',
    end: 'start'
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === 'function' ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split('-')[0];
  }
  function getAlignment(placement) {
    return placement.split('-')[1];
  }
  function getOppositeAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }
  function getAxisLength(axis) {
    return axis === 'y' ? 'height' : 'width';
  }
  const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
  function getSideAxis(placement) {
    return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
  }
  const lrPlacement = ['left', 'right'];
  const rlPlacement = ['right', 'left'];
  const tbPlacement = ['top', 'bottom'];
  const btPlacement = ['bottom', 'top'];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case 'top':
      case 'bottom':
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case 'left':
      case 'right':
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === 'start', rtl);
    if (alignment) {
      list = list.map(side => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== 'number' ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      x,
      y
    };
  }

  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === 'y';
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case 'top':
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case 'bottom':
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case 'right':
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case 'left':
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case 'start':
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case 'end':
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a given reference element.
   *
   * This export does not have any `platform` interface logic. You will need to
   * write one for the platform you are using Floating UI with.
   */
  const computePosition$1 = async (reference, floating, config) => {
    const {
      placement = 'bottom',
      strategy = 'absolute',
      middleware = [],
      platform
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
    let rects = await platform.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {
        name,
        fn
      } = validMiddleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === 'object') {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };

  /**
   * Resolves with an object of overflow side offsets that determine how much the
   * element is overflowing a given clipping boundary on each side.
   * - positive = overflowing the boundary by that number of pixels
   * - negative = how many pixels left before it will overflow
   * - 0 = lies flush with the boundary
   * @see https://floating-ui.com/docs/detectOverflow
   */
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x,
      y,
      platform,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = 'clippingAncestors',
      rootBoundary = 'viewport',
      elementContext = 'floating',
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === 'floating' ? 'reference' : 'floating';
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform.getClippingRect({
      element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === 'floating' ? {
      x,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
    const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }

  /**
   * Provides data to position an inner element of the floating element so that it
   * appears centered to the reference element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow$1 = options => ({
    name: 'arrow',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        platform,
        elements,
        middlewareData
      } = state;
      // Since `element` is required, we don't Partial<> the type.
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform.getDimensions(element);
      const isYAxis = axis === 'y';
      const minProp = isYAxis ? 'top' : 'left';
      const maxProp = isYAxis ? 'bottom' : 'right';
      const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

      // DOM platform can return `window` as the `offsetParent`.
      if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;

      // If the padding is large enough that it causes the arrow to no longer be
      // centered, modify the padding so that it is centered.
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

      // Make sure the arrow doesn't overflow the floating element if the center
      // point is outside the floating element's bounds.
      const min$1 = minPadding;
      const max = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset = clamp(min$1, center, max);

      // If the reference is small enough that the arrow's padding causes it to
      // to point to nothing for an aligned placement, adjust the offset of the
      // floating element itself. To ensure `shift()` continues to take action,
      // a single reset is performed when this is true.
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset,
          centerOffset: center - offset - alignmentOffset,
          ...(shouldAddOffset && {
            alignmentOffset
          })
        },
        reset: shouldAddOffset
      };
    }
  });

  /**
   * Optimizes the visibility of the floating element by flipping the `placement`
   * in order to keep it in view when the preferred placement(s) will overflow the
   * clipping boundary. Alternative to `autoPlacement`.
   * @see https://floating-ui.com/docs/flip
   */
  const flip$1 = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'flip',
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = 'bestFit',
          fallbackAxisSideDirection = 'none',
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);

        // If a reset by the arrow was caused due to an alignment offset being
        // added, we should skip any logic now since `flip()` has already done its
        // work.
        // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides[0]], overflow[sides[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];

        // One or more sides is overflowing.
        if (!overflows.every(side => side <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow ||
            // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every(d => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
              // Try next placement and re-run the lifecycle.
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }

          // First, find the candidates that fit on the mainAxis side of overflow,
          // then find the placement that fits the best on the main crossAxis side.
          let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

          // Otherwise fallback.
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case 'bestFit':
                {
                  var _overflowsData$filter2;
                  const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                    if (hasFallbackAxisSideDirection) {
                      const currentSideAxis = getSideAxis(d.placement);
                      return currentSideAxis === initialSideAxis ||
                      // Create a bias to the `y` side axis due to horizontal
                      // reading directions favoring greater width.
                      currentSideAxis === 'y';
                    }
                    return true;
                  }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                  if (placement) {
                    resetPlacement = placement;
                  }
                  break;
                }
              case 'initialPlacement':
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };

  const originSides = /*#__PURE__*/new Set(['left', 'top']);

  // For type backwards-compatibility, the `OffsetOptions` type was also
  // Derivable.

  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform,
      elements
    } = state;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === 'y';
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);

    // eslint-disable-next-line prefer-const
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === 'number' ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === 'number') {
      crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }

  /**
   * Modifies the placement by translating the floating element along the
   * specified axes.
   * A number (shorthand for `mainAxis` or distance), or an axes configuration
   * object may be passed.
   * @see https://floating-ui.com/docs/offset
   */
  const offset$1 = function (options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: 'offset',
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);

        // If the placement is the same and the arrow caused an alignment offset
        // then we don't need to change the positioning coordinates.
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };

  /**
   * Optimizes the visibility of the floating element by shifting it in order to
   * keep it in view when it will overflow the clipping boundary.
   * @see https://floating-ui.com/docs/shift
   */
  const shift$1 = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'shift',
      options,
      async fn(state) {
        const {
          x,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: _ref => {
              let {
                x,
                y
              } = _ref;
              return {
                x,
                y
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === 'y' ? 'top' : 'left';
          const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
          const min = mainAxisCoord + overflow[minSide];
          const max = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min, mainAxisCoord, max);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === 'y' ? 'top' : 'left';
          const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
          const min = crossAxisCoord + overflow[minSide];
          const max = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min, crossAxisCoord, max);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };

  function hasWindow() {
    return typeof window !== 'undefined';
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || '').toLowerCase();
    }
    // Mocked nodes in testing environments may not be instances of Node. By
    // returning `#document` an infinite loop won't occur.
    // https://github.com/floating-ui/floating-ui/issues/2317
    return '#document';
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === 'undefined') {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  const invalidOverflowDisplayValues = /*#__PURE__*/new Set(['inline', 'contents']);
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle$1(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
  }
  const tableElements = /*#__PURE__*/new Set(['table', 'td', 'th']);
  function isTableElement(element) {
    return tableElements.has(getNodeName(element));
  }
  const topLayerSelectors = [':popover-open', ':modal'];
  function isTopLayer(element) {
    return topLayerSelectors.some(selector => {
      try {
        return element.matches(selector);
      } catch (_e) {
        return false;
      }
    });
  }
  const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'];
  const willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'];
  const containValues = ['paint', 'layout', 'strict', 'content'];
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    // https://drafts.csswg.org/css-transforms-2/#individual-transforms
    return transformProperties.some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || willChangeValues.some(value => (css.willChange || '').includes(value)) || containValues.some(value => (css.contain || '').includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === 'undefined' || !CSS.supports) return false;
    return CSS.supports('-webkit-backdrop-filter', 'none');
  }
  const lastTraversableNodeNames = /*#__PURE__*/new Set(['html', 'body', '#document']);
  function isLastTraversableNode(node) {
    return lastTraversableNodeNames.has(getNodeName(node));
  }
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === 'html') {
      return node;
    }
    const result =
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    isShadowRoot(node) && node.host ||
    // Fallback.
    getDocumentElement(node);
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }

  function getCssDimensions(element) {
    const css = getComputedStyle$1(element);
    // In testing environments, the `width` and `height` properties are empty
    // strings for SVG elements, returning NaN. Fallback to `0` in this case.
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }

  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }

  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;

    // 0, NaN, or Infinity should always fallback to 1.

    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }

  const noOffsets = /*#__PURE__*/createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }

  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle$1(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }

  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }

  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x,
      y
    };
  }

  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === 'fixed';
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }

  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }

  // Gets the entire size of the scrollable document area, even extending outside
  // of the `<html>` and `<body>` rect bounds if horizontally scrollable.
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle$1(body).direction === 'rtl') {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  // Safety check: ensure the scrollbar space is reasonable in case this
  // calculation is affected by unusual styles.
  // Most scrollbars leave 15-18px of space.
  const SCROLLBAR_MAX = 25;
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    // <html> `overflow: hidden` + `scrollbar-gutter: stable` reduces the
    // visual width of the <html> but this is not considered in the size
    // of `html.clientWidth`.
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      // If the <body> scrollbar is on the left, the width needs to be extended
      // by the scrollbar amount so there isn't extra space on the right.
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  const absoluteOrFixed = /*#__PURE__*/new Set(['absolute', 'fixed']);
  // Returns the inner client rect, subtracting scrollbars if present.
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === 'viewport') {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === 'document') {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
  }

  // A "clipping ancestor" is an `overflow` element with the characteristic of
  // clipping (or hiding) child elements. This returns all clipping ancestors
  // of the given element up the tree.
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
    let currentNode = elementIsFixed ? getParentNode(element) : element;

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle$1(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        // Drop non-containing blocks.
        result = result.filter(ancestor => ancestor !== currentNode);
      } else {
        // Record last containing block for next iteration.
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }

  // Gets the maximum area that the element is visible in due to any number of
  // clipping ancestors.
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }

  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }

  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === 'fixed';
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);

    // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
    // Firefox with layout.scrollbar.side = 3 in about:config to test this.
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x,
      y,
      width: rect.width,
      height: rect.height
    };
  }

  function isStaticPositioned(element) {
    return getComputedStyle$1(element).position === 'static';
  }

  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;

    // Firefox returns the <html> element as the offsetParent if it's non-static,
    // while Chrome and Safari return the <body> element. The <body> element must
    // be used to perform the correct calculations even if the <html> element is
    // non-static.
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }

  // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }

  const getElementRects = async function (data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };

  function isRTL(element) {
    return getComputedStyle$1(element).direction === 'rtl';
  }

  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };

  function rectsAreEqual(a, b) {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
  }

  // https://samthor.au/2021/observing-dom/
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            // If the reference is clipped, the ratio is 0. Throttle the refresh
            // to prevent an infinite loop of updates.
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1000);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
          // It's possible that even though the ratio is reported as 1, the
          // element is not actually fully within the IntersectionObserver's root
          // area anymore. This can happen under performance constraints. This may
          // be a bug in the browser's IntersectionObserver implementation. To
          // work around this, we compare the element's bounding rect now with
          // what it was at the time we created the IntersectionObserver. If they
          // are not equal then the element moved, so we refresh.
          refresh();
        }
        isFirstUpdate = false;
      }

      // Older browsers don't support a `document` as the root and will throw an
      // error.
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root.ownerDocument
        });
      } catch (_e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }

  /**
   * Automatically updates the position of the floating element when necessary.
   * Should only be called when the floating element is mounted on the DOM or
   * visible on the screen.
   * @returns cleanup function that should be invoked when the floating element is
   * removed from the DOM or hidden from the screen.
   * @see https://floating-ui.com/docs/autoUpdate
   */
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === 'function',
      layoutShift = typeof IntersectionObserver === 'function',
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.addEventListener('scroll', update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener('resize', update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver(_ref => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          // Prevent update loops when using the `size` middleware.
          // https://github.com/floating-ui/floating-ui/issues/1740
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach(ancestor => {
        ancestorScroll && ancestor.removeEventListener('scroll', update);
        ancestorResize && ancestor.removeEventListener('resize', update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }

  /**
   * Modifies the placement by translating the floating element along the
   * specified axes.
   * A number (shorthand for `mainAxis` or distance), or an axes configuration
   * object may be passed.
   * @see https://floating-ui.com/docs/offset
   */
  const offset = offset$1;

  /**
   * Optimizes the visibility of the floating element by shifting it in order to
   * keep it in view when it will overflow the clipping boundary.
   * @see https://floating-ui.com/docs/shift
   */
  const shift = shift$1;

  /**
   * Optimizes the visibility of the floating element by flipping the `placement`
   * in order to keep it in view when the preferred placement(s) will overflow the
   * clipping boundary. Alternative to `autoPlacement`.
   * @see https://floating-ui.com/docs/flip
   */
  const flip = flip$1;

  /**
   * Provides data to position an inner element of the floating element so that it
   * appears centered to the reference element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow = arrow$1;

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a given reference element.
   */
  const computePosition = (reference, floating, options) => {
    // This caches the expensive `getClippingElementAncestors` function so that
    // multiple lifecycle resets re-use the same result. It only lives for a
    // single call. If other functions become expensive, we can add them as well.
    const cache = new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

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
    if (isRTL$1()) {
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
      if (typeof computePosition === 'undefined') {
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
      if (typeof config.reference === 'object' && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
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
      } else if (isElement$1(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }

      // Initial position update
      this._updateFloatingPosition(referenceElement);

      // Set up auto-update for scroll/resize
      this._floatingCleanup = autoUpdate(referenceElement, this._menu, () => this._updateFloatingPosition(referenceElement));
    }
    async _updateFloatingPosition(referenceElement = null) {
      if (!this._menu) {
        return;
      }
      if (!referenceElement) {
        if (this._config.reference === 'parent') {
          referenceElement = this._parent;
        } else if (isElement$1(this._config.reference)) {
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
      offset(typeof offsetValue === 'function' ? offsetValue : {
        mainAxis: offsetValue[1] || 0,
        crossAxis: offsetValue[0] || 0
      }),
      // Flip middleware - handles fallback placements
      flip({
        fallbackPlacements: this._getFallbackPlacements()
      }),
      // Shift middleware - prevents overflow
      shift({
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
      } = await computePosition(reference, floating, {
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
      const middleware = [offset({
        mainAxis: 0,
        crossAxis: -4
      }), flip({
        fallbackPlacements: [resolveLogicalPlacement('start-start'), resolveLogicalPlacement('end-end'), resolveLogicalPlacement('start-end')]
      }), shift({
        padding: 8
      })];
      const updatePosition = () => this._applyFloatingPosition(referenceElement, submenu, placement, middleware);
      updatePosition();
      return autoUpdate(referenceElement, submenu, updatePosition);
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
      const isRtl = isRTL$1();

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
      const isRtl = isRTL$1();

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
      if (isElement$1(selector)) {
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
      if (isElement$1(content)) {
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
    RIGHT: isRTL$1() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL$1() ? 'right' : 'left'
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
      if (typeof computePosition === 'undefined') {
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
      this._floatingCleanup = autoUpdate(this._element, tip, () => this._updateFloatingPosition(tip, null, arrowElement));
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
      } = await computePosition(this._element, tip, floatingConfig);

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
      offset(typeof offsetValue === 'function' ? offsetValue : {
        mainAxis: offsetValue[1] || 0,
        crossAxis: offsetValue[0] || 0
      }),
      // Flip middleware - handles fallback placements
      flip({
        fallbackPlacements: this._config.fallbackPlacements
      }),
      // Shift middleware - prevents overflow
      shift({
        boundary: this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary
      })];

      // Arrow middleware - positions the arrow element
      if (arrowElement) {
        middleware.push(arrow({
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
//# sourceMappingURL=bootstrap.bundle.js.map
