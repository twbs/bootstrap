/** =======================================================================
 * Bootstrap: scrollspy.js v4.0.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's scrollspy plugin.
 *
 * Public Methods & Properties:
 *
 *   + $.scrollspy
 *   + $.scrollspy.noConflict
 *   + $.scrollspy.Constructor
 *   + $.scrollspy.Constructor.VERSION
 *   + $.scrollspy.Constructor.Defaults
 *   + $.scrollspy.Constructor.Defaults.offset
 *   + $.scrollspy.Constructor.prototype.refresh
 *
 * ========================================================================
 */

'use strict';


/**
 * Our scrollspy class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
function ScrollSpy(element, opt_config) {

  /** @private {Element|Window} */
  this._scrollElement = element.tagName == 'BODY' ? window : element

  /** @private {Object} */
  this._config = $.extend({}, ScrollSpy['Defaults'], opt_config)

  /** @private {string} */
  this._selector = (this._config.target || '') + ' .nav li > a'

  /** @private {Array} */
  this._offsets = []

  /** @private {Array} */
  this._targets = []

  /** @private {Element} */
  this._activeTarget = null

  /** @private {number} */
  this._scrollHeight = 0

  $(this._scrollElement).on('scroll.bs.scrollspy', this._process.bind(this))

  this['refresh']()

  this._process()
}


/**
 * @const
 * @type {string}
 */
ScrollSpy['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
ScrollSpy['Defaults'] = {
  'offset': 10
}


/**
 * @const
 * @type {string}
 * @private
 */
ScrollSpy._NAME = 'scrollspy'


/**
 * @const
 * @type {string}
 * @private
 */
ScrollSpy._DATA_KEY = 'bs.scrollspy'


/**
 * @const
 * @type {Function}
 * @private
 */
ScrollSpy._JQUERY_NO_CONFLICT = $.fn[ScrollSpy._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
ScrollSpy._Event = {
  ACTIVATE: 'activate.bs.scrollspy'
}


/**
 * @const
 * @enum {string}
 * @private
 */
ScrollSpy._ClassName = {
  DROPDOWN_MENU : 'dropdown-menu',
  ACTIVE        : 'active'
}


/**
 * @const
 * @enum {string}
 * @private
 */
ScrollSpy._Selector = {
  DATA_SPY    : '[data-spy="scroll"]',
  ACTIVE      : '.active',
  LI_DROPDOWN : 'li.dropdown',
  LI          : 'li'
}


/**
 * @param {Object=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
ScrollSpy._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(ScrollSpy._DATA_KEY)
    var config = typeof opt_config === 'object' && opt_config || null

    if (!data) {
      data = new ScrollSpy(this, config)
      $(this).data(ScrollSpy._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Refresh the scrollspy target cache
 */
ScrollSpy.prototype['refresh'] = function () {
  var offsetMethod = 'offset'
  var offsetBase   = 0

  if (this._scrollElement !== this._scrollElement.window) {
    offsetMethod = 'position'
    offsetBase   = this._getScrollTop()
  }

  this._offsets = []
  this._targets = []

  this._scrollHeight = this._getScrollHeight()

  var targets = /** @type {Array.<Element>} */ ($.makeArray($(this._selector)))

  targets
    .map(function (element, index) {
      var target
      var targetSelector = Bootstrap.getSelectorFromElement(element)

      if (targetSelector) {
        target = $(targetSelector)[0]
      }

      if (target && (target.offsetWidth || target.offsetHeight)) {
        // todo (fat): remove sketch reliance on jQuery position/offset
        return [$(target)[offsetMethod]().top + offsetBase, targetSelector]
      }
    })
    .filter(function (item) { return item })
    .sort(function (a, b) { return a[0] - b[0] })
    .forEach(function (item, index) {
      this._offsets.push(item[0])
      this._targets.push(item[1])
    }.bind(this))
}


/**
 * @private
 */
ScrollSpy.prototype._getScrollTop = function () {
  return this._scrollElement === window ?
      this._scrollElement.scrollY : this._scrollElement.scrollTop
}


/**
 * @private
 */
ScrollSpy.prototype._getScrollHeight = function () {
  return this._scrollElement.scrollHeight
      || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}


/**
 * @private
 */
ScrollSpy.prototype._process = function () {
  var scrollTop    = this._getScrollTop() + this._config.offset
  var scrollHeight = this._getScrollHeight()
  var maxScroll    = this._config.offset + scrollHeight - this._scrollElement.offsetHeight

  if (this._scrollHeight != scrollHeight) {
    this['refresh']()
  }

  if (scrollTop >= maxScroll) {
    var target = this._targets[this._targets.length - 1]

    if (this._activeTarget != target) {
      this._activate(target)
    }
  }

  if (this._activeTarget && scrollTop < this._offsets[0]) {
    this._activeTarget = null
    this._clear()
    return
  }

  for (var i = this._offsets.length; i--;) {
    var isActiveTarget = this._activeTarget != this._targets[i]
        && scrollTop >= this._offsets[i]
        && (!this._offsets[i + 1] || scrollTop < this._offsets[i + 1])

    if (isActiveTarget) {
      this._activate(this._targets[i])
    }
  }
}


/**
 * @param {Element} target
 * @private
 */
ScrollSpy.prototype._activate = function (target) {
  this._activeTarget = target

  this._clear()

  var selector = this._selector
      + '[data-target="' + target + '"],'
      + this._selector + '[href="' + target + '"]'

  // todo (fat): this seems horribly wrong… getting all raw li elements up the tree ,_,
  var parentListItems = $(selector).parents(ScrollSpy._Selector.LI)

  for (var i = parentListItems.length; i--;) {
    $(parentListItems[i]).addClass(ScrollSpy._ClassName.ACTIVE)

    var itemParent = parentListItems[i].parentNode

    if (itemParent && $(itemParent).hasClass(ScrollSpy._ClassName.DROPDOWN_MENU)) {
      var closestDropdown = $(itemParent).closest(ScrollSpy._Selector.LI_DROPDOWN)[0]
      $(closestDropdown).addClass(ScrollSpy._ClassName.ACTIVE)
    }
  }

  $(this._scrollElement).trigger(ScrollSpy._Event.ACTIVATE, {
    relatedTarget: target
  })
}


/**
 * @private
 */
ScrollSpy.prototype._clear = function () {
  var activeParents = $(this._selector).parentsUntil(this._config.target, ScrollSpy._Selector.ACTIVE)

  for (var i = activeParents.length; i--;) {
    $(activeParents[i]).removeClass(ScrollSpy._ClassName.ACTIVE)
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
$.fn[ScrollSpy._NAME] = ScrollSpy._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[ScrollSpy._NAME]['Constructor'] = ScrollSpy


/**
 * @const
 * @type {Function}
 */
$.fn[ScrollSpy._NAME]['noConflict'] = function () {
  $.fn[ScrollSpy._NAME] = ScrollSpy._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(window).on('load.bs.scrollspy.data-api', function () {
  var scrollSpys = /** @type {Array.<Element>} */ ($.makeArray($(ScrollSpy._Selector.DATA_SPY)))

  for (var i = scrollSpys.length; i--;) {
    var $spy = $(scrollSpys[i])
    ScrollSpy._jQueryInterface.call($spy, /** @type {Object|null} */ ($spy.data()))
  }
})
