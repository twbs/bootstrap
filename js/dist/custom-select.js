/*!
  * Bootstrap custom-select.js v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import { offset, flip, shift, autoUpdate, computePosition } from '@floating-ui/dom';
import BaseComponent from './base-component.js';
import EventHandler from './dom/event-handler.js';
import Manipulator from './dom/manipulator.js';
import SelectorEngine from './dom/selector-engine.js';
import { DefaultAllowlist, sanitizeHtml } from './util/sanitizer.js';
import { isDisabled, getUID, isVisible, getNextActiveElement, isRTL } from './util/index.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap custom-select.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'customSelect';
const DATA_KEY = 'bs.custom-select';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ESCAPE_KEY = 'Escape';
const TAB_KEY = 'Tab';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';
const ENTER_KEY = 'Enter';
const SPACE_KEY = ' ';
const EVENT_CHANGE = `change${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_DISABLED = 'disabled';
const CLASS_NAME_SELECTED = 'selected';
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="custom-select"]';
const SELECTOR_ITEM = '.custom-select-item';
const SELECTOR_VISIBLE_ITEMS = '.custom-select-item:not(.disabled):not(:disabled)';
const Default = {
  allowHtml: false,
  allowList: DefaultAllowlist,
  boundary: 'clippingParents',
  hidePlaceholderOption: true,
  liveSearch: false,
  liveSearchNormalize: false,
  liveSearchPlaceholder: 'Search...',
  offset: [0, 2],
  placement: 'bottom-start',
  sanitize: true,
  sanitizeFn: null,
  showCheckmark: true
};
const DefaultType = {
  allowHtml: 'boolean',
  allowList: 'object',
  boundary: '(string|element)',
  hidePlaceholderOption: 'boolean',
  liveSearch: 'boolean',
  liveSearchNormalize: 'boolean',
  liveSearchPlaceholder: 'string',
  offset: '(array|string|function)',
  placement: 'string',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  showCheckmark: 'boolean'
};

/**
 * Class definition
 */

