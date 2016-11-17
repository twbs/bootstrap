import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.5): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Dropdown = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                     = 'dropdown'
  const VERSION                  = '4.0.0-alpha.5'
  const DATA_KEY                 = 'bs.dropdown'
  const EVENT_KEY                = `.${DATA_KEY}`
  const DATA_API_KEY             = '.data-api'
  const JQUERY_NO_CONFLICT       = $.fn[NAME]
  const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
  const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)

  const Event = {
    HIDE             : `hide${EVENT_KEY}`,
    HIDDEN           : `hidden${EVENT_KEY}`,
    SHOW             : `show${EVENT_KEY}`,
    SHOWN            : `shown${EVENT_KEY}`,
    CLICK            : `click${EVENT_KEY}`,
    CLICK_DATA_API   : `click${EVENT_KEY}${DATA_API_KEY}`,
    KEYDOWN_DATA_API : `keydown${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    BACKDROP : 'dropdown-backdrop',
    DISABLED : 'disabled',
    ACTIVE   : 'active'
  }

  const Selector = {
    BACKDROP      : '.dropdown-backdrop',
    DATA_TOGGLE   : '[data-toggle="dropdown"]',
    FORM_CHILD    : '.dropdown form',
    ROLE_MENU     : '[role="menu"]',
    ROLE_LISTBOX  : '[role="listbox"]',
    NAVBAR_NAV    : '.navbar-nav',
    VISIBLE_ITEMS : '[role="menu"] li:not(.disabled) a, '
                  + '[role="listbox"] li:not(.disabled) a'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown {

    constructor(element) {
      this._element = element

      this._addEventListeners()
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    toggle() {
      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return false
      }

      let parent   = Dropdown._getParentFromElement(this)
      let isActive = $(parent).hasClass(ClassName.ACTIVE)

      Dropdown._clearMenus()

      if (isActive) {
        return false
      }

      if ('ontouchstart' in document.documentElement &&
         (!$(parent).closest(Selector.NAVBAR_NAV).length)) {

        // if mobile we use a backdrop because click events don't delegate
        let dropdown       = document.createElement('div')
        dropdown.className = ClassName.BACKDROP
        $(dropdown).insertBefore(this)
        $(dropdown).on('click', Dropdown._clearMenus)
      }

      let relatedTarget = { relatedTarget : this }
      let showEvent     = $.Event(Event.SHOW, relatedTarget)

      $(parent).trigger(showEvent)

      if (showEvent.isDefaultPrevented()) {
        return false
      }

      this.focus()
      this.setAttribute('aria-expanded', 'true')

      $(parent).toggleClass(ClassName.ACTIVE)
      $(parent).trigger($.Event(Event.SHOWN, relatedTarget))

      return false
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      $(this._element).off(EVENT_KEY)
      this._element = null
    }


    // private

    _addEventListeners() {
      $(this._element).on(Event.CLICK, this.toggle)
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data  = $(this).data(DATA_KEY)

        if (!data) {
          $(this).data(DATA_KEY, (data = new Dropdown(this)))
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
          }
          data[config].call(this)
        }
      })
    }

    static _clearMenus(event) {
      if (event && event.which === RIGHT_MOUSE_BUTTON_WHICH) {
        return
      }

      let backdrop = $(Selector.BACKDROP)[0]
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop)
      }

      let toggles = $.makeArray($(Selector.DATA_TOGGLE))

      for (let i = 0; i < toggles.length; i++) {
        let parent        = Dropdown._getParentFromElement(toggles[i])
        let relatedTarget = { relatedTarget : toggles[i] }

        if (!$(parent).hasClass(ClassName.ACTIVE)) {
          continue
        }

        if (event && event.type === 'click' &&
           (/input|textarea/i.test(event.target.tagName)) &&
           ($.contains(parent, event.target))) {
          continue
        }

        let hideEvent = $.Event(Event.HIDE, relatedTarget)
        $(parent).trigger(hideEvent)
        if (hideEvent.isDefaultPrevented()) {
          continue
        }

        toggles[i].setAttribute('aria-expanded', 'false')

        $(parent)
          .removeClass(ClassName.ACTIVE)
          .trigger($.Event(Event.HIDDEN, relatedTarget))
      }
    }

    static _getParentFromElement(element) {
      let parent
      let selector = Util.getSelectorFromElement(element)

      if (selector) {
        parent = $(selector)[0]
      }

      return parent || element.parentNode
    }

    static _dataApiKeydownHandler(event) {
      if (!/(38|40|27|32)/.test(event.which) ||
         /input|textarea/i.test(event.target.tagName)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return
      }

      let parent   = Dropdown._getParentFromElement(this)
      let isActive = $(parent).hasClass(ClassName.ACTIVE)

      if ((!isActive && event.which !== ESCAPE_KEYCODE) ||
           (isActive && event.which === ESCAPE_KEYCODE)) {

        if (event.which === ESCAPE_KEYCODE) {
          let toggle = $(parent).find(Selector.DATA_TOGGLE)[0]
          $(toggle).trigger('focus')
        }

        $(this).trigger('click')
        return
      }

      let items = $.makeArray($(Selector.VISIBLE_ITEMS))

      items = items.filter((item) => {
        return item.offsetWidth || item.offsetHeight
      })

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
    .on(Event.KEYDOWN_DATA_API, Selector.ROLE_MENU,    Dropdown._dataApiKeydownHandler)
    .on(Event.KEYDOWN_DATA_API, Selector.ROLE_LISTBOX, Dropdown._dataApiKeydownHandler)
    .on(Event.CLICK_DATA_API, Dropdown._clearMenus)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, Dropdown.prototype.toggle)
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
