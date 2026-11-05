/**
 * --------------------------------------------------------------------------
 * Bootstrap color-picker.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler, { type BootstrapEvent } from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import Menu from './menu.js'
import {
  CHROMA_REFERENCE, FORMATS, PALETTE, THEME_COLORS,
  clampToGamut, contrastColor, detectFormat, formatColor, isColorFormat,
  parseColor, resolveColor, type ColorFormat, type Oklch
} from './util/color.js'
import type { ComponentConfig } from './util/config.js'
import type { FloatingOffsetOption } from './util/floating-ui.js'
import {
  getElement, getUID, isDisabled, parseSelector, setAriaAttribute
} from './util/index.js'

/**
 * Constants
 */

const NAME = 'colorPicker'
const DATA_KEY = 'bs.colorPicker'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const ESCAPE_KEY = 'Escape'
const TAB_KEY = 'Tab'
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'
const ARROW_LEFT_KEY = 'ArrowLeft'
const ARROW_RIGHT_KEY = 'ArrowRight'
const HOME_KEY = 'Home'
const END_KEY = 'End'
const PAGE_UP_KEY = 'PageUp'
const PAGE_DOWN_KEY = 'PageDown'
const ENTER_KEY = 'Enter'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CHANGED = `changed${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`

// `input` is not in EventHandler's native-event list, so it can't be namespaced —
// `input.bs.colorPicker` would register as a literal custom type and never hear a
// real `input`. Bind it raw, as `Range` does, and unbind it by reference.
const EVENT_INPUT = 'input'

// `change` is in that list, so namespacing works for listening. It's still
// dispatched raw, because `EventHandler.trigger` would emit the full literal
// string. The rich payload rides on `changed.bs.colorPicker` instead.
const EVENT_CHANGE = 'change'

const CLASS_NAME_SELECTED = 'selected'

const SELECTOR_DATA_PICKER = '[data-bs-color-picker]'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="color-picker"]'
const SELECTOR_WRAPPER = '.color-picker'
const SELECTOR_PREVIEW = '.color-picker-preview'

// Shipped (`--bs-`-prefixed) custom properties. The build prefixes the SCSS tokens,
// so the plugin has to write the prefixed names to interoperate with the CSS.
const PROPERTY_VALUE = '--bs-color-picker-value'
const PROPERTY_HUE = '--bs-color-picker-hue'
const PROPERTY_AREA_X = '--bs-color-picker-area-x'
const PROPERTY_AREA_Y = '--bs-color-picker-area-y'
const PROPERTY_SWATCH_VALUE = '--bs-color-picker-swatch-value'

// Matches `--color-picker-max-chroma`. The plane's x axis spans 0 to this.
const MAX_CHROMA = 0.37

const AREA_STEP = 0.02
const AREA_STEP_COARSE = 0.1

const DEFAULT_COLOR: Oklch = {
  l: 0, c: 0, h: 0, alpha: 1
}

type ColorPickerSwatch = string | { value: string, label?: string }

type ColorPickerConfig = {
  alpha: boolean
  area: boolean
  boundary: string | Element
  closeOnSelect: boolean
  container: string | Element | boolean
  eyedropper: boolean
  format: ColorFormat | null
  formats: ColorFormat[]
  offset: FloatingOffsetOption
  placement: string
  swatches: string | ColorPickerSwatch[] | boolean
  swatchStops: number[]
  validate: boolean
}

const Default: ColorPickerConfig = {
  alpha: false, // Show the alpha slider and emit alpha in the output
  area: true, // Show the chroma/lightness plane
  boundary: 'clippingParents',
  closeOnSelect: false, // Close the panel after a swatch is clicked
  container: false,
  eyedropper: true, // Offer the EyeDropper button where the API exists
  format: null, // Output format; `null` infers it from the initial value
  formats: FORMATS,
  offset: [0, 2],
  placement: 'bottom-start',
  swatches: 'theme', // 'theme' | 'palette' | 'datalist' | array | false
  swatchStops: [500], // Palette stops used when `swatches: 'palette'`
  validate: true // Report unparseable text through constraint validation
}

