/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { inline, offset, shift } from '@floating-ui/dom'
import {
  defineJQueryPlugin,
  getNextActiveElement,
  isDisabled,
  isVisible,
  noop
} from './util/index'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'
import BaseComponent from './base-component'
import FloatingUi from './util/floating-ui'

/**
 * Constants
 */

const NAME = 'dropdown'
const DATA_KEY = 'bs.dropdown'
const EVENT_KEY = `.${DATA_KEY}`

const ESCAPE_KEY = 'Escape'
const TAB_KEY = 'Tab'
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'
const RIGHT_MOUSE_BUTTON = 2 // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}`

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

const PLACEMENT_TOPCENTER = 'top'
const PLACEMENT_TOPEND = 'top-end'
const PLACEMENT_TOP = 'top-start'
const PLACEMENT_BOTTOMCENTER = 'bottom'
const PLACEMENT_BOTTOMEND = 'bottom-end'
const PLACEMENT_BOTTOM = 'bottom-start'
const PLACEMENT_RIGHT = 'right-start'
const PLACEMENT_LEFT = 'left-start'

const Default = {
  autoClose: true,
  display: 'dynamic',
  offset: 10,
  positionConfig: null,
  reference: 'toggle'
}

const DefaultType = {
  autoClose: '(boolean|string)',
  display: 'string',
  offset: '(number|array|string|function)',
  positionConfig: '(null|object|function)',
  reference: '(string|element|object)'
}

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._parent = this._element.parentNode // dropdown wrapper
    this._menu = SelectorEngine.findOne(SELECTOR_MENU, this._parent)
    this._positionHelper = new FloatingUi(this._element)
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

    this.update()

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

  update() {
    const reference = this._positionHelper.getReferenceElement(this._config.reference, this._parent, NAME)
    this._positionHelper.calculate(reference, this._menu, this._getFloatingUiConfig())
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

    this._menu.classList.remove(CLASS_NAME_SHOW)
    this._element.classList.remove(CLASS_NAME_SHOW)
    this._element.setAttribute('aria-expanded', 'false')
    this._positionHelper.stop()
    EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget)
  }

  _getFloatingUiConfig() {
    const defaultBsConfig = {
      placement: this._getPlacement(),
      middleware: [offset(this._positionHelper.parseOffset(this._config.offset)), shift()]
    }

    // Disable Popper if we have a static display or Dropdown is in Navbar
    if (this._detectNavbar() || this._config.display === 'static') {
      defaultBsConfig.middleware.push(inline())
    }

    return {
      ...defaultBsConfig,
      ...(typeof this._config.positionConfig === 'function' ? this._config.positionConfig(defaultBsConfig) : this._config.positionConfig)
    }
  }

  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW)
  }

  _getPlacement() {
    const parentDropdown = this._parent

    const matches = {
      [CLASS_NAME_DROPEND]: PLACEMENT_RIGHT,
      [CLASS_NAME_DROPSTART]: PLACEMENT_LEFT,
      [CLASS_NAME_DROPUP_CENTER]: PLACEMENT_TOPCENTER,
      [CLASS_NAME_DROPDOWN_CENTER]: PLACEMENT_BOTTOMCENTER
    }
    const match = Object.keys(matches).find(keyClass => parentDropdown.classList.contains(keyClass))
    if (match) {
      return matches[match]
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

  _selectMenuItem({ key, target }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element))

    if (!items.length) {
      return
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus()
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config]()
    })
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
      if (composedPath.includes(context._element) || (context._config.autoClose === 'inside' && !isMenuTarget) || (context._config.autoClose === 'outside' && isMenuTarget)) {
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

    const getToggleButton = SelectorEngine.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode)
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

/**
 * jQuery
 */

defineJQueryPlugin(Dropdown)

export default Dropdown
