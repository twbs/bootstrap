/*!
* Bootstrap scrollspy.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import { getElement, isDisabled, isVisible } from "./util/index.js";
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
const NAME = "scrollspy";
const EVENT_KEY = `.bs.scrollspy`;
const DATA_API_KEY = ".data-api";
const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_SCROLL = `scroll${EVENT_KEY}`;
const EVENT_SCROLLEND = `scrollend${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_MENU_ITEM = "menu-item";
const CLASS_NAME_ACTIVE = "active";
const SELECTOR_DATA_SPY = "[data-bs-spy=\"scroll\"]";
const SELECTOR_TARGET_LINKS = "[href]";
const SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
const SELECTOR_NAV_LINKS = ".nav-link";
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, .nav-item > ${SELECTOR_NAV_LINKS}, .list-group-item`;
const SELECTOR_MENU_TOGGLE = "[data-bs-toggle=\"menu\"]";
const SCROLL_IDLE_TIMEOUT = 100;
const RESIZE_DEBOUNCE = 100;
const Default = {
	rootMargin: null,
	smoothScroll: false,
	target: null,
	threshold: [0],
	topMargin: "12%"
};
const DefaultType = {
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
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME;
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
		EventHandler.off(this._config.target, EVENT_CLICK);
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
		EventHandler.off(this._config.target, EVENT_CLICK);
		EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event) => {
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
		target.classList.add(CLASS_NAME_ACTIVE);
		this._activateParents(target);
		EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target });
	}
	_activateParents(target) {
		if (target.classList.contains(CLASS_NAME_MENU_ITEM)) {
			const menuToggle = target.closest(".menu")?.previousElementSibling;
			if (menuToggle?.matches(SELECTOR_MENU_TOGGLE)) menuToggle.classList.add(CLASS_NAME_ACTIVE);
			return;
		}
		for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) item.classList.add(CLASS_NAME_ACTIVE);
	}
	_clearActiveClass(parent) {
		parent.classList.remove(CLASS_NAME_ACTIVE);
		const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent);
		for (const node of activeNodes) node.classList.remove(CLASS_NAME_ACTIVE);
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
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) ScrollSpy.getOrCreateInstance(spy);
});
//#endregion
export { ScrollSpy as default };

//# sourceMappingURL=scrollspy.js.map