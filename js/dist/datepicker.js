/*!
* Bootstrap datepicker.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import { Calendar, months } from "vanilla-calendar-pro";
import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import { onDocumentReady } from "./util/component-functions.js";
import { getTransitionDurationFromElement, getUID, isDisabled, isVisible } from "./util/index.js";
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
const NAME = "datepicker";
const EVENT_KEY = `.bs.datepicker`;
const DATA_API_KEY = ".data-api";
const EVENT_CHANGE = `change${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"datepicker\"]";
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex], [contenteditable=\"true\"]";
const Default = {
	datepickerTheme: null,
	dateMin: null,
	dateMax: null,
	dateFormat: null,
	displayElement: null,
	displayMonthsCount: 1,
	firstWeekday: 1,
	invalidDateMessage: "Enter a valid date available in the calendar.",
	inline: false,
	showOnFocus: true,
	toggleElement: null,
	locale: "default",
	positionElement: null,
	selectedDates: [],
	selectionMode: "single",
	rangeEndMessage: "Choose an end date.",
	placement: "left",
	vcpOptions: {}
};
const DefaultType = {
	datepickerTheme: "(null|string)",
	dateMin: "(null|string|number|object)",
	dateMax: "(null|string|number|object)",
	dateFormat: "(null|object|function)",
	displayElement: "(null|string|element|boolean)",
	displayMonthsCount: "number",
	firstWeekday: "number",
	inline: "boolean",
	invalidDateMessage: "string",
	showOnFocus: "boolean",
	toggleElement: "(null|string|element)",
	locale: "string",
	positionElement: "(null|string|element)",
	selectedDates: "array",
	selectionMode: "string",
	placement: "string",
	rangeEndMessage: "string",
	vcpOptions: "object"
};
const formBindings = /* @__PURE__ */ new WeakMap();
const bindFormData = (form, key, serialize) => {
	let binding = formBindings.get(form);
	if (!binding) {
		const state = {
			controls: /* @__PURE__ */ new Map(),
			handler() {}
		};
		state.handler = (event) => {
			const entries = [];
			for (const [name, value] of event.formData) {
				const control = state.controls.get(name);
				if (!control) {
					entries.push([name, value]);
					continue;
				}
				const entry = control();
				if (entry) entries.push(entry);
			}
			for (const name of new Set(event.formData.keys())) event.formData.delete(name);
			for (const [name, value] of entries) event.formData.append(name, value);
		};
		binding = state;
		formBindings.set(form, binding);
		form.addEventListener("formdata", binding.handler, true);
	}
	binding.controls.set(key, serialize);
	return () => {
		binding.controls.delete(key);
		if (binding.controls.size === 0) {
			form.removeEventListener("formdata", binding.handler, true);
			formBindings.delete(form);
		}
	};
};
/**
* Class definition
*/
var Datepicker = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._calendar = null;
		this._toggleElement = null;
		this._returnFocusElement = this._element;
		this._originalToggleAria = /* @__PURE__ */ new Map();
		this._popup = null;
		this._isShown = false;
		this._floatingCleanup = null;
		this._resetTimeouts = /* @__PURE__ */ new Set();
		this._suppressFocus = false;
		this._positionGeneration = 0;
		this._showGeneration = 0;
		this._inputName = null;
		this._inputObserver = null;
		this._form = null;
		this._formCleanup = null;
		this._dialog = null;
		this._initialDates = [];
		this._rangeDates = [];
		this._pendingRange = false;
		this._rangeStatus = null;
		this._inputError = null;
		this._inputErrorMessage = "";
		this._originalInvalid = null;
		this._eventPending = false;
		this._originalAria = new Map([
			"aria-haspopup",
			"aria-expanded",
			"aria-controls"
		].map((name) => [name, this._element.getAttribute(name)]));
		try {
			this._initCalendar();
		} catch (error) {
			this.dispose();
			throw error;
		}
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
	toggle(relatedTarget) {
		if (this._isInline) return Promise.resolve();
		return this._isShown ? this.hide() : this.show(relatedTarget);
	}
	async show(relatedTarget) {
		if (this._skipFocusTrigger(relatedTarget)) return;
		if (!this._calendar || this._isInline || this._isShown || this._eventPending || this._suppressFocus || isDisabled(this._element) || this._element.matches(":disabled")) return;
		if (this._triggerLifecycleEvent(EVENT_SHOW).defaultPrevented || !this._calendar || this._isShown) return;
		this._popup.style.removeProperty("max-inline-size");
		this._popup.style.removeProperty("max-block-size");
		this._returnFocusElement = relatedTarget || this._element;
		const generation = ++this._showGeneration;
		this._isShown = true;
		const popup = this._popup;
		this._mountPopup();
		this._syncDisplayMonths();
		this._syncPopupState(this._calendar);
		popup.removeAttribute("data-vc-calendar-closing");
		if (typeof popup.showPopover === "function" && !popup.matches(":popover-open")) popup.showPopover();
		this._element.setAttribute("aria-expanded", "true");
		await this._updatePosition();
		if (!this._isCurrentOpening(generation)) return;
		this._floatingCleanup?.();
		this._floatingCleanup = autoUpdate(this._positionElement, popup, () => {
			this._syncDisplayMonths();
			this._updatePosition();
		});
		if (!this._isInput || relatedTarget && relatedTarget !== this._element) this._focusCalendarDate();
		await this._queueCallback(() => {
			if (this._isCurrentOpening(generation)) EventHandler.trigger(this._element, EVENT_SHOWN);
		}, popup, getTransitionDurationFromElement(popup) > 0);
	}
	async hide() {
		if (!this._calendar || this._isInline || !this._isShown || this._eventPending) return;
		if (this._triggerLifecycleEvent(EVENT_HIDE).defaultPrevented || !this._calendar) return;
		const popup = this._popup;
		const animated = getTransitionDurationFromElement(popup) > 0;
		this._closePopup(animated);
		const generation = this._showGeneration;
		await this._queueCallback(() => {
			if (this._calendar && !this._isShown && generation === this._showGeneration) {
				this._finishPopupClose();
				EventHandler.trigger(this._element, EVENT_HIDDEN);
			}
		}, popup, animated);
	}
	_triggerLifecycleEvent(name) {
		this._eventPending = true;
		try {
			return EventHandler.trigger(this._element, name);
		} finally {
			this._eventPending = false;
		}
	}
	_closePopup(animated = false) {
		this._showGeneration++;
		this._isShown = false;
		this._positionGeneration++;
		if (animated) this._popup?.setAttribute("data-vc-calendar-closing", "");
		else this._finishPopupClose();
		if (this._calendar) {
			this._cancelPendingRange();
			this._syncPopupState(this._calendar);
		}
		this._element?.setAttribute("aria-expanded", "false");
	}
	_finishPopupClose() {
		this._floatingCleanup?.();
		this._floatingCleanup = null;
		if (this._popup?.matches(":popover-open")) this._popup.hidePopover();
		this._popup?.removeAttribute("data-vc-calendar-closing");
	}
	dispose() {
		this._syncBoundInput();
		this._setInputError("");
		if (this._onInvalid) this._element.removeEventListener("invalid", this._onInvalid);
		this._resetTimeouts.forEach((timeout) => clearTimeout(timeout));
		this._closePopup();
		this._themeObserver?.disconnect();
		this._inputObserver?.disconnect();
		this._formCleanup?.();
		if (this._form && this._onReset) EventHandler.off(this._form, `reset${EVENT_KEY}`, this._onReset);
		if (this._onOutside) {
			EventHandler.off(document, EVENT_FOCUSIN, this._onOutside);
			EventHandler.off(document, EVENT_POINTERDOWN, this._onOutside);
		}
		if (this._onKeydown) {
			EventHandler.off(this._element, EVENT_KEYDOWN, this._onKeydown);
			this._popup?.removeEventListener("keydown", this._onKeydown, true);
		}
		if (this._toggleElement) {
			EventHandler.off(this._toggleElement, EVENT_CLICK, this._onToggleClick);
			EventHandler.off(this._toggleElement, EVENT_KEYDOWN, this._onKeydown);
			this._restoreAria(this._toggleElement, this._originalToggleAria);
		}
		if (this._onTriggerClick) EventHandler.off(this._positionElement, EVENT_CLICK, this._onTriggerClick);
		if (this._dialog) EventHandler.off(this._dialog, "close", this._onDialogClose);
		if (this._calendar?.context.isInit) {
			this._calendar.destroy();
			this._calendar.context.mainElement.remove();
		} else this._popup?.remove();
		if (this._inputName !== null) {
			this._element.setAttribute("name", this._inputName);
			this._boundInput?.remove();
		}
		this._restoreAria(this._element, this._originalAria);
		this._calendar = null;
		super.dispose();
	}
	getSelectedDates() {
		const dates = this._config?.selectionMode === "multiple-ranged" ? this._rangeDates : this._calendar?.context.selectedDates;
		return dates ? [...dates] : [];
	}
	setSelectedDates(dates) {
		if (this._calendar) {
			for (const date of dates) if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && !this._parseIsoDate(date)) throw new TypeError("Invalid ISO date");
			this._pendingRange = false;
			this._calendar.set({ selectedDates: dates });
			this._rangeDates = [...this._calendar.context.selectedDates];
			this._syncSelectedDates(this.getSelectedDates());
		}
	}
	_getConfig(config) {
		return super._getConfig({
			vcpOptions: Default.vcpOptions,
			...config
		});
	}
	_isCurrentOpening(generation) {
		return Boolean(this._calendar) && this._isShown && generation === this._showGeneration;
	}
	_skipFocusTrigger(relatedTarget) {
		return this._isInput && relatedTarget === this._element && !this._config.showOnFocus;
	}
	_containsTrigger(target) {
		return this._positionElement.contains(target) || this._element.contains(target) || Boolean(this._toggleElement?.contains(target));
	}
	_restoreAria(element, original) {
		for (const [name, value] of original) if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
	}
	_initCalendar() {
		this._isInput = this._element.tagName === "INPUT";
		this._isInline = this._config.inline;
		if (this._isInline && !this._isInput) this._boundInput = this._element.querySelector("input[type=\"hidden\"], input[name]");
		if (this._isInput && !this._isInline && this._config.toggleElement) {
			const root = this._element.getRootNode();
			this._toggleElement = typeof this._config.toggleElement === "string" ? root.querySelector(this._config.toggleElement) : this._config.toggleElement;
			if (this._toggleElement === this._element) throw new TypeError("The Datepicker toggle must be separate from its input");
			if (this._toggleElement) this._originalToggleAria = new Map([
				"aria-haspopup",
				"aria-expanded",
				"aria-controls"
			].map((name) => [name, this._toggleElement.getAttribute(name)]));
		}
		this._positionElement = this._resolvePositionElement();
		this._displayElement = this._resolveDisplayElement();
		const display = this._displayElement;
		this._displayPlaceholder = display && this._element.contains(display) && display.hasAttribute("data-bs-datepicker-display") ? display.textContent : "";
		this._popup = document.createElement("div");
		if (this._isInline) this._element.append(this._popup);
		else {
			this._popup.id = getUID("bs-datepicker-calendar-");
			this._popup.setAttribute("popover", "manual");
			this._element.setAttribute("aria-haspopup", "dialog");
			this._element.setAttribute("aria-expanded", "false");
			this._element.setAttribute("aria-controls", this._popup.id);
			if (this._toggleElement) {
				this._toggleElement.setAttribute("aria-haspopup", "dialog");
				this._toggleElement.setAttribute("aria-controls", this._popup.id);
			}
			this._mountPopup();
		}
		this._calendar = new Calendar(this._popup, this._buildCalendarOptions());
		this._calendar.init();
		this._rangeDates = [...this._calendar.context.selectedDates];
		if (this._isInput && this._element.value && (!this._element.readOnly || !this._rangeDates.length)) this._parseInputValue();
		this._initialDates = this.getSelectedDates();
		if (this._isInput && !this._isInline) {
			this._createBoundInput();
			this._bindInputForm();
			EventHandler.on(this._element, `input${EVENT_KEY}`, () => this._parseInputValue());
			this._onInvalid = () => this._showInputError();
			EventHandler.on(this._element, `blur${EVENT_KEY}`, this._onInvalid);
			this._element.addEventListener("invalid", this._onInvalid);
		}
		this._updateDisplayWithSelectedDates();
		if (this._isInline && this._boundInput) this._bindInputForm();
		this._setupThemeObserver();
		this._setupDismiss();
	}
	_createBoundInput() {
		const name = this._element.getAttribute("name");
		if (!name) return;
		this._inputName = name;
		this._boundInput = document.createElement("input");
		this._boundInput.type = "hidden";
		this._boundInput.id = getUID("bs-datepicker-");
		this._boundInput.name = this._boundInput.id;
		this._element.before(this._boundInput);
		this._element.removeAttribute("name");
		this._syncBoundInput();
		this._inputObserver = new MutationObserver(() => {
			this._syncBoundInput();
			this._bindInputForm();
		});
		this._inputObserver.observe(this._element, {
			attributes: true,
			attributeFilter: [
				"name",
				"disabled",
				"form"
			]
		});
	}
	_syncBoundInput() {
		if (this._inputName === null || !this._boundInput) return;
		const name = this._element.getAttribute("name");
		if (name !== null) {
			this._inputName = name;
			this._element.removeAttribute("name");
		}
		const form = this._element.getAttribute("form");
		if (form === null) this._boundInput.removeAttribute("form");
		else this._boundInput.setAttribute("form", form);
		this._boundInput.value = this.getSelectedDates().join(",");
	}
	_bindInputForm() {
		const form = this._isInput ? this._element.form : this._boundInput?.form ?? null;
		if (form === this._form) return;
		this._formCleanup?.();
		this._resetTimeouts.forEach((timeout) => clearTimeout(timeout));
		this._resetTimeouts.clear();
		if (this._form) EventHandler.off(this._form, `reset${EVENT_KEY}`, this._onReset);
		this._form = form;
		if (!form) return;
		if (this._inputName !== null && this._boundInput) this._formCleanup = bindFormData(form, this._boundInput.name, () => {
			this._syncBoundInput();
			return this._element.matches(":disabled") || isDisabled(this._element) || !this._inputName ? null : [this._inputName, this.getSelectedDates().join(",")];
		});
		this._onReset = (event) => {
			const timeout = setTimeout(() => {
				this._resetTimeouts.delete(timeout);
				if (!event.defaultPrevented && this._calendar && event.target === this._form) this.setSelectedDates(this._initialDates);
			}, 0);
			this._resetTimeouts.add(timeout);
		};
		EventHandler.on(form, `reset${EVENT_KEY}`, this._onReset);
	}
	_mountPopup() {
		let ancestor = this._element;
		let dialog = null;
		while (ancestor && !dialog) {
			dialog = ancestor.closest("dialog[open]");
			const root = ancestor.getRootNode();
			ancestor = root instanceof ShadowRoot ? root.host : null;
		}
		if (dialog !== this._dialog) {
			if (this._dialog) EventHandler.off(this._dialog, "close", this._onDialogClose);
			this._dialog = dialog;
			this._onDialogClose = () => this._closePopup();
			if (dialog) EventHandler.on(dialog, "close", this._onDialogClose);
		}
		const root = this._element.getRootNode();
		const parent = root instanceof ShadowRoot ? root : dialog || document.body;
		if (this._popup.parentNode !== parent) parent.append(this._popup);
	}
	async _updatePosition() {
		const popup = this._popup;
		if (!popup || !this._isShown && !popup.hasAttribute("data-vc-calendar-closing")) return;
		const generation = ++this._positionGeneration;
		const left = popup.dir === "rtl" ? "-end" : "-start";
		const right = popup.dir === "rtl" ? "-start" : "-end";
		const alignment = this._config.placement === "center" ? "" : this._config.placement === "right" ? right : left;
		const result = await computePosition(this._positionElement, popup, {
			placement: `bottom${alignment}`,
			strategy: "fixed",
			middleware: [
				offset(4),
				flip({ padding: 8 }),
				shift({
					padding: 8,
					crossAxis: true
				}),
				size({
					padding: 8,
					apply: ({ availableWidth, availableHeight, elements }) => {
						if (generation === this._positionGeneration) Object.assign(elements.floating.style, {
							maxInlineSize: `${Math.max(0, availableWidth)}px`,
							maxBlockSize: `${Math.max(0, availableHeight)}px`
						});
					}
				})
			]
		});
		if (generation !== this._positionGeneration || !this._isShown && !popup.hasAttribute("data-vc-calendar-closing")) return;
		Object.assign(popup.style, {
			position: result.strategy,
			left: `${result.x}px`,
			top: `${result.y}px`
		});
		popup.dataset.vcPosition = result.placement.startsWith("top") ? "top" : "bottom";
	}
	_getCalendarLabel() {
		const root = this._element.getRootNode();
		const label = this._element.getAttribute("aria-labelledby")?.trim().split(/\s+/).map((id) => {
			const label = root.getElementById?.(id);
			return label?.hasAttribute("data-bs-datepicker-display") ? "" : label?.textContent.trim();
		}).filter(Boolean).join(" ") || this._element.getAttribute("aria-label");
		if (label) return label;
		if (this._isInput) return [...this._element.labels || []].map((label) => label.textContent.trim()).filter(Boolean).join(" ");
		return "";
	}
	_getDisplayMonths() {
		const { displayMonthsCount } = this._config;
		return displayMonthsCount > 1 && !this._isInline && window.matchMedia("(width < 576px)").matches ? 1 : displayMonthsCount;
	}
	_syncDisplayMonths() {
		const calendar = this._calendar;
		const count = this._getDisplayMonths();
		if (!calendar || calendar.displayMonthsCount === count) return;
		const root = this._popup.getRootNode();
		const hadFocus = this._popup.contains(root.activeElement);
		calendar.set({
			type: count > 1 ? "multiple" : "default",
			displayMonthsCount: count,
			selectedDates: [...calendar.context.selectedDates]
		}, {
			month: false,
			year: false
		});
		if (hadFocus) this._focusCalendarDate();
	}
	_syncPopupState(self) {
		this._normalizeRangeDates(self);
		const popup = self.context.mainElement;
		if (!this._isInline) {
			popup.dataset.vcInput = "";
			popup.role = "dialog";
			const label = this._getCalendarLabel();
			if (label) popup.setAttribute("aria-label", label);
			popup.toggleAttribute("data-vc-calendar-hidden", !this._isShown);
			popup.inert = !this._isShown;
			popup.setAttribute("aria-hidden", String(!this._isShown));
			this._toggleElement?.setAttribute("aria-expanded", String(this._isShown));
		}
		if (this._config.selectionMode === "multiple-ranged") {
			this._rangeStatus ??= document.createElement("span");
			if (!popup.contains(this._rangeStatus)) {
				this._rangeStatus.className = "visually-hidden";
				this._rangeStatus.setAttribute("role", "status");
				popup.append(this._rangeStatus);
			}
			this._updateRangeStatus();
		}
		this._syncThemeAttribute(popup);
	}
	_updateRangeStatus() {
		const message = this._pendingRange ? this._config.rangeEndMessage : "";
		if (this._rangeStatus && this._rangeStatus.textContent !== message) this._rangeStatus.textContent = message;
	}
	_updateDisplayWithSelectedDates() {
		const selectedDates = this.getSelectedDates();
		if (selectedDates.length > 0) this._syncSelectedDates(selectedDates);
	}
	_syncSelectedDates(selectedDates) {
		this._setInputError("");
		const formattedDate = this._formatDateForInput(selectedDates);
		if (this._isInput) this._element.value = formattedDate;
		if (this._boundInput) {
			this._boundInput.value = selectedDates.join(",");
			this._syncBoundInput();
		}
		this._syncDisplay(selectedDates, formattedDate);
	}
	_syncDisplay(selectedDates, formattedDate = this._formatDateForInput(selectedDates)) {
		if (this._displayElement) {
			const endPlaceholder = this._displayElement.dataset.bsDatepickerEndPlaceholder;
			const partialRange = this._config.selectionMode === "multiple-ranged" && selectedDates.length === 1;
			this._displayElement.textContent = partialRange && endPlaceholder ? `${formattedDate} – ${endPlaceholder}` : selectedDates.length ? formattedDate : this._displayPlaceholder;
		}
	}
	_resolvePositionElement() {
		let { positionElement } = this._config;
		if (typeof positionElement === "string") positionElement = this._element.getRootNode().querySelector(positionElement);
		if (!positionElement && this._isInput && !this._isInline) {
			const parent = this._element.closest(".form-adorn");
			if (parent) positionElement = parent;
		}
		return positionElement || this._element;
	}
	_resolveDisplayElement() {
		const { displayElement } = this._config;
		if (typeof displayElement === "string") return this._element.getRootNode().querySelector(displayElement);
		if (displayElement === true || displayElement === null && !this._isInput && !this._isInline) return this._element.querySelector("[data-bs-datepicker-display]") || this._element;
		return displayElement;
	}
	_getThemeAncestor() {
		return this._element.closest("[data-bs-theme]");
	}
	_getEffectiveTheme() {
		return this._config.datepickerTheme || this._getThemeAncestor()?.getAttribute("data-bs-theme") || null;
	}
	_syncThemeAttribute(element) {
		if (!element) return;
		const theme = this._getEffectiveTheme();
		if (theme) element.setAttribute("data-bs-theme", theme);
		else element.removeAttribute("data-bs-theme");
		const computed = getComputedStyle(this._element);
		element.dir = computed.direction;
		const explicit = this._config.datepickerTheme;
		element.style.colorScheme = explicit === "auto" ? "light dark" : explicit === "light" || explicit === "dark" ? explicit : computed.colorScheme;
		if (!this._isInline) for (const prefix of ["", "bs-"]) for (const role of [
			"base",
			"bg",
			"bg-subtle",
			"bg-muted",
			"fg",
			"fg-emphasis",
			"contrast",
			"border",
			"focus-ring"
		]) {
			const property = `--${prefix}theme-${role}`;
			const value = computed.getPropertyValue(property);
			if (value) element.style.setProperty(property, value);
			else element.style.removeProperty(property);
		}
	}
	_setupThemeObserver() {
		this._themeObserver = new MutationObserver((records) => {
			if (records.some((record) => {
				if (!(record.target instanceof Element)) return false;
				let node = this._element;
				while (node) {
					if (record.target.contains(node)) return true;
					const root = node.getRootNode();
					node = root instanceof ShadowRoot ? root.host : null;
				}
				return false;
			})) this._syncThemeAttribute(this._popup ?? void 0);
		});
		const root = this._element.getRootNode();
		const options = {
			subtree: true,
			attributes: true,
			attributeFilter: [
				"data-bs-theme",
				"class",
				"style",
				"dir"
			]
		};
		this._themeObserver.observe(document.documentElement, options);
		if (root instanceof ShadowRoot) this._themeObserver.observe(root, options);
	}
	_setupDismiss() {
		this._onKeydown = (event) => this._handleKeydown(event);
		this._popup?.addEventListener("keydown", this._onKeydown, true);
		if (this._isInline) return;
		this._onTriggerClick = (event) => {
			if (event.target instanceof Node && this._toggleElement?.contains(event.target)) return;
			if (this._isInput) this.show(this._element);
			else if (this._element.dataset.bsToggle !== NAME) this.toggle();
		};
		EventHandler.on(this._positionElement, EVENT_CLICK, this._onTriggerClick);
		if (this._isInput) EventHandler.on(this._element, EVENT_FOCUSIN, () => this.show(this._element));
		this._onOutside = (event) => {
			if (!this._isShown) return;
			if (!event.composedPath().some((node) => node instanceof Node && (this._positionElement.contains(node) || this._element.contains(node) || this._toggleElement?.contains(node) || this._popup?.contains(node)))) this.hide();
		};
		EventHandler.on(document, EVENT_FOCUSIN, this._onOutside);
		EventHandler.on(document, EVENT_POINTERDOWN, this._onOutside);
		EventHandler.on(this._element, EVENT_KEYDOWN, this._onKeydown);
		if (this._toggleElement) {
			this._onToggleClick = () => {
				if (!isDisabled(this._toggleElement) && !this._toggleElement.matches(":disabled")) this.toggle(this._toggleElement);
			};
			EventHandler.on(this._toggleElement, EVENT_CLICK, this._onToggleClick);
			EventHandler.on(this._toggleElement, EVENT_KEYDOWN, this._onKeydown);
		}
	}
	_focusCalendarDate() {
		for (const selector of [
			"[data-vc-date-selected] [data-vc-date-btn]",
			"[data-vc-date-today] [data-vc-date-btn]",
			"[data-vc-date-btn][tabindex=\"0\"]",
			"button"
		]) {
			const control = [...this._popup?.querySelectorAll(selector) || []].find((element) => !isDisabled(element) && isVisible(element));
			if (control) {
				control.focus();
				return;
			}
		}
	}
	_focusTrigger() {
		if (!this._element) return;
		this._suppressFocus = true;
		(this._returnFocusElement?.isConnected ? this._returnFocusElement : this._element).focus();
		this._suppressFocus = false;
	}
	_handleKeydown(event) {
		const { target } = event;
		if (!this._isShown && !this._isInline || !(target instanceof Node) || !this._containsTrigger(target) && !this._popup?.contains(target)) return;
		if (this._handleCalendarNavigation(event)) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (this._isInline) {
			this._handleInlineEscape(event);
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			this.hide();
			if (!this._isShown) this._focusTrigger();
			return;
		}
		if (event.key !== "Tab") return;
		const controls = [...this._popup.querySelectorAll(FOCUSABLE)].filter((element) => element.tabIndex >= 0 && !isDisabled(element) && isVisible(element));
		if (this._containsTrigger(target)) {
			if (!event.shiftKey && controls[0]) {
				event.preventDefault();
				controls[0].focus();
			} else this.hide();
			return;
		}
		if (target === (event.shiftKey ? controls[0] : controls.at(-1))) {
			this.hide();
			if (this._isShown) event.preventDefault();
			else {
				this._focusTrigger();
				if (event.shiftKey) event.preventDefault();
			}
		}
	}
	_handleInlineEscape(event) {
		if (event.key !== "Escape" || !this._pendingRange) return;
		event.preventDefault();
		event.stopPropagation();
		const date = event.target.closest("[data-vc-date]")?.dataset.vcDate;
		this._cancelPendingRange();
		const control = date && this._findCalendarDay(date);
		if (control) this._focusDay(control);
		else this._focusCalendarDate();
	}
	_findCalendarDay(date) {
		return this._popup?.querySelector(`[data-vc-date="${date}"][data-vc-date-month="current"] [data-vc-date-btn]:not(:disabled)`) ?? null;
	}
	_focusDay(day) {
		day.closest("[role=\"grid\"]")?.querySelectorAll("[data-vc-date-btn][tabindex=\"0\"]").forEach((control) => {
			control.tabIndex = -1;
		});
		day.tabIndex = 0;
		day.focus();
	}
	_handleCalendarNavigation(event) {
		const { target } = event;
		if (!this._calendar || !(target instanceof HTMLElement) || !target.matches("[data-vc-date-btn]") || event.altKey || event.ctrlKey || event.metaKey) return false;
		const day = target.closest("[data-vc-date]");
		const date = this._parseIsoDate(day?.dataset.vcDate || "");
		if (!date) return false;
		const { key } = event;
		const page = key === "PageUp" || key === "PageDown";
		const week = key === "Home" || key === "End";
		if (!page && !week && !key.startsWith("Arrow")) return false;
		const currentMonth = date.getMonth();
		let direction;
		if (page) {
			direction = key === "PageUp" ? -1 : 1;
			const dayOfMonth = date.getDate();
			date.setDate(1);
			date.setMonth(currentMonth + (event.shiftKey ? 12 : 1) * direction);
			const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
			date.setDate(Math.min(dayOfMonth, monthEnd));
		} else if (week) {
			const weekday = (date.getDay() - this._config.firstWeekday + 7) % 7;
			date.setDate(date.getDate() + (key === "Home" ? -weekday : 6 - weekday));
			direction = key === "Home" ? 1 : -1;
		} else {
			const rtl = this._popup?.dir === "rtl";
			const step = {
				ArrowLeft: rtl ? 1 : -1,
				ArrowRight: rtl ? -1 : 1,
				ArrowUp: -7,
				ArrowDown: 7
			}[key];
			if (!step) return false;
			date.setDate(date.getDate() + step);
			if (date.getMonth() === currentMonth && day?.dataset.vcDateMonth === "current") return false;
			direction = Math.sign(step);
		}
		this._focusNavigationDate(date, direction, target);
		return true;
	}
	_focusNavigationDate(date, direction, target) {
		const calendar = this._calendar;
		const { displayDateMin, displayDateMax } = calendar.context;
		let iso = this._toIsoDate(date);
		if (iso < displayDateMin) iso = displayDateMin;
		else if (iso > displayDateMax) iso = displayDateMax;
		date = this._parseIsoDate(iso) || date;
		const month = date.getMonth();
		if (!this._findCalendarDay(iso) && (month !== calendar.context.selectedMonth || date.getFullYear() !== calendar.context.selectedYear)) calendar.set({
			selectedMonth: month,
			selectedYear: date.getFullYear(),
			selectedDates: [...calendar.context.selectedDates]
		});
		let control = this._findCalendarDay(iso);
		while (!control && date.getMonth() === month) {
			date.setDate(date.getDate() + direction);
			if (date.getMonth() === month) control = this._findCalendarDay(this._toIsoDate(date));
		}
		if (control) this._focusDay(control);
		else if (!target.isConnected) this._focusCalendarDate();
	}
	_buildCalendarOptions() {
		const theme = this._getEffectiveTheme();
		const vcpTheme = !theme || theme === "auto" ? "system" : theme;
		const displayMonthsCount = this._getDisplayMonths();
		const calendarOptions = {
			...this._config.vcpOptions,
			extensions: [months],
			inputMode: false,
			positionToInput: this._config.placement,
			firstWeekday: this._config.firstWeekday,
			locale: this._config.vcpOptions.locale ?? this._config.locale,
			selectionDatesMode: this._config.selectionMode,
			selectedDates: this._config.selectedDates,
			displayMonthsCount,
			type: displayMonthsCount > 1 ? "multiple" : "default",
			selectedTheme: vcpTheme,
			themeAttrDetect: "[data-bs-theme]",
			onClickDate: (self, event) => this._handleDateClick(self, event),
			onInit: (self) => this._syncPopupState(self),
			onUpdate: (self) => this._syncPopupState(self)
		};
		if (this._config.selectedDates.length > 0) {
			const firstDate = this._parseIsoDate(this._config.selectedDates[0]);
			if (!firstDate) throw new TypeError("Invalid ISO date");
			calendarOptions.selectedMonth = firstDate.getMonth();
			calendarOptions.selectedYear = firstDate.getFullYear();
		}
		if (this._config.dateMin) calendarOptions.dateMin = this._config.dateMin;
		if (this._config.dateMax) calendarOptions.dateMax = this._config.dateMax;
		return calendarOptions;
	}
	_normalizeRangeDates(self) {
		if (this._config.selectionMode === "multiple-ranged" && self.context.selectedDates.length && !self.context.selectedDates[0]) self.context.selectedDates.length = 0;
	}
	_cancelPendingRange() {
		if (!this._pendingRange || !this._calendar) return;
		this._pendingRange = false;
		this._calendar.set({ selectedDates: this._rangeDates }, {
			month: false,
			year: false
		});
		this._syncDisplay(this._rangeDates);
	}
	_handleDateClick(self, event) {
		this._normalizeRangeDates(self);
		const selectedDates = [...self.context.selectedDates];
		if (this._config.selectionMode === "multiple-ranged") {
			if (selectedDates.length === 1) {
				this._pendingRange = true;
				this._updateRangeStatus();
				this._syncDisplay(selectedDates);
				return;
			}
			if (this._pendingRange && selectedDates.length === 0) {
				this._cancelPendingRange();
				return;
			}
			this._pendingRange = false;
			this._rangeDates = selectedDates;
			this._updateRangeStatus();
		}
		this._syncSelectedDates(selectedDates);
		EventHandler.trigger(this._element, EVENT_CHANGE, {
			dates: selectedDates,
			event
		});
		if (this._calendar && this._element) this._maybeHideAfterSelection(selectedDates);
	}
	_maybeHideAfterSelection(selectedDates) {
		if (this._isInline) return;
		if (this._config.selectionMode === "single" && selectedDates.length > 0 || this._config.selectionMode === "multiple-ranged" && selectedDates.length >= 2) {
			const root = this._popup.getRootNode();
			const wasInCalendar = this._popup?.contains(root.activeElement);
			this.hide();
			const active = root.activeElement;
			if (!this._isShown && this._calendar && wasInCalendar && (active === document.body || this._popup?.contains(active))) this._focusTrigger();
		}
	}
	_parseIsoDate(value) {
		const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
		if (!parts) return null;
		const year = Number(parts[1]);
		const month = Number(parts[2]) - 1;
		const day = Number(parts[3]);
		const date = /* @__PURE__ */ new Date(0);
		date.setHours(0, 0, 0, 0);
		date.setFullYear(year, month, day);
		return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
	}
	_parseDate(value) {
		return this._parseIsoDate(value) ?? /* @__PURE__ */ new Date(NaN);
	}
	_toIsoDate(date) {
		return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
	_setInputError(message) {
		if (!this._isInput) return;
		const input = this._element;
		if (!input.validity.customError || input.validationMessage === this._inputErrorMessage) input.setCustomValidity(message);
		this._inputErrorMessage = message;
		if (!message && this._inputError) {
			const descriptions = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== this._inputError.id);
			if (descriptions.length) input.setAttribute("aria-describedby", descriptions.join(" "));
			else input.removeAttribute("aria-describedby");
			if (this._originalInvalid === null) input.removeAttribute("aria-invalid");
			else input.setAttribute("aria-invalid", this._originalInvalid);
			this._inputError.remove();
			this._inputError = null;
		}
	}
	_showInputError() {
		if (!this._inputErrorMessage || this._inputError) return;
		const error = document.createElement("div");
		error.id = getUID("bs-datepicker-error-");
		error.className = "form-text fg-danger";
		error.setAttribute("role", "status");
		this._positionElement.after(error);
		error.textContent = this._inputErrorMessage;
		this._inputError = error;
		this._originalInvalid = this._element.getAttribute("aria-invalid");
		this._element.setAttribute("aria-invalid", "true");
		const describedBy = this._element.getAttribute("aria-describedby");
		this._element.setAttribute("aria-describedby", describedBy ? `${describedBy} ${error.id}` : error.id);
	}
	_parseInputValue() {
		this._pendingRange = false;
		const value = this._element.value.trim();
		let date = this._parseIsoDate(value);
		if (!date && !/^\d{4}-/.test(value) && typeof this._config.dateFormat !== "function") {
			const numbers = value.match(/\d+/g);
			const locale = this._config.locale === "default" ? void 0 : this._config.locale;
			const order = new Intl.DateTimeFormat(locale, this._config.dateFormat ?? void 0).formatToParts(new Date(2e3, 0, 1)).filter((part) => [
				"year",
				"month",
				"day"
			].includes(part.type));
			if (numbers?.length === 3 && order.length === 3) {
				const parts = Object.fromEntries(order.map((part, index) => [part.type, numbers[index]]));
				if (parts.year.length === 4) {
					const iso = `${parts.year}-${parts.month.padStart(2, "0")}-${parts.day.padStart(2, "0")}`;
					const candidate = this._parseIsoDate(iso);
					if (candidate && this._formatDate(iso) === value) date = candidate;
				}
			}
		}
		const dates = date && this._config.selectionMode !== "multiple-ranged" ? [this._toIsoDate(date)] : [];
		this._calendar?.set({
			selectedDates: dates,
			...date ? {
				selectedMonth: date.getMonth(),
				selectedYear: date.getFullYear()
			} : {}
		});
		if (dates.length && this._calendar) {
			const button = this._popup?.querySelector(`[data-vc-date="${dates[0]}"] [data-vc-date-btn]`);
			if (!button || isDisabled(button)) this._calendar.set({ selectedDates: [] });
		}
		this._rangeDates = [...this._calendar?.context.selectedDates || []];
		this._setInputError(this._element.value && this.getSelectedDates().length === 0 ? this._config.invalidDateMessage : "");
		this._syncBoundInput();
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	if (this.tagName === "INPUT" || this.dataset.bsInline === "true") return;
	event.preventDefault();
	Datepicker.getOrCreateInstance(this).toggle(this);
});
EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE, function() {
	if (this.tagName !== "INPUT") return;
	Datepicker.getOrCreateInstance(this).show(this);
});
onDocumentReady(`DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
	const selector = [
		`${SELECTOR_DATA_TOGGLE}[data-bs-inline="true"]`,
		`${SELECTOR_DATA_TOGGLE}[data-bs-selected-dates]`,
		`input${SELECTOR_DATA_TOGGLE}[value]:not([value=""])`,
		`input${SELECTOR_DATA_TOGGLE}[data-bs-toggle-element]`
	].join(", ");
	for (const element of document.querySelectorAll(selector)) Datepicker.getOrCreateInstance(element);
});
//#endregion
export { Datepicker as default };

//# sourceMappingURL=datepicker.js.map