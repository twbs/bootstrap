/* global Tether */

import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Tooltip = (($) => {

  /**
   * Check for Tether dependency
   * Tether - http://tether.io/
   */
  if (typeof Tether === 'undefined') {
    throw new Error('Bootstrap tooltips require Tether (http://tether.io/)')
  }


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tooltip'
  const VERSION             = '4.0.0-alpha.6'
  const DATA_KEY            = 'bs.tooltip'
  const EVENT_KEY           = `.${DATA_KEY}`
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150
  const CLASS_PREFIX        = 'bs-tether'
  const TETHER_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

  const Default = {
    animation   : true,
    template    : '<div class="tooltip" role="tooltip">'
                + '<div class="tooltip-inner"></div></div>',
    trigger     : 'hover focus',
    title       : '',
    delay       : 0,
    html        : false,
    selector    : false,
    placement   : 'top',
    offset      : '0 0',
    constraints : [],
    container   : false
  }

  const DefaultType = {
    animation   : 'boolean',
    template    : 'string',
    title       : '(string|element|function)',
    trigger     : 'string',
    delay       : '(number|object)',
    html        : 'boolean',
    selector    : '(string|boolean)',
    placement   : '(string|function)',
    offset      : 'string',
    constraints : 'array',
    container   : '(string|element|boolean)'
  }

  const AttachmentMap = {
    TOP    : 'bottom center',
    RIGHT  : 'middle left',
    BOTTOM : 'top center',
    LEFT   : 'middle right'
  }

  const HoverState = {
    SHOW : 'show',
    OUT  : 'out'
  }

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

  const ClassName = {
    FADE : 'fade',
    SHOW : 'show'
  }

  const Selector = {
    TOOLTIP       : '.tooltip',
    TOOLTIP_INNER : '.tooltip-inner'
  }

  const TetherClass = {
    element : false,
    enabled : false
  }

  const Trigger = {
    HOVER  : 'hover',
    FOCUS  : 'focus',
    CLICK  : 'click',
    MANUAL : 'manual'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip {

    constructor(element, config) {

      // private
      this._isEnabled     = true
      this._timeout       = 0
      this._hoverState    = ''
      this._activeTrigger = {}
      this._tether        = null

      // protected
      this.element = element
      this.config  = this._getConfig(config)
      this.tip     = null

      this._setListeners()

    }


    // getters

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


    // public

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

        if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
          this._leave(null, this)
          return
        }

        this._enter(null, this)
      }
    }

    dispose() {
      clearTimeout(this._timeout)

      this.cleanupTether()

      $.removeData(this.element, this.constructor.DATA_KEY)

      $(this.element).off(this.constructor.EVENT_KEY)
      $(this.element).closest('.modal').off('hide.bs.modal')

      if (this.tip) {
        $(this.tip).remove()
      }

      this._isEnabled     = null
      this._timeout       = null
      this._hoverState    = null
      this._activeTrigger = null
      this._tether        = null

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

        const isInTheDom = $.contains(
          this.element.ownerDocument.documentElement,
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
          $(tip).addClass(ClassName.FADE)
        }

        const placement  = typeof this.config.placement === 'function' ?
          this.config.placement.call(this, tip, this.element) :
          this.config.placement

        const attachment = this._getAttachment(placement)

        const container = this.config.container === false ? document.body : $(this.config.container)

        $(tip).data(this.constructor.DATA_KEY, this)

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container)
        }

        $(this.element).trigger(this.constructor.Event.INSERTED)

        this._tether = new Tether({
          attachment,
          element         : tip,
          target          : this.element,
          classes         : TetherClass,
          classPrefix     : CLASS_PREFIX,
          offset          : this.config.offset,
          constraints     : this.config.constraints,
          addTargetClasses: false
        })

        Util.reflow(tip)
        this._tether.position()

        $(tip).addClass(ClassName.SHOW)

        const complete = () => {
          const prevHoverState = this._hoverState
          this._hoverState     = null

          $(this.element).trigger(this.constructor.Event.SHOWN)

          if (prevHoverState === HoverState.OUT) {
            this._leave(null, this)
          }
        }

        if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
          $(this.tip)
            .one(Util.TRANSITION_END, complete)
            .emulateTransitionEnd(Tooltip._TRANSITION_DURATION)
          return
        }

        complete()
      }
    }

    hide(callback) {
      const tip       = this.getTipElement()
      const hideEvent = $.Event(this.constructor.Event.HIDE)
      const complete  = () => {
        if (this._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip)
        }

        this._cleanTipClass()
        this.element.removeAttribute('aria-describedby')
        $(this.element).trigger(this.constructor.Event.HIDDEN)
        this.cleanupTether()

        if (callback) {
          callback()
        }
      }

      $(this.element).trigger(hideEvent)

      if (hideEvent.isDefaultPrevented()) {
        return
      }

      $(tip).removeClass(ClassName.SHOW)

      this._activeTrigger[Trigger.CLICK] = false
      this._activeTrigger[Trigger.FOCUS] = false
      this._activeTrigger[Trigger.HOVER] = false

      if (Util.supportsTransitionEnd() &&
          $(this.tip).hasClass(ClassName.FADE)) {

        $(tip)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(TRANSITION_DURATION)

      } else {
        complete()
      }

      this._hoverState = ''
    }


    // protected

    isWithContent() {
      return Boolean(this.getTitle())
    }

    getTipElement() {
      return this.tip = this.tip || $(this.config.template)[0]
    }

    setContent() {
      const $tip = $(this.getTipElement())

      this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle())

      $tip.removeClass(`${ClassName.FADE} ${ClassName.SHOW}`)

      this.cleanupTether()
    }

    setElementContent($element, content) {
      const html = this.config.html
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // content is a DOM node or a jQuery
        if (html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content)
          }
        } else {
          $element.text($(content).text())
        }
      } else {
        $element[html ? 'html' : 'text'](content)
      }
    }

    getTitle() {
      let title = this.element.getAttribute('data-original-title')

      if (!title) {
        title = typeof this.config.title === 'function' ?
          this.config.title.call(this.element) :
          this.config.title
      }

      return title
    }

    cleanupTether() {
      if (this._tether) {
        this._tether.destroy()
      }
    }


    // private

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()]
    }

    _cleanTipClass() {
      const $tip = $(this.getTipElement())
      const tabClass = $tip.attr('class').match(TETHER_PREFIX_REGEX)
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''))
      }
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

        } else if (trigger !== Trigger.MANUAL) {
          const eventIn  = trigger === Trigger.HOVER ?
            this.constructor.Event.MOUSEENTER :
            this.constructor.Event.FOCUSIN
          const eventOut = trigger === Trigger.HOVER ?
            this.constructor.Event.MOUSELEAVE :
            this.constructor.Event.FOCUSOUT

          $(this.element)
            .on(
              eventIn,
              this.config.selector,
              (event) => this._enter(event)
            )
            .on(
              eventOut,
              this.config.selector,
              (event) => this._leave(event)
            )
        }

        $(this.element).closest('.modal').on(
          'hide.bs.modal',
          () => this.hide()
        )
      })

      if (this.config.selector) {
        this.config = $.extend({}, this.config, {
          trigger  : 'manual',
          selector : ''
        })
      } else {
        this._fixTitle()
      }
    }

    _fixTitle() {
      const titleType = typeof this.element.getAttribute('data-original-title')
      if (this.element.getAttribute('title') ||
         titleType !== 'string') {
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
          event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER
        ] = true
      }

      if ($(context.getTipElement()).hasClass(ClassName.SHOW) ||
         context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW
        return
      }

      clearTimeout(context._timeout)

      context._hoverState = HoverState.SHOW

      if (!context.config.delay || !context.config.delay.show) {
        context.show()
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HoverState.SHOW) {
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
          event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER
        ] = false
      }

      if (context._isWithActiveTrigger()) {
        return
      }

      clearTimeout(context._timeout)

      context._hoverState = HoverState.OUT

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide()
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HoverState.OUT) {
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
      config = $.extend(
        {},
        this.constructor.Default,
        $(this.element).data(),
        config
      )

      if (config.delay && typeof config.delay === 'number') {
        config.delay = {
          show : config.delay,
          hide : config.delay
        }
      }

      if (config.title && typeof config.title === 'number') {
        config.title = config.title.toString()
      }

      if (config.content && typeof config.content === 'number') {
        config.content = config.content.toString()
      }

      Util.typeCheckConfig(
        NAME,
        config,
        this.constructor.DefaultType
      )

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


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' && config

        if (!data && /dispose|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Tooltip(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
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

  $.fn[NAME]             = Tooltip._jQueryInterface
  $.fn[NAME].Constructor = Tooltip
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tooltip._jQueryInterface
  }

  return Tooltip

})(jQuery)

export default Tooltip
