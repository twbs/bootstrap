import Dropdown from '../../src/dropdown'
import EventHandler from '../../src/dom/event-handler'
import { noop } from '../../src/util/index'
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'
import { getJqueryInterfaceForPlugin } from '../../src/util/jquery-stuff'

describe('Dropdown', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Dropdown.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Dropdown.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type config', () => {
      expect(Dropdown.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Dropdown.DATA_KEY).toEqual('bs.dropdown')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdownBySelector = new Dropdown('[data-bs-toggle="dropdown"]')
      const dropdownByElement = new Dropdown(btnDropdown)

      expect(dropdownBySelector._element).toEqual(btnDropdown)
      expect(dropdownByElement._element).toEqual(btnDropdown)
    })

    it('should create offset modifier correctly when offset option is a function', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const getOffset = jasmine.createSpy('getOffset').and.returnValue([10, 20])
        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, {
          offset: getOffset,
          popperConfig: {
            onFirstUpdate(state) {
              expect(getOffset).toHaveBeenCalledWith({
                popper: state.rects.popper,
                reference: state.rects.reference,
                placement: state.placement
              }, btnDropdown)
              resolve()
            }
          }
        })
        const offset = dropdown._getOffset()

        expect(typeof offset).toEqual('function')

        dropdown.show()
      })
    })

    it('should create offset modifier correctly when offset option is a string into data attribute', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="10,20">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      expect(dropdown._getOffset()).toEqual([10, 20])
    })

    it('should allow to pass config to Popper with `popperConfig`', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown, {
        popperConfig: {
          placement: 'left'
        }
      })

      const popperConfig = dropdown._getPopperConfig()

      expect(popperConfig.placement).toEqual('left')
    })

    it('should allow to pass config to Popper with `popperConfig` as a function', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-placement="right">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const getPopperConfig = jasmine.createSpy('getPopperConfig').and.returnValue({ placement: 'left' })
      const dropdown = new Dropdown(btnDropdown, {
        popperConfig: getPopperConfig
      })

      const popperConfig = dropdown._getPopperConfig()

      expect(getPopperConfig).toHaveBeenCalled()
      expect(popperConfig.placement).toEqual('left')
    })
  })

  describe('toggle', () => {
    it('should toggle a dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should destroy old popper references on toggle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="first dropdown">',
          '  <button class="firstBtn btn" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>',
          '<div class="second dropdown">',
          '  <button class="secondBtn btn" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown1 = fixtureEl.querySelector('.firstBtn')
        const btnDropdown2 = fixtureEl.querySelector('.secondBtn')
        const firstDropdownEl = fixtureEl.querySelector('.first')
        const secondDropdownEl = fixtureEl.querySelector('.second')
        const dropdown1 = new Dropdown(btnDropdown1)

        firstDropdownEl.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown1).toHaveClass('show')
          spyOn(dropdown1._popper, 'destroy')
          btnDropdown2.click()
        })

        secondDropdownEl.addEventListener('shown.bs.dropdown', () => setTimeout(() => {
          expect(dropdown1._popper.destroy).toHaveBeenCalled()
          resolve()
        }))

        dropdown1.toggle()
      })
    })

    it('should toggle a dropdown and add/remove event listener on mobile', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const defaultValueOnTouchStart = document.documentElement.ontouchstart
        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        document.documentElement.ontouchstart = noop
        spyOn(EventHandler, 'on')
        spyOn(EventHandler, 'off')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          expect(EventHandler.on).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)

          dropdown.toggle()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(btnDropdown).not.toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
          expect(EventHandler.off).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)

          document.documentElement.ontouchstart = defaultValueOnTouchStart
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropdown at the right', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu dropdown-menu-end">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a centered dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown-center">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropup', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropup">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropupEl = fixtureEl.querySelector('.dropup')
        const dropdown = new Dropdown(btnDropdown)

        dropupEl.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropup centered', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropup-center">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropupEl = fixtureEl.querySelector('.dropup-center')
        const dropdown = new Dropdown(btnDropdown)

        dropupEl.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropup at the right', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropup">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu dropdown-menu-end">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropupEl = fixtureEl.querySelector('.dropup')
        const dropdown = new Dropdown(btnDropdown)

        dropupEl.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropend', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropend">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropendEl = fixtureEl.querySelector('.dropend')
        const dropdown = new Dropdown(btnDropdown)

        dropendEl.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropstart', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropstart">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropstartEl = fixtureEl.querySelector('.dropstart')
        const dropdown = new Dropdown(btnDropdown)

        dropstartEl.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropdown with parent reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, {
          reference: 'parent'
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropdown with a dom node reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, {
          reference: fixtureEl
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropdown with a jquery object reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, {
          reference: { 0: fixtureEl, jquery: 'jQuery' }
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should toggle a dropdown with a valid virtual element reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle visually-hidden" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const virtualElement = {
          nodeType: 1,
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        }

        expect(() => new Dropdown(btnDropdown, {
          reference: {}
        })).toThrowError(TypeError, 'DROPDOWN: Option "reference" provided type "object" without a required "getBoundingClientRect" method.')

        expect(() => new Dropdown(btnDropdown, {
          reference: {
            getBoundingClientRect: 'not-a-function'
          }
        })).toThrowError(TypeError, 'DROPDOWN: Option "reference" provided type "object" without a required "getBoundingClientRect" method.')

        // use onFirstUpdate as Poppers internal update is executed async
        const dropdown = new Dropdown(btnDropdown, {
          reference: virtualElement,
          popperConfig: {
            onFirstUpdate() {
              expect(virtualElement.getBoundingClientRect).toHaveBeenCalled()
              expect(btnDropdown).toHaveClass('show')
              expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
              resolve()
            }
          }
        })

        spyOn(virtualElement, 'getBoundingClientRect').and.callThrough()

        dropdown.toggle()
      })
    })

    it('should not toggle a dropdown if the element is disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button disabled class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })

    it('should not toggle a dropdown if the element contains .disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle disabled" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })

    it('should not toggle a dropdown if the menu is shown', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu show">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })

    it('should not toggle a dropdown if show event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('show.bs.dropdown', event => {
          event.preventDefault()
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })
  })

  describe('show', () => {
    it('should show a dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          resolve()
        })

        dropdown.show()
      })
    })

    it('should not show a dropdown if the element is disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button disabled class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not show a dropdown if the element contains .disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle disabled" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not show a dropdown if the menu is shown', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu show">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not show a dropdown if show event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('show.bs.dropdown', event => {
          event.preventDefault()
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          reject(new Error('should not throw shown.bs.dropdown event'))
        })

        dropdown.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })
  })

  describe('hide', () => {
    it('should hide a dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">Dropdown</button>',
          '  <div class="dropdown-menu show">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdownMenu).not.toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
          resolve()
        })

        dropdown.hide()
      })
    })

    it('should hide a dropdown and destroy popper', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          spyOn(dropdown._popper, 'destroy')
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdown._popper.destroy).toHaveBeenCalled()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should not hide a dropdown if the element is disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button disabled class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu show">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          reject(new Error('should not throw hidden.bs.dropdown event'))
        })

        dropdown.hide()

        setTimeout(() => {
          expect(dropdownMenu).toHaveClass('show')
          resolve()
        }, 10)
      })
    })

    it('should not hide a dropdown if the element contains .disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle disabled" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu show">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          reject(new Error('should not throw hidden.bs.dropdown event'))
        })

        dropdown.hide()

        setTimeout(() => {
          expect(dropdownMenu).toHaveClass('show')
          resolve()
        }, 10)
      })
    })

    it('should not hide a dropdown if the menu is not shown', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          reject(new Error('should not throw hidden.bs.dropdown event'))
        })

        dropdown.hide()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not hide a dropdown if hide event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu show">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('hide.bs.dropdown', event => {
          event.preventDefault()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          reject(new Error('should not throw hidden.bs.dropdown event'))
        })

        dropdown.hide()

        setTimeout(() => {
          expect(dropdownMenu).toHaveClass('show')
          resolve()
        })
      })
    })

    it('should remove event listener on touch-enabled device that was added in show method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Dropdwon item</a>',
          '  </div>',
          '</div>'
        ].join('')

        const defaultValueOnTouchStart = document.documentElement.ontouchstart
        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        document.documentElement.ontouchstart = noop
        spyOn(EventHandler, 'off')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(btnDropdown).not.toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
          expect(EventHandler.off).toHaveBeenCalled()

          document.documentElement.ontouchstart = defaultValueOnTouchStart
          resolve()
        })

        dropdown.show()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose dropdown', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

      const dropdown = new Dropdown(btnDropdown)

      expect(dropdown._popper).toBeNull()
      expect(dropdown._menu).not.toBeNull()
      expect(dropdown._element).not.toBeNull()
      spyOn(EventHandler, 'off')

      dropdown.dispose()

      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
      expect(EventHandler.off).toHaveBeenCalledWith(btnDropdown, Dropdown.EVENT_KEY)
    })

    it('should dispose dropdown with Popper', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      dropdown.toggle()

      expect(dropdown._popper).not.toBeNull()
      expect(dropdown._menu).not.toBeNull()
      expect(dropdown._element).not.toBeNull()

      dropdown.dispose()

      expect(dropdown._popper).toBeNull()
      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
    })
  })

  describe('update', () => {
    it('should call Popper and detect navbar on update', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      dropdown.toggle()

      expect(dropdown._popper).not.toBeNull()

      spyOn(dropdown._popper, 'update')
      spyOn(dropdown, '_detectNavbar')

      dropdown.update()

      expect(dropdown._popper.update).toHaveBeenCalled()
      expect(dropdown._detectNavbar).toHaveBeenCalled()
    })

    it('should just detect navbar on update', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      spyOn(dropdown, '_detectNavbar')

      dropdown.update()

      expect(dropdown._popper).toBeNull()
      expect(dropdown._detectNavbar).toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should show and hide a dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        let showEventTriggered = false
        let hideEventTriggered = false

        btnDropdown.addEventListener('show.bs.dropdown', () => {
          showEventTriggered = true
        })

        btnDropdown.addEventListener('shown.bs.dropdown', event => setTimeout(() => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          expect(showEventTriggered).toBeTrue()
          expect(event.relatedTarget).toEqual(btnDropdown)
          document.body.click()
        }))

        btnDropdown.addEventListener('hide.bs.dropdown', () => {
          hideEventTriggered = true
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', event => {
          expect(btnDropdown).not.toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
          expect(hideEventTriggered).toBeTrue()
          expect(event.relatedTarget).toEqual(btnDropdown)
          resolve()
        })

        btnDropdown.click()
      })
    })

    it('should not use "static" Popper in navbar', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar navbar-expand-md bg-light">',
          '  <div class="dropdown">',
          '    <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '    <div class="dropdown-menu">',
          '      <a class="dropdown-item" href="#">Secondary link</a>',
          '    </div>',
          '  </div>',
          '</nav>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(dropdown._popper).not.toBeNull()
          expect(dropdownMenu.getAttribute('data-bs-popper')).toEqual('static')
          resolve()
        })

        dropdown.show()
      })
    })

    it('should not collapse the dropdown when clicking a select option nested in the dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <select>',
          '      <option selected>Open this select menu</option>',
          '      <option value="1">One</option>',
          '    </select>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        const hideSpy = spyOn(dropdown, '_completeHide')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          const clickEvent = new MouseEvent('click', {
            bubbles: true
          })

          dropdownMenu.querySelector('option').dispatchEvent(clickEvent)
        })

        dropdownMenu.addEventListener('click', event => {
          expect(event.target.tagName).toMatch(/select|option/i)

          Dropdown.clearMenus(event)

          setTimeout(() => {
            expect(hideSpy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        })

        dropdown.show()
      })
    })

    it('should manage bs attribute `data-bs-popper`="static" when dropdown is in navbar', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar navbar-expand-md bg-light">',
          '  <div class="dropdown">',
          '    <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>',
          '    <div class="dropdown-menu">',
          '      <a class="dropdown-item" href="#">Secondary link</a>',
          '    </div>',
          '  </div>',
          '</nav>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(dropdownMenu.getAttribute('data-bs-popper')).toEqual('static')
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdownMenu.getAttribute('data-bs-popper')).toBeNull()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should not use Popper if display set to static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Popper adds this attribute when we use it
          expect(dropdownMenu.getAttribute('data-popper-placement')).toBeNull()
          resolve()
        })

        btnDropdown.click()
      })
    })

    it('should manage bs attribute `data-bs-popper`="static" when display set to static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(dropdownMenu.getAttribute('data-bs-popper')).toEqual('static')
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdownMenu.getAttribute('data-bs-popper')).toBeNull()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should remove "show" class if tabbing outside of menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')

          const keyup = createEvent('keyup')

          keyup.key = 'Tab'
          document.dispatchEvent(keyup)
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(btnDropdown).not.toHaveClass('show')
          resolve()
        })

        btnDropdown.click()
      })
    })

    it('should remove "show" class if body is clicked, with multiple dropdowns', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="nav">',
          '  <div class="dropdown" id="testmenu">',
          '    <a class="dropdown-toggle" data-bs-toggle="dropdown" href="#testmenu">Test menu</a>',
          '    <div class="dropdown-menu">',
          '      <a class="dropdown-item" href="#sub1">Submenu 1</a>',
          '    </div>',
          '  </div>',
          '</div>',
          '<div class="btn-group">',
          '  <button class="btn">Actions</button>',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown"></button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Action 1</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdownList = fixtureEl.querySelectorAll('[data-bs-toggle="dropdown"]')

        expect(triggerDropdownList).toHaveSize(2)

        const [triggerDropdownFirst, triggerDropdownLast] = triggerDropdownList

        triggerDropdownFirst.addEventListener('shown.bs.dropdown', () => {
          expect(triggerDropdownFirst).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(1)
          document.body.click()
        })

        triggerDropdownFirst.addEventListener('hidden.bs.dropdown', () => {
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(0)
          triggerDropdownLast.click()
        })

        triggerDropdownLast.addEventListener('shown.bs.dropdown', () => {
          expect(triggerDropdownLast).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(1)
          document.body.click()
        })

        triggerDropdownLast.addEventListener('hidden.bs.dropdown', () => {
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(0)
          resolve()
        })

        triggerDropdownFirst.click()
      })
    })

    it('should remove "show" class if body if tabbing outside of menu, with multiple dropdowns', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <a class="dropdown-toggle" data-bs-toggle="dropdown" href="#testmenu">Test menu</a>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
          '  </div>',
          '</div>',
          '<div class="btn-group">',
          '  <button class="btn">Actions</button>',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown"></button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Action 1</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdownList = fixtureEl.querySelectorAll('[data-bs-toggle="dropdown"]')

        expect(triggerDropdownList).toHaveSize(2)

        const [triggerDropdownFirst, triggerDropdownLast] = triggerDropdownList

        triggerDropdownFirst.addEventListener('shown.bs.dropdown', () => {
          expect(triggerDropdownFirst).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(1)

          const keyup = createEvent('keyup')
          keyup.key = 'Tab'

          document.dispatchEvent(keyup)
        })

        triggerDropdownFirst.addEventListener('hidden.bs.dropdown', () => {
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(0)
          triggerDropdownLast.click()
        })

        triggerDropdownLast.addEventListener('shown.bs.dropdown', () => {
          expect(triggerDropdownLast).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(1)

          const keyup = createEvent('keyup')
          keyup.key = 'Tab'

          document.dispatchEvent(keyup)
        })

        triggerDropdownLast.addEventListener('hidden.bs.dropdown', () => {
          expect(fixtureEl.querySelectorAll('.dropdown-menu.show')).toHaveSize(0)
          resolve()
        })

        triggerDropdownFirst.click()
      })
    })

    it('should fire hide and hidden event without a clickEvent if event type is not click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        triggerDropdown.addEventListener('hide.bs.dropdown', event => {
          expect(event.clickEvent).toBeUndefined()
        })

        triggerDropdown.addEventListener('hidden.bs.dropdown', event => {
          expect(event.clickEvent).toBeUndefined()
          resolve()
        })

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          const keydown = createEvent('keydown')

          keydown.key = 'Escape'
          triggerDropdown.dispatchEvent(keydown)
        })

        triggerDropdown.click()
      })
    })

    it('should bubble up the events to the parent elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#subMenu">Sub menu</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownParent = fixtureEl.querySelector('.dropdown')
        const dropdown = new Dropdown(triggerDropdown)

        const showFunction = jasmine.createSpy('showFunction')
        dropdownParent.addEventListener('show.bs.dropdown', showFunction)

        const shownFunction = jasmine.createSpy('shownFunction')
        dropdownParent.addEventListener('shown.bs.dropdown', () => {
          shownFunction()
          dropdown.hide()
        })

        const hideFunction = jasmine.createSpy('hideFunction')
        dropdownParent.addEventListener('hide.bs.dropdown', hideFunction)

        dropdownParent.addEventListener('hidden.bs.dropdown', () => {
          expect(showFunction).toHaveBeenCalled()
          expect(shownFunction).toHaveBeenCalled()
          expect(hideFunction).toHaveBeenCalled()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should ignore keyboard events within <input>s and <textarea>s', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
          '    <input type="text">',
          '    <textarea></textarea>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const input = fixtureEl.querySelector('input')
        const textarea = fixtureEl.querySelector('textarea')

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          input.focus()
          const keydown = createEvent('keydown')

          keydown.key = 'ArrowUp'
          input.dispatchEvent(keydown)

          expect(document.activeElement).toEqual(input, 'input still focused')

          textarea.focus()
          textarea.dispatchEvent(keydown)

          expect(document.activeElement).toEqual(textarea, 'textarea still focused')
          resolve()
        })

        triggerDropdown.click()
      })
    })

    it('should skip disabled element when using keyboard navigation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item disabled" href="#sub1">Submenu 1</a>',
          '    <button class="dropdown-item" type="button" disabled>Disabled button</button>',
          '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowDown'

          triggerDropdown.dispatchEvent(keydown)
          triggerDropdown.dispatchEvent(keydown)

          expect(document.activeElement).not.toHaveClass('disabled')
          expect(document.activeElement.hasAttribute('disabled')).toBeFalse()
          resolve()
        })

        triggerDropdown.click()
      })
    })

    it('should skip hidden element when using keyboard navigation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<style>',
          '  .d-none {',
          '    display: none;',
          '  }',
          '</style>',
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <button class="dropdown-item d-none" type="button">Hidden button by class</button>',
          '    <a class="dropdown-item" href="#sub1" style="display: none">Hidden link</a>',
          '    <a class="dropdown-item" href="#sub1" style="visibility: hidden">Hidden link</a>',
          '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowDown'

          triggerDropdown.dispatchEvent(keydown)

          expect(document.activeElement).not.toHaveClass('d-none')
          expect(document.activeElement.style.display).not.toEqual('none')
          expect(document.activeElement.style.visibility).not.toEqual('hidden')

          resolve()
        })

        triggerDropdown.click()
      })
    })

    it('should focus next/previous element when using keyboard navigation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a id="item1" class="dropdown-item" href="#">A link</a>',
          '    <a id="item2" class="dropdown-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const item1 = fixtureEl.querySelector('#item1')
        const item2 = fixtureEl.querySelector('#item2')

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          const keydownArrowDown = createEvent('keydown')
          keydownArrowDown.key = 'ArrowDown'

          triggerDropdown.dispatchEvent(keydownArrowDown)
          expect(document.activeElement).toEqual(item1, 'item1 is focused')

          document.activeElement.dispatchEvent(keydownArrowDown)
          expect(document.activeElement).toEqual(item2, 'item2 is focused')

          const keydownArrowUp = createEvent('keydown')
          keydownArrowUp.key = 'ArrowUp'

          document.activeElement.dispatchEvent(keydownArrowUp)
          expect(document.activeElement).toEqual(item1, 'item1 is focused')

          resolve()
        })

        triggerDropdown.click()
      })
    })

    it('should open the dropdown and focus on the last item when using ArrowUp for the first time', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a id="item1" class="dropdown-item" href="#">A link</a>',
          '    <a id="item2" class="dropdown-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const lastItem = fixtureEl.querySelector('#item2')

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          setTimeout(() => {
            expect(document.activeElement).toEqual(lastItem, 'item2 is focused')
            resolve()
          })
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowUp'
        triggerDropdown.dispatchEvent(keydown)
      })
    })

    it('should open the dropdown and focus on the first item when using ArrowDown for the first time', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a id="item1" class="dropdown-item" href="#">A link</a>',
          '    <a id="item2" class="dropdown-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const firstItem = fixtureEl.querySelector('#item1')

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          setTimeout(() => {
            expect(document.activeElement).toEqual(firstItem, 'item1 is focused')
            resolve()
          })
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowDown'
        triggerDropdown.dispatchEvent(keydown)
      })
    })

    it('should not close the dropdown if the user clicks on a text field within dropdown-menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <input type="text">',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const input = fixtureEl.querySelector('input')

        input.addEventListener('click', () => {
          expect(triggerDropdown).toHaveClass('show')
          resolve()
        })

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(triggerDropdown).toHaveClass('show')
          input.dispatchEvent(createEvent('click'))
        })

        triggerDropdown.click()
      })
    })

    it('should not close the dropdown if the user clicks on a textarea within dropdown-menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <textarea></textarea>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const textarea = fixtureEl.querySelector('textarea')

        textarea.addEventListener('click', () => {
          expect(triggerDropdown).toHaveClass('show')
          resolve()
        })

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(triggerDropdown).toHaveClass('show')
          textarea.dispatchEvent(createEvent('click'))
        })

        triggerDropdown.click()
      })
    })

    it('should close the dropdown if the user clicks on a text field that is not contained within dropdown-menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '  </div>',
          '</div>',
          '<input type="text">'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const input = fixtureEl.querySelector('input')

        triggerDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect().nothing()
          resolve()
        })

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          input.dispatchEvent(createEvent('click', {
            bubbles: true
          }))
        })

        triggerDropdown.click()
      })
    })

    it('should ignore keyboard events for <input>s and <textarea>s within dropdown-menu, except for escape key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
          '    <input type="text">',
          '    <textarea></textarea>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const input = fixtureEl.querySelector('input')
        const textarea = fixtureEl.querySelector('textarea')

        const test = (eventKey, elementToDispatch) => {
          const event = createEvent('keydown')
          event.key = eventKey
          elementToDispatch.focus()
          elementToDispatch.dispatchEvent(event)
          expect(document.activeElement).toEqual(elementToDispatch, `${elementToDispatch.tagName} still focused`)
        }

        const keydownEscape = createEvent('keydown')
        keydownEscape.key = 'Escape'

        triggerDropdown.addEventListener('shown.bs.dropdown', () => {
          // Key Space
          test('Space', input)

          test('Space', textarea)

          // Key ArrowUp
          test('ArrowUp', input)

          test('ArrowUp', textarea)

          // Key ArrowDown
          test('ArrowDown', input)

          test('ArrowDown', textarea)

          // Key Escape
          input.focus()
          input.dispatchEvent(keydownEscape)

          expect(triggerDropdown).not.toHaveClass('show')
          resolve()
        })

        triggerDropdown.click()
      })
    })

    it('should not open dropdown if escape key was pressed on the toggle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="tabs">',
          '  <div class="dropdown">',
          '    <button disabled class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '    <div class="dropdown-menu">',
          '      <a class="dropdown-item" href="#">Secondary link</a>',
          '      <a class="dropdown-item" href="#">Something else here</a>',
          '      <div class="divider"></div>',
          '      <a class="dropdown-item" href="#">Another link</a>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(triggerDropdown)
        const button = fixtureEl.querySelector('button[data-bs-toggle="dropdown"]')

        spyOn(dropdown, 'toggle')

        // Key escape
        button.focus()
        // Key escape
        const keydownEscape = createEvent('keydown')
        keydownEscape.key = 'Escape'
        button.dispatchEvent(keydownEscape)

        setTimeout(() => {
          expect(dropdown.toggle).not.toHaveBeenCalled()
          expect(triggerDropdown).not.toHaveClass('show')
          resolve()
        }, 20)
      })
    })

    it('should propagate escape key events if dropdown is closed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="parent">',
          '  <div class="dropdown">',
          '    <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '    <div class="dropdown-menu">',
          '      <a class="dropdown-item" href="#">Some Item</a>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const parent = fixtureEl.querySelector('.parent')
        const toggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        const parentKeyHandler = jasmine.createSpy('parentKeyHandler')

        parent.addEventListener('keydown', parentKeyHandler)
        parent.addEventListener('keyup', () => {
          expect(parentKeyHandler).toHaveBeenCalled()
          resolve()
        })

        const keydownEscape = createEvent('keydown', { bubbles: true })
        keydownEscape.key = 'Escape'
        const keyupEscape = createEvent('keyup', { bubbles: true })
        keyupEscape.key = 'Escape'

        toggle.focus()
        toggle.dispatchEvent(keydownEscape)
        toggle.dispatchEvent(keyupEscape)
      })
    })

    it('should not propagate escape key events if dropdown is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="parent">',
          '  <div class="dropdown">',
          '    <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '    <div class="dropdown-menu">',
          '      <a class="dropdown-item" href="#">Some Item</a>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const parent = fixtureEl.querySelector('.parent')
        const toggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        const parentKeyHandler = jasmine.createSpy('parentKeyHandler')

        parent.addEventListener('keydown', parentKeyHandler)
        parent.addEventListener('keyup', () => {
          expect(parentKeyHandler).not.toHaveBeenCalled()
          resolve()
        })

        const keydownEscape = createEvent('keydown', { bubbles: true })
        keydownEscape.key = 'Escape'
        const keyupEscape = createEvent('keyup', { bubbles: true })
        keyupEscape.key = 'Escape'

        toggle.click()
        toggle.dispatchEvent(keydownEscape)
        toggle.dispatchEvent(keyupEscape)
      })
    })

    it('should close dropdown using `escape` button, and return focus to its trigger', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Some Item</a>',
          '  </div>',
          '</div>'
        ].join('')

        const toggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        toggle.addEventListener('shown.bs.dropdown', () => {
          const keydownEvent = createEvent('keydown', { bubbles: true })
          keydownEvent.key = 'ArrowDown'
          toggle.dispatchEvent(keydownEvent)
          keydownEvent.key = 'Escape'
          toggle.dispatchEvent(keydownEvent)
        })

        toggle.addEventListener('hidden.bs.dropdown', () => setTimeout(() => {
          expect(document.activeElement).toEqual(toggle)
          resolve()
        }))

        toggle.click()
      })
    })

    it('should close dropdown (only) by clicking inside the dropdown menu when it has data-attribute `data-bs-auto-close="inside"`', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="inside">Dropdown toggle</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Dropdown item</a>',
          ' </div>',
          '</div>'
        ].join('')

        const dropdownToggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

        const expectDropdownToBeOpened = () => setTimeout(() => {
          expect(dropdownToggle).toHaveClass('show')
          dropdownMenu.click()
        }, 150)

        dropdownToggle.addEventListener('shown.bs.dropdown', () => {
          document.documentElement.click()
          expectDropdownToBeOpened()
        })

        dropdownToggle.addEventListener('hidden.bs.dropdown', () => setTimeout(() => {
          expect(dropdownToggle).not.toHaveClass('show')
          resolve()
        }))

        dropdownToggle.click()
      })
    })

    it('should close dropdown (only) by clicking outside the dropdown menu when it has data-attribute `data-bs-auto-close="outside"`', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">Dropdown toggle</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Dropdown item</a>',
          ' </div>',
          '</div>'
        ].join('')

        const dropdownToggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

        const expectDropdownToBeOpened = () => setTimeout(() => {
          expect(dropdownToggle).toHaveClass('show')
          document.documentElement.click()
        }, 150)

        dropdownToggle.addEventListener('shown.bs.dropdown', () => {
          dropdownMenu.click()
          expectDropdownToBeOpened()
        })

        dropdownToggle.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdownToggle).not.toHaveClass('show')
          resolve()
        })

        dropdownToggle.click()
      })
    })

    it('should not close dropdown by clicking inside or outside the dropdown menu when it has data-attribute `data-bs-auto-close="false"`', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false">Dropdown toggle</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Dropdown item</a>',
          ' </div>',
          '</div>'
        ].join('')

        const dropdownToggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

        const expectDropdownToBeOpened = (shouldTriggerClick = true) => setTimeout(() => {
          expect(dropdownToggle).toHaveClass('show')
          if (shouldTriggerClick) {
            document.documentElement.click()
          } else {
            resolve()
          }

          expectDropdownToBeOpened(false)
        }, 150)

        dropdownToggle.addEventListener('shown.bs.dropdown', () => {
          dropdownMenu.click()
          expectDropdownToBeOpened()
        })

        dropdownToggle.click()
      })
    })

    it('should be able to identify clicked dropdown, no matter the markup order', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Dropdown item</a>',
        '  </div>',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown toggle</button>',
        '</div>'
      ].join('')

      const dropdownToggle = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const spy = spyOn(Dropdown, 'getOrCreateInstance').and.callThrough()

      dropdownToggle.click()
      expect(spy).toHaveBeenCalledWith(dropdownToggle)
      dropdownMenu.click()
      expect(spy).toHaveBeenCalledWith(dropdownToggle)
    })
  })

  describe('jQueryInterface', () => {
    it('should create a dropdown', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.dropdown = getJqueryInterfaceForPlugin(Dropdown)
      jQueryMock.elements = [div]

      jQueryMock.fn.dropdown.call(jQueryMock)

      expect(Dropdown.getInstance(div)).not.toBeNull()
    })

    it('should not re create a dropdown', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const dropdown = new Dropdown(div)

      jQueryMock.fn.dropdown = getJqueryInterfaceForPlugin(Dropdown)
      jQueryMock.elements = [div]

      jQueryMock.fn.dropdown.call(jQueryMock)

      expect(Dropdown.getInstance(div)).toEqual(dropdown)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.dropdown = getJqueryInterfaceForPlugin(Dropdown)
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.dropdown.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return dropdown instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const dropdown = new Dropdown(div)

      expect(Dropdown.getInstance(div)).toEqual(dropdown)
      expect(Dropdown.getInstance(div)).toBeInstanceOf(Dropdown)
    })

    it('should return null when there is no dropdown instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Dropdown.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return dropdown instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const dropdown = new Dropdown(div)

      expect(Dropdown.getOrCreateInstance(div)).toEqual(dropdown)
      expect(Dropdown.getInstance(div)).toEqual(Dropdown.getOrCreateInstance(div, {}))
      expect(Dropdown.getOrCreateInstance(div)).toBeInstanceOf(Dropdown)
    })

    it('should return new instance when there is no dropdown instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Dropdown.getInstance(div)).toBeNull()
      expect(Dropdown.getOrCreateInstance(div)).toBeInstanceOf(Dropdown)
    })

    it('should return new instance when there is no dropdown instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Dropdown.getInstance(div)).toBeNull()
      const dropdown = Dropdown.getOrCreateInstance(div, {
        display: 'dynamic'
      })
      expect(dropdown).toBeInstanceOf(Dropdown)

      expect(dropdown._config.display).toEqual('dynamic')
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const dropdown = new Dropdown(div, {
        display: 'dynamic'
      })
      expect(Dropdown.getInstance(div)).toEqual(dropdown)

      const dropdown2 = Dropdown.getOrCreateInstance(div, {
        display: 'static'
      })
      expect(dropdown).toBeInstanceOf(Dropdown)
      expect(dropdown2).toEqual(dropdown)

      expect(dropdown2._config.display).toEqual('dynamic')
    })
  })

  it('should open dropdown when pressing keydown or keyup', () => {
    return new Promise(resolve => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item disabled" href="#sub1">Submenu 1</a>',
        '    <button class="dropdown-item" type="button" disabled>Disabled button</button>',
        '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowDown'

      const keyup = createEvent('keyup')
      keyup.key = 'ArrowUp'

      const handleArrowDown = () => {
        expect(triggerDropdown).toHaveClass('show')
        expect(triggerDropdown.getAttribute('aria-expanded')).toEqual('true')
        setTimeout(() => {
          dropdown.hide()
          keydown.key = 'ArrowUp'
          triggerDropdown.dispatchEvent(keyup)
        }, 20)
      }

      const handleArrowUp = () => {
        expect(triggerDropdown).toHaveClass('show')
        expect(triggerDropdown.getAttribute('aria-expanded')).toEqual('true')
        resolve()
      }

      dropdown.addEventListener('shown.bs.dropdown', event => {
        if (event.target.key === 'ArrowDown') {
          handleArrowDown()
        } else {
          handleArrowUp()
        }
      })

      triggerDropdown.dispatchEvent(keydown)
    })
  })

  it('should allow `data-bs-toggle="dropdown"` click events to bubble up', () => {
    fixtureEl.innerHTML = [
      '<div class="dropdown">',
      '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
      '  <div class="dropdown-menu">',
      '    <a class="dropdown-item" href="#">Secondary link</a>',
      '  </div>',
      '</div>'
    ].join('')

    const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
    const clickListener = jasmine.createSpy('clickListener')
    const delegatedClickListener = jasmine.createSpy('delegatedClickListener')

    btnDropdown.addEventListener('click', clickListener)
    document.addEventListener('click', delegatedClickListener)

    btnDropdown.click()

    expect(clickListener).toHaveBeenCalled()
    expect(delegatedClickListener).toHaveBeenCalled()
  })

  it('should open the dropdown when clicking the child element inside `data-bs-toggle="dropdown"`', () => {
    return new Promise(resolve => {
      fixtureEl.innerHTML = [
        '<div class="container">',
        '  <div class="dropdown">',
        '    <button class="btn dropdown-toggle" data-bs-toggle="dropdown"><span id="childElement">Dropdown</span></button>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#subMenu">Sub menu</a>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const childElement = fixtureEl.querySelector('#childElement')

      btnDropdown.addEventListener('shown.bs.dropdown', () => setTimeout(() => {
        expect(btnDropdown).toHaveClass('show')
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        resolve()
      }))

      childElement.click()
    })
  })
})
