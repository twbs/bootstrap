import Carousel from '../../src/carousel.js'
import EventHandler from '../../src/dom/event-handler.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Carousel', () => {
  let fixtureEl
  let realIntersectionObserver
  let scrollIntoViewSpy

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
    scrollIntoViewSpy = spyOn(Element.prototype, 'scrollIntoView')
  })

  afterEach(() => {
    window.IntersectionObserver = realIntersectionObserver
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

    it('should set touch-action to pan-y when `touch` is `false`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { touch: false })
      expect(carousel._viewport.style.touchAction).toEqual('pan-y')
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
    it('should scroll to the next item and fire `slide`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const slideSpy = jasmine.createSpy('slide')
      EventHandler.on(carouselEl, 'slide.bs.carousel', slideSpy)

      carousel.next()

      expect(scrollIntoViewSpy).toHaveBeenCalled()
      expect(scrollIntoViewSpy.calls.mostRecent().object).toEqual(fixtureEl.querySelector('#item2'))
      expect(slideSpy).toHaveBeenCalledTimes(1)
      expect(slideSpy.calls.mostRecent().args[0].to).toEqual(1)
      expect(slideSpy.calls.mostRecent().args[0].direction).toEqual('left')
    })

    it('should not scroll when the `slide` event is prevented', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      EventHandler.on(carouselEl, 'slide.bs.carousel', event => event.preventDefault())

      carousel.next()

      expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it('should wrap to the last item when going prev from the first (wrap: true)', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      carousel.prev()

      expect(scrollIntoViewSpy.calls.mostRecent().object).toEqual(fixtureEl.querySelector('#item3'))
    })

    it('should not move past the ends when `wrap` is `false`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { wrap: false })
      carousel.prev()

      expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it('should center the active slide when `.carousel-center` is present', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-center' })

      const carousel = new Carousel('#myCarousel')
      carousel.next()

      expect(scrollIntoViewSpy.calls.mostRecent().args[0].inline).toEqual('center')
    })

    it('should do nothing when navigating to the current index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      carousel.to(0)

      expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it('should not advance past the last item when `wrap` is `false`', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { wrap: false })
      carousel._activeIndex = 2
      carousel.next()

      expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it('should ignore a non-numeric index', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel')
      carousel.to('not-a-number')

      expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it('should scroll without smooth behavior when reduced motion is preferred', () => {
      fixtureEl.innerHTML = basicMarkup()

      spyOn(window, 'matchMedia').and.returnValue({ matches: true })

      const carousel = new Carousel('#myCarousel')
      carousel.next()

      expect(scrollIntoViewSpy.calls.mostRecent().args[0].behavior).toEqual('auto')
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
  })

  describe('fade mode', () => {
    it('should toggle the active class via a view transition', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      spyOn(document, 'startViewTransition').and.callFake(callback => {
        callback()
        return { finished: Promise.resolve() }
      })

      const carousel = new Carousel('#myCarousel')
      carousel.to(1)

      expect(document.startViewTransition).toHaveBeenCalled()
      expect(fixtureEl.querySelector('#item2')).toHaveClass('active')
      expect(fixtureEl.querySelector('#item1')).not.toHaveClass('active')
      expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it('should fall back to a plain class swap when view transitions are unavailable', () => {
      fixtureEl.innerHTML = basicMarkup({ classes: 'carousel slide carousel-fade' })

      const original = document.startViewTransition
      document.startViewTransition = undefined

      const carousel = new Carousel('#myCarousel')
      carousel.to(1)

      expect(fixtureEl.querySelector('#item2')).toHaveClass('active')

      document.startViewTransition = original
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
        '    <div class="carousel-item">item 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carousel = new Carousel('#myCarousel', { interval: 5000 })
      expect(carousel._activeItemInterval()).toEqual(2000)
    })

    it('should fall back to the configured interval when the item has none', () => {
      fixtureEl.innerHTML = basicMarkup()

      const carousel = new Carousel('#myCarousel', { interval: 4000 })
      expect(carousel._activeItemInterval()).toEqual(4000)
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
      '    <span class="carousel-control-play-pause-icon"></span>',
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

      const next = fixtureEl.querySelector('#next')
      next.click()

      const carousel = Carousel.getInstance('#myCarousel')
      expect(carousel._playing).toBeFalse()
      expect(carousel._interval).toBeNull()
      expect(scrollIntoViewSpy).toHaveBeenCalled()
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

      fixtureEl.querySelector('#prev').click()
      // wraps to the last item
      expect(scrollIntoViewSpy.calls.mostRecent().object).toEqual(fixtureEl.querySelector('#item2'))
    })

    it('should go to a given index with data-bs-slide-to', () => {
      fixtureEl.innerHTML = basicMarkup({ indicators: true })

      const indicator = fixtureEl.querySelector('[data-bs-slide-to="2"]')
      indicator.click()

      expect(scrollIntoViewSpy.calls.mostRecent().object).toEqual(fixtureEl.querySelector('#item3'))
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
