/*!
* Bootstrap nav-overflow.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import { DefaultIconAllowlist, sanitizeHtml } from "./util/sanitizer.js";
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
const NAME = "navoverflow";
const EVENT_KEY = `.bs.navoverflow`;
const EVENT_UPDATE = `update${EVENT_KEY}`;
const EVENT_OVERFLOW = `overflow${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
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
const Default = {
	collapseBelow: 0,
	iconPlacement: "start",
	menuPlacement: "bottom-end",
	moreText: DEFAULT_TEXT,
	moreIcon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3\"/></svg>",
	threshold: 0
};
const DefaultType = {
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
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME;
	}
	update() {
		this._calculateOverflow();
		EventHandler.trigger(this._element, EVENT_UPDATE);
	}
	dispose() {
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._resizeHandler) EventHandler.off(window, EVENT_RESIZE, this._resizeHandler);
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
			EventHandler.on(window, EVENT_RESIZE, this._resizeHandler);
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
export { NavOverflow as default };

//# sourceMappingURL=nav-overflow.js.map