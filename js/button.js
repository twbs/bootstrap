/** =======================================================================
 * Bootstrap: button.js v4.0.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's generic button component.
 *
 * Note (@fat): Deprecated "setState" – imo, better solutions for managing a
 * buttons state should exist outside this plugin.
 *
 * Public Methods & Properties:
 *
 *   + $.button
 *   + $.button.noConflict
 *   + $.button.Constructor
 *   + $.button.Constructor.VERSION
 *   + $.button.Constructor.prototype.toggle
 *
 * ========================================================================
 */

'use strict';


/**
 * Our Button class.
 * @param {Element!} element
 * @constructor
 */
var Button = function (element) {

  /** @private {Element} */
  this._element = element

}


/**
 * @const
 * @type {string}
 */
Button['VERSION']  = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Button._NAME  = 'button'


/**
 * @const
 * @type {string}
 * @private
 */
Button._DATA_KEY = 'bs.button'


/**
 * @const
 * @type {Function}
 * @private
 */
Button._JQUERY_NO_CONFLICT = $.fn[Button._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Button._ClassName = {
  ACTIVE : 'active',
  BUTTON : 'btn',
  FOCUS  : 'focus'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Button._Selector = {
  DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
  DATA_TOGGLE        : '[data-toggle="buttons"]',
  INPUT              : 'input',
  ACTIVE             : '.active',
  BUTTON             : '.btn'
}


/**
 * Provides the jQuery Interface for the Button component.
 * @param {string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Button._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data  = $(this).data(Button._DATA_KEY)

    if (!data) {
      data = new Button(this)
      $(this).data(Button._DATA_KEY, data)
    }

    if (opt_config === 'toggle') {
      data[opt_config]()
    }
  })
}


/**
 * Toggle's the button active state
 */
Button.prototype['toggle'] = function () {
  var triggerChangeEvent = true
  var rootElement = $(this._element).closest(Button._Selector.DATA_TOGGLE)[0]

  if (rootElement) {
    var input = $(this._element).find(Button._Selector.INPUT)[0]
    if (input) {
      if (input.type == 'radio') {
        if (input.checked && $(this._element).hasClass(Button._ClassName.ACTIVE)) {
          triggerChangeEvent = false
        } else {
          var activeElement = $(rootElement).find(Button._Selector.ACTIVE)[0]
          if (activeElement) {
            $(activeElement).removeClass(Button._ClassName.ACTIVE)
          }
        }
      }

      if (triggerChangeEvent) {
        input.checked = !$(this._element).hasClass(Button._ClassName.ACTIVE)
        $(this._element).trigger('change')
      }
    }
  } else {
    this._element.setAttribute('aria-pressed', !$(this._element).hasClass(Button._ClassName.ACTIVE))
  }

  if (triggerChangeEvent) {
    $(this._element).toggleClass(Button._ClassName.ACTIVE)
  }
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
$.fn[Button._NAME] = Button._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Button._NAME]['Constructor'] = Button


/**
 * @const
 * @type {Function}
 */
$.fn[Button._NAME]['noConflict'] = function () {
  $.fn[Button._NAME] = Button._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on('click.bs.button.data-api', Button._Selector.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault()

    var button = event.target

    if (!$(button).hasClass(Button._ClassName.BUTTON)) {
      button = $(button).closest(Button._Selector.BUTTON)
    }

    Button._jQueryInterface.call($(button), 'toggle')
  })
  .on('focus.bs.button.data-api blur.bs.button.data-api', Button._Selector.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Button._Selector.BUTTON)[0]
    $(button).toggleClass(Button._ClassName.FOCUS, /^focus(in)?$/.test(event.type))
  })
