/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import SelectorEngine from './dom/selector-engine.js'
import { isRTL, isVisible } from './util/index.js'

/**
 * Constants
 */

const NAME = 'carousel'
const DATA_KEY = 'bs.carousel'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const ARROW_LEFT_KEY = 'ArrowLeft'
const ARROW_RIGHT_KEY = 'ArrowRight'

const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

const EVENT_SLIDE = `slide${EVENT_KEY}`
const EVENT_SLID = `slid${EVENT_KEY}`
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_CAROUSEL = 'carousel'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_FADE = 'carousel-fade'
const CLASS_NAME_CENTER = 'carousel-center'
const CLASS_NAME_PAUSED = 'paused'

const SELECTOR_ACTIVE = '.active'
const SELECTOR_ITEM = '.carousel-item'
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM
const SELECTOR_INNER = '.carousel-inner'
const SELECTOR_INDICATORS = '.carousel-indicators'
const SELECTOR_PLAY_PAUSE = '.carousel-control-play-pause'
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]'
const SELECTOR_DATA_AUTOPLAY = '[data-bs-autoplay="true"]'

const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT
}

const Default = {
  autoplay: false,
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  touch: true,
  wrap: true
}

const DefaultType = {
  autoplay: 'boolean',
  interval: 'number',
  keyboard: 'boolean',
  pause: '(string|boolean)',
  touch: 'boolean',
  wrap: 'boolean'
}

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    // The scroll viewport. The browser owns sliding, dragging, momentum, and
    // keyboard scrolling; this controller only layers on autoplay, the
    // prev/next/indicator controls, and active-slide syncing.
    this._viewport = SelectorEngine.findOne(SELECTOR_INNER, this._element) || this._element
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element)
    this._playPauseElement = SelectorEngine.findOne(SELECTOR_PLAY_PAUSE, this._element)

    this._interval = null
    this._observer = null
    this._visibility = new Map()
    // Runtime autoplay intent. Starts from the `autoplay` option, but is turned
    // off once the user takes control (clicks a control, uses the keyboard,
    // swipes/drags, or presses pause) so we don't move content out from under
    // them (WCAG 2.2.2 Pause, Stop, Hide).
    this._playing = this._config.autoplay

    this._activeIndex = this._initialActiveIndex()

    if (this._config.touch === false) {
      // Disable horizontal swipe while keeping wheel/keyboard/button navigation
      this._viewport.style.touchAction = 'pan-y'
    }

    this._addEventListeners()
    this._observeItems()
    this._refreshActiveState()

    if (this._playing) {
      this.cycle()
    }

    this._updatePlayPauseControl()
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
  next() {
    this.to(this._activeIndex + 1)
  }

  nextWhenVisible() {
    // Don't advance when the page or the carousel isn't visible
    if (document.visibilityState === 'visible' && isVisible(this._element)) {
      this.next()
    }
  }

  prev() {
    this.to(this._activeIndex - 1)
  }

  pause() {
    this._clearInterval()
  }

  cycle() {
    this._clearInterval()
    this._scheduleAutoplay()
  }

  to(index) {
    const items = this._getItems()
    const targetIndex = this._normalizeIndex(Number.parseInt(index, 10), items.length)

    if (targetIndex === null || targetIndex === this._activeIndex) {
      return
    }

    const slideEvent = EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget: items[targetIndex],
      direction: this._direction(this._activeIndex, targetIndex),
      from: this._activeIndex,
      to: targetIndex
    })

    if (slideEvent.defaultPrevented) {
      return
    }

    if (this._isFade()) {
      this._fadeTo(targetIndex)
      return
    }

    // Scroll mode: the IntersectionObserver fires `slid` and syncs state once
    // the new slide settles into view.
    this._scrollToIndex(targetIndex)
  }

  dispose() {
    if (this._observer) {
      this._observer.disconnect()
    }

    super.dispose()
  }

  // Private
  _initialActiveIndex() {
    const active = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element)
    const index = active ? this._getItems().indexOf(active) : 0
    return Math.max(index, 0)
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event))
    }

    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER, () => this.pause())
      EventHandler.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle())
    }

    // Dragging, swiping, or tapping the track is an explicit interaction
    EventHandler.on(this._viewport, EVENT_POINTERDOWN, () => this._pauseFromInteraction())
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return
    }

    const direction = KEY_TO_DIRECTION[event.key]
    if (direction) {
      event.preventDefault()
      this._pauseFromInteraction()
      if (direction === DIRECTION_RIGHT) {
        this.prev()
      } else {
        this.next()
      }
    }
  }

  _observeItems() {
    // Fade mode stacks slides instead of scrolling, so there's nothing to observe
    if (this._isFade() || typeof IntersectionObserver === 'undefined') {
      return
    }

    this._observer = new IntersectionObserver(
      entries => this._handleIntersection(entries),
      { root: this._viewport, threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    for (const item of this._getItems()) {
      this._observer.observe(item)
    }
  }

  _handleIntersection(entries) {
    for (const entry of entries) {
      this._visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0)
    }

    let bestIndex = this._activeIndex
    let bestRatio = -1

    for (const [index, item] of this._getItems().entries()) {
      const ratio = this._visibility.get(item) ?? 0
      // Strict `>` keeps the left-most slide active when several are equally visible
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestIndex = index
      }
    }

    this._setActive(bestIndex)
  }

  _scrollToIndex(index) {
    const item = this._getItems()[index]
    if (!item) {
      return
    }

    item.scrollIntoView({
      behavior: this._prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
      inline: this._element.classList.contains(CLASS_NAME_CENTER) ? 'center' : 'start'
    })
  }

  _fadeTo(index) {
    const swap = () => this._setActive(index)

    if (document.startViewTransition && !this._prefersReducedMotion()) {
      document.startViewTransition(swap)
      return
    }

    swap()
  }

  _setActive(index) {
    const items = this._getItems()
    if (index === this._activeIndex || !items[index]) {
      return
    }

    const from = this._activeIndex

    this._activeIndex = index
    this._refreshActiveState()

    EventHandler.trigger(this._element, EVENT_SLID, {
      relatedTarget: items[index],
      direction: this._direction(from, index),
      from,
      to: index
    })
  }

  _refreshActiveState() {
    const items = this._getItems()

    for (const [index, item] of items.entries()) {
      item.classList.toggle(CLASS_NAME_ACTIVE, index === this._activeIndex)
    }

    this._setActiveIndicatorElement(this._activeIndex)
  }

  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return
    }

    const active = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement)
    if (active) {
      active.classList.remove(CLASS_NAME_ACTIVE)
      active.removeAttribute('aria-current')
    }

    const newActive = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement)
    if (newActive) {
      newActive.classList.add(CLASS_NAME_ACTIVE)
      newActive.setAttribute('aria-current', 'true')
    }
  }

  _normalizeIndex(index, length) {
    if (Number.isNaN(index) || length === 0) {
      return null
    }

    if (index < 0) {
      return this._config.wrap ? length - 1 : null
    }

    if (index > length - 1) {
      return this._config.wrap ? 0 : null
    }

    return index
  }

  _direction(from, to) {
    const isNext = to > from
    if (isRTL()) {
      return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT
    }

    return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT
  }

  _scheduleAutoplay() {
    this._interval = setTimeout(() => {
      this.nextWhenVisible()
      this._scheduleAutoplay()
    }, this._activeItemInterval())
  }

  _activeItemInterval() {
    const item = this._getItems()[this._activeIndex]
    const interval = item ? Number.parseInt(item.getAttribute('data-bs-interval'), 10) : Number.NaN
    return Number.isNaN(interval) ? this._config.interval : interval
  }

  _maybeEnableCycle() {
    if (!this._playing) {
      return
    }

    this.cycle()
  }

  // Turn autoplay off for good once the user interacts with the carousel
  _pauseFromInteraction() {
    this._playing = false
    this.pause()
    this._updatePlayPauseControl()
  }

  _togglePlayPause() {
    if (this._playing) {
      this._pauseFromInteraction()
      return
    }

    this._playing = true
    this.cycle()
    this._updatePlayPauseControl()
  }

  _updatePlayPauseControl() {
    if (!this._playPauseElement) {
      return
    }

    this._playPauseElement.classList.toggle(CLASS_NAME_PAUSED, !this._playing)

    const label = this._playPauseElement.getAttribute(
      this._playing ? 'data-bs-pause-label' : 'data-bs-play-label'
    )

    if (label) {
      this._playPauseElement.setAttribute('aria-label', label)
    }
  }

  _isFade() {
    return this._element.classList.contains(CLASS_NAME_FADE)
  }

  _prefersReducedMotion() {
    return typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element)
  }

  _clearInterval() {
    if (this._interval) {
      clearTimeout(this._interval)
      this._interval = null
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this)

  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return
  }

  event.preventDefault()

  const carousel = Carousel.getOrCreateInstance(target)

  // Manually cycling the carousel is an explicit interaction, so stop autoplay
  carousel._pauseFromInteraction()

  const slideIndex = this.getAttribute('data-bs-slide-to')

  if (slideIndex) {
    carousel.to(slideIndex)
    return
  }

  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next()
    return
  }

  carousel.prev()
})

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_PLAY_PAUSE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this)

  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return
  }

  event.preventDefault()

  Carousel.getOrCreateInstance(target)._togglePlayPause()
})

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_AUTOPLAY)

  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel)
  }
})

export default Carousel
