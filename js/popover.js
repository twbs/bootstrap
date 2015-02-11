/** =======================================================================
 * Bootstrap: popover.js v4.0.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's popover plugin - extends tooltip.
 *
 * Public Methods & Properties:
 *
 *   + $.popover
 *   + $.popover.noConflict
 *   + $.popover.Constructor
 *   + $.popover.Constructor.VERSION
 *   + $.popover.Constructor.Defaults
 *   + $.popover.Constructor.Defaults.container
 *   + $.popover.Constructor.Defaults.animation
 *   + $.popover.Constructor.Defaults.placement
 *   + $.popover.Constructor.Defaults.selector
 *   + $.popover.Constructor.Defaults.template
 *   + $.popover.Constructor.Defaults.trigger
 *   + $.popover.Constructor.Defaults.title
 *   + $.popover.Constructor.Defaults.content
 *   + $.popover.Constructor.Defaults.delay
 *   + $.popover.Constructor.Defaults.html
 *   + $.popover.Constructor.Defaults.viewport
 *   + $.popover.Constructor.Defaults.viewport.selector
 *   + $.popover.Constructor.Defaults.viewport.padding
 *   + $.popover.Constructor.prototype.enable
 *   + $.popover.Constructor.prototype.disable
 *   + $.popover.Constructor.prototype.destroy
 *   + $.popover.Constructor.prototype.toggleEnabled
 *   + $.popover.Constructor.prototype.toggle
 *   + $.popover.Constructor.prototype.show
 *   + $.popover.Constructor.prototype.hide
 *
 * ========================================================================
 */


'use strict';


if (!Tooltip) throw new Error('Popover requires tooltip.js')


/**
 * Our tooltip class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 * @extends {Tooltip}
 */
var Popover = function (element, opt_config) {
  Tooltip.apply(this, arguments)
}
Bootstrap.inherits(Popover, Tooltip)


/**
 * @const
 * @type {string}
 */
Popover['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Popover['Defaults'] = $.extend({}, $.fn['tooltip']['Constructor']['Defaults'], {
  'placement': 'right',
  'trigger': 'click',
  'content': '',
  'template': '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
})


/**
 * @const
 * @type {string}
 * @private
 */
Popover._NAME = 'popover'


/**
 * @const
 * @type {string}
 * @private
 */
Popover._DATA_KEY = 'bs.popover'


/**
 * @const
 * @enum {string}
 * @private
 */
Popover._Event = {
  HIDE   : 'hide.bs.popover',
  HIDDEN : 'hidden.bs.popover',
  SHOW   : 'show.bs.popover',
  SHOWN  : 'shown.bs.popover'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Popover._ClassName = {
  FADE : 'fade',
  IN  : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Popover._Selector = {
  TITLE   : '.popover-title',
  CONTENT : '.popover-content',
  ARROW   : '.popover-arrow'
}


/**
 * @const
 * @type {Function}
 * @private
 */
Popover._JQUERY_NO_CONFLICT = $.fn[Popover._NAME]


/**
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Popover._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(Popover._DATA_KEY)
    var config = typeof opt_config === 'object' ? opt_config : null

    if (!data && opt_config === 'destroy') {
      return
    }

    if (!data) {
      data = new Popover(this, config)
      $(this).data(Popover._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * @return {string}
 * @protected
 */
Popover.prototype.getName = function () {
  return Popover._NAME
}


/**
 * @override
 */
Popover.prototype.getDataKey = function () {
  return Popover._DATA_KEY
}


/**
 * @override
 */
Popover.prototype.getEventObject = function () {
  return Popover._Event
}


/**
 * @override
 */
Popover.prototype.getArrowElement = function () {
  return (this.arrow = this.arrow || $(this.getTipElement()).find(Popover._Selector.ARROW)[0])
}


/**
 * @override
 */
Popover.prototype.setContent = function () {
  var tip          = this.getTipElement()
  var title        = this.getTitle()
  var content      = this._getContent()
  var titleElement = $(tip).find(Popover._Selector.TITLE)[0]

  if (titleElement) {
    titleElement[this.config['html'] ? 'innerHTML' : 'innerText'] = title
  }

  // we use append for html objects to maintain js events
  $(tip).find(Popover._Selector.CONTENT).children().detach().end()[
    this.config['html'] ? (typeof content == 'string' ? 'html' : 'append') : 'text'
  ](content)

  $(tip)
    .removeClass(Popover._ClassName.FADE)
    .removeClass(Popover._ClassName.IN)

  for (var direction in Tooltip.Direction) {
    $(tip).removeClass(Popover._NAME + '-' + Tooltip.Direction[direction])
  }
}


/**
 * @override
 */
Popover.prototype.isWithContent = function () {
  return this.getTitle() || this._getContent()
}


/**
 * @override
 */
Popover.prototype.getTipElement = function () {
  return (this.tip = this.tip || $(this.config['template'])[0])
}


/**
 * @private
 */
Popover.prototype._getContent = function () {
  return this.element.getAttribute('data-content')
    || (typeof this.config['content'] == 'function' ?
          this.config['content'].call(this.element) :
          this.config['content'])
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
$.fn[Popover._NAME] = Popover._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Popover._NAME]['Constructor'] = Popover


/**
 * @const
 * @type {Function}
 */
$.fn[Popover._NAME]['noConflict'] = function () {
  $.fn[Popover._NAME] = Popover._JQUERY_NO_CONFLICT
  return this
}
