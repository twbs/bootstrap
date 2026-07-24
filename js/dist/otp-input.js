/*!
  * Bootstrap otp-input.js v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import BaseComponent from './base-component.js';
import EventHandler from './dom/event-handler.js';
import SelectorEngine from './dom/selector-engine.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap otp-input.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'otpInput';
const DATA_KEY = 'bs.otpInput';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const EVENT_COMPLETE = `complete${EVENT_KEY}`;
const EVENT_INPUT = `input${EVENT_KEY}`;
const EVENT_DOMCONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_DATA_OTP = '[data-bs-otp]';
const SELECTOR_INPUT = 'input';

// Events that should refresh the active-slot highlight as the caret moves
const SYNC_EVENTS = ['blur', 'keyup', 'select'];
const CLASS_NAME_INPUT = 'otp-input';
const CLASS_NAME_RENDERED = 'otp-rendered';
const CLASS_NAME_SLOTS = 'otp-slots';
const CLASS_NAME_SLOT = 'otp-slot';
const CLASS_NAME_SLOT_FILLED = 'otp-slot-filled';
const CLASS_NAME_SLOT_ACTIVE = 'otp-slot-active';
const CLASS_NAME_SEPARATOR = 'otp-separator';
const MASK_CHARACTER = '•';

// Per-type input mode, validation pattern, and a filter that strips disallowed characters
const TYPES = {
  numeric: {
    inputmode: 'numeric',
    pattern: '[0-9]*',
    filter: /[^0-9]/g
  },
  alphanumeric: {
    inputmode: 'text',
    pattern: '[A-Za-z0-9]*',
    filter: /[^A-Za-z0-9]/g
  },
  alpha: {
    inputmode: 'text',
    pattern: '[A-Za-z]*',
    filter: /[^A-Za-z]/g
  }
};
const Default = {
  groups: null,
  length: null,
  mask: false,
  separator: '·',
  type: 'numeric'
};
const DefaultType = {
  groups: '(array|null)',
  length: '(number|null)',
  mask: 'boolean',
  separator: 'string',
  type: 'string'
};

/**
 * Class definition
 */

