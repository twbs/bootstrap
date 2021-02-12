/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.0): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'scrollspy'
const VERSION = '4.6.0'
const DATA_KEY = 'bs.scrollspy'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const Default = {
  offset: 10,
  method: 'auto',
  target: ''
}

const DefaultType = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
}

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
const EVENT_SCROLL = `scroll${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item'
const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_SPY = '[data-spy="scroll"]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_DROPDOWN_ITEMS = '.dropdown-item'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'

const METHOD_OFFSET = 'offset'
const METHOD_POSITION = 'position'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class ScrollSpy {
  constructor(element, config) {
    this._element = element
    this._scrollElement = element.tagName === 'BODY' ? window : element
    this._config = this._getConfig(config)
    this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS},` +
                          `${this._config.target} ${SELECTOR_LIST_ITEMS},` +
                          `${this._config.target} ${SELECTOR_DROPDOWN_ITEMS}`
    this._offsets = []
    this._targets = []
    this._activeTarget = null
    this._scrollHeight = 0

    $(this._scrollElement).on(EVENT_SCROLL, event => this._process(event))

    this.refresh()
    this._process()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  refresh() {
    const autoMethod = this._scrollElement === this._scrollElement.window ?
      METHOD_OFFSET : METHOD_POSITION

    const offsetMethod = this._config.method === 'auto' ?
      autoMethod : this._config.method

    const offsetBase = offsetMethod === METHOD_POSITION ?
      this._getScrollTop() : 0

    this._offsets = []
    this._targets = []

    this._scrollHeight = this._getScrollHeight()

    const targets = [].slice.call(document.querySelectorAll(this._selector))

    targets
      .map(element => {
        let target
        const targetSelector = Util.getSelectorFromElement(element)

        if (targetSelector) {
          target = document.querySelector(targetSelector)
        }

        if (target) {
          const targetBCR = target.getBoundingClientRect()
          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [
              $(target)[offsetMethod]().top + offsetBase,
              targetSelector
            ]
          }
        }

        return null
      })
      .filter(item => item)
      .sort((a, b) => a[0] - b[0])
      .forEach(item => {
        this._offsets.push(item[0])
        this._targets.push(item[1])
      })
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    $(this._scrollElement).off(EVENT_KEY)

    this._element = null
    this._scrollElement = null
    this._config = null
    this._selector = null
    this._offsets = null
    this._targets = null
    this._activeTarget = null
    this._scrollHeight = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' && config ? config : {})
    }

    if (typeof config.target !== 'string' && Util.isElement(config.target)) {
      let id = $(config.target).attr('id')
      if (!id) {
        id = Util.getUID(NAME)
        $(config.target).attr('id', id)
      }

      config.target = `#${id}`
    }

    Util.typeCheckConfig(NAME, config, DefaultType)

    return config
  }

  _getScrollTop() {
    return this._scrollElement === window ?
      this._scrollElement.pageYOffset : this._scrollElement.scrollTop
  }

  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
  }

  _getOffsetHeight() {
    return this._scrollElement === window ?
      window.innerHeight : this._scrollElement.getBoundingClientRect().height
  }

  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset
    const scrollHeight = this._getScrollHeight()
    const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight()

    if (this._scrollHeight !== scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      const target = this._targets[this._targets.length - 1]

      if (this._activeTarget !== target) {
        this._activate(target)
      }

      return
    }

    if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
      this._activeTarget = null
      this._clear()
      return
    }

    for (let i = this._offsets.length; i--;) {
      const isActiveTarget = this._activeTarget !== this._targets[i] &&
          scrollTop >= this._offsets[i] &&
          (typeof this._offsets[i + 1] === 'undefined' ||
              scrollTop < this._offsets[i + 1])

      if (isActiveTarget) {
        this._activate(this._targets[i])
      }
    }
  }

  _activate(target) {
    this._activeTarget = target

    this._clear()

    const queries = this._selector
      .split(',')
      .map(selector => `${selector}[data-target="${target}"],${selector}[href="${target}"]`)

    const $link = $([].slice.call(document.querySelectorAll(queries.join(','))))

    if ($link.hasClass(CLASS_NAME_DROPDOWN_ITEM)) {
      $link.closest(SELECTOR_DROPDOWN)
        .find(SELECTOR_DROPDOWN_TOGGLE)
        .addClass(CLASS_NAME_ACTIVE)
      $link.addClass(CLASS_NAME_ACTIVE)
    } else {
      // Set triggered link as active
      $link.addClass(CLASS_NAME_ACTIVE)
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      $link.parents(SELECTOR_NAV_LIST_GROUP)
        .prev(`${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`)
        .addClass(CLASS_NAME_ACTIVE)
      // Handle special case when .nav-link is inside .nav-item
      $link.parents(SELECTOR_NAV_LIST_GROUP)
        .prev(SELECTOR_NAV_ITEMS)
        .children(SELECTOR_NAV_LINKS)
        .addClass(CLASS_NAME_ACTIVE)
    }

    $(this._scrollElement).trigger(EVENT_ACTIVATE, {
      relatedTarget: target
    })
  }

  _clear() {
    [].slice.call(document.querySelectorAll(this._selector))
      .filter(node => node.classList.contains(CLASS_NAME_ACTIVE))
      .forEach(node => node.classList.remove(CLASS_NAME_ACTIVE))
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data) {
        data = new ScrollSpy(this, _config)
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
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(window).on(EVENT_LOAD_DATA_API, () => {
  const scrollSpys = [].slice.call(document.querySelectorAll(SELECTOR_DATA_SPY))
  const scrollSpysLength = scrollSpys.length

  for (let i = scrollSpysLength; i--;) {
    const $spy = $(scrollSpys[i])
    ScrollSpy._jQueryInterface.call($spy, $spy.data())
  }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = ScrollSpy._jQueryInterface
$.fn[NAME].Constructor = ScrollSpy
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return ScrollSpy._jQueryInterface
}

export default ScrollSpy
