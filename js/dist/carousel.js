/*!
  * Bootstrap carousel.js v6.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import BaseComponent from './base-component.js';
import EventHandler from './dom/event-handler.js';
import Manipulator from './dom/manipulator.js';
import SelectorEngine from './dom/selector-engine.js';
import { isVisible, isRTL } from './util/index.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'carousel';
const DATA_KEY = 'bs.carousel';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY}`;
const EVENT_SLID = `slid${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE = 'carousel-fade';
const CLASS_NAME_CENTER = 'carousel-center';
const CLASS_NAME_AUTO = 'carousel-auto';
const CLASS_NAME_CLONE = 'carousel-item-clone';
const CLASS_NAME_PAUSED = 'paused';
// Added to the root while the autoplay timer is running, so CSS can fill the
// active indicator like a progress bar over the current slide's interval.
const CLASS_NAME_PLAYING = 'carousel-playing';

// Shipped (`--bs-`-prefixed) custom property the indicator fill animation reads
// for its duration. The build prefixes every custom property, so the bare
// `--carousel-interval` used in the SCSS source becomes this at runtime.
const PROPERTY_INTERVAL = '--bs-carousel-interval';

// How many frames the scroll-settle watcher waits when no movement is ever
// detected (clamped programmatic scroll, or `scrollBy` stubbed in tests) before
// it gives up and restores snapping anyway.
const SCROLL_SETTLE_MAX_FRAMES = 10;

// How far below the most-visible slide a slide's IntersectionRatio can be while
// still counting as the active (left-most) slide. After a programmatic scroll
// the viewport rests a sub-pixel past the snap offset, leaving the intended
// slide a hair less visible than its fully-in neighbors; the tolerance prevents
// that rounding from skipping the active index forward.
const ACTIVE_RATIO_TOLERANCE = 0.05;
const SELECTOR_ACTIVE = '.active';
// Exclude transient loop clones so index math, indicators, and active-slide
// detection only ever see the real slides.
const SELECTOR_ITEM = `.carousel-item:not(.${CLASS_NAME_CLONE})`;
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_INNER = '.carousel-inner';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_PLAY_PAUSE = '.carousel-control-play-pause';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_SLIDE_PREV = '[data-bs-slide="prev"]';
const SELECTOR_DATA_SLIDE_NEXT = '[data-bs-slide="next"]';
const SELECTOR_DATA_AUTOPLAY = '[data-bs-autoplay="true"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT
};
const ENDS_STOP = 'stop';
const ENDS_WRAP = 'wrap';
const ENDS_LOOP = 'loop';
const Default = {
  autoplay: false,
  ends: ENDS_LOOP,
  interval: 5000,
  keyboard: true,
  pause: 'hover'
};
const DefaultType = {
  autoplay: 'boolean',
  ends: 'string',
  interval: 'number',
  keyboard: 'boolean',
  pause: '(string|boolean)'
};

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    // The scroll viewport. The browser owns sliding, dragging, momentum, and
    // keyboard scrolling; this controller only layers on autoplay, the
    // prev/next/indicator controls, and active-slide syncing.
    this._viewport = SelectorEngine.findOne(SELECTOR_INNER, this._element) || this._element;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._playPauseElement = SelectorEngine.findOne(SELECTOR_PLAY_PAUSE, this._element);
    // Prev/next controls scoped to the carousel root (covers inline and stacked
    // layouts). External controls placed outside `.carousel` aren't managed.
    this._prevControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_PREV, this._element);
    this._nextControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_NEXT, this._element);
    this._interval = null;
    this._observer = null;
    this._snapRestoreFrame = null;
    // True while a seamless loop transition is animating, so the
    // IntersectionObserver and re-entrant navigation don't interfere.
    this._looping = false;
    this._visibility = new Map();
    // Runtime autoplay intent. Starts from the `autoplay` option, but is turned
    // off once the user takes control (clicks a control, uses the keyboard,
    // swipes/drags, or presses pause) so we don't move content out from under
    // them (WCAG 2.2.2 Pause, Stop, Hide).
    this._playing = this._config.autoplay;
    this._activeIndex = this._initialActiveIndex();
    this._addEventListeners();
    this._observeItems();
    this._refreshActiveState();
    if (this._playing) {
      this.cycle();
    }
    this._updatePlayPauseControl();
  }

  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  next() {
    this.to(this._navIndex() + 1);
  }
  nextWhenVisible() {
    // Don't advance when the page or the carousel isn't visible
    if (document.visibilityState === 'visible' && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this.to(this._navIndex() - 1);
  }
  pause() {
    this._clearInterval();
    // Freeze the indicator progress fill; it resets to empty until cycling
    // resumes and `_scheduleAutoplay` restarts it from scratch.
    this._element.classList.remove(CLASS_NAME_PLAYING);
  }
  cycle() {
    this._clearInterval();
    this._scheduleAutoplay();
    this._element.classList.add(CLASS_NAME_PLAYING);
  }
  to(index) {
    // Ignore navigation while a seamless loop transition is animating
    if (this._looping) {
      return;
    }
    const items = this._getItems();
    const rawIndex = Number.parseInt(index, 10);

    // Seamless loop: continue forward/backward into a transient clone instead of
    // the visible `wrap` jump. Only the simple single-slide scroll layout
    // qualifies, and reduced motion falls back to the plain wrap below.
    if (this._config.ends === ENDS_LOOP && !this._prefersReducedMotion() && this._canLoop()) {
      if (rawIndex > items.length - 1) {
        this._loopTransition(true);
        return;
      }
      if (rawIndex < 0) {
        this._loopTransition(false);
        return;
      }
    }
    const targetIndex = this._normalizeIndex(rawIndex, items.length);
    // Measure "current" from the live scroll position: `_activeIndex` updates
    // asynchronously, so an indicator/control used mid-scroll must compare
    // against where the viewport actually rests (`_navIndex` returns the tracked
    // active index for fade/non-scrollable layouts).
    const currentIndex = this._navIndex();
    if (targetIndex === null || targetIndex === currentIndex) {
      return;
    }
    const slideEvent = EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget: items[targetIndex],
      direction: this._direction(currentIndex, targetIndex),
      from: currentIndex,
      to: targetIndex
    });
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (this._isFade()) {
      this._fadeTo(targetIndex);
      return;
    }

    // Scroll mode: the IntersectionObserver fires `slid` and syncs state once
    // the new slide settles into view.
    this._scrollToIndex(targetIndex);
  }
  dispose() {
    // Stop autoplay first: otherwise a pending timer would fire after the
    // instance is torn down and throw on the now-null `_element`.
    this._clearInterval();
    if (this._observer) {
      this._observer.disconnect();
    }
    if (this._snapRestoreFrame !== null) {
      cancelAnimationFrame(this._snapRestoreFrame);
    }

    // Tidy up any in-flight loop transition: drop a stray clone and restore
    // native snapping, so the viewport isn't left mid-animation.
    for (const clone of SelectorEngine.find(`.${CLASS_NAME_CLONE}`, this._viewport)) {
      clone.remove();
    }
    this._viewport.style.scrollSnapType = '';

    // The pointerdown listener lives on the viewport (`.carousel-inner`), which
    // `super.dispose()` doesn't clean up—it only drops listeners on `_element`.
    EventHandler.off(this._viewport, EVENT_KEY);
    super.dispose();
  }

  // Private
  // Normalize an unknown `ends` value so navigation and end-control logic can't
  // disagree about whether the carousel wraps.
  _configAfterMerge(config) {
    if (![ENDS_STOP, ENDS_WRAP, ENDS_LOOP].includes(config.ends)) {
      config.ends = Default.ends;
    }
    return config;
  }
  _initialActiveIndex() {
    const active = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    const index = active ? this._getItems().indexOf(active) : 0;
    return Math.max(index, 0);
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
    }
    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle());
    }

    // Dragging, swiping, or tapping the track is an explicit interaction
    EventHandler.on(this._viewport, EVENT_POINTERDOWN, () => this._pauseFromInteraction());
  }
  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._pauseFromInteraction();
      if (direction === DIRECTION_RIGHT) {
        this.prev();
      } else {
        this.next();
      }
    }
  }
  _observeItems() {
    // Fade mode stacks slides instead of scrolling, so there's nothing to observe
    if (this._isFade() || typeof IntersectionObserver === 'undefined') {
      return;
    }
    this._observer = new IntersectionObserver(entries => this._handleIntersection(entries), {
      root: this._viewport,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });
    for (const item of this._getItems()) {
      this._observer.observe(item);
    }
  }
  _handleIntersection(entries) {
    // A loop transition deliberately scrolls onto a transient clone; ignore the
    // visibility churn so it doesn't move the active index mid-animation.
    if (this._looping) {
      return;
    }
    for (const entry of entries) {
      this._visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
    }
    const items = this._getItems();
    const ratios = items.map(item => this._visibility.get(item) ?? 0);
    const maxRatio = Math.max(...ratios);

    // Pick the left-most slide that's *near* fully visible rather than the strict
    // global maximum. After a programmatic scroll the viewport rests ~1px past
    // the target snap offset, so the intended left-most slide reports a ratio a
    // hair below the deeper, fully-visible ones (e.g. 0.997 vs 1.0). A strict max
    // would skip past it and inflate the active index by one, which breaks
    // multi-item next/prev. The tolerance keeps the intended slide active while
    // peeking slivers (well below the max) are still ignored.
    let bestIndex = this._activeIndex;
    if (maxRatio > 0) {
      bestIndex = ratios.findIndex(ratio => ratio >= maxRatio - ACTIVE_RATIO_TOLERANCE);
    }
    this._setActive(bestIndex);
    // Keep the end controls in sync with the scroll position even when the
    // active index doesn't change (e.g. the final stretch of a multi-item
    // scroll, where the left-most slide is already the last reachable one).
    this._updateEndControls();
  }

  // The index a `next()`/`prev()` step is measured from. Scroll layouts read it
  // from the live scroll position instead of `this._activeIndex`, because the
  // IntersectionObserver updates that asynchronously: after one step the index
  // can still be stale, so the next step would compute the same target and
  // silently no-op (the "the button does nothing / can't reach the end slide"
  // symptom). Fade and non-scrollable layouts have no scroll position to read,
  // so they keep using the tracked active index (also what the unit tests rely
  // on when there's no real layout).
  _navIndex() {
    if (this._isFade() || this._viewport.scrollWidth - this._viewport.clientWidth <= 0) {
      return this._activeIndex;
    }
    let index = this._activeIndex;
    let smallestDelta = Number.POSITIVE_INFINITY;
    for (const [itemIndex, item] of this._getItems().entries()) {
      // The slide currently resting at the active position has ~zero delta.
      const delta = Math.abs(this._scrollDelta(item));
      if (delta < smallestDelta) {
        smallestDelta = delta;
        index = itemIndex;
      }
    }
    return index;
  }
  _scrollToIndex(index) {
    const item = this._getItems()[index];
    if (!item) {
      return;
    }
    const left = this._scrollDelta(item);
    if (Math.abs(left) < 1) {
      return;
    }

    // `scroll-snap-stop: always` keeps user wheel/touch flings to a single slide,
    // but it also clamps *programmatic* scrolls to one snap point — which would
    // break multi-slide jumps from an indicator click, `to()`, or wrapping from
    // the last slide back to the first. Disable snapping for the duration of the
    // programmatic scroll, then restore it once the scroll settles so the slide
    // still rests precisely (honouring peek/gap).
    const targetLeft = this._viewport.scrollLeft + left;
    this._viewport.style.scrollSnapType = 'none';
    this._viewport.scrollBy({
      left,
      top: 0,
      // `'instant'` (not `'auto'`) for reduced motion: the viewport sets
      // `scroll-behavior: smooth` in CSS, and `'auto'` defers to it, so it would
      // still animate. `'instant'` forces an immediate, motion-free jump.
      behavior: this._prefersReducedMotion() ? 'instant' : 'smooth'
    });
    this._restoreSnapWhenSettled(targetLeft, index);
  }

  // Horizontal distance to scroll the viewport so `element` rests where the
  // active slide should sit. Scroll the viewport itself rather than calling
  // `element.scrollIntoView()`: the latter scrolls *every* scrollable ancestor
  // (including the page), so an autoplaying carousel below the fold would yank
  // the whole page to itself on each tick. Using bounding rects keeps it
  // direction-agnostic (works in RTL).
  _scrollDelta(element) {
    const viewportRect = this._viewport.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    if (this._element.classList.contains(CLASS_NAME_CENTER)) {
      return rect.left + rect.width / 2 - (viewportRect.left + viewportRect.width / 2);
    }

    // Start alignment: rest the slide at the scroll-padding (peek) offset, which
    // is exactly where scroll-snap will settle. Aligning flush to the edge
    // instead would make the browser re-snap by `peek` once snapping is restored,
    // producing a visible secondary nudge after the programmatic scroll.
    const padStart = Number.parseFloat(getComputedStyle(this._viewport).scrollPaddingInlineStart) || 0;
    return isRTL() ? rect.right - (viewportRect.right - padStart) : rect.left - (viewportRect.left + padStart);
  }

  // Seamless loop: continue past an end into a one-off clone of the destination
  // slide, then teleport to the real slide so there's no visible backward jump.
  _loopTransition(isNext) {
    const items = this._getItems();
    const last = items.length - 1;
    const fromIndex = this._activeIndex;
    const toIndex = isNext ? 0 : last;
    const direction = this._loopDirection(isNext);
    const slideEvent = EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget: items[toIndex],
      direction,
      from: fromIndex,
      to: toIndex
    });
    if (slideEvent.defaultPrevented) {
      return;
    }
    this._looping = true;
    const clone = (isNext ? items[0] : items[last]).cloneNode(true);
    clone.classList.add(CLASS_NAME_CLONE);
    clone.classList.remove(CLASS_NAME_ACTIVE);
    clone.removeAttribute('id');
    // Also strip ids from the cloned subtree to avoid duplicate ids while the
    // clone is on screen.
    for (const node of SelectorEngine.find('[id]', clone)) {
      node.removeAttribute('id');
    }
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    this._viewport.style.scrollSnapType = 'none';
    if (isNext) {
      this._viewport.append(clone);
    } else {
      this._viewport.prepend(clone);
      // Prepending shifts the real slides to the right; instantly re-align the
      // current slide so the insertion doesn't flash before we animate.
      this._jumpScroll(this._scrollDelta(items[fromIndex]));
    }
    this._viewport.scrollBy({
      left: this._scrollDelta(clone),
      top: 0,
      behavior: 'smooth'
    });
    this._afterScrollSettles(() => {
      // Teleport to the real destination without animation. JS runs to
      // completion before the browser paints, so removing the clone and the
      // compensating scroll land in a single frame (no visible flash).
      clone.remove();
      this._jumpScroll(this._scrollDelta(items[toIndex]));
      this._activeIndex = toIndex;
      this._refreshActiveState();
      EventHandler.trigger(this._element, EVENT_SLID, {
        relatedTarget: items[toIndex],
        direction,
        from: fromIndex,
        to: toIndex
      });
      this._viewport.style.scrollSnapType = '';
      this._looping = false;
    });
  }
  _loopDirection(isNext) {
    if (isRTL()) {
      return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }
    return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }

  // Instant (non-animated) scroll with snapping suspended, used to teleport the
  // viewport during a loop transition. `behavior: 'instant'` is required because
  // the viewport sets `scroll-behavior: smooth` in CSS, and `'auto'` would defer
  // to it and animate the teleport (a visible backward slide).
  _jumpScroll(delta) {
    this._viewport.style.scrollSnapType = 'none';
    this._viewport.scrollBy({
      left: delta,
      top: 0,
      behavior: 'instant'
    });
  }

  // Re-enable scroll snapping once the viewport reaches `targetLeft` (or stops
  // moving). Passing the target matters: restoring `mandatory` snapping re-snaps
  // to the *nearest* snap point, so if we restored mid-animation the viewport
  // could jump back to the slide we came from — most visible stepping to the
  // first/last slide, where it looks like the control "doesn't work".
  _restoreSnapWhenSettled(targetLeft, index) {
    this._afterScrollSettles(() => {
      this._viewport.style.scrollSnapType = '';
      // Without IntersectionObserver nothing else fires `slid`/updates the active
      // slide after a programmatic scroll, so do it here. With the observer
      // present this is a no-op (it already moved the active index to `index`).
      if (!this._observer && index !== undefined) {
        this._setActive(index);
      }

      // The IntersectionObserver doesn't fire once the viewport has stopped, so
      // refresh the end controls here to catch the final ~1px settle landing
      // exactly on the scroll extent (e.g. disabling `next` at the last view).
      this._updateEndControls();
    }, targetLeft);
  }

  // Invoke `callback` once the viewport stops moving. We watch the scroll
  // position across frames instead of relying on the `scrollend` event, which
  // isn't available across our supported browsers yet.
  //
  // Crucially, we only start counting "stable" frames once the scroll has
  // actually moved. A smooth `scrollBy` doesn't update `scrollLeft` for the first
  // frame or two, so naively treating those initial unchanged frames as
  // "settled" would re-enable `mandatory` snapping mid-animation — which cancels
  // the in-flight programmatic scroll and lands on the wrong slide (most visible
  // in multi-item layouts). If the scroll never moves (delta clamped at an end,
  // or `scrollBy` stubbed out in unit tests), we fall back to a short frame cap.
  //
  // When `targetLeft` is known we also finish the moment we arrive there, so the
  // snap is restored exactly on the destination snap point and can't re-snap the
  // viewport backwards (the failure mode where stepping to the first/last slide
  // appears to do nothing).
  _afterScrollSettles(callback, targetLeft) {
    if (typeof requestAnimationFrame === 'undefined') {
      callback();
      return;
    }
    if (this._snapRestoreFrame !== null) {
      cancelAnimationFrame(this._snapRestoreFrame);
    }
    const startLeft = this._viewport.scrollLeft;
    let lastLeft = startLeft;
    let stableFrames = 0;
    let waited = 0;
    let hasMoved = false;
    const tick = () => {
      const currentLeft = this._viewport.scrollLeft;
      const reachedTarget = targetLeft !== undefined && Math.abs(currentLeft - targetLeft) <= 1;
      if (Math.abs(currentLeft - startLeft) > 1) {
        hasMoved = true;
      }

      // Only accrue stable frames after movement begins, so the pre-animation
      // and ease-in frames don't prematurely count as settled.
      if (hasMoved) {
        stableFrames = Math.abs(currentLeft - lastLeft) < 1 ? stableFrames + 1 : 0;
      }
      lastLeft = currentLeft;
      waited += 1;
      if (reachedTarget || hasMoved && stableFrames >= 3 || !hasMoved && waited >= SCROLL_SETTLE_MAX_FRAMES) {
        this._snapRestoreFrame = null;
        callback();
        return;
      }
      this._snapRestoreFrame = requestAnimationFrame(tick);
    };
    this._snapRestoreFrame = requestAnimationFrame(tick);
  }

  // Fade mode just swaps the active class; the CSS opacity transition on
  // `.carousel-item` performs the crossfade over `--carousel-fade-duration` (and
  // collapses to an instant swap under reduced motion, via the `transition`
  // mixin). It deliberately avoids the View Transition API: a view transition
  // crossfades a page snapshot over its own (shorter) duration while this CSS
  // fade also runs underneath, so the two animations overlap and visibly stutter.
  _fadeTo(index) {
    this._setActive(index);
  }
  _setActive(index) {
    const items = this._getItems();
    if (index === this._activeIndex || !items[index]) {
      return;
    }
    const from = this._activeIndex;
    this._activeIndex = index;
    this._refreshActiveState();
    EventHandler.trigger(this._element, EVENT_SLID, {
      relatedTarget: items[index],
      direction: this._direction(from, index),
      from,
      to: index
    });
  }
  _refreshActiveState() {
    const items = this._getItems();
    for (const [index, item] of items.entries()) {
      item.classList.toggle(CLASS_NAME_ACTIVE, index === this._activeIndex);
    }
    this._setActiveIndicatorElement(this._activeIndex);
    this._updateEndControls();
  }
  _updateEndControls() {
    // Only `ends: 'stop'` has real ends; under `wrap`/`loop` you can always
    // advance, so disabling end controls would be meaningless. When stopping,
    // disable the prev control at the start of the scroll range and the next
    // control at the end so there are no dead end-buttons.
    if (this._config.ends !== ENDS_STOP) {
      return;
    }
    const viewport = this._viewport;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    let atStart;
    let atEnd;
    if (maxScroll > 0) {
      // Scrollable: measure the real scroll extent so this works for multi-item,
      // peek, and variable-width layouts where the last slide can never become
      // the left-most (active) one. `Math.abs` keeps it correct in RTL, where
      // `scrollLeft` runs from 0 down to negative.
      const progress = Math.abs(viewport.scrollLeft);
      atStart = progress <= 1;
      atEnd = progress >= maxScroll - 1;
    } else {
      // Not scrollable (or no layout yet, e.g. in unit tests): fall back to the
      // active index for the single-slide case.
      const last = this._getItems().length - 1;
      atStart = this._activeIndex <= 0;
      atEnd = this._activeIndex >= last;
    }
    this._setControlsDisabled(this._prevControls, atStart);
    this._setControlsDisabled(this._nextControls, atEnd);
  }
  _setControlsDisabled(controls, disabled) {
    for (const control of controls) {
      // a11y: if we're about to disable the focused control, move focus to the
      // opposite (still-enabled) control so focus isn't lost.
      if (disabled && control === document.activeElement) {
        const opposite = controls === this._prevControls ? this._nextControls : this._prevControls;
        const fallback = opposite[0] ?? this._viewport;
        // `preventScroll` so moving focus doesn't yank the page/viewport to the
        // newly-focused control mid-navigation.
        fallback.focus({
          preventScroll: true
        });
      }
      control.disabled = disabled;
    }
  }
  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }
    const active = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    if (active) {
      active.classList.remove(CLASS_NAME_ACTIVE);
      active.removeAttribute('aria-current');
    }
    const newActive = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActive) {
      newActive.classList.add(CLASS_NAME_ACTIVE);
      newActive.setAttribute('aria-current', 'true');
    }
  }
  _normalizeIndex(index, length) {
    if (Number.isNaN(index) || length === 0) {
      return null;
    }
    if (index < 0) {
      return this._wrapsAround() ? length - 1 : null;
    }
    if (index > length - 1) {
      return this._wrapsAround() ? 0 : null;
    }
    return index;
  }

  // Whether navigating past an end wraps to the other end. `loop` continues
  // seamlessly where it can (see `_canLoop`) and otherwise behaves like `wrap`.
  _wrapsAround() {
    return this._config.ends === ENDS_WRAP || this._config.ends === ENDS_LOOP;
  }

  // Seamless looping is only supported for the simple single-slide scroll
  // layout. Multi-item, peek, center, and variable-width layouts fall back to
  // the plain `wrap` jump.
  _canLoop() {
    if (this._isFade() || this._getItems().length < 2) {
      return false;
    }
    const styles = getComputedStyle(this._element);
    const num = name => Number.parseFloat(styles.getPropertyValue(name)) || 0;

    // These are the shipped, `--bs-`-prefixed custom properties (the build
    // prefixes every custom property), not the bare names used in the SCSS source.
    return (num('--bs-carousel-items') || 1) === 1 && num('--bs-carousel-items-peek') === 0 && !this._element.classList.contains(CLASS_NAME_CENTER) && !this._element.classList.contains(CLASS_NAME_AUTO);
  }
  _direction(from, to) {
    const isNext = to > from;
    if (isRTL()) {
      return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }
    return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }
  _scheduleAutoplay(index = this._activeIndex) {
    const interval = this._itemInterval(index);
    // Expose the wait so the active indicator's CSS fill matches it.
    this._element.style.setProperty(PROPERTY_INTERVAL, `${interval}ms`);
    this._interval = setTimeout(() => {
      // Capture the slide the advance lands on *before* navigating: the active
      // index only updates once the scroll settles (asynchronously), so reading
      // it after `nextWhenVisible()` would schedule the next wait from the slide
      // we're leaving — making per-item `data-bs-interval`s lag by one slide.
      const upcoming = this._upcomingIndex();
      this.nextWhenVisible();

      // Nothing comes after the last slide when `ends: 'stop'`; stop cycling
      // instead of re-arming a timer that can never advance.
      if (upcoming === null) {
        this.pause();
        return;
      }
      this._scheduleAutoplay(upcoming);
    }, interval);
  }

  // The slide the next autoplay tick will rest on, derived from the live scroll
  // position (which still reflects the current slide when the timer fires).
  // Returns `null` when there's nowhere left to advance (`ends: stop` at the end).
  _upcomingIndex() {
    return this._normalizeIndex(this._navIndex() + 1, this._getItems().length);
  }
  _itemInterval(index = this._activeIndex) {
    const item = this._getItems()[index];
    const interval = item ? Number.parseInt(item.getAttribute('data-bs-interval'), 10) : Number.NaN;
    return Number.isNaN(interval) ? this._config.interval : interval;
  }
  _maybeEnableCycle() {
    if (!this._playing) {
      return;
    }
    this.cycle();
  }

  // Turn autoplay off for good once the user interacts with the carousel
  _pauseFromInteraction() {
    this._playing = false;
    this.pause();
    this._updatePlayPauseControl();
  }
  _togglePlayPause() {
    if (this._playing) {
      this._pauseFromInteraction();
      return;
    }
    this._playing = true;
    this.cycle();
    this._updatePlayPauseControl();
  }
  _updatePlayPauseControl() {
    if (!this._playPauseElement) {
      return;
    }
    this._playPauseElement.classList.toggle(CLASS_NAME_PAUSED, !this._playing);
    const label = this._playPauseElement.getAttribute(this._playing ? 'data-bs-pause-label' : 'data-bs-play-label');
    if (label) {
      this._playPauseElement.setAttribute('aria-label', label);
    }
  }
  _isFade() {
    return this._element.classList.contains(CLASS_NAME_FADE);
  }
  _prefersReducedMotion() {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    if (this._interval) {
      clearTimeout(this._interval);
      this._interval = null;
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);

  // Manually cycling the carousel is an explicit interaction, so stop autoplay
  carousel._pauseFromInteraction();
  const slideIndex = this.getAttribute('data-bs-slide-to');
  if (slideIndex) {
    carousel.to(slideIndex);
    return;
  }
  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();
    return;
  }
  carousel.prev();
});
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_PLAY_PAUSE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event.preventDefault();
  Carousel.getOrCreateInstance(target)._togglePlayPause();
});
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_AUTOPLAY);
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});

export { Carousel as default };
//# sourceMappingURL=carousel.js.map
