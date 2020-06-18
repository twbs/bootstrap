import Popper from 'popper.js'

import Dropdown from '../../src/dropdown'
import EventHandler from '../../src/dom/event-handler'

/** Test helpers */
import { getFixture, clearFixture, createEvent, jQueryMock } from '../helpers/fixture'

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

  describe('constructor', () => {
    it('should create offset modifier correctly when offset option is a function', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const getOffset = offsets => offsets
      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown, {
        offset: getOffset
      })

      const offset = dropdown._getOffset()

      expect(offset.offset).toBeUndefined()
      expect(typeof offset.fn).toEqual('function')
    })

    it('should create offset modifier correctly when offset option is not a function', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const myOffset = 7
      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown, {
        offset: myOffset
      })

      const offset = dropdown._getOffset()

      expect(offset.offset).toEqual(myOffset)
      expect(offset.fn).toBeUndefined()
    })

    it('should add a listener on trigger which do not have data-toggle="dropdown"', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('.btn')
      const dropdown = new Dropdown(btnDropdown)

      spyOn(dropdown, 'toggle')

      btnDropdown.click()

      expect(dropdown.toggle).toHaveBeenCalled()
    })

    it('should allow to pass config to popper.js with `popperConfig`', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown, {
        popperConfig: {
          placement: 'left'
        }
      })

      const popperConfig = dropdown._getPopperConfig()

      expect(popperConfig.placement).toEqual('left')
    })
  })

  describe('toggle', () => {
    it('should toggle a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should destroy old popper references on toggle', done => {
      fixtureEl.innerHTML = [
        '<div class="first dropdown">',
        '  <button class="firstBtn btn" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>',
        '<div class="second dropdown">',
        '  <button class="secondBtn btn" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
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
      const dropdown2 = new Dropdown(btnDropdown2)

      firstDropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown1.classList.contains('show')).toEqual(true)
        spyOn(dropdown1._popper, 'destroy')
        dropdown2.toggle()
      })

      secondDropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdown1._popper.destroy).toHaveBeenCalled()
        done()
      })

      dropdown1.toggle()
    })

    it('should toggle a dropdown and add/remove event listener on mobile', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const defaultValueOnTouchStart = document.documentElement.ontouchstart
      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      document.documentElement.ontouchstart = () => {}
      spyOn(EventHandler, 'on')
      spyOn(EventHandler, 'off')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        expect(EventHandler.on).toHaveBeenCalled()

        dropdown.toggle()
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(false)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
        expect(EventHandler.off).toHaveBeenCalled()

        document.documentElement.ontouchstart = defaultValueOnTouchStart
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropdown at the right', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu dropdown-menu-right">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropup', done => {
      fixtureEl.innerHTML = [
        '<div class="dropup">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropupEl = fixtureEl.querySelector('.dropup')
      const dropdown = new Dropdown(btnDropdown)

      dropupEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropup at the right', done => {
      fixtureEl.innerHTML = [
        '<div class="dropup">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu dropdown-menu-right">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropupEl = fixtureEl.querySelector('.dropup')
      const dropdown = new Dropdown(btnDropdown)

      dropupEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropright', done => {
      fixtureEl.innerHTML = [
        '<div class="dropright">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const droprightEl = fixtureEl.querySelector('.dropright')
      const dropdown = new Dropdown(btnDropdown)

      droprightEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropleft', done => {
      fixtureEl.innerHTML = [
        '<div class="dropleft">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropleftEl = fixtureEl.querySelector('.dropleft')
      const dropdown = new Dropdown(btnDropdown)

      dropleftEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropdown with parent reference', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown, {
        reference: 'parent'
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropdown with a dom node reference', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown, {
        reference: fixtureEl
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should toggle a dropdown with a jquery object reference', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown, {
        reference: { 0: fixtureEl, jquery: 'jQuery' }
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should not toggle a dropdown if the element is disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button disabled class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })

    it('should not toggle a dropdown if the element contains .disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })

    it('should not toggle a dropdown if the menu is shown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })

    it('should not toggle a dropdown if show event is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('show.bs.dropdown', e => {
        e.preventDefault()
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })
  })

  describe('show', () => {
    it('should show a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        done()
      })

      dropdown.show()
    })

    it('should not show a dropdown if the element is disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button disabled class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not show a dropdown if the element contains .disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not show a dropdown if the menu is shown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not show a dropdown if show event is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('show.bs.dropdown', e => {
        e.preventDefault()
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })
  })

  describe('hide', () => {
    it('should hide a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        expect(dropdownMenu.classList.contains('show')).toEqual(false)
        done()
      })

      dropdown.hide()
    })

    it('should hide a dropdown and destroy popper', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        spyOn(dropdown._popper, 'destroy')
        dropdown.hide()
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        expect(dropdown._popper.destroy).toHaveBeenCalled()
        done()
      })

      dropdown.show()
    })

    it('should not hide a dropdown if the element is disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button disabled class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect(dropdownMenu.classList.contains('show')).toEqual(true)
        done()
      }, 10)
    })

    it('should not hide a dropdown if the element contains .disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect(dropdownMenu.classList.contains('show')).toEqual(true)
        done()
      }, 10)
    })

    it('should not hide a dropdown if the menu is not shown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not hide a dropdown if hide event is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hide.bs.dropdown', e => {
        e.preventDefault()
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect(dropdownMenu.classList.contains('show')).toEqual(true)
        done()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose dropdown', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      expect(dropdown._popper).toBeNull()
      expect(dropdown._menu).toBeDefined()
      expect(dropdown._element).toBeDefined()

      dropdown.dispose()

      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
    })

    it('should dispose dropdown with popper.js', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      dropdown.toggle()

      expect(dropdown._popper).toBeDefined()
      expect(dropdown._menu).toBeDefined()
      expect(dropdown._element).toBeDefined()

      spyOn(Popper.prototype, 'destroy')

      dropdown.dispose()

      expect(dropdown._popper).toBeNull()
      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
      expect(Popper.prototype.destroy).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should call popper.js and detect navbar on update', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      dropdown.toggle()

      expect(dropdown._popper).toBeDefined()

      spyOn(dropdown._popper, 'scheduleUpdate')
      spyOn(dropdown, '_detectNavbar')

      dropdown.update()

      expect(dropdown._popper.scheduleUpdate).toHaveBeenCalled()
      expect(dropdown._detectNavbar).toHaveBeenCalled()
    })

    it('should just detect navbar on update', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      spyOn(dropdown, '_detectNavbar')

      dropdown.update()

      expect(dropdown._popper).toBeNull()
      expect(dropdown._detectNavbar).toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should not add class position-static to dropdown if boundary not set', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('position-static')).toEqual(false)
        done()
      })

      btnDropdown.click()
    })

    it('should add class position-static to dropdown if boundary not scrollParent', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" data-boundary="viewport">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('position-static')).toEqual(true)
        done()
      })

      btnDropdown.click()
    })

    it('should show and hide a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      let showEventTriggered = false
      let hideEventTriggered = false

      dropdownEl.addEventListener('show.bs.dropdown', () => {
        showEventTriggered = true
      })

      dropdownEl.addEventListener('shown.bs.dropdown', e => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        expect(showEventTriggered).toEqual(true)
        expect(e.relatedTarget).toEqual(btnDropdown)
        document.body.click()
      })

      dropdownEl.addEventListener('hide.bs.dropdown', () => {
        hideEventTriggered = true
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', e => {
        expect(btnDropdown.classList.contains('show')).toEqual(false)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
        expect(hideEventTriggered).toEqual(true)
        expect(e.relatedTarget).toEqual(btnDropdown)
        done()
      })

      btnDropdown.click()
    })

    it('should not use popper.js in navbar', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar navbar-expand-md navbar-light bg-light">',
        '  <div class="dropdown">',
        '    <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#">Secondary link</a>',
        '    </div>',
        '  </div>',
        '</nav>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownMenu.getAttribute('style')).toEqual(null, 'no inline style applied by popper.js')
        done()
      })

      btnDropdown.click()
    })

    it('should not use popper.js if display set to static', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown" data-display="static">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        // popper.js add this attribute when we use it
        expect(dropdownMenu.getAttribute('x-placement')).toEqual(null)
        done()
      })

      btnDropdown.click()
    })

    it('should remove "show" class if tabbing outside of menu', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(true)

        const keyup = createEvent('keyup')

        keyup.key = 'Tab'
        document.dispatchEvent(keyup)
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        expect(btnDropdown.classList.contains('show')).toEqual(false)
        done()
      })

      btnDropdown.click()
    })

    it('should remove "show" class if body is clicked, with multiple dropdowns', done => {
      fixtureEl.innerHTML = [
        '<div class="nav">',
        '  <div class="dropdown" id="testmenu">',
        '    <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '    </div>',
        '  </div>',
        '</div>',
        '<div class="btn-group">',
        '  <button class="btn">Actions</button>',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown"></button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Action 1</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdownList = fixtureEl.querySelectorAll('[data-toggle="dropdown"]')

      expect(triggerDropdownList.length).toEqual(2)

      const first = triggerDropdownList[0]
      const last = triggerDropdownList[1]
      const dropdownTestMenu = first.parentNode
      const btnGroup = last.parentNode

      dropdownTestMenu.addEventListener('shown.bs.dropdown', () => {
        expect(first.classList.contains('show')).toEqual(true)
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1)
        document.body.click()
      })

      dropdownTestMenu.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0)
        last.click()
      })

      btnGroup.addEventListener('shown.bs.dropdown', () => {
        expect(last.classList.contains('show')).toEqual(true)
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1)
        document.body.click()
      })

      btnGroup.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0)
        done()
      })

      first.click()
    })

    it('should remove "show" class if body if tabbing outside of menu, with multiple dropdowns', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu</a>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '  </div>',
        '</div>',
        '<div class="btn-group">',
        '  <button class="btn">Actions</button>',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown"></button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Action 1</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdownList = fixtureEl.querySelectorAll('[data-toggle="dropdown"]')

      expect(triggerDropdownList.length).toEqual(2)

      const first = triggerDropdownList[0]
      const last = triggerDropdownList[1]
      const dropdownTestMenu = first.parentNode
      const btnGroup = last.parentNode

      dropdownTestMenu.addEventListener('shown.bs.dropdown', () => {
        expect(first.classList.contains('show')).toEqual(true, '"show" class added on click')
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1, 'only one dropdown is shown')

        const keyup = createEvent('keyup')
        keyup.key = 'Tab'

        document.dispatchEvent(keyup)
      })

      dropdownTestMenu.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0, '"show" class removed')
        last.click()
      })

      btnGroup.addEventListener('shown.bs.dropdown', () => {
        expect(last.classList.contains('show')).toEqual(true, '"show" class added on click')
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1, 'only one dropdown is shown')

        const keyup = createEvent('keyup')
        keyup.key = 'Tab'

        document.dispatchEvent(keyup)
      })

      btnGroup.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0, '"show" class removed')
        done()
      })

      first.click()
    })

    it('should fire hide and hidden event without a clickEvent if event type is not click', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')

      dropdown.addEventListener('hide.bs.dropdown', e => {
        expect(e.clickEvent).toBeUndefined()
      })

      dropdown.addEventListener('hidden.bs.dropdown', e => {
        expect(e.clickEvent).toBeUndefined()
        done()
      })

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keydown = createEvent('keydown')

        keydown.key = 'Escape'
        triggerDropdown.dispatchEvent(keydown)
      })

      triggerDropdown.click()
    })

    it('should ignore keyboard events within <input>s and <textarea>s', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '    <input type="text">',
        '    <textarea></textarea>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const input = fixtureEl.querySelector('input')
      const textarea = fixtureEl.querySelector('textarea')

      dropdown.addEventListener('shown.bs.dropdown', () => {
        input.focus()
        const keydown = createEvent('keydown')

        keydown.key = 'ArrowUp'
        input.dispatchEvent(keydown)

        expect(document.activeElement).toEqual(input, 'input still focused')

        textarea.focus()
        textarea.dispatchEvent(keydown)

        expect(document.activeElement).toEqual(textarea, 'textarea still focused')
        done()
      })

      triggerDropdown.click()
    })

    it('should skip disabled element when using keyboard navigation', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item disabled" href="#sub1">Submenu 1</a>',
        '    <button class="dropdown-item" type="button" disabled>Disabled button</button>',
        '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keydown = createEvent('keydown')
        keydown.key = 'ArrowDown'

        triggerDropdown.dispatchEvent(keydown)
        triggerDropdown.dispatchEvent(keydown)

        expect(document.activeElement.classList.contains('disabled')).toEqual(false, '.disabled not focused')
        expect(document.activeElement.hasAttribute('disabled')).toEqual(false, ':disabled not focused')
        done()
      })

      triggerDropdown.click()
    })

    it('should skip hidden element when using keyboard navigation', done => {
      fixtureEl.innerHTML = [
        '<style>',
        '  .d-none {',
        '    display: none;',
        '  }',
        '</style>',
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <button class="dropdown-item d-none" type="button">Hidden button by class</button>',
        '    <a class="dropdown-item" href="#sub1" style="display: none">Hidden link</a>',
        '    <a class="dropdown-item" href="#sub1" style="visibility: hidden">Hidden link</a>',
        '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keydown = createEvent('keydown')
        keydown.key = 'ArrowDown'

        triggerDropdown.dispatchEvent(keydown)

        expect(document.activeElement.classList.contains('d-none')).toEqual(false, '.d-none not focused')
        expect(document.activeElement.style.display === 'none').toEqual(false, '"display: none" not focused')
        expect(document.activeElement.style.visibility === 'hidden').toEqual(false, '"visibility: hidden" not focused')

        done()
      })

      triggerDropdown.click()
    })

    it('should focus next/previous element when using keyboard navigation', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a id="item1" class="dropdown-item" href="#">A link</a>',
        '    <a id="item2" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const item1 = fixtureEl.querySelector('#item1')
      const item2 = fixtureEl.querySelector('#item2')

      dropdown.addEventListener('shown.bs.dropdown', () => {
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

        done()
      })

      triggerDropdown.click()
    })

    it('should focus on the first element when using ArrowUp for the first time', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a id="item1" class="dropdown-item" href="#">A link</a>',
        '    <a id="item2" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const item1 = fixtureEl.querySelector('#item1')

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keydown = createEvent('keydown')
        keydown.key = 'ArrowUp'

        document.activeElement.dispatchEvent(keydown)
        expect(document.activeElement).toEqual(item1, 'item1 is focused')

        done()
      })

      triggerDropdown.click()
    })

    it('should not close the dropdown if the user clicks on a text field', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <input type="text">',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const input = fixtureEl.querySelector('input')

      input.addEventListener('click', () => {
        expect(triggerDropdown.classList.contains('show')).toEqual(true, 'dropdown menu is shown')
        done()
      })

      dropdown.addEventListener('shown.bs.dropdown', () => {
        expect(triggerDropdown.classList.contains('show')).toEqual(true, 'dropdown menu is shown')
        input.dispatchEvent(createEvent('click'))
      })

      triggerDropdown.click()
    })

    it('should not close the dropdown if the user clicks on a textarea', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <textarea></textarea>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const textarea = fixtureEl.querySelector('textarea')

      textarea.addEventListener('click', () => {
        expect(triggerDropdown.classList.contains('show')).toEqual(true, 'dropdown menu is shown')
        done()
      })

      dropdown.addEventListener('shown.bs.dropdown', () => {
        expect(triggerDropdown.classList.contains('show')).toEqual(true, 'dropdown menu is shown')
        textarea.dispatchEvent(createEvent('click'))
      })

      triggerDropdown.click()
    })

    it('should ignore keyboard events for <input>s and <textarea>s within dropdown-menu, except for escape key', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '    <input type="text">',
        '    <textarea></textarea>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const input = fixtureEl.querySelector('input')
      const textarea = fixtureEl.querySelector('textarea')

      const keydownSpace = createEvent('keydown')
      keydownSpace.key = 'Space'

      const keydownArrowUp = createEvent('keydown')
      keydownArrowUp.key = 'ArrowUp'

      const keydownArrowDown = createEvent('keydown')
      keydownArrowDown.key = 'ArrowDown'

      const keydownEscape = createEvent('keydown')
      keydownEscape.key = 'Escape'

      dropdown.addEventListener('shown.bs.dropdown', () => {
        // Key Space
        input.focus()
        input.dispatchEvent(keydownSpace)

        expect(document.activeElement).toEqual(input, 'input still focused')

        textarea.focus()
        textarea.dispatchEvent(keydownSpace)

        expect(document.activeElement).toEqual(textarea, 'textarea still focused')

        // Key ArrowUp
        input.focus()
        input.dispatchEvent(keydownArrowUp)

        expect(document.activeElement).toEqual(input, 'input still focused')

        textarea.focus()
        textarea.dispatchEvent(keydownArrowUp)

        expect(document.activeElement).toEqual(textarea, 'textarea still focused')

        // Key ArrowDown
        input.focus()
        input.dispatchEvent(keydownArrowDown)

        expect(document.activeElement).toEqual(input, 'input still focused')

        textarea.focus()
        textarea.dispatchEvent(keydownArrowDown)

        expect(document.activeElement).toEqual(textarea, 'textarea still focused')

        // Key Escape
        input.focus()
        input.dispatchEvent(keydownEscape)

        expect(triggerDropdown.classList.contains('show')).toEqual(false, 'dropdown menu is not shown')
        done()
      })

      triggerDropdown.click()
    })

    it('should not open dropdown if escape key was pressed on the toggle', done => {
      fixtureEl.innerHTML = [
        '<div class="tabs">',
        '  <div class="dropdown">',
        '    <button disabled class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#">Secondary link</a>',
        '      <a class="dropdown-item" href="#">Something else here</a>',
        '      <div class="divider"></div>',
        '     <a class="dropdown-item" href="#">Another link</a>',
        '   </div>',
        '  </div>',
        '</div>'
      ]

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(triggerDropdown)
      const button = fixtureEl.querySelector('button[data-toggle="dropdown"]')

      spyOn(dropdown, 'toggle')

      // Key escape
      button.focus()
      // Key escape
      const keydownEscape = createEvent('keydown')
      keydownEscape.key = 'Escape'
      button.dispatchEvent(keydownEscape)

      setTimeout(() => {
        expect(dropdown.toggle).not.toHaveBeenCalled()
        expect(triggerDropdown.classList.contains('show')).toEqual(false)
        done()
      }, 20)
    })
  })

  describe('jQueryInterface', () => {
    it('should create a dropdown', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.dropdown = Dropdown.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.dropdown.call(jQueryMock)

      expect(Dropdown.getInstance(div)).toBeDefined()
    })

    it('should not re create a dropdown', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const dropdown = new Dropdown(div)

      jQueryMock.fn.dropdown = Dropdown.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.dropdown.call(jQueryMock)

      expect(Dropdown.getInstance(div)).toEqual(dropdown)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.dropdown = Dropdown.jQueryInterface
      jQueryMock.elements = [div]

      try {
        jQueryMock.fn.dropdown.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
    })
  })

  describe('getInstance', () => {
    it('should return dropdown instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const dropdown = new Dropdown(div)

      expect(Dropdown.getInstance(div)).toEqual(dropdown)
    })

    it('should return null when there is no dropdown instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Dropdown.getInstance(div)).toEqual(null)
    })
  })
})
