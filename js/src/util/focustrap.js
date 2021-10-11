/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler'
import SelectorEngine from '../dom/selector-engine'
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
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY}`

const TAB_KEY = 'Tab'
const TAB_NAV_FORWARD = 'forward'
const TAB_NAV_BACKWARD = 'backward'

class FocusTrap {
  constructor(config) {
    this._config = this._getConfig(config)
    this._isActive = false
    this._lastTabNavDirection = null
  }

  activate() {
    const { trapElement, autofocus } = this._config

    if (this._isActive) {
      return
    }

    if (autofocus) {
      trapElement.focus()
    }

    EventHandler.off(document, EVENT_KEY) // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN, event => this._handleFocusin(event))
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event))

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

  _handleFocusin(event) {
    const { target } = event
    const { trapElement } = this._config

    if (target === document || target === trapElement || trapElement.contains(target)) {
      return
    }

    const elements = SelectorEngine.focusableChildren(trapElement)

    if (elements.length === 0) {
      trapElement.focus()
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus()
    } else {
      elements[0].focus()
    }
  }

  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return
    }

    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD
  }

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
