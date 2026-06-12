import Carousel from '../../src/carousel.js'
import EventHandler from '../../src/dom/event-handler.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Carousel', () => {
  let fixtureEl
  let realIntersectionObserver
  let scrollToSpy
  let animateScrollSpy
  // Completion callback captured from the most recent stubbed `_animateScroll`,
  // so a test can decide when the (otherwise instant in tests) scroll "settles".
  let pendingScrollComplete

  // Run the pending scroll's completion callback (clone teleport, active sync,
  // snap restore, …), simulating the animation finishing.
  const settleScroll = () => {
    const complete = pendingScrollComplete
    pendingScrollComplete = null
    if (complete) {
      complete()
    }
  }

  // A no-op IntersectionObserver so the real one doesn't fire during tests;
  // active-slide syncing is driven explicitly via `_handleIntersection`.
  class MockIntersectionObserver {
    constructor(callback, options = {}) {
      this.callback = callback
      this.root = options.root ?? null
      this.thresholds = options.threshold ?? []
    }

    observe() {}

    unobserve() {}

    disconnect() {}
  }

  const basicMarkup = ({ classes = 'carousel slide', autoplay = false, indicators = false } = {}) => {
    const autoplayAttr = autoplay ? ' data-bs-autoplay="true"' : ''
    const indicatorsMarkup = indicators ?
      [
        '  <div class="carousel-indicators">',
        '    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active"></button>',
        '    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1"></button>',
        '    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2"></button>',
        '  </div>'
      ].join('') :
      ''

    return [
      `<div id="myCarousel" class="${classes}"${autoplayAttr}>`,
      indicatorsMarkup,
      '  <div class="carousel-inner">',
      '    <div id="item1" class="carousel-item active">item 1</div>',
      '    <div id="item2" class="carousel-item">item 2</div>',
      '    <div id="item3" class="carousel-item">item 3</div>',
      '  </div>',
      '</div>'
    ].join('')
  }

  // Give the viewport and items a deterministic horizontal layout so the
  // bounding-rect maths in `_scrollToIndex` produces predictable scroll deltas.
  // (Unit tests run without the carousel CSS, so real layout would collapse
  // every item to the same x and yield a zero delta.)
  const stubLayout = (carousel, { viewportLeft = 0, viewportWidth = 300, itemWidth = 100, gap = 0 } = {}) => {
    const rect = (left, width) => ({
      left, width, right: left + width, top: 0, bottom: 0, height: 0, x: left, y: 0, toJSON() {}
    })

    spyOn(carousel._viewport, 'getBoundingClientRect').and.returnValue(rect(viewportLeft, viewportWidth))

    for (const [index, item] of carousel._getItems().entries()) {
      spyOn(item, 'getBoundingClientRect').and.returnValue(rect(viewportLeft + (index * (itemWidth + gap)), itemWidth))
    }
  }

  const intersect = (carousel, ratios) => {
    const items = carousel._getItems()
    const entries = items.map((target, index) => ({
      target,
      isIntersecting: (ratios[index] ?? 0) > 0,
      intersectionRatio: ratios[index] ?? 0
    }))
    carousel._handleIntersection(entries)
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  beforeEach(() => {
    realIntersectionObserver = window.IntersectionObserver
    window.IntersectionObserver = MockIntersectionObserver
    // Stub `scrollBy` (used by the loop transition's instant teleport) so it
    // doesn't move the fixture; assertions go through `scrollToSpy`/`animateScrollSpy`.
    spyOn(Element.prototype, 'scrollBy')
    scrollToSpy = spyOn(Element.prototype, 'scrollTo')
    // Stub the JS scroll: record the target and capture the completion callback
    // (run on demand via `settleScroll`) instead of waiting out the real rAF
    // animation. Tests that exercise the real animator opt back in with
    // `animateScrollSpy.and.callThrough()`.
    pendingScrollComplete = null
    animateScrollSpy = spyOn(Carousel.prototype, '_animateScroll').and.callFake((targetLeft, onComplete) => {
      pendingScrollComplete = onComplete
    })
  })

  afterEach(() => {
    window.IntersectionObserver = realIntersectionObserver
    document.documentElement.dir = ''
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Carousel.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Carousel.Default).toEqual(jasmine.any(Object))
    })

    it('should default autoplay to false and pause to hover', () => {
      expect(Carousel.Default.autoplay).toBeFalse()
      expect(Carousel.Default.pause).toEqual('hover')
    })

    it('should default `ends` to `loop`', () => {
      expect(Carousel.Default.ends).toEqual('loop')
    })

    it('should fall back to the default `ends` for unknown values', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'nope' })
      expect(carousel._config.ends).toEqual('loop')
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Carousel.DATA_KEY).toEqual('bs.carousel')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carouselBySelector = new Carousel('#myCarousel')
      const carouselByElement = new Carousel(carouselEl)

      expect(carouselBySelector._element).toEqual(carouselEl)
      expect(carouselByElement._element).toEqual(carouselEl)
    })

    it('should find the scroll viewport, indicators and play/pause control', () => {
      fixtureEl.innerHTML = basicMarkup({ indicators: true })

      const carousel = new Carousel('#myCarousel')

      expect(carousel._viewport).toEqual(fixtureEl.querySelector('.carousel-inner'))
      expect(carousel._indicatorsElement).toEqual(fixtureEl.querySelector('.carousel-indicators'))
    })

    it('should set the initial active index from the active item', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item">item 1</div>',
        '    <div class="carousel-item active">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel')
      expect(carousel._activeIndex).toEqual(1)
    })

    it('should start cycling if `autoplay` is `true`', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carousel = new Carousel('#myCarousel')
      expect(carousel._interval).not.toBeNull()
      expect(carousel._playing).toBeTrue()
    })

    it('should not start cycling if `autoplay` is not `true`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      expect(carousel._interval).toBeNull()
    })

    it('should observe items for active syncing', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      expect(carousel._observer).toEqual(jasmine.any(MockIntersectionObserver))
      expect(carousel._observer.root).toEqual(carousel._viewport)
    })

    it('should not observe items in fade mode', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      const carousel = new Carousel('#myCarousel')
      expect(carousel._observer).toBeNull()
    })

    it('should fall back to the element as the viewport when there is no inner', () => {
      fixtureEl.innerHTML = '<div id="myCarousel" class="carousel"><div class="carousel-item active">item 1</div></div>'

      const carousel = new Carousel('#myCarousel')
      expect(carousel._viewport).toEqual(carousel._element)
    })

    it('should not create an observer when IntersectionObserver is unavailable', () => {
      const original = window.IntersectionObserver
      window.IntersectionObserver = undefined

      try {
        fixtureEl.innerHTML = basicMarkup()

        const carousel = new Carousel('#myCarousel')
        expect(carousel._observer).toBeNull()
      } finally {
        window.IntersectionObserver = original
      }
    })
  })

  describe('navigation', () => {
    it('should scroll the viewport to the next item and fire `slide`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      stubLayout(carousel)
      const slideSpy = jasmine.createSpy('slide')
      EventHandler.on(carouselEl, 'slide.bs.carousel', slideSpy)

      carousel.next()

      expect(animateScrollSpy).toHaveBeenCalled()
      // item2 sits one item-width (100) to the right of the viewport's start, so
      // the absolute scroll target is 0 + 100
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(100)
      expect(slideSpy).toHaveBeenCalledTimes(1)
      expect(slideSpy.calls.mostRecent().args[0].to).toEqual(1)
      expect(slideSpy.calls.mostRecent().args[0].direction).toEqual('left')
    })

    it('should disable scroll snapping for the duration of the programmatic scroll', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)

      carousel.next()

      // `scroll-snap-stop: always` would otherwise clamp the scroll to a single
      // slide, so snapping is turned off while we drive the viewport.
      expect(carousel._viewport.style.scrollSnapType).toEqual('none')
    })

    it('should not scroll when the `slide` event is prevented', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      stubLayout(carousel)
      EventHandler.on(carouselEl, 'slide.bs.carousel', event => event.preventDefault())

      carousel.next()

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should wrap to the last item when going prev from the first (wrap: true)', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'wrap' })
      stubLayout(carousel)
      carousel.prev()

      // item3 is two item-widths (200) to the right — a full multi-slide jump
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(200)
    })

    it('should not move past the ends when `ends` is `stop`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)
      carousel.prev()

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should center the active slide when `.carousel-center` is present', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-center' })

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel, { viewportWidth: 300, itemWidth: 200 })
      carousel.next()

      // Center mode aligns the item's center to the viewport's center:
      // (itemLeft 200 + itemWidth/2 100) - (viewportLeft 0 + viewportWidth/2 150) = 150
      // (start alignment would instead be itemLeft - viewportLeft = 200)
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(150)
    })

    it('should rest the slide at the scroll-padding (peek) offset', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      // Emulate `--bs-carousel-items-peek` via the resulting scroll-padding so
      // the slide settles where snapping will (no secondary snap afterwards).
      carousel._viewport.style.scrollPaddingInlineStart = '30px'
      carousel.next()

      // itemLeft 100 - (viewportLeft 0 + padStart 30) = 70 (vs 100 without peek)
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(70)
    })

    it('should do nothing when navigating to the current index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel.to(0)

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should not advance past the last item when `ends` is `stop`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)
      carousel._activeIndex = 2
      carousel.next()

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should ignore a non-numeric index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel.to('not-a-number')

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should not scroll when the target item is missing', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel._scrollToIndex(99)

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should report mirrored slide directions in RTL', () => {
      fixtureEl.innerHTML = basicMarkup()
      document.documentElement.dir = 'rtl'

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      stubLayout(carousel)
      const slideSpy = jasmine.createSpy('slide')
      EventHandler.on(carouselEl, 'slide.bs.carousel', slideSpy)

      carousel.next()
      expect(slideSpy.calls.mostRecent().args[0].direction).toEqual('right')

      carousel._activeIndex = 1
      carousel.to(0)
      expect(slideSpy.calls.mostRecent().args[0].direction).toEqual('left')
    })

    it('should step from the live scroll position, not a stale active index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      const rect = (left, width) => ({
        left, width, right: left + width, top: 0, bottom: 0, height: 0, x: left, y: 0, toJSON() {}
      })

      // Scrollable layout currently resting with item 2 (index 2) at the start.
      Object.defineProperty(carousel._viewport, 'scrollWidth', { configurable: true, get: () => 900 })
      Object.defineProperty(carousel._viewport, 'clientWidth', { configurable: true, get: () => 300 })
      spyOn(carousel._viewport, 'getBoundingClientRect').and.returnValue(rect(0, 300))
      for (const [index, item] of carousel._getItems().entries()) {
        spyOn(item, 'getBoundingClientRect').and.returnValue(rect((index - 2) * 100, 100))
      }

      // The IntersectionObserver hasn't caught up, so the tracked index is stale.
      carousel._activeIndex = 0

      // Navigation must measure from the real position (item 2), not the stale 0.
      expect(carousel._navIndex()).toEqual(2)
    })
  })

  // The real `_animateScroll` (the global spy is bypassed with `callThrough`).
  // We drive a JS-owned rAF animation instead of `scrollBy({behavior:'smooth'})`
  // because Safari mis-scales programmatic smooth scrolls under page zoom.
  describe('scroll animation (`_animateScroll`)', () => {
    // Run whatever rAF callbacks are queued, passing each a synthetic timestamp
    // (ms) so the time-based animation advances deterministically (no real wait).
    const tick = (frames, now) => {
      for (const cb of frames.splice(0)) {
        cb(now)
      }
    }

    it('should step the viewport toward the target with eased, instant scrolls and finish on it', () => {
      fixtureEl.innerHTML = basicMarkup()
      const carousel = new Carousel('#myCarousel')
      animateScrollSpy.and.callThrough()

      const frames = []
      spyOn(window, 'requestAnimationFrame').and.callFake(cb => frames.push(cb))
      const onComplete = jasmine.createSpy('onComplete')

      // SCROLL_DURATION is 300ms; the first frame seeds the start time.
      carousel._animateScroll(500, onComplete)

      tick(frames, 0) // progress 0 → eased position 0, instant scroll, not done
      expect(scrollToSpy.calls.mostRecent().args[0].behavior).toEqual('instant')
      expect(scrollToSpy.calls.mostRecent().args[0].left).toEqual(0)
      expect(onComplete).not.toHaveBeenCalled()

      tick(frames, 200) // progress ~0.67 → past the easing midpoint, partway there
      const mid = scrollToSpy.calls.mostRecent().args[0].left
      expect(mid).toBeGreaterThan(0)
      expect(mid).toBeLessThan(500)
      expect(onComplete).not.toHaveBeenCalled()

      tick(frames, 400) // progress > 1 → land exactly on target and complete
      expect(scrollToSpy.calls.mostRecent().args[0].left).toEqual(500)
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should cancel an in-flight animation frame when a new scroll starts', () => {
      fixtureEl.innerHTML = basicMarkup()
      const carousel = new Carousel('#myCarousel')
      animateScrollSpy.and.callThrough()

      spyOn(window, 'requestAnimationFrame').and.returnValue(42)
      const cancelSpy = spyOn(window, 'cancelAnimationFrame').and.callThrough()

      carousel._animateScroll(100, () => {})
      carousel._animateScroll(200, () => {}) // supersedes the first

      expect(cancelSpy).toHaveBeenCalledWith(42)
    })

    it('should jump straight to the target under reduced motion', () => {
      fixtureEl.innerHTML = basicMarkup()
      spyOn(window, 'matchMedia').and.returnValue({ matches: true })
      const carousel = new Carousel('#myCarousel')
      animateScrollSpy.and.callThrough()

      const rafSpy = spyOn(window, 'requestAnimationFrame')
      const onComplete = jasmine.createSpy('onComplete')

      carousel._animateScroll(500, onComplete)

      // No animation frames scheduled; one instant scroll lands on target.
      expect(rafSpy).not.toHaveBeenCalled()
      expect(scrollToSpy).toHaveBeenCalledTimes(1)
      expect(scrollToSpy.calls.mostRecent().args[0]).toEqual({ left: 500, behavior: 'instant' })
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should jump straight to the target when requestAnimationFrame is unavailable', () => {
      fixtureEl.innerHTML = basicMarkup()
      const carousel = new Carousel('#myCarousel')
      animateScrollSpy.and.callThrough()

      const original = window.requestAnimationFrame
      window.requestAnimationFrame = undefined
      const onComplete = jasmine.createSpy('onComplete')

      try {
        carousel._animateScroll(500, onComplete)
      } finally {
        window.requestAnimationFrame = original
      }

      expect(scrollToSpy.calls.mostRecent().args[0]).toEqual({ left: 500, behavior: 'instant' })
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should restore snapping once the navigation animation completes', () => {
      fixtureEl.innerHTML = basicMarkup()
      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      animateScrollSpy.and.callThrough()
      const original = window.requestAnimationFrame
      window.requestAnimationFrame = undefined

      try {
        carousel.next()
      } finally {
        window.requestAnimationFrame = original
      }

      // Snapping is suspended for the scroll, then restored on completion.
      expect(carousel._viewport.style.scrollSnapType).toEqual('')
    })
  })

  describe('end behavior (`ends`)', () => {
    it('should not move past either end when `ends` is `stop`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)

      carousel.prev()
      expect(animateScrollSpy).not.toHaveBeenCalled()

      carousel._activeIndex = 2
      carousel.next()
      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should wrap around at both ends when `ends` is `wrap`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'wrap' })
      stubLayout(carousel)

      carousel.prev()
      // wraps to the last item (item3), two item-widths (200) to the right
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(200)
    })
  })

  describe('seamless loop (`ends: loop`)', () => {
    it('should continue into a transient clone and teleport to the first slide when going next from the last', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      carousel._activeIndex = 2
      carousel.next()

      // A clone is appended for the duration of the animation
      expect(carousel._viewport.querySelector('.carousel-item-clone')).not.toBeNull()
      expect(carousel._looping).toBeTrue()

      settleScroll()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(carousel._activeIndex).toEqual(0)
      expect(carousel._looping).toBeFalse()
      expect(slidSpy.calls.mostRecent().args[0].to).toEqual(0)
      expect(slidSpy.calls.mostRecent().args[0].direction).toEqual('left')
    })

    it('should continue into a transient clone and teleport to the last slide when going prev from the first', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).not.toBeNull()

      settleScroll()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(carousel._activeIndex).toEqual(2)
      expect(slidSpy.calls.mostRecent().args[0].to).toEqual(2)
      expect(slidSpy.calls.mostRecent().args[0].direction).toEqual('right')
    })

    it('should report mirrored loop directions in RTL', () => {
      fixtureEl.innerHTML = basicMarkup()
      document.documentElement.dir = 'rtl'

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      carousel._activeIndex = 2
      carousel.next()
      settleScroll()

      expect(slidSpy.calls.mostRecent().args[0].direction).toEqual('right')
    })

    it('should not start a transition when the slide event is prevented', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)
      EventHandler.on(carouselEl, 'slide.bs.carousel', event => event.preventDefault())

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(carousel._looping).toBeFalse()
    })

    it('should ignore re-entrant navigation while a transition is in flight', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)
      carousel._looping = true

      carousel.to(1)

      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should not move the active index from intersection churn while looping', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)
      carousel._activeIndex = 0
      carousel._looping = true

      intersect(carousel, [0, 0, 1])

      expect(carousel._activeIndex).toEqual(0)
    })

    it('should fall back to a plain wrap for multi-item layouts', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      carouselEl.style.setProperty('--bs-carousel-items', '2')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(200)
    })

    it('should fall back to a plain wrap for centered layouts', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-center' })

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(animateScrollSpy).toHaveBeenCalled()
    })

    it('should fall back to a plain wrap with fewer than two slides', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div id="item1" class="carousel-item active">item 1</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
    })

    it('should fall back to a plain wrap under reduced motion', () => {
      fixtureEl.innerHTML = basicMarkup()
      spyOn(window, 'matchMedia').and.returnValue({ matches: true })

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(200)
    })

    it('should fall back to a plain wrap when a peek is configured', () => {
      fixtureEl.innerHTML = basicMarkup()
      const carouselEl = fixtureEl.querySelector('#myCarousel')
      carouselEl.style.setProperty('--bs-carousel-items-peek', '16px')

      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
    })

    it('should fall back to a plain wrap for variable-width (`.carousel-auto`) layouts', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-auto' })

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
    })
  })

  describe('disable end controls', () => {
    const controlsMarkup = ({ slides = 3 } = {}) => {
      const items = Array.from({ length: slides }, (_, index) =>
        `    <div id="item${index + 1}" class="carousel-item${index === 0 ? ' active' : ''}">item ${index + 1}</div>`
      ).join('')

      return [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        items,
        '  </div>',
        '  <button id="prev" class="btn-icon btn-sm" type="button" data-bs-target="#myCarousel" data-bs-slide="prev"></button>',
        '  <button id="next" class="btn-icon btn-sm" type="button" data-bs-target="#myCarousel" data-bs-slide="next"></button>',
        '</div>'
      ].join('')
    }

    it('should disable the prev control on the first slide when `ends` is `stop`', () => {
      fixtureEl.innerHTML = controlsMarkup()

      new Carousel('#myCarousel', { ends: 'stop' }) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('#prev').disabled).toBeTrue()
      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()
    })

    it('should disable the next control on the last slide when `ends` is `stop`', () => {
      fixtureEl.innerHTML = controlsMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      carousel._activeIndex = 2
      carousel._refreshActiveState()

      expect(fixtureEl.querySelector('#next').disabled).toBeTrue()
      expect(fixtureEl.querySelector('#prev').disabled).toBeFalse()
    })

    it('should not disable any control when `ends` is `wrap`', () => {
      fixtureEl.innerHTML = controlsMarkup()

      new Carousel('#myCarousel', { ends: 'wrap' }) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('#prev').disabled).toBeFalse()
      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()
    })

    it('should not disable any control when `ends` is `loop`', () => {
      fixtureEl.innerHTML = controlsMarkup()

      new Carousel('#myCarousel', { ends: 'loop' }) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('#prev').disabled).toBeFalse()
      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()
    })

    it('should disable both controls on a single-slide carousel', () => {
      fixtureEl.innerHTML = controlsMarkup({ slides: 1 })

      new Carousel('#myCarousel', { ends: 'stop' }) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('#prev').disabled).toBeTrue()
      expect(fixtureEl.querySelector('#next').disabled).toBeTrue()
    })

    it('should move focus off a control that becomes disabled', () => {
      fixtureEl.innerHTML = controlsMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      const prev = fixtureEl.querySelector('#prev')
      const next = fixtureEl.querySelector('#next')

      // Land on a middle slide so prev is enabled, then focus it
      carousel._activeIndex = 1
      carousel._refreshActiveState()
      prev.focus()
      expect(document.activeElement).toEqual(prev)

      // Back to the first slide: prev becomes disabled, focus shifts to next
      carousel._activeIndex = 0
      carousel._refreshActiveState()

      expect(prev.disabled).toBeTrue()
      expect(document.activeElement).toEqual(next)
    })

    it('should move focus to the prev control when the focused next control becomes disabled', () => {
      fixtureEl.innerHTML = controlsMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      const prev = fixtureEl.querySelector('#prev')
      const next = fixtureEl.querySelector('#next')

      // Land on a middle slide so next is enabled, then focus it
      carousel._activeIndex = 1
      carousel._refreshActiveState()
      next.focus()
      expect(document.activeElement).toEqual(next)

      // Advance to the last slide: next becomes disabled, focus shifts to prev
      carousel._activeIndex = 2
      carousel._refreshActiveState()

      expect(next.disabled).toBeTrue()
      expect(document.activeElement).toEqual(prev)
    })

    it('should fall back to the viewport when there is no opposite control to focus', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '  </div>',
        '  <button id="prev" class="btn-icon btn-sm" type="button" data-bs-target="#myCarousel" data-bs-slide="prev"></button>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      const prev = fixtureEl.querySelector('#prev')

      carousel._activeIndex = 1
      carousel._refreshActiveState()
      prev.focus()
      expect(document.activeElement).toEqual(prev)

      // Back to the first slide with no next control: focus leaves the now-disabled prev
      carousel._activeIndex = 0
      carousel._refreshActiveState()

      expect(prev.disabled).toBeTrue()
      expect(document.activeElement).not.toEqual(prev)
    })

    // Multi-item/peek/variable-width layouts can't bring the last slide to the
    // left edge, so the controls are driven by the real scroll extent instead.
    const stubScroll = (carousel, { scrollLeft, scrollWidth = 900, clientWidth = 300 }) => {
      Object.defineProperty(carousel._viewport, 'scrollWidth', { configurable: true, get: () => scrollWidth })
      Object.defineProperty(carousel._viewport, 'clientWidth', { configurable: true, get: () => clientWidth })
      Object.defineProperty(carousel._viewport, 'scrollLeft', { configurable: true, get: () => scrollLeft })
    }

    it('should disable only the prev control at the start of a scrollable (multi-item) carousel', () => {
      fixtureEl.innerHTML = controlsMarkup({ slides: 6 })

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubScroll(carousel, { scrollLeft: 0 })
      carousel._updateEndControls()

      expect(fixtureEl.querySelector('#prev').disabled).toBeTrue()
      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()
    })

    it('should disable only the next control at the end of a scrollable (multi-item) carousel', () => {
      fixtureEl.innerHTML = controlsMarkup({ slides: 6 })

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      // Active index never reaches the last slide in a multi-item layout, but
      // the scroll position is at its maximum.
      stubScroll(carousel, { scrollLeft: 600 })
      carousel._updateEndControls()

      expect(fixtureEl.querySelector('#next').disabled).toBeTrue()
      expect(fixtureEl.querySelector('#prev').disabled).toBeFalse()
    })

    it('should enable both controls in the middle of a scrollable carousel', () => {
      fixtureEl.innerHTML = controlsMarkup({ slides: 6 })

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubScroll(carousel, { scrollLeft: 300 })
      carousel._updateEndControls()

      expect(fixtureEl.querySelector('#prev').disabled).toBeFalse()
      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()
    })

    it('should refresh the end controls once a programmatic scroll settles at the extent', () => {
      fixtureEl.innerHTML = controlsMarkup({ slides: 6 })

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)
      // Rest at the scroll extent: the IntersectionObserver won't fire again, so
      // only the settle callback can disable `next`.
      stubScroll(carousel, { scrollLeft: 600 })

      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()

      carousel._scrollToIndex(1)
      settleScroll()

      expect(fixtureEl.querySelector('#next').disabled).toBeTrue()
    })
  })

  describe('active sync (IntersectionObserver)', () => {
    it('should mark the most visible item active and fire `slid`', () => {
      fixtureEl.innerHTML = basicMarkup({ indicators: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      intersect(carousel, [0.1, 1, 0])

      expect(fixtureEl.querySelector('#item2')).toHaveClass('active')
      expect(fixtureEl.querySelector('#item1')).not.toHaveClass('active')
      expect(carousel._activeIndex).toEqual(1)
      expect(slidSpy).toHaveBeenCalledTimes(1)
      expect(slidSpy.calls.mostRecent().args[0].to).toEqual(1)
    })

    it('should update the active indicator', () => {
      fixtureEl.innerHTML = basicMarkup({ indicators: true })

      const carousel = new Carousel('#myCarousel')
      intersect(carousel, [0, 0, 1])

      const active = fixtureEl.querySelector('.carousel-indicators .active')
      expect(active.getAttribute('data-bs-slide-to')).toEqual('2')
      expect(active.getAttribute('aria-current')).toEqual('true')
    })

    it('should keep the left-most item active when several are equally visible', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      carousel._activeIndex = 2
      intersect(carousel, [1, 1, 0])

      expect(carousel._activeIndex).toEqual(0)
    })

    it('should not fire `slid` when the active item does not change', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      intersect(carousel, [1, 0, 0])

      expect(slidSpy).not.toHaveBeenCalled()
    })

    it('should keep the left-most slide active when it rests a hair less visible than its neighbors', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      // Multi-item rest: the intended left-most slide is ~1px clipped (0.99) while
      // the fully-in neighbor reads 1.0. A strict max would inflate to index 2.
      intersect(carousel, [0, 0.99, 1])

      expect(carousel._activeIndex).toEqual(1)
    })

    it('should sync the active slide and fire `slid` after settling when there is no observer', () => {
      const original = window.IntersectionObserver
      window.IntersectionObserver = undefined

      try {
        fixtureEl.innerHTML = basicMarkup()
        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl)
        stubLayout(carousel)

        const slidSpy = jasmine.createSpy('slid')
        EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

        carousel.to(1)
        settleScroll()

        expect(carousel._activeIndex).toEqual(1)
        expect(slidSpy).toHaveBeenCalled()
      } finally {
        window.IntersectionObserver = original
      }
    })
  })

  describe('fade mode', () => {
    it('should crossfade by toggling the active class without scrolling', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      const carousel = new Carousel('#myCarousel')
      carousel.to(1)

      expect(fixtureEl.querySelector('#item2')).toHaveClass('active')
      expect(fixtureEl.querySelector('#item1')).not.toHaveClass('active')
      expect(animateScrollSpy).not.toHaveBeenCalled()
    })

    it('should not use the View Transition API for the fade', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      if (typeof document.startViewTransition === 'function') {
        spyOn(document, 'startViewTransition').and.callThrough()
      }

      const carousel = new Carousel('#myCarousel')
      carousel.to(1)

      if (typeof document.startViewTransition === 'function') {
        expect(document.startViewTransition).not.toHaveBeenCalled()
      }

      expect(fixtureEl.querySelector('#item2')).toHaveClass('active')
    })

    it('should fire `slide` then `slid` once each', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })
      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      const slideSpy = jasmine.createSpy('slide')
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slide.bs.carousel', slideSpy)
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      carousel.to(1)

      expect(slideSpy).toHaveBeenCalledTimes(1)
      expect(slidSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('autoplay', () => {
    it('should clear the interval on pause', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carousel = new Carousel('#myCarousel')
      expect(carousel._interval).not.toBeNull()

      carousel.pause()
      expect(carousel._interval).toBeNull()
    })

    it('should not advance when the page is not visible', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      const nextSpy = spyOn(carousel, 'next')
      spyOnProperty(document, 'visibilityState', 'get').and.returnValue('hidden')

      carousel.nextWhenVisible()
      expect(nextSpy).not.toHaveBeenCalled()
    })

    it('should respect a per-item `data-bs-interval`', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active" data-bs-interval="2000">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="4000">item 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel', { interval: 5000 })
      expect(carousel._itemInterval()).toEqual(2000)
      expect(carousel._itemInterval(1)).toEqual(4000)
    })

    it('should fall back to the configured interval when the item has none', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { interval: 4000 })
      expect(carousel._itemInterval()).toEqual(4000)
    })

    it('should schedule the next wait from the slide being navigated to, not the current one', () => {
      // The slide we're leaving has a long interval, the one we advance to a
      // short one. The next wait must use the upcoming slide's own interval.
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active" data-bs-interval="10000">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="2000">item 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel', { interval: 5000 })
      const upcoming = carousel._upcomingIndex()

      expect(upcoming).toEqual(1)
      expect(carousel._itemInterval(upcoming)).toEqual(2000)
    })

    it('should resume cycling on mouse leave only while playing', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const cycleSpy = spyOn(carousel, 'cycle')

      // Bootstrap's EventHandler maps `mouseleave` listeners onto `mouseout`
      carouselEl.dispatchEvent(createEvent('mouseout'))
      expect(cycleSpy).toHaveBeenCalled()
    })

    it('should not resume cycling on mouse leave after the user paused', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      carousel._pauseFromInteraction()
      const cycleSpy = spyOn(carousel, 'cycle')

      carouselEl.dispatchEvent(createEvent('mouseout'))
      expect(cycleSpy).not.toHaveBeenCalled()
    })

    it('should pause on hover when `pause` is `hover`', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      expect(carousel._interval).not.toBeNull()

      // Bootstrap's EventHandler maps `mouseenter` listeners onto `mouseover`
      carouselEl.dispatchEvent(createEvent('mouseover'))
      expect(carousel._interval).toBeNull()
    })

    it('should not pause on hover when `pause` is `false`', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { pause: false })

      carouselEl.dispatchEvent(createEvent('mouseover'))
      expect(carousel._interval).not.toBeNull()
    })

    it('should toggle the playing class and expose the interval while cycling', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { interval: 3000 })

      expect(carouselEl).toHaveClass('carousel-playing')
      expect(carouselEl.style.getPropertyValue('--bs-carousel-interval')).toEqual('3000ms')

      carousel.pause()
      expect(carouselEl).not.toHaveClass('carousel-playing')
    })

    it('should stop cycling at the last slide when `ends` is `stop`', () => {
      jasmine.clock().install()

      try {
        fixtureEl.innerHTML = basicMarkup({ autoplay: true })

        const carousel = new Carousel('#myCarousel', { ends: 'stop', interval: 1000 })
        carousel._activeIndex = 2
        carousel.cycle()
        expect(carousel._interval).not.toBeNull()

        jasmine.clock().tick(1001)

        expect(carousel._interval).toBeNull()
      } finally {
        jasmine.clock().uninstall()
      }
    })
  })

  describe('stop on interaction (WCAG 2.2.2)', () => {
    it('should stop autoplay when navigating with the keyboard', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      expect(carousel._playing).toBeTrue()

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowRight'
      carouselEl.dispatchEvent(keydown)

      expect(carousel._playing).toBeFalse()
      expect(carousel._interval).toBeNull()
    })

    it('should stop autoplay when the track is dragged/tapped (pointerdown)', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carousel = new Carousel('#myCarousel')
      expect(carousel._playing).toBeTrue()

      carousel._viewport.dispatchEvent(createEvent('pointerdown'))

      expect(carousel._playing).toBeFalse()
      expect(carousel._interval).toBeNull()
    })
  })

  describe('keyboard', () => {
    it('should go to the next item on right arrow and previous on left arrow', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const nextSpy = spyOn(carousel, 'next')
      const prevSpy = spyOn(carousel, 'prev')

      const right = createEvent('keydown')
      right.key = 'ArrowRight'
      carouselEl.dispatchEvent(right)

      const left = createEvent('keydown')
      left.key = 'ArrowLeft'
      carouselEl.dispatchEvent(left)

      expect(nextSpy).toHaveBeenCalled()
      expect(prevSpy).toHaveBeenCalled()
    })

    it('should ignore keystrokes from inputs and textareas', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner"><div class="carousel-item active"><input type="text"></div></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const nextSpy = spyOn(carousel, 'next')

      const keydown = createEvent('keydown', { bubbles: true })
      keydown.key = 'ArrowRight'
      carouselEl.querySelector('input').dispatchEvent(keydown)

      expect(nextSpy).not.toHaveBeenCalled()
    })

    it('should not react to keyboard when `keyboard` is `false`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { keyboard: false })
      const nextSpy = spyOn(carousel, 'next')

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowRight'
      carouselEl.dispatchEvent(keydown)

      expect(nextSpy).not.toHaveBeenCalled()
    })
  })

  describe('play/pause control', () => {
    const playPauseMarkup = ({ autoplay = true } = {}) => [
      `<div id="myCarousel" class="carousel slide"${autoplay ? ' data-bs-autoplay="true"' : ''}>`,
      '  <div class="carousel-inner">',
      '    <div class="carousel-item active">item 1</div>',
      '    <div class="carousel-item">item 2</div>',
      '  </div>',
      '  <button class="carousel-control-play-pause" type="button" data-bs-target="#myCarousel" data-bs-pause-label="Pause" data-bs-play-label="Play">',
      '    <span class="carousel-icon-pause"></span>',
      '    <span class="carousel-icon-play"></span>',
      '  </button>',
      '</div>'
    ].join('')

    it('should reflect the playing state on init', () => {
      fixtureEl.innerHTML = playPauseMarkup({ autoplay: true })
      new Carousel('#myCarousel') // eslint-disable-line no-new

      expect(fixtureEl.querySelector('.carousel-control-play-pause')).not.toHaveClass('paused')
    })

    it('should reflect the paused state for a static carousel', () => {
      fixtureEl.innerHTML = playPauseMarkup({ autoplay: false })
      new Carousel('#myCarousel') // eslint-disable-line no-new

      expect(fixtureEl.querySelector('.carousel-control-play-pause')).toHaveClass('paused')
    })

    it('should toggle autoplay, the class and the label when clicked', () => {
      fixtureEl.innerHTML = playPauseMarkup({ autoplay: true })

      const carousel = new Carousel('#myCarousel')
      const control = fixtureEl.querySelector('.carousel-control-play-pause')

      expect(carousel._interval).not.toBeNull()

      control.click()
      expect(carousel._interval).toBeNull()
      expect(carousel._playing).toBeFalse()
      expect(control).toHaveClass('paused')
      expect(control.getAttribute('aria-label')).toEqual('Play')

      control.click()
      expect(carousel._interval).not.toBeNull()
      expect(carousel._playing).toBeTrue()
      expect(control).not.toHaveClass('paused')
      expect(control.getAttribute('aria-label')).toEqual('Pause')
    })

    it('should let the control start autoplay on an otherwise static carousel', () => {
      fixtureEl.innerHTML = playPauseMarkup({ autoplay: false })

      const carousel = new Carousel('#myCarousel')
      const control = fixtureEl.querySelector('.carousel-control-play-pause')
      expect(carousel._interval).toBeNull()

      control.click()
      expect(carousel._interval).not.toBeNull()
      expect(carousel._playing).toBeTrue()
    })
  })

  describe('data-api', () => {
    it('should navigate and stop autoplay when clicking a control', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide" data-bs-autoplay="true">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '  </div>',
        '  <button id="next" class="btn-icon btn-sm" type="button" data-bs-target="#myCarousel" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const carousel = Carousel.getOrCreateInstance('#myCarousel')
      stubLayout(carousel)

      fixtureEl.querySelector('#next').click()

      expect(carousel._playing).toBeFalse()
      expect(carousel._interval).toBeNull()
      expect(animateScrollSpy).toHaveBeenCalled()
    })

    it('should go to the previous item with data-bs-slide="prev"', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide" data-bs-ends="wrap">',
        '  <div class="carousel-inner">',
        '    <div id="item1" class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '  </div>',
        '  <button id="prev" class="btn-icon btn-sm" type="button" data-bs-target="#myCarousel" data-bs-slide="prev"></button>',
        '</div>'
      ].join('')

      const carousel = Carousel.getOrCreateInstance('#myCarousel')
      stubLayout(carousel)

      fixtureEl.querySelector('#prev').click()
      // wraps to the last item (item2), one item-width (100) to the right
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(100)
    })

    it('should go to a given index with data-bs-slide-to', () => {
      fixtureEl.innerHTML = basicMarkup({ indicators: true })

      const carousel = Carousel.getOrCreateInstance('#myCarousel')
      stubLayout(carousel)

      fixtureEl.querySelector('[data-bs-slide-to="2"]').click()

      // item3 is two item-widths (200) to the right — a full multi-slide jump
      expect(animateScrollSpy.calls.mostRecent().args[0]).toEqual(200)
    })

    it('should toggle play/pause via the data-api', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide" data-bs-autoplay="true">',
        '  <div class="carousel-inner"><div class="carousel-item active">item 1</div></div>',
        '  <button id="pp" class="carousel-control-play-pause" type="button" data-bs-target="#myCarousel"></button>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel')
      expect(carousel._playing).toBeTrue()

      fixtureEl.querySelector('#pp').click()
      expect(carousel._playing).toBeFalse()
    })

    it('should init carousels with data-bs-autoplay="true" on load', () => {
      fixtureEl.innerHTML = '<div id="myCarousel" data-bs-autoplay="true"><div class="carousel-inner"><div class="carousel-item active">item 1</div></div></div>'

      const loadEvent = createEvent('load')
      window.dispatchEvent(loadEvent)

      const carousel = Carousel.getInstance('#myCarousel')
      expect(carousel).not.toBeNull()
      expect(carousel._interval).not.toBeNull()
    })

    it('should do nothing if the target is not a carousel', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="slide">',
        '  <div class="carousel-inner"><div class="carousel-item active">item 1</div></div>',
        '  <button id="next" class="btn-icon btn-sm" type="button" data-bs-target="#myCarousel" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      fixtureEl.querySelector('#next').click()
      expect().nothing()
    })
  })

  describe('dispose', () => {
    it('should disconnect the observer', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      const disconnectSpy = spyOn(carousel._observer, 'disconnect')

      carousel.dispose()
      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should dispose cleanly in fade mode without an observer', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      const carousel = new Carousel('#myCarousel')
      expect(carousel._observer).toBeNull()
      expect(() => carousel.dispose()).not.toThrow()
    })

    it('should stop autoplay so no timer fires after dispose', () => {
      jasmine.clock().install()

      try {
        fixtureEl.innerHTML = basicMarkup({ autoplay: true })

        const carousel = new Carousel('#myCarousel')
        const advanceSpy = spyOn(carousel, 'nextWhenVisible').and.callThrough()
        expect(carousel._interval).not.toBeNull()

        carousel.dispose()
        // Without clearing the timer, the pending callback would fire here and
        // throw on the now-null `_element`.
        expect(() => jasmine.clock().tick(10000)).not.toThrow()
        expect(advanceSpy).not.toHaveBeenCalled()
      } finally {
        jasmine.clock().uninstall()
      }
    })

    it('should remove the viewport pointerdown listener on dispose', () => {
      fixtureEl.innerHTML = basicMarkup({ autoplay: true })

      const carousel = new Carousel('#myCarousel')
      const { _viewport: viewport } = carousel

      carousel.dispose()
      // A late interaction on the detached viewport must not resurrect autoplay
      expect(() => viewport.dispatchEvent(createEvent('pointerdown'))).not.toThrow()
    })

    it('should remove the clone and cancel the pending frame when disposed mid-loop', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)
      carousel._activeIndex = 2

      carousel.next()
      const { _viewport: viewport } = carousel
      expect(viewport.querySelector('.carousel-item-clone')).not.toBeNull()

      expect(() => carousel.dispose()).not.toThrow()
      expect(viewport.querySelector('.carousel-item-clone')).toBeNull()
    })
  })
})
