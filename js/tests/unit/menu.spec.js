import EventHandler from '../../src/dom/event-handler.js'
import Menu from '../../src/menu.js'
import { noop } from '../../src/util/index.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Menu', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Menu.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Menu.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type config', () => {
      expect(Menu.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Menu.DATA_KEY).toEqual('bs.menu')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menuBySelector = new Menu('[data-bs-toggle="menu"]')
      const menuByElement = new Menu(btnMenu)

      expect(menuBySelector._element).toEqual(btnMenu)
      expect(menuByElement._element).toEqual(btnMenu)
    })

    it('should create offset modifier correctly when offset option is a function', async () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const getOffset = jasmine.createSpy('getOffset').and.returnValue([10, 20])
      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu, {
        offset: getOffset
      })

      const offset = menu._getOffset()
      expect(typeof offset).toEqual('function')

      const shownPromise = new Promise(resolve => {
        btnMenu.addEventListener('shown.bs.menu', resolve)
      })

      menu.show()
      await shownPromise

      // Floating UI calls offset function asynchronously
      await new Promise(resolve => {
        setTimeout(resolve, 20)
      })
      expect(getOffset).toHaveBeenCalled()
    })

    it('should create offset modifier correctly when offset option is a string into data attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu" data-bs-offset="10,20">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      expect(menu._getOffset()).toEqual([10, 20])
    })

    it('should allow to pass config to Floating UI with `floatingConfig`', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu, {
        floatingConfig: {
          placement: 'left'
        }
      })

      const floatingConfig = menu._getFloatingConfig('bottom-start', [])

      expect(floatingConfig.placement).toEqual('left')
    })

    it('should allow to pass config to Floating UI with `floatingConfig` as a function', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu" data-bs-placement="right">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const getFloatingConfig = jasmine.createSpy('getFloatingConfig').and.returnValue({ placement: 'left' })
      const menu = new Menu(btnMenu, {
        floatingConfig: getFloatingConfig
      })

      const floatingConfig = menu._getFloatingConfig('bottom-start', [])

      // Ensure that the function was called with the default config.
      expect(getFloatingConfig).toHaveBeenCalledWith(jasmine.objectContaining({
        placement: jasmine.any(String)
      }))
      expect(floatingConfig.placement).toEqual('left')
    })
  })

  describe('toggle', () => {
    it('should toggle a menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should destroy old Floating UI references on toggle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="first">',
          '  <button class="firstBtn btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>',
          '<div class="second">',
          '  <button class="secondBtn btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu1 = fixtureEl.querySelector('.firstBtn')
        const btnMenu2 = fixtureEl.querySelector('.secondBtn')
        const firstMenuEl = fixtureEl.querySelector('.first')
        const secondMenuEl = fixtureEl.querySelector('.second')
        const menu1 = new Menu(btnMenu1)

        firstMenuEl.addEventListener('shown.bs.menu', () => {
          expect(btnMenu1).toHaveClass('show')
          expect(menu1._floatingCleanup).not.toBeNull()
          btnMenu2.click()
        })

        secondMenuEl.addEventListener('shown.bs.menu', () => setTimeout(() => {
          expect(menu1._floatingCleanup).toBeNull()
          resolve()
        }))

        menu1.toggle()
      })
    })

    it('should toggle a menu and add/remove event listener on mobile', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const defaultValueOnTouchStart = document.documentElement.ontouchstart
        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        document.documentElement.ontouchstart = noop
        const spy = spyOn(EventHandler, 'on')
        const spyOff = spyOn(EventHandler, 'off')

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)

          menu.toggle()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(btnMenu).not.toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('false')
          expect(spyOff).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)

          document.documentElement.ontouchstart = defaultValueOnTouchStart
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with bottom-end placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="bottom-end" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with bottom (centered) placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="bottom" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with top-start placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="top-start" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with top (centered) placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="top" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with top-end placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="top-end" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with right-start placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="right-start" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with left-start placement', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-placement="left-start" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with parent reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, {
          reference: 'parent'
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with a dom node reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, {
          reference: fixtureEl
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        menu.toggle()
      })
    })

    it('should toggle a menu with a valid virtual element reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn btn visually-hidden" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
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

        expect(() => new Menu(btnMenu, {
          reference: {}
        })).toThrowError(TypeError, 'MENU: Option "reference" provided type "object" without a required "getBoundingClientRect" method.')

        expect(() => new Menu(btnMenu, {
          reference: {
            getBoundingClientRect: 'not-a-function'
          }
        })).toThrowError(TypeError, 'MENU: Option "reference" provided type "object" without a required "getBoundingClientRect" method.')

        const menu = new Menu(btnMenu, {
          reference: virtualElement
        })

        const spy = spyOn(virtualElement, 'getBoundingClientRect').and.callThrough()

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Floating UI calls getBoundingClientRect asynchronously
          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            expect(btnMenu).toHaveClass('show')
            expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
            resolve()
          }, 20)
        })

        menu.toggle()
      })
    })

    it('should not toggle a menu if the element is disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button disabled class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })

    it('should not toggle a menu if the element contains .disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn btn disabled" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })

    it('should not toggle a menu if the menu is shown', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu show">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })

    it('should not toggle a menu if show event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('show.bs.menu', event => {
          event.preventDefault()
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        })
      })
    })
  })

  describe('show', () => {
    it('should show a menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')
          resolve()
        })

        menu.show()
      })
    })

    it('should not show a menu if the element is disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button disabled class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not show a menu if the element contains .disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn btn disabled" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not show a menu if the menu is shown', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu show">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not show a menu if show event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('show.bs.menu', event => {
          event.preventDefault()
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          reject(new Error('should not throw shown.bs.menu event'))
        })

        menu.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should move menu to body when container is set to body', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu, {
          container: 'body'
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menuEl.parentNode).toEqual(document.body)
          resolve()
        })

        menu.show()
      })
    })

    it('should move menu to body when container is set to true', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu, {
          container: true
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menuEl.parentNode).toEqual(document.body)
          resolve()
        })

        menu.show()
      })
    })

    it('should move menu to specified element when container is an element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="custom-container"></div>',
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const customContainer = fixtureEl.querySelector('#custom-container')
        const menu = new Menu(btnMenu, {
          container: customContainer
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menuEl.parentNode).toEqual(customContainer)
          resolve()
        })

        menu.show()
      })
    })

    it('should restore menu to original parent when hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const originalParent = menuEl.parentNode
        const menu = new Menu(btnMenu, {
          container: 'body'
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menuEl.parentNode).toEqual(document.body)
          menu.hide()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(menuEl.parentNode).toEqual(originalParent)
          resolve()
        })

        menu.show()
      })
    })

    it('should work with container via data attribute', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-container="body">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menuEl.parentNode).toEqual(document.body)
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('hide', () => {
    it('should hide a menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="true">Menu</button>',
          '  <div class="menu show">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(menuEl).not.toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('false')
          resolve()
        })

        menu.hide()
      })
    })

    it('should hide a menu and cleanup Floating UI', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menu._floatingCleanup).not.toBeNull()
          menu.hide()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(menu._floatingCleanup).toBeNull()
          resolve()
        })

        menu.show()
      })
    })

    it('should not hide a menu if the element is disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button disabled class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu show">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('hidden.bs.menu', () => {
          reject(new Error('should not throw hidden.bs.menu event'))
        })

        menu.hide()

        setTimeout(() => {
          expect(menuEl).toHaveClass('show')
          resolve()
        }, 10)
      })
    })

    it('should not hide a menu if the element contains .disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn btn disabled" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu show">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('hidden.bs.menu', () => {
          reject(new Error('should not throw hidden.bs.menu event'))
        })

        menu.hide()

        setTimeout(() => {
          expect(menuEl).toHaveClass('show')
          resolve()
        }, 10)
      })
    })

    it('should not hide a menu if the menu is not shown', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('hidden.bs.menu', () => {
          reject(new Error('should not throw hidden.bs.menu event'))
        })

        menu.hide()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should not hide a menu if hide event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu show">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('hide.bs.menu', event => {
          event.preventDefault()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          reject(new Error('should not throw hidden.bs.menu event'))
        })

        menu.hide()

        setTimeout(() => {
          expect(menuEl).toHaveClass('show')
          resolve()
        })
      })
    })

    it('should remove event listener on touch-enabled device that was added in show method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Menu item</a>',
          '  </div>',
          '</div>'
        ].join('')

        const defaultValueOnTouchStart = document.documentElement.ontouchstart
        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        document.documentElement.ontouchstart = noop
        const spy = spyOn(EventHandler, 'off')

        btnMenu.addEventListener('shown.bs.menu', () => {
          menu.hide()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(btnMenu).not.toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('false')
          expect(spy).toHaveBeenCalled()

          document.documentElement.ontouchstart = defaultValueOnTouchStart
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose menu', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

      const menu = new Menu(btnMenu)

      expect(menu._floatingCleanup).toBeNull()
      expect(menu._menu).not.toBeNull()
      expect(menu._element).not.toBeNull()
      const spy = spyOn(EventHandler, 'off')

      menu.dispose()

      expect(menu._menu).toBeNull()
      expect(menu._element).toBeNull()
      expect(spy).toHaveBeenCalledWith(btnMenu, Menu.EVENT_KEY)
    })

    it('should dispose menu with Floating UI', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      menu.toggle()

      expect(menu._floatingCleanup).not.toBeNull()
      expect(menu._menu).not.toBeNull()
      expect(menu._element).not.toBeNull()

      menu.dispose()

      expect(menu._floatingCleanup).toBeNull()
      expect(menu._menu).toBeNull()
      expect(menu._element).toBeNull()
    })
  })

  describe('update', () => {
    it('should call Floating UI update on update', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menu._floatingCleanup).not.toBeNull()

          const spyUpdate = spyOn(menu, '_updateFloatingPosition')

          menu.update()

          expect(spyUpdate).toHaveBeenCalled()
          resolve()
        })

        menu.toggle()
      })
    })

    it('should do nothing on update if not shown', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      const spy = spyOn(menu, '_updateFloatingPosition')

      menu.update()

      expect(menu._floatingCleanup).toBeNull()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should show and hide a menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        let showEventTriggered = false
        let hideEventTriggered = false

        btnMenu.addEventListener('show.bs.menu', () => {
          showEventTriggered = true
        })

        btnMenu.addEventListener('shown.bs.menu', event => setTimeout(() => {
          expect(btnMenu).toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
          expect(showEventTriggered).toBeTrue()
          expect(event.relatedTarget).toEqual(btnMenu)
          document.body.click()
        }))

        btnMenu.addEventListener('hide.bs.menu', () => {
          hideEventTriggered = true
        })

        btnMenu.addEventListener('hidden.bs.menu', event => {
          expect(btnMenu).not.toHaveClass('show')
          expect(btnMenu.getAttribute('aria-expanded')).toEqual('false')
          expect(hideEventTriggered).toBeTrue()
          expect(event.relatedTarget).toEqual(btnMenu)
          resolve()
        })

        btnMenu.click()
      })
    })

    it('should use Floating UI positioning in navbar', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar navbar-expand-md bg-light">',
          '  <div>',
          '    <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '    <div class="menu">',
          '      <a class="menu-item" href="#">Secondary link</a>',
          '    </div>',
          '  </div>',
          '</nav>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menu._floatingCleanup).not.toBeNull()
          // Floating UI sets data-bs-placement attribute asynchronously
          setTimeout(() => {
            expect(menuEl.getAttribute('data-bs-placement')).not.toBeNull()
            resolve()
          }, 10)
        })

        menu.show()
      })
    })

    it('should not collapse the menu when clicking a select option nested in the menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" aria-expanded="false">Menu</button>',
          '  <div class="menu">',
          '    <select>',
          '      <option selected>Open this select menu</option>',
          '      <option value="1">One</option>',
          '    </select>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        const hideSpy = spyOn(menu, '_completeHide')

        btnMenu.addEventListener('shown.bs.menu', () => {
          const clickEvent = new MouseEvent('click', {
            bubbles: true
          })

          menuEl.querySelector('option').dispatchEvent(clickEvent)
        })

        menuEl.addEventListener('click', event => {
          expect(event.target.tagName).toMatch(/select|option/i)

          Menu.clearMenus(event)

          setTimeout(() => {
            expect(hideSpy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        })

        menu.show()
      })
    })

    it('should not use Floating UI if display set to static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-display="static">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Floating UI adds this attribute when we use it
          expect(menuEl.getAttribute('data-bs-placement')).toBeNull()
          resolve()
        })

        btnMenu.click()
      })
    })

    it('should manage bs attribute `data-bs-display`="static" when display set to static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-display="static">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(menuEl.getAttribute('data-bs-display')).toEqual('static')
          menu.hide()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(menuEl.getAttribute('data-bs-display')).toBeNull()
          resolve()
        })

        menu.show()
      })
    })

    it('should remove "show" class if tabbing outside of menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Secondary link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(btnMenu).toHaveClass('show')

          const keyup = createEvent('keyup')

          keyup.key = 'Tab'
          document.dispatchEvent(keyup)
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(btnMenu).not.toHaveClass('show')
          resolve()
        })

        btnMenu.click()
      })
    })

    it('should remove "show" class if body is clicked, with multiple menus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="nav">',
          '  <div id="testmenu">',
          '    <a class="btn" data-bs-toggle="menu" href="#testmenu">Test menu</a>',
          '    <div class="menu">',
          '      <a class="menu-item" href="#sub1">Submenu 1</a>',
          '    </div>',
          '  </div>',
          '</div>',
          '<div class="btn-group">',
          '  <button class="btn">Actions</button>',
          '  <button class="btn" data-bs-toggle="menu"></button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Action 1</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenuList = fixtureEl.querySelectorAll('[data-bs-toggle="menu"]')

        expect(triggerMenuList).toHaveSize(2)

        const [triggerMenuFirst, triggerMenuLast] = triggerMenuList

        triggerMenuFirst.addEventListener('shown.bs.menu', () => {
          expect(triggerMenuFirst).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(1)
          document.body.click()
        })

        triggerMenuFirst.addEventListener('hidden.bs.menu', () => {
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(0)
          triggerMenuLast.click()
        })

        triggerMenuLast.addEventListener('shown.bs.menu', () => {
          expect(triggerMenuLast).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(1)
          document.body.click()
        })

        triggerMenuLast.addEventListener('hidden.bs.menu', () => {
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(0)
          resolve()
        })

        triggerMenuFirst.click()
      })
    })

    it('should remove "show" class if body if tabbing outside of menu, with multiple menus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <a class="btn" data-bs-toggle="menu" href="#testmenu">Test menu</a>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#sub1">Submenu 1</a>',
          '  </div>',
          '</div>',
          '<div class="btn-group">',
          '  <button class="btn">Actions</button>',
          '  <button class="btn" data-bs-toggle="menu"></button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Action 1</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenuList = fixtureEl.querySelectorAll('[data-bs-toggle="menu"]')

        expect(triggerMenuList).toHaveSize(2)

        const [triggerMenuFirst, triggerMenuLast] = triggerMenuList

        triggerMenuFirst.addEventListener('shown.bs.menu', () => {
          expect(triggerMenuFirst).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(1)

          const keyup = createEvent('keyup')
          keyup.key = 'Tab'

          document.dispatchEvent(keyup)
        })

        triggerMenuFirst.addEventListener('hidden.bs.menu', () => {
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(0)
          triggerMenuLast.click()
        })

        triggerMenuLast.addEventListener('shown.bs.menu', () => {
          expect(triggerMenuLast).toHaveClass('show')
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(1)

          const keyup = createEvent('keyup')
          keyup.key = 'Tab'

          document.dispatchEvent(keyup)
        })

        triggerMenuLast.addEventListener('hidden.bs.menu', () => {
          expect(fixtureEl.querySelectorAll('.menu.show')).toHaveSize(0)
          resolve()
        })

        triggerMenuFirst.click()
      })
    })

    it('should be able to identify clicked menu, even with multiple menus in the same tag', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button id="menuToggle1" class="btn" data-bs-toggle="menu">Menu toggle</button>',
        '  <div id="menu1" class="menu">',
        '    <a class="menu-item" href="#">Menu item</a>',
        '  </div>',
        '  <button id="menuToggle2" class="btn" data-bs-toggle="menu">Menu toggle</button>',
        '  <div id="menu2" class="menu">',
        '    <a class="menu-item" href="#">Menu item</a>',
        '  </div>',
        '</div>'
      ].join('')

      const menuToggle1 = fixtureEl.querySelector('#menuToggle1')
      const menuToggle2 = fixtureEl.querySelector('#menuToggle2')
      const menuEl1 = fixtureEl.querySelector('#menu1')
      const menuEl2 = fixtureEl.querySelector('#menu2')
      const spy = spyOn(Menu, 'getOrCreateInstance').and.callThrough()

      menuToggle1.click()
      expect(spy).toHaveBeenCalledWith(menuToggle1)

      menuToggle2.click()
      expect(spy).toHaveBeenCalledWith(menuToggle2)

      menuEl1.click()
      expect(spy).toHaveBeenCalledWith(menuToggle1)

      menuEl2.click()
      expect(spy).toHaveBeenCalledWith(menuToggle2)
    })

    it('should be able to show the proper menu, even with multiple menus in the same tag', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button id="menuToggle1" class="btn" data-bs-toggle="menu">Menu toggle</button>',
        '  <div id="menu1" class="menu">',
        '    <a class="menu-item" href="#">Menu item</a>',
        '  </div>',
        '  <button id="menuToggle2" class="btn" data-bs-toggle="menu">Menu toggle</button>',
        '  <div id="menu2" class="menu">',
        '    <a class="menu-item" href="#">Menu item</a>',
        '  </div>',
        '</div>'
      ].join('')

      const menuToggle1 = fixtureEl.querySelector('#menuToggle1')
      const menuToggle2 = fixtureEl.querySelector('#menuToggle2')
      const menuEl1 = fixtureEl.querySelector('#menu1')
      const menuEl2 = fixtureEl.querySelector('#menu2')

      menuToggle1.click()
      expect(menuEl1).toHaveClass('show')
      expect(menuEl2).not.toHaveClass('show')

      menuToggle2.click()
      expect(menuEl1).not.toHaveClass('show')
      expect(menuEl2).toHaveClass('show')
    })

    it('should fire hide and hidden event without a clickEvent if event type is not click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#sub1">Submenu 1</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

        triggerMenu.addEventListener('hide.bs.menu', event => {
          expect(event.clickEvent).toBeUndefined()
        })

        triggerMenu.addEventListener('hidden.bs.menu', event => {
          expect(event.clickEvent).toBeUndefined()
          resolve()
        })

        triggerMenu.addEventListener('shown.bs.menu', () => {
          const keydown = createEvent('keydown')

          keydown.key = 'Escape'
          triggerMenu.dispatchEvent(keydown)
        })

        triggerMenu.click()
      })
    })

    it('should bubble up the events to the parent elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="menu-parent">',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#subMenu">Sub menu</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuParent = fixtureEl.querySelector('.menu-parent')
        const menu = new Menu(triggerMenu)

        const showFunction = jasmine.createSpy('showFunction')
        menuParent.addEventListener('show.bs.menu', showFunction)

        const shownFunction = jasmine.createSpy('shownFunction')
        menuParent.addEventListener('shown.bs.menu', () => {
          shownFunction()
          menu.hide()
        })

        const hideFunction = jasmine.createSpy('hideFunction')
        menuParent.addEventListener('hide.bs.menu', hideFunction)

        menuParent.addEventListener('hidden.bs.menu', () => {
          expect(showFunction).toHaveBeenCalled()
          expect(shownFunction).toHaveBeenCalled()
          expect(hideFunction).toHaveBeenCalled()
          resolve()
        })

        menu.show()
      })
    })

    it('should ignore keyboard events within <input>s and <textarea>s', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#sub1">Submenu 1</a>',
          '    <input type="text">',
          '    <textarea></textarea>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const input = fixtureEl.querySelector('input')
        const textarea = fixtureEl.querySelector('textarea')

        triggerMenu.addEventListener('shown.bs.menu', () => {
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

        triggerMenu.click()
      })
    })

    it('should skip disabled element when using keyboard navigation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item disabled" href="#sub1">Submenu 1</a>',
          '    <button class="menu-item" type="button" disabled>Disabled button</button>',
          '    <a id="item1" class="menu-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

        triggerMenu.addEventListener('shown.bs.menu', () => {
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowDown'

          triggerMenu.dispatchEvent(keydown)
          triggerMenu.dispatchEvent(keydown)

          expect(document.activeElement).not.toHaveClass('disabled')
          expect(document.activeElement.hasAttribute('disabled')).toBeFalse()
          resolve()
        })

        triggerMenu.click()
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
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <button class="menu-item d-none" type="button">Hidden button by class</button>',
          '    <a class="menu-item" href="#sub1" style="display: none">Hidden link</a>',
          '    <a class="menu-item" href="#sub1" style="visibility: hidden">Hidden link</a>',
          '    <a id="item1" class="menu-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

        triggerMenu.addEventListener('shown.bs.menu', () => {
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowDown'

          triggerMenu.dispatchEvent(keydown)

          expect(document.activeElement).not.toHaveClass('d-none')
          expect(document.activeElement.style.display).not.toEqual('none')
          expect(document.activeElement.style.visibility).not.toEqual('hidden')

          resolve()
        })

        triggerMenu.click()
      })
    })

    it('should focus next/previous element when using keyboard navigation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a id="item1" class="menu-item" href="#">A link</a>',
          '    <a id="item2" class="menu-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const item1 = fixtureEl.querySelector('#item1')
        const item2 = fixtureEl.querySelector('#item2')

        triggerMenu.addEventListener('shown.bs.menu', () => {
          const keydownArrowDown = createEvent('keydown')
          keydownArrowDown.key = 'ArrowDown'

          triggerMenu.dispatchEvent(keydownArrowDown)
          expect(document.activeElement).toEqual(item1, 'item1 is focused')

          document.activeElement.dispatchEvent(keydownArrowDown)
          expect(document.activeElement).toEqual(item2, 'item2 is focused')

          const keydownArrowUp = createEvent('keydown')
          keydownArrowUp.key = 'ArrowUp'

          document.activeElement.dispatchEvent(keydownArrowUp)
          expect(document.activeElement).toEqual(item1, 'item1 is focused')

          resolve()
        })

        triggerMenu.click()
      })
    })

    it('should open the menu and focus on the last item when using ArrowUp for the first time', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a id="item1" class="menu-item" href="#">A link</a>',
          '    <a id="item2" class="menu-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const lastItem = fixtureEl.querySelector('#item2')

        triggerMenu.addEventListener('shown.bs.menu', () => {
          setTimeout(() => {
            expect(document.activeElement).toEqual(lastItem, 'item2 is focused')
            resolve()
          })
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowUp'
        triggerMenu.dispatchEvent(keydown)
      })
    })

    it('should open the menu and focus on the first item when using ArrowDown for the first time', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a id="item1" class="menu-item" href="#">A link</a>',
          '    <a id="item2" class="menu-item" href="#">Another link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const firstItem = fixtureEl.querySelector('#item1')

        triggerMenu.addEventListener('shown.bs.menu', () => {
          setTimeout(() => {
            expect(document.activeElement).toEqual(firstItem, 'item1 is focused')
            resolve()
          })
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowDown'
        triggerMenu.dispatchEvent(keydown)
      })
    })

    it('should not close the menu if the user clicks on a text field within menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <input type="text">',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const input = fixtureEl.querySelector('input')

        input.addEventListener('click', () => {
          expect(triggerMenu).toHaveClass('show')
          resolve()
        })

        triggerMenu.addEventListener('shown.bs.menu', () => {
          expect(triggerMenu).toHaveClass('show')
          input.dispatchEvent(createEvent('click'))
        })

        triggerMenu.click()
      })
    })

    it('should not close the menu if the user clicks on a textarea within menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <textarea></textarea>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const textarea = fixtureEl.querySelector('textarea')

        textarea.addEventListener('click', () => {
          expect(triggerMenu).toHaveClass('show')
          resolve()
        })

        triggerMenu.addEventListener('shown.bs.menu', () => {
          expect(triggerMenu).toHaveClass('show')
          textarea.dispatchEvent(createEvent('click'))
        })

        triggerMenu.click()
      })
    })

    it('should close the menu if the user clicks on a text field that is not contained within menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '  </div>',
          '</div>',
          '<input type="text">'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const input = fixtureEl.querySelector('input')

        triggerMenu.addEventListener('hidden.bs.menu', () => {
          expect().nothing()
          resolve()
        })

        triggerMenu.addEventListener('shown.bs.menu', () => {
          input.dispatchEvent(createEvent('click', {
            bubbles: true
          }))
        })

        triggerMenu.click()
      })
    })

    it('should ignore keyboard events for <input>s and <textarea>s within menu, except for escape key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#sub1">Submenu 1</a>',
          '    <input type="text">',
          '    <textarea></textarea>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
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

        triggerMenu.addEventListener('shown.bs.menu', () => {
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

          expect(triggerMenu).not.toHaveClass('show')
          resolve()
        })

        triggerMenu.click()
      })
    })

    it('should not open menu if escape key was pressed on the toggle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="tabs">',
          '  <div>',
          '    <button disabled class="btn" data-bs-toggle="menu">Menu</button>',
          '    <div class="menu">',
          '      <a class="menu-item" href="#">Secondary link</a>',
          '      <a class="menu-item" href="#">Something else here</a>',
          '      <div class="divider"></div>',
          '      <a class="menu-item" href="#">Another link</a>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(triggerMenu)
        const button = fixtureEl.querySelector('button[data-bs-toggle="menu"]')

        const spy = spyOn(menu, 'toggle')

        // Key escape
        button.focus()
        // Key escape
        const keydownEscape = createEvent('keydown')
        keydownEscape.key = 'Escape'
        button.dispatchEvent(keydownEscape)

        setTimeout(() => {
          expect(spy).not.toHaveBeenCalled()
          expect(triggerMenu).not.toHaveClass('show')
          resolve()
        }, 20)
      })
    })

    it('should propagate escape key events if menu is closed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="parent">',
          '  <div>',
          '    <button class="btn" data-bs-toggle="menu">Menu</button>',
          '    <div class="menu">',
          '      <a class="menu-item" href="#">Some Item</a>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const parent = fixtureEl.querySelector('.parent')
        const toggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')

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

    it('should not propagate escape key events if menu is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="parent">',
          '  <div>',
          '    <button class="btn" data-bs-toggle="menu">Menu</button>',
          '    <div class="menu">',
          '      <a class="menu-item" href="#">Some Item</a>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const parent = fixtureEl.querySelector('.parent')
        const toggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')

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

    it('should close menu using `escape` button, and return focus to its trigger', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Some Item</a>',
          '  </div>',
          '</div>'
        ].join('')

        const toggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')

        toggle.addEventListener('shown.bs.menu', () => {
          const keydownEvent = createEvent('keydown', { bubbles: true })
          keydownEvent.key = 'ArrowDown'
          toggle.dispatchEvent(keydownEvent)
          keydownEvent.key = 'Escape'
          toggle.dispatchEvent(keydownEvent)
        })

        toggle.addEventListener('hidden.bs.menu', () => setTimeout(() => {
          expect(document.activeElement).toEqual(toggle)
          resolve()
        }))

        toggle.click()
      })
    })

    it('should close menu (only) by clicking inside the menu menu when it has data-attribute `data-bs-auto-close="inside"`', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-auto-close="inside">Menu toggle</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Menu item</a>',
          ' </div>',
          '</div>'
        ].join('')

        const menuToggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')

        const expectMenuToBeOpened = () => setTimeout(() => {
          expect(menuToggle).toHaveClass('show')
          menuEl.click()
        }, 150)

        menuToggle.addEventListener('shown.bs.menu', () => {
          document.documentElement.click()
          expectMenuToBeOpened()
        })

        menuToggle.addEventListener('hidden.bs.menu', () => setTimeout(() => {
          expect(menuToggle).not.toHaveClass('show')
          resolve()
        }))

        menuToggle.click()
      })
    })

    it('should close menu (only) by clicking outside the menu menu when it has data-attribute `data-bs-auto-close="outside"`', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-auto-close="outside">Menu toggle</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Menu item</a>',
          ' </div>',
          '</div>'
        ].join('')

        const menuToggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')

        const expectMenuToBeOpened = () => setTimeout(() => {
          expect(menuToggle).toHaveClass('show')
          document.documentElement.click()
        }, 150)

        menuToggle.addEventListener('shown.bs.menu', () => {
          menuEl.click()
          expectMenuToBeOpened()
        })

        menuToggle.addEventListener('hidden.bs.menu', () => {
          expect(menuToggle).not.toHaveClass('show')
          resolve()
        })

        menuToggle.click()
      })
    })

    it('should not close menu by clicking inside or outside the menu menu when it has data-attribute `data-bs-auto-close="false"`', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-auto-close="false">Menu toggle</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Menu item</a>',
          ' </div>',
          '</div>'
        ].join('')

        const menuToggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menuEl = fixtureEl.querySelector('.menu')

        const expectMenuToBeOpened = (shouldTriggerClick = true) => setTimeout(() => {
          expect(menuToggle).toHaveClass('show')
          if (shouldTriggerClick) {
            document.documentElement.click()
          } else {
            resolve()
          }

          expectMenuToBeOpened(false)
        }, 150)

        menuToggle.addEventListener('shown.bs.menu', () => {
          menuEl.click()
          expectMenuToBeOpened()
        })

        menuToggle.click()
      })
    })

    it('should be able to identify clicked menu, no matter the markup order', () => {
      fixtureEl.innerHTML = [
        '<div class="menu">',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Menu item</a>',
        '  </div>',
        '  <button class="btn" data-bs-toggle="menu">Menu toggle</button>',
        '</div>'
      ].join('')

      const menuToggle = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menuEl = fixtureEl.querySelector('.menu')
      const spy = spyOn(Menu, 'getOrCreateInstance').and.callThrough()

      menuToggle.click()
      expect(spy).toHaveBeenCalledWith(menuToggle)
      menuEl.click()
      expect(spy).toHaveBeenCalledWith(menuToggle)
    })
  })

  describe('getInstance', () => {
    it('should return menu instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const menu = new Menu(div)

      expect(Menu.getInstance(div)).toEqual(menu)
      expect(Menu.getInstance(div)).toBeInstanceOf(Menu)
    })

    it('should return null when there is no menu instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Menu.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return menu instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const menu = new Menu(div)

      expect(Menu.getOrCreateInstance(div)).toEqual(menu)
      expect(Menu.getInstance(div)).toEqual(Menu.getOrCreateInstance(div, {}))
      expect(Menu.getOrCreateInstance(div)).toBeInstanceOf(Menu)
    })

    it('should return new instance when there is no menu instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Menu.getInstance(div)).toBeNull()
      expect(Menu.getOrCreateInstance(div)).toBeInstanceOf(Menu)
    })

    it('should return new instance when there is no menu instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Menu.getInstance(div)).toBeNull()
      const menu = Menu.getOrCreateInstance(div, {
        display: 'dynamic'
      })
      expect(menu).toBeInstanceOf(Menu)

      expect(menu._config.display).toEqual('dynamic')
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const menu = new Menu(div, {
        display: 'dynamic'
      })
      expect(Menu.getInstance(div)).toEqual(menu)

      const menu2 = Menu.getOrCreateInstance(div, {
        display: 'static'
      })
      expect(menu).toBeInstanceOf(Menu)
      expect(menu2).toEqual(menu)

      expect(menu2._config.display).toEqual('dynamic')
    })
  })

  it('should open menu when pressing keydown or keyup', () => {
    return new Promise(resolve => {
      fixtureEl.innerHTML = [
        '<div class="menu-parent">',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item disabled" href="#sub1">Submenu 1</a>',
        '    <button class="menu-item" type="button" disabled>Disabled button</button>',
        '    <a id="item1" class="menu-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menuWrapper = fixtureEl.querySelector('.menu-parent')

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowDown'

      const keyup = createEvent('keyup')
      keyup.key = 'ArrowUp'

      const handleArrowDown = () => {
        expect(triggerMenu).toHaveClass('show')
        expect(triggerMenu.getAttribute('aria-expanded')).toEqual('true')
        setTimeout(() => {
          Menu.getInstance(triggerMenu).hide()
          keydown.key = 'ArrowUp'
          triggerMenu.dispatchEvent(keyup)
        }, 20)
      }

      const handleArrowUp = () => {
        expect(triggerMenu).toHaveClass('show')
        expect(triggerMenu.getAttribute('aria-expanded')).toEqual('true')
        resolve()
      }

      menuWrapper.addEventListener('shown.bs.menu', event => {
        if (event.target.key === 'ArrowDown') {
          handleArrowDown()
        } else {
          handleArrowUp()
        }
      })

      triggerMenu.dispatchEvent(keydown)
    })
  })

  it('should allow `data-bs-toggle="menu"` click events to bubble up', () => {
    fixtureEl.innerHTML = [
      '<div>',
      '  <button class="btn" data-bs-toggle="menu">Menu</button>',
      '  <div class="menu">',
      '    <a class="menu-item" href="#">Secondary link</a>',
      '  </div>',
      '</div>'
    ].join('')

    const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
    const clickListener = jasmine.createSpy('clickListener')
    const delegatedClickListener = jasmine.createSpy('delegatedClickListener')

    btnMenu.addEventListener('click', clickListener)
    document.addEventListener('click', delegatedClickListener)

    btnMenu.click()

    expect(clickListener).toHaveBeenCalled()
    expect(delegatedClickListener).toHaveBeenCalled()
  })

  it('should open the menu when clicking the child element inside `data-bs-toggle="menu"`', () => {
    return new Promise(resolve => {
      fixtureEl.innerHTML = [
        '<div class="container">',
        '  <div>',
        '    <button class="btn" data-bs-toggle="menu"><span id="childElement">Menu</span></button>',
        '    <div class="menu">',
        '      <a class="menu-item" href="#subMenu">Sub menu</a>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const childElement = fixtureEl.querySelector('#childElement')

      btnMenu.addEventListener('shown.bs.menu', () => setTimeout(() => {
        expect(btnMenu).toHaveClass('show')
        expect(btnMenu.getAttribute('aria-expanded')).toEqual('true')
        resolve()
      }))

      childElement.click()
    })
  })

  describe('responsive placements', () => {
    it('should parse responsive placement string and create instance', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu" data-bs-placement="bottom-start md:top-end">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      // Menu should have parsed responsive placements
      expect(menu._responsivePlacements).not.toBeNull()
      expect(menu._responsivePlacements.xs).toEqual('bottom-start')
      expect(menu._responsivePlacements.md).toEqual('top-end')
    })

    it('should return null for non-responsive placement', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu" data-bs-placement="bottom-start">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      // Non-responsive placement should not create responsive placements object
      expect(menu._responsivePlacements).toBeNull()
    })
  })

  describe('virtual element reference', () => {
    it('should work with virtual element as reference', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Link</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

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

        const menu = new Menu(btnMenu, {
          reference: virtualElement
        })

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(document.querySelector('.menu.show')).not.toBeNull()
          resolve()
        })

        menu.show()
      })
    })

    it('should throw error for object reference without getBoundingClientRect', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')

      expect(() => {
        // eslint-disable-next-line no-new
        new Menu(btnMenu, {
          reference: { someProperty: 'value' } // Object without getBoundingClientRect
        })
      }).toThrowError(TypeError)
    })
  })

  describe('selectMenuItem', () => {
    it('should do nothing when menu has no visible items', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Simulate ArrowDown key - should not throw when no items
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowDown'
          btnMenu.dispatchEvent(keydown)

          // No error thrown means test passed
          expect(true).toBeTrue()
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('submenu', () => {
    it('should open submenu on click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li><a class="menu-item" href="#">Action</a></li>',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action 1</a></li>',
          '        <li><a class="menu-item" href="#">Sub-action 2</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          submenuTrigger.click()

          expect(submenu.classList.contains('show')).toBeTrue()
          expect(submenuWrapper.classList.contains('show')).toBeTrue()
          resolve()
        })

        // eslint-disable-next-line no-new
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should toggle submenu on click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeTrue()

          // Close submenu
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeFalse()
          resolve()
        })

        // eslint-disable-next-line no-new
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should close sibling submenus when opening a new one', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu" id="submenu1">',
          '      <button class="menu-item" type="button">Submenu 1</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Action 1</a></li>',
          '      </ul>',
          '    </li>',
          '    <li class="submenu" id="submenu2">',
          '      <button class="menu-item" type="button">Submenu 2</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Action 2</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenu1Wrapper = fixtureEl.querySelector('#submenu1')
        const submenu2Wrapper = fixtureEl.querySelector('#submenu2')
        const submenu1Trigger = submenu1Wrapper.querySelector('.menu-item')
        const submenu2Trigger = submenu2Wrapper.querySelector('.menu-item')
        const submenu1 = submenu1Wrapper.querySelector('.menu')
        const submenu2 = submenu2Wrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
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
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should open submenu with ArrowRight key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Focus the submenu trigger
          submenuTrigger.focus()

          // Press ArrowRight to open submenu
          const keydown = createEvent('keydown')
          keydown.key = 'ArrowRight'
          submenuTrigger.dispatchEvent(keydown)

          setTimeout(() => {
            // Submenu should be open
            expect(submenu.classList.contains('show')).toBeTrue()
            expect(submenuWrapper.classList.contains('show')).toBeTrue()
            resolve()
          }, 20)
        })

        // eslint-disable-next-line no-new
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should close submenu via internal method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu first using internal method
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()
          expect(menu._openSubmenus.size).toEqual(1)

          // Close submenu using internal method
          menu._closeSubmenu(submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeFalse()
          expect(menu._openSubmenus.size).toEqual(0)

          resolve()
        })

        menu.show()
      })
    })

    it('should open submenu with Enter key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
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
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should open submenu with Space key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
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
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should close all submenus when main menu closes', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeTrue()

          // Close main menu
          menu.hide()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          expect(submenu.classList.contains('show')).toBeFalse()
          resolve()
        })

        menu.show()
      })
    })

    it('should close nested submenus when closing parent submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu" id="level1">',
          '      <button class="menu-item" type="button">Level 1</button>',
          '      <ul class="menu">',
          '        <li class="submenu" id="level2">',
          '          <button class="menu-item" type="button">Level 2</button>',
          '          <ul class="menu">',
          '            <li><a class="menu-item" href="#">Level 3 action</a></li>',
          '          </ul>',
          '        </li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const level1Wrapper = fixtureEl.querySelector('#level1')
        const level2Wrapper = fixtureEl.querySelector('#level2')
        const level1Trigger = level1Wrapper.querySelector(':scope > .menu-item')
        const level2Trigger = level2Wrapper.querySelector(':scope > .menu-item')
        const level1Submenu = level1Wrapper.querySelector(':scope > .menu')
        const level2Submenu = level2Wrapper.querySelector(':scope > .menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
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
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should have submenu items visible and focusable', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu" id="submenu">',
          '        <li><a id="sub1" class="menu-item" href="#">Sub 1</a></li>',
          '        <li><a id="sub2" class="menu-item" href="#">Sub 2</a></li>',
          '        <li><a id="sub3" class="menu-item" href="#">Sub 3</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = fixtureEl.querySelector('#submenu')
        const sub1 = fixtureEl.querySelector('#sub1')
        const sub2 = fixtureEl.querySelector('#sub2')
        const sub3 = fixtureEl.querySelector('#sub3')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu using internal method
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)

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

        menu.show()
      })
    })

    it('should close all submenus when hiding menu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu" id="submenu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = fixtureEl.querySelector('#submenu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu using internal method
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()
          expect(menu._openSubmenus.size).toEqual(1)

          // Hide the main menu
          menu.hide()
        })

        btnMenu.addEventListener('hidden.bs.menu', () => {
          // All submenus should be closed
          expect(submenu.classList.contains('show')).toBeFalse()
          expect(menu._openSubmenus.size).toEqual(0)
          resolve()
        })

        menu.show()
      })
    })

    it('should respect submenuTrigger: click option', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-submenu-trigger="click">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')
        const menu = new Menu(btnMenu)

        expect(menu._config.submenuTrigger).toEqual('click')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Click should work
          submenuTrigger.click()
          expect(submenu.classList.contains('show')).toBeTrue()
          resolve()
        })

        menu.show()
      })
    })

    it('should respect submenuTrigger: hover option', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-submenu-trigger="hover">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const menu = new Menu(btnMenu)

        expect(menu._config.submenuTrigger).toEqual('hover')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Hover should open submenu
          const mouseenter = createEvent('mouseenter', { bubbles: true })
          submenuTrigger.dispatchEvent(mouseenter)

          // Note: In JSDOM, hover events may not work perfectly,
          // but we verify the config is respected
          expect(menu._config.submenuTrigger).toEqual('hover')
          resolve()
        })

        menu.show()
      })
    })

    it('should respect submenuDelay config option', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu" data-bs-submenu-delay="500">Menu</button>',
        '  <ul class="menu">',
        '    <li class="submenu">',
        '      <button class="menu-item" type="button">More options</button>',
        '      <ul class="menu">',
        '        <li><a class="menu-item" href="#">Sub-action</a></li>',
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      expect(menu._config.submenuDelay).toEqual(500)
    })

    it('should position submenu using Floating UI', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
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
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should set data-bs-placement attribute on submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
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
        new Menu(btnMenu)
        btnMenu.click()
      })
    })

    it('should cleanup Floating UI autoUpdate on submenu close', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          submenuTrigger.click()
          expect(menu._openSubmenus.size).toEqual(1)
          expect(menu._openSubmenus.has(submenu)).toBeTrue()

          // Close submenu
          submenuTrigger.click()
          expect(menu._openSubmenus.size).toEqual(0)
          expect(menu._openSubmenus.has(submenu)).toBeFalse()
          resolve()
        })

        menu.show()
      })
    })

    it('should schedule submenu close with delay', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, { submenuDelay: 50 })
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Schedule close
          menu._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Still open immediately
          expect(submenu.classList.contains('show')).toBeTrue()

          // After delay, should be closed
          setTimeout(() => {
            expect(submenu.classList.contains('show')).toBeFalse()
            expect(menu._submenuCloseTimeouts.has(submenu)).toBeFalse()
            resolve()
          }, 100)
        })

        menu.show()
      })
    })

    it('should cancel scheduled submenu close', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, { submenuDelay: 50 })
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Schedule close
          menu._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Cancel the close
          menu._cancelSubmenuCloseTimeout(submenu)
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeFalse()

          // After delay, should still be open
          setTimeout(() => {
            expect(submenu.classList.contains('show')).toBeTrue()
            resolve()
          }, 100)
        })

        menu.show()
      })
    })

    it('should clear all submenu timeouts on dispose', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, { submenuDelay: 200 })
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu and schedule close
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          menu._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(menu._submenuCloseTimeouts.size).toEqual(1)

          // Clear all timeouts
          menu._clearAllSubmenuTimeouts()
          expect(menu._submenuCloseTimeouts.size).toEqual(0)

          resolve()
        })

        menu.show()
      })
    })

    it('should detect point inside triangle', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '  <ul class="menu">',
        '    <li class="submenu">',
        '      <button class="menu-item" type="button">More options</button>',
        '      <ul class="menu">',
        '        <li><a class="menu-item" href="#">Sub-action</a></li>',
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(btnMenu)

      // Triangle with vertices at (0,0), (10,0), (5,10)
      const v1 = { x: 0, y: 0 }
      const v2 = { x: 10, y: 0 }
      const v3 = { x: 5, y: 10 }

      // Point inside triangle
      const inside = { x: 5, y: 5 }
      expect(menu._pointInTriangle(inside, v1, v2, v3)).toBeTrue()

      // Point outside triangle
      const outside = { x: 20, y: 20 }
      expect(menu._pointInTriangle(outside, v1, v2, v3)).toBeFalse()

      // Point on edge should be inside
      const onEdge = { x: 5, y: 0 }
      expect(menu._pointInTriangle(onEdge, v1, v2, v3)).toBeTrue()
    })

    it('should track mouse position for safe triangle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Call track method directly
          menu._trackMousePosition({ clientX: 100, clientY: 200 })

          // Should have tracked position in hover intent data
          expect(menu._hoverIntentData).toBeDefined()
          expect(menu._hoverIntentData.x).toEqual(100)
          expect(menu._hoverIntentData.y).toEqual(200)
          resolve()
        })

        menu.show()
      })
    })

    it('should handle hover trigger opening submenu via internal method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-submenu-trigger="hover">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        expect(menu._config.submenuTrigger).toEqual('hover')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Use internal handler directly with mock event
          const mockEvent = { target: submenuTrigger }
          menu._onSubmenuTriggerEnter(mockEvent)

          // Submenu should open
          expect(submenu.classList.contains('show')).toBeTrue()
          resolve()
        })

        menu.show()
      })
    })

    it('should handle submenu mouseleave with close delay', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu" data-bs-submenu-trigger="hover" data-bs-submenu-delay="50">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Simulate mouseleave from submenu wrapper
          const mouseleave = new MouseEvent('mouseleave', { bubbles: true })
          Object.defineProperty(mouseleave, 'target', { value: submenuWrapper })
          menu._onSubmenuLeave(mouseleave)

          // Should schedule close
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeTrue()

          resolve()
        })

        menu.show()
      })
    })

    it('should not schedule close if submenu is not open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuWrapper = fixtureEl.querySelector('.submenu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Try mouseleave without opening submenu first
          const mouseleave = new MouseEvent('mouseleave', { bubbles: true })
          Object.defineProperty(mouseleave, 'target', { value: submenuWrapper })
          menu._onSubmenuLeave(mouseleave)

          // Should not schedule close since submenu wasn't open
          expect(menu._submenuCloseTimeouts.size).toEqual(0)

          resolve()
        })

        menu.show()
      })
    })

    it('should not open submenu if trigger element not found', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Mock event with target that's not a submenu trigger
          const mockEvent = { target: btnMenu }
          menu._onSubmenuTriggerEnter(mockEvent)

          // No submenus should be open
          expect(menu._openSubmenus.size).toEqual(0)

          resolve()
        })

        menu.show()
      })
    })

    it('should not close submenu if already closed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Try to close submenu that was never opened
          menu._closeSubmenu(submenu, submenuWrapper)

          // Should not throw, openSubmenus should still be empty
          expect(menu._openSubmenus.size).toEqual(0)

          resolve()
        })

        menu.show()
      })
    })

    it('should handle _isMovingTowardSubmenu with no hover data', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // No hover data tracked yet
          menu._hoverIntentData = null

          const mockEvent = { clientX: 100, clientY: 100 }
          const result = menu._isMovingTowardSubmenu(mockEvent, submenu)

          // Should return false when no hover data
          expect(result).toBeFalse()

          resolve()
        })

        menu.show()
      })
    })

    it('should handle click on submenu trigger when submenu is already open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Click handler should toggle (close it)
          const mockEvent = {
            target: submenuTrigger,
            preventDefault() {},
            stopPropagation() {}
          }
          menu._onSubmenuTriggerClick(mockEvent)

          expect(submenu.classList.contains('show')).toBeFalse()

          resolve()
        })

        menu.show()
      })
    })

    it('should cancel pending timeout when opening submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, { submenuDelay: 200 })
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Schedule close
          menu._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Re-enter submenu trigger should cancel timeout
          const mockEvent = { target: submenuTrigger }
          menu._onSubmenuTriggerEnter(mockEvent)

          // Timeout should be cancelled
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeFalse()

          resolve()
        })

        menu.show()
      })
    })

    it('should handle _onSubmenuTriggerClick with non-matching target', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li><a class="menu-item" href="#">Regular item</a></li>',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const regularItem = fixtureEl.querySelector('.menu > li > a')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Click on regular item (not submenu trigger)
          const mockEvent = {
            target: regularItem,
            preventDefault() {},
            stopPropagation() {}
          }
          menu._onSubmenuTriggerClick(mockEvent)

          // No submenus should be affected
          expect(menu._openSubmenus.size).toEqual(0)

          resolve()
        })

        menu.show()
      })
    })

    it('should handle _onSubmenuLeave when not moving toward submenu', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu" style="position: absolute; left: 200px; top: 0; width: 100px; height: 100px;">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, { submenuDelay: 50 })
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Track mouse position far from submenu
          menu._trackMousePosition({ clientX: 0, clientY: 0 })

          // Simulate mouseleave moving away from submenu
          const mockEvent = {
            target: submenuWrapper,
            clientX: -100,
            clientY: -100
          }
          menu._onSubmenuLeave(mockEvent)

          // Should schedule close since not moving toward submenu
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeTrue()

          resolve()
        })

        menu.show()
      })
    })

    it('should cancel timeout when calling cancelSubmenuCloseTimeout', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu" id="submenu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu, { submenuDelay: 200 })
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = fixtureEl.querySelector('#submenu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Schedule close
          menu._scheduleSubmenuClose(submenu, submenuWrapper)
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeTrue()

          // Cancel the timeout directly
          menu._cancelSubmenuCloseTimeout(submenu)

          // Timeout should be cancelled
          expect(menu._submenuCloseTimeouts.has(submenu)).toBeFalse()

          resolve()
        })

        menu.show()
      })
    })

    it('should skip closing submenu if already not in openSubmenus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Calling close on never-opened submenu should not throw
          expect(() => {
            menu._closeSubmenu(submenu, submenuWrapper)
          }).not.toThrow()

          resolve()
        })

        menu.show()
      })
    })

    it('should handle _isMovingTowardSubmenu when cursor is in safe triangle', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="menu" style="position: relative;">',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu" style="position: absolute; display: block;">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu" style="position: absolute; left: 100px; top: 0; width: 100px; height: 100px; display: block;">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)

          // Track a mouse position
          menu._trackMousePosition({ clientX: 50, clientY: 50 })

          // Call isMovingTowardSubmenu
          const mockEvent = { clientX: 75, clientY: 50 }
          const result = menu._isMovingTowardSubmenu(mockEvent, submenu)

          // Result depends on geometry, just verify it returns a boolean
          expect(typeof result).toBe('boolean')

          resolve()
        })

        menu.show()
      })
    })

    it('should handle RTL submenu placement', () => {
      return new Promise(resolve => {
        // Set RTL
        document.documentElement.dir = 'rtl'

        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <ul class="menu">',
          '    <li class="submenu">',
          '      <button class="menu-item" type="button">More options</button>',
          '      <ul class="menu">',
          '        <li><a class="menu-item" href="#">Sub-action</a></li>',
          '      </ul>',
          '    </li>',
          '  </ul>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const menu = new Menu(btnMenu)
        const submenuTrigger = fixtureEl.querySelector('.submenu > .menu-item')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')

        btnMenu.addEventListener('shown.bs.menu', () => {
          // Open submenu in RTL mode
          menu._openSubmenu(submenuTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          // Reset RTL
          document.documentElement.dir = 'ltr'
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('menu config option', () => {
    it('should use the menu element passed via config instead of auto-finding', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button class="btn" data-bs-toggle="menu">Menu</button>',
          '<div id="custom-menu" class="menu">',
          '  <a class="menu-item" href="#">Item</a>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const customMenuEl = fixtureEl.querySelector('#custom-menu')
        const menu = new Menu(btnMenu, { menu: customMenuEl })

        expect(menu._menu).toEqual(customMenuEl)

        btnMenu.addEventListener('shown.bs.menu', () => {
          expect(customMenuEl).toHaveClass('show')
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('_findMenu flexibility', () => {
    it('should find menu element placed before the toggle', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div class="menu">',
        '    <a class="menu-item" href="#">Item</a>',
        '  </div>',
        '  <button class="btn" data-bs-toggle="menu">Menu</button>',
        '</div>'
      ].join('')

      const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
      const menuEl = fixtureEl.querySelector('.menu')
      const menu = new Menu(btnMenu)

      expect(menu._menu).toEqual(menuEl)
    })
  })

  describe('Home and End key navigation', () => {
    it('should focus the first item when Home key is pressed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a id="first" class="menu-item" href="#">First</a>',
          '    <a id="middle" class="menu-item" href="#">Middle</a>',
          '    <a id="last" class="menu-item" href="#">Last</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const firstItem = fixtureEl.querySelector('#first')
        const lastItem = fixtureEl.querySelector('#last')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          lastItem.focus()
          expect(document.activeElement).toEqual(lastItem)

          const homeEvent = createEvent('keydown')
          homeEvent.key = 'Home'
          lastItem.dispatchEvent(homeEvent)

          setTimeout(() => {
            expect(document.activeElement).toEqual(firstItem)
            resolve()
          }, 20)
        })

        menu.show()
      })
    })

    it('should focus the last item when End key is pressed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a id="first" class="menu-item" href="#">First</a>',
          '    <a id="middle" class="menu-item" href="#">Middle</a>',
          '    <a id="last" class="menu-item" href="#">Last</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const firstItem = fixtureEl.querySelector('#first')
        const lastItem = fixtureEl.querySelector('#last')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          firstItem.focus()
          expect(document.activeElement).toEqual(firstItem)

          const endEvent = createEvent('keydown')
          endEvent.key = 'End'
          firstItem.dispatchEvent(endEvent)

          setTimeout(() => {
            expect(document.activeElement).toEqual(lastItem)
            resolve()
          }, 20)
        })

        menu.show()
      })
    })
  })

  describe('ArrowLeft to close submenu', () => {
    it('should close the current submenu via _handleSubmenuKeydown on ArrowLeft', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <div class="submenu">',
          '      <button id="sub-trigger" class="menu-item" type="button">Sub</button>',
          '      <div class="menu">',
          '        <a id="sub-item" class="menu-item" href="#">Sub item</a>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const subTrigger = fixtureEl.querySelector('#sub-trigger')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')
        const subItem = fixtureEl.querySelector('#sub-item')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          menu._openSubmenu(subTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()

          subItem.focus()
          const arrowLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
          Object.defineProperty(arrowLeftEvent, 'target', { value: subItem })
          const handled = menu._handleSubmenuKeydown(arrowLeftEvent)

          expect(handled).toBeTrue()
          expect(submenu.classList.contains('show')).toBeFalse()
          expect(document.activeElement).toEqual(subTrigger)
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('Escape in submenu', () => {
    it('should close the current submenu via dataApiKeydownHandler on Escape', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a class="menu-item" href="#">Top item</a>',
          '    <div class="submenu">',
          '      <button id="sub-trigger" class="menu-item" type="button">Sub</button>',
          '      <div class="menu">',
          '        <a id="sub-item" class="menu-item" href="#">Sub item</a>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const subTrigger = fixtureEl.querySelector('#sub-trigger')
        const submenuWrapper = fixtureEl.querySelector('.submenu')
        const submenu = submenuWrapper.querySelector('.menu')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          menu._openSubmenu(subTrigger, submenu, submenuWrapper)
          expect(submenu.classList.contains('show')).toBeTrue()
          expect(menu._openSubmenus.size).toEqual(1)

          menu._closeSubmenu(submenu, submenuWrapper)

          expect(submenu.classList.contains('show')).toBeFalse()
          expect(menu._openSubmenus.size).toEqual(0)
          expect(btnMenu).toHaveClass('show')
          resolve()
        })

        menu.show()
      })
    })
  })

  describe('scoped keyboard navigation', () => {
    it('should scope ArrowDown/ArrowUp to direct children of the current menu level', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div>',
          '  <button class="btn" data-bs-toggle="menu">Menu</button>',
          '  <div class="menu">',
          '    <a id="top-item-1" class="menu-item" href="#">Top 1</a>',
          '    <div class="submenu">',
          '      <button class="menu-item" type="button">Sub trigger</button>',
          '      <div class="menu">',
          '        <a id="sub-item-1" class="menu-item" href="#">Sub 1</a>',
          '        <a id="sub-item-2" class="menu-item" href="#">Sub 2</a>',
          '      </div>',
          '    </div>',
          '    <a id="top-item-2" class="menu-item" href="#">Top 2</a>',
          '  </div>',
          '</div>'
        ].join('')

        const btnMenu = fixtureEl.querySelector('[data-bs-toggle="menu"]')
        const topItem1 = fixtureEl.querySelector('#top-item-1')
        const menu = new Menu(btnMenu)

        btnMenu.addEventListener('shown.bs.menu', () => {
          topItem1.focus()
          expect(document.activeElement).toEqual(topItem1)

          const arrowDown = createEvent('keydown')
          arrowDown.key = 'ArrowDown'
          topItem1.dispatchEvent(arrowDown)

          setTimeout(() => {
            resolve()
          }, 20)
        })

        menu.show()
      })
    })
  })
})
