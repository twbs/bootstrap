/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElementFromSelector,
  getSelectorFromElement,
  getTransitionDurationFromElement,
  isVisible
} from './util/index'
import { hide as scrollBarHide, reset as scrollBarReset } from './util/scrollbar'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'offcanvas'
const DATA_KEY = 'bs.offcanvas'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const ESCAPE_KEY = 'Escape'
const DATA_BODY_ACTIONS = 'data-bs-body'

const CLASS_NAME_BACKDROP_BODY = 'offcanvas-backdrop'
const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_SHOW = 'show'
const OPEN_SELECTOR = '.offcanvas.show'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`

const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="offcanvas"]'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class OffCanvas extends BaseComponent {
  constructor(element) {
    super(element)

    this._isShown = element.classList.contains(CLASS_NAME_SHOW)
    this._bodyOptions = element.getAttribute(DATA_BODY_ACTIONS)
    this._handleClosing()
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, { relatedTarget })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isShown = true
    this._element.style.visibility = 'visible'
    document.body.classList.add(CLASS_NAME_TOGGLING)

    if (!this._bodyOptionsHas('scroll')) {
      document.body.classList.add(CLASS_NAME_BACKDROP_BODY)
      scrollBarHide()
    }

    this._element.removeAttribute('aria-hidden')
    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')
    this._element.classList.add(CLASS_NAME_SHOW)

    const completeCallBack = () => {
      this._enforceFocusOnElement(this._element)
      EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget })
    }

    setTimeout(completeCallBack, getTransitionDurationFromElement(this._element))
  }

  hide() {
    if (!this._isShown) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    EventHandler.off(document, EVENT_FOCUSIN)
    this._element.blur()
    this._isShown = false
    this._element.classList.remove(CLASS_NAME_SHOW)

    const completeCallback = () => {
      this._element.setAttribute('aria-hidden', true)
      this._element.removeAttribute('aria-modal')
      this._element.removeAttribute('role')
      this._element.style.visibility = 'hidden'

      if (!this._bodyOptionsHas('scroll')) {
        scrollBarReset()
        document.body.classList.remove(CLASS_NAME_BACKDROP_BODY)
      }

      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }

    setTimeout(completeCallback, getTransitionDurationFromElement(this._element))
  }

  _enforceFocusOnElement(element) {
    EventHandler.off(document, EVENT_FOCUSIN) // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN, event => {
      if (document !== event.target &&
        element !== event.target &&
        !element.contains(event.target)) {
        element.focus()
      }
    })
    element.focus()
  }

  _bodyOptionsHas(option) {
    return this._bodyOptions === option
  }

  _handleClosing() {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide())

    EventHandler.on(document, 'keydown', event => {
      if (event.key === ESCAPE_KEY) {
        this.hide()
      }
    })

    EventHandler.on(document, EVENT_CLICK_DATA_API, event => {
      const target = SelectorEngine.findOne(getSelectorFromElement(event.target))
      if (!this._element.contains(event.target) && target !== this._element) {
        this.hide()
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
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = getElementFromSelector(this)

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
    return
  }

  EventHandler.one(target, EVENT_HIDDEN, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus()
    }
  })

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR)
  if (allReadyOpen && allReadyOpen !== target) {
    return
  }

  const data = Data.getData(target, DATA_KEY) || new OffCanvas(target)
  data.toggle(this)
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

defineJQueryPlugin(NAME, OffCanvas)

export default OffCanvas
