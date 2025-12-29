/**
 * --------------------------------------------------------------------------
 * Bootstrap datepicker.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { Calendar } from 'vanilla-calendar-pro'
import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
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

const Default = {
  dateMin: null,
  dateMax: null,
  dateFormat: null, // Uses locale default if null
  firstWeekday: 1, // Monday
  locale: 'default',
  selectedDates: [],
  selectionMode: 'single', // 'single', 'multiple', 'multiple-ranged'
  showWeekNumbers: false,
  positionToInput: 'auto'
}

const DefaultType = {
  dateMin: '(null|string|number|object)',
  dateMax: '(null|string|number|object)',
  dateFormat: '(null|object)',
  firstWeekday: 'number',
  locale: 'string',
  selectedDates: 'array',
  selectionMode: 'string',
  showWeekNumbers: 'boolean',
  positionToInput: 'string'
}

/**
 * Class definition
 */

class Datepicker extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._calendar = null
    this._isShown = false
    this._cleanupFn = null

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
    return this._isShown ? this.hide() : this.show()
  }

  show() {
    if (isDisabled(this._element) || this._isShown) {
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
    if (!this._isShown) {
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
    if (this._cleanupFn) {
      this._cleanupFn()
    }

    this._calendar = null
    super.dispose()
  }

  getSelectedDates() {
    return this._calendar ? [...this._calendar.context.selectedDates] : []
  }

  setSelectedDates(dates) {
    if (this._calendar) {
      this._calendar.set({ selectedDates: dates })
    }
  }

  // Private
  _initCalendar() {
    const isInput = this._element.tagName === 'INPUT'

    const calendarOptions = {
      inputMode: isInput,
      positionToInput: this._config.positionToInput,
      firstWeekday: this._config.firstWeekday,
      locale: this._config.locale,
      enableWeekNumbers: this._config.showWeekNumbers,
      selectionDatesMode: this._config.selectionMode,
      selectedDates: this._config.selectedDates,
      selectedTheme: 'system',
      themeAttrDetect: 'data-bs-theme'
    }

    if (this._config.dateMin) {
      calendarOptions.dateMin = this._config.dateMin
    }

    if (this._config.dateMax) {
      calendarOptions.dateMax = this._config.dateMax
    }

    // Handle date selection
    calendarOptions.onClickDate = (self, event) => {
      const selectedDates = [...self.context.selectedDates]

      if (isInput && selectedDates.length > 0) {
        // Format date for input
        const formattedDate = this._formatDateForInput(selectedDates)
        this._element.value = formattedDate
      }

      EventHandler.trigger(this._element, EVENT_CHANGE, {
        dates: selectedDates,
        event
      })

      // Auto-hide after selection in single mode
      if (this._config.selectionMode === 'single' && selectedDates.length > 0) {
        // Small delay to allow the UI to update
        setTimeout(() => this.hide(), 100)
      }
    }

    calendarOptions.onShow = () => {
      this._isShown = true
    }

    calendarOptions.onHide = () => {
      this._isShown = false
    }

    this._calendar = new Calendar(this._element, calendarOptions)
    this._cleanupFn = this._calendar.init()

    // Set initial value if input has a value
    if (isInput && this._element.value) {
      this._parseInputValue()
    }
  }

  _formatDateForInput(dates) {
    if (dates.length === 0) {
      return ''
    }

    if (this._config.dateFormat) {
      // Custom formatting could be added here
      return dates.join(', ')
    }

    // Default: locale-aware formatting
    const formatDate = dateStr => {
      const [year, month, day] = dateStr.split('-')
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString(this._config.locale === 'default' ? undefined : this._config.locale)
    }

    if (dates.length === 1) {
      return formatDate(dates[0])
    }

    return dates.map(d => formatDate(d)).join(', ')
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
  if (this.tagName === 'INPUT') {
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

// Close on outside click
EventHandler.on(document, 'click', event => {
  const openDatepickers = SelectorEngine.find(SELECTOR_DATA_TOGGLE)
  for (const element of openDatepickers) {
    const instance = Datepicker.getInstance(element)
    if (!instance || !instance._isShown) {
      continue
    }

    // Check if click is outside the element and calendar
    const calendarEl = instance._calendar?.context?.mainElement
    if (
      !element.contains(event.target) &&
      (!calendarEl || !calendarEl.contains(event.target))
    ) {
      instance.hide()
    }
  }
})

export default Datepicker