class OtpInput extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._input = SelectorEngine.findOne(SELECTOR_INPUT, this._element);
    if (!this._input) {
      return;
    }
    this._type = TYPES[this._config.type] || TYPES.numeric;
    this._length = this._resolveLength();
    this._slots = [];
    // Tracks whether focus was triggered by a click so we can respect the
    // clicked slot instead of jumping to the first empty one
    this._pointerActive = false;
    // Slot index from the most recent tap, applied once focus settles
    this._pointerIndex = 0;
    this._setupInput();
    this._renderSlots();
    this._addEventListeners();
    this._render();
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
  getValue() {
    return this._input.value;
  }
  setValue(value) {
    this._input.value = this._sanitize(String(value));
    this._render();
    this._checkComplete();
  }
  clear() {
    this._input.value = '';
    this._render();
    this._input.focus();
  }
  focus() {
    this._input.focus();
    // Select the first empty slot (or the last one when the value is full)
    this._selectSlot(this._firstEmptyIndex());
    this._render();
  }
  dispose() {
    EventHandler.off(this._input, 'input', this._onInput);
    EventHandler.off(this._input, 'beforeinput', this._onBeforeInput);
    EventHandler.off(this._input, 'focus', this._onFocus);
    EventHandler.off(this._input, 'pointerdown', this._onPointerDown);
    EventHandler.off(document, 'selectionchange', this._onSelectionChange);
    for (const type of SYNC_EVENTS) {
      EventHandler.off(this._input, type, this._onSync);
    }
    this._slotsContainer?.remove();
    this._element.classList.remove(CLASS_NAME_RENDERED);
    super.dispose();
  }

  // Private
  _resolveLength() {
    if (this._config.length) {
      return this._config.length;
    }
    const maxLength = Number.parseInt(this._input.getAttribute('maxlength'), 10);
    return Number.isNaN(maxLength) || maxLength < 1 ? 6 : maxLength;
  }
  _setupInput() {
    const input = this._input;

    // A single text field backs the whole control so screen readers, password
    // managers, and SMS autofill treat it like any other input.
    if (input.type === 'number' || input.type === 'password') {
      input.type = 'text';
    }
    input.classList.add(CLASS_NAME_INPUT);
    input.setAttribute('maxlength', String(this._length));
    input.setAttribute('inputmode', this._type.inputmode);
    input.setAttribute('pattern', this._type.pattern);
    if (!input.getAttribute('autocomplete')) {
      input.setAttribute('autocomplete', 'one-time-code');
    }

    // Filter any pre-filled value through the configured type
    if (input.value) {
      input.value = this._sanitize(input.value);
    }
  }
  _renderSlots() {
    const container = document.createElement('div');
    container.className = CLASS_NAME_SLOTS;
    container.setAttribute('aria-hidden', 'true');
    const {
      groups
    } = this._config;
    let groupIndex = 0;
    let inGroup = 0;
    for (let i = 0; i < this._length; i++) {
      const slot = document.createElement('div');
      slot.className = CLASS_NAME_SLOT;
      container.append(slot);
      this._slots.push(slot);

      // Insert a visual separator between configured groups
      if (Array.isArray(groups) && groups.length > 0) {
        inGroup++;
        if (inGroup === groups[groupIndex] && i < this._length - 1) {
          const separator = document.createElement('div');
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
    // Listeners are attached with bare event names (not namespaced) because
    // `input`, `beforeinput`, and `selectionchange` are not in EventHandler's
    // native-events list; we keep references so they can be removed on dispose.
    this._onInput = () => this._handleInput();
    this._onBeforeInput = event => this._handleBeforeInput(event);
    this._onPointerDown = event => this._handlePointerDown(event);
    this._onFocus = () => {
      if (this._pointerActive) {
        // A tap focused the input natively; position the caret on the clicked
        // slot now that focus has settled (doing this before native focus would
        // make iOS/iPadOS raise then immediately dismiss the keyboard)
        this._pointerActive = false;
        this._selectSlot(this._pointerIndex);
        this._render();
        return;
      }

      // Keyboard (Tab) focus lands on the first empty slot
      this._selectSlot(this._firstEmptyIndex());
      this._render();
    };
    this._onSync = () => this._render();
    this._onSelectionChange = () => {
      if (document.activeElement === this._input) {
        this._render();
      }
    };
    EventHandler.on(this._input, 'input', this._onInput);
    EventHandler.on(this._input, 'beforeinput', this._onBeforeInput);
    EventHandler.on(this._input, 'focus', this._onFocus);
    EventHandler.on(this._input, 'pointerdown', this._onPointerDown);
    EventHandler.on(document, 'selectionchange', this._onSelectionChange);

    // Keep the active-slot highlight in sync with the caret
    for (const type of SYNC_EVENTS) {
      EventHandler.on(this._input, type, this._onSync);
    }
  }

  // Bulk path: paste, SMS autofill, or a programmatic value change land here as
  // a single multi-character `input` event. Single keystrokes are handled by
  // `_handleBeforeInput` (overwrite semantics) and never reach this method.
  _handleInput() {
    const sanitized = this._sanitize(this._input.value);
    if (sanitized !== this._input.value) {
      this._input.value = sanitized;
    }

    // Place the caret on the first empty slot after a paste/autofill
    if (document.activeElement === this._input) {
      this._selectSlot(this._firstEmptyIndex());
    }
    this._afterValueChange();
  }

  // Intercept single-character typing and backspace so each slot is overwritten
  // in place rather than inserting and shifting the rest of the value. Anything
  // else (paste, autofill, IME composition) falls through to `_handleInput`.
  _handleBeforeInput(event) {
    const {
      inputType,
      data
    } = event;
    if (inputType === 'insertText' && data && data.length === 1) {
      event.preventDefault();
      const char = this._sanitize(data);
      if (!char) {
        return;
      }
      const index = Math.min(this._input.selectionStart ?? 0, this._length - 1);
      const chars = [...this._input.value];
      chars[index] = char;
      this._input.value = chars.join('').slice(0, this._length);
      this._selectSlot(index + 1);
      this._afterValueChange();
      return;
    }
    if (inputType === 'deleteContentBackward') {
      event.preventDefault();
      const start = this._input.selectionStart ?? 0;
      const end = this._input.selectionEnd ?? start;
      const chars = [...this._input.value];
      if (end > start) {
        // A filled slot is selected: clear it and keep the caret in place
        chars.splice(start, end - start);
        this._input.value = chars.join('');
        this._selectSlot(start);
      } else if (start > 0) {
        // Collapsed caret: remove the previous character and step back
        chars.splice(start - 1, 1);
        this._input.value = chars.join('');
        this._selectSlot(start - 1);
      }
      this._afterValueChange();
    }
  }
  _handlePointerDown(event) {
    const index = this._slotIndexFromPoint(event.clientX);
    if (index === null) {
      return;
    }

    // Don't let the caret land past the first empty slot
    const target = Math.min(index, this._firstEmptyIndex());
    if (document.activeElement === this._input) {
      // Already focused (keyboard is up): take over caret placement from the
      // browser. Safe to preventDefault here — it won't dismiss the keyboard.
      event.preventDefault();
      this._selectSlot(target);
      this._render();
      return;
    }

    // Not yet focused: let the browser focus the input natively so the
    // on-screen keyboard is raised by the user's tap. Position the caret in the
    // focus handler once focus settles.
    this._pointerActive = true;
    this._pointerIndex = target;
  }

  // Map a viewport x-coordinate to the slot under it, clamped to the last slot
  _slotIndexFromPoint(x) {
    for (const [index, slot] of this._slots.entries()) {
      if (x <= slot.getBoundingClientRect().right || index === this._slots.length - 1) {
        return index;
      }
    }
    return null;
  }
  _afterValueChange() {
    this._render();
    EventHandler.trigger(this._element, EVENT_INPUT, {
      value: this._input.value
    });
    this._checkComplete();
  }
  _firstEmptyIndex() {
    return Math.min(this._input.value.length, this._length - 1);
  }

  // Represent the active slot as a selection: a filled slot is selected so the
  // next keystroke overwrites it; an empty slot gets a collapsed caret.
  _selectSlot(index) {
    const clamped = Math.max(0, Math.min(index, this._length - 1));
    const end = clamped < this._input.value.length ? clamped + 1 : clamped;
    this._input.setSelectionRange(clamped, end);
  }
  _sanitize(value) {
    return value.replace(this._type.filter, '').slice(0, this._length);
  }
  _render() {
    const {
      value
    } = this._input;
    const isFocused = document.activeElement === this._input;
    // The active slot follows the caret, clamped to the last slot when the value is full
    const caret = Math.min(this._input.selectionStart ?? value.length, this._length - 1);
    for (const [index, slot] of this._slots.entries()) {
      const char = value[index] ?? '';
      slot.textContent = char && this._config.mask ? MASK_CHARACTER : char;
      slot.classList.toggle(CLASS_NAME_SLOT_FILLED, Boolean(char));
      slot.classList.toggle(CLASS_NAME_SLOT_ACTIVE, isFocused && index === caret);
    }
  }
  _checkComplete() {
    const {
      value
    } = this._input;
    if (value.length === this._length) {
      EventHandler.trigger(this._element, EVENT_COMPLETE, {
        value
      });
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_DOMCONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) {
    OtpInput.getOrCreateInstance(element);
  }
});

export { OtpInput as default };
//# sourceMappingURL=otp-input.js.map
