/**
 * --------------------------------------------------------------------------
 * Bootstrap combobox.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler, { type BootstrapEvent } from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import Menu from './menu.js'
import { onDocumentReady } from './util/component-functions.js'
import type { ComponentConfig } from './util/config.js'
import type { FloatingOffsetOption } from './util/floating-ui.js'
import {
  getElement, getNextActiveElement, isDisabled, isVisible, setAriaAttribute
} from './util/index.js'

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

type ComboboxConfig = {
  boundary: string | Element
  input: string | HTMLInputElement | null
  multiple: boolean
  name: string | null
  offset: FloatingOffsetOption
  placeholder: string
  placement: string
  search: boolean
  searchNormalize: boolean
}

const Default: ComboboxConfig = {
  boundary: 'clippingParents',
  input: null,
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
  input: '(null|element)',
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
  protected declare _config: ComboboxConfig
  protected declare _toggle: HTMLElement
  protected declare _menu: HTMLElement
  protected declare _valueDisplay: HTMLElement
  protected declare _searchInput: HTMLInputElement | null
  protected declare _noResults: HTMLElement | null
  protected declare _hiddenInput: HTMLInputElement | null
  protected declare _menuInstance: Menu | null
  protected declare _ownsInput: boolean
  protected declare _inputDisabled: boolean
  protected declare _extraInputs: HTMLInputElement[]
  protected declare _initialSelection: HTMLElement[]
  protected declare _form: HTMLFormElement | null
  protected declare _formObserver: MutationObserver
  protected declare _submitHandler: () => void
  protected declare _resetHandler: (event: BootstrapEvent) => void
  protected declare _menuEventHandlers: Map<string, (event: BootstrapEvent) => void>
  protected declare _changeId: number

  constructor(element?: string | Element | null, config?: Partial<ComboboxConfig> | null) {
    super(element, config)

    this._toggle = this._element
    this._menu = SelectorEngine.next(this._toggle, SELECTOR_MENU)[0] as HTMLElement
    this._valueDisplay = SelectorEngine.findOne(SELECTOR_VALUE, this._toggle)!
    this._searchInput = SelectorEngine.findOne<HTMLInputElement>(SELECTOR_SEARCH_INPUT, this._menu)
    this._noResults = SelectorEngine.findOne(SELECTOR_NO_RESULTS, this._menu)
    this._hiddenInput = null
    this._menuInstance = null
    this._ownsInput = false
    this._inputDisabled = false
    this._extraInputs = []
    this._initialSelection = this._getSelectedItems()
    this._form = null
    this._menuEventHandlers = new Map()
    this._changeId = 0
    this._formObserver = new MutationObserver(records => {
      this._readInputDisabled(records)
      this.update()
    })
    this._submitHandler = () => this.update()
    this._resetHandler = event => {
      // Wait until listeners can cancel the reset and the browser restores fields.
      queueMicrotask(() => {
        if (!this._element || event.defaultPrevented || event.target !== this._form) {
          return
        }

        const selected = new Set(this._initialSelection)
        for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
          item.classList.toggle(CLASS_NAME_SELECTED, selected.has(item))
          setAriaAttribute(item, 'aria-selected', selected.has(item))
        }

        this.update()
      })
    }

    this._createHiddenInput()
    this._createMenuInstance()
    this.update()
    this._addEventListeners()
  }

  // Getters
  static override get Default(): ComboboxConfig {
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
    return this._isShown() ? this.hide() : this.show()
  }

  async show(): Promise<void> {
    if (isDisabled(this._toggle) || this._toggle.matches(':disabled') || this._isShown()) {
      return
    }

    await this._menuInstance!.show()
  }

  async hide(): Promise<void> {
    await this._menuInstance!.hide()
  }

  update(): void {
    this._changeId++
    this._readInputDisabled(this._formObserver.takeRecords())
    this._updateToggleText()
    this._updateHiddenInput()
    this._observeFormState()
  }

  override dispose(): void {
    this._readInputDisabled(this._formObserver.takeRecords())
    this._formObserver.disconnect()
    EventHandler.off(this._form, `reset${EVENT_KEY}`, this._resetHandler)
    EventHandler.off(this._form, `submit${EVENT_KEY}`, this._submitHandler)

    for (const [event, handler] of this._menuEventHandlers) {
      EventHandler.off(this._toggle, event, handler)
    }

    this._removeExtraInputs()
    if (this._hiddenInput && !this._ownsInput) {
      this._hiddenInput.disabled = this._inputDisabled
    }

    if (this._menuInstance) {
      this._menuInstance.dispose()
      this._menuInstance = null
    }

    if (this._hiddenInput && this._ownsInput) {
      this._hiddenInput.remove()
      this._hiddenInput = null
    }

    EventHandler.off(this._menu, EVENT_KEY)
    EventHandler.off(this._toggle, EVENT_KEY)
    EventHandler.off(this._searchInput, EVENT_KEY)

    super.dispose()
  }

  // Private
  protected _isShown(): boolean {
    return this._menu.classList.contains(CLASS_NAME_SHOW)
  }

  protected override _configAfterMerge(config: ComponentConfig): ComponentConfig {
    if (config.input !== null) {
      const input = getElement(config.input)
      if (!(input instanceof HTMLInputElement) || input.type !== 'hidden') {
        throw new TypeError('COMBOBOX: Option "input" must reference a hidden input.')
      }

      config.input = input
    }

    return config
  }

  protected _createHiddenInput(): void {
    if (this._config.input) {
      this._hiddenInput = this._config.input as HTMLInputElement
      this._inputDisabled = this._hiddenInput.disabled
      return
    }

    if (!this._config.name) {
      return
    }

    this._hiddenInput = document.createElement('input')
    this._hiddenInput.type = 'hidden'
    this._hiddenInput.name = this._config.name
    this._toggle.before(this._hiddenInput)
    this._ownsInput = true
  }

  protected _removeExtraInputs(): void {
    for (const input of this._extraInputs) {
      input.remove()
    }

    this._extraInputs = []
  }

  protected _readInputDisabled(records: MutationRecord[]): void {
    if (!this._ownsInput && records.some(record => record.target === this._hiddenInput && record.attributeName === 'disabled')) {
      this._inputDisabled = this._hiddenInput!.disabled
    }
  }

  protected _observeFormState(): void {
    this._formObserver.disconnect()
    this._formObserver.observe(this._toggle, { attributes: true, attributeFilter: ['disabled', 'class', 'form'] })
    if (this._hiddenInput) {
      this._formObserver.observe(this._hiddenInput, { attributes: true, attributeFilter: ['disabled', 'name', 'form'] })
    }

    // Watch only relevant fieldset ancestors, not every mutation in the document.
    const fieldsets = new Set<Element>()
    for (const element of [this._toggle, this._hiddenInput]) {
      for (let parent = element?.parentElement; parent; parent = parent.parentElement) {
        if (parent.matches('fieldset')) {
          fieldsets.add(parent)
        }
      }
    }

    for (const fieldset of fieldsets) {
      this._formObserver.observe(fieldset, { attributes: true, attributeFilter: ['disabled'] })
    }

    const form = this._hiddenInput ? this._hiddenInput.form : this._toggle.closest<HTMLFormElement>('form')
    if (form !== this._form) {
      EventHandler.off(this._form, `reset${EVENT_KEY}`, this._resetHandler)
      EventHandler.off(this._form, `submit${EVENT_KEY}`, this._submitHandler)
      this._form = form
      EventHandler.on(this._form, `reset${EVENT_KEY}`, this._resetHandler)
      EventHandler.on(this._form, `submit${EVENT_KEY}`, this._submitHandler)
    }
  }

  protected _createMenuInstance(): void {
    this._menuInstance = new Menu(this._toggle, {
      menu: this._menu,
      autoClose: this._config.multiple ? 'outside' : true,
      boundary: this._config.boundary,
      offset: this._config.offset,
      placement: this._config.placement
    })
  }

  protected _addEventListeners(): void {
    // Menu owns transitions and also handles outside clicks and delegated keys.
    for (const type of ['show', 'shown', 'hide', 'hidden']) {
      const event = Menu.eventName(type)
      const handler = (menuEvent: BootstrapEvent) => {
        if (!this._element) {
          return
        }

        if (type === 'shown' && document.activeElement === this._toggle) {
          this._searchInput?.focus()
        }

        const forwarded = EventHandler.trigger(this._toggle, this.constructor.eventName(type))
        if (forwarded?.defaultPrevented || !this._element) {
          menuEvent.preventDefault()
          return
        }

        if (type === 'show' && !menuEvent.defaultPrevented && this._searchInput) {
          this._searchInput.value = ''
          this._filterItems('')
        }
      }

      this._menuEventHandlers.set(event, handler)
      EventHandler.on(this._toggle, event, handler)
    }

    EventHandler.on(this._menu, `click${EVENT_KEY}`, SELECTOR_MENU_ITEM, event => {
      const item = (event.target as Element).closest<HTMLElement>(SELECTOR_MENU_ITEM)
      if (!item || isDisabled(item)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      this._selectItem(item)
    })

    EventHandler.on(this._toggle, `keydown${EVENT_KEY}`, event => {
      this._handleToggleKeydown(event)
    })

    EventHandler.on(this._menu, `keydown${EVENT_KEY}`, event => {
      this._handleMenuKeydown(event)
    })

    if (this._searchInput) {
      EventHandler.on(this._searchInput, `input${EVENT_KEY}`, () => {
        this._filterItems(this._searchInput!.value)
      })

      EventHandler.on(this._searchInput, `keydown${EVENT_KEY}`, event => {
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

  protected _selectItem(item: HTMLElement): void {
    if (isDisabled(this._toggle) || this._toggle.matches(':disabled') || isDisabled(item)) {
      return
    }

    const previous = this._getSelectedItems()
    if (!this._config.multiple && previous.length === 1 && previous[0] === item) {
      return
    }

    if (this._config.multiple) {
      item.classList.toggle(CLASS_NAME_SELECTED)
      setAriaAttribute(item, 'aria-selected', item.classList.contains(CLASS_NAME_SELECTED))
    } else {
      for (const selected of previous) {
        selected.classList.remove(CLASS_NAME_SELECTED)
        selected.setAttribute('aria-selected', 'false')
      }

      item.classList.add(CLASS_NAME_SELECTED)
      item.setAttribute('aria-selected', 'true')
    }

    this.update()
    const changeId = this._changeId
    const { multiple } = this._config
    const value = multiple ? this._getSelectedItems().map(element => element.dataset.bsValue) : item.dataset.bsValue
    const target = this._hiddenInput ?? this._toggle

    for (const event of ['input', 'change']) {
      EventHandler.trigger(target, event)
      if (!this._element || changeId !== this._changeId) {
        return
      }
    }

    EventHandler.trigger(this._toggle, EVENT_CHANGE, { value, item })
    if (!this._element || changeId !== this._changeId) {
      return
    }

    if (!multiple) {
      this.hide()
      this._toggle.focus()
    }
  }

  protected _updateToggleText(): void {
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
      this._valueDisplay.textContent = label ? label.textContent : item.textContent!.trim()
    }
  }

  protected _showPlaceholder(): void {
    const { placeholder } = this._config
    this._valueDisplay.textContent = placeholder
    this._valueDisplay.classList.toggle(CLASS_NAME_PLACEHOLDER, Boolean(placeholder))
  }

  protected _updateHiddenInput(): void {
    const input = this._hiddenInput
    if (!input) {
      return
    }

    const values = this._getSelectedItems()
      .filter(item => !isDisabled(item))
      .map(item => item.dataset.bsValue ?? '')
    const submittedValues = this._config.multiple ? values : [values[0] ?? '']
    const disabled = this._inputDisabled || isDisabled(this._toggle) || this._toggle.matches(':disabled')

    if (this._ownsInput) {
      const fields = [input, ...this._extraInputs]
      if (fields.at(-1)!.nextElementSibling !== this._toggle) {
        for (const field of fields) {
          this._toggle.before(field)
        }
      }

      const form = this._toggle.getAttribute('form')
      if (form === null) {
        input.removeAttribute('form')
      } else {
        input.setAttribute('form', form)
      }
    }

    input.value = submittedValues[0] ?? ''
    input.disabled = disabled || submittedValues.length === 0

    for (let index = 1; index < submittedValues.length; index++) {
      let extra = this._extraInputs[index - 1]
      if (!extra) {
        extra = document.createElement('input')
        extra.type = 'hidden'
        this._extraInputs.push(extra)
      }

      const previous = this._extraInputs[index - 2] ?? input
      if (!previous.parentNode) {
        extra.remove()
      } else if (extra.previousElementSibling !== previous) {
        previous.after(extra)
      }

      extra.name = input.name
      extra.value = submittedValues[index]
      extra.disabled = disabled
      const form = input.getAttribute('form')
      if (form === null) {
        extra.removeAttribute('form')
      } else {
        extra.setAttribute('form', form)
      }
    }

    for (const extra of this._extraInputs.splice(Math.max(0, submittedValues.length - 1))) {
      extra.remove()
    }

    // Discard our own disabled/form/name writes before observing caller changes.
    this._formObserver.takeRecords()
  }

  protected _getSelectedItems(): HTMLElement[] {
    return SelectorEngine.find(`${SELECTOR_MENU_ITEM}.${CLASS_NAME_SELECTED}`, this._menu)
  }

  protected _getVisibleItems(): HTMLElement[] {
    return SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu)
      .filter(item => isVisible(item))
  }

  protected _filterItems(query: string): void {
    const normalizedQuery = this._normalizeText(query.toLowerCase().trim())
    const items = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)
    let visibleCount = 0

    for (const item of items) {
      const text = this._normalizeText(item.textContent!.toLowerCase().trim())
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

  protected _normalizeText(text: string): string {
    if (this._config.searchNormalize) {
      return text.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
    }

    return text
  }

  protected _handleToggleKeydown(event: BootstrapEvent): void {
    const { key } = event

    if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) {
      event.preventDefault()
      if (!this._isShown()) {
        this.show()
      }

      const items = this._getVisibleItems()
      if (items.length > 0) {
        const target = key === ARROW_DOWN_KEY ? items[0] : items.at(-1)!
        target.focus()
      }

      return
    }

    if ((key === ENTER_KEY || key === SPACE_KEY) && !this._isShown()) {
      event.preventDefault()
      this.show()
    }
  }

  protected _handleMenuKeydown(event: BootstrapEvent): void {
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

    const isInput = (target as Element).matches('input')

    if (key === ARROW_DOWN_KEY || key === ARROW_UP_KEY) {
      event.preventDefault()
      const items = this._getVisibleItems()
      if (items.length > 0) {
        getNextActiveElement(items, target as HTMLElement, key === ARROW_DOWN_KEY, !items.includes(target as HTMLElement)).focus()
      }

      return
    }

    if ((key === HOME_KEY || key === END_KEY) && !isInput) {
      event.preventDefault()
      const items = this._getVisibleItems()
      if (items.length > 0) {
        const targetItem = key === HOME_KEY ? items[0] : items.at(-1)!
        targetItem.focus()
      }

      return
    }

    if ((key === ENTER_KEY || key === SPACE_KEY) && !isInput) {
      event.preventDefault()
      const item = (target as Element).closest<HTMLElement>(SELECTOR_MENU_ITEM)
      if (item && !isDisabled(item)) {
        this._selectItem(item)
      }
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()
  Combobox.getOrCreateInstance(this).toggle()
})

onDocumentReady('DOMContentLoaded', () => {
  for (const toggle of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
    Combobox.getOrCreateInstance(toggle)
  }
})

export default Combobox
export type { ComboboxConfig }
