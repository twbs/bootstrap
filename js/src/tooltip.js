import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const ToolTip = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tooltip'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.tooltip'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150
  const CLASS_PREFIX        = 'bs-tether'

  const Default = {
    animation   : true,
    template    : '<div class="tooltip" role="tooltip">'
                + '<div class="tooltip-arrow"></div>'
                + '<div class="tooltip-inner"></div></div>',
    trigger     : 'hover focus',
    title       : '',
    delay       : 0,
    html        : false,
    selector    : false,
    attachment  : 'top',
    offset      : '0 0',
    constraints : null
  }

  const HorizontalMirror = {
    LEFT   : 'right',
    CENTER : 'center',
    RIGHT  : 'left'
  }

  const VerticalMirror = {
    TOP    : 'bottom',
    MIDDLE : 'middle',
    BOTTOM : 'top'
  }

  const VerticalDefault = {
    LEFT   : 'middle',
    CENTER : 'bottom',
    RIGHT  : 'middle'
  }

  const HorizontalDefault = {
    TOP    : 'center',
    MIDDLE : 'left',
    BOTTOM : 'center'
  }

  const HoverState = {
    IN  : 'in',
    OUT : 'out'
  }

  const Event = {
    HIDE       : 'hide.bs.tooltip',
    HIDDEN     : 'hidden.bs.tooltip',
    SHOW       : 'show.bs.tooltip',
    SHOWN      : 'shown.bs.tooltip',
    INSERTED   : 'inserted.bs.tooltip',
    CLICK      : 'click.bs.tooltip',
    FOCUSIN    : 'focusin.bs.tooltip',
    FOCUSOUT   : 'focusout.bs.tooltip',
    MOUSEENTER : 'mouseenter.bs.tooltip',
    MOUSELEAVE : 'mouseleave.bs.tooltip'
  }

  const ClassName = {
    FADE : 'fade',
    IN   : 'in'
  }

  const Selector = {
    TOOLTIP       : '.tooltip',
    TOOLTIP_INNER : '.tooltip-inner',
    TOOLTIP_ARROW : '.tooltip-arrow'
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
      this._isEnabled      = true
      this._timeout        = 0
      this._hoverState     = ''
      this._activeTrigger  = {}

      // protected
      this.element = element
      this.config  = this._getConfig(config)
      this.tip     = null
      this.tether  = null

      this._setListeners()

    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
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
      let context = this

      if (event) {
        context = $(event.currentTarget).data(DATA_KEY)

        if (!context) {
          context = new this.constructor(
            event.currentTarget,
            this._getDelegateConfig()
          )
          $(event.currentTarget).data(DATA_KEY, context)
        }

        context._activeTrigger.click = !context._activeTrigger.click

        if (context._isWithActiveTrigger()) {
          context._enter(null, context)
        } else {
          context._leave(null, context)
        }

      } else {
        $(context.getTipElement()).hasClass(ClassName.IN) ?
          context._leave(null, context) :
          context._enter(null, context)
      }
    }

    destroy() {
      clearTimeout(this._timeout)
      this.hide(() => {
        $(this.element)
          .off(Selector.TOOLTIP)
          .removeData(DATA_KEY)
      })
    }

    show() {
      let showEvent = $.Event(Event.SHOW)

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent)

        let isInTheDom = $.contains(
          this.element.ownerDocument.documentElement,
          this.element
        )

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return
        }

        let tip   = this.getTipElement()
        let tipId = Util.getUID(NAME)

        tip.setAttribute('id', tipId)
        this.element.setAttribute('aria-describedby', tipId)

        this.setContent()

        if (this.config.animation) {
          $(tip).addClass(ClassName.FADE)
        }

        let attachment = typeof this.config.attachment === 'function' ?
          this.config.attachment.call(this, tip, this.element) :
          this.config.attachment

        attachment = this.getAttachment(attachment)

        $(tip).data(DATA_KEY, this)

        this.element.parentNode.insertBefore(tip, this.element.nextSibling)
        $(this.element).trigger(Event.INSERTED)

        this.tether = new Tether({
          element     : this.tip,
          target      : this.element,
          attachment  : attachment,
          classes     : TetherClass,
          classPrefix : CLASS_PREFIX,
          offset      : this.config.offset,
          constraints : this.config.constraints
        })

        Util.reflow(tip)
        this.tether.position()

        $(tip).addClass(ClassName.IN)

        let complete = () => {
          let prevHoverState = this._hoverState
          this._hoverState   = null

          $(this.element).trigger(Event.SHOWN)

          if (prevHoverState === HoverState.OUT) {
            this._leave(null, this)
          }
        }

        Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE) ?
          $(this.tip)
            .one(Util.TRANSITION_END, complete)
            .emulateTransitionEnd(Tooltip._TRANSITION_DURATION) :
          complete()
      }
    }

    hide(callback) {
      let tip       = this.getTipElement()
      let hideEvent = $.Event(Event.HIDE)
      let complete  = () => {
        if (this._hoverState !== HoverState.IN && tip.parentNode) {
          tip.parentNode.removeChild(tip)
        }

        this.element.removeAttribute('aria-describedby')
        $(this.element).trigger(Event.HIDDEN)
        this.cleanupTether()

        if (callback) {
          callback()
        }
      }

      $(this.element).trigger(hideEvent)

      if (hideEvent.isDefaultPrevented()) {
        return
      }

      $(tip).removeClass(ClassName.IN)

      if (Util.supportsTransitionEnd() &&
         ($(this.tip).hasClass(ClassName.FADE))) {

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
      return !!this.getTitle()
    }

    getTipElement() {
      return (this.tip = this.tip || $(this.config.template)[0])
    }

    getAttachment(attachmentString) {
      let attachmentArray      = attachmentString.split(' ')
      let normalizedAttachment = {}

      if (!attachmentArray.length) {
        throw new Error('Tooltip requires attachment')
      }

      for (let attachment of attachmentArray) {
        attachment = attachment.toUpperCase()

        if (HorizontalMirror[attachment]) {
          normalizedAttachment.horizontal = HorizontalMirror[attachment]
        }

        if (VerticalMirror[attachment]) {
          normalizedAttachment.vertical = VerticalMirror[attachment]
        }
      }

      if (!normalizedAttachment.horizontal &&
         (!normalizedAttachment.vertical)) {
        throw new Error('Tooltip requires valid attachment')
      }

      if (!normalizedAttachment.horizontal) {
        normalizedAttachment.horizontal =
          HorizontalDefault[normalizedAttachment.vertical.toUpperCase()]
      }

      if (!normalizedAttachment.vertical) {
        normalizedAttachment.vertical =
          VerticalDefault[normalizedAttachment.horizontal.toUpperCase()]
      }

      return [
        normalizedAttachment.vertical,
        normalizedAttachment.horizontal
      ].join(' ')
    }

    setContent() {
      let tip    = this.getTipElement()
      let title  = this.getTitle()
      let method = this.config.html ? 'innerHTML' : 'innerText'

      $(tip).find(Selector.TOOLTIP_INNER)[0][method] = title

      $(tip)
        .removeClass(ClassName.FADE)
        .removeClass(ClassName.IN)

      this.cleanupTether()
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

    removeTetherClasses(i, css) {
      return ((css.baseVal || css).match(
        new RegExp(`(^|\\s)${CLASS_PREFIX}-\\S+`, 'g')) || []
      ).join(' ')
    }

    cleanupTether() {
      if (this.tether) {
        this.tether.destroy()

        // clean up after tether's junk classes
        // remove after they fix issue
        // (https://github.com/HubSpot/tether/issues/36)
        $(this.element).removeClass(this.removeTetherClasses)
        $(this.tip).removeClass(this.removeTetherClasses)
      }
    }


    // private

    _setListeners() {
      let triggers = this.config.trigger.split(' ')

      triggers.forEach((trigger) => {
        if (trigger === 'click') {
          $(this.element).on(
            Event.CLICK,
            this.config.selector,
            this.toggle.bind(this)
          )

        } else if (trigger !== Trigger.MANUAL) {
          let eventIn  = trigger == Trigger.HOVER ?
            Event.MOUSEENTER : Event.FOCUSIN
          let eventOut = trigger == Trigger.HOVER ?
            Event.MOUSELEAVE : Event.FOCUSOUT

          $(this.element)
            .on(
              eventIn,
              this.config.selector,
              this._enter.bind(this)
            )
            .on(
              eventOut,
              this.config.selector,
              this._leave.bind(this)
            )
        }
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
      let titleType = typeof this.element.getAttribute('data-original-title')
      if (this.element.getAttribute('title') ||
         (titleType !== 'string')) {
        this.element.setAttribute(
          'data-original-title',
          this.element.getAttribute('title') || ''
        )
        this.element.setAttribute('title', '')
      }
    }

    _enter(event, context) {
      context = context || $(event.currentTarget).data(DATA_KEY)

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        )
        $(event.currentTarget).data(DATA_KEY, context)
      }

      if (event) {
        context._activeTrigger[
          event.type == 'focusin' ? Trigger.FOCUS : Trigger.HOVER
        ] = true
      }

      if ($(context.getTipElement()).hasClass(ClassName.IN) ||
         (context._hoverState === HoverState.IN)) {
        context._hoverState = HoverState.IN
        return
      }

      clearTimeout(context._timeout)

      context._hoverState = HoverState.IN

      if (!context.config.delay || !context.config.delay.show) {
        context.show()
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HoverState.IN) {
          context.show()
        }
      }, context.config.delay.show)
    }

    _leave(event, context) {
      context = context || $(event.currentTarget).data(DATA_KEY)

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        )
        $(event.currentTarget).data(DATA_KEY, context)
      }

      if (event) {
        context._activeTrigger[
          event.type == 'focusout' ? Triger.FOCUS : Trigger.HOVER
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
      for (let trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true
        }
      }

      return false
    }

    _getConfig(config) {
      config = $.extend({}, Default, $(this.element).data(), config)

      if (config.delay && typeof config.delay === 'number') {
        config.delay = {
          show : config.delay,
          hide : config.delay
        }
      }

      return config
    }

    _getDelegateConfig() {
      let config = {}

      if (this.config) {
        for (let key in this.config) {
          let value = this.config[key]
          if (Default[key] !== value) {
            config[key] = value
          }
        }
      }

      return config
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data   = $(this).data(DATA_KEY)
        let _config = typeof config === 'object' ?
          config : null

        if (!data && /destroy|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Tooltip(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
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
