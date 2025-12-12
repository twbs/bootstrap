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
const RIGHT_MOUSE_BUTTON = 2 // MouseEvent.button value for the secondary button, usually the right button

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
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'

// Default placement with RTL support
const DEFAULT_PLACEMENT = isRTL() ? 'bottom-end' : 'bottom-start'

const Default = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  floatingConfig: null,
  placement: DEFAULT_PLACEMENT,
  reference: 'toggle'
}

const DefaultType = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  floatingConfig: '(null|object|function)',
  placement: 'string',
  reference: '(string|element|object)'
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
    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] ||
      SelectorEngine.prev(this._element, SELECTOR_MENU)[0] ||
      SelectorEngine.findOne(SELECTOR_MENU, this._parent)

    // Parse responsive placements on init
    this._parseResponsivePlacements()
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
    this._element.setAttribute('aria-expanded', true)

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
    this._disposeFloating()
    this._disposeMediaQueryListeners()
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
    this._element.setAttribute('aria-expanded', 'false')
    Manipulator.removeDataAttribute(this._menu, 'placement')
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
    // Check if menu exists and is still in the DOM
    if (!this._menu || !this._menu.isConnected) {
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

    const { x, y, placement: finalPlacement } = await computePosition(
      referenceElement,
      this._menu,
      floatingConfig
    )

    // Menu may have been disposed during the async computePosition call
    if (!this._menu || !this._menu.isConnected) {
      return
    }

    // Apply position to dropdown menu
    Object.assign(this._menu.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      margin: '0'
    })

    // Set placement attribute for CSS styling
    Manipulator.setDataAttribute(this._menu, 'placement', finalPlacement)
  }

  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW)
  }

  _getPlacement() {
    // If we have responsive placements, find the appropriate one for current viewport
    if (this._responsivePlacements) {
      return getResponsivePlacement(this._responsivePlacements, DEFAULT_PLACEMENT)
    }

    return this._config.placement
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
    const { offset } = this._config

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10))
    }

    if (typeof offset === 'function') {
      // Floating UI passes different args, adapt the interface for offset function callbacks
      return ({ placement, rects }) => {
        const result = offset({ placement, reference: rects.reference, floating: rects.floating }, this._element)
        return result
      }
    }

    return offset
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
