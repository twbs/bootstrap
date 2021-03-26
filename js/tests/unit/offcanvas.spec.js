import Offcanvas from '../../src/offcanvas'
import EventHandler from '../../src/dom/event-handler'

/** Test helpers */
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'

describe('Offcanvas', () => {
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
      expect(Offcanvas.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Offcanvas.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Offcanvas.DATA_KEY).toEqual('bs.offcanvas')
    })
  })

  describe('constructor', () => {
    it('should call hide when a element with data-bs-dismiss="offcanvas" is clicked', () => {
      fixtureEl.innerHTML = [
        '<div class="offcanvas">',
        '  <a href="#" data-bs-dismiss="offcanvas">Close</a>',
        '</div>'
      ].join('')

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const closeEl = fixtureEl.querySelector('a')
      const offCanvas = new Offcanvas(offCanvasEl)

      spyOn(offCanvas, 'hide')

      closeEl.click()

      expect(offCanvas.hide).toHaveBeenCalled()
    })

    it('should hide if esc is pressed', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)
      const keyDownEsc = createEvent('keydown')
      keyDownEsc.key = 'Escape'

      spyOn(offCanvas, 'hide')

      document.dispatchEvent(keyDownEsc)

      expect(offCanvas.hide).toHaveBeenCalled()
    })

    it('should not hide if esc is not pressed', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)
      const keydownTab = createEvent('keydown')
      keydownTab.key = 'Tab'

      spyOn(offCanvas, 'hide')

      document.dispatchEvent(keydownTab)

      expect(offCanvas.hide).not.toHaveBeenCalled()
    })

    it('should not hide if esc is pressed but with keyboard = false', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl, { keyboard: false })
      const keyDownEsc = createEvent('keydown')
      keyDownEsc.key = 'Escape'

      spyOn(offCanvas, 'hide')

      document.dispatchEvent(keyDownEsc)

      expect(offCanvas.hide).not.toHaveBeenCalled()
    })
  })

  describe('config', () => {
    it('should have default values', () => {
      fixtureEl.innerHTML = [
        '<div class="offcanvas">',
        '</div>'
      ].join('')

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)

      expect(offCanvas._config.backdrop).toEqual(true)
      expect(offCanvas._config.keyboard).toEqual(true)
      expect(offCanvas._config.scroll).toEqual(false)
    })

    it('should read data attributes and override default config', () => {
      fixtureEl.innerHTML = [
        '<div class="offcanvas" data-bs-scroll="true" data-bs-backdrop="false"  data-bs-keyboard="false">',
        '</div>'
      ].join('')

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)

      expect(offCanvas._config.backdrop).toEqual(false)
      expect(offCanvas._config.keyboard).toEqual(false)
      expect(offCanvas._config.scroll).toEqual(true)
    })

    it('given a config object must override data attributes', () => {
      fixtureEl.innerHTML = [
        '<div class="offcanvas" data-bs-scroll="true" data-bs-backdrop="false"  data-bs-keyboard="false">',
        '</div>'
      ].join('')

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl, {
        backdrop: true,
        keyboard: true,
        scroll: false
      })
      expect(offCanvas._config.backdrop).toEqual(true)
      expect(offCanvas._config.keyboard).toEqual(true)
      expect(offCanvas._config.scroll).toEqual(false)
    })
  })
  describe('options', () => {
    it('if scroll is enabled, should allow body to scroll while offcanvas is open', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl, { scroll: true })
      const initialOverFlow = document.body.style.overflow

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        expect(document.body.style.overflow).toEqual(initialOverFlow)

        offCanvas.hide()
      })
      offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        expect(document.body.style.overflow).toEqual(initialOverFlow)
        done()
      })
      offCanvas.show()
    })

    it('if scroll is disabled, should not allow body to scroll while offcanvas is open', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl, { scroll: false })

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        expect(document.body.style.overflow).toEqual('hidden')

        offCanvas.hide()
      })
      offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        expect(document.body.style.overflow).toEqual('auto')
        done()
      })
      offCanvas.show()
    })
  })

  describe('toggle', () => {
    it('should call show method if show class is not present', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)

      spyOn(offCanvas, 'show')

      offCanvas.toggle()

      expect(offCanvas.show).toHaveBeenCalled()
    })

    it('should call hide method if show class is present', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)
      offCanvas.show()
      expect(offCanvasEl.classList.contains('show')).toBe(true)

      spyOn(offCanvas, 'hide')

      offCanvas.toggle()

      expect(offCanvas.hide).toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)

      offCanvas.show()
      expect(offCanvasEl.classList.contains('show')).toBe(true)

      spyOn(EventHandler, 'trigger').and.callThrough()
      offCanvas.show()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should show a hidden element', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        expect(offCanvasEl.classList.contains('show')).toEqual(true)
        done()
      })

      offCanvas.show()
    })

    it('should not fire shown when show is prevented', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)

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

    it('on window load, should make visible an offcanvas element, if its markup contains class "show"', done => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      spyOn(Offcanvas.prototype, 'show').and.callThrough()

      offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
        done()
      })

      window.dispatchEvent(createEvent('load'))

      const instance = Offcanvas.getInstance(offCanvasEl)
      expect(instance).not.toBeNull()
      expect(Offcanvas.prototype.show).toHaveBeenCalled()
    })
  })

  describe('hide', () => {
    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      spyOn(EventHandler, 'trigger').and.callThrough()

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)

      offCanvas.hide()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should hide a shown element', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)
      offCanvas.show()

      offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        expect(offCanvasEl.classList.contains('show')).toEqual(false)
        done()
      })

      offCanvas.hide()
    })

    it('should not fire hidden when hide is prevented', done => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)
      offCanvas.show()

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
        '<input type="checkbox" data-bs-toggle="offcanvas" data-bs-target="#offcanvasdiv1" />',
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
        '<a href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasdiv1" class="disabled"></a>',
        '<div id="offcanvasdiv1" class="offcanvas"></div>'
      ].join('')

      const target = fixtureEl.querySelector('a')

      spyOn(Offcanvas.prototype, 'toggle')

      target.click()

      expect(Offcanvas.prototype.toggle).not.toHaveBeenCalled()
    })

    it('should not call toggle if another offcanvas is open', done => {
      fixtureEl.innerHTML = [
        '<button id="btn2" data-bs-toggle="offcanvas" data-bs-target="#offcanvas2" ></button>',
        '<div id="offcanvas1" class="offcanvas"></div>',
        '<div id="offcanvas2" class="offcanvas"></div>'
      ].join('')

      const trigger2 = fixtureEl.querySelector('#btn2')
      const offcanvasEl1 = document.querySelector('#offcanvas1')
      const offcanvasEl2 = document.querySelector('#offcanvas2')
      const offcanvas1 = new Offcanvas(offcanvasEl1)

      offcanvasEl1.addEventListener('shown.bs.offcanvas', () => {
        trigger2.click()
      })
      offcanvasEl1.addEventListener('hidden.bs.offcanvas', () => {
        expect(Offcanvas.getInstance(offcanvasEl2)).toEqual(null)
        done()
      })
      offcanvas1.show()
    })

    it('should focus on trigger element after closing offcanvas', done => {
      fixtureEl.innerHTML = [
        '<button id="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" ></button>',
        '<div id="offcanvas" class="offcanvas"></div>'
      ].join('')

      const trigger = fixtureEl.querySelector('#btn')
      const offcanvasEl = fixtureEl.querySelector('#offcanvas')
      const offcanvas = new Offcanvas(offcanvasEl)
      spyOn(trigger, 'focus')

      offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
        offcanvas.hide()
      })
      offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        setTimeout(() => {
          expect(trigger.focus).toHaveBeenCalled()
          done()
        }, 5)
      })

      trigger.click()
    })
  })

  describe('jQueryInterface', () => {
    it('should create an offcanvas', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock)

      expect(Offcanvas.getInstance(div)).toBeDefined()
    })

    it('should not re create an offcanvas', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(div)

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock)

      expect(Offcanvas.getInstance(div)).toEqual(offCanvas)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.offcanvas.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error on protected method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = '_getConfig'

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.offcanvas.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error if method "constructor" is being called', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'constructor'

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.offcanvas.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error on protected method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = '_getConfig'

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      try {
        jQueryMock.fn.offcanvas.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
    })

    it('should throw error if method "constructor" is being called', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'constructor'

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
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

      spyOn(Offcanvas.prototype, 'show')

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock, 'show')
      expect(Offcanvas.prototype.show).toHaveBeenCalled()
    })

    it('should create a offcanvas with given config', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock, { scroll: true })
      spyOn(Offcanvas.prototype, 'constructor')
      expect(Offcanvas.prototype.constructor).not.toHaveBeenCalledWith(div, { scroll: true })

      const offcanvas = Offcanvas.getInstance(div)
      expect(offcanvas).toBeDefined()
      expect(offcanvas._config.scroll).toBe(true)
    })
  })

  describe('getInstance', () => {
    it('should return offcanvas instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(div)

      expect(Offcanvas.getInstance(div)).toEqual(offCanvas)
      expect(Offcanvas.getInstance(div)).toBeInstanceOf(Offcanvas)
    })

    it('should return null when there is no offcanvas instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Offcanvas.getInstance(div)).toEqual(null)
    })
  })
})