const DefaultType = {
  alpha: 'boolean',
  area: 'boolean',
  boundary: '(string|element)',
  closeOnSelect: 'boolean',
  container: '(string|element|boolean)',
  eyedropper: 'boolean',
  format: '(string|null)',
  formats: 'array',
  offset: '(array|string|function)',
  placement: 'string',
  swatches: '(array|string|boolean)',
  swatchStops: 'array',
  validate: 'boolean'
}

type EyeDropperConstructor = new () => { open: () => Promise<{ sRGBHex: string }> }

/**
 * Class definition
 */

class ColorPicker extends BaseComponent {
  protected declare _config: ColorPickerConfig
  protected declare _input: HTMLInputElement
  protected declare _wrapper: HTMLElement | null
  protected declare _trigger: HTMLElement
  protected declare _preview: HTMLElement | null
  protected declare _menu: HTMLElement
  protected declare _menuInstance: Menu | null
  protected declare _area: HTMLElement | null
  protected declare _areaThumb: HTMLElement | null
  protected declare _hueInput: HTMLInputElement | null
  protected declare _alphaInput: HTMLInputElement | null
  protected declare _formatSelect: HTMLSelectElement | null
  protected declare _swatchButtons: HTMLElement[]
  protected declare _swatchColors: (Oklch | null)[]
  protected declare _color: Oklch
  protected declare _format: ColorFormat
  protected declare _isNativeColor: boolean
  protected declare _isCommitting: boolean
  protected declare _themeObserver: MutationObserver | null
  protected declare _resetHandler: (() => void) | null
  protected declare _inputHandler: () => void

  constructor(element?: string | Element | null, config?: Partial<ColorPickerConfig> | null) {
    super(element, config)

    // BaseComponent bails (no `_element`) when the element can't be resolved
    if (!this._element) {
      return
    }

    // The value lives on a real input, so `name`, `required`, `form.reset()`,
    // `FormData` and constraint validation all come from the platform
    if (!(this._element instanceof HTMLInputElement)) {
      return
    }

    this._input = this._element
    this._isNativeColor = this._input.type === 'color'
    this._wrapper = this._input.closest<HTMLElement>(SELECTOR_WRAPPER)
    this._preview = this._wrapper ? SelectorEngine.findOne(SELECTOR_PREVIEW, this._wrapper) : null
    this._trigger = this._resolveTrigger()
    this._menuInstance = null
    this._area = null
    this._areaThumb = null
    this._hueInput = null
    this._alphaInput = null
    this._formatSelect = null
    this._swatchButtons = []
    this._swatchColors = []
    this._isCommitting = false
    this._themeObserver = null
    this._resetHandler = null

    this._format = this._resolveInitialFormat()
    this._color = parseColor(this._input.value) ?? resolveColor(this._input.value, this._input) ?? { ...DEFAULT_COLOR }

    this._buildMenu()
    this._createMenuInstance()
    this._addEventListeners()
    this._render()
  }

  // Getters
  static override get Default(): ColorPickerConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  toggle(): void {
    return this._isShown() ? this.hide() : this.show()
  }

  show(): void {
    // A readonly or disabled field has nothing to pick, so don't open over it
    if (this._isShown() || isDisabled(this._input) || this._input.readOnly) {
      return
    }

    const showEvent = EventHandler.trigger(this._input, EVENT_SHOW)
    if (showEvent.defaultPrevented) {
      return
    }

    this._syncTheme()
    this._menuInstance!.show()

    // `Menu` puts `aria-expanded` on its own element. When that's a wrapper or a
    // custom trigger, the input still needs the state, and the caret belongs in
    // the field so typing keeps working.
    if (this._trigger !== this._input) {
      setAriaAttribute(this._input, 'aria-expanded', true)

      if (this._trigger === this._wrapper) {
        this._input.focus()
      }
    }

    // Theme tokens resolve through `light-dark()`, so a color-mode change between
    // opens would leave the cached swatch colors stale
    this._resolveSwatchColors()
    // Positions depend on the panel's measured box, which is only available once
    // it's laid out
    this._renderArea()
    this._renderSwatches()

    EventHandler.trigger(this._input, EVENT_SHOWN)
  }

