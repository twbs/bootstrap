/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.2): util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler'
import { typeCheckConfig } from './index'

const Default = {
  trapElement: null, // The element to trap focus inside of
  autofocus: true
}

const DefaultType = {
  trapElement: 'element',
  autofocus: 'boolean'
}

const NAME = 'focustrap'
const DATA_KEY = 'bs.focustrap'
const EVENT_KEY = `.${DATA_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`

class FocusTrap {
  constructor(config) {
    this._config = this._getConfig(config)
    this._isActive = false
  }

  activate() {
    const { trapElement, autofocus } = this._config

    if (!trapElement || this._isActive) {
      return
    }

    if (autofocus) {
      trapElement.focus()
    }

    EventHandler.off(document, EVENT_FOCUSIN) // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN, event => {
      if (document !== event.target &&
        trapElement !== event.target &&
        !trapElement.contains(event.target)) {
        trapElement.focus()
      }
    })

    this._isActive = true
  }

  deactivate() {
    if (!this._isActive) {
      return
    }

    this._isActive = false
    EventHandler.off(document, EVENT_KEY)
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' ? config : {})
    }
    typeCheckConfig(NAME, config, DefaultType)
    return config
  }
}

export default FocusTrap
