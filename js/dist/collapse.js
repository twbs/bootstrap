/*!
* Bootstrap collapse.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import { getElement, getTransitionDurationFromElement, setAriaAttribute } from "./util/index.js";
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
const NAME = "collapse";
const EVENT_KEY = `.bs.collapse`;
const DATA_API_KEY = ".data-api";
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_SHOW = "show";
const CLASS_NAME_COLLAPSE = "collapse";
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const SELECTOR_ACTIVES = ".collapse.show";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"collapse\"]";
const Default = { parent: null };
const DefaultType = { parent: "(null|element)" };
/**
* Class definition
*/
var Collapse = class Collapse extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._isTransitioning = false;
		this._triggerArray = [];
		const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE);
		for (const elem of toggleList) {
			const selector = SelectorEngine.getSelectorFromElement(elem);
			const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
			if (selector !== null && filterElement.length) this._triggerArray.push(elem);
		}
		this._initializeChildren();
		if (!this._config.parent) this._setAriaExpanded(this._triggerArray, this._isShown());
	}
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
		return this._isShown() ? this.hide() : this.show();
	}
	async show() {
		if (this._isTransitioning || this._isShown()) return;
		let activeChildren = [];
		if (this._config.parent) activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element && !this._sharesTrigger(element)).map((element) => Collapse.getOrCreateInstance(element));
		if (activeChildren.length && activeChildren[0]._isTransitioning) return;
		if (EventHandler.trigger(this._element, EVENT_SHOW).defaultPrevented) return;
		for (const activeInstance of activeChildren) activeInstance.hide();
		this._element.classList.add(CLASS_NAME_SHOW);
		this._setAriaExpanded(this._triggerArray, true);
		this._isTransitioning = true;
		const complete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_SHOWN);
		};
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	async hide() {
		if (this._isTransitioning || !this._isShown()) return;
		if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
		this._element.classList.remove(CLASS_NAME_SHOW);
		for (const trigger of this._triggerArray) {
			const element = SelectorEngine.getElementFromSelector(trigger);
			if (element && !this._isShown(element)) this._setAriaExpanded([trigger], false);
		}
		this._isTransitioning = true;
		const complete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_HIDDEN);
		};
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	_isShown(element = this._element) {
		return element.classList.contains(CLASS_NAME_SHOW);
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
		const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);
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
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") event.preventDefault();
	for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) Collapse.getOrCreateInstance(element).toggle();
});
//#endregion
export { Collapse as default };

//# sourceMappingURL=collapse.js.map