/** =======================================================================
 * Bootstrap: dropdown.js v4.0.0
 * http://getbootstrap.com/javascript/#dropdown
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Add dropdown menus to nearly anything with this simple
 * plugin, including the navbar, tabs, and pills.
 *
 * Public Methods & Properties:
 *
 *   + $.dropdown
 *   + $.dropdown.noConflict
 *   + $.dropdown.Constructor
 *   + $.dropdown.Constructor.VERSION
 *   + $.dropdown.Constructor.prototype.toggle
 *
 * ========================================================================
 */

'use strict';


/**
 * Our dropdown class.
 * @param {Element!} element
 * @constructor
 */
var Dropdown = function (element) {
  $(element).on('click.bs.dropdown', this['toggle'])
}


/**
 * @const
 * @type {string}
 */
Dropdown['VERSION'] = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Dropdown._NAME = 'dropdown'


/**
 * @const
 * @type {string}
 * @private
 */
Dropdown._DATA_KEY = 'bs.dropdown'


/**
 * @const
 * @type {Function}
 * @private
 */
Dropdown._JQUERY_NO_CONFLICT = $.fn[Dropdown._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Dropdown._Event = {
  HIDE   : 'hide.bs.dropdown',
  HIDDEN : 'hidden.bs.dropdown',
  SHOW   : 'show.bs.dropdown',
  SHOWN  : 'shown.bs.dropdown'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Dropdown._ClassName = {
  BACKDROP : 'dropdown-backdrop',
  DISABLED : 'disabled',
  OPEN     : 'open'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Dropdown._Selector = {
  BACKDROP      : '.dropdown-backdrop',
  DATA_TOGGLE   : '[data-toggle="dropdown"]',
  FORM_CHILD    : '.dropdown form',
  ROLE_MENU     : '[role="menu"]',
  ROLE_LISTBOX  : '[role="listbox"]',
  NAVBAR_NAV    : '.navbar-nav',
  VISIBLE_ITEMS : '[role="menu"] li:not(.divider) a, [role="listbox"] li:not(.divider) a'
}


/**
 * Provides the jQuery Interface for the alert component.
 * @param {string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Dropdown._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data  = $(this).data(Dropdown._DATA_KEY)

    if (!data) {
      $(this).data(Dropdown._DATA_KEY, (data = new Dropdown(this)))
    }

    if (typeof opt_config === 'string') {
      data[opt_config].call(this)
    }
  })
}


/**
 * @param {Event=} opt_event
 * @private
 */
Dropdown._clearMenus = function (opt_event) {
  if (opt_event && opt_event.which == 3) {
    return
  }

  var backdrop = $(Dropdown._Selector.BACKDROP)[0]
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop)
  }

  var toggles = /** @type {Array.<Element>} */ ($.makeArray($(Dropdown._Selector.DATA_TOGGLE)))

  for (var i = 0; i < toggles.length; i++) {
    var parent = Dropdown._getParentFromElement(toggles[i])
    var relatedTarget = { 'relatedTarget': toggles[i] }

    if (!$(parent).hasClass(Dropdown._ClassName.OPEN)) {
      continue
    }

    var hideEvent = $.Event(Dropdown._Event.HIDE, relatedTarget)
    $(parent).trigger(hideEvent)
    if (hideEvent.isDefaultPrevented()) {
      continue
    }

    toggles[i].setAttribute('aria-expanded', 'false')

    $(parent)
      .removeClass(Dropdown._ClassName.OPEN)
      .trigger(Dropdown._Event.HIDDEN, relatedTarget)
  }
}


/**
 * @param {Element} element
 * @return {Element}
 * @private
 */
Dropdown._getParentFromElement = function (element) {
  var selector = Bootstrap.getSelectorFromElement(element)

  if (selector) {
    var parent = $(selector)[0]
  }

  return /** @type {Element} */ (parent || element.parentNode)
}


/**
 * @param {Event} event
 * @this {Element}
 * @private
 */
Dropdown._dataApiKeydownHandler = function (event) {
  if (!/(38|40|27|32)/.test(event.which) || /input|textarea/i.test(event.target.tagName)) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  if (this.disabled || $(this).hasClass(Dropdown._ClassName.DISABLED)) {
    return
  }

  var parent  = Dropdown._getParentFromElement(this)
  var isActive = $(parent).hasClass(Dropdown._ClassName.OPEN)

  if ((!isActive && event.which != 27) || (isActive && event.which == 27)) {
    if (event.which == 27) {
      var toggle = $(parent).find(Dropdown._Selector.DATA_TOGGLE)[0]
      $(toggle).trigger('focus')
    }
    $(this).trigger('click')
    return
  }

  var items = $.makeArray($(Dropdown._Selector.VISIBLE_ITEMS))

  items = items.filter(function (item) {
    return item.offsetWidth || item.offsetHeight
  })

  if (!items.length) {
    return
  }

  var index = items.indexOf(event.target)

  if (event.which == 38 && index > 0)                index--                        // up
  if (event.which == 40 && index < items.length - 1) index++                        // down
  if (!~index)                                       index = 0

  items[index].focus()
}


/**
 * Toggles the dropdown
 * @this {Element}
 * @return {boolean|undefined}
 */
Dropdown.prototype['toggle'] = function () {
  if (this.disabled || $(this).hasClass(Dropdown._ClassName.DISABLED)) {
    return
  }

  var parent   = Dropdown._getParentFromElement(this)
  var isActive = $(parent).hasClass(Dropdown._ClassName.OPEN)

  Dropdown._clearMenus()

  if (isActive) {
    return false
  }

  if ('ontouchstart' in document.documentElement && !$(parent).closest(Dropdown._Selector.NAVBAR_NAV).length) {
    // if mobile we use a backdrop because click events don't delegate
    var dropdown       = document.createElement('div')
    dropdown.className = Dropdown._ClassName.BACKDROP
    this.parentNode.insertBefore(this, dropdown)
    $(dropdown).on('click', Dropdown._clearMenus)
  }

  var relatedTarget = { 'relatedTarget': this }
  var showEvent     = $.Event(Dropdown._Event.SHOW, relatedTarget)

  $(parent).trigger(showEvent)

  if (showEvent.isDefaultPrevented()) {
    return
  }

  this.focus()
  this.setAttribute('aria-expanded', 'true')

  $(parent).toggleClass(Dropdown._ClassName.OPEN)

  $(parent).trigger(Dropdown._Event.SHOWN, relatedTarget)

  return false
}


/**
 * ------------------------------------------------------------------------
 * jQuery Interface + noConflict implementaiton
 * ------------------------------------------------------------------------
 */

/**
 * @const
 * @type {Function}
 */
$.fn[Dropdown._NAME] = Dropdown._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Dropdown._NAME]['Constructor'] = Dropdown


/**
 * @const
 * @type {Function}
 */
$.fn[Dropdown._NAME]['noConflict'] = function () {
  $.fn[Dropdown._NAME] = Dropdown._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on('click.bs.dropdown.data-api',   Dropdown._clearMenus)
  .on('click.bs.dropdown.data-api',   Dropdown._Selector.FORM_CHILD,   function (e) { e.stopPropagation() })
  .on('click.bs.dropdown.data-api',   Dropdown._Selector.DATA_TOGGLE,  Dropdown.prototype['toggle'])
  .on('keydown.bs.dropdown.data-api', Dropdown._Selector.DATA_TOGGLE,  Dropdown._dataApiKeydownHandler)
  .on('keydown.bs.dropdown.data-api', Dropdown._Selector.ROLE_MENU,    Dropdown._dataApiKeydownHandler)
  .on('keydown.bs.dropdown.data-api', Dropdown._Selector.ROLE_LISTBOX, Dropdown._dataApiKeydownHandler)
