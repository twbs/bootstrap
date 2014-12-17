/** =======================================================================
 * Bootstrap: tooltip.js v4.0.0
 * http://getbootstrap.com/javascript/#tooltip
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's tooltip plugin.
 * (Inspired by jQuery.tipsy by Jason Frame)
 *
 * Public Methods & Properties:
 *
 *   + $.tooltip
 *   + $.tooltip.noConflict
 *   + $.tooltip.Constructor
 *   + $.tooltip.Constructor.VERSION
 *   + $.tooltip.Constructor.Defaults
 *   + $.tooltip.Constructor.Defaults.container
 *   + $.tooltip.Constructor.Defaults.animation
 *   + $.tooltip.Constructor.Defaults.placement
 *   + $.tooltip.Constructor.Defaults.selector
 *   + $.tooltip.Constructor.Defaults.template
 *   + $.tooltip.Constructor.Defaults.trigger
 *   + $.tooltip.Constructor.Defaults.title
 *   + $.tooltip.Constructor.Defaults.delay
 *   + $.tooltip.Constructor.Defaults.html
 *   + $.tooltip.Constructor.Defaults.viewport
 *   + $.tooltip.Constructor.Defaults.viewport.selector
 *   + $.tooltip.Constructor.Defaults.viewport.padding
 *   + $.tooltip.Constructor.prototype.enable
 *   + $.tooltip.Constructor.prototype.disable
 *   + $.tooltip.Constructor.prototype.destroy
 *   + $.tooltip.Constructor.prototype.toggleEnabled
 *   + $.tooltip.Constructor.prototype.toggle
 *   + $.tooltip.Constructor.prototype.show
 *   + $.tooltip.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our tooltip class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
var Tooltip = function (element, opt_config) {

  /** @private {boolean} */
  this._isEnabled = true

  /** @private {number} */
  this._timeout = 0

  /** @private {string} */
  this._hoverState = ''

  /** @protected {Element} */
  this.element = element

  /** @protected {Object} */
  this.config = this._getConfig(opt_config)

  /** @protected {Element} */
  this.tip = null

  /** @protected {Element} */
  this.arrow = null

  if (this.config['viewport']) {

    /** @private {Element} */
    this._viewport = $(this.config['viewport']['selector'] || this.config['viewport'])[0]

  }

  this._setListeners()
}


/**
 * @const
 * @type {string}
 */
Tooltip['VERSION']  = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Tooltip['Defaults'] = {
  'container' : false,
  'animation' : true,
  'placement' : 'top',
  'selector'  : false,
  'template'  : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  'trigger'   : 'hover focus',
  'title'     : '',
  'delay'     : 0,
  'html'      : false,
  'viewport': {
    'selector': 'body',
    'padding' : 0
  }
}


/**
 * @const
 * @enum {string}
 * @protected
 */
Tooltip.Direction = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
}


/**
 * @const
 * @type {string}
 * @private
 */
Tooltip._NAME = 'tooltip'


/**
 * @const
 * @type {string}
 * @private
 */
Tooltip._DATA_KEY = 'bs.tooltip'


/**
 * @const
 * @type {number}
 * @private
 */
