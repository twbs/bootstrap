/**
 * --------------------------------------------------------------------------
 * Bootstrap chip-input.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'

/**
 * Constants
 */

const NAME = 'chipInput'
const DATA_KEY = 'bs.chip-input'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_ADD = `add${EVENT_KEY}`
const EVENT_REMOVE = `remove${EVENT_KEY}`
const EVENT_CHANGE = `change${EVENT_KEY}`
const EVENT_SELECT = `select${EVENT_KEY}`

const SELECTOR_DATA_CHIP_INPUT = '[data-bs-chip-input]'
const SELECTOR_GHOST_INPUT = '.form-ghost'
const SELECTOR_CHIP = '.chip'
const SELECTOR_CHIP_DISMISS = '.chip-dismiss'

const CLASS_NAME_CHIP = 'chip'
const CLASS_NAME_CHIP_DISMISS = 'chip-dismiss'
const CLASS_NAME_ACTIVE = 'active'

const DEFAULT_DISMISS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>`

const Default = {
  separator: ',',
  allowDuplicates: false,
  maxChips: null,
  placeholder: '',
  dismissible: true,
  dismissIcon: DEFAULT_DISMISS_ICON,
  createOnBlur: true
}

const DefaultType = {
  separator: '(string|null)',
  allowDuplicates: 'boolean',
  maxChips: '(number|null)',
  placeholder: 'string',
  dismissible: 'boolean',
  dismissIcon: 'string',
  createOnBlur: 'boolean'
}

/**
 * Class definition
 */

class ChipInput extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._input = SelectorEngine.findOne(SELECTOR_GHOST_INPUT, this._element)
    this._chips = []
    this._selectedChips = new Set()
    this._anchorChip = null // For shift+click range selection

    if (!this._input) {
      this._createInput()
    }

    this._initializeExistingChips()
    this._addEventListeners()
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
  add(value) {
    const trimmedValue = String(value).trim()

    if (!trimmedValue) {
      return null
    }

    // Check for duplicates
    if (!this._config.allowDuplicates && this._chips.includes(trimmedValue)) {
      return null
    }

    // Check max chips limit
    if (this._config.maxChips !== null && this._chips.length >= this._config.maxChips) {
      return null
    }

    const addEvent = EventHandler.trigger(this._element, EVENT_ADD, {
      value: trimmedValue,
      relatedTarget: this._input
    })

    if (addEvent.defaultPrevented) {
      return null
    }

    const chip = this._createChip(trimmedValue)
    this._element.insertBefore(chip, this._input)
    this._chips.push(trimmedValue)

    EventHandler.trigger(this._element, EVENT_CHANGE, {
      values: this.getValues()
    })

    return chip
  }

  remove(chipOrValue) {
    let chip
    let value

    if (typeof chipOrValue === 'string') {
      value = chipOrValue
      chip = this._findChipByValue(value)
    } else {
      chip = chipOrValue
      value = this._getChipValue(chip)
    }

    if (!chip || !value) {
      return false
    }

    const removeEvent = EventHandler.trigger(this._element, EVENT_REMOVE, {
      value,
      chip,
      relatedTarget: this._input
    })

    if (removeEvent.defaultPrevented) {
      return false
    }

    // Remove from selection
    this._selectedChips.delete(chip)
    if (this._anchorChip === chip) {
      this._anchorChip = null
    }

    // Remove from DOM and array
    chip.remove()
    this._chips = this._chips.filter(v => v !== value)

    EventHandler.trigger(this._element, EVENT_CHANGE, {
      values: this.getValues()
    })

    return true
  }

  removeSelected() {
    const chipsToRemove = [...this._selectedChips]
    for (const chip of chipsToRemove) {
      this.remove(chip)
    }

    this._input?.focus()
  }

  getValues() {
    return [...this._chips]
  }

  getSelectedValues() {
    return [...this._selectedChips].map(chip => this._getChipValue(chip))
  }

  clear() {
    const chips = SelectorEngine.find(SELECTOR_CHIP, this._element)
    for (const chip of chips) {
      chip.remove()
    }

    this._chips = []
    this._selectedChips.clear()
    this._anchorChip = null

    EventHandler.trigger(this._element, EVENT_CHANGE, {
      values: []
    })
  }

  clearSelection() {
    for (const chip of this._selectedChips) {
      chip.classList.remove(CLASS_NAME_ACTIVE)
    }

    this._selectedChips.clear()
    this._anchorChip = null

    EventHandler.trigger(this._element, EVENT_SELECT, {
      selected: []
    })
  }

  selectChip(chip, options = {}) {
    const { addToSelection = false, rangeSelect = false } = options
    const chipElements = this._getChipElements()

    if (!chipElements.includes(chip)) {
      return
    }

    if (rangeSelect && this._anchorChip) {
      // Range selection from anchor to chip
      const anchorIndex = chipElements.indexOf(this._anchorChip)
      const chipIndex = chipElements.indexOf(chip)
      const start = Math.min(anchorIndex, chipIndex)
      const end = Math.max(anchorIndex, chipIndex)

      if (!addToSelection) {
        this.clearSelection()
      }

      for (let i = start; i <= end; i++) {
        this._selectedChips.add(chipElements[i])
        chipElements[i].classList.add(CLASS_NAME_ACTIVE)
      }
    } else if (addToSelection) {
      // Toggle selection
      if (this._selectedChips.has(chip)) {
        this._selectedChips.delete(chip)
        chip.classList.remove(CLASS_NAME_ACTIVE)
      } else {
        this._selectedChips.add(chip)
        chip.classList.add(CLASS_NAME_ACTIVE)
        this._anchorChip = chip
      }
    } else {
      // Single selection
      this.clearSelection()
      this._selectedChips.add(chip)
      chip.classList.add(CLASS_NAME_ACTIVE)
      this._anchorChip = chip
    }

    EventHandler.trigger(this._element, EVENT_SELECT, {
      selected: this.getSelectedValues()
    })
  }

  focus() {
    this._input?.focus()
  }

  // Private
  _getChipElements() {
    return SelectorEngine.find(SELECTOR_CHIP, this._element)
  }

  _createInput() {
    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-ghost'
    if (this._config.placeholder) {
      input.placeholder = this._config.placeholder
    }

    this._element.append(input)
    this._input = input
  }

  _initializeExistingChips() {
    const existingChips = SelectorEngine.find(SELECTOR_CHIP, this._element)
    for (const chip of existingChips) {
      const value = this._getChipValue(chip)
      if (value) {
        this._chips.push(value)
        this._setupChip(chip)
      }
    }
  }

  _setupChip(chip) {
    // Make chip focusable
    chip.setAttribute('tabindex', '0')

    // Add dismiss button if needed
    if (this._config.dismissible && !SelectorEngine.findOne(SELECTOR_CHIP_DISMISS, chip)) {
      chip.append(this._createDismissButton())
    }
  }

  _createChip(value) {
    const chip = document.createElement('span')
    chip.className = CLASS_NAME_CHIP
    chip.dataset.bsChipValue = value

    // Add text node
    chip.append(document.createTextNode(value))

    // Setup chip (tabindex, dismiss button)
    this._setupChip(chip)

    return chip
  }

  _createDismissButton() {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = CLASS_NAME_CHIP_DISMISS
    button.setAttribute('aria-label', 'Remove')
    button.setAttribute('tabindex', '-1') // Not in tab order, chips handle keyboard
    button.innerHTML = this._config.dismissIcon
    return button
  }

  _findChipByValue(value) {
    const chips = this._getChipElements()
    return chips.find(chip => this._getChipValue(chip) === value)
  }

  _getChipValue(chip) {
    if (chip.dataset.bsChipValue) {
      return chip.dataset.bsChipValue
    }

    const clone = chip.cloneNode(true)
    const dismiss = SelectorEngine.findOne(SELECTOR_CHIP_DISMISS, clone)
    if (dismiss) {
      dismiss.remove()
    }

    return clone.textContent?.trim() || ''
  }

  _addEventListeners() {
    // Input events
    EventHandler.on(this._input, 'keydown', event => this._handleInputKeydown(event))
    EventHandler.on(this._input, 'input', event => this._handleInput(event))
    EventHandler.on(this._input, 'paste', event => this._handlePaste(event))
    EventHandler.on(this._input, 'focus', () => this.clearSelection())

    if (this._config.createOnBlur) {
      EventHandler.on(this._input, 'blur', event => {
        // Don't create chip if clicking on a chip
        if (!event.relatedTarget?.closest(SELECTOR_CHIP)) {
          this._createChipFromInput()
        }
      })
    }

    // Chip click events (delegated)
    EventHandler.on(this._element, 'click', SELECTOR_CHIP, event => {
      // Ignore clicks on dismiss button
      if (event.target.closest(SELECTOR_CHIP_DISMISS)) {
        return
      }

      const chip = event.target.closest(SELECTOR_CHIP)
      if (chip) {
        event.preventDefault()
        this.selectChip(chip, {
          addToSelection: event.metaKey || event.ctrlKey,
          rangeSelect: event.shiftKey
        })
        chip.focus()
      }
    })

    // Dismiss button clicks (delegated)
    EventHandler.on(this._element, 'click', SELECTOR_CHIP_DISMISS, event => {
      event.stopPropagation()
      const chip = event.target.closest(SELECTOR_CHIP)
      if (chip) {
        this.remove(chip)
        this._input?.focus()
      }
    })

    // Chip keyboard events (delegated)
    EventHandler.on(this._element, 'keydown', SELECTOR_CHIP, event => {
      this._handleChipKeydown(event)
    })

    // Focus input when clicking container background
    EventHandler.on(this._element, 'click', event => {
      if (event.target === this._element) {
        this.clearSelection()
        this._input?.focus()
      }
    })
  }

  _handleInputKeydown(event) {
    const { key } = event

    switch (key) {
      case 'Enter': {
        event.preventDefault()
        this._createChipFromInput()
        break
      }

      case 'Backspace':
      case 'Delete': {
        if (this._input.value === '') {
          event.preventDefault()
          const chips = this._getChipElements()

          if (chips.length > 0) {
            // Select last chip and focus it
            const lastChip = chips.at(-1)
            this.selectChip(lastChip)
            lastChip.focus()
          }
        }

        break
      }

      case 'ArrowLeft': {
        if (this._input.selectionStart === 0 && this._input.selectionEnd === 0) {
          event.preventDefault()
          const chips = this._getChipElements()
          if (chips.length > 0) {
            const lastChip = chips.at(-1)
            if (event.shiftKey) {
              this.selectChip(lastChip, { addToSelection: true })
            } else {
              this.selectChip(lastChip)
            }

            lastChip.focus()
          }
        }

        break
      }

      case 'Escape': {
        this._input.value = ''
        this.clearSelection()
        this._input.blur()
        break
      }

      // No default
    }
  }

  _handleChipKeydown(event) {
    const { key } = event
    const chip = event.target.closest(SELECTOR_CHIP)
    if (!chip) {
      return
    }

    const chips = this._getChipElements()
    const currentIndex = chips.indexOf(chip)

    switch (key) {
      case 'Backspace':
      case 'Delete': {
        event.preventDefault()
        if (this._selectedChips.size > 0) {
          // Remove all selected chips
          const nextIndex = Math.min(currentIndex, chips.length - this._selectedChips.size - 1)
          this.removeSelected()

          // Focus next chip or input
          const remainingChips = this._getChipElements()
          if (remainingChips.length > 0) {
            const focusIndex = Math.max(0, Math.min(nextIndex, remainingChips.length - 1))
            remainingChips[focusIndex].focus()
            this.selectChip(remainingChips[focusIndex])
          } else {
            this._input?.focus()
          }
        }

        break
      }

      case 'ArrowLeft': {
        event.preventDefault()
        if (currentIndex > 0) {
          const prevChip = chips[currentIndex - 1]
          if (event.shiftKey) {
            this.selectChip(prevChip, { addToSelection: true, rangeSelect: true })
          } else {
            this.selectChip(prevChip)
          }

          prevChip.focus()
        }

        break
      }

      case 'ArrowRight': {
        event.preventDefault()
        if (currentIndex < chips.length - 1) {
          const nextChip = chips[currentIndex + 1]
          if (event.shiftKey) {
            this.selectChip(nextChip, { addToSelection: true, rangeSelect: true })
          } else {
            this.selectChip(nextChip)
          }

          nextChip.focus()
        } else {
          // At the last chip, move to input
          this.clearSelection()
          this._input?.focus()
        }

        break
      }

      case 'Home': {
        event.preventDefault()
        if (chips.length > 0) {
          const firstChip = chips[0]
          if (event.shiftKey) {
            this.selectChip(firstChip, { rangeSelect: true })
          } else {
            this.selectChip(firstChip)
          }

          firstChip.focus()
        }

        break
      }

      case 'End': {
        event.preventDefault()
        this.clearSelection()
        this._input?.focus()
        break
      }

      case 'a': {
        // Cmd/Ctrl+A to select all chips
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault()
          for (const c of chips) {
            this._selectedChips.add(c)
            c.classList.add(CLASS_NAME_ACTIVE)
          }

          EventHandler.trigger(this._element, EVENT_SELECT, {
            selected: this.getSelectedValues()
          })
        }

        break
      }

      case 'Escape': {
        event.preventDefault()
        this.clearSelection()
        this._input?.focus()
        break
      }

      // No default
    }
  }

  _handleInput(event) {
    const { value } = event.target
    const { separator } = this._config

    if (separator && value.includes(separator)) {
      const parts = value.split(separator)
      for (const part of parts.slice(0, -1)) {
        this.add(part.trim())
      }

      this._input.value = parts.at(-1)
    }
  }

  _handlePaste(event) {
    const { separator } = this._config
    if (!separator) {
      return
    }

    const pastedData = (event.clipboardData || window.clipboardData).getData('text')
    if (pastedData.includes(separator)) {
      event.preventDefault()

      const parts = pastedData.split(separator)
      for (const part of parts) {
        this.add(part.trim())
      }
    }
  }

  _createChipFromInput() {
    const value = this._input.value.trim()
    if (value) {
      this.add(value)
      this._input.value = ''
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_CHIP_INPUT)) {
    ChipInput.getOrCreateInstance(element)
  }
})

export default ChipInput
