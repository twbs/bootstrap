/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
import Popper from 'popper.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';
const _window = window,
      jQuery = _window.jQuery; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

const toType = obj => ({}).toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */


const getUID = prefix => {
  do {
    // eslint-disable-next-line no-bitwise
    prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
  } while (document.getElementById(prefix));

  return prefix;
};

const getSelectorFromElement = element => {
  let selector = element.getAttribute('data-target');

  if (!selector || selector === '#') {
    const hrefAttr = element.getAttribute('href');
    selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
  }

  try {
    return document.querySelector(selector) ? selector : null;
  } catch (error) {
    return null;
  }
};

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  } // Get transition-duration of the element


  let _window$getComputedSt = window.getComputedStyle(element),
      transitionDuration = _window$getComputedSt.transitionDuration,
      transitionDelay = _window$getComputedSt.transitionDelay;

  const floatTransitionDuration = parseFloat(transitionDuration);
  const floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  } // If multiple durations are defined, take the first


  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
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
      throw new Error(`${componentName.toUpperCase()}: ` + `Option "${property}" provided type "${valueType}" ` + `but expected type "${expectedTypes}".`);
    }
  });
};

const makeArray = nodeList => {
  if (!nodeList) {
    return [];
  }

  return [].slice.call(nodeList);
};

const isVisible = element => {
  if (!element) {
    return false;
  }

  if (element.style && element.parentNode && element.parentNode.style) {
    return element.style.display !== 'none' && element.parentNode.style.display !== 'none' && element.style.visibility !== 'hidden';
  }

  return false;
};

const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  } // Can find the shadow root otherwise it'll return the document


  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }

  if (element instanceof ShadowRoot) {
    return element;
  } // when we don't find a shadow root


  if (!element.parentNode) {
    return null;
  }

  return findShadowRoot(element.parentNode);
}; // eslint-disable-next-line no-empty-function


const noop = () => function () {};

const reflow = element => element.offsetHeight;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const mapData = (() => {
  const storeData = {};
  let id = 1;
  return {
    set(element, key, data) {
      if (typeof element.key === 'undefined') {
        element.key = {
          key,
          id
        };
        id++;
      }

      storeData[element.key.id] = data;
    },

    get(element, key) {
      if (!element || typeof element.key === 'undefined') {
        return null;
      }

      const keyProperties = element.key;

      if (keyProperties.key === key) {
        return storeData[keyProperties.id];
      }

      return null;
    },

    delete(element, key) {
      if (typeof element.key === 'undefined') {
        return;
      }

      const keyProperties = element.key;

      if (keyProperties.key === key) {
        delete storeData[keyProperties.id];
        delete element.key;
      }
    }

  };
})();

const Data = {
  setData(instance, key, data) {
    mapData.set(instance, key, data);
  },

  getData(instance, key) {
    return mapData.get(instance, key);
  },

  removeData(instance, key) {
    mapData.delete(instance, key);
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/polyfill.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/* istanbul ignore next */

const Polyfill = (() => {
  // MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached
  const defaultPreventedPreservedOnDispatch = (() => {
    const e = new CustomEvent('Bootstrap', {
      cancelable: true
    });
    const element = document.createElement('div');
    element.addEventListener('Bootstrap', () => null);
    e.preventDefault();
    element.dispatchEvent(e);
    return e.defaultPrevented;
  })();

  let find = Element.prototype.querySelectorAll;
  let findOne = Element.prototype.querySelector;
  const scopeSelectorRegex = /:scope\b/;

  const supportScopeQuery = (() => {
    const element = document.createElement('div');

    try {
      element.querySelectorAll(':scope *');
    } catch (error) {
      return false;
    }

    return true;
  })();

  if (!supportScopeQuery) {
    find = function find(selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelectorAll(selector);
      }

      const hasId = Boolean(this.id);

      if (!hasId) {
        this.id = getUID('scope');
      }

      let nodeList = null;

      try {
        selector = selector.replace(scopeSelectorRegex, `#${this.id}`);
        nodeList = this.querySelectorAll(selector);
      } finally {
        if (!hasId) {
          this.removeAttribute('id');
        }
      }

      return nodeList;
    };

    findOne = function findOne(selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelector(selector);
      }

      const matches = find.call(this, selector);

      if (typeof matches[0] !== 'undefined') {
        return matches[0];
      }

      return null;
    };
  }

  return {
    defaultPreventedPreservedOnDispatch,
    find,
    findOne
  };
})();

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/eventHandler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const keyEventRegex = /^key/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage

let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = ['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll'];
/**
 * ------------------------------------------------------------------------
 * Private methods
 * ------------------------------------------------------------------------
 */

function getUidEvent(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}

function getEvent(element) {
  const uid = getUidEvent(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function fixEvent(event, element) {
  // Add which for key events
  if (event.which === null && keyEventRegex.test(event.type)) {
    event.which = event.charCode === null ? event.keyCode : event.charCode;
  }

  event.delegateTarget = element;
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    fixEvent(event, element);

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (let target = event.target; target && target !== this; target = target.parentNode) {
      for (let i = domElements.length; i--;) {
        if (domElements[i] === target) {
          fixEvent(event, target);

          if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
          }

          return fn.apply(target, [event]);
        }
      }
    } // To please ESLint


    return null;
  };
}

function findHandler(events, handler, delegationSelector) {
  if (delegationSelector === void 0) {
    delegationSelector = null;
  }

  const uidList = Object.keys(events);

  for (let i = 0; i < uidList.length; i++) {
    const uid = uidList[i];
    const event = events[uid];

    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
      return events[uid];
    }
  }

  return null;
}

function normalizeParams(originalTypeEvent, handler, delegationFn) {
  const delegation = typeof handler === 'string';
  const originalHandler = delegation ? delegationFn : handler; // allow to get the native events from namespaced events ('click.bs.button' --> 'click')

  let typeEvent = originalTypeEvent.replace(stripNameRegex, '');
  const custom = customEvents[typeEvent];

  if (custom) {
    typeEvent = custom;
  }

  const isNative = nativeEvents.indexOf(typeEvent) > -1;

  if (!isNative) {
    typeEvent = originalTypeEvent;
  }

  return [delegation, originalHandler, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  if (!handler) {
    handler = delegationFn;
    delegationFn = null;
  }

  const _normalizeParams = normalizeParams(originalTypeEvent, handler, delegationFn),
        delegation = _normalizeParams[0],
        originalHandler = _normalizeParams[1],
        typeEvent = _normalizeParams[2];

  const events = getEvent(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

  if (previousFn) {
    previousFn.oneOff = previousFn.oneOff && oneOff;
    return;
  }

  const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
  fn.delegationSelector = delegation ? handler : null;
  fn.originalHandler = originalHandler;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, delegation);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (fn === null) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  Object.keys(storeElementEvent).forEach(handlerKey => {
    if (handlerKey.indexOf(namespace) > -1) {
      const event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    }
  });
}

const EventHandler = {
  on(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, false);
  },

  one(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, true);
  },

  off(element, originalTypeEvent, handler, delegationFn) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    const _normalizeParams2 = normalizeParams(originalTypeEvent, handler, delegationFn),
          delegation = _normalizeParams2[0],
          originalHandler = _normalizeParams2[1],
          typeEvent = _normalizeParams2[2];

    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getEvent(element);
    const isNamespace = originalTypeEvent.charAt(0) === '.';

    if (typeof originalHandler !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!events || !events[typeEvent]) {
        return;
      }

      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
      return;
    }

    if (isNamespace) {
      Object.keys(events).forEach(elementEvent => {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.substr(1));
      });
    }

    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(keyHandlers => {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');

      if (!inNamespace || originalTypeEvent.indexOf(handlerKey) > -1) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }

    const typeEvent = event.replace(stripNameRegex, '');
    const inNamespace = event !== typeEvent;
    const isNative = nativeEvents.indexOf(typeEvent) > -1;
    let jQueryEvent;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    let evt = null;

    if (inNamespace && typeof jQuery !== 'undefined') {
      jQueryEvent = jQuery.Event(event, args);
      jQuery(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    if (isNative) {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent(typeEvent, bubbles, true);
    } else {
      evt = new CustomEvent(event, {
        bubbles,
        cancelable: true
      });
    } // merge custom informations in our event


    if (typeof args !== 'undefined') {
      Object.keys(args).forEach(key => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key];
          }

        });
      });
    }

    if (defaultPrevented) {
      evt.preventDefault();

      if (!Polyfill.defaultPreventedPreservedOnDispatch) {
        Object.defineProperty(evt, 'defaultPrevented', {
          get: () => true
        });
      }
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
      jQueryEvent.preventDefault();
    }

    return evt;
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/selectorEngine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const findFn = Polyfill.find,
      findOne = Polyfill.findOne;
