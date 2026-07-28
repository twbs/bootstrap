/*!
* Bootstrap datepicker.js v6.0.0-alpha1 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import { Calendar } from "vanilla-calendar-pro";
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import { isDisabled } from "./util/index.js";
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
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"datepicker\"]";
const HIDE_DELAY = 100;
const Default = {
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
const DefaultType = {
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
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME;
	}
	toggle() {
		if (this._config.inline) return;
		return this._isShown ? this.hide() : this.show();
	}
	show() {
		if (this._config.inline) return;
		if (!this._calendar || isDisabled(this._element) || this._isShown) return;
		if (EventHandler.trigger(this._element, EVENT_SHOW).defaultPrevented) return;
		this._calendar.show();
		this._isShown = true;
		EventHandler.trigger(this._element, EVENT_SHOWN);
	}
	hide() {
		if (this._config.inline) return;
		if (!this._calendar || !this._isShown) return;
		if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
		this._calendar.hide();
		this._isShown = false;
		EventHandler.trigger(this._element, EVENT_HIDDEN);
	}
	dispose() {
		if (this._themeObserver) {
			this._themeObserver.disconnect();
			this._themeObserver = null;
		}
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
		EventHandler.trigger(this._element, EVENT_CHANGE, {
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
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	if (this.tagName === "INPUT" || this.dataset.bsInline === "true") return;
	event.preventDefault();
	Datepicker.getOrCreateInstance(this).toggle();
});
EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE, function() {
	if (this.tagName !== "INPUT") return;
	Datepicker.getOrCreateInstance(this).show();
});
EventHandler.on(document, `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
	const selector = `${SELECTOR_DATA_TOGGLE}[data-bs-inline="true"], ${SELECTOR_DATA_TOGGLE}[data-bs-selected-dates]`;
	for (const element of document.querySelectorAll(selector)) Datepicker.getOrCreateInstance(element);
});
//#endregion
export { Datepicker as default };

//# sourceMappingURL=datepicker.js.map