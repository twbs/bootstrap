/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.1): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Tooltip from './tooltip'

/**
 * Constants
 */

const NAME = 'popover'
const VERSION = '4.6.1'
const DATA_KEY = 'bs.popover'
const EVENT_KEY = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT = $.fn[NAME]
const CLASS_PREFIX = 'bs-popover'
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'

const Default = {
  ...Tooltip.Default,
  placement: 'right',
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' +
              '<div class="arrow"></div>' +
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

/**
 * Class definition
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

  addAttachmentClass(attachment) {
    $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`)
  }

  getTipElement() {
    this.tip = this.tip || $(this.config.template)[0]
    return this.tip
  }

  setContent() {
    const $tip = $(this.getTipElement())

    // We use append for html objects to maintain js events
    this.setElementContent($tip.find(SELECTOR_TITLE), this.getTitle())
    let content = this._getContent()
    if (typeof content === 'function') {
      content = content.call(this.element)
    }

    this.setElementContent($tip.find(SELECTOR_CONTENT), content)

    $tip.removeClass(`${CLASS_NAME_FADE} ${CLASS_NAME_SHOW}`)
  }

  // Private
  _getContent() {
    return this.element.getAttribute('data-content') ||
      this.config.content
  }

  _cleanTipClass() {
    const $tip = $(this.getTipElement())
    const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length > 0) {
      $tip.removeClass(tabClass.join(''))
    }
  }

  // Static
  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Popover(this, _config)
        $(this).data(DATA_KEY, data)
      }

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
 * jQuery
 */

$.fn[NAME] = Popover._jQueryInterface
$.fn[NAME].Constructor = Popover
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Popover._jQueryInterface
}

export default Popover
