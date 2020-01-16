/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  getSelectorFromElement,
  getUID,
  makeArray,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'scrollspy'
const VERSION = '4.3.1'
const DATA_KEY = 'bs.scrollspy'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

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

const Event = {
  ACTIVATE: `activate${EVENT_KEY}`,
  SCROLL: `scroll${EVENT_KEY}`,
  LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {
  DROPDOWN_ITEM: 'dropdown-item',
  ACTIVE: 'active'
}

const Selector = {
  DATA_SPY: '[data-spy="scroll"]',
  NAV_LIST_GROUP: '.nav, .list-group',
  NAV_LINKS: '.nav-link',
  NAV_ITEMS: '.nav-item',
  LIST_ITEMS: '.list-group-item',
  DROPDOWN: '.dropdown',
  DROPDOWN_TOGGLE: '.dropdown-toggle'
}

const OffsetMethod = {
  OFFSET: 'offset',
  POSITION: 'position'
}

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
    this._selector = `${this._config.target} ${Selector.NAV_LINKS},` +
                          `${this._config.target} ${Selector.LIST_ITEMS},` +
                          `${this._config.target} .${ClassName.DROPDOWN_ITEM}`
    this._offsets = []
    this._targets = []
    this._activeTarget = null
    this._scrollHeight = 0

    EventHandler.on(this._scrollElement, Event.SCROLL, event => this._process(event))

    this.refresh()
    this._process()

    Data.setData(element, DATA_KEY, this)
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
      OffsetMethod.OFFSET :
      OffsetMethod.POSITION

    const offsetMethod = this._config.method === 'auto' ?
      autoMethod :
      this._config.method

    const offsetBase = offsetMethod === OffsetMethod.POSITION ?
      this._getScrollTop() :
      0

    this._offsets = []
    this._targets = []

    this._scrollHeight = this._getScrollHeight()

    const targets = makeArray(SelectorEngine.find(this._selector))

    targets
      .map(element => {
        let target
        const targetSelector = getSelectorFromElement(element)

        if (targetSelector) {
          target = SelectorEngine.findOne(targetSelector)
        }

        if (target) {
          const targetBCR = target.getBoundingClientRect()
          if (targetBCR.width || targetBCR.height) {
            return [
              Manipulator[offsetMethod](target).top + offsetBase,
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
    Data.removeData(this._element, DATA_KEY)
    EventHandler.off(this._scrollElement, EVENT_KEY)

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
      ...typeof config === 'object' && config ? config : {}
    }

    if (typeof config.target !== 'string') {
      let { id } = config.target
      if (!id) {
        id = getUID(NAME)
        config.target.id = id
      }

      config.target = `#${id}`
    }

    typeCheckConfig(NAME, config, DefaultType)

    return config
  }

  _getScrollTop() {
    return this._scrollElement === window ?
      this._scrollElement.pageYOffset :
      this._scrollElement.scrollTop
  }

  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
  }

  _getOffsetHeight() {
    return this._scrollElement === window ?
      window.innerHeight :
      this._scrollElement.getBoundingClientRect().height
  }

  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset
    const scrollHeight = this._getScrollHeight()
    const maxScroll = this._config.offset +
      scrollHeight -
      this._getOffsetHeight()

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

    const offsetLength = this._offsets.length
    for (let i = offsetLength; i--;) {
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

    const queries = this._selector.split(',')
      .map(selector => `${selector}[data-target="${target}"],${selector}[href="${target}"]`)

    const link = SelectorEngine.findOne(queries.join(','))

    if (link.classList.contains(ClassName.DROPDOWN_ITEM)) {
      SelectorEngine
        .findOne(Selector.DROPDOWN_TOGGLE, SelectorEngine.closest(link, Selector.DROPDOWN))
        .classList.add(ClassName.ACTIVE)

      link.classList.add(ClassName.ACTIVE)
    } else {
      // Set triggered link as active
      link.classList.add(ClassName.ACTIVE)

      SelectorEngine
        .parents(link, Selector.NAV_LIST_GROUP)
        .forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${Selector.NAV_LINKS}, ${Selector.LIST_ITEMS}`)
            .forEach(item => item.classList.add(ClassName.ACTIVE))

          // Handle special case when .nav-link is inside .nav-item
          SelectorEngine.prev(listGroup, Selector.NAV_ITEMS)
            .forEach(navItem => {
              SelectorEngine.children(navItem, Selector.NAV_LINKS)
                .forEach(item => item.classList.add(ClassName.ACTIVE))
            })
        })
    }

    EventHandler.trigger(this._scrollElement, Event.ACTIVATE, {
      relatedTarget: target
    })
  }

  _clear() {
    makeArray(SelectorEngine.find(this._selector))
      .filter(node => node.classList.contains(ClassName.ACTIVE))
      .forEach(node => node.classList.remove(ClassName.ACTIVE))
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data) {
        data = new ScrollSpy(this, _config)
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

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(window, Event.LOAD_DATA_API, () => {
  makeArray(SelectorEngine.find(Selector.DATA_SPY))
    .forEach(spy => new ScrollSpy(spy, Manipulator.getDataAttributes(spy)))
})

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = ScrollSpy.jQueryInterface
  $.fn[NAME].Constructor = ScrollSpy
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return ScrollSpy.jQueryInterface
  }
}

export default ScrollSpy