Tooltip._TRANSITION_DURATION = 150


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._HoverState = {
  IN: 'in',
  OUT: 'out'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._Event = {
  HIDE   : 'hide.bs.tooltip',
  HIDDEN : 'hidden.bs.tooltip',
  SHOW   : 'show.bs.tooltip',
  SHOWN  : 'shown.bs.tooltip'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._ClassName = {
  FADE : 'fade',
  IN   : 'in'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Tooltip._Selector = {
  TOOLTIP       : '.tooltip',
  TOOLTIP_INNER : '.tooltip-inner',
  TOOLTIP_ARROW : '.tooltip-arrow'
}


/**
 * @const
 * @type {Function}
 * @private
 */
Tooltip._JQUERY_NO_CONFLICT = $.fn[Tooltip._NAME]


/**
 * @param {Object=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Tooltip._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var data   = $(this).data(Tooltip._DATA_KEY)
    var config = typeof opt_config == 'object' ? opt_config : null

    if (!data && opt_config == 'destroy') {
      return
    }

    if (!data) {
      data = new Tooltip(this, config)
      $(this).data(Tooltip._DATA_KEY, data)
    }

    if (typeof opt_config === 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Enable tooltip
 */
Tooltip.prototype['enable'] = function () {
  this._isEnabled = true
}


/**
 * Disable tooltip
 */
Tooltip.prototype['disable'] = function () {
  this._isEnabled = false
}


/**
 * Toggle the tooltip enable state
 */
Tooltip.prototype['toggleEnabled'] = function () {
  this._isEnabled = !this._isEnabled
}

/**
 * Toggle the tooltips display
 * @param {Event} opt_event
 */
Tooltip.prototype['toggle'] = function (opt_event) {
  var context = this
  var dataKey = this.getDataKey()

  if (opt_event) {
    context = $(opt_event.currentTarget).data(dataKey)

    if (!context) {
      context = new this.constructor(opt_event.currentTarget, this._getDelegateConfig())
      $(opt_event.currentTarget).data(dataKey, context)
    }
  }

  $(context.getTipElement()).hasClass(Tooltip._ClassName.IN) ?
    context._leave(null, context) :
    context._enter(null, context)
}


/**
 * Remove tooltip functionality
 */
Tooltip.prototype['destroy'] = function () {
  clearTimeout(this._timeout)
  this['hide'](function () {
    $(this.element)
      .off(Tooltip._Selector.TOOLTIP)
      .removeData(this.getDataKey())
  }.bind(this))
}


/**
 * Show the tooltip
 * todo (fat): ~fuck~ this is a big function - refactor out all of positioning logic
 * and replace with external lib
 */
Tooltip.prototype['show'] = function () {
  // jQuery's :hidden gives false positives for SVG elements
  // See https://github.com/jquery/jquery/pull/939
  // Since this hiddenness check is just a nicety anyway, simply assume SVGs are always visible.
  var isHidden = $(this.element).is(':hidden') && !(window.SVGElement && this.element instanceof window.SVGElement)
  if (isHidden) {
    throw new Error('Can\'t show a tooltip/popover on a hidden element')
  }

  var showEvent = $.Event(this.getEventObject().SHOW)

  if (this.isWithContent() && this._isEnabled) {
    $(this.element).trigger(showEvent)

    var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element)

    if (showEvent.isDefaultPrevented() || !isInTheDom) {
      return
    }

    var tip   = this.getTipElement()
    var tipId = Bootstrap.getUID(this.getName())

    tip.setAttribute('id', tipId)
    this.element.setAttribute('aria-describedby', tipId)

    this.setContent()

    if (this.config['animation']) {
      $(tip).addClass(Tooltip._ClassName.FADE)
    }

    var placement = typeof this.config['placement'] == 'function' ?
      this.config['placement'].call(this, tip, this.element) :
      this.config['placement']

    var autoToken = /\s?auto?\s?/i
    var isWithAutoPlacement = autoToken.test(placement)

    if (isWithAutoPlacement) {
      placement = placement.replace(autoToken, '') || Tooltip.Direction.TOP
    }

    if (tip.parentNode && tip.parentNode.nodeType == Node.ELEMENT_NODE) {
      tip.parentNode.removeChild(tip)
    }

    tip.style.top     = 0
    tip.style.left    = 0
    tip.style.display = 'block'

    $(tip).addClass(Tooltip._NAME + '-' + placement)

    $(tip).data(this.getDataKey(), this)

    if (this.config['container']) {
      $(this.config['container'])[0].appendChild(tip)
    } else {
      this.element.parentNode.insertBefore(tip, this.element.nextSibling)
    }

    var position            = this._getPosition()
    var actualWidth         = tip.offsetWidth
    var actualHeight        = tip.offsetHeight

    var calculatedPlacement = this._getCalculatedAutoPlacement(isWithAutoPlacement, placement, position, actualWidth, actualHeight)
    var calculatedOffset    = this._getCalculatedOffset(calculatedPlacement, position, actualWidth, actualHeight)

    this._applyCalculatedPlacement(calculatedOffset, calculatedPlacement)

    var complete = function () {
      var prevHoverState = this.hoverState
      $(this.element).trigger(this.getEventObject().SHOWN)
      this.hoverState = null

      if (prevHoverState == 'out') this._leave(null, this)
    }.bind(this)

    Bootstrap.transition && $(this._tip).hasClass(Tooltip._ClassName.FADE) ?
      $(this._tip)
        .one(Bootstrap.TRANSITION_END, complete)
        .emulateTransitionEnd(Tooltip._TRANSITION_DURATION) :
      complete()
  }
}


/**
 * Hide the tooltip breh
 */
Tooltip.prototype['hide'] = function (callback) {
  var tip       = this.getTipElement()
  var hideEvent = $.Event(this.getEventObject().HIDE)

  var complete  = function () {
    if (this._hoverState != Tooltip._HoverState.IN) {
      tip.parentNode.removeChild(tip)
    }

    this.element.removeAttribute('aria-describedby')
    $(this.element).trigger(this.getEventObject().HIDDEN)

    if (callback) {
      callback()
    }
  }.bind(this)

  $(this.element).trigger(hideEvent)

  if (hideEvent.isDefaultPrevented()) return

  $(tip).removeClass(Tooltip._ClassName.IN)

  if (Bootstrap.transition && $(this._tip).hasClass(Tooltip._ClassName.FADE)) {
    $(tip)
      .one(Bootstrap.TRANSITION_END, complete)
      .emulateTransitionEnd(Tooltip._TRANSITION_DURATION)
  } else {
    complete()
  }

  this._hoverState = ''
}


/**
 * @return {string}
 */
Tooltip.prototype['getHoverState'] = function (callback) {
  return this._hoverState
}


/**
 * @return {string}
 * @protected
 */
Tooltip.prototype.getName = function () {
  return Tooltip._NAME
}


/**
 * @return {string}
 * @protected
 */
Tooltip.prototype.getDataKey = function () {
  return Tooltip._DATA_KEY
}


/**
 * @return {Object}
 * @protected
 */
Tooltip.prototype.getEventObject = function () {
  return Tooltip._Event
}


/**
 * @return {string}
 * @protected
 */
Tooltip.prototype.getTitle = function () {
  var title = this.element.getAttribute('data-original-title')

  if (!title) {
    title = typeof this.config['title'] === 'function' ?
      this.config['title'].call(this.element) :
      this.config['title']
  }

  return /** @type {string} */ (title)
}


/**
 * @return {Element}
 * @protected
 */
Tooltip.prototype.getTipElement = function () {
  return (this._tip = this._tip || $(this.config['template'])[0])
}


/**
 * @return {Element}
 * @protected
 */
Tooltip.prototype.getArrowElement = function () {
  return (this.arrow = this.arrow || $(this.getTipElement()).find(Tooltip._Selector.TOOLTIP_ARROW)[0])
}


/**
 * @return {boolean}
 * @protected
 */
Tooltip.prototype.isWithContent = function () {
  return !!this.getTitle()
}


/**
 * @protected
 */
Tooltip.prototype.setContent = function () {
  var tip   = this.getTipElement()
  var title = this.getTitle()

  $(tip).find(Tooltip._Selector.TOOLTIP_INNER)[0][this.config['html'] ? 'innerHTML' : 'innerText'] = title

  $(tip)
    .removeClass(Tooltip._ClassName.FADE)
    .removeClass(Tooltip._ClassName.IN)

  for (var direction in Tooltip.Direction) {
    $(tip).removeClass(Tooltip._NAME + '-' + direction)
  }
}


/**
 * @private
 */
Tooltip.prototype._setListeners = function () {
  var triggers = this.config['trigger'].split(' ')

  triggers.forEach(function (trigger) {
    if (trigger == 'click') {
      $(this.element).on('click.bs.tooltip', this.config['selector'], this['toggle'].bind(this))

    } else if (trigger != 'manual') {
      var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
      var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

      $(this.element)
        .on(eventIn  + '.bs.tooltip', this.config['selector'], this._enter.bind(this))
        .on(eventOut + '.bs.tooltip', this.config['selector'], this._leave.bind(this))
    }
  }.bind(this))

  if (this.config['selector']) {
    this.config = $.extend({}, this.config, { 'trigger': 'manual', 'selector': '' })
  } else {
    this._fixTitle()
  }
}


/**
 * @param {Object=} opt_config
 * @return {Object}
 * @private
 */
Tooltip.prototype._getConfig = function (opt_config) {
  var config = $.extend({}, this.constructor['Defaults'], $(this.element).data(), opt_config)

  if (config['delay'] && typeof config['delay'] == 'number') {
    config['delay'] = {
      'show': config['delay'],
      'hide': config['delay']
    }
  }

  return config
}


/**
 * @return {Object}
 * @private
 */
Tooltip.prototype._getDelegateConfig = function () {
  var config  = {}
  var defaults = this.constructor['Defaults']

  if (this.config) {
    for (var key in this.config) {
      var value = this.config[key]
      if (defaults[key] != value) config[key] = value
    }
  }

  return config
}



/**
 * @param {boolean} isWithAutoPlacement
 * @param {string} placement
 * @param {Object} position
 * @param {number} actualWidth
 * @param {number} actualHeight
 * @return {string}
 * @private
 */
Tooltip.prototype._getCalculatedAutoPlacement = function (isWithAutoPlacement, placement, position, actualWidth, actualHeight) {
  if (isWithAutoPlacement) {
    var originalPlacement = placement
    var container         = this.config['container'] ? $(this.config['container'])[0] : this.element.parentNode
    var containerDim      = this._getPosition(/** @type {Element} */ (container))

    placement = placement == Tooltip.Direction.BOTTOM && position.bottom + actualHeight > containerDim.bottom ? Tooltip.Direction.TOP    :
                placement == Tooltip.Direction.TOP    && position.top    - actualHeight < containerDim.top    ? Tooltip.Direction.BOTTOM :
                placement == Tooltip.Direction.RIGHT  && position.right  + actualWidth  > containerDim.width  ? Tooltip.Direction.LEFT   :
                placement == Tooltip.Direction.LEFT   && position.left   - actualWidth  < containerDim.left   ? Tooltip.Direction.RIGHT  :
                placement

    $(this._tip)
      .removeClass(Tooltip._NAME + '-' + originalPlacement)
      .addClass(Tooltip._NAME + '-' + placement)
  }

  return placement
}


/**
 * @param {string} placement
 * @param {Object} position
 * @param {number} actualWidth
 * @param {number} actualHeight
 * @return {{left: number, top: number}}
 * @private
 */
Tooltip.prototype._getCalculatedOffset = function (placement, position, actualWidth, actualHeight) {
  return placement == Tooltip.Direction.BOTTOM ? { top: position.top + position.height,   left: position.left + position.width / 2 - actualWidth / 2  } :
         placement == Tooltip.Direction.TOP    ? { top: position.top - actualHeight,      left: position.left + position.width / 2 - actualWidth / 2  } :
         placement == Tooltip.Direction.LEFT   ? { top: position.top + position.height / 2 - actualHeight / 2, left: position.left - actualWidth      } :
      /* placement == Tooltip.Direction.RIGHT */ { top: position.top + position.height / 2 - actualHeight / 2, left: position.left + position.width   }
}


/**
 * @param {string} placement
 * @param {Object} position
 * @param {number} actualWidth
 * @param {number} actualHeight
 * @return {Object}
 * @private
 */
Tooltip.prototype._getViewportAdjustedDelta = function (placement, position, actualWidth, actualHeight) {
  var delta = { top: 0, left: 0 }

  if (!this._viewport) {
    return delta
  }

  var viewportPadding    = this.config['viewport'] && this.config['viewport']['padding'] || 0
  var viewportDimensions = this._getPosition(this._viewport)

  if (placement === Tooltip.Direction.RIGHT || placement === Tooltip.Direction.LEFT) {
    var topEdgeOffset    = position.top - viewportPadding - viewportDimensions.scroll
    var bottomEdgeOffset = position.top + viewportPadding - viewportDimensions.scroll + actualHeight

    if (topEdgeOffset < viewportDimensions.top) { // top overflow
      delta.top = viewportDimensions.top - topEdgeOffset

    } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
      delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
    }

  } else {
    var leftEdgeOffset  = position.left - viewportPadding
    var rightEdgeOffset = position.left + viewportPadding + actualWidth

    if (leftEdgeOffset < viewportDimensions.left) { // left overflow
      delta.left = viewportDimensions.left - leftEdgeOffset

    } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
      delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
    }
  }

  return delta
}


