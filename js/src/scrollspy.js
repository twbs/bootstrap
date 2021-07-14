/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.2): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElement,
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
  offset: null, // @deprecated, only for backwards Compatibility reasons
  rootMargin: '0px 0px -40%',
  target: null
}

const DefaultType = {
  offset: '(number|null)', // @deprecated, only for backwards Compatibility reasons
  rootMargin: 'string',
  target: 'element'
}

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
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

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element)

    // this._element is the observablesContainer and config.target the menu-links wrapper
    this._config = this._getConfig(config)

    this._targetLinks = []
    this._activeTarget = null
    this._observableSections = []
    this._observer = null
    this.refresh() // initialize
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
    this._targetLinks = SelectorEngine
      .find('[href]', this._config.target)// `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`
      .filter(el => el.hash.length > 0)// ensure that all have id

    this._observableSections = this._targetLinks
      .map(el => SelectorEngine.findOne(el.hash, this._element))
      .filter(el => el)// filter nulls

    if (this._observer) {
      this._observer.disconnect()
    } else {
      this._observer = this._getNewObserver()
    }

    this._observableSections.forEach(section => this._observer.observe(section))
  }

  dispose() {
    this._observer.disconnect()
    super.dispose()
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' && config ? config : {})
    }

    config.target = getElement(config.target)

    typeCheckConfig(NAME, config, DefaultType)

    return config
  }

  _process(target) {
    if (this._activeTarget === target) {
      return
    }

    this._clearActiveClass(this._config.target)
    if (!target) {
      return
    }

    this._activeTarget = target

    target.classList.add(CLASS_NAME_ACTIVE)

    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) { // Activate dropdown parents
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE, target.closest(SELECTOR_DROPDOWN))
        .classList.add(CLASS_NAME_ACTIVE)
    } else {
      SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)
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

    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    })
  }

  _clearActiveClass(parent) {
    if (parent !== this._config.target) {
      parent.classList.remove(CLASS_NAME_ACTIVE)
    }

    SelectorEngine.find(`.${CLASS_NAME_ACTIVE}`, parent)
      .forEach(node => node.classList.remove(CLASS_NAME_ACTIVE))
  }

  _getNewObserver() {
    let previousVisibleEntryTop = 0
    let previousParentScrollTop = 0

    const activate = entry => {
      previousVisibleEntryTop = entry.target.offsetTop
      const targetToActivate = this._targetLinks.find(el => el.hash === `#${entry.target.id}`)
      this._process(targetToActivate)
    }

    const callback = entries => {
      const parentScrollTop = this._element.scrollTop
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const { offsetTop } = entry.target
          const userScrollsDown = parentScrollTop >= previousParentScrollTop

          if (userScrollsDown && offsetTop >= previousVisibleEntryTop) { // if we are scrolling down, pick the bigger offsetTop
            activate(entry)
            return
          }

          if (!userScrollsDown && offsetTop < previousVisibleEntryTop) {// if we are scrolling up, pick the smallest offsetTop
            activate(entry)
          }

          return
        }

        const notVisibleElement = this._targetLinks.find(el => el.hash === `#${entry.target.id}`)
        this._clearActiveClass(notVisibleElement)
      })

      previousParentScrollTop = this._element.scrollTop
    }

    const options = {
      root: this._element,
      threshold: 0,
      rootMargin: this._getRootMargin()
    }

    return new IntersectionObserver(callback.bind(this), options)
  }

  _getRootMargin() { // Only for backwards compatibility reasons. Use rootMargin only
    const { offset, rootMargin } = this._config

    return offset ? `${offset}px 0px 0px` : rootMargin
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
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
