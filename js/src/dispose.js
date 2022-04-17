/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dispose.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import { enableDismissTrigger } from './dom/magic-actions'

/**
 * Constants
 */

const NAME = 'dispose'
const DATA_KEY = 'bs.dispose'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_DISPOSE = `dispose${EVENT_KEY}`
const EVENT_DISPOSED = `disposed${EVENT_KEY}`
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

/**
 * Class definition
 */

class Dispose extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME
  }

  // Private
  dispose() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_DISPOSE)

    if (closeEvent.defaultPrevented) {
      return
    }

    this._element.classList.remove(CLASS_NAME_SHOW)

    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE)
    const completeCallback = () => {
      this._element.remove()
      EventHandler.trigger(this._element, EVENT_DISPOSED)
    }

    this._queueCallback(completeCallback, this._element, isAnimated)
    super.dispose()
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Dispose, 'dispose')

/**
 * jQuery
 */

defineJQueryPlugin(Dispose)

export default Dispose
