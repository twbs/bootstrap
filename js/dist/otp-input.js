/*!
* Bootstrap otp-input.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import { onDocumentReady } from "./util/component-functions.js";
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
const NAME = "otpInput";
const EVENT_KEY = `.bs.otpInput`;
const DATA_API_KEY = ".data-api";
const EVENT_COMPLETE = `complete${EVENT_KEY}`;
const EVENT_INPUT = `input${EVENT_KEY}`;
const EVENT_DOMCONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_DATA_OTP = "[data-bs-otp]";
const SELECTOR_INPUT = "input";
const CLASS_NAME_INPUT = "otp-input";
const CLASS_NAME_RENDERED = "otp-rendered";
const CLASS_NAME_SLOTS = "otp-slots";
const CLASS_NAME_SLOT = "otp-slot";
const CLASS_NAME_SLOT_FILLED = "otp-slot-filled";
const CLASS_NAME_SLOT_ACTIVE = "otp-slot-active";
const CLASS_NAME_SLOT_SELECTED = "otp-slot-selected";
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
const Default = {
	groups: null,
	length: null,
	mask: false,
	pasteTransformer: null,
	separator: "·",
	type: "numeric"
};
const DefaultType = {
	groups: "(array|null)",
	length: "(number|null)",
	mask: "boolean",
	pasteTransformer: "(function|null)",
	separator: "string",
	type: "string"
};
/**
* Class definition
*/
var OtpInput = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		const input = SelectorEngine.findOne(SELECTOR_INPUT, this._element);
		if (!input) return;
		this._input = input;
		this._type = TYPES[this._config.type] || TYPES.numeric;
		this._length = this._resolveLength();
		this._slots = [];
		this._pointerActive = false;
		this._pointerIndex = 0;
		this._touchPointer = false;
		this._setupInput();
		this._lastCompleteValue = null;
		this._renderSlots();
		this._addEventListeners();
		this._render();
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
		this._lastCompleteValue = null;
		this._render();
		this._input.focus();
	}
	focus() {
		this._input.focus();
		this._selectSlot(this._firstEmptyIndex());
		this._render();
	}
	dispose() {
		for (const [type, listener] of Object.entries(this._inputListeners ?? {})) EventHandler.off(this._input, type, listener);
		EventHandler.off(document, "selectionchange", this._onSelectionChange);
		document.removeEventListener("reset", this._onReset, true);
		for (const [attribute, value] of this._inputDefaults ?? []) if (this._input.getAttribute(attribute) === value) this._input.removeAttribute(attribute);
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
		this._inputDefaults = /* @__PURE__ */ new Map();
		const pattern = input.minLength > 0 ? `${this._type.pattern.slice(0, -1)}{${input.minLength},}` : this._type.pattern;
		const defaults = {
			inputmode: this._type.inputmode,
			pattern,
			spellcheck: "false"
		};
		for (const [attribute, value] of Object.entries(defaults)) if (!input.hasAttribute(attribute)) {
			input.setAttribute(attribute, value);
			this._inputDefaults.set(attribute, value);
		}
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
		this._inputListeners = {
			input: (event) => this._handleInput(event),
			compositionend: () => this._handleInput(),
			beforeinput: (event) => this._handleBeforeInput(event),
			keydown: (event) => this._handleKeydown(event),
			paste: (event) => this._handlePaste(event),
			pointerdown: (event) => this._handlePointerDown(event),
			pointercancel: () => {
				this._touchPointer = false;
			},
			click: (event) => this._handleClick(event)
		};
		this._inputListeners.focus = () => {
			if (this._pointerActive) {
				this._pointerActive = false;
				this._selectSlot(this._pointerIndex);
				this._render();
				return;
			}
			this._selectSlot(this._firstEmptyIndex());
			this._render();
		};
		const onSync = () => this._render();
		this._onSelectionChange = () => {
			if (document.activeElement === this._input) this._render();
		};
		for (const type of [
			"blur",
			"keyup",
			"select"
		]) this._inputListeners[type] = onSync;
		for (const [type, listener] of Object.entries(this._inputListeners)) EventHandler.on(this._input, type, listener);
		EventHandler.on(document, "selectionchange", this._onSelectionChange);
		this._onReset = (event) => {
			if (event.target !== this._input.form) return;
			setTimeout(() => {
				if (event.defaultPrevented || event.target !== this._input?.form) return;
				const sanitized = this._sanitize(this._input.value);
				if (sanitized !== this._input.value) this._input.value = sanitized;
				this._lastCompleteValue = null;
				this._render();
			});
		};
		document.addEventListener("reset", this._onReset, true);
	}
	_handleInput(event) {
		if (event?.isComposing) return;
		const { value, selectionStart } = this._input;
		const sanitized = this._sanitize(value);
		if (sanitized !== value) this._input.value = sanitized;
		if (document.activeElement === this._input) {
			const inputType = event?.inputType;
			if (inputType === "insertText" || inputType?.startsWith("delete")) {
				const caret = selectionStart ?? sanitized.length;
				this._selectSlot(this._sanitize(value.slice(0, caret)).length);
			} else if (!inputType || inputType === "insertReplacementText") this._selectSlot(this._firstEmptyIndex());
		}
		this._afterValueChange();
	}
	_handlePaste(event) {
		const pastedValue = event.clipboardData?.getData("text");
		if (!pastedValue || !this._isEditable()) return;
		const transformed = this._config.pasteTransformer?.(pastedValue) ?? pastedValue;
		const sanitized = this._sanitize(transformed);
		let start = this._input.selectionStart ?? this._input.value.length;
		let end = this._input.selectionEnd ?? start;
		if (sanitized.length === this._length) {
			start = 0;
			end = this._input.value.length;
		}
		const inserted = sanitized.slice(0, this._length - this._input.value.length + end - start);
		if (start === this._input.selectionStart && end === this._input.selectionEnd && inserted === pastedValue) return;
		event.preventDefault();
		if (!inserted) return;
		const input = this._input;
		if (input.matches(":focus")) {
			input.setSelectionRange(start, end);
			if (input.ownerDocument.execCommand("insertText", false, inserted)) return;
		}
		input.setRangeText(inserted, start, end, "end");
		input.dispatchEvent(new InputEvent("input", {
			bubbles: true,
			composed: true,
			inputType: "insertFromPaste",
			data: inserted
		}));
	}
	_handleBeforeInput(event) {
		const { inputType, data, isComposing } = event;
		if (inputType !== "insertText" || isComposing || data?.length !== 1 || !this._isEditable()) return;
		if (!this._sanitize(data)) {
			event.preventDefault();
			return;
		}
		if (this._input.selectionStart === this._input.selectionEnd) this._selectSlot(this._input.selectionStart ?? 0);
	}
	_handleKeydown(event) {
		const { key, altKey, ctrlKey, metaKey, shiftKey, isComposing, defaultPrevented } = event;
		if (defaultPrevented || isComposing || altKey || ctrlKey || metaKey || shiftKey || key !== "ArrowLeft" && key !== "ArrowRight") return;
		if (getComputedStyle(this._slotsContainer).direction !== "rtl") return;
		const start = this._input.selectionStart ?? 0;
		const end = this._input.selectionEnd ?? start;
		const isMovingRight = key === "ArrowRight";
		const rangeEdge = isMovingRight ? start : end;
		const nextSlot = start + (isMovingRight ? -1 : 1);
		const index = end - start > 1 ? rangeEdge : nextSlot;
		event.preventDefault();
		this._selectSlot(Math.min(index, this._firstEmptyIndex()));
		this._render();
	}
	_handleClick(event) {
		if (!this._touchPointer) return;
		this._touchPointer = false;
		const index = this._slotIndexFromPoint(event.clientX);
		if (index === null) return;
		requestAnimationFrame(() => {
			if (this._input && document.activeElement === this._input) {
				this._selectSlot(Math.min(index, this._firstEmptyIndex()));
				this._render();
			}
		});
	}
	_handlePointerDown(event) {
		if (event.button !== 0 || this._input.matches(":disabled")) return;
		this._touchPointer = event.pointerType === "touch";
		const index = this._slotIndexFromPoint(event.clientX);
		if (index === null) return;
		const target = Math.min(index, this._firstEmptyIndex());
		if (document.activeElement === this._input) {
			if (!this._touchPointer) {
				event.preventDefault();
				this._selectSlot(target);
				this._render();
			}
			return;
		}
		this._pointerActive = true;
		this._pointerIndex = target;
	}
	_slotIndexFromPoint(x) {
		const rtl = getComputedStyle(this._slotsContainer).direction === "rtl";
		for (const [index, slot] of this._slots.entries()) {
			const { left, right } = slot.getBoundingClientRect();
			if ((rtl ? x >= left : x <= right) || index === this._slots.length - 1) return index;
		}
		return null;
	}
	_afterValueChange() {
		this._render();
		EventHandler.trigger(this._element, EVENT_INPUT, { value: this._input.value });
		if (this._input) this._checkComplete();
	}
	_firstEmptyIndex() {
		return Math.min(this._input.value.length, this._length - 1);
	}
	_isEditable() {
		return !this._input.readOnly && !this._input.matches(":disabled");
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
		const start = this._input.selectionStart ?? value.length;
		const end = this._input.selectionEnd ?? start;
		const caret = Math.min(start, this._length - 1);
		for (const [index, slot] of this._slots.entries()) {
			const char = value[index] ?? "";
			const placeholder = value ? "" : this._input.placeholder[index] ?? "";
			const text = char && this._config.mask ? MASK_CHARACTER : char || placeholder;
			if (slot.textContent !== text) slot.textContent = text;
			slot.classList.toggle(CLASS_NAME_SLOT_FILLED, Boolean(char));
			slot.classList.toggle(CLASS_NAME_SLOT_ACTIVE, isFocused && index === caret);
			slot.classList.toggle(CLASS_NAME_SLOT_SELECTED, isFocused && end - start > 1 && index >= start && index < end);
		}
	}
	_checkComplete() {
		const { value } = this._input;
		const completeValue = value.length === this._length ? value : null;
		const changed = completeValue !== this._lastCompleteValue;
		this._lastCompleteValue = completeValue;
		if (completeValue && changed) EventHandler.trigger(this._element, EVENT_COMPLETE, { value });
	}
};
/**
* Data API implementation
*/
onDocumentReady(EVENT_DOMCONTENT_LOADED, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) OtpInput.getOrCreateInstance(element);
});
//#endregion
export { OtpInput as default };

//# sourceMappingURL=otp-input.js.map