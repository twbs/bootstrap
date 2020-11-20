/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha3): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  onDOMContentLoaded,
  TRANSITION_END,
  emulateTransitionEnd,
  getTransitionDurationFromElement,
  reflow,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'
import BaseComponent from './base-component'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'toast'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'

const POSITION_TOP_CENTER = 'top-center'
const POSITION_TOP_LEFT = 'top-left'
const POSITION_TOP_RIGHT = 'top-right'
const POSITION_BOTTOM_CENTER = 'bottom-center'
const POSITION_BOTTOM_LEFT = 'bottom-left'
const POSITION_BOTTOM_RIGHT = 'bottom-right'

const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number',
  position: 'string',
  positionMargin: 'number'
}

const Default = {
  animation: true,
  autohide: true,
  delay: 5000,
  position: POSITION_TOP_RIGHT,
  positionMargin: 10
}

const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element)

    this._config = this._getConfig(config)
    this._timeout = null
    this._setListeners()
  }

  // Getters

  static get DefaultType() {
    return DefaultType
  }

  static get Default() {
    return Default
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  // Public

  get config() {
    return this._config
  }

  show() {
    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW)

    if (showEvent.defaultPrevented) {
      return
    }

    this._clearTimeout()

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE)
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING)
      this._element.classList.add(CLASS_NAME_SHOW)

      EventHandler.trigger(this._element, EVENT_SHOWN)

      if (this._config.autohide) {
        this._timeout = setTimeout(() => {
          this.hide()
        }, this._config.delay)
      }
    }

    this._positionToast()
    reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOWING)
    if (this._config.animation) {
      const transitionDuration = getTransitionDurationFromElement(this._element)

      EventHandler.one(this._element, TRANSITION_END, complete)
      emulateTransitionEnd(this._element, transitionDuration)
    } else {
      complete()
    }
  }

  hide() {
    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    const complete = () => {
      this._clearPositioning()
      this._repositionExistingToasts()
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }

    this._element.classList.remove(CLASS_NAME_SHOW)
    if (this._config.animation) {
      const transitionDuration = getTransitionDurationFromElement(this._element)

      EventHandler.one(this._element, TRANSITION_END, complete)
      emulateTransitionEnd(this._element, transitionDuration)
    } else {
      complete()
    }
  }

  dispose() {
    this._clearTimeout()

    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this._element.classList.remove(CLASS_NAME_SHOW)
    }

    EventHandler.off(this._element, EVENT_CLICK_DISMISS)

    super.dispose()
    this._config = null
  }

  // Private

  _positionToast() {
    this._clearPositioning()
    this._element.style.position = 'absolute'
    const toastList = SelectorEngine.find(`.toast.${this._config.position}`, this._element.parentNode)
    const styles = {}

    if (this._config.position.includes('top-')) {
      const top = toastList.reduce((top, toastEl) => {
        const { height, marginBottom } = window.getComputedStyle(toastEl)

        top += (Number.parseInt(height, 10) + Number.parseInt(marginBottom, 10))
        return top
      }, this._config.positionMargin)

      if (this._config.position === POSITION_TOP_RIGHT) {
        this._element.classList.add(POSITION_TOP_RIGHT)
        styles.right = `${this._config.positionMargin}px`
      } else if (this._config.position === POSITION_TOP_LEFT) {
        this._element.classList.add(POSITION_TOP_LEFT)
        styles.left = `${this._config.positionMargin}px`
      } else {
        const leftPx = this._getMiddleToastPosition()

        this._element.classList.add(POSITION_TOP_CENTER)
        styles.left = `${leftPx}px`
      }

      styles.top = `${top}px`
      Manipulator.applyCss(this._element, styles)
      return
    }

    const bottom = toastList.reduce((bottom, toastEl) => {
      const { height, marginTop } = window.getComputedStyle(toastEl)

      bottom += (Number.parseInt(height, 10) + Number.parseInt(marginTop, 10))
      return bottom
    }, this._config.positionMargin)

    if (this._config.position === POSITION_BOTTOM_RIGHT) {
      this._element.classList.add(POSITION_BOTTOM_RIGHT)
      styles.right = `${this._config.positionMargin}px`
    } else if (this._config.position === POSITION_BOTTOM_LEFT) {
      this._element.classList.add(POSITION_BOTTOM_LEFT)
      styles.left = `${this._config.positionMargin}px`
    } else {
      const leftPx = this._getMiddleToastPosition()

      this._element.classList.add(POSITION_BOTTOM_CENTER)
      styles.left = `${leftPx}px`
    }

    styles.bottom = `${bottom}px`
    Manipulator.applyCss(this._element, styles)
  }

  _repositionExistingToasts() {
    if (!this._element.parentNode) {
      return
    }

    const toastList = SelectorEngine.find(`.toast.${this._config.position}`, this._element.parentNode)

    toastList.forEach((toastEl, index) => {
      const toastInstance = Toast.getInstance(toastEl)

      if (toastInstance.config.position.includes('top-')) {
        let top = toastInstance.config.positionMargin

        if (index > 0) {
          const previousToast = toastList[index - 1]
          const { height, marginBottom } = window.getComputedStyle(previousToast)

          top += (Number.parseInt(height, 10) + Number.parseInt(marginBottom, 10))
        }

        toastEl.style.top = `${top}px`
      }

      if (toastInstance.config.position.includes('bottom-')) {
        let bottom = toastInstance.config.positionMargin

        if (index > 0) {
          const previousToast = toastList[index - 1]
          const { height, marginTop } = window.getComputedStyle(previousToast)

          bottom += (Number.parseInt(height, 10) + Number.parseInt(marginTop, 10))
        }

        toastEl.style.bottom = `${bottom}px`
      }
    })
  }

  _clearPositioning() {
    Manipulator.applyCss(this._element, {
      position: '',
      right: '',
      left: '',
      bottom: '',
      top: ''
    })

    this._element.classList.remove(
      POSITION_TOP_RIGHT,
      POSITION_TOP_LEFT,
      POSITION_TOP_CENTER,
      POSITION_BOTTOM_RIGHT,
      POSITION_BOTTOM_LEFT,
      POSITION_BOTTOM_CENTER
    )
  }

  _getMiddleToastPosition() {
    const { width: computedWidthToast } = window.getComputedStyle(this._element)
    const { width: computedWidthContainer } = window.getComputedStyle(this._element.parentNode)
    const widthContainer = Number.parseInt(computedWidthContainer === 'auto' ? window.innerWidth : computedWidthContainer, 10)
    const widthToast = Number.parseInt(computedWidthToast === 'auto' ? widthContainer : computedWidthToast, 10)
    const middleContainerWidth = widthContainer / 2
    const middleToastWidth = widthToast / 2

    return middleContainerWidth > middleToastWidth ? middleContainerWidth - middleToastWidth : 0
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' && config ? config : {})
    }

    typeCheckConfig(NAME, config, this.constructor.DefaultType)

    return config
  }

  _setListeners() {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide())
  }

  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data) {
        data = new Toast(this, _config)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](this)
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Toast to jQuery only if jQuery is present
 */

onDOMContentLoaded(() => {
  const $ = getjQuery()
  /* istanbul ignore if */
  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME]
    $.fn[NAME] = Toast.jQueryInterface
    $.fn[NAME].Constructor = Toast
    $.fn[NAME].noConflict = () => {
      $.fn[NAME] = JQUERY_NO_CONFLICT
      return Toast.jQueryInterface
    }
  }
})

export default Toast
