/*!
  * Bootstrap v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import { computePosition, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/dom';
import { Calendar } from 'vanilla-calendar-pro';

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

const VERSION = '6.0.0-alpha1';

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

const NAME$k = 'alert';
const DATA_KEY$g = 'bs.alert';
const EVENT_KEY$h = `.${DATA_KEY$g}`;
const EVENT_CLOSE = `close${EVENT_KEY$h}`;
const EVENT_CLOSED = `closed${EVENT_KEY$h}`;
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$6 = 'show';

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$k;
  }

  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$3);
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

const NAME$j = 'button';
const DATA_KEY$f = 'bs.button';
const EVENT_KEY$g = `.${DATA_KEY$f}`;
const DATA_API_KEY$b = '.data-api';
const CLASS_NAME_ACTIVE$4 = 'active';
const SELECTOR_DATA_TOGGLE$a = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$8 = `click${EVENT_KEY$g}${DATA_API_KEY$b}`;

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$j;
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$4));
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$8, SELECTOR_DATA_TOGGLE$a, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$a);
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

const NAME$i = 'swipe';
const EVENT_KEY$f = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$f}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$f}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$f}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$f}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$f}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$h = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$h = {
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
    return Default$h;
  }
  static get DefaultType() {
    return DefaultType$h;
  }
  static get NAME() {
    return NAME$i;
  }

  // Public
  dispose() {
    EventHandler.off(this._element, EVENT_KEY$f);
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

const NAME$h = 'carousel';
const DATA_KEY$e = 'bs.carousel';
const EVENT_KEY$e = `.${DATA_KEY$e}`;
const DATA_API_KEY$a = '.data-api';
const ARROW_LEFT_KEY$2 = 'ArrowLeft';
const ARROW_RIGHT_KEY$2 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$e}`;
const EVENT_SLID = `slid${EVENT_KEY$e}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$e}`;
const EVENT_MOUSEENTER$2 = `mouseenter${EVENT_KEY$e}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$e}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$e}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$e}${DATA_API_KEY$a}`;
const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$e}${DATA_API_KEY$a}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$3 = 'active';
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
const Default$g = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$g = {
  interval: 'number',
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
    return Default$g;
  }
  static get DefaultType() {
    return DefaultType$g;
  }
  static get NAME() {
    return NAME$h;
  }

  // Public
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (document.visibilityState === 'visible' && isVisible(this._element)) {
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
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$3);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$3);
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
      nextElement.classList.add(CLASS_NAME_ACTIVE$3);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$3, orderClassName, directionalClassName);
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

EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DATA_SLIDE, function (event) {
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

const NAME$g = 'collapse';
const DATA_KEY$d = 'bs.collapse';
const EVENT_KEY$d = `.${DATA_KEY$d}`;
const DATA_API_KEY$9 = '.data-api';
const EVENT_SHOW$8 = `show${EVENT_KEY$d}`;
const EVENT_SHOWN$8 = `shown${EVENT_KEY$d}`;
const EVENT_HIDE$8 = `hide${EVENT_KEY$d}`;
const EVENT_HIDDEN$8 = `hidden${EVENT_KEY$d}`;
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$d}${DATA_API_KEY$9}`;
const CLASS_NAME_SHOW$5 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$9 = '[data-bs-toggle="collapse"]';
const Default$f = {
  parent: null,
  toggle: true
};
const DefaultType$f = {
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
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$9);
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
    return Default$f;
  }
  static get DefaultType() {
    return DefaultType$f;
  }
  static get NAME() {
    return NAME$g;
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
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$8);
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
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$5);
      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$8);
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
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$8);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$5);
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
      EventHandler.trigger(this._element, EVENT_HIDDEN$8);
    };
    this._element.style[dimension] = '';
    this._queueCallback(complete, this._element, true);
  }

  // Private
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$5);
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
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$9);
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

EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$9, function (event) {
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
 * Bootstrap util/floating-ui.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Breakpoints for responsive placement (matches SCSS $breakpoints)
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
 * Bootstrap menu.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$f = 'menu';
const DATA_KEY$c = 'bs.menu';
const EVENT_KEY$c = `.${DATA_KEY$c}`;
const DATA_API_KEY$8 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$2 = 'ArrowUp';
const ARROW_DOWN_KEY$2 = 'ArrowDown';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const HOME_KEY$2 = 'Home';
const END_KEY$2 = 'End';
const ENTER_KEY$1 = 'Enter';
const SPACE_KEY$1 = ' ';
const RIGHT_MOUSE_BUTTON = 2;
const SUBMENU_CLOSE_DELAY = 100;
const EVENT_HIDE$7 = `hide${EVENT_KEY$c}`;
const EVENT_HIDDEN$7 = `hidden${EVENT_KEY$c}`;
const EVENT_SHOW$7 = `show${EVENT_KEY$c}`;
const EVENT_SHOWN$7 = `shown${EVENT_KEY$c}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$c}${DATA_API_KEY$8}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$c}${DATA_API_KEY$8}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$c}${DATA_API_KEY$8}`;
const CLASS_NAME_SHOW$4 = 'show';
const SELECTOR_DATA_TOGGLE$8 = '[data-bs-toggle="menu"]:not(.disabled):not(:disabled)';
const SELECTOR_MENU$2 = '.menu';
const SELECTOR_SUBMENU = '.submenu';
const SELECTOR_SUBMENU_TOGGLE = '.submenu > .menu-item';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS$1 = '.menu-item:not(.disabled):not(:disabled)';
const DEFAULT_PLACEMENT = 'bottom-start';
const SUBMENU_PLACEMENT = 'end-start';
const resolveLogicalPlacement = placement => {
  if (isRTL()) {
    return placement.replace(/^start(?=-|$)/, 'right').replace(/^end(?=-|$)/, 'left');
  }
  return placement.replace(/^start(?=-|$)/, 'left').replace(/^end(?=-|$)/, 'right');
};
const triangleSign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
const Default$e = {
  autoClose: true,
  boundary: 'clippingParents',
  container: false,
  display: 'dynamic',
  offset: [0, 2],
  floatingConfig: null,
  menu: null,
  placement: DEFAULT_PLACEMENT,
  reference: 'toggle',
  strategy: 'absolute',
  submenuTrigger: 'both',
  submenuDelay: SUBMENU_CLOSE_DELAY
};
const DefaultType$e = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  display: 'string',
  offset: '(array|string|function)',
  floatingConfig: '(null|object|function)',
  menu: '(null|element)',
  placement: 'string',
  reference: '(string|element|object)',
  strategy: 'string',
  submenuTrigger: 'string',
  submenuDelay: 'number'
};

/**
 * Class definition
 */

