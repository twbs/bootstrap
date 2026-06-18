/**
 * --------------------------------------------------------------------------
 * Bootstrap range.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'

/**
 * Constants
 */

const NAME = 'range'
const DATA_KEY = 'bs.range'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_CHANGED = `changed${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`
const EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`

// `input` is not in EventHandler's native-event list, so it can't be namespaced; bind it raw
const EVENT_INPUT = 'input'
const EVENT_CHANGE = 'change'

const SELECTOR_DATA_RANGE = '[data-bs-range]'

const CLASS_NAME_ANCHORED = 'range-anchored'
const CLASS_NAME_BUBBLE = 'range-bubble'
const CLASS_NAME_TICKS = 'range-ticks'
const CLASS_NAME_TICK = 'range-tick'
const CLASS_NAME_TICK_LABEL = 'range-tick-label'
const CLASS_NAME_ACTIVE = 'active'

// Shipped (`--bs-`-prefixed) custom properties the SCSS exposes (the build prefixes
// the SCSS tokens, so the plugin must read/write the prefixed names to interoperate)
const PROPERTY_VALUE = '--bs-range-value'
const PROPERTY_THUMB_WIDTH = '--bs-range-thumb-width'
const PROPERTY_FILL_BG = '--bs-range-fill-bg'

const Default = {
  bubble: false, // Show a floating value bubble above the thumb
  ticks: false, // Render tick marks from the input's linked <datalist>
  formatter: null // (value) => string, for bubble + tick label text
}

const DefaultType = {
  bubble: '(boolean|null)',
  ticks: '(boolean|null)',
  formatter: '(function|null)'
}

/**
 * Class definition
 */

class Range extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    // BaseComponent bails (no `_element`) when the element can't be resolved
    if (!this._element) {
      return
    }

    this._bubble = null
    this._ticks = null
    this._updateHandler = () => this._update()
    this._resizeHandler = null

    if (this._config.bubble || this._config.ticks) {
      this._element.parentNode?.classList.add(CLASS_NAME_ANCHORED)
    }

    if (this._config.bubble) {
      this._createBubble()
    }

    if (this._config.ticks) {
      this._createTicks()
    }

    this._addEventListeners()
    this._update()
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
  update() {
    this._update()
  }

  dispose() {
    // These are bound with raw (non-namespaced) types, so remove them explicitly
    EventHandler.off(this._element, EVENT_INPUT, this._updateHandler)
    EventHandler.off(this._element, EVENT_CHANGE, this._updateHandler)

    if (this._resizeHandler) {
      EventHandler.off(window, EVENT_RESIZE, this._resizeHandler)
    }

    const parent = this._element.parentNode

    this._bubble?.remove()
    this._ticks?.remove()

    // Drop the positioning class only if no other range decorations remain
    if (parent && !SelectorEngine.findOne(`.${CLASS_NAME_BUBBLE}, .${CLASS_NAME_TICKS}`, parent)) {
      parent.classList.remove(CLASS_NAME_ANCHORED)
    }

    super.dispose()
  }

  // Private
  _configAfterMerge(config) {
    // A bare `data-bs-bubble` / `data-bs-ticks` attribute normalizes to `null`; treat it as enabled
    for (const key of ['bubble', 'ticks']) {
      if (config[key] === null) {
        config[key] = true
      }
    }

    return config
  }

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_INPUT, this._updateHandler)
    EventHandler.on(this._element, EVENT_CHANGE, this._updateHandler)

    if (this._bubble || this._ticks) {
      this._resizeHandler = () => this._reposition()
      EventHandler.on(window, EVENT_RESIZE, this._resizeHandler)
    }
  }

  _min() {
    return this._element.min === '' ? 0 : Number.parseFloat(this._element.min)
  }

  _max() {
    return this._element.max === '' ? 100 : Number.parseFloat(this._element.max)
  }

  _value() {
    return Number.parseFloat(this._element.value)
  }

  _ratio() {
    const span = this._max() - this._min()
    return span > 0 ? (this._value() - this._min()) / span : 0
  }

  _update() {
    this._element.style.setProperty(PROPERTY_VALUE, `${this._ratio() * 100}%`)
    this._reposition()

    EventHandler.trigger(this._element, EVENT_CHANGED, { value: this._value() })
  }

  _reposition() {
    if (!this._bubble && !this._ticks) {
      return
    }

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = this._element
    const ratio = this._ratio()

    if (this._bubble) {
      this._bubble.textContent = this._format(this._value())
      // Nudge by the thumb width so the bubble tracks the thumb centre, not just the track percentage
      const x = offsetLeft + (ratio * offsetWidth) + ((0.5 - ratio) * this._thumbWidth())
      this._bubble.style.left = `${x}px`
      this._bubble.style.top = `${offsetTop}px`
    }

    if (this._ticks) {
      this._ticks.style.left = `${offsetLeft}px`
      this._ticks.style.top = `${offsetTop + offsetHeight}px`
      this._ticks.style.width = `${offsetWidth}px`

      const value = this._value()
      for (const tick of SelectorEngine.find(`.${CLASS_NAME_TICK}`, this._ticks)) {
        tick.classList.toggle(CLASS_NAME_ACTIVE, Number.parseFloat(tick.dataset.bsValue) <= value)
      }
    }
  }

  _format(value) {
    return typeof this._config.formatter === 'function' ? this._config.formatter(value) : String(value)
  }

  _thumbWidth() {
    const raw = getComputedStyle(this._element).getPropertyValue(PROPERTY_THUMB_WIDTH).trim()

    if (raw.endsWith('rem')) {
      return Number.parseFloat(raw) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    }

    return Number.parseFloat(raw) || 16
  }

  // The bubble and ticks are siblings of the input, so they don't inherit the input's
  // `--bs-range-fill-bg` token. Copy its resolved value over so themed fills propagate.
  _inheritFillColor(element) {
    const fill = getComputedStyle(this._element).getPropertyValue(PROPERTY_FILL_BG).trim()

    if (fill) {
      element.style.setProperty(PROPERTY_FILL_BG, fill)
    }
  }

  _createBubble() {
    this._bubble = document.createElement('span')
    this._bubble.className = CLASS_NAME_BUBBLE
    this._bubble.setAttribute('aria-hidden', 'true')
    this._inheritFillColor(this._bubble)
    this._element.insertAdjacentElement('afterend', this._bubble)
  }

  _createTicks() {
    const listId = this._element.getAttribute('list')
    const datalist = listId ? document.getElementById(listId) : null

    if (!datalist) {
      return
    }

    const min = this._min()
    const span = this._max() - min || 1

    this._ticks = document.createElement('div')
    this._ticks.className = CLASS_NAME_TICKS
    this._ticks.setAttribute('aria-hidden', 'true')
    this._inheritFillColor(this._ticks)

    for (const option of SelectorEngine.find('option', datalist)) {
      const value = Number.parseFloat(option.value)

      if (Number.isNaN(value)) {
        continue
      }

      const tick = document.createElement('span')
      tick.className = CLASS_NAME_TICK
      tick.dataset.bsValue = value
      tick.style.left = `${((value - min) / span) * 100}%`

      const labelText = option.label || option.value
      if (labelText) {
        const label = document.createElement('span')
        label.className = CLASS_NAME_TICK_LABEL
        label.textContent = labelText
        tick.append(label)
      }

      this._ticks.append(tick)
    }

    this._element.insertAdjacentElement('afterend', this._ticks)
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_DOM_CONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_RANGE)) {
    Range.getOrCreateInstance(element)
  }
})

export default Range
