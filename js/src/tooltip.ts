/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  autoUpdate,
  type Boundary,
  type Middleware,
  type Placement
} from '@floating-ui/dom'
import BaseComponent from './base-component.js'
import EventHandler, { type BootstrapEvent } from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import type { ComponentConfig } from './util/config.js'
import {
  execute, findShadowRoot, getElement, getUID, isRTL, noop
} from './util/index.js'
import { DefaultAllowlist, type SanitizerAllowList } from './util/sanitizer.js'
import TemplateFactory, { type TemplateContentEntry } from './util/template-factory.js'
import {
  parseResponsivePlacement,
  getResponsivePlacement,
  createBreakpointListeners,
  disposeBreakpointListeners,
  type BreakpointListener,
  type ResponsivePlacements
} from './util/floating-ui.js'

/**
 * Constants
 */

const NAME = 'tooltip'
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn'])

const ESCAPE_KEY = 'Escape'

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_MODAL = 'modal'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tooltip"]'

const EVENT_MODAL_HIDE = 'hide.bs.modal'

const TRIGGER_HOVER = 'hover'
const TRIGGER_FOCUS = 'focus'
const TRIGGER_CLICK = 'click'
const TRIGGER_MANUAL = 'manual'

const EVENT_HIDE = 'hide'
const EVENT_HIDDEN = 'hidden'
const EVENT_SHOW = 'show'
const EVENT_SHOWN = 'shown'
const EVENT_INSERTED = 'inserted'
const EVENT_CLICK = 'click'
const EVENT_FOCUSIN = 'focusin'
const EVENT_FOCUSOUT = 'focusout'
const EVENT_MOUSEENTER = 'mouseenter'
const EVENT_MOUSELEAVE = 'mouseleave'
const EVENT_KEYDOWN = 'keydown'

const AttachmentMap: Record<string, string> = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
}

type TooltipConfig = {
  allowList: SanitizerAllowList
  animation: boolean
  boundary: string | Element
  container: string | Element | boolean | null
  customClass: string | ((...args: any[]) => string)
  delay: number | { show: number, hide: number }
  fallbackPlacements: string[]
  html: boolean
  offset: number[] | string | ((deps: Record<string, any>, element: HTMLElement) => number[])
  placement: string | ((this: Tooltip, tip: HTMLElement, trigger: HTMLElement) => string)
  floatingConfig: Record<string, any> | ((defaultConfig: Record<string, any>) => Record<string, any>) | null
  sanitize: boolean
  sanitizeFn: ((unsafeHtml: string) => string) | null
  selector: string | boolean
  template: string
  title: string | Element | ((...args: any[]) => string | Element)
  trigger: string
}

const Default: TooltipConfig = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 6],
  placement: 'top',
  floatingConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip">' +
            '<div class="tooltip-arrow"></div>' +
            '<div class="tooltip-inner"></div>' +
            '</div>',
  title: '',
  trigger: 'hover focus'
}

const DefaultType = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  floatingConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
}

/**
 * Class definition
 */

class Tooltip extends BaseComponent {
  declare _config: TooltipConfig
  declare _isEnabled: boolean
  declare _timeout: number
  declare _isHovered: boolean | null
  declare _activeTrigger: Record<string, boolean>
  declare _floatingCleanup: (() => void) | null
  declare _keydownHandler: ((event: KeyboardEvent) => void) | null
  declare _templateFactory: TemplateFactory | null
  declare _newContent: Record<string, TemplateContentEntry> | null
  declare _mediaQueryListeners: BreakpointListener[]
  declare _responsivePlacements: ResponsivePlacements | null
  declare _hideModalHandler: () => void
  declare tip: HTMLElement | null

  constructor(element?: string | Element | null, config?: Partial<TooltipConfig> | null) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Floating UI (https://floating-ui.com)')
    }

    super(element, config)

    // Private
    this._isEnabled = true
    this._timeout = 0
    this._isHovered = null
    this._activeTrigger = {}
    this._floatingCleanup = null
    this._keydownHandler = null
    this._templateFactory = null
    this._newContent = null
    this._mediaQueryListeners = []
    this._responsivePlacements = null

    // Protected
    this.tip = null

