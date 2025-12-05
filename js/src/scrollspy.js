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
  getElement, isDisabled, isVisible, parseSelector
} from './util/index.js'

/**
 * Constants
 */

const NAME = 'scrollspy'
const DATA_KEY = 'bs.scrollspy'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
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

export const SPY_ENGINE_CONFIG = {
  rootMargin: '-2% 0px -98% 0px',
  threshold: [0]
}

export const SPY_SENTRY_CONFIG = {
  rootMargin: '0px 0px 0px 0px',
  threshold: [0]
}

const Default = {
  rootMargin: SPY_ENGINE_CONFIG.rootMargin,
  threshold: SPY_ENGINE_CONFIG.threshold,
  smoothScroll: false,
  target: null,
  navigation: null
}

const DefaultType = {
  rootMargin: 'string',
  threshold: 'array',
  smoothScroll: 'boolean',
  target: 'element',
  navigation: '(element|string|null)'
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
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element
    this._activeTarget = null
    this._observer = null
    this._sentryObserver = null
    this._sentryObserverElement = null

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
    this._initializeTargets()
    this._captureTargets()
    this._customizeScrollBehavior()

    this._observer?.disconnect()
    this._observer = this._getNewObserver()

    this._sentryObserver?.disconnect()
    this._sentryObserver = this._getNewSentryObserver()

    for (const section of this._observableSections.values()) {
      this._observer.observe(section)
    }

    this._sentryObserver.observe(this._sentryObserverElement)
  }

  dispose() {
    this._observer.disconnect()
    this._sentryObserver.disconnect()
    super.dispose()
  }

  // Private
  _configAfterMerge(config) {
    config.target = getElement(config.target)
    config.navigation = getElement(config.navigation)

    if (!config.target) {
      throw new TypeError('Bootstrap ScrollSpy: You must specify a valid "target" element')
    }

    return config
  }

  _initializeTargets() {
    this._targetLinks = new Map()
    this._observableSections = new Map()
    this._sentryObserverElement = SelectorEngine.findOne('.sentry-observer', this._element)

    if (this._sentryObserverElement) {
      this._sentryObserverElement.remove()
      this._sentryObserverElement = null
    }

    const sentryObserverElement = document.createElement('div')

    sentryObserverElement.classList.add('sentry-observer')
    sentryObserverElement.style.height = '1px'
    sentryObserverElement.style.width = '1px'
    sentryObserverElement.style.visibility = 'hidden'
    this._element.append(sentryObserverElement)
  }

  _captureTargets() {
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target)

    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue
      }

      const withDecodeUri = decodeURI(anchor.hash)
      const withEscape = parseSelector(withDecodeUri)
      const observableSection = SelectorEngine.findOne(withEscape, this._element)

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(withDecodeUri, anchor)
        this._observableSections.set(anchor.hash, observableSection)
      }
    }

    this._sentryObserverElement = SelectorEngine.findOne('.sentry-observer', this._element)
  }

  _customizeScrollBehavior() {
    const { navigation } = this._config
    const currentRootElement = this._rootElement ?? document.documentElement
    const computedStyle = getComputedStyle(currentRootElement)
    const scrollPaddingTop = computedStyle.getPropertyValue('scroll-padding-top')
    const scrollBehavior = computedStyle.getPropertyValue('scroll-behavior')

    if (navigation && scrollPaddingTop === 'auto') {
      currentRootElement.style.scrollPaddingTop = `${navigation.getBoundingClientRect().height}px`
      this._config.rootMargin = `-${navigation.getBoundingClientRect().height + 10}px 0px -90% 0px`
    }

    if (this._rootElement && this._config.smoothScroll && scrollBehavior !== 'smooth') {
      this._rootElement.style.scrollBehavior = 'smooth'
    }

    if (this._rootElement && !this._config.smoothScroll) {
      this._rootElement.style.scrollBehavior = ''
    }
  }

  _getNewSentryObserver() {
    const options = {
      root: this._rootElement,
      threshold: SPY_SENTRY_CONFIG.threshold,
      rootMargin: SPY_SENTRY_CONFIG.rootMargin
    }

    return new IntersectionObserver(entries => this._sentryObserverCallback(entries), options)
  }

  _sentryObserverCallback(entries) {
    const entry = entries[0]

    if (!entry.isIntersecting) {
      return
    }

    const targets = [...this._targetLinks.values()]
    const lastLink = targets[targets.length - 1]

    if (!lastLink) {
      return
    }

    this._process(lastLink)
  }

  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    }

    return new IntersectionObserver(entries => this._observerCallback(entries), options)
  }

  _observerCallback(entries) {
    const visibleEntry = entries.find(entry => entry.isIntersecting)

    if (!visibleEntry) {
      return
    }

    const element = this._targetLinks.get(`#${visibleEntry.target.id}`)

    this._process(element)
  }

  _process(target) {
    if (this._activeTarget === target) {
      return
    }

    this._clearActiveClass(this._config.target)
    this._setActiveClass(target)

    this._activateDropdownParentElement(target)
    this._activateListGroupParentElement(target)

    EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target })
  }

  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE)

    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent)

    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE)
    }
  }

  _setActiveClass(target) {
    this._activeTarget = target
    target.classList.add(CLASS_NAME_ACTIVE)
  }

  _activateDropdownParentElement(target) {
    // Set the parent active dropdown class if dropdown is the target of the clicked link or the current viewport
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE, target.closest(SELECTOR_DROPDOWN))
        .classList.add(CLASS_NAME_ACTIVE)
    }
  }

  _activateListGroupParentElement(target) {
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE)
      }
    }
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

export default ScrollSpy
