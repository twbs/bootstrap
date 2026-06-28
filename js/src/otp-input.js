/**
 * --------------------------------------------------------------------------
 * Bootstrap otp-input.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'

/**
 * Constants
 */

const NAME = 'otpInput'
const DATA_KEY = 'bs.otpInput'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_COMPLETE = `complete${EVENT_KEY}`
const EVENT_INPUT = `input${EVENT_KEY}`
const EVENT_DOMCONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DATA_OTP = '[data-bs-otp]'
const SELECTOR_INPUT = 'input'

// Events that should refresh the active-slot highlight as the caret moves
const SYNC_EVENTS = ['blur', 'keyup', 'click', 'select']

const CLASS_NAME_INPUT = 'otp-input'
const CLASS_NAME_RENDERED = 'otp-rendered'
const CLASS_NAME_SLOTS = 'otp-slots'
const CLASS_NAME_SLOT = 'otp-slot'
const CLASS_NAME_SLOT_FILLED = 'otp-slot-filled'
const CLASS_NAME_SLOT_ACTIVE = 'otp-slot-active'
const CLASS_NAME_SEPARATOR = 'otp-separator'

const MASK_CHARACTER = '•'

// Per-type input mode, validation pattern, and a filter that strips disallowed characters
const TYPES = {
  numeric: { inputmode: 'numeric', pattern: '[0-9]*', filter: /[^0-9]/g },
  alphanumeric: { inputmode: 'text', pattern: '[A-Za-z0-9]*', filter: /[^A-Za-z0-9]/g },
  alpha: { inputmode: 'text', pattern: '[A-Za-z]*', filter: /[^A-Za-z]/g }
}

const Default = {
  groups: null,
  length: null,
  mask: false,
  separator: '·',
  type: 'numeric'
}

const DefaultType = {
  groups: '(array|null)',
  length: '(number|null)',
  mask: 'boolean',
  separator: 'string',
  type: 'string'
}

/**
 * Class definition
 */

class OtpInput extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._input = SelectorEngine.findOne(SELECTOR_INPUT, this._element)
    if (!this._input) {
      return
    }

    this._type = TYPES[this._config.type] || TYPES.numeric
    this._length = this._resolveLength()
    this._slots = []

    this._setupInput()
    this._renderSlots()
    this._addEventListeners()
    this._render()
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public
  getValue() {
    return this._input.value
  }

  setValue(value) {
    this._input.value = this._sanitize(String(value))
    this._render()
    this._checkComplete()
  }

  clear() {
    this._input.value = ''
    this._render()
    this._input.focus()
  }

  focus() {
    this._input.focus()
    // Place the caret after the last entered character
    const end = this._input.value.length
    this._input.setSelectionRange(end, end)
    this._render()
  }

  dispose() {
    EventHandler.off(this._input, 'input', this._onInput)
    EventHandler.off(this._input, 'focus', this._onFocus)
    for (const type of SYNC_EVENTS) {
      EventHandler.off(this._input, type, this._onSync)
    }

    this._slotsContainer?.remove()
    this._element.classList.remove(CLASS_NAME_RENDERED)
    super.dispose()
  }

  // Private
  _resolveLength() {
    if (this._config.length) {
      return this._config.length
    }

    const maxLength = Number.parseInt(this._input.getAttribute('maxlength'), 10)
    return Number.isNaN(maxLength) || maxLength < 1 ? 6 : maxLength
  }

  _setupInput() {
    const input = this._input

    // A single text field backs the whole control so screen readers, password
    // managers, and SMS autofill treat it like any other input.
    if (input.type === 'number' || input.type === 'password') {
      input.type = 'text'
    }

    input.classList.add(CLASS_NAME_INPUT)
    input.setAttribute('maxlength', String(this._length))
    input.setAttribute('inputmode', this._type.inputmode)
    input.setAttribute('pattern', this._type.pattern)

    if (!input.getAttribute('autocomplete')) {
      input.setAttribute('autocomplete', 'one-time-code')
    }

    // Filter any pre-filled value through the configured type
    if (input.value) {
      input.value = this._sanitize(input.value)
    }
  }

  _renderSlots() {
    const container = document.createElement('div')
    container.className = CLASS_NAME_SLOTS
    container.setAttribute('aria-hidden', 'true')

    const { groups } = this._config
    let groupIndex = 0
    let inGroup = 0

    for (let i = 0; i < this._length; i++) {
      const slot = document.createElement('div')
      slot.className = CLASS_NAME_SLOT
      container.append(slot)
      this._slots.push(slot)

      // Insert a visual separator between configured groups
      if (Array.isArray(groups) && groups.length > 0) {
        inGroup++
        if (inGroup === groups[groupIndex] && i < this._length - 1) {
          const separator = document.createElement('div')
          separator.className = CLASS_NAME_SEPARATOR
          separator.textContent = this._config.separator
          container.append(separator)
          groupIndex = Math.min(groupIndex + 1, groups.length - 1)
          inGroup = 0
        }
      }
    }

    this._slotsContainer = container
    this._element.append(container)
    this._element.classList.add(CLASS_NAME_RENDERED)
  }

  _addEventListeners() {
    // Listeners are attached with bare event names (not namespaced) because
    // `input` is not in EventHandler's native-events list; we keep references
    // so they can be removed on dispose.
    this._onInput = () => this._handleInput()
    this._onFocus = () => this.focus()
    this._onSync = () => this._render()

    EventHandler.on(this._input, 'input', this._onInput)
    EventHandler.on(this._input, 'focus', this._onFocus)

    // Keep the active-slot highlight in sync with the caret
    for (const type of SYNC_EVENTS) {
      EventHandler.on(this._input, type, this._onSync)
    }
  }

  _handleInput() {
    const sanitized = this._sanitize(this._input.value)
    if (sanitized !== this._input.value) {
      this._input.value = sanitized
    }

    this._render()

    EventHandler.trigger(this._element, EVENT_INPUT, { value: this._input.value })

    this._checkComplete()
  }

  _sanitize(value) {
    return value.replace(this._type.filter, '').slice(0, this._length)
  }

  _render() {
    const { value } = this._input
    const isFocused = document.activeElement === this._input
    // The active slot follows the caret, clamped to the last slot when the value is full
    const caret = Math.min(this._input.selectionStart ?? value.length, this._length - 1)

    for (const [index, slot] of this._slots.entries()) {
      const char = value[index] ?? ''
      slot.textContent = char && this._config.mask ? MASK_CHARACTER : char
      slot.classList.toggle(CLASS_NAME_SLOT_FILLED, Boolean(char))
      slot.classList.toggle(CLASS_NAME_SLOT_ACTIVE, isFocused && index === caret)
    }
  }

  _checkComplete() {
    const { value } = this._input
    if (value.length === this._length) {
      EventHandler.trigger(this._element, EVENT_COMPLETE, { value })
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_DOMCONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) {
    OtpInput.getOrCreateInstance(element)
  }
})

export default OtpInput
