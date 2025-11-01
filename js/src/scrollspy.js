/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import {
  defineJQueryPlugin, getElement, isDisabled, isVisible
} from './util/index.js'

/**
 * Constants
 */

const NAME = 'scrollspy'
const DATA_KEY = 'bs.scrollspy'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item'
const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]'
const SELECTOR_TARGET_LINKS = '[href]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`
const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'

const Default = {
  offset: null, // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px',
  smoothScroll: false,
  target: null,
  threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
}

const DefaultType = {
  offset: '(number|null)', // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
}

/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    // this._element is the observablesContainer and config.target the menu links wrapper
    this._targetLinks = new Map()
    this._observableSections = new Map()
    this._intersectionRatio = new Map()
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element
    this._activeTarget = null
    this._observer = null
    // Sometimes scrolling to the section isn't enough to trigger a observation callback.
    // Scroll to up to 2px to make sure it triggers.
    this._scrollOffset = 2
    this.refresh() // initialize
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public
  refresh() {
    this._initializeTargetsAndObservables()
    this._maybeEnableSmoothScroll()

    if (this._observer) {
      this._observer.disconnect()
    } else {
      this._observer = this._getNewObserver()
    }

    for (const section of this._observableSections.values()) {
      this._observer.observe(section)
    }
  }

  dispose() {
    this._observer.disconnect()
    super.dispose()
  }

  // Private
  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body

    // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
    config.rootMargin = config.offset ? `${config.offset}px 0px 0px` : config.rootMargin

    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value))
    }

    return config
  }

  _maybeEnableSmoothScroll() {
    const scrollBehavior = this._config.smoothScroll ? 'smooth' : 'auto'

    // unregister any previous listeners
    EventHandler.off(this._config.target, EVENT_CLICK)

    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash)
      if (observableSection) {
        event.preventDefault()
        const root = this._rootElement || window

        const height = observableSection.offsetTop - this._element.offsetTop - this._scrollOffset
        if (root.scrollTo) {
          root.scrollTo({ top: height, behavior: scrollBehavior })
          return
        }

        // Chrome 60 doesn't support `scrollTo`
        root.scrollTop = height
      }
    })
  }

  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    }

    return new IntersectionObserver(entries => this._observerCallback(entries), options)
  }

  // The logic of selection
  _observerCallback(entries) {
    for (const entry of entries) {
      this._intersectionRatio.set(`#${entry.target.id}`, entry.intersectionRatio)
    }

    let maxIntersectionRatio = 0
    let element = null
    for (const [key, val] of this._intersectionRatio.entries()) {
      if (val > maxIntersectionRatio) {
        element = this._targetLinks.get(key)
        maxIntersectionRatio = val
      }
    }

    if (element !== null) {
      this._process(element)
    }
  }

  _initializeTargetsAndObservables() {
    this._targetLinks = new Map()
    this._observableSections = new Map()

    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target)

    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue
      }

      const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element)

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodeURI(anchor.hash), anchor)
        this._observableSections.set(anchor.hash, observableSection)
        this._intersectionRatio.set(anchor.hash, 0)
      }
    }
  }

  _process(target) {
    if (this._activeTarget === target) {
      return
    }

    this._clearActiveClass(this._config.target)
    this._activeTarget = target
    target.classList.add(CLASS_NAME_ACTIVE)
    this._activateParents(target)

    EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target })
  }

  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE, target.closest(SELECTOR_DROPDOWN))
        .classList.add(CLASS_NAME_ACTIVE)
      return
    }

    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE)
      }
    }
  }

  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE)

    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent)
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE)
    }
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
 * Data API implementation
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy)
  }
})

/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy)

export default ScrollSpy