const NODE_TEXT = 3;
const SelectorEngine = {
  matches(element, selector) {
    return element.matches(selector);
  },

  find(selector, element) {
    if (element === void 0) {
      element = document.documentElement;
    }

    if (typeof selector !== 'string') {
      return null;
    }

    return findFn.call(element, selector);
  },

  findOne(selector, element) {
    if (element === void 0) {
      element = document.documentElement;
    }

    if (typeof selector !== 'string') {
      return null;
    }

    return findOne.call(element, selector);
  },

  children(element, selector) {
    if (typeof selector !== 'string') {
      return null;
    }

    const children = makeArray(element.children);
    return children.filter(child => this.matches(child, selector));
  },

  parents(element, selector) {
    if (typeof selector !== 'string') {
      return null;
    }

    const parents = [];
    let ancestor = element.parentNode;

    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
      if (this.matches(ancestor, selector)) {
        parents.push(ancestor);
      }

      ancestor = ancestor.parentNode;
    }

    return parents;
  },

  closest(element, selector) {
    if (typeof selector !== 'string') {
      return null;
    }

    return element.closest(selector);
  },

  prev(element, selector) {
    if (typeof selector !== 'string') {
      return null;
    }

    const siblings = [];
    let previous = element.previousSibling;

    while (previous && previous.nodeType === Node.ELEMENT_NODE && previous.nodeType !== NODE_TEXT) {
      if (this.matches(previous, selector)) {
        siblings.push(previous);
      }

      previous = previous.previousSibling;
    }

    return siblings;
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'alert';
const VERSION = '4.3.1';
const DATA_KEY = 'bs.alert';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const Selector = {
  DISMISS: '[data-dismiss="alert"]'
};
const Event$1 = {
  CLOSE: `close${EVENT_KEY}`,
  CLOSED: `closed${EVENT_KEY}`,
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
};
const ClassName = {
  ALERT: 'alert',
  FADE: 'fade',
  SHOW: 'show'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Alert {
  constructor(element) {
    this._element = element;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }
  } // Getters


  static get VERSION() {
    return VERSION;
  } // Public


  close(element) {
    let rootElement = this._element;

    if (element) {
      rootElement = this._getRootElement(element);
    }

    const customEvent = this._triggerCloseEvent(rootElement);

    if (customEvent === null || customEvent.defaultPrevented) {
      return;
    }

    this._removeElement(rootElement);
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY);
    this._element = null;
  } // Private


  _getRootElement(element) {
    const selector = getSelectorFromElement(element);
    let parent = false;

    if (selector) {
      parent = SelectorEngine.findOne(selector);
    }

    if (!parent) {
      parent = SelectorEngine.closest(element, `.${ClassName.ALERT}`);
    }

    return parent;
  }

  _triggerCloseEvent(element) {
    return EventHandler.trigger(element, Event$1.CLOSE);
  }

  _removeElement(element) {
    element.classList.remove(ClassName.SHOW);

    if (!element.classList.contains(ClassName.FADE)) {
      this._destroyElement(element);

      return;
    }

    const transitionDuration = getTransitionDurationFromElement(element);
    EventHandler.one(element, TRANSITION_END, event => this._destroyElement(element, event));
    emulateTransitionEnd(element, transitionDuration);
  }

  _destroyElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }

    EventHandler.trigger(element, Event$1.CLOSED);
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);

      if (!data) {
        data = new Alert(this);
      }

      if (config === 'close') {
        data[config](this);
      }
    });
  }

  static _handleDismiss(alertInstance) {
    return function (event) {
      if (event) {
        event.preventDefault();
      }

      alertInstance.close(this);
    };
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$1.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .alert to jQuery only if jQuery is present
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME];
  jQuery.fn[NAME] = Alert._jQueryInterface;
  jQuery.fn[NAME].Constructor = Alert;

  jQuery.fn[NAME].noConflict = () => {
    jQuery.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$1 = 'button';
const VERSION$1 = '4.3.1';
const DATA_KEY$1 = 'bs.button';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const DATA_API_KEY$1 = '.data-api';
const ClassName$1 = {
  ACTIVE: 'active',
  BUTTON: 'btn',
  FOCUS: 'focus'
};
const Selector$1 = {
  DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
  DATA_TOGGLE: '[data-toggle="buttons"]',
  INPUT: 'input:not([type="hidden"])',
  ACTIVE: '.active',
  BUTTON: '.btn'
};
const Event$2 = {
  CLICK_DATA_API: `click${EVENT_KEY$1}${DATA_API_KEY$1}`,
  FOCUS_DATA_API: `focus${EVENT_KEY$1}${DATA_API_KEY$1}`,
  BLUR_DATA_API: `blur${EVENT_KEY$1}${DATA_API_KEY$1}`
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Button {
  constructor(element) {
    this._element = element;
    Data.setData(element, DATA_KEY$1, this);
  } // Getters


  static get VERSION() {
    return VERSION$1;
  } // Public


  toggle() {
    let triggerChangeEvent = true;
    let addAriaPressed = true;
    const rootElement = SelectorEngine.closest(this._element, Selector$1.DATA_TOGGLE);

    if (rootElement) {
      const input = SelectorEngine.findOne(Selector$1.INPUT, this._element);

      if (input) {
        if (input.type === 'radio') {
          if (input.checked && this._element.classList.contains(ClassName$1.ACTIVE)) {
            triggerChangeEvent = false;
          } else {
            const activeElement = SelectorEngine.findOne(Selector$1.ACTIVE, rootElement);

            if (activeElement) {
              activeElement.classList.remove(ClassName$1.ACTIVE);
            }
          }
        }

        if (triggerChangeEvent) {
          if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
            return;
          }

          input.checked = !this._element.classList.contains(ClassName$1.ACTIVE);
          EventHandler.trigger(input, 'change');
        }

        input.focus();
        addAriaPressed = false;
      }
    }

    if (addAriaPressed) {
      this._element.setAttribute('aria-pressed', !this._element.classList.contains(ClassName$1.ACTIVE));
    }

    if (triggerChangeEvent) {
      this._element.classList.toggle(ClassName$1.ACTIVE);
    }
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY$1);
    this._element = null;
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY$1);

      if (!data) {
        data = new Button(this);
      }

      if (config === 'toggle') {
        data[config]();
      }
    });
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$1);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$2.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, event => {
  event.preventDefault();
  let button = event.target;

  if (!button.classList.contains(ClassName$1.BUTTON)) {
    button = SelectorEngine.closest(button, Selector$1.BUTTON);
  }

  let data = Data.getData(button, DATA_KEY$1);

  if (!data) {
    data = new Button(button);
    Data.setData(button, DATA_KEY$1, data);
  }

  data.toggle();
});
EventHandler.on(document, Event$2.FOCUS_DATA_API, Selector$1.DATA_TOGGLE_CARROT, event => {
  const button = SelectorEngine.closest(event.target, Selector$1.BUTTON);
  button.classList.add(ClassName$1.FOCUS);
});
EventHandler.on(document, Event$2.BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, event => {
  const button = SelectorEngine.closest(event.target, Selector$1.BUTTON);
  button.classList.remove(ClassName$1.FOCUS);
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .button to jQuery only if jQuery is present
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$1];
  jQuery.fn[NAME$1] = Button._jQueryInterface;
  jQuery.fn[NAME$1].Constructor = Button;

  jQuery.fn[NAME$1].noConflict = () => {
    jQuery.fn[NAME$1] = JQUERY_NO_CONFLICT;
    return Button._jQueryInterface;
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
function normalizeData(val) {
  if (val === 'true') {
    return true;
  }

  if (val === 'false') {
    return false;
  }

  if (val === Number(val).toString()) {
    return Number(val);
  }

  if (val === '' || val === 'null') {
    return null;
  }

  return val;
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => chr.toLowerCase());
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = _extends({}, element.dataset);

    Object.keys(attributes).forEach(key => {
      attributes[key] = normalizeData(attributes[key]);
    });
    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-${normalizeDataKey(key)}`));
  },

  offset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  },

  toggleClass(element, className) {
    if (!element) {
      return;
    }

    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }

};

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$2 = 'carousel';
const VERSION$2 = '4.3.1';
const DATA_KEY$2 = 'bs.carousel';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY$2 = '.data-api';
const ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

const ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const SWIPE_THRESHOLD = 40;
const Default = {
  interval: 5000,
  keyboard: true,
  slide: false,
  pause: 'hover',
  wrap: true,
  touch: true
};
const DefaultType = {
  interval: '(number|boolean)',
  keyboard: 'boolean',
  slide: '(boolean|string)',
  pause: '(string|boolean)',
  wrap: 'boolean',
  touch: 'boolean'
};
const Direction = {
  NEXT: 'next',
  PREV: 'prev',
  LEFT: 'left',
  RIGHT: 'right'
};
const Event$3 = {
  SLIDE: `slide${EVENT_KEY$2}`,
  SLID: `slid${EVENT_KEY$2}`,
  KEYDOWN: `keydown${EVENT_KEY$2}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$2}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$2}`,
  TOUCHSTART: `touchstart${EVENT_KEY$2}`,
  TOUCHMOVE: `touchmove${EVENT_KEY$2}`,
  TOUCHEND: `touchend${EVENT_KEY$2}`,
  POINTERDOWN: `pointerdown${EVENT_KEY$2}`,
  POINTERUP: `pointerup${EVENT_KEY$2}`,
  DRAG_START: `dragstart${EVENT_KEY$2}`,
  LOAD_DATA_API: `load${EVENT_KEY$2}${DATA_API_KEY$2}`,
  CLICK_DATA_API: `click${EVENT_KEY$2}${DATA_API_KEY$2}`
};
const ClassName$2 = {
  CAROUSEL: 'carousel',
  ACTIVE: 'active',
  SLIDE: 'slide',
  RIGHT: 'carousel-item-right',
  LEFT: 'carousel-item-left',
  NEXT: 'carousel-item-next',
  PREV: 'carousel-item-prev',
  ITEM: 'carousel-item',
  POINTER_EVENT: 'pointer-event'
};
const Selector$2 = {
  ACTIVE: '.active',
  ACTIVE_ITEM: '.active.carousel-item',
  ITEM: '.carousel-item',
  ITEM_IMG: '.carousel-item img',
  NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
  INDICATORS: '.carousel-indicators',
  DATA_SLIDE: '[data-slide], [data-slide-to]',
  DATA_RIDE: '[data-ride="carousel"]'
};
const PointerType = {
  TOUCH: 'touch',
  PEN: 'pen'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Carousel {
  constructor(element, config) {
    this._items = null;
    this._interval = null;
    this._activeElement = null;
    this._isPaused = false;
    this._isSliding = false;
    this.touchTimeout = null;
    this.touchStartX = 0;
    this.touchDeltaX = 0;
    this._config = this._getConfig(config);
    this._element = element;
    this._indicatorsElement = SelectorEngine.findOne(Selector$2.INDICATORS, this._element);
    this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

    this._addEventListeners();

    Data.setData(element, DATA_KEY$2, this);
  } // Getters


  static get VERSION() {
    return VERSION$2;
  }

  static get Default() {
    return Default;
  } // Public


  next() {
    if (!this._isSliding) {
      this._slide(Direction.NEXT);
    }
  }

  nextWhenVisible() {
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }

  prev() {
    if (!this._isSliding) {
      this._slide(Direction.PREV);
    }
  }

  pause(event) {
    if (!event) {
      this._isPaused = true;
    }

    if (SelectorEngine.findOne(Selector$2.NEXT_PREV, this._element)) {
      triggerTransitionEnd(this._element);
      this.cycle(true);
    }

    clearInterval(this._interval);
    this._interval = null;
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false;
    }

    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }

    if (this._config && this._config.interval && !this._isPaused) {
      this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
    }
  }

  to(index) {
    this._activeElement = SelectorEngine.findOne(Selector$2.ACTIVE_ITEM, this._element);

    const activeIndex = this._getItemIndex(this._activeElement);

    if (index > this._items.length - 1 || index < 0) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, Event$3.SLID, () => this.to(index));
      return;
    }

    if (activeIndex === index) {
      this.pause();
      this.cycle();
      return;
    }

    const direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

    this._slide(direction, this._items[index]);
  }

  dispose() {
    EventHandler.off(this._element, EVENT_KEY$2);
    Data.removeData(this._element, DATA_KEY$2);
    this._items = null;
    this._config = null;
    this._element = null;
    this._interval = null;
    this._isPaused = null;
    this._isSliding = null;
    this._activeElement = null;
    this._indicatorsElement = null;
  } // Private


  _getConfig(config) {
    config = _extends({}, Default, config);
    typeCheckConfig(NAME$2, config, DefaultType);
    return config;
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX);

    if (absDeltax <= SWIPE_THRESHOLD) {
      return;
    }

    const direction = absDeltax / this.touchDeltaX; // swipe left

    if (direction > 0) {
      this.prev();
    } // swipe right


    if (direction < 0) {
      this.next();
    }
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, Event$3.KEYDOWN, event => this._keydown(event));
    }

    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, Event$3.MOUSEENTER, event => this.pause(event));
      EventHandler.on(this._element, Event$3.MOUSELEAVE, event => this.cycle(event));
    }

    if (this._config.touch) {
      this._addTouchEventListeners();
    }
  }

  _addTouchEventListeners() {
    if (!this._touchSupported) {
      return;
    }

    const start = event => {
      if (this._pointerEvent && PointerType[event.pointerType.toUpperCase()]) {
        this.touchStartX = event.clientX;
      } else if (!this._pointerEvent) {
        this.touchStartX = event.touches[0].clientX;
      }
    };

    const move = event => {
      // ensure swiping with one touch and not pinching
      if (event.touches && event.touches.length > 1) {
        this.touchDeltaX = 0;
      } else {
        this.touchDeltaX = event.touches[0].clientX - this.touchStartX;
      }
    };

    const end = event => {
      if (this._pointerEvent && PointerType[event.pointerType.toUpperCase()]) {
        this.touchDeltaX = event.clientX - this.touchStartX;
      }

      this._handleSwipe();

      if (this._config.pause === 'hover') {
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

        this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      }
    };

    makeArray(SelectorEngine.find(Selector$2.ITEM_IMG, this._element)).forEach(itemImg => {
      EventHandler.on(itemImg, Event$3.DRAG_START, e => e.preventDefault());
    });

    if (this._pointerEvent) {
      EventHandler.on(this._element, Event$3.POINTERDOWN, event => start(event));
      EventHandler.on(this._element, Event$3.POINTERUP, event => end(event));

      this._element.classList.add(ClassName$2.POINTER_EVENT);
    } else {
      EventHandler.on(this._element, Event$3.TOUCHSTART, event => start(event));
      EventHandler.on(this._element, Event$3.TOUCHMOVE, event => move(event));
      EventHandler.on(this._element, Event$3.TOUCHEND, event => end(event));
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }

    switch (event.which) {
      case ARROW_LEFT_KEYCODE:
        event.preventDefault();
        this.prev();
        break;

      case ARROW_RIGHT_KEYCODE:
        event.preventDefault();
        this.next();
        break;

      default:
    }
  }

  _getItemIndex(element) {
    this._items = element && element.parentNode ? makeArray(SelectorEngine.find(Selector$2.ITEM, element.parentNode)) : [];
    return this._items.indexOf(element);
  }

  _getItemByDirection(direction, activeElement) {
    const isNextDirection = direction === Direction.NEXT;
    const isPrevDirection = direction === Direction.PREV;

    const activeIndex = this._getItemIndex(activeElement);

    const lastItemIndex = this._items.length - 1;
    const isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

    if (isGoingToWrap && !this._config.wrap) {
      return activeElement;
    }

    const delta = direction === Direction.PREV ? -1 : 1;
    const itemIndex = (activeIndex + delta) % this._items.length;
    return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget);

    const fromIndex = this._getItemIndex(SelectorEngine.findOne(Selector$2.ACTIVE_ITEM, this._element));

    return EventHandler.trigger(this._element, Event$3.SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    });
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const indicators = SelectorEngine.find(Selector$2.ACTIVE, this._indicatorsElement);

      for (let i = 0; i < indicators.length; i++) {
        indicators[i].classList.remove(ClassName$2.ACTIVE);
      }

      const nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

      if (nextIndicator) {
        nextIndicator.classList.add(ClassName$2.ACTIVE);
      }
    }
  }

  _slide(direction, element) {
    const activeElement = SelectorEngine.findOne(Selector$2.ACTIVE_ITEM, this._element);

    const activeElementIndex = this._getItemIndex(activeElement);

    const nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

    const nextElementIndex = this._getItemIndex(nextElement);

    const isCycling = Boolean(this._interval);
    let directionalClassName;
    let orderClassName;
    let eventDirectionName;

    if (direction === Direction.NEXT) {
      directionalClassName = ClassName$2.LEFT;
      orderClassName = ClassName$2.NEXT;
      eventDirectionName = Direction.LEFT;
    } else {
      directionalClassName = ClassName$2.RIGHT;
      orderClassName = ClassName$2.PREV;
      eventDirectionName = Direction.RIGHT;
    }

    if (nextElement && nextElement.classList.contains(ClassName$2.ACTIVE)) {
      this._isSliding = false;
      return;
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

    if (slideEvent.defaultPrevented) {
      return;
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return;
    }

    this._isSliding = true;

    if (isCycling) {
      this.pause();
    }

    this._setActiveIndicatorElement(nextElement);

    if (this._element.classList.contains(ClassName$2.SLIDE)) {
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);
      const nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

      if (nextElementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = nextElementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }

      const transitionDuration = getTransitionDurationFromElement(activeElement);
      EventHandler.one(activeElement, TRANSITION_END, () => {
        nextElement.classList.remove(directionalClassName);
        nextElement.classList.remove(orderClassName);
        nextElement.classList.add(ClassName$2.ACTIVE);
        activeElement.classList.remove(ClassName$2.ACTIVE);
        activeElement.classList.remove(orderClassName);
        activeElement.classList.remove(directionalClassName);
        this._isSliding = false;
        setTimeout(() => {
          EventHandler.trigger(this._element, Event$3.SLID, {
            relatedTarget: nextElement,
            direction: eventDirectionName,
            from: activeElementIndex,
            to: nextElementIndex
          });
        }, 0);
      });
      emulateTransitionEnd(activeElement, transitionDuration);
    } else {
      activeElement.classList.remove(ClassName$2.ACTIVE);
      nextElement.classList.add(ClassName$2.ACTIVE);
      this._isSliding = false;
      EventHandler.trigger(this._element, Event$3.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });
    }

    if (isCycling) {
      this.cycle();
    }
  } // Static


  static _carouselInterface(element, config) {
    let data = Data.getData(element, DATA_KEY$2);

    let _config = _extends({}, Default, Manipulator.getDataAttributes(element));

    if (typeof config === 'object') {
      _config = _extends({}, _config, config);
    }

    const action = typeof config === 'string' ? config : _config.slide;

    if (!data) {
      data = new Carousel(element, _config);
    }

    if (typeof config === 'number') {
      data.to(config);
    } else if (typeof action === 'string') {
      if (typeof data[action] === 'undefined') {
        throw new TypeError(`No method named "${action}"`);
      }

      data[action]();
    } else if (_config.interval && _config.ride) {
      data.pause();
      data.cycle();
    }
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      Carousel._carouselInterface(this, config);
    });
  }

  static _dataApiClickHandler(event) {
    const selector = getSelectorFromElement(this);

    if (!selector) {
      return;
    }

    const target = SelectorEngine.findOne(selector);

    if (!target || !target.classList.contains(ClassName$2.CAROUSEL)) {
      return;
    }

    const config = _extends({}, Manipulator.getDataAttributes(target), Manipulator.getDataAttributes(this));

    const slideIndex = this.getAttribute('data-slide-to');

    if (slideIndex) {
      config.interval = false;
    }

    Carousel._carouselInterface(target, config);

    if (slideIndex) {
      Data.getData(target, DATA_KEY$2).to(slideIndex);
    }

    event.preventDefault();
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$2);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$3.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);
EventHandler.on(window, Event$3.LOAD_DATA_API, () => {
  const carousels = makeArray(SelectorEngine.find(Selector$2.DATA_RIDE));

  for (let i = 0, len = carousels.length; i < len; i++) {
    Carousel._carouselInterface(carousels[i], Data.getData(carousels[i], DATA_KEY$2));
  }
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .carousel to jQuery only if jQuery is present
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$2];
  jQuery.fn[NAME$2] = Carousel._jQueryInterface;
  jQuery.fn[NAME$2].Constructor = Carousel;

  jQuery.fn[NAME$2].noConflict = () => {
    jQuery.fn[NAME$2] = JQUERY_NO_CONFLICT;
    return Carousel._jQueryInterface;
  };
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$3 = 'collapse';
const VERSION$3 = '4.3.1';
const DATA_KEY$3 = 'bs.collapse';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const DATA_API_KEY$3 = '.data-api';
const Default$1 = {
  toggle: true,
  parent: ''
};
const DefaultType$1 = {
  toggle: 'boolean',
  parent: '(string|element)'
};
const Event$4 = {
  SHOW: `show${EVENT_KEY$3}`,
  SHOWN: `shown${EVENT_KEY$3}`,
  HIDE: `hide${EVENT_KEY$3}`,
  HIDDEN: `hidden${EVENT_KEY$3}`,
  CLICK_DATA_API: `click${EVENT_KEY$3}${DATA_API_KEY$3}`
};
const ClassName$3 = {
  SHOW: 'show',
  COLLAPSE: 'collapse',
  COLLAPSING: 'collapsing',
  COLLAPSED: 'collapsed'
};
const Dimension = {
  WIDTH: 'width',
  HEIGHT: 'height'
};
const Selector$3 = {
  ACTIVES: '.show, .collapsing',
  DATA_TOGGLE: '[data-toggle="collapse"]'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Collapse {
  constructor(element, config) {
    this._isTransitioning = false;
    this._element = element;
    this._config = this._getConfig(config);
    this._triggerArray = makeArray(SelectorEngine.find(`[data-toggle="collapse"][href="#${element.id}"],` + `[data-toggle="collapse"][data-target="#${element.id}"]`));
    const toggleList = makeArray(SelectorEngine.find(Selector$3.DATA_TOGGLE));

    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i];
      const selector = getSelectorFromElement(elem);
      const filterElement = makeArray(SelectorEngine.find(selector)).filter(foundElem => foundElem === element);

      if (selector !== null && filterElement.length) {
        this._selector = selector;

        this._triggerArray.push(elem);
      }
    }

    this._parent = this._config.parent ? this._getParent() : null;

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._element, this._triggerArray);
    }

    if (this._config.toggle) {
      this.toggle();
    }

    Data.setData(element, DATA_KEY$3, this);
  } // Getters


  static get VERSION() {
    return VERSION$3;
  }

  static get Default() {
    return Default$1;
  } // Public


  toggle() {
    if (this._element.classList.contains(ClassName$3.SHOW)) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._element.classList.contains(ClassName$3.SHOW)) {
      return;
    }

    let actives;
    let activesData;

    if (this._parent) {
      actives = makeArray(SelectorEngine.find(Selector$3.ACTIVES, this._parent)).filter(elem => {
        if (typeof this._config.parent === 'string') {
          return elem.getAttribute('data-parent') === this._config.parent;
        }

        return elem.classList.contains(ClassName$3.COLLAPSE);
      });

      if (actives.length === 0) {
        actives = null;
      }
    }

    const container = SelectorEngine.findOne(this._selector);

    if (actives) {
      const tempActiveData = actives.filter(elem => container !== elem);
      activesData = tempActiveData[0] ? Data.getData(tempActiveData[0], DATA_KEY$3) : null;

      if (activesData && activesData._isTransitioning) {
        return;
      }
    }

    const startEvent = EventHandler.trigger(this._element, Event$4.SHOW);

    if (startEvent.defaultPrevented) {
      return;
    }

    if (actives) {
      actives.forEach(elemActive => {
        if (container !== elemActive) {
          Collapse._collapseInterface(elemActive, 'hide');
        }

        if (!activesData) {
          Data.setData(elemActive, DATA_KEY$3, null);
        }
      });
    }

    const dimension = this._getDimension();

    this._element.classList.remove(ClassName$3.COLLAPSE);

    this._element.classList.add(ClassName$3.COLLAPSING);

    this._element.style[dimension] = 0;

    if (this._triggerArray.length) {
      this._triggerArray.forEach(element => {
        element.classList.remove(ClassName$3.COLLAPSED);
        element.setAttribute('aria-expanded', true);
      });
    }

    this.setTransitioning(true);

    const complete = () => {
      this._element.classList.remove(ClassName$3.COLLAPSING);

      this._element.classList.add(ClassName$3.COLLAPSE);

      this._element.classList.add(ClassName$3.SHOW);

      this._element.style[dimension] = '';
      this.setTransitioning(false);
      EventHandler.trigger(this._element, Event$4.SHOWN);
    };

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    const transitionDuration = getTransitionDurationFromElement(this._element);
    EventHandler.one(this._element, TRANSITION_END, complete);
    emulateTransitionEnd(this._element, transitionDuration);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }

  hide() {
    if (this._isTransitioning || !this._element.classList.contains(ClassName$3.SHOW)) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, Event$4.HIDE);

    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);

    this._element.classList.add(ClassName$3.COLLAPSING);

    this._element.classList.remove(ClassName$3.COLLAPSE);

    this._element.classList.remove(ClassName$3.SHOW);

    const triggerArrayLength = this._triggerArray.length;

    if (triggerArrayLength > 0) {
      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i];
        const selector = getSelectorFromElement(trigger);

        if (selector !== null) {
          const elem = SelectorEngine.findOne(selector);

          if (!elem.classList.contains(ClassName$3.SHOW)) {
            trigger.classList.add(ClassName$3.COLLAPSED);
            trigger.setAttribute('aria-expanded', false);
          }
        }
      }
    }

    this.setTransitioning(true);

    const complete = () => {
      this.setTransitioning(false);

      this._element.classList.remove(ClassName$3.COLLAPSING);

      this._element.classList.add(ClassName$3.COLLAPSE);

      EventHandler.trigger(this._element, Event$4.HIDDEN);
    };

    this._element.style[dimension] = '';
    const transitionDuration = getTransitionDurationFromElement(this._element);
    EventHandler.one(this._element, TRANSITION_END, complete);
    emulateTransitionEnd(this._element, transitionDuration);
  }

  setTransitioning(isTransitioning) {
    this._isTransitioning = isTransitioning;
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY$3);
    this._config = null;
    this._parent = null;
    this._element = null;
    this._triggerArray = null;
    this._isTransitioning = null;
  } // Private


  _getConfig(config) {
    config = _extends({}, Default$1, config);
    config.toggle = Boolean(config.toggle); // Coerce string values

    typeCheckConfig(NAME$3, config, DefaultType$1);
    return config;
  }

  _getDimension() {
    const hasWidth = this._element.classList.contains(Dimension.WIDTH);

    return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
  }

  _getParent() {
    let parent = this._config.parent;

    if (isElement(parent)) {
      // it's a jQuery object
      if (typeof parent.jquery !== 'undefined' || typeof parent[0] !== 'undefined') {
        parent = parent[0];
      }
    } else {
      parent = SelectorEngine.findOne(parent);
    }

    const selector = `[data-toggle="collapse"][data-parent="${parent}"]`;
    makeArray(SelectorEngine.find(selector, parent)).forEach(element => {
      this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
    });
    return parent;
  }

  _addAriaAndCollapsedClass(element, triggerArray) {
    if (element) {
      const isOpen = element.classList.contains(ClassName$3.SHOW);

      if (triggerArray.length) {
        triggerArray.forEach(elem => {
          if (isOpen) {
            elem.classList.remove(ClassName$3.COLLAPSED);
          } else {
            elem.classList.add(ClassName$3.COLLAPSED);
          }

          elem.setAttribute('aria-expanded', isOpen);
        });
      }
    }
  } // Static


  static _getTargetFromElement(element) {
    const selector = getSelectorFromElement(element);
    return selector ? SelectorEngine.findOne(selector) : null;
  }

  static _collapseInterface(element, config) {
    let data = Data.getData(element, DATA_KEY$3);

    const _config = _extends({}, Default$1, Manipulator.getDataAttributes(element), typeof config === 'object' && config ? config : {});

    if (!data && _config.toggle && /show|hide/.test(config)) {
      _config.toggle = false;
    }

    if (!data) {
      data = new Collapse(element, _config);
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    }
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      Collapse._collapseInterface(this, config);
    });
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$3);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$4.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A') {
    event.preventDefault();
  }

  const triggerData = Manipulator.getDataAttributes(this);
  const selector = getSelectorFromElement(this);
  const selectorElements = makeArray(SelectorEngine.find(selector));
  selectorElements.forEach(element => {
    const data = Data.getData(element, DATA_KEY$3);
    let config;

    if (data) {
      // update parent attribute
      if (data._parent === null && typeof triggerData.parent === 'string') {
        data._config.parent = triggerData.parent;
        data._parent = data._getParent();
      }

      config = 'toggle';
    } else {
      config = triggerData;
    }

    Collapse._collapseInterface(element, config);
  });
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .collapse to jQuery only if jQuery is present
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$3];
  jQuery.fn[NAME$3] = Collapse._jQueryInterface;
  jQuery.fn[NAME$3].Constructor = Collapse;

  jQuery.fn[NAME$3].noConflict = () => {
    jQuery.fn[NAME$3] = JQUERY_NO_CONFLICT;
    return Collapse._jQueryInterface;
  };
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$4 = 'dropdown';
const VERSION$4 = '4.3.1';
const DATA_KEY$4 = 'bs.dropdown';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$4 = '.data-api';
const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

const SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

const TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

const RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`);
const Event$5 = {
  HIDE: `hide${EVENT_KEY$4}`,
  HIDDEN: `hidden${EVENT_KEY$4}`,
  SHOW: `show${EVENT_KEY$4}`,
  SHOWN: `shown${EVENT_KEY$4}`,
  CLICK: `click${EVENT_KEY$4}`,
  CLICK_DATA_API: `click${EVENT_KEY$4}${DATA_API_KEY$4}`,
  KEYDOWN_DATA_API: `keydown${EVENT_KEY$4}${DATA_API_KEY$4}`,
  KEYUP_DATA_API: `keyup${EVENT_KEY$4}${DATA_API_KEY$4}`
};
const ClassName$4 = {
  DISABLED: 'disabled',
  SHOW: 'show',
  DROPUP: 'dropup',
  DROPRIGHT: 'dropright',
  DROPLEFT: 'dropleft',
  MENURIGHT: 'dropdown-menu-right',
  POSITION_STATIC: 'position-static'
};
const Selector$4 = {
  DATA_TOGGLE: '[data-toggle="dropdown"]',
  FORM_CHILD: '.dropdown form',
  MENU: '.dropdown-menu',
  NAVBAR_NAV: '.navbar-nav',
  VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
};
const AttachmentMap = {
  TOP: 'top-start',
  TOPEND: 'top-end',
  BOTTOM: 'bottom-start',
  BOTTOMEND: 'bottom-end',
  RIGHT: 'right-start',
  RIGHTEND: 'right-end',
  LEFT: 'left-start',
  LEFTEND: 'left-end'
};
const Default$2 = {
  offset: 0,
  flip: true,
  boundary: 'scrollParent',
  reference: 'toggle',
  display: 'dynamic'
};
const DefaultType$2 = {
  offset: '(number|string|function)',
  flip: 'boolean',
  boundary: '(string|element)',
  reference: '(string|element)',
  display: 'string'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Dropdown {
  constructor(element, config) {
    this._element = element;
    this._popper = null;
    this._config = this._getConfig(config);
    this._menu = this._getMenuElement();
    this._inNavbar = this._detectNavbar();

    this._addEventListeners();

    Data.setData(element, DATA_KEY$4, this);
  } // Getters


  static get VERSION() {
    return VERSION$4;
  }

  static get Default() {
    return Default$2;
  }

  static get DefaultType() {
    return DefaultType$2;
  } // Public


  toggle() {
    if (this._element.disabled || this._element.classList.contains(ClassName$4.DISABLED)) {
      return;
    }

    const parent = Dropdown._getParentFromElement(this._element);

    const isActive = this._menu.classList.contains(ClassName$4.SHOW);

    Dropdown._clearMenus();

    if (isActive) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(parent, Event$5.SHOW, relatedTarget);

    if (showEvent.defaultPrevented) {
      return;
    } // Disable totally Popper.js for Dropdown in Navbar


    if (!this._inNavbar) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org)');
      }

      let referenceElement = this._element;

      if (this._config.reference === 'parent') {
        referenceElement = parent;
      } else if (isElement(this._config.reference)) {
        referenceElement = this._config.reference; // Check if it's jQuery element

        if (typeof this._config.reference.jquery !== 'undefined') {
          referenceElement = this._config.reference[0];
        }
      } // If boundary is not `scrollParent`, then set position to `static`
      // to allow the menu to "escape" the scroll parent's boundaries
      // https://github.com/twbs/bootstrap/issues/24251


      if (this._config.boundary !== 'scrollParent') {
        parent.classList.add(ClassName$4.POSITION_STATIC);
      }

      this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
    } // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


    if ('ontouchstart' in document.documentElement && !makeArray(SelectorEngine.closest(parent, Selector$4.NAVBAR_NAV)).length) {
      makeArray(document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', null, noop()));
    }

    this._element.focus();

    this._element.setAttribute('aria-expanded', true);

    Manipulator.toggleClass(this._menu, ClassName$4.SHOW);
    Manipulator.toggleClass(parent, ClassName$4.SHOW);
    EventHandler.trigger(parent, Event$5.SHOWN, relatedTarget);
  }

  show() {
    if (this._element.disabled || this._element.classList.contains(ClassName$4.DISABLED) || this._menu.classList.contains(ClassName$4.SHOW)) {
      return;
    }

    const parent = Dropdown._getParentFromElement(this._element);

    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(parent, Event$5.SHOW, relatedTarget);

    if (showEvent.defaultPrevented) {
      return;
    }

    Manipulator.toggleClass(this._menu, ClassName$4.SHOW);
    Manipulator.toggleClass(parent, ClassName$4.SHOW);
    EventHandler.trigger(parent, Event$5.SHOWN, relatedTarget);
  }

  hide() {
    if (this._element.disabled || this._element.classList.contains(ClassName$4.DISABLED) || !this._menu.classList.contains(ClassName$4.SHOW)) {
      return;
    }

    const parent = Dropdown._getParentFromElement(this._element);

    const relatedTarget = {
      relatedTarget: this._element
    };
    const hideEvent = EventHandler.trigger(parent, Event$5.HIDE, relatedTarget);

    if (hideEvent.defaultPrevented) {
      return;
    }

    Manipulator.toggleClass(this._menu, ClassName$4.SHOW);
    Manipulator.toggleClass(parent, ClassName$4.SHOW);
    EventHandler.trigger(parent, Event$5.HIDDEN, relatedTarget);
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY$4);
    EventHandler.off(this._element, EVENT_KEY$4);
    this._element = null;
    this._menu = null;

    if (this._popper !== null) {
      this._popper.destroy();

      this._popper = null;
    }
  }

  update() {
    this._inNavbar = this._detectNavbar();

    if (this._popper !== null) {
      this._popper.scheduleUpdate();
    }
  } // Private


  _addEventListeners() {
    EventHandler.on(this._element, Event$5.CLICK, event => {
      event.preventDefault();
      event.stopPropagation();
      this.toggle();
    });
  }

  _getConfig(config) {
    config = _extends({}, this.constructor.Default, Manipulator.getDataAttributes(this._element), config);
    typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
    return config;
  }

  _getMenuElement() {
    if (!this._menu) {
      const parent = Dropdown._getParentFromElement(this._element);

      if (parent) {
        this._menu = SelectorEngine.findOne(Selector$4.MENU, parent);
      }
    }

    return this._menu;
  }

  _getPlacement() {
    const parentDropdown = this._element.parentNode;
    let placement = AttachmentMap.BOTTOM; // Handle dropup

    if (parentDropdown.classList.contains(ClassName$4.DROPUP)) {
      placement = AttachmentMap.TOP;

      if (this._menu.classList.contains(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.TOPEND;
      }
    } else if (parentDropdown.classList.contains(ClassName$4.DROPRIGHT)) {
      placement = AttachmentMap.RIGHT;
    } else if (parentDropdown.classList.contains(ClassName$4.DROPLEFT)) {
      placement = AttachmentMap.LEFT;
    } else if (this._menu.classList.contains(ClassName$4.MENURIGHT)) {
      placement = AttachmentMap.BOTTOMEND;
    }

    return placement;
  }

  _detectNavbar() {
    return Boolean(SelectorEngine.closest(this._element, '.navbar'));
  }

  _getOffset() {
    const offset = {};

    if (typeof this._config.offset === 'function') {
      offset.fn = data => {
        data.offsets = _extends({}, data.offsets, this._config.offset(data.offsets, this._element) || {});
        return data;
      };
    } else {
      offset.offset = this._config.offset;
    }

    return offset;
  }

  _getPopperConfig() {
    const popperConfig = {
      placement: this._getPlacement(),
      modifiers: {
        offset: this._getOffset(),
        flip: {
          enabled: this._config.flip
        },
        preventOverflow: {
          boundariesElement: this._config.boundary
        }
      } // Disable Popper.js if we have a static display

    };

    if (this._config.display === 'static') {
      popperConfig.modifiers.applyStyle = {
        enabled: false
      };
    }

    return popperConfig;
  } // Static


  static _dropdownInterface(element, config) {
    let data = Data.getData(element, DATA_KEY$4);

    const _config = typeof config === 'object' ? config : null;

    if (!data) {
      data = new Dropdown(element, _config);
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    }
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      Dropdown._dropdownInterface(this, config);
    });
  }

  static _clearMenus(event) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return;
    }

    const toggles = makeArray(SelectorEngine.find(Selector$4.DATA_TOGGLE));

    for (let i = 0, len = toggles.length; i < len; i++) {
      const parent = Dropdown._getParentFromElement(toggles[i]);

      const context = Data.getData(toggles[i], DATA_KEY$4);
      const relatedTarget = {
        relatedTarget: toggles[i]
      };

      if (event && event.type === 'click') {
        relatedTarget.clickEvent = event;
      }

      if (!context) {
        continue;
      }

      const dropdownMenu = context._menu;

      if (!parent.classList.contains(ClassName$4.SHOW)) {
        continue;
      }

      if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && parent.contains(event.target)) {
        continue;
      }

      const hideEvent = EventHandler.trigger(parent, Event$5.HIDE, relatedTarget);

      if (hideEvent.defaultPrevented) {
        continue;
      } // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        makeArray(document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', null, noop()));
      }

      toggles[i].setAttribute('aria-expanded', 'false');
      dropdownMenu.classList.remove(ClassName$4.SHOW);
      parent.classList.remove(ClassName$4.SHOW);
      EventHandler.trigger(parent, Event$5.HIDDEN, relatedTarget);
    }
  }

  static _getParentFromElement(element) {
    let parent;
    const selector = getSelectorFromElement(element);

    if (selector) {
      parent = SelectorEngine.findOne(selector);
    }

    return parent || element.parentNode;
  }

  static _dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || SelectorEngine.closest(event.target, Selector$4.MENU)) : !REGEXP_KEYDOWN.test(event.which)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.disabled || this.classList.contains(ClassName$4.DISABLED)) {
      return;
    }

    const parent = Dropdown._getParentFromElement(this);

    const isActive = parent.classList.contains(ClassName$4.SHOW);

    if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
      if (event.which === ESCAPE_KEYCODE) {
        EventHandler.trigger(SelectorEngine.findOne(Selector$4.DATA_TOGGLE, parent), 'focus');
      }

      Dropdown._clearMenus();

      return;
    }

    const items = makeArray(SelectorEngine.find(Selector$4.VISIBLE_ITEMS, parent));

    if (!items.length) {
      return;
    }

    let index = items.indexOf(event.target);

    if (event.which === ARROW_UP_KEYCODE && index > 0) {
      // Up
      index--;
    }

    if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
      // Down
      index++;
    }

    if (index < 0) {
      index = 0;
    }

    items[index].focus();
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$4);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$5.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler);
EventHandler.on(document, Event$5.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler);
EventHandler.on(document, Event$5.CLICK_DATA_API, Dropdown._clearMenus);
EventHandler.on(document, Event$5.KEYUP_DATA_API, Dropdown._clearMenus);
EventHandler.on(document, Event$5.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {
  event.preventDefault();
  event.stopPropagation();

  Dropdown._dropdownInterface(this, 'toggle');
});
EventHandler.on(document, Event$5.CLICK_DATA_API, Selector$4.FORM_CHILD, e => e.stopPropagation());
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .dropdown to jQuery only if jQuery is present
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$4];
  jQuery.fn[NAME$4] = Dropdown._jQueryInterface;
  jQuery.fn[NAME$4].Constructor = Dropdown;

  jQuery.fn[NAME$4].noConflict = () => {
    jQuery.fn[NAME$4] = JQUERY_NO_CONFLICT;
    return Dropdown._jQueryInterface;
  };
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$5 = 'modal';
const VERSION$5 = '4.3.1';
const DATA_KEY$5 = 'bs.modal';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const DATA_API_KEY$5 = '.data-api';
const ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

