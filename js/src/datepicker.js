/**
 * --------------------------------------------------------------------------
 * Bootstrap datepicker.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { Calendar } from 'vanilla-calendar-pro'
import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import { isDisabled } from './util/index.js'

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
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="datepicker"]'

const HIDE_DELAY = 100 // ms delay before hiding after selection

const Default = {
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

/**
 * Class definition
 */

class Datepicker extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._calendar = null
    this._isShown = false

    this._initCalendar()
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
  toggle() {
    if (this._config.inline) {
      return // Inline calendars are always visible
    }

    return this._isShown ? this.hide() : this.show()
  }

  show() {
    if (this._config.inline) {
      return // Inline calendars are always visible
    }

    if (!this._calendar || isDisabled(this._element) || this._isShown) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW)
    if (showEvent.defaultPrevented) {
      return
    }

    this._calendar.show()
    this._isShown = true

    EventHandler.trigger(this._element, EVENT_SHOWN)
  }

  hide() {
    if (this._config.inline) {
      return // Inline calendars are always visible
    }

    if (!this._calendar || !this._isShown) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)
    if (hideEvent.defaultPrevented) {
      return
    }

    this._calendar.hide()
    this._isShown = false

    EventHandler.trigger(this._element, EVENT_HIDDEN)
  }

  dispose() {
    if (this._themeObserver) {
      this._themeObserver.disconnect()
      this._themeObserver = null
    }

    if (this._calendar) {
      this._calendar.destroy()
    }

    this._calendar = null
    super.dispose()
  }

  getSelectedDates() {
    const dates = this._calendar?.context?.selectedDates
    return dates ? [...dates] : []
  }

  setSelectedDates(dates) {
    if (this._calendar) {
      this._calendar.set({ selectedDates: dates })
    }
  }

  // Private
  _initCalendar() {
    this._isInput = this._element.tagName === 'INPUT'
    this._isInline = this._config.inline

    // For inline mode, look for a hidden input child to bind to
    if (this._isInline && !this._isInput) {
      this._boundInput = this._element.querySelector('input[type="hidden"], input[name]')
    }

    this._positionElement = this._resolvePositionElement()
    this._displayElement = this._resolveDisplayElement()

    const calendarOptions = this._buildCalendarOptions()

    // Create calendar on the position element (for correct popup positioning)
    // but value updates still go to this._element (the input)
    this._calendar = new Calendar(this._positionElement, calendarOptions)
    this._calendar.init()

    // Watch for theme changes on ancestor elements (for live theme switching)
    this._setupThemeObserver()

    // Set initial value if input has a value
    if (this._isInput && this._element.value) {
      this._parseInputValue()
    }

    // Populate input/display with preselected dates
    this._updateDisplayWithSelectedDates()
  }

  _updateDisplayWithSelectedDates() {
    const { selectedDates } = this._config
    if (!selectedDates || selectedDates.length === 0) {
      return
    }

    const formattedDate = this._formatDateForInput(selectedDates)

    if (this._isInput) {
      this._element.value = formattedDate
    }

    if (this._boundInput) {
      this._boundInput.value = selectedDates.join(',')
    }

    if (this._displayElement) {
      this._displayElement.textContent = formattedDate
    }
  }

  _resolvePositionElement() {
    let { positionElement } = this._config

    if (typeof positionElement === 'string') {
      positionElement = document.querySelector(positionElement)
    }

    // Use input's parent if in form-adorn
    if (!positionElement && this._isInput && !this._isInline) {
      const parent = this._element.closest('.form-adorn')
      if (parent) {
        positionElement = parent
      }
    }

    return positionElement || this._element
  }

  _resolveDisplayElement() {
    const { displayElement } = this._config

    if (typeof displayElement === 'string') {
      return document.querySelector(displayElement)
    }

    // For buttons/non-inputs (not inline), look for a [data-bs-datepicker-display] child
    if (displayElement === true || (displayElement === null && !this._isInput && !this._isInline)) {
      const displayChild = this._element.querySelector('[data-bs-datepicker-display]')
      return displayChild || this._element
    }

    return displayElement
  }

  _getThemeAncestor() {
    return this._element.closest('[data-bs-theme]')
  }

  _getEffectiveTheme() {
    // Priority: explicit datepickerTheme config > inherited from ancestor > none
    const { datepickerTheme } = this._config
    if (datepickerTheme) {
      return datepickerTheme
    }

    const ancestor = this._getThemeAncestor()
    return ancestor?.getAttribute('data-bs-theme') || null
  }

  _syncThemeAttribute(element) {
    if (!element) {
      return
    }

    const theme = this._getEffectiveTheme()

    if (theme) {
      // Copy theme to popover (needed because VCP appends to body, breaking CSS inheritance)
      element.setAttribute('data-bs-theme', theme)
    } else {
      // No theme - remove attribute to allow natural inheritance
      element.removeAttribute('data-bs-theme')
    }
  }

  _setupThemeObserver() {
    // Watch for theme changes on ancestor elements
    const ancestor = this._getThemeAncestor()
    if (!ancestor || this._config.datepickerTheme) {
      // No ancestor to watch, or explicit datepickerTheme overrides
      return
    }

    this._themeObserver = new MutationObserver(() => {
      this._syncThemeAttribute(this._calendar?.context?.mainElement)
    })

    this._themeObserver.observe(ancestor, {
      attributes: true,
      attributeFilter: ['data-bs-theme']
    })
  }

  _buildCalendarOptions() {
    // Get theme for VCP - use 'system' for auto-detection if no explicit theme
    const theme = this._getEffectiveTheme()
    // VCP uses 'system' for auto, Bootstrap uses 'auto'
    const vcpTheme = !theme || theme === 'auto' ? 'system' : theme

    const calendarOptions = {
      ...this._config.vcpOptions,
      inputMode: !this._isInline,
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
      onInit: self => {
        this._syncThemeAttribute(self.context.mainElement)
      },
      onShow: () => {
        this._isShown = true
        this._syncThemeAttribute(this._calendar.context.mainElement)
      },
      onHide: () => {
        this._isShown = false
      }
    }

    // Navigate to the month of the first selected date
    if (this._config.selectedDates.length > 0) {
      const firstDate = this._parseDate(this._config.selectedDates[0])
      calendarOptions.selectedMonth = firstDate.getMonth()
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

  _handleDateClick(self, event) {
    const selectedDates = [...self.context.selectedDates]

    if (selectedDates.length > 0) {
      const formattedDate = this._formatDateForInput(selectedDates)

      if (this._isInput) {
        this._element.value = formattedDate
      }

      if (this._boundInput) {
        this._boundInput.value = selectedDates.join(',')
      }

      if (this._displayElement) {
        this._displayElement.textContent = formattedDate
      }
    }

    EventHandler.trigger(this._element, EVENT_CHANGE, {
      dates: selectedDates,
      event
    })

    this._maybeHideAfterSelection(selectedDates)
  }

  _maybeHideAfterSelection(selectedDates) {
    if (this._isInline) {
      return
    }

    const shouldHide =
      (this._config.selectionMode === 'single' && selectedDates.length > 0) ||
      (this._config.selectionMode === 'multiple-ranged' && selectedDates.length >= 2)

    if (shouldHide) {
      setTimeout(() => this.hide(), HIDE_DELAY)
    }
  }

  _parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-')
    return new Date(year, month - 1, day)
  }

  _formatDate(dateStr) {
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

  _formatDateForInput(dates) {
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

  _parseInputValue() {
    // Try to parse the input value as a date
    const value = this._element.value.trim()
    if (!value) {
      return
    }

    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}`
      this._calendar.set({ selectedDates: [formatted] })
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

// Auto-initialize inline datepickers on DOMContentLoaded
EventHandler.on(document, `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
  for (const element of document.querySelectorAll(`${SELECTOR_DATA_TOGGLE}[data-bs-inline="true"]`)) {
    Datepicker.getOrCreateInstance(element)
  }
})

export default Datepicker
