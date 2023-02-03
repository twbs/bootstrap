/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.3.0-alpha1): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index.js'
import BaseComponent from './base-component.js'
import { enableDismissTrigger } from './util/component-functions.js'

/**
 * Constants
 */

const NAME = 'alert'

const EVENT_CLOSE = 'close'
const EVENT_CLOSED = 'closed'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME
  }

  // Public
  close() {
    const closeEvent = this._events.trigger(EVENT_CLOSE)

    if (closeEvent.defaultPrevented) {
      return
    }

    this._element.classList.remove(CLASS_NAME_SHOW)

    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE)
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated)
  }

  // Private
  _destroyElement() {
    this._element.remove()
    this._events.trigger(EVENT_CLOSED)
    this.dispose()
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this)

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

enableDismissTrigger(Alert, 'close')

/**
 * jQuery
 */

defineJQueryPlugin(Alert)

export default Alert
