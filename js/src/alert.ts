/**
 * --------------------------------------------------------------------------
 * Bootstrap alert.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import { enableDismissTrigger } from './util/component-functions.js'
import { getTransitionDurationFromElement } from './util/index.js'

/**
 * Constants
 */

const NAME = 'alert'
const DATA_KEY = 'bs.alert'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_CLOSED = `closed${EVENT_KEY}`
const CLASS_NAME_HIDING = 'hiding'
const CLASS_NAME_SHOW = 'show'

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static override get NAME(): string {
    return NAME
  }

  // Public
  async close(): Promise<void> {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE)

    if (closeEvent.defaultPrevented) {
      return
    }

    // .hiding drives the exit transition in CSS. An alert is visible in the
    // markup, with or without .show, so its absence cannot mark the exit.
    this._element.classList.remove(CLASS_NAME_SHOW)
    this._element.classList.add(CLASS_NAME_HIDING)

    const isAnimated = getTransitionDurationFromElement(this._element) > 0
    await this._queueCallback(() => this._destroyElement(), this._element, isAnimated)
  }

  // Private
  protected _destroyElement(): void {
    this._element.remove()
    EventHandler.trigger(this._element, EVENT_CLOSED)
    this.dispose()
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Alert, 'close')

export default Alert