class CustomSelect extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._select = this._element;
    this._isMultiple = this._select.multiple;
    this._toggle = null;
    this._menu = null;
    this._searchInput = null;
    this._items = [];
    this._floatingCleanup = null;
    this._isShown = false;
    this._init();
  }

  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  toggle() {
    return this._isShown ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._toggle) || this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._select, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._createFloating();
    this._menu.classList.add(CLASS_NAME_SHOW);
    this._toggle.classList.add(CLASS_NAME_SHOW);
    this._toggle.setAttribute('aria-expanded', 'true');

    // Focus search input or first item
    if (this._config.liveSearch && this._searchInput) {
      this._searchInput.focus();
    } else {
      const selectedItem = SelectorEngine.findOne(`.${CLASS_NAME_SELECTED}`, this._menu);
      if (selectedItem) {
        selectedItem.focus();
      }
    }
    EventHandler.trigger(this._select, EVENT_SHOWN);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._select, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    this._disposeFloating();
    this._menu.classList.remove(CLASS_NAME_SHOW);
    this._toggle.classList.remove(CLASS_NAME_SHOW);
    this._toggle.setAttribute('aria-expanded', 'false');

    // Clear search
    if (this._searchInput) {
      this._searchInput.value = '';
      this._filterItems('');
    }
    EventHandler.trigger(this._select, EVENT_HIDDEN);
  }
  refresh() {
    this._buildMenu();
    this._updateToggleText();
  }
  dispose() {
    this._disposeFloating();

    // Remove generated elements
    if (this._toggle) {
      this._toggle.remove();
    }
    if (this._menu) {
      this._menu.remove();
    }

    // Show original select
    this._select.classList.remove('visually-hidden');
    this._select.removeAttribute('aria-hidden');
    this._select.removeAttribute('tabindex');
    super.dispose();
  }

  // Private
  _init() {
    // Hide original select
    this._select.classList.add('visually-hidden');
    this._select.setAttribute('aria-hidden', 'true');
    this._select.setAttribute('tabindex', '-1');
    this._createToggle();
    this._createMenu();
    this._buildMenu();

    // If a placeholder option exists and no option is explicitly selected, select it so the toggle shows placeholder text on load
    const placeholderOption = this._getPlaceholderOption();
    const hasExplicitSelection = this._select.querySelector('option[selected]');
    if (!this._isMultiple && placeholderOption && !hasExplicitSelection) {
      for (const option of this._select.querySelectorAll('option')) {
        option.selected = option === placeholderOption;
      }
    }
    this._updateToggleText();
    this._setupEventListeners();
  }
  _createToggle() {
    this._toggle = document.createElement('button');
    this._toggle.type = 'button';
    this._toggle.setAttribute('aria-haspopup', 'listbox');
    this._toggle.setAttribute('aria-expanded', 'false');
    this._toggle.id = getUID('custom-select-toggle-');

    // Copy classes from select to toggle
    const toggleClasses = this._getToggleClasses();
    this._toggle.classList.add('custom-select-toggle', ...toggleClasses);
    if (this._select.disabled) {
      this._toggle.disabled = true;
      this._toggle.classList.add(CLASS_NAME_DISABLED);
    }

    // Create inner structure
    this._toggle.innerHTML = `
      <span class="custom-select-value"></span>
      <svg class="custom-select-caret" width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.46967 5.46967C0.762563 5.17678 1.23744 5.17678 1.53033 5.46967L5 8.93934L8.46967 5.46967C8.76256 5.17678 9.23744 5.17678 9.53033 5.46967C9.82322 5.76256 9.82322 6.23744 9.53033 6.53033L5.53033 10.5303C5.23744 10.8232 4.76256 10.8232 4.46967 10.5303L0.46967 6.53033C0.176777 6.23744 0.176777 5.76256 0.46967 5.46967Z" fill="currentcolor"/>
</svg>`;
    this._select.after(this._toggle);
  }
  _getToggleClasses() {
    const classes = [];
    const selectClasses = this._select.classList;

    // Check for button variant classes
    const hasButtonClass = [...selectClasses].some(cls => cls.startsWith('btn-') || cls.startsWith('theme-'));
    if (hasButtonClass) {
      // Copy button and theme classes
      for (const cls of selectClasses) {
        if (cls.startsWith('btn-') || cls.startsWith('theme-')) {
          classes.push(cls);
        }
      }
    } else {
      // Default to form-control style
      classes.push('form-control');

      // Copy size classes
      if (selectClasses.contains('form-control-sm')) {
        classes.push('form-control-sm');
      } else if (selectClasses.contains('form-control-lg')) {
        classes.push('form-control-lg');
      }
    }
    return classes;
  }
  _createMenu() {
    this._menu = document.createElement('div');
    this._menu.classList.add('dropdown-menu', 'custom-select-menu');
    this._menu.setAttribute('role', 'listbox');
    this._menu.id = getUID('custom-select-menu-');
    this._toggle.setAttribute('aria-controls', this._menu.id);

    // Add search input if enabled
    if (this._config.liveSearch) {
      const searchWrapper = document.createElement('div');
      searchWrapper.classList.add('custom-select-search');
      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('form-control', 'custom-select-search-input');
      input.placeholder = this._config.liveSearchPlaceholder;
      input.autocomplete = 'off';
      input.setAttribute('aria-label', this._config.liveSearchPlaceholder);
      searchWrapper.append(input);
      this._menu.append(searchWrapper);
      this._searchInput = input;
    }

    // No results message (hidden by default)
    const noResults = document.createElement('div');
    noResults.classList.add('custom-select-no-results', 'd-none');
    noResults.textContent = 'No results found';
    this._noResults = noResults;
    this._toggle.after(this._menu);
  }
  _buildMenu() {
    // Remove existing items (keep search wrapper if present)
    const existingItems = SelectorEngine.find('.custom-select-item, .custom-select-header, .custom-select-no-results', this._menu);
    for (const item of existingItems) {
      item.remove();
    }
    this._items = [];
    const options = this._select.querySelectorAll('option, optgroup');
    for (const option of options) {
      if (option.tagName === 'OPTGROUP') {
        this._createOptgroupHeader(option, this._menu);
      } else {
        this._createItem(option, this._menu);
      }
    }

    // Add no results message at the end
    this._menu.append(this._noResults);
  }
  _createOptgroupHeader(optgroup, container) {
    const header = document.createElement('div');
    header.classList.add('custom-select-header', 'dropdown-header');
    header.textContent = optgroup.label;
    if (optgroup.disabled) {
      header.classList.add(CLASS_NAME_DISABLED);
    }
    container.append(header);

    // Add options within this optgroup
    for (const option of optgroup.querySelectorAll('option')) {
      this._createItem(option, container, optgroup.disabled);
    }
  }
  _createItem(option, container, parentDisabled = false) {
    // Skip placeholder options: empty value when hidePlaceholderOption, or data-bs-placeholder on option
    const isPlaceholder = option.value === '' && this._config.hidePlaceholderOption || option.getAttribute('data-bs-placeholder') === 'true';
    if (isPlaceholder) {
      return;
    }
    const item = document.createElement('button');
    item.type = 'button';
    item.classList.add('dropdown-item', 'custom-select-item');
    item.setAttribute('role', 'option');
    item.dataset.value = option.value;

    // Store search tokens
    const tokens = option.dataset.bsTokens || '';
    const description = option.dataset.bsDescription || '';
    item.dataset.searchText = `${option.textContent} ${description} ${tokens}`.toLowerCase();
    if (option.disabled || parentDisabled) {
      item.disabled = true;
      item.classList.add(CLASS_NAME_DISABLED);
      item.setAttribute('aria-disabled', 'true');
    }
    if (option.selected) {
      item.classList.add(CLASS_NAME_SELECTED);
      item.setAttribute('aria-selected', 'true');
    }

    // Build item content
    item.append(this._buildItemContent(option));
    container.append(item);
    this._items.push({
      item,
      option
    });
  }
  _buildItemContent(option) {
    const fragment = document.createDocumentFragment();

    // Full custom content override (developer HTML, sanitized)
    const customContent = option.dataset.bsContent;
    if (customContent) {
      const contentWrapper = document.createElement('span');
      contentWrapper.classList.add('custom-select-content');
      const textSpan = document.createElement('span');
      textSpan.classList.add('custom-select-text');
      textSpan.innerHTML = this._sanitize(customContent);
      contentWrapper.append(textSpan);
      fragment.append(contentWrapper);
      if (this._config.showCheckmark) {
        fragment.append(this._createCheckmark());
      }
      return fragment;
    }
    const icon = option.dataset.bsIcon;
    const image = option.dataset.bsImage;
    const description = option.dataset.bsDescription;
    const text = option.textContent;
    if (icon) {
      // Inline SVG from data-bs-icon — trusted developer markup
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('custom-select-icon');
      iconSpan.innerHTML = icon;
      fragment.append(iconSpan);
    } else if (image) {
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('custom-select-icon');
      const img = document.createElement('img');
      img.src = image;
      img.alt = '';
      img.classList.add('custom-select-image');
      iconSpan.append(img);
      fragment.append(iconSpan);
    }
    const contentWrapper = document.createElement('span');
    contentWrapper.classList.add('custom-select-content');
    const textSpan = document.createElement('span');
    textSpan.classList.add('custom-select-text');
    if (this._config.allowHtml) {
      textSpan.innerHTML = this._sanitize(text);
    } else {
      textSpan.textContent = text;
    }
    contentWrapper.append(textSpan);
    if (description) {
      const descSpan = document.createElement('span');
      descSpan.classList.add('custom-select-description');
      if (this._config.allowHtml) {
        descSpan.innerHTML = this._sanitize(description);
      } else {
        descSpan.textContent = description;
      }
      contentWrapper.append(descSpan);
    }
    fragment.append(contentWrapper);
    if (this._config.showCheckmark) {
      fragment.append(this._createCheckmark());
    }
    return fragment;
  }
  _createCheckmark() {
    const span = document.createElement('span');
    span.classList.add('custom-select-check');
    span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
    return span;
  }
  _sanitize(content) {
    if (!this._config.sanitize) {
      return content;
    }
    return sanitizeHtml(String(content), this._config.allowList, this._config.sanitizeFn);
  }
  _getPlaceholderOption() {
    // Option explicitly marked as placeholder, or first empty-value option
    const marked = this._select.querySelector('option[data-bs-placeholder="true"]');
    if (marked) {
      return marked;
    }
    return this._select.querySelector('option[value=""]');
  }
  _updateToggleText() {
    const valueElement = SelectorEngine.findOne('.custom-select-value', this._toggle);
    const selectedOptions = [...this._select.selectedOptions];
    const onlyPlaceholderSelected = selectedOptions.length === 1 && (selectedOptions[0].value === '' || selectedOptions[0].getAttribute('data-bs-placeholder') === 'true');
    const noneSelected = selectedOptions.length === 0 || onlyPlaceholderSelected;
    if (noneSelected) {
      // Show placeholder: data-bs-placeholder on select, or placeholder option's text
      const explicitPlaceholder = this._select.getAttribute('data-bs-placeholder');
      const placeholderOption = this._getPlaceholderOption();
      valueElement.textContent = explicitPlaceholder || (placeholderOption ? placeholderOption.textContent.trim() : '');
      valueElement.classList.add('custom-select-placeholder');
      return;
    }
    valueElement.classList.remove('custom-select-placeholder');
    if (this._isMultiple) {
      valueElement.textContent = selectedOptions.length === 1 ? selectedOptions[0].textContent : `${selectedOptions.length} selected`;
    } else {
      const selected = selectedOptions[0];
      // Use custom content for toggle if available, otherwise text
      const icon = selected.dataset.bsIcon;
      const text = selected.textContent;
      if (icon) {
        valueElement.textContent = '';
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('custom-select-value-icon');
        iconSpan.innerHTML = icon; // Trusted developer markup
        valueElement.append(iconSpan, ` ${text}`);
      } else {
        valueElement.textContent = text;
      }
    }
  }
  _setupEventListeners() {
    // Toggle click
    EventHandler.on(this._toggle, 'click', event => {
      event.preventDefault();
      this.toggle();
    });

    // Item clicks
    EventHandler.on(this._menu, 'click', SELECTOR_ITEM, event => {
      event.preventDefault();
      const item = event.target.closest(SELECTOR_ITEM);
      if (item && !item.disabled) {
        this._selectItem(item);
      }
    });

    // Search input
    if (this._searchInput) {
      EventHandler.on(this._searchInput, 'input', () => {
        this._filterItems(this._searchInput.value);
      });
      EventHandler.on(this._searchInput, 'keydown', event => {
        if (event.key === ARROW_DOWN_KEY) {
          event.preventDefault();
          const firstVisible = SelectorEngine.findOne(`${SELECTOR_VISIBLE_ITEMS}:not(.d-none)`, this._menu);
          if (firstVisible) {
            firstVisible.focus();
          }
        }
      });
    }

    // Keyboard navigation
    EventHandler.on(this._toggle, 'keydown', event => {
      this._handleToggleKeydown(event);
    });
    EventHandler.on(this._menu, 'keydown', event => {
      this._handleMenuKeydown(event);
    });

    // Close on outside click
    EventHandler.on(document, EVENT_CLICK_DATA_API, event => {
      if (this._isShown && !this._menu.contains(event.target) && !this._toggle.contains(event.target)) {
        this.hide();
      }
    });

    // Sync with native select changes
    EventHandler.on(this._select, 'change', () => {
      this._syncFromSelect();
    });
  }
  _selectItem(item) {
    const {
      value
    } = item.dataset;
    const option = this._select.querySelector(`option[value="${CSS.escape(value)}"]`);
    if (!option) {
      return;
    }
    if (this._isMultiple) {
      // Toggle selection for multiple
      option.selected = !option.selected;
      item.classList.toggle(CLASS_NAME_SELECTED);
      item.setAttribute('aria-selected', option.selected);
    } else {
      // Single select: clear previous selection
      for (const {
        item: i,
        option: o
      } of this._items) {
        i.classList.remove(CLASS_NAME_SELECTED);
        i.setAttribute('aria-selected', 'false');
        o.selected = false;
      }
      option.selected = true;
      item.classList.add(CLASS_NAME_SELECTED);
      item.setAttribute('aria-selected', 'true');
      this.hide();
    }
    this._updateToggleText();

    // Dispatch change event on original select
    EventHandler.trigger(this._select, 'change');
    EventHandler.trigger(this._select, EVENT_CHANGE, {
      value,
      option
    });
  }
  _syncFromSelect() {
    // Sync visual state from native select
    for (const {
      item,
      option
    } of this._items) {
      if (option.selected) {
        item.classList.add(CLASS_NAME_SELECTED);
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove(CLASS_NAME_SELECTED);
        item.setAttribute('aria-selected', 'false');
      }
    }
    this._updateToggleText();
  }
  _filterItems(query) {
    const normalizedQuery = this._normalizeText(query.toLowerCase());
    let visibleCount = 0;
    for (const {
      item
    } of this._items) {
      const searchText = this._normalizeText(item.dataset.searchText);
      if (searchText.includes(normalizedQuery)) {
        item.classList.remove('d-none');
        visibleCount++;
      } else {
        item.classList.add('d-none');
      }
    }

    // Handle optgroup headers visibility
    const headers = SelectorEngine.find('.custom-select-header', this._menu);
    for (const header of headers) {
      // Show header if any following items (until next header) are visible
      let nextSibling = header.nextElementSibling;
      let hasVisibleItems = false;
      while (nextSibling && !nextSibling.classList.contains('custom-select-header')) {
        if (nextSibling.classList.contains('custom-select-item') && !nextSibling.classList.contains('d-none')) {
          hasVisibleItems = true;
          break;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
      header.classList.toggle('d-none', !hasVisibleItems);
    }

    // Show/hide no results message
    this._noResults.classList.toggle('d-none', visibleCount > 0 || query === '');
  }
  _normalizeText(text) {
    if (!this._config.liveSearchNormalize) {
      return text;
    }

    // Normalize accents
    return text.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
  }
  _handleToggleKeydown(event) {
    const {
      key
    } = event;
    if ([ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY, SPACE_KEY].includes(key)) {
      event.preventDefault();
      if (this._isShown) {
        const items = SelectorEngine.find(`${SELECTOR_VISIBLE_ITEMS}:not(.d-none)`, this._menu);
        if (items.length) {
          items[key === ARROW_UP_KEY ? items.length - 1 : 0].focus();
        }
      } else {
        this.show();
      }
    }
    if (key === ESCAPE_KEY && this._isShown) {
      event.preventDefault();
      this.hide();
      this._toggle.focus();
    }
  }
  _handleMenuKeydown(event) {
    const {
      key,
      target
    } = event;
    const items = SelectorEngine.find(`${SELECTOR_VISIBLE_ITEMS}:not(.d-none)`, this._menu).filter(item => isVisible(item));
    if ([ARROW_DOWN_KEY, ARROW_UP_KEY].includes(key)) {
      event.preventDefault();
      const {
        activeElement
      } = document;
      const isDown = key === ARROW_DOWN_KEY;
      getNextActiveElement(items, activeElement, isDown, true).focus();
    }
    if ([HOME_KEY, END_KEY].includes(key)) {
      event.preventDefault();
      const targetItem = key === HOME_KEY ? items[0] : items[items.length - 1];
      if (targetItem) {
        targetItem.focus();
      }
    }
    if ((key === ENTER_KEY || key === SPACE_KEY) && target.classList.contains('custom-select-item')) {
      event.preventDefault();
      this._selectItem(target);
    }
    if (key === ESCAPE_KEY) {
      event.preventDefault();
      this.hide();
      this._toggle.focus();
    }
    if (key === TAB_KEY) {
      this.hide();
    }
  }
  _createFloating() {
    const placement = isRTL() ? this._config.placement.replace('start', 'temp').replace('end', 'start').replace('temp', 'end') : this._config.placement;
    const middleware = [offset({
      mainAxis: this._config.offset[1] || 0,
      crossAxis: this._config.offset[0] || 0
    }), flip({
      boundary: this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary
    }), shift({
      padding: 8
    })];
    const updatePosition = async () => {
      const {
        x,
        y,
        placement: finalPlacement
      } = await computePosition(this._toggle, this._menu, {
        placement,
        middleware
      });
      Object.assign(this._menu.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        margin: '0'
      });
      Manipulator.setDataAttribute(this._menu, 'placement', finalPlacement);
    };
    updatePosition();
    this._floatingCleanup = autoUpdate(this._toggle, this._menu, updatePosition);
  }
  _disposeFloating() {
    if (this._floatingCleanup) {
      this._floatingCleanup();
      this._floatingCleanup = null;
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = CustomSelect.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event) {
    if (event.button === 2) {
      return;
    }
    const openSelects = SelectorEngine.find(`${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}`);
    for (const toggle of openSelects) {
      const selectElement = toggle.previousElementSibling;
      if (selectElement) {
        const instance = CustomSelect.getInstance(selectElement);
        if (instance) {
          instance.hide();
        }
      }
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, event => {
  // Close any open custom selects when clicking elsewhere
  const {
    target
  } = event;
  const openToggles = SelectorEngine.find('.custom-select-toggle.show');
  for (const toggle of openToggles) {
    const menu = toggle.nextElementSibling;
    if (!toggle.contains(target) && !menu?.contains(target)) {
      const select = toggle.previousElementSibling;
      const instance = CustomSelect.getInstance(select);
      if (instance) {
        instance.hide();
      }
    }
  }
});
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const instance = CustomSelect.getOrCreateInstance(this);
  if ([ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY, SPACE_KEY].includes(event.key)) {
    event.preventDefault();
    instance.show();
  }
});

// Auto-initialize on DOM ready
EventHandler.on(window, 'DOMContentLoaded', () => {
  for (const select of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
    CustomSelect.getOrCreateInstance(select);
  }
});

export { CustomSelect as default };
//# sourceMappingURL=custom-select.js.map
