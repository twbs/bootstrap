/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index'
import Tooltip from './tooltip'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'popover'
const DATA_KEY = 'bs.popover'
const EVENT_KEY = `.${DATA_KEY}`
const CLASS_PREFIX = 'bs-popover'

const Default = {
  ...Tooltip.Default,
  placement: 'right',
  offset: [0, 8],
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' +
              '<div class="popover-arrow"></div>' +
              '<h3 class="popover-header"></h3>' +
              '<div class="popover-body"></div>' +
            '</div>'
}

const DefaultType = {
  ...Tooltip.DefaultType,
  content: '(string|element|function)'
}

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`
}

const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popover extends Tooltip {
  // Getters

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get Event() {
    return Event
  }

  static get DefaultType() {
    return DefaultType
  }

  // Overrides

  isWithContent() {
    return this.getTitle() || this._getContent()
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE)
    this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT)
  }

  // Private

  _getContent() {
    return this._resolvePossibleFunction(this._config.content)
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config)

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
 * jQuery
 * ------------------------------------------------------------------------
 * add .Popover to jQuery only if jQuery is present
 */

defineJQueryPlugin(Popover)

export default Popover
