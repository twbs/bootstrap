/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha1): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  TRANSITION_END,
  emulateTransitionEnd,
  findShadowRoot,
  getTransitionDurationFromElement,
  getUID,
  isElement,
  noop,
  typeCheckConfig
} from './util/index'
import {
  DefaultWhitelist,
  sanitizeHtml
} from './util/sanitizer'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import Popper from 'popper.js'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tooltip'
const VERSION = '5.0.0-alpha1'
const DATA_KEY = 'bs.tooltip'
const EVENT_KEY = `.${DATA_KEY}`
const CLASS_PREFIX = 'bs-tooltip'
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')
const DISALLOWED_ATTRIBUTES = ['bsSanitize', 'bsWhiteList', 'bsSanitizeFn']

const DefaultType = {
  bsAnimation: 'boolean',
  bsTemplate: 'string',
  bsTitle: '(string|element|function)',
  bsTrigger: 'string',
  bsDelay: '(number|object)',
  bsHtml: 'boolean',
  bsSelector: '(string|boolean)',
  bsPlacement: '(string|function)',
  bsOffset: '(number|string|function)',
  bsContainer: '(string|element|boolean)',
  bsFallbackPlacement: '(string|array)',
  bsBoundary: '(string|element)',
  bsSanitize: 'boolean',
  bsSanitizeFn: '(null|function)',
  bsWhiteList: 'object',
  bsPopperConfig: '(null|object)'
}

const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
}

