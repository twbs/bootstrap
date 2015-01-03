/** =======================================================================
 * Bootstrap: collapse.js v4.0.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's collapse plugin. Flexible support for
 * collapsible components like accordions and navigation.
 *
 * Public Methods & Properties:
 *
 *   + $.carousel
 *   + $.carousel.noConflict
 *   + $.carousel.Constructor
 *   + $.carousel.Constructor.VERSION
 *   + $.carousel.Constructor.Defaults
 *   + $.carousel.Constructor.Defaults.toggle
 *   + $.carousel.Constructor.Defaults.trigger
 *   + $.carousel.Constructor.Defaults.parent
 *   + $.carousel.Constructor.prototype.toggle
 *   + $.carousel.Constructor.prototype.show
 *   + $.carousel.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our collapse class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
var Collapse = function (element, opt_config) {

  /** @private {Element} */
  this._element  = element

  /** @private {Object} */
  this._config = $.extend({}, Collapse['Defaults'], opt_config)

  /** @private {Element} */
  this._trigger = typeof this._config['trigger'] == 'string' ?
    $(this._config['trigger'])[0] : this._config['trigger']

  /** @private {boolean} */
  this._isTransitioning = false

  /** @private {?Element} */
  this._parent = this._config['parent'] ? this._getParent() : null

  if (!this._config['parent']) {
    this._addAriaAndCollapsedClass(this._element, this._trigger)
  }

  if (this._config['toggle']) {
    this['toggle']()
  }

}


/**
 * @const
 * @type {string}
 */
Collapse['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Collapse['Defaults'] = {
  'toggle'  : true,
  'trigger' : '[data-toggle="collapse"]',
  'parent'  : null
}


/**
 * @const
 * @type {string}
 * @private
 */
Collapse._NAME = 'collapse'


/**
 * @const
 * @type {string}
 * @private
 */
Collapse._DATA_KEY = 'bs.collapse'


/**
 * @const
 * @type {number}
 * @private
 */
Collapse._TRANSITION_DURATION = 600


/**
 * @const
 * @type {Function}
 * @private
 */