class Menu extends BaseComponent {
  static _openInstances = (() => new Set())();
  constructor(element, config) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s menus require Floating UI (https://floating-ui.com)');
    }
    super(element, config);
    this._floatingCleanup = null;
    this._mediaQueryListeners = [];
    this._responsivePlacements = null;
    this._parent = this._element.parentNode;
    this._isSubmenu = this._parent.classList?.contains('submenu');
    this._openSubmenus = new Map();
    this._submenuCloseTimeouts = new Map();
    this._hoverIntentData = null;
    this._menu = this._config.menu || this._findMenu();
    this._menuOriginalParent = this._menu?.parentNode;
    this._parseResponsivePlacements();
    this._setupSubmenuListeners();
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
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$7, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._moveMenuToContainer();
    this._createFloating();
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    this._element.focus({
      focusVisible: false
    });
    this._element.setAttribute('aria-expanded', 'true');
    this._menu.classList.add(CLASS_NAME_SHOW$4);
    this._element.classList.add(CLASS_NAME_SHOW$4);
    if (this._parent) {
      this._parent.classList.add(CLASS_NAME_SHOW$4);
    }
    Menu._openInstances.add(this);
    EventHandler.trigger(this._element, EVENT_SHOWN$7, relatedTarget);
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
    this._restoreMenuToOriginalParent();
    this._disposeMediaQueryListeners();
    this._closeAllSubmenus();
    this._clearAllSubmenuTimeouts();
    Menu._openInstances.delete(this);
    super.dispose();
  }
  update() {
    if (this._floatingCleanup) {
      this._updateFloatingPosition();
    }
  }

  // Private
  _findMenu() {
    return SelectorEngine.next(this._element, SELECTOR_MENU$2)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU$2)[0] || SelectorEngine.findOne(SELECTOR_MENU$2, this._parent);
  }
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$7, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._closeAllSubmenus();
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    this._disposeFloating();
    this._restoreMenuToOriginalParent();
    this._menu.classList.remove(CLASS_NAME_SHOW$4);
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    if (this._parent) {
      this._parent.classList.remove(CLASS_NAME_SHOW$4);
    }
    this._element.setAttribute('aria-expanded', 'false');
    Manipulator.removeDataAttribute(this._menu, 'placement');
    Manipulator.removeDataAttribute(this._menu, 'display');
    Menu._openInstances.delete(this);
    EventHandler.trigger(this._element, EVENT_HIDDEN$7, relatedTarget);
  }
  _getConfig(config) {
    config = super._getConfig(config);
    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      throw new TypeError(`${NAME$f.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
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
    this._updateFloatingPosition(referenceElement);
    this._floatingCleanup = autoUpdate(referenceElement, this._menu, () => this._updateFloatingPosition(referenceElement));
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
    await this._applyFloatingPosition(referenceElement, this._menu, floatingConfig.placement, floatingConfig.middleware, floatingConfig.strategy);
  }
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$4);
  }
  _getPlacement() {
    const placement = this._responsivePlacements ? getResponsivePlacement(this._responsivePlacements, DEFAULT_PLACEMENT) : this._config.placement;
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
    const middleware = [offset(typeof offsetValue === 'function' ? offsetValue : {
      mainAxis: offsetValue[1] || 0,
      crossAxis: offsetValue[0] || 0
    }), flip({
      fallbackPlacements: this._getFallbackPlacements()
    }), shift({
      boundary: this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary
    })];
    return middleware;
  }
  _getFallbackPlacements() {
    const placement = this._getPlacement();
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
      middleware,
      strategy: this._config.strategy
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
  _getContainer() {
    const {
      container
    } = this._config;
    if (container === false) {
      return null;
    }
    return container === true ? document.body : getElement(container);
  }
  _moveMenuToContainer() {
    const container = this._getContainer();
    if (!container || !this._menu) {
      return;
    }
    if (this._menu.parentNode !== container) {
      container.append(this._menu);
    }
  }
  _restoreMenuToOriginalParent() {
    if (!this._menuOriginalParent || !this._menu) {
      return;
    }
    if (this._menu.parentNode !== this._menuOriginalParent) {
      this._menuOriginalParent.append(this._menu);
    }
  }
  async _applyFloatingPosition(reference, floating, placement, middleware, strategy = 'absolute') {
    if (!floating.isConnected) {
      return null;
    }
    const {
      x,
      y,
      placement: finalPlacement
    } = await computePosition(reference, floating, {
      placement,
      middleware,
      strategy
    });
    if (!floating.isConnected) {
      return null;
    }
    Object.assign(floating.style, {
      position: strategy,
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
    if (this._config.submenuTrigger === 'hover' || this._config.submenuTrigger === 'both') {
      EventHandler.on(this._menu, 'mouseenter', SELECTOR_SUBMENU_TOGGLE, event => {
        this._onSubmenuTriggerEnter(event);
      });
      EventHandler.on(this._menu, 'mouseleave', SELECTOR_SUBMENU, event => {
        this._onSubmenuLeave(event);
      });
      EventHandler.on(this._menu, 'mousemove', event => {
        this._trackMousePosition(event);
      });
    }
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
    const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
    if (!submenu) {
      return;
    }
    this._cancelSubmenuCloseTimeout(submenu);
    this._closeSiblingSubmenus(submenuWrapper);
    this._openSubmenu(trigger, submenu, submenuWrapper);
  }
  _onSubmenuLeave(event) {
    const submenuWrapper = event.target.closest(SELECTOR_SUBMENU);
    const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
    if (!submenu || !this._openSubmenus.has(submenu)) {
      return;
    }
    if (this._isMovingTowardSubmenu(event, submenu)) {
      return;
    }
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
    const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
    if (!submenu) {
      return;
    }
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
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-haspopup', 'true');
    submenu.classList.add(CLASS_NAME_SHOW$4);
    submenuWrapper.classList.add(CLASS_NAME_SHOW$4);
    const cleanup = this._createSubmenuFloating(trigger, submenu, submenuWrapper);
    this._openSubmenus.set(submenu, cleanup);
    EventHandler.on(submenu, 'mouseenter', () => {
      this._cancelSubmenuCloseTimeout(submenu);
    });
  }
  _closeSubmenu(submenu, submenuWrapper) {
    if (!this._openSubmenus.has(submenu)) {
      return;
    }
    const nestedSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} ${SELECTOR_MENU$2}.${CLASS_NAME_SHOW$4}`, submenu);
    for (const nested of nestedSubmenus) {
      const nestedWrapper = nested.closest(SELECTOR_SUBMENU);
      this._closeSubmenu(nested, nestedWrapper);
    }
    const trigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, submenuWrapper);
    const cleanup = this._openSubmenus.get(submenu);
    if (cleanup) {
      cleanup();
    }
    this._openSubmenus.delete(submenu);
    EventHandler.off(submenu, 'mouseenter');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
    submenu.classList.remove(CLASS_NAME_SHOW$4);
    submenuWrapper.classList.remove(CLASS_NAME_SHOW$4);
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
    const parent = currentSubmenuWrapper.parentNode;
    const siblingSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} > ${SELECTOR_MENU$2}.${CLASS_NAME_SHOW$4}`, parent);
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
    const isRtl = isRTL();
    const targetX = isRtl ? submenuRect.right : submenuRect.left;
    const topCorner = {
      x: targetX,
      y: submenuRect.top
    };
    const bottomCorner = {
      x: targetX,
      y: submenuRect.bottom
    };
    return this._pointInTriangle(currentPos, lastPos, topCorner, bottomCorner);
  }
  _pointInTriangle(point, v1, v2, v3) {
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
    const currentMenu = target.closest(SELECTOR_MENU$2) || this._menu;
    const items = SelectorEngine.find(`:scope > ${SELECTOR_VISIBLE_ITEMS$1}`, currentMenu).filter(element => isVisible(element));
    if (!items.length) {
      return;
    }
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$2, !items.includes(target)).focus();
  }
  _handleSubmenuKeydown(event) {
    const {
      key,
      target
    } = event;
    const isRtl = isRTL();
    const enterKey = isRtl ? ARROW_LEFT_KEY$1 : ARROW_RIGHT_KEY$1;
    const exitKey = isRtl ? ARROW_RIGHT_KEY$1 : ARROW_LEFT_KEY$1;
    const submenuWrapper = target.closest(SELECTOR_SUBMENU);
    const isSubmenuTrigger = submenuWrapper && target.matches(SELECTOR_SUBMENU_TOGGLE);
    if ((key === ENTER_KEY$1 || key === SPACE_KEY$1) && isSubmenuTrigger) {
      event.preventDefault();
      event.stopPropagation();
      const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
      if (submenu) {
        this._closeSiblingSubmenus(submenuWrapper);
        this._openSubmenu(target, submenu, submenuWrapper);
        requestAnimationFrame(() => {
          const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS$1, submenu);
          if (firstItem) {
            firstItem.focus();
          }
        });
      }
      return true;
    }
    if (key === enterKey && isSubmenuTrigger) {
      event.preventDefault();
      event.stopPropagation();
      const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
      if (submenu) {
        this._closeSiblingSubmenus(submenuWrapper);
        this._openSubmenu(target, submenu, submenuWrapper);
        requestAnimationFrame(() => {
          const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS$1, submenu);
          if (firstItem) {
            firstItem.focus();
          }
        });
      }
      return true;
    }
    if (key === exitKey) {
      const currentMenu = target.closest(SELECTOR_MENU$2);
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
    if (key === HOME_KEY$2 || key === END_KEY$2) {
      event.preventDefault();
      event.stopPropagation();
      const currentMenu = target.closest(SELECTOR_MENU$2);
      const items = SelectorEngine.find(`:scope > ${SELECTOR_VISIBLE_ITEMS$1}`, currentMenu).filter(element => isVisible(element));
      if (items.length) {
        const targetItem = key === HOME_KEY$2 ? items[0] : items[items.length - 1];
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
    for (const instance of Menu._openInstances) {
      if (instance._config.autoClose === false) {
        continue;
      }
      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(instance._menu);
      if (composedPath.includes(instance._element) || instance._config.autoClose === 'inside' && !isMenuTarget || instance._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      }
      if (instance._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: instance._element
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      instance._completeHide(relatedTarget);
    }
  }
  static dataApiKeydownHandler(event) {
    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$1;
    const isUpOrDownEvent = [ARROW_UP_KEY$2, ARROW_DOWN_KEY$2].includes(event.key);
    const isLeftOrRightEvent = [ARROW_LEFT_KEY$1, ARROW_RIGHT_KEY$1].includes(event.key);
    const isHomeOrEndEvent = [HOME_KEY$2, END_KEY$2].includes(event.key);
    const isEnterOrSpaceEvent = [ENTER_KEY$1, SPACE_KEY$1].includes(event.key);
    const isSubmenuTrigger = event.target.matches(SELECTOR_SUBMENU_TOGGLE);
    if (!isUpOrDownEvent && !isEscapeEvent && !isLeftOrRightEvent && !isHomeOrEndEvent && !(isEnterOrSpaceEvent && isSubmenuTrigger)) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$8) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$8)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$8)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$8, event.delegateTarget.parentNode);
    if (!getToggleButton) {
      return;
    }
    const instance = Menu.getOrCreateInstance(getToggleButton);
    if ((isLeftOrRightEvent || isHomeOrEndEvent || isEnterOrSpaceEvent && isSubmenuTrigger) && instance._handleSubmenuKeydown(event)) {
      return;
    }
    if (isUpOrDownEvent) {
      event.preventDefault();
      event.stopPropagation();
      instance.show();
      instance._selectMenuItem(event);
      return;
    }
    if (isEscapeEvent && instance._isShown()) {
      event.preventDefault();
      event.stopPropagation();
      const currentMenu = event.target.closest(SELECTOR_MENU$2);
      const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU);
      if (parentSubmenuWrapper && instance._openSubmenus.size > 0) {
        const parentTrigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper);
        instance._closeSubmenu(currentMenu, parentSubmenuWrapper);
        if (parentTrigger) {
          parentTrigger.focus();
        }
        return;
      }
      instance.hide();
      getToggleButton.focus();
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$8, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU$2, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$5, Menu.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Menu.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE$8, function (event) {
  event.preventDefault();
  Menu.getOrCreateInstance(this).toggle();
});

/**
 * --------------------------------------------------------------------------
 * Bootstrap combobox.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$e = 'combobox';
const DATA_KEY$b = 'bs.combobox';
const EVENT_KEY$b = `.${DATA_KEY$b}`;
const DATA_API_KEY$7 = '.data-api';
const ESCAPE_KEY = 'Escape';
const TAB_KEY = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const HOME_KEY$1 = 'Home';
const END_KEY$1 = 'End';
const ENTER_KEY = 'Enter';
const SPACE_KEY = ' ';
const EVENT_CHANGE$2 = `change${EVENT_KEY$b}`;
const EVENT_SHOW$6 = `show${EVENT_KEY$b}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$b}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$b}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$b}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_SELECTED = 'selected';
const CLASS_NAME_PLACEHOLDER = 'combobox-placeholder';
const SELECTOR_DATA_TOGGLE$7 = '[data-bs-toggle="combobox"]';
const SELECTOR_MENU$1 = '.menu';
const SELECTOR_MENU_ITEM = '.menu-item[data-bs-value]';
const SELECTOR_VISIBLE_ITEMS = '.menu-item[data-bs-value]:not(.disabled):not(:disabled)';
const SELECTOR_VALUE = '.combobox-value';
const SELECTOR_SEARCH_INPUT = '.combobox-search-input';
const SELECTOR_NO_RESULTS = '.combobox-no-results';
const Default$d = {
  boundary: 'clippingParents',
  multiple: false,
  name: null,
  offset: [0, 2],
  placeholder: '',
  placement: 'bottom-start',
  search: false,
  searchNormalize: false
};
const DefaultType$d = {
  boundary: '(string|element)',
  multiple: 'boolean',
  name: '(string|null)',
  offset: '(array|string|function)',
  placeholder: 'string',
  placement: 'string',
  search: 'boolean',
  searchNormalize: 'boolean'
};

