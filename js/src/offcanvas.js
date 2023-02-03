/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.3.0-alpha1): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  isDisabled,
  isVisible
} from './util/index.js'
import ScrollBarHelper from './util/scrollbar.js'
import { ScopedEventHandler } from './dom/event-handler.js'
import BaseComponent from './base-component.js'
import SelectorEngine from './dom/selector-engine.js'
import Backdrop from './util/backdrop.js'
import FocusTrap from './util/focustrap.js'
import { enableDismissTrigger } from './util/component-functions.js'

/**
 * Constants
 */

const NAME = 'offcanvas'
const ESCAPE_KEY = 'Escape'

const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'
const CLASS_NAME_HIDING = 'hiding'
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop'
const OPEN_SELECTOR = '.offcanvas.show'

const EVENT_SHOW = 'show'
const EVENT_SHOWN = 'shown'
const EVENT_HIDE = 'hide'
const EVENT_HIDE_PREVENTED = 'hidePrevented'
const EVENT_HIDDEN = 'hidden'
const EVENT_RESIZE = 'resize'
const EVENT_CLICK = 'click'
const EVENT_LOAD = 'load'
const EVENT_KEYDOWN_DISMISS = 'keydown.dismiss'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]'

const Default = {
  backdrop: true,
  keyboard: true,
  scroll: false
}

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
}

/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._isShown = false
    this._backdrop = this._initializeBackDrop()
    this._focustrap = this._initializeFocusTrap()
    this._addEventListeners()
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown) {
      return
    }

    const showEvent = this._events.trigger(EVENT_SHOW, { relatedTarget })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isShown = true
    this._backdrop.show()

    if (!this._config.scroll) {
      new ScrollBarHelper().hide()
    }

    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')
    this._element.classList.add(CLASS_NAME_SHOWING)

    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate()
      }

      this._element.classList.add(CLASS_NAME_SHOW)
      this._element.classList.remove(CLASS_NAME_SHOWING)
      this._events.trigger(EVENT_SHOWN, { relatedTarget })
    }

    this._queueCallback(completeCallBack, this._element, true)
  }

  hide() {
    if (!this._isShown) {
      return
    }

    const hideEvent = this._events.trigger(EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    this._focustrap.deactivate()
    this._element.blur()
    this._isShown = false
    this._element.classList.add(CLASS_NAME_HIDING)
    this._backdrop.hide()

    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_HIDING)
      this._element.removeAttribute('aria-modal')
      this._element.removeAttribute('role')

      if (!this._config.scroll) {
        new ScrollBarHelper().reset()
      }

      this._events.trigger(EVENT_HIDDEN)
    }

    this._queueCallback(completeCallback, this._element, true)
  }

  dispose() {
    this._backdrop.dispose()
    this._focustrap.deactivate()
    super.dispose()
  }

  // Private
  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        this._events.trigger(EVENT_HIDE_PREVENTED)
        return
      }

      this.hide()
    }

    // 'static' option will be translated to true, and booleans will keep their value
    const isVisible = Boolean(this._config.backdrop)

    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible ? clickCallback : null
    })
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    })
  }

  _addEventListeners() {
    this._events.on(EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return
      }

      if (!this._config.keyboard) {
        this._events.trigger(EVENT_HIDE_PREVENTED)
        return
      }

      this.hide()
    })
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config](this)
    })
  }
}

/**
 * Data API implementation
 */

new ScopedEventHandler(document, Offcanvas.EVENT_KEY, true).on(EVENT_CLICK, SELECTOR_DATA_TOGGLE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this)

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  if (isDisabled(this)) {
    return
  }

  new ScopedEventHandler(target, Offcanvas.EVENT_KEY).one(EVENT_HIDDEN, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus()
    }
  })

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR)
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide()
  }

  const data = Offcanvas.getOrCreateInstance(target)
  data.toggle(this)
})

const handler = new ScopedEventHandler(window, Offcanvas.EVENT_KEY, true)
handler.on(EVENT_LOAD, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show()
  }
})

handler.on(EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide()
    }
  }
})

enableDismissTrigger(Offcanvas)

/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas)

export default Offcanvas
