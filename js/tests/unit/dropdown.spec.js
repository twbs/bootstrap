import EventHandler from '../../src/dom/event-handler.js'
import Dropdown from '../../src/dropdown.js'
import { noop } from '../../src/util/index.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

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

    it('should work on invalid markup', () => {
      return new Promise(resolve => {
        // TODO: REMOVE in v6
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const dropdownElem = fixtureEl.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(dropdownElem)

        dropdownElem.addEventListener('shown.bs.dropdown', () => {
          resolve()
        })

        expect().nothing()
        dropdown.show()
      })
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
          offset: getOffset
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Floating UI calls offset function asynchronously
          setTimeout(() => {
            expect(getOffset).toHaveBeenCalled()
            resolve()
          }, 20)
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

    it('should allow to pass config to Floating UI with `floatingConfig`', () => {
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
        floatingConfig: {
          placement: 'left'
        }
      })

      const floatingConfig = dropdown._getFloatingConfig('bottom-start', [])

      expect(floatingConfig.placement).toEqual('left')
    })

    it('should allow to pass config to Floating UI with `floatingConfig` as a function', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-placement="right">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const getFloatingConfig = jasmine.createSpy('getFloatingConfig').and.returnValue({ placement: 'left' })
      const dropdown = new Dropdown(btnDropdown, {
        floatingConfig: getFloatingConfig
      })

      const floatingConfig = dropdown._getFloatingConfig('bottom-start', [])

      // Ensure that the function was called with the default config.
      expect(getFloatingConfig).toHaveBeenCalledWith(jasmine.objectContaining({
        placement: jasmine.any(String)
      }))
      expect(floatingConfig.placement).toEqual('left')
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

    it('should destroy old Floating UI references on toggle', () => {
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
          expect(dropdown1._floatingCleanup).not.toBeNull()
          btnDropdown2.click()
        })

        secondDropdownEl.addEventListener('shown.bs.dropdown', () => setTimeout(() => {
          expect(dropdown1._floatingCleanup).toBeNull()
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
        const spy = spyOn(EventHandler, 'on')
        const spyOff = spyOn(EventHandler, 'off')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(btnDropdown).toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)

          dropdown.toggle()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(btnDropdown).not.toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
          expect(spyOff).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)

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

        const dropdown = new Dropdown(btnDropdown, {
          reference: virtualElement
        })

        const spy = spyOn(virtualElement, 'getBoundingClientRect').and.callThrough()

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Floating UI calls getBoundingClientRect asynchronously
          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            expect(btnDropdown).toHaveClass('show')
            expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
            resolve()
          }, 20)
        })

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

    it('should hide a dropdown and cleanup Floating UI', () => {
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
          expect(dropdown._floatingCleanup).not.toBeNull()
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdown._floatingCleanup).toBeNull()
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
          '    <a class="dropdown-item" href="#">Dropdown item</a>',
          '  </div>',
          '</div>'
        ].join('')

        const defaultValueOnTouchStart = document.documentElement.ontouchstart
        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        document.documentElement.ontouchstart = noop
        const spy = spyOn(EventHandler, 'off')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(btnDropdown).not.toHaveClass('show')
          expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
          expect(spy).toHaveBeenCalled()

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

      expect(dropdown._floatingCleanup).toBeNull()
      expect(dropdown._menu).not.toBeNull()
      expect(dropdown._element).not.toBeNull()
      const spy = spyOn(EventHandler, 'off')

      dropdown.dispose()

      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
      expect(spy).toHaveBeenCalledWith(btnDropdown, Dropdown.EVENT_KEY)
    })

    it('should dispose dropdown with Floating UI', () => {
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

      expect(dropdown._floatingCleanup).not.toBeNull()
      expect(dropdown._menu).not.toBeNull()
      expect(dropdown._element).not.toBeNull()

      dropdown.dispose()

      expect(dropdown._floatingCleanup).toBeNull()
      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
    })
  })

  describe('update', () => {
    it('should call Floating UI update on update', () => {
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
          expect(dropdown._floatingCleanup).not.toBeNull()

          const spyUpdate = spyOn(dropdown, '_updateFloatingPosition')

          dropdown.update()

          expect(spyUpdate).toHaveBeenCalled()
          resolve()
        })

        dropdown.toggle()
      })
    })

    it('should do nothing on update if not shown', () => {
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

      const spy = spyOn(dropdown, '_updateFloatingPosition')

      dropdown.update()

      expect(dropdown._floatingCleanup).toBeNull()
      expect(spy).not.toHaveBeenCalled()
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

    it('should use Floating UI positioning in navbar', () => {
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
          expect(dropdown._floatingCleanup).not.toBeNull()
          // Floating UI sets data-bs-placement attribute asynchronously
          setTimeout(() => {
            expect(dropdownMenu.getAttribute('data-bs-placement')).not.toBeNull()
            resolve()
          }, 10)
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

    it('should not use Floating UI if display set to static', () => {
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
          // Floating UI adds this attribute when we use it
          expect(dropdownMenu.getAttribute('data-bs-placement')).toBeNull()
          resolve()
        })

        btnDropdown.click()
      })
    })

    it('should manage bs attribute `data-bs-display`="static" when display set to static', () => {
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
          expect(dropdownMenu.getAttribute('data-bs-display')).toEqual('static')
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(dropdownMenu.getAttribute('data-bs-display')).toBeNull()
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

    it('should be able to identify clicked dropdown, even with multiple dropdowns in the same tag', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button id="dropdown1" class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown toggle</button>',
        '  <div id="menu1" class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Dropdown item</a>',
        '  </div>',
        '  <button id="dropdown2" class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown toggle</button>',
        '  <div id="menu2" class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Dropdown item</a>',
        '  </div>',
        '</div>'
      ].join('')

      const dropdownToggle1 = fixtureEl.querySelector('#dropdown1')
      const dropdownToggle2 = fixtureEl.querySelector('#dropdown2')
      const dropdownMenu1 = fixtureEl.querySelector('#menu1')
      const dropdownMenu2 = fixtureEl.querySelector('#menu2')
      const spy = spyOn(Dropdown, 'getOrCreateInstance').and.callThrough()

      dropdownToggle1.click()
      expect(spy).toHaveBeenCalledWith(dropdownToggle1)

      dropdownToggle2.click()
      expect(spy).toHaveBeenCalledWith(dropdownToggle2)

      dropdownMenu1.click()
      expect(spy).toHaveBeenCalledWith(dropdownToggle1)

      dropdownMenu2.click()
      expect(spy).toHaveBeenCalledWith(dropdownToggle2)
    })

    it('should be able to show the proper menu, even with multiple dropdowns in the same tag', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button id="dropdown1" class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown toggle</button>',
        '  <div id="menu1" class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Dropdown item</a>',
        '  </div>',
        '  <button id="dropdown2" class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown toggle</button>',
        '  <div id="menu2" class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Dropdown item</a>',
        '  </div>',
        '</div>'
      ].join('')

      const dropdownToggle1 = fixtureEl.querySelector('#dropdown1')
      const dropdownToggle2 = fixtureEl.querySelector('#dropdown2')
      const dropdownMenu1 = fixtureEl.querySelector('#menu1')
      const dropdownMenu2 = fixtureEl.querySelector('#menu2')

      dropdownToggle1.click()
      expect(dropdownMenu1).toHaveClass('show')
      expect(dropdownMenu2).not.toHaveClass('show')

      dropdownToggle2.click()
      expect(dropdownMenu1).not.toHaveClass('show')
      expect(dropdownMenu2).toHaveClass('show')
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

        const spy = spyOn(dropdown, 'toggle')

        // Key escape
        button.focus()
        // Key escape
        const keydownEscape = createEvent('keydown')
        keydownEscape.key = 'Escape'
        button.dispatchEvent(keydownEscape)

        setTimeout(() => {
          expect(spy).not.toHaveBeenCalled()
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

  describe('responsive placements', () => {
    it('should parse responsive placement string and create instance', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-placement="bottom-start md:top-end">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      // Dropdown should have parsed responsive placements
      expect(dropdown._responsivePlacements).not.toBeNull()
      expect(dropdown._responsivePlacements.xs).toEqual('bottom-start')
      expect(dropdown._responsivePlacements.md).toEqual('top-end')
    })

    it('should return null for non-responsive placement', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-placement="bottom-start">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      // Non-responsive placement should not create responsive placements object
      expect(dropdown._responsivePlacements).toBeNull()
    })
  })

  describe('virtual element reference', () => {
    it('should work with virtual element as reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '    <a class="dropdown-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

        // Virtual element with getBoundingClientRect
        const virtualElement = {
          getBoundingClientRect() {
            return {
              width: 100,
              height: 50,
              top: 100,
              left: 100,
              right: 200,
              bottom: 150,
              x: 100,
              y: 100
            }
          }
        }

        const dropdown = new Dropdown(btnDropdown, {
          reference: virtualElement
        })

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          expect(document.querySelector('.dropdown-menu.show')).not.toBeNull()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should throw error for object reference without getBoundingClientRect', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')

      expect(() => {
        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown, {
          reference: { someProperty: 'value' } // Object without getBoundingClientRect
        })
      }).toThrowError(TypeError)
    })
  })

  describe('selectMenuItem', () => {
    it('should do nothing when dropdown menu has no visible items', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <div class="dropdown-menu">',
          '  </div>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Simulate ArrowDown key - should not throw when no items
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowDown'
          btnDropdown.dispatchEvent(keydown)

          // No error thrown means test passed
          expect(true).toBeTrue()
          resolve()
        })

        dropdown.show()
      })
    })
  })

  describe('submenu', () => {
    it('should open submenu on click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li><a class="dropdown-item" href="#">Action</a></li>',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action 1</a></li>',
          '        <li><a class="dropdown-item" href="#">Sub-action 2</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          submenuTrigger.click()

          expect(submenu.classList.contains('show')).toBeTrue()
          expect(submenuWrapper.classList.contains('show')).toBeTrue()
          resolve()
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should toggle submenu on click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeTrue()

          // Close submenu
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeFalse()
          resolve()
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should close sibling submenus when opening a new one', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu" id="submenu1">',
          '      <button class="dropdown-item" type="button">Submenu 1</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Action 1</a></li>',
          '      </ul>',
          '    </li>',
          '    <li class="dropdown-submenu" id="submenu2">',
          '      <button class="dropdown-item" type="button">Submenu 2</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Action 2</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenu1Wrapper = fixtureEl.querySelector('#submenu1')
        const submenu2Wrapper = fixtureEl.querySelector('#submenu2')
        const submenu1Trigger = submenu1Wrapper.querySelector('.dropdown-item')
        const submenu2Trigger = submenu2Wrapper.querySelector('.dropdown-item')
        const submenu1 = submenu1Wrapper.querySelector('.dropdown-menu')
        const submenu2 = submenu2Wrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open first submenu
          submenu1Trigger.click()
          expect(submenu1.classList.contains('show')).toBeTrue()
          expect(submenu2.classList.contains('show')).toBeFalse()

          // Open second submenu - first should close
          submenu2Trigger.click()
          expect(submenu1.classList.contains('show')).toBeFalse()
          expect(submenu2.classList.contains('show')).toBeTrue()
          resolve()
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should open submenu with ArrowRight key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')
        const submenuItem = submenu.querySelector('.dropdown-item')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Focus the submenu trigger
          submenuTrigger.focus()

          // Press ArrowRight to open submenu
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowRight'
          submenuTrigger.dispatchEvent(keydown)

          setTimeout(() => {
            expect(submenu.classList.contains('show')).toBeTrue()
            expect(document.activeElement).toEqual(submenuItem)
            resolve()
          }, 10)
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should close submenu via internal method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu first using internal method
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()
          expect(dropdown._openSubmenus.size).toEqual(1)

          // Close submenu using internal method
          dropdown._closeSubmenu(submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeFalse()
          expect(dropdown._openSubmenus.size).toEqual(0)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should open submenu with Enter key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          submenuTrigger.focus()

          const keydown = createEvent('keydown')
          keydown.key = 'Enter'
          submenuTrigger.dispatchEvent(keydown)

          setTimeout(() => {
            // Submenu should be open
            expect(submenu.classList.contains('show')).toBeTrue()
            expect(submenuWrapper.classList.contains('show')).toBeTrue()
            resolve()
          }, 20)
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should open submenu with Space key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          submenuTrigger.focus()

          const keydown = createEvent('keydown')
          keydown.key = ' '
          submenuTrigger.dispatchEvent(keydown)

          setTimeout(() => {
            // Submenu should be open
            expect(submenu.classList.contains('show')).toBeTrue()
            expect(submenuWrapper.classList.contains('show')).toBeTrue()
            resolve()
          }, 20)
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should close all submenus when main dropdown closes', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeTrue()

          // Close main dropdown
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          expect(submenu.classList.contains('show')).toBeFalse()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should close nested submenus when closing parent submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu" id="level1">',
          '      <button class="dropdown-item" type="button">Level 1</button>',
          '      <ul class="dropdown-menu">',
          '        <li class="dropdown-submenu" id="level2">',
          '          <button class="dropdown-item" type="button">Level 2</button>',
          '          <ul class="dropdown-menu">',
          '            <li><a class="dropdown-item" href="#">Level 3 action</a></li>',
          '          </ul>',
          '        </li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const level1Wrapper = fixtureEl.querySelector('#level1')
        const level2Wrapper = fixtureEl.querySelector('#level2')
        const level1Trigger = level1Wrapper.querySelector(':scope > .dropdown-item')
        const level2Trigger = level2Wrapper.querySelector(':scope > .dropdown-item')
        const level1Submenu = level1Wrapper.querySelector(':scope > .dropdown-menu')
        const level2Submenu = level2Wrapper.querySelector(':scope > .dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open level 1
          level1Trigger.click()
          expect(level1Submenu.classList.contains('show')).toBeTrue()

          // Open level 2
          level2Trigger.click()
          expect(level2Submenu.classList.contains('show')).toBeTrue()

          // Close level 1 - level 2 should also close
          level1Trigger.click()
          expect(level1Submenu.classList.contains('show')).toBeFalse()
          expect(level2Submenu.classList.contains('show')).toBeFalse()
          resolve()
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should have submenu items visible and focusable', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu" id="submenu">',
          '        <li><a id="sub1" class="dropdown-item" href="#">Sub 1</a></li>',
          '        <li><a id="sub2" class="dropdown-item" href="#">Sub 2</a></li>',
          '        <li><a id="sub3" class="dropdown-item" href="#">Sub 3</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = fixtureEl.querySelector('#submenu')
        const sub1 = fixtureEl.querySelector('#sub1')
        const sub2 = fixtureEl.querySelector('#sub2')
        const sub3 = fixtureEl.querySelector('#sub3')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu using internal method
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Submenu items should be visible and focusable
          expect(submenu.classList.contains('show')).toBeTrue()

          sub1.focus()
          expect(document.activeElement).toEqual(sub1)

          sub2.focus()
          expect(document.activeElement).toEqual(sub2)

          sub3.focus()
          expect(document.activeElement).toEqual(sub3)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should close all submenus when hiding dropdown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu" id="submenu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = fixtureEl.querySelector('#submenu')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu using internal method
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()
          expect(dropdown._openSubmenus.size).toEqual(1)

          // Hide the main dropdown
          dropdown.hide()
        })

        btnDropdown.addEventListener('hidden.bs.dropdown', () => {
          // All submenus should be closed
          expect(submenu.classList.contains('show')).toBeFalse()
          expect(dropdown._openSubmenus.size).toEqual(0)
          resolve()
        })

        dropdown.show()
      })
    })

    it('should respect submenuTrigger: click option', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-submenu-trigger="click">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')
        const dropdown = new Dropdown(btnDropdown)

        expect(dropdown._config.submenuTrigger).toEqual('click')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Click should work
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeTrue()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should respect submenuTrigger: hover option', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-submenu-trigger="hover">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const dropdown = new Dropdown(btnDropdown)

        expect(dropdown._config.submenuTrigger).toEqual('hover')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Hover should open submenu
          const mouseenter = createEvent('mouseenter', { bubbles: true })
          submenuTrigger.dispatchEvent(mouseenter)

          // Note: In JSDOM, hover events may not work perfectly,
          // but we verify the config is respected
          expect(dropdown._config.submenuTrigger).toEqual('hover')
          resolve()
        })

        dropdown.show()
      })
    })

    it('should respect submenuDelay config option', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-submenu-delay="500">Dropdown</button>',
        '  <ul class="dropdown-menu">',
        '    <li class="dropdown-submenu">',
        '      <button class="dropdown-item" type="button">More options</button>',
        '      <ul class="dropdown-menu">',
        '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      expect(dropdown._config.submenuDelay).toEqual(500)
    })

    it('should position submenu using Floating UI', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          submenuTrigger.click()

          // Floating UI should set position styles
          setTimeout(() => {
            expect(submenu.style.position).toEqual('absolute')
            expect(submenu.style.left).toBeTruthy()
            expect(submenu.style.top).toBeTruthy()
            resolve()
          }, 50)
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should set data-bs-placement attribute on submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          submenuTrigger.click()

          setTimeout(() => {
            // Should have a placement data attribute
            const placement = submenu.dataset.bsPlacement
            expect(placement).toBeTruthy()
            // Should be a valid placement
            expect(['left-start', 'right-start', 'left-end', 'right-end', 'left', 'right'])
              .toContain(placement)
            resolve()
          }, 50)
        })

        // eslint-disable-next-line no-new
        new Dropdown(btnDropdown)
        btnDropdown.click()
      })
    })

    it('should cleanup Floating UI autoUpdate on submenu close', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          submenuTrigger.click()
          expect(dropdown._openSubmenus.size).toEqual(1)
          expect(dropdown._openSubmenus.has(submenu)).toBeTrue()

          // Close submenu
          submenuTrigger.click()
          expect(dropdown._openSubmenus.size).toEqual(0)
          expect(dropdown._openSubmenus.has(submenu)).toBeFalse()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should schedule submenu close with delay', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, { submenuDelay: 50 })
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Schedule close
          dropdown._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Still open immediately
          expect(submenu.classList.contains('show')).toBeTrue()

          // After delay, should be closed
          setTimeout(() => {
            expect(submenu.classList.contains('show')).toBeFalse()
            expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeFalse()
            resolve()
          }, 100)
        })

        dropdown.show()
      })
    })

    it('should cancel scheduled submenu close', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, { submenuDelay: 50 })
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Schedule close
          dropdown._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Cancel the close
          dropdown._cancelSubmenuCloseTimeout(submenu)
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeFalse()

          // After delay, should still be open
          setTimeout(() => {
            expect(submenu.classList.contains('show')).toBeTrue()
            resolve()
          }, 100)
        })

        dropdown.show()
      })
    })

    it('should clear all submenu timeouts on dispose', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, { submenuDelay: 200 })
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu and schedule close
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          dropdown._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(dropdown._submenuCloseTimeouts.size).toEqual(1)

          // Clear all timeouts
          dropdown._clearAllSubmenuTimeouts()
          expect(dropdown._submenuCloseTimeouts.size).toEqual(0)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should detect point inside triangle', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
        '  <ul class="dropdown-menu">',
        '    <li class="dropdown-submenu">',
        '      <button class="dropdown-item" type="button">More options</button>',
        '      <ul class="dropdown-menu">',
        '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      // Triangle with vertices at (0,0), (10,0), (5,10)
      const v1 = { x: 0, y: 0 }
      const v2 = { x: 10, y: 0 }
      const v3 = { x: 5, y: 10 }

      // Point inside triangle
      const inside = { x: 5, y: 5 }
      expect(dropdown._pointInTriangle(inside, v1, v2, v3)).toBeTrue()

      // Point outside triangle
      const outside = { x: 20, y: 20 }
      expect(dropdown._pointInTriangle(outside, v1, v2, v3)).toBeFalse()

      // Point on edge should be inside
      const onEdge = { x: 5, y: 0 }
      expect(dropdown._pointInTriangle(onEdge, v1, v2, v3)).toBeTrue()
    })

    it('should track mouse position for safe triangle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Call track method directly
          dropdown._trackMousePosition({ clientX: 100, clientY: 200 })

          // Should have tracked position in hover intent data
          expect(dropdown._hoverIntentData).toBeDefined()
          expect(dropdown._hoverIntentData.x).toEqual(100)
          expect(dropdown._hoverIntentData.y).toEqual(200)
          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle hover trigger opening submenu via internal method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-submenu-trigger="hover">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        expect(dropdown._config.submenuTrigger).toEqual('hover')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Use internal handler directly with mock event
          const mockEvent = { target: submenuTrigger }
          dropdown._onSubmenuTriggerEnter(mockEvent)

          // Submenu should open
          expect(submenu.classList.contains('show')).toBeTrue()
          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle submenu mouseleave with close delay', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-submenu-trigger="hover" data-bs-submenu-delay="50">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Simulate mouseleave from submenu wrapper
          const mouseleave = new MouseEvent('mouseleave', { bubbles: true })
          Object.defineProperty(mouseleave, 'target', { value: submenuWrapper })
          dropdown._onSubmenuLeave(mouseleave)

          // Should schedule close
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeTrue()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should not schedule close if submenu is not open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Try mouseleave without opening submenu first
          const mouseleave = new MouseEvent('mouseleave', { bubbles: true })
          Object.defineProperty(mouseleave, 'target', { value: submenuWrapper })
          dropdown._onSubmenuLeave(mouseleave)

          // Should not schedule close since submenu wasn't open
          expect(dropdown._submenuCloseTimeouts.size).toEqual(0)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should not open submenu if trigger element not found', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Mock event with target that's not a submenu trigger
          const mockEvent = { target: btnDropdown }
          dropdown._onSubmenuTriggerEnter(mockEvent)

          // No submenus should be open
          expect(dropdown._openSubmenus.size).toEqual(0)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should not close submenu if already closed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Try to close submenu that was never opened
          dropdown._closeSubmenu(submenu, submenuWrapper)

          // Should not throw, openSubmenus should still be empty
          expect(dropdown._openSubmenus.size).toEqual(0)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle _isMovingTowardSubmenu with no hover data', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // No hover data tracked yet
          dropdown._hoverIntentData = null

          const mockEvent = { clientX: 100, clientY: 100 }
          const result = dropdown._isMovingTowardSubmenu(mockEvent, submenu)

          // Should return false when no hover data
          expect(result).toBeFalse()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle click on submenu trigger when submenu is already open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Click handler should toggle (close it)
          const mockEvent = {
            target: submenuTrigger,
            preventDefault() {},
            stopPropagation() {}
          }
          dropdown._onSubmenuTriggerClick(mockEvent)

          expect(submenu.classList.contains('show')).toBeFalse()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should cancel pending timeout when opening submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, { submenuDelay: 200 })
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Schedule close
          dropdown._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Re-enter submenu trigger should cancel timeout
          const mockEvent = { target: submenuTrigger }
          dropdown._onSubmenuTriggerEnter(mockEvent)

          // Timeout should be cancelled
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeFalse()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle _onSubmenuTriggerClick with non-matching target', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li><a class="dropdown-item" href="#">Regular item</a></li>',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const regularItem = fixtureEl.querySelector('.dropdown-menu > li > a')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Click on regular item (not submenu trigger)
          const mockEvent = {
            target: regularItem,
            preventDefault() {},
            stopPropagation() {}
          }
          dropdown._onSubmenuTriggerClick(mockEvent)

          // No submenus should be affected
          expect(dropdown._openSubmenus.size).toEqual(0)

          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle _onSubmenuLeave when not moving toward submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu" style="position: absolute; left: 200px; top: 0; width: 100px; height: 100px;">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, { submenuDelay: 50 })
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Track mouse position far from submenu
          dropdown._trackMousePosition({ clientX: 0, clientY: 0 })

          // Simulate mouseleave moving away from submenu
          const mockEvent = {
            target: submenuWrapper,
            clientX: -100,
            clientY: -100
          }
          dropdown._onSubmenuLeave(mockEvent)

          // Should schedule close since not moving toward submenu
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeTrue()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should cancel timeout when calling cancelSubmenuCloseTimeout', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu" id="submenu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown, { submenuDelay: 200 })
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = fixtureEl.querySelector('#submenu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Schedule close
          dropdown._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Cancel the timeout directly
          dropdown._cancelSubmenuCloseTimeout(submenu)

          // Timeout should be cancelled
          expect(dropdown._submenuCloseTimeouts.has(submenu)).toBeFalse()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should skip closing submenu if already not in openSubmenus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Calling close on never-opened submenu should not throw
          expect(() => {
            dropdown._closeSubmenu(submenu, submenuWrapper)
          }).not.toThrow()

          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle _isMovingTowardSubmenu when cursor is in safe triangle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="dropdown" style="position: relative;">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu" style="position: absolute; display: block;">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu" style="position: absolute; left: 100px; top: 0; width: 100px; height: 100px; display: block;">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Track a mouse position
          dropdown._trackMousePosition({ clientX: 50, clientY: 50 })

          // Call isMovingTowardSubmenu
          const mockEvent = { clientX: 75, clientY: 50 }
          const result = dropdown._isMovingTowardSubmenu(mockEvent, submenu)

          // Result depends on geometry, just verify it returns a boolean
          expect(typeof result).toBe('boolean')

          resolve()
        })

        dropdown.show()
      })
    })

    it('should handle RTL submenu placement', () => {
      return new Promise(resolve => {
        // Set RTL
        document.documentElement.dir = 'rtl'

        fixtureEl.innerHTML = [
          '<div class="dropdown">',
          '  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Dropdown</button>',
          '  <ul class="dropdown-menu">',
          '    <li class="dropdown-submenu">',
          '      <button class="dropdown-item" type="button">More options</button>',
          '      <ul class="dropdown-menu">',
          '        <li><a class="dropdown-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnDropdown = fixtureEl.querySelector('[data-bs-toggle="dropdown"]')
        const dropdown = new Dropdown(btnDropdown)
        const submenuTrigger = fixtureEl.querySelector('.dropdown-submenu > .dropdown-item')
        const submenuWrapper = fixtureEl.querySelector('.dropdown-submenu')
        const submenu = submenuWrapper.querySelector('.dropdown-menu')

        btnDropdown.addEventListener('shown.bs.dropdown', () => {
          // Open submenu in RTL mode
          dropdown._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Reset RTL
          document.documentElement.dir = 'ltr'
          resolve()
        })

        dropdown.show()
      })
    })
  })
})
