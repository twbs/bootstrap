/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.2): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElement,
  getSelectorFromElement,
  typeCheckConfig
} from './util/index'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'
import BaseComponent from './base-component'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'scrollspy'
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

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
const EVENT_SCROLL = `scroll${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item'
const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`
const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'

const METHOD_OFFSET = 'offset'
const METHOD_POSITION = 'position'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element)
    this._scrollElement = this._element.tagName === 'BODY' ? window : this._element
    this._config = this._getConfig(config)
    this._offsets = []
    this._targets = []
    this._activeTarget = null
    this._scrollHeight = 0

    EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process())

    this.refresh()
    this._process()
  }

  // Getters

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  // Public

  refresh() {
    const autoMethod = this._scrollElement === this._scrollElement.window ?
      METHOD_OFFSET :
      METHOD_POSITION

    const offsetMethod = this._config.method === 'auto' ?
      autoMethod :
      this._config.method

    const offsetBase = offsetMethod === METHOD_POSITION ?
      this._getScrollTop() :
      0

    this._offsets = []
    this._targets = []
    this._scrollHeight = this._getScrollHeight()

    const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target)

    targets.map(element => {
      const targetSelector = getSelectorFromElement(element)
      const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null

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
    EventHandler.off(this._scrollElement, EVENT_KEY)
    super.dispose()
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' && config ? config : {})
    }

    config.target = getElement(config.target) || document.documentElement

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
          (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1])

      if (isActiveTarget) {
        this._activate(this._targets[i])
      }
    }
  }

  _activate(target) {
    this._activeTarget = target

    this._clear()

    const queries = SELECTOR_LINK_ITEMS.split(',')
      .map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`)

    const link = SelectorEngine.findOne(queries.join(','), this._config.target)

    link.classList.add(CLASS_NAME_ACTIVE)
    if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN))
        .classList.add(CLASS_NAME_ACTIVE)
    } else {
      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP)
        .forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`)
            .forEach(item => item.classList.add(CLASS_NAME_ACTIVE))

          // Handle special case when .nav-link is inside .nav-item
          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS)
            .forEach(navItem => {
              SelectorEngine.children(navItem, SELECTOR_NAV_LINKS)
                .forEach(item => item.classList.add(CLASS_NAME_ACTIVE))
            })
        })
    }

    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
      relatedTarget: target
    })
  }

  _clear() {
    SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target)
      .filter(node => node.classList.contains(CLASS_NAME_ACTIVE))
      .forEach(node => node.classList.remove(CLASS_NAME_ACTIVE))
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config]()
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  SelectorEngine.find(SELECTOR_DATA_SPY)
    .forEach(spy => new ScrollSpy(spy))
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .ScrollSpy to jQuery only if jQuery is present
 */

defineJQueryPlugin(ScrollSpy)

export default ScrollSpy
