/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.1): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Popper from 'popper.js'
import Util from './util'

/**
 * Constants
 */

const NAME = 'dropdown'
const VERSION = '4.6.1'
const DATA_KEY = 'bs.dropdown'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ESCAPE_KEYCODE = 27 // KeyboardEvent.which value for Escape (Esc) key
const SPACE_KEYCODE = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_DROPUP = 'dropup'
const CLASS_NAME_DROPRIGHT = 'dropright'
const CLASS_NAME_DROPLEFT = 'dropleft'
const CLASS_NAME_MENURIGHT = 'dropdown-menu-right'
const CLASS_NAME_POSITION_STATIC = 'position-static'

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`

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
 * Class definition
 */

class Dropdown {
  constructor(element, config) {
    this._element = element
    this._popper = null
    this._config = this._getConfig(config)
    this._menu = this._getMenuElement()
    this._inNavbar = this._detectNavbar()

    this._addEventListeners()
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
    if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED)) {
      return
    }

    const isActive = $(this._menu).hasClass(CLASS_NAME_SHOW)

    Dropdown._clearMenus()

    if (isActive) {
      return
    }

    this.show(true)
  }

  show(usePopper = false) {
    if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED) || $(this._menu).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const showEvent = $.Event(EVENT_SHOW, relatedTarget)
    const parent = Dropdown._getParentFromElement(this._element)

    $(parent).trigger(showEvent)

    if (showEvent.isDefaultPrevented()) {
      return
    }

    // Totally disable Popper for Dropdowns in Navbar
    if (!this._inNavbar && usePopper) {
      // Check for Popper dependency
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)')
      }

      let referenceElement = this._element

      if (this._config.reference === 'parent') {
        referenceElement = parent
      } else if (Util.isElement(this._config.reference)) {
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
        $(parent).addClass(CLASS_NAME_POSITION_STATIC)
      }

      this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig())
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement &&
        $(parent).closest(SELECTOR_NAVBAR_NAV).length === 0) {
      $(document.body).children().on('mouseover', null, $.noop)
    }

    this._element.focus()
    this._element.setAttribute('aria-expanded', true)

    $(this._menu).toggleClass(CLASS_NAME_SHOW)
    $(parent)
      .toggleClass(CLASS_NAME_SHOW)
      .trigger($.Event(EVENT_SHOWN, relatedTarget))
  }

  hide() {
    if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED) || !$(this._menu).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const hideEvent = $.Event(EVENT_HIDE, relatedTarget)
    const parent = Dropdown._getParentFromElement(this._element)

    $(parent).trigger(hideEvent)

    if (hideEvent.isDefaultPrevented()) {
      return
    }

    if (this._popper) {
      this._popper.destroy()
    }

    $(this._menu).toggleClass(CLASS_NAME_SHOW)
    $(parent)
      .toggleClass(CLASS_NAME_SHOW)
      .trigger($.Event(EVENT_HIDDEN, relatedTarget))
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    $(this._element).off(EVENT_KEY)
    this._element = null
    this._menu = null
    if (this._popper !== null) {
      this._popper.destroy()
      this._popper = null
    }
  }

  update() {
    this._inNavbar = this._detectNavbar()
    if (this._popper !== null) {
      this._popper.scheduleUpdate()
    }
  }

  // Private
  _addEventListeners() {
    $(this._element).on(EVENT_CLICK, event => {
      event.preventDefault()
      event.stopPropagation()
      this.toggle()
    })
  }

  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...$(this._element).data(),
      ...config
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _getMenuElement() {
    if (!this._menu) {
      const parent = Dropdown._getParentFromElement(this._element)

      if (parent) {
        this._menu = parent.querySelector(SELECTOR_MENU)
      }
    }

    return this._menu
  }

  _getPlacement() {
    const $parentDropdown = $(this._element.parentNode)
    let placement = PLACEMENT_BOTTOM

    // Handle dropup
    if ($parentDropdown.hasClass(CLASS_NAME_DROPUP)) {
      placement = $(this._menu).hasClass(CLASS_NAME_MENURIGHT) ?
        PLACEMENT_TOPEND :
        PLACEMENT_TOP
    } else if ($parentDropdown.hasClass(CLASS_NAME_DROPRIGHT)) {
      placement = PLACEMENT_RIGHT
    } else if ($parentDropdown.hasClass(CLASS_NAME_DROPLEFT)) {
      placement = PLACEMENT_LEFT
    } else if ($(this._menu).hasClass(CLASS_NAME_MENURIGHT)) {
      placement = PLACEMENT_BOTTOMEND
    }

    return placement
  }

  _detectNavbar() {
    return $(this._element).closest('.navbar').length > 0
  }

  _getOffset() {
    const offset = {}

    if (typeof this._config.offset === 'function') {
      offset.fn = data => {
        data.offsets = {
          ...data.offsets,
          ...this._config.offset(data.offsets, this._element)
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

    // Disable Popper if we have a static display
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
  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data) {
        data = new Dropdown(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }

  static _clearMenus(event) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
      event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return
    }

    const toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))

    for (let i = 0, len = toggles.length; i < len; i++) {
      const parent = Dropdown._getParentFromElement(toggles[i])
      const context = $(toggles[i]).data(DATA_KEY)
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
      if (!$(parent).hasClass(CLASS_NAME_SHOW)) {
        continue
      }

      if (event && (event.type === 'click' &&
          /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) &&
          $.contains(parent, event.target)) {
        continue
      }

      const hideEvent = $.Event(EVENT_HIDE, relatedTarget)
      $(parent).trigger(hideEvent)
      if (hideEvent.isDefaultPrevented()) {
        continue
      }

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop)
      }

      toggles[i].setAttribute('aria-expanded', 'false')

      if (context._popper) {
        context._popper.destroy()
      }

      $(dropdownMenu).removeClass(CLASS_NAME_SHOW)
      $(parent)
        .removeClass(CLASS_NAME_SHOW)
        .trigger($.Event(EVENT_HIDDEN, relatedTarget))
    }
  }

  static _getParentFromElement(element) {
    let parent
    const selector = Util.getSelectorFromElement(element)

    if (selector) {
      parent = document.querySelector(selector)
    }

    return parent || element.parentNode
  }

  // eslint-disable-next-line complexity
  static _dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (/input|textarea/i.test(event.target.tagName) ?
      event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE &&
      (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE ||
        $(event.target).closest(SELECTOR_MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
      return
    }

    if (this.disabled || $(this).hasClass(CLASS_NAME_DISABLED)) {
      return
    }

    const parent = Dropdown._getParentFromElement(this)
    const isActive = $(parent).hasClass(CLASS_NAME_SHOW)

    if (!isActive && event.which === ESCAPE_KEYCODE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (!isActive || (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
      if (event.which === ESCAPE_KEYCODE) {
        $(parent.querySelector(SELECTOR_DATA_TOGGLE)).trigger('focus')
      }

      $(this).trigger('click')
      return
    }

    const items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS))
      .filter(item => $(item).is(':visible'))

    if (items.length === 0) {
      return
    }

    let index = items.indexOf(event.target)

    if (event.which === ARROW_UP_KEYCODE && index > 0) { // Up
      index--
    }

    if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // Down
      index++
    }

    if (index < 0) {
      index = 0
    }

    items[index].focus()
  }
}

/**
 * Data API implementation
 */

$(document)
  .on(EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown._dataApiKeydownHandler)
  .on(EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown._dataApiKeydownHandler)
  .on(`${EVENT_CLICK_DATA_API} ${EVENT_KEYUP_DATA_API}`, Dropdown._clearMenus)
  .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault()
    event.stopPropagation()
    Dropdown._jQueryInterface.call($(this), 'toggle')
  })
  .on(EVENT_CLICK_DATA_API, SELECTOR_FORM_CHILD, e => {
    e.stopPropagation()
  })

/**
 * jQuery
 */

$.fn[NAME] = Dropdown._jQueryInterface
$.fn[NAME].Constructor = Dropdown
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Dropdown._jQueryInterface
}

export default Dropdown