  hide(): void {
    if (!this._isShown()) {
      return
    }

    const hideEvent = EventHandler.trigger(this._input, EVENT_HIDE)
    if (hideEvent.defaultPrevented) {
      return
    }

    this._menuInstance!.hide()

    if (this._trigger !== this._input) {
      setAriaAttribute(this._input, 'aria-expanded', false)
    }

    EventHandler.trigger(this._input, EVENT_HIDDEN)
  }

  getValue(format?: ColorFormat): string {
    if (format) {
      return formatColor(this._color, format)
    }

    return this._input.value
  }

  setValue(value: string): void {
    const color = resolveColor(value, this._input)

    if (!color) {
      return
    }

    this._color = color
    this._commit()
    this._render()
  }

  update(): void {
    this._syncFromInput()
    this._render()
  }

  override dispose(): void {
    if (this._menuInstance) {
      this._menuInstance.dispose()
      this._menuInstance = null
    }

    this._themeObserver?.disconnect()

    if (this._resetHandler && this._input.form) {
      this._input.form.removeEventListener('reset', this._resetHandler)
    }

    EventHandler.off(this._menu, EVENT_KEY)
    EventHandler.off(this._input, EVENT_KEY)
    EventHandler.off(this._trigger, EVENT_KEY)
    // Raw, so it isn't covered by the namespace sweep above
    EventHandler.off(this._input, EVENT_INPUT, this._inputHandler)

    this._menu.remove()

    // The chip and padding are ours, so leave the input as we found it
    this._input.style.removeProperty(PROPERTY_VALUE)
    this._input.removeAttribute('aria-expanded')
    this._input.removeAttribute('aria-controls')
    this._input.removeAttribute('aria-haspopup')

    super.dispose()
  }

  // Private
  protected override _configAfterMerge(config: ComponentConfig): ComponentConfig {
    // `data-bs-color-picker` is a bare marker, so it merges in as `null`. Harmless,
    // because `_typeCheckConfig()` only walks `DefaultType` keys.
    delete config.colorPicker

    // A `list` attribute is a clear statement of intent, so prefer it over the
    // default theme swatches
    if (config.swatches === 'theme' && this._element?.getAttribute('list')) {
      config.swatches = 'datalist'
    }

    // `input[type="color"]` sanitizes its value to lowercase `#rrggbb`, so no other
    // format or any alpha can survive a round trip through it
    if (this._element instanceof HTMLInputElement && this._element.type === 'color') {
      config.format = 'hex'
      config.formats = ['hex']
      config.alpha = false
    }

    if (Array.isArray(config.formats)) {
      const formats = (config.formats as string[]).filter(format => isColorFormat(format))
      config.formats = formats.length > 0 ? formats : [...FORMATS]
    }

    return config
  }

  protected _resolveTrigger(): HTMLElement {
    const custom = SelectorEngine.find<HTMLElement>(SELECTOR_DATA_TOGGLE)
      .find(toggle => {
        const selector = toggle.dataset.bsTarget
        return Boolean(selector) && SelectorEngine.findOne(parseSelector(selector!)!) === this._input
      })

    return custom ?? this._wrapper ?? this._input
  }

  protected _resolveInitialFormat(): ColorFormat {
    const { format } = this._config

    if (isColorFormat(format)) {
      return format
    }

    // Keep emitting whatever the author authored, so a field that starts as
    // `oklch(...)` isn't silently rewritten to hex on first interaction
    const detected = detectFormat(this._input.value)

    if (detected && this._config.formats.includes(detected)) {
      return detected
    }

    return this._config.formats[0] ?? 'hex'
  }

  protected _isShown(): boolean {
    return this._menu.classList.contains('show')
  }

  /**
   * Markup generation
   */

  protected _buildMenu(): void {
    this._menu = document.createElement('div')
    this._menu.className = 'menu color-picker-menu'
    this._menu.id = getUID('color-picker-')
    // The panel is a stateful surface rather than a list of commands, so `dialog`
    // describes it better than `menu` to assistive tech
    this._menu.setAttribute('role', 'dialog')
    this._menu.setAttribute('aria-label', 'Choose a color')

    if (this._config.area) {
      this._buildArea()
    }

    this._buildSliders()
    this._buildActions()
    this._buildSwatches()

    // Inserted in place, right after the field, so the panel follows it in tab
    // order and inherits the surrounding color mode. `.input-group` already
    // whitelists a trailing `.menu`, so this is safe there too.
    const anchor = this._wrapper ?? this._input
    anchor.insertAdjacentElement('afterend', this._menu)

    this._input.setAttribute('aria-controls', this._menu.id)
    this._input.setAttribute('aria-haspopup', 'dialog')
    setAriaAttribute(this._input, 'aria-expanded', false)
  }

