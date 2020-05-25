/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha1): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery } from './util/index'
import Data from './dom/data'
import SelectorEngine from './dom/selector-engine'
import Tooltip from './tooltip'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'popover'
const VERSION = '5.0.0-alpha1'
const DATA_KEY = 'bs.popover'
const EVENT_KEY = `.${DATA_KEY}`
const CLASS_PREFIX = 'bs-popover'
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

const Default = {
  ...Tooltip.Default,
  placement: 'right',
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' +
              '<div class="popover-arrow"></div>' +
              '<h3 class="popover-header"></h3>' +
              '<div class="popover-body"></div></div>'
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

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popover extends Tooltip {
  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  static get Event() {
    return Event
  }

  static get EVENT_KEY() {
    return EVENT_KEY
  }

  static get DefaultType() {
    return DefaultType
  }

  // Overrides

  isWithContent() {
    return this.getTitle() || this._getContent()
  }

  setContent() {
    const tip = this.getTipElement()

    // we use append for html objects to maintain js events
    this.setElementContent(SelectorEngine.findOne(SELECTOR_TITLE, tip), this.getTitle())
    let content = this._getContent()
    if (typeof content === 'function') {
      content = content.call(this.element)
    }

    this.setElementContent(SelectorEngine.findOne(SELECTOR_CONTENT, tip), content)

    tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW)
  }

  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${CLASS_PREFIX}-${attachment}`)
  }

  // Private

  _getContent() {
    return this.element.getAttribute('data-content') ||
      this.config.content
  }

  _cleanTipClass() {
    const tip = this.getTipElement()
    const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map(token => token.trim())
        .forEach(tClass => tip.classList.remove(tClass))
    }
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Popover(this, _config)
        Data.setData(this, DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Popover.jQueryInterface
  $.fn[NAME].Constructor = Popover
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Popover.jQueryInterface
  }
}

export default Popover