Collapse._JQUERY_NO_CONFLICT = $.fn[Collapse._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Event = {
  SHOW   : 'show.bs.collapse',
  SHOWN  : 'shown.bs.collapse',
  HIDE   : 'hide.bs.collapse',
  HIDDEN : 'hidden.bs.collapse'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._ClassName = {
  IN         : 'in',
  COLLAPSE   : 'collapse',
  COLLAPSING : 'collapsing',
  COLLAPSED  : 'collapsed'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Dimension = {
  WIDTH  : 'width',
  HEIGHT : 'height'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Selector = {
  ACTIVES : '.panel > .in, .panel > .collapsing'
}


/**
 * Provides the jQuery Interface for the alert component.
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Collapse._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var $this   = $(this)
    var data    = $this.data(Collapse._DATA_KEY)
    var config = $.extend({}, Collapse['Defaults'], $this.data(), typeof opt_config == 'object' && opt_config)

    if (!data && config['toggle'] && opt_config == 'show') {
      config['toggle'] = false
    }

    if (!data) {
      data = new Collapse(this, config)
      $this.data(Collapse._DATA_KEY, data)
    }

    if (typeof opt_config == 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Function for getting target element from element
 * @return {Element}
 * @private
 */
Collapse._getTargetFromElement = function (element) {
  var selector = Bootstrap.getSelectorFromElement(element)

  return selector ? $(selector)[0] : null
}


/**
 * Toggles the collapse element based on the presence of the 'in' class
 */
Collapse.prototype['toggle'] = function () {
  if ($(this._element).hasClass(Collapse._ClassName.IN)) {
    this['hide']()
  } else {
    this['show']()
  }
}


/**
 * Show's the collapsing element
 */
Collapse.prototype['show'] = function () {
  if (this._isTransitioning || $(this._element).hasClass(Collapse._ClassName.IN)) {
    return
  }

  var activesData, actives

  if (this._parent) {
    actives = $.makeArray($(Collapse._Selector.ACTIVES))
    if (!actives.length) {
      actives = null
    }
  }

  if (actives) {
    activesData = $(actives).data(Collapse._DATA_KEY)
    if (activesData && activesData._isTransitioning) {
      return
    }
  }

  var startEvent = $.Event(Collapse._Event.SHOW)
  $(this._element).trigger(startEvent)
  if (startEvent.isDefaultPrevented()) {
    return
  }

  if (actives) {
    Collapse._jQueryInterface.call($(actives), 'hide')
    if (!activesData) {
      $(actives).data(Collapse._DATA_KEY, null)
    }
  }

  var dimension = this._getDimension()

  $(this._element)
    .removeClass(Collapse._ClassName.COLLAPSE)
    .addClass(Collapse._ClassName.COLLAPSING)

  this._element.style[dimension] = 0
  this._element.setAttribute('aria-expanded', true)

  if (this._trigger) {
    $(this._trigger).removeClass(Collapse._ClassName.COLLAPSED)
    this._trigger.setAttribute('aria-expanded', true)
  }

  this['setTransitioning'](true)

  var complete = function () {
    $(this._element)
      .removeClass(Collapse._ClassName.COLLAPSING)
      .addClass(Collapse._ClassName.COLLAPSE)
      .addClass(Collapse._ClassName.IN)

    this._element.style[dimension] = ''

    this['setTransitioning'](false)

    $(this._element).trigger(Collapse._Event.SHOWN)
  }.bind(this)

  if (!Bootstrap.transition) {
    complete()
    return
  }

  var scrollSize = 'scroll' + (dimension[0].toUpperCase() + dimension.slice(1))

  $(this._element)
    .one(Bootstrap.TRANSITION_END, complete)
    .emulateTransitionEnd(Collapse._TRANSITION_DURATION)

  this._element.style[dimension] = this._element[scrollSize] + 'px'
}


/**
 * Hides's the collapsing element
 */
Collapse.prototype['hide'] = function () {
  if (this._isTransitioning || !$(this._element).hasClass(Collapse._ClassName.IN)) {
    return
  }

  var startEvent = $.Event(Collapse._Event.HIDE)
  $(this._element).trigger(startEvent)
  if (startEvent.isDefaultPrevented()) return

  var dimension = this._getDimension()
  var offsetDimension = dimension === Collapse._Dimension.WIDTH ?
    'offsetWidth' : 'offsetHeight'

  this._element.style[dimension] = this._element[offsetDimension] + 'px'

  Bootstrap.reflow(this._element)

  $(this._element)
    .addClass(Collapse._ClassName.COLLAPSING)
    .removeClass(Collapse._ClassName.COLLAPSE)
    .removeClass(Collapse._ClassName.IN)

  this._element.setAttribute('aria-expanded', false)

  if (this._trigger) {
    $(this._trigger).addClass(Collapse._ClassName.COLLAPSED)
    this._trigger.setAttribute('aria-expanded', false)
  }

  this['setTransitioning'](true)

  var complete = function () {
    this['setTransitioning'](false)
    $(this._element)
      .removeClass(Collapse._ClassName.COLLAPSING)
      .addClass(Collapse._ClassName.COLLAPSE)
      .trigger(Collapse._Event.HIDDEN)

  }.bind(this)

  this._element.style[dimension] = 0

  if (!Bootstrap.transition) {
    return complete()
  }

  $(this._element)
    .one(Bootstrap.TRANSITION_END, complete)
    .emulateTransitionEnd(Collapse._TRANSITION_DURATION)
}



/**
 * @param {boolean} isTransitioning
 */
Collapse.prototype['setTransitioning'] = function (isTransitioning) {
  this._isTransitioning = isTransitioning
}


/**
 * Returns the collapsing dimension
 * @return {string}
 * @private
 */
Collapse.prototype._getDimension = function () {
  var hasWidth = $(this._element).hasClass(Collapse._Dimension.WIDTH)
  return hasWidth ? Collapse._Dimension.WIDTH : Collapse._Dimension.HEIGHT
}


/**
 * Returns the parent element
 * @return {Element}
 * @private
 */
Collapse.prototype._getParent = function () {
  var selector = '[data-toggle="collapse"][data-parent="' + this._config['parent'] + '"]'
  var parent = $(this._config['parent'])[0]
  var elements = /** @type {Array.<Element>} */ ($.makeArray($(parent).find(selector)))

  for (var i = 0; i < elements.length; i++) {
    this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(elements[i]), elements[i])
  }

  return parent
}


/**
 * Returns the parent element
 * @param {Element} element
 * @param {Element} trigger
 * @private
 */
Collapse.prototype._addAriaAndCollapsedClass = function (element, trigger) {
  if (element) {
    var isOpen = $(element).hasClass(Collapse._ClassName.IN)
    element.setAttribute('aria-expanded', isOpen)

    if (trigger) {
      trigger.setAttribute('aria-expanded', isOpen)
      $(trigger).toggleClass(Collapse._ClassName.COLLAPSED, !isOpen)
    }
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
$.fn[Collapse._NAME] = Collapse._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME]['Constructor'] = Collapse


/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME]['noConflict'] = function () {
  $.fn[Collapse._NAME] = Collapse._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (event) {
  event.preventDefault()

  var target = Collapse._getTargetFromElement(this)

  var data = $(target).data(Collapse._DATA_KEY)
  var config = data ? 'toggle' : $.extend({}, $(this).data(), { trigger: this })

  Collapse._jQueryInterface.call($(target), config)
})
