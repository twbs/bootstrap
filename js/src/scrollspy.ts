/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import type { ComponentConfig } from './util/config.js'
import {
  getElement, isDisabled, isVisible
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
const EVENT_SCROLL = `scroll${EVENT_KEY}`
const EVENT_SCROLLEND = `scrollend${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`
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

// How long (ms) to wait after the last scroll event before settling a pending
// smooth-scroll navigation, when the native `scrollend` event is unavailable.
const SCROLL_IDLE_TIMEOUT = 100
// Debounce (ms) for rebuilding the observer on resize (px activation lines only).
const RESIZE_DEBOUNCE = 100

type ScrollSpyConfig = {
  rootMargin: string | null
  smoothScroll: boolean
  target: string | Element | null
  threshold: number[] | string
  topMargin: string
}

const Default: ScrollSpyConfig = {
  // `rootMargin` is the raw IntersectionObserver root-box override. When set it
  // takes precedence over `topMargin` and is passed straight to the observer.
  // Leave it null and use `topMargin` for everyday use.
  rootMargin: null,
  smoothScroll: false,
  target: null,
  threshold: [0],
  // Position of the activation line, measured from the top of the scroll root.
  // The active section is the deepest one whose top has scrolled to/above it.
  // Accepts a percentage (`12%`) or pixels (`96px`, e.g. below a sticky navbar).
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
  declare _config: ScrollSpyConfig
  declare _sections: HTMLElement[]
  declare _linkBySection: Map<HTMLElement, HTMLElement>
  declare _sectionByLink: Map<HTMLElement, HTMLElement>
  declare _intersecting: Set<Element>
  declare _activeTarget: HTMLElement | null
  declare _lastActive: HTMLElement | null
  declare _atBottom: boolean
  declare _rootElement: HTMLElement | null
  declare _observer: IntersectionObserver | null
  declare _sentinel: HTMLElement | null
  declare _sentinelObserver: IntersectionObserver | null
  declare _pendingNavigation: { hash: string, section: HTMLElement } | null
  declare _settleTimeout: number | null
  declare _settleHandler: (() => void) | null
  declare _scrollIdleHandler: (() => void) | null
  declare _resizeHandler: (() => void) | null
  declare _resizeTimeout: number | null

  constructor(element?: string | Element | null, config?: Partial<ScrollSpyConfig> | null) {
    super(element, config)

    // this._element is the observablesContainer and config.target the menu links wrapper
    this._sections = [] // observable section elements, in DOM order
    this._linkBySection = new Map() // section element -> nav link
    this._sectionByLink = new Map() // nav link -> section element (for smooth scroll)
    this._intersecting = new Set() // sections currently crossing the activation line
    this._activeTarget = null
    this._lastActive = null // last activated section (keep-last across gaps)
    this._atBottom = false
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element

    this._observer = null
    this._sentinel = null
    this._sentinelObserver = null

    this._pendingNavigation = null
    this._settleTimeout = null
    this._settleHandler = null
    this._scrollIdleHandler = null

    this._resizeHandler = null
    this._resizeTimeout = null

    this.refresh() // initialize
  }

  // Getters
  static override get Default(): ScrollSpyConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  refresh(): void {
    this._initializeTargetsAndObservables()
    this._maybeEnableSmoothScroll()

    // (Re)build the activation observer.
    this._observer?.disconnect()
    this._intersecting.clear()
    this._observer = this._getNewObserver()
    for (const section of this._sections) {
      this._observer.observe(section)
    }

    // Detect the bottom-of-page case (a short last section whose top never
    // reaches the activation line) natively, via a dedicated sentinel observer.
    this._setUpSentinel()

    // A px activation line doesn't track viewport height the way `%` does, so
    // rebuild the observer (debounced) on resize when px units are in play.
    this._maybeAddResizeListener()
  }

  override dispose(): void {
    this._observer?.disconnect()
    this._teardownSentinel()
    this._disarmSettle()
    this._removeResizeListener()
    EventHandler.off(this._config.target as HTMLElement, EVENT_CLICK)
    super.dispose()
  }

  // Private
  override _configAfterMerge(config: ComponentConfig): ComponentConfig {
    config.target = getElement(config.target) || document.body

    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value))
    }

    return config
  }

  // --- Detection (IntersectionObserver-driven) -----------------------------

  _getNewObserver(): IntersectionObserver {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold as number[],
      rootMargin: this._config.rootMargin ?? this._getDerivedRootMargin()
    }

    return new IntersectionObserver(entries => this._onIntersect(entries), options)
  }

  _onIntersect(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this._intersecting.add(entry.target)
      } else {
        this._intersecting.delete(entry.target)
      }
    }

    this._computeActive()
  }

  // Single source of truth for active selection, derived only from IO state —
  // no per-frame layout reads. The active section is the deepest (DOM-order)
  // one currently crossing the activation line; in a gap we keep the last one;
  // above the first section the first stays active; at the very bottom the last
  // section wins.
  _computeActive(): void {
    // Guard against observer callbacks that outlive a disposed/detached instance.
    if (!this._element?.isConnected || this._sections.length === 0) {
      return
    }

    let active = null

    if (this._atBottom) {
      active = this._sections.at(-1)
    } else {
      for (const section of this._sections) {
        if (this._intersecting.has(section)) {
          active = section
        }
      }

      // No section crosses the line: keep the last active (content gap), or fall
      // back to the first section at the top of the page.
      active ||= this._lastActive ?? this._sections.at(0)
    }

    if (!active) {
      return
    }

    this._lastActive = active
    const link = this._linkBySection.get(active)
    if (link) {
      this._process(link)
    }
  }

  // Single source of truth for the `topMargin` option: its numeric value and
  // whether it's expressed as a percentage of the root height or in pixels.
  _parseTopMargin(): { value: number, unit: string } {
    const value = String(this._config.topMargin)
    return {
      value: Number.parseFloat(value) || 0,
      unit: value.endsWith('%') ? '%' : 'px'
    }
  }

  // Collapse the observer root to a strip from the top down to the activation
  // line, so a section is "intersecting" exactly while it crosses that line.
  _getDerivedRootMargin(): string {
    const { value, unit } = this._parseTopMargin()
    let percent = value

    // Express a pixel activation line as a percentage of the root height.
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

  // Whether the activation line is derived from a pixel `topMargin` (in which
  // case it must be recomputed on resize). An explicit `rootMargin` is owned by
  // the caller, and a `%` topMargin is recomputed by the browser automatically.
  _usesPixelMargin(): boolean {
    return !this._config.rootMargin && this._parseTopMargin().unit === 'px'
  }

  // --- Bottom sentinel -----------------------------------------------------

  _setUpSentinel(): void {
    this._teardownSentinel()

    if (this._sections.length === 0) {
      return
    }

    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText = 'position:relative;width:0;height:0;margin:0;padding:0;border:0;visibility:hidden;'
    this._element.append(sentinel)
    this._sentinel = sentinel

    this._sentinelObserver = new IntersectionObserver(entries => this._onSentinel(entries), {
      root: this._rootElement,
      threshold: [0]
    })
    this._sentinelObserver.observe(sentinel)
  }

  _onSentinel(entries: IntersectionObserverEntry[]): void {
    const entry = entries.at(-1)
    // Only treat the sentinel as "bottom reached" when content actually
    // overflows; otherwise everything is visible and there's nothing to spy.
    this._atBottom = Boolean(entry?.isIntersecting) && this._isOverflowing()
    this._computeActive()
  }

  _isOverflowing(): boolean {
    const scroller = this._rootElement || document.scrollingElement || document.documentElement
    return scroller.scrollHeight > scroller.clientHeight
  }

  _teardownSentinel(): void {
    this._sentinelObserver?.disconnect()
    this._sentinelObserver = null
    this._sentinel?.remove()
    this._sentinel = null
    this._atBottom = false
  }

  // --- Resize (px activation lines only) -----------------------------------

  _maybeAddResizeListener(): void {
    this._removeResizeListener()

    if (!this._usesPixelMargin()) {
      return
    }

    this._resizeHandler = () => {
      clearTimeout(this._resizeTimeout!)
      this._resizeTimeout = setTimeout(() => this._rebuildObserver(), RESIZE_DEBOUNCE)
    }

    EventHandler.on(window, EVENT_RESIZE, this._resizeHandler)
  }

  _removeResizeListener(): void {
    clearTimeout(this._resizeTimeout!)
    this._resizeTimeout = null

    if (this._resizeHandler) {
      EventHandler.off(window, EVENT_RESIZE, this._resizeHandler)
      this._resizeHandler = null
    }
  }

  _rebuildObserver(): void {
    if (!this._observer) {
      return
    }

    this._observer.disconnect()
    this._intersecting.clear()
    this._observer = this._getNewObserver()
    for (const section of this._sections) {
      this._observer.observe(section)
    }
  }

  // --- Smooth-scroll settle (hash + focus) ---------------------------------

  _maybeEnableSmoothScroll(): void {
    if (!this._config.smoothScroll) {
      return
    }

    // Unregister any previous listener so refresh() doesn't stack them.
    EventHandler.off(this._config.target as HTMLElement, EVENT_CLICK)

    EventHandler.on(this._config.target as HTMLElement, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(SELECTOR_TARGET_LINKS)
      const section = link && this._sectionByLink.get(link)
      if (!section || !this._element) {
        return
      }

      event.preventDefault()

      const root: any = this._rootElement || window
      const height = section.offsetTop - this._element.offsetTop
      const currentTop = this._rootElement ?
        this._rootElement.scrollTop :
        (window.scrollY ?? window.pageYOffset)
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

      // If we're already there (or motion is reduced), there will be no scroll
      // — and thus no `scrollend` — to wait for, so settle immediately. This
      // avoids a stuck pending navigation that never restores hash/focus.
      if (reduceMotion || Math.abs(currentTop - height) <= 2) {
        if (root.scrollTo) {
          root.scrollTo({ top: height, behavior: 'auto' })
        } else {
          root.scrollTop = height
        }

        this._settleNavigation(link.hash, section)
        return
      }

      // Defer the URL-hash and focus updates until the scroll settles, so we
      // don't thrash the address bar mid-animation (and so the native hash
      // navigation we just prevented is restored once we arrive).
      this._pendingNavigation = { hash: link.hash, section }
      this._armSettle()

      if (root.scrollTo) {
        root.scrollTo({ top: height, behavior: 'smooth' })
      } else {
        root.scrollTop = height
      }
    })
  }

  // Arm a one-shot settle for the in-flight smooth scroll. `scrollend` is the
  // primary signal; a transient scroll-idle timer covers engines without it.
  // Both are removed on settle, so a later unrelated scroll can't replay it.
  _armSettle(): void {
    this._disarmSettle()

    const target = this._getSettleTarget()

    this._settleHandler = () => this._onSettle()
    this._scrollIdleHandler = () => {
      clearTimeout(this._settleTimeout!)
      this._settleTimeout = setTimeout(() => this._onSettle(), SCROLL_IDLE_TIMEOUT)
    }

    EventHandler.on(target, EVENT_SCROLLEND, this._settleHandler)
    EventHandler.on(target, EVENT_SCROLL, this._scrollIdleHandler)
  }

  _disarmSettle(): void {
    clearTimeout(this._settleTimeout!)
    this._settleTimeout = null

    const target = this._getSettleTarget()
    if (this._settleHandler) {
      EventHandler.off(target, EVENT_SCROLLEND, this._settleHandler)
      this._settleHandler = null
    }

    if (this._scrollIdleHandler) {
      EventHandler.off(target, EVENT_SCROLL, this._scrollIdleHandler)
      this._scrollIdleHandler = null
    }
  }

  _getSettleTarget(): HTMLElement | Document {
    return this._rootElement || document
  }

  _onSettle(): void {
    this._disarmSettle()

    if (!this._pendingNavigation) {
      return
    }

    const { hash, section } = this._pendingNavigation
    this._settleNavigation(hash, section)
  }

  _settleNavigation(hash: string, section: HTMLElement): void {
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

  // --- Targets / observables ----------------------------------------------

  _initializeTargetsAndObservables(): void {
    this._sections = []
    this._linkBySection = new Map()
    this._sectionByLink = new Map()

    const targetLinks = SelectorEngine.find<HTMLAnchorElement>(SELECTOR_TARGET_LINKS, this._config.target as HTMLElement)
    const seen = new Set()

    for (const anchor of targetLinks) {
      if (!anchor.hash || isDisabled(anchor)) {
        continue
      }

      // Resolve by id (decoded) rather than building a CSS selector, so any
      // literal id works — dots, slashes, colons, and percent-encoded chars —
      // without escaping.
      const id = decodeFragment(anchor.hash.slice(1))
      if (!id) {
        continue
      }

      const section = document.getElementById(id)
      // ensure the section exists, is scoped to this element, and is visible
      if (!section || !this._element.contains(section) || !isVisible(section)) {
        continue
      }

      this._sectionByLink.set(anchor, section)
      this._linkBySection.set(section, anchor) // last link wins for a section

      if (!seen.has(section)) {
        seen.add(section)
        this._sections.push(section)
      }
    }

    // Keep sections in top-to-bottom order so "deepest" selection is
    // well-defined. Read once here (refresh/resize), never on the hot path.
    this._sections.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
  }

  _process(target: HTMLElement): void {
    if (this._activeTarget === target) {
      return
    }

    this._clearActiveClass(this._config.target as HTMLElement)
    this._activeTarget = target
    target.classList.add(CLASS_NAME_ACTIVE)
    this._activateParents(target)

    EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target })
  }

  _activateParents(target: HTMLElement): void {
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

  _clearActiveClass(parent: HTMLElement): void {
    parent.classList.remove(CLASS_NAME_ACTIVE)

    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent)
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE)
    }
  }
}

// Decode a URL fragment id, tolerating malformed escapes (returns it as-is).
function decodeFragment(hash: string): string {
  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
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
export type { ScrollSpyConfig }
