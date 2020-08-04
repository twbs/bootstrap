/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.1): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  DefaultWhitelist,
  sanitizeHtml
} from './tools/sanitizer'
import $ from 'jquery'
import Popper from 'popper.js'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                  = 'tooltip'
const VERSION               = '4.5.1'
const DATA_KEY              = 'bs.tooltip'
const EVENT_KEY             = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT    = $.fn[NAME]
const CLASS_PREFIX          = 'bs-tooltip'
const BSCLS_PREFIX_REGEX    = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')
const DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn']

const DefaultType = {
  animation         : 'boolean',
  template          : 'string',
  title             : '(string|element|function)',
  trigger           : 'string',
  delay             : '(number|object)',
  html              : 'boolean',
  selector          : '(string|boolean)',
  placement         : '(string|function)',
  offset            : '(number|string|function)',
  container         : '(string|element|boolean)',
  fallbackPlacement : '(string|array)',
  boundary          : '(string|element)',
  sanitize          : 'boolean',
  sanitizeFn        : '(null|function)',
  whiteList         : 'object',
  popperConfig      : '(null|object)'
}

const AttachmentMap = {
  AUTO   : 'auto',
  TOP    : 'top',
  RIGHT  : 'right',
  BOTTOM : 'bottom',
  LEFT   : 'left'
}

const Default = {
  animation         : true,
  template          : '<div class="tooltip" role="tooltip">' +
                    '<div class="arrow"></div>' +
                    '<div class="tooltip-inner"></div></div>',
  trigger           : 'hover focus',
  title             : '',
  delay             : 0,
  html              : false,
  selector          : false,
  placement         : 'top',
  offset            : 0,
  container         : false,
  fallbackPlacement : 'flip',
  boundary          : 'scrollParent',
  sanitize          : true,
  sanitizeFn        : null,
  whiteList         : DefaultWhitelist,
  popperConfig      : null
}

const HOVER_STATE_SHOW = 'show'
const HOVER_STATE_OUT  = 'out'

const Event = {
  HIDE       : `hide${EVENT_KEY}`,
  HIDDEN     : `hidden${EVENT_KEY}`,
  SHOW       : `show${EVENT_KEY}`,
  SHOWN      : `shown${EVENT_KEY}`,
  INSERTED   : `inserted${EVENT_KEY}`,
  CLICK      : `click${EVENT_KEY}`,
  FOCUSIN    : `focusin${EVENT_KEY}`,
  FOCUSOUT   : `focusout${EVENT_KEY}`,
  MOUSEENTER : `mouseenter${EVENT_KEY}`,
  MOUSELEAVE : `mouseleave${EVENT_KEY}`
}

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'
const SELECTOR_ARROW         = '.arrow'

