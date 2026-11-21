/**
 * --------------------------------------------------------------------------
 * Bootstrap otp-input.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler, { type BootstrapEvent } from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import { onDocumentReady } from './util/component-functions.js'

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

const CLASS_NAME_INPUT = 'otp-input'
const CLASS_NAME_RENDERED = 'otp-rendered'
const CLASS_NAME_SLOTS = 'otp-slots'
const CLASS_NAME_SLOT = 'otp-slot'
const CLASS_NAME_SLOT_FILLED = 'otp-slot-filled'
const CLASS_NAME_SLOT_ACTIVE = 'otp-slot-active'
const CLASS_NAME_SLOT_SELECTED = 'otp-slot-selected'
const CLASS_NAME_SEPARATOR = 'otp-separator'

const MASK_CHARACTER = '•'

// Per-type input mode, validation pattern, and a filter that strips disallowed characters
const TYPES = {
  numeric: { inputmode: 'numeric', pattern: '[0-9]*', filter: /[^0-9]/g },
  alphanumeric: { inputmode: 'text', pattern: '[A-Za-z0-9]*', filter: /[^A-Za-z0-9]/g },
  alpha: { inputmode: 'text', pattern: '[A-Za-z]*', filter: /[^A-Za-z]/g }
}

type OtpInputConfig = {
  groups: number[] | null
  length: number | null
  mask: boolean
  pasteTransformer?: ((text: string) => string) | null
  separator: string
  type: string
}

const Default: OtpInputConfig = {
  groups: null,
  length: null,
  mask: false,
  pasteTransformer: null,
  separator: '·',
  type: 'numeric'
}

const DefaultType = {
  groups: '(array|null)',
  length: '(number|null)',
  mask: 'boolean',
  pasteTransformer: '(function|null)',
  separator: 'string',
  type: 'string'
}

/**
 * Class definition
 */

class OtpInput extends BaseComponent {
  protected declare _config: OtpInputConfig
  protected declare _input: HTMLInputElement
  protected declare _type: { inputmode: string, pattern: string, filter: RegExp }
  protected declare _length: number
  protected declare _slots: HTMLElement[]
  protected declare _pointerActive: boolean
  protected declare _pointerIndex: number
  protected declare _touchPointer: boolean
  protected declare _slotsContainer: HTMLElement
  protected declare _inputDefaults: Map<string, string>
  protected declare _inputListeners: Record<string, (event: BootstrapEvent) => void>
  protected declare _onSelectionChange: () => void
  protected declare _onReset: (event: Event) => void
  protected declare _lastCompleteValue: string | null

  constructor(element?: string | Element | null, config?: Partial<OtpInputConfig> | null) {
    super(element, config)

    const input = SelectorEngine.findOne<HTMLInputElement>(SELECTOR_INPUT, this._element)
    if (!input) {
      return
    }

    this._input = input

    this._type = TYPES[this._config.type as keyof typeof TYPES] || TYPES.numeric
    this._length = this._resolveLength()
    this._slots = []
    // Tracks whether focus was triggered by a click so we can respect the
    // clicked slot instead of jumping to the first empty one
    this._pointerActive = false
    // Slot index from the most recent tap, applied once focus settles
    this._pointerIndex = 0
    this._touchPointer = false

    this._setupInput()
    this._lastCompleteValue = null
    this._renderSlots()
    this._addEventListeners()
    this._render()
  }

  // Getters
  static override get Default(): OtpInputConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  getValue(): string {
    return this._input.value
  }

  setValue(value: string | number): void {
    this._input.value = this._sanitize(String(value))
    this._render()
    this._checkComplete()
  }

  clear(): void {
    this._input.value = ''
    this._lastCompleteValue = null
    this._render()
    this._input.focus()
  }

  focus(): void {
    this._input.focus()
    // Select the first empty slot (or the last one when the value is full)
    this._selectSlot(this._firstEmptyIndex())
    this._render()
  }

