/** =======================================================================
 * Bootstrap: modal.js v4.0.0
 * http://getbootstrap.com/javascript/#modal
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's modal plugin. Modals are streamlined, but
 * flexible, dialog prompts with the minimum required functionality and
 * smart defaults.
 *
 * Public Methods & Properties:
 *
 *   + $.modal
 *   + $.modal.noConflict
 *   + $.modal.Constructor
 *   + $.modal.Constructor.VERSION
 *   + $.modal.Constructor.Defaults
 *   + $.modal.Constructor.Defaults.backdrop
 *   + $.modal.Constructor.Defaults.keyboard
 *   + $.modal.Constructor.Defaults.show
 *   + $.modal.Constructor.prototype.toggle
 *   + $.modal.Constructor.prototype.show
 *   + $.modal.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our modal class.
 * @param {Element} element
 * @param {Object} config
 * @constructor
 */
var Modal = function (element, config) {

  /** @private {Object} */
  this._config = config

  /** @private {Element} */
  this._element = element

  /** @private {Element} */
  this._backdrop = null

  /** @private {boolean} */
  this._isShown = false

  /** @private {boolean} */
  this._isBodyOverflowing = false

  /** @private {number} */
  this._scrollbarWidth = 0

}


/**
 * @const
 * @type {string}
 */
Modal['VERSION']  = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Modal['Defaults'] = {
  'backdrop' : true,
  'keyboard' : true,
  'show'     : true
}


/**
 * @const
 * @type {string}
 * @private
 */
Modal._NAME = 'modal'


/**
 * @const
 * @type {string}
 * @private
 */
Modal._DATA_KEY = 'bs.modal'


/**
 * @const
 * @type {number}
 * @private
 */
Modal._TRANSITION_DURATION = 300


/**
 * @const
 * @type {number}
 * @private
 */
Modal._BACKDROP_TRANSITION_DURATION = 150


/**
 * @const
 * @type {Function}
 * @private
 */
