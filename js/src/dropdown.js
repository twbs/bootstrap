/* global Tether */

import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.2): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Dropdown = (($) => {

  /**
   * Check for Tether dependency
   * Tether - http://github.hubspot.com/tether/
   */
  if (window.Tether === undefined) {
    throw new Error('Bootstrap dropdowns require Tether (http://github.hubspot.com/tether/)')
  }


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'dropdown'
  const VERSION             = '4.0.0-alpha.2'
  const DATA_KEY            = 'bs.dropdown'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const CLASS_PREFIX        = 'bs-tether'

  const Default = {
    attachment       : 'top left',
    targetAttachment : 'bottom left',
    offset           : '2 0',
    constraints      : [
      {
        to: 'window',
        attachment: 'together',
        pin: true
      }
    ]
  }

  const DefaultType = {
    attachment       : 'string',
    targetAttachment : 'string',
    offset           : 'string',
    constraints      : 'array'
  }

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
    OPEN     : 'open'
  }

  const Selector = {
    BACKDROP      : '.dropdown-backdrop',
    DATA_TOGGLE   : '[data-toggle="dropdown"]',
    FORM_CHILD    : '.dropdown form',
    DROPDOWN_MENU : '.dropdown-menu',
    ROLE_MENU     : '[role="menu"]',
    ROLE_LISTBOX  : '[role="listbox"]',
    NAVBAR_NAV    : '.navbar-nav',
    VISIBLE_ITEMS : '[role="menu"] li:not(.disabled) a, '
                  + '[role="listbox"] li:not(.disabled) a'
  }

  const TetherClass = {
    element : false,
    enabled : false
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown {

    constructor(element, config) {
      // private
      this._tether  = null

      // protected
      this.element   = element
      this.config    = this._getConfig(config)
      this.menu      = this.getMenuElement()

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
      let context = $(this).data(DATA_KEY)

      if (!context) {
        context = new Dropdown(this)
        $(this).data(DATA_KEY, context)
      }

      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return false
      }

      let parent   = Dropdown._getParentFromElement(this)
      let isActive = $(context.menu).hasClass(ClassName.OPEN)

      Dropdown._clearMenus()

      if (isActive) {
        return false
      }

      context._tether = new Tether({
        attachment       : context.config.attachment,
        targetAttachment : context.config.targetAttachment,
        element          : context.menu,
        target           : this,
        classes          : TetherClass,
        classPrefix      : CLASS_PREFIX,
        offset           : context.config.offset,
        constraints      : context.config.constraints,
        addTargetClasses : false
      })

      context._tether.position()

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

      this.setAttribute('aria-expanded', true)

      $(context.menu).toggleClass(ClassName.OPEN)
      $(parent)
        .toggleClass(ClassName.OPEN)
        .trigger($.Event(Event.SHOWN, relatedTarget))

      return false
    }

    dispose() {
      this.cleanupTether()

      $.removeData(this.element, DATA_KEY)
      $(this.element).off(EVENT_KEY)

      this._tether = null
      this.menu    = null
      this.element = null
    }

    cleanupTether() {
      if (this._tether) {
        this._tether.destroy()
      }
    }


    // protected

    getMenuElement() {
      if (!this.menu) {
        let parent = Dropdown._getParentFromElement(this.element)
        this.menu = $(parent).find(Selector.DROPDOWN_MENU)[0]
      }
      return this.menu
    }


    // private

    _addEventListeners() {
      $(this.element).on(Event.CLICK, this.toggle)
    }

    _getConfig(config) {
      config = $.extend(
        {},
        this.constructor.Default,
        $(this.element).data(),
        config
      )

      Util.typeCheckConfig(
        NAME,
        config,
        this.constructor.DefaultType
      )

      return config
    }

    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data  = $(this).data(DATA_KEY)
        let _config = typeof config === 'object' ?
          config : null

        if (!data) {
          data = new Dropdown(this, _config)
          $(this).data(DATA_KEY, data)
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
      if (event && event.which === 3) {
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
        let context       = $(toggles[i]).data(DATA_KEY)

        if (context) {
          let dropdownMenu  = context.menu

          if (!$(dropdownMenu).hasClass(ClassName.OPEN)) {
            continue
          }

          if (event && event.type === 'click' &&
             (/input|textarea/i.test(event.target.tagName)) &&
             ($.contains(dropdownMenu, event.target))) {
            continue
          }

          let hideEvent = $.Event(Event.HIDE, relatedTarget)
          $(parent).trigger(hideEvent)
          if (hideEvent.isDefaultPrevented()) {
            continue
          }

          toggles[i].setAttribute('aria-expanded', false)
          $(dropdownMenu).removeClass(ClassName.OPEN)

          $(parent)
            .removeClass(ClassName.OPEN)
            .trigger($.Event(Event.HIDDEN, relatedTarget))
        }
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
      let isActive = $(this).hasClass(ClassName.OPEN)

      if ((!isActive && event.which !== 27) ||
           (isActive && event.which === 27)) {

        if (event.which === 27) {
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

      if (event.which === 38 && index > 0) { // up
        index--
      }

      if (event.which === 40 && index < items.length - 1) { // down
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