/**
 * @param {Element=} opt_element
 * @return {Object}
 * @private
 */
Tooltip.prototype._getPosition = function (opt_element) {
  var element   = opt_element || this.element
  var isBody    = element.tagName == 'BODY'
  var rect      = element.getBoundingClientRect()
  var offset    = isBody ? { top: 0, left: 0 } : $(element).offset()
  var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : this.element.scrollTop }
  var outerDims = isBody ? { width: window.innerWidth, height: window.innerHeight } : null

  return $.extend({}, rect, scroll, outerDims, offset)
}


/**
 * @param {{left: number, top: number}} offset
 * @param {string} placement
 * @private
 */
Tooltip.prototype._applyCalculatedPlacement = function (offset, placement) {
  var tip    = this.getTipElement()
  var width  = tip.offsetWidth
  var height = tip.offsetHeight

  // manually read margins because getBoundingClientRect includes difference
  var marginTop  = parseInt(tip.style.marginTop, 10)
  var marginLeft = parseInt(tip.style.marginLeft, 10)

  // we must check for NaN for ie 8/9
  if (isNaN(marginTop))  {
    marginTop  = 0
  }
  if (isNaN(marginLeft)) {
    marginLeft = 0
  }

  offset.top  = offset.top  + marginTop
  offset.left = offset.left + marginLeft

  // $.fn.offset doesn't round pixel values
  // so we use setOffset directly with our own function B-0
  $.offset.setOffset(tip, $.extend({
    using: function (props) {
      tip.style.top  = Math.round(props.top)  + 'px'
      tip.style.left = Math.round(props.left) + 'px'
    }
  }, offset), 0)

  $(tip).addClass(Tooltip._ClassName.IN)

  // check to see if placing tip in new offset caused the tip to resize itself
  var actualWidth  = tip.offsetWidth
  var actualHeight = tip.offsetHeight

  if (placement == Tooltip.Direction.TOP && actualHeight != height) {
    offset.top = offset.top + height - actualHeight
  }

  var delta = this._getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

  if (delta.left) {
    offset.left += delta.left
  } else {
    offset.top  += delta.top
  }

  var isVertical          = placement === Tooltip.Direction.TOP || placement === Tooltip.Direction.BOTTOM
  var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
  var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

  $(tip).offset(offset)

  this._replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical)
}


