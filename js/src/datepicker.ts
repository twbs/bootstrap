/**
 * --------------------------------------------------------------------------
 * Bootstrap datepicker.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  Calendar,
  months,
  type DateAny,
  type DateMode,
  type DatesArr,
  type MonthsCount,
  type Options,
  type PositionToInput,
  type Range,
  type WeekDayID
} from 'vanilla-calendar-pro'
import {
  autoUpdate, computePosition, flip, offset, shift
} from '@floating-ui/dom'
import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import { onDocumentReady } from './util/component-functions.js'
import { getUID, isDisabled, isVisible } from './util/index.js'

/**
 * Constants
 */

const NAME = 'datepicker'
const DATA_KEY = 'bs.datepicker'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_CHANGE = `change${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="datepicker"]'

const EVENT_KEYDOWN = `keydown${EVENT_KEY}`
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]'

const HIDE_DELAY = 100 // ms delay before hiding after selection

// Keep the existing VCP option types, including the public placement names.
// Their literal unions reject unsupported values at compile time.
type DatepickerConfig = {
  datepickerTheme: string | null
  dateMin: DateAny | null
  dateMax: DateAny | null
  dateFormat: Intl.DateTimeFormatOptions | ((date: Date, locale: string | undefined) => string) | null
  displayElement: string | HTMLElement | boolean | null
  displayMonthsCount: MonthsCount
  firstWeekday: WeekDayID
  inline: boolean
  locale: string
  positionElement: string | HTMLElement | null
  selectedDates: string[]
  selectionMode: DateMode
  placement: PositionToInput
  vcpOptions: Options
}

const Default: DatepickerConfig = {
  datepickerTheme: null, // 'light', 'dark', 'auto' - explicit theme for datepicker popover only
  dateMin: null,
  dateMax: null,
  dateFormat: null, // Intl.DateTimeFormat options, or function(date, locale) => string
  displayElement: null, // Element to show formatted date (defaults to element for buttons)
  displayMonthsCount: 1, // Number of months to display side-by-side
  firstWeekday: 1, // Monday
  inline: false, // Render calendar inline (no popup)
  locale: 'default',
  positionElement: null, // Element to position calendar relative to (defaults to input)
  selectedDates: [],
  selectionMode: 'single', // 'single', 'multiple', 'multiple-ranged'
  placement: 'left', // 'left', 'center', 'right', 'auto'
  vcpOptions: {} // Pass-through for any VCP option
}

const DefaultType = {
  datepickerTheme: '(null|string)',
  dateMin: '(null|string|number|object)',
  dateMax: '(null|string|number|object)',
  dateFormat: '(null|object|function)',
  displayElement: '(null|string|element|boolean)',
  displayMonthsCount: 'number',
  firstWeekday: 'number',
  inline: 'boolean',
  locale: 'string',
  positionElement: '(null|string|element)',
  selectedDates: 'array',
  selectionMode: 'string',
  placement: 'string',
  vcpOptions: 'object'
}

// Each private field key identifies one entry without confusing duplicate names.
// Transform the entry list once. Keep native file entries and their order.
type FormBinding = { controls: Map<string, () => [string, string] | null>; handler: (event: FormDataEvent) => void }
const formBindings = new WeakMap<HTMLFormElement, FormBinding>()
const bindFormData = (form: HTMLFormElement, key: string, serialize: () => [string, string] | null): (() => void) => {
  let binding = formBindings.get(form)
  if (!binding) {
    const state: FormBinding = { controls: new Map(), handler() {} }
    state.handler = event => {
      const entries: Array<[string, FormDataEntryValue]> = []
      for (const [name, value] of event.formData) {
        const control = state.controls.get(name)
        if (!control) {
          entries.push([name, value])
          continue
        }

        const entry = control()
        if (entry) {
          entries.push(entry)
        }
      }

      for (const name of new Set(event.formData.keys())) {
        event.formData.delete(name)
      }

      for (const [name, value] of entries) {
        event.formData.append(name, value)
      }
    }

    binding = state
    formBindings.set(form, binding)
    form.addEventListener('formdata', binding.handler, true)
  }

  binding.controls.set(key, serialize)
  return () => {
    binding.controls.delete(key)
    if (binding.controls.size === 0) {
      form.removeEventListener('formdata', binding.handler, true)
      formBindings.delete(form)
    }
  }
}

/**
 * Class definition
 */

class Datepicker extends BaseComponent {
  protected declare _element: HTMLElement & { value: string }
  protected declare _config: DatepickerConfig
  protected declare _calendar: Calendar | null
  protected declare _isShown: boolean
  protected declare _isInput: boolean
  protected declare _isInline: boolean
  protected declare _boundInput: HTMLInputElement | null
  protected declare _positionElement: HTMLElement
  protected declare _displayElement: HTMLElement | false | null
  protected declare _themeObserver: MutationObserver | null
  protected declare _onOutside: (event: Event) => void
  protected declare _onTriggerClick: () => void
  protected declare _onKeydown: (event: Event) => void
  protected declare _popup: HTMLElement | null
  protected declare _floatingCleanup: (() => void) | null
  protected declare _hideTimeout: ReturnType<typeof setTimeout> | null
  protected declare _resetTimeout: ReturnType<typeof setTimeout> | null
  protected declare _suppressFocus: boolean
  protected declare _positionGeneration: number
  protected declare _inputName: string | null
  protected declare _inputObserver: MutationObserver | null
  protected declare _form: HTMLFormElement | null
  protected declare _formCleanup: (() => void) | null
  protected declare _onReset: (event: Event) => void
  protected declare _initialDates: string[]
  protected declare _dialog: HTMLDialogElement | null
  protected declare _onDialogClose: () => void
  protected declare _eventPending: boolean
  protected declare _originalAria: Map<string, string | null>

  constructor(element?: string | Element | null, config?: Partial<DatepickerConfig> | null) {
    super(element, config)
    this._calendar = null
    this._popup = null
    this._isShown = false
    this._floatingCleanup = null
    this._hideTimeout = null
    this._resetTimeout = null
    this._suppressFocus = false
    this._positionGeneration = 0
    this._inputName = null
    this._inputObserver = null
    this._form = null
    this._formCleanup = null
    this._dialog = null
    this._initialDates = []
    this._eventPending = false
    this._originalAria = new Map(['aria-haspopup', 'aria-expanded'].map(name => [name, this._element.getAttribute(name)]))
    try {
      this._initCalendar()
    } catch (error) {
      this.dispose()
      throw error
    }
  }

  // Getters
  static override get Default(): DatepickerConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  toggle(): Promise<void> {
    if (this._isInline) {
      return Promise.resolve()
    }

    return this._isShown ? this.hide() : this.show()
  }

  async show(): Promise<void> {
    if (!this._calendar || this._isInline || this._isShown || this._eventPending || this._suppressFocus || isDisabled(this._element)) {
      return
    }

    const event = this._triggerLifecycleEvent(EVENT_SHOW)
    if (event.defaultPrevented || !this._calendar || this._isShown) {
      return
    }

    this._isShown = true
    const popup = this._popup!
    this._mountPopup()
    this._syncPopupState(this._calendar)
    if (typeof popup.showPopover === 'function') {
      popup.showPopover()
    }

    this._element.setAttribute('aria-expanded', 'true')
    await this._updatePosition()
    if (!this._calendar || !this._isShown) {
      return
    }

    this._floatingCleanup = autoUpdate(this._positionElement, popup, () => {
      this._updatePosition()
    })
    EventHandler.trigger(this._element, EVENT_SHOWN)
  }

  async hide(): Promise<void> {
    clearTimeout(this._hideTimeout ?? undefined)
    this._hideTimeout = null
    if (!this._calendar || this._isInline || !this._isShown || this._eventPending) {
      return
    }

    const event = this._triggerLifecycleEvent(EVENT_HIDE)
    if (event.defaultPrevented || !this._calendar) {
      return
    }

    this._closePopup()
    EventHandler.trigger(this._element, EVENT_HIDDEN)
  }

  protected _triggerLifecycleEvent(name: string): Event {
    this._eventPending = true
    try {
      return EventHandler.trigger(this._element, name)
    } finally {
      this._eventPending = false
    }
  }

  protected _closePopup(): void {
    this._isShown = false
    this._positionGeneration++
    this._floatingCleanup?.()
    this._floatingCleanup = null
    if (this._popup?.matches(':popover-open')) {
      this._popup.hidePopover()
    }

    if (this._calendar) {
      this._syncPopupState(this._calendar)
    }

    this._element?.setAttribute('aria-expanded', 'false')
  }

  override dispose(): void {
    clearTimeout(this._hideTimeout ?? undefined)
    clearTimeout(this._resetTimeout ?? undefined)
    this._closePopup()
    this._themeObserver?.disconnect()
    this._inputObserver?.disconnect()
    this._formCleanup?.()
    if (this._form && this._onReset) {
      EventHandler.off(this._form, `reset${EVENT_KEY}`, this._onReset)
    }

    if (this._onOutside) {
      EventHandler.off(document, EVENT_FOCUSIN, this._onOutside)
      EventHandler.off(document, EVENT_POINTERDOWN, this._onOutside)
    }

    if (this._onKeydown) {
      EventHandler.off(this._element, EVENT_KEYDOWN, this._onKeydown)
      EventHandler.off(this._popup!, EVENT_KEYDOWN, this._onKeydown)
    }

    if (this._onTriggerClick) {
      EventHandler.off(this._positionElement, EVENT_CLICK, this._onTriggerClick)
    }

    if (this._dialog) {
      EventHandler.off(this._dialog, 'close', this._onDialogClose)
    }

    if (this._calendar?.context.isInit) {
      this._calendar.destroy()
      this._calendar.context.mainElement.remove()
    } else {
      this._popup?.remove()
    }

    if (this._inputName !== null) {
      this._element.setAttribute('name', this._inputName)
      this._boundInput?.remove()
    }

    for (const [name, value] of this._originalAria) {
      if (value === null) {
        this._element.removeAttribute(name)
      } else {
        this._element.setAttribute(name, value)
      }
    }

    this._calendar = null
    super.dispose()
  }

  getSelectedDates(): string[] {
    const dates = this._calendar?.context?.selectedDates
    return dates ? [...dates] : []
  }

  setSelectedDates(dates: DatesArr): void {
    if (this._calendar) {
      for (const date of dates) {
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !this._parseIsoDate(date)) {
          throw new TypeError('Invalid ISO date')
        }
      }

      this._calendar.set({ selectedDates: dates })
      this._syncSelectedDates([...this._calendar.context.selectedDates])
    }
  }

  // Private
  protected _initCalendar(): void {
    this._isInput = this._element.tagName === 'INPUT'
    this._isInline = this._config.inline
    if (this._isInline && !this._isInput) {
      this._boundInput = this._element.querySelector<HTMLInputElement>('input[type="hidden"], input[name]')
    }

    this._positionElement = this._resolvePositionElement()
    this._displayElement = this._resolveDisplayElement()
    this._popup = document.createElement('div')
    if (this._isInline) {
      this._element.append(this._popup)
    } else {
      this._popup.setAttribute('popover', 'manual')
      this._element.setAttribute('aria-haspopup', 'dialog')
      this._element.setAttribute('aria-expanded', 'false')
      this._mountPopup()
    }

    // Render VCP as a calendar only. Bootstrap owns the trigger, popup lifetime,
    // positioning, focus, and events; VCP never replaces the application node.
    this._calendar = new Calendar(this._popup, this._buildCalendarOptions())
    this._calendar.init()
    if (this._isInput && this._element.value) {
      this._parseInputValue()
    }

    this._initialDates = this.getSelectedDates()
    if (this._isInput && !this._isInline) {
      this._createBoundInput()
      this._bindInputForm()
      EventHandler.on(this._element, `input${EVENT_KEY}`, () => this._parseInputValue())
    }

    this._updateDisplayWithSelectedDates()
    if (this._isInline && this._boundInput) {
      this._bindInputForm()
    }

    this._setupThemeObserver()
    this._setupDismiss()
  }

  protected _createBoundInput(): void {
    const name = this._element.getAttribute('name')
    if (!name) {
      return
    }

    this._inputName = name
    this._boundInput = document.createElement('input')
    this._boundInput.type = 'hidden'
    this._boundInput.id = getUID('bs-datepicker-')
    this._boundInput.name = this._boundInput.id
    this._element.before(this._boundInput)
    this._element.removeAttribute('name')
    this._syncBoundInput()
    this._inputObserver = new MutationObserver(() => {
      this._syncBoundInput()
      this._bindInputForm()
    })
    this._inputObserver.observe(this._element, { attributes: true, attributeFilter: ['name', 'disabled', 'form'] })
  }

  protected _syncBoundInput(): void {
    if (this._inputName === null || !this._boundInput) {
      return
    }

    const name = this._element.getAttribute('name')
    if (name !== null) {
      this._inputName = name
      this._element.removeAttribute('name')
    }

    const form = this._element.getAttribute('form')
    if (form === null) {
      this._boundInput.removeAttribute('form')
    } else {
      this._boundInput.setAttribute('form', form)
    }

    this._boundInput.value = this.getSelectedDates().join(',')
  }

  protected _bindInputForm(): void {
    const form = this._isInput ? (this._element as HTMLInputElement).form : this._boundInput?.form ?? null
    if (form === this._form) {
      return
    }

    this._formCleanup?.()
    if (this._form) {
      EventHandler.off(this._form, `reset${EVENT_KEY}`, this._onReset)
    }

    this._form = form
    if (!form) {
      return
    }

    if (this._inputName !== null && this._boundInput) {
      this._formCleanup = bindFormData(form, this._boundInput.name, () => {
        this._syncBoundInput()
        return this._element.matches(':disabled') || isDisabled(this._element) || !this._inputName ?
          null :
          [this._inputName, this.getSelectedDates().join(',')]
      })
    }

    this._onReset = event => {
      clearTimeout(this._resetTimeout ?? undefined)
      this._resetTimeout = setTimeout(() => {
        this._resetTimeout = null
        if (!event.defaultPrevented && this._calendar) {
          this.setSelectedDates(this._initialDates)
        }
      }, 0)
    }

    EventHandler.on(form, `reset${EVENT_KEY}`, this._onReset)
  }

  protected _mountPopup(): void {
    const dialog = this._element.closest<HTMLDialogElement>('dialog[open]')
    if (dialog !== this._dialog) {
      if (this._dialog) {
        EventHandler.off(this._dialog, 'close', this._onDialogClose)
      }

      this._dialog = dialog
      this._onDialogClose = () => this._closePopup()
      if (dialog) {
        EventHandler.on(dialog, 'close', this._onDialogClose)
      }
    }

    const root = this._element.getRootNode()
    const parent = dialog || (root instanceof ShadowRoot ? root : document.body)
    if (this._popup!.parentNode !== parent) {
      parent.append(this._popup!)
    }
  }

  protected async _updatePosition(): Promise<void> {
    const popup = this._popup
    if (!popup || !this._isShown) {
      return
    }

    const generation = ++this._positionGeneration
    const left = popup.dir === 'rtl' ? '-end' : '-start'
    const right = popup.dir === 'rtl' ? '-start' : '-end'
    const alignment = this._config.placement === 'center' ? '' : (this._config.placement === 'right' ? right : left)
    const result = await computePosition(this._positionElement, popup, {
      placement: `bottom${alignment}` as 'bottom' | 'bottom-start' | 'bottom-end',
      strategy: 'fixed',
      middleware: [offset(4), flip(), shift({ padding: 8 })]
    })
    if (generation !== this._positionGeneration || !this._isShown) {
      return
    }

    Object.assign(popup.style, { position: result.strategy, left: `${result.x}px`, top: `${result.y}px` })
    popup.dataset.vcPosition = result.placement.startsWith('top') ? 'top' : 'bottom'
  }

  protected _syncPopupState(self: Calendar): void {
    const popup = self.context.mainElement
    if (!this._isInline) {
      popup.dataset.vcInput = ''
      popup.role = 'dialog'
      popup.toggleAttribute('data-vc-calendar-hidden', !this._isShown)
      popup.inert = !this._isShown
      popup.setAttribute('aria-hidden', String(!this._isShown))
    }

    this._syncThemeAttribute(popup)
  }

  protected _updateDisplayWithSelectedDates(): void {
    const selectedDates = this.getSelectedDates()
    if (selectedDates.length > 0) {
      this._syncSelectedDates(selectedDates)
    }
  }

  protected _syncSelectedDates(selectedDates: string[]): void {
    const formattedDate = this._formatDateForInput(selectedDates)
    if (this._isInput) {
      this._element.value = formattedDate
    }

    if (this._boundInput) {
      this._boundInput.value = selectedDates.join(',')
      this._syncBoundInput()
    }

    if (this._displayElement) {
      this._displayElement.textContent = formattedDate
    }
  }

  protected _resolvePositionElement(): HTMLElement {
    let { positionElement } = this._config

    if (typeof positionElement === 'string') {
      positionElement = document.querySelector<HTMLElement>(positionElement)
    }

    // Use input's parent if in form-adorn
    if (!positionElement && this._isInput && !this._isInline) {
      const parent = this._element.closest<HTMLElement>('.form-adorn')
      if (parent) {
        positionElement = parent
      }
    }

    return positionElement || this._element
  }

  protected _resolveDisplayElement(): HTMLElement | false | null {
    const { displayElement } = this._config

    if (typeof displayElement === 'string') {
      return document.querySelector<HTMLElement>(displayElement)
    }

    // For buttons/non-inputs (not inline), look for a [data-bs-datepicker-display] child
    if (displayElement === true || (displayElement === null && !this._isInput && !this._isInline)) {
      const displayChild = this._element.querySelector<HTMLElement>('[data-bs-datepicker-display]')
      return displayChild || this._element
    }

    return displayElement
  }

  protected _getThemeAncestor(): Element | null {
    return this._element.closest('[data-bs-theme]')
  }

  protected _getEffectiveTheme(): string | null {
    return this._config.datepickerTheme || this._getThemeAncestor()?.getAttribute('data-bs-theme') || null
  }

  protected _syncThemeAttribute(element: HTMLElement | undefined): void {
    if (!element) {
      return
    }

    const theme = this._getEffectiveTheme()
    if (theme) {
      element.setAttribute('data-bs-theme', theme)
    } else {
      element.removeAttribute('data-bs-theme')
    }

    const computed = getComputedStyle(this._element)
    element.dir = computed.direction
    const explicit = this._config.datepickerTheme
    element.style.colorScheme = explicit === 'auto' ? 'light dark' : (explicit === 'light' || explicit === 'dark' ? explicit : computed.colorScheme)
    if (!this._isInline) {
      for (const prefix of ['', 'bs-']) {
        for (const role of ['base', 'bg', 'bg-subtle', 'bg-muted', 'fg', 'fg-emphasis', 'contrast', 'border', 'focus-ring']) {
          const property = `--${prefix}theme-${role}`
          const value = computed.getPropertyValue(property)
          if (value) {
            element.style.setProperty(property, value)
          } else {
            element.style.removeProperty(property)
          }
        }
      }
    }
  }

  protected _setupThemeObserver(): void {
    this._themeObserver = new MutationObserver(records => {
      const affectsTrigger = records.some(record => {
        if (!(record.target instanceof Element)) {
          return false
        }

        let node: Node | null = this._element
        while (node) {
          if (record.target.contains(node)) {
            return true
          }

          const root = node.getRootNode()
          node = root instanceof ShadowRoot ? root.host : null
        }

        return false
      })
      if (affectsTrigger) {
        this._syncThemeAttribute(this._popup ?? undefined)
      }
    })
    const root = this._element.getRootNode()
    const options = { subtree: true, attributes: true, attributeFilter: ['data-bs-theme', 'class', 'style', 'dir'] }
    this._themeObserver.observe(document.documentElement, options)
    if (root instanceof ShadowRoot) {
      this._themeObserver.observe(root, options)
    }
  }

  protected _setupDismiss(): void {
    if (this._isInline) {
      return
    }

    this._onTriggerClick = () => {
      if (this._isInput) {
        this.show()
      } else if (this._element.dataset.bsToggle !== NAME) {
        this.toggle()
      }
    }

    EventHandler.on(this._positionElement, EVENT_CLICK, this._onTriggerClick)
    if (this._isInput) {
      EventHandler.on(this._element, EVENT_FOCUSIN, () => this.show())
    }

    this._onOutside = event => {
      if (!this._isShown) {
        return
      }

      const inside = event.composedPath().some(node => node instanceof Node && (
        this._positionElement.contains(node) || this._element.contains(node) || this._popup?.contains(node)
      ))
      if (!inside) {
        this.hide()
      }
    }

    EventHandler.on(document, EVENT_FOCUSIN, this._onOutside)
    EventHandler.on(document, EVENT_POINTERDOWN, this._onOutside)
    this._onKeydown = event => this._handleKeydown(event as KeyboardEvent)
    EventHandler.on(this._element, EVENT_KEYDOWN, this._onKeydown)
    EventHandler.on(this._popup!, EVENT_KEYDOWN, this._onKeydown)
  }

  protected _focusTrigger(): void {
    this._suppressFocus = true
    this._element.focus()
    this._suppressFocus = false
  }

  protected _handleKeydown(event: KeyboardEvent): void {
    const { target } = event
    if (!this._isShown || !(target instanceof Node) || (!this._positionElement.contains(target) && !this._element.contains(target) && !this._popup?.contains(target))) {
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      this.hide()
      if (!this._isShown) {
        this._focusTrigger()
      }

      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const controls = [...this._popup!.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      element => element.tabIndex >= 0 && !isDisabled(element) && isVisible(element)
    )
    if (this._positionElement.contains(target) || this._element.contains(target)) {
      if (!event.shiftKey && controls[0]) {
        event.preventDefault()
        controls[0].focus()
      } else {
        this.hide()
      }

      return
    }

    const boundary = event.shiftKey ? controls[0] : controls.at(-1)
    if (target === boundary) {
      this.hide()
      if (this._isShown) {
        event.preventDefault()
      } else {
        this._focusTrigger()
        if (event.shiftKey) {
          event.preventDefault()
        }
      }
    }
  }

  protected _buildCalendarOptions(): Options {
    // Get theme for VCP - use 'system' for auto-detection if no explicit theme
    const theme = this._getEffectiveTheme()
    // VCP uses 'system' for auto, Bootstrap uses 'auto'
    const vcpTheme = !theme || theme === 'auto' ? 'system' : theme

    const calendarOptions: Options = {
      ...this._config.vcpOptions,
      // Vanilla Calendar Pro v3.4+ ships optional features as extensions. Bootstrap
      // supports only `months`, which `displayMonthsCount` needs.
      extensions: [months],
      inputMode: false,
      positionToInput: this._config.placement,
      firstWeekday: this._config.firstWeekday,
      locale: this._config.locale,
      selectionDatesMode: this._config.selectionMode,
      selectedDates: this._config.selectedDates,
      displayMonthsCount: this._config.displayMonthsCount,
      type: this._config.displayMonthsCount > 1 ? 'multiple' : 'default',
      selectedTheme: vcpTheme,
      themeAttrDetect: '[data-bs-theme]',
      onClickDate: (self, event) => this._handleDateClick(self, event),
      onInit: self => this._syncPopupState(self),
      onUpdate: self => this._syncPopupState(self)
    }

    // Navigate to the month of the first selected date
    if (this._config.selectedDates.length > 0) {
      const firstDate = this._parseIsoDate(this._config.selectedDates[0])
      if (!firstDate) {
        throw new TypeError('Invalid ISO date')
      }

      // `getMonth()` is always 0-11, which TypeScript cannot narrow on its own
      calendarOptions.selectedMonth = firstDate.getMonth() as Range<12>
      calendarOptions.selectedYear = firstDate.getFullYear()
    }

    if (this._config.dateMin) {
      calendarOptions.dateMin = this._config.dateMin
    }

    if (this._config.dateMax) {
      calendarOptions.dateMax = this._config.dateMax
    }

    return calendarOptions
  }

  protected _handleDateClick(self: Calendar, event: MouseEvent): void {
    const selectedDates = [...self.context.selectedDates]
    this._syncSelectedDates(selectedDates)

    EventHandler.trigger(this._element, EVENT_CHANGE, {
      dates: selectedDates,
      event
    })

    if (this._calendar && this._element) {
      this._maybeHideAfterSelection(selectedDates)
    }
  }

  protected _maybeHideAfterSelection(selectedDates: string[]): void {
    if (this._isInline) {
      return
    }

    const shouldHide =
      (this._config.selectionMode === 'single' && selectedDates.length > 0) || (this._config.selectionMode === 'multiple-ranged' && selectedDates.length >= 2)

    if (shouldHide) {
      clearTimeout(this._hideTimeout ?? undefined)
      this._hideTimeout = setTimeout(() => {
        this._hideTimeout = null
        this.hide()
      }, HIDE_DELAY)
    }
  }

  protected _parseIsoDate(value: string): Date | null {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!parts) {
      return null
    }

    const year = Number(parts[1])
    const month = Number(parts[2]) - 1
    const day = Number(parts[3])
    const date = new Date(0)
    date.setHours(0, 0, 0, 0)
    date.setFullYear(year, month, day)
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null
  }

  protected _parseDate(value: string): Date {
    return this._parseIsoDate(value) ?? new Date(Number.NaN)
  }

  protected _toIsoDate(date: Date): string {
    return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  protected _formatDate(dateStr: string): string {
    const date = this._parseDate(dateStr)
    const locale = this._config.locale === 'default' ? undefined : this._config.locale
    const { dateFormat } = this._config

    // Custom function formatter
    if (typeof dateFormat === 'function') {
      return dateFormat(date, locale)
    }

    // Intl.DateTimeFormat options object
    if (dateFormat && typeof dateFormat === 'object') {
      return new Intl.DateTimeFormat(locale, dateFormat).format(date)
    }

    // Default: locale-aware formatting
    return date.toLocaleDateString(locale)
  }

  protected _formatDateForInput(dates: string[]): string {
    if (dates.length === 0) {
      return ''
    }

    if (dates.length === 1) {
      return this._formatDate(dates[0])
    }

    // For date ranges, use en-dash; for multiple dates, use comma
    const separator = this._config.selectionMode === 'multiple-ranged' ? ' – ' : ', '
    return dates.map(d => this._formatDate(d)).join(separator)
  }

  protected _parseInputValue(): void {
    const value = this._element.value.trim()
    let date = this._parseIsoDate(value)
    // Only recognize numeric strings that round-trip through our own formatter.
    // Intl is not a general parser, and custom formatters need canonical input.
    if (!date && !/^\d{4}-/.test(value) && typeof this._config.dateFormat !== 'function') {
      const numbers = value.match(/\d+/g)
      const locale = this._config.locale === 'default' ? undefined : this._config.locale
      const order = new Intl.DateTimeFormat(locale, this._config.dateFormat ?? undefined)
        .formatToParts(new Date(2000, 0, 1))
        .filter(part => ['year', 'month', 'day'].includes(part.type))
      if (numbers?.length === 3 && order.length === 3) {
        const parts = Object.fromEntries(order.map((part, index) => [part.type, numbers[index]]))
        if (parts.year.length === 4) {
          const iso = `${parts.year}-${parts.month.padStart(2, '0')}-${parts.day.padStart(2, '0')}`
          const candidate = this._parseIsoDate(iso)
          if (candidate && this._formatDate(iso) === value) {
            date = candidate
          }
        }
      }
    }

    const dates = date ? [this._toIsoDate(date)] : []
    this._calendar?.set({
      selectedDates: dates,
      ...(date ? { selectedMonth: date.getMonth() as Range<12>, selectedYear: date.getFullYear() } : {})
    })
    if (this._boundInput) {
      this._boundInput.value = dates.join(',')
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  // Only handle if not an input (inputs use focus)
  // Skip inline datepickers (they're always visible)
  if (this.tagName === 'INPUT' || this.dataset.bsInline === 'true') {
    return
  }

  event.preventDefault()
  Datepicker.getOrCreateInstance(this).toggle()
})

EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE, function () {
  // Handle focus for input elements
  if (this.tagName !== 'INPUT') {
    return
  }

  Datepicker.getOrCreateInstance(this).show()
})

// Auto-initialize datepickers that need to render on load:
// - inline datepickers (always visible)
// - datepickers with preselected dates (so the value populates without focus)
onDocumentReady(`DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
  const selector = `${SELECTOR_DATA_TOGGLE}[data-bs-inline="true"], ${SELECTOR_DATA_TOGGLE}[data-bs-selected-dates]`
  for (const element of document.querySelectorAll(selector)) {
    Datepicker.getOrCreateInstance(element)
  }
})

export default Datepicker
export type { DatepickerConfig }
