import Carousel from '../../src/carousel.js'
import EventHandler from '../../src/dom/event-handler.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Carousel', () => {
  let fixtureEl
  let realIntersectionObserver
  let scrollBySpy

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

  // `scrollBy` is stubbed (no real movement), so the settle watcher never sees
  // movement and falls back to its frame cap (SCROLL_SETTLE_MAX_FRAMES = 10).
  // Await past that so the loop transition's teleport/`slid` step runs first.
  const flushFrames = (count = 14) => {
    let chain = Promise.resolve()
    for (let i = 0; i < count; i++) {
      chain = chain.then(() => new Promise(resolve => {
        requestAnimationFrame(resolve)
      }))
    }

    return chain
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  beforeEach(() => {
    realIntersectionObserver = window.IntersectionObserver
    window.IntersectionObserver = MockIntersectionObserver
    scrollBySpy = spyOn(Element.prototype, 'scrollBy')
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

    it('should default `ends` to `wrap`', () => {
      expect(Carousel.Default.ends).toEqual('wrap')
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

      expect(scrollBySpy).toHaveBeenCalled()
      // The viewport (not the item) is the element being scrolled
      expect(scrollBySpy.calls.mostRecent().object).toEqual(carousel._viewport)
      // item2 sits one item-width (100) to the right of the viewport's start
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(100)
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

      expect(scrollBySpy).not.toHaveBeenCalled()
    })

    it('should wrap to the last item when going prev from the first (wrap: true)', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel.prev()

      // item3 is two item-widths (200) to the right — a full multi-slide jump
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(200)
    })

    it('should not move past the ends when `ends` is `stop`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)
      carousel.prev()

      expect(scrollBySpy).not.toHaveBeenCalled()
    })

    it('should center the active slide when `.carousel-center` is present', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-center' })

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel, { viewportWidth: 300, itemWidth: 200 })
      carousel.next()

      // Center mode aligns the item's center to the viewport's center:
      // (itemLeft 200 + itemWidth/2 100) - (viewportLeft 0 + viewportWidth/2 150) = 150
      // (start alignment would instead be itemLeft - viewportLeft = 200)
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(150)
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
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(70)
    })

    it('should do nothing when navigating to the current index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel.to(0)

      expect(scrollBySpy).not.toHaveBeenCalled()
    })

    it('should not advance past the last item when `ends` is `stop`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)
      carousel._activeIndex = 2
      carousel.next()

      expect(scrollBySpy).not.toHaveBeenCalled()
    })

    it('should ignore a non-numeric index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel.to('not-a-number')

      expect(scrollBySpy).not.toHaveBeenCalled()
    })

    it('should scroll without smooth behavior when reduced motion is preferred', () => {
      fixtureEl.innerHTML = basicMarkup()

      spyOn(window, 'matchMedia').and.returnValue({ matches: true })

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel.next()

      // `'instant'` rather than `'auto'`, which would defer to the CSS
      // `scroll-behavior: smooth` and animate despite the user's preference.
      expect(scrollBySpy.calls.mostRecent().args[0].behavior).toEqual('instant')
    })

    it('should not scroll when the target item is missing', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      carousel._scrollToIndex(99)

      expect(scrollBySpy).not.toHaveBeenCalled()
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

    it('should cancel a pending snap-restore frame when navigating again', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      const cancelSpy = spyOn(window, 'cancelAnimationFrame').and.callThrough()

      carousel.next() // schedules a snap-restore frame
      carousel.to(2) // navigates again before it settles, cancelling the pending frame

      expect(cancelSpy).toHaveBeenCalled()
    })

    it('should restore snapping immediately when requestAnimationFrame is unavailable', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      stubLayout(carousel)
      const original = window.requestAnimationFrame
      window.requestAnimationFrame = undefined

      carousel.next()
      expect(carousel._viewport.style.scrollSnapType).toEqual('')

      window.requestAnimationFrame = original
    })

    it('should restore snapping as soon as the viewport reaches the scroll target', async () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      carousel._viewport.style.scrollSnapType = 'none'
      // Pretend the viewport is already sitting on the destination snap point.
      Object.defineProperty(carousel._viewport, 'scrollLeft', { configurable: true, get: () => 300 })

      carousel._restoreSnapWhenSettled(300)
      // Far fewer than SCROLL_SETTLE_MAX_FRAMES: only the target-reached branch
      // can restore this quickly (the no-movement fallback waits the full cap).
      await flushFrames(2)

      expect(carousel._viewport.style.scrollSnapType).toEqual('')
    })
  })

  describe('end behavior (`ends`)', () => {
    it('should not move past either end when `ends` is `stop`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)

      carousel.prev()
      expect(scrollBySpy).not.toHaveBeenCalled()

      carousel._activeIndex = 2
      carousel.next()
      expect(scrollBySpy).not.toHaveBeenCalled()
    })

    it('should wrap around at both ends when `ends` is `wrap`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { ends: 'wrap' })
      stubLayout(carousel)

      carousel.prev()
      // wraps to the last item (item3), two item-widths (200) to the right
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(200)
    })
  })

  describe('seamless loop (`ends: loop`)', () => {
    it('should continue into a transient clone and teleport to the first slide when going next from the last', async () => {
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

      await flushFrames()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(carousel._activeIndex).toEqual(0)
      expect(carousel._looping).toBeFalse()
      expect(slidSpy.calls.mostRecent().args[0].to).toEqual(0)
      expect(slidSpy.calls.mostRecent().args[0].direction).toEqual('left')
    })

    it('should continue into a transient clone and teleport to the last slide when going prev from the first', async () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).not.toBeNull()

      await flushFrames()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(carousel._activeIndex).toEqual(2)
      expect(slidSpy.calls.mostRecent().args[0].to).toEqual(2)
      expect(slidSpy.calls.mostRecent().args[0].direction).toEqual('right')
    })

    it('should report mirrored loop directions in RTL', async () => {
      fixtureEl.innerHTML = basicMarkup()
      document.documentElement.dir = 'rtl'

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { ends: 'loop' })
      stubLayout(carousel)
      const slidSpy = jasmine.createSpy('slid')
      EventHandler.on(carouselEl, 'slid.bs.carousel', slidSpy)

      carousel._activeIndex = 2
      carousel.next()
      await flushFrames()

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

      expect(scrollBySpy).not.toHaveBeenCalled()
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
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(200)
    })

    it('should fall back to a plain wrap for centered layouts', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-center' })

      const carousel = new Carousel('#myCarousel', { ends: 'loop' })
      stubLayout(carousel)

      carousel.prev()

      expect(carousel._viewport.querySelector('.carousel-item-clone')).toBeNull()
      expect(scrollBySpy).toHaveBeenCalled()
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
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(200)
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
        '  <button id="prev" class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev"></button>',
        '  <button id="next" class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next"></button>',
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
        '  <button id="prev" class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev"></button>',
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

    it('should refresh the end controls once a programmatic scroll settles at the extent', async () => {
      fixtureEl.innerHTML = controlsMarkup({ slides: 6 })

      const carousel = new Carousel('#myCarousel', { ends: 'stop' })
      stubLayout(carousel)
      // Rest at the scroll extent: the IntersectionObserver won't fire again, so
      // only the settle callback can disable `next`.
      stubScroll(carousel, { scrollLeft: 600 })

      expect(fixtureEl.querySelector('#next').disabled).toBeFalse()

      carousel._scrollToIndex(1)
      await flushFrames()

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
  })

  describe('fade mode', () => {
    it('should crossfade by toggling the active class without scrolling', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      const carousel = new Carousel('#myCarousel')
      carousel.to(1)

      expect(fixtureEl.querySelector('#item2')).toHaveClass('active')
      expect(fixtureEl.querySelector('#item1')).not.toHaveClass('active')
      expect(scrollBySpy).not.toHaveBeenCalled()
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
        '  <button id="next" class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const carousel = Carousel.getOrCreateInstance('#myCarousel')
      stubLayout(carousel)

      fixtureEl.querySelector('#next').click()

      expect(carousel._playing).toBeFalse()
      expect(carousel._interval).toBeNull()
      expect(scrollBySpy).toHaveBeenCalled()
    })

    it('should go to the previous item with data-bs-slide="prev"', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div id="item1" class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '  </div>',
        '  <button id="prev" class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev"></button>',
        '</div>'
      ].join('')

      const carousel = Carousel.getOrCreateInstance('#myCarousel')
      stubLayout(carousel)

      fixtureEl.querySelector('#prev').click()
      // wraps to the last item (item2), one item-width (100) to the right
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(100)
    })

    it('should go to a given index with data-bs-slide-to', () => {
      fixtureEl.innerHTML = basicMarkup({ indicators: true })

      const carousel = Carousel.getOrCreateInstance('#myCarousel')
      stubLayout(carousel)

      fixtureEl.querySelector('[data-bs-slide-to="2"]').click()

      // item3 is two item-widths (200) to the right — a full multi-slide jump
      expect(scrollBySpy.calls.mostRecent().args[0].left).toEqual(200)
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
        '  <button id="next" class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next"></button>',
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
  })
})
