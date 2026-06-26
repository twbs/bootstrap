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
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_SCROLLEND = `scrollend${EVENT_KEY}`
const EVENT_SCROLL = `scroll${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_MENU_ITEM = 'menu-item'
const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]'
const SELECTOR_TARGET_LINKS = '[href]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`
const SELECTOR_MENU_TOGGLE = '[data-bs-toggle="menu"]'

// How long (ms) to wait after the last scroll event before settling, when the
// native `scrollend` event is unavailable.
const SCROLL_IDLE_TIMEOUT = 100

const Default = {
  // `rootMargin` is an advanced override for the IntersectionObserver root box.
  // When null it's derived from `topMargin` so the observer fires as sections
  // cross the activation line. Prefer `topMargin` for everyday use.
  rootMargin: null,
  smoothScroll: false,
  target: null,
  threshold: [0],
  // Position of the activation line, measured from the top of the scroll root.
  // The active section is the deepest one whose top has scrolled to/above it.
  topMargin: '12%'
}

const DefaultType = {
  rootMargin: '(string|null)',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array',
  topMargin: 'string'
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
    this._pendingNavigation = null
    this._scrollIdleTimeout = null
    this._scrollRaf = null
    this._settleHandler = () => this._onSettle()
    this._scrollHandler = () => this._onScroll()

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

    this._observer?.disconnect()
    this._observer = this._getNewObserver()

    for (const section of this._observableSections.values()) {
      this._observer.observe(section)
    }

    // Drive live updates from scroll (rAF-throttled), with the observer as a
    // supplementary trigger and `scrollend` for the settle (hash/focus). The
    // observer fires an initial (async) callback that sets the first active
    // state, so we don't compute it synchronously here.
    this._addScrollListeners()
  }

  dispose() {
    this._observer?.disconnect()
    this._removeScrollListeners()
    EventHandler.off(this._config.target, EVENT_CLICK)
    super.dispose()
  }

  // Private
  _configAfterMerge(config) {
    config.target = getElement(config.target) || document.body

    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value))
    }

    return config
  }

  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return
    }

    // Unregister any previous listener so refresh() doesn't stack them.
    EventHandler.off(this._config.target, EVENT_CLICK)

    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash)
      if (!observableSection || !this._element) {
        return
      }

      event.preventDefault()
      const root = this._rootElement || window
      const height = observableSection.offsetTop - this._element.offsetTop

      // Defer the URL-hash and focus updates until the scroll settles, so we
      // don't thrash the address bar mid-animation (and so the native hash
      // navigation we just prevented is restored once we arrive).
      this._pendingNavigation = { hash: event.target.hash, section: observableSection }

      if (root.scrollTo) {
        root.scrollTo({ top: height, behavior: 'smooth' })
        return
      }

      // Older engines without `scrollTo`
      root.scrollTop = height
    })
  }

  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin ?? this._getDerivedRootMargin()
    }

    return new IntersectionObserver(() => this._activateCurrentSection(), options)
  }

  // Single source of truth for the `topMargin` option: its numeric value and
  // whether it's expressed as a percentage of the root height or in pixels.
  _parseTopMargin() {
    const value = String(this._config.topMargin)
    return {
      value: Number.parseFloat(value) || 0,
      unit: value.endsWith('%') ? '%' : 'px'
    }
  }

  // Collapse the observer root to a thin band at the top so it fires whenever a
  // section crosses the activation line. The decision itself is geometric.
  _getDerivedRootMargin() {
    const { value, unit } = this._parseTopMargin()
    let percent = value

    // Express a pixel activation line as a percentage of the root height so the
    // supplementary observer band stays aligned with the geometric decision.
    if (unit === 'px') {
      const rootHeight = this._rootElement ?
        this._rootElement.clientHeight :
        (document.documentElement.clientHeight || window.innerHeight)
      percent = rootHeight ? (value / rootHeight) * 100 : 12
    }

    // Clamp so the bottom inset stays a valid (non-negative) rootMargin even if
    // the line sits outside the root box.
    const bottom = Math.min(Math.max(100 - percent, 0), 100)
    return `0px 0px -${bottom}% 0px`
  }

  // The activation line position in pixels, relative to the top of the root.
  _getActivationLine(rootHeight) {
    const { value, unit } = this._parseTopMargin()
    return unit === '%' ? (value / 100) * rootHeight : value
  }

  // Deterministic active-section selection, read fresh from layout — order- and
  // direction-independent. The active section is the deepest one whose top has
  // scrolled to/above the activation line; at the very bottom the last section
  // wins; above the first section the first one stays active.
  _activateCurrentSection() {
    // Guard against observer/settle callbacks that outlive a disposed or
    // detached instance (e.g. fired while tearing down the DOM).
    if (!this._element?.isConnected || !this._observableSections) {
      return
    }

    const sections = [...this._observableSections.values()]
    if (sections.length === 0) {
      return
    }

    const rootTop = this._rootElement ? this._rootElement.getBoundingClientRect().top : 0
    const rootHeight = this._rootElement ?
      this._rootElement.clientHeight :
      (document.documentElement.clientHeight || window.innerHeight)
    const activationLine = this._getActivationLine(rootHeight)

    let active = null

    if (this._isScrolledToBottom()) {
      active = sections.at(-1)
    } else {
      let deepestTop = Number.NEGATIVE_INFINITY
      for (const section of sections) {
        const top = section.getBoundingClientRect().top - rootTop
        if (top <= activationLine && top > deepestTop) {
          deepestTop = top
          active = section
        }
      }
    }

    if (!active) {
      // Scrolled above the activation line for every section — keep the first
      // section highlighted (matches expectations at the top of the page).
      active = sections.at(0)
    }

    const targetLink = this._targetLinks.get(`#${active.id}`)
    if (targetLink) {
      this._process(targetLink)
    }
  }

  _isScrolledToBottom() {
    const scroller = this._rootElement || document.scrollingElement || document.documentElement

    // Only meaningful when the content actually overflows its scroll container.
    if (scroller.scrollHeight <= scroller.clientHeight) {
      return false
    }

    return scroller.scrollHeight - (scroller.scrollTop + scroller.clientHeight) <= 1
  }

  _addScrollListeners() {
    this._removeScrollListeners()

    const target = this._getScrollTarget()
    // Live updates as the user scrolls (rAF-throttled in _onScroll).
    EventHandler.on(target, EVENT_SCROLL, this._scrollHandler)
    // Settle (hash/focus) once scrolling finishes. Harmless where unsupported —
    // _onScroll also schedules an idle settle as a fallback.
    EventHandler.on(target, EVENT_SCROLLEND, this._settleHandler)
  }

  _removeScrollListeners() {
    if (this._scrollIdleTimeout) {
      clearTimeout(this._scrollIdleTimeout)
      this._scrollIdleTimeout = null
    }

    if (this._scrollRaf) {
      cancelAnimationFrame(this._scrollRaf)
      this._scrollRaf = null
    }

    const target = this._getScrollTarget()
    EventHandler.off(target, EVENT_SCROLL, this._scrollHandler)
    EventHandler.off(target, EVENT_SCROLLEND, this._settleHandler)
  }

  _getScrollTarget() {
    return this._rootElement || document
  }

  _onScroll() {
    // Recompute the active section live, throttled to one read per frame.
    if (!this._scrollRaf) {
      this._scrollRaf = requestAnimationFrame(() => {
        this._scrollRaf = null
        this._activateCurrentSection()
      })
    }

    // Settle fallback for engines without `scrollend` (and to finalize a
    // pending smooth-scroll navigation's hash/focus once the scroll idles).
    if (this._scrollIdleTimeout) {
      clearTimeout(this._scrollIdleTimeout)
    }

    this._scrollIdleTimeout = setTimeout(() => this._onSettle(), SCROLL_IDLE_TIMEOUT)
  }

  _onSettle() {
    this._activateCurrentSection()

    if (!this._pendingNavigation) {
      return
    }

    const { hash, section } = this._pendingNavigation
    this._pendingNavigation = null

    // Restore the URL hash (without adding a history entry) now that we've
    // arrived, and move focus to the section for keyboard/AT users.
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', hash)
    }

    if (!section.hasAttribute('tabindex')) {
      section.setAttribute('tabindex', '-1')
    }

    section.focus({ preventScroll: true })
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

      const decodedHash = decodeURI(anchor.hash)
      // Escape ids with special characters (dots, slashes, colons, …) so they
      // don't throw when handed to querySelector.
      const observableSection = SelectorEngine.findOne(parseSelector(decodedHash), this._element)

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodedHash, anchor)
        this._observableSections.set(anchor.hash, observableSection)
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
    // Activate menu parents
    if (target.classList.contains(CLASS_NAME_MENU_ITEM)) {
      const menuToggle = target.closest('.menu')?.previousElementSibling
      if (menuToggle?.matches(SELECTOR_MENU_TOGGLE)) {
        menuToggle.classList.add(CLASS_NAME_ACTIVE)
      }

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
