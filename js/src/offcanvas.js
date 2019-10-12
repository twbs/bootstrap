/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery, getSelectorFromElement, getTransitionDurationFromElement } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'offcanvas'
const VERSION = '5.0.0-alpha1'
const DATA_KEY = 'bs.offcanvas'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const ESCAPE_KEYCODE = 27 // ESC
const DATA_BODY_ACTIONS = 'data-body'

const Selector = {
  DATA_DISMISS: '[data-dismiss="offcanvas"]',
  DATA_TOGGLE: '[data-toggle="offcanvas"]'
}

const Event = {
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
  CLICK_DISMISS: `click.dismiss${EVENT_KEY}`
}

const ClassName = {
  BACKDROP_BODY: 'offcanvas-backdrop',
  DISABLED: 'disabled',
  OPEN: 'offcanvas-open',
  TOGGLING: 'offcanvas-toggling',
  SHOW: 'show',
  STOP_OVERFLOW: 'offcanvas-freeze'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class OffCanvas {
  constructor(element) {
    this._element = element
    this._isShown = element.classList.contains(ClassName.SHOW)
    this._bodyOptions = element.getAttribute(DATA_BODY_ACTIONS)

    this._handleClosing()
    Data.setData(element, DATA_KEY, this)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide(relatedTarget) : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, Event.SHOW, { relatedTarget })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isShown = true
    document.body.classList.add(ClassName.TOGGLING)

    if (this._bodyOptions === 'backdrop') {
      document.body.classList.add(ClassName.BACKDROP_BODY)
    }

    if (this._bodyOptions !== 'scroll') {
      document.body.classList.add(ClassName.STOP_OVERFLOW)
    }

    this._element.removeAttribute('aria-hidden')
    this._element.classList.add(ClassName.SHOW)

    setTimeout(() => {
      this._element.setAttribute('aria-expanded', true)
      this._element.setAttribute('aria-offcanvas', true)

      document.body.classList.add(ClassName.OPEN)
      document.body.classList.remove(ClassName.TOGGLING)
      this._enforceFocus()
      EventHandler.trigger(this._element, Event.SHOWN, { relatedTarget })
    }, getTransitionDurationFromElement(this._element))
  }

  hide(relatedTarget) {
    if (!this._isShown) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, Event.HIDE, { relatedTarget })

    if (hideEvent.defaultPrevented) {
      return
    }

    this._isShown = false

    if (!document.body.classList.contains(ClassName.TOGGLING)) {
      document.body.classList.remove(ClassName.OPEN)
    }

    if (this._bodyOptions === 'backdrop') {
      document.body.classList.remove(ClassName.BACKDROP_BODY)
    }

    if (this._bodyOptions !== 'scroll') {
      document.body.classList.remove(ClassName.STOP_OVERFLOW)
    }

    document.body.classList.add(ClassName.TOGGLING)
    this._element.classList.remove(ClassName.SHOW)
    this._element.blur()

    setTimeout(() => {
      document.body.classList.remove(ClassName.TOGGLING)
      this._element.setAttribute('aria-hidden', true)
      this._element.setAttribute('aria-expanded', false)
      this._element.removeAttribute('aria-offcanvas')

      EventHandler.trigger(this._element, Event.HIDDEN, { relatedTarget })
    }, getTransitionDurationFromElement(this._element))
  }

  // Private
  _enforceFocus() {
    this._element.setAttribute('tabindex', '0')
    this._element.focus()
    this._element.setAttribute('tabindex', 1)
  }

  _handleClosing() {
    EventHandler.on(this._element, Event.CLICK_DISMISS, Selector.DATA_DISMISS, event => this.hide(event))

    EventHandler.on(document, 'keydown', event => {
      if (event.which === ESCAPE_KEYCODE) {
        this.hide(event.target)
      }
    })

    EventHandler.on(document, Event.CLICK_DATA_API, event => {
      const target = SelectorEngine.findOne(getSelectorFromElement(event.target))
      if (!this._element.contains(event.target) && target !== this._element) {
        this.hide(event.target)
      }
    })
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Data.getData(this, DATA_KEY) || new OffCanvas(this)

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](this)
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].indexOf(this.tagName) > -1) {
    event.preventDefault()
  }

  if (this.disabled || this.classList.contains(ClassName.DISABLED)) {
    return
  }

  const target = SelectorEngine.findOne(getSelectorFromElement(this))
  const data = Data.getData(target, DATA_KEY) || new OffCanvas(target)

  data.toggle(this)
})

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = OffCanvas.jQueryInterface
  $.fn[NAME].Constructor = OffCanvas
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return OffCanvas.jQueryInterface
  }
}

export default OffCanvas