  protected _buildArea(): void {
    this._area = document.createElement('div')
    this._area.className = 'color-picker-area'

    this._areaThumb = document.createElement('div')
    this._areaThumb.className = 'color-picker-area-thumb'
    this._areaThumb.tabIndex = 0
    this._areaThumb.setAttribute('role', 'slider')
    this._areaThumb.setAttribute('aria-label', 'Chroma and lightness')
    this._areaThumb.setAttribute('aria-valuemin', '0')
    this._areaThumb.setAttribute('aria-valuemax', '100')

    this._area.append(this._areaThumb)
    this._menu.append(this._area)
  }

  protected _buildSliders(): void {
    const sliders = document.createElement('div')
    sliders.className = 'color-picker-sliders'

    this._hueInput = this._buildSlider(sliders, 'color-picker-hue', 'Hue', 360, 1)

    if (this._config.alpha) {
      this._alphaInput = this._buildSlider(sliders, 'color-picker-alpha', 'Alpha', 1, 0.01)
    }

    this._menu.append(sliders)
  }

  // Each slider is a real `.form-range`, which brings the thumb, track, keyboard
  // support and `aria-valuenow` with it; only the track ramp is overridden in CSS
  protected _buildSlider(parent: HTMLElement, className: string, label: string, max: number, step: number): HTMLInputElement {
    const wrapper = document.createElement('div')
    wrapper.className = `form-range ${className}`

    const input = document.createElement('input')
    input.type = 'range'
    input.className = 'form-range-input'
    input.min = '0'
    input.max = String(max)
    input.step = String(step)
    input.setAttribute('aria-label', label)

    wrapper.append(input)
    parent.append(wrapper)

    return input
  }

  protected _buildActions(): void {
    const hasFormatSelect = this._config.formats.length > 1
    const hasEyedropper = this._config.eyedropper && 'EyeDropper' in window

    if (!hasFormatSelect && !hasEyedropper) {
      return
    }

    const actions = document.createElement('div')
    actions.className = 'color-picker-actions'

    if (hasFormatSelect) {
      this._formatSelect = document.createElement('select')
      this._formatSelect.className = 'form-control form-control-sm color-picker-format'
      this._formatSelect.setAttribute('aria-label', 'Color format')

      for (const format of this._config.formats) {
        const option = document.createElement('option')
        option.value = format
        option.textContent = format === 'hex' ? 'Hex' : format.toUpperCase()
        this._formatSelect.append(option)
      }

      actions.append(this._formatSelect)
    }

    if (hasEyedropper) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'btn-outline theme-secondary btn-sm btn-icon color-picker-eyedropper'
      button.setAttribute('aria-label', 'Pick a color from the screen')
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708zM2 12.707l7-7L10.293 7l-7 7H2z"/></svg>'

      actions.append(button)
    }

