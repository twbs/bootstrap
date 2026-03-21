/**
 * --------------------------------------------------------------------------
 * Bootstrap combobox.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import Menu from './menu.js'
import { getNextActiveElement, isDisabled, isVisible } from './util/index.js'

/**
 * Constants
 */

const NAME = 'combobox'
const DATA_KEY = 'bs.combobox'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const ESCAPE_KEY = 'Escape'
const TAB_KEY = 'Tab'
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'
const HOME_KEY = 'Home'
const END_KEY = 'End'
const ENTER_KEY = 'Enter'
const SPACE_KEY = ' '

const EVENT_CHANGE = `change${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SELECTED = 'selected'
const CLASS_NAME_PLACEHOLDER = 'combobox-placeholder'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="combobox"]'
const SELECTOR_MENU = '.menu'
const SELECTOR_MENU_ITEM = '.menu-item[data-bs-value]'
const SELECTOR_VISIBLE_ITEMS = '.menu-item[data-bs-value]:not(.disabled):not(:disabled)'
const SELECTOR_VALUE = '.combobox-value'
const SELECTOR_SEARCH_INPUT = '.combobox-search-input'
const SELECTOR_NO_RESULTS = '.combobox-no-results'

const Default = {
  boundary: 'clippingParents',
  multiple: false,
  name: null,
  offset: [0, 2],
  placeholder: '',
  placement: 'bottom-start',
  search: false,
  searchNormalize: false
}

const DefaultType = {
  boundary: '(string|element)',
  multiple: 'boolean',
  name: '(string|null)',
  offset: '(array|string|function)',
  placeholder: 'string',
  placement: 'string',
  search: 'boolean',
  searchNormalize: 'boolean'
}

/**
 * Class definition
 */

class Combobox extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._toggle = this._element
    this._menu = SelectorEngine.next(this._toggle, SELECTOR_MENU)[0]
    this._valueDisplay = SelectorEngine.findOne(SELECTOR_VALUE, this._toggle)
    this._searchInput = SelectorEngine.findOne(SELECTOR_SEARCH_INPUT, this._menu)
    this._noResults = SelectorEngine.findOne(SELECTOR_NO_RESULTS, this._menu)
    this._hiddenInput = null
    this._menuInstance = null

    this._createHiddenInput()
    this._createMenuInstance()
    this._syncInitialSelection()
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
  toggle() {
    return this._isShown() ? this.hide() : this.show()
  }

  show() {
    if (isDisabled(this._toggle) || this._isShown()) {
      return
    }

    const showEvent = EventHandler.trigger(this._toggle, EVENT_SHOW)
    if (showEvent.defaultPrevented) {
      return
    }

    this._menuInstance.show()

    if (this._searchInput) {
      this._searchInput.value = ''
      this._filterItems('')
      requestAnimationFrame(() => this._searchInput.focus())
    }

    EventHandler.trigger(this._toggle, EVENT_SHOWN)
  }

  hide() {
    if (!this._isShown()) {
      return
    }

    const hideEvent = EventHandler.trigger(this._toggle, EVENT_HIDE)
    if (hideEvent.defaultPrevented) {
      return
    }

    this._menuInstance.hide()
    EventHandler.trigger(this._toggle, EVENT_HIDDEN)
  }

  dispose() {
    if (this._menuInstance) {
      this._menuInstance.dispose()
      this._menuInstance = null
    }

    if (this._hiddenInput) {
      this._hiddenInput.remove()
      this._hiddenInput = null
    }

    EventHandler.off(this._menu, EVENT_KEY)
    EventHandler.off(this._toggle, EVENT_KEY)

    super.dispose()
  }

  // Private
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW)
  }

  _createHiddenInput() {
    const { name } = this._config
    if (!name) {
      return
    }

    this._hiddenInput = document.createElement('input')
    this._hiddenInput.type = 'hidden'
    this._hiddenInput.name = name
    this._hiddenInput.value = ''
    this._toggle.parentNode.insertBefore(this._hiddenInput, this._toggle)
  }

  _createMenuInstance() {
    this._menuInstance = new Menu(this._toggle, {
      menu: this._menu,
      autoClose: this._config.multiple ? 'outside' : true,
      boundary: this._config.boundary,
      offset: this._config.offset,
      placement: this._config.placement
    })
  }

  _syncInitialSelection() {
    const selectedItems = this._getSelectedItems()
    if (selectedItems.length > 0) {
      this._updateToggleText()
      this._updateHiddenInput()
    } else {
      this._showPlaceholder()
    }
  }

  _addEventListeners() {
    EventHandler.on(this._menu, 'click', SELECTOR_MENU_ITEM, event => {
      const item = event.target.closest(SELECTOR_MENU_ITEM)
      if (!item || isDisabled(item)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      this._selectItem(item)
    })

    EventHandler.on(this._toggle, 'keydown', event => {
      this._handleToggleKeydown(event)
    })

    EventHandler.on(this._menu, 'keydown', event => {
      this._handleMenuKeydown(event)
    })

    if (this._searchInput) {
      EventHandler.on(this._searchInput, 'input', () => {
        this._filterItems(this._searchInput.value)
      })

      EventHandler.on(this._searchInput, 'keydown', event => {
        if (event.key === ARROW_DOWN_KEY) {
          event.preventDefault()
          const items = this._getVisibleItems()
          if (items.length > 0) {
            items[0].focus()
          }
        }

        if (event.key === ESCAPE_KEY) {
          this.hide()
          this._toggle.focus()
        }
      })
    }
  }

  _selectItem(item) {
    if (this._config.multiple) {
      item.classList.toggle(CLASS_NAME_SELECTED)
      item.setAttribute('aria-selected', item.classList.contains(CLASS_NAME_SELECTED))
    } else {
      const previouslySelected = SelectorEngine.find(`.${CLASS_NAME_SELECTED}`, this._menu)
      for (const prev of previouslySelected) {
        prev.classList.remove(CLASS_NAME_SELECTED)
        prev.setAttribute('aria-selected', 'false')
      }

      item.classList.add(CLASS_NAME_SELECTED)
      item.setAttribute('aria-selected', 'true')
    }

    this._updateToggleText()
    this._updateHiddenInput()

    const value = this._config.multiple ?
      this._getSelectedItems().map(el => el.dataset.bsValue) :
      item.dataset.bsValue

    EventHandler.trigger(this._toggle, EVENT_CHANGE, {
      value,
      item
    })

    if (!this._config.multiple) {
      this.hide()
      this._toggle.focus()
    }
  }

  _updateToggleText() {
    const selectedItems = this._getSelectedItems()

    if (selectedItems.length === 0) {
      this._showPlaceholder()
      return
    }

    this._valueDisplay.classList.remove(CLASS_NAME_PLACEHOLDER)

    if (this._config.multiple && selectedItems.length > 1) {
      this._valueDisplay.textContent = `${selectedItems.length} selected`
    } else {
      const item = selectedItems[0]
      const label = SelectorEngine.findOne('.menu-item-content > span:first-child', item)
      this._valueDisplay.textContent = label ? label.textContent : item.textContent.trim()
    }
  }

  _showPlaceholder() {
    const { placeholder } = this._config
    if (placeholder) {
      this._valueDisplay.textContent = placeholder
      this._valueDisplay.classList.add(CLASS_NAME_PLACEHOLDER)
    }
  }

  _updateHiddenInput() {
    if (!this._hiddenInput) {
      return
    }

    const selectedItems = this._getSelectedItems()
    const values = selectedItems.map(el => el.dataset.bsValue)
    this._hiddenInput.value = this._config.multiple ? values.join(',') : (values[0] || '')
  }

  _getSelectedItems() {
    return SelectorEngine.find(`.${CLASS_NAME_SELECTED}`, this._menu)
  }

  _getVisibleItems() {
    return SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu)
      .filter(item => isVisible(item))
  }

  _filterItems(query) {
    const normalizedQuery = this._normalizeText(query.toLowerCase().trim())
    const items = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)
    let visibleCount = 0

    for (const item of items) {
      const text = this._normalizeText(item.textContent.toLowerCase().trim())
      const matches = !normalizedQuery || text.includes(normalizedQuery)
      item.style.display = matches ? '' : 'none'
      if (matches) {
        visibleCount++
      }
    }

    if (this._noResults) {
      this._noResults.classList.toggle('d-none', visibleCount > 0)
    }
  }

  _normalizeText(text) {
    if (this._config.searchNormalize) {
      return text.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
    }

    return text
  }

  _handleToggleKeydown(event) {
    const { key } = event

    if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) {
      event.preventDefault()
      if (!this._isShown()) {
        this.show()
      }

      const items = this._getVisibleItems()
      if (items.length > 0) {
        const target = key === ARROW_DOWN_KEY ? items[0] : items[items.length - 1]
        target.focus()
      }

      return
    }

    if ((key === ENTER_KEY || key === SPACE_KEY) && !this._isShown()) {
      event.preventDefault()
      this.show()
    }
  }

  _handleMenuKeydown(event) {
    const { key, target } = event

    if (key === ESCAPE_KEY) {
      event.preventDefault()
      event.stopPropagation()
      this.hide()
      this._toggle.focus()
      return
    }

    if (key === TAB_KEY) {
      this.hide()
      return
    }

    const isInput = target.matches('input')

    if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) {
      event.preventDefault()
      const items = this._getVisibleItems()
      if (items.length > 0) {
        getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus()
      }

      return
    }

    if (key === HOME_KEY || key === END_KEY) {
      event.preventDefault()
      const items = this._getVisibleItems()
      if (items.length > 0) {
        const targetItem = key === HOME_KEY ? items[0] : items[items.length - 1]
        targetItem.focus()
      }

      return
    }

    if ((key === ENTER_KEY || key === SPACE_KEY) && !isInput) {
      event.preventDefault()
      const item = target.closest(SELECTOR_MENU_ITEM)
      if (item && !isDisabled(item)) {
        this._selectItem(item)
      }
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Combobox.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config]()
    })
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()
  Combobox.getOrCreateInstance(this).toggle()
})

EventHandler.on(document, 'DOMContentLoaded', () => {
  for (const toggle of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
    Combobox.getOrCreateInstance(toggle)
  }
})

export default Combobox