const Default$3 = {
  backdrop: true,
  keyboard: true,
  focus: true,
  show: true
};
const DefaultType$3 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean',
  show: 'boolean'
};
const Event$6 = {
  HIDE: `hide${EVENT_KEY$5}`,
  HIDDEN: `hidden${EVENT_KEY$5}`,
  SHOW: `show${EVENT_KEY$5}`,
  SHOWN: `shown${EVENT_KEY$5}`,
  FOCUSIN: `focusin${EVENT_KEY$5}`,
  RESIZE: `resize${EVENT_KEY$5}`,
  CLICK_DISMISS: `click.dismiss${EVENT_KEY$5}`,
  KEYDOWN_DISMISS: `keydown.dismiss${EVENT_KEY$5}`,
  MOUSEUP_DISMISS: `mouseup.dismiss${EVENT_KEY$5}`,
  MOUSEDOWN_DISMISS: `mousedown.dismiss${EVENT_KEY$5}`,
  CLICK_DATA_API: `click${EVENT_KEY$5}${DATA_API_KEY$5}`
};
const ClassName$5 = {
  SCROLLABLE: 'modal-dialog-scrollable',
  SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
  BACKDROP: 'modal-backdrop',
  OPEN: 'modal-open',
  FADE: 'fade',
  SHOW: 'show'
};
const Selector$5 = {
  DIALOG: '.modal-dialog',
  MODAL_BODY: '.modal-body',
  DATA_TOGGLE: '[data-toggle="modal"]',
  DATA_DISMISS: '[data-dismiss="modal"]',
  FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  STICKY_CONTENT: '.sticky-top'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Modal {
  constructor(element, config) {
    this._config = this._getConfig(config);
    this._element = element;
    this._dialog = SelectorEngine.findOne(Selector$5.DIALOG, element);
    this._backdrop = null;
    this._isShown = false;
    this._isBodyOverflowing = false;
    this._ignoreBackdropClick = false;
    this._isTransitioning = false;
    this._scrollbarWidth = 0;
    Data.setData(element, DATA_KEY$5, this);
  } // Getters


  static get VERSION() {
    return VERSION$5;
  }

  static get Default() {
    return Default$3;
  } // Public


  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }

    if (this._element.classList.contains(ClassName$5.FADE)) {
      this._isTransitioning = true;
    }

    const showEvent = EventHandler.trigger(this._element, Event$6.SHOW, {
      relatedTarget
    });

    if (this._isShown || showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;

    this._checkScrollbar();

    this._setScrollbar();

    this._adjustDialog();

    this._setEscapeEvent();

    this._setResizeEvent();

    EventHandler.on(this._element, Event$6.CLICK_DISMISS, Selector$5.DATA_DISMISS, event => this.hide(event));
    EventHandler.on(this._dialog, Event$6.MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, Event$6.MOUSEUP_DISMISS, event => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        }
      });
    });

    this._showBackdrop(() => this._showElement(relatedTarget));
  }

  hide(event) {
    if (event) {
      event.preventDefault();
    }

    if (!this._isShown || this._isTransitioning) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, Event$6.HIDE);

    if (!this._isShown || hideEvent.defaultPrevented) {
      return;
    }

    this._isShown = false;

    const transition = this._element.classList.contains(ClassName$5.FADE);

    if (transition) {
      this._isTransitioning = true;
    }

    this._setEscapeEvent();

    this._setResizeEvent();

    EventHandler.off(document, Event$6.FOCUSIN);

    this._element.classList.remove(ClassName$5.SHOW);

    EventHandler.off(this._element, Event$6.CLICK_DISMISS);
    EventHandler.off(this._dialog, Event$6.MOUSEDOWN_DISMISS);

    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this._element);
      EventHandler.one(this._element, TRANSITION_END, event => this._hideModal(event));
      emulateTransitionEnd(this._element, transitionDuration);
    } else {
      this._hideModal();
    }
  }

  dispose() {
    [window, this._element, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$5));
    /**
     * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
     * Do not move `document` in `htmlElements` array
     * It will remove `Event.CLICK_DATA_API` event that should remain
     */

    EventHandler.off(document, Event$6.FOCUSIN);
    Data.removeData(this._element, DATA_KEY$5);
    this._config = null;
    this._element = null;
    this._dialog = null;
    this._backdrop = null;
    this._isShown = null;
    this._isBodyOverflowing = null;
    this._ignoreBackdropClick = null;
    this._isTransitioning = null;
    this._scrollbarWidth = null;
  }

  handleUpdate() {
    this._adjustDialog();
  } // Private


  _getConfig(config) {
    config = _extends({}, Default$3, config);
    typeCheckConfig(NAME$5, config, DefaultType$3);
    return config;
  }

  _showElement(relatedTarget) {
    const transition = this._element.classList.contains(ClassName$5.FADE);

    if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this._element);
    }

    this._element.style.display = 'block';

    this._element.removeAttribute('aria-hidden');

    this._element.setAttribute('aria-modal', true);

    if (this._dialog.classList.contains(ClassName$5.SCROLLABLE)) {
      SelectorEngine.findOne(Selector$5.MODAL_BODY, this._dialog).scrollTop = 0;
    } else {
      this._element.scrollTop = 0;
    }

    if (transition) {
      reflow(this._element);
    }

    this._element.classList.add(ClassName$5.SHOW);

    if (this._config.focus) {
      this._enforceFocus();
    }

    const transitionComplete = () => {
      if (this._config.focus) {
        this._element.focus();
      }

      this._isTransitioning = false;
      EventHandler.trigger(this._element, Event$6.SHOWN, {
        relatedTarget
      });
    };

    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this._dialog);
      EventHandler.one(this._dialog, TRANSITION_END, transitionComplete);
      emulateTransitionEnd(this._dialog, transitionDuration);
    } else {
      transitionComplete();
    }
  }

  _enforceFocus() {
    EventHandler.off(document, Event$6.FOCUSIN); // guard against infinite focus loop

    EventHandler.on(document, Event$6.FOCUSIN, event => {
      if (document !== event.target && this._element !== event.target && !this._element.contains(event.target)) {
        this._element.focus();
      }
    });
  }

  _setEscapeEvent() {
    if (this._isShown && this._config.keyboard) {
      EventHandler.on(this._element, Event$6.KEYDOWN_DISMISS, event => {
        if (event.which === ESCAPE_KEYCODE$1) {
          event.preventDefault();
          this.hide();
        }
      });
    } else if (!this._isShown) {
      EventHandler.off(this._element, Event$6.KEYDOWN_DISMISS);
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, Event$6.RESIZE, event => this.handleUpdate(event));
    } else {
      EventHandler.off(window, Event$6.RESIZE);
    }
  }

  _hideModal() {
    this._element.style.display = 'none';

    this._element.setAttribute('aria-hidden', true);

    this._element.removeAttribute('aria-modal');

    this._isTransitioning = false;

    this._showBackdrop(() => {
      document.body.classList.remove(ClassName$5.OPEN);

      this._resetAdjustments();

      this._resetScrollbar();

      EventHandler.trigger(this._element, Event$6.HIDDEN);
    });
  }

  _removeBackdrop() {
    if (this._backdrop) {
      this._backdrop.parentNode.removeChild(this._backdrop);

      this._backdrop = null;
    }
  }

  _showBackdrop(callback) {
    const animate = this._element.classList.contains(ClassName$5.FADE) ? ClassName$5.FADE : '';

    if (this._isShown && this._config.backdrop) {
      this._backdrop = document.createElement('div');
      this._backdrop.className = ClassName$5.BACKDROP;

      if (animate) {
        this._backdrop.classList.add(animate);
      }

      document.body.appendChild(this._backdrop);
      EventHandler.on(this._element, Event$6.CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
        }

        if (event.target !== event.currentTarget) {
          return;
        }

        if (this._config.backdrop === 'static') {
          this._element.focus();
        } else {
          this.hide();
        }
      });

      if (animate) {
        reflow(this._backdrop);
      }

      this._backdrop.classList.add(ClassName$5.SHOW);

      if (!callback) {
        return;
      }

      if (!animate) {
        callback();
        return;
      }

      const backdropTransitionDuration = getTransitionDurationFromElement(this._backdrop);
      EventHandler.one(this._backdrop, TRANSITION_END, callback);
      emulateTransitionEnd(this._backdrop, backdropTransitionDuration);
    } else if (!this._isShown && this._backdrop) {
      this._backdrop.classList.remove(ClassName$5.SHOW);

      const callbackRemove = () => {
        this._removeBackdrop();

        if (callback) {
          callback();
        }
      };

      if (this._element.classList.contains(ClassName$5.FADE)) {
        const backdropTransitionDuration = getTransitionDurationFromElement(this._backdrop);
        EventHandler.one(this._backdrop, TRANSITION_END, callbackRemove);
        emulateTransitionEnd(this._backdrop, backdropTransitionDuration);
      } else {
        callbackRemove();
      }
    } else if (callback) {
      callback();
    }
  } // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------


  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

    if (!this._isBodyOverflowing && isModalOverflowing) {
      this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
    }

    if (this._isBodyOverflowing && !isModalOverflowing) {
      this._element.style.paddingRight = `${this._scrollbarWidth}px`;
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect();
    this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
    this._scrollbarWidth = this._getScrollbarWidth();
  }

  _setScrollbar() {
    if (this._isBodyOverflowing) {
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
      // Adjust fixed content padding
      makeArray(SelectorEngine.find(Selector$5.FIXED_CONTENT)).forEach(element => {
        const actualPadding = element.style.paddingRight;
        const calculatedPadding = window.getComputedStyle(element)['padding-right'];
        Manipulator.setDataAttribute(element, 'padding-right', actualPadding);
        element.style.paddingRight = `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`;
      }); // Adjust sticky content margin

      makeArray(SelectorEngine.find(Selector$5.STICKY_CONTENT)).forEach(element => {
        const actualMargin = element.style.marginRight;
        const calculatedMargin = window.getComputedStyle(element)['margin-right'];
        Manipulator.setDataAttribute(element, 'margin-right', actualMargin);
        element.style.marginRight = `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`;
      }); // Adjust body padding

      const actualPadding = document.body.style.paddingRight;
      const calculatedPadding = window.getComputedStyle(document.body)['padding-right'];
      Manipulator.setDataAttribute(document.body, 'padding-right', actualPadding);
      document.body.style.paddingRight = `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`;
    }

    document.body.classList.add(ClassName$5.OPEN);
  }

  _resetScrollbar() {
    // Restore fixed content padding
    makeArray(SelectorEngine.find(Selector$5.FIXED_CONTENT)).forEach(element => {
      const padding = Manipulator.getDataAttribute(element, 'padding-right');

      if (typeof padding !== 'undefined') {
        Manipulator.removeDataAttribute(element, 'padding-right');
        element.style.paddingRight = padding;
      }
    }); // Restore sticky content and navbar-toggler margin

    makeArray(SelectorEngine.find(`${Selector$5.STICKY_CONTENT}`)).forEach(element => {
      const margin = Manipulator.getDataAttribute(element, 'margin-right');

      if (typeof margin !== 'undefined') {
        Manipulator.removeDataAttribute(element, 'margin-right');
        element.style.marginRight = margin;
      }
    }); // Restore body padding

    const padding = Manipulator.getDataAttribute(document.body, 'padding-right');

    if (typeof padding === 'undefined') {
      document.body.style.paddingRight = '';
    } else {
      Manipulator.removeDataAttribute(document.body, 'padding-right');
      document.body.style.paddingRight = padding;
    }
  }

  _getScrollbarWidth() {
    // thx d.walsh
    const scrollDiv = document.createElement('div');
    scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  } // Static


  static _jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY$5);

      const _config = _extends({}, Default$3, Manipulator.getDataAttributes(this), typeof config === 'object' && config ? config : {});

      if (!data) {
        data = new Modal(this, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](relatedTarget);
      } else if (_config.show) {
        data.show(relatedTarget);
      }
    });
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$5);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$6.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {
  let target;
  const selector = getSelectorFromElement(this);

  if (selector) {
    target = SelectorEngine.findOne(selector);
  }

  const config = Data.getData(target, DATA_KEY$5) ? 'toggle' : _extends({}, Manipulator.getDataAttributes(target), Manipulator.getDataAttributes(this));

  if (this.tagName === 'A' || this.tagName === 'AREA') {
    event.preventDefault();
  }

  EventHandler.one(target, Event$6.SHOW, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }

    EventHandler.one(target, Event$6.HIDDEN, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });
  let data = Data.getData(target, DATA_KEY$5);

  if (!data) {
    data = new Modal(target, config);
  }

  data.show(this);
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$5];
  jQuery.fn[NAME$5] = Modal._jQueryInterface;
  jQuery.fn[NAME$5].Constructor = Modal;

  jQuery.fn[NAME$5].noConflict = () => {
    jQuery.fn[NAME$5] = JQUERY_NO_CONFLICT;
    return Modal._jQueryInterface;
  };
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
const uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
 */

