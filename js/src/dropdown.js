/**
 * --------------------------------------------------------------------------
 * Bootstrap dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate
} from '@floating-ui/dom'
import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import SelectorEngine from './dom/selector-engine.js'
import {
  execute,
  getElement,
  getNextActiveElement,
  isDisabled,
  isElement,
  isRTL,
  isVisible,
  noop
} from './util/index.js'
import {
  parseResponsivePlacement,
  getResponsivePlacement,
  createBreakpointListeners,
  disposeBreakpointListeners
} from './util/floating-ui.js'

/**
 * Constants
 */

const NAME = 'dropdown'
const DATA_KEY = 'bs.dropdown'
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
const ENTER_KEY = 'Enter'
const SPACE_KEY = ' '
const RIGHT_MOUSE_BUTTON = 2

// Hover intent delay (ms) - grace period before closing submenu
const SUBMENU_CLOSE_DELAY = 100

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW = 'show'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)'
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}`
const SELECTOR_MENU = '.dropdown-menu'
const SELECTOR_SUBMENU = '.dropdown-submenu'
const SELECTOR_SUBMENU_TOGGLE = '.dropdown-submenu > .dropdown-item'
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-item:not(.disabled):not(:disabled)'

// Default logical placement (uses start/end which get resolved to left/right based on RTL)
const DEFAULT_PLACEMENT = 'bottom-start'
const SUBMENU_PLACEMENT = 'end-start'

// Resolve logical placement (start/end) to physical (left/right) based on RTL
const resolveLogicalPlacement = placement => {
  if (isRTL()) {
    // RTL: start → right, end → left
    return placement.replace(/^start(?=-|$)/, 'right').replace(/^end(?=-|$)/, 'left')
  }

  // LTR: start → left, end → right
  return placement.replace(/^start(?=-|$)/, 'left').replace(/^end(?=-|$)/, 'right')
}

// Helper for barycentric coordinate calculation (point in triangle check)
const triangleSign = (p1, p2, p3) =>
  ((p1.x - p3.x) * (p2.y - p3.y)) - ((p2.x - p3.x) * (p1.y - p3.y))

const Default = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  floatingConfig: null,
  placement: DEFAULT_PLACEMENT,
  reference: 'toggle',
  // Submenu options
  submenuTrigger: 'both', // 'click', 'hover', or 'both'
  submenuDelay: SUBMENU_CLOSE_DELAY
}

const DefaultType = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  floatingConfig: '(null|object|function)',
  placement: 'string',
  reference: '(string|element|object)',
  submenuTrigger: 'string',
  submenuDelay: 'number'
}

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Floating UI (https://floating-ui.com)')
    }

    super(element, config)

    this._floatingCleanup = null
    this._mediaQueryListeners = []
    this._responsivePlacements = null
    this._parent = this._element.parentNode // dropdown wrapper
    this._isSubmenu = this._parent.classList.contains('dropdown-submenu')
    this._openSubmenus = new Map() // Map of submenu element -> cleanup function
    this._submenuCloseTimeouts = new Map() // Map of submenu element -> timeout ID
    this._hoverIntentData = null // For safe triangle calculation

    this._menu = SelectorEngine.findOne(SELECTOR_MENU, this._parent)

    // Parse responsive placements on init
    this._parseResponsivePlacements()

    // Set up submenu event listeners
    this._setupSubmenuListeners()
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
    if (isDisabled(this._element) || this._isShown()) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, relatedTarget)

    if (showEvent.defaultPrevented) {
      return
    }

    this._createFloating()

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop)
      }
    }

    this._element.focus()
    this._element.setAttribute('aria-expanded', 'true')

    this._menu.classList.add(CLASS_NAME_SHOW)
    this._element.classList.add(CLASS_NAME_SHOW)
    this._parent.classList.add(CLASS_NAME_SHOW)
    EventHandler.trigger(this._element, EVENT_SHOWN, relatedTarget)
  }

  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }

    this._completeHide(relatedTarget)
  }

  dispose() {
    this._disposeFloating()
    this._disposeMediaQueryListeners()
    this._closeAllSubmenus()
    this._clearAllSubmenuTimeouts()
    super.dispose()
  }

  update() {
    if (this._floatingCleanup) {
      this._updateFloatingPosition()
    }
  }

  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE, relatedTarget)
    if (hideEvent.defaultPrevented) {
      return
    }

    // Close all open submenus first
    this._closeAllSubmenus()

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop)
      }
    }

    this._disposeFloating()

    this._menu.classList.remove(CLASS_NAME_SHOW)
    this._element.classList.remove(CLASS_NAME_SHOW)
    this._parent.classList.remove(CLASS_NAME_SHOW)
    this._element.setAttribute('aria-expanded', 'false')
    Manipulator.removeDataAttribute(this._menu, 'placement')
    Manipulator.removeDataAttribute(this._menu, 'display')
    EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget)
  }

  _getConfig(config) {
    config = super._getConfig(config)

    if (typeof config.reference === 'object' && !isElement(config.reference) &&
      typeof config.reference.getBoundingClientRect !== 'function'
    ) {
      // Floating UI virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`)
    }

    return config
  }

  _createFloating() {
    if (this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'display', 'static')
      return
    }

    let referenceElement = this._element

    if (this._config.reference === 'parent') {
      referenceElement = this._parent
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference)
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference
    }

    // Initial position update
    this._updateFloatingPosition(referenceElement)

    // Set up auto-update for scroll/resize
    this._floatingCleanup = autoUpdate(
      referenceElement,
      this._menu,
      () => this._updateFloatingPosition(referenceElement)
    )
  }

  async _updateFloatingPosition(referenceElement = null) {
    if (!this._menu) {
      return
    }

    if (!referenceElement) {
      if (this._config.reference === 'parent') {
        referenceElement = this._parent
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference)
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference
      } else {
        referenceElement = this._element
      }
    }

    const placement = this._getPlacement()
    const middleware = this._getFloatingMiddleware()
    const floatingConfig = this._getFloatingConfig(placement, middleware)

    await this._applyFloatingPosition(
      referenceElement,
      this._menu,
      floatingConfig.placement,
      floatingConfig.middleware
    )
  }

  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW)
  }

  _getPlacement() {
    // If we have responsive placements, find the appropriate one for current viewport
    const placement = this._responsivePlacements ?
      getResponsivePlacement(this._responsivePlacements, DEFAULT_PLACEMENT) :
      this._config.placement

    // Resolve logical placements (start/end) to physical (left/right) based on RTL
    return resolveLogicalPlacement(placement)
  }

  _parseResponsivePlacements() {
    this._responsivePlacements = parseResponsivePlacement(this._config.placement, DEFAULT_PLACEMENT)

    if (this._responsivePlacements) {
      this._setupMediaQueryListeners()
    }
  }

  _setupMediaQueryListeners() {
    this._disposeMediaQueryListeners()
    this._mediaQueryListeners = createBreakpointListeners(() => {
      if (this._isShown()) {
        this._updateFloatingPosition()
      }
    })
  }

  _disposeMediaQueryListeners() {
    disposeBreakpointListeners(this._mediaQueryListeners)
    this._mediaQueryListeners = []
  }

  _getOffset() {
    const { offset: offsetConfig } = this._config

    if (typeof offsetConfig === 'string') {
      return offsetConfig.split(',').map(value => Number.parseInt(value, 10))
    }

    if (typeof offsetConfig === 'function') {
      // Floating UI passes different args, adapt the interface for offset function callbacks
      return ({ placement, rects }) => {
        const result = offsetConfig({ placement, reference: rects.reference, floating: rects.floating }, this._element)
        return result
      }
    }

    return offsetConfig
  }

  _getFloatingMiddleware() {
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
        fallbackPlacements: this._getFallbackPlacements()
      }),
      // Shift middleware - prevents overflow
      shift({
        boundary: this._config.boundary === 'clippingParents' ? 'clippingAncestors' : this._config.boundary
      })
    ]

    return middleware
  }

  _getFallbackPlacements() {
    // Get appropriate fallback placements based on current placement
    // Fallbacks should preserve alignment (start/end) when possible
    const placement = this._getPlacement()

    // Handle all possible Floating UI placements
    const fallbackMap = {
      bottom: ['top', 'bottom-start', 'bottom-end', 'top-start', 'top-end'],
      'bottom-start': ['top-start', 'bottom-end', 'top-end'],
      'bottom-end': ['top-end', 'bottom-start', 'top-start'],
      top: ['bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
      'top-start': ['bottom-start', 'top-end', 'bottom-end'],
      'top-end': ['bottom-end', 'top-start', 'bottom-start'],
      right: ['left', 'right-start', 'right-end', 'left-start', 'left-end'],
      'right-start': ['left-start', 'right-end', 'left-end', 'top-start', 'bottom-start'],
      'right-end': ['left-end', 'right-start', 'left-start', 'top-end', 'bottom-end'],
      left: ['right', 'left-start', 'left-end', 'right-start', 'right-end'],
      'left-start': ['right-start', 'left-end', 'right-end', 'top-start', 'bottom-start'],
      'left-end': ['right-end', 'left-start', 'right-start', 'top-end', 'bottom-end']
    }

    return fallbackMap[placement] || ['top', 'bottom', 'right', 'left']
  }

  _getFloatingConfig(placement, middleware) {
    const defaultConfig = {
      placement,
      middleware
    }

    return {
      ...defaultConfig,
      ...execute(this._config.floatingConfig, [undefined, defaultConfig])
    }
  }

  _disposeFloating() {
    if (this._floatingCleanup) {
      this._floatingCleanup()
      this._floatingCleanup = null
    }
  }

  // Shared helper for positioning any floating element
  async _applyFloatingPosition(reference, floating, placement, middleware) {
    if (!floating.isConnected) {
      return null
    }

    const { x, y, placement: finalPlacement } = await computePosition(
      reference,
      floating,
      { placement, middleware }
    )

    if (!floating.isConnected) {
      return null
    }

    Object.assign(floating.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      margin: '0'
    })

    Manipulator.setDataAttribute(floating, 'placement', finalPlacement)
    return finalPlacement
  }

  // -------------------------------------------------------------------------
  // Submenu handling
  // -------------------------------------------------------------------------

  _setupSubmenuListeners() {
    // Set up hover listeners for submenu triggers
    if (this._config.submenuTrigger === 'hover' || this._config.submenuTrigger === 'both') {
      EventHandler.on(this._menu, 'mouseenter', SELECTOR_SUBMENU_TOGGLE, event => {
        this._onSubmenuTriggerEnter(event)
      })

      EventHandler.on(this._menu, 'mouseleave', SELECTOR_SUBMENU, event => {
        this._onSubmenuLeave(event)
      })

      // Track mouse movement for safe triangle calculation
      EventHandler.on(this._menu, 'mousemove', event => {
        this._trackMousePosition(event)
      })
    }

    // Set up click listener for submenu triggers
    if (this._config.submenuTrigger === 'click' || this._config.submenuTrigger === 'both') {
      EventHandler.on(this._menu, 'click', SELECTOR_SUBMENU_TOGGLE, event => {
        this._onSubmenuTriggerClick(event)
      })
    }
  }

  _onSubmenuTriggerEnter(event) {
    const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE)
    if (!trigger) {
      return
    }

    const submenuWrapper = trigger.closest(SELECTOR_SUBMENU)
    const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper)
    if (!submenu) {
      return
    }

    // Cancel any pending close timeout for this submenu
    this._cancelSubmenuCloseTimeout(submenu)

    // Close other open submenus at the same level
    this._closeSiblingSubmenus(submenuWrapper)

    // Open this submenu
    this._openSubmenu(trigger, submenu, submenuWrapper)
  }

  _onSubmenuLeave(event) {
    const submenuWrapper = event.target.closest(SELECTOR_SUBMENU)
    const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper)
    if (!submenu || !this._openSubmenus.has(submenu)) {
      return
    }

    // Check if we're moving toward the submenu (safe triangle)
    if (this._isMovingTowardSubmenu(event, submenu)) {
      return
    }

    // Schedule submenu close with delay
    this._scheduleSubmenuClose(submenu, submenuWrapper)
  }

  _onSubmenuTriggerClick(event) {
    const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE)
    if (!trigger) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const submenuWrapper = trigger.closest(SELECTOR_SUBMENU)
    const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper)
    if (!submenu) {
      return
    }

    // Toggle submenu
    if (this._openSubmenus.has(submenu)) {
      this._closeSubmenu(submenu, submenuWrapper)
    } else {
      this._closeSiblingSubmenus(submenuWrapper)
      this._openSubmenu(trigger, submenu, submenuWrapper)
    }
  }

  _openSubmenu(trigger, submenu, submenuWrapper) {
    if (this._openSubmenus.has(submenu)) {
      return
    }

    // Set ARIA attributes
    trigger.setAttribute('aria-expanded', 'true')
    trigger.setAttribute('aria-haspopup', 'true')

    // Position and show submenu
    submenu.classList.add(CLASS_NAME_SHOW)
    submenuWrapper.classList.add(CLASS_NAME_SHOW)

    // Set up Floating UI positioning for submenu
    const cleanup = this._createSubmenuFloating(trigger, submenu, submenuWrapper)
    this._openSubmenus.set(submenu, cleanup)

    // Set up mouseenter on submenu to cancel close timeout
    EventHandler.on(submenu, 'mouseenter', () => {
      this._cancelSubmenuCloseTimeout(submenu)
    })
  }

  _closeSubmenu(submenu, submenuWrapper) {
    if (!this._openSubmenus.has(submenu)) {
      return
    }

    // Close any nested submenus first
    const nestedSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} ${SELECTOR_MENU}.${CLASS_NAME_SHOW}`, submenu)
    for (const nested of nestedSubmenus) {
      const nestedWrapper = nested.closest(SELECTOR_SUBMENU)
      this._closeSubmenu(nested, nestedWrapper)
    }

    // Get the trigger
    const trigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, submenuWrapper)

    // Clean up Floating UI
    const cleanup = this._openSubmenus.get(submenu)
    if (cleanup) {
      cleanup()
    }

    this._openSubmenus.delete(submenu)

    // Remove event listeners
    EventHandler.off(submenu, 'mouseenter')

    // Update ARIA and visibility
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false')
    }

    submenu.classList.remove(CLASS_NAME_SHOW)
    submenuWrapper.classList.remove(CLASS_NAME_SHOW)

    // Clear inline styles
    submenu.style.position = ''
    submenu.style.left = ''
    submenu.style.top = ''
    submenu.style.margin = ''
  }

  _closeAllSubmenus() {
    for (const [submenu] of this._openSubmenus) {
      const submenuWrapper = submenu.closest(SELECTOR_SUBMENU)
      this._closeSubmenu(submenu, submenuWrapper)
    }
  }

  _closeSiblingSubmenus(currentSubmenuWrapper) {
    // Find all sibling submenu wrappers and close their menus
    const parent = currentSubmenuWrapper.parentNode
    const siblingSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} > ${SELECTOR_MENU}.${CLASS_NAME_SHOW}`, parent)

    for (const siblingMenu of siblingSubmenus) {
      const siblingWrapper = siblingMenu.closest(SELECTOR_SUBMENU)
      if (siblingWrapper !== currentSubmenuWrapper) {
        this._closeSubmenu(siblingMenu, siblingWrapper)
      }
    }
  }

  _createSubmenuFloating(trigger, submenu, submenuWrapper) {
    const referenceElement = submenuWrapper
    const placement = resolveLogicalPlacement(SUBMENU_PLACEMENT)
    const middleware = [
      offset({ mainAxis: 0, crossAxis: -4 }),
      flip({
        fallbackPlacements: [
          resolveLogicalPlacement('start-start'),
          resolveLogicalPlacement('end-end'),
          resolveLogicalPlacement('start-end')
        ]
      }),
      shift({ padding: 8 })
    ]

    const updatePosition = () => this._applyFloatingPosition(referenceElement, submenu, placement, middleware)

    updatePosition()
    return autoUpdate(referenceElement, submenu, updatePosition)
  }

  _scheduleSubmenuClose(submenu, submenuWrapper) {
    this._cancelSubmenuCloseTimeout(submenu)

    const timeoutId = setTimeout(() => {
      this._closeSubmenu(submenu, submenuWrapper)
      this._submenuCloseTimeouts.delete(submenu)
    }, this._config.submenuDelay)

    this._submenuCloseTimeouts.set(submenu, timeoutId)
  }

  _cancelSubmenuCloseTimeout(submenu) {
    const timeoutId = this._submenuCloseTimeouts.get(submenu)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this._submenuCloseTimeouts.delete(submenu)
    }
  }

  _clearAllSubmenuTimeouts() {
    for (const timeoutId of this._submenuCloseTimeouts.values()) {
      clearTimeout(timeoutId)
    }

    this._submenuCloseTimeouts.clear()
  }

  // -------------------------------------------------------------------------
  // Hover intent / Safe triangle
  // -------------------------------------------------------------------------

  _trackMousePosition(event) {
    this._hoverIntentData = {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    }
  }

  _isMovingTowardSubmenu(event, submenu) {
    if (!this._hoverIntentData) {
      return false
    }

    const submenuRect = submenu.getBoundingClientRect()
    const currentPos = { x: event.clientX, y: event.clientY }
    const lastPos = { x: this._hoverIntentData.x, y: this._hoverIntentData.y }

    // Create a triangle from current position to submenu edges
    // The triangle represents the "safe zone" for diagonal movement
    const isRtl = isRTL()

    // Determine which edge of the submenu to target based on direction
    const targetX = isRtl ? submenuRect.right : submenuRect.left
    const topCorner = { x: targetX, y: submenuRect.top }
    const bottomCorner = { x: targetX, y: submenuRect.bottom }

    // Check if cursor is moving toward the submenu
    // by checking if the current position is within the safe triangle
    return this._pointInTriangle(currentPos, lastPos, topCorner, bottomCorner)
  }

  _pointInTriangle(point, v1, v2, v3) {
    // Barycentric coordinate method to check if point is inside triangle
    const d1 = triangleSign(point, v1, v2)
    const d2 = triangleSign(point, v2, v3)
    const d3 = triangleSign(point, v3, v1)

    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)

    return !(hasNeg && hasPos)
  }

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------

  _selectMenuItem({ key, target }) {
    // Get items only from the current menu level (not nested submenus)
    // If target is inside a menu, use that menu; otherwise use the main menu
    const currentMenu = target.closest(SELECTOR_MENU) || this._menu
    const items = SelectorEngine.find(`:scope > li > ${SELECTOR_VISIBLE_ITEMS}, :scope > ${SELECTOR_VISIBLE_ITEMS}`, currentMenu)
      .filter(element => isVisible(element))

    if (!items.length) {
      return
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus()
  }

  _handleSubmenuKeydown(event) {
    const { key, target } = event
    const isRtl = isRTL()

    // Determine the "enter submenu" and "exit submenu" keys based on RTL
    const enterKey = isRtl ? ARROW_LEFT_KEY : ARROW_RIGHT_KEY
    const exitKey = isRtl ? ARROW_RIGHT_KEY : ARROW_LEFT_KEY

    // Check if target is a submenu trigger
    const submenuWrapper = target.closest(SELECTOR_SUBMENU)
    const isSubmenuTrigger = submenuWrapper && target.matches(SELECTOR_SUBMENU_TOGGLE)

    // Handle Enter/Space on submenu trigger
    if ((key === ENTER_KEY || key === SPACE_KEY) && isSubmenuTrigger) {
      event.preventDefault()
      event.stopPropagation()

      const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper)
      if (submenu) {
        this._closeSiblingSubmenus(submenuWrapper)
        this._openSubmenu(target, submenu, submenuWrapper)
        // Focus first item in submenu
        requestAnimationFrame(() => {
          const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS, submenu)
          if (firstItem) {
            firstItem.focus()
          }
        })
      }

      return true
    }

    // Handle Right arrow (or Left in RTL) - enter submenu
    if (key === enterKey && isSubmenuTrigger) {
      event.preventDefault()
      event.stopPropagation()

      const submenu = SelectorEngine.findOne(SELECTOR_MENU, submenuWrapper)
      if (submenu) {
        this._closeSiblingSubmenus(submenuWrapper)
        this._openSubmenu(target, submenu, submenuWrapper)
        // Focus first item in submenu
        requestAnimationFrame(() => {
          const firstItem = SelectorEngine.findOne(SELECTOR_VISIBLE_ITEMS, submenu)
          if (firstItem) {
            firstItem.focus()
          }
        })
      }

      return true
    }

    // Handle Left arrow (or Right in RTL) - exit submenu
    if (key === exitKey) {
      const currentMenu = target.closest(SELECTOR_MENU)
      const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU)

      if (parentSubmenuWrapper) {
        event.preventDefault()
        event.stopPropagation()

        const parentTrigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper)
        this._closeSubmenu(currentMenu, parentSubmenuWrapper)
        if (parentTrigger) {
          parentTrigger.focus()
        }

        return true
      }
    }

    // Handle Home/End keys
    if (key === HOME_KEY || key === END_KEY) {
      event.preventDefault()
      event.stopPropagation()

      const currentMenu = target.closest(SELECTOR_MENU)
      const items = SelectorEngine.find(`:scope > li > ${SELECTOR_VISIBLE_ITEMS}, :scope > ${SELECTOR_VISIBLE_ITEMS}`, currentMenu)
        .filter(element => isVisible(element))

      if (items.length) {
        const targetItem = key === HOME_KEY ? items[0] : items[items.length - 1]
        targetItem.focus()
      }

      return true
    }

    return false
  }

  _handleEscapeKey(event, toggleButton) {
    // If in a submenu, close just that submenu
    const currentMenu = event.target.closest(SELECTOR_MENU)
    const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU)

    if (parentSubmenuWrapper && this._openSubmenus.size > 0) {
      const parentTrigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper)
      this._closeSubmenu(currentMenu, parentSubmenuWrapper)
      if (parentTrigger) {
        parentTrigger.focus()
      }

      return
    }

    // Otherwise close the whole dropdown
    this.hide()
    toggleButton.focus()
  }

  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || (event.type === 'keyup' && event.key !== TAB_KEY)) {
      return
    }

    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN)

    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle)
      if (!context || context._config.autoClose === false) {
        continue
      }

      const composedPath = event.composedPath()
      const isMenuTarget = composedPath.includes(context._menu)
      if (
        composedPath.includes(context._element) ||
        (context._config.autoClose === 'inside' && !isMenuTarget) ||
        (context._config.autoClose === 'outside' && isMenuTarget)
      ) {
        continue
      }

      // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
      if (context._menu.contains(event.target) && ((event.type === 'keyup' && event.key === TAB_KEY) || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue
      }

      const relatedTarget = { relatedTarget: context._element }

      if (event.type === 'click') {
        relatedTarget.clickEvent = event
      }

      context._completeHide(relatedTarget)
    }
  }

  static dataApiKeydownHandler(event) {
    // If not a relevant key => not a dropdown command
    const isInput = /input|textarea/i.test(event.target.tagName)
    const isEscapeEvent = event.key === ESCAPE_KEY
    const isUpOrDownEvent = [ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)
    const isLeftOrRightEvent = [ARROW_LEFT_KEY, ARROW_RIGHT_KEY].includes(event.key)
    const isHomeOrEndEvent = [HOME_KEY, END_KEY].includes(event.key)
    const isEnterOrSpaceEvent = [ENTER_KEY, SPACE_KEY].includes(event.key)

    // Allow Enter/Space only on submenu triggers
    const isSubmenuTrigger = event.target.matches(SELECTOR_SUBMENU_TOGGLE)

    if (!isUpOrDownEvent && !isEscapeEvent && !isLeftOrRightEvent && !isHomeOrEndEvent &&
        !(isEnterOrSpaceEvent && isSubmenuTrigger)) {
      return
    }

    if (isInput && !isEscapeEvent) {
      return
    }

    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ?
      this :
      SelectorEngine.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode)

    if (!getToggleButton) {
      return
    }

    const instance = Dropdown.getOrCreateInstance(getToggleButton)

    // Handle submenu navigation first
    if ((isLeftOrRightEvent || isHomeOrEndEvent || (isEnterOrSpaceEvent && isSubmenuTrigger)) && instance._handleSubmenuKeydown(event)) {
      return
    }

    // Handle Up/Down navigation
    if (isUpOrDownEvent) {
      event.preventDefault()
      event.stopPropagation()
      instance.show()
      instance._selectMenuItem(event)
      return
    }

    // Handle Escape
    if (isEscapeEvent && instance._isShown()) {
      event.preventDefault()
      event.stopPropagation()
      instance._handleEscapeKey(event, getToggleButton)
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler)
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler)
EventHandler.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus)
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus)
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()
  Dropdown.getOrCreateInstance(this).toggle()
})

export default Dropdown
