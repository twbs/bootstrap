import Carousel from '../../src/carousel'
import EventHandler from '../../src/dom/event-handler'

/** Test helpers */
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'
import * as util from '../../src/util'

describe('Carousel', () => {
  const { Simulator, PointerEvent } = window
  const originWinPointerEvent = PointerEvent
  const supportPointerEvent = Boolean(PointerEvent)

  const cssStyleCarousel = '.carousel.pointer-event { touch-action: none; }'

  const stylesCarousel = document.createElement('style')
  stylesCarousel.type = 'text/css'
  stylesCarousel.appendChild(document.createTextNode(cssStyleCarousel))

  const clearPointerEvents = () => {
    window.PointerEvent = null
  }

  const restorePointerEvents = () => {
    window.PointerEvent = originWinPointerEvent
  }

  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
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
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Carousel.DATA_KEY).toEqual('bs.carousel')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div id="myCarousel" class="carousel slide"></div>'

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carouselBySelector = new Carousel('#myCarousel')
      const carouselByElement = new Carousel(carouselEl)

      expect(carouselBySelector._element).toEqual(carouselEl)
      expect(carouselByElement._element).toEqual(carouselEl)
    })

    it('should go to next item if right arrow key is pressed', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {
        keyboard: true
      })

      spyOn(carousel, '_keydown').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item2'))
        expect(carousel._keydown).toHaveBeenCalled()
        done()
      })

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowRight'

      carouselEl.dispatchEvent(keydown)
    })

    it('should go to previous item if left arrow key is pressed', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div id="item1" class="carousel-item">item 1</div>',
        '    <div class="carousel-item active">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {
        keyboard: true
      })

      spyOn(carousel, '_keydown').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item1'))
        expect(carousel._keydown).toHaveBeenCalled()
        done()
      })

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowLeft'

      carouselEl.dispatchEvent(keydown)
    })

    it('should not prevent keydown if key is not ARROW_LEFT or ARROW_RIGHT', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {
        keyboard: true
      })

      spyOn(carousel, '_keydown').and.callThrough()

      carouselEl.addEventListener('keydown', event => {
        expect(carousel._keydown).toHaveBeenCalled()
        expect(event.defaultPrevented).toEqual(false)
        done()
      })

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowDown'

      carouselEl.dispatchEvent(keydown)
    })

    it('should ignore keyboard events within <input>s and <textarea>s', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">',
        '      <input type="text">',
        '      <textarea></textarea>',
        '    </div>',
        '    <div class="carousel-item"></div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const input = fixtureEl.querySelector('input')
      const textarea = fixtureEl.querySelector('textarea')
      const carousel = new Carousel(carouselEl, {
        keyboard: true
      })

      const spyKeydown = spyOn(carousel, '_keydown').and.callThrough()
      const spySlide = spyOn(carousel, '_slide')

      const keydown = createEvent('keydown', { bubbles: true, cancelable: true })
      keydown.key = 'ArrowRight'
      Object.defineProperty(keydown, 'target', {
        value: input,
        writable: true,
        configurable: true
      })

      input.dispatchEvent(keydown)

      expect(spyKeydown).toHaveBeenCalled()
      expect(spySlide).not.toHaveBeenCalled()

      spyKeydown.calls.reset()
      spySlide.calls.reset()

      Object.defineProperty(keydown, 'target', {
        value: textarea
      })
      textarea.dispatchEvent(keydown)

      expect(spyKeydown).toHaveBeenCalled()
      expect(spySlide).not.toHaveBeenCalled()
    })

    it('should not slide if arrow key is pressed and carousel is sliding', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      spyOn(carousel, '_triggerSlideEvent')

      carousel._isSliding = true;

      ['ArrowLeft', 'ArrowRight'].forEach(key => {
        const keydown = createEvent('keydown')
        keydown.key = key

        carouselEl.dispatchEvent(keydown)
      })

      expect(carousel._triggerSlideEvent).not.toHaveBeenCalled()
    })

    it('should wrap around from end to start when wrap option is true', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div id="one" class="carousel-item active"></div>',
        '    <div id="two" class="carousel-item"></div>',
        '    <div id="three" class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, { wrap: true })
      const getActiveId = () => {
        return carouselEl.querySelector('.carousel-item.active').getAttribute('id')
      }

      carouselEl.addEventListener('slid.bs.carousel', e => {
        const activeId = getActiveId()

        if (activeId === 'two') {
          carousel.next()
          return
        }

        if (activeId === 'three') {
          carousel.next()
          return
        }

        if (activeId === 'one') {
          // carousel wrapped around and slid from 3rd to 1st slide
          expect(activeId).toEqual('one')
          expect(e.from + 1).toEqual(3)
          done()
        }
      })

      carousel.next()
    })

    it('should stay at the start when the prev method is called and wrap is false', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div id="one" class="carousel-item active"></div>',
        '    <div id="two" class="carousel-item"></div>',
        '    <div id="three" class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const firstElement = fixtureEl.querySelector('#one')
      const carousel = new Carousel(carouselEl, { wrap: false })

      carouselEl.addEventListener('slid.bs.carousel', () => {
        throw new Error('carousel slid when it should not have slid')
      })

      carousel.prev()

      setTimeout(() => {
        expect(firstElement.classList.contains('active')).toEqual(true)
        done()
      }, 10)
    })

    it('should not add touch event listeners if touch = false', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')

      spyOn(Carousel.prototype, '_addTouchEventListeners')

      const carousel = new Carousel(carouselEl, {
        touch: false
      })

      expect(carousel._addTouchEventListeners).not.toHaveBeenCalled()
    })

    it('should not add touch event listeners if touch supported = false', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')

      const carousel = new Carousel(carouselEl)

      EventHandler.off(carouselEl, '.bs-carousel')
      carousel._touchSupported = false

      spyOn(carousel, '_addTouchEventListeners')

      carousel._addEventListeners()

      expect(carousel._addTouchEventListeners).not.toHaveBeenCalled()
    })

    it('should add touch event listeners by default', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')

      spyOn(Carousel.prototype, '_addTouchEventListeners')

      // Headless browser does not support touch events, so need to fake it
      // to test that touch events are add properly.
      document.documentElement.ontouchstart = () => {}
      const carousel = new Carousel(carouselEl)

      expect(carousel._addTouchEventListeners).toHaveBeenCalled()
    })

    it('should allow swiperight and call _slide (prev) with pointer events', done => {
      if (!supportPointerEvent) {
        expect().nothing()
        done()
        return
      }

      document.documentElement.ontouchstart = () => {}
      document.head.appendChild(stylesCarousel)
      Simulator.setType('pointer')

      fixtureEl.innerHTML = [
        '<div class="carousel" data-bs-interval="false">',
        '  <div class="carousel-inner">',
        '    <div id="item" class="carousel-item">',
        '      <img alt="">',
        '    </div>',
        '    <div class="carousel-item active">',
        '      <img alt="">',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const item = fixtureEl.querySelector('#item')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, '_slide').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', event => {
        expect(item.classList.contains('active')).toEqual(true)
        expect(carousel._slide).toHaveBeenCalledWith('right')
        expect(event.direction).toEqual('right')
        document.head.removeChild(stylesCarousel)
        delete document.documentElement.ontouchstart
        done()
      })

      Simulator.gestures.swipe(carouselEl, {
        deltaX: 300,
        deltaY: 0
      })
    })

    it('should allow swipeleft and call next with pointer events', done => {
      if (!supportPointerEvent) {
        expect().nothing()
        done()
        return
      }

      document.documentElement.ontouchstart = () => {}
      document.head.appendChild(stylesCarousel)
      Simulator.setType('pointer')

      fixtureEl.innerHTML = [
        '<div class="carousel" data-bs-interval="false">',
        '  <div class="carousel-inner">',
        '    <div id="item" class="carousel-item active">',
        '      <img alt="">',
        '    </div>',
        '    <div class="carousel-item">',
        '      <img alt="">',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const item = fixtureEl.querySelector('#item')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, '_slide').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', event => {
        expect(item.classList.contains('active')).toEqual(false)
        expect(carousel._slide).toHaveBeenCalledWith('left')
        expect(event.direction).toEqual('left')
        document.head.removeChild(stylesCarousel)
        delete document.documentElement.ontouchstart
        done()
      })

      Simulator.gestures.swipe(carouselEl, {
        pos: [300, 10],
        deltaX: -300,
        deltaY: 0
      })
    })

    it('should allow swiperight and call _slide (prev) with touch events', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = [
        '<div class="carousel" data-bs-interval="false">',
        '  <div class="carousel-inner">',
        '    <div id="item" class="carousel-item">',
        '      <img alt="">',
        '    </div>',
        '    <div class="carousel-item active">',
        '      <img alt="">',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const item = fixtureEl.querySelector('#item')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, '_slide').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', event => {
        expect(item.classList.contains('active')).toEqual(true)
        expect(carousel._slide).toHaveBeenCalledWith('right')
        expect(event.direction).toEqual('right')
        delete document.documentElement.ontouchstart
        restorePointerEvents()
        done()
      })

      Simulator.gestures.swipe(carouselEl, {
        deltaX: 300,
        deltaY: 0
      })
    })

    it('should allow swipeleft and call _slide (next) with touch events', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = [
        '<div class="carousel" data-bs-interval="false">',
        '  <div class="carousel-inner">',
        '    <div id="item" class="carousel-item active">',
        '      <img alt="">',
        '    </div>',
        '    <div class="carousel-item">',
        '      <img alt="">',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const item = fixtureEl.querySelector('#item')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, '_slide').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', event => {
        expect(item.classList.contains('active')).toEqual(false)
        expect(carousel._slide).toHaveBeenCalledWith('left')
        expect(event.direction).toEqual('left')
        delete document.documentElement.ontouchstart
        restorePointerEvents()
        done()
      })

      Simulator.gestures.swipe(carouselEl, {
        pos: [300, 10],
        deltaX: -300,
        deltaY: 0
      })
    })

    it('should not slide when swiping and carousel is sliding', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = [
        '<div class="carousel" data-bs-interval="false">',
        '  <div class="carousel-inner">',
        '    <div id="item" class="carousel-item active">',
        '      <img alt="">',
        '    </div>',
        '    <div class="carousel-item">',
        '      <img alt="">',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const carousel = new Carousel(carouselEl)
      carousel._isSliding = true

      spyOn(carousel, '_triggerSlideEvent')

      Simulator.gestures.swipe(carouselEl, {
        deltaX: 300,
        deltaY: 0
      })

      Simulator.gestures.swipe(carouselEl, {
        pos: [300, 10],
        deltaX: -300,
        deltaY: 0
      })

      setTimeout(() => {
        expect(carousel._triggerSlideEvent).not.toHaveBeenCalled()
        delete document.documentElement.ontouchstart
        restorePointerEvents()
        done()
      }, 300)
    })

    it('should not allow pinch with touch events', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = '<div class="carousel" data-bs-interval="false"></div>'

      const carouselEl = fixtureEl.querySelector('.carousel')
      const carousel = new Carousel(carouselEl)

      Simulator.gestures.swipe(carouselEl, {
        pos: [300, 10],
        deltaX: -300,
        deltaY: 0,
        touches: 2
      }, () => {
        restorePointerEvents()
        delete document.documentElement.ontouchstart
        expect(carousel.touchDeltaX).toEqual(0)
        done()
      })
    })

    it('should call pause method on mouse over with pause equal to hover', done => {
      fixtureEl.innerHTML = '<div class="carousel"></div>'

      const carouselEl = fixtureEl.querySelector('.carousel')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, 'pause')

      const mouseOverEvent = createEvent('mouseover')
      carouselEl.dispatchEvent(mouseOverEvent)

      setTimeout(() => {
        expect(carousel.pause).toHaveBeenCalled()
        done()
      }, 10)
    })

    it('should call cycle on mouse out with pause equal to hover', done => {
      fixtureEl.innerHTML = '<div class="carousel"></div>'

      const carouselEl = fixtureEl.querySelector('.carousel')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, 'cycle')

      const mouseOutEvent = createEvent('mouseout')
      carouselEl.dispatchEvent(mouseOutEvent)

      setTimeout(() => {
        expect(carousel.cycle).toHaveBeenCalled()
        done()
      }, 10)
    })
  })

  describe('next', () => {
    it('should not slide if the carousel is sliding', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      spyOn(carousel, '_triggerSlideEvent')

      carousel._isSliding = true
      carousel.next()

      expect(carousel._triggerSlideEvent).not.toHaveBeenCalled()
    })

    it('should not fire slid when slide is prevented', done => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})
      let slidEvent = false

      const doneTest = () => {
        setTimeout(() => {
          expect(slidEvent).toEqual(false)
          done()
        }, 20)
      }

      carouselEl.addEventListener('slide.bs.carousel', e => {
        e.preventDefault()
        doneTest()
      })

      carouselEl.addEventListener('slid.bs.carousel', () => {
        slidEvent = true
      })

      carousel.next()
    })

    it('should fire slide event with: direction, relatedTarget, from and to', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      const onSlide = e => {
        expect(e.direction).toEqual('left')
        expect(e.relatedTarget.classList.contains('carousel-item')).toEqual(true)
        expect(e.from).toEqual(0)
        expect(e.to).toEqual(1)

        carouselEl.removeEventListener('slide.bs.carousel', onSlide)
        carouselEl.addEventListener('slide.bs.carousel', onSlide2)

        carousel.prev()
      }

      const onSlide2 = e => {
        expect(e.direction).toEqual('right')
        done()
      }

      carouselEl.addEventListener('slide.bs.carousel', onSlide)
      carousel.next()
    })

    it('should fire slid event with: direction, relatedTarget, from and to', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      const onSlid = e => {
        expect(e.direction).toEqual('left')
        expect(e.relatedTarget.classList.contains('carousel-item')).toEqual(true)
        expect(e.from).toEqual(0)
        expect(e.to).toEqual(1)

        carouselEl.removeEventListener('slid.bs.carousel', onSlid)
        carouselEl.addEventListener('slid.bs.carousel', onSlid2)

        carousel.prev()
      }

      const onSlid2 = e => {
        expect(e.direction).toEqual('right')
        done()
      }

      carouselEl.addEventListener('slid.bs.carousel', onSlid)
      carousel.next()
    })

    it('should update the active element to the next item before sliding', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="secondItem" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const secondItemEl = fixtureEl.querySelector('#secondItem')
      const carousel = new Carousel(carouselEl)

      carousel.next()

      expect(carousel._activeElement).toEqual(secondItemEl)
    })

    it('should update indicators if present', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-indicators">',
        '    <button type="button" id="firstIndicator" data-bs-target="myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>',
        '    <button type="button" id="secondIndicator" data-bs-target="myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>',
        '    <button type="button" data-bs-target="myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>',
        '  </div>',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const firstIndicator = fixtureEl.querySelector('#firstIndicator')
      const secondIndicator = fixtureEl.querySelector('#secondIndicator')
      const carousel = new Carousel(carouselEl)

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(firstIndicator.classList.contains('active')).toEqual(false)
        expect(firstIndicator.hasAttribute('aria-current')).toEqual(false)
        expect(secondIndicator.classList.contains('active')).toEqual(true)
        expect(secondIndicator.getAttribute('aria-current')).toEqual('true')
        done()
      })

      carousel.next()
    })

    it('should call next()/prev() instance methods when clicking the respective direction buttons', () => {
      fixtureEl.innerHTML = [
        '<div id="carousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev"></button>',
        '  <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#carousel')
      const prevBtnEl = fixtureEl.querySelector('.carousel-control-prev')
      const nextBtnEl = fixtureEl.querySelector('.carousel-control-next')

      const carousel = new Carousel(carouselEl)
      const nextSpy = spyOn(carousel, 'next')
      const prevSpy = spyOn(carousel, 'prev')

      nextBtnEl.click()
      prevBtnEl.click()

      expect(nextSpy).toHaveBeenCalled()
      expect(prevSpy).toHaveBeenCalled()
    })
  })

  describe('nextWhenVisible', () => {
    it('should not call next when the page is not visible', () => {
      fixtureEl.innerHTML = [
        '<div style="display: none;">',
        '  <div class="carousel" data-bs-interval="false"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, 'next')

      carousel.nextWhenVisible()

      expect(carousel.next).not.toHaveBeenCalled()
    })
  })

  describe('prev', () => {
    it('should not slide if the carousel is sliding', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      spyOn(carousel, '_triggerSlideEvent')

      carousel._isSliding = true
      carousel.prev()

      expect(carousel._triggerSlideEvent).not.toHaveBeenCalled()
    })
  })

  describe('pause', () => {
    it('should call cycle if the carousel have carousel-item-next and carousel-item-prev class', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item carousel-item-next">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, 'cycle')
      spyOn(window, 'clearInterval')

      carousel.pause()

      expect(carousel.cycle).toHaveBeenCalledWith(true)
      expect(window.clearInterval).toHaveBeenCalled()
      expect(carousel._isPaused).toEqual(true)
    })

    it('should not call cycle if nothing is in transition', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      spyOn(carousel, 'cycle')
      spyOn(window, 'clearInterval')

      carousel.pause()

      expect(carousel.cycle).not.toHaveBeenCalled()
      expect(window.clearInterval).toHaveBeenCalled()
      expect(carousel._isPaused).toEqual(true)
    })

    it('should not set is paused at true if an event is passed', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const event = createEvent('mouseenter')

      spyOn(window, 'clearInterval')

      carousel.pause(event)

      expect(window.clearInterval).toHaveBeenCalled()
      expect(carousel._isPaused).toEqual(false)
    })
  })

  describe('cycle', () => {
    it('should set an interval', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      spyOn(window, 'setInterval').and.callThrough()

      carousel.cycle()

      expect(window.setInterval).toHaveBeenCalled()
    })

    it('should not set interval if the carousel is paused', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      spyOn(window, 'setInterval').and.callThrough()

      carousel._isPaused = true
      carousel.cycle(true)

      expect(window.setInterval).not.toHaveBeenCalled()
    })

    it('should clear interval if there is one', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      carousel._interval = setInterval(() => {}, 10)

      spyOn(window, 'setInterval').and.callThrough()
      spyOn(window, 'clearInterval').and.callThrough()

      carousel.cycle()

      expect(window.setInterval).toHaveBeenCalled()
      expect(window.clearInterval).toHaveBeenCalled()
    })

    it('should get interval from data attribute on the active item element', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active" data-bs-interval="7">item 1</div>',
        '    <div id="secondItem" class="carousel-item" data-bs-interval="9385">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const secondItemEl = fixtureEl.querySelector('#secondItem')
      const carousel = new Carousel(carouselEl, {
        interval: 1814
      })

      expect(carousel._config.interval).toEqual(1814)

      carousel.cycle()

      expect(carousel._config.interval).toEqual(7)

      carousel._activeElement = secondItemEl
      carousel.cycle()

      expect(carousel._config.interval).toEqual(9385)
    })
  })

  describe('to', () => {
    it('should go directly to the provided index', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div id="item1" class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div id="item3" class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      expect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item1'))

      carousel.to(2)

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item3'))
        done()
      })
    })

    it('should return to a previous slide if the provided index is lower than the current', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div id="item3" class="carousel-item active">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      expect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item3'))

      carousel.to(1)

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item2'))
        done()
      })
    })

    it('should do nothing if a wrong index is provided', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(carousel, '_slide')

      carousel.to(25)

      expect(spy).not.toHaveBeenCalled()

      spy.calls.reset()

      carousel.to(-5)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should call pause and cycle is the provided is the same compare to the current one', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      spyOn(carousel, '_slide')
      spyOn(carousel, 'pause')
      spyOn(carousel, 'cycle')

      carousel.to(0)

      expect(carousel._slide).not.toHaveBeenCalled()
      expect(carousel.pause).toHaveBeenCalled()
      expect(carousel.cycle).toHaveBeenCalled()
    })

    it('should wait before performing to if a slide is sliding', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      spyOn(EventHandler, 'one').and.callThrough()
      spyOn(carousel, '_slide')

      carousel._isSliding = true
      carousel.to(1)

      expect(carousel._slide).not.toHaveBeenCalled()
      expect(EventHandler.one).toHaveBeenCalled()

      spyOn(carousel, 'to')

      EventHandler.trigger(carouselEl, 'slid.bs.carousel')

      setTimeout(() => {
        expect(carousel.to).toHaveBeenCalledWith(1)
        done()
      })
    })
  })
  describe('rtl function', () => {
    it('"_directionToOrder" and "_orderToDirection" must return the right results', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      expect(carousel._directionToOrder('left')).toEqual('next')
      expect(carousel._directionToOrder('prev')).toEqual('prev')
      expect(carousel._directionToOrder('right')).toEqual('prev')
      expect(carousel._directionToOrder('next')).toEqual('next')

      expect(carousel._orderToDirection('next')).toEqual('left')
      expect(carousel._orderToDirection('prev')).toEqual('right')
    })

    it('"_directionToOrder" and "_orderToDirection" must return the right results when rtl=true', () => {
      document.documentElement.dir = 'rtl'
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})
      expect(util.isRTL()).toEqual(true, 'rtl has to be true')

      expect(carousel._directionToOrder('left')).toEqual('prev')
      expect(carousel._directionToOrder('prev')).toEqual('prev')
      expect(carousel._directionToOrder('right')).toEqual('next')
      expect(carousel._directionToOrder('next')).toEqual('next')

      expect(carousel._orderToDirection('next')).toEqual('right')
      expect(carousel._orderToDirection('prev')).toEqual('left')
      document.documentElement.dir = 'ltl'
    })

    it('"_slide" has to call _directionToOrder and "_orderToDirection"', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})
      const spy = spyOn(carousel, '_directionToOrder').and.callThrough()
      const spy2 = spyOn(carousel, '_orderToDirection').and.callThrough()

      carousel._slide('left')
      expect(spy).toHaveBeenCalledWith('left')
      expect(spy2).toHaveBeenCalledWith('next')

      carousel._slide('right')
      expect(spy).toHaveBeenCalledWith('right')
      expect(spy2).toHaveBeenCalledWith('prev')
    })

    it('"_slide" has to call "_directionToOrder" and "_orderToDirection" when rtl=true', () => {
      document.documentElement.dir = 'rtl'
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})
      const spy = spyOn(carousel, '_directionToOrder').and.callThrough()
      const spy2 = spyOn(carousel, '_orderToDirection').and.callThrough()

      carousel._slide('left')
      expect(spy).toHaveBeenCalledWith('left')
      expect(spy2).toHaveBeenCalledWith('prev')

      carousel._slide('right')
      expect(spy).toHaveBeenCalledWith('right')
      expect(spy2).toHaveBeenCalledWith('next')

      document.documentElement.dir = 'ltl'
    })
  })

  describe('dispose', () => {
    it('should destroy a carousel', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const addEventSpy = spyOn(carouselEl, 'addEventListener').and.callThrough()
      const removeEventSpy = spyOn(carouselEl, 'removeEventListener').and.callThrough()

      // Headless browser does not support touch events, so need to fake it
      // to test that touch events are add/removed properly.
      document.documentElement.ontouchstart = () => {}

      const carousel = new Carousel(carouselEl)

      const expectedArgs = [
        ['keydown', jasmine.any(Function), jasmine.any(Boolean)],
        ['mouseover', jasmine.any(Function), jasmine.any(Boolean)],
        ['mouseout', jasmine.any(Function), jasmine.any(Boolean)],
        ...(carousel._pointerEvent ?
          [
            ['pointerdown', jasmine.any(Function), jasmine.any(Boolean)],
            ['pointerup', jasmine.any(Function), jasmine.any(Boolean)]
          ] :
          [
            ['touchstart', jasmine.any(Function), jasmine.any(Boolean)],
            ['touchmove', jasmine.any(Function), jasmine.any(Boolean)],
            ['touchend', jasmine.any(Function), jasmine.any(Boolean)]
          ])
      ]

      expect(addEventSpy.calls.allArgs()).toEqual(expectedArgs)

      carousel.dispose()

      expect(removeEventSpy.calls.allArgs()).toEqual(expectedArgs)

      delete document.documentElement.ontouchstart
    })
  })

  describe('getInstance', () => {
    it('should return carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      expect(Carousel.getInstance(div)).toEqual(carousel)
      expect(Carousel.getInstance(div)).toBeInstanceOf(Carousel)
    })

    it('should return null when there is no carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Carousel.getInstance(div)).toEqual(null)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      expect(Carousel.getOrCreateInstance(div)).toEqual(carousel)
      expect(Carousel.getInstance(div)).toEqual(Carousel.getOrCreateInstance(div, {}))
      expect(Carousel.getOrCreateInstance(div)).toBeInstanceOf(Carousel)
    })

    it('should return new instance when there is no carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Carousel.getInstance(div)).toEqual(null)
      expect(Carousel.getOrCreateInstance(div)).toBeInstanceOf(Carousel)
    })

    it('should return new instance when there is no carousel instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Carousel.getInstance(div)).toEqual(null)
      const carousel = Carousel.getOrCreateInstance(div, {
        interval: 1
      })
      expect(carousel).toBeInstanceOf(Carousel)

      expect(carousel._config.interval).toEqual(1)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div, {
        interval: 1
      })
      expect(Carousel.getInstance(div)).toEqual(carousel)

      const carousel2 = Carousel.getOrCreateInstance(div, {
        interval: 2
      })
      expect(carousel).toBeInstanceOf(Carousel)
      expect(carousel2).toEqual(carousel)

      expect(carousel2._config.interval).toEqual(1)
    })
  })

  describe('jQueryInterface', () => {
    it('should create a carousel', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock)

      expect(Carousel.getInstance(div)).not.toBeNull()
    })

    it('should not re create a carousel', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock)

      expect(Carousel.getInstance(div)).toEqual(carousel)
    })

    it('should call to if the config is a number', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)
      const slideTo = 2

      spyOn(carousel, 'to')

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock, slideTo)

      expect(carousel.to).toHaveBeenCalledWith(slideTo)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.carousel.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('data-api', () => {
    it('should init carousels with data-bs-ride="carousel" on load', () => {
      fixtureEl.innerHTML = '<div data-bs-ride="carousel"></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const loadEvent = createEvent('load')

      window.dispatchEvent(loadEvent)

      expect(Carousel.getInstance(carouselEl)).not.toBeNull()
    })

    it('should create carousel and go to the next slide on click (with real button controls)', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" data-bs-target="#myCarousel" type="button" data-bs-slide="prev"></button>',
        '  <button id="next" class="carousel-control-next" data-bs-target="#myCarousel" type="button" data-bs-slide="next"></div>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')
      const item2 = fixtureEl.querySelector('#item2')

      next.click()

      setTimeout(() => {
        expect(item2.classList.contains('active')).toEqual(true)
        done()
      }, 10)
    })

    it('should create carousel and go to the next slide on click (using links as controls)', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <a class="carousel-control-prev" href="#myCarousel" role="button" data-bs-slide="prev"></button>',
        '  <a id="next" class="carousel-control-next" href="#myCarousel" role="button" data-bs-slide="next"></div>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')
      const item2 = fixtureEl.querySelector('#item2')

      next.click()

      setTimeout(() => {
        expect(item2.classList.contains('active')).toEqual(true)
        done()
      }, 10)
    })

    it('should create carousel and go to the next slide on click with data-bs-slide-to', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div id="next" data-bs-target="#myCarousel" data-bs-slide-to="1"></div>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')
      const item2 = fixtureEl.querySelector('#item2')

      next.click()

      setTimeout(() => {
        expect(item2.classList.contains('active')).toEqual(true)
        done()
      }, 10)
    })

    it('should do nothing if no selector on click on arrows', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" data-bs-target="#myCarousel" type="button" data-bs-slide="prev"></button>',
        '  <button id="next" class="carousel-control-next" type="button" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')

      next.click()

      expect().nothing()
    })

    it('should do nothing if no carousel class on click on arrows', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" data-bs-target="#myCarousel" type="button" data-bs-slide="prev"></div>',
        '  <button id="next" class="carousel-control-next" data-bs-target="#myCarousel" type="button" data-bs-slide="next"></div>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')

      next.click()

      expect().nothing()
    })
  })
})
