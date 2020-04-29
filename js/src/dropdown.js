/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  getElementFromSelector,
  isElement,
  isVisible,
  noop,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import Popper from 'popper.js'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'dropdown'
const VERSION = '4.3.1'
const DATA_KEY = 'bs.dropdown'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const ESCAPE_KEY = 'Escape'
const SPACE_KEY = 'Space'
const TAB_KEY = 'Tab'
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'
const RIGHT_MOUSE_BUTTON = 2 // MouseEvent.button value for the secondary button, usually the right button

const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`)

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_DROPUP = 'dropup'
const CLASS_NAME_DROPRIGHT = 'dropright'
const CLASS_NAME_DROPLEFT = 'dropleft'
const CLASS_NAME_MENURIGHT = 'dropdown-menu-right'
const CLASS_NAME_NAVBAR = 'navbar'
const CLASS_NAME_POSITION_STATIC = 'position-static'

const SELECTOR_DATA_TOGGLE = '[data-toggle="dropdown"]'
const SELECTOR_FORM_CHILD = '.dropdown form'
const SELECTOR_MENU = '.dropdown-menu'
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'

const PLACEMENT_TOP = 'top-start'
const PLACEMENT_TOPEND = 'top-end'
const PLACEMENT_BOTTOM = 'bottom-start'
const PLACEMENT_BOTTOMEND = 'bottom-end'
const PLACEMENT_RIGHT = 'right-start'
const PLACEMENT_LEFT = 'left-start'

const Default = {
  offset: 0,
  flip: true,
  boundary: 'scrollParent',
  reference: 'toggle',
  display: 'dynamic',
  popperConfig: null
}

const DefaultType = {
  offset: '(number|string|function)',
  flip: 'boolean',
  boundary: '(string|element)',
  reference: '(string|element)',
  display: 'string',
  popperConfig: '(null|object)'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Dropdown {
  constructor(element, config) {
    this._element = element
    this._popper = null
    this._config = this._getConfig(config)
    this._menu = this._getMenuElement()
    this._inNavbar = this._detectNavbar()

    this._addEventListeners()
    Data.setData(element, DATA_KEY, this)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  toggle() {
    if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED)) {
      return
    }

    const isActive = this._element.classList.contains(CLASS_NAME_SHOW)

    Dropdown.clearMenus()

    if (isActive) {
      return
    }

    this.show()
  }

  show() {
    if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED) || this._menu.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const parent = Dropdown.getParentFromElement(this._element)
    const relatedTarget = {
      relatedTarget: this._element
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, relatedTarget)

    if (showEvent.defaultPrevented) {
      return
    }

    // Disable totally Popper.js for Dropdown in Navbar
    if (!this._inNavbar) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org)')
      }

      let referenceElement = this._element

      if (this._config.reference === 'parent') {
        referenceElement = parent
      } else if (isElement(this._config.reference)) {
        referenceElement = this._config.reference

        // Check if it's jQuery element
        if (typeof this._config.reference.jquery !== 'undefined') {
          referenceElement = this._config.reference[0]
        }
      }

      // If boundary is not `scrollParent`, then set position to `static`
      // to allow the menu to "escape" the scroll parent's boundaries
      // https://github.com/twbs/bootstrap/issues/24251
      if (this._config.boundary !== 'scrollParent') {
        parent.classList.add(CLASS_NAME_POSITION_STATIC)
      }

      this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig())
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement &&
      !parent.closest(SELECTOR_NAVBAR_NAV)) {
      [].concat(...document.body.children)
        .forEach(elem => EventHandler.on(elem, 'mouseover', null, noop()))
    }

    this._element.focus()
    this._element.setAttribute('aria-expanded', true)

    Manipulator.toggleClass(this._menu, CLASS_NAME_SHOW)
    Manipulator.toggleClass(this._element, CLASS_NAME_SHOW)
    EventHandler.trigger(parent, EVENT_SHOWN, relatedTarget)
  }

  hide() {
    if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED) || !this._menu.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const parent = Dropdown.getParentFromElement(this._element)
    const relatedTarget = {
      relatedTarget: this._element
    }

    const hideEvent = EventHandler.trigger(parent, EVENT_HIDE, relatedTarget)

    if (hideEvent.defaultPrevented) {
      return
    }

    if (this._popper) {
      this._popper.destroy()
    }

    Manipulator.toggleClass(this._menu, CLASS_NAME_SHOW)
    Manipulator.toggleClass(this._element, CLASS_NAME_SHOW)
    EventHandler.trigger(parent, EVENT_HIDDEN, relatedTarget)
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    EventHandler.off(this._element, EVENT_KEY)
    this._element = null
    this._menu = null
    if (this._popper) {
      this._popper.destroy()
      this._popper = null
    }
  }

  update() {
    this._inNavbar = this._detectNavbar()
    if (this._popper) {
      this._popper.scheduleUpdate()
    }
  }

  // Private

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_CLICK, event => {
      event.preventDefault()
      event.stopPropagation()
      this.toggle()
    })
  }

  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config
    }

    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _getMenuElement() {
    return SelectorEngine.next(this._element, SELECTOR_MENU)[0]
  }

  _getPlacement() {
    const parentDropdown = this._element.parentNode
    let placement = PLACEMENT_BOTTOM

    // Handle dropup
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      placement = PLACEMENT_TOP
      if (this._menu.classList.contains(CLASS_NAME_MENURIGHT)) {
        placement = PLACEMENT_TOPEND
      }
    } else if (parentDropdown.classList.contains(CLASS_NAME_DROPRIGHT)) {
      placement = PLACEMENT_RIGHT
    } else if (parentDropdown.classList.contains(CLASS_NAME_DROPLEFT)) {
      placement = PLACEMENT_LEFT
    } else if (this._menu.classList.contains(CLASS_NAME_MENURIGHT)) {
      placement = PLACEMENT_BOTTOMEND
    }

    return placement
  }

  _detectNavbar() {
    return Boolean(this._element.closest(`.${CLASS_NAME_NAVBAR}`))
  }

  _getOffset() {
    const offset = {}

    if (typeof this._config.offset === 'function') {
      offset.fn = data => {
        data.offsets = {
          ...data.offsets,
          ...this._config.offset(data.offsets, this._element) || {}
        }

        return data
      }
    } else {
      offset.offset = this._config.offset
    }

    return offset
  }

  _getPopperConfig() {
    const popperConfig = {
      placement: this._getPlacement(),
      modifiers: {
        offset: this._getOffset(),
        flip: {
          enabled: this._config.flip
        },
        preventOverflow: {
          boundariesElement: this._config.boundary
        }
      }
    }

    // Disable Popper.js if we have a static display
    if (this._config.display === 'static') {
      popperConfig.modifiers.applyStyle = {
        enabled: false
      }
    }

    return {
      ...popperConfig,
      ...this._config.popperConfig
    }
  }

  // Static

  static dropdownInterface(element, config) {
    let data = Data.getData(element, DATA_KEY)
    const _config = typeof config === 'object' ? config : null

    if (!data) {
      data = new Dropdown(element, _config)
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config]()
    }
  }

  static jQueryInterface(config) {
    return this.each(function () {
      Dropdown.dropdownInterface(this, config)
    })
  }

  static clearMenus(event) {
    if (event && (event.button === RIGHT_MOUSE_BUTTON ||
      (event.type === 'keyup' && event.key !== TAB_KEY))) {
      return
    }

    const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE)

    for (let i = 0, len = toggles.length; i < len; i++) {
      const parent = Dropdown.getParentFromElement(toggles[i])
      const context = Data.getData(toggles[i], DATA_KEY)
      const relatedTarget = {
        relatedTarget: toggles[i]
      }

      if (event && event.type === 'click') {
        relatedTarget.clickEvent = event
      }

      if (!context) {
        continue
      }

      const dropdownMenu = context._menu
      if (!toggles[i].classList.contains(CLASS_NAME_SHOW)) {
        continue
      }

      if (event && ((event.type === 'click' &&
          /input|textarea/i.test(event.target.tagName)) ||
          (event.type === 'keyup' && event.key === TAB_KEY)) &&
          dropdownMenu.contains(event.target)) {
        continue
      }

      const hideEvent = EventHandler.trigger(parent, EVENT_HIDE, relatedTarget)
      if (hideEvent.defaultPrevented) {
        continue
      }

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children)
          .forEach(elem => EventHandler.off(elem, 'mouseover', null, noop()))
      }

      toggles[i].setAttribute('aria-expanded', 'false')

      if (context._popper) {
        context._popper.destroy()
      }

      dropdownMenu.classList.remove(CLASS_NAME_SHOW)
      toggles[i].classList.remove(CLASS_NAME_SHOW)
      EventHandler.trigger(parent, EVENT_HIDDEN, relatedTarget)
    }
  }

  static getParentFromElement(element) {
    return getElementFromSelector(element) || element.parentNode
  }

  static dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (/input|textarea/i.test(event.target.tagName) ?
      event.key === SPACE_KEY || (event.key !== ESCAPE_KEY &&
      ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
        event.target.closest(SELECTOR_MENU))) :
      !REGEXP_KEYDOWN.test(event.key)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
      return
    }

    const parent = Dropdown.getParentFromElement(this)
    const isActive = this.classList.contains(CLASS_NAME_SHOW)

    if (event.key === ESCAPE_KEY) {
      const button = this.matches(SELECTOR_DATA_TOGGLE) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE)[0]
      button.focus()
      Dropdown.clearMenus()
      return
    }

    if (!isActive || event.key === SPACE_KEY) {
      Dropdown.clearMenus()
      return
    }

    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, parent)
      .filter(isVisible)

    if (!items.length) {
      return
    }

    let index = items.indexOf(event.target)

    if (event.key === ARROW_UP_KEY && index > 0) { // Up
      index--
    }

    if (event.key === ARROW_DOWN_KEY && index < items.length - 1) { // Down
      index++
    }

    // index is -1 if the first keydown is an ArrowUp
    index = index === -1 ? 0 : index

    items[index].focus()
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler)
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler)
EventHandler.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus)
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus)
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()
  event.stopPropagation()
  Dropdown.dropdownInterface(this, 'toggle')
})
EventHandler
  .on(document, EVENT_CLICK_DATA_API, SELECTOR_FORM_CHILD, e => e.stopPropagation())

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .dropdown to jQuery only if jQuery is present
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Dropdown.jQueryInterface
  $.fn[NAME].Constructor = Dropdown
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Dropdown.jQueryInterface
  }
}

export default Dropdown
