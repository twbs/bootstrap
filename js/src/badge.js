/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): badge.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import { enableDismissTrigger } from './util/component-functions'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'badge'
const DATA_KEY = 'bs.badge'
const EVENT_KEY = `.${DATA_KEY}`
const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_CLOSED = `closed${EVENT_KEY}`

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Badge extends BaseComponent {
  constructor(element) {
    super(element)

    this.badge = null
  }

  // Getters

  static get NAME() {
    return NAME
  }

  // Private

  _destroyElement() {
    this._element.remove()
    EventHandler.trigger(this._element, EVENT_CLOSED)
    this.dispose()
  }

  // Public

  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE)

    if (closeEvent.defaultPrevented) {
      return
    }

    this._queueCallback(() => this._destroyElement(), this._element, false)
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Badge.getOrCreateInstance(this, config)

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
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

enableDismissTrigger(Badge, 'close')

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .badge to jQuery only if jQuery is present
 */

defineJQueryPlugin(Badge)

export default Badge
