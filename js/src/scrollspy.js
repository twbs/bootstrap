/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta1): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getSelectorFromElement,
  getUID,
  isElement,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
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
    this._scrollElement = element.tagName === 'BODY' ? null : element
    this._config = this._getConfig(config)
    this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS}, ${this._config.target} ${SELECTOR_LIST_ITEMS}, ${this._config.target} .${CLASS_NAME_DROPDOWN_ITEM}`
    // These are the "targeted" elements, meaning we will toggle them as active and inactive as we scroll
    this._targets = SelectorEngine.find(this._selector)
    // We use the information on these target elements to get the corresponding element itself
    // These are the DOM elements we will actually watch as we scroll
    this._observedElements = this._targets.map(element => {
      const targetSelector = getSelectorFromElement(element)
      // Not all targets point to another element, but we remove them in the chained filter method
      if (targetSelector) {
        return SelectorEngine.findOne(targetSelector)
      }
    }).filter(item => item)

    this._activeTarget = null
    this._scrollHeight = 0


    this._visibleElements = []


    let options = {
      // null defaults to the viewport
      root: this._scrollElement  === window ? null : this_scrollElement,
      rootMargin: "0px", // placeholder
      threshold: 0, // placeholder
    }

    this._observer = new IntersectionObserver(this._process.bind(this), options);

    // Set up listeners for each of the targeted scrollspy elements
    for (const observed of this._observedElements) {
      this._observer.observe(observed)
    }
  }

  // Getters

  static get Default() {
    return Default
  }

  static get DATA_KEY() {
    return DATA_KEY
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

    const targets = SelectorEngine.find(this._selector)

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
    super.dispose()

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

    if (typeof config.target !== 'string' && isElement(config.target)) {
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

  _process(entries, _observer) {
    for (const entry of entries) {
      // If this is true, then, the IntersectionObserverEntry describes a transition into a state of intersection
      if (entry.isIntersecting) {
        this._visibleElements.push(entry)
      } else {
        // if it's false, then you know the transition is from intersecting to not-intersecting.
        this._visibleElements = this._visibleElements.filter(item => item.target !== entry.target)
      }
    }

    // No elements visible, reset everything
    if (this._visibleElements.length == 0) {
      this._clear();
    }

    // If we're at the bottom, take the bottom-most visible element
    debugger
    if (Math.abs(this._scrollElement.scrollHeight - this._scrollElement.scrollTop) < 5.0) {
      let len = this._visibleElements.length
      this._activate(this._visibleElements[len - 1].target.id)
    }

    // Only one element visible, so mark it as the active one
    if (this._visibleElements.length == 1) {
      this._activate(this._visibleElements[0].target.id)
    } else if (this._visibleElements.length == 2) {
      // Take whichever one has the bigger ratio. This is a crude metric and could be vulnerable to edge cases but good enough for now
      let first = this._visibleElements[0]
      let second = this._visibleElements[1]
      if (first.intersectionRatio > second.intersectionRatio) {
        return first.target.id
      } else {
        return second.target.id
      }
    } else {
      // just take the second to last element in the list
      let len = this._visibleElements.length
      this._activate(this._visibleElements[len - 2].target.id)
    }

    this._visibleElements.forEach(item => console.log(item.target))
  }

  _activate(target) {
    this._activeTarget = target

    this._clear()

    const queries = this._selector.split(',')
      .map(selector => `${selector}[data-bs-target="#${target}"],${selector}[href="#${target}"]`)


    const link = SelectorEngine.findOne(queries.join(','))

    if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN))
        .classList.add(CLASS_NAME_ACTIVE)

      link.classList.add(CLASS_NAME_ACTIVE)
    } else {
      // Set triggered link as active
      link.classList.add(CLASS_NAME_ACTIVE)

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
    SelectorEngine.find(this._selector)
      .filter(node => node.classList.contains(CLASS_NAME_ACTIVE))
      .forEach(node => node.classList.remove(CLASS_NAME_ACTIVE))
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
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  SelectorEngine.find(SELECTOR_DATA_SPY)
    .forEach(spy => new ScrollSpy(spy, Manipulator.getDataAttributes(spy)))
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .ScrollSpy to jQuery only if jQuery is present
 */

defineJQueryPlugin(NAME, ScrollSpy)

export default ScrollSpy