/**
 * @param {number} delta
 * @param {number} dimension
 * @param {boolean} isHorizontal
 * @private
 */
Tooltip.prototype._replaceArrow = function (delta, dimension, isHorizontal) {
  var arrow = this.getArrowElement()

  arrow.style[isHorizontal ? 'left' : 'top'] =  50 * (1 - delta / dimension) + '%'
  arrow.style[isHorizontal ? 'top'  : 'left'] = ''
}



/**
 * @private
 */
Tooltip.prototype._fixTitle = function () {
  if (this.element.getAttribute('title') || typeof this.element.getAttribute('data-original-title') != 'string') {
    this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '')
    this.element.setAttribute('title', '')
  }
}


/**
 * @param {Event=} opt_event
 * @param {Object=} opt_context
 * @private
 */
Tooltip.prototype._enter = function (opt_event, opt_context) {
  var dataKey = this.getDataKey()
  var context = opt_context || $(opt_event.currentTarget).data(dataKey)

  if (context && context._tip && context._tip.offsetWidth) {
    context._hoverState = Tooltip._HoverState.IN
    return
  }

  if (!context) {
    context = new this.constructor(opt_event.currentTarget, this._getDelegateConfig())
    $(opt_event.currentTarget).data(dataKey, context)
  }

  clearTimeout(context._timeout)

  context._hoverState = Tooltip._HoverState.IN

  if (!context.config['delay'] || !context.config['delay']['show']) {
    context['show']()
    return
  }

  context._timeout = setTimeout(function () {
    if (context._hoverState == Tooltip._HoverState.IN) {
      context['show']()
    }
  }, context.config['delay']['show'])
}


/**
 * @param {Event=} opt_event
 * @param {Object=} opt_context
 * @private
 */
Tooltip.prototype._leave = function (opt_event, opt_context) {
  var dataKey = this.getDataKey()
  var context = opt_context || $(opt_event.currentTarget).data(dataKey)

  if (!context) {
    context = new this.constructor(opt_event.currentTarget, this._getDelegateConfig())
    $(opt_event.currentTarget).data(dataKey, context)
  }

  clearTimeout(context._timeout)

  context._hoverState = Tooltip._HoverState.OUT

  if (!context.config['delay'] || !context.config['delay']['hide']) {
    context['hide']()
    return
  }

  context._timeout = setTimeout(function () {
    if (context._hoverState == Tooltip._HoverState.OUT) {
      context['hide']()
    }
  }, context.config['delay']['hide'])
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
$.fn[Tooltip._NAME] = Tooltip._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Tooltip._NAME]['Constructor'] = Tooltip


/**
 * @const
 * @type {Function}
 */
$.fn[Tooltip._NAME]['noConflict'] = function () {
  $.fn[Tooltip._NAME] = Tooltip._JQUERY_NO_CONFLICT
  return this
}