    this._menu.append(actions)
  }

  protected _buildSwatches(): void {
    const swatches = this._resolveSwatches()

    if (swatches.length === 0) {
      return
    }

    const grid = document.createElement('div')
    grid.className = 'color-picker-swatches'
    grid.setAttribute('role', 'group')
    grid.setAttribute('aria-label', 'Color presets')

    for (const swatch of swatches) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'color-picker-swatch'
      button.dataset.bsValue = swatch.value
      button.title = swatch.label ?? swatch.value
      button.setAttribute('aria-label', swatch.label ?? swatch.value)
      setAriaAttribute(button, 'aria-pressed', false)

      grid.append(button)
      this._swatchButtons.push(button)
    }

    this._menu.append(grid)
    this._resolveSwatchColors()
  }

  // Resolving `var(--bs-blue-500)` means a style write plus a `getComputedStyle`
  // per swatch, so it happens once per open rather than on every render — the area
  // drag re-renders on every pointer move.
  protected _resolveSwatchColors(): void {
    this._swatchColors = this._swatchButtons.map(button => {
      const value = button.dataset.bsValue!
      const resolved = resolveColor(value, this._menu)

      // Paint from the resolved color rather than the authored value. A custom
      // property that isn't in scope on the panel would make the whole
      // `background-image` invalid and leave the swatch blank rather than just
      // dropping the color layer.
      button.style.setProperty(PROPERTY_SWATCH_VALUE, resolved ? formatColor(resolved, 'oklch') : value)

      return resolved
    })
  }

  protected _resolveSwatches(): { value: string, label?: string }[] {
    const { swatches, swatchStops } = this._config

    if (swatches === false || swatches === true) {
      return []
    }

    if (Array.isArray(swatches)) {
      return swatches
        .map(swatch => typeof swatch === 'string' ? { value: swatch } : swatch)
        .filter(swatch => swatch?.value)
    }

    if (swatches === 'datalist') {
      return this._swatchesFromDatalist()
    }

    if (swatches === 'palette') {
      const stops = swatchStops.length > 0 ? swatchStops : [500]

      return PALETTE.flatMap(name => stops.map(stop => ({
        value: `var(--bs-${name}-${stop})`,
        label: `${name} ${stop}`
      })))
    }

    if (swatches === 'theme') {
      return THEME_COLORS.map(name => ({
        value: `var(--bs-${name}-bg)`,
        label: name
      }))
    }

    return []
  }

  // Mirrors `Range._createTicks()`, which also sources from the input's `list`.
  // Declarative swatches stay server-renderable and keep meaning for a native
  // color input.
  protected _swatchesFromDatalist(): { value: string, label?: string }[] {
    const listId = this._input.getAttribute('list')
    const datalist = listId ? document.getElementById(listId) : null

    if (!datalist) {
      return []
    }

    return SelectorEngine.find<HTMLOptionElement>('option', datalist)
      .filter(option => option.value !== '')
      .map(option => ({ value: option.value, label: option.label || undefined }))
  }

  /**
   * Menu composition
   */

  // The trigger, not the input, is handed to `Menu`. `Menu.clearMenus()` only
  // exempts clicks on the menu and on the menu's own element, so a custom trigger
  // would otherwise open the panel and be dismissed by the same click.
  protected _createMenuInstance(): void {
    this._menuInstance = new Menu(this._trigger, {
      menu: this._menu,
      // Clicks land on the panel's own inputs, so it must never self-dismiss
      autoClose: 'outside',
      boundary: this._config.boundary,
      container: this._config.container,
      offset: this._config.offset,
      placement: this._config.placement,
      reference: this._trigger
    })
  }

  // Only needed when `container` moves the panel out of the field's subtree, where
  // it would otherwise render in the page's color mode instead of the field's
  protected _syncTheme(): void {
    if (!this._config.container) {
      return
    }

    const theme = this._input.closest('[data-bs-theme]')?.getAttribute('data-bs-theme')

    if (theme) {
      this._menu.setAttribute('data-bs-theme', theme)
    } else {
      this._menu.removeAttribute('data-bs-theme')
    }
  }

  /**
   * Rendering
   */

  protected _render(): void {
    // OKLCH so alpha and out-of-gamut colors survive the hand-off to CSS
    const value = formatColor(this._color, 'oklch')

    for (const host of [this._input, this._menu, this._wrapper, this._preview]) {
      host?.style.setProperty(PROPERTY_VALUE, value)
    }

    this._menu.style.setProperty(PROPERTY_HUE, `${this._color.h}deg`)

    if (this._hueInput) {
      this._hueInput.value = String(Math.round(this._color.h))
    }

    if (this._alphaInput) {
      this._alphaInput.value = String(this._color.alpha)
    }

    if (this._formatSelect) {
      this._formatSelect.value = this._format
    }

    this._renderArea()
    this._renderSwatches()
  }

  protected _renderArea(): void {
    if (!this._area || !this._areaThumb) {
      return
    }

    const x = Math.min(this._color.c / MAX_CHROMA, 1)
    const y = 1 - this._color.l

    this._area.style.setProperty(PROPERTY_AREA_X, String(x))
    this._area.style.setProperty(PROPERTY_AREA_Y, String(y))

    const chroma = Math.round((this._color.c / CHROMA_REFERENCE) * 100)
    const lightness = Math.round(this._color.l * 100)

    this._areaThumb.setAttribute('aria-valuenow', String(chroma))
    this._areaThumb.setAttribute('aria-valuetext', `Chroma ${chroma}%, lightness ${lightness}%`)
    // Keeps the focus ring readable against whatever is underneath it
    this._areaThumb.style.setProperty('--bs-focus-ring-color', contrastColor(this._color))
  }

  protected _renderSwatches(): void {
    if (this._swatchButtons.length === 0) {
      return
    }

    const current = formatColor(clampToGamut(this._color), 'hex')

    for (const [index, button] of this._swatchButtons.entries()) {
      const resolved = this._swatchColors[index]
      const isSelected = Boolean(resolved) && formatColor(clampToGamut(resolved!), 'hex') === current

      button.classList.toggle(CLASS_NAME_SELECTED, isSelected)
      setAriaAttribute(button, 'aria-pressed', isSelected)
    }
  }

  /**
   * Value plumbing
   */

  // Writes the model back to the input and announces it. Native `input` and
  // `change` are what form libraries, `FormData` and framework bindings listen for.
  //
  // `isFinal` follows the native range contract: `input` streams during a drag,
  // `change` fires once the interaction settles.
  protected _commit(isFinal = true): void {
    const value = formatColor(this._color, this._format)

    // The guard has to cover the dispatches, not just the assignment. Our own
    // `input` listener would otherwise re-parse the rounded output and write it
    // back over the model, quantizing the color to the output format on every
    // commit — visible as a drag that snaps to 8-bit steps in hex.
    this._isCommitting = true

    try {
      this._input.value = value
      this._setValidity(true)

      this._input.dispatchEvent(new Event(EVENT_INPUT, { bubbles: true }))

      if (isFinal) {
        this._input.dispatchEvent(new Event(EVENT_CHANGE, { bubbles: true }))
      }
    } finally {
      this._isCommitting = false
    }

    EventHandler.trigger(this._input, EVENT_CHANGED, {
      value,
      format: this._format,
      color: { ...this._color }
    })
  }

  protected _setValidity(isValid: boolean): void {
    if (!this._config.validate || typeof this._input.setCustomValidity !== 'function') {
      return
    }

    this._input.setCustomValidity(isValid ? '' : 'Enter a valid CSS color.')
  }

  protected _syncFromInput(): void {
    const color = parseColor(this._input.value) ?? resolveColor(this._input.value, this._input)

    if (color) {
      this._color = color
      this._setValidity(true)
      return
    }

    // An empty field is not an error unless the input is `required`, which the
    // platform already reports
    this._setValidity(this._input.value.trim() === '')
  }

  /**
   * Event listeners
   */

  protected _addEventListeners(): void {
    this._addTriggerListeners()
    this._addInputListeners()
    this._addAreaListeners()
    this._addPanelListeners()
    this._addFormListeners()
  }

  protected _addTriggerListeners(): void {
    // A `data-bs-toggle` element is already wired by the data API below. Binding
    // here too would toggle twice per click and land back where it started.
    if (!this._trigger.matches(SELECTOR_DATA_TOGGLE)) {
      EventHandler.on(this._trigger, `click${EVENT_KEY}`, (event: BootstrapEvent) => {
        // Clicks inside the panel are the panel's business
        if (this._menu.contains(event.target as Node)) {
          return
        }

        if (this._trigger !== this._input) {
          event.preventDefault()
        }

        // Clicking into the text field is how you place the caret, so it opens
        // the panel but never closes it. Only real affordances toggle.
        if (event.target === this._input && !this._isNativeColor) {
          this.show()
          return
        }

        this.toggle()
      })
    }

    if (this._preview) {
      EventHandler.on(this._preview, `click${EVENT_KEY}`, (event: BootstrapEvent) => {
        event.preventDefault()
        event.stopPropagation()
        this.toggle()
      })
    }

    // A native color input would otherwise open the platform dialog on top of ours
    if (this._isNativeColor) {
      EventHandler.on(this._input, `click${EVENT_KEY}`, (event: BootstrapEvent) => {
        event.preventDefault()
      })
    }
  }

  protected _addInputListeners(): void {
    // Typing is first class: parse live so the panel tracks the text, but don't
    // rewrite the text until the user is done, or `oklch(60% 0.2` would be
    // reformatted mid-keystroke
    this._inputHandler = () => {
      if (this._isCommitting) {
        return
      }

      this._syncFromInput()
      this._render()
    }

    EventHandler.on(this._input, EVENT_INPUT, this._inputHandler)

    EventHandler.on(this._input, `blur${EVENT_KEY}`, (event: BootstrapEvent) => {
      // Reaching for a swatch blurs the field. Normalizing here would emit a
      // change for the old value moments before the swatch emits the new one.
      if (this._menu.contains((event as unknown as FocusEvent).relatedTarget as Node)) {
        return
      }

      this._normalize()
    })

    EventHandler.on(this._input, `keydown${EVENT_KEY}`, (event: BootstrapEvent) => {
      if (event.key === ARROW_DOWN_KEY && !this._isShown()) {
        event.preventDefault()
        this.show()
        return
      }

      if (event.key === ENTER_KEY) {
        this._normalize()
        return
      }

      if (event.key === ESCAPE_KEY && this._isShown()) {
        event.preventDefault()
        this.hide()
      }
    })
  }

  // Rewrites the field from the model, but only when the text actually parses, so
  // an in-progress value is never clobbered
  protected _normalize(): void {
    if (!parseColor(this._input.value) && !resolveColor(this._input.value, this._input)) {
      return
    }

    const normalized = formatColor(this._color, this._format)

    if (normalized !== this._input.value) {
      this._commit()
    }

    this._render()
  }

  protected _addAreaListeners(): void {
    if (!this._area || !this._areaThumb) {
      return
    }

    EventHandler.on(this._area, `pointerdown${EVENT_KEY}`, (event: BootstrapEvent) => {
      const pointerEvent = event as unknown as PointerEvent

      event.preventDefault()
      this._areaThumb!.focus()
      // Capture keeps the drag alive when the pointer leaves the plane, which is
      // most of the time near the edges
      this._area!.setPointerCapture(pointerEvent.pointerId)
      this._updateFromPointer(pointerEvent)
    })

    EventHandler.on(this._area, `pointermove${EVENT_KEY}`, (event: BootstrapEvent) => {
      const pointerEvent = event as unknown as PointerEvent

      if (this._area!.hasPointerCapture(pointerEvent.pointerId)) {
        this._updateFromPointer(pointerEvent)
      }
    })

    EventHandler.on(this._area, `pointerup${EVENT_KEY}`, (event: BootstrapEvent) => {
      const pointerEvent = event as unknown as PointerEvent

      if (!this._area!.hasPointerCapture(pointerEvent.pointerId)) {
        return
      }

      this._area!.releasePointerCapture(pointerEvent.pointerId)
      // The drag only streamed `input` events, so settle it with a `change`
      this._commit()
    })

    EventHandler.on(this._areaThumb, `keydown${EVENT_KEY}`, (event: BootstrapEvent) => {
      this._handleAreaKeydown(event)
    })
  }

  protected _updateFromPointer(event: PointerEvent): void {
    const rect = this._area!.getBoundingClientRect()

    if (rect.width === 0 || rect.height === 0) {
      return
    }

    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1)

    this._color = { ...this._color, c: x * MAX_CHROMA, l: 1 - y }
    this._commit(false)
    this._render()
  }

  protected _handleAreaKeydown(event: BootstrapEvent): void {
    const { key, shiftKey } = event
    const step = shiftKey ? AREA_STEP_COARSE : AREA_STEP
    let { c: chroma, l: lightness } = this._color

    switch (key) {
      case ARROW_LEFT_KEY: {
        chroma -= step * MAX_CHROMA
        break
      }

      case ARROW_RIGHT_KEY: {
        chroma += step * MAX_CHROMA
        break
      }

      case ARROW_UP_KEY: {
        lightness += step
        break
      }

      case ARROW_DOWN_KEY: {
        lightness -= step
        break
      }

      case HOME_KEY: {
        chroma = 0
        break
      }

      case END_KEY: {
        chroma = MAX_CHROMA
        break
      }

      case PAGE_UP_KEY: {
        lightness += AREA_STEP_COARSE
        break
      }

      case PAGE_DOWN_KEY: {
        lightness -= AREA_STEP_COARSE
        break
      }

      default: {
        return
      }
    }

    event.preventDefault()

    this._color = {
      ...this._color,
      c: Math.min(Math.max(chroma, 0), MAX_CHROMA),
      l: Math.min(Math.max(lightness, 0), 1)
    }

    this._commit()
    this._render()
  }

  protected _addPanelListeners(): void {
    if (this._hueInput) {
      this._bindSlider(this._hueInput, value => ({ ...this._color, h: value }))
    }

    if (this._alphaInput) {
      this._bindSlider(this._alphaInput, value => ({ ...this._color, alpha: value }))
    }

    if (this._formatSelect) {
      EventHandler.on(this._formatSelect, `${EVENT_CHANGE}${EVENT_KEY}`, () => {
        const format = this._formatSelect!.value

        if (isColorFormat(format)) {
          this._format = format
          this._commit()
        }
      })
    }

    EventHandler.on(this._menu, `click${EVENT_KEY}`, '.color-picker-swatch', (event: BootstrapEvent) => {
      const button = (event.target as Element).closest<HTMLElement>('.color-picker-swatch')

      if (!button) {
        return
      }

      event.preventDefault()
      this._selectSwatch(button)
    })

    EventHandler.on(this._menu, `click${EVENT_KEY}`, '.color-picker-eyedropper', (event: BootstrapEvent) => {
      event.preventDefault()
      this._openEyeDropper()
    })

    EventHandler.on(this._menu, `keydown${EVENT_KEY}`, (event: BootstrapEvent) => {
      if (event.key === ESCAPE_KEY) {
        event.preventDefault()
        event.stopPropagation()
        this.hide()
        this._input.focus()
        return
      }

      // Tabbing past the last control leaves the panel, so close behind it
      if (event.key === TAB_KEY) {
        this.hide()
      }
    })
  }

  // A range fires `input` throughout the drag and `change` at the end, so mirror
  // that split straight through to our own output
  protected _bindSlider(slider: HTMLInputElement, next: (value: number) => Oklch): void {
    const apply = (isFinal: boolean): void => {
      this._color = next(Number.parseFloat(slider.value))
      this._commit(isFinal)
      this._render()
    }

    EventHandler.on(slider, EVENT_INPUT, () => apply(false))
    EventHandler.on(slider, `${EVENT_CHANGE}${EVENT_KEY}`, () => apply(true))
  }

  protected _selectSwatch(button: HTMLElement): void {
    const color = resolveColor(button.dataset.bsValue!, button)

    if (!color) {
      return
    }

    // A swatch carries no alpha of its own, so keep whatever the user had
    this._color = this._config.alpha ? { ...color, alpha: this._color.alpha } : color
    this._commit()
    this._render()

    if (this._config.closeOnSelect) {
      this.hide()
      this._input.focus()
    }
  }

  protected async _openEyeDropper(): Promise<void> {
    const { EyeDropper } = window as unknown as { EyeDropper?: EyeDropperConstructor }

    if (!EyeDropper) {
      return
    }

    try {
      const { sRGBHex } = await new EyeDropper().open()
      const color = parseColor(sRGBHex)

      if (color) {
        this._color = this._config.alpha ? { ...color, alpha: this._color.alpha } : color
        this._commit()
        this._render()
      }
    } catch {
      // The user dismissed the picker, which rejects. Nothing to do.
    }
  }

  protected _addFormListeners(): void {
    const { form } = this._input

    if (!form) {
      return
    }

    // `reset` restores `defaultValue` after the event, so re-read on the next tick
    this._resetHandler = () => {
      setTimeout(() => {
        if (!this._element) {
          return
        }

        this._syncFromInput()
        this._render()
      })
    }

    form.addEventListener('reset', this._resetHandler)
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (this: HTMLElement, event) {
  event.preventDefault()

  const target = getElement(parseSelector(this.dataset.bsTarget ?? '') ?? null)

  if (target) {
    ColorPicker.getOrCreateInstance(target).toggle()
  }
})

EventHandler.on(document, EVENT_DOM_CONTENT_LOADED, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_PICKER)) {
    ColorPicker.getOrCreateInstance(element)
  }
})

export default ColorPicker
export type { ColorPickerConfig, ColorPickerSwatch }
