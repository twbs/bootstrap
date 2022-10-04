import Offcanvas from '../../src/offcanvas'
import EventHandler from '../../src/dom/event-handler'
import { clearBodyAndDocument, clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'
import { isVisible } from '../../src/util/index'
import ScrollBarHelper from '../../src/util/scrollbar'

describe('Offcanvas', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    document.body.classList.remove('offcanvas-open')
    clearBodyAndDocument()
  })

  beforeEach(() => {
    clearBodyAndDocument()
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

      const spy = spyOn(offCanvas, 'hide')

      closeEl.click()

      expect(offCanvas._config.keyboard).toBeTrue()
      expect(spy).toHaveBeenCalled()
    })

    it('should hide if esc is pressed', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)
      const keyDownEsc = createEvent('keydown')
      keyDownEsc.key = 'Escape'

      const spy = spyOn(offCanvas, 'hide')

      offCanvasEl.dispatchEvent(keyDownEsc)

      expect(spy).toHaveBeenCalled()
    })

    it('should hide if esc is pressed and backdrop is static', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl, { backdrop: 'static' })
      const keyDownEsc = createEvent('keydown')
      keyDownEsc.key = 'Escape'

      const spy = spyOn(offCanvas, 'hide')

      offCanvasEl.dispatchEvent(keyDownEsc)

      expect(spy).toHaveBeenCalled()
    })

    it('should not hide if esc is not pressed', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)
      const keydownTab = createEvent('keydown')
      keydownTab.key = 'Tab'

      const spy = spyOn(offCanvas, 'hide')

      offCanvasEl.dispatchEvent(keydownTab)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not hide if esc is pressed but with keyboard = false', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl, { keyboard: false })
        const keyDownEsc = createEvent('keydown')
        keyDownEsc.key = 'Escape'

        const spy = spyOn(offCanvas, 'hide')
        const hidePreventedSpy = jasmine.createSpy('hidePrevented')
        offCanvasEl.addEventListener('hidePrevented.bs.offcanvas', hidePreventedSpy)

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(offCanvas._config.keyboard).toBeFalse()
          offCanvasEl.dispatchEvent(keyDownEsc)

          expect(hidePreventedSpy).toHaveBeenCalled()
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })

    it('should not hide if user clicks on static backdrop', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl, { backdrop: 'static' })

        const clickEvent = new Event('mousedown', { bubbles: true, cancelable: true })
        const spyClick = spyOn(offCanvas._backdrop._config, 'clickCallback').and.callThrough()
        const spyHide = spyOn(offCanvas._backdrop, 'hide').and.callThrough()
        const hidePreventedSpy = jasmine.createSpy('hidePrevented')
        offCanvasEl.addEventListener('hidePrevented.bs.offcanvas', hidePreventedSpy)

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(spyClick).toEqual(jasmine.any(Function))

          offCanvas._backdrop._getElement().dispatchEvent(clickEvent)
          expect(hidePreventedSpy).toHaveBeenCalled()
          expect(spyHide).not.toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })

    it('should call `hide` on resize, if element\'s position is not fixed any more', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas-lg"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl)

        const spy = spyOn(offCanvas, 'hide').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          const resizeEvent = createEvent('resize')
          offCanvasEl.style.removeProperty('position')

          window.dispatchEvent(resizeEvent)
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })
  })

  describe('config', () => {
    it('should have default values', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)

      expect(offCanvas._config.backdrop).toBeTrue()
      expect(offCanvas._backdrop._config.isVisible).toBeTrue()
      expect(offCanvas._config.keyboard).toBeTrue()
      expect(offCanvas._config.scroll).toBeFalse()
    })

    it('should read data attributes and override default config', () => {
      fixtureEl.innerHTML = '<div class="offcanvas" data-bs-scroll="true" data-bs-backdrop="false" data-bs-keyboard="false"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)

      expect(offCanvas._config.backdrop).toBeFalse()
      expect(offCanvas._backdrop._config.isVisible).toBeFalse()
      expect(offCanvas._config.keyboard).toBeFalse()
      expect(offCanvas._config.scroll).toBeTrue()
    })

    it('given a config object must override data attributes', () => {
      fixtureEl.innerHTML = '<div class="offcanvas" data-bs-scroll="true" data-bs-backdrop="false" data-bs-keyboard="false"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl, {
        backdrop: true,
        keyboard: true,
        scroll: false
      })
      expect(offCanvas._config.backdrop).toBeTrue()
      expect(offCanvas._config.keyboard).toBeTrue()
      expect(offCanvas._config.scroll).toBeFalse()
    })
  })

  describe('options', () => {
    it('if scroll is enabled, should allow body to scroll while offcanvas is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const spyHide = spyOn(ScrollBarHelper.prototype, 'hide').and.callThrough()
        const spyReset = spyOn(ScrollBarHelper.prototype, 'reset').and.callThrough()
        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl, { scroll: true })

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(spyHide).not.toHaveBeenCalled()
          offCanvas.hide()
        })
        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          expect(spyReset).not.toHaveBeenCalled()
          resolve()
        })
        offCanvas.show()
      })
    })

    it('if scroll is disabled, should call ScrollBarHelper to handle scrollBar on body', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const spyHide = spyOn(ScrollBarHelper.prototype, 'hide').and.callThrough()
        const spyReset = spyOn(ScrollBarHelper.prototype, 'reset').and.callThrough()
        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl, { scroll: false })

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(spyHide).toHaveBeenCalled()
          offCanvas.hide()
        })
        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          expect(spyReset).toHaveBeenCalled()
          resolve()
        })
        offCanvas.show()
      })
    })

    it('should hide a shown element if user click on backdrop', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl, { backdrop: true })

        const clickEvent = new Event('mousedown', { bubbles: true, cancelable: true })
        const spy = spyOn(offCanvas._backdrop._config, 'clickCallback').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(offCanvas._backdrop._config.clickCallback).toEqual(jasmine.any(Function))

          offCanvas._backdrop._getElement().dispatchEvent(clickEvent)
        })

        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })

    it('should not trap focus if scroll is allowed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl, {
          scroll: true,
          backdrop: false
        })

        const spy = spyOn(offCanvas._focustrap, 'activate').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })

    it('should trap focus if scroll is allowed OR backdrop is enabled', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl, {
          scroll: true,
          backdrop: true
        })

        const spy = spyOn(offCanvas._focustrap, 'activate').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })
  })

  describe('toggle', () => {
    it('should call show method if show class is not present', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('.offcanvas')
      const offCanvas = new Offcanvas(offCanvasEl)

      const spy = spyOn(offCanvas, 'show')

      offCanvas.toggle()

      expect(spy).toHaveBeenCalled()
    })

    it('should call hide method if show class is present', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl)

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(offCanvasEl).toHaveClass('show')
          const spy = spyOn(offCanvas, 'hide')

          offCanvas.toggle()

          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })
  })

  describe('show', () => {
    it('should add `showing` class during opening and `show` class on end', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'
        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl)

        offCanvasEl.addEventListener('show.bs.offcanvas', () => {
          expect(offCanvasEl).not.toHaveClass('show')
        })

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(offCanvasEl).not.toHaveClass('showing')
          expect(offCanvasEl).toHaveClass('show')
          resolve()
        })

        offCanvas.show()
        expect(offCanvasEl).toHaveClass('showing')
      })
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)
      offCanvas.show()

      expect(offCanvasEl).toHaveClass('show')

      const spyShow = spyOn(offCanvas._backdrop, 'show').and.callThrough()
      const spyTrigger = spyOn(EventHandler, 'trigger').and.callThrough()
      offCanvas.show()

      expect(spyTrigger).not.toHaveBeenCalled()
      expect(spyShow).not.toHaveBeenCalled()
    })

    it('should show a hidden element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl)
        const spy = spyOn(offCanvas._backdrop, 'show').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(offCanvasEl).toHaveClass('show')
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })

    it('should not fire shown when show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl)
        const spy = spyOn(offCanvas._backdrop, 'show').and.callThrough()

        const expectEnd = () => {
          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        }

        offCanvasEl.addEventListener('show.bs.offcanvas', event => {
          event.preventDefault()
          expectEnd()
        })

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          reject(new Error('should not fire shown event'))
        })

        offCanvas.show()
      })
    })

    it('on window load, should make visible an offcanvas element, if its markup contains class "show"', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas show"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const spy = spyOn(Offcanvas.prototype, 'show').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          resolve()
        })

        window.dispatchEvent(createEvent('load'))

        const instance = Offcanvas.getInstance(offCanvasEl)
        expect(instance).not.toBeNull()
        expect(spy).toHaveBeenCalled()
      })
    })

    it('should trap focus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl)

        const spy = spyOn(offCanvas._focustrap, 'activate').and.callThrough()

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.show()
      })
    })
  })

  describe('hide', () => {
    it('should add `hiding` class during closing and remover `show` & `hiding` classes on end', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'
        const offCanvasEl = fixtureEl.querySelector('.offcanvas')
        const offCanvas = new Offcanvas(offCanvasEl)

        offCanvasEl.addEventListener('hide.bs.offcanvas', () => {
          expect(offCanvasEl).not.toHaveClass('showing')
          expect(offCanvasEl).toHaveClass('show')
        })

        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          expect(offCanvasEl).not.toHaveClass('hiding')
          expect(offCanvasEl).not.toHaveClass('show')
          resolve()
        })

        offCanvas.show()
        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          offCanvas.hide()
          expect(offCanvasEl).not.toHaveClass('showing')
          expect(offCanvasEl).toHaveClass('hiding')
        })
      })
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const spyTrigger = spyOn(EventHandler, 'trigger').and.callThrough()

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)
      const spyHide = spyOn(offCanvas._backdrop, 'hide').and.callThrough()

      offCanvas.hide()
      expect(spyHide).not.toHaveBeenCalled()
      expect(spyTrigger).not.toHaveBeenCalled()
    })

    it('should hide a shown element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl)
        const spy = spyOn(offCanvas._backdrop, 'hide').and.callThrough()
        offCanvas.show()

        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          expect(offCanvasEl).not.toHaveClass('show')
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.hide()
      })
    })

    it('should not fire hidden when hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl)
        const spy = spyOn(offCanvas._backdrop, 'hide').and.callThrough()

        offCanvas.show()

        const expectEnd = () => {
          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        }

        offCanvasEl.addEventListener('hide.bs.offcanvas', event => {
          event.preventDefault()
          expectEnd()
        })

        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          reject(new Error('should not fire hidden event'))
        })

        offCanvas.hide()
      })
    })

    it('should release focus trap', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="offcanvas"></div>'

        const offCanvasEl = fixtureEl.querySelector('div')
        const offCanvas = new Offcanvas(offCanvasEl)
        const spy = spyOn(offCanvas._focustrap, 'deactivate').and.callThrough()
        offCanvas.show()

        offCanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        offCanvas.hide()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose an offcanvas', () => {
      fixtureEl.innerHTML = '<div class="offcanvas"></div>'

      const offCanvasEl = fixtureEl.querySelector('div')
      const offCanvas = new Offcanvas(offCanvasEl)
      const backdrop = offCanvas._backdrop
      const spyDispose = spyOn(backdrop, 'dispose').and.callThrough()
      const focustrap = offCanvas._focustrap
      const spyDeactivate = spyOn(focustrap, 'deactivate').and.callThrough()

      expect(Offcanvas.getInstance(offCanvasEl)).toEqual(offCanvas)

      offCanvas.dispose()

      expect(spyDispose).toHaveBeenCalled()
      expect(offCanvas._backdrop).toBeNull()
      expect(spyDeactivate).toHaveBeenCalled()
      expect(offCanvas._focustrap).toBeNull()
      expect(Offcanvas.getInstance(offCanvasEl)).toBeNull()
    })
  })

  describe('data-api', () => {
    it('should not prevent event for input', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<input type="checkbox" data-bs-toggle="offcanvas" data-bs-target="#offcanvasdiv1">',
          '<div id="offcanvasdiv1" class="offcanvas"></div>'
        ].join('')

        const target = fixtureEl.querySelector('input')
        const offCanvasEl = fixtureEl.querySelector('#offcanvasdiv1')

        offCanvasEl.addEventListener('shown.bs.offcanvas', () => {
          expect(offCanvasEl).toHaveClass('show')
          expect(target.checked).toBeTrue()
          resolve()
        })

        target.click()
      })
    })

    it('should not call toggle on disabled elements', () => {
      fixtureEl.innerHTML = [
        '<a href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasdiv1" class="disabled"></a>',
        '<div id="offcanvasdiv1" class="offcanvas"></div>'
      ].join('')

      const target = fixtureEl.querySelector('a')

      const spy = spyOn(Offcanvas.prototype, 'toggle')

      target.click()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should call hide first, if another offcanvas is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="btn2" data-bs-toggle="offcanvas" data-bs-target="#offcanvas2"></button>',
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
          expect(Offcanvas.getInstance(offcanvasEl2)).not.toBeNull()
          resolve()
        })
        offcanvas1.show()
      })
    })

    it('should focus on trigger element after closing offcanvas', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"></button>',
          '<div id="offcanvas" class="offcanvas"></div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#btn')
        const offcanvasEl = fixtureEl.querySelector('#offcanvas')
        const offcanvas = new Offcanvas(offcanvasEl)
        const spy = spyOn(trigger, 'focus')

        offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
          offcanvas.hide()
        })
        offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            resolve()
          }, 5)
        })

        trigger.click()
      })
    })

    it('should not focus on trigger element after closing offcanvas, if it is not visible', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"></button>',
          '<div id="offcanvas" class="offcanvas"></div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#btn')
        const offcanvasEl = fixtureEl.querySelector('#offcanvas')
        const offcanvas = new Offcanvas(offcanvasEl)
        const spy = spyOn(trigger, 'focus')

        offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
          trigger.style.display = 'none'
          offcanvas.hide()
        })
        offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
          setTimeout(() => {
            expect(isVisible(trigger)).toBeFalse()
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 5)
        })

        trigger.click()
      })
    })
  })

  describe('jQueryInterface', () => {
    it('should create an offcanvas', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock)

      expect(Offcanvas.getInstance(div)).not.toBeNull()
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

    it('should call offcanvas method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      const spy = spyOn(Offcanvas.prototype, 'show')

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock, 'show')
      expect(spy).toHaveBeenCalled()
    })

    it('should create a offcanvas with given config', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.offcanvas = Offcanvas.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.offcanvas.call(jQueryMock, { scroll: true })

      const offcanvas = Offcanvas.getInstance(div)
      expect(offcanvas).not.toBeNull()
      expect(offcanvas._config.scroll).toBeTrue()
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

      expect(Offcanvas.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return offcanvas instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offcanvas = new Offcanvas(div)

      expect(Offcanvas.getOrCreateInstance(div)).toEqual(offcanvas)
      expect(Offcanvas.getInstance(div)).toEqual(Offcanvas.getOrCreateInstance(div, {}))
      expect(Offcanvas.getOrCreateInstance(div)).toBeInstanceOf(Offcanvas)
    })

    it('should return new instance when there is no Offcanvas instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Offcanvas.getInstance(div)).toBeNull()
      expect(Offcanvas.getOrCreateInstance(div)).toBeInstanceOf(Offcanvas)
    })

    it('should return new instance when there is no offcanvas instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Offcanvas.getInstance(div)).toBeNull()
      const offcanvas = Offcanvas.getOrCreateInstance(div, {
        scroll: true
      })
      expect(offcanvas).toBeInstanceOf(Offcanvas)

      expect(offcanvas._config.scroll).toBeTrue()
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offcanvas = new Offcanvas(div, {
        scroll: true
      })
      expect(Offcanvas.getInstance(div)).toEqual(offcanvas)

      const offcanvas2 = Offcanvas.getOrCreateInstance(div, {
        scroll: false
      })
      expect(offcanvas).toBeInstanceOf(Offcanvas)
      expect(offcanvas2).toEqual(offcanvas)

      expect(offcanvas2._config.scroll).toBeTrue()
    })
  })
})
