import OffCanvas from '../../src/offcanvas'
import EventHandler from '../../src/dom/event-handler'

/** Test helpers */
import { clearFixture, getFixture, jQueryMock, createEvent } from '../helpers/fixture'

describe('OffCanvas', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    document.body.classList.remove('offcanvas-open')
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(OffCanvas.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('constructor', () => {
    it('should call hide when a element with data-dismiss="offcanvas" is clicked', () => {
      fixtureEl.innerHTML = [
        '<div class="offcanvas">',
        '  <a href="#" data-dismiss="offcanvas">Close</a>',
        '</div>'
      ].join('')

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const closeEl = fixtureEl.querySelector('a')
      const offCanvas = new OffCanvas(offCanvasEl)

      spyOn(offCanvas, 'hide')

      closeEl.click()

      expect(offCanvas.hide).toHaveBeenCalled()
    })

    it('should hide if esc is pressed', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new OffCanvas(offCanvasEl)
      const keyDownEsc = createEvent('keydown')
      keyDownEsc.which = 27

      spyOn(offCanvas, 'hide')

      document.dispatchEvent(keyDownEsc)

      expect(offCanvas.hide).toHaveBeenCalled()
    })

    it('should not hide if esc is not pressed', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new OffCanvas(offCanvasEl)
      const keyDownEsc = createEvent('keydown')
      keyDownEsc.which = 9

      spyOn(offCanvas, 'hide')

      document.dispatchEvent(keyDownEsc)

      expect(offCanvas.hide).not.toHaveBeenCalled()
    })
  })

  describe('toggle', () => {
    it('should call show method if show class is not present', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new OffCanvas(offCanvasEl)

      spyOn(offCanvas, 'show')

      offCanvas.toggle()

      expect(offCanvas.show).toHaveBeenCalled()
    })

    it('should call hide method if show class is present', () => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      const offCanvasEl = fixtureEl.querySelector('.show')
      const offCanvas = new OffCanvas(offCanvasEl)

      spyOn(offCanvas, 'hide')

      offCanvas.toggle()

      expect(offCanvas.hide).toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      spyOn(EventHandler, 'trigger')

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(offCanvasEl)

      offCanvas.show()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should show a hidden element', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(offCanvasEl)

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        expect(offCanvasEl.classList.contains('show')).toEqual(true)
        done()
      })

      offCanvas.show()
    })

    it('should not fire shown when show is prevented', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(offCanvasEl)

      const expectEnd = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 10)
      }

      offCanvasEl.addEventListener('show.bs.offcanvas', e => {
        e.preventDefault()
        expectEnd()
      })

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        throw new Error('should not fire shown event')
      })

      offCanvas.show()
    })
  })

  describe('hide', () => {
    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      spyOn(EventHandler, 'trigger')

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(offCanvasEl)

      offCanvas.hide()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should hide a shown element', done => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(offCanvasEl)

      offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        expect(offCanvasEl.classList.contains('show')).toEqual(false)
        done()
      })

      offCanvas.hide()
    })

    it('should not fire hidden when hide is prevented', done => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(offCanvasEl)

      const expectEnd = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 10)
      }

      offCanvasEl.addEventListener('hide.bs.offcanvas', e => {
        e.preventDefault()
        expectEnd()
      })

      offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        throw new Error('should not fire hidden event')
      })

      offCanvas.hide()
    })
  })

  describe('data-api', () => {
    it('should not prevent event for input', done => {
      fixtureEl.innerHTML = [
        '<input type="checkbox" data-toggle="offcanvas" data-target="#offcanvasdiv1" />',
        '<div id="offcanvasdiv1" class="offcanvas"></div>'
      ].join('')

      const target = fixtureEl.querySelector('input')
      const offCanvasEl = fixtureEl.querySelector('#offcanvasdiv1')

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        expect(offCanvasEl.classList.contains('show')).toEqual(true)
        expect(target.checked).toEqual(true)
        done()
      })

      target.click()
    })

    it('should not call toggle on disabled elements', () => {
      fixtureEl.innerHTML = [
        '<a href="#" data-toggle="offcanvas" data-target="#offcanvasdiv1" class="disabled"></a>',
        '<div id="offcanvasdiv1" class="offcanvas"></div>'
      ].join('')

      const target = fixtureEl.querySelector('a')

      spyOn(OffCanvas.prototype, 'toggle')

      target.click()

      expect(OffCanvas.prototype.toggle).not.toHaveBeenCalled()
    })
  })

  describe('jQueryInterface', () => {
    it('should create an offcanvas', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.offcanvas = OffCanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock)

      expect(OffCanvas.getInstance(div)).toBeDefined()
    })

    it('should not re create an offcanvas', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(div)

      jQueryMock.fn.offcanvas = OffCanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock)

      expect(OffCanvas.getInstance(div)).toEqual(offCanvas)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.offcanvas = OffCanvas.jQueryInterface
      jQueryMock.elements = [div]

      try {
        jQueryMock.fn.offcanvas.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
    })

    it('should call offcanvas method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(div)

      spyOn(offCanvas, 'show')

      jQueryMock.fn.offcanvas = OffCanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock, 'show')
      expect(offCanvas.show).toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return offcanvas instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offCanvas = new OffCanvas(div)

      expect(OffCanvas.getInstance(div)).toEqual(offCanvas)
    })

    it('should return null when there is no offcanvas instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(OffCanvas.getInstance(div)).toEqual(null)
    })
  })
})
