import Carousel from './carousel'
import EventHandler from '../dom/event-handler'

/** Test helpers */
import { getFixture, clearFixture, createEvent, jQueryMock } from '../../tests/helpers/fixture'

describe('Carousel', () => {
  const { Simulator, PointerEvent, MSPointerEvent } = window
  const originWinPointerEvent = PointerEvent || MSPointerEvent
  const supportPointerEvent = Boolean(PointerEvent || MSPointerEvent)

  window.MSPointerEvent = null
  const cssStyleCarousel = '.carousel.pointer-event { -ms-touch-action: none; touch-action: none; }'

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

  describe('constructor', () => {
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

      const keyDown = createEvent('keydown')
      keyDown.which = 39

      carouselEl.dispatchEvent(keyDown)
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

      const keyDown = createEvent('keydown')
      keyDown.which = 37

      carouselEl.dispatchEvent(keyDown)
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

      const keyDown = createEvent('keydown')
      keyDown.which = 40

      carouselEl.dispatchEvent(keyDown)
    })

    it('should ignore keyboard events within <input>s and <textarea>s', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">',
        '      <input type="text" />',
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

      const spyKeyDown = spyOn(carousel, '_keydown').and.callThrough()
      const spyPrev = spyOn(carousel, 'prev')
      const spyNext = spyOn(carousel, 'next')

      const keyDown = createEvent('keydown', { bubbles: true, cancelable: true })
      keyDown.which = 39
      Object.defineProperty(keyDown, 'target', {
        value: input,
        writable: true,
        configurable: true
      })

      input.dispatchEvent(keyDown)

      expect(spyKeyDown).toHaveBeenCalled()
      expect(spyPrev).not.toHaveBeenCalled()
      expect(spyNext).not.toHaveBeenCalled()

      spyKeyDown.calls.reset()
      spyPrev.calls.reset()
      spyNext.calls.reset()

      Object.defineProperty(keyDown, 'target', {
        value: textarea
      })
      textarea.dispatchEvent(keyDown)

      expect(spyKeyDown).toHaveBeenCalled()
      expect(spyPrev).not.toHaveBeenCalled()
      expect(spyNext).not.toHaveBeenCalled()
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

      document.documentElement.ontouchstart = () => {}
      const carousel = new Carousel(carouselEl)

      expect(carousel._addTouchEventListeners).toHaveBeenCalled()
    })

    it('should allow swiperight and call prev with pointer events', done => {
      if (!supportPointerEvent) {
        expect().nothing()
        done()
        return
      }

      document.documentElement.ontouchstart = () => {}
      document.head.appendChild(stylesCarousel)
      Simulator.setType('pointer')

      fixtureEl.innerHTML = [
        '<div class="carousel" data-interval="false">',
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

      spyOn(carousel, 'prev').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(item.classList.contains('active')).toEqual(true)
        expect(carousel.prev).toHaveBeenCalled()
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
        '<div class="carousel" data-interval="false">',
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

      spyOn(carousel, 'next').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(item.classList.contains('active')).toEqual(false)
        expect(carousel.next).toHaveBeenCalled()
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

    it('should allow swiperight and call prev with touch events', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = [
        '<div class="carousel" data-interval="false">',
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

      spyOn(carousel, 'prev').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(item.classList.contains('active')).toEqual(true)
        expect(carousel.prev).toHaveBeenCalled()
        delete document.documentElement.ontouchstart
        restorePointerEvents()
        done()
      })

      Simulator.gestures.swipe(carouselEl, {
        deltaX: 300,
        deltaY: 0
      })
    })

    it('should allow swipeleft and call next with touch events', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = [
        '<div class="carousel" data-interval="false">',
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

      spyOn(carousel, 'next').and.callThrough()

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(item.classList.contains('active')).toEqual(false)
        expect(carousel.next).toHaveBeenCalled()
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

    it('should not allow pinch with touch events', done => {
      Simulator.setType('touch')
      clearPointerEvents()
      document.documentElement.ontouchstart = () => {}

      fixtureEl.innerHTML = '<div class="carousel" data-interval="false"></div>'

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

      spyOn(carousel, '_slide')

      carousel._isSliding = true
      carousel.next()

      expect(carousel._slide).not.toHaveBeenCalled()
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

    it('should get interval from data attribute in individual item', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {
        interval: 1814
      })

      expect(carousel._config.interval).toEqual(1814)

      carousel.next()

      expect(carousel._config.interval).toEqual(7)
    })

    it('should update indicators if present', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <ol class="carousel-indicators">',
        '    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>',
        '    <li id="secondIndicator" data-target="#myCarousel" data-slide-to="1"></li>',
        '    <li data-target="#myCarousel" data-slide-to="2"></li>',
        '  </ol>',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const secondIndicator = fixtureEl.querySelector('#secondIndicator')
      const carousel = new Carousel(carouselEl)

      carouselEl.addEventListener('slid.bs.carousel', () => {
        expect(secondIndicator.classList.contains('active')).toEqual(true)
        done()
      })

      carousel.next()
    })
  })

  describe('nextWhenVisible', () => {
    it('should not call next when the page is not visible', () => {
      fixtureEl.innerHTML = '<div class="carousel" data-interval="false"></div>'

      const carouselEl = fixtureEl.querySelector('div')
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

      spyOn(carousel, '_slide')

      carousel._isSliding = true
      carousel.prev()

      expect(carousel._slide).not.toHaveBeenCalled()
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
  })

  describe('to', () => {
    it('should go directement to the provided index', done => {
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
        '    <div class="carousel-item" data-interval="7">item 2</div>',
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
        '    <div class="carousel-item" data-interval="7">item 2</div>',
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
        '    <div class="carousel-item" data-interval="7">item 2</div>',
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

  describe('dispose', () => {
    it('should destroy a carousel', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      spyOn(EventHandler, 'off').and.callThrough()

      carousel.dispose()

      expect(EventHandler.off).toHaveBeenCalled()
    })
  })

  describe('_jQueryInterface', () => {
    it('should create a carousel', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.carousel = Carousel._jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock)

      expect(Carousel._getInstance(div)).toBeDefined()
    })

    it('should not re create a carousel', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      jQueryMock.fn.carousel = Carousel._jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock)

      expect(Carousel._getInstance(div)).toEqual(carousel)
    })

    it('should call to if the config is a number', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)
      const slideTo = 2

      spyOn(carousel, 'to')

      jQueryMock.fn.carousel = Carousel._jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock, slideTo)

      expect(carousel.to).toHaveBeenCalledWith(slideTo)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.carousel = Carousel._jQueryInterface
      jQueryMock.elements = [div]

      try {
        jQueryMock.fn.carousel.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
    })
  })

  describe('data-api', () => {
    it('should init carousels with data-ride="carousel" on load', () => {
      fixtureEl.innerHTML = '<div data-ride="carousel"></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const loadEvent = createEvent('load')

      window.dispatchEvent(loadEvent)

      expect(Carousel._getInstance(carouselEl)).toBeDefined()
    })

    it('should create carousel and go to the next slide on click', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev" data-target="#myCarousel" role="button" data-slide="prev"></div>',
        '  <div id="next" class="carousel-control-next" data-target="#myCarousel" role="button" data-slide="next"></div>',
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

    it('should create carousel and go to the next slide on click with data-slide-to', done => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div id="next" data-target="#myCarousel" data-slide-to="1"></div>',
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
        '  <div class="carousel-control-prev" data-target="#myCarousel" role="button" data-slide="prev"></div>',
        '  <div id="next" class="carousel-control-next" role="button" data-slide="next"></div>',
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
        '  <div class="carousel-control-prev" data-target="#myCarousel" role="button" data-slide="prev"></div>',
        '  <div id="next" class="carousel-control-next" data-target="#myCarousel" role="button" data-slide="next"></div>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')

      next.click()

      expect().nothing()
    })
  })
})