const Default = {
  bsAnimation: true,
  bsTemplate: '<div class="tooltip" role="tooltip">' +
                    '<div class="tooltip-arrow"></div>' +
                    '<div class="tooltip-inner"></div></div>',
  bsTrigger: 'hover focus',
  bsTitle: '',
  bsDelay: 0,
  bsHtml: false,
  bsSelector: false,
  bsPlacement: 'top',
  bsOffset: 0,
  bsContainer: false,
  bsFallbackPlacement: 'flip',
  bsBoundary: 'scrollParent',
  bsSanitize: true,
  bsSanitizeFn: null,
  bsWhiteList: DefaultWhitelist,
  bsPopperConfig: null
}

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`
}

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_MODAL = 'modal'
const CLASS_NAME_SHOW = 'show'

const HOVER_STATE_SHOW = 'show'
const HOVER_STATE_OUT = 'out'

const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'

const TRIGGER_HOVER = 'hover'
const TRIGGER_FOCUS = 'focus'
const TRIGGER_CLICK = 'click'
const TRIGGER_MANUAL = 'manual'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tooltip {
  constructor(element, config) {
    if (typeof Popper === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org)')
    }

    // private
    this._isEnabled = true
    this._timeout = 0
    this._hoverState = ''
    this._activeTrigger = {}
    this._popper = null

    // Protected
    this.element = element
    this.config = this._getConfig(config)
    this.tip = null

    this._setListeners()
    Data.setData(element, this.constructor.DATA_KEY, this)
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
      let context = Data.getData(event.target, dataKey)

      if (!context) {
        context = new this.constructor(
          event.target,
          this._getDelegateConfig()
        )
        Data.setData(event.target, dataKey, context)
      }

      context._activeTrigger.click = !context._activeTrigger.click

      if (context._isWithActiveTrigger()) {
        context._enter(null, context)
      } else {
        context._leave(null, context)
      }
    } else {
      if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
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
    EventHandler.off(this.element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler)

    if (this.tip) {
      this.tip.parentNode.removeChild(this.tip)
    }

    this._isEnabled = null
    this._timeout = null
    this._hoverState = null
    this._activeTrigger = null
    if (this._popper) {
      this._popper.destroy()
    }

    this._popper = null
    this.element = null
    this.config = null
    this.tip = null
  }

  show() {
    if (this.element.style.display === 'none') {
      throw new Error('Please use show on visible elements')
    }

    if (this.isWithContent() && this._isEnabled) {
      const showEvent = EventHandler.trigger(this.element, this.constructor.Event.SHOW)
      const shadowRoot = findShadowRoot(this.element)
      const isInTheDom = shadowRoot === null ?
        this.element.ownerDocument.documentElement.contains(this.element) :
        shadowRoot.contains(this.element)

      if (showEvent.defaultPrevented || !isInTheDom) {
        return
      }

      const tip = this.getTipElement()
      const tipId = getUID(this.constructor.NAME)

      tip.setAttribute('id', tipId)
      this.element.setAttribute('aria-describedby', tipId)

      this.setContent()

      if (this.config.bsAnimation) {
        tip.classList.add(CLASS_NAME_FADE)
      }

      const placement = typeof this.config.bsPlacement === 'function' ?
        this.config.bsPlacement.call(this, tip, this.element) :
        this.config.bsPlacement

      const attachment = this._getAttachment(placement)
      this._addAttachmentClass(attachment)

      const container = this._getContainer()
      Data.setData(tip, this.constructor.DATA_KEY, this)

      if (!this.element.ownerDocument.documentElement.contains(this.tip)) {
        container.appendChild(tip)
      }

      EventHandler.trigger(this.element, this.constructor.Event.INSERTED)

      this._popper = new Popper(this.element, tip, this._getPopperConfig(attachment))

      tip.classList.add(CLASS_NAME_SHOW)

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop())
        })
      }

      const complete = () => {
        if (this.config.bsAnimation) {
          this._fixTransition()
        }

        const prevHoverState = this._hoverState
        this._hoverState = null

        EventHandler.trigger(this.element, this.constructor.Event.SHOWN)

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this)
        }
      }

      if (this.tip.classList.contains(CLASS_NAME_FADE)) {
        const transitionDuration = getTransitionDurationFromElement(this.tip)
        EventHandler.one(this.tip, TRANSITION_END, complete)
        emulateTransitionEnd(this.tip, transitionDuration)
      } else {
        complete()
      }
    }
  }

  hide() {
    const tip = this.getTipElement()
    const complete = () => {
      if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
        tip.parentNode.removeChild(tip)
      }

      this._cleanTipClass()
      this.element.removeAttribute('aria-describedby')
      EventHandler.trigger(this.element, this.constructor.Event.HIDDEN)
      if (this._popper !== null) {
        this._popper.destroy()
      }
    }

    const hideEvent = EventHandler.trigger(this.element, this.constructor.Event.HIDE)
    if (hideEvent.defaultPrevented) {
      return
    }

    tip.classList.remove(CLASS_NAME_SHOW)

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      [].concat(...document.body.children)
        .forEach(element => EventHandler.off(element, 'mouseover', noop))
    }

    this._activeTrigger[TRIGGER_CLICK] = false
    this._activeTrigger[TRIGGER_FOCUS] = false
    this._activeTrigger[TRIGGER_HOVER] = false

    if (this.tip.classList.contains(CLASS_NAME_FADE)) {
      const transitionDuration = getTransitionDurationFromElement(tip)

      EventHandler.one(tip, TRANSITION_END, complete)
      emulateTransitionEnd(tip, transitionDuration)
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

  getTipElement() {
    if (this.tip) {
      return this.tip
    }

    const element = document.createElement('div')
    element.innerHTML = this.config.bsTemplate

    this.tip = element.children[0]
    return this.tip
  }

  setContent() {
    const tip = this.getTipElement()
    this.setElementContent(SelectorEngine.findOne(SELECTOR_TOOLTIP_INNER, tip), this.getTitle())
    tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW)
  }

  setElementContent(element, content) {
    if (element === null) {
      return
    }

    if (typeof content === 'object' && isElement(content)) {
      if (content.jquery) {
        content = content[0]
      }

      // content is a DOM node or a jQuery
      if (this.config.bsHtml) {
        if (content.parentNode !== element) {
          element.innerHTML = ''
          element.appendChild(content)
        }
      } else {
        element.textContent = content.textContent
      }

      return
    }

    if (this.config.bsHtml) {
      if (this.config.bsSanitize) {
        content = sanitizeHtml(content, this.config.bsWhiteList, this.config.bsSanitizeFn)
      }

      element.innerHTML = content
    } else {
      element.textContent = content
    }
  }

  getTitle() {
    let title = this.element.getAttribute('data-bs-original-title')

    if (!title) {
      title = typeof this.config.bsTitle === 'function' ?
        this.config.bsTitle.call(this.element) :
        this.config.bsTitle
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
          behavior: this.config.bsFallbackPlacement
        },
        arrow: {
          element: `.${this.constructor.NAME}-arrow`
        },
        preventOverflow: {
          boundariesElement: this.config.bsBoundary
        }
      },
      onCreate: data => {
        if (data.originalPlacement !== data.placement) {
          this._handlePopperPlacementChange(data)
        }
      },
      onUpdate: data => this._handlePopperPlacementChange(data)
    }

    return {
      ...defaultBsConfig,
      ...this.config.bsPopperConfig
    }
  }

  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${CLASS_PREFIX}-${attachment}`)
  }

  _getOffset() {
    const offset = {}

    if (typeof this.config.bsOffset === 'function') {
      offset.fn = data => {
        data.offsets = {
          ...data.offsets,
          ...this.config.bsOffset(data.offsets, this.element) || {}
        }

        return data
      }
    } else {
      offset.offset = this.config.bsOffset
    }

    return offset
  }

  _getContainer() {
    if (this.config.bsContainer === false) {
      return document.body
    }

    if (isElement(this.config.bsContainer)) {
      return this.config.bsContainer
    }

    return SelectorEngine.findOne(this.config.bsContainer)
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()]
  }

  _setListeners() {
    const triggers = this.config.bsTrigger.split(' ')

    triggers.forEach(trigger => {
      if (trigger === 'click') {
        EventHandler.on(this.element,
          this.constructor.Event.CLICK,
          this.config.bsSelector,
          event => this.toggle(event)
        )
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ?
          this.constructor.Event.MOUSEENTER :
          this.constructor.Event.FOCUSIN
        const eventOut = trigger === TRIGGER_HOVER ?
          this.constructor.Event.MOUSELEAVE :
          this.constructor.Event.FOCUSOUT

        EventHandler.on(this.element,
          eventIn,
          this.config.bsSelector,
          event => this._enter(event)
        )
        EventHandler.on(this.element,
          eventOut,
          this.config.bsSelector,
          event => this._leave(event)
        )
      }
    })

    this._hideModalHandler = () => {
      if (this.element) {
        this.hide()
      }
    }

    EventHandler.on(this.element.closest(`.${CLASS_NAME_MODAL}`),
      'hide.bs.modal',
      this._hideModalHandler
    )

    if (this.config.bsSelector) {
      this.config = {
        ...this.config,
        bsTrigger: 'manual',
        bsSelector: ''
      }
    } else {
      this._fixTitle()
    }
  }

  _fixTitle() {
    const titleType = typeof this.element.getAttribute('data-bs-original-title')

    if (this.element.getAttribute('title') || titleType !== 'string') {
      this.element.setAttribute('data-bs-original-title', this.element.getAttribute('title') || '')
      this.element.setAttribute('title', '')
    }
  }

  _enter(event, context) {
    const dataKey = this.constructor.DATA_KEY
    context = context || Data.getData(event.target, dataKey)

    if (!context) {
      context = new this.constructor(
        event.target,
        this._getDelegateConfig()
      )
      Data.setData(event.target, dataKey, context)
    }

    if (event) {
      context._activeTrigger[
        event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = true
    }

    if (context.getTipElement().classList.contains(CLASS_NAME_SHOW) ||
        context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_SHOW

    if (!context.config.bsDelay || !context.config.bsDelay.show) {
      context.show()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show()
      }
    }, context.config.bsDelay.show)
  }

  _leave(event, context) {
    const dataKey = this.constructor.DATA_KEY
    context = context || Data.getData(event.target, dataKey)

    if (!context) {
      context = new this.constructor(
        event.target,
        this._getDelegateConfig()
      )
      Data.setData(event.target, dataKey, context)
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

    if (!context.config.bsDelay || !context.config.bsDelay.hide) {
      context.hide()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide()
      }
    }, context.config.bsDelay.hide)
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
    const dataAttributes = Manipulator.getDataAttributes(this.element)

    Object.keys(dataAttributes)
      .forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr]
        }
      })

    if (config && typeof config.bsContainer === 'object' && config.bsContainer.jquery) {
      config.bsContainer = config.bsContainer[0]
    }

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...typeof config === 'object' && config ? config : {}
    }

    if (typeof config.bsDelay === 'number') {
      config.bsDelay = {
        show: config.bsDelay,
        hide: config.bsDelay
      }
    }

    if (typeof config.bsTitle === 'number') {
      config.bsTitle = config.bsTitle.toString()
    }

    if (typeof config.bsContent === 'number') {
      config.bsContent = config.bsContent.toString()
    }

    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    if (config.bsSanitize) {
      config.bsTemplate = sanitizeHtml(config.bsTemplate, config.bsWhiteList, config.bsSanitizeFn)
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
    const tip = this.getTipElement()
    const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map(token => token.trim())
        .forEach(tClass => tip.classList.remove(tClass))
    }
  }

  _handlePopperPlacementChange(popperData) {
    const popperInstance = popperData.instance
    this.tip = popperInstance.popper
    this._cleanTipClass()
    this._addAttachmentClass(this._getAttachment(popperData.placement))
  }

  _fixTransition() {
    const tip = this.getTipElement()
    const initConfigAnimation = this.config.bsAnimation
    if (tip.getAttribute('x-placement') !== null) {
      return
    }

    tip.classList.remove(CLASS_NAME_FADE)
    this.config.bsAnimation = false
    this.hide()
    this.show()
    this.config.bsAnimation = initConfigAnimation
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Tooltip(this, _config)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .tooltip to jQuery only if jQuery is present
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Tooltip.jQueryInterface
  $.fn[NAME].Constructor = Tooltip
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tooltip.jQueryInterface
  }
}

export default Tooltip
