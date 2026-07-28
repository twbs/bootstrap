/*!
* Bootstrap nav-overflow.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
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
const SELECTOR_NAV_ITEM = ".nav-item";
const SELECTOR_NAV_LINK = ".nav-link";
const SELECTOR_OVERFLOW_TOGGLE = ".nav-overflow-toggle";
const SELECTOR_OVERFLOW_MENU = ".nav-overflow-menu";
const SELECTOR_CUSTOM_ICON = "[data-bs-overflow-icon]";
const CLASS_NAME_KEEP = "nav-overflow-keep";
const Default = {
	collapseBelow: 0,
	iconPlacement: "start",
	menuPlacement: "bottom-end",
	moreText: "More",
	moreIcon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3\"/></svg>",
	threshold: 0
};
const DefaultType = {
	collapseBelow: "(number|string)",
	iconPlacement: "string",
	menuPlacement: "string",
	moreText: "string",
	moreIcon: "string",
	threshold: "number"
};
/**
* Class definition
*/
var NavOverflow = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
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
		this._items = [...SelectorEngine.find(SELECTOR_NAV_ITEM, this._element)];
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
		const iconSpan = `<span class="nav-overflow-icon">${this._resolveIcon()}</span>`;
		const textSpan = `<span class="nav-overflow-text">${this._config.moreText}</span>`;
		const toggleContent = this._config.iconPlacement === "end" ? `${textSpan}${iconSpan}` : `${iconSpan}${textSpan}`;
		const overflowItem = document.createElement("li");
		overflowItem.className = "nav-item nav-overflow-item";
		overflowItem.innerHTML = `
      <button class="nav-link nav-overflow-toggle" type="button" data-bs-toggle="menu" data-bs-placement="${this._config.menuPlacement}" aria-expanded="false">
        ${toggleContent}
      </button>
      <div class="${CLASS_NAME_OVERFLOW_MENU} menu"></div>
    `;
		this._element.append(overflowItem);
		this._overflowToggle = overflowItem.querySelector(SELECTOR_OVERFLOW_TOGGLE);
		this._overflowMenu = overflowItem.querySelector(SELECTOR_OVERFLOW_MENU);
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
	_calculateOverflow() {
		this._restoreItems();
		const navWidth = this._element.offsetWidth;
		const overflowItem = this._overflowToggle?.closest(".nav-item");
		if (this._collapseBelow > 0 && navWidth < this._collapseBelow) {
			const itemsToOverflow = this._items.filter((item) => !item.classList.contains(CLASS_NAME_KEEP));
			this._moveToOverflow(itemsToOverflow);
			if (overflowItem) if (itemsToOverflow.length > 0) overflowItem.classList.remove(CLASS_NAME_HIDDEN);
			else overflowItem.classList.add(CLASS_NAME_HIDDEN);
			if (itemsToOverflow.length > 0) EventHandler.trigger(this._element, EVENT_OVERFLOW, {
				overflowCount: itemsToOverflow.length,
				visibleCount: this._items.length - itemsToOverflow.length
			});
			return;
		}
		const overflowWidth = overflowItem?.offsetWidth || 0;
		const keepWidth = this._items.filter((item) => item.classList.contains(CLASS_NAME_KEEP)).reduce((sum, item) => sum + item.offsetWidth, 0);
		let usedWidth = 0;
		const itemsToOverflow = [];
		const overflowThreshold = navWidth - overflowWidth - keepWidth - 10;
		for (const item of this._items) {
			if (item.classList.contains(CLASS_NAME_KEEP)) continue;
			usedWidth += item.offsetWidth;
			if (usedWidth > overflowThreshold) itemsToOverflow.push(item);
		}
		if (this._items.length - itemsToOverflow.length < this._config.threshold && this._items.length > this._config.threshold) {
			const toMove = this._items.slice(this._config.threshold).filter((item) => !item.classList.contains(CLASS_NAME_KEEP));
			itemsToOverflow.length = 0;
			itemsToOverflow.push(...toMove);
		}
		this._moveToOverflow(itemsToOverflow);
		if (overflowItem) if (itemsToOverflow.length > 0) overflowItem.classList.remove(CLASS_NAME_HIDDEN);
		else overflowItem.classList.add(CLASS_NAME_HIDDEN);
		if (itemsToOverflow.length > 0) EventHandler.trigger(this._element, EVENT_OVERFLOW, {
			overflowCount: itemsToOverflow.length,
			visibleCount: this._items.length - itemsToOverflow.length
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