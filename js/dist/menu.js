/*!
* Bootstrap menu.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import Manipulator from "./dom/manipulator.js";
import SelectorEngine from "./dom/selector-engine.js";
import { execute, getElement, getNextActiveElement, getTransitionDurationFromElement, isDisabled, isElement, isRTL, isVisible, noop } from "./util/index.js";
import { createBreakpointListeners, disposeBreakpointListeners, getResponsivePlacement, parseResponsivePlacement, toFloatingOffset } from "./util/floating-ui.js";
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
const NAME = "menu";
const EVENT_KEY = `.bs.menu`;
const DATA_API_KEY = ".data-api";
const ESCAPE_KEY = "Escape";
const TAB_KEY = "Tab";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const HOME_KEY = "Home";
const END_KEY = "End";
const ENTER_KEY = "Enter";
const SPACE_KEY = " ";
const ITEM_NAVIGATION_KEYS = /* @__PURE__ */ new Set([
	ARROW_UP_KEY,
	ARROW_DOWN_KEY,
	ARROW_LEFT_KEY,
	ARROW_RIGHT_KEY,
	HOME_KEY,
	END_KEY
]);
const RIGHT_MOUSE_BUTTON = 2;
const SUBMENU_CLOSE_DELAY = 100;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_TOUCH_MOUSEOVER = `mouseover${EVENT_KEY}`;
const CLASS_NAME_SHOW = "show";
const CLASS_NAME_MENU_BACK = "menu-back";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"menu\"]:not(.disabled):not(:disabled)";
const SELECTOR_MENU = ".menu";
const SELECTOR_SUBMENU = ".submenu";
const SELECTOR_SUBMENU_TOGGLE = ".submenu > .menu-item";
const SELECTOR_NAVBAR_NAV = ".navbar-nav";
const SELECTOR_VISIBLE_ITEMS = ".menu-item:not(.disabled):not(:disabled)";
const SELECTOR_TAB_STOPS = ":is(a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]):not(:disabled, .disabled)";
const DEFAULT_PLACEMENT = "bottom-start";
const SUBMENU_PLACEMENT = "end-start";
const resolveLogicalPlacement = (placement) => {
	if (isRTL()) return placement.replace(/^start(?=-|$)/, "right").replace(/^end(?=-|$)/, "left");
	return placement.replace(/^start(?=-|$)/, "left").replace(/^end(?=-|$)/, "right");
};
const triangleSign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
const Default = {
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
const DefaultType = {
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
		this._submenuPointerType = "mouse";
		this._touchMouseover = () => noop();
		this._touchMouseoverTargets = /* @__PURE__ */ new Set();
		this._menu = this._config.menu || this._findMenu();
		if (!this._config.menu && this._menu) this._parent = this._findWrapper(this._menu);
		this._isSubmenu = this._parent.classList?.contains("submenu");
		this._menuOriginalParent = this._menu?.parentNode;
		this._menuOriginalNextSibling = null;
		this._parseResponsivePlacements();
		this._setupSubmenuListeners();
		this._initSubmenuTriggers();
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
	show() {
		return this._show();
	}
	async _show(focus) {
		if (isDisabled(this._element) || this._isShown()) return;
		const relatedTarget = { relatedTarget: this._element };
		if (EventHandler.trigger(this._element, EVENT_SHOW, relatedTarget).defaultPrevented) return;
		this._moveMenuToContainer();
		this._disposeFloating();
		this._submenuPointerType = "mouse";
		if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) for (const element of document.body.children) {
			EventHandler.on(element, EVENT_TOUCH_MOUSEOVER, this._touchMouseover);
			this._touchMouseoverTargets.add(element);
		}
		this._element.setAttribute("aria-expanded", "true");
		this._menu.classList.add(CLASS_NAME_SHOW);
		this._element.classList.add(CLASS_NAME_SHOW);
		if (this._parent) this._parent.classList.add(CLASS_NAME_SHOW);
		this._syncSubmenuLayout();
		this._createFloating();
		Menu._openInstances.add(this);
		if (focus) focus();
		else this._element.focus({ focusVisible: false });
		if (!this._element || !this._isShown()) return;
		await this._queueCallback(() => {
			if (this._menu && this._isShown()) EventHandler.trigger(this._element, EVENT_SHOWN, relatedTarget);
		}, this._menu, this._isAnimated());
	}
	async hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		const relatedTarget = { relatedTarget: this._element };
		await this._completeHide(relatedTarget);
	}
	dispose() {
		this._removeTouchMouseoverListeners();
		EventHandler.off(this._menu, EVENT_KEY);
		this._disposeFloating();
		this._clearSize();
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
		const wrapper = SelectorEngine.closest(this._element, `:has(${SELECTOR_MENU})`);
		return SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, wrapper || this._parent);
	}
	_findWrapper(menu) {
		let wrapper = this._element.parentNode;
		while (wrapper instanceof Element && !wrapper.contains(menu)) wrapper = wrapper.parentNode;
		return wrapper instanceof Element ? wrapper : this._element.parentNode;
	}
	async _completeHide(relatedTarget) {
		if (EventHandler.trigger(this._element, EVENT_HIDE, relatedTarget).defaultPrevented) return;
		this._closeAllSubmenus();
		this._removeTouchMouseoverListeners();
		this._menu.classList.remove(CLASS_NAME_SHOW);
		this._element.classList.remove(CLASS_NAME_SHOW);
		if (this._parent) this._parent.classList.remove(CLASS_NAME_SHOW);
		this._element.setAttribute("aria-expanded", "false");
		Menu._openInstances.delete(this);
		await this._queueCallback(() => {
			if (!this._menu || this._isShown()) return;
			this._disposeFloating();
			this._clearSize();
			this._restoreMenuToOriginalParent();
			Manipulator.removeDataAttribute(this._menu, "placement");
			Manipulator.removeDataAttribute(this._menu, "display");
			EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget);
		}, this._menu, this._isAnimated());
	}
	_removeTouchMouseoverListeners() {
		for (const element of this._touchMouseoverTargets) EventHandler.off(element, EVENT_TOUCH_MOUSEOVER, this._touchMouseover);
		this._touchMouseoverTargets.clear();
	}
	_getConfig(config) {
		config = super._getConfig(config);
		if (typeof config.reference === "object" && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== "function") throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
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
		return this._menu.classList.contains(CLASS_NAME_SHOW);
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
		const boundary = this._config.boundary === "clippingParents" ? "clippingAncestors" : this._config.boundary;
		return [
			offset(typeof offsetValue === "function" ? offsetValue : toFloatingOffset(offsetValue)),
			flip({
				boundary,
				fallbackPlacements: this._getFallbackPlacements()
			}),
			shift({ boundary }),
			size({
				boundary,
				apply: ({ availableWidth, availableHeight, elements }) => {
					if (this._menu !== elements.floating || !this._isShown() || getComputedStyle(this._menu).position === "static") return;
					this._menu.style.setProperty("--bs-menu-available-width", `${Math.max(0, Math.floor(availableWidth))}px`);
					this._menu.style.setProperty("--bs-menu-available-height", `${Math.max(0, Math.floor(availableHeight))}px`);
					this._syncSubmenuLayout();
				}
			})
		];
	}
	_syncSubmenuLayout() {
		if (!this._openSubmenus.size) this._menu.toggleAttribute("data-bs-menu-constrained", this._menu.scrollHeight > this._menu.clientHeight);
		else if (this._usesStackedSubmenus() && this._menu.scrollHeight > this._menu.clientHeight) this._menu.setAttribute("data-bs-menu-constrained", "");
		const { overflowX, overflowY } = getComputedStyle(this._menu);
		this._menu.toggleAttribute("data-bs-menu-stacked", overflowX !== "visible" || overflowY !== "visible");
	}
	_clearSize() {
		if (this._menu) {
			this._menu.style.removeProperty("--bs-menu-available-width");
			this._menu.style.removeProperty("--bs-menu-available-height");
			this._menu.removeAttribute("data-bs-menu-constrained");
			this._menu.removeAttribute("data-bs-menu-stacked");
		}
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
		if (this._menu.parentNode !== container) {
			this._menuOriginalNextSibling = this._menu.nextSibling;
			container.append(this._menu);
		}
	}
	_restoreMenuToOriginalParent() {
		if (!this._menuOriginalParent || !this._menu) return;
		if (this._menu.parentNode !== this._menuOriginalParent) {
			const nextSibling = this._menuOriginalNextSibling;
			this._menuOriginalParent.insertBefore(this._menu, nextSibling?.parentNode === this._menuOriginalParent ? nextSibling : null);
		}
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
			EventHandler.on(this._menu, `mouseenter${EVENT_KEY}`, SELECTOR_SUBMENU_TOGGLE, (event) => {
				this._onSubmenuTriggerEnter(event);
			});
			EventHandler.on(this._menu, `mouseleave${EVENT_KEY}`, SELECTOR_SUBMENU, (event) => {
				this._onSubmenuLeave(event);
			});
			EventHandler.on(this._menu, `mousemove${EVENT_KEY}`, (event) => {
				this._trackMousePosition(event);
			});
		}
		if (this._config.submenuTrigger === "both") EventHandler.on(this._menu, `pointerover${EVENT_KEY}`, (event) => {
			this._submenuPointerType = event.pointerType;
		});
		if ([
			"click",
			"hover",
			"both"
		].includes(this._config.submenuTrigger)) EventHandler.on(this._menu, `click${EVENT_KEY}`, SELECTOR_SUBMENU_TOGGLE, (event) => {
			if (this._config.submenuTrigger !== "hover" || this._usesStackedSubmenus()) this._onSubmenuTriggerClick(event);
		});
	}
	_usesStackedSubmenus() {
		return getComputedStyle(this._menu).getPropertyValue("--bs-menu-stack-submenus") === "1";
	}
	_onSubmenuTriggerEnter(event) {
		if (this._submenuPointerType !== "mouse" || this._usesStackedSubmenus()) return;
		const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
		if (!trigger) return;
		const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
		if (!submenu) return;
		this._cancelSubmenuCloseTimeout(submenu);
		this._closeSiblingSubmenus(submenuWrapper);
		this._openSubmenu(trigger, submenu, submenuWrapper);
	}
	_onSubmenuLeave(event) {
		if (this._submenuPointerType !== "mouse" || this._usesStackedSubmenus()) return;
		const submenuWrapper = event.target.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
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
		const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
		if (!submenu) return;
		if (this._openSubmenus.has(submenu)) this._closeSubmenu(submenu, submenuWrapper);
		else {
			this._closeSiblingSubmenus(submenuWrapper);
			this._openSubmenu(trigger, submenu, submenuWrapper);
			if (this._usesStackedSubmenus()) this._getItemsInMenu(submenu)[0]?.focus();
		}
	}
	_initSubmenuTriggers() {
		if (!this._menu) return;
		for (const trigger of SelectorEngine.find(SELECTOR_SUBMENU_TOGGLE, this._menu)) {
			if (!SelectorEngine.findOne(SELECTOR_MENU, trigger.parentElement)) continue;
			trigger.setAttribute("aria-haspopup", "true");
			if (!trigger.hasAttribute("aria-expanded")) trigger.setAttribute("aria-expanded", "false");
		}
	}
	_openSubmenu(trigger, submenu, submenuWrapper) {
		if (this._openSubmenus.has(submenu)) return;
		trigger.setAttribute("aria-expanded", "true");
		trigger.setAttribute("aria-haspopup", "true");
		submenu.style.opacity = "0";
		submenu.classList.add(CLASS_NAME_SHOW);
		submenuWrapper.classList.add(CLASS_NAME_SHOW);
		const backItem = document.createElement(submenu.matches("ul, ol, menu") ? "li" : "div");
		backItem.className = CLASS_NAME_MENU_BACK;
		const backButton = document.createElement("button");
		backButton.type = "button";
		backButton.className = "menu-item";
		backButton.textContent = "Back";
		backButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this._closeSubmenu(submenu, submenuWrapper);
			trigger.focus();
		});
		backItem.append(backButton);
		submenu.prepend(backItem);
		const cleanup = this._createSubmenuFloating(submenu, submenuWrapper);
		this._openSubmenus.set(submenu, () => {
			cleanup();
			backItem.remove();
		});
		EventHandler.on(submenu, `mouseenter${EVENT_KEY}`, () => {
			this._cancelSubmenuCloseTimeout(submenu);
		});
	}
	_closeSubmenu(submenu, submenuWrapper) {
		if (!this._openSubmenus.has(submenu)) return;
		const nestedSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} ${SELECTOR_MENU}.${CLASS_NAME_SHOW}`, submenu);
		for (const nested of nestedSubmenus) {
			const nestedWrapper = nested.closest(SELECTOR_SUBMENU);
			this._closeSubmenu(nested, nestedWrapper);
		}
		const trigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, submenuWrapper);
		const cleanup = this._openSubmenus.get(submenu);
		if (cleanup) cleanup();
		this._openSubmenus.delete(submenu);
		EventHandler.off(submenu, `mouseenter${EVENT_KEY}`);
		this._cancelSubmenuCloseTimeout(submenu);
		if (trigger) trigger.setAttribute("aria-expanded", "false");
		submenu.classList.remove(CLASS_NAME_SHOW);
		submenuWrapper.classList.remove(CLASS_NAME_SHOW);
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
		const siblingSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} > ${SELECTOR_MENU}.${CLASS_NAME_SHOW}`, parent);
		for (const siblingMenu of siblingSubmenus) {
			const siblingWrapper = siblingMenu.closest(SELECTOR_SUBMENU);
			if (siblingWrapper !== currentSubmenuWrapper) this._closeSubmenu(siblingMenu, siblingWrapper);
		}
	}
	_createSubmenuFloating(submenu, submenuWrapper) {
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
		const updatePosition = async () => {
			if (this._usesStackedSubmenus()) {
				submenu.style.opacity = "";
				return;
			}
			await this._applyFloatingPosition(referenceElement, submenu, placement, middleware);
			submenu.style.opacity = "";
		};
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
		const backSelector = this._usesStackedSubmenus() ? `, :scope > .${CLASS_NAME_MENU_BACK} > ${SELECTOR_VISIBLE_ITEMS}` : "";
		return SelectorEngine.find(`:scope > ${SELECTOR_VISIBLE_ITEMS}, :scope > ${SELECTOR_SUBMENU} > ${SELECTOR_VISIBLE_ITEMS}${backSelector}`, menu).filter((element) => isVisible(element));
	}
	_selectMenuItem({ key, target }) {
		const currentMenu = target.closest(SELECTOR_MENU) || this._menu;
		const items = this._getItemsInMenu(currentMenu);
		if (!items.length) return;
		const nextItem = getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target));
		nextItem.focus();
		this._closeUnrelatedSubmenus(currentMenu, nextItem);
	}
	_handlePortaledTab(event) {
		if (!this._isShown() || this._menu.parentNode === this._menuOriginalParent || event.defaultPrevented) return;
		const stops = SelectorEngine.find(SELECTOR_TAB_STOPS, this._menu).filter((element) => (element.tabIndex >= 0 || element.isContentEditable && !element.hasAttribute("tabindex")) && !element.closest("[inert]") && isVisible(element));
		const first = stops[0];
		if (event.target === this._element && !event.shiftKey && first) {
			event.preventDefault();
			first.focus();
			return;
		}
		if (event.shiftKey && event.target === first) {
			event.preventDefault();
			this._element.focus();
		} else if (!event.shiftKey && event.target === stops.at(-1)) this._element.focus();
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
		const enterKey = isRtl ? ARROW_LEFT_KEY : ARROW_RIGHT_KEY;
		const exitKey = isRtl ? ARROW_RIGHT_KEY : ARROW_LEFT_KEY;
		const submenuWrapper = target.closest(SELECTOR_SUBMENU);
		const isSubmenuToggle = target.matches(SELECTOR_SUBMENU_TOGGLE);
		if ((key === ENTER_KEY || key === SPACE_KEY || key === enterKey) && submenuWrapper && isSubmenuToggle) {
			event.preventDefault();
			event.stopPropagation();
			const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper);
			if (submenu) {
				this._closeSiblingSubmenus(submenuWrapper);
				this._openSubmenu(target, submenu, submenuWrapper);
				requestAnimationFrame(() => {
					if (this._openSubmenus?.has(submenu)) (this._usesStackedSubmenus() ? this._getItemsInMenu(submenu)[0] : SelectorEngine.findOne(`${SELECTOR_VISIBLE_ITEMS}:not(.${CLASS_NAME_MENU_BACK} > *)`, submenu))?.focus();
				});
			}
			return true;
		}
		if (key === exitKey) {
			const currentMenu = target.closest(SELECTOR_MENU);
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
		if (key === HOME_KEY || key === END_KEY) {
			const currentMenu = target.closest(SELECTOR_MENU);
			if (!currentMenu) return false;
			event.preventDefault();
			event.stopPropagation();
			const items = this._getItemsInMenu(currentMenu);
			if (items.length) {
				const targetItem = key === HOME_KEY ? items[0] : items.at(-1);
				targetItem.focus();
				this._closeUnrelatedSubmenus(currentMenu, targetItem);
			}
			return true;
		}
		return false;
	}
	_handleEscape(event) {
		if (!this._isShown()) return;
		event.preventDefault();
		event.stopPropagation();
		const currentMenu = event.target.closest(SELECTOR_MENU);
		const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU);
		if (currentMenu && parentSubmenuWrapper && this._openSubmenus.has(currentMenu)) {
			this._closeSubmenu(currentMenu, parentSubmenuWrapper);
			SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper)?.focus();
			return;
		}
		this.hide();
		this._element.focus();
	}
	static clearMenus(event) {
		if (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY) return;
		for (const instance of Menu._openInstances) {
			if (instance._config.autoClose === false) continue;
			const composedPath = event.composedPath();
			const isMenuTarget = composedPath.includes(instance._menu);
			if (composedPath.includes(instance._element) || instance._config.autoClose === "inside" && !isMenuTarget || instance._config.autoClose === "outside" && isMenuTarget) continue;
			const formAncestor = event.target.closest?.("form");
			const isInsideMenuForm = Boolean(formAncestor) && instance._menu.contains(formAncestor);
			if (instance._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName) || isInsideMenuForm)) continue;
			const relatedTarget = { relatedTarget: instance._element };
			if (event.type === "click") relatedTarget.clickEvent = event;
			instance._completeHide(relatedTarget);
		}
	}
	static _getToggleFromKeydownContext(element, event) {
		if (element.matches(SELECTOR_DATA_TOGGLE)) return element;
		for (const instance of Menu._openInstances) if (instance._element === event.target || instance._menu?.contains(event.target)) return instance._element;
		return SelectorEngine.prev(element, SELECTOR_DATA_TOGGLE)[0] || SelectorEngine.next(element, SELECTOR_DATA_TOGGLE)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode);
	}
	static dataApiKeydownHandler(event) {
		if (event.isComposing || event.keyCode === 229) return;
		const { key, target } = event;
		if (key !== ESCAPE_KEY && key !== TAB_KEY) {
			const activatesSubmenu = (key === ENTER_KEY || key === SPACE_KEY) && target.matches(SELECTOR_SUBMENU_TOGGLE);
			const isMenuItemOrToggle = target.matches(`${SELECTOR_DATA_TOGGLE}, .menu-item`);
			if (!(ITEM_NAVIGATION_KEYS.has(key) || activatesSubmenu) || !isMenuItemOrToggle || target.isContentEditable || target.matches("input, select, textarea")) return;
		}
		const getToggleButton = Menu._getToggleFromKeydownContext(this, event);
		if (!getToggleButton) return;
		if (key === TAB_KEY) {
			Menu.getInstance(getToggleButton)?._handlePortaledTab(event);
			return;
		}
		const instance = Menu.getOrCreateInstance(getToggleButton);
		if (key === ESCAPE_KEY) instance._handleEscape(event);
		else if (key === ARROW_UP_KEY || key === ARROW_DOWN_KEY) {
			event.preventDefault();
			event.stopPropagation();
			instance.show();
			instance._selectMenuItem(event);
		} else instance._handleSubmenuKeydown(event);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API, Menu.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Menu.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	event.preventDefault();
	Menu.getOrCreateInstance(this).toggle();
});
//#endregion
export { Menu as default };

//# sourceMappingURL=menu.js.map