/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import {
  execute, findShadowRoot, getUID, isRTL, noop
} from './util/index.js'
import { DefaultAllowlist } from './util/sanitizer.js'
import TemplateFactory from './util/template-factory.js'
import {
  applyAnchorStyles,
  applyPositionedStyles,
  BreakpointObserver,
  generateAnchorName,
  getPlacementForViewport,
  isResponsivePlacement,
  parseResponsivePlacement,
  removePositioningStyles,
  supportsPopover
} from './util/positioning.js'

/**
 * Constants
 */

const NAME = 'tooltip'
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn'])

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_MODAL = 'modal'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`

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

const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
}

const Default = {
  allowList: DefaultAllowlist,
  animation: true,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 6],
  placement: 'top',
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
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
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
  constructor(element, config) {
    super(element, config)

    // Private
    this._isEnabled = true
    this._timeout = 0
    this._isHovered = null
    this._activeTrigger = {}
    this._templateFactory = null
    this._newContent = null
    this._anchorName = null
    this._breakpointObserver = null
    this._responsivePlacements = null

    // Protected
    this.tip = null

    this._setListeners()

    if (!this._config.selector) {
      this._fixTitle()
    }

    // Parse responsive placement if present
    this._setupResponsivePlacement()
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
  enable() {
    this._isEnabled = true
  }

  disable() {
    this._isEnabled = false
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled
  }

  toggle() {
    if (!this._isEnabled) {
      return
    }

    if (this._isShown()) {
      this._leave()
      return
    }

    this._enter()
  }

  dispose() {
    clearTimeout(this._timeout)

    if (this._breakpointObserver) {
      this._breakpointObserver.dispose()
      this._breakpointObserver = null
    }

    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)

    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'))
    }

    this._disposeTooltip()
    super.dispose()
  }

  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements')
    }

    if (!(this._isWithContent() && this._isEnabled)) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW))
    const shadowRoot = findShadowRoot(this._element)
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element)

    if (showEvent.defaultPrevented || !isInTheDom) {
      return
    }

    // Clean up any existing tooltip
    this._disposeTooltip()

    const tip = this._getTipElement()

    this._element.setAttribute('aria-describedby', tip.getAttribute('id'))

    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      document.body.append(tip)
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED))
    }

    // Set up native anchor positioning
    this._setupPositioning(tip)

    // Show using Popover API if supported, otherwise just add class
    if (supportsPopover() && tip.popover !== undefined) {
      tip.showPopover()
    }

    tip.classList.add(CLASS_NAME_SHOW)

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop)
      }
    }

    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN))

      if (this._isHovered === false) {
        this._leave()
      }

      this._isHovered = false
    }

    this._queueCallback(complete, this.tip, this._isAnimated())
  }

  hide() {
    if (!this._isShown()) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE))
    if (hideEvent.defaultPrevented) {
      return
    }

    const tip = this._getTipElement()
    tip.classList.remove(CLASS_NAME_SHOW)

    // Hide using Popover API if supported
    if (supportsPopover() && tip.popover !== undefined) {
      try {
        tip.hidePopover()
      } catch {
        // Popover might already be hidden
      }
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
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
        this._disposeTooltip()
      }

      this._element.removeAttribute('aria-describedby')
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN))
    }

    this._queueCallback(complete, this.tip, this._isAnimated())
  }

  update() {
    // With native anchor positioning, the browser handles updates automatically
    // This method is kept for API compatibility
    if (this.tip && this._anchorName) {
      this._setupPositioning(this.tip)
    }
  }

  // Protected
  _isWithContent() {
    return Boolean(this._getTitle())
  }

  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())
    }

    return this.tip
  }

  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml()

    if (!tip) {
      return null
    }

    tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW)
    tip.classList.add(`bs-${this.constructor.NAME}-auto`)

    const tipId = getUID(this.constructor.NAME).toString()

    tip.setAttribute('id', tipId)

    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE)
    }

    // Set up for Popover API - use 'manual' for programmatic control
    if (supportsPopover()) {
      tip.setAttribute('popover', 'manual')
    }

    return tip
  }

  setContent(content) {
    this._newContent = content
    if (this._isShown()) {
      this._disposeTooltip()
      this.show()
    }
  }

  _getTemplateFactory(content) {
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

  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    }
  }

  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title')
  }

  // Private
  _initializeOnDelegatedTarget(event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig())
  }

  _isAnimated() {
    return this._config.animation || (this.tip && this.tip.classList.contains(CLASS_NAME_FADE))
  }

  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW)
  }

  _setupResponsivePlacement() {
    const placement = this._config.placement

    // Only set up responsive observer if placement is a string with breakpoint syntax
    if (typeof placement === 'string' && isResponsivePlacement(placement)) {
      this._responsivePlacements = parseResponsivePlacement(placement)

      // Set up breakpoint observer to update positioning on resize
      this._breakpointObserver = new BreakpointObserver(() => {
        if (this._isShown()) {
          this._setupPositioning(this.tip)
        }
      })
    }
  }

  _setupPositioning(tip) {
    let placement

    // Check for responsive placements first
    if (this._responsivePlacements) {
      placement = getPlacementForViewport(this._responsivePlacements)
    } else {
      placement = execute(this._config.placement, [this, tip, this._element])
    }

    const attachment = AttachmentMap[placement.toUpperCase()] || placement

    // Generate unique anchor name
    const uid = getUID(this.constructor.NAME)
    this._anchorName = generateAnchorName(this.constructor.NAME, uid)

    // Apply anchor to trigger element
    applyAnchorStyles(this._element, this._anchorName)

    // Get offset
    const offset = this._getOffset()

    // Apply positioning to tooltip
    applyPositionedStyles(tip, {
      anchorName: this._anchorName,
      placement: attachment,
      offset,
      fallbackPlacements: this._config.fallbackPlacements
    })
  }

  _getOffset() {
    const { offset } = this._config

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10))
    }

    if (typeof offset === 'function') {
      // For function offsets, call with element context
      return offset({}, this._element)
    }

    return offset
  }

  _resolvePossibleFunction(arg) {
    return execute(arg, [this._element, this._element])
  }

  _setListeners() {
    const triggers = this._config.trigger.split(' ')

    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK), this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK])
          context.toggle()
        })
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ?
          this.constructor.eventName(EVENT_MOUSEENTER) :
          this.constructor.eventName(EVENT_FOCUSIN)
        const eventOut = trigger === TRIGGER_HOVER ?
          this.constructor.eventName(EVENT_MOUSELEAVE) :
          this.constructor.eventName(EVENT_FOCUSOUT)

        EventHandler.on(this._element, eventIn, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event)
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true
          context._enter()
        })
        EventHandler.on(this._element, eventOut, this._config.selector, event => {
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

  _fixTitle() {
    const title = this._element.getAttribute('title')

    if (!title) {
      return
    }

    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title)
    }

    this._element.setAttribute('data-bs-original-title', title) // DO NOT USE IT. Is only for backwards compatibility
    this._element.removeAttribute('title')
  }

  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true
      return
    }

    this._isHovered = true

    this._setTimeout(() => {
      if (this._isHovered) {
        this.show()
      }
    }, this._config.delay.show)
  }

  _leave() {
    if (this._isWithActiveTrigger()) {
      return
    }

    this._isHovered = false

    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide()
      }
    }, this._config.delay.hide)
  }

  _setTimeout(handler, timeout) {
    clearTimeout(this._timeout)
    this._timeout = setTimeout(handler, timeout)
  }

  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true)
  }

  _getConfig(config) {
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

  _configAfterMerge(config) {
    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString()
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString()
    }

    return config
  }

  _getDelegateConfig() {
    const config = {}

    for (const [key, value] of Object.entries(this._config)) {
      if (this.constructor.Default[key] !== value) {
        config[key] = value
      }
    }

    config.selector = false
    config.trigger = 'manual'

    return config
  }

  _disposeTooltip() {
    if (this.tip) {
      // Remove anchor positioning styles
      removePositioningStyles(this._element, this.tip)

      // Hide popover if using Popover API
      if (supportsPopover() && this.tip.popover !== undefined) {
        try {
          this.tip.hidePopover()
        } catch {
          // Already hidden
        }
      }

      this.tip.remove()
      this.tip = null
    }

    this._anchorName = null
  }

  // Static
  static dataApiHandler(event) {
    const tooltip = Tooltip.getOrCreateInstance(event.target)

    // For hover/focus triggers, manually trigger the enter/leave behavior
    if (event.type === 'mouseenter' || event.type === 'focusin') {
      tooltip._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true
      tooltip._enter()
    }
  }
}

/**
 * Data API implementation
 * Lazily initialize tooltips on first interaction
 */

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tooltip"]'
const DATA_API_KEY = '.data-api'
const EVENT_MOUSEENTER_DATA_API = `mouseenter${DATA_API_KEY}`
const EVENT_FOCUSIN_DATA_API = `focusin${DATA_API_KEY}`

EventHandler.on(document, EVENT_MOUSEENTER_DATA_API, SELECTOR_DATA_TOGGLE, Tooltip.dataApiHandler)
EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE, Tooltip.dataApiHandler)

export default Tooltip
