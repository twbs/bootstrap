/**
 * --------------------------------------------------------------------------
 * Bootstrap dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import SelectorEngine from './dom/selector-engine.js'
import {
  getElement,
  getNextActiveElement,
  getUID,
  isDisabled,
  isElement,
  isRTL,
  isVisible,
  noop
} from './util/index.js'
import {
  applyAnchorStyles,
  applyPositionedStyles,
  BreakpointObserver,
  generateAnchorName,
  getPlacementForViewport,
  isResponsivePlacement,
  parseResponsivePlacement,
  removePositioningStyles,
  supportsAnchorPositioning,
  supportsPopover
} from './util/positioning.js'

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
const RIGHT_MOUSE_BUTTON = 2 // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_DROPUP = 'dropup'
const CLASS_NAME_DROPEND = 'dropend'
const CLASS_NAME_DROPSTART = 'dropstart'
const CLASS_NAME_DROPUP_CENTER = 'dropup-center'
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)'
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}`
const SELECTOR_MENU = '.dropdown-menu'
const SELECTOR_NAVBAR = '.navbar'
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
const SELECTOR_DROPDOWN_CONTAINER = 'b-dropdown'
const SELECTOR_STICKY_FIXED = '.sticky-top, .sticky-bottom, .fixed-top, .fixed-bottom'

// Placement mappings for anchor positioning
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start'
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end'
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start'
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end'
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start'
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start'
const PLACEMENT_TOPCENTER = 'top'
const PLACEMENT_BOTTOMCENTER = 'bottom'

const Default = {
  autoClose: true,
  display: 'dynamic',
  offset: [0, 2],
  reference: 'toggle'
}

const DefaultType = {
  autoClose: '(boolean|string)',
  display: 'string',
  offset: '(array|string|function)',
  reference: '(string|element|object)'
}

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._parent = this._element.closest(SELECTOR_DROPDOWN_CONTAINER) || this._element.parentNode

    // Find menu via data-bs-target, or fallback to DOM traversal
    const target = this._element.getAttribute('data-bs-target')
    if (target) {
      this._menu = SelectorEngine.findOne(target)
    } else {
      // Look for menu in <b-dropdown> wrapper first, then fallback to sibling/parent search
      const container = this._element.closest(SELECTOR_DROPDOWN_CONTAINER)
      if (container) {
        this._menu = SelectorEngine.findOne(SELECTOR_MENU, container)
      }

      if (!this._menu) {
        this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] ||
          SelectorEngine.prev(this._element, SELECTOR_MENU)[0] ||
          SelectorEngine.findOne(SELECTOR_MENU, this._parent)
      }
    }

    this._inNavbar = this._detectNavbar()
    this._inStickyContext = this._detectStickyContext()
    this._anchorName = null
    this._breakpointObserver = null
    this._responsivePlacements = null

    // Set up popover attribute for auto-dismiss behavior
    this._setupPopoverAttribute()

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

    // Set up native anchor positioning
    this._setupPositioning()

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
    this._element.setAttribute('aria-expanded', true)

    // Show using Popover API if supported
    if (supportsPopover() && this._menu.hasAttribute('popover')) {
      this._menu.showPopover()
    }

    this._menu.classList.add(CLASS_NAME_SHOW)
    this._element.classList.add(CLASS_NAME_SHOW)
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
    if (this._breakpointObserver) {
      this._breakpointObserver.dispose()
      this._breakpointObserver = null
    }

    this._cleanupPositioning()
    super.dispose()
  }

  update() {
    this._inNavbar = this._detectNavbar()
    // With native anchor positioning, updates happen automatically
    // Re-apply positioning if needed
    if (this._isShown()) {
      this._setupPositioning()
    }
  }

  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE, relatedTarget)
    if (hideEvent.defaultPrevented) {
      return
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop)
      }
    }

    // Hide using Popover API if supported
    if (supportsPopover() && this._menu.hasAttribute('popover')) {
      try {
        this._menu.hidePopover()
      } catch {
        // Already hidden
      }
    }

    // Clean up positioning
    this._cleanupPositioning()

    this._menu.classList.remove(CLASS_NAME_SHOW)
    this._element.classList.remove(CLASS_NAME_SHOW)
    this._element.setAttribute('aria-expanded', 'false')
    Manipulator.removeDataAttribute(this._menu, 'popper') // Legacy cleanup
    EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget)
  }

  _getConfig(config) {
    config = super._getConfig(config)

    if (typeof config.reference === 'object' && !isElement(config.reference) &&
      typeof config.reference.getBoundingClientRect !== 'function'
    ) {
      throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`)
    }

    return config
  }

  _setupPopoverAttribute() {
    // Use popover="auto" for automatic light-dismiss behavior when autoClose is true
    // Use popover="manual" when autoClose is false or specific
    if (supportsPopover()) {
      if (this._config.autoClose === true) {
        this._menu.setAttribute('popover', 'auto')
      } else {
        this._menu.setAttribute('popover', 'manual')
      }
    }
  }

  _setupPositioning() {
    // Skip positioning for static display
    if (this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static') // Legacy attribute
      return
    }

    // Get placement for data attribute (used by CSS for styling)
    const placement = this._getPlacement()

    // For sticky/fixed contexts (like sticky navbars), skip anchor positioning
    // to avoid jitter during scroll. CSS handles positioning via absolute.
    if (this._inStickyContext) {
      this._menu.dataset.bsPlacement = placement
      return
    }

    // Check if native anchor positioning is supported
    if (supportsAnchorPositioning()) {
      // Generate unique anchor name
      const uid = getUID(NAME)
      this._anchorName = generateAnchorName(NAME, uid)

      // Determine reference element
      let referenceElement = this._element

      if (this._config.reference === 'parent') {
        referenceElement = this._parent
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference)
      } else if (typeof this._config.reference === 'object') {
        // Virtual element - for backward compatibility
        // Native anchor positioning doesn't support virtual elements directly
        // Fall back to toggle element
        referenceElement = this._element
      }

      // Apply anchor to reference element
      applyAnchorStyles(referenceElement, this._anchorName)

      // Get offset
      const offset = this._getOffset()

      // Apply positioning to menu
      applyPositionedStyles(this._menu, {
        anchorName: this._anchorName,
        placement,
        offset,
        fallbackPlacements: ['top', 'bottom', 'left', 'right']
      })
    } else {
      // Fallback: Use data attribute for CSS-based positioning
      // The CSS in _dropdown.scss handles positioning via [data-bs-placement]
      this._menu.dataset.bsPlacement = placement
    }
  }

  _cleanupPositioning() {
    if (this._anchorName) {
      // Get reference element
      let referenceElement = this._element
      if (this._config.reference === 'parent') {
        referenceElement = this._parent
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference)
      }

      removePositioningStyles(referenceElement, this._menu)
      this._anchorName = null
    }
  }

  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW)
  }

  _setupResponsivePlacement() {
    const placementAttr = this._element.getAttribute('data-bs-placement')

    if (placementAttr && isResponsivePlacement(placementAttr)) {
      this._responsivePlacements = parseResponsivePlacement(placementAttr)

      // Set up breakpoint observer to update positioning on resize
      this._breakpointObserver = new BreakpointObserver(() => {
        if (this._isShown()) {
          this._setupPositioning()
        }
      })
    }
  }

  _getPlacement() {
    // Check for responsive placements first
    if (this._responsivePlacements) {
      return getPlacementForViewport(this._responsivePlacements)
    }

    // Check for explicit data-bs-placement on the toggle (non-responsive)
    const explicitPlacement = this._element.getAttribute('data-bs-placement')
    if (explicitPlacement) {
      return explicitPlacement
    }

    // Fall back to wrapper class approach for backward compatibility
    const parentDropdown = this._parent

    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER
    }

    // We need to trim the value because custom properties can also include spaces
    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end'

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP
    }

    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM
  }

  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null
  }

  _detectStickyContext() {
    return this._element.closest(SELECTOR_STICKY_FIXED) !== null
  }

  _getOffset() {
    const { offset } = this._config

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10))
    }

    if (typeof offset === 'function') {
      return offset({}, this._element)
    }

    return offset
  }

  _selectMenuItem({ key, target }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element))

    if (!items.length) {
      return
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus()
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
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command

    const isInput = /input|textarea/i.test(event.target.tagName)
    const isEscapeEvent = event.key === ESCAPE_KEY
    const isUpOrDownEvent = [ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)

    if (!isUpOrDownEvent && !isEscapeEvent) {
      return
    }

    if (isInput && !isEscapeEvent) {
      return
    }

    event.preventDefault()

    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ?
      this :
      (SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE)[0] ||
        SelectorEngine.next(this, SELECTOR_DATA_TOGGLE)[0] ||
        SelectorEngine.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode))

    const instance = Dropdown.getOrCreateInstance(getToggleButton)

    if (isUpOrDownEvent) {
      event.stopPropagation()
      instance.show()
      instance._selectMenuItem(event)
      return
    }

    if (instance._isShown()) { // else is escape and we check if it is shown
      event.stopPropagation()
      instance.hide()
      getToggleButton.focus()
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
