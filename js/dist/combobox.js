/*!
* Bootstrap combobox.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
import BaseComponent from "./base-component.js";
import EventHandler from "./dom/event-handler.js";
import SelectorEngine from "./dom/selector-engine.js";
import Menu from "./menu.js";
import { onDocumentReady } from "./util/component-functions.js";
import { getElement, getNextActiveElement, getUID, isDisabled, isVisible, setAriaAttribute } from "./util/index.js";
//#region js/src/combobox.ts
/**
* Constants
*/
const NAME = "combobox";
const EVENT_KEY = `.bs.combobox`;
const DATA_API_KEY = ".data-api";
const ESCAPE_KEY = "Escape";
const TAB_KEY = "Tab";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";
const HOME_KEY = "Home";
const END_KEY = "End";
const ENTER_KEY = "Enter";
const SPACE_KEY = " ";
const EVENT_CHANGE = `change${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_SHOW = "show";
const CLASS_NAME_SELECTED = "selected";
const CLASS_NAME_PLACEHOLDER = "combobox-placeholder";
const DISMISS_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><line x1=\"4\" y1=\"4\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"4\" x2=\"4\" y2=\"12\"/></svg>";
const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"combobox\"]";
const SELECTOR_MENU = ".menu";
const SELECTOR_MENU_ITEM = ".menu-item[data-bs-value]";
const SELECTOR_VISIBLE_ITEMS = ".menu-item[data-bs-value]:not(.disabled):not(:disabled)";
const SELECTOR_VALUE = ".combobox-value";
const SELECTOR_SEARCH_INPUT = ".combobox-search-input";
const SELECTOR_NO_RESULTS = ".combobox-no-results";
var ComboboxMenu = class extends Menu {
	show(focus) {
		return this._show(focus);
	}
};
const Default = {
	allowCustom: false,
	createOnBlur: false,
	maxItems: null,
	separator: null,
	boundary: "clippingParents",
	input: null,
	multiple: false,
	name: null,
	offset: [0, 2],
	placeholder: "",
	placement: "bottom-start",
	search: false,
	searchNormalize: false
};
const DefaultType = {
	allowCustom: "boolean",
	createOnBlur: "boolean",
	maxItems: "(number|null)",
	separator: "(string|null)",
	boundary: "(string|element)",
	input: "(null|element)",
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
		this._editor = this._element.matches("input") ? this._element : SelectorEngine.findOne(".combobox-input, .form-ghost", this._element);
		if (this._editor === this._element && this._config.multiple) throw new TypeError("COMBOBOX: Multiple selection requires a wrapping element.");
		this._toggle = this._editor ?? this._element;
		const field = this._editor && !this._element.matches("input") ? this._element : this._toggle;
		this._menu = SelectorEngine.next(field, SELECTOR_MENU)[0];
		this._ownsMenu = !this._menu && Boolean(this._editor);
		if (this._ownsMenu) {
			this._menu = document.createElement("div");
			this._menu.className = "menu";
			field.after(this._menu);
		}
		this._menuMinWidth = this._menu.style.minWidth;
		this._valueDisplay = SelectorEngine.findOne(SELECTOR_VALUE, this._toggle);
		this._searchInput = this._editor ?? SelectorEngine.findOne(SELECTOR_SEARCH_INPUT, this._menu);
		this._noResults = SelectorEngine.findOne(SELECTOR_NO_RESULTS, this._menu);
		this._activeItem = null;
		this._chips = /* @__PURE__ */ new Map();
		this._selectedChips = /* @__PURE__ */ new Set();
		this._anchorChip = null;
		this._focusingChip = false;
		this._composing = false;
		this._query = null;
		this._status = null;
		this._attributes = /* @__PURE__ */ new Map();
		if (this._editor) this._setupEditor();
		this._hiddenInput = null;
		this._menuInstance = null;
		this._ownsInput = false;
		this._inputDisabled = false;
		this._extraInputs = [];
		this._initialSelection = this._getSelectedItems();
		this._form = null;
		this._menuEventHandlers = /* @__PURE__ */ new Map();
		this._changeId = 0;
		this._formObserver = new MutationObserver((records) => {
			this._readInputDisabled(records);
			this.update();
		});
		this._submitHandler = () => this.update();
		this._resetTimeouts = /* @__PURE__ */ new Set();
		this._resetHandler = (event) => {
			const timeout = window.setTimeout(() => {
				this._resetTimeouts.delete(timeout);
				if (!this._element || event.defaultPrevented || event.target !== this._form) return;
				const selected = new Set(this._initialSelection);
				for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
					item.classList.toggle(CLASS_NAME_SELECTED, selected.has(item));
					setAriaAttribute(item, "aria-selected", selected.has(item));
				}
				this._query = null;
				this._selectedChips.clear();
				this._anchorChip = null;
				this.update();
			});
			this._resetTimeouts.add(timeout);
		};
		this._createHiddenInput();
		this._createMenuInstance();
		this.update();
		this._addEventListeners();
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
		return this._showMenu();
	}
	async hide() {
		await this._menuInstance.hide();
	}
	update() {
		this._changeId++;
		this._readInputDisabled(this._formObserver.takeRecords());
		this._syncOptionRoles();
		this._updateToggleText();
		this._updateHiddenInput();
		this._observeFormState();
		if (this._editor && this._activeItem && !this._getVisibleItems().includes(this._activeItem)) this._setActiveItem(null);
	}
	dispose() {
		this._resetTimeouts.forEach((timeout) => clearTimeout(timeout));
		this._readInputDisabled(this._formObserver.takeRecords());
		this._formObserver.disconnect();
		EventHandler.off(this._form, `reset${EVENT_KEY}`, this._resetHandler);
		EventHandler.off(this._form, `submit${EVENT_KEY}`, this._submitHandler);
		for (const [event, handler] of this._menuEventHandlers) EventHandler.off(this._toggle, event, handler);
		this._removeExtraInputs();
		if (this._hiddenInput && !this._ownsInput) this._hiddenInput.disabled = this._inputDisabled;
		if (this._menuInstance) {
			this._menuInstance.dispose();
			this._menuInstance = null;
		}
		if (this._hiddenInput && this._ownsInput) {
			this._hiddenInput.remove();
			this._hiddenInput = null;
		}
		for (const chip of this._chips.values()) chip.remove();
		if (this._editor) {
			this._editor.classList.remove(CLASS_NAME_SHOW);
			this._element.classList.remove(CLASS_NAME_SHOW);
			this._menu.classList.remove(CLASS_NAME_SHOW);
			this._activeItem?.classList.remove("active");
		}
		this._status?.remove();
		this._menu.style.minWidth = this._menuMinWidth;
		for (const [element, attributes] of this._attributes) for (const [name, value] of attributes) if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
		if (this._ownsMenu) this._menu.remove();
		EventHandler.off(this._menu, EVENT_KEY);
		EventHandler.off(this._toggle, EVENT_KEY);
		EventHandler.off(this._searchInput, EVENT_KEY);
		super.dispose();
	}
	getValues() {
		return this._getSelectedItems().map((item) => item.dataset.bsValue ?? "");
	}
	add(value) {
		if (this._isDisabled() || this._config.multiple && this._config.maxItems !== null && this.getValues().length >= this._config.maxItems) return null;
		let item = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu).find((option) => option.dataset.bsValue === value);
		if (!item && this._config.allowCustom && value.trim()) {
			item = document.createElement("button");
			item.setAttribute("type", "button");
			item.className = "menu-item";
			item.dataset.bsValue = value;
			item.textContent = value;
			this._menu.append(item);
		}
		if (!item || item.classList.contains(CLASS_NAME_SELECTED) || isDisabled(item)) return null;
		this._selectItem(item);
		return this._element && item.classList.contains(CLASS_NAME_SELECTED) ? this._chips.get(item) ?? item : null;
	}
	remove(value) {
		const item = this._getSelectedItems().find((option) => typeof value === "string" ? option.dataset.bsValue === value : option === value || this._chips.get(option) === value);
		if (!item || isDisabled(item) || this._isDisabled()) return false;
		return this._removeItems([item]);
	}
	clear() {
		this._clearSelection(null);
	}
	_clearSelection(query) {
		this._removeItems(this._getSelectedItems(), query);
	}
	focus() {
		this._toggle?.focus();
	}
	getSelectedValues() {
		return this._getSelectedItems().filter((item) => this._selectedChips.has(this._chips.get(item))).map((item) => item.dataset.bsValue ?? "");
	}
	selectChip(chip, options = {}) {
		const chips = this._getChipElements();
		if (this._isDisabled() || !chips.includes(chip)) return;
		const previous = new Set(this._selectedChips);
		const { addToSelection = false, rangeSelect = false } = options;
		if (rangeSelect && this._anchorChip && chips.includes(this._anchorChip)) {
			const anchor = chips.indexOf(this._anchorChip);
			const target = chips.indexOf(chip);
			if (!addToSelection) this._selectedChips.clear();
			for (let index = Math.min(anchor, target); index <= Math.max(anchor, target); index++) this._selectedChips.add(chips[index]);
		} else if (addToSelection) if (this._selectedChips.has(chip)) this._selectedChips.delete(chip);
		else {
			this._selectedChips.add(chip);
			this._anchorChip = chip;
		}
		else {
			this._selectedChips = /* @__PURE__ */ new Set([chip]);
			this._anchorChip = chip;
		}
		if (previous.size !== this._selectedChips.size || [...previous].some((element) => !this._selectedChips.has(element))) this._notifyChipSelection();
	}
	clearSelection() {
		this._anchorChip = null;
		if (!this._selectedChips.size) return;
		this._selectedChips.clear();
		this._notifyChipSelection();
	}
	removeSelected() {
		const chips = this._getChipElements();
		const active = document.activeElement?.closest(".chip");
		const index = Math.max(0, chips.indexOf(active));
		const items = this._getSelectedItems().filter((item) => this._selectedChips.has(this._chips.get(item)));
		const changed = this._removeItems(items);
		if (changed && this._element) {
			const remaining = this._getChipElements();
			const target = remaining[Math.min(index, remaining.length - 1)];
			if (target) this._focusChip(target);
			else this._editor.focus();
		}
		return changed;
	}
	_getChipElements() {
		return this._getSelectedItems().filter((item) => !isDisabled(item)).map((item) => this._chips.get(item)).filter((chip) => Boolean(chip));
	}
	_syncChipSelection() {
		for (const chip of this._chips.values()) {
			const selected = this._selectedChips.has(chip);
			chip.classList.toggle("active", selected);
			if (selected) chip.setAttribute("aria-description", "Selected for removal");
			else chip.removeAttribute("aria-description");
		}
	}
	_notifyChipSelection() {
		this._syncChipSelection();
		const items = this._getSelectedItems().filter((item) => this._selectedChips.has(this._chips.get(item)));
		const selected = items.map((item) => item.dataset.bsValue ?? "");
		if (this._status) this._status.textContent = selected.length ? `${selected.length} chip${selected.length === 1 ? "" : "s"} selected for removal` : "Chip selection cleared";
		EventHandler.trigger(this._element, `select${EVENT_KEY}`, {
			selected,
			items
		});
	}
	_focusChip(chip, options = {}) {
		this.selectChip(chip, options);
		if (!this._element) return;
		this.hide();
		if (this._element) this._focusSelectedChip(chip);
	}
	_focusSelectedChip(chip) {
		this._focusingChip = true;
		try {
			chip.focus();
		} finally {
			if (this._element) this._focusingChip = false;
		}
	}
	_selectAllChips() {
		const chips = this._getChipElements();
		if (!chips.length) return;
		this._selectedChips = new Set(chips);
		this._anchorChip ??= chips[0];
		this._notifyChipSelection();
	}
	_removeItems(items, query = null) {
		if (this._isDisabled() || !items.length) return false;
		const allowed = [];
		const changeId = this._changeId;
		for (const item of items) {
			if (isDisabled(item)) continue;
			const event = EventHandler.trigger(this._element, `remove${EVENT_KEY}`, {
				value: item.dataset.bsValue,
				item
			});
			if (!this._element || changeId !== this._changeId) return false;
			if (!event.defaultPrevented) allowed.push(item);
		}
		for (const item of allowed) {
			item.classList.remove(CLASS_NAME_SELECTED);
			setAriaAttribute(item, "aria-selected", false);
		}
		if (allowed.length) this._selectionChanged(allowed.length === 1 ? allowed[0] : null, query);
		return allowed.length > 0;
	}
	_isDisabled() {
		return isDisabled(this._element) || isDisabled(this._toggle) || this._toggle.matches(":disabled");
	}
	_setAttribute(element, name, value) {
		if (!this._attributes.has(element)) this._attributes.set(element, /* @__PURE__ */ new Map());
		const attributes = this._attributes.get(element);
		if (!attributes.has(name)) attributes.set(name, element.getAttribute(name));
		element.setAttribute(name, value);
	}
	_syncOptionRoles() {
		if (!this._menu.id) this._setAttribute(this._menu, "id", getUID("combobox-"));
		this._setAttribute(this._toggle, "aria-controls", this._menu.id);
		this._setAttribute(this._toggle, "aria-haspopup", "listbox");
		this._setAttribute(this._menu, "role", "listbox");
		if (this._config.multiple) this._setAttribute(this._menu, "aria-multiselectable", "true");
		for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
			this._setAttribute(item, "role", "option");
			this._setAttribute(item, "aria-selected", String(item.classList.contains(CLASS_NAME_SELECTED)));
		}
	}
	_setupEditor() {
		const editor = this._editor;
		if (this._config.placeholder && !editor.placeholder) this._setAttribute(editor, "placeholder", this._config.placeholder);
		if (!this._menu.id) this._setAttribute(this._menu, "id", getUID("combobox-"));
		this._setAttribute(editor, "role", "combobox");
		this._setAttribute(editor, "aria-autocomplete", "list");
		this._setAttribute(editor, "aria-expanded", "false");
		this._setAttribute(editor, "aria-controls", this._menu.id);
		this._setAttribute(editor, "autocomplete", "off");
		this._setAttribute(editor, "aria-activedescendant", "");
		editor.removeAttribute("aria-activedescendant");
		this._setAttribute(this._menu, "role", "listbox");
		if (this._config.multiple) this._setAttribute(this._menu, "aria-multiselectable", "true");
		this._status = document.createElement("span");
		this._status.className = "visually-hidden";
		this._status.setAttribute("role", "status");
		this._menu.after(this._status);
	}
	_getItemLabel(item) {
		return SelectorEngine.findOne(".menu-item-content > span:first-child", item)?.textContent ?? item.textContent.trim();
	}
	_renderEditor() {
		const editor = this._editor;
		const selected = this._getSelectedItems();
		const selectedSet = new Set(selected);
		for (const [item, chip] of this._chips) if (!selectedSet.has(item)) {
			chip.remove();
			this._chips.delete(item);
			this._selectedChips.delete(chip);
			if (this._anchorChip === chip) this._anchorChip = null;
		}
		for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
			if (!item.id) this._setAttribute(item, "id", getUID("combobox-option-"));
			this._setAttribute(item, "tabindex", "-1");
		}
		if (!this._config.multiple) {
			const value = this._query ?? (selected.length ? this._getItemLabel(selected[0]) : "");
			if (editor.value !== value) editor.value = value;
			return;
		}
		let next = this._hiddenInput?.parentElement === editor.parentElement && this._hiddenInput.compareDocumentPosition(editor) === Node.DOCUMENT_POSITION_FOLLOWING ? this._hiddenInput : editor;
		for (let index = selected.length - 1; index >= 0; index--) {
			const item = selected[index];
			let chip = this._chips.get(item);
			const label = this._getItemLabel(item);
			if (!chip) {
				chip = document.createElement("span");
				chip.className = "chip";
				chip.tabIndex = -1;
				const text = document.createElement("span");
				const button = document.createElement("button");
				button.type = "button";
				button.className = "chip-dismiss";
				button.innerHTML = DISMISS_ICON;
				chip.append(text, button);
				this._chips.set(item, chip);
			}
			this._updateChipState(item, chip, label);
			if (chip.nextElementSibling !== next) next.before(chip);
			next = chip;
		}
		this._syncChipSelection();
		const value = this._query ?? "";
		if (editor.value !== value) editor.value = value;
		this._menuInstance?.update();
	}
	_updateChipState(item, chip, label) {
		chip.firstElementChild.textContent = label;
		const button = chip.lastElementChild;
		button.setAttribute("aria-label", `Remove ${label}`);
		button.disabled = this._isDisabled() || isDisabled(item);
		chip.setAttribute("role", "group");
		chip.setAttribute("aria-label", label);
		chip.classList.toggle("disabled", button.disabled);
		if (button.disabled) {
			chip.setAttribute("aria-disabled", "true");
			this._selectedChips.delete(chip);
			if (this._anchorChip === chip) this._anchorChip = null;
		} else chip.removeAttribute("aria-disabled");
	}
	_setActiveItem(item) {
		this._activeItem?.classList.remove("active");
		this._activeItem = item;
		if (!item) {
			this._editor.removeAttribute("aria-activedescendant");
			return;
		}
		item.classList.add("active");
		this._editor.setAttribute("aria-activedescendant", item.id);
		item.scrollIntoView({ block: "nearest" });
	}
	_addEditorListeners() {
		const editor = this._editor;
		EventHandler.on(this._menu, `mousedown${EVENT_KEY}`, SELECTOR_MENU_ITEM, (event) => event.preventDefault());
		EventHandler.on(editor, `input${EVENT_KEY}`, (event) => {
			if (this._composing || event.isComposing) {
				this._query = editor.value;
				return;
			}
			if (this._isDisabled()) return;
			this._handleEditorInput();
		});
		EventHandler.on(editor, `compositionstart${EVENT_KEY}`, () => {
			this._composing = true;
		});
		EventHandler.on(editor, `compositionend${EVENT_KEY}`, () => {
			this._composing = false;
			if (this._element && !this._isDisabled()) this._handleEditorInput(document.activeElement === editor);
		});
		EventHandler.on(editor, `paste${EVENT_KEY}`, (event) => {
			const { separator, allowCustom } = this._config;
			const text = event.clipboardData?.getData("text") ?? "";
			if (!allowCustom || !separator || !text.includes(separator) || this._isDisabled()) return;
			event.preventDefault();
			for (const value of text.split(separator)) {
				this.add(value.trim());
				if (!this._element) return;
			}
		});
		EventHandler.on(editor, `blur${EVENT_KEY}`, (event) => {
			if (!this._composing && this._config.allowCustom && this._config.createOnBlur && !event.relatedTarget?.closest(".chip, .menu")) this.add(editor.value.trim());
		});
		EventHandler.on(editor, `focus${EVENT_KEY}`, () => this.clearSelection());
		EventHandler.on(this._element, `mousedown${EVENT_KEY}`, ".chip", (event) => {
			if (!event.target.closest(".chip-dismiss")) event.preventDefault();
		});
		EventHandler.on(this._element, `focusin${EVENT_KEY}`, ".chip", (event) => {
			if (this._focusingChip || this._isDisabled()) return;
			const chip = event.target.closest(".chip");
			if (!this._selectedChips.has(chip)) this.selectChip(chip);
			if (this._element) this.hide();
		});
		EventHandler.on(this._element, `click${EVENT_KEY}`, ".chip", (event) => {
			if (event.target.closest(".chip-dismiss") || this._isDisabled()) return;
			event.preventDefault();
			event.stopPropagation();
			const chip = event.target.closest(".chip");
			this._focusChip(chip, {
				addToSelection: event.metaKey || event.ctrlKey,
				rangeSelect: event.shiftKey
			});
		});
		EventHandler.on(this._element, `keydown${EVENT_KEY}`, ".chip", (event) => this._handleChipKeydown(event));
		EventHandler.on(this._element, `click${EVENT_KEY}`, ".chip-dismiss", (event) => {
			event.preventDefault();
			event.stopPropagation();
			const chip = event.target.closest(".chip");
			this.remove(chip);
			if (this._element) editor.focus();
		});
	}
	_handleEditorInput(openMenu = true) {
		const editor = this._editor;
		let query = editor.value;
		if (this._config.allowCustom && this._config.separator && query.includes(this._config.separator)) {
			const parts = query.split(this._config.separator);
			query = parts.pop();
			for (const part of parts) {
				this.add(part.trim());
				if (!this._element) return;
			}
		}
		if (!this._config.multiple && this._getSelectedItems().length) {
			this._clearSelection(query);
			if (!this._element) return;
			if (this._getSelectedItems().length) {
				this._query = null;
				this._renderEditor();
				return;
			}
		}
		this._query = query;
		if (editor.value !== query) editor.value = query;
		this._filterItems(query);
		this._setActiveItem(null);
		if (openMenu && this._getVisibleItems().length) this.show();
		else this.hide();
	}
	_handleEditorKeydown(event) {
		if (this._composing || event.isComposing || event.keyCode === 229 || this._isDisabled()) return;
		const editor = this._editor;
		if ([ARROW_DOWN_KEY, ARROW_UP_KEY].includes(event.key)) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length) {
				const item = getNextActiveElement(items, this._activeItem, event.key === ARROW_DOWN_KEY, true);
				this.show();
				if (this._element) this._setActiveItem(item);
			}
			return;
		}
		if (event.key === ENTER_KEY) {
			if (this._activeItem && this._isShown()) {
				event.preventDefault();
				this._selectItem(this._activeItem);
			} else if (this._config.allowCustom && editor.value.trim()) {
				event.preventDefault();
				this.add(editor.value.trim());
			}
			return;
		}
		if (event.key === ESCAPE_KEY || event.key === TAB_KEY) {
			if (event.key === ESCAPE_KEY && this._isShown()) event.preventDefault();
			this.hide();
			if (this._element) this._setActiveItem(null);
			return;
		}
		this._handleEditorChipFocus(event);
	}
	_handleEditorChipFocus(event) {
		const editor = this._editor;
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a" && !editor.value) {
			const chips = this._getChipElements();
			if (chips.length) {
				event.preventDefault();
				this._selectAllChips();
				if (this._element) {
					this.hide();
					if (this._element) this._focusSelectedChip(chips.at(-1));
				}
			}
			return;
		}
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const previousKey = getComputedStyle(editor).direction === "rtl" ? "ArrowRight" : "ArrowLeft";
		const backwardDelete = ["Backspace", "Delete"].includes(event.key) && !editor.value;
		const atStart = event.key === previousKey && editor.selectionStart === 0 && editor.selectionEnd === 0;
		if (backwardDelete || atStart) {
			const chip = this._getChipElements().at(-1);
			if (chip) {
				event.preventDefault();
				this._focusChip(chip, { addToSelection: event.shiftKey });
			}
		}
	}
	_handleChipKeydown(event) {
		if (this._composing || event.isComposing || event.keyCode === 229 || this._isDisabled()) return;
		const chip = event.target.closest(".chip");
		const chips = this._getChipElements();
		const index = chips.indexOf(chip);
		if (index === -1) return;
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
			event.preventDefault();
			this._selectAllChips();
			return;
		}
		if (["Backspace", "Delete"].includes(event.key)) {
			event.preventDefault();
			this._deleteChipSelection(chip);
			return;
		}
		const rtl = getComputedStyle(this._editor).direction === "rtl";
		if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
			event.preventDefault();
			const next = index + (event.key === "ArrowRight" === rtl ? -1 : 1);
			if (next >= chips.length) {
				this.clearSelection();
				if (this._element) this._editor.focus();
			} else this._focusChip(chips[Math.max(0, next)], { rangeSelect: event.shiftKey });
		} else if (event.key === HOME_KEY || event.key === END_KEY && event.shiftKey) {
			event.preventDefault();
			const target = event.key === HOME_KEY ? chips[0] : chips.at(-1);
			this._focusChip(target, { rangeSelect: event.shiftKey });
		} else if ([END_KEY, ESCAPE_KEY].includes(event.key)) {
			event.preventDefault();
			this.clearSelection();
			if (this._element) this._editor.focus();
		}
	}
	_deleteChipSelection(chip) {
		if (!this._selectedChips.has(chip)) this.selectChip(chip);
		if (this._element) this.removeSelected();
	}
	_isShown() {
		return this._menu.classList.contains(CLASS_NAME_SHOW);
	}
	_configAfterMerge(config) {
		if (config.maxItems !== null && (!Number.isSafeInteger(config.maxItems) || config.maxItems < 1)) throw new TypeError("COMBOBOX: Option \"maxItems\" must be a positive integer or null.");
		if (config.input !== null) {
			const input = getElement(config.input);
			if (!(input instanceof HTMLInputElement) || input.type !== "hidden") throw new TypeError("COMBOBOX: Option \"input\" must reference a hidden input.");
			config.input = input;
		}
		return config;
	}
	_createHiddenInput() {
		if (this._config.input) {
			this._hiddenInput = this._config.input;
			this._inputDisabled = this._hiddenInput.disabled;
			return;
		}
		if (!this._config.name) return;
		this._hiddenInput = document.createElement("input");
		this._hiddenInput.type = "hidden";
		this._hiddenInput.name = this._config.name;
		(this._editor ? this._element : this._toggle).before(this._hiddenInput);
		this._ownsInput = true;
	}
	_removeExtraInputs() {
		for (const input of this._extraInputs) input.remove();
		this._extraInputs = [];
	}
	_readInputDisabled(records) {
		if (!this._ownsInput && records.some((record) => record.target === this._hiddenInput && record.attributeName === "disabled")) this._inputDisabled = this._hiddenInput.disabled;
	}
	_observeFormState() {
		this._formObserver.disconnect();
		if (this._element !== this._toggle) this._formObserver.observe(this._element, {
			attributes: true,
			attributeFilter: ["class"]
		});
		this._formObserver.observe(this._toggle, {
			attributes: true,
			attributeFilter: [
				"disabled",
				"class",
				"form"
			]
		});
		if (this._hiddenInput) this._formObserver.observe(this._hiddenInput, {
			attributes: true,
			attributeFilter: [
				"disabled",
				"name",
				"form"
			]
		});
		const fieldsets = /* @__PURE__ */ new Set();
		for (const element of [this._toggle, this._hiddenInput]) for (let parent = element?.parentElement; parent; parent = parent.parentElement) if (parent.matches("fieldset")) fieldsets.add(parent);
		for (const fieldset of fieldsets) this._formObserver.observe(fieldset, {
			attributes: true,
			attributeFilter: ["disabled"]
		});
		const form = this._hiddenInput ? this._hiddenInput.form : this._toggle instanceof HTMLInputElement || this._toggle instanceof HTMLButtonElement ? this._toggle.form : this._toggle.closest("form");
		if (form !== this._form) {
			EventHandler.off(this._form, `reset${EVENT_KEY}`, this._resetHandler);
			EventHandler.off(this._form, `submit${EVENT_KEY}`, this._submitHandler);
			this._form = form;
			EventHandler.on(this._form, `reset${EVENT_KEY}`, this._resetHandler);
			EventHandler.on(this._form, `submit${EVENT_KEY}`, this._submitHandler);
		}
	}
	async _showMenu(focus) {
		if (this._isDisabled() || this._isShown() || this._editor && !this._getVisibleItems().length) return;
		const search = this._editor || isDisabled(this._searchInput) ? null : this._searchInput;
		await this._menuInstance.show(focus ?? (search ? () => search.focus({ preventScroll: true }) : void 0));
	}
	_createMenuInstance() {
		this._menuInstance = new ComboboxMenu(this._toggle, {
			menu: this._menu,
			reference: this._editor ? this._element : "toggle",
			autoClose: this._config.multiple ? "outside" : true,
			boundary: this._config.boundary,
			offset: this._config.offset,
			placement: this._config.placement,
			floatingConfig: this._editor ? (config) => ({
				...config,
				middleware: [...config.middleware, {
					name: "comboboxSize",
					fn: ({ elements, rects }) => {
						if (this._element) elements.floating.style.minWidth = `${rects.reference.width}px`;
						return {};
					}
				}]
			}) : null
		});
	}
	_addEventListeners() {
		for (const type of [
			"show",
			"shown",
			"hide",
			"hidden"
		]) {
			const event = Menu.eventName(type);
			const handler = (menuEvent) => {
				if (!this._element) return;
				if (type === "hidden" && this._editor) this._setActiveItem(null);
				if (EventHandler.trigger(this._element, this.constructor.eventName(type))?.defaultPrevented || !this._element) {
					menuEvent.preventDefault();
					return;
				}
				if (type === "show" && !menuEvent.defaultPrevented && this._searchInput && !this._editor) {
					this._searchInput.value = "";
					this._filterItems("");
				}
			};
			this._menuEventHandlers.set(event, handler);
			EventHandler.on(this._toggle, event, handler);
		}
		EventHandler.on(this._menu, `click${EVENT_KEY}`, SELECTOR_MENU_ITEM, (event) => {
			const item = event.target.closest(SELECTOR_MENU_ITEM);
			if (!item || isDisabled(item)) return;
			event.preventDefault();
			event.stopPropagation();
			this._selectItem(item);
		});
		EventHandler.on(this._toggle, `keydown${EVENT_KEY}`, (event) => {
			if (this._editor) this._handleEditorKeydown(event);
			else this._handleToggleKeydown(event);
		});
		EventHandler.on(this._menu, `keydown${EVENT_KEY}`, (event) => {
			this._handleMenuKeydown(event);
		});
		if (this._editor) {
			this._addEditorListeners();
			return;
		}
		if (this._searchInput) {
			EventHandler.on(this._toggle, `mousedown${EVENT_KEY}`, (event) => {
				if (event.button === 0 && !this._isShown() && !this._isDisabled() && !isDisabled(this._searchInput)) event.preventDefault();
			});
			EventHandler.on(this._searchInput, `input${EVENT_KEY}`, () => {
				this._filterItems(this._searchInput.value);
			});
			EventHandler.on(this._searchInput, `keydown${EVENT_KEY}`, (event) => {
				if (event.isComposing || event.keyCode === 229) return;
				if (event.key === ARROW_DOWN_KEY) {
					event.preventDefault();
					const items = this._getVisibleItems();
					if (items.length > 0) items[0].focus();
				}
				if (event.key === ESCAPE_KEY) {
					this.hide();
					this._toggle?.focus();
				}
			});
		}
	}
	_selectItem(item) {
		if (this._isDisabled() || isDisabled(item) || !this._menu.contains(item)) return;
		const previous = this._getSelectedItems();
		if (this._config.multiple && !previous.includes(item) && this._config.maxItems !== null && previous.length >= this._config.maxItems) return;
		if (!this._config.multiple && previous.length === 1 && previous[0] === item) return;
		const changeId = this._changeId;
		const type = this._config.multiple && previous.includes(item) ? "remove" : "add";
		const event = EventHandler.trigger(this._element, `${type}${EVENT_KEY}`, {
			value: item.dataset.bsValue,
			item
		});
		if (!this._element || event.defaultPrevented || changeId !== this._changeId || this._isDisabled() || isDisabled(item) || !this._menu.contains(item)) return;
		if (this._config.multiple) {
			item.classList.toggle(CLASS_NAME_SELECTED);
			setAriaAttribute(item, "aria-selected", item.classList.contains(CLASS_NAME_SELECTED));
		} else {
			for (const selected of previous) {
				selected.classList.remove(CLASS_NAME_SELECTED);
				selected.setAttribute("aria-selected", "false");
			}
			item.classList.add(CLASS_NAME_SELECTED);
			item.setAttribute("aria-selected", "true");
		}
		this._selectionChanged(item);
	}
	_selectionChanged(item, query = null) {
		this._query = query;
		this.update();
		const changeId = this._changeId;
		const { multiple } = this._config;
		const values = this.getValues();
		const value = multiple ? values : values[0] ?? "";
		const target = this._hiddenInput ?? this._element;
		for (const event of ["input", "change"]) {
			EventHandler.trigger(target, event);
			if (!this._element || changeId !== this._changeId) return;
		}
		EventHandler.trigger(this._element, EVENT_CHANGE, {
			value,
			item
		});
		if (!this._element || changeId !== this._changeId) return;
		if (this._editor) {
			this._setActiveItem(null);
			this._filterItems("");
			if (this._status) this._status.textContent = `${values.length} selected`;
		}
		if (!multiple && query === null) {
			this.hide();
			this._toggle?.focus();
		}
	}
	_updateToggleText() {
		if (this._editor) {
			this._renderEditor();
			return;
		}
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
		this._valueDisplay.textContent = placeholder;
		this._valueDisplay.classList.toggle(CLASS_NAME_PLACEHOLDER, Boolean(placeholder));
	}
	_updateHiddenInput() {
		const input = this._hiddenInput;
		if (!input) return;
		const selected = this._getSelectedItems();
		const values = selected.filter((item) => !isDisabled(item)).map((item) => item.dataset.bsValue ?? "");
		const submittedValues = this._config.multiple ? values : [values[0] ?? ""];
		const disabled = this._inputDisabled || this._isDisabled() || selected.length > 0 && values.length === 0;
		if (this._ownsInput) {
			const anchor = this._editor ? this._element : this._toggle;
			const fields = [input, ...this._extraInputs];
			if (fields.at(-1).nextElementSibling !== anchor) for (const field of fields) anchor.before(field);
			const form = this._toggle.getAttribute("form");
			if (form === null) input.removeAttribute("form");
			else input.setAttribute("form", form);
		}
		input.value = submittedValues[0] ?? "";
		input.disabled = disabled || submittedValues.length === 0;
		for (let index = 1; index < submittedValues.length; index++) {
			let extra = this._extraInputs[index - 1];
			if (!extra) {
				extra = document.createElement("input");
				extra.type = "hidden";
				this._extraInputs.push(extra);
			}
			const previous = this._extraInputs[index - 2] ?? input;
			if (!previous.parentNode) extra.remove();
			else if (extra.previousElementSibling !== previous) previous.after(extra);
			extra.name = input.name;
			extra.value = submittedValues[index];
			extra.disabled = disabled;
			const form = input.getAttribute("form");
			if (form === null) extra.removeAttribute("form");
			else extra.setAttribute("form", form);
		}
		for (const extra of this._extraInputs.splice(Math.max(0, submittedValues.length - 1))) extra.remove();
		this._formObserver.takeRecords();
	}
	_getSelectedItems() {
		return SelectorEngine.find(`${SELECTOR_MENU_ITEM}.${CLASS_NAME_SELECTED}`, this._menu);
	}
	_getVisibleItems() {
		return SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((item) => {
			if (!this._editor) return isVisible(item);
			for (let current = item; current && current !== this._menu; current = current.parentElement) {
				const style = getComputedStyle(current);
				if (current.hidden || style.display === "none" || style.visibility === "hidden") return false;
			}
			return true;
		});
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
		if (event.isComposing || event.keyCode === 229) return;
		const { key } = event;
		if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) {
			event.preventDefault();
			const focusItem = () => {
				const items = this._getVisibleItems();
				((key === ARROW_DOWN_KEY ? items[0] : items.at(-1)) ?? (isDisabled(this._searchInput) ? this._toggle : this._searchInput))?.focus();
			};
			if (this._isShown()) focusItem();
			else this._showMenu(focusItem);
			return;
		}
		if (key === ESCAPE_KEY && this._isShown()) {
			event.preventDefault();
			event.stopPropagation();
			this.hide();
			return;
		}
		if ((key === ENTER_KEY || key === SPACE_KEY) && !this._isShown()) {
			event.preventDefault();
			this.show();
		}
	}
	_handleMenuKeydown(event) {
		if (event.isComposing || event.keyCode === 229) return;
		const { key, target } = event;
		if (key === ESCAPE_KEY) {
			event.preventDefault();
			event.stopPropagation();
			this.hide();
			this._toggle?.focus();
			return;
		}
		if (key === TAB_KEY) {
			this.hide();
			return;
		}
		const isInput = target.matches("input");
		if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length > 0) getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
			return;
		}
		if ((key === HOME_KEY || key === END_KEY) && !isInput) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length > 0) (key === HOME_KEY ? items[0] : items.at(-1)).focus();
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
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	const instance = Combobox.getOrCreateInstance(this);
	if (this.matches("input") || this.querySelector(".combobox-input, .form-ghost")) {
		if (!event.target.closest(".chip")) {
			instance.focus();
			instance.show();
		}
		return;
	}
	event.preventDefault();
	instance.toggle();
});
onDocumentReady("DOMContentLoaded", () => {
	for (const toggle of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) Combobox.getOrCreateInstance(toggle);
});
//#endregion
export { Combobox as default };

//# sourceMappingURL=combobox.js.map