const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
 */

const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

const allowedAttribute = (attr, allowedAttributeList) => {
  const attrName = attr.nodeName.toLowerCase();

  if (allowedAttributeList.indexOf(attrName) !== -1) {
    if (uriAttrs.indexOf(attrName) !== -1) {
      return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
    }

    return true;
  }

  const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

  for (let i = 0, l = regExp.length; i < l; i++) {
    if (attrName.match(regExp[i])) {
      return true;
    }
  }

  return false;
};

const DefaultWhitelist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'alt', 'title', 'width', 'height'],
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
function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }

  if (sanitizeFn && typeof sanitizeFn === 'function') {
    return sanitizeFn(unsafeHtml);
  }

  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const whitelistKeys = Object.keys(whiteList);
  const elements = makeArray(createdDocument.body.querySelectorAll('*'));

  for (let i = 0, len = elements.length; i < len; i++) {
    const el = elements[i];
    const elName = el.nodeName.toLowerCase();

    if (whitelistKeys.indexOf(elName) === -1) {
      el.parentNode.removeChild(el);
      continue;
    }

    const attributeList = makeArray(el.attributes);
    const whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
    attributeList.forEach(attr => {
      if (!allowedAttribute(attr, whitelistedAttributes)) {
        el.removeAttribute(attr.nodeName);
      }
    });
  }

  return createdDocument.body.innerHTML;
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$6 = 'tooltip';
const VERSION$6 = '4.3.1';
const DATA_KEY$6 = 'bs.tooltip';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const CLASS_PREFIX = 'bs-tooltip';
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');
const DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
const DefaultType$4 = {
  animation: 'boolean',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string',
  delay: '(number|object)',
  html: 'boolean',
  selector: '(string|boolean)',
  placement: '(string|function)',
  offset: '(number|string|function)',
  container: '(string|element|boolean)',
  fallbackPlacement: '(string|array)',
  boundary: '(string|element)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  whiteList: 'object'
};
const AttachmentMap$1 = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
};
const Default$4 = {
  animation: true,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div></div>',
  trigger: 'hover focus',
  title: '',
  delay: 0,
  html: false,
  selector: false,
  placement: 'top',
  offset: 0,
  container: false,
  fallbackPlacement: 'flip',
  boundary: 'scrollParent',
  sanitize: true,
  sanitizeFn: null,
  whiteList: DefaultWhitelist
};
const HoverState = {
  SHOW: 'show',
  OUT: 'out'
};
const Event$7 = {
  HIDE: `hide${EVENT_KEY$6}`,
  HIDDEN: `hidden${EVENT_KEY$6}`,
  SHOW: `show${EVENT_KEY$6}`,
  SHOWN: `shown${EVENT_KEY$6}`,
  INSERTED: `inserted${EVENT_KEY$6}`,
  CLICK: `click${EVENT_KEY$6}`,
  FOCUSIN: `focusin${EVENT_KEY$6}`,
  FOCUSOUT: `focusout${EVENT_KEY$6}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$6}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$6}`
};
const ClassName$6 = {
  FADE: 'fade',
  SHOW: 'show'
};
const Selector$6 = {
  TOOLTIP_INNER: '.tooltip-inner',
  TOOLTIP_ARROW: '.tooltip-arrow'
};
const Trigger = {
  HOVER: 'hover',
  FOCUS: 'focus',
  CLICK: 'click',
  MANUAL: 'manual'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Tooltip {
  constructor(element, config) {
    /**
     * Check for Popper dependency
     * Popper - https://popper.js.org
     */
    if (typeof Popper === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org)');
    } // private


    this._isEnabled = true;
    this._timeout = 0;
    this._hoverState = '';
    this._activeTrigger = {};
    this._popper = null; // Protected

    this.element = element;
    this.config = this._getConfig(config);
    this.tip = null;

    this._setListeners();

    Data.setData(element, this.constructor.DATA_KEY, this);
  } // Getters


  static get VERSION() {
    return VERSION$6;
  }

  static get Default() {
    return Default$4;
  }

  static get NAME() {
    return NAME$6;
  }

  static get DATA_KEY() {
    return DATA_KEY$6;
  }

  static get Event() {
    return Event$7;
  }

  static get EVENT_KEY() {
    return EVENT_KEY$6;
  }

  static get DefaultType() {
    return DefaultType$4;
  } // Public


  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }

  toggle(event) {
    if (!this._isEnabled) {
      return;
    }

    if (event) {
      const dataKey = this.constructor.DATA_KEY;
      let context = Data.getData(event.delegateTarget, dataKey);

      if (!context) {
        context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
        Data.setData(event.delegateTarget, dataKey, context);
      }

      context._activeTrigger.click = !context._activeTrigger.click;

      if (context._isWithActiveTrigger()) {
        context._enter(null, context);
      } else {
        context._leave(null, context);
      }
    } else {
      if (this.getTipElement().classList.contains(ClassName$6.SHOW)) {
        this._leave(null, this);

        return;
      }

      this._enter(null, this);
    }
  }

  dispose() {
    clearTimeout(this._timeout);
    Data.removeData(this.element, this.constructor.DATA_KEY);
    EventHandler.off(this.element, this.constructor.EVENT_KEY);
    EventHandler.off(SelectorEngine.closest(this.element, '.modal'), 'hide.bs.modal');

    if (this.tip) {
      this.tip.parentNode.removeChild(this.tip);
    }

    this._isEnabled = null;
    this._timeout = null;
    this._hoverState = null;
    this._activeTrigger = null;

    if (this._popper !== null) {
      this._popper.destroy();
    }

    this._popper = null;
    this.element = null;
    this.config = null;
    this.tip = null;
  }

  show() {
    if (this.element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }

    if (this.isWithContent() && this._isEnabled) {
      const showEvent = EventHandler.trigger(this.element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this.element);
      const isInTheDom = shadowRoot === null ? this.element.ownerDocument.documentElement.contains(this.element) : shadowRoot.contains(this.element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);
      this.element.setAttribute('aria-describedby', tipId);
      this.setContent();

      if (this.config.animation) {
        tip.classList.add(ClassName$6.FADE);
      }

      const placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

      const attachment = this._getAttachment(placement);

      this.addAttachmentClass(attachment);

      const container = this._getContainer();

      Data.setData(tip, this.constructor.DATA_KEY, this);

      if (!this.element.ownerDocument.documentElement.contains(this.tip)) {
        container.appendChild(tip);
      }

      EventHandler.trigger(this.element, this.constructor.Event.INSERTED);
      this._popper = new Popper(this.element, tip, {
        placement: attachment,
        modifiers: {
          offset: this._getOffset(),
          flip: {
            behavior: this.config.fallbackPlacement
          },
          arrow: {
            element: Selector$6.TOOLTIP_ARROW
          },
          preventOverflow: {
            boundariesElement: this.config.boundary
          }
        },
        onCreate: data => {
          if (data.originalPlacement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        },
        onUpdate: data => this._handlePopperPlacementChange(data)
      });
      tip.classList.add(ClassName$6.SHOW); // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

      if ('ontouchstart' in document.documentElement) {
        makeArray(document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop());
        });
      }

      const complete = () => {
        if (this.config.animation) {
          this._fixTransition();
        }

        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this.element, this.constructor.Event.SHOWN);

        if (prevHoverState === HoverState.OUT) {
          this._leave(null, this);
        }
      };

      if (this.tip.classList.contains(ClassName$6.FADE)) {
        const transitionDuration = getTransitionDurationFromElement(this.tip);
        EventHandler.one(this.tip, TRANSITION_END, complete);
        emulateTransitionEnd(this.tip, transitionDuration);
      } else {
        complete();
      }
    }
  }

  hide(callback) {
    const tip = this.getTipElement();

    const complete = () => {
      if (this._hoverState !== HoverState.SHOW && tip.parentNode) {
        tip.parentNode.removeChild(tip);
      }

      this._cleanTipClass();

      this.element.removeAttribute('aria-describedby');
      EventHandler.trigger(this.element, this.constructor.Event.HIDDEN);

      if (this._popper !== null) {
        this._popper.destroy();
      }

      if (callback) {
        callback();
      }
    };

    const hideEvent = EventHandler.trigger(this.element, this.constructor.Event.HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    tip.classList.remove(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support

    if ('ontouchstart' in document.documentElement) {
      makeArray(document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
    }

    this._activeTrigger[Trigger.CLICK] = false;
    this._activeTrigger[Trigger.FOCUS] = false;
    this._activeTrigger[Trigger.HOVER] = false;

    if (this.tip.classList.contains(ClassName$6.FADE)) {
      const transitionDuration = getTransitionDurationFromElement(tip);
      EventHandler.one(tip, TRANSITION_END, complete);
      emulateTransitionEnd(tip, transitionDuration);
    } else {
      complete();
    }

    this._hoverState = '';
  }

  update() {
    if (this._popper !== null) {
      this._popper.scheduleUpdate();
    }
  } // Protected


  isWithContent() {
    return Boolean(this.getTitle());
  }

  addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${CLASS_PREFIX}-${attachment}`);
  }

  getTipElement() {
    if (this.tip) {
      return this.tip;
    }

    const element = document.createElement('div');
    element.innerHTML = this.config.template;
    this.tip = element.children[0];
    return this.tip;
  }

  setContent() {
    const tip = this.getTipElement();
    this.setElementContent(SelectorEngine.findOne(Selector$6.TOOLTIP_INNER, tip), this.getTitle());
    tip.classList.remove(ClassName$6.FADE);
    tip.classList.remove(ClassName$6.SHOW);
  }

  setElementContent(element, content) {
    if (element === null) {
      return;
    }

    if (typeof content === 'object' && (content.nodeType || content.jquery)) {
      if (content.jquery) {
        content = content[0];
      } // content is a DOM node or a jQuery


      if (this.config.html) {
        if (content.parentNode !== element) {
          element.innerHTML = '';
          element.appendChild(content);
        }
      } else {
        element.innerText = content.textContent;
      }

      return;
    }

    if (this.config.html) {
      if (this.config.sanitize) {
        content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
      }

      element.innerHTML = content;
    } else {
      element.innerText = content;
    }
  }

  getTitle() {
    let title = this.element.getAttribute('data-original-title');

    if (!title) {
      title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
    }

    return title;
  } // Private


  _getOffset() {
    const offset = {};

    if (typeof this.config.offset === 'function') {
      offset.fn = data => {
        data.offsets = _extends({}, data.offsets, this.config.offset(data.offsets, this.element) || {});
        return data;
      };
    } else {
      offset.offset = this.config.offset;
    }

    return offset;
  }

  _getContainer() {
    if (this.config.container === false) {
      return document.body;
    }

    if (isElement(this.config.container)) {
      return this.config.container;
    }

    return SelectorEngine.findOne(this.config.container);
  }

  _getAttachment(placement) {
    return AttachmentMap$1[placement.toUpperCase()];
  }

  _setListeners() {
    const triggers = this.config.trigger.split(' ');
    triggers.forEach(trigger => {
      if (trigger === 'click') {
        EventHandler.on(this.element, this.constructor.Event.CLICK, this.config.selector, event => this.toggle(event));
      } else if (trigger !== Trigger.MANUAL) {
        const eventIn = trigger === Trigger.HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
        const eventOut = trigger === Trigger.HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
        EventHandler.on(this.element, eventIn, this.config.selector, event => this._enter(event));
        EventHandler.on(this.element, eventOut, this.config.selector, event => this._leave(event));
      }
    });
    EventHandler.on(SelectorEngine.closest(this.element, '.modal'), 'hide.bs.modal', () => {
      if (this.element) {
        this.hide();
      }
    });

    if (this.config.selector) {
      this.config = _extends({}, this.config, {
        trigger: 'manual',
        selector: ''
      });
    } else {
      this._fixTitle();
    }
  }

  _fixTitle() {
    const titleType = typeof this.element.getAttribute('data-original-title');

    if (this.element.getAttribute('title') || titleType !== 'string') {
      this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
      this.element.setAttribute('title', '');
    }
  }

  _enter(event, context) {
    const dataKey = this.constructor.DATA_KEY;
    context = context || Data.getData(event.delegateTarget, dataKey);

    if (!context) {
      context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
      Data.setData(event.delegateTarget, dataKey, context);
    }

    if (event) {
      context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
    }

    if (context.getTipElement().classList.contains(ClassName$6.SHOW) || context._hoverState === HoverState.SHOW) {
      context._hoverState = HoverState.SHOW;
      return;
    }

    clearTimeout(context._timeout);
    context._hoverState = HoverState.SHOW;

    if (!context.config.delay || !context.config.delay.show) {
      context.show();
      return;
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HoverState.SHOW) {
        context.show();
      }
    }, context.config.delay.show);
  }

  _leave(event, context) {
    const dataKey = this.constructor.DATA_KEY;
    context = context || Data.getData(event.delegateTarget, dataKey);

    if (!context) {
      context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
      Data.setData(event.delegateTarget, dataKey, context);
    }

    if (event) {
      context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
    }

    if (context._isWithActiveTrigger()) {
      return;
    }

    clearTimeout(context._timeout);
    context._hoverState = HoverState.OUT;

    if (!context.config.delay || !context.config.delay.hide) {
      context.hide();
      return;
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HoverState.OUT) {
        context.hide();
      }
    }, context.config.delay.hide);
  }

  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true;
      }
    }

    return false;
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this.element);
    Object.keys(dataAttributes).forEach(dataAttr => {
      if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
        delete dataAttributes[dataAttr];
      }
    });

    if (config && typeof config.container === 'object' && config.container.jquery) {
      config.container = config.container[0];
    }

    config = _extends({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});

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

    typeCheckConfig(NAME$6, config, this.constructor.DefaultType);

    if (config.sanitize) {
      config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
    }

    return config;
  }

  _getDelegateConfig() {
    const config = {};

    if (this.config) {
      for (const key in this.config) {
        if (this.constructor.Default[key] !== this.config[key]) {
          config[key] = this.config[key];
        }
      }
    }

    return config;
  }

  _cleanTipClass() {
    const tip = this.getTipElement();
    const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX);

    if (tabClass !== null && tabClass.length) {
      tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
    }
  }

  _handlePopperPlacementChange(popperData) {
    const popperInstance = popperData.instance;
    this.tip = popperInstance.popper;

    this._cleanTipClass();

    this.addAttachmentClass(this._getAttachment(popperData.placement));
  }

  _fixTransition() {
    const tip = this.getTipElement();
    const initConfigAnimation = this.config.animation;

    if (tip.getAttribute('x-placement') !== null) {
      return;
    }

    tip.classList.remove(ClassName$6.FADE);
    this.config.animation = false;
    this.hide();
    this.show();
    this.config.animation = initConfigAnimation;
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY$6);

      const _config = typeof config === 'object' && config;

      if (!data && /dispose|hide/.test(config)) {
        return;
      }

      if (!data) {
        data = new Tooltip(this, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$6);
  }

}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .tooltip to jQuery only if jQuery is present
 */


if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$6];
  jQuery.fn[NAME$6] = Tooltip._jQueryInterface;
  jQuery.fn[NAME$6].Constructor = Tooltip;

  jQuery.fn[NAME$6].noConflict = () => {
    jQuery.fn[NAME$6] = JQUERY_NO_CONFLICT;
    return Tooltip._jQueryInterface;
  };
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$7 = 'popover';
const VERSION$7 = '4.3.1';
const DATA_KEY$7 = 'bs.popover';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const CLASS_PREFIX$1 = 'bs-popover';
const BSCLS_PREFIX_REGEX$1 = new RegExp(`(^|\\s)${CLASS_PREFIX$1}\\S+`, 'g');

const Default$5 = _extends({}, Tooltip.Default, {
  placement: 'right',
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
});

const DefaultType$5 = _extends({}, Tooltip.DefaultType, {
  content: '(string|element|function)'
});

const ClassName$7 = {
  FADE: 'fade',
  SHOW: 'show'
};
const Selector$7 = {
  TITLE: '.popover-header',
  CONTENT: '.popover-body'
};
const Event$8 = {
  HIDE: `hide${EVENT_KEY$7}`,
  HIDDEN: `hidden${EVENT_KEY$7}`,
  SHOW: `show${EVENT_KEY$7}`,
  SHOWN: `shown${EVENT_KEY$7}`,
  INSERTED: `inserted${EVENT_KEY$7}`,
  CLICK: `click${EVENT_KEY$7}`,
  FOCUSIN: `focusin${EVENT_KEY$7}`,
  FOCUSOUT: `focusout${EVENT_KEY$7}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$7}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$7}`
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Popover extends Tooltip {
  // Getters
  static get VERSION() {
    return VERSION$7;
  }

  static get Default() {
    return Default$5;
  }

  static get NAME() {
    return NAME$7;
  }

  static get DATA_KEY() {
    return DATA_KEY$7;
  }

  static get Event() {
    return Event$8;
  }

  static get EVENT_KEY() {
    return EVENT_KEY$7;
  }

  static get DefaultType() {
    return DefaultType$5;
  } // Overrides


  isWithContent() {
    return this.getTitle() || this._getContent();
  }

  addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${CLASS_PREFIX$1}-${attachment}`);
  }

  setContent() {
    const tip = this.getTipElement(); // we use append for html objects to maintain js events

    this.setElementContent(SelectorEngine.findOne(Selector$7.TITLE, tip), this.getTitle());

    let content = this._getContent();

    if (typeof content === 'function') {
      content = content.call(this.element);
    }

    this.setElementContent(SelectorEngine.findOne(Selector$7.CONTENT, tip), content);
    tip.classList.remove(ClassName$7.FADE);
    tip.classList.remove(ClassName$7.SHOW);
  } // Private


  _getContent() {
    return this.element.getAttribute('data-content') || this.config.content;
  }

  _cleanTipClass() {
    const tip = this.getTipElement();
    const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX$1);

    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
    }
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY$7);

      const _config = typeof config === 'object' ? config : null;

      if (!data && /dispose|hide/.test(config)) {
        return;
      }

      if (!data) {
        data = new Popover(this, _config);
        Data.setData(this, DATA_KEY$7, data);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$7);
  }

}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */


