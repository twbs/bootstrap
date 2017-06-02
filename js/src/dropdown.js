/* global Popper */

import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Dropdown = (($) => {

  /**
   * Check for Popper dependency
   * Popper - https://popper.js.org
   */
  if (typeof Popper === 'undefined') {
    throw new Error('Bootstrap dropdown require Popper.js (https://popper.js.org)')
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                     = 'dropdown'
  const VERSION                  = '4.0.0-alpha.6'
  const DATA_KEY                 = 'bs.dropdown'
  const EVENT_KEY                = `.${DATA_KEY}`
  const DATA_API_KEY             = '.data-api'
  const JQUERY_NO_CONFLICT       = $.fn[NAME]
  const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
  const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
  const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
  const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
  const REGEXP_KEYDOWN           = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

  const Event = {
    HIDE             : `hide${EVENT_KEY}`,
    HIDDEN           : `hidden${EVENT_KEY}`,
    SHOW             : `show${EVENT_KEY}`,
    SHOWN            : `shown${EVENT_KEY}`,
    CLICK            : `click${EVENT_KEY}`,
    CLICK_DATA_API   : `click${EVENT_KEY}${DATA_API_KEY}`,
    KEYDOWN_DATA_API : `keydown${EVENT_KEY}${DATA_API_KEY}`,
    KEYUP_DATA_API   : `keyup${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DISABLED  : 'disabled',
    SHOW      : 'show',
    DROPUP    : 'dropup',
    MENURIGHT : 'dropdown-menu-right',
    MENULEFT  : 'dropdown-menu-left'
  }

  const Selector = {
    DATA_TOGGLE   : '[data-toggle="dropdown"]',
    FORM_CHILD    : '.dropdown form',
    MENU          : '.dropdown-menu',
    NAVBAR_NAV    : '.navbar-nav',
    VISIBLE_ITEMS : '.dropdown-menu .dropdown-item:not(.disabled)'
  }

  const AttachmentMap = {
    TOP       : 'top-start',
    TOPEND    : 'top-end',
    BOTTOM    : 'bottom-start',
    BOTTOMEND : 'bottom-end'
  }

  const Default = {
    placement   : AttachmentMap.BOTTOM,
    offset      : 0,
    flip        : true
  }

  const DefaultType = {
    placement   : 'string',
    offset      : '(number|string)',
    flip        : 'boolean'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown {

    constructor(element, config) {
      this._element = element
      this._popper  = null
      this._config = this._getConfig(config)
      this._menu = this._getMenuElement()

      this._addEventListeners()
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    static get DefaultType() {
      return DefaultType
    }

    // public

    toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED)) {
        return
      }

      const parent   = Dropdown._getParentFromElement(this._element)
      const isActive = $(this._menu).hasClass(ClassName.SHOW)

      Dropdown._clearMenus()

      if (isActive) {
        return
      }

      const relatedTarget = {
        relatedTarget : this._element
      }
      const showEvent = $.Event(Event.SHOW, relatedTarget)

      $(parent).trigger(showEvent)

      if (showEvent.isDefaultPrevented()) {
        return
      }

      let element = this._element
      // for dropup with alignment we use the parent as popper container
      if ($(parent).hasClass(ClassName.DROPUP)) {
        if ($(this._menu).hasClass(ClassName.MENULEFT) || $(this._menu).hasClass(ClassName.MENURIGHT)) {
          element = parent
        }
      }
      this._popper = new Popper(element, this._menu, {
        placement : this._getPlacement(),
        modifiers : {
          offset : {
            offset : this._config.offset
          },
          flip : {
            enabled : this._config.flip
          }
        }
      })

      // if this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement &&
         !$(parent).closest(Selector.NAVBAR_NAV).length) {
        $('body').children().on('mouseover', null, $.noop)
      }

      this._element.focus()
      this._element.setAttribute('aria-expanded', true)

      $(this._menu).toggleClass(ClassName.SHOW)
      $(parent)
        .toggleClass(ClassName.SHOW)
        .trigger($.Event(Event.SHOWN, relatedTarget))
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      $(this._element).off(EVENT_KEY)
      this._element = null
      this._menu = null
      if (this._popper !== null) {
        this._popper.destroy()
      }
      this._popper = null
    }

    update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate()
      }
    }

    // private

    _addEventListeners() {
      $(this._element).on(Event.CLICK, (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.toggle()
      })
    }

    _getConfig(config) {
      const elementData = $(this._element).data()
      if (elementData.placement !== undefined) {
        elementData.placement = AttachmentMap[elementData.placement.toUpperCase()]
      }

      config = $.extend(
        {},
        this.constructor.Default,
        $(this._element).data(),
        config
      )

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
        this._menu = $(parent).find(Selector.MENU)[0]
      }
      return this._menu
    }

    _getPlacement() {
      const $parentDropdown = $(this._element).parent()
      let placement = this._config.placement

      // Handle dropup
      if ($parentDropdown.hasClass(ClassName.DROPUP) || this._config.placement === AttachmentMap.TOP) {
        placement = AttachmentMap.TOP
        if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.TOPEND
        }
      }
      else {
        if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.BOTTOMEND
        }
      }
      return placement
    }

    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' ? config : null

        if (!data) {
          data = new Dropdown(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
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

      const toggles = $.makeArray($(Selector.DATA_TOGGLE))
      for (let i = 0; i < toggles.length; i++) {
        const parent        = Dropdown._getParentFromElement(toggles[i])
        const context       = $(toggles[i]).data(DATA_KEY)
        const relatedTarget = {
          relatedTarget : toggles[i]
        }

        if (!context) {
          continue
        }

        const dropdownMenu = context._menu
        if (!$(parent).hasClass(ClassName.SHOW)) {
          continue
        }

        if (event && (event.type === 'click' &&
            /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE)
            && $.contains(parent, event.target)) {
          continue
        }

        const hideEvent = $.Event(Event.HIDE, relatedTarget)
        $(parent).trigger(hideEvent)
        if (hideEvent.isDefaultPrevented()) {
          continue
        }

        // if this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop)
        }

        toggles[i].setAttribute('aria-expanded', 'false')

        $(dropdownMenu).removeClass(ClassName.SHOW)
        $(parent)
          .removeClass(ClassName.SHOW)
          .trigger($.Event(Event.HIDDEN, relatedTarget))
      }
    }

    static _getParentFromElement(element) {
      let parent
      const selector = Util.getSelectorFromElement(element)

      if (selector) {
        parent = $(selector)[0]
      }

      return parent || element.parentNode
    }

    static _dataApiKeydownHandler(event) {
      if (!REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE ||
         /input|textarea/i.test(event.target.tagName)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return
      }

      const parent   = Dropdown._getParentFromElement(this)
      const isActive = $(parent).hasClass(ClassName.SHOW)

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) ||
           isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

        if (event.which === ESCAPE_KEYCODE) {
          const toggle = $(parent).find(Selector.DATA_TOGGLE)[0]
          $(toggle).trigger('focus')
        }

        $(this).trigger('click')
        return
      }

      const items = $(parent).find(Selector.VISIBLE_ITEMS).get()

      if (!items.length) {
        return
      }

      let index = items.indexOf(event.target)

      if (event.which === ARROW_UP_KEYCODE && index > 0) { // up
        index--
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // down
        index++
      }

      if (index < 0) {
        index = 0
      }

      items[index].focus()
    }

  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE,  Dropdown._dataApiKeydownHandler)
    .on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler)
    .on(`${Event.CLICK_DATA_API} ${Event.KEYUP_DATA_API}`, Dropdown._clearMenus)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault()
      event.stopPropagation()
      Dropdown._jQueryInterface.call($(this), 'toggle')
    })
    .on(Event.CLICK_DATA_API, Selector.FORM_CHILD, (e) => {
      e.stopPropagation()
    })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Dropdown._jQueryInterface
  $.fn[NAME].Constructor = Dropdown
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Dropdown._jQueryInterface
  }

  return Dropdown

})(jQuery)

export default Dropdown