    this._parseResponsivePlacements()
    this._setListeners()

    if (!this._config.selector) {
      this._fixTitle()
    }
  }

  // Getters
  static override get Default(): TooltipConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  enable(): void {
    this._isEnabled = true
  }

  disable(): void {
    this._isEnabled = false
  }

  toggleEnabled(): void {
    this._isEnabled = !this._isEnabled
  }

  toggle(): void {
    if (!this._isEnabled) {
      return
    }

    if (this._isShown()) {
      this._leave()
      return
    }

    this._enter()
  }

  override dispose(): void {
    clearTimeout(this._timeout)

    this._removeEscapeListener()

    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)

    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title')!)
    }

    this._disposeFloating()
    this._disposeMediaQueryListeners()
    super.dispose()
  }

  async show(): Promise<void> {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements')
    }

    if (!(this._isWithContent() && this._isEnabled)) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, (this.constructor as typeof Tooltip).eventName(EVENT_SHOW))
    const shadowRoot = findShadowRoot(this._element)
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element)

    if (showEvent.defaultPrevented || !isInTheDom) {
      // Reset the transient hover/active state so a prevented (or not-in-DOM)
      // show doesn't leave `_isHovered` stuck true — otherwise a click-triggered
      // tip would hit the `_enter()` early-return on every later click and never
      // reopen.
      this._isHovered = false
      return
    }

    this._disposeFloating()

    const tip = this._getTipElement()

    this._element.setAttribute('aria-describedby', tip.getAttribute('id')!)

    let { container } = this._config as TooltipConfig & { container: Element }
    const closestDialog = this._element.closest('dialog[open]')
    if (closestDialog && container === document.body) {
      container = closestDialog
    }

    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip)
      EventHandler.trigger(this._element, (this.constructor as typeof Tooltip).eventName(EVENT_INSERTED))
    }

    await this._createFloating(tip)

    tip.classList.add(CLASS_NAME_SHOW)

    // Allow dismissing the tooltip with the Escape key (WCAG 1.4.13)
    this._setEscapeListener()

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      for (const element of document.body.children) {
        EventHandler.on(element, 'mouseover', noop)
      }
    }

    const complete = () => {
      EventHandler.trigger(this._element, (this.constructor as typeof Tooltip).eventName(EVENT_SHOWN))

      if (this._isHovered === false) {
        this._leave()
      }

      this._isHovered = false
    }

    this._queueCallback(complete, this.tip!, this._isAnimated()!)
  }

  hide(): void {
    if (!this._isShown()) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, (this.constructor as typeof Tooltip).eventName(EVENT_HIDE))
    if (hideEvent.defaultPrevented) {
      return
    }

    this._removeEscapeListener()

    const tip = this._getTipElement()
    tip.classList.remove(CLASS_NAME_SHOW)

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of document.body.children) {
        EventHandler.off(element, 'mouseover', noop)
      }
    }

    this._activeTrigger[TRIGGER_CLICK] = false
    this._activeTrigger[TRIGGER_FOCUS] = false
    this._activeTrigger[TRIGGER_HOVER] = false
    this._isHovered = null // it is a trick to support manual triggering

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return
      }

      if (!this._isHovered) {
        this._disposeFloating()
      }

      this._element.removeAttribute('aria-describedby')
      EventHandler.trigger(this._element, (this.constructor as typeof Tooltip).eventName(EVENT_HIDDEN))
    }

    this._queueCallback(complete, this.tip!, this._isAnimated()!)
  }

  update(): void {
    if (this._floatingCleanup && this.tip) {
      this._updateFloatingPosition()
    }
  }

  // Protected
  _isWithContent(): boolean {
    return Boolean(this._getTitle()) || this._hasNewContent()
  }

  // Content supplied via setContent() (a `{ selector: content }` map) overrides
  // the configured title/content when rendering, so it should also satisfy the
  // show() gate — otherwise a tip whose content is only set via setContent()
  // can never be shown.
  _hasNewContent(): boolean {
    return Boolean(this._newContent) && Object.values(this._newContent!).some(Boolean)
  }

  _getTipElement(): HTMLElement {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())
    }

    return this.tip
  }

  _createTipElement(content: Record<string, TemplateContentEntry>): HTMLElement {
    const tip = this._getTemplateFactory(content).toHtml()

    tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW)
    tip.classList.add(`bs-${(this.constructor as typeof Tooltip).NAME}-auto`)

    const tipId = getUID((this.constructor as typeof Tooltip).NAME).toString()

    tip.setAttribute('id', tipId)

    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE)
    }

    return tip
  }

  setContent(content: Record<string, TemplateContentEntry>): void {
    this._newContent = content
    if (this._isShown()) {
      this._disposeFloating()
      this.show()
    }
  }

  _getTemplateFactory(content: Record<string, TemplateContentEntry>): TemplateFactory {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content)
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      })
    }

    return this._templateFactory
  }

  _getContentForTemplate(): Record<string, TemplateContentEntry> {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    }
  }

  _getTitle(): string | Element | null {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title')
  }

  // Private
  _initializeOnDelegatedTarget(event: BootstrapEvent): Tooltip {
    return (this.constructor as typeof Tooltip).getOrCreateInstance(event.delegateTarget, this._getDelegateConfig())
  }

  _isAnimated(): boolean | null {
    return this._config.animation || (this.tip && this.tip.classList.contains(CLASS_NAME_FADE))
  }

  _isShown(): boolean | null {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW)
  }

  _getPlacement(tip: HTMLElement): string {
    // If we have responsive placements, get the one for current viewport
    if (this._responsivePlacements) {
      const placement = getResponsivePlacement(this._responsivePlacements, 'top')
      return AttachmentMap[placement.toUpperCase()] || placement
    }

    // Execute placement (can be a function)
    const placement = execute(this._config.placement, [this, tip, this._element])
    return AttachmentMap[placement.toUpperCase()] || placement
  }

  _parseResponsivePlacements(): void {
    // Only parse if placement is a string (not a function)
    if (typeof this._config.placement !== 'string') {
      this._responsivePlacements = null
      return
    }

    this._responsivePlacements = parseResponsivePlacement(this._config.placement, 'top')

    if (this._responsivePlacements) {
      this._setupMediaQueryListeners()
    }
  }

  _setupMediaQueryListeners(): void {
    this._disposeMediaQueryListeners()
    this._mediaQueryListeners = createBreakpointListeners(() => {
      if (this._isShown()) {
        this._updateFloatingPosition()
      }
    })
  }

  _disposeMediaQueryListeners(): void {
    disposeBreakpointListeners(this._mediaQueryListeners)
    this._mediaQueryListeners = []
  }

  async _createFloating(tip: HTMLElement): Promise<void> {
    const placement = this._getPlacement(tip)
    const arrowElement = tip.querySelector<HTMLElement>(`.${(this.constructor as typeof Tooltip).NAME}-arrow`)

    // Initial position update
    await this._updateFloatingPosition(tip, placement, arrowElement)

    // Set up auto-update for scroll/resize
    this._floatingCleanup = autoUpdate(
      this._element,
      tip,
      () => this._updateFloatingPosition(tip, null, arrowElement)
    )
  }

  async _updateFloatingPosition(tip: HTMLElement | null = this.tip, placement: string | null = null, arrowElement: HTMLElement | null = null): Promise<void> {
    if (!tip) {
      return
    }

    if (!placement) {
      placement = this._getPlacement(tip)
    }

    if (!arrowElement) {
      arrowElement = tip.querySelector<HTMLElement>(`.${(this.constructor as typeof Tooltip).NAME}-arrow`)
    }

    const middleware = this._getFloatingMiddleware(arrowElement)
    const floatingConfig = this._getFloatingConfig(placement, middleware)

    const { x, y, placement: finalPlacement, middlewareData } = await computePosition(
      this._element,
      tip,
      floatingConfig
    )

    // Apply position to tooltip
    Object.assign(tip.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`
    })

    // Ensure arrow is absolutely positioned within tooltip
    if (arrowElement) {
      arrowElement.style.position = 'absolute'
    }

    // Set placement attribute for CSS arrow styling
    Manipulator.setDataAttribute(tip, 'placement', finalPlacement)

    // Position arrow along the edge (center it) if present
    // The CSS handles which edge to place it on via data-bs-placement
    if (arrowElement && middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow
      const isVertical = finalPlacement.startsWith('top') || finalPlacement.startsWith('bottom')

      // Only set the cross-axis position (centering along the edge)
      // The main-axis position (which edge) is handled by CSS
      // Floating UI reports the unused axis as `undefined`, never `null`
      Object.assign(arrowElement.style, {
        left: isVertical && arrowX !== undefined ? `${arrowX}px` : '',
        top: !isVertical && arrowY !== undefined ? `${arrowY}px` : '',
        // Reset the other axis to let CSS handle it
        right: '',
        bottom: ''
      })
    }
  }

  _getOffset(): number[] | ((state: any) => any) {
    const { offset } = this._config

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10))
    }

    if (typeof offset === 'function') {
      // Floating UI passes different args, adapt the interface for offset function callbacks
      return ({ placement, rects }) => {
        const result = offset({ placement, reference: rects.reference, floating: rects.floating }, this._element)
        // Adapt a `[skidding, distance]` array to Floating UI's offset shape,
        // matching how the array and string config forms are applied
        return Array.isArray(result) ? { mainAxis: result[1] || 0, crossAxis: result[0] || 0 } : result
      }
    }

    return offset
  }

  _resolvePossibleFunction<T>(arg: T | ((...args: any[]) => T)): T {
    return execute(arg, [this._element, this._element])
  }

  _getFloatingMiddleware(arrowElement: HTMLElement | null): Middleware[] {
    const offsetValue = this._getOffset()

    const middleware = [
      // Offset middleware - handles distance from reference
      offset(
        typeof offsetValue === 'function' ?
          offsetValue :
          { mainAxis: offsetValue[1] || 0, crossAxis: offsetValue[0] || 0 }
      ),
      // Flip middleware - handles fallback placements
      flip({
        fallbackPlacements: this._config.fallbackPlacements as Placement[]
      }),
      // Shift middleware - prevents overflow
      shift({
        boundary: (this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary) as Boundary
      })
    ]

    // Arrow middleware - positions the arrow element
    if (arrowElement) {
      middleware.push(arrow({ element: arrowElement }))
    }

    return middleware
  }

  _getFloatingConfig(placement: string, middleware: Middleware[]): Record<string, any> {
    const defaultConfig = {
      placement,
      middleware
    }

    return {
      ...defaultConfig,
      ...execute(this._config.floatingConfig, [undefined, defaultConfig])
    }
  }

  _setListeners(): void {
    const triggers = this._config.trigger.split(' ')

    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, (this.constructor as typeof Tooltip).eventName(EVENT_CLICK), this._config.selector as string, event => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK])
          context.toggle()
        })
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ?
          (this.constructor as typeof Tooltip).eventName(EVENT_MOUSEENTER) :
          (this.constructor as typeof Tooltip).eventName(EVENT_FOCUSIN)
        const eventOut = trigger === TRIGGER_HOVER ?
          (this.constructor as typeof Tooltip).eventName(EVENT_MOUSELEAVE) :
          (this.constructor as typeof Tooltip).eventName(EVENT_FOCUSOUT)

        EventHandler.on(this._element, eventIn, this._config.selector as string, event => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true
          context._enter()
        })
        EventHandler.on(this._element, eventOut, this._config.selector as string, event => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] =
            context._element.contains(event.relatedTarget)

          context._leave()
        })
      }
    }

    this._hideModalHandler = () => {
      if (this._element) {
        this.hide()
      }
    }

    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)
  }

  _setEscapeListener(): void {
    if (this._keydownHandler) {
      return
    }

    this._keydownHandler = event => {
      if (event.key !== ESCAPE_KEY || !this._isShown() || !this.tip!.isConnected) {
        return
      }

      // Dismiss the tooltip and consume the keystroke so it doesn't reach
      // ancestor components (e.g. a parent dialog). This way the first Escape
      // only closes the tooltip, and a subsequent one can close the dialog —
      // matching the behavior of the dropdown menu.
      event.preventDefault()
      event.stopPropagation()
      this.hide()
    }

    // Listen in the capture phase so this runs before the dialog's own keydown
    // handler, and on the document so it works regardless of where focus is
    // (e.g. for hover-triggered tooltips). EventHandler only uses the capture
    // phase for delegated listeners, so attach natively here.
    this._element.ownerDocument.addEventListener(EVENT_KEYDOWN, this._keydownHandler, true)
  }

  _removeEscapeListener(): void {
    if (!this._keydownHandler) {
      return
    }

    this._element.ownerDocument.removeEventListener(EVENT_KEYDOWN, this._keydownHandler, true)
    this._keydownHandler = null
  }

  _fixTitle(): void {
    const title = this._element.getAttribute('title')

    if (!title) {
      return
    }

    if (!this._element.getAttribute('aria-label') && !this._element.textContent!.trim()) {
      this._element.setAttribute('aria-label', title)
    }

    this._element.setAttribute('data-bs-original-title', title) // DO NOT USE IT. Is only for backwards compatibility
    this._element.removeAttribute('title')
  }

  _enter(): void {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true
      return
    }

    this._isHovered = true

    this._setTimeout(() => {
      if (this._isHovered) {
        this.show()
      }
    }, (this._config.delay as { show: number, hide: number }).show)
  }

  _leave(): void {
    if (this._isWithActiveTrigger()) {
      return
    }

    this._isHovered = false

    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide()
      }
    }, (this._config.delay as { show: number, hide: number }).hide)
  }

  _setTimeout(handler: () => void, timeout: number): void {
    clearTimeout(this._timeout)
    this._timeout = setTimeout(handler, timeout)
  }

  _isWithActiveTrigger(): boolean {
    return Object.values(this._activeTrigger).includes(true)
  }

  override _getConfig(config?: ComponentConfig | null): ComponentConfig {
    const dataAttributes = Manipulator.getDataAttributes(this._element)

    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute]
      }
    }

    config = {
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    }
    config = this._mergeConfigObj(config)
    config = this._configAfterMerge(config)
    this._typeCheckConfig(config)
    return config
  }

  override _configAfterMerge(config: ComponentConfig): ComponentConfig {
    config.container = config.container === false ? document.body : getElement(config.container)

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    // Coerce number/boolean title and content to strings. `data-bs-title="true"`
    // / `data-bs-content="false"` are auto-converted to booleans by the data-API,
    // which would otherwise fail the (null|string|element|function) type check.
    if (typeof config.title === 'number' || typeof config.title === 'boolean') {
      config.title = config.title.toString()
    }

    if (typeof config.content === 'number' || typeof config.content === 'boolean') {
      config.content = config.content.toString()
    }

    return config
  }

  _getDelegateConfig(): ComponentConfig {
    const config: ComponentConfig = {}

    for (const [key, value] of Object.entries(this._config)) {
      if ((this.constructor as typeof Tooltip).Default[key as keyof TooltipConfig] !== value) {
        config[key] = value
      }
    }

    config.selector = false
    config.trigger = 'manual'

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config
  }

  _disposeFloating(): void {
    if (this._floatingCleanup) {
      this._floatingCleanup()
      this._floatingCleanup = null
    }

    if (this.tip) {
      this.tip.remove()
      this.tip = null
    }
  }
}

/**
 * Data API implementation - auto-initialize tooltips
 */

const initTooltip = (event: BootstrapEvent): void => {
  const target = (event.target as Element).closest(SELECTOR_DATA_TOGGLE)
  if (!target) {
    return
  }

  // Lazily create the instance. The instance's own `_setListeners()` registers
  // the appropriate listeners on the element for the configured triggers
  // (hover/focus by default), so we don't mutate `_activeTrigger` or call
  // `_enter` here — doing so would show tooltips for triggers the user didn't
  // opt into (e.g. `focusin` firing for click-focused buttons in Chromium,
  // even when `trigger="hover"` or `trigger="manual"`) and leave stale state
  // on `_activeTrigger`.
  Tooltip.getOrCreateInstance(target)
}

// Auto-initialize tooltips on first interaction for hover and focus triggers
EventHandler.on(document, EVENT_FOCUSIN, SELECTOR_DATA_TOGGLE, initTooltip)
EventHandler.on(document, EVENT_MOUSEENTER, SELECTOR_DATA_TOGGLE, initTooltip)

export default Tooltip
export type { TooltipConfig }