if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$7];
  jQuery.fn[NAME$7] = Popover._jQueryInterface;
  jQuery.fn[NAME$7].Constructor = Popover;

  jQuery.fn[NAME$7].noConflict = () => {
    jQuery.fn[NAME$7] = JQUERY_NO_CONFLICT;
    return Popover._jQueryInterface;
  };
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$8 = 'scrollspy';
const VERSION$8 = '4.3.1';
const DATA_KEY$8 = 'bs.scrollspy';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$6 = '.data-api';
const Default$6 = {
  offset: 10,
  method: 'auto',
  target: ''
};
const DefaultType$6 = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
};
const Event$9 = {
  ACTIVATE: `activate${EVENT_KEY$8}`,
  SCROLL: `scroll${EVENT_KEY$8}`,
  LOAD_DATA_API: `load${EVENT_KEY$8}${DATA_API_KEY$6}`
};
const ClassName$8 = {
  DROPDOWN_ITEM: 'dropdown-item',
  ACTIVE: 'active'
};
const Selector$8 = {
  DATA_SPY: '[data-spy="scroll"]',
  NAV_LIST_GROUP: '.nav, .list-group',
  NAV_LINKS: '.nav-link',
  NAV_ITEMS: '.nav-item',
  LIST_ITEMS: '.list-group-item',
  DROPDOWN: '.dropdown',
  DROPDOWN_TOGGLE: '.dropdown-toggle'
};
const OffsetMethod = {
  OFFSET: 'offset',
  POSITION: 'position'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class ScrollSpy {
  constructor(element, config) {
    this._element = element;
    this._scrollElement = element.tagName === 'BODY' ? window : element;
    this._config = this._getConfig(config);
    this._selector = `${this._config.target} ${Selector$8.NAV_LINKS},` + `${this._config.target} ${Selector$8.LIST_ITEMS},` + `${this._config.target} .${ClassName$8.DROPDOWN_ITEM}`;
    this._offsets = [];
    this._targets = [];
    this._activeTarget = null;
    this._scrollHeight = 0;
    EventHandler.on(this._scrollElement, Event$9.SCROLL, event => this._process(event));
    this.refresh();

    this._process();

    Data.setData(element, DATA_KEY$8, this);
  } // Getters


  static get VERSION() {
    return VERSION$8;
  }

  static get Default() {
    return Default$6;
  } // Public


  refresh() {
    const autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
    const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
    const offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
    this._offsets = [];
    this._targets = [];
    this._scrollHeight = this._getScrollHeight();
    const targets = makeArray(SelectorEngine.find(this._selector));
    targets.map(element => {
      let target;
      const targetSelector = getSelectorFromElement(element);

      if (targetSelector) {
        target = SelectorEngine.findOne(targetSelector);
      }

      if (target) {
        const targetBCR = target.getBoundingClientRect();

        if (targetBCR.width || targetBCR.height) {
          return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
        }
      }

      return null;
    }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
      this._offsets.push(item[0]);

      this._targets.push(item[1]);
    });
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY$8);
    EventHandler.off(this._scrollElement, EVENT_KEY$8);
    this._element = null;
    this._scrollElement = null;
    this._config = null;
    this._selector = null;
    this._offsets = null;
    this._targets = null;
    this._activeTarget = null;
    this._scrollHeight = null;
  } // Private


  _getConfig(config) {
    config = _extends({}, Default$6, typeof config === 'object' && config ? config : {});

    if (typeof config.target !== 'string') {
      let id = config.target.id;

      if (!id) {
        id = getUID(NAME$8);
        config.target.id = id;
      }

      config.target = `#${id}`;
    }

    typeCheckConfig(NAME$8, config, DefaultType$6);
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

    const offsetLength = this._offsets.length;

    for (let i = offsetLength; i--;) {
      const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

      if (isActiveTarget) {
        this._activate(this._targets[i]);
      }
    }
  }

  _activate(target) {
    this._activeTarget = target;

    this._clear();

    const queries = this._selector.split(',').map(selector => `${selector}[data-target="${target}"],${selector}[href="${target}"]`);

    const link = SelectorEngine.findOne(queries.join(','));

    if (link.classList.contains(ClassName$8.DROPDOWN_ITEM)) {
      SelectorEngine.findOne(Selector$8.DROPDOWN_TOGGLE, SelectorEngine.closest(link, Selector$8.DROPDOWN)).classList.add(ClassName$8.ACTIVE);
      link.classList.add(ClassName$8.ACTIVE);
    } else {
      // Set triggered link as active
      link.classList.add(ClassName$8.ACTIVE);
      SelectorEngine.parents(link, Selector$8.NAV_LIST_GROUP).forEach(listGroup => {
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        SelectorEngine.prev(listGroup, `${Selector$8.NAV_LINKS}, ${Selector$8.LIST_ITEMS}`).forEach(item => item.classList.add(ClassName$8.ACTIVE)); // Handle special case when .nav-link is inside .nav-item

        SelectorEngine.prev(listGroup, Selector$8.NAV_ITEMS).forEach(navItem => {
          SelectorEngine.children(navItem, Selector$8.NAV_LINKS).forEach(item => item.classList.add(ClassName$8.ACTIVE));
        });
      });
    }

    EventHandler.trigger(this._scrollElement, Event$9.ACTIVATE, {
      relatedTarget: target
    });
  }

  _clear() {
    makeArray(SelectorEngine.find(this._selector)).filter(node => node.classList.contains(ClassName$8.ACTIVE)).forEach(node => node.classList.remove(ClassName$8.ACTIVE));
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY$8);

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

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$8);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(window, Event$9.LOAD_DATA_API, () => {
  makeArray(SelectorEngine.find(Selector$8.DATA_SPY)).forEach(spy => new ScrollSpy(spy, Manipulator.getDataAttributes(spy)));
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$8];
  jQuery.fn[NAME$8] = ScrollSpy._jQueryInterface;
  jQuery.fn[NAME$8].Constructor = ScrollSpy;

  jQuery.fn[NAME$8].noConflict = () => {
    jQuery.fn[NAME$8] = JQUERY_NO_CONFLICT;
    return ScrollSpy._jQueryInterface;
  };
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$9 = 'tab';
const VERSION$9 = '4.3.1';
const DATA_KEY$9 = 'bs.tab';
const EVENT_KEY$9 = `.${DATA_KEY$9}`;
const DATA_API_KEY$7 = '.data-api';
const Event$a = {
  HIDE: `hide${EVENT_KEY$9}`,
  HIDDEN: `hidden${EVENT_KEY$9}`,
  SHOW: `show${EVENT_KEY$9}`,
  SHOWN: `shown${EVENT_KEY$9}`,
  CLICK_DATA_API: `click${EVENT_KEY$9}${DATA_API_KEY$7}`
};
const ClassName$9 = {
  DROPDOWN_MENU: 'dropdown-menu',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  FADE: 'fade',
  SHOW: 'show'
};
const Selector$9 = {
  DROPDOWN: '.dropdown',
  NAV_LIST_GROUP: '.nav, .list-group',
  ACTIVE: '.active',
  ACTIVE_UL: ':scope > li > .active',
  DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
  DROPDOWN_TOGGLE: '.dropdown-toggle',
  DROPDOWN_ACTIVE_CHILD: ':scope > .dropdown-menu .active'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Tab {
  constructor(element) {
    this._element = element;
    Data.setData(this._element, DATA_KEY$9, this);
  } // Getters


  static get VERSION() {
    return VERSION$9;
  } // Public


  show() {
    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(ClassName$9.ACTIVE) || this._element.classList.contains(ClassName$9.DISABLED)) {
      return;
    }

    let target;
    let previous;
    const listElement = SelectorEngine.closest(this._element, Selector$9.NAV_LIST_GROUP);
    const selector = getSelectorFromElement(this._element);

    if (listElement) {
      const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;
      previous = makeArray(SelectorEngine.find(itemSelector, listElement));
      previous = previous[previous.length - 1];
    }

    let hideEvent = null;

    if (previous) {
      hideEvent = EventHandler.trigger(previous, Event$a.HIDE, {
        relatedTarget: this._element
      });
    }

    const showEvent = EventHandler.trigger(this._element, Event$a.SHOW, {
      relatedTarget: previous
    });

    if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
      return;
    }

    if (selector) {
      target = SelectorEngine.findOne(selector);
    }

    this._activate(this._element, listElement);

    const complete = () => {
      EventHandler.trigger(previous, Event$a.HIDDEN, {
        relatedTarget: this._element
      });
      EventHandler.trigger(this._element, Event$a.SHOWN, {
        relatedTarget: previous
      });
    };

    if (target) {
      this._activate(target, target.parentNode, complete);
    } else {
      complete();
    }
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY$9);
    this._element = null;
  } // Private


  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(Selector$9.ACTIVE_UL, container) : SelectorEngine.children(container, Selector$9.ACTIVE);
    const active = activeElements[0];
    const isTransitioning = callback && active && active.classList.contains(ClassName$9.FADE);

    const complete = () => this._transitionComplete(element, active, callback);

    if (active && isTransitioning) {
      const transitionDuration = getTransitionDurationFromElement(active);
      active.classList.remove(ClassName$9.SHOW);
      EventHandler.one(active, TRANSITION_END, complete);
      emulateTransitionEnd(active, transitionDuration);
    } else {
      complete();
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      active.classList.remove(ClassName$9.ACTIVE);
      const dropdownChild = SelectorEngine.findOne(Selector$9.DROPDOWN_ACTIVE_CHILD, active.parentNode);

      if (dropdownChild) {
        dropdownChild.classList.remove(ClassName$9.ACTIVE);
      }

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false);
      }
    }

    element.classList.add(ClassName$9.ACTIVE);

    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true);
    }

    reflow(element);

    if (element.classList.contains(ClassName$9.FADE)) {
      element.classList.add(ClassName$9.SHOW);
    }

    if (element.parentNode && element.parentNode.classList.contains(ClassName$9.DROPDOWN_MENU)) {
      const dropdownElement = SelectorEngine.closest(element, Selector$9.DROPDOWN);

      if (dropdownElement) {
        makeArray(SelectorEngine.find(Selector$9.DROPDOWN_TOGGLE)).forEach(dropdown => dropdown.classList.add(ClassName$9.ACTIVE));
      }

      element.setAttribute('aria-expanded', true);
    }

    if (callback) {
      callback();
    }
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      const data = Data.getData(this, DATA_KEY$9) || new Tab(this);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$9);
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, Event$a.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {
  event.preventDefault();
  const data = Data.getData(this, DATA_KEY$9) || new Tab(this);
  data.show();
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .tab to jQuery only if jQuery is present
 */

if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$9];
  jQuery.fn[NAME$9] = Tab._jQueryInterface;
  jQuery.fn[NAME$9].Constructor = Tab;

  jQuery.fn[NAME$9].noConflict = () => {
    jQuery.fn[NAME$9] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$a = 'toast';
const VERSION$a = '4.3.1';
const DATA_KEY$a = 'bs.toast';
const EVENT_KEY$a = `.${DATA_KEY$a}`;
const Event$b = {
  CLICK_DISMISS: `click.dismiss${EVENT_KEY$a}`,
  HIDE: `hide${EVENT_KEY$a}`,
  HIDDEN: `hidden${EVENT_KEY$a}`,
  SHOW: `show${EVENT_KEY$a}`,
  SHOWN: `shown${EVENT_KEY$a}`
};
const ClassName$a = {
  FADE: 'fade',
  HIDE: 'hide',
  SHOW: 'show',
  SHOWING: 'showing'
};
const DefaultType$7 = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default$7 = {
  animation: true,
  autohide: true,
  delay: 500
};
const Selector$a = {
  DATA_DISMISS: '[data-dismiss="toast"]'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

class Toast {
  constructor(element, config) {
    this._element = element;
    this._config = this._getConfig(config);
    this._timeout = null;

    this._setListeners();

    Data.setData(element, DATA_KEY$a, this);
  } // Getters


  static get VERSION() {
    return VERSION$a;
  }

  static get DefaultType() {
    return DefaultType$7;
  }

  static get Default() {
    return Default$7;
  } // Public


  show() {
    EventHandler.trigger(this._element, Event$b.SHOW);

    if (this._config.animation) {
      this._element.classList.add(ClassName$a.FADE);
    }

    const complete = () => {
      this._element.classList.remove(ClassName$a.SHOWING);

      this._element.classList.add(ClassName$a.SHOW);

      EventHandler.trigger(this._element, Event$b.SHOWN);

      if (this._config.autohide) {
        this.hide();
      }
    };

    this._element.classList.remove(ClassName$a.HIDE);

    this._element.classList.add(ClassName$a.SHOWING);

    if (this._config.animation) {
      const transitionDuration = getTransitionDurationFromElement(this._element);
      EventHandler.one(this._element, TRANSITION_END, complete);
      emulateTransitionEnd(this._element, transitionDuration);
    } else {
      complete();
    }
  }

  hide(withoutTimeout) {
    if (!this._element.classList.contains(ClassName$a.SHOW)) {
      return;
    }

    EventHandler.trigger(this._element, Event$b.HIDE);

    if (withoutTimeout) {
      this._close();
    } else {
      this._timeout = setTimeout(() => {
        this._close();
      }, this._config.delay);
    }
  }

  dispose() {
    clearTimeout(this._timeout);
    this._timeout = null;

    if (this._element.classList.contains(ClassName$a.SHOW)) {
      this._element.classList.remove(ClassName$a.SHOW);
    }

    EventHandler.off(this._element, Event$b.CLICK_DISMISS);
    Data.removeData(this._element, DATA_KEY$a);
    this._element = null;
    this._config = null;
  } // Private


  _getConfig(config) {
    config = _extends({}, Default$7, Manipulator.getDataAttributes(this._element), typeof config === 'object' && config ? config : {});
    typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
    return config;
  }

  _setListeners() {
    EventHandler.on(this._element, Event$b.CLICK_DISMISS, Selector$a.DATA_DISMISS, () => this.hide(true));
  }

  _close() {
    const complete = () => {
      this._element.classList.add(ClassName$a.HIDE);

      EventHandler.trigger(this._element, Event$b.HIDDEN);
    };

    this._element.classList.remove(ClassName$a.SHOW);

    if (this._config.animation) {
      const transitionDuration = getTransitionDurationFromElement(this._element);
      EventHandler.one(this._element, TRANSITION_END, complete);
      emulateTransitionEnd(this._element, transitionDuration);
    } else {
      complete();
    }
  } // Static


  static _jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY$a);

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

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY$a);
  }

}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 *  add .toast to jQuery only if jQuery is present
 */


if (typeof jQuery !== 'undefined') {
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME$a];
  jQuery.fn[NAME$a] = Toast._jQueryInterface;
  jQuery.fn[NAME$a].Constructor = Toast;

  jQuery.fn[NAME$a].noConflict = () => {
    jQuery.fn[NAME$a] = JQUERY_NO_CONFLICT;
    return Toast._jQueryInterface;
  };
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): index.esm.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

export { Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip };
//# sourceMappingURL=bootstrap.esm.js.map