  override dispose(): void {
    for (const [type, listener] of Object.entries(this._inputListeners ?? {})) {
      EventHandler.off(this._input, type, listener)
    }

    EventHandler.off(document, 'selectionchange', this._onSelectionChange)
    document.removeEventListener('reset', this._onReset, true)

    for (const [attribute, value] of this._inputDefaults ?? []) {
      if (this._input.getAttribute(attribute) === value) {
        this._input.removeAttribute(attribute)
      }
    }

    this._slotsContainer?.remove()
    this._element.classList.remove(CLASS_NAME_RENDERED)
    super.dispose()
  }

  // Private
  protected _resolveLength(): number {
    if (this._config.length) {
      return this._config.length
    }

    const maxLength = Number.parseInt(this._input.getAttribute('maxlength')!, 10)
    return Number.isNaN(maxLength) || maxLength < 1 ? 6 : maxLength
  }

  protected _setupInput(): void {
    const input = this._input

    // A single text field backs the whole control so screen readers, password
    // managers, and SMS autofill treat it like any other input.
    if (input.type === 'number' || input.type === 'password') {
      input.type = 'text'
    }

    input.classList.add(CLASS_NAME_INPUT)
    input.setAttribute('maxlength', String(this._length))
    this._inputDefaults = new Map()
    // Chromium applies the pattern after a formatted paste even when it skips minlength.
    const pattern = input.minLength > 0 ? `${this._type.pattern.slice(0, -1)}{${input.minLength},}` : this._type.pattern
    const defaults = {
      inputmode: this._type.inputmode,
      pattern,
      spellcheck: 'false'
    }

    for (const [attribute, value] of Object.entries(defaults)) {
      if (!input.hasAttribute(attribute)) {
        input.setAttribute(attribute, value)
        this._inputDefaults.set(attribute, value)
      }
    }

    if (!input.getAttribute('autocomplete')) {
      input.setAttribute('autocomplete', 'one-time-code')
    }

    // Filter any pre-filled value through the configured type
    if (input.value) {
      input.value = this._sanitize(input.value)
    }
  }

