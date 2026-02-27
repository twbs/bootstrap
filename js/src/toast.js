/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import { enableDismissTrigger } from './util/component-functions.js'

/**
 * Constants
 */

const NAME = 'toast'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`

const CLASS_NAME_SHOW = 'show'
const ANIMATION_NAME_AUTOHIDE = 'toast-autohide'

/**
 * Class definition
 */

class Toast extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME
  }

  constructor(element, config) {
    super(element, config)

    EventHandler.on(this._element, 'animationend', event => this._onAnimationEnd(event))
  }

  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW)

    if (showEvent.defaultPrevented) {
      return
    }

    this._element.classList.add(CLASS_NAME_SHOW)
    EventHandler.trigger(this._element, EVENT_SHOWN)
  }

  hide() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    this._element.classList.remove(CLASS_NAME_SHOW)
    EventHandler.trigger(this._element, EVENT_HIDDEN)
  }

  // Private
  _onAnimationEnd(event) {
    if (event.animationName === ANIMATION_NAME_AUTOHIDE) {
      this.hide()
    }
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Toast)

export default Toast
