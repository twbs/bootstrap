/** =======================================================================
 * Bootstrap: tab.js v4.0.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's tab plugin. Tab O_O
 *
 * Public Methods & Properties:
 *
 *   + $.tab
 *   + $.tab.noConflict
 *   + $.tab.Constructor
 *   + $.tab.Constructor.VERSION
 *   + $.tab.Constructor.prototype.show
 *
 * ========================================================================
 */


'use strict';

/**
 * Our Tab class.
 * @param {Element!} element
 * @constructor
 */
var Tab = function (element) {

  /** @type {Element} */
  this._element = element

}


/**
 * @const
 * @type {string}
 */
Tab['VERSION'] = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Tab._NAME = 'tab'


/**
 * @const
 * @type {string}
 * @private
 */
Tab._DATA_KEY = 'bs.tab'


/**
 * @const
 * @type {number}
 * @private
 */
Tab._TRANSITION_DURATION = 150


/**
 * @const
 * @enum {string}
 * @private
 */
Tab._Event = {
  HIDE   : 'hide.bs.tab',
  HIDDEN : 'hidden.bs.tab',
  SHOW   : 'show.bs.tab',
  SHOWN  : 'shown.bs.tab'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tab._ClassName = {
  DROPDOWN_MENU : 'dropdown-menu',
  ACTIVE        : 'active',
  FADE          : 'fade',
  IN            : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tab._Selector = {
  A                     : 'a',
  LI                    : 'li',
  LI_DROPDOWN           : 'li.dropdown',
  UL                    : 'ul:not(.dropdown-menu)',
  FADE_CHILD            : ':scope > .fade',
  ACTIVE                : '.active',
  ACTIVE_CHILD          : ':scope > .active',
  DATA_TOGGLE           : '[data-toggle="tab"], [data-toggle="pill"]',
  DROPDOWN_ACTIVE_CHILD : ':scope > .dropdown-menu > .active'
}


/**
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Tab._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var $this = $(this)
    var data  = $this.data(Tab._DATA_KEY)

    if (!data) {
      data = data = new Tab(this)
      $this.data(Tab._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Show the tab
 */
Tab.prototype['show'] = function () {
  if ( this._element.parentNode
    && this._element.parentNode.nodeType == Node.ELEMENT_NODE
    && $(this._element).parent().hasClass(Tab._ClassName.ACTIVE)) {
    return
  }

  var ulElement = $(this._element).closest(Tab._Selector.UL)[0]
  var selector  = Bootstrap.getSelectorFromElement(this._element)

  if (ulElement) {
    var previous = /** @type {Array.<Element>} */ ($.makeArray($(ulElement).find(Tab._Selector.ACTIVE)))
    previous = previous[previous.length - 1]

    if (previous) {
      previous = $(previous).find('a')[0]
    }
  }

  var hideEvent = $.Event(Tab._Event.HIDE, {
    relatedTarget: this._element
  })

  var showEvent = $.Event(Tab._Event.SHOW, {
    relatedTarget: previous
  })

  if (previous) {
    $(previous).trigger(hideEvent)
  }

  $(this._element).trigger(showEvent)

  if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

  if (selector) {
    var target = $(selector)[0]
  }

  this._activate($(this._element).closest(Tab._Selector.LI)[0], ulElement)

  var complete = function () {
    var hiddenEvent = $.Event(Tab._Event.HIDDEN, {
      relatedTarget: this._element
    })

    var shownEvent  = $.Event(Tab._Event.SHOWN, {
      relatedTarget: previous
    })

    $(previous).trigger(hiddenEvent)
    $(this._element).trigger(shownEvent)
  }.bind(this)

  if (target) {
    this._activate(target, /** @type {Element} */ (target.parentNode), complete)
  } else {
    complete()
  }
}


/**
 * @param {Element} element
 * @param {Element} container
 * @param {Function=} opt_callback
 * @private
 */
Tab.prototype._activate = function (element, container, opt_callback) {
  var active          = $(container).find(Tab._Selector.ACTIVE_CHILD)[0]
  var isTransitioning = opt_callback
    && Bootstrap.transition
    && ((active && $(active).hasClass(Tab._ClassName.FADE))
       || !!$(container).find(Tab._Selector.FADE_CHILD)[0])

  var complete = this._transitionComplete.bind(this, element, active, isTransitioning, opt_callback)

  if (active && isTransitioning) {
    $(active)
      .one(Bootstrap.TRANSITION_END, complete)
      .emulateTransitionEnd(Tab._TRANSITION_DURATION)

  } else {
    complete()
  }

  if (active) {
    $(active).removeClass(Tab._ClassName.IN)
  }
}


/**
 * @param {Element} element
 * @param {Element} active
 * @param {boolean} isTransitioning
 * @param {Function=} opt_callback
 * @private
 */
Tab.prototype._transitionComplete = function (element, active, isTransitioning, opt_callback) {
  if (active) {
    $(active).removeClass(Tab._ClassName.ACTIVE)

    var dropdownChild = $(active).find(Tab._Selector.DROPDOWN_ACTIVE_CHILD)[0]
    if (dropdownChild) {
      $(dropdownChild).removeClass(Tab._ClassName.ACTIVE)
    }

    var activeToggle = $(active).find(Tab._Selector.DATA_TOGGLE)[0]
    if (activeToggle) {
      activeToggle.setAttribute('aria-expanded', false)
    }
  }

  $(element).addClass(Tab._ClassName.ACTIVE)

  var elementToggle = $(element).find(Tab._Selector.DATA_TOGGLE)[0]
  if (elementToggle) {
    elementToggle.setAttribute('aria-expanded', true)
  }

  if (isTransitioning) {
    Bootstrap.reflow(element)
    $(element).addClass(Tab._ClassName.IN)
  } else {
    $(element).removeClass(Tab._ClassName.FADE)
  }

  if (element.parentNode && $(element.parentNode).hasClass(Tab._ClassName.DROPDOWN_MENU)) {
    var dropdownElement = $(element).closest(Tab._Selector.LI_DROPDOWN)[0]
    if (dropdownElement) {
      $(dropdownElement).addClass(Tab._ClassName.ACTIVE)
    }

    elementToggle = $(element).find(Tab._Selector.DATA_TOGGLE)[0]
    if (elementToggle) {
      elementToggle.setAttribute('aria-expanded', true)
    }
  }

  if (opt_callback) {
    opt_callback()
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
$.fn[Tab._NAME] = Tab._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Tab._NAME]['Constructor'] = Tab


/**
 * @const
 * @type {Function}
 */
$.fn[Tab._NAME]['noConflict'] = function () {
  $.fn[Tab._NAME] = Tab._JQUERY_NO_CONFLICT
  return this
}



// TAB DATA-API
// ============

var clickHandler = function (e) {
  e.preventDefault()
  Tab._jQueryInterface.call($(this), 'show')
}

$(document)
  .on('click.bs.tab.data-api', Tab._Selector.DATA_TOGGLE, clickHandler)