const TRIGGER_HOVER  = 'hover'
const TRIGGER_FOCUS  = 'focus'
const TRIGGER_CLICK  = 'click'
const TRIGGER_MANUAL = 'manual'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tooltip {
  constructor(element, config) {
    if (typeof Popper === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)')
    }

    // private
    this._isEnabled     = true
    this._timeout       = 0
    this._hoverState    = ''
    this._activeTrigger = {}
    this._popper        = null

    // Protected
    this.element = element
    this.config  = this._getConfig(config)
    this.tip     = null

    this._setListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  static get Event() {
    return Event
  }

  static get EVENT_KEY() {
    return EVENT_KEY
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  enable() {
    this._isEnabled = true
  }

  disable() {
    this._isEnabled = false
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled
  }

  toggle(event) {
    if (!this._isEnabled) {
      return
    }

    if (event) {
      const dataKey = this.constructor.DATA_KEY
      let context = $(event.currentTarget).data(dataKey)

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        )
        $(event.currentTarget).data(dataKey, context)
      }

      context._activeTrigger.click = !context._activeTrigger.click

      if (context._isWithActiveTrigger()) {
        context._enter(null, context)
      } else {
        context._leave(null, context)
      }
    } else {
      if ($(this.getTipElement()).hasClass(CLASS_NAME_SHOW)) {
        this._leave(null, this)
        return
      }

      this._enter(null, this)
    }
  }

  dispose() {
    clearTimeout(this._timeout)

    $.removeData(this.element, this.constructor.DATA_KEY)

    $(this.element).off(this.constructor.EVENT_KEY)
    $(this.element).closest('.modal').off('hide.bs.modal', this._hideModalHandler)

    if (this.tip) {
      $(this.tip).remove()
    }

    this._isEnabled     = null
    this._timeout       = null
    this._hoverState    = null
    this._activeTrigger = null
    if (this._popper) {
      this._popper.destroy()
    }

    this._popper = null
    this.element = null
    this.config  = null
    this.tip     = null
  }

  show() {
    if ($(this.element).css('display') === 'none') {
      throw new Error('Please use show on visible elements')
    }

    const showEvent = $.Event(this.constructor.Event.SHOW)
    if (this.isWithContent() && this._isEnabled) {
      $(this.element).trigger(showEvent)

      const shadowRoot = Util.findShadowRoot(this.element)
      const isInTheDom = $.contains(
        shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement,
        this.element
      )

      if (showEvent.isDefaultPrevented() || !isInTheDom) {
        return
      }

      const tip   = this.getTipElement()
      const tipId = Util.getUID(this.constructor.NAME)

      tip.setAttribute('id', tipId)
      this.element.setAttribute('aria-describedby', tipId)

      this.setContent()

      if (this.config.animation) {
        $(tip).addClass(CLASS_NAME_FADE)
      }

      const placement  = typeof this.config.placement === 'function'
        ? this.config.placement.call(this, tip, this.element)
        : this.config.placement

      const attachment = this._getAttachment(placement)
      this.addAttachmentClass(attachment)

      const container = this._getContainer()
      $(tip).data(this.constructor.DATA_KEY, this)

      if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
        $(tip).appendTo(container)
      }

      $(this.element).trigger(this.constructor.Event.INSERTED)

      this._popper = new Popper(this.element, tip, this._getPopperConfig(attachment))

      $(tip).addClass(CLASS_NAME_SHOW)

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().on('mouseover', null, $.noop)
      }

      const complete = () => {
        if (this.config.animation) {
          this._fixTransition()
        }
        const prevHoverState = this._hoverState
        this._hoverState     = null

        $(this.element).trigger(this.constructor.Event.SHOWN)

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this)
        }
      }

      if ($(this.tip).hasClass(CLASS_NAME_FADE)) {
        const transitionDuration = Util.getTransitionDurationFromElement(this.tip)

        $(this.tip)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration)
      } else {
        complete()
      }
    }
  }

  hide(callback) {
    const tip       = this.getTipElement()
    const hideEvent = $.Event(this.constructor.Event.HIDE)
    const complete = () => {
      if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
        tip.parentNode.removeChild(tip)
      }

      this._cleanTipClass()
      this.element.removeAttribute('aria-describedby')
      $(this.element).trigger(this.constructor.Event.HIDDEN)
      if (this._popper !== null) {
        this._popper.destroy()
      }

      if (callback) {
        callback()
      }
    }

    $(this.element).trigger(hideEvent)

    if (hideEvent.isDefaultPrevented()) {
      return
    }

    $(tip).removeClass(CLASS_NAME_SHOW)

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      $(document.body).children().off('mouseover', null, $.noop)
    }

    this._activeTrigger[TRIGGER_CLICK] = false
    this._activeTrigger[TRIGGER_FOCUS] = false
    this._activeTrigger[TRIGGER_HOVER] = false

    if ($(this.tip).hasClass(CLASS_NAME_FADE)) {
      const transitionDuration = Util.getTransitionDurationFromElement(tip)

      $(tip)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }

    this._hoverState = ''
  }

  update() {
    if (this._popper !== null) {
      this._popper.scheduleUpdate()
    }
  }

  // Protected

  isWithContent() {
    return Boolean(this.getTitle())
  }

  addAttachmentClass(attachment) {
    $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`)
  }

  getTipElement() {
    this.tip = this.tip || $(this.config.template)[0]
    return this.tip
  }

  setContent() {
    const tip = this.getTipElement()
    this.setElementContent($(tip.querySelectorAll(SELECTOR_TOOLTIP_INNER)), this.getTitle())
    $(tip).removeClass(`${CLASS_NAME_FADE} ${CLASS_NAME_SHOW}`)
  }

  setElementContent($element, content) {
    if (typeof content === 'object' && (content.nodeType || content.jquery)) {
      // Content is a DOM node or a jQuery
      if (this.config.html) {
        if (!$(content).parent().is($element)) {
          $element.empty().append(content)
        }
      } else {
        $element.text($(content).text())
      }

      return
    }

    if (this.config.html) {
      if (this.config.sanitize) {
        content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn)
      }

      $element.html(content)
    } else {
      $element.text(content)
    }
  }

  getTitle() {
    let title = this.element.getAttribute('data-original-title')

    if (!title) {
      title = typeof this.config.title === 'function'
        ? this.config.title.call(this.element)
        : this.config.title
    }

    return title
  }

  // Private

  _getPopperConfig(attachment) {
    const defaultBsConfig = {
      placement: attachment,
      modifiers: {
        offset: this._getOffset(),
        flip: {
          behavior: this.config.fallbackPlacement
        },
        arrow: {
          element: SELECTOR_ARROW
        },
        preventOverflow: {
          boundariesElement: this.config.boundary
        }
      },
      onCreate: (data) => {
        if (data.originalPlacement !== data.placement) {
          this._handlePopperPlacementChange(data)
        }
      },
      onUpdate: (data) => this._handlePopperPlacementChange(data)
    }

    return {
      ...defaultBsConfig,
      ...this.config.popperConfig
    }
  }

  _getOffset() {
    const offset = {}

    if (typeof this.config.offset === 'function') {
      offset.fn = (data) => {
        data.offsets = {
          ...data.offsets,
          ...this.config.offset(data.offsets, this.element) || {}
        }

        return data
      }
    } else {
      offset.offset = this.config.offset
    }

    return offset
  }

  _getContainer() {
    if (this.config.container === false) {
      return document.body
    }

    if (Util.isElement(this.config.container)) {
      return $(this.config.container)
    }

    return $(document).find(this.config.container)
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()]
  }

  _setListeners() {
    const triggers = this.config.trigger.split(' ')

    triggers.forEach((trigger) => {
      if (trigger === 'click') {
        $(this.element).on(
          this.constructor.Event.CLICK,
          this.config.selector,
          (event) => this.toggle(event)
        )
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER
          ? this.constructor.Event.MOUSEENTER
          : this.constructor.Event.FOCUSIN
        const eventOut = trigger === TRIGGER_HOVER
          ? this.constructor.Event.MOUSELEAVE
          : this.constructor.Event.FOCUSOUT

        $(this.element)
          .on(eventIn, this.config.selector, (event) => this._enter(event))
          .on(eventOut, this.config.selector, (event) => this._leave(event))
      }
    })

    this._hideModalHandler = () => {
      if (this.element) {
        this.hide()
      }
    }

    $(this.element).closest('.modal').on('hide.bs.modal', this._hideModalHandler)

    if (this.config.selector) {
      this.config = {
        ...this.config,
        trigger: 'manual',
        selector: ''
      }
    } else {
      this._fixTitle()
    }
  }

  _fixTitle() {
    const titleType = typeof this.element.getAttribute('data-original-title')

    if (this.element.getAttribute('title') || titleType !== 'string') {
      this.element.setAttribute(
        'data-original-title',
        this.element.getAttribute('title') || ''
      )

      this.element.setAttribute('title', '')
    }
  }

  _enter(event, context) {
    const dataKey = this.constructor.DATA_KEY
    context = context || $(event.currentTarget).data(dataKey)

    if (!context) {
      context = new this.constructor(
        event.currentTarget,
        this._getDelegateConfig()
      )
      $(event.currentTarget).data(dataKey, context)
    }

    if (event) {
      context._activeTrigger[
        event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = true
    }

    if ($(context.getTipElement()).hasClass(CLASS_NAME_SHOW) || context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_SHOW

    if (!context.config.delay || !context.config.delay.show) {
      context.show()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show()
      }
    }, context.config.delay.show)
  }

  _leave(event, context) {
    const dataKey = this.constructor.DATA_KEY
    context = context || $(event.currentTarget).data(dataKey)

    if (!context) {
      context = new this.constructor(
        event.currentTarget,
        this._getDelegateConfig()
      )
      $(event.currentTarget).data(dataKey, context)
    }

    if (event) {
      context._activeTrigger[
        event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = false
    }

    if (context._isWithActiveTrigger()) {
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_OUT

    if (!context.config.delay || !context.config.delay.hide) {
      context.hide()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide()
      }
    }, context.config.delay.hide)
  }

  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true
      }
    }

    return false
  }

  _getConfig(config) {
    const dataAttributes = $(this.element).data()

    Object.keys(dataAttributes)
      .forEach((dataAttr) => {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr]
        }
      })

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...typeof config === 'object' && config ? config : {}
    }

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString()
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString()
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    if (config.sanitize) {
      config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn)
    }

    return config
  }

  _getDelegateConfig() {
    const config = {}

    if (this.config) {
      for (const key in this.config) {
        if (this.constructor.Default[key] !== this.config[key]) {
          config[key] = this.config[key]
        }
      }
    }

    return config
  }

  _cleanTipClass() {
    const $tip = $(this.getTipElement())
    const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length) {
      $tip.removeClass(tabClass.join(''))
    }
  }

  _handlePopperPlacementChange(popperData) {
    this.tip = popperData.instance.popper
    this._cleanTipClass()
    this.addAttachmentClass(this._getAttachment(popperData.placement))
  }

  _fixTransition() {
    const tip = this.getTipElement()
    const initConfigAnimation = this.config.animation

    if (tip.getAttribute('x-placement') !== null) {
      return
    }

    $(tip).removeClass(CLASS_NAME_FADE)
    this.config.animation = false
    this.hide()
    this.show()
    this.config.animation = initConfigAnimation
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Tooltip(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }
        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Tooltip._jQueryInterface
$.fn[NAME].Constructor = Tooltip
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Tooltip._jQueryInterface
}

export default Tooltip