  protected _renderSlots(): void {
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

  protected _addEventListeners(): void {
    // Listeners are attached with bare event names (not namespaced) because
    // `input`, `beforeinput`, `paste`, and `selectionchange` are not in
    // EventHandler's native-events list. Keep references to remove on dispose.
    this._inputListeners = {
      input: event => this._handleInput(event as InputEvent),
      compositionend: () => this._handleInput(),
      beforeinput: event => this._handleBeforeInput(event),
      keydown: event => this._handleKeydown(event as KeyboardEvent),
      paste: event => this._handlePaste(event),
      pointerdown: event => this._handlePointerDown(event),
      pointercancel: () => {
        this._touchPointer = false
      },
      click: event => this._handleClick(event)
    }
    this._inputListeners.focus = () => {
      if (this._pointerActive) {
        // A tap focused the input natively; position the caret on the clicked
        // slot now that focus has settled (doing this before native focus would
        // make iOS/iPadOS raise then immediately dismiss the keyboard)
        this._pointerActive = false
        this._selectSlot(this._pointerIndex)
        this._render()
        return
      }

      // Keyboard (Tab) focus lands on the first empty slot
      this._selectSlot(this._firstEmptyIndex())
      this._render()
    }

    const onSync = () => this._render()
    this._onSelectionChange = () => {
      if (document.activeElement === this._input) {
        this._render()
      }
    }

    for (const type of ['blur', 'keyup', 'select']) {
      this._inputListeners[type] = onSync
    }

    for (const [type, listener] of Object.entries(this._inputListeners)) {
      EventHandler.on(this._input, type, listener)
    }

    EventHandler.on(document, 'selectionchange', this._onSelectionChange)
    this._onReset = event => {
      if (event.target !== this._input.form) {
        return
      }

      // Wait for the browser to restore the default value.
      setTimeout(() => {
        if (event.defaultPrevented || event.target !== this._input?.form) {
          return
        }

        const sanitized = this._sanitize(this._input.value)
        if (sanitized !== this._input.value) {
          this._input.value = sanitized
        }

        this._lastCompleteValue = null
        this._render()
      })
    }

    document.addEventListener('reset', this._onReset, true)
  }

  protected _handleInput(event?: InputEvent): void {
    if (event?.isComposing) {
      return
    }

    const { value, selectionStart } = this._input
    const sanitized = this._sanitize(value)

    if (sanitized !== value) {
      this._input.value = sanitized
    }

    if (document.activeElement === this._input) {
      const inputType = event?.inputType
      if (inputType === 'insertText' || inputType?.startsWith('delete')) {
        const caret = selectionStart ?? sanitized.length
        this._selectSlot(this._sanitize(value.slice(0, caret)).length)
      } else if (!inputType || inputType === 'insertReplacementText') {
        this._selectSlot(this._firstEmptyIndex())
      }
    }

    this._afterValueChange()
  }

  protected _handlePaste(event: BootstrapEvent): void {
    const pastedValue = event.clipboardData?.getData('text')
    if (!pastedValue || !this._isEditable()) {
      return
    }

    const transformed = this._config.pasteTransformer?.(pastedValue) ?? pastedValue
    const sanitized = this._sanitize(transformed)
    // Sanitize before applying the length limit. The browser applies maxlength
    // to raw clipboard text before the input event, which can discard valid
    // characters that follow separators or whitespace.
    let start = this._input.selectionStart ?? this._input.value.length
    let end = this._input.selectionEnd ?? start
    if (sanitized.length === this._length) {
      start = 0
      end = this._input.value.length
    }

    const inserted = sanitized.slice(0, this._length - this._input.value.length + end - start)

    if (start === this._input.selectionStart && end === this._input.selectionEnd && inserted === pastedValue) {
      return
    }

    event.preventDefault()
    if (!inserted) {
      return
    }

    const input = this._input
    if (input.matches(':focus')) {
      input.setSelectionRange(start, end)
      // Use the browser's editing command to keep this paste in its undo history.
      if (input.ownerDocument.execCommand('insertText', false, inserted)) {
        return
      }
    }

    input.setRangeText(inserted, start, end, 'end')
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      composed: true,
      inputType: 'insertFromPaste',
      data: inserted
    }))
  }

  protected _handleBeforeInput(event: BootstrapEvent): void {
    const { inputType, data, isComposing } = event as InputEvent
    if (inputType !== 'insertText' || isComposing || data?.length !== 1 || !this._isEditable()) {
      return
    }

    if (!this._sanitize(data)) {
      event.preventDefault()
      return
    }

    // Let the browser replace the selection so edits keep native undo and input events.
    if (this._input.selectionStart === this._input.selectionEnd) {
      this._selectSlot(this._input.selectionStart ?? 0)
    }
  }

  protected _handleKeydown(event: KeyboardEvent): void {
    const { key, altKey, ctrlKey, metaKey, shiftKey, isComposing, defaultPrevented } = event
    if (defaultPrevented || isComposing || altKey || ctrlKey || metaKey || shiftKey || (key !== 'ArrowLeft' && key !== 'ArrowRight')) {
      return
    }

    if (getComputedStyle(this._slotsContainer).direction !== 'rtl') {
      return
    }

    // The visible slots run right to left, even when the code reads left to right.
    const start = this._input.selectionStart ?? 0
    const end = this._input.selectionEnd ?? start
    const isMovingRight = key === 'ArrowRight'
    const rangeEdge = isMovingRight ? start : end
    const nextSlot = start + (isMovingRight ? -1 : 1)
    const index = end - start > 1 ? rangeEdge : nextSlot

    event.preventDefault()
    this._selectSlot(Math.min(index, this._firstEmptyIndex()))
    this._render()
  }

  protected _handleClick(event: BootstrapEvent): void {
    if (!this._touchPointer) {
      return
    }

    this._touchPointer = false
    const index = this._slotIndexFromPoint(event.clientX)
    if (index === null) {
      return
    }

    // WebKit reports a mouse click after a tap and updates the caret after the click.
    requestAnimationFrame(() => {
      if (this._input && document.activeElement === this._input) {
        this._selectSlot(Math.min(index, this._firstEmptyIndex()))
        this._render()
      }
    })
  }

  protected _handlePointerDown(event: BootstrapEvent): void {
    // A disabled input still receives `pointerdown`, but never the focus that
    // would consume the remembered tap
    if (event.button !== 0 || this._input.matches(':disabled')) {
      return
    }

    this._touchPointer = event.pointerType === 'touch'
    const index = this._slotIndexFromPoint(event.clientX)
    if (index === null) {
      return
    }

    // Don't let the caret land past the first empty slot
    const target = Math.min(index, this._firstEmptyIndex())

    if (document.activeElement === this._input) {
      // A touch click places the caret. Leave a long press to the browser.
      if (!this._touchPointer) {
        event.preventDefault()
        this._selectSlot(target)
        this._render()
      }

      return
    }

    // Not yet focused: let the browser focus the input natively so the
    // on-screen keyboard is raised by the user's tap. Position the caret in the
    // focus handler once focus settles.
    this._pointerActive = true
    this._pointerIndex = target
  }

  // Map a viewport x-coordinate to the slot under it, clamped to the last slot
  protected _slotIndexFromPoint(x: number): number | null {
    const rtl = getComputedStyle(this._slotsContainer).direction === 'rtl'
    for (const [index, slot] of this._slots.entries()) {
      const { left, right } = slot.getBoundingClientRect()
      if ((rtl ? x >= left : x <= right) || index === this._slots.length - 1) {
        return index
      }
    }

    return null
  }

  protected _afterValueChange(): void {
    this._render()
    EventHandler.trigger(this._element, EVENT_INPUT, { value: this._input.value })

    if (this._input) {
      this._checkComplete()
    }
  }

  protected _firstEmptyIndex(): number {
    return Math.min(this._input.value.length, this._length - 1)
  }

  // `:disabled` also matches an input inside `<fieldset disabled>`, which the
  // `disabled` property doesn't
  protected _isEditable(): boolean {
    return !this._input.readOnly && !this._input.matches(':disabled')
  }

  // Represent the active slot as a selection: a filled slot is selected so the
  // next keystroke overwrites it; an empty slot gets a collapsed caret.
  protected _selectSlot(index: number): void {
    const clamped = Math.max(0, Math.min(index, this._length - 1))
    const end = clamped < this._input.value.length ? clamped + 1 : clamped
    this._input.setSelectionRange(clamped, end)
  }

  protected _sanitize(value: string): string {
    return value.replace(this._type.filter, '').slice(0, this._length)
  }

  protected _render(): void {
    const { value } = this._input
    const isFocused = document.activeElement === this._input
    const start = this._input.selectionStart ?? value.length
    const end = this._input.selectionEnd ?? start
    const caret = Math.min(start, this._length - 1)

    for (const [index, slot] of this._slots.entries()) {
      const char = value[index] ?? ''
      const placeholder = value ? '' : this._input.placeholder[index] ?? ''
      const text = char && this._config.mask ? MASK_CHARACTER : char || placeholder
      if (slot.textContent !== text) {
        slot.textContent = text
      }

      slot.classList.toggle(CLASS_NAME_SLOT_FILLED, Boolean(char))
      slot.classList.toggle(CLASS_NAME_SLOT_ACTIVE, isFocused && index === caret)
      slot.classList.toggle(CLASS_NAME_SLOT_SELECTED, isFocused && end - start > 1 && index >= start && index < end)
    }
  }

  protected _checkComplete(): void {
    const { value } = this._input
    const completeValue = value.length === this._length ? value : null
    const changed = completeValue !== this._lastCompleteValue
    this._lastCompleteValue = completeValue

    if (completeValue && changed) {
      EventHandler.trigger(this._element, EVENT_COMPLETE, { value })
    }
  }
}

/**
 * Data API implementation
 */

onDocumentReady(EVENT_DOMCONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_OTP)) {
    OtpInput.getOrCreateInstance(element)
  }
})

export default OtpInput
export type { OtpInputConfig }
