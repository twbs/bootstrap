/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery, typeCheckConfig } from './util/index'
import Data from './dom/data'
import SelectorEngine from './dom/selector-engine'
import Tooltip from './tooltip'
import Manipulator from './dom/manipulator'
import { sanitizeHtml } from './util/sanitizer'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'popover'
const VERSION = '4.3.1'
const DATA_KEY = 'bs.popover'
const EVENT_KEY = `.${DATA_KEY}`
const CLASS_PREFIX = 'bs-popover'
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')
const DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn']

const Default = {
  ...Tooltip.Default,
  placement: 'right',
  trigger: 'click',
  content: '',
  templateWithHeader: '<div class="popover" role="tooltip">' +
              '<div class="popover-arrow"></div>' +
              '<h3 class="popover-header"></h3>' +
              '<div class="popover-body"></div></div>',
  templateWithoutHeader: '<div class="popover" role="tooltip">' +
              '<div class="popover-arrow"></div>' +
              '<div class="popover-body"></div></div>'
}

const DefaultType = {
  ...Tooltip.DefaultType,
  content: '(string|element|function)'
}

const ClassName = {
  FADE: 'fade',
  SHOW: 'show'
}

const Selector = {
  TITLE: '.popover-header',
  CONTENT: '.popover-body'
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
    this.setElementContent(SelectorEngine.findOne(Selector.TITLE, tip), this.getTitle())
    let content = this._getContent()
    if (typeof content === 'function') {
      content = content.call(this.element)
    }

    this.setElementContent(SelectorEngine.findOne(Selector.CONTENT, tip), content)

    tip.classList.remove(ClassName.FADE)
    tip.classList.remove(ClassName.SHOW)
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this.element)

    Object.keys(dataAttributes)
      .forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr]
        }
      })

    if (config && typeof config.container === 'object' && config.container.jquery) {
      config.container = config.container[0]
    }

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...typeof config === 'object' && config ? config : {}
    }

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString()
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString()
    }

    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    if (config.sanitize) {
      config.template = sanitizeHtml(config.templateWithHeader, config.whiteList, config.sanitizeFn)
      if (!this.element.getAttribute('title') && !config.title) {
        config.template = sanitizeHtml(config.templateWithoutHeader, config.whiteList, config.sanitizeFn)
      }
    }

    return config
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
