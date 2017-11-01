import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import Popper from 'popper.js'
import SelectorEngine from './dom/selectorEngine'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
const Tooltip = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tooltip'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.tooltip'
  const EVENT_KEY           = `.${DATA_KEY}`
  const TRANSITION_DURATION = 150
  const CLASS_PREFIX        = 'bs-tooltip'
  const BSCLS_PREFIX_REGEX  = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

  const DefaultType = {
    animation           : 'boolean',
    template            : 'string',
    title               : '(string|element|function)',
    trigger             : 'string',
    delay               : '(number|object)',
    html                : 'boolean',
    selector            : '(string|boolean)',
    placement           : '(string|function)',
    offset              : '(number|string)',
    container           : '(string|element|boolean)',
    fallbackPlacement   : '(string|array)',
    boundary            : '(string|element)'
  }

  const AttachmentMap = {
    AUTO   : 'auto',
    TOP    : 'top',
    RIGHT  : 'right',
    BOTTOM : 'bottom',
    LEFT   : 'left'
  }

  const Default = {
    animation           : true,
    template            : '<div class="tooltip" role="tooltip">' +
                        '<div class="arrow"></div>' +
                        '<div class="tooltip-inner"></div></div>',
    trigger             : 'hover focus',
    title               : '',
    delay               : 0,
    html                : false,
    selector            : false,
    placement           : 'top',
    offset              : 0,
    container           : false,
    fallbackPlacement   : 'flip',
    boundary            : 'scrollParent'
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
    TOOLTIP_INNER : '.tooltip-inner',
    ARROW         : '.arrow'
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
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap tooltips require Popper.js (https://popper.js.org)')
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
        let context = Data.getData(event.delegateTarget, dataKey)

        if (!context) {
          context = new this.constructor(
            event.delegateTarget,
            this._getDelegateConfig()
          )
          Data.setData(event.delegateTarget, dataKey, context)
        }

        context._activeTrigger.click = !context._activeTrigger.click

        if (context._isWithActiveTrigger()) {
          context._enter(null, context)
        } else {
          context._leave(null, context)
        }
      } else {
        if (this.getTipElement().classList.contains(ClassName.SHOW)) {
          this._leave(null, this)
          return
        }

        this._enter(null, this)
      }
    }

    dispose() {
      clearTimeout(this._timeout)

      Data.removeData(this.element, this.constructor.DATA_KEY)

      EventHandler.off(this.element, this.constructor.EVENT_KEY)
      EventHandler.off(SelectorEngine.closest(this.element, '.modal'), 'hide.bs.modal')

      if (this.tip) {
        this.tip.parentNode.removeChild(this.tip)
      }

      this._isEnabled     = null
      this._timeout       = null
      this._hoverState    = null
      this._activeTrigger = null
      if (this._popper !== null) {
        this._popper.destroy()
      }

      this._popper = null
      this.element = null
      this.config  = null
      this.tip     = null
    }

    show() {
      if (this.element.style.display === 'none') {
        throw new Error('Please use show on visible elements')
      }

      if (this.isWithContent() && this._isEnabled) {
        const showEvent = EventHandler.trigger(this.element, this.constructor.Event.SHOW)
        const isInTheDom = this.element.ownerDocument.documentElement.contains(this.element)

        if (showEvent.defaultPrevented || !isInTheDom) {
          return
        }

        const tip   = this.getTipElement()
        const tipId = Util.getUID(this.constructor.NAME)

        tip.setAttribute('id', tipId)
        this.element.setAttribute('aria-describedby', tipId)

        this.setContent()

        if (this.config.animation) {
          tip.classList.add(ClassName.FADE)
        }

        const placement  = typeof this.config.placement === 'function'
          ? this.config.placement.call(this, tip, this.element)
          : this.config.placement

        const attachment = this._getAttachment(placement)
        this.addAttachmentClass(attachment)

        let container = this.config.container || document.body
        if (typeof container === 'string') {
          container = SelectorEngine.findOne(this.config.container)
        }

        Data.setData(tip, this.constructor.DATA_KEY, this)

        if (!this.element.ownerDocument.documentElement.contains(this.tip)) {
          container.appendChild(tip)
        }

        EventHandler.trigger(this.element, this.constructor.Event.INSERTED)

        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: {
              offset: this.config.offset
            },
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector.ARROW
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
          onUpdate: (data) => {
            this._handlePopperPlacementChange(data)
          }
        })

        tip.classList.add(ClassName.SHOW)

        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          Util.makeArray(document.body.children).forEach((element) => {
            EventHandler.on(element, 'mouseover', Util.noop())
          })
        }

        const complete = () => {
          if (this.config.animation) {
            this._fixTransition()
          }
          const prevHoverState = this._hoverState
          this._hoverState     = null

          EventHandler.trigger(this.element, this.constructor.Event.SHOWN)

          if (prevHoverState === HoverState.OUT) {
            this._leave(null, this)
          }
        }

        if (Util.supportsTransitionEnd() && this.tip.classList.contains(ClassName.FADE)) {
          EventHandler.one(this.tip, Util.TRANSITION_END, complete)
          Util.emulateTransitionEnd(this.tip, TRANSITION_DURATION)
        } else {
          complete()
        }
      }
    }

    hide(callback) {
      const tip       = this.getTipElement()
      const complete  = () => {
        if (this._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip)
        }

        this._cleanTipClass()
        this.element.removeAttribute('aria-describedby')
        EventHandler.trigger(this.element, this.constructor.Event.HIDDEN)
        if (this._popper !== null) {
          this._popper.destroy()
        }

        if (callback) {
          callback()
        }
      }

      const hideEvent = EventHandler.trigger(this.element, this.constructor.Event.HIDE)
      if (hideEvent.defaultPrevented) {
        return
      }

      tip.classList.remove(ClassName.SHOW)

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        Util.makeArray(document.body.children)
            .forEach((element) => EventHandler.off(element, 'mouseover', Util.noop()))
      }

      this._activeTrigger[Trigger.CLICK] = false
      this._activeTrigger[Trigger.FOCUS] = false
      this._activeTrigger[Trigger.HOVER] = false

      if (Util.supportsTransitionEnd() &&
          this.tip.classList.contains(ClassName.FADE)) {
        EventHandler.one(tip, Util.TRANSITION_END, complete)
        Util.emulateTransitionEnd(tip, TRANSITION_DURATION)
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
      this.getTipElement().classList.add(`${CLASS_PREFIX}-${attachment}`)
    }

    getTipElement() {
      if (this.tip) {
        return this.tip
      }

      const element = document.createElement('div')
      element.innerHTML = this.config.template

      this.tip = element.children[0]
      return this.tip
    }

    setContent() {
      const tip = this.getTipElement()
      this.setElementContent(SelectorEngine.findOne(Selector.TOOLTIP_INNER, tip), this.getTitle())
      tip.classList.remove(ClassName.FADE)
      tip.classList.remove(ClassName.SHOW)
    }

    setElementContent(element, content) {
      if (element === null) {
        return
      }

      const html = this.config.html
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        if (content.jquery) {
          content = content[0]
        }

        // content is a DOM node or a jQuery
        if (html) {
          if (content.parentNode !== element) {
            element.innerHTML = ''
            element.appendChild(content)
          }
        } else {
          element.innerText = content.textContent
        }
      } else {
        element[html ? 'innerHTML' : 'innerText'] = content
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

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()]
    }

    _setListeners() {
      const triggers = this.config.trigger.split(' ')

      triggers.forEach((trigger) => {
        if (trigger === 'click') {
          EventHandler.on(this.element,
            this.constructor.Event.CLICK,
            this.config.selector,
            (event) => this.toggle(event)
          )
        } else if (trigger !== Trigger.MANUAL) {
          const eventIn = trigger === Trigger.HOVER
            ? this.constructor.Event.MOUSEENTER
            : this.constructor.Event.FOCUSIN
          const eventOut = trigger === Trigger.HOVER
            ? this.constructor.Event.MOUSELEAVE
            : this.constructor.Event.FOCUSOUT

          EventHandler.on(this.element,
            eventIn,
            this.config.selector,
            (event) => this._enter(event)
          )
          EventHandler.on(this.element,
            eventOut,
            this.config.selector,
            (event) => this._leave(event)
          )
        }
      })

      EventHandler.on(SelectorEngine.closest(this.element, '.modal'),
        'hide.bs.modal',
        () => this.hide()
      )

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
      context = context || Data.getData(event.delegateTarget, dataKey)

      if (!context) {
        context = new this.constructor(
          event.delegateTarget,
          this._getDelegateConfig()
        )
        Data.setData(event.delegateTarget, dataKey, context)
      }

      if (event) {
        context._activeTrigger[
          event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER
        ] = true
      }

      if (context.getTipElement().classList.contains(ClassName.SHOW) ||
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

      context = context || Data.getData(event.delegateTarget, dataKey)

      if (!context) {
        context = new this.constructor(
          event.delegateTarget,
          this._getDelegateConfig()
        )
        Data.setData(event.delegateTarget, dataKey, context)
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
      if (typeof config !== 'undefined' &&
        typeof config.container === 'object' && config.container.jquery) {
        config.container = config.container[0]
      }

      config = {
        ...this.constructor.Default,
        ...Util.getDataAttributes(this.element),
        ...config
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
      const tip = this.getTipElement()
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX)
      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map((token) => token.trim()).forEach((tClass) => {
          tip.classList.remove(tClass)
        })
      }
    }

    _handlePopperPlacementChange(data) {
      this._cleanTipClass()
      this.addAttachmentClass(this._getAttachment(data.placement))
    }

    _fixTransition() {
      const tip = this.getTipElement()
      const initConfigAnimation = this.config.animation
      if (tip.getAttribute('x-placement') !== null) {
        return
      }
      tip.classList.remove(ClassName.FADE)
      this.config.animation = false
      this.hide()
      this.show()
      this.config.animation = initConfigAnimation
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = Data.getData(this, DATA_KEY)
        const _config = typeof config === 'object' && config

        if (!data && /dispose|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Tooltip(this, _config)
          Data.setData(this, DATA_KEY, data)
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
  const $ = Util.jQuery
  if (typeof $ !== 'undefined') {
    const JQUERY_NO_CONFLICT  = $.fn[NAME]

    $.fn[NAME] = Tooltip._jQueryInterface
    $.fn[NAME].Constructor = Tooltip
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT
      return Tooltip._jQueryInterface
    }
  }

  return Tooltip
})(Popper)

export default Tooltip
