/*!
* Bootstrap drawer.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import DialogBase from "./dialog-base.js";
import EventHandler from "./dom/event-handler.js";
import Manipulator from "./dom/manipulator.js";
import SelectorEngine from "./dom/selector-engine.js";
import Swipe from "./util/swipe.js";
import { enableDismissTrigger, onDocumentReady } from "./util/component-functions.js";
import { isDisabled } from "./util/index.js";
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
const NAME = "drawer";
const EVENT_KEY = `.bs.drawer`;
const DATA_API_KEY = ".data-api";
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"drawer\"]";
const SELECTOR_RESPONSIVE = "dialog[class*=\"\\:drawer\"]";
const SELECTOR_OPEN = "dialog.drawer[open], dialog[open][class*=\"\\:drawer\"]";
const SELECTOR_RESIZE = `${SELECTOR_OPEN}, ${SELECTOR_RESPONSIVE}`;
const inlineAttributes = /* @__PURE__ */ new WeakMap();
const drawerIsInline = (element) => element.matches(SELECTOR_RESPONSIVE) && getComputedStyle(element).getPropertyValue("--drawer-inline").trim() === "1";
const syncInlineSemantics = (element, inline) => {
	const saved = inlineAttributes.get(element);
	if (inline && !saved) {
		const attributes = /* @__PURE__ */ new Map();
		for (const name of [
			"role",
			"aria-label",
			"aria-labelledby",
			"aria-describedby",
			"aria-modal"
		]) {
			attributes.set(name, element.getAttribute(name));
			element.removeAttribute(name);
		}
		element.setAttribute("role", "presentation");
		inlineAttributes.set(element, attributes);
	} else if (!inline && saved) {
		for (const [name, value] of saved) if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
		inlineAttributes.delete(element);
	}
};
const Default = {
	backdrop: true,
	keyboard: true,
	scroll: false
};
const DefaultType = {
	backdrop: "(boolean|string)",
	keyboard: "boolean",
	scroll: "boolean"
};
/**
* Class definition
*/
var Drawer = class Drawer extends DialogBase {
	constructor(element, config) {
		super(element, config);
		this._swipeHelper = null;
		this._resizeObserver = null;
		this._resizeFrame = null;
		this._initResizeObserver();
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
	static {
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			const target = SelectorEngine.getElementFromSelector(this);
			if (!(target instanceof HTMLDialogElement) || isDisabled(this)) return;
			if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
			Drawer._toggleDrawer(target, this);
		});
	}
	static _toggleDrawer(target, trigger) {
		const drawer = Drawer.getOrCreateInstance(target, Manipulator.getDataAttributes(trigger));
		if (target.open) {
			drawer.hide();
			return;
		}
		const other = SelectorEngine.findOne(SELECTOR_OPEN);
		if (!other) {
			drawer.show(trigger);
			return;
		}
		const source = Drawer.getOrCreateInstance(other);
		if (!drawer._canShow(trigger) || !source._canHide()) return;
		const returnFocus = other.contains(trigger) ? source._returnFocus : trigger;
		drawer._show(trigger, returnFocus);
		if (target.open) source._hide(false);
	}
	dispose() {
		if (this._swipeHelper) this._swipeHelper.dispose();
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._resizeFrame !== null) cancelAnimationFrame(this._resizeFrame);
		super.dispose();
	}
	_getShowOptions() {
		return {
			modal: Boolean(this._config.backdrop) || !this._config.scroll,
			preventBodyScroll: !this._config.scroll
		};
	}
	_onBeforeShow() {
		this._swipeHelper?.dispose();
		this._swipeHelper = null;
		this._initSwipe();
	}
	_canShow(relatedTarget) {
		return !this._isInline() && super._canShow(relatedTarget);
	}
	async _show(relatedTarget, returnFocus = relatedTarget) {
		if (this._isInline()) return;
		await super._show(relatedTarget, returnFocus);
		if (this._element?.open && this._isInline()) await this.hide();
	}
	_onAfterHide() {
		syncInlineSemantics(this._element, this._isInline());
	}
	_isInline() {
		return Boolean(this._element && drawerIsInline(this._element));
	}
	_getInstantClassName() {
		return "drawer-instant";
	}
	_getStaticClassName() {
		return "drawer-static";
	}
	_shouldDeferClose() {
		return this._isAnimated();
	}
	_initResizeObserver() {
		const navbar = this._element?.closest(".navbar");
		if (!navbar || typeof ResizeObserver === "undefined") return;
		this._resizeObserver = new ResizeObserver(() => {
			if (this._resizeFrame !== null) cancelAnimationFrame(this._resizeFrame);
			this._resizeFrame = requestAnimationFrame(() => {
				this._resizeFrame = null;
				if (this._element.open && getComputedStyle(this._element).position !== "fixed") this.hide();
			});
		});
		this._resizeObserver.observe(navbar);
	}
	_initSwipe() {
		if (this._swipeHelper || !Swipe.isSupported()) return;
		const swipeConfig = {};
		const element = this._element;
		const rtl = element.matches(":dir(rtl)");
		if (element.classList.contains("drawer-bottom")) swipeConfig.downCallback = () => this.hide();
		else if (element.classList.contains("drawer-top")) swipeConfig.upCallback = () => this.hide();
		else if (element.classList.contains("drawer-end")) if (rtl) swipeConfig.leftCallback = () => this.hide();
		else swipeConfig.rightCallback = () => this.hide();
		else if (rtl) swipeConfig.rightCallback = () => this.hide();
		else swipeConfig.leftCallback = () => this.hide();
		this._swipeHelper = new Swipe(SelectorEngine.findOne(".drawer-header", element) || element, swipeConfig);
	}
};
/**
* Data API implementation
*/
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const element of SelectorEngine.find(SELECTOR_OPEN)) Drawer.getOrCreateInstance(element);
});
onDocumentReady(`DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
	for (const element of SelectorEngine.find(SELECTOR_RESPONSIVE)) syncInlineSemantics(element, !element.open && drawerIsInline(element));
});
document.addEventListener("beforetoggle", (event) => {
	if (event.target instanceof HTMLDialogElement && event.newState === "open") syncInlineSemantics(event.target, false);
}, true);
document.addEventListener("close", (event) => {
	if (event.target instanceof HTMLDialogElement && event.target.matches(SELECTOR_RESPONSIVE)) syncInlineSemantics(event.target, !event.target.open && drawerIsInline(event.target));
}, true);
EventHandler.on(window, EVENT_RESIZE, () => {
	for (const element of SelectorEngine.find(SELECTOR_RESIZE)) {
		const inline = drawerIsInline(element);
		syncInlineSemantics(element, !element.open && inline);
		if (element.open && (inline || getComputedStyle(element).position !== "fixed")) Drawer.getOrCreateInstance(element).hide();
	}
});
enableDismissTrigger(Drawer);
//#endregion
export { Drawer as default };

//# sourceMappingURL=drawer.js.map