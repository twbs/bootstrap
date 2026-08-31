/*!
* Bootstrap v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { Calendar } from "vanilla-calendar-pro";
//#region js/src/dom/data.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dom/data.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const elementMap = /* @__PURE__ */ new Map();
var data_default = {
	set(element, key, instance) {
		if (!elementMap.has(element)) elementMap.set(element, /* @__PURE__ */ new Map());
		const instanceMap = elementMap.get(element);
		if (!instanceMap.has(key) && instanceMap.size !== 0) {
			console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${[...instanceMap.keys()][0]}.`);
			return;
		}
		instanceMap.set(key, instance);
	},
	get(element, key) {
		if (element && elementMap.has(element)) return elementMap.get(element).get(key) || null;
		return null;
	},
	getAny(element) {
		if (element && elementMap.has(element)) return elementMap.get(element).values().next().value || null;
		return null;
	},
	remove(element, key) {
		if (!elementMap.has(element)) return;
		const instanceMap = elementMap.get(element);
		instanceMap.delete(key);
		if (instanceMap.size === 0) elementMap.delete(element);
	}
};
//#endregion
//#region js/src/dom/event-handler.ts
/**
* Constants
*/
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {};
let uidEvent = 1;
const customEvents = {
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};
const nativeEvents = /* @__PURE__ */ new Set([
	"click",
	"dblclick",
	"mouseup",
	"mousedown",
	"contextmenu",
	"mousewheel",
	"DOMMouseScroll",
	"mouseover",
	"mouseout",
	"mousemove",
	"selectstart",
	"selectend",
	"keydown",
	"keypress",
	"keyup",
	"orientationchange",
	"touchstart",
	"touchmove",
	"touchend",
	"touchcancel",
	"pointerdown",
	"pointermove",
	"pointerup",
	"pointerleave",
	"pointercancel",
	"gesturestart",
	"gesturechange",
	"gestureend",
	"focus",
	"blur",
	"change",
	"reset",
	"select",
	"submit",
	"focusin",
	"focusout",
	"load",
	"unload",
	"beforeunload",
	"resize",
	"move",
	"DOMContentLoaded",
	"readystatechange",
	"error",
	"abort",
	"scroll",
	"scrollend"
]);
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
function isMouseEventWithinTarget(event) {
	const { delegateTarget, relatedTarget } = event;
	return Boolean(relatedTarget && delegateTarget.contains(relatedTarget));
}
function bootstrapHandler(element, fn, handlerTypeEvent) {
	const isCustomMouseEvent = handlerTypeEvent in customEvents;
	return function handler(event) {
		const bootstrapEvent = hydrateObj(event, { delegateTarget: element });
		if (isCustomMouseEvent && isMouseEventWithinTarget(bootstrapEvent)) return;
		if (handler.oneOff) EventHandler.off(element, handlerTypeEvent, fn);
		return fn.apply(element, [bootstrapEvent]);
	};
}
function bootstrapDelegationHandler(element, selector, fn, handlerTypeEvent) {
	const isCustomMouseEvent = handlerTypeEvent in customEvents;
	return function handler(event) {
		const domElements = element.querySelectorAll(selector);
		for (let { target } = event; target && target !== this; target = target.parentNode) for (const domElement of domElements) {
			if (domElement !== target) continue;
			const bootstrapEvent = hydrateObj(event, { delegateTarget: target });
			if (isCustomMouseEvent && isMouseEventWithinTarget(bootstrapEvent)) return;
			if (handler.oneOff) EventHandler.off(element, handlerTypeEvent, selector, fn);
			return fn.apply(target, [bootstrapEvent]);
		}
	};
}
function findHandler(events, callable, handlerTypeEvent, delegationSelector = null) {
	return Object.values(events).find((event) => event.callable === callable && event.handlerTypeEvent === handlerTypeEvent && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
	const isDelegated = typeof handler === "string";
	const callable = isDelegated ? delegationFunction : handler || delegationFunction;
	const baseTypeEvent = originalTypeEvent.replace(stripNameRegex, "");
	let typeEvent = customEvents[baseTypeEvent] || baseTypeEvent;
	if (!nativeEvents.has(typeEvent)) typeEvent = originalTypeEvent;
	const handlerTypeEvent = baseTypeEvent in customEvents ? baseTypeEvent : typeEvent;
	return {
		isDelegated,
		callable,
		typeEvent,
		handlerTypeEvent
	};
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
	if (typeof originalTypeEvent !== "string" || !element) return;
	const { isDelegated, callable, typeEvent, handlerTypeEvent } = normalizeParameters(originalTypeEvent, handler, delegationFunction);
	const events = getElementEvents(element);
	const handlers = events[typeEvent] || (events[typeEvent] = {});
	const previousFunction = findHandler(handlers, callable, handlerTypeEvent, isDelegated ? handler : null);
	if (previousFunction) {
		previousFunction.oneOff = previousFunction.oneOff && oneOff;
		return;
	}
	const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
	const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable, handlerTypeEvent) : bootstrapHandler(element, callable, handlerTypeEvent);
	fn.delegationSelector = isDelegated ? handler : null;
	fn.callable = callable;
	fn.handlerTypeEvent = handlerTypeEvent;
	fn.oneOff = oneOff;
	fn.uidEvent = uid;
	handlers[uid] = fn;
	element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler) {
	element.removeEventListener(typeEvent, handler, Boolean(handler.delegationSelector));
	delete events[typeEvent][handler.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
	const storeElementEvent = events[typeEvent] || {};
	for (const [handlerKey, event] of Object.entries(storeElementEvent)) if (handlerKey.includes(namespace)) removeHandler(element, events, typeEvent, event);
}
function trigger(element, event, args) {
	if (typeof event !== "string" || !element) return null;
	const evt = hydrateObj(new Event(event, {
		bubbles: true,
		cancelable: true
	}), args);
	element.dispatchEvent(evt);
	return evt;
}
const EventHandler = {
	on(element, event, handler, delegationFunction) {
		addHandler(element, event, handler, delegationFunction, false);
	},
	one(element, event, handler, delegationFunction) {
		addHandler(element, event, handler, delegationFunction, true);
	},
	off(element, originalTypeEvent, handler, delegationFunction) {
		if (typeof originalTypeEvent !== "string" || !element) return;
		const { isDelegated, callable, typeEvent, handlerTypeEvent } = normalizeParameters(originalTypeEvent, handler, delegationFunction);
		const inNamespace = typeEvent !== originalTypeEvent && handlerTypeEvent !== originalTypeEvent;
		const events = getElementEvents(element);
		const storeElementEvent = events[typeEvent] || {};
		const isNamespace = originalTypeEvent.startsWith(".");
		if (typeof callable !== "undefined") {
			if (!Object.keys(storeElementEvent).length) return;
			const fn = findHandler(storeElementEvent, callable, handlerTypeEvent, isDelegated ? handler : null);
			if (fn) removeHandler(element, events, typeEvent, fn);
			return;
		}
		if (isNamespace) for (const elementEvent of Object.keys(events)) removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
		for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
			const handlerKey = keyHandlers.replace(stripUidRegex, "");
			if (event.handlerTypeEvent === handlerTypeEvent && (!inNamespace || originalTypeEvent.includes(handlerKey))) removeHandler(element, events, typeEvent, event);
		}
	},
	trigger
};
function hydrateObj(obj, meta = {}) {
	for (const [key, value] of Object.entries(meta)) try {
		obj[key] = value;
	} catch {
		Object.defineProperty(obj, key, {
			configurable: true,
			get() {
				return value;
			}
		});
	}
	return obj;
}
//#endregion
//#region js/src/dom/manipulator.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dom/manipulator.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
function normalizeData(value) {
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === Number(value).toString()) return Number(value);
	if (value === "" || value === "null") return null;
	if (typeof value !== "string") return value;
	try {
		return JSON.parse(decodeURIComponent(value));
	} catch {
		return value;
	}
}
function normalizeDataKey(key) {
	return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}
const Manipulator = {
	setDataAttribute(element, key, value) {
		element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
	},
	removeDataAttribute(element, key) {
		element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
	},
	getDataAttributes(element) {
		if (!element) return {};
		const attributes = {};
		const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
		for (const key of bsKeys) {
			let pureKey = key.replace(/^bs/, "");
			pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
			attributes[pureKey] = normalizeData(element.dataset[key]);
		}
		return attributes;
	},
	getDataAttribute(element, key) {
		return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
	}
};
//#endregion
//#region js/src/util/index.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/index.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
const MAX_UID = 1e6;
const MILLISECONDS_MULTIPLIER = 1e3;
const TRANSITION_END = "transitionend";
/**
* Properly escape IDs selectors to handle weird IDs
*/
const parseSelector = (selector) => {
	if (selector && window.CSS && window.CSS.escape) selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
	return selector;
};
const toType = (object) => {
	if (object === null || object === void 0) return `${object}`;
	return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};
/**
* Public Util API
*/
const getUID = (prefix) => {
	do
		prefix += Math.floor(Math.random() * MAX_UID);
	while (document.getElementById(prefix));
	return prefix;
};
const getTransitionDurationFromElement = (element) => {
	if (!element) return 0;
	let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
	if (!Number.parseFloat(transitionDuration) && !Number.parseFloat(transitionDelay)) return 0;
	transitionDuration = transitionDuration.split(",")[0];
	transitionDelay = transitionDelay.split(",")[0];
	return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
const triggerTransitionEnd = (element) => {
	element.dispatchEvent(new Event(TRANSITION_END));
};
const isElement = (object) => {
	if (!object || typeof object !== "object") return false;
	return typeof object.nodeType !== "undefined";
};
const getElement = (object) => {
	if (isElement(object)) return object;
	if (typeof object === "string" && object.length > 0) return document.querySelector(parseSelector(object));
	return null;
};
const isVisible = (element) => {
	if (!isElement(element) || element.getClientRects().length === 0) return false;
	const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
	const closedDetails = element.closest("details:not([open])");
	if (!closedDetails) return elementIsVisible;
	if (closedDetails !== element) {
		const summary = element.closest("summary");
		if (summary && summary.parentNode !== closedDetails) return false;
		if (summary === null) return false;
	}
	return elementIsVisible;
};
const isDisabled = (element) => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
	if (element.classList.contains("disabled")) return true;
	const disableableElement = element;
	if (typeof disableableElement.disabled !== "undefined") return disableableElement.disabled;
	return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
};
const setAriaAttribute = (element, name, value) => {
	element.setAttribute(name, String(value));
};
const findShadowRoot = (element) => {
	if (!document.documentElement.attachShadow) return null;
	if (typeof element.getRootNode === "function") {
		const root = element.getRootNode();
		return root instanceof ShadowRoot ? root : null;
	}
	if (element instanceof ShadowRoot) return element;
	if (!element.parentNode) return null;
	return findShadowRoot(element.parentNode);
};
const noop = () => {};
const isRTL = () => document.documentElement.dir === "rtl";
const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
	return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
};
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
	if (!waitForTransition) {
		execute(callback);
		return;
	}
	const emulatedDuration = getTransitionDurationFromElement(transitionElement) + 5;
	let called = false;
	const handler = ({ target }) => {
		if (target !== transitionElement) return;
		called = true;
		transitionElement.removeEventListener(TRANSITION_END, handler);
		execute(callback);
	};
	transitionElement.addEventListener(TRANSITION_END, handler);
	setTimeout(() => {
		if (!called) triggerTransitionEnd(transitionElement);
	}, emulatedDuration);
};
/**
* Return the previous/next element of a list.
*
* @param list            The list of elements
* @param activeElement   The active element
* @param shouldGetNext   Choose to get next or previous element
* @param isCycleAllowed
* @return The proper element
*/
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
	const listLength = list.length;
	let index = list.indexOf(activeElement);
	if (index === -1) return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
	index += shouldGetNext ? 1 : -1;
	if (isCycleAllowed) index = (index + listLength) % listLength;
	return list[Math.max(0, Math.min(index, listLength - 1))];
};
//#endregion
//#region js/src/util/config.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/config.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Class definition
*/
var Config = class {
	static get Default() {
		return {};
	}
	static get DefaultType() {
		return {};
	}
	static get NAME() {
		throw new Error("You have to implement the static method \"NAME\", for each component!");
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
		const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
		return {
			...this.constructor.Default,
			...typeof jsonConfig === "object" ? jsonConfig : {},
			...isElement(element) ? Manipulator.getDataAttributes(element) : {},
			...typeof config === "object" ? config : {}
		};
	}
	_typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
		for (const [property, expectedTypes] of Object.entries(configTypes)) {
			const value = config[property];
			const valueType = isElement(value) ? "element" : toType(value);
			if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
		}
	}
};
//#endregion
//#region js/src/base-component.ts
/**
* --------------------------------------------------------------------------
* Bootstrap base-component.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const VERSION = "6.0.0-alpha1";
/**
* Class definition
*/
var BaseComponent = class extends Config {
	constructor(element, config) {
		super();
		element = getElement(element);
		if (!element) return;
		this._element = element;
		this._config = this._getConfig(config);
		const existingInstance = data_default.get(this._element, this.constructor.DATA_KEY);
		if (existingInstance) existingInstance.dispose();
		data_default.set(this._element, this.constructor.DATA_KEY, this);
	}
	dispose() {
		data_default.remove(this._element, this.constructor.DATA_KEY);
		EventHandler.off(this._element, this.constructor.EVENT_KEY);
		for (const propertyName of Object.getOwnPropertyNames(this)) this[propertyName] = null;
	}
	_queueCallback(callback, element, isAnimated = true) {
		return new Promise((resolve) => {
			executeAfterTransition(() => {
				if (this._element) callback();
				resolve();
			}, element, isAnimated);
		});
	}
	_getConfig(config) {
		config = this._mergeConfigObj(config, this._element);
		config = this._configAfterMerge(config);
		this._typeCheckConfig(config);
		return config;
	}
	static getInstance(element) {
		return data_default.get(getElement(element), this.DATA_KEY);
	}
	static getOrCreateInstance(element, config = {}) {
		return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
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
};
//#endregion
//#region js/src/dom/selector-engine.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dom/selector-engine.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
const getSelector = (element) => {
	let selector = element.getAttribute("data-bs-target");
	if (!selector || selector === "#") {
		let hrefAttribute = element.getAttribute("href");
		if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) return null;
		if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
		selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
	}
	return selector ? selector.split(",").map((sel) => parseSelector(sel)).join(",") : null;
};
const SelectorEngine = {
	find(selector, element = document.documentElement) {
		return [...Element.prototype.querySelectorAll.call(element, selector)];
	},
	findOne(selector, element = document.documentElement) {
		return Element.prototype.querySelector.call(element, selector);
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
	closest(element, selector) {
		return Element.prototype.closest.call(element, selector);
	},
	prev(element, selector) {
		let previous = element.previousElementSibling;
		while (previous) {
			if (previous.matches(selector)) return [previous];
			previous = previous.previousElementSibling;
		}
		return [];
	},
	next(element, selector) {
		let next = element.nextElementSibling;
		while (next) {
			if (next.matches(selector)) return [next];
			next = next.nextElementSibling;
		}
		return [];
	},
	getSelectorFromElement(element) {
		const selector = getSelector(element);
		if (selector) return SelectorEngine.findOne(selector) ? selector : null;
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
//#endregion
//#region js/src/util/component-functions.ts
const enableDismissTrigger = (component, method = "hide") => {
	const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	const name = component.NAME;
	EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
		if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
		if (isDisabled(this)) return;
		const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}, [class*=":${name}"]`);
		component.getOrCreateInstance(target)[method]();
	});
};
const eventActionOnPlugin = (Plugin, onEvent, stringSelector, method, callback = null) => {
	eventAction(`${onEvent}.${Plugin.NAME}`, stringSelector, (data) => {
		const instances = data.targets.filter(Boolean).map((element) => Plugin.getOrCreateInstance(element));
		if (typeof callback === "function") callback({
			...data,
			instances
		});
		for (const instance of instances) instance[method]();
	});
};
const eventAction = (onEvent, stringSelector, callback) => {
	const selector = `${stringSelector}:not(.disabled):not(:disabled)`;
	EventHandler.on(document, onEvent, selector, function(event) {
		if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
		const selector = SelectorEngine.getSelectorFromElement(this);
		callback({
			targets: selector ? SelectorEngine.find(selector) : [this],
			event
		});
	});
};
//#endregion
//#region js/src/alert.ts
/**
* --------------------------------------------------------------------------
* Bootstrap alert.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$21 = "alert";
const EVENT_KEY$18 = `.bs.alert`;
const EVENT_CLOSE = `close${EVENT_KEY$18}`;
const EVENT_CLOSED = `closed${EVENT_KEY$18}`;
const CLASS_NAME_HIDING = "hiding";
const CLASS_NAME_SHOW$6 = "show";
/**
* Class definition
*/
var Alert = class extends BaseComponent {
	static get NAME() {
		return NAME$21;
	}
	async close() {
		if (EventHandler.trigger(this._element, EVENT_CLOSE).defaultPrevented) return;
		this._element.classList.remove(CLASS_NAME_SHOW$6);
		this._element.classList.add(CLASS_NAME_HIDING);
		const isAnimated = getTransitionDurationFromElement(this._element) > 0;
		await this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
	}
	_destroyElement() {
		this._element.remove();
		EventHandler.trigger(this._element, EVENT_CLOSED);
		this.dispose();
	}
};
/**
* Data API implementation
*/
enableDismissTrigger(Alert, "close");
//#endregion
//#region js/src/button.ts
/**
* --------------------------------------------------------------------------
* Bootstrap button.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$20 = "button";
const EVENT_KEY$17 = `.bs.button`;
const DATA_API_KEY$12 = ".data-api";
const CLASS_NAME_ACTIVE$4 = "active";
const SELECTOR_DATA_TOGGLE$10 = "[data-bs-toggle=\"button\"]";
const EVENT_CLICK_DATA_API$8 = `click${EVENT_KEY$17}${DATA_API_KEY$12}`;
const EVENT_DOM_CONTENT_LOADED$1 = `DOMContentLoaded${EVENT_KEY$17}${DATA_API_KEY$12}`;
/**
* Class definition
*/
var Button = class extends BaseComponent {
	static get NAME() {
		return NAME$20;
	}
	toggle() {
		setAriaAttribute(this._element, "aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$4));
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$8, SELECTOR_DATA_TOGGLE$10, (event) => {
	event.preventDefault();
	const button = event.target.closest(SELECTOR_DATA_TOGGLE$10);
	Button.getOrCreateInstance(button).toggle();
});
EventHandler.on(document, EVENT_DOM_CONTENT_LOADED$1, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE$10)) if (!element.hasAttribute("aria-pressed")) setAriaAttribute(element, "aria-pressed", element.classList.contains(CLASS_NAME_ACTIVE$4));
});
//#endregion
//#region js/src/carousel.ts
/**
* --------------------------------------------------------------------------
* Bootstrap carousel.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$19 = "carousel";
const EVENT_KEY$16 = `.bs.carousel`;
const DATA_API_KEY$11 = ".data-api";
const ARROW_LEFT_KEY$2 = "ArrowLeft";
const ARROW_RIGHT_KEY$2 = "ArrowRight";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";
const EVENT_SLIDE = `slide${EVENT_KEY$16}`;
const EVENT_SLID = `slid${EVENT_KEY$16}`;
const EVENT_KEYDOWN$2 = `keydown${EVENT_KEY$16}`;
const EVENT_MOUSEENTER$2 = `mouseenter${EVENT_KEY$16}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$16}`;
const EVENT_POINTERDOWN$1 = `pointerdown${EVENT_KEY$16}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$16}${DATA_API_KEY$11}`;
const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$16}${DATA_API_KEY$11}`;
const CLASS_NAME_CAROUSEL = "carousel";
const CLASS_NAME_ACTIVE$3 = "active";
const CLASS_NAME_FADE = "carousel-fade";
const CLASS_NAME_CENTER = "carousel-center";
const CLASS_NAME_AUTO = "carousel-auto";
const CLASS_NAME_CLONE = "carousel-item-clone";
const CLASS_NAME_PAUSED = "paused";
const CLASS_NAME_PLAYING = "carousel-playing";
const PROPERTY_INTERVAL = "--bs-carousel-interval";
const SCROLL_DURATION = 300;
const ACTIVE_RATIO_TOLERANCE = .05;
const SELECTOR_ACTIVE = ".active";
const SELECTOR_ITEM = `.carousel-item:not(.${CLASS_NAME_CLONE})`;
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_INNER$1 = ".carousel-inner";
const SELECTOR_INDICATORS = ".carousel-indicators";
const SELECTOR_PLAY_PAUSE = ".carousel-control-play-pause";
const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
const SELECTOR_DATA_SLIDE_PREV = "[data-bs-slide=\"prev\"]";
const SELECTOR_DATA_SLIDE_NEXT = "[data-bs-slide=\"next\"]";
const SELECTOR_DATA_AUTOPLAY = "[data-bs-autoplay=\"true\"]";
const KEY_TO_DIRECTION = {
	[ARROW_LEFT_KEY$2]: DIRECTION_RIGHT,
	[ARROW_RIGHT_KEY$2]: DIRECTION_LEFT
};
const ENDS_STOP = "stop";
const ENDS_WRAP = "wrap";
const ENDS_LOOP = "loop";
const Default$18 = {
	autoplay: false,
	ends: ENDS_LOOP,
	interval: 5e3,
	keyboard: true,
	pause: "hover"
};
const DefaultType$18 = {
	autoplay: "boolean",
	ends: "string",
	interval: "number",
	keyboard: "boolean",
	pause: "(string|boolean)"
};
const easeInOutCubic = (progress) => progress < .5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
/**
* Class definition
*/
var Carousel = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._viewport = SelectorEngine.findOne(SELECTOR_INNER$1, this._element) || this._element;
		this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
		this._playPauseElement = SelectorEngine.findOne(SELECTOR_PLAY_PAUSE, this._element);
		this._prevControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_PREV, this._element);
		this._nextControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_NEXT, this._element);
		this._interval = null;
		this._observer = null;
		this._scrollFrame = null;
		this._looping = false;
		this._visibility = /* @__PURE__ */ new Map();
		this._playing = this._config.autoplay;
		this._activeIndex = this._initialActiveIndex();
		this._addEventListeners();
		this._observeItems();
		this._refreshActiveState();
		if (this._playing) this.cycle();
		this._updatePlayPauseControl();
	}
	static get Default() {
		return Default$18;
	}
	static get DefaultType() {
		return DefaultType$18;
	}
	static get NAME() {
		return NAME$19;
	}
	next() {
		this.to(this._navIndex() + 1);
	}
	nextWhenVisible() {
		if (document.visibilityState === "visible" && isVisible(this._element)) this.next();
	}
	prev() {
		this.to(this._navIndex() - 1);
	}
	pause() {
		this._clearInterval();
		this._element.classList.remove(CLASS_NAME_PLAYING);
	}
	cycle() {
		this._clearInterval();
		this._scheduleAutoplay();
		this._element.classList.add(CLASS_NAME_PLAYING);
	}
	to(index) {
		if (this._looping) return;
		const items = this._getItems();
		const rawIndex = Number.parseInt(index, 10);
		if (this._config.ends === ENDS_LOOP && !this._prefersReducedMotion() && this._canLoop()) {
			if (rawIndex > items.length - 1) {
				this._loopTransition(true);
				return;
			}
			if (rawIndex < 0) {
				this._loopTransition(false);
				return;
			}
		}
		const targetIndex = this._normalizeIndex(rawIndex, items.length);
		const currentIndex = this._navIndex();
		if (targetIndex === null || targetIndex === currentIndex) return;
		if (EventHandler.trigger(this._element, EVENT_SLIDE, {
			relatedTarget: items[targetIndex],
			direction: this._direction(currentIndex, targetIndex),
			from: currentIndex,
			to: targetIndex
		}).defaultPrevented) return;
		if (this._isFade()) {
			this._fadeTo(targetIndex);
			return;
		}
		this._scrollToIndex(targetIndex);
	}
	dispose() {
		this._clearInterval();
		if (this._observer) this._observer.disconnect();
		if (this._scrollFrame !== null) cancelAnimationFrame(this._scrollFrame);
		for (const clone of SelectorEngine.find(`.${CLASS_NAME_CLONE}`, this._viewport)) clone.remove();
		this._viewport.style.scrollSnapType = "";
		EventHandler.off(this._viewport, EVENT_KEY$16);
		super.dispose();
	}
	_configAfterMerge(config) {
		if (![
			ENDS_STOP,
			ENDS_WRAP,
			ENDS_LOOP
		].includes(config.ends)) config.ends = Default$18.ends;
		return config;
	}
	_initialActiveIndex() {
		const active = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
		const index = active ? this._getItems().indexOf(active) : 0;
		return Math.max(index, 0);
	}
	_addEventListeners() {
		if (this._config.keyboard) EventHandler.on(this._element, EVENT_KEYDOWN$2, (event) => this._keydown(event));
		if (this._config.pause === "hover") {
			EventHandler.on(this._element, EVENT_MOUSEENTER$2, () => this.pause());
			EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
		}
		EventHandler.on(this._viewport, EVENT_POINTERDOWN$1, () => this._pauseFromInteraction());
	}
	_keydown(event) {
		if (/input|textarea/i.test(event.target.tagName)) return;
		const direction = KEY_TO_DIRECTION[event.key];
		if (direction) {
			event.preventDefault();
			this._pauseFromInteraction();
			if (direction === DIRECTION_RIGHT) this.prev();
			else this.next();
		}
	}
	_observeItems() {
		if (this._isFade() || typeof IntersectionObserver === "undefined") return;
		this._observer = new IntersectionObserver((entries) => this._handleIntersection(entries), {
			root: this._viewport,
			threshold: [
				0,
				.25,
				.5,
				.75,
				1
			]
		});
		for (const item of this._getItems()) this._observer.observe(item);
	}
	_handleIntersection(entries) {
		if (this._looping) return;
		for (const entry of entries) this._visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
		const ratios = this._getItems().map((item) => this._visibility.get(item) ?? 0);
		const maxRatio = Math.max(...ratios);
		let bestIndex = this._activeIndex;
		if (maxRatio > 0) bestIndex = ratios.findIndex((ratio) => ratio >= maxRatio - ACTIVE_RATIO_TOLERANCE);
		this._setActive(bestIndex);
		this._updateEndControls();
	}
	_navIndex() {
		if (this._isFade() || this._viewport.scrollWidth - this._viewport.clientWidth <= 0) return this._activeIndex;
		let index = this._activeIndex;
		let smallestDelta = Number.POSITIVE_INFINITY;
		for (const [itemIndex, item] of this._getItems().entries()) {
			const delta = Math.abs(this._scrollDelta(item));
			if (delta < smallestDelta) {
				smallestDelta = delta;
				index = itemIndex;
			}
		}
		return index;
	}
	_scrollToIndex(index) {
		const item = this._getItems()[index];
		if (!item) return;
		const left = this._scrollDelta(item);
		if (Math.abs(left) < 1) return;
		const targetLeft = this._viewport.scrollLeft + left;
		this._viewport.style.scrollSnapType = "none";
		this._animateScroll(targetLeft, () => {
			this._viewport.style.scrollSnapType = "";
			if (!this._observer) this._setActive(index);
			this._updateEndControls();
		});
	}
	_animateScroll(targetLeft, onComplete) {
		if (this._scrollFrame !== null) {
			cancelAnimationFrame(this._scrollFrame);
			this._scrollFrame = null;
		}
		const startLeft = this._viewport.scrollLeft;
		const distance = targetLeft - startLeft;
		if (this._prefersReducedMotion() || typeof requestAnimationFrame === "undefined") {
			this._viewport.scrollTo({
				left: targetLeft,
				behavior: "instant"
			});
			onComplete();
			return;
		}
		let startTime = null;
		const step = (now) => {
			if (startTime === null) startTime = now;
			const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
			this._viewport.scrollTo({
				left: startLeft + distance * easeInOutCubic(progress),
				behavior: "instant"
			});
			if (progress < 1) {
				this._scrollFrame = requestAnimationFrame(step);
				return;
			}
			this._viewport.scrollTo({
				left: targetLeft,
				behavior: "instant"
			});
			this._scrollFrame = null;
			onComplete();
		};
		this._scrollFrame = requestAnimationFrame(step);
	}
	_scrollDelta(element) {
		const viewportRect = this._viewport.getBoundingClientRect();
		const rect = element.getBoundingClientRect();
		if (this._element.classList.contains(CLASS_NAME_CENTER)) return rect.left + rect.width / 2 - (viewportRect.left + viewportRect.width / 2);
		const padStart = Number.parseFloat(getComputedStyle(this._viewport).scrollPaddingInlineStart) || 0;
		return isRTL() ? rect.right - (viewportRect.right - padStart) : rect.left - (viewportRect.left + padStart);
	}
	_loopTransition(isNext) {
		const items = this._getItems();
		const last = items.length - 1;
		const fromIndex = this._activeIndex;
		const toIndex = isNext ? 0 : last;
		const direction = this._loopDirection(isNext);
		if (EventHandler.trigger(this._element, EVENT_SLIDE, {
			relatedTarget: items[toIndex],
			direction,
			from: fromIndex,
			to: toIndex
		}).defaultPrevented) return;
		this._looping = true;
		const clone = (isNext ? items[0] : items[last]).cloneNode(true);
		clone.classList.add(CLASS_NAME_CLONE);
		clone.classList.remove(CLASS_NAME_ACTIVE$3);
		clone.removeAttribute("id");
		for (const node of SelectorEngine.find("[id]", clone)) node.removeAttribute("id");
		clone.setAttribute("aria-hidden", "true");
		clone.inert = true;
		this._viewport.style.scrollSnapType = "none";
		if (isNext) this._viewport.append(clone);
		else {
			this._viewport.prepend(clone);
			this._jumpScroll(this._scrollDelta(items[fromIndex]));
		}
		this._animateScroll(this._viewport.scrollLeft + this._scrollDelta(clone), () => {
			clone.remove();
			this._jumpScroll(this._scrollDelta(items[toIndex]));
			this._activeIndex = toIndex;
			this._refreshActiveState();
			EventHandler.trigger(this._element, EVENT_SLID, {
				relatedTarget: items[toIndex],
				direction,
				from: fromIndex,
				to: toIndex
			});
			this._viewport.style.scrollSnapType = "";
			this._looping = false;
		});
	}
	_loopDirection(isNext) {
		if (isRTL()) return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
		return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
	}
	_jumpScroll(delta) {
		this._viewport.style.scrollSnapType = "none";
		this._viewport.scrollBy({
			left: delta,
			top: 0,
			behavior: "instant"
		});
	}
	_fadeTo(index) {
		this._setActive(index);
	}
	_setActive(index) {
		const items = this._getItems();
		if (index === this._activeIndex || !items[index]) return;
		const from = this._activeIndex;
		this._activeIndex = index;
		this._refreshActiveState();
		EventHandler.trigger(this._element, EVENT_SLID, {
			relatedTarget: items[index],
			direction: this._direction(from, index),
			from,
			to: index
		});
	}
	_refreshActiveState() {
		const items = this._getItems();
		for (const [index, item] of items.entries()) item.classList.toggle(CLASS_NAME_ACTIVE$3, index === this._activeIndex);
		this._setActiveIndicatorElement(this._activeIndex);
		this._updateEndControls();
	}
	_updateEndControls() {
		if (this._config.ends !== ENDS_STOP) return;
		const viewport = this._viewport;
		const maxScroll = viewport.scrollWidth - viewport.clientWidth;
		let atStart;
		let atEnd;
		if (maxScroll > 0) {
			const progress = Math.abs(viewport.scrollLeft);
			atStart = progress <= 1;
			atEnd = progress >= maxScroll - 1;
		} else {
			const last = this._getItems().length - 1;
			atStart = this._activeIndex <= 0;
			atEnd = this._activeIndex >= last;
		}
		this._setControlsDisabled(this._prevControls, atStart);
		this._setControlsDisabled(this._nextControls, atEnd);
	}
	_setControlsDisabled(controls, disabled) {
		for (const control of controls) {
			if (disabled && control === document.activeElement) ((controls === this._prevControls ? this._nextControls : this._prevControls)[0] ?? this._viewport).focus({ preventScroll: true });
			control.disabled = disabled;
		}
	}
	_setActiveIndicatorElement(index) {
		if (!this._indicatorsElement) return;
		const active = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
		if (active) {
			active.classList.remove(CLASS_NAME_ACTIVE$3);
			active.removeAttribute("aria-current");
		}
		const newActive = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
		if (newActive) {
			newActive.classList.add(CLASS_NAME_ACTIVE$3);
			newActive.setAttribute("aria-current", "true");
		}
	}
	_normalizeIndex(index, length) {
		if (Number.isNaN(index) || length === 0) return null;
		if (index < 0) return this._wrapsAround() ? length - 1 : null;
		if (index > length - 1) return this._wrapsAround() ? 0 : null;
		return index;
	}
	_wrapsAround() {
		return this._config.ends === ENDS_WRAP || this._config.ends === ENDS_LOOP;
	}
	_canLoop() {
		if (this._isFade() || this._getItems().length < 2) return false;
		const styles = getComputedStyle(this._element);
		const num = (name) => Number.parseFloat(styles.getPropertyValue(name)) || 0;
		return (num("--bs-carousel-items") || 1) === 1 && num("--bs-carousel-items-peek") === 0 && !this._element.classList.contains(CLASS_NAME_CENTER) && !this._element.classList.contains(CLASS_NAME_AUTO);
	}
	_direction(from, to) {
		const isNext = to > from;
		if (isRTL()) return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
		return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
	}
	_scheduleAutoplay(index = this._activeIndex) {
		const interval = this._itemInterval(index);
		this._element.style.setProperty(PROPERTY_INTERVAL, `${interval}ms`);
		this._interval = setTimeout(() => {
			const upcoming = this._upcomingIndex();
			this.nextWhenVisible();
			if (upcoming === null) {
				this.pause();
				return;
			}
			this._scheduleAutoplay(upcoming);
		}, interval);
	}
	_upcomingIndex() {
		return this._normalizeIndex(this._navIndex() + 1, this._getItems().length);
	}
	_itemInterval(index = this._activeIndex) {
		const item = this._getItems()[index];
		const interval = item ? Number.parseInt(item.getAttribute("data-bs-interval"), 10) : NaN;
		return Number.isNaN(interval) ? this._config.interval : interval;
	}
	_maybeEnableCycle() {
		if (!this._playing) return;
		this.cycle();
	}
	_pauseFromInteraction() {
		this._playing = false;
		this.pause();
		this._updatePlayPauseControl();
	}
	_togglePlayPause() {
		if (this._playing) {
			this._pauseFromInteraction();
			return;
		}
		this._playing = true;
		this.cycle();
		this._updatePlayPauseControl();
	}
	_updatePlayPauseControl() {
		if (!this._playPauseElement) return;
		this._playPauseElement.classList.toggle(CLASS_NAME_PAUSED, !this._playing);
		const label = this._playPauseElement.getAttribute(this._playing ? "data-bs-pause-label" : "data-bs-play-label");
		if (label) this._playPauseElement.setAttribute("aria-label", label);
	}
	_isFade() {
		return this._element.classList.contains(CLASS_NAME_FADE);
	}
	_prefersReducedMotion() {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	_getItems() {
		return SelectorEngine.find(SELECTOR_ITEM, this._element);
	}
	_clearInterval() {
		if (this._interval) {
			clearTimeout(this._interval);
			this._interval = null;
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DATA_SLIDE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
	event.preventDefault();
	const carousel = Carousel.getOrCreateInstance(target);
	carousel._pauseFromInteraction();
	const slideIndex = this.getAttribute("data-bs-slide-to");
	if (slideIndex) {
		carousel.to(slideIndex);
		return;
	}
	if (Manipulator.getDataAttribute(this, "slide") === "next") {
		carousel.next();
		return;
	}
	carousel.prev();
});
EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_PLAY_PAUSE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
	event.preventDefault();
	Carousel.getOrCreateInstance(target)._togglePlayPause();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
	const carousels = SelectorEngine.find(SELECTOR_DATA_AUTOPLAY);
	for (const carousel of carousels) Carousel.getOrCreateInstance(carousel);
});
//#endregion
//#region js/src/collapse.ts
/**
* --------------------------------------------------------------------------
* Bootstrap collapse.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$18 = "collapse";
const EVENT_KEY$15 = `.bs.collapse`;
const DATA_API_KEY$10 = ".data-api";
const EVENT_SHOW$7 = `show${EVENT_KEY$15}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$15}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$15}`;
const EVENT_HIDDEN$8 = `hidden${EVENT_KEY$15}`;
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$15}${DATA_API_KEY$10}`;
const CLASS_NAME_SHOW$5 = "show";
const CLASS_NAME_COLLAPSE = "collapse";
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const SELECTOR_ACTIVES = ".collapse.show";
const SELECTOR_DATA_TOGGLE$9 = "[data-bs-toggle=\"collapse\"]";
const Default$17 = { parent: null };
const DefaultType$17 = { parent: "(null|element)" };
/**
* Class definition
*/
var Collapse = class Collapse extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._isTransitioning = false;
		this._triggerArray = [];
		const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$9);
		for (const elem of toggleList) {
			const selector = SelectorEngine.getSelectorFromElement(elem);
			const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
			if (selector !== null && filterElement.length) this._triggerArray.push(elem);
		}
		this._initializeChildren();
		if (!this._config.parent) this._setAriaExpanded(this._triggerArray, this._isShown());
	}
	static get Default() {
		return Default$17;
	}
	static get DefaultType() {
		return DefaultType$17;
	}
	static get NAME() {
		return NAME$18;
	}
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}
	async show() {
		if (this._isTransitioning || this._isShown()) return;
		let activeChildren = [];
		if (this._config.parent) activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element && !this._sharesTrigger(element)).map((element) => Collapse.getOrCreateInstance(element));
		if (activeChildren.length && activeChildren[0]._isTransitioning) return;
		if (EventHandler.trigger(this._element, EVENT_SHOW$7).defaultPrevented) return;
		for (const activeInstance of activeChildren) activeInstance.hide();
		this._element.classList.add(CLASS_NAME_SHOW$5);
		this._setAriaExpanded(this._triggerArray, true);
		this._isTransitioning = true;
		const complete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_SHOWN$6);
		};
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	async hide() {
		if (this._isTransitioning || !this._isShown()) return;
		if (EventHandler.trigger(this._element, EVENT_HIDE$6).defaultPrevented) return;
		this._element.classList.remove(CLASS_NAME_SHOW$5);
		for (const trigger of this._triggerArray) {
			const element = SelectorEngine.getElementFromSelector(trigger);
			if (element && !this._isShown(element)) this._setAriaExpanded([trigger], false);
		}
		this._isTransitioning = true;
		const complete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_HIDDEN$8);
		};
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	_isShown(element = this._element) {
		return element.classList.contains(CLASS_NAME_SHOW$5);
	}
	_isAnimated() {
		return getTransitionDurationFromElement(this._element) > 0;
	}
	_sharesTrigger(element) {
		return this._triggerArray.some((trigger) => SelectorEngine.getMultipleElementsFromSelector(trigger).includes(element));
	}
	_configAfterMerge(config) {
		config.parent = getElement(config.parent);
		return config;
	}
	_initializeChildren() {
		if (!this._config.parent) return;
		const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$9);
		for (const element of children) {
			const selected = SelectorEngine.getElementFromSelector(element);
			if (selected) this._setAriaExpanded([element], this._isShown(selected));
		}
	}
	_getFirstLevelChildren(selector) {
		const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
		return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
	}
	_setAriaExpanded(triggerArray, isOpen) {
		if (!triggerArray.length) return;
		for (const element of triggerArray) setAriaAttribute(element, "aria-expanded", isOpen);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$9, function(event) {
	if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") event.preventDefault();
	for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) Collapse.getOrCreateInstance(element).toggle();
});
//#endregion
//#region js/src/util/floating-ui.ts
/**
* Breakpoints for responsive placement (matches SCSS $breakpoints)
*/
const BREAKPOINTS = {
	sm: 576,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536
};
/**
* Parse a placement string that may contain responsive prefixes
* Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
*
* @param placementString - The placement string to parse
* @param defaultPlacement - The default placement to use for xs/base
* @returns Object with breakpoint keys and placement values, or null if not responsive
*/
const parseResponsivePlacement = (placementString, defaultPlacement = "bottom") => {
	if (!placementString || !placementString.includes(":")) return null;
	const parts = placementString.split(/\s+/);
	const placements = { xs: defaultPlacement };
	for (const part of parts) if (part.includes(":")) {
		const [breakpoint, placement] = part.split(":");
		if (BREAKPOINTS[breakpoint] !== void 0) placements[breakpoint] = placement;
	} else placements.xs = part;
	return placements;
};
/**
* Get the active placement for the current viewport width
*
* @param responsivePlacements - Object with breakpoint keys and placement values
* @param defaultPlacement - Fallback placement
* @returns The active placement for current viewport
*/
const getResponsivePlacement = (responsivePlacements, defaultPlacement = "bottom") => {
	if (!responsivePlacements) return defaultPlacement;
	const viewportWidth = window.innerWidth;
	let activePlacement = responsivePlacements.xs || defaultPlacement;
	for (const breakpoint of [
		"sm",
		"md",
		"lg",
		"xl",
		"2xl"
	]) if (viewportWidth >= BREAKPOINTS[breakpoint] && responsivePlacements[breakpoint]) activePlacement = responsivePlacements[breakpoint];
	return activePlacement;
};
/**
* Create media query listeners for responsive placement changes
*
* @param callback - Callback to run when breakpoint changes
* @returns Array of { mql, handler } objects for cleanup
*/
const createBreakpointListeners = (callback) => {
	const listeners = [];
	for (const breakpoint of Object.keys(BREAKPOINTS)) {
		const minWidth = BREAKPOINTS[breakpoint];
		const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
		mql.addEventListener("change", callback);
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
* @param listeners - Array of { mql, handler } objects
*/
const disposeBreakpointListeners = (listeners) => {
	for (const { mql, handler } of listeners) mql.removeEventListener("change", handler);
};
/**
* Normalize an offset value into Floating UI's offset shape.
* A `[skidding, distance]` array becomes `{ mainAxis: distance, crossAxis: skidding }`;
* numbers and axis objects pass through unchanged.
*/
const toFloatingOffset = (value) => {
	return Array.isArray(value) ? {
		mainAxis: value[1] || 0,
		crossAxis: value[0] || 0
	} : value;
};
//#endregion
//#region js/src/menu.ts
/**
* --------------------------------------------------------------------------
* Bootstrap menu.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$17 = "menu";
const EVENT_KEY$14 = `.bs.menu`;
const DATA_API_KEY$9 = ".data-api";
const ESCAPE_KEY$2 = "Escape";
const TAB_KEY$1 = "Tab";
const ARROW_UP_KEY$2 = "ArrowUp";
const ARROW_DOWN_KEY$2 = "ArrowDown";
const ARROW_LEFT_KEY$1 = "ArrowLeft";
const ARROW_RIGHT_KEY$1 = "ArrowRight";
const HOME_KEY$2 = "Home";
const END_KEY$2 = "End";
const ENTER_KEY$1 = "Enter";
const SPACE_KEY$1 = " ";
const RIGHT_MOUSE_BUTTON = 2;
const SUBMENU_CLOSE_DELAY = 100;
const EVENT_HIDE$5 = `hide${EVENT_KEY$14}`;
const EVENT_HIDDEN$7 = `hidden${EVENT_KEY$14}`;
const EVENT_SHOW$6 = `show${EVENT_KEY$14}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$14}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$14}${DATA_API_KEY$9}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$14}${DATA_API_KEY$9}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$14}${DATA_API_KEY$9}`;
const CLASS_NAME_SHOW$4 = "show";
const SELECTOR_DATA_TOGGLE$8 = "[data-bs-toggle=\"menu\"]:not(.disabled):not(:disabled)";
const SELECTOR_MENU$2 = ".menu";
const SELECTOR_SUBMENU = ".submenu";
const SELECTOR_SUBMENU_TOGGLE = ".submenu > .menu-item";
const SELECTOR_NAVBAR_NAV = ".navbar-nav";
const SELECTOR_VISIBLE_ITEMS$1 = ".menu-item:not(.disabled):not(:disabled)";
const DEFAULT_PLACEMENT = "bottom-start";
const SUBMENU_PLACEMENT = "end-start";
const resolveLogicalPlacement = (placement) => {
	if (isRTL()) return placement.replace(/^start(?=-|$)/, "right").replace(/^end(?=-|$)/, "left");
	return placement.replace(/^start(?=-|$)/, "left").replace(/^end(?=-|$)/, "right");
};
const triangleSign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
const Default$16 = {
	autoClose: true,
	boundary: "clippingParents",
	container: false,
	display: "dynamic",
	offset: [0, 2],
	floatingConfig: null,
	menu: null,
	placement: DEFAULT_PLACEMENT,
	reference: "toggle",
	strategy: "absolute",
	submenuTrigger: "both",
	submenuDelay: SUBMENU_CLOSE_DELAY
};
const DefaultType$16 = {
	autoClose: "(boolean|string)",
	boundary: "(string|element)",
	container: "(string|element|boolean)",
	display: "string",
	offset: "(array|string|function)",
	floatingConfig: "(null|object|function)",
	menu: "(null|element)",
	placement: "string",
	reference: "(string|element|object)",
	strategy: "string",
	submenuTrigger: "string",
	submenuDelay: "number"
};
/**
* Class definition
*/
var Menu = class Menu extends BaseComponent {
	static _openInstances = /* @__PURE__ */ new Set();
	constructor(element, config) {
		if (typeof computePosition === "undefined") throw new TypeError("Bootstrap's menus require Floating UI (https://floating-ui.com)");
		super(element, config);
		this._floatingCleanup = null;
		this._mediaQueryListeners = [];
		this._responsivePlacements = null;
		this._parent = this._element.parentNode;
		this._openSubmenus = /* @__PURE__ */ new Map();
		this._submenuCloseTimeouts = /* @__PURE__ */ new Map();
		this._hoverIntentData = null;
		this._menu = this._config.menu || this._findMenu();
		if (!this._config.menu && this._menu) this._parent = this._findWrapper(this._menu);
		this._isSubmenu = this._parent.classList?.contains("submenu");
		this._menuOriginalParent = this._menu?.parentNode;
		this._parseResponsivePlacements();
		this._setupSubmenuListeners();
		this._initSubmenuTriggers();
	}
	static get Default() {
		return Default$16;
	}
	static get DefaultType() {
		return DefaultType$16;
	}
	static get NAME() {
		return NAME$17;
	}
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}
	async show() {
		if (isDisabled(this._element) || this._isShown()) return;
		const relatedTarget = { relatedTarget: this._element };
		if (EventHandler.trigger(this._element, EVENT_SHOW$6, relatedTarget).defaultPrevented) return;
		this._moveMenuToContainer();
		this._createFloating();
		if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) for (const element of document.body.children) EventHandler.on(element, "mouseover", noop);
		this._element.focus({ focusVisible: false });
		this._element.setAttribute("aria-expanded", "true");
		this._menu.classList.add(CLASS_NAME_SHOW$4);
		this._element.classList.add(CLASS_NAME_SHOW$4);
		if (this._parent) this._parent.classList.add(CLASS_NAME_SHOW$4);
		Menu._openInstances.add(this);
		await this._queueCallback(() => {
			if (this._isShown()) EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
		}, this._menu, this._isAnimated());
	}
	async hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		const relatedTarget = { relatedTarget: this._element };
		await this._completeHide(relatedTarget);
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
		if (this._floatingCleanup) this._updateFloatingPosition();
	}
	_findMenu() {
		const wrapper = SelectorEngine.closest(this._element, `:has(${SELECTOR_MENU$2})`);
		return SelectorEngine.next(this._element, SELECTOR_MENU$2)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU$2)[0] || SelectorEngine.findOne(SELECTOR_MENU$2, wrapper || this._parent);
	}
	_findWrapper(menu) {
		let wrapper = this._element.parentNode;
		while (wrapper instanceof Element && !wrapper.contains(menu)) wrapper = wrapper.parentNode;
		return wrapper instanceof Element ? wrapper : this._element.parentNode;
	}
	async _completeHide(relatedTarget) {
		if (EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget).defaultPrevented) return;
		this._closeAllSubmenus();
		if ("ontouchstart" in document.documentElement) for (const element of document.body.children) EventHandler.off(element, "mouseover", noop);
		this._menu.classList.remove(CLASS_NAME_SHOW$4);
		this._element.classList.remove(CLASS_NAME_SHOW$4);
		if (this._parent) this._parent.classList.remove(CLASS_NAME_SHOW$4);
		this._element.setAttribute("aria-expanded", "false");
		Menu._openInstances.delete(this);
		await this._queueCallback(() => {
			if (this._isShown()) return;
			this._disposeFloating();
			this._restoreMenuToOriginalParent();
			Manipulator.removeDataAttribute(this._menu, "placement");
			Manipulator.removeDataAttribute(this._menu, "display");
			EventHandler.trigger(this._element, EVENT_HIDDEN$7, relatedTarget);
		}, this._menu, this._isAnimated());
	}
	_getConfig(config) {
		config = super._getConfig(config);
		if (typeof config.reference === "object" && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== "function") throw new TypeError(`${NAME$17.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
		return config;
	}
	_createFloating() {
		if (this._config.display === "static") {
			Manipulator.setDataAttribute(this._menu, "display", "static");
			return;
		}
		let referenceElement = this._element;
		if (this._config.reference === "parent") referenceElement = this._parent;
		else if (isElement(this._config.reference)) referenceElement = getElement(this._config.reference);
		else if (typeof this._config.reference === "object") referenceElement = this._config.reference;
		this._updateFloatingPosition(referenceElement);
		this._floatingCleanup = autoUpdate(referenceElement, this._menu, () => this._updateFloatingPosition(referenceElement));
	}
	async _updateFloatingPosition(referenceElement = null) {
		if (!this._menu) return;
		if (!referenceElement) if (this._config.reference === "parent") referenceElement = this._parent;
		else if (isElement(this._config.reference)) referenceElement = getElement(this._config.reference);
		else if (typeof this._config.reference === "object") referenceElement = this._config.reference;
		else referenceElement = this._element;
		const placement = this._getPlacement();
		const middleware = this._getFloatingMiddleware();
		const floatingConfig = this._getFloatingConfig(placement, middleware);
		await this._applyFloatingPosition(referenceElement, this._menu, floatingConfig.placement, floatingConfig.middleware, floatingConfig.strategy);
	}
	_isShown() {
		return this._menu.classList.contains(CLASS_NAME_SHOW$4);
	}
	_isAnimated() {
		return getTransitionDurationFromElement(this._menu) > 0;
	}
	_getPlacement() {
		const placement = this._responsivePlacements ? getResponsivePlacement(this._responsivePlacements, DEFAULT_PLACEMENT) : this._config.placement;
		return resolveLogicalPlacement(placement);
	}
	_parseResponsivePlacements() {
		this._responsivePlacements = parseResponsivePlacement(this._config.placement, DEFAULT_PLACEMENT);
		if (this._responsivePlacements) this._setupMediaQueryListeners();
	}
	_setupMediaQueryListeners() {
		this._disposeMediaQueryListeners();
		this._mediaQueryListeners = createBreakpointListeners(() => {
			if (this._isShown()) this._updateFloatingPosition();
		});
	}
	_disposeMediaQueryListeners() {
		disposeBreakpointListeners(this._mediaQueryListeners);
		this._mediaQueryListeners = [];
	}
	_getOffset() {
		const { offset: offsetConfig } = this._config;
		if (typeof offsetConfig === "string") return offsetConfig.split(",").map((value) => Number.parseInt(value, 10));
		if (typeof offsetConfig === "function") return ({ placement, rects }) => {
			return toFloatingOffset(offsetConfig({
				placement,
				reference: rects.reference,
				floating: rects.floating
			}, this._element));
		};
		return offsetConfig;
	}
	_getFloatingMiddleware() {
		const offsetValue = this._getOffset();
		return [
			offset(typeof offsetValue === "function" ? offsetValue : toFloatingOffset(offsetValue)),
			flip({
				fallbackPlacements: this._getFallbackPlacements(),
				fallbackStrategy: "initialPlacement"
			}),
			shift({ boundary: this._config.boundary === "clippingParents" ? "clippingAncestors" : this._config.boundary })
		];
	}
	_getFallbackPlacements() {
		return {
			bottom: [
				"top",
				"bottom-start",
				"bottom-end",
				"top-start",
				"top-end"
			],
			"bottom-start": [
				"top-start",
				"bottom-end",
				"top-end"
			],
			"bottom-end": [
				"top-end",
				"bottom-start",
				"top-start"
			],
			top: [
				"bottom",
				"top-start",
				"top-end",
				"bottom-start",
				"bottom-end"
			],
			"top-start": [
				"bottom-start",
				"top-end",
				"bottom-end"
			],
			"top-end": [
				"bottom-end",
				"top-start",
				"bottom-start"
			],
			right: [
				"left",
				"right-start",
				"right-end",
				"left-start",
				"left-end"
			],
			"right-start": [
				"left-start",
				"right-end",
				"left-end",
				"top-start",
				"bottom-start"
			],
			"right-end": [
				"left-end",
				"right-start",
				"left-start",
				"top-end",
				"bottom-end"
			],
			left: [
				"right",
				"left-start",
				"left-end",
				"right-start",
				"right-end"
			],
			"left-start": [
				"right-start",
				"left-end",
				"right-end",
				"top-start",
				"bottom-start"
			],
			"left-end": [
				"right-end",
				"left-start",
				"right-start",
				"top-end",
				"bottom-end"
			]
		}[this._getPlacement()] || [
			"top",
			"bottom",
			"right",
			"left"
		];
	}
	_getFloatingConfig(placement, middleware) {
		const defaultConfig = {
			placement,
			middleware,
			strategy: this._config.strategy
		};
		return {
			...defaultConfig,
			...execute(this._config.floatingConfig, [void 0, defaultConfig])
		};
	}
	_disposeFloating() {
		if (this._floatingCleanup) {
			this._floatingCleanup();
			this._floatingCleanup = null;
		}
	}
	_getContainer() {
		const { container } = this._config;
		if (container === false) return null;
		return container === true ? document.body : getElement(container);
	}
	_moveMenuToContainer() {
		const container = this._getContainer();
		if (!container || !this._menu) return;
		if (this._menu.parentNode !== container) container.append(this._menu);
	}
	_restoreMenuToOriginalParent() {
		if (!this._menuOriginalParent || !this._menu) return;
		if (this._menu.parentNode !== this._menuOriginalParent) this._menuOriginalParent.append(this._menu);
	}
	async _applyFloatingPosition(reference, floating, placement, middleware, strategy = "absolute") {
		if (!floating.isConnected) return null;
		const { x, y, placement: finalPlacement } = await computePosition(reference, floating, {
			placement,
			middleware,
			strategy
		});
		if (!floating.isConnected) return null;
		Object.assign(floating.style, {
			position: strategy,
			left: `${x}px`,
			top: `${y}px`,
			margin: "0"
		});
		Manipulator.setDataAttribute(floating, "placement", finalPlacement);
		return finalPlacement;
	}
	_setupSubmenuListeners() {
		if (this._config.submenuTrigger === "hover" || this._config.submenuTrigger === "both") {
			EventHandler.on(this._menu, "mouseenter", SELECTOR_SUBMENU_TOGGLE, (event) => {
				this._onSubmenuTriggerEnter(event);
			});
			EventHandler.on(this._menu, "mouseleave", SELECTOR_SUBMENU, (event) => {
				this._onSubmenuLeave(event);
			});
			EventHandler.on(this._menu, "mousemove", (event) => {
				this._trackMousePosition(event);
			});
		}
		if (this._config.submenuTrigger === "click" || this._config.submenuTrigger === "both") EventHandler.on(this._menu, "click", SELECTOR_SUBMENU_TOGGLE, (event) => {
			this._onSubmenuTriggerClick(event);
		});
	}
	_onSubmenuTriggerEnter(event) {
		const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
		if (!trigger) return;
		const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
		if (!submenu) return;
		this._cancelSubmenuCloseTimeout(submenu);
		this._closeSiblingSubmenus(submenuWrapper);
		this._openSubmenu(trigger, submenu, submenuWrapper);
	}
	_onSubmenuLeave(event) {
		const submenuWrapper = event.target.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
		if (!submenu || !this._openSubmenus.has(submenu)) return;
		if (this._isMovingTowardSubmenu(event, submenu)) return;
		this._scheduleSubmenuClose(submenu, submenuWrapper);
	}
	_onSubmenuTriggerClick(event) {
		const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
		if (!trigger) return;
		event.preventDefault();
		event.stopPropagation();
		const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
		if (!submenu) return;
		if (this._openSubmenus.has(submenu)) this._closeSubmenu(submenu, submenuWrapper);
		else {
			this._closeSiblingSubmenus(submenuWrapper);
			this._openSubmenu(trigger, submenu, submenuWrapper);
		}
	}
	_initSubmenuTriggers() {
		if (!this._menu) return;
		for (const trigger of SelectorEngine.find(SELECTOR_SUBMENU_TOGGLE, this._menu)) {
			if (!SelectorEngine.findOne(SELECTOR_MENU$2, trigger.parentElement)) continue;
			trigger.setAttribute("aria-haspopup", "true");
			if (!trigger.hasAttribute("aria-expanded")) trigger.setAttribute("aria-expanded", "false");
		}
	}
	_openSubmenu(trigger, submenu, submenuWrapper) {
		if (this._openSubmenus.has(submenu)) return;
		trigger.setAttribute("aria-expanded", "true");
		trigger.setAttribute("aria-haspopup", "true");
		submenu.style.opacity = "0";
		submenu.classList.add(CLASS_NAME_SHOW$4);
		submenuWrapper.classList.add(CLASS_NAME_SHOW$4);
		const cleanup = this._createSubmenuFloating(trigger, submenu, submenuWrapper);
		this._openSubmenus.set(submenu, cleanup);
		EventHandler.on(submenu, "mouseenter", () => {
			this._cancelSubmenuCloseTimeout(submenu);
		});
	}
	_closeSubmenu(submenu, submenuWrapper) {
		if (!this._openSubmenus.has(submenu)) return;
		const nestedSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} ${SELECTOR_MENU$2}.${CLASS_NAME_SHOW$4}`, submenu);
		for (const nested of nestedSubmenus) {
			const nestedWrapper = nested.closest(SELECTOR_SUBMENU);
			this._closeSubmenu(nested, nestedWrapper);
		}
		const trigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, submenuWrapper);
		const cleanup = this._openSubmenus.get(submenu);
		if (cleanup) cleanup();
		this._openSubmenus.delete(submenu);
		EventHandler.off(submenu, "mouseenter");
		if (trigger) trigger.setAttribute("aria-expanded", "false");
		submenu.classList.remove(CLASS_NAME_SHOW$4);
		submenuWrapper.classList.remove(CLASS_NAME_SHOW$4);
		submenu.style.opacity = "";
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
			if (siblingWrapper !== currentSubmenuWrapper) this._closeSubmenu(siblingMenu, siblingWrapper);
		}
	}
	_createSubmenuFloating(trigger, submenu, submenuWrapper) {
		const referenceElement = submenuWrapper;
		const placement = resolveLogicalPlacement(SUBMENU_PLACEMENT);
		const middleware = [
			offset({
				mainAxis: 0,
				crossAxis: -4
			}),
			flip({ fallbackPlacements: [
				resolveLogicalPlacement("start-start"),
				resolveLogicalPlacement("end-end"),
				resolveLogicalPlacement("start-end")
			] }),
			shift({ padding: 8 })
		];
		const updatePosition = () => this._applyFloatingPosition(referenceElement, submenu, placement, middleware).then((finalPlacement) => {
			submenu.style.opacity = "";
			return finalPlacement;
		});
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
		for (const timeoutId of this._submenuCloseTimeouts.values()) clearTimeout(timeoutId);
		this._submenuCloseTimeouts.clear();
	}
	_trackMousePosition(event) {
		this._hoverIntentData = {
			x: event.clientX,
			y: event.clientY,
			timestamp: Date.now()
		};
	}
	_isMovingTowardSubmenu(event, submenu) {
		if (!this._hoverIntentData) return false;
		const submenuRect = submenu.getBoundingClientRect();
		const currentPos = {
			x: event.clientX,
			y: event.clientY
		};
		const lastPos = {
			x: this._hoverIntentData.x,
			y: this._hoverIntentData.y
		};
		const targetX = isRTL() ? submenuRect.right : submenuRect.left;
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
		return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
	}
	_getItemsInMenu(menu) {
		return SelectorEngine.find(`:scope > ${SELECTOR_VISIBLE_ITEMS$1}, :scope > ${SELECTOR_SUBMENU} > ${SELECTOR_VISIBLE_ITEMS$1}`, menu).filter((element) => isVisible(element));
	}
	_selectMenuItem({ key, target }) {
		const currentMenu = target.closest(SELECTOR_MENU$2) || this._menu;
		const items = this._getItemsInMenu(currentMenu);
		if (!items.length) return;
		const nextItem = getNextActiveElement(items, target, key === ARROW_DOWN_KEY$2, !items.includes(target));
		nextItem.focus();
		this._closeUnrelatedSubmenus(currentMenu, nextItem);
	}
	_closeUnrelatedSubmenus(currentMenu, focusedElement) {
		for (const [submenu] of this._openSubmenus) {
			const submenuWrapper = submenu.closest(SELECTOR_SUBMENU);
			if (!submenuWrapper || submenuWrapper.parentElement !== currentMenu || submenuWrapper.contains(focusedElement)) continue;
			this._closeSubmenu(submenu, submenuWrapper);
		}
	}
	_handleSubmenuKeydown(event) {
		const { key, target } = event;
		const isRtl = isRTL();
		const enterKey = isRtl ? ARROW_LEFT_KEY$1 : ARROW_RIGHT_KEY$1;
		const exitKey = isRtl ? ARROW_RIGHT_KEY$1 : ARROW_LEFT_KEY$1;
		const submenuWrapper = target.closest(SELECTOR_SUBMENU);
		const isSubmenuToggle = target.matches(SELECTOR_SUBMENU_TOGGLE);
		if ((key === ENTER_KEY$1 || key === SPACE_KEY$1 || key === enterKey) && submenuWrapper && isSubmenuToggle) {
			event.preventDefault();
			event.stopPropagation();
			const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
			if (submenu) {
				this._closeSiblingSubmenus(submenuWrapper);
				this._openSubmenu(target, submenu, submenuWrapper);
				requestAnimationFrame(() => {
					const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS$1, submenu);
					if (firstItem) firstItem.focus();
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
				if (parentTrigger) parentTrigger.focus();
				return true;
			}
		}
		if (key === HOME_KEY$2 || key === END_KEY$2) {
			event.preventDefault();
			event.stopPropagation();
			const currentMenu = target.closest(SELECTOR_MENU$2);
			const items = this._getItemsInMenu(currentMenu);
			if (items.length) {
				const targetItem = key === HOME_KEY$2 ? items[0] : items.at(-1);
				targetItem.focus();
				this._closeUnrelatedSubmenus(currentMenu, targetItem);
			}
			return true;
		}
		return false;
	}
	static clearMenus(event) {
		if (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY$1) return;
		for (const instance of Menu._openInstances) {
			if (instance._config.autoClose === false) continue;
			const composedPath = event.composedPath();
			const isMenuTarget = composedPath.includes(instance._menu);
			if (composedPath.includes(instance._element) || instance._config.autoClose === "inside" && !isMenuTarget || instance._config.autoClose === "outside" && isMenuTarget) continue;
			const formAncestor = event.target.closest?.("form");
			const isInsideMenuForm = Boolean(formAncestor) && instance._menu.contains(formAncestor);
			if (instance._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName) || isInsideMenuForm)) continue;
			const relatedTarget = { relatedTarget: instance._element };
			if (event.type === "click") relatedTarget.clickEvent = event;
			instance._completeHide(relatedTarget);
		}
	}
	static _getToggleFromKeydownContext(element, event) {
		if (element.matches(SELECTOR_DATA_TOGGLE$8)) return element;
		for (const instance of Menu._openInstances) if (instance._element === event.target || instance._menu?.contains(event.target)) return instance._element;
		return SelectorEngine.prev(element, SELECTOR_DATA_TOGGLE$8)[0] || SelectorEngine.next(element, SELECTOR_DATA_TOGGLE$8)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$8, event.delegateTarget.parentNode);
	}
	static dataApiKeydownHandler(event) {
		const isInput = /input|textarea/i.test(event.target.tagName) || event.target.isContentEditable;
		const isEscapeEvent = event.key === ESCAPE_KEY$2;
		const isUpOrDownEvent = [ARROW_UP_KEY$2, ARROW_DOWN_KEY$2].includes(event.key);
		const isLeftOrRightEvent = [ARROW_LEFT_KEY$1, ARROW_RIGHT_KEY$1].includes(event.key);
		const isHomeOrEndEvent = [HOME_KEY$2, END_KEY$2].includes(event.key);
		const isEnterOrSpaceEvent = [ENTER_KEY$1, SPACE_KEY$1].includes(event.key);
		const isSubmenuTrigger = event.target.matches(SELECTOR_SUBMENU_TOGGLE);
		if (!isUpOrDownEvent && !isEscapeEvent && !isLeftOrRightEvent && !isHomeOrEndEvent && !(isEnterOrSpaceEvent && isSubmenuTrigger)) return;
		if (isInput && !isEscapeEvent) return;
		const getToggleButton = Menu._getToggleFromKeydownContext(this, event);
		if (!getToggleButton) return;
		const instance = Menu.getOrCreateInstance(getToggleButton);
		if ((isLeftOrRightEvent || isHomeOrEndEvent || isEnterOrSpaceEvent && isSubmenuTrigger) && instance._handleSubmenuKeydown(event)) return;
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
				if (parentTrigger) parentTrigger.focus();
				return;
			}
			instance.hide();
			getToggleButton.focus();
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$8, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU$2, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$5, Menu.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Menu.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE$8, function(event) {
	event.preventDefault();
	Menu.getOrCreateInstance(this).toggle();
});
//#endregion
//#region js/src/combobox.ts
/**
* --------------------------------------------------------------------------
* Bootstrap combobox.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$16 = "combobox";
const EVENT_KEY$13 = `.bs.combobox`;
const DATA_API_KEY$8 = ".data-api";
const ESCAPE_KEY$1 = "Escape";
const TAB_KEY = "Tab";
const ARROW_UP_KEY$1 = "ArrowUp";
const ARROW_DOWN_KEY$1 = "ArrowDown";
const HOME_KEY$1 = "Home";
const END_KEY$1 = "End";
const ENTER_KEY = "Enter";
const SPACE_KEY = " ";
const EVENT_CHANGE$3 = `change${EVENT_KEY$13}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$13}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$13}`;
const EVENT_HIDE$4 = `hide${EVENT_KEY$13}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$13}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$13}${DATA_API_KEY$8}`;
const CLASS_NAME_SHOW$3 = "show";
const CLASS_NAME_SELECTED = "selected";
const CLASS_NAME_PLACEHOLDER = "combobox-placeholder";
const SELECTOR_DATA_TOGGLE$7 = "[data-bs-toggle=\"combobox\"]";
const SELECTOR_MENU$1 = ".menu";
const SELECTOR_MENU_ITEM = ".menu-item[data-bs-value]";
const SELECTOR_VISIBLE_ITEMS = ".menu-item[data-bs-value]:not(.disabled):not(:disabled)";
const SELECTOR_VALUE = ".combobox-value";
const SELECTOR_SEARCH_INPUT = ".combobox-search-input";
const SELECTOR_NO_RESULTS = ".combobox-no-results";
const Default$15 = {
	boundary: "clippingParents",
	multiple: false,
	name: null,
	offset: [0, 2],
	placeholder: "",
	placement: "bottom-start",
	search: false,
	searchNormalize: false
};
const DefaultType$15 = {
	boundary: "(string|element)",
	multiple: "boolean",
	name: "(string|null)",
	offset: "(array|string|function)",
	placeholder: "string",
	placement: "string",
	search: "boolean",
	searchNormalize: "boolean"
};
/**
* Class definition
*/
var Combobox = class extends BaseComponent {
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
	static get Default() {
		return Default$15;
	}
	static get DefaultType() {
		return DefaultType$15;
	}
	static get NAME() {
		return NAME$16;
	}
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}
	async show() {
		if (isDisabled(this._toggle) || this._isShown()) return;
		if (EventHandler.trigger(this._toggle, EVENT_SHOW$5).defaultPrevented) return;
		this._menuInstance.show();
		if (this._searchInput) {
			this._searchInput.value = "";
			this._filterItems("");
			requestAnimationFrame(() => this._searchInput.focus());
		}
		EventHandler.trigger(this._toggle, EVENT_SHOWN$4);
	}
	async hide() {
		if (!this._isShown()) return;
		if (EventHandler.trigger(this._toggle, EVENT_HIDE$4).defaultPrevented) return;
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
		EventHandler.off(this._menu, EVENT_KEY$13);
		EventHandler.off(this._toggle, EVENT_KEY$13);
		super.dispose();
	}
	_isShown() {
		return this._menu.classList.contains(CLASS_NAME_SHOW$3);
	}
	_createHiddenInput() {
		const { name } = this._config;
		if (!name) return;
		this._hiddenInput = document.createElement("input");
		this._hiddenInput.type = "hidden";
		this._hiddenInput.name = name;
		this._hiddenInput.value = "";
		this._toggle.parentNode.insertBefore(this._hiddenInput, this._toggle);
	}
	_createMenuInstance() {
		this._menuInstance = new Menu(this._toggle, {
			menu: this._menu,
			autoClose: this._config.multiple ? "outside" : true,
			boundary: this._config.boundary,
			offset: this._config.offset,
			placement: this._config.placement
		});
	}
	_syncInitialSelection() {
		if (this._getSelectedItems().length > 0) {
			this._updateToggleText();
			this._updateHiddenInput();
		} else this._showPlaceholder();
	}
	_addEventListeners() {
		EventHandler.on(this._menu, "click", SELECTOR_MENU_ITEM, (event) => {
			const item = event.target.closest(SELECTOR_MENU_ITEM);
			if (!item || isDisabled(item)) return;
			event.preventDefault();
			event.stopPropagation();
			this._selectItem(item);
		});
		EventHandler.on(this._toggle, "keydown", (event) => {
			this._handleToggleKeydown(event);
		});
		EventHandler.on(this._menu, "keydown", (event) => {
			this._handleMenuKeydown(event);
		});
		if (this._searchInput) {
			EventHandler.on(this._searchInput, "input", () => {
				this._filterItems(this._searchInput.value);
			});
			EventHandler.on(this._searchInput, "keydown", (event) => {
				if (event.key === ARROW_DOWN_KEY$1) {
					event.preventDefault();
					const items = this._getVisibleItems();
					if (items.length > 0) items[0].focus();
				}
				if (event.key === ESCAPE_KEY$1) {
					this.hide();
					this._toggle.focus();
				}
			});
		}
	}
	_selectItem(item) {
		if (this._config.multiple) {
			item.classList.toggle(CLASS_NAME_SELECTED);
			setAriaAttribute(item, "aria-selected", item.classList.contains(CLASS_NAME_SELECTED));
		} else {
			const previouslySelected = SelectorEngine.find(`.${CLASS_NAME_SELECTED}`, this._menu);
			for (const prev of previouslySelected) {
				prev.classList.remove(CLASS_NAME_SELECTED);
				prev.setAttribute("aria-selected", "false");
			}
			item.classList.add(CLASS_NAME_SELECTED);
			item.setAttribute("aria-selected", "true");
		}
		this._updateToggleText();
		this._updateHiddenInput();
		const value = this._config.multiple ? this._getSelectedItems().map((el) => el.dataset.bsValue) : item.dataset.bsValue;
		EventHandler.trigger(this._toggle, EVENT_CHANGE$3, {
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
		if (this._config.multiple && selectedItems.length > 1) this._valueDisplay.textContent = `${selectedItems.length} selected`;
		else {
			const item = selectedItems[0];
			const label = SelectorEngine.findOne(".menu-item-content > span:first-child", item);
			this._valueDisplay.textContent = label ? label.textContent : item.textContent.trim();
		}
	}
	_showPlaceholder() {
		const { placeholder } = this._config;
		if (placeholder) {
			this._valueDisplay.textContent = placeholder;
			this._valueDisplay.classList.add(CLASS_NAME_PLACEHOLDER);
		}
	}
	_updateHiddenInput() {
		if (!this._hiddenInput) return;
		const values = this._getSelectedItems().map((el) => el.dataset.bsValue);
		this._hiddenInput.value = this._config.multiple ? values.join(",") : values[0] || "";
	}
	_getSelectedItems() {
		return SelectorEngine.find(`.${CLASS_NAME_SELECTED}`, this._menu);
	}
	_getVisibleItems() {
		return SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((item) => isVisible(item));
	}
	_filterItems(query) {
		const normalizedQuery = this._normalizeText(query.toLowerCase().trim());
		const items = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu);
		let visibleCount = 0;
		for (const item of items) {
			const text = this._normalizeText(item.textContent.toLowerCase().trim());
			const matches = !normalizedQuery || text.includes(normalizedQuery);
			item.style.display = matches ? "" : "none";
			if (matches) visibleCount++;
		}
		if (this._noResults) this._noResults.classList.toggle("d-none", visibleCount > 0);
	}
	_normalizeText(text) {
		if (this._config.searchNormalize) return text.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
		return text;
	}
	_handleToggleKeydown(event) {
		const { key } = event;
		if (key === ARROW_DOWN_KEY$1 || key === ARROW_UP_KEY$1) {
			event.preventDefault();
			if (!this._isShown()) this.show();
			const items = this._getVisibleItems();
			if (items.length > 0) (key === ARROW_DOWN_KEY$1 ? items[0] : items.at(-1)).focus();
			return;
		}
		if ((key === ENTER_KEY || key === SPACE_KEY) && !this._isShown()) {
			event.preventDefault();
			this.show();
		}
	}
	_handleMenuKeydown(event) {
		const { key, target } = event;
		if (key === ESCAPE_KEY$1) {
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
		const isInput = target.matches("input");
		if (key === ARROW_DOWN_KEY$1 || key === ARROW_UP_KEY$1) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length > 0) getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
			return;
		}
		if (key === HOME_KEY$1 || key === END_KEY$1) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length > 0) (key === HOME_KEY$1 ? items[0] : items.at(-1)).focus();
			return;
		}
		if ((key === ENTER_KEY || key === SPACE_KEY) && !isInput) {
			event.preventDefault();
			const item = target.closest(SELECTOR_MENU_ITEM);
			if (item && !isDisabled(item)) this._selectItem(item);
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$7, function(event) {
	event.preventDefault();
	Combobox.getOrCreateInstance(this).toggle();
});
EventHandler.on(document, "DOMContentLoaded", () => {
	for (const toggle of SelectorEngine.find(SELECTOR_DATA_TOGGLE$7)) Combobox.getOrCreateInstance(toggle);
});
//#endregion
//#region js/src/datepicker.ts
/**
* --------------------------------------------------------------------------
* Bootstrap datepicker.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$15 = "datepicker";
const EVENT_KEY$12 = `.bs.datepicker`;
const DATA_API_KEY$7 = ".data-api";
const EVENT_CHANGE$2 = `change${EVENT_KEY$12}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$12}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$12}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$12}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$12}`;
const EVENT_FOCUSIN$3 = `focusin${EVENT_KEY$12}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$12}${DATA_API_KEY$7}`;
const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY$12}${DATA_API_KEY$7}`;
const SELECTOR_DATA_TOGGLE$6 = "[data-bs-toggle=\"datepicker\"]";
const HIDE_DELAY = 100;
const Default$14 = {
	datepickerTheme: null,
	dateMin: null,
	dateMax: null,
	dateFormat: null,
	displayElement: null,
	displayMonthsCount: 1,
	firstWeekday: 1,
	inline: false,
	locale: "default",
	positionElement: null,
	selectedDates: [],
	selectionMode: "single",
	placement: "left",
	vcpOptions: {}
};
const DefaultType$14 = {
	datepickerTheme: "(null|string)",
	dateMin: "(null|string|number|object)",
	dateMax: "(null|string|number|object)",
	dateFormat: "(null|object|function)",
	displayElement: "(null|string|element|boolean)",
	displayMonthsCount: "number",
	firstWeekday: "number",
	inline: "boolean",
	locale: "string",
	positionElement: "(null|string|element)",
	selectedDates: "array",
	selectionMode: "string",
	placement: "string",
	vcpOptions: "object"
};
/**
* Class definition
*/
var Datepicker = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._calendar = null;
		this._isShown = false;
		this._initCalendar();
	}
	static get Default() {
		return Default$14;
	}
	static get DefaultType() {
		return DefaultType$14;
	}
	static get NAME() {
		return NAME$15;
	}
	toggle() {
		if (this._config.inline) return Promise.resolve();
		return this._isShown ? this.hide() : this.show();
	}
	async show() {
		if (this._config.inline) return;
		if (!this._calendar || isDisabled(this._element) || this._isShown) return;
		if (EventHandler.trigger(this._element, EVENT_SHOW$4).defaultPrevented) return;
		this._calendar.show();
		this._isShown = true;
		EventHandler.trigger(this._element, EVENT_SHOWN$3);
	}
	async hide() {
		if (this._config.inline) return;
		if (!this._calendar || !this._isShown) return;
		if (EventHandler.trigger(this._element, EVENT_HIDE$3).defaultPrevented) return;
		this._calendar.hide();
		this._isShown = false;
		EventHandler.trigger(this._element, EVENT_HIDDEN$5);
	}
	dispose() {
		if (this._themeObserver) {
			this._themeObserver.disconnect();
			this._themeObserver = null;
		}
		if (this._onFocusIn) EventHandler.off(document, EVENT_FOCUSIN$3, this._onFocusIn);
		if (this._calendar) this._calendar.destroy();
		this._calendar = null;
		super.dispose();
	}
	getSelectedDates() {
		const dates = this._calendar?.context?.selectedDates;
		return dates ? [...dates] : [];
	}
	setSelectedDates(dates) {
		if (this._calendar) this._calendar.set({ selectedDates: dates });
	}
	_initCalendar() {
		this._isInput = this._element.tagName === "INPUT";
		this._isInline = this._config.inline;
		if (this._isInline && !this._isInput) this._boundInput = this._element.querySelector("input[type=\"hidden\"], input[name]");
		this._positionElement = this._resolvePositionElement();
		this._displayElement = this._resolveDisplayElement();
		const calendarOptions = this._buildCalendarOptions();
		this._calendar = new Calendar(this._positionElement, calendarOptions);
		this._calendar.init();
		this._setupThemeObserver();
		this._setupDismissOnFocus();
		if (this._isInput && this._element.value) this._parseInputValue();
		this._updateDisplayWithSelectedDates();
	}
	_updateDisplayWithSelectedDates() {
		const { selectedDates } = this._config;
		if (!selectedDates || selectedDates.length === 0) return;
		const formattedDate = this._formatDateForInput(selectedDates);
		if (this._isInput) this._element.value = formattedDate;
		if (this._boundInput) this._boundInput.value = selectedDates.join(",");
		if (this._displayElement) this._displayElement.textContent = formattedDate;
	}
	_resolvePositionElement() {
		let { positionElement } = this._config;
		if (typeof positionElement === "string") positionElement = document.querySelector(positionElement);
		if (!positionElement && this._isInput && !this._isInline) {
			const parent = this._element.closest(".form-adorn");
			if (parent) positionElement = parent;
		}
		return positionElement || this._element;
	}
	_resolveDisplayElement() {
		const { displayElement } = this._config;
		if (typeof displayElement === "string") return document.querySelector(displayElement);
		if (displayElement === true || displayElement === null && !this._isInput && !this._isInline) return this._element.querySelector("[data-bs-datepicker-display]") || this._element;
		return displayElement;
	}
	_getThemeAncestor() {
		return this._element.closest("[data-bs-theme]");
	}
	_getEffectiveTheme() {
		const { datepickerTheme } = this._config;
		if (datepickerTheme) return datepickerTheme;
		return this._getThemeAncestor()?.getAttribute("data-bs-theme") || null;
	}
	_syncThemeAttribute(element) {
		if (!element) return;
		const theme = this._getEffectiveTheme();
		if (theme) element.setAttribute("data-bs-theme", theme);
		else element.removeAttribute("data-bs-theme");
	}
	_setupThemeObserver() {
		const ancestor = this._getThemeAncestor();
		if (!ancestor || this._config.datepickerTheme) return;
		this._themeObserver = new MutationObserver(() => {
			this._syncThemeAttribute(this._calendar?.context?.mainElement);
		});
		this._themeObserver.observe(ancestor, {
			attributes: true,
			attributeFilter: ["data-bs-theme"]
		});
	}
	_setupDismissOnFocus() {
		if (this._isInline) return;
		this._onFocusIn = (event) => {
			if (!this._isShown) return;
			const { target } = event;
			const mainElement = this._calendar?.context?.mainElement;
			if (target instanceof Node && (this._element.contains(target) || mainElement?.contains(target))) return;
			this.hide();
		};
		EventHandler.on(document, EVENT_FOCUSIN$3, this._onFocusIn);
	}
	_buildCalendarOptions() {
		const theme = this._getEffectiveTheme();
		const vcpTheme = !theme || theme === "auto" ? "system" : theme;
		const calendarOptions = {
			...this._config.vcpOptions,
			inputMode: !this._isInline,
			positionToInput: this._config.placement,
			firstWeekday: this._config.firstWeekday,
			locale: this._config.locale,
			selectionDatesMode: this._config.selectionMode,
			selectedDates: this._config.selectedDates,
			displayMonthsCount: this._config.displayMonthsCount,
			type: this._config.displayMonthsCount > 1 ? "multiple" : "default",
			selectedTheme: vcpTheme,
			themeAttrDetect: "[data-bs-theme]",
			onClickDate: (self, event) => this._handleDateClick(self, event),
			onInit: (self) => {
				this._syncThemeAttribute(self.context.mainElement);
			},
			onShow: () => {
				if (!this._calendar) return;
				this._isShown = true;
				this._syncThemeAttribute(this._calendar.context.mainElement);
			},
			onHide: () => {
				this._isShown = false;
			}
		};
		if (this._config.selectedDates.length > 0) {
			const firstDate = this._parseDate(this._config.selectedDates[0]);
			calendarOptions.selectedMonth = firstDate.getMonth();
			calendarOptions.selectedYear = firstDate.getFullYear();
		}
		if (this._config.dateMin) calendarOptions.dateMin = this._config.dateMin;
		if (this._config.dateMax) calendarOptions.dateMax = this._config.dateMax;
		return calendarOptions;
	}
	_handleDateClick(self, event) {
		const selectedDates = [...self.context.selectedDates];
		if (selectedDates.length > 0) {
			const formattedDate = this._formatDateForInput(selectedDates);
			if (this._isInput) this._element.value = formattedDate;
			if (this._boundInput) this._boundInput.value = selectedDates.join(",");
			if (this._displayElement) this._displayElement.textContent = formattedDate;
		}
		EventHandler.trigger(this._element, EVENT_CHANGE$2, {
			dates: selectedDates,
			event
		});
		this._maybeHideAfterSelection(selectedDates);
	}
	_maybeHideAfterSelection(selectedDates) {
		if (this._isInline) return;
		if (this._config.selectionMode === "single" && selectedDates.length > 0 || this._config.selectionMode === "multiple-ranged" && selectedDates.length >= 2) setTimeout(() => this.hide(), HIDE_DELAY);
	}
	_parseDate(dateStr) {
		const [year, month, day] = dateStr.split("-");
		return new Date(year, month - 1, day);
	}
	_formatDate(dateStr) {
		const date = this._parseDate(dateStr);
		const locale = this._config.locale === "default" ? void 0 : this._config.locale;
		const { dateFormat } = this._config;
		if (typeof dateFormat === "function") return dateFormat(date, locale);
		if (dateFormat && typeof dateFormat === "object") return new Intl.DateTimeFormat(locale, dateFormat).format(date);
		return date.toLocaleDateString(locale);
	}
	_formatDateForInput(dates) {
		if (dates.length === 0) return "";
		if (dates.length === 1) return this._formatDate(dates[0]);
		const separator = this._config.selectionMode === "multiple-ranged" ? " – " : ", ";
		return dates.map((d) => this._formatDate(d)).join(separator);
	}
	_parseInputValue() {
		const value = this._element.value.trim();
		if (!value) return;
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
			this._calendar.set({ selectedDates: [formatted] });
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$6, function(event) {
	if (this.tagName === "INPUT" || this.dataset.bsInline === "true") return;
	event.preventDefault();
	Datepicker.getOrCreateInstance(this).toggle();
});
EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE$6, function() {
	if (this.tagName !== "INPUT") return;
	Datepicker.getOrCreateInstance(this).show();
});
EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$12}${DATA_API_KEY$7}`, () => {
	const selector = `${SELECTOR_DATA_TOGGLE$6}[data-bs-inline="true"], ${SELECTOR_DATA_TOGGLE$6}[data-bs-selected-dates]`;
	for (const element of document.querySelectorAll(selector)) Datepicker.getOrCreateInstance(element);
});
//#endregion
//#region js/src/dialog-base.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dialog-base.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const CLASS_NAME_OPEN = "dialog-open";
/**
* Class definition
*
* Shared base class for Dialog and Drawer components that use
* the native <dialog> element. Provides common behavior for:
* - Show/hide/toggle lifecycle with events
* - Opening/closing via showModal()/show()/close()
* - Escape key handling (modal and non-modal)
* - Backdrop click handling
* - Static backdrop transition ("bounce")
* - Body scroll prevention
* - Transition coordination
* - Child component cleanup (tooltips, popovers, toasts)
*/
var DialogBase = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._isTransitioning = false;
		this._openedAsModal = false;
		this._addDialogListeners();
	}
	static get NAME() {
		return "dialogbase";
	}
	toggle(relatedTarget) {
		return this._element.open ? this.hide() : this.show(relatedTarget);
	}
	async show(relatedTarget) {
		if (this._element.open || this._isTransitioning) return;
		if (EventHandler.trigger(this._element, this.constructor.eventName("show"), { relatedTarget }).defaultPrevented) return;
		this._isTransitioning = true;
		this._onBeforeShow();
		const { modal, preventBodyScroll } = this._getShowOptions();
		this._showElement({
			modal,
			preventBodyScroll
		});
		await this._queueCallback(() => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, this.constructor.eventName("shown"), { relatedTarget });
		}, this._element, this._isAnimated());
	}
	async hide() {
		if (!this._element.open || this._isTransitioning) return;
		if (EventHandler.trigger(this._element, this.constructor.eventName("hide")).defaultPrevented) return;
		this._isTransitioning = true;
		this._hideElement();
		await this._queueCallback(() => {
			if (this._element.open) this._closeAndCleanup();
			this._element.classList.remove("hiding");
			this._onAfterHide();
			this._isTransitioning = false;
			EventHandler.trigger(this._element, this.constructor.eventName("hidden"));
		}, this._element, this._isAnimated());
	}
	dispose() {
		if (this._element.open) this._closeAndCleanup();
		EventHandler.off(this._element, "cancel", this._cancelHandler);
		super.dispose();
	}
	_getShowOptions() {
		return {
			modal: true,
			preventBodyScroll: true
		};
	}
	_onBeforeShow() {}
	_onAfterHide() {}
	_isAnimated() {
		return !this._element.classList.contains(this._getInstantClassName());
	}
	_getInstantClassName() {
		return "dialog-instant";
	}
	_getStaticClassName() {
		return "dialog-static";
	}
	_onCancel() {}
	_showElement({ modal = true, preventBodyScroll = true } = {}) {
		this._openedAsModal = modal;
		if (modal) this._element.showModal();
		else this._element.show();
		if (preventBodyScroll) document.documentElement.classList.add(CLASS_NAME_OPEN);
	}
	_hideElement() {
		this._hideChildComponents();
		this._element.classList.add("hiding");
		if (!this._shouldDeferClose()) this._closeAndCleanup();
	}
	_closeAndCleanup() {
		this._element.close();
		this._openedAsModal = false;
		if (!document.querySelector("dialog[open]:modal")) document.documentElement.classList.remove(CLASS_NAME_OPEN);
	}
	_shouldDeferClose() {
		return false;
	}
	_triggerBackdropTransition() {
		if (EventHandler.trigger(this._element, this.constructor.eventName("hidePrevented")).defaultPrevented) return;
		const staticClass = this._getStaticClassName();
		this._element.classList.add(staticClass);
		this._queueCallback(() => {
			this._element.classList.remove(staticClass);
		}, this._element);
	}
	_hideChildComponents() {
		for (const el of SelectorEngine.find("[data-bs-toggle=\"tooltip\"], [data-bs-toggle=\"popover\"]", this._element)) {
			const instance = data_default.getAny(el);
			if (instance && typeof instance.hide === "function") instance.hide();
		}
		for (const el of SelectorEngine.find(".toast.show", this._element)) {
			const instance = data_default.getAny(el);
			if (instance && typeof instance.hide === "function") instance.hide();
		}
	}
	_addDialogListeners() {
		const eventKey = this.constructor.EVENT_KEY;
		this._cancelHandler = (event) => {
			event.preventDefault();
			if (!this._config.keyboard) {
				this._triggerBackdropTransition();
				return;
			}
			this._onCancel();
			this.hide();
		};
		EventHandler.on(this._element, "cancel", this._cancelHandler);
		EventHandler.on(this._element, `keydown${eventKey}`, (event) => {
			if (event.key !== "Escape" || this._openedAsModal) return;
			event.preventDefault();
			if (!this._config.keyboard) return;
			this._onCancel();
			this.hide();
		});
		EventHandler.on(this._element, `click${eventKey}`, (event) => {
			if (event.target !== this._element || !this._openedAsModal) return;
			if (this._config.backdrop === "static") {
				this._triggerBackdropTransition();
				return;
			}
			this.hide();
		});
	}
};
//#endregion
//#region js/src/dialog.ts
/**
* --------------------------------------------------------------------------
* Bootstrap dialog.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$14 = "dialog";
const EVENT_KEY$11 = `.bs.dialog`;
const DATA_API_KEY$6 = ".data-api";
const EVENT_SHOW$3 = `show${EVENT_KEY$11}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$11}`;
const EVENT_CANCEL = `cancel${EVENT_KEY$11}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$11}${DATA_API_KEY$6}`;
const CLASS_NAME_NONMODAL = "dialog-nonmodal";
const CLASS_NAME_INSTANT$1 = "dialog-instant";
const CLASS_NAME_SWAP_IN = "dialog-swap-in";
const SELECTOR_DATA_TOGGLE$5 = "[data-bs-toggle=\"dialog\"]";
const Default$13 = {
	backdrop: true,
	keyboard: true,
	modal: true
};
const DefaultType$13 = {
	backdrop: "(boolean|string)",
	keyboard: "boolean",
	modal: "boolean"
};
/**
* Class definition
*/
var Dialog = class extends DialogBase {
	constructor(element, config) {
		super(element, config);
	}
	static get Default() {
		return Default$13;
	}
	static get DefaultType() {
		return DefaultType$13;
	}
	static get NAME() {
		return NAME$14;
	}
	handleUpdate() {}
	_getShowOptions() {
		return {
			modal: this._config.modal,
			preventBodyScroll: this._config.modal
		};
	}
	_onBeforeShow() {
		if (!this._config.modal) this._element.classList.add(CLASS_NAME_NONMODAL);
	}
	_onAfterHide() {
		this._element.classList.remove(CLASS_NAME_NONMODAL);
	}
	_shouldDeferClose() {
		return this._isAnimated();
	}
	_onCancel() {
		EventHandler.trigger(this._element, EVENT_CANCEL);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$5, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
	EventHandler.one(target, EVENT_SHOW$3, (showEvent) => {
		if (showEvent.defaultPrevented) return;
		EventHandler.one(target, EVENT_HIDDEN$4, () => {
			if (isVisible(this)) this.focus({ preventScroll: true });
		});
	});
	const config = Manipulator.getDataAttributes(this);
	const currentDialog = this.closest("dialog[open]");
	if (currentDialog && currentDialog !== target) {
		const newDialog = Dialog.getOrCreateInstance(target, config);
		target.classList.add(CLASS_NAME_SWAP_IN);
		newDialog.show(this);
		EventHandler.one(target, `shown${EVENT_KEY$11}`, () => {
			target.classList.remove(CLASS_NAME_SWAP_IN);
		});
		const currentInstance = Dialog.getInstance(currentDialog);
		if (currentInstance) {
			currentDialog.classList.add(CLASS_NAME_INSTANT$1);
			EventHandler.one(currentDialog, EVENT_HIDDEN$4, () => {
				currentDialog.classList.remove(CLASS_NAME_INSTANT$1);
			});
			currentInstance.hide();
		}
		return;
	}
	Dialog.getOrCreateInstance(target, config).toggle(this);
});
enableDismissTrigger(Dialog);
//#endregion
//#region js/src/util/sanitizer.ts
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DefaultAllowlist = {
	"*": [
		"class",
		"dir",
		"id",
		"lang",
		"role",
		ARIA_ATTRIBUTE_PATTERN
	],
	a: [
		"target",
		"href",
		"title",
		"rel"
	],
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
	img: [
		"src",
		"srcset",
		"alt",
		"title",
		"width",
		"height"
	],
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
/**
* Allowlist for icon HTML options (Chips `dismissIcon`, NavOverflow `moreIcon`,
* and markup supplied via `[data-bs-overflow-icon]`). Covers the default SVG
* icons plus common inline-icon markup. Event-handler attributes and tags not
* listed here are stripped by `sanitizeHtml`.
*/
const DefaultIconAllowlist = {
	"*": [
		"class",
		"role",
		ARIA_ATTRIBUTE_PATTERN
	],
	svg: [
		"xmlns",
		"width",
		"height",
		"viewbox",
		"fill",
		"stroke",
		"stroke-width",
		"stroke-linecap",
		"stroke-linejoin",
		"focusable"
	],
	path: [
		"d",
		"fill",
		"stroke",
		"stroke-width",
		"fill-rule",
		"clip-rule"
	],
	line: [
		"x1",
		"y1",
		"x2",
		"y2",
		"stroke",
		"stroke-width",
		"stroke-linecap"
	],
	circle: [
		"cx",
		"cy",
		"r",
		"fill",
		"stroke",
		"stroke-width"
	],
	rect: [
		"x",
		"y",
		"width",
		"height",
		"rx",
		"ry",
		"fill",
		"stroke",
		"stroke-width"
	],
	polyline: [
		"points",
		"fill",
		"stroke",
		"stroke-width"
	],
	polygon: [
		"points",
		"fill",
		"stroke",
		"stroke-width"
	],
	g: [
		"fill",
		"stroke",
		"stroke-width",
		"transform"
	],
	span: [],
	i: []
};
const uriAttributes = /* @__PURE__ */ new Set([
	"background",
	"cite",
	"href",
	"itemtype",
	"longdesc",
	"poster",
	"src",
	"xlink:href"
]);
/**
* A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
* contexts.
*
* Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
*/
const SAFE_URL_PATTERN = /^(?!(?:javascript|data|vbscript):)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
/**
* A pattern that matches safe data URLs. Only matches image, video and audio
* types — notably NOT `data:text/html`, which is an XSS vector.
*
* Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L49
*/
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z=]+$/i;
const allowedAttribute = (attribute, allowedAttributeList) => {
	const attributeName = attribute.nodeName.toLowerCase();
	if (allowedAttributeList.includes(attributeName)) {
		if (uriAttributes.has(attributeName)) return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
		return true;
	}
	return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName));
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
	if (!unsafeHtml.length) return unsafeHtml;
	if (sanitizeFunction && typeof sanitizeFunction === "function") return sanitizeFunction(unsafeHtml);
	const createdDocument = new window.DOMParser().parseFromString(unsafeHtml, "text/html");
	const elements = [...createdDocument.body.querySelectorAll("*")];
	for (const element of elements) {
		const elementName = element.nodeName.toLowerCase();
		if (!Object.keys(allowList).includes(elementName)) {
			element.remove();
			continue;
		}
		const attributeList = [...element.attributes];
		const allowedAttributes = [...allowList["*"] || [], ...allowList[elementName] || []];
		for (const attribute of attributeList) if (!allowedAttribute(attribute, allowedAttributes)) element.removeAttribute(attribute.nodeName);
	}
	return createdDocument.body.innerHTML;
}
//#endregion
//#region js/src/nav-overflow.ts
/**
* --------------------------------------------------------------------------
* Bootstrap nav-overflow.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$13 = "navoverflow";
const EVENT_KEY$10 = `.bs.navoverflow`;
const EVENT_UPDATE = `update${EVENT_KEY$10}`;
const EVENT_OVERFLOW = `overflow${EVENT_KEY$10}`;
const EVENT_RESIZE$2 = `resize${EVENT_KEY$10}`;
const CLASS_NAME_OVERFLOW = "nav-overflow";
const CLASS_NAME_OVERFLOW_MENU = "nav-overflow-menu";
const CLASS_NAME_HIDDEN = "d-none";
const CLASS_NAME_KEEP = "nav-overflow-keep";
const SELECTOR_NAV = ".nav";
const SELECTOR_NAV_ITEM = ".nav-item";
const SELECTOR_NAV_LINK = ".nav-link";
const SELECTOR_OVERFLOW_TOGGLE = ".nav-overflow-toggle";
const SELECTOR_OVERFLOW_MENU = ".nav-overflow-menu";
const SELECTOR_CUSTOM_ICON = "[data-bs-overflow-icon]";
const DEFAULT_TEXT = "More";
const Default$12 = {
	collapseBelow: 0,
	iconPlacement: "start",
	menuPlacement: "bottom-end",
	moreText: DEFAULT_TEXT,
	moreIcon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3\"/></svg>",
	threshold: 0
};
const DefaultType$12 = {
	collapseBelow: "(number|string)",
	iconPlacement: "string",
	menuPlacement: "string",
	moreText: "(string|boolean)",
	moreIcon: "string",
	threshold: "number"
};
/**
* Class definition
*/
var NavOverflow = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		const nav = SelectorEngine.findOne(SELECTOR_NAV, this._element);
		if (!nav) throw new TypeError(`${this._element.outerHTML} has no child ${SELECTOR_NAV} to collapse`);
		this._nav = nav;
		this._items = [];
		this._overflowItems = [];
		this._overflowMenu = null;
		this._overflowToggle = null;
		this._resizeObserver = null;
		this._resizeHandler = null;
		this._collapseBelow = 0;
		this._init();
	}
	static get Default() {
		return Default$12;
	}
	static get DefaultType() {
		return DefaultType$12;
	}
	static get NAME() {
		return NAME$13;
	}
	update() {
		this._calculateOverflow();
		EventHandler.trigger(this._element, EVENT_UPDATE);
	}
	dispose() {
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._resizeHandler) EventHandler.off(window, EVENT_RESIZE$2, this._resizeHandler);
		this._restoreItems();
		if (this._overflowToggle && this._overflowToggle.parentElement) this._overflowToggle.parentElement.remove();
		super.dispose();
	}
	_init() {
		this._element.classList.add(CLASS_NAME_OVERFLOW);
		this._items = SelectorEngine.find(SELECTOR_NAV_ITEM, this._nav).filter((item) => !item.querySelector(SELECTOR_OVERFLOW_TOGGLE));
		for (const [index, item] of this._items.entries()) item.dataset.bsNavOrder = index;
		this._collapseBelow = this._resolveCollapseBelow();
		this._createOverflowMenu();
		this._setupResizeObserver();
		this._calculateOverflow();
	}
	_createOverflowMenu() {
		this._overflowToggle = SelectorEngine.findOne(SELECTOR_OVERFLOW_TOGGLE, this._element);
		if (this._overflowToggle) {
			this._overflowMenu = SelectorEngine.findOne(SELECTOR_OVERFLOW_MENU, this._element);
			return;
		}
		const { moreText } = this._config;
		const label = typeof moreText === "string" ? moreText : "";
		const overflowItem = document.createElement("li");
		overflowItem.className = "nav-item nav-overflow-item";
		const button = document.createElement("button");
		button.type = "button";
		button.className = "nav-link nav-overflow-toggle";
		button.setAttribute("data-bs-toggle", "menu");
		button.setAttribute("data-bs-placement", this._config.menuPlacement);
		button.setAttribute("aria-expanded", "false");
		if (label === "") button.setAttribute("aria-label", DEFAULT_TEXT);
		const iconSpan = document.createElement("span");
		iconSpan.className = "nav-overflow-icon";
		iconSpan.innerHTML = sanitizeHtml(this._resolveIcon(), DefaultIconAllowlist);
		if (label === "") button.append(iconSpan);
		else {
			const textSpan = document.createElement("span");
			textSpan.className = "nav-overflow-text";
			textSpan.textContent = label;
			if (this._config.iconPlacement === "end") button.append(textSpan, iconSpan);
			else button.append(iconSpan, textSpan);
		}
		const menu = document.createElement("div");
		menu.className = `${CLASS_NAME_OVERFLOW_MENU} menu`;
		overflowItem.append(button, menu);
		this._nav.append(overflowItem);
		this._overflowToggle = button;
		this._overflowMenu = menu;
	}
	_resolveIcon() {
		const customIconElement = SelectorEngine.findOne(SELECTOR_CUSTOM_ICON, this._element);
		if (!customIconElement) return this._config.moreIcon;
		const iconClone = customIconElement.cloneNode(true);
		iconClone.removeAttribute("data-bs-overflow-icon");
		const iconHtml = iconClone.outerHTML;
		customIconElement.remove();
		return iconHtml;
	}
	_resolveCollapseBelow() {
		const value = this._config.collapseBelow;
		if (typeof value === "number") return value;
		if (typeof value === "string" && value !== "") {
			const cssValue = getComputedStyle(document.documentElement).getPropertyValue(`--bs-breakpoint-${value}`);
			return Number.parseFloat(cssValue) || 0;
		}
		return 0;
	}
	_setupResizeObserver() {
		if (typeof ResizeObserver === "undefined") {
			this._resizeHandler = () => this._calculateOverflow();
			EventHandler.on(window, EVENT_RESIZE$2, this._resizeHandler);
			return;
		}
		this._resizeObserver = new ResizeObserver(() => {
			this._calculateOverflow();
		});
		this._resizeObserver.observe(this._element);
	}
	_availableWidth() {
		const { paddingInlineStart, paddingInlineEnd } = getComputedStyle(this._element);
		const padding = (Number.parseFloat(paddingInlineStart) || 0) + (Number.parseFloat(paddingInlineEnd) || 0);
		return this._element.clientWidth - padding;
	}
	_navGap() {
		return Number.parseFloat(getComputedStyle(this._nav).columnGap) || 0;
	}
	_calculateOverflow() {
		this._restoreItems();
		const availableWidth = this._availableWidth();
		const overflowItem = this._overflowToggle?.closest(SELECTOR_NAV_ITEM) ?? null;
		const candidates = this._items.filter((item) => !item.classList.contains(CLASS_NAME_KEEP));
		if (this._collapseBelow > 0 && availableWidth < this._collapseBelow) {
			this._applyOverflow(candidates, overflowItem);
			return;
		}
		const gap = this._navGap();
		const keepWidth = this._items.filter((item) => item.classList.contains(CLASS_NAME_KEEP)).reduce((sum, item) => sum + item.offsetWidth + gap, 0);
		const overflowWidth = overflowItem ? overflowItem.offsetWidth + gap : 0;
		const limit = availableWidth - keepWidth - overflowWidth;
		let usedWidth = 0;
		let itemsToOverflow = [];
		for (const item of candidates) {
			usedWidth += item.offsetWidth + gap;
			if (usedWidth > limit + 1) itemsToOverflow.push(item);
		}
		if (this._items.length - itemsToOverflow.length < this._config.threshold && this._items.length > this._config.threshold) itemsToOverflow = this._items.slice(this._config.threshold).filter((item) => !item.classList.contains(CLASS_NAME_KEEP));
		this._applyOverflow(itemsToOverflow, overflowItem);
	}
	_applyOverflow(items, overflowItem) {
		this._moveToOverflow(items);
		overflowItem?.classList.toggle(CLASS_NAME_HIDDEN, items.length === 0);
		if (items.length > 0) EventHandler.trigger(this._element, EVENT_OVERFLOW, {
			overflowCount: items.length,
			visibleCount: this._items.length - items.length
		});
	}
	_moveToOverflow(items) {
		if (!this._overflowMenu) return;
		this._overflowMenu.innerHTML = "";
		this._overflowItems = [];
		for (const item of items) {
			const link = SelectorEngine.findOne(SELECTOR_NAV_LINK, item);
			if (!link) continue;
			const clonedLink = link.cloneNode(true);
			clonedLink.className = "menu-item";
			if (link.classList.contains("active")) clonedLink.classList.add("active");
			if (link.classList.contains("disabled") || link.hasAttribute("disabled")) clonedLink.classList.add("disabled");
			this._overflowMenu.append(clonedLink);
			item.classList.add(CLASS_NAME_HIDDEN);
			item.dataset.bsNavOverflow = "true";
			this._overflowItems.push(item);
		}
	}
	_restoreItems() {
		for (const item of this._items) {
			item.classList.remove(CLASS_NAME_HIDDEN);
			delete item.dataset.bsNavOverflow;
		}
		this._overflowToggle?.closest(SELECTOR_NAV_ITEM)?.classList.remove(CLASS_NAME_HIDDEN);
		if (this._overflowMenu) this._overflowMenu.innerHTML = "";
		this._overflowItems = [];
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, "DOMContentLoaded", () => {
	for (const element of SelectorEngine.find("[data-bs-toggle=\"nav-overflow\"]")) NavOverflow.getOrCreateInstance(element);
});
//#endregion
//#region js/src/util/swipe.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/swipe.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$12 = "swipe";
const EVENT_KEY$9 = ".bs.swipe";
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = "touch";
const POINTER_TYPE_PEN = "pen";
const CLASS_NAME_POINTER_EVENT = "pointer-event";
const SWIPE_THRESHOLD = 40;
const Default$11 = {
	endCallback: null,
	leftCallback: null,
	rightCallback: null,
	upCallback: null,
	downCallback: null
};
const DefaultType$11 = {
	endCallback: "(function|null)",
	leftCallback: "(function|null)",
	rightCallback: "(function|null)",
	upCallback: "(function|null)",
	downCallback: "(function|null)"
};
/**
* Class definition
*/
var Swipe = class Swipe extends Config {
	constructor(element, config) {
		super();
		this._element = element;
		if (!element || !Swipe.isSupported()) return;
		this._config = this._getConfig(config);
		this._deltaX = 0;
		this._deltaY = 0;
		this._supportPointerEvents = Boolean(window.PointerEvent);
		this._initEvents();
	}
	static get Default() {
		return Default$11;
	}
	static get DefaultType() {
		return DefaultType$11;
	}
	static get NAME() {
		return NAME$12;
	}
	dispose() {
		EventHandler.off(this._element, EVENT_KEY$9);
	}
	_start(event) {
		if (!this._supportPointerEvents) {
			this._deltaX = event.touches[0].clientX;
			this._deltaY = event.touches[0].clientY;
			return;
		}
		if (this._eventIsPointerPenTouch(event)) {
			this._deltaX = event.clientX;
			this._deltaY = event.clientY;
		}
	}
	_end(event) {
		if (this._eventIsPointerPenTouch(event)) {
			this._deltaX = event.clientX - this._deltaX;
			this._deltaY = event.clientY - this._deltaY;
		}
		this._handleSwipe();
		execute(this._config.endCallback);
	}
	_move(event) {
		if (event.touches && event.touches.length > 1) {
			this._deltaX = 0;
			this._deltaY = 0;
			return;
		}
		this._deltaX = event.touches[0].clientX - this._deltaX;
		this._deltaY = event.touches[0].clientY - this._deltaY;
	}
	_handleSwipe() {
		const absDeltaX = Math.abs(this._deltaX);
		const absDeltaY = Math.abs(this._deltaY);
		if (absDeltaY > absDeltaX && absDeltaY > SWIPE_THRESHOLD) {
			const direction = this._deltaY > 0 ? "down" : "up";
			this._deltaX = 0;
			this._deltaY = 0;
			execute(direction === "down" ? this._config.downCallback : this._config.upCallback);
			return;
		}
		if (absDeltaX > SWIPE_THRESHOLD) {
			const direction = absDeltaX / this._deltaX;
			this._deltaX = 0;
			this._deltaY = 0;
			if (!direction) return;
			execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
			return;
		}
		this._deltaX = 0;
		this._deltaY = 0;
	}
	_initEvents() {
		if (this._supportPointerEvents) {
			EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
			EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
			this._element.classList.add(CLASS_NAME_POINTER_EVENT);
		} else {
			EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
			EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
			EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
		}
	}
	_eventIsPointerPenTouch(event) {
		return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
	}
	static isSupported() {
		return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
	}
};
//#endregion
//#region js/src/drawer.ts
/**
* --------------------------------------------------------------------------
* Bootstrap drawer.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$11 = "drawer";
const EVENT_KEY$8 = `.bs.drawer`;
const DATA_API_KEY$5 = ".data-api";
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$8}`;
const EVENT_RESIZE$1 = `resize${EVENT_KEY$8}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const SELECTOR_DATA_TOGGLE$4 = "[data-bs-toggle=\"drawer\"]";
const Default$10 = {
	backdrop: true,
	keyboard: true,
	scroll: false
};
const DefaultType$10 = {
	backdrop: "(boolean|string)",
	keyboard: "boolean",
	scroll: "boolean"
};
/**
* Class definition
*/
var Drawer = class extends DialogBase {
	constructor(element, config) {
		super(element, config);
		this._swipeHelper = null;
	}
	static get Default() {
		return Default$10;
	}
	static get DefaultType() {
		return DefaultType$10;
	}
	static get NAME() {
		return NAME$11;
	}
	dispose() {
		if (this._swipeHelper) this._swipeHelper.dispose();
		super.dispose();
	}
	_getShowOptions() {
		return {
			modal: Boolean(this._config.backdrop) || !this._config.scroll,
			preventBodyScroll: !this._config.scroll
		};
	}
	_onBeforeShow() {
		this._initSwipe();
	}
	_getInstantClassName() {
		return "drawer-instant";
	}
	_getStaticClassName() {
		return "drawer-static";
	}
	_initSwipe() {
		if (this._swipeHelper || !Swipe.isSupported()) return;
		const swipeConfig = {};
		const element = this._element;
		if (element.classList.contains("drawer-bottom")) swipeConfig.downCallback = () => this.hide();
		else if (element.classList.contains("drawer-top")) swipeConfig.upCallback = () => this.hide();
		else if (element.classList.contains("drawer-end")) if (isRTL()) swipeConfig.leftCallback = () => this.hide();
		else swipeConfig.rightCallback = () => this.hide();
		else if (isRTL()) swipeConfig.rightCallback = () => this.hide();
		else swipeConfig.leftCallback = () => this.hide();
		this._swipeHelper = new Swipe(element, swipeConfig);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$4, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
	if (isDisabled(this)) return;
	EventHandler.one(target, EVENT_HIDDEN$3, () => {
		if (isVisible(this)) this.focus({ preventScroll: true });
	});
	const alreadyOpen = SelectorEngine.findOne("dialog.drawer[open]");
	if (alreadyOpen && alreadyOpen !== target) Drawer.getInstance(alreadyOpen).hide();
	Drawer.getOrCreateInstance(target).toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
	for (const selector of SelectorEngine.find("dialog.drawer[open]")) Drawer.getOrCreateInstance(selector).show();
});
EventHandler.on(window, EVENT_RESIZE$1, () => {
	for (const element of SelectorEngine.find("dialog[open][class*=\"\\:drawer\"]")) if (getComputedStyle(element).position !== "fixed") Drawer.getOrCreateInstance(element).hide();
});
enableDismissTrigger(Drawer);
//#endregion
//#region js/src/strength.ts
/**
* --------------------------------------------------------------------------
* Bootstrap strength.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$10 = "strength";
const EVENT_KEY$7 = `.bs.strength`;
const DATA_API_KEY$4 = ".data-api";
const EVENT_STRENGTH_CHANGE = `strengthChange${EVENT_KEY$7}`;
const SELECTOR_DATA_STRENGTH = "[data-bs-strength]";
const STRENGTH_LEVELS = [
	"weak",
	"fair",
	"good",
	"strong"
];
const Default$9 = {
	input: null,
	minLength: 8,
	messages: {
		weak: "Weak",
		fair: "Fair",
		good: "Good",
		strong: "Strong"
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
	thresholds: [
		2,
		4,
		6
	],
	scorer: null
};
const DefaultType$9 = {
	input: "(string|element|null)",
	minLength: "number",
	messages: "object",
	weights: "object",
	thresholds: "array",
	scorer: "(function|null)"
};
/**
* Class definition
*/
var Strength = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._input = this._getInput();
		this._segments = SelectorEngine.find(".strength-segment", this._element);
		this._textElement = SelectorEngine.findOne(".strength-text", this._element.parentElement);
		this._currentStrength = null;
		if (this._input) {
			this._addEventListeners();
			this._evaluate();
		}
	}
	static get Default() {
		return Default$9;
	}
	static get DefaultType() {
		return DefaultType$9;
	}
	static get NAME() {
		return NAME$10;
	}
	getStrength() {
		return this._currentStrength;
	}
	evaluate() {
		this._evaluate();
	}
	_getInput() {
		if (this._config.input) return typeof this._config.input === "string" ? SelectorEngine.findOne(this._config.input) : this._config.input;
		const parent = this._element.parentElement;
		return SelectorEngine.findOne("input[type=\"password\"]", parent);
	}
	_addEventListeners() {
		EventHandler.on(this._input, "input", () => this._evaluate());
		EventHandler.on(this._input, "change", () => this._evaluate());
	}
	_evaluate() {
		const password = this._input.value;
		const score = this._calculateScore(password);
		const strength = this._scoreToStrength(score);
		if (strength !== this._currentStrength) {
			this._currentStrength = strength;
			this._updateUI(strength);
			EventHandler.trigger(this._element, EVENT_STRENGTH_CHANGE, {
				strength,
				score,
				password: password.length > 0 ? "***" : ""
			});
		}
	}
	_calculateScore(password) {
		if (!password) return 0;
		if (typeof this._config.scorer === "function") return this._config.scorer(password);
		const { weights } = this._config;
		let score = 0;
		if (password.length >= this._config.minLength) score += weights.minLength;
		if (password.length >= this._config.minLength + 4) score += weights.extraLength;
		if (/[a-z]/.test(password)) score += weights.lowercase;
		if (/[A-Z]/.test(password)) score += weights.uppercase;
		if (/\d/.test(password)) score += weights.numbers;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += weights.special;
		if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += weights.multipleSpecial;
		if (password.length >= 16) score += weights.longPassword;
		return score;
	}
	_scoreToStrength(score) {
		if (score === 0) return null;
		const [weak, fair, good] = this._config.thresholds;
		if (score <= weak) return "weak";
		if (score <= fair) return "fair";
		if (score <= good) return "good";
		return "strong";
	}
	_updateUI(strength) {
		if (strength) this._element.dataset.bsStrength = strength;
		else delete this._element.dataset.bsStrength;
		const strengthIndex = strength ? STRENGTH_LEVELS.indexOf(strength) : -1;
		for (const [index, segment] of this._segments.entries()) if (index <= strengthIndex) segment.classList.add("active");
		else segment.classList.remove("active");
		if (this._textElement) if (strength && this._config.messages[strength]) {
			this._textElement.textContent = this._config.messages[strength];
			this._textElement.dataset.bsStrength = strength;
			this._textElement.style.setProperty("--strength-color", `var(--${{
				weak: "danger",
				fair: "warning",
				good: "info",
				strong: "success"
			}[strength]}-text)`);
		} else {
			this._textElement.textContent = "";
			delete this._textElement.dataset.bsStrength;
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$7}${DATA_API_KEY$4}`, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_STRENGTH)) Strength.getOrCreateInstance(element);
});
//#endregion
//#region js/src/otp-input.ts
/**
* --------------------------------------------------------------------------
* Bootstrap otp-input.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$9 = "otpInput";
const EVENT_KEY$6 = `.bs.otpInput`;
const DATA_API_KEY$3 = ".data-api";
const EVENT_COMPLETE = `complete${EVENT_KEY$6}`;
const EVENT_INPUT$1 = `input${EVENT_KEY$6}`;
const EVENT_DOMCONTENT_LOADED = `DOMContentLoaded${EVENT_KEY$6}${DATA_API_KEY$3}`;
const SELECTOR_DATA_OTP = "[data-bs-otp]";
const SELECTOR_INPUT$1 = "input";
const SYNC_EVENTS = [
	"blur",
	"keyup",
	"select"
];
const CLASS_NAME_INPUT = "otp-input";
const CLASS_NAME_RENDERED = "otp-rendered";
const CLASS_NAME_SLOTS = "otp-slots";
const CLASS_NAME_SLOT = "otp-slot";
const CLASS_NAME_SLOT_FILLED = "otp-slot-filled";
const CLASS_NAME_SLOT_ACTIVE = "otp-slot-active";
const CLASS_NAME_SEPARATOR = "otp-separator";
const MASK_CHARACTER = "•";
const TYPES = {
	numeric: {
		inputmode: "numeric",
		pattern: "[0-9]*",
		filter: /[^0-9]/g
	},
	alphanumeric: {
		inputmode: "text",
		pattern: "[A-Za-z0-9]*",
		filter: /[^A-Za-z0-9]/g
	},
	alpha: {
		inputmode: "text",
		pattern: "[A-Za-z]*",
		filter: /[^A-Za-z]/g
	}
};
const Default$8 = {
	groups: null,
	length: null,
	mask: false,
	separator: "·",
	type: "numeric"
};
const DefaultType$8 = {
	groups: "(array|null)",
	length: "(number|null)",
	mask: "boolean",
	separator: "string",
	type: "string"
};
/**
* Class definition
*/
var OtpInput = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		const input = SelectorEngine.findOne(SELECTOR_INPUT$1, this._element);
		if (!input) return;
		this._input = input;
		this._type = TYPES[this._config.type] || TYPES.numeric;
		this._length = this._resolveLength();
		this._slots = [];
		this._pointerActive = false;
		this._pointerIndex = 0;
		this._setupInput();
		this._renderSlots();
		this._addEventListeners();
		this._render();
	}
	static get Default() {
		return Default$8;
	}
	static get DefaultType() {
		return DefaultType$8;
	}
	static get NAME() {
		return NAME$9;
	}
	getValue() {
		return this._input.value;
	}
	setValue(value) {
		this._input.value = this._sanitize(String(value));
		this._render();
		this._checkComplete();
	}
	clear() {
		this._input.value = "";
		this._render();
		this._input.focus();
	}
	focus() {
		this._input.focus();
		this._selectSlot(this._firstEmptyIndex());
		this._render();
	}
	dispose() {
		EventHandler.off(this._input, "input", this._onInput);
		EventHandler.off(this._input, "beforeinput", this._onBeforeInput);
		EventHandler.off(this._input, "focus", this._onFocus);
		EventHandler.off(this._input, "pointerdown", this._onPointerDown);
		EventHandler.off(document, "selectionchange", this._onSelectionChange);
		for (const type of SYNC_EVENTS) EventHandler.off(this._input, type, this._onSync);
		this._slotsContainer?.remove();
		this._element.classList.remove(CLASS_NAME_RENDERED);
		super.dispose();
	}
	_resolveLength() {
		if (this._config.length) return this._config.length;
		const maxLength = Number.parseInt(this._input.getAttribute("maxlength"), 10);
		return Number.isNaN(maxLength) || maxLength < 1 ? 6 : maxLength;
	}
	_setupInput() {
		const input = this._input;
		if (input.type === "number" || input.type === "password") input.type = "text";
		input.classList.add(CLASS_NAME_INPUT);
		input.setAttribute("maxlength", String(this._length));
		input.setAttribute("inputmode", this._type.inputmode);
		input.setAttribute("pattern", this._type.pattern);
		if (!input.getAttribute("autocomplete")) input.setAttribute("autocomplete", "one-time-code");
		if (input.value) input.value = this._sanitize(input.value);
	}
	_renderSlots() {
		const container = document.createElement("div");
		container.className = CLASS_NAME_SLOTS;
		container.setAttribute("aria-hidden", "true");
		const { groups } = this._config;
		let groupIndex = 0;
		let inGroup = 0;
		for (let i = 0; i < this._length; i++) {
			const slot = document.createElement("div");
			slot.className = CLASS_NAME_SLOT;
			container.append(slot);
			this._slots.push(slot);
			if (Array.isArray(groups) && groups.length > 0) {
				inGroup++;
				if (inGroup === groups[groupIndex] && i < this._length - 1) {
					const separator = document.createElement("div");
					separator.className = CLASS_NAME_SEPARATOR;
					separator.textContent = this._config.separator;
					container.append(separator);
					groupIndex = Math.min(groupIndex + 1, groups.length - 1);
					inGroup = 0;
				}
			}
		}
		this._slotsContainer = container;
		this._element.append(container);
		this._element.classList.add(CLASS_NAME_RENDERED);
	}
	_addEventListeners() {
		this._onInput = () => this._handleInput();
		this._onBeforeInput = (event) => this._handleBeforeInput(event);
		this._onPointerDown = (event) => this._handlePointerDown(event);
		this._onFocus = () => {
			if (this._pointerActive) {
				this._pointerActive = false;
				this._selectSlot(this._pointerIndex);
				this._render();
				return;
			}
			this._selectSlot(this._firstEmptyIndex());
			this._render();
		};
		this._onSync = () => this._render();
		this._onSelectionChange = () => {
			if (document.activeElement === this._input) this._render();
		};
		EventHandler.on(this._input, "input", this._onInput);
		EventHandler.on(this._input, "beforeinput", this._onBeforeInput);
		EventHandler.on(this._input, "focus", this._onFocus);
		EventHandler.on(this._input, "pointerdown", this._onPointerDown);
		EventHandler.on(document, "selectionchange", this._onSelectionChange);
		for (const type of SYNC_EVENTS) EventHandler.on(this._input, type, this._onSync);
	}
	_handleInput() {
		const sanitized = this._sanitize(this._input.value);
		if (sanitized !== this._input.value) this._input.value = sanitized;
		if (document.activeElement === this._input) this._selectSlot(this._firstEmptyIndex());
		this._afterValueChange();
	}
	_handleBeforeInput(event) {
		const { inputType, data } = event;
		if (inputType === "insertText" && data && data.length === 1) {
			event.preventDefault();
			const char = this._sanitize(data);
			if (!char) return;
			const index = Math.min(this._input.selectionStart ?? 0, this._length - 1);
			const chars = [...this._input.value];
			chars[index] = char;
			this._input.value = chars.join("").slice(0, this._length);
			this._selectSlot(index + 1);
			this._afterValueChange();
			return;
		}
		if (inputType === "deleteContentBackward") {
			event.preventDefault();
			const start = this._input.selectionStart ?? 0;
			const end = this._input.selectionEnd ?? start;
			const chars = [...this._input.value];
			if (end > start) {
				chars.splice(start, end - start);
				this._input.value = chars.join("");
				this._selectSlot(start);
			} else if (start > 0) {
				chars.splice(start - 1, 1);
				this._input.value = chars.join("");
				this._selectSlot(start - 1);
			}
			this._afterValueChange();
		}
	}
	_handlePointerDown(event) {
		const index = this._slotIndexFromPoint(event.clientX);
		if (index === null) return;
		const target = Math.min(index, this._firstEmptyIndex());
		if (document.activeElement === this._input) {
			event.preventDefault();
			this._selectSlot(target);
			this._render();
			return;
		}
		this._pointerActive = true;
		this._pointerIndex = target;
	}
	_slotIndexFromPoint(x) {
		for (const [index, slot] of this._slots.entries()) if (x <= slot.getBoundingClientRect().right || index === this._slots.length - 1) return index;
		return null;
	}
	_afterValueChange() {
		this._render();
		EventHandler.trigger(this._element, EVENT_INPUT$1, { value: this._input.value });
		this._checkComplete();
	}
	_firstEmptyIndex() {
		return Math.min(this._input.value.length, this._length - 1);
	}
	_selectSlot(index) {
		const clamped = Math.max(0, Math.min(index, this._length - 1));
		const end = clamped < this._input.value.length ? clamped + 1 : clamped;
		this._input.setSelectionRange(clamped, end);
	}
	_sanitize(value) {
		return value.replace(this._type.filter, "").slice(0, this._length);
	}
	_render() {
		const { value } = this._input;
		const isFocused = document.activeElement === this._input;
		const caret = Math.min(this._input.selectionStart ?? value.length, this._length - 1);
		for (const [index, slot] of this._slots.entries()) {
			const char = value[index] ?? "";
			slot.textContent = char && this._config.mask ? MASK_CHARACTER : char;
			slot.classList.toggle(CLASS_NAME_SLOT_FILLED, Boolean(char));
			slot.classList.toggle(CLASS_NAME_SLOT_ACTIVE, isFocused && index === caret);
		}
	}
	_checkComplete() {
		const { value } = this._input;
		if (value.length === this._length) EventHandler.trigger(this._element, EVENT_COMPLETE, { value });
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_DOMCONTENT_LOADED, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) OtpInput.getOrCreateInstance(element);
});
//#endregion
//#region js/src/chips.ts
/**
* --------------------------------------------------------------------------
* Bootstrap chips.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$8 = "chips";
const EVENT_KEY$5 = `.bs.chips`;
const DATA_API_KEY$2 = ".data-api";
const EVENT_ADD = `add${EVENT_KEY$5}`;
const EVENT_REMOVE = `remove${EVENT_KEY$5}`;
const EVENT_CHANGE$1 = `change${EVENT_KEY$5}`;
const EVENT_SELECT = `select${EVENT_KEY$5}`;
const SELECTOR_DATA_CHIPS = "[data-bs-chips]";
const SELECTOR_GHOST_INPUT = ".form-ghost";
const SELECTOR_CHIP = ".chip";
const SELECTOR_CHIP_DISMISS = ".chip-dismiss";
const CLASS_NAME_CHIP = "chip";
const CLASS_NAME_CHIP_DISMISS = "chip-dismiss";
const CLASS_NAME_ACTIVE$2 = "active";
const Default$7 = {
	separator: ",",
	allowDuplicates: false,
	maxChips: null,
	placeholder: "",
	dismissible: true,
	dismissIcon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><line x1=\"4\" y1=\"4\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"4\" x2=\"4\" y2=\"12\"/></svg>",
	createOnBlur: true
};
const DefaultType$7 = {
	separator: "(string|null)",
	allowDuplicates: "boolean",
	maxChips: "(number|null)",
	placeholder: "string",
	dismissible: "boolean",
	dismissIcon: "string",
	createOnBlur: "boolean"
};
/**
* Class definition
*/
var Chips = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		const ghostInput = SelectorEngine.findOne(SELECTOR_GHOST_INPUT, this._element);
		this._chips = [];
		this._selectedChips = /* @__PURE__ */ new Set();
		this._anchorChip = null;
		if (ghostInput) this._input = ghostInput;
		else this._createInput();
		this._initializeExistingChips();
		this._addEventListeners();
	}
	static get Default() {
		return Default$7;
	}
	static get DefaultType() {
		return DefaultType$7;
	}
	static get NAME() {
		return NAME$8;
	}
	add(value) {
		const trimmedValue = String(value).trim();
		if (!trimmedValue) return null;
		if (!this._config.allowDuplicates && this._chips.includes(trimmedValue)) return null;
		if (this._config.maxChips !== null && this._chips.length >= this._config.maxChips) return null;
		if (EventHandler.trigger(this._element, EVENT_ADD, {
			value: trimmedValue,
			relatedTarget: this._input
		}).defaultPrevented) return null;
		const chip = this._createChip(trimmedValue);
		this._element.insertBefore(chip, this._input);
		this._chips.push(trimmedValue);
		EventHandler.trigger(this._element, EVENT_CHANGE$1, { values: this.getValues() });
		return chip;
	}
	remove(chipOrValue) {
		let chip;
		let value;
		if (typeof chipOrValue === "string") {
			value = chipOrValue;
			chip = this._findChipByValue(value);
		} else {
			chip = chipOrValue;
			value = this._getChipValue(chip);
		}
		if (!chip || !value) return false;
		if (EventHandler.trigger(this._element, EVENT_REMOVE, {
			value,
			chip,
			relatedTarget: this._input
		}).defaultPrevented) return false;
		this._selectedChips.delete(chip);
		if (this._anchorChip === chip) this._anchorChip = null;
		chip.remove();
		this._chips = this._getChipElements().map((chipElement) => this._getChipValue(chipElement)).filter(Boolean);
		EventHandler.trigger(this._element, EVENT_CHANGE$1, { values: this.getValues() });
		return true;
	}
	removeSelected() {
		const chipsToRemove = [...this._selectedChips];
		for (const chip of chipsToRemove) this.remove(chip);
		this._input?.focus();
	}
	getValues() {
		return [...this._chips];
	}
	getSelectedValues() {
		return [...this._selectedChips].map((chip) => this._getChipValue(chip));
	}
	clear() {
		const chips = SelectorEngine.find(SELECTOR_CHIP, this._element);
		for (const chip of chips) chip.remove();
		this._chips = [];
		this._selectedChips.clear();
		this._anchorChip = null;
		EventHandler.trigger(this._element, EVENT_CHANGE$1, { values: [] });
	}
	clearSelection() {
		for (const chip of this._selectedChips) chip.classList.remove(CLASS_NAME_ACTIVE$2);
		this._selectedChips.clear();
		this._anchorChip = null;
		EventHandler.trigger(this._element, EVENT_SELECT, { selected: [] });
	}
	selectChip(chip, options = {}) {
		const { addToSelection = false, rangeSelect = false } = options;
		const chipElements = this._getChipElements();
		if (!chipElements.includes(chip)) return;
		if (rangeSelect && this._anchorChip) {
			const anchorIndex = chipElements.indexOf(this._anchorChip);
			const chipIndex = chipElements.indexOf(chip);
			const start = Math.min(anchorIndex, chipIndex);
			const end = Math.max(anchorIndex, chipIndex);
			if (!addToSelection) this.clearSelection();
			for (let i = start; i <= end; i++) {
				this._selectedChips.add(chipElements[i]);
				chipElements[i].classList.add(CLASS_NAME_ACTIVE$2);
			}
		} else if (addToSelection) if (this._selectedChips.has(chip)) {
			this._selectedChips.delete(chip);
			chip.classList.remove(CLASS_NAME_ACTIVE$2);
		} else {
			this._selectedChips.add(chip);
			chip.classList.add(CLASS_NAME_ACTIVE$2);
			this._anchorChip = chip;
		}
		else {
			this.clearSelection();
			this._selectedChips.add(chip);
			chip.classList.add(CLASS_NAME_ACTIVE$2);
			this._anchorChip = chip;
		}
		EventHandler.trigger(this._element, EVENT_SELECT, { selected: this.getSelectedValues() });
	}
	focus() {
		this._input?.focus();
	}
	_getChipElements() {
		return SelectorEngine.find(SELECTOR_CHIP, this._element);
	}
	_createInput() {
		const input = document.createElement("input");
		input.type = "text";
		input.className = "form-ghost";
		if (this._config.placeholder) input.placeholder = this._config.placeholder;
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
		chip.setAttribute("tabindex", "0");
		if (this._config.dismissible && !SelectorEngine.findOne(SELECTOR_CHIP_DISMISS, chip)) chip.append(this._createDismissButton());
	}
	_createChip(value) {
		const chip = document.createElement("span");
		chip.className = CLASS_NAME_CHIP;
		chip.dataset.bsChipValue = value;
		chip.append(document.createTextNode(value));
		this._setupChip(chip);
		return chip;
	}
	_createDismissButton() {
		const button = document.createElement("button");
		button.type = "button";
		button.className = CLASS_NAME_CHIP_DISMISS;
		button.setAttribute("aria-label", "Remove");
		button.setAttribute("tabindex", "-1");
		button.innerHTML = sanitizeHtml(this._config.dismissIcon, DefaultIconAllowlist);
		return button;
	}
	_findChipByValue(value) {
		return this._getChipElements().find((chip) => this._getChipValue(chip) === value);
	}
	_getChipValue(chip) {
		if (chip.dataset.bsChipValue) return chip.dataset.bsChipValue;
		const clone = chip.cloneNode(true);
		const dismiss = SelectorEngine.findOne(SELECTOR_CHIP_DISMISS, clone);
		if (dismiss) dismiss.remove();
		return clone.textContent?.trim() || "";
	}
	_addEventListeners() {
		EventHandler.on(this._input, "keydown", (event) => this._handleInputKeydown(event));
		EventHandler.on(this._input, "input", (event) => this._handleInput(event));
		EventHandler.on(this._input, "paste", (event) => this._handlePaste(event));
		EventHandler.on(this._input, "focus", () => this.clearSelection());
		if (this._config.createOnBlur) EventHandler.on(this._input, "blur", (event) => {
			if (!event.relatedTarget?.closest(SELECTOR_CHIP)) this._createChipFromInput();
		});
		EventHandler.on(this._element, "click", SELECTOR_CHIP, (event) => {
			if (event.target.closest(SELECTOR_CHIP_DISMISS)) return;
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
		EventHandler.on(this._element, "click", SELECTOR_CHIP_DISMISS, (event) => {
			event.stopPropagation();
			const chip = event.target.closest(SELECTOR_CHIP);
			if (chip) {
				this.remove(chip);
				this._input?.focus();
			}
		});
		EventHandler.on(this._element, "keydown", SELECTOR_CHIP, (event) => {
			this._handleChipKeydown(event);
		});
		EventHandler.on(this._element, "click", (event) => {
			if (event.target === this._element) {
				this.clearSelection();
				this._input?.focus();
			}
		});
	}
	_handleInputKeydown(event) {
		const { key } = event;
		switch (key) {
			case "Enter":
				event.preventDefault();
				this._createChipFromInput();
				break;
			case "Backspace":
			case "Delete":
				if (this._input.value === "") {
					event.preventDefault();
					const chips = this._getChipElements();
					if (chips.length > 0) {
						const lastChip = chips.at(-1);
						this.selectChip(lastChip);
						lastChip.focus();
					}
				}
				break;
			case "ArrowLeft":
				if (this._input.selectionStart === 0 && this._input.selectionEnd === 0) {
					event.preventDefault();
					const chips = this._getChipElements();
					if (chips.length > 0) {
						const lastChip = chips.at(-1);
						if (event.shiftKey) this.selectChip(lastChip, { addToSelection: true });
						else this.selectChip(lastChip);
						lastChip.focus();
					}
				}
				break;
			case "Escape":
				this._input.value = "";
				this.clearSelection();
				this._input.blur();
				break;
		}
	}
	_handleChipKeydown(event) {
		const { key } = event;
		const chip = event.target.closest(SELECTOR_CHIP);
		if (!chip) return;
		const chips = this._getChipElements();
		const currentIndex = chips.indexOf(chip);
		switch (key) {
			case "Backspace":
			case "Delete":
				event.preventDefault();
				this._handleChipDelete(currentIndex, chips);
				break;
			case "ArrowLeft":
				event.preventDefault();
				this._navigateChip(chips, currentIndex, -1, event.shiftKey);
				break;
			case "ArrowRight":
				event.preventDefault();
				this._navigateChip(chips, currentIndex, 1, event.shiftKey);
				break;
			case "Home":
				event.preventDefault();
				this._navigateToEdge(chips, 0, event.shiftKey);
				break;
			case "End":
				event.preventDefault();
				this.clearSelection();
				this._input?.focus();
				break;
			case "a":
				this._handleSelectAll(event, chips);
				break;
			case "Escape":
				event.preventDefault();
				this.clearSelection();
				this._input?.focus();
				break;
		}
	}
	_handleChipDelete(currentIndex, chips) {
		if (this._selectedChips.size === 0) return;
		const nextIndex = Math.min(currentIndex, chips.length - this._selectedChips.size - 1);
		this.removeSelected();
		const remainingChips = this._getChipElements();
		if (remainingChips.length > 0) {
			const focusIndex = Math.max(0, Math.min(nextIndex, remainingChips.length - 1));
			remainingChips[focusIndex].focus();
			this.selectChip(remainingChips[focusIndex]);
		} else this._input?.focus();
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
		if (chips.length === 0) return;
		const targetChip = chips[targetIndex];
		this.selectChip(targetChip, shiftKey ? { rangeSelect: true } : {});
		targetChip.focus();
	}
	_handleSelectAll(event, chips) {
		if (!(event.metaKey || event.ctrlKey)) return;
		event.preventDefault();
		for (const c of chips) {
			this._selectedChips.add(c);
			c.classList.add(CLASS_NAME_ACTIVE$2);
		}
		EventHandler.trigger(this._element, EVENT_SELECT, { selected: this.getSelectedValues() });
	}
	_handleInput(event) {
		const { value } = event.target;
		const { separator } = this._config;
		if (separator && value.includes(separator)) {
			const parts = value.split(separator);
			for (const part of parts.slice(0, -1)) this.add(part.trim());
			this._input.value = parts.at(-1);
		}
	}
	_handlePaste(event) {
		const { separator } = this._config;
		if (!separator) return;
		const pastedData = (event.clipboardData || window.clipboardData).getData("text");
		if (pastedData.includes(separator)) {
			event.preventDefault();
			const parts = pastedData.split(separator);
			for (const part of parts) this.add(part.trim());
		}
	}
	_createChipFromInput() {
		const value = this._input.value.trim();
		if (value) {
			this.add(value);
			this._input.value = "";
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, `DOMContentLoaded${EVENT_KEY$5}${DATA_API_KEY$2}`, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_CHIPS)) Chips.getOrCreateInstance(element);
});
//#endregion
//#region js/src/util/template-factory.ts
/**
* --------------------------------------------------------------------------
* Bootstrap util/template-factory.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$7 = "TemplateFactory";
const Default$6 = {
	allowList: DefaultAllowlist,
	content: {},
	extraClass: "",
	html: false,
	sanitize: true,
	sanitizeFn: null,
	template: "<div></div>"
};
const DefaultType$6 = {
	allowList: "object",
	content: "object",
	extraClass: "(string|function)",
	html: "boolean",
	sanitize: "boolean",
	sanitizeFn: "(null|function)",
	template: "string"
};
const DefaultContentType = {
	entry: "(string|element|function|null)",
	selector: "(string|element)"
};
/**
* Class definition
*/
var TemplateFactory = class extends Config {
	constructor(config) {
		super();
		this._config = this._getConfig(config);
	}
	static get Default() {
		return Default$6;
	}
	static get DefaultType() {
		return DefaultType$6;
	}
	static get NAME() {
		return NAME$7;
	}
	getContent() {
		return Object.values(this._config.content).map((config) => this._resolvePossibleFunction(config)).filter(Boolean);
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
		const templateWrapper = document.createElement("div");
		templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
		for (const [selector, text] of Object.entries(this._config.content)) this._setContent(templateWrapper, text, selector);
		const template = templateWrapper.children[0];
		const extraClass = this._resolvePossibleFunction(this._config.extraClass);
		if (extraClass) template.classList.add(...extraClass.split(" "));
		return template;
	}
	_typeCheckConfig(config) {
		super._typeCheckConfig(config);
		this._checkContent(config.content);
	}
	_checkContent(arg) {
		for (const [selector, content] of Object.entries(arg)) super._typeCheckConfig({
			selector,
			entry: content
		}, DefaultContentType);
	}
	_setContent(template, content, selector) {
		const templateElement = SelectorEngine.findOne(selector, template);
		if (!templateElement) return;
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
		return execute(arg, [void 0, this]);
	}
	_putElementInTemplate(element, templateElement) {
		if (this._config.html) {
			templateElement.innerHTML = "";
			templateElement.append(element);
			return;
		}
		templateElement.textContent = element.textContent;
	}
};
//#endregion
//#region js/src/tooltip.ts
/**
* --------------------------------------------------------------------------
* Bootstrap tooltip.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$6 = "tooltip";
const DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set([
	"sanitize",
	"allowList",
	"sanitizeFn"
]);
const ESCAPE_KEY = "Escape";
const CLASS_NAME_MODAL = "modal";
const CLASS_NAME_SHOW$2 = "show";
const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const SELECTOR_DATA_TOGGLE$3 = "[data-bs-toggle=\"tooltip\"]";
const EVENT_MODAL_HIDE = "hide.bs.modal";
const TRIGGER_HOVER = "hover";
const TRIGGER_FOCUS = "focus";
const TRIGGER_CLICK = "click";
const TRIGGER_MANUAL = "manual";
const EVENT_HIDE$2 = "hide";
const EVENT_HIDDEN$2 = "hidden";
const EVENT_SHOW$2 = "show";
const EVENT_SHOWN$2 = "shown";
const EVENT_INSERTED = "inserted";
const EVENT_CLICK$3 = "click";
const EVENT_FOCUSIN$2 = "focusin";
const EVENT_FOCUSOUT$1 = "focusout";
const EVENT_MOUSEENTER$1 = "mouseenter";
const EVENT_MOUSELEAVE = "mouseleave";
const EVENT_KEYDOWN$1 = "keydown";
const AttachmentMap = {
	AUTO: "auto",
	TOP: "top",
	RIGHT: isRTL() ? "left" : "right",
	BOTTOM: "bottom",
	LEFT: isRTL() ? "right" : "left"
};
const Default$5 = {
	allowList: DefaultAllowlist,
	animation: true,
	boundary: "clippingParents",
	container: false,
	customClass: "",
	delay: 0,
	fallbackPlacements: [
		"top",
		"right",
		"bottom",
		"left"
	],
	html: false,
	offset: [0, 6],
	placement: "top",
	floatingConfig: null,
	sanitize: true,
	sanitizeFn: null,
	selector: false,
	template: "<div class=\"tooltip\" role=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>",
	title: "",
	trigger: "hover focus"
};
const DefaultType$5 = {
	allowList: "object",
	animation: "boolean",
	boundary: "(string|element)",
	container: "(string|element|boolean)",
	customClass: "(string|function)",
	delay: "(number|object)",
	fallbackPlacements: "array",
	html: "boolean",
	offset: "(array|string|function)",
	placement: "(string|function)",
	floatingConfig: "(null|object|function)",
	sanitize: "boolean",
	sanitizeFn: "(null|function)",
	selector: "(string|boolean)",
	template: "string",
	title: "(string|element|function)",
	trigger: "string"
};
/**
* Class definition
*/
var Tooltip = class extends BaseComponent {
	constructor(element, config) {
		if (typeof computePosition === "undefined") throw new TypeError("Bootstrap's tooltips require Floating UI (https://floating-ui.com)");
		super(element, config);
		this._isEnabled = true;
		this._timeout = 0;
		this._resolveTimeout = null;
		this._isHovered = null;
		this._activeTrigger = {};
		this._floatingCleanup = null;
		this._keydownHandler = null;
		this._tipEventOut = null;
		this._templateFactory = null;
		this._newContent = null;
		this._mediaQueryListeners = [];
		this._responsivePlacements = null;
		this.tip = null;
		this._parseResponsivePlacements();
		this._setListeners();
		if (!this._config.selector) this._fixTitle();
	}
	static get Default() {
		return Default$5;
	}
	static get DefaultType() {
		return DefaultType$5;
	}
	static get NAME() {
		return NAME$6;
	}
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
		if (!this._isEnabled) return Promise.resolve();
		return this._isShown() ? this._leave() : this._enter();
	}
	dispose() {
		this._clearTimeout();
		this._removeEscapeListener();
		EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
		if (this._element.getAttribute("data-bs-original-title")) this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title"));
		this._disposeFloating();
		this._disposeMediaQueryListeners();
		super.dispose();
	}
	async show() {
		if (this._element.style.display === "none") throw new Error("Please use show on visible elements");
		if (!(this._isWithContent() && this._isEnabled)) return;
		const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
		const isInTheDom = (findShadowRoot(this._element) || this._element.ownerDocument.documentElement).contains(this._element);
		if (showEvent.defaultPrevented || !isInTheDom) {
			this._isHovered = false;
			return;
		}
		this._disposeFloating();
		const tip = this._getTipElement();
		this._element.setAttribute("aria-describedby", tip.getAttribute("id"));
		let { container } = this._config;
		const closestDialog = this._element.closest("dialog[open]");
		if (closestDialog && container === document.body) container = closestDialog;
		if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
			container.append(tip);
			EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
			this._setTipListeners(tip);
		}
		await this._createFloating(tip);
		tip.classList.add(CLASS_NAME_SHOW$2);
		this._setEscapeListener();
		if ("ontouchstart" in document.documentElement) for (const element of document.body.children) EventHandler.on(element, "mouseover", noop);
		const complete = () => {
			EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
			if (this._isHovered === false) this._leave();
			this._isHovered = false;
		};
		await this._queueCallback(complete, this.tip, this._isAnimated());
	}
	async hide() {
		if (!this._isShown()) return;
		if (EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2)).defaultPrevented) return;
		this._removeEscapeListener();
		this._getTipElement().classList.remove(CLASS_NAME_SHOW$2);
		if ("ontouchstart" in document.documentElement) for (const element of document.body.children) EventHandler.off(element, "mouseover", noop);
		this._activeTrigger[TRIGGER_CLICK] = false;
		this._activeTrigger[TRIGGER_FOCUS] = false;
		this._activeTrigger[TRIGGER_HOVER] = false;
		this._isHovered = null;
		const complete = () => {
			if (this._isWithActiveTrigger()) return;
			if (!this._isHovered) this._disposeFloating();
			this._element.removeAttribute("aria-describedby");
			EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
		};
		await this._queueCallback(complete, this.tip, this._isAnimated());
	}
	update() {
		if (this._floatingCleanup && this.tip) this._updateFloatingPosition();
	}
	_isWithContent() {
		return Boolean(this._getTitle()) || this._hasNewContent();
	}
	_hasNewContent() {
		return Boolean(this._newContent) && Object.values(this._newContent).some(Boolean);
	}
	_getTipElement() {
		if (!this.tip) this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
		return this.tip;
	}
	_createTipElement(content) {
		const tip = this._getTemplateFactory(content).toHtml();
		tip.classList.remove(CLASS_NAME_SHOW$2);
		tip.classList.add(`bs-${this.constructor.NAME}-auto`);
		const tipId = getUID(this.constructor.NAME).toString();
		tip.setAttribute("id", tipId);
		if (!this._config.animation) tip.classList.add(this._getInstantClassName());
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
		if (this._templateFactory) this._templateFactory.changeContent(content);
		else this._templateFactory = new TemplateFactory({
			...this._config,
			content,
			extraClass: this._resolvePossibleFunction(this._config.customClass)
		});
		return this._templateFactory;
	}
	_getContentForTemplate() {
		return { [SELECTOR_TOOLTIP_INNER]: this._getTitle() };
	}
	_getTitle() {
		return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title");
	}
	_initializeOnDelegatedTarget(event) {
		return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
	}
	_getInstantClassName() {
		return `${this.constructor.NAME}-instant`;
	}
	_isAnimated() {
		return getTransitionDurationFromElement(this.tip) > 0;
	}
	_isShown() {
		return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
	}
	_getPlacement(tip) {
		if (this._responsivePlacements) {
			const placement = getResponsivePlacement(this._responsivePlacements, "top");
			return AttachmentMap[placement.toUpperCase()] || placement;
		}
		const placement = execute(this._config.placement, [
			this,
			tip,
			this._element
		]);
		return AttachmentMap[placement.toUpperCase()] || placement;
	}
	_parseResponsivePlacements() {
		if (typeof this._config.placement !== "string") {
			this._responsivePlacements = null;
			return;
		}
		this._responsivePlacements = parseResponsivePlacement(this._config.placement, "top");
		if (this._responsivePlacements) this._setupMediaQueryListeners();
	}
	_setupMediaQueryListeners() {
		this._disposeMediaQueryListeners();
		this._mediaQueryListeners = createBreakpointListeners(() => {
			if (this._isShown()) this._updateFloatingPosition();
		});
	}
	_disposeMediaQueryListeners() {
		disposeBreakpointListeners(this._mediaQueryListeners);
		this._mediaQueryListeners = [];
	}
	async _createFloating(tip) {
		const placement = this._getPlacement(tip);
		const arrowElement = tip.querySelector(`.${this.constructor.NAME}-arrow`);
		await this._updateFloatingPosition(tip, placement, arrowElement);
		this._floatingCleanup = autoUpdate(this._element, tip, () => this._updateFloatingPosition(tip, null, arrowElement));
	}
	async _updateFloatingPosition(tip = this.tip, placement = null, arrowElement = null) {
		if (!tip) return;
		if (!placement) placement = this._getPlacement(tip);
		if (!arrowElement) arrowElement = tip.querySelector(`.${this.constructor.NAME}-arrow`);
		const middleware = this._getFloatingMiddleware(arrowElement);
		const floatingConfig = this._getFloatingConfig(placement, middleware);
		const { x, y, placement: finalPlacement, middlewareData } = await computePosition(this._element, tip, floatingConfig);
		Object.assign(tip.style, {
			position: "absolute",
			left: `${x}px`,
			top: `${y}px`
		});
		if (arrowElement) arrowElement.style.position = "absolute";
		Manipulator.setDataAttribute(tip, "placement", finalPlacement);
		if (arrowElement && middlewareData.arrow) {
			const { x: arrowX, y: arrowY } = middlewareData.arrow;
			const isVertical = finalPlacement.startsWith("top") || finalPlacement.startsWith("bottom");
			Object.assign(arrowElement.style, {
				left: isVertical && arrowX !== void 0 ? `${arrowX}px` : "",
				top: !isVertical && arrowY !== void 0 ? `${arrowY}px` : "",
				right: "",
				bottom: ""
			});
		}
	}
	_getOffset() {
		const { offset } = this._config;
		if (typeof offset === "string") return offset.split(",").map((value) => Number.parseInt(value, 10));
		if (typeof offset === "function") return ({ placement, rects }) => {
			return toFloatingOffset(offset({
				placement,
				reference: rects.reference,
				floating: rects.floating
			}, this._element));
		};
		return offset;
	}
	_resolvePossibleFunction(arg) {
		return execute(arg, [this._element, this._element]);
	}
	_getFloatingMiddleware(arrowElement) {
		const offsetValue = this._getOffset();
		const middleware = [
			offset(typeof offsetValue === "function" ? offsetValue : toFloatingOffset(offsetValue)),
			flip({ fallbackPlacements: this._config.fallbackPlacements }),
			shift({ boundary: this._config.boundary === "clippingParents" ? "clippingAncestors" : this._config.boundary })
		];
		if (arrowElement) middleware.push(arrow({ element: arrowElement }));
		return middleware;
	}
	_getFloatingConfig(placement, middleware) {
		const defaultConfig = {
			placement,
			middleware
		};
		return {
			...defaultConfig,
			...execute(this._config.floatingConfig, [void 0, defaultConfig])
		};
	}
	_setListeners() {
		const triggers = this._config.trigger.split(" ");
		for (const trigger of triggers) if (trigger === "click") EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$3), this._config.selector, (event) => {
			const context = this._initializeOnDelegatedTarget(event);
			context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK]);
			context.toggle();
		});
		else if (trigger !== TRIGGER_MANUAL) {
			const [eventIn, eventOut] = this._getTriggerEvents(trigger);
			EventHandler.on(this._element, eventIn, this._config.selector, (event) => {
				const context = this._initializeOnDelegatedTarget(event);
				context._activeTrigger[event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
				context._enter();
			});
			EventHandler.on(this._element, eventOut, this._config.selector, (event) => {
				const context = this._initializeOnDelegatedTarget(event);
				context._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._isInside(event.relatedTarget);
				context._leave();
			});
		}
		this._hideModalHandler = () => {
			if (this._element) this.hide();
		};
		EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
	}
	_setTipListeners(tip) {
		const trigger = this._getTrigger();
		if (trigger === TRIGGER_MANUAL || trigger.includes(TRIGGER_CLICK)) return;
		this._tipEventOut = (event) => {
			this._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = this._isInside(event.relatedTarget);
			this._leave();
		};
		for (const name of trigger.split(" ")) if (name === TRIGGER_HOVER || name === TRIGGER_FOCUS) {
			const [, eventOut] = this._getTriggerEvents(name);
			EventHandler.on(tip, eventOut, this._tipEventOut);
		}
	}
	_removeTipListeners(tip) {
		if (!this._tipEventOut) return;
		const trigger = this._getTrigger();
		for (const name of trigger.split(" ")) if (name === TRIGGER_HOVER || name === TRIGGER_FOCUS) {
			const [, eventOut] = this._getTriggerEvents(name);
			EventHandler.off(tip, eventOut, this._tipEventOut);
		}
		this._tipEventOut = null;
	}
	_isInside(element) {
		return this._element.contains(element) || Boolean(this.tip?.contains(element));
	}
	_getTrigger() {
		return this._config._trigger;
	}
	_getTriggerEvents(trigger) {
		return {
			[TRIGGER_HOVER]: [this.constructor.eventName(EVENT_MOUSEENTER$1), this.constructor.eventName(EVENT_MOUSELEAVE)],
			[TRIGGER_FOCUS]: [this.constructor.eventName(EVENT_FOCUSIN$2), this.constructor.eventName(EVENT_FOCUSOUT$1)]
		}[trigger];
	}
	_setEscapeListener() {
		if (this._keydownHandler) return;
		this._keydownHandler = (event) => {
			if (event.key !== ESCAPE_KEY || !this._isShown() || !this.tip.isConnected) return;
			event.preventDefault();
			event.stopPropagation();
			this.hide();
		};
		this._element.ownerDocument.addEventListener(EVENT_KEYDOWN$1, this._keydownHandler, true);
	}
	_removeEscapeListener() {
		if (!this._keydownHandler) return;
		this._element.ownerDocument.removeEventListener(EVENT_KEYDOWN$1, this._keydownHandler, true);
		this._keydownHandler = null;
	}
	_fixTitle() {
		const title = this._element.getAttribute("title");
		if (!title) return;
		if (!this._element.getAttribute("aria-label") && !this._element.textContent.trim()) this._element.setAttribute("aria-label", title);
		this._element.setAttribute("data-bs-original-title", title);
		this._element.removeAttribute("title");
	}
	_enter() {
		if (this._isShown() || this._isHovered) {
			this._isHovered = true;
			return Promise.resolve();
		}
		this._isHovered = true;
		return this._setTimeout(() => this._isHovered ? this.show() : void 0, this._config.delay.show);
	}
	_leave() {
		if (this._isWithActiveTrigger()) return Promise.resolve();
		this._isHovered = false;
		return this._setTimeout(() => this._isHovered ? void 0 : this.hide(), this._config.delay.hide);
	}
	_setTimeout(handler, timeout) {
		this._clearTimeout();
		return new Promise((resolve) => {
			this._resolveTimeout = resolve;
			this._timeout = setTimeout(() => {
				this._resolveTimeout = null;
				resolve(handler());
			}, timeout);
		});
	}
	_clearTimeout() {
		clearTimeout(this._timeout);
		if (this._resolveTimeout) {
			this._resolveTimeout();
			this._resolveTimeout = null;
		}
	}
	_isWithActiveTrigger() {
		return Object.values(this._activeTrigger).includes(true);
	}
	_getConfig(config) {
		const dataAttributes = Manipulator.getDataAttributes(this._element);
		for (const dataAttribute of Object.keys(dataAttributes)) if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) delete dataAttributes[dataAttribute];
		config = {
			...dataAttributes,
			...typeof config === "object" && config ? config : {}
		};
		config = this._mergeConfigObj(config);
		config = this._configAfterMerge(config);
		this._typeCheckConfig(config);
		return config;
	}
	_configAfterMerge(config) {
		config.container = config.container === false ? document.body : getElement(config.container);
		config._trigger = config._trigger || config.trigger;
		if (typeof config.delay === "number") config.delay = {
			show: config.delay,
			hide: config.delay
		};
		if (typeof config.title === "number" || typeof config.title === "boolean") config.title = config.title.toString();
		if (typeof config.content === "number" || typeof config.content === "boolean") config.content = config.content.toString();
		return config;
	}
	_getDelegateConfig() {
		const config = {};
		for (const [key, value] of Object.entries(this._config)) if (this.constructor.Default[key] !== value) config[key] = value;
		config.selector = false;
		config.trigger = "manual";
		return config;
	}
	_disposeFloating() {
		if (this._floatingCleanup) {
			this._floatingCleanup();
			this._floatingCleanup = null;
		}
		if (this.tip) {
			this._removeTipListeners(this.tip);
			this.tip.remove();
			this.tip = null;
		}
	}
};
/**
* Data API implementation - auto-initialize tooltips
*/
const initTooltip = (event) => {
	const target = event.target.closest(SELECTOR_DATA_TOGGLE$3);
	if (!target) return;
	Tooltip.getOrCreateInstance(target);
};
EventHandler.on(document, EVENT_FOCUSIN$2, SELECTOR_DATA_TOGGLE$3, initTooltip);
EventHandler.on(document, EVENT_MOUSEENTER$1, SELECTOR_DATA_TOGGLE$3, initTooltip);
//#endregion
//#region js/src/popover.ts
/**
* --------------------------------------------------------------------------
* Bootstrap popover.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$5 = "popover";
const SELECTOR_TITLE = ".popover-header";
const SELECTOR_CONTENT = ".popover-body";
const SELECTOR_DATA_TOGGLE$2 = "[data-bs-toggle=\"popover\"]";
const EVENT_CLICK$2 = "click";
const EVENT_FOCUSIN$1 = "focusin";
const EVENT_MOUSEENTER = "mouseenter";
const Default$4 = {
	...Tooltip.Default,
	content: "",
	offset: [0, 8],
	placement: "right",
	template: "<div class=\"popover\" role=\"tooltip\"><div class=\"popover-arrow\"></div><h3 class=\"popover-header\"></h3><div class=\"popover-body\"></div></div>",
	trigger: "click"
};
const DefaultType$4 = {
	...Tooltip.DefaultType,
	content: "(null|string|element|function)"
};
/**
* Class definition
*/
var Popover = class extends Tooltip {
	constructor(element, config) {
		super(element, config);
	}
	static get Default() {
		return Default$4;
	}
	static get DefaultType() {
		return DefaultType$4;
	}
	static get NAME() {
		return NAME$5;
	}
	_isWithContent() {
		return Boolean(this._getTitle() || this._getContent()) || this._hasNewContent();
	}
	_getContentForTemplate() {
		return {
			[SELECTOR_TITLE]: this._getTitle(),
			[SELECTOR_CONTENT]: this._getContent()
		};
	}
	_getContent() {
		return this._resolvePossibleFunction(this._config.content);
	}
};
/**
* Data API implementation - auto-initialize popovers
*/
const initPopover = (event) => {
	const target = event.target.closest(SELECTOR_DATA_TOGGLE$2);
	if (!target) return;
	if (event.type === "click") event.preventDefault();
	Popover.getOrCreateInstance(target);
};
EventHandler.on(document, EVENT_CLICK$2, SELECTOR_DATA_TOGGLE$2, initPopover);
EventHandler.on(document, EVENT_FOCUSIN$1, SELECTOR_DATA_TOGGLE$2, initPopover);
EventHandler.on(document, EVENT_MOUSEENTER, SELECTOR_DATA_TOGGLE$2, initPopover);
//#endregion
//#region js/src/range.ts
/**
* --------------------------------------------------------------------------
* Bootstrap range.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$4 = "range";
const EVENT_KEY$4 = `.bs.range`;
const DATA_API_KEY$1 = ".data-api";
const EVENT_CHANGED = `changed${EVENT_KEY$4}`;
const EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY$4}${DATA_API_KEY$1}`;
const EVENT_INPUT = "input";
const EVENT_CHANGE = "change";
const SELECTOR_RANGE = ".form-range";
const SELECTOR_INPUT = ".form-range-input";
const CLASS_NAME_BUBBLE = "form-range-bubble";
const CLASS_NAME_TICKS = "form-range-ticks";
const CLASS_NAME_TICK = "form-range-tick";
const CLASS_NAME_TICK_LABEL = "form-range-tick-label";
const PROPERTY_FILL = "--bs-range-fill";
const Default$3 = {
	bubble: false,
	formatter: null
};
const DefaultType$3 = {
	bubble: "(boolean|null)",
	formatter: "(function|null)"
};
/**
* Class definition
*/
var Range = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		if (!this._element) return;
		this._input = SelectorEngine.findOne(SELECTOR_INPUT, this._element);
		if (!this._input) return;
		this._bubble = null;
		this._bubbleText = null;
		this._ticks = null;
		this._updateHandler = () => this._update();
		if (this._config.bubble) this._createBubble();
		this._createTicks();
		this._addEventListeners();
		this._update();
	}
	static get Default() {
		return Default$3;
	}
	static get DefaultType() {
		return DefaultType$3;
	}
	static get NAME() {
		return NAME$4;
	}
	update() {
		this._update();
	}
	dispose() {
		EventHandler.off(this._input, EVENT_INPUT, this._updateHandler);
		EventHandler.off(this._input, EVENT_CHANGE, this._updateHandler);
		this._bubble?.remove();
		this._ticks?.remove();
		super.dispose();
	}
	_configAfterMerge(config) {
		if (config.bubble === null) config.bubble = true;
		return config;
	}
	_addEventListeners() {
		EventHandler.on(this._input, EVENT_INPUT, this._updateHandler);
		EventHandler.on(this._input, EVENT_CHANGE, this._updateHandler);
	}
	_min() {
		return this._input.min === "" ? 0 : Number.parseFloat(this._input.min);
	}
	_max() {
		return this._input.max === "" ? 100 : Number.parseFloat(this._input.max);
	}
	_value() {
		return Number.parseFloat(this._input.value);
	}
	_ratio() {
		const span = this._max() - this._min();
		return span > 0 ? (this._value() - this._min()) / span : 0;
	}
	_update() {
		this._element.style.setProperty(PROPERTY_FILL, `${this._ratio()}`);
		if (this._bubbleText) this._bubbleText.textContent = this._format(this._value());
		EventHandler.trigger(this._input, EVENT_CHANGED, { value: this._value() });
	}
	_format(value) {
		return typeof this._config.formatter === "function" ? this._config.formatter(value) : String(value);
	}
	_createBubble() {
		this._bubble = document.createElement("output");
		this._bubble.className = `${CLASS_NAME_BUBBLE} tooltip bs-tooltip-top show`;
		this._bubble.setAttribute("aria-hidden", "true");
		const arrow = document.createElement("div");
		arrow.className = "tooltip-arrow";
		this._bubbleText = document.createElement("div");
		this._bubbleText.className = "tooltip-inner";
		this._bubble.append(arrow, this._bubbleText);
		this._input.insertAdjacentElement("afterend", this._bubble);
	}
	_createTicks() {
		const listId = this._input.getAttribute("list");
		const datalist = listId ? document.getElementById(listId) : null;
		if (!datalist) return;
		const min = this._min();
		const span = this._max() - min || 1;
		const points = [];
		for (const option of SelectorEngine.find("option", datalist)) {
			const value = Number.parseFloat(option.value);
			if (!Number.isNaN(value)) {
				const ratio = Math.min(Math.max((value - min) / span, 0), 1);
				points.push({
					ratio,
					label: option.label
				});
			}
		}
		if (points.length === 0) return;
		points.sort((a, b) => a.ratio - b.ratio);
		this._ticks = document.createElement("div");
		this._ticks.className = CLASS_NAME_TICKS;
		this._ticks.setAttribute("aria-hidden", "true");
		const stops = [
			0,
			...points.map((point) => point.ratio),
			1
		];
		this._ticks.style.gridTemplateColumns = stops.slice(1).map((stop, index) => `${stop - stops[index]}fr`).join(" ");
		for (const [index, point] of points.entries()) {
			const tick = document.createElement("span");
			tick.className = CLASS_NAME_TICK;
			tick.style.gridColumnStart = `${index + 2}`;
			if (point.label) {
				const label = document.createElement("span");
				label.className = CLASS_NAME_TICK_LABEL;
				label.textContent = point.label;
				tick.append(label);
			}
			this._ticks.append(tick);
		}
		this._element.append(this._ticks);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_DOM_CONTENT_LOADED, () => {
	for (const element of SelectorEngine.find(SELECTOR_RANGE)) Range.getOrCreateInstance(element);
});
//#endregion
//#region js/src/scrollspy.ts
/**
* --------------------------------------------------------------------------
* Bootstrap scrollspy.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$3 = "scrollspy";
const EVENT_KEY$3 = `.bs.scrollspy`;
const DATA_API_KEY = ".data-api";
const EVENT_ACTIVATE = `activate${EVENT_KEY$3}`;
const EVENT_CLICK$1 = `click${EVENT_KEY$3}`;
const EVENT_SCROLL = `scroll${EVENT_KEY$3}`;
const EVENT_SCROLLEND = `scrollend${EVENT_KEY$3}`;
const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$3}${DATA_API_KEY}`;
const CLASS_NAME_MENU_ITEM = "menu-item";
const CLASS_NAME_ACTIVE$1 = "active";
const SELECTOR_DATA_SPY = "[data-bs-spy=\"scroll\"]";
const SELECTOR_TARGET_LINKS = "[href]";
const SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
const SELECTOR_NAV_LINKS = ".nav-link";
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, .nav-item > ${SELECTOR_NAV_LINKS}, .list-group-item`;
const SELECTOR_MENU_TOGGLE$1 = "[data-bs-toggle=\"menu\"]";
const SCROLL_IDLE_TIMEOUT = 100;
const RESIZE_DEBOUNCE = 100;
const Default$2 = {
	rootMargin: null,
	smoothScroll: false,
	target: null,
	threshold: [0],
	topMargin: "12%"
};
const DefaultType$2 = {
	rootMargin: "(string|null)",
	smoothScroll: "boolean",
	target: "element",
	threshold: "array",
	topMargin: "string"
};
/**
* Class definition
*/
var ScrollSpy = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._sections = [];
		this._linkBySection = /* @__PURE__ */ new Map();
		this._sectionByLink = /* @__PURE__ */ new Map();
		this._intersecting = /* @__PURE__ */ new Set();
		this._activeTarget = null;
		this._lastActive = null;
		this._atBottom = false;
		this._rootElement = getComputedStyle(this._element).overflowY === "visible" ? null : this._element;
		this._observer = null;
		this._sentinel = null;
		this._sentinelObserver = null;
		this._pendingNavigation = null;
		this._settleTimeout = null;
		this._settleHandler = null;
		this._scrollIdleHandler = null;
		this._resizeHandler = null;
		this._resizeTimeout = null;
		this.refresh();
	}
	static get Default() {
		return Default$2;
	}
	static get DefaultType() {
		return DefaultType$2;
	}
	static get NAME() {
		return NAME$3;
	}
	refresh() {
		this._initializeTargetsAndObservables();
		this._maybeEnableSmoothScroll();
		this._observer?.disconnect();
		this._intersecting.clear();
		this._observer = this._getNewObserver();
		for (const section of this._sections) this._observer.observe(section);
		this._setUpSentinel();
		this._maybeAddResizeListener();
	}
	dispose() {
		this._observer?.disconnect();
		this._teardownSentinel();
		this._disarmSettle();
		this._removeResizeListener();
		EventHandler.off(this._config.target, EVENT_CLICK$1);
		super.dispose();
	}
	_configAfterMerge(config) {
		config.target = getElement(config.target) || document.body;
		if (typeof config.threshold === "string") config.threshold = config.threshold.split(",").map((value) => Number.parseFloat(value));
		return config;
	}
	_getNewObserver() {
		const options = {
			root: this._rootElement,
			threshold: this._config.threshold,
			rootMargin: this._config.rootMargin ?? this._getDerivedRootMargin()
		};
		return new IntersectionObserver((entries) => this._onIntersect(entries), options);
	}
	_onIntersect(entries) {
		for (const entry of entries) if (entry.isIntersecting) this._intersecting.add(entry.target);
		else this._intersecting.delete(entry.target);
		this._computeActive();
	}
	_computeActive() {
		if (!this._element?.isConnected || this._sections.length === 0) return;
		let active = null;
		if (this._atBottom) active = this._sections.at(-1);
		else {
			for (const section of this._sections) if (this._intersecting.has(section)) active = section;
			active ||= this._lastActive ?? this._sections.at(0);
		}
		if (!active) return;
		this._lastActive = active;
		const link = this._linkBySection.get(active);
		if (link) this._process(link);
	}
	_parseTopMargin() {
		const value = String(this._config.topMargin);
		return {
			value: Number.parseFloat(value) || 0,
			unit: value.endsWith("%") ? "%" : "px"
		};
	}
	_getDerivedRootMargin() {
		const { value, unit } = this._parseTopMargin();
		let percent = value;
		if (unit === "px") {
			const rootHeight = this._rootElement ? this._rootElement.clientHeight : document.documentElement.clientHeight || window.innerHeight;
			percent = rootHeight ? value / rootHeight * 100 : 12;
		}
		return `0px 0px -${Math.min(Math.max(100 - percent, 0), 100)}% 0px`;
	}
	_usesPixelMargin() {
		return !this._config.rootMargin && this._parseTopMargin().unit === "px";
	}
	_setUpSentinel() {
		this._teardownSentinel();
		if (this._sections.length === 0) return;
		const sentinel = document.createElement("div");
		sentinel.setAttribute("aria-hidden", "true");
		sentinel.style.cssText = "position:relative;width:0;height:0;margin:0;padding:0;border:0;visibility:hidden;";
		this._element.append(sentinel);
		this._sentinel = sentinel;
		this._sentinelObserver = new IntersectionObserver((entries) => this._onSentinel(entries), {
			root: this._rootElement,
			threshold: [0]
		});
		this._sentinelObserver.observe(sentinel);
	}
	_onSentinel(entries) {
		const entry = entries.at(-1);
		this._atBottom = Boolean(entry?.isIntersecting) && this._isOverflowing();
		this._computeActive();
	}
	_isOverflowing() {
		const scroller = this._rootElement || document.scrollingElement || document.documentElement;
		return scroller.scrollHeight > scroller.clientHeight;
	}
	_teardownSentinel() {
		this._sentinelObserver?.disconnect();
		this._sentinelObserver = null;
		this._sentinel?.remove();
		this._sentinel = null;
		this._atBottom = false;
	}
	_maybeAddResizeListener() {
		this._removeResizeListener();
		if (!this._usesPixelMargin()) return;
		this._resizeHandler = () => {
			clearTimeout(this._resizeTimeout);
			this._resizeTimeout = setTimeout(() => this._rebuildObserver(), RESIZE_DEBOUNCE);
		};
		EventHandler.on(window, EVENT_RESIZE, this._resizeHandler);
	}
	_removeResizeListener() {
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = null;
		if (this._resizeHandler) {
			EventHandler.off(window, EVENT_RESIZE, this._resizeHandler);
			this._resizeHandler = null;
		}
	}
	_rebuildObserver() {
		if (!this._observer) return;
		this._observer.disconnect();
		this._intersecting.clear();
		this._observer = this._getNewObserver();
		for (const section of this._sections) this._observer.observe(section);
	}
	_maybeEnableSmoothScroll() {
		if (!this._config.smoothScroll) return;
		EventHandler.off(this._config.target, EVENT_CLICK$1);
		EventHandler.on(this._config.target, EVENT_CLICK$1, SELECTOR_TARGET_LINKS, (event) => {
			const link = event.target.closest(SELECTOR_TARGET_LINKS);
			const section = link && this._sectionByLink.get(link);
			if (!section || !this._element) return;
			event.preventDefault();
			const root = this._rootElement || window;
			const height = section.offsetTop - this._element.offsetTop;
			const currentTop = this._rootElement ? this._rootElement.scrollTop : window.scrollY ?? window.pageYOffset;
			if (matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(currentTop - height) <= 2) {
				if (root.scrollTo) root.scrollTo({
					top: height,
					behavior: "auto"
				});
				else root.scrollTop = height;
				this._settleNavigation(link.hash, section);
				return;
			}
			this._pendingNavigation = {
				hash: link.hash,
				section
			};
			this._armSettle();
			if (root.scrollTo) root.scrollTo({
				top: height,
				behavior: "smooth"
			});
			else root.scrollTop = height;
		});
	}
	_armSettle() {
		this._disarmSettle();
		const target = this._getSettleTarget();
		this._settleHandler = () => this._onSettle();
		this._scrollIdleHandler = () => {
			clearTimeout(this._settleTimeout);
			this._settleTimeout = setTimeout(() => this._onSettle(), SCROLL_IDLE_TIMEOUT);
		};
		EventHandler.on(target, EVENT_SCROLLEND, this._settleHandler);
		EventHandler.on(target, EVENT_SCROLL, this._scrollIdleHandler);
	}
	_disarmSettle() {
		clearTimeout(this._settleTimeout);
		this._settleTimeout = null;
		const target = this._getSettleTarget();
		if (this._settleHandler) {
			EventHandler.off(target, EVENT_SCROLLEND, this._settleHandler);
			this._settleHandler = null;
		}
		if (this._scrollIdleHandler) {
			EventHandler.off(target, EVENT_SCROLL, this._scrollIdleHandler);
			this._scrollIdleHandler = null;
		}
	}
	_getSettleTarget() {
		return this._rootElement || document;
	}
	_onSettle() {
		this._disarmSettle();
		if (!this._pendingNavigation) return;
		const { hash, section } = this._pendingNavigation;
		this._settleNavigation(hash, section);
	}
	_settleNavigation(hash, section) {
		this._pendingNavigation = null;
		if (window.history?.replaceState) window.history.replaceState(null, "", hash);
		if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
		section.focus({ preventScroll: true });
	}
	_initializeTargetsAndObservables() {
		this._sections = [];
		this._linkBySection = /* @__PURE__ */ new Map();
		this._sectionByLink = /* @__PURE__ */ new Map();
		const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
		const seen = /* @__PURE__ */ new Set();
		for (const anchor of targetLinks) {
			if (!anchor.hash || isDisabled(anchor)) continue;
			const id = decodeFragment(anchor.hash.slice(1));
			if (!id) continue;
			const section = document.getElementById(id);
			if (!section || !this._element.contains(section) || !isVisible(section)) continue;
			this._sectionByLink.set(anchor, section);
			this._linkBySection.set(section, anchor);
			if (!seen.has(section)) {
				seen.add(section);
				this._sections.push(section);
			}
		}
		this._sections.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
	}
	_process(target) {
		if (this._activeTarget === target) return;
		this._clearActiveClass(this._config.target);
		this._activeTarget = target;
		target.classList.add(CLASS_NAME_ACTIVE$1);
		this._activateParents(target);
		EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target });
	}
	_activateParents(target) {
		if (target.classList.contains(CLASS_NAME_MENU_ITEM)) {
			const menuToggle = target.closest(".menu")?.previousElementSibling;
			if (menuToggle?.matches(SELECTOR_MENU_TOGGLE$1)) menuToggle.classList.add(CLASS_NAME_ACTIVE$1);
			return;
		}
		for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) item.classList.add(CLASS_NAME_ACTIVE$1);
	}
	_clearActiveClass(parent) {
		parent.classList.remove(CLASS_NAME_ACTIVE$1);
		const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
		for (const node of activeNodes) node.classList.remove(CLASS_NAME_ACTIVE$1);
	}
};
function decodeFragment(hash) {
	try {
		return decodeURIComponent(hash);
	} catch {
		return hash;
	}
}
/**
* Data API implementation
*/
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
	for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) ScrollSpy.getOrCreateInstance(spy);
});
//#endregion
//#region js/src/tab.ts
/**
* --------------------------------------------------------------------------
* Bootstrap tab.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$2 = "tab";
const EVENT_KEY$2 = `.bs.tab`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$2}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$2}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$2}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$2}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$2}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}`;
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";
const HOME_KEY = "Home";
const END_KEY = "End";
const CLASS_NAME_ACTIVE = "active";
const CLASS_NAME_SHOW$1 = "show";
const SELECTOR_MENU_TOGGLE = "[data-bs-toggle=\"menu\"]";
const SELECTOR_MENU = ".menu";
const NOT_SELECTOR_MENU_TOGGLE = `:not(${SELECTOR_MENU_TOGGLE})`;
const SELECTOR_TAB_PANEL = ".list-group, .nav, [role=\"tablist\"]";
const SELECTOR_OUTER = ".nav-item, .list-group-item";
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_MENU_TOGGLE}, .list-group-item${NOT_SELECTOR_MENU_TOGGLE}, [role="tab"]${NOT_SELECTOR_MENU_TOGGLE}`;
const SELECTOR_DATA_TOGGLE$1 = "[data-bs-toggle=\"tab\"]";
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE$1}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"]`;
/**
* Class definition
*/
var Tab = class Tab extends BaseComponent {
	constructor(element) {
		super(element);
		this._parent = this._element.closest(SELECTOR_TAB_PANEL);
		if (!this._parent) throw new TypeError(`${this._element.outerHTML} has no valid parent ${SELECTOR_TAB_PANEL}`);
		this._setInitialAttributes(this._parent, this._getChildren());
		EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
	}
	static get NAME() {
		return NAME$2;
	}
	async show() {
		const innerElem = this._element;
		if (this._elemIsActive(innerElem)) return;
		const active = this._getActiveElem();
		const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, { relatedTarget: innerElem }) : null;
		if (EventHandler.trigger(innerElem, EVENT_SHOW$1, { relatedTarget: active }).defaultPrevented || hideEvent && hideEvent.defaultPrevented) return;
		this._deactivate(active, innerElem);
		await this._activate(innerElem, active);
	}
	async _activate(element, relatedElem) {
		if (!element) return;
		element.classList.add(CLASS_NAME_ACTIVE);
		if (element.getAttribute("role") !== "tab") {
			element.classList.add(CLASS_NAME_SHOW$1);
			return;
		}
		const pane = SelectorEngine.getElementFromSelector(element);
		this._activate(pane);
		const complete = () => {
			element.removeAttribute("tabindex");
			setAriaAttribute(element, "aria-selected", true);
			this._toggleMenu(element, true);
			EventHandler.trigger(element, EVENT_SHOWN$1, { relatedTarget: relatedElem });
		};
		await this._queueCallback(complete, pane ?? element, getTransitionDurationFromElement(pane) > 0);
	}
	async _deactivate(element, relatedElem) {
		if (!element) return;
		element.classList.remove(CLASS_NAME_ACTIVE);
		element.blur();
		if (element.getAttribute("role") !== "tab") {
			element.classList.remove(CLASS_NAME_SHOW$1);
			return;
		}
		this._deactivate(SelectorEngine.getElementFromSelector(element));
		const complete = () => {
			setAriaAttribute(element, "aria-selected", false);
			element.setAttribute("tabindex", "-1");
			this._toggleMenu(element, false);
			EventHandler.trigger(element, EVENT_HIDDEN$1, { relatedTarget: relatedElem });
		};
		await this._queueCallback(complete, element, false);
	}
	_keydown(event) {
		if (![
			ARROW_LEFT_KEY,
			ARROW_RIGHT_KEY,
			ARROW_UP_KEY,
			ARROW_DOWN_KEY,
			HOME_KEY,
			END_KEY
		].includes(event.key)) return;
		if (event.altKey || event.ctrlKey || event.metaKey) return;
		event.stopPropagation();
		event.preventDefault();
		const children = this._getChildren().filter((element) => !isDisabled(element));
		let nextActiveElement;
		if ([HOME_KEY, END_KEY].includes(event.key)) nextActiveElement = event.key === HOME_KEY ? children[0] : children.at(-1);
		else {
			const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
			nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
		}
		if (nextActiveElement) {
			nextActiveElement.focus({ preventScroll: true });
			Tab.getOrCreateInstance(nextActiveElement).show();
		}
	}
	_getChildren() {
		return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
	}
	_getActiveElem() {
		return this._getChildren().find((child) => this._elemIsActive(child)) || null;
	}
	_setInitialAttributes(parent, children) {
		this._setAttributeIfNotExists(parent, "role", "tablist");
		for (const child of children) this._setInitialAttributesOnChild(child);
	}
	_setInitialAttributesOnChild(child) {
		child = this._getInnerElement(child);
		const isActive = this._elemIsActive(child);
		const outerElem = this._getOuterElement(child);
		setAriaAttribute(child, "aria-selected", isActive);
		if (outerElem !== child) this._setAttributeIfNotExists(outerElem, "role", "presentation");
		if (!isActive) child.setAttribute("tabindex", "-1");
		this._setAttributeIfNotExists(child, "role", "tab");
		this._setInitialAttributesOnTargetPanel(child);
	}
	_setInitialAttributesOnTargetPanel(child) {
		const target = SelectorEngine.getElementFromSelector(child);
		if (!target) return;
		this._setAttributeIfNotExists(target, "role", "tabpanel");
		if (child.id) this._setAttributeIfNotExists(target, "aria-labelledby", `${child.id}`);
	}
	_toggleMenu(element, open) {
		const outerElem = this._getOuterElement(element);
		const menuToggle = SelectorEngine.findOne(SELECTOR_MENU_TOGGLE, outerElem);
		if (!menuToggle) return;
		const menu = SelectorEngine.findOne(SELECTOR_MENU, outerElem);
		menuToggle.classList.toggle(CLASS_NAME_ACTIVE, open);
		if (menu) menu.classList.toggle(CLASS_NAME_SHOW$1, open);
		setAriaAttribute(menuToggle, "aria-expanded", open);
	}
	_setAttributeIfNotExists(element, attribute, value) {
		if (!element.hasAttribute(attribute)) element.setAttribute(attribute, value);
	}
	_elemIsActive(elem) {
		return elem.classList.contains(CLASS_NAME_ACTIVE);
	}
	_getInnerElement(elem) {
		return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
	}
	_getOuterElement(elem) {
		return elem.closest(SELECTOR_OUTER) || elem;
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE$1, function(event) {
	if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
	if (isDisabled(this)) return;
	Tab.getOrCreateInstance(this).show();
});
/**
* Initialize on focus
*/
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) Tab.getOrCreateInstance(element);
});
//#endregion
//#region js/src/toast.ts
/**
* --------------------------------------------------------------------------
* Bootstrap toast.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME$1 = "toast";
const EVENT_KEY$1 = `.bs.toast`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY$1}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY$1}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY$1}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY$1}`;
const EVENT_HIDE = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW = `show${EVENT_KEY$1}`;
const EVENT_SHOWN = `shown${EVENT_KEY$1}`;
const CLASS_NAME_INSTANT = "toast-instant";
const CLASS_NAME_SHOW = "show";
const DefaultType$1 = {
	autohide: "boolean",
	delay: "number"
};
const Default$1 = {
	autohide: true,
	delay: 5e3
};
/**
* Class definition
*/
var Toast = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._timeout = null;
		this._hasMouseInteraction = false;
		this._hasKeyboardInteraction = false;
		this._setListeners();
	}
	static get Default() {
		return Default$1;
	}
	static get DefaultType() {
		return DefaultType$1;
	}
	static get NAME() {
		return NAME$1;
	}
	async show() {
		if (EventHandler.trigger(this._element, EVENT_SHOW).defaultPrevented) return;
		this._clearTimeout();
		const complete = () => {
			EventHandler.trigger(this._element, EVENT_SHOWN);
			this._maybeScheduleHide();
		};
		this._element.classList.add(CLASS_NAME_SHOW);
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	async hide() {
		if (!this.isShown()) return;
		if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
		const complete = () => {
			EventHandler.trigger(this._element, EVENT_HIDDEN);
		};
		this._element.classList.remove(CLASS_NAME_SHOW);
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	dispose() {
		this._clearTimeout();
		if (this.isShown()) this._element.classList.remove(CLASS_NAME_SHOW);
		super.dispose();
	}
	isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}
	_isAnimated() {
		return !this._element.classList.contains(CLASS_NAME_INSTANT);
	}
	_maybeScheduleHide() {
		if (!this._config.autohide) return;
		if (this._hasMouseInteraction || this._hasKeyboardInteraction) return;
		this._timeout = setTimeout(() => {
			this.hide();
		}, this._config.delay);
	}
	_onInteraction(event, isInteracting) {
		switch (event.type) {
			case "mouseover":
			case "mouseout":
				this._hasMouseInteraction = isInteracting;
				break;
			case "focusin":
			case "focusout":
				this._hasKeyboardInteraction = isInteracting;
				break;
			default: break;
		}
		if (isInteracting) {
			this._clearTimeout();
			return;
		}
		const nextElement = event.relatedTarget;
		if (this._element === nextElement || this._element.contains(nextElement)) return;
		this._maybeScheduleHide();
	}
	_setListeners() {
		EventHandler.on(this._element, EVENT_MOUSEOVER, (event) => this._onInteraction(event, true));
		EventHandler.on(this._element, EVENT_MOUSEOUT, (event) => this._onInteraction(event, false));
		EventHandler.on(this._element, EVENT_FOCUSIN, (event) => this._onInteraction(event, true));
		EventHandler.on(this._element, EVENT_FOCUSOUT, (event) => this._onInteraction(event, false));
	}
	_clearTimeout() {
		clearTimeout(this._timeout);
		this._timeout = null;
	}
};
/**
* Data API implementation
*/
enableDismissTrigger(Toast);
//#endregion
//#region js/src/toggler.ts
/**
* --------------------------------------------------------------------------
* Bootstrap toggler.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
const NAME = "toggler";
const EVENT_KEY = `.bs.toggler`;
const EVENT_TOGGLE = `toggle${EVENT_KEY}`;
const EVENT_TOGGLED = `toggled${EVENT_KEY}`;
const EVENT_CLICK = "click";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"toggler\"]";
const DefaultType = {
	attribute: "string",
	value: "(string|number|boolean|null)"
};
const Default = {
	attribute: "class",
	value: null
};
/**
* Class definition
*/
var Toggler = class extends BaseComponent {
	static get Default() {
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME;
	}
	toggle() {
		if (EventHandler.trigger(this._element, EVENT_TOGGLE).defaultPrevented) return;
		this._execute();
		EventHandler.trigger(this._element, EVENT_TOGGLED);
	}
	_execute() {
		const { attribute, value } = this._config;
		if (attribute === "id") return;
		if (value === null || value === void 0) return;
		if (attribute === "class") {
			this._element.classList.toggle(value);
			return;
		}
		if (this._element.getAttribute(attribute) === String(value)) {
			this._element.removeAttribute(attribute);
			return;
		}
		this._element.setAttribute(attribute, value);
	}
};
/**
* Data API implementation
*/
eventActionOnPlugin(Toggler, EVENT_CLICK, SELECTOR_DATA_TOGGLE, "toggle");
//#endregion
export { Alert, Button, Carousel, Chips, Collapse, Combobox, Datepicker, Dialog, Drawer, Menu, NavOverflow, OtpInput, Popover, Range, ScrollSpy, Strength, Tab, Toast, Toggler, Tooltip };

//# sourceMappingURL=bootstrap.js.map