Modal._JQUERY_NO_CONFLICT = $.fn[Modal._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Modal._Event = {
  HIDE   : 'hide.bs.modal',
  HIDDEN : 'hidden.bs.modal',
  SHOW   : 'show.bs.modal',
  SHOWN  : 'shown.bs.modal'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Modal._ClassName = {
  BACKDROP : 'modal-backdrop',
  OPEN     : 'modal-open',
  FADE     : 'fade',
  IN       : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Modal._Selector = {
  DIALOG             : '.modal-dialog',
  DATA_TOGGLE        : '[data-toggle="modal"]',
  DATA_DISMISS       : '[data-dismiss="modal"]',
  SCROLLBAR_MEASURER : 'modal-scrollbar-measure'
}



/**
 * Provides the jQuery Interface for the alert component.
 * @param {Object|string=} opt_config
 * @param {Element=} opt_relatedTarget
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Modal._jQueryInterface = function Plugin(opt_config, opt_relatedTarget) {
  return this.each(function () {
    var data   = $(this).data(Modal._DATA_KEY)
    var config = $.extend({}, Modal['Defaults'], $(this).data(), typeof opt_config == 'object' && opt_config)

    if (!data) {
      data = new Modal(this, config)
      $(this).data(Modal._DATA_KEY, data)
    }

    if (typeof opt_config == 'string') {
      data[opt_config](opt_relatedTarget)

    } else if (config['show']) {
      data['show'](opt_relatedTarget)
    }
  })
}


/**
 * @param {Element} relatedTarget
 */
Modal.prototype['toggle'] = function (relatedTarget) {
  return this._isShown ? this['hide']() : this['show'](relatedTarget)
}


/**
 * @param {Element} relatedTarget
 */
Modal.prototype['show'] = function (relatedTarget) {
  var showEvent = $.Event(Modal._Event.SHOW, { relatedTarget: relatedTarget })

  $(this._element).trigger(showEvent)

  if (this._isShown || showEvent.isDefaultPrevented()) {
    return
  }

  this._isShown = true

  this._checkScrollbar()
  this._setScrollbar()

  $(document.body).addClass(Modal._ClassName.OPEN)

  this._escape()
  this._resize()

  $(this._element).on('click.dismiss.bs.modal', Modal._Selector.DATA_DISMISS, this['hide'].bind(this))

  this._showBackdrop(this._showElement.bind(this, relatedTarget))
}


/**
 * @param {Event} event
 */
Modal.prototype['hide'] = function (event) {
  if (event) {
    event.preventDefault()
  }

  var hideEvent = $.Event(Modal._Event.HIDE)

  $(this._element).trigger(hideEvent)

  if (!this._isShown || hideEvent.isDefaultPrevented()) {
    return
  }

  this._isShown = false

  this._escape()
  this._resize()

  $(document).off('focusin.bs.modal')

  $(this._element).removeClass(Modal._ClassName.IN)
  this._element.setAttribute('aria-hidden', true)

  $(this._element).off('click.dismiss.bs.modal')

  if (Bootstrap.transition && $(this._element).hasClass(Modal._ClassName.FADE)) {
    $(this._element)
      .one(Bootstrap.TRANSITION_END, this._hideModal.bind(this))
      .emulateTransitionEnd(Modal._TRANSITION_DURATION)
  } else {
    this._hideModal()
  }
}


/**
 * @param {Element} relatedTarget
 * @private
 */
Modal.prototype._showElement = function (relatedTarget) {
  var transition = Bootstrap.transition && $(this._element).hasClass(Modal._ClassName.FADE)

  if (!this._element.parentNode || this._element.parentNode.nodeType != Node.ELEMENT_NODE) {
    document.body.appendChild(this._element) // don't move modals dom position
  }

  this._element.style.display = 'block'
  this._element.scrollTop = 0

  if (this._config['backdrop']) {
    this._adjustBackdrop()
  }

  if (transition) {
    Bootstrap.reflow(this._element)
  }

  $(this._element).addClass(Modal._ClassName.IN)
  this._element.setAttribute('aria-hidden', false)

  this._enforceFocus()

  var shownEvent = $.Event(Modal._Event.SHOWN, { relatedTarget: relatedTarget })

  var transitionComplete = function () {
    this._element.focus()
    $(this._element).trigger(shownEvent)
  }.bind(this)

  if (transition) {
    var dialog = $(this._element).find(Modal._Selector.DIALOG)[0]
    $(dialog)
      .one(Bootstrap.TRANSITION_END, transitionComplete)
      .emulateTransitionEnd(Modal._TRANSITION_DURATION)
  } else {
    transitionComplete()
  }
}



/**
 * @private
 */
Modal.prototype._enforceFocus = function () {
  $(document)
    .off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', function (e) {
      if (this._element !== e.target && !$(this._element).has(e.target).length) {
        this._element.focus()
      }
    }.bind(this))
}


/**
 * @private
 */
Modal.prototype._escape = function () {
  if (this._isShown && this._config['keyboard']) {
    $(this._element).on('keydown.dismiss.bs.modal', function (event) {
      if (event.which === 27) {
        this['hide']()
      }
    }.bind(this))

  } else if (!this._isShown) {
    $(this._element).off('keydown.dismiss.bs.modal')
  }
}


/**
 * @private
 */
Modal.prototype._resize = function () {
  if (this._isShown) {
    $(window).on('resize.bs.modal', this._handleUpdate.bind(this))
  } else {
    $(window).off('resize.bs.modal')
  }
}


/**
 * @private
 */
Modal.prototype._hideModal = function () {
  this._element.style.display = 'none'
  this._showBackdrop(function () {
    $(document.body).removeClass(Modal._ClassName.OPEN)
    this._resetAdjustments()
    this._resetScrollbar()
    $(this._element).trigger(Modal._Event.HIDDEN)
  }.bind(this))
}


/**
 * @private
 */
Modal.prototype._removeBackdrop = function () {
  if (this._backdrop) {
    this._backdrop.parentNode.removeChild(this._backdrop)
    this._backdrop = null
  }
}


/**
 * @param {Function} callback
 * @private
 */
Modal.prototype._showBackdrop = function (callback) {
  var animate = $(this._element).hasClass(Modal._ClassName.FADE) ? Modal._ClassName.FADE : ''

  if (this._isShown && this._config['backdrop']) {
    var doAnimate = Bootstrap.transition && animate

    this._backdrop = document.createElement('div')
    this._backdrop.className = Modal._ClassName.BACKDROP

    if (animate) {
      $(this._backdrop).addClass(animate)
    }

    $(this._element).prepend(this._backdrop)

    $(this._backdrop).on('click.dismiss.bs.modal', function (event) {
      if (event.target !== event.currentTarget) return
      this._config['backdrop'] === 'static'
        ? this._element.focus()
        : this['hide']()
    }.bind(this))

    if (doAnimate) {
      Bootstrap.reflow(this._backdrop)
    }

    $(this._backdrop).addClass(Modal._ClassName.IN)

    if (!callback) {
      return
    }

    if (!doAnimate) {
      callback()
      return
    }

    $(this._backdrop)
      .one(Bootstrap.TRANSITION_END, callback)
      .emulateTransitionEnd(Modal._BACKDROP_TRANSITION_DURATION)

  } else if (!this._isShown && this._backdrop) {
    $(this._backdrop).removeClass(Modal._ClassName.IN)

    var callbackRemove = function () {
      this._removeBackdrop()
      if (callback) {
        callback()
      }
    }.bind(this)

    if (Bootstrap.transition && $(this._element).hasClass(Modal._ClassName.FADE)) {
      $(this._backdrop)
        .one(Bootstrap.TRANSITION_END, callbackRemove)
        .emulateTransitionEnd(Modal._BACKDROP_TRANSITION_DURATION)
    } else {
      callbackRemove()
    }

  } else if (callback) {
    callback()
  }
}


/**
 * ------------------------------------------------------------------------
 * the following methods are used to handle overflowing modals
 * todo (fat): these should probably be refactored into a
 * ------------------------------------------------------------------------
 */


/**
 * @private
 */
Modal.prototype._handleUpdate = function () {
  if (this._config['backdrop']) this._adjustBackdrop()
  this._adjustDialog()
}

/**
 * @private
 */
Modal.prototype._adjustBackdrop = function () {
  this._backdrop.style.height = 0 // todo (fat): no clue why we do this
  this._backdrop.style.height = this._element.scrollHeight + 'px'
}


/**
 * @private
 */
Modal.prototype._adjustDialog = function () {
  var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight

  if (!this._isBodyOverflowing && isModalOverflowing) {
    this._element.style.paddingLeft = this._scrollbarWidth + 'px'
  }

  if (this._isBodyOverflowing && !isModalOverflowing) {
    this._element.style.paddingRight = this._scrollbarWidth + 'px'
  }
}


/**
 * @private
 */
Modal.prototype._resetAdjustments = function () {
  this._element.style.paddingLeft = ''
  this._element.style.paddingRight = ''
}


/**
 * @private
 */
Modal.prototype._checkScrollbar = function () {
  this._isBodyOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
  this._scrollbarWidth = this._getScrollbarWidth()
}


/**
 * @private
 */
Modal.prototype._setScrollbar = function () {
  var bodyPadding = parseInt(($(document.body).css('padding-right') || 0), 10)

  if (this._isBodyOverflowing) {
    document.body.style.paddingRight = bodyPadding + this._scrollbarWidth + 'px'
  }
}


/**
 * @private
 */
Modal.prototype._resetScrollbar = function () {
  document.body.style.paddingRight = ''
}


/**
 * @private
 */
Modal.prototype._getScrollbarWidth = function () { // thx walsh
  var scrollDiv = document.createElement('div')
  scrollDiv.className = Modal._Selector.SCROLLBAR_MEASURER
  document.body.appendChild(scrollDiv)
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
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
$.fn[Modal._NAME] = Modal._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Modal._NAME]['Constructor'] = Modal


/**
 * @const
 * @type {Function}
 */
$.fn[Modal._NAME]['noConflict'] = function () {
  $.fn[Modal._NAME] = Modal._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.modal.data-api', Modal._Selector.DATA_TOGGLE, function (event) {
  var selector = Bootstrap.getSelectorFromElement(this)

  if (selector) {
    var target = $(selector)[0]
  }

  var config = $(target).data(Modal._DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data())

  if (this.tagName == 'A') {
    event.preventDefault()
  }

  var $target = $(target).one(Modal._Event.SHOW, function (showEvent) {
    if (showEvent.isDefaultPrevented()) {
      return // only register focus restorer if modal will actually get shown
    }

    $target.one(Modal._Event.HIDDEN, function () {
      if ($(this).is(':visible')) {
        this.focus()
      }
    }.bind(this))
  }.bind(this))

  Modal._jQueryInterface.call($(target), config, this)
})