/**
 * Class definition
 */

class Combobox extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._toggle = this._element;
    this._menu = SelectorEngine.next(this._toggle, SELECTOR_MENU$1)[0];
    this._valueDisplay = SelectorEngine.findOne(SELECTOR_VALUE, this._toggle);
    this._searchInput = SelectorEngine.findOne(SELECTOR_SEARCH_INPUT, this._menu);
    this._noResults = SelectorEngine.findOne(SELECTOR_NO_RESULTS, this._menu);
    this._hiddenInput = null;
    this._menuInstance = null;
    this._createHiddenInput();
    this._createMenuInstance();
    this._syncInitialSelection();
    this._addEventListeners();
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
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._toggle) || this._isShown()) {
      return;
    }
    const showEvent = EventHandler.trigger(this._toggle, EVENT_SHOW$6);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._menuInstance.show();
    if (this._searchInput) {
      this._searchInput.value = '';
      this._filterItems('');
      requestAnimationFrame(() => this._searchInput.focus());
    }
    EventHandler.trigger(this._toggle, EVENT_SHOWN$6);
  }
  hide() {
    if (!this._isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._toggle, EVENT_HIDE$6);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._menuInstance.hide();
    EventHandler.trigger(this._toggle, EVENT_HIDDEN$6);
  }
  dispose() {
    if (this._menuInstance) {
      this._menuInstance.dispose();
      this._menuInstance = null;
    }
    if (this._hiddenInput) {
      this._hiddenInput.remove();
      this._hiddenInput = null;
    }
    EventHandler.off(this._menu, EVENT_KEY$b);
    EventHandler.off(this._toggle, EVENT_KEY$b);
    super.dispose();
  }

  // Private
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$3);
  }
  _createHiddenInput() {
    const {
      name
    } = this._config;
    if (!name) {
      return;
    }
    this._hiddenInput = document.createElement('input');
    this._hiddenInput.type = 'hidden';
    this._hiddenInput.name = name;
    this._hiddenInput.value = '';
    this._toggle.parentNode.insertBefore(this._hiddenInput, this._toggle);
  }
  _createMenuInstance() {
    this._menuInstance = new Menu(this._toggle, {
      menu: this._menu,
      autoClose: this._config.multiple ? 'outside' : true,
      boundary: this._config.boundary,
      offset: this._config.offset,
      placement: this._config.placement
    });
  }
  _syncInitialSelection() {
    const selectedItems = this._getSelectedItems();
    if (selectedItems.length > 0) {
      this._updateToggleText();
      this._updateHiddenInput();
    } else {
      this._showPlaceholder();
    }
  }
  _addEventListeners() {
    EventHandler.on(this._menu, 'click', SELECTOR_MENU_ITEM, event => {
      const item = event.target.closest(SELECTOR_MENU_ITEM);
      if (!item || isDisabled(item)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this._selectItem(item);
    });
    EventHandler.on(this._toggle, 'keydown', event => {
      this._handleToggleKeydown(event);
    });
    EventHandler.on(this._menu, 'keydown', event => {
      this._handleMenuKeydown(event);
    });
    if (this._searchInput) {
      EventHandler.on(this._searchInput, 'input', () => {
        this._filterItems(this._searchInput.value);
      });
      EventHandler.on(this._searchInput, 'keydown', event => {
        if (event.key === ARROW_DOWN_KEY$1) {
          event.preventDefault();
          const items = this._getVisibleItems();
          if (items.length > 0) {
            items[0].focus();
          }
        }
        if (event.key === ESCAPE_KEY) {
          this.hide();
          this._toggle.focus();
        }
      });
    }
  }
  _selectItem(item) {
    if (this._config.multiple) {
      item.classList.toggle(CLASS_NAME_SELECTED);
      item.setAttribute('aria-selected', item.classList.contains(CLASS_NAME_SELECTED));
    } else {
      const previouslySelected = SelectorEngine.find(`.${CLASS_NAME_SELECTED}`, this._menu);
      for (const prev of previouslySelected) {
        prev.classList.remove(CLASS_NAME_SELECTED);
        prev.setAttribute('aria-selected', 'false');
      }
      item.classList.add(CLASS_NAME_SELECTED);
      item.setAttribute('aria-selected', 'true');
    }
    this._updateToggleText();
    this._updateHiddenInput();
    const value = this._config.multiple ? this._getSelectedItems().map(el => el.dataset.bsValue) : item.dataset.bsValue;
    EventHandler.trigger(this._toggle, EVENT_CHANGE$2, {
      value,
      item
    });
    if (!this._config.multiple) {
      this.hide();
      this._toggle.focus();
    }
  }
  _updateToggleText() {
    const selectedItems = this._getSelectedItems();
    if (selectedItems.length === 0) {
      this._showPlaceholder();
      return;
    }
    this._valueDisplay.classList.remove(CLASS_NAME_PLACEHOLDER);
    if (this._config.multiple && selectedItems.length > 1) {
      this._valueDisplay.textContent = `${selectedItems.length} selected`;
    } else {
      const item = selectedItems[0];
      const label = SelectorEngine.findOne('.menu-item-content > span:first-child', item);
      this._valueDisplay.textContent = label ? label.textContent : item.textContent.trim();
    }
  }
  _showPlaceholder() {
    const {
      placeholder
    } = this._config;
    if (placeholder) {
      this._valueDisplay.textContent = placeholder;
      this._valueDisplay.classList.add(CLASS_NAME_PLACEHOLDER);
    }
  }
  _updateHiddenInput() {
    if (!this._hiddenInput) {
      return;
    }
    const selectedItems = this._getSelectedItems();
    const values = selectedItems.map(el => el.dataset.bsValue);
    this._hiddenInput.value = this._config.multiple ? values.join(',') : values[0] || '';
  }
  _getSelectedItems() {
    return SelectorEngine.find(`.${CLASS_NAME_SELECTED}`, this._menu);
  }
  _getVisibleItems() {
    return SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(item => isVisible(item));
  }
  _filterItems(query) {
    const normalizedQuery = this._normalizeText(query.toLowerCase().trim());
    const items = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu);
    let visibleCount = 0;
    for (const item of items) {
      const text = this._normalizeText(item.textContent.toLowerCase().trim());
      const matches = !normalizedQuery || text.includes(normalizedQuery);
      item.style.display = matches ? '' : 'none';
      if (matches) {
        visibleCount++;
      }
    }
    if (this._noResults) {
      this._noResults.classList.toggle('d-none', visibleCount > 0);
    }
  }
  _normalizeText(text) {
    if (this._config.searchNormalize) {
      return text.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
    }
    return text;
  }
  _handleToggleKeydown(event) {
    const {
      key
    } = event;
    if (key === ARROW_DOWN_KEY$1 || key === ARROW_UP_KEY$1) {
      event.preventDefault();
      if (!this._isShown()) {
        this.show();
      }
      const items = this._getVisibleItems();
      if (items.length > 0) {
        const target = key === ARROW_DOWN_KEY$1 ? items[0] : items[items.length - 1];
        target.focus();
      }
      return;
    }
    if ((key === ENTER_KEY || key === SPACE_KEY) && !this._isShown()) {
      event.preventDefault();
      this.show();
    }
  }
  _handleMenuKeydown(event) {
    const {
      key,
      target
    } = event;
    if (key === ESCAPE_KEY) {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
      this._toggle.focus();
      return;
    }
    if (key === TAB_KEY) {
      this.hide();
      return;
    }
    const isInput = target.matches('input');
    if (key === ARROW_DOWN_KEY$1 || key === ARROW_UP_KEY$1) {
      event.preventDefault();
      const items = this._getVisibleItems();
      if (items.length > 0) {
        getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
      }
      return;
    }
    if (key === HOME_KEY$1 || key === END_KEY$1) {
      event.preventDefault();
      const items = this._getVisibleItems();
      if (items.length > 0) {
        const targetItem = key === HOME_KEY$1 ? items[0] : items[items.length - 1];
        targetItem.focus();
      }
      return;
    }
    if ((key === ENTER_KEY || key === SPACE_KEY) && !isInput) {
      event.preventDefault();
      const item = target.closest(SELECTOR_MENU_ITEM);
      if (item && !isDisabled(item)) {
        this._selectItem(item);
      }
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Combobox.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$7, function (event) {
  event.preventDefault();
  Combobox.getOrCreateInstance(this).toggle();
});
EventHandler.on(document, 'DOMContentLoaded', () => {
  for (const toggle of SelectorEngine.find(SELECTOR_DATA_TOGGLE$7)) {
    Combobox.getOrCreateInstance(toggle);
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

const NAME$d = 'datepicker';
const DATA_KEY$a = 'bs.datepicker';
const EVENT_KEY$a = `.${DATA_KEY$a}`;
const DATA_API_KEY$6 = '.data-api';
const EVENT_CHANGE$1 = `change${EVENT_KEY$a}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$a}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$a}`;
const EVENT_HIDE$5 = `hide${EVENT_KEY$a}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$a}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY$a}${DATA_API_KEY$6}`;
const SELECTOR_DATA_TOGGLE$6 = '[data-bs-toggle="datepicker"]';
const HIDE_DELAY = 100; // ms delay before hiding after selection

const Default$c = {
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
const DefaultType$c = {
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
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
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
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._calendar.show();
    this._isShown = true;
    EventHandler.trigger(this._element, EVENT_SHOWN$5);
  }
  hide() {
    if (this._config.inline) {
      return; // Inline calendars are always visible
    }
    if (!this._calendar || !this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._calendar.hide();
    this._isShown = false;
    EventHandler.trigger(this._element, EVENT_HIDDEN$5);
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
    EventHandler.trigger(this._element, EVENT_CHANGE$1, {
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

EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$6, function (event) {
  // Only handle if not an input (inputs use focus)
  // Skip inline datepickers (they're always visible)
  if (this.tagName === 'INPUT' || this.dataset.bsInline === 'true') {
    return;
  }
  event.preventDefault();
  Datepicker.getOrCreateInstance(this).toggle();
});
EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE$6, function () {
  // Handle focus for input elements
  if (this.tagName !== 'INPUT') {
    return;
  }
  Datepicker.getOrCreateInstance(this).show();
});

// Auto-initialize inline datepickers on DOMContentLoaded
EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$a}${DATA_API_KEY$6}`, () => {
  for (const element of document.querySelectorAll(`${SELECTOR_DATA_TOGGLE$6}[data-bs-inline="true"]`)) {
    Datepicker.getOrCreateInstance(element);
  }
});

/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog-base.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const CLASS_NAME_OPEN = 'dialog-open';

/**
 * Class definition
 *
 * Shared base class for Dialog and Offcanvas components that use
 * the native <dialog> element. Provides common behavior for:
 * - Opening/closing via showModal()/show()/close()
 * - Escape key handling (modal and non-modal)
 * - Backdrop click handling
 * - Static backdrop transition ("bounce")
 * - Body scroll prevention
 * - Transition coordination
 */

class DialogBase extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._openedAsModal = false;
    this._addDialogListeners();
  }

  // Getters — subclasses override NAME with their own component name.
  // This base name is only used if DialogBase is instantiated directly.
  static get NAME() {
    return 'dialogbase';
  }

  // Protected - subclasses use these to implement show()/hide()

  _showElement({
    modal = true,
    preventBodyScroll = true
  } = {}) {
    this._openedAsModal = modal;
    if (modal) {
      this._element.showModal();
    } else {
      this._element.show();
    }
    if (preventBodyScroll) {
      document.body.classList.add(CLASS_NAME_OPEN);
    }
  }
  _hideElement() {
    // this._hideChildComponents()
    this._element.close();
    this._openedAsModal = false;

    // Only restore body scroll if no other modal dialogs are open
    if (!document.querySelector('dialog[open]:modal')) {
      document.body.classList.remove(CLASS_NAME_OPEN);
    }
  }

  // Hide any tooltips, popovers, or toasts inside the dialog before closing.
  // These components append to the dialog (for top-layer rendering) and would
  // otherwise persist visibly after close().
  _hideChildComponents() {
    const selector = '[data-bs-toggle="tooltip"], [data-bs-toggle="popover"]';
    for (const el of SelectorEngine.find(selector, this._element)) {
      const instance = BaseComponent.getInstance(el);
      if (instance && typeof instance.hide === 'function') {
        instance.hide();
      }
    }

    // Hide any visible toasts
    for (const el of SelectorEngine.find('.toast.show', this._element)) {
      const instance = BaseComponent.getInstance(el);
      if (instance && typeof instance.hide === 'function') {
        instance.hide();
      }
    }
  }
  _triggerBackdropTransition() {
    const hidePreventedEvent = EventHandler.trigger(this._element, this.constructor.eventName('hidePrevented'));
    if (hidePreventedEvent.defaultPrevented) {
      return;
    }
    const staticClass = this._getStaticClassName();
    this._element.classList.add(staticClass);
    this._queueCallback(() => {
      this._element.classList.remove(staticClass);
    }, this._element);
  }

  // Overrideable by subclasses for component-specific class names
  _getStaticClassName() {
    return 'dialog-static';
  }

  // Private

  _addDialogListeners() {
    const eventKey = this.constructor.EVENT_KEY;

    // Handle native cancel event (Escape key) — only fires for modal dialogs
    // Note: 'cancel' is not in EventHandler's nativeEvents set, so we must
    // register it without namespace to properly bind to the native event.
    EventHandler.on(this._element, 'cancel', event => {
      // Prevent native close behavior — we handle it
      event.preventDefault();
      if (!this._config.keyboard) {
        this._triggerBackdropTransition();
        return;
      }
      this._onCancel();
      this.hide();
    });

    // Handle Escape key for non-modal dialogs (native cancel doesn't fire for show())
    EventHandler.on(this._element, `keydown${eventKey}`, event => {
      if (event.key !== 'Escape' || this._openedAsModal) {
        return;
      }
      event.preventDefault();
      if (!this._config.keyboard) {
        return;
      }
      this._onCancel();
      this.hide();
    });

    // Handle backdrop clicks — only applies to modal dialogs
    // Native <dialog> fires click on the dialog element itself when backdrop is clicked
    EventHandler.on(this._element, `click${eventKey}`, event => {
      // Only handle clicks directly on the dialog (backdrop area), not child content
      if (event.target !== this._element || !this._openedAsModal) {
        return;
      }
      if (this._config.backdrop === 'static') {
        this._triggerBackdropTransition();
        return;
      }
      this.hide();
    });
  }

  // Hook for subclasses to fire component-specific cancel events
  _onCancel() {
    // No-op by default — Dialog overrides this to fire its cancel event
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$c = 'dialog';
const DATA_KEY$9 = 'bs.dialog';
const EVENT_KEY$9 = `.${DATA_KEY$9}`;
const DATA_API_KEY$5 = '.data-api';
const EVENT_SHOW$4 = `show${EVENT_KEY$9}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$9}`;
const EVENT_HIDE$4 = `hide${EVENT_KEY$9}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$9}`;
const EVENT_CANCEL = `cancel${EVENT_KEY$9}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
const CLASS_NAME_NONMODAL = 'dialog-nonmodal';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="dialog"]';
const Default$b = {
  backdrop: true,
  // true (click dismisses) or 'static' (click does nothing) - only applies to modal dialogs
  keyboard: true,
  modal: true // true uses showModal(), false uses show() for non-modal dialogs
};
const DefaultType$b = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  modal: 'boolean'
};

/**
 * Class definition
 */

class Dialog extends DialogBase {
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
  toggle(relatedTarget) {
    return this._element.open ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._element.open || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isTransitioning = true;
    if (!this._config.modal) {
      this._element.classList.add(CLASS_NAME_NONMODAL);
    }
    this._showElement({
      modal: this._config.modal,
      preventBodyScroll: this._config.modal
    });

    // CSS @starting-style handles the entry animation automatically.
    this._queueCallback(() => {
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    }, this._element, true);
  }
  hide() {
    if (!this._element.open || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isTransitioning = true;

    // Call close() immediately — CSS handles the exit animation via
    // transition-behavior: allow-discrete on display and overlay.
    this._hideElement();
    this._element.classList.remove(CLASS_NAME_NONMODAL);
    this._queueCallback(() => {
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    }, this._element, true);
  }
  handleUpdate() {
    // Provided for API consistency with Modal.
    // Native dialogs handle their own positioning.
  }

  // Private
  _onCancel() {
    EventHandler.trigger(this._element, EVENT_CANCEL);
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$5, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$4, showEvent => {
    if (showEvent.defaultPrevented) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
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
 * Bootstrap nav-overflow.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$b = 'navoverflow';
const DATA_KEY$8 = 'bs.navoverflow';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const EVENT_UPDATE = `update${EVENT_KEY$8}`;
const EVENT_OVERFLOW = `overflow${EVENT_KEY$8}`;
const CLASS_NAME_OVERFLOW = 'nav-overflow';
const CLASS_NAME_OVERFLOW_MENU = 'nav-overflow-menu';
const CLASS_NAME_HIDDEN = 'd-none';
const SELECTOR_NAV_ITEM = '.nav-item';
const SELECTOR_NAV_LINK = '.nav-link';
const SELECTOR_OVERFLOW_TOGGLE = '.nav-overflow-toggle';
const SELECTOR_OVERFLOW_MENU = '.nav-overflow-menu';
const CLASS_NAME_KEEP = 'nav-overflow-keep';
const Default$a = {
  moreText: 'More',
  moreIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/></svg>',
  threshold: 0 // Minimum items to keep visible before showing overflow
};
const DefaultType$a = {
  moreText: 'string',
  moreIcon: 'string',
  threshold: 'number'
};

/**
 * Class definition
 */

class NavOverflow extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._items = [];
    this._overflowItems = [];
    this._overflowMenu = null;
    this._overflowToggle = null;
    this._resizeObserver = null;
    this._isInitialized = false;
    this._init();
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
  update() {
    this._calculateOverflow();
    EventHandler.trigger(this._element, EVENT_UPDATE);
  }
  dispose() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    // Move items back to original positions
    this._restoreItems();

    // Remove overflow menu
    if (this._overflowToggle && this._overflowToggle.parentElement) {
      this._overflowToggle.parentElement.remove();
    }
    super.dispose();
  }

  // Private
  _init() {
    // Add overflow class to nav
    this._element.classList.add(CLASS_NAME_OVERFLOW);

    // Get all nav items
    this._items = [...SelectorEngine.find(SELECTOR_NAV_ITEM, this._element)];

    // Store original order data
    for (const [index, item] of this._items.entries()) {
      item.dataset.bsNavOrder = index;
    }

    // Create overflow menu if it doesn't exist
    this._createOverflowMenu();

    // Setup resize observer
    this._setupResizeObserver();

    // Initial calculation
    this._calculateOverflow();
    this._isInitialized = true;
  }
  _createOverflowMenu() {
    // Check if overflow menu already exists
    this._overflowToggle = SelectorEngine.findOne(SELECTOR_OVERFLOW_TOGGLE, this._element);
    if (this._overflowToggle) {
      this._overflowMenu = SelectorEngine.findOne(SELECTOR_OVERFLOW_MENU, this._element);
      return;
    }
    const overflowItem = document.createElement('li');
    overflowItem.className = 'nav-item nav-overflow-item';
    overflowItem.innerHTML = `
      <button class="nav-link nav-overflow-toggle" type="button" data-bs-toggle="menu" data-bs-placement="bottom-end" aria-expanded="false">
        <span class="nav-overflow-icon">${this._config.moreIcon}</span>
        <span class="nav-overflow-text">${this._config.moreText}</span>
      </button>
      <div class="${CLASS_NAME_OVERFLOW_MENU} menu"></div>
    `;
    this._element.append(overflowItem);
    this._overflowToggle = overflowItem.querySelector(SELECTOR_OVERFLOW_TOGGLE);
    this._overflowMenu = overflowItem.querySelector(SELECTOR_OVERFLOW_MENU);
  }
  _setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') {
      // Fallback for older browsers
      EventHandler.on(window, 'resize', () => this._calculateOverflow());
      return;
    }
    this._resizeObserver = new ResizeObserver(() => {
      this._calculateOverflow();
    });
    this._resizeObserver.observe(this._element);
  }
  _calculateOverflow() {
    // First, restore all items to measure properly
    this._restoreItems();
    const navWidth = this._element.offsetWidth;
    const overflowItem = this._overflowToggle?.closest('.nav-item');
    const overflowWidth = overflowItem?.offsetWidth || 0;
    let usedWidth = 0;
    const itemsToOverflow = [];
    const overflowThreshold = navWidth - overflowWidth - 10; // 10px buffer

    // Calculate which items need to overflow (skip items with keep class)
    for (const item of this._items) {
      const itemWidth = item.offsetWidth;
      usedWidth += itemWidth;

      // Never overflow items with the keep class
      if (item.classList.contains(CLASS_NAME_KEEP)) {
        continue;
      }
      if (usedWidth > overflowThreshold) {
        itemsToOverflow.push(item);
      }
    }

    // Check if we need threshold minimum visible
    const visibleCount = this._items.length - itemsToOverflow.length;
    if (visibleCount < this._config.threshold && this._items.length > this._config.threshold) {
      // Add more items to overflow until we reach threshold (but not keep items)
      const toMove = this._items.slice(this._config.threshold).filter(item => !item.classList.contains(CLASS_NAME_KEEP));
      itemsToOverflow.length = 0;
      itemsToOverflow.push(...toMove);
    }

    // Move items to overflow menu
    this._moveToOverflow(itemsToOverflow);

    // Show/hide overflow toggle
    if (overflowItem) {
      if (itemsToOverflow.length > 0) {
        overflowItem.classList.remove(CLASS_NAME_HIDDEN);
      } else {
        overflowItem.classList.add(CLASS_NAME_HIDDEN);
      }
    }

    // Trigger overflow event if items changed
    if (itemsToOverflow.length > 0) {
      EventHandler.trigger(this._element, EVENT_OVERFLOW, {
        overflowCount: itemsToOverflow.length,
        visibleCount: this._items.length - itemsToOverflow.length
      });
    }
  }
  _moveToOverflow(items) {
    if (!this._overflowMenu) {
      return;
    }

    // Clear existing overflow items
    this._overflowMenu.innerHTML = '';
    this._overflowItems = [];
    for (const item of items) {
      const link = SelectorEngine.findOne(SELECTOR_NAV_LINK, item);
      if (!link) {
        continue;
      }
      const clonedLink = link.cloneNode(true);
      clonedLink.className = 'menu-item';
      if (link.classList.contains('active')) {
        clonedLink.classList.add('active');
      }
      if (link.classList.contains('disabled') || link.hasAttribute('disabled')) {
        clonedLink.classList.add('disabled');
      }
      this._overflowMenu.append(clonedLink);

      // Hide original item
      item.classList.add(CLASS_NAME_HIDDEN);
      item.dataset.bsNavOverflow = 'true';
      this._overflowItems.push(item);
    }
  }
  _restoreItems() {
    for (const item of this._items) {
      item.classList.remove(CLASS_NAME_HIDDEN);
      delete item.dataset.bsNavOverflow;
    }
    if (this._overflowMenu) {
      this._overflowMenu.innerHTML = '';
    }
    this._overflowItems = [];
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, 'DOMContentLoaded', () => {
  for (const element of SelectorEngine.find('[data-bs-toggle="nav-overflow"]')) {
    NavOverflow.getOrCreateInstance(element);
  }
});

/**
 * --------------------------------------------------------------------------
 * Bootstrap offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$a = 'offcanvas';
const DATA_KEY$7 = 'bs.offcanvas';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$7}${DATA_API_KEY$4}`;
const EVENT_SHOW$3 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$7}`;
const EVENT_RESIZE = `resize${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="offcanvas"]';
const Default$9 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$9 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};

/**
 * Class definition
 */

class Offcanvas extends DialogBase {
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
  toggle(relatedTarget) {
    return this._element.open ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._element.open || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isTransitioning = true;

    // Determine modal mode:
    // - Use showModal() (modal) when backdrop is enabled or scroll is disabled
    // - Use show() (non-modal) when backdrop is false AND scroll is true
    //   (matches behavior where focus trap is skipped for this combo)
    const useModal = Boolean(this._config.backdrop) || !this._config.scroll;
    this._showElement({
      modal: useModal,
      preventBodyScroll: !this._config.scroll
    });

    // CSS @starting-style handles the entry animation automatically.
    // Wait for the transform transition to complete, then fire shown.
    this._queueCallback(() => {
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    }, this._element, true);
  }
  hide() {
    if (!this._element.open || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isTransitioning = true;

    // Call close() immediately — CSS handles the exit animation via
    // transition-behavior: allow-discrete on display and overlay,
    // keeping the element visible and in the top layer until complete.
    this._hideElement();
    this._queueCallback(() => {
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    }, this._element, true);
  }

  // Private
  _getStaticClassName() {
    return 'offcanvas-static';
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
    // Focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  });

  // Avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne('dialog.offcanvas[open]');
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find('dialog.offcanvas[open]')) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('dialog[open][class*="\\:offcanvas"]')) {
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

const NAME$9 = 'strength';
const DATA_KEY$6 = 'bs.strength';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const EVENT_STRENGTH_CHANGE = `strengthChange${EVENT_KEY$6}`;
const SELECTOR_DATA_STRENGTH = '[data-bs-strength]';
const STRENGTH_LEVELS = ['weak', 'fair', 'good', 'strong'];
const Default$8 = {
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
const DefaultType$8 = {
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
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
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

EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$6}${DATA_API_KEY$3}`, () => {
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

const NAME$8 = 'otpInput';
const DATA_KEY$5 = 'bs.otp-input';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const DATA_API_KEY$2 = '.data-api';
const EVENT_COMPLETE = `complete${EVENT_KEY$5}`;
const EVENT_INPUT = `input${EVENT_KEY$5}`;
const SELECTOR_DATA_OTP = '[data-bs-otp]';
const SELECTOR_INPUT = 'input';
const Default$7 = {
  length: 6,
  mask: false
};
const DefaultType$7 = {
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
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
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

EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$5}${DATA_API_KEY$2}`, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) {
    OtpInput.getOrCreateInstance(element);
  }
});

/**
 * --------------------------------------------------------------------------
 * Bootstrap chip-input.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$7 = 'chipInput';
const DATA_KEY$4 = 'bs.chip-input';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$1 = '.data-api';
const EVENT_ADD = `add${EVENT_KEY$4}`;
const EVENT_REMOVE = `remove${EVENT_KEY$4}`;
const EVENT_CHANGE = `change${EVENT_KEY$4}`;
const EVENT_SELECT = `select${EVENT_KEY$4}`;
const SELECTOR_DATA_CHIP_INPUT = '[data-bs-chip-input]';
const SELECTOR_GHOST_INPUT = '.form-ghost';
const SELECTOR_CHIP = '.chip';
const SELECTOR_CHIP_DISMISS = '.chip-dismiss';
const CLASS_NAME_CHIP = 'chip';
const CLASS_NAME_CHIP_DISMISS = 'chip-dismiss';
const CLASS_NAME_ACTIVE$2 = 'active';
const DEFAULT_DISMISS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>';
const Default$6 = {
  separator: ',',
  allowDuplicates: false,
  maxChips: null,
  placeholder: '',
  dismissible: true,
  dismissIcon: DEFAULT_DISMISS_ICON,
  createOnBlur: true
};
const DefaultType$6 = {
  separator: '(string|null)',
  allowDuplicates: 'boolean',
  maxChips: '(number|null)',
  placeholder: 'string',
  dismissible: 'boolean',
  dismissIcon: 'string',
  createOnBlur: 'boolean'
};

/**
 * Class definition
 */

class ChipInput extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._input = SelectorEngine.findOne(SELECTOR_GHOST_INPUT, this._element);
    this._chips = [];
    this._selectedChips = new Set();
    this._anchorChip = null; // For shift+click range selection

    if (!this._input) {
      this._createInput();
    }
    this._initializeExistingChips();
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
  add(value) {
    const trimmedValue = String(value).trim();
    if (!trimmedValue) {
      return null;
    }

    // Check for duplicates
    if (!this._config.allowDuplicates && this._chips.includes(trimmedValue)) {
      return null;
    }

    // Check max chips limit
    if (this._config.maxChips !== null && this._chips.length >= this._config.maxChips) {
      return null;
    }
    const addEvent = EventHandler.trigger(this._element, EVENT_ADD, {
      value: trimmedValue,
      relatedTarget: this._input
    });
    if (addEvent.defaultPrevented) {
      return null;
    }
    const chip = this._createChip(trimmedValue);
    this._element.insertBefore(chip, this._input);
    this._chips.push(trimmedValue);
    EventHandler.trigger(this._element, EVENT_CHANGE, {
      values: this.getValues()
    });
    return chip;
  }
  remove(chipOrValue) {
    let chip;
    let value;
    if (typeof chipOrValue === 'string') {
      value = chipOrValue;
      chip = this._findChipByValue(value);
    } else {
      chip = chipOrValue;
      value = this._getChipValue(chip);
    }
    if (!chip || !value) {
      return false;
    }
    const removeEvent = EventHandler.trigger(this._element, EVENT_REMOVE, {
      value,
      chip,
      relatedTarget: this._input
    });
    if (removeEvent.defaultPrevented) {
      return false;
    }

    // Remove from selection
    this._selectedChips.delete(chip);
    if (this._anchorChip === chip) {
      this._anchorChip = null;
    }

    // Remove from DOM and array
    chip.remove();
    this._chips = this._chips.filter(v => v !== value);
    EventHandler.trigger(this._element, EVENT_CHANGE, {
      values: this.getValues()
    });
    return true;
  }
  removeSelected() {
    const chipsToRemove = [...this._selectedChips];
    for (const chip of chipsToRemove) {
      this.remove(chip);
    }
    this._input?.focus();
  }
  getValues() {
    return [...this._chips];
  }
  getSelectedValues() {
    return [...this._selectedChips].map(chip => this._getChipValue(chip));
  }
  clear() {
    const chips = SelectorEngine.find(SELECTOR_CHIP, this._element);
    for (const chip of chips) {
      chip.remove();
    }
    this._chips = [];
    this._selectedChips.clear();
    this._anchorChip = null;
    EventHandler.trigger(this._element, EVENT_CHANGE, {
      values: []
    });
  }
  clearSelection() {
    for (const chip of this._selectedChips) {
      chip.classList.remove(CLASS_NAME_ACTIVE$2);
    }
    this._selectedChips.clear();
    this._anchorChip = null;
    EventHandler.trigger(this._element, EVENT_SELECT, {
      selected: []
    });
  }
  selectChip(chip, options = {}) {
    const {
      addToSelection = false,
      rangeSelect = false
    } = options;
    const chipElements = this._getChipElements();
    if (!chipElements.includes(chip)) {
      return;
    }
    if (rangeSelect && this._anchorChip) {
      // Range selection from anchor to chip
      const anchorIndex = chipElements.indexOf(this._anchorChip);
      const chipIndex = chipElements.indexOf(chip);
      const start = Math.min(anchorIndex, chipIndex);
      const end = Math.max(anchorIndex, chipIndex);
      if (!addToSelection) {
        this.clearSelection();
      }
      for (let i = start; i <= end; i++) {
        this._selectedChips.add(chipElements[i]);
        chipElements[i].classList.add(CLASS_NAME_ACTIVE$2);
      }
    } else if (addToSelection) {
      // Toggle selection
      if (this._selectedChips.has(chip)) {
        this._selectedChips.delete(chip);
        chip.classList.remove(CLASS_NAME_ACTIVE$2);
      } else {
        this._selectedChips.add(chip);
        chip.classList.add(CLASS_NAME_ACTIVE$2);
        this._anchorChip = chip;
      }
    } else {
      // Single selection
      this.clearSelection();
      this._selectedChips.add(chip);
      chip.classList.add(CLASS_NAME_ACTIVE$2);
      this._anchorChip = chip;
    }
    EventHandler.trigger(this._element, EVENT_SELECT, {
      selected: this.getSelectedValues()
    });
  }
  focus() {
    this._input?.focus();
  }

  // Private
  _getChipElements() {
    return SelectorEngine.find(SELECTOR_CHIP, this._element);
  }
  _createInput() {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-ghost';
    if (this._config.placeholder) {
      input.placeholder = this._config.placeholder;
    }
    this._element.append(input);
    this._input = input;
  }
  _initializeExistingChips() {
    const existingChips = SelectorEngine.find(SELECTOR_CHIP, this._element);
    for (const chip of existingChips) {
      const value = this._getChipValue(chip);
      if (value) {
        this._chips.push(value);
        this._setupChip(chip);
      }
    }
  }
  _setupChip(chip) {
    // Make chip focusable
    chip.setAttribute('tabindex', '0');

    // Add dismiss button if needed
    if (this._config.dismissible && !SelectorEngine.findOne(SELECTOR_CHIP_DISMISS, chip)) {
      chip.append(this._createDismissButton());
    }
  }
  _createChip(value) {
    const chip = document.createElement('span');
    chip.className = CLASS_NAME_CHIP;
    chip.dataset.bsChipValue = value;

    // Add text node
    chip.append(document.createTextNode(value));

    // Setup chip (tabindex, dismiss button)
    this._setupChip(chip);
    return chip;
  }
  _createDismissButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = CLASS_NAME_CHIP_DISMISS;
    button.setAttribute('aria-label', 'Remove');
    button.setAttribute('tabindex', '-1'); // Not in tab order, chips handle keyboard
    button.innerHTML = this._config.dismissIcon;
    return button;
  }
  _findChipByValue(value) {
    const chips = this._getChipElements();
    return chips.find(chip => this._getChipValue(chip) === value);
  }
  _getChipValue(chip) {
    if (chip.dataset.bsChipValue) {
      return chip.dataset.bsChipValue;
    }
    const clone = chip.cloneNode(true);
    const dismiss = SelectorEngine.findOne(SELECTOR_CHIP_DISMISS, clone);
    if (dismiss) {
      dismiss.remove();
    }
    return clone.textContent?.trim() || '';
  }
  _addEventListeners() {
    // Input events
    EventHandler.on(this._input, 'keydown', event => this._handleInputKeydown(event));
    EventHandler.on(this._input, 'input', event => this._handleInput(event));
    EventHandler.on(this._input, 'paste', event => this._handlePaste(event));
    EventHandler.on(this._input, 'focus', () => this.clearSelection());
    if (this._config.createOnBlur) {
      EventHandler.on(this._input, 'blur', event => {
        // Don't create chip if clicking on a chip
        if (!event.relatedTarget?.closest(SELECTOR_CHIP)) {
          this._createChipFromInput();
        }
      });
    }

    // Chip click events (delegated)
    EventHandler.on(this._element, 'click', SELECTOR_CHIP, event => {
      // Ignore clicks on dismiss button
      if (event.target.closest(SELECTOR_CHIP_DISMISS)) {
        return;
      }
      const chip = event.target.closest(SELECTOR_CHIP);
      if (chip) {
        event.preventDefault();
        this.selectChip(chip, {
          addToSelection: event.metaKey || event.ctrlKey,
          rangeSelect: event.shiftKey
        });
        chip.focus();
      }
    });

    // Dismiss button clicks (delegated)
    EventHandler.on(this._element, 'click', SELECTOR_CHIP_DISMISS, event => {
      event.stopPropagation();
      const chip = event.target.closest(SELECTOR_CHIP);
      if (chip) {
        this.remove(chip);
        this._input?.focus();
      }
    });

    // Chip keyboard events (delegated)
    EventHandler.on(this._element, 'keydown', SELECTOR_CHIP, event => {
      this._handleChipKeydown(event);
    });

    // Focus input when clicking container background
    EventHandler.on(this._element, 'click', event => {
      if (event.target === this._element) {
        this.clearSelection();
        this._input?.focus();
      }
    });
  }
  _handleInputKeydown(event) {
    const {
      key
    } = event;
    switch (key) {
      case 'Enter':
        {
          event.preventDefault();
          this._createChipFromInput();
          break;
        }
      case 'Backspace':
      case 'Delete':
        {
          if (this._input.value === '') {
            event.preventDefault();
            const chips = this._getChipElements();
            if (chips.length > 0) {
              // Select last chip and focus it
              const lastChip = chips.at(-1);
              this.selectChip(lastChip);
              lastChip.focus();
            }
          }
          break;
        }
      case 'ArrowLeft':
        {
          if (this._input.selectionStart === 0 && this._input.selectionEnd === 0) {
            event.preventDefault();
            const chips = this._getChipElements();
            if (chips.length > 0) {
              const lastChip = chips.at(-1);
              if (event.shiftKey) {
                this.selectChip(lastChip, {
                  addToSelection: true
                });
              } else {
                this.selectChip(lastChip);
              }
              lastChip.focus();
            }
          }
          break;
        }
      case 'Escape':
        {
          this._input.value = '';
          this.clearSelection();
          this._input.blur();
          break;
        }

      // No default
    }
  }
  _handleChipKeydown(event) {
    const {
      key
    } = event;
    const chip = event.target.closest(SELECTOR_CHIP);
    if (!chip) {
      return;
    }
    const chips = this._getChipElements();
    const currentIndex = chips.indexOf(chip);
    switch (key) {
      case 'Backspace':
      case 'Delete':
        {
          event.preventDefault();
          this._handleChipDelete(currentIndex, chips);
          break;
        }
      case 'ArrowLeft':
        {
          event.preventDefault();
          this._navigateChip(chips, currentIndex, -1, event.shiftKey);
          break;
        }
      case 'ArrowRight':
        {
          event.preventDefault();
          this._navigateChip(chips, currentIndex, 1, event.shiftKey);
          break;
        }
      case 'Home':
        {
          event.preventDefault();
          this._navigateToEdge(chips, 0, event.shiftKey);
          break;
        }
      case 'End':
        {
          event.preventDefault();
          this.clearSelection();
          this._input?.focus();
          break;
        }
      case 'a':
        {
          this._handleSelectAll(event, chips);
          break;
        }
      case 'Escape':
        {
          event.preventDefault();
          this.clearSelection();
          this._input?.focus();
          break;
        }

      // No default
    }
  }
  _handleChipDelete(currentIndex, chips) {
    if (this._selectedChips.size === 0) {
      return;
    }
    const nextIndex = Math.min(currentIndex, chips.length - this._selectedChips.size - 1);
    this.removeSelected();
    const remainingChips = this._getChipElements();
    if (remainingChips.length > 0) {
      const focusIndex = Math.max(0, Math.min(nextIndex, remainingChips.length - 1));
      remainingChips[focusIndex].focus();
      this.selectChip(remainingChips[focusIndex]);
    } else {
      this._input?.focus();
    }
  }
  _navigateChip(chips, currentIndex, direction, shiftKey) {
    const targetIndex = currentIndex + direction;
    if (direction < 0 && targetIndex >= 0) {
      const targetChip = chips[targetIndex];
      this.selectChip(targetChip, shiftKey ? {
        addToSelection: true,
        rangeSelect: true
      } : {});
      targetChip.focus();
    } else if (direction > 0 && targetIndex < chips.length) {
      const targetChip = chips[targetIndex];
      this.selectChip(targetChip, shiftKey ? {
        addToSelection: true,
        rangeSelect: true
      } : {});
      targetChip.focus();
    } else if (direction > 0) {
      this.clearSelection();
      this._input?.focus();
    }
  }
  _navigateToEdge(chips, targetIndex, shiftKey) {
    if (chips.length === 0) {
      return;
    }
    const targetChip = chips[targetIndex];
    this.selectChip(targetChip, shiftKey ? {
      rangeSelect: true
    } : {});
    targetChip.focus();
  }
  _handleSelectAll(event, chips) {
    if (!(event.metaKey || event.ctrlKey)) {
      return;
    }
    event.preventDefault();
    for (const c of chips) {
      this._selectedChips.add(c);
      c.classList.add(CLASS_NAME_ACTIVE$2);
    }
    EventHandler.trigger(this._element, EVENT_SELECT, {
      selected: this.getSelectedValues()
    });
  }
  _handleInput(event) {
    const {
      value
    } = event.target;
    const {
      separator
    } = this._config;
    if (separator && value.includes(separator)) {
      const parts = value.split(separator);
      for (const part of parts.slice(0, -1)) {
        this.add(part.trim());
      }
      this._input.value = parts.at(-1);
    }
  }
  _handlePaste(event) {
    const {
      separator
    } = this._config;
    if (!separator) {
      return;
    }
    const pastedData = (event.clipboardData || window.clipboardData).getData('text');
    if (pastedData.includes(separator)) {
      event.preventDefault();
      const parts = pastedData.split(separator);
      for (const part of parts) {
        this.add(part.trim());
      }
    }
  }
  _createChipFromInput() {
    const value = this._input.value.trim();
    if (value) {
      this.add(value);
      this._input.value = '';
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$4}${DATA_API_KEY$1}`, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_CHIP_INPUT)) {
    ChipInput.getOrCreateInstance(element);
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
    let {
      container
    } = this._config;
    const closestDialog = this._element.closest('dialog[open]');
    if (closestDialog && container === document.body) {
      container = closestDialog;
    }
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
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
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
const CLASS_NAME_MENU_ITEM = 'menu-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_MENU_TOGGLE$1 = '[data-bs-toggle="menu"]';
const Default$2 = {
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$2 = {
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
    config.target = getElement(config.target) || document.body;
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
    // Activate menu parents
    if (target.classList.contains(CLASS_NAME_MENU_ITEM)) {
      const menuToggle = target.closest('.menu')?.previousElementSibling;
      if (menuToggle?.matches(SELECTOR_MENU_TOGGLE$1)) {
        menuToggle.classList.add(CLASS_NAME_ACTIVE$1);
      }
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
const SELECTOR_MENU_TOGGLE = '[data-bs-toggle="menu"]';
const SELECTOR_MENU = '.menu';
const NOT_SELECTOR_MENU_TOGGLE = `:not(${SELECTOR_MENU_TOGGLE})`;
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_MENU_TOGGLE}, .list-group-item${NOT_SELECTOR_MENU_TOGGLE}, [role="tab"]${NOT_SELECTOR_MENU_TOGGLE}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="tab"]';
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE$1}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"]`;

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
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_TAB_PANEL}`)
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
      this._toggleMenu(element, true);
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
      this._toggleMenu(element, false);
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
  _toggleMenu(element, open) {
    const outerElem = this._getOuterElement(element);
    const menuToggle = SelectorEngine.findOne(SELECTOR_MENU_TOGGLE, outerElem);
    if (!menuToggle) {
      return;
    }
    const menu = SelectorEngine.findOne(SELECTOR_MENU, outerElem);
    menuToggle.classList.toggle(CLASS_NAME_ACTIVE, open);
    if (menu) {
      menu.classList.toggle(CLASS_NAME_SHOW$1, open);
    }
    menuToggle.setAttribute('aria-expanded', open);
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

export { Alert, Button, Carousel, ChipInput, Collapse, Combobox, Datepicker, Dialog, Menu, NavOverflow, Offcanvas, OtpInput, Popover, ScrollSpy, Strength, Tab, Toast, Toggler, Tooltip };
//# sourceMappingURL=bootstrap.js.map
