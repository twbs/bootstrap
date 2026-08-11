import EventHandler from '../../src/dom/event-handler.js'
import NavOverflow from '../../src/nav-overflow.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('NavOverflow', () => {
  let fixtureEl

  const wait = (delay = 100) => new Promise(resolve => {
    setTimeout(resolve, delay)
  })

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(NavOverflow.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(NavOverflow.Default).toEqual(jasmine.any(Object))
      expect(NavOverflow.Default.moreText).toEqual('More')
      expect(NavOverflow.Default.threshold).toEqual(0)
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(NavOverflow.DATA_KEY).toEqual('bs.navoverflow')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navBySelector = new NavOverflow('[data-bs-toggle="nav-overflow"]')
      expect(navBySelector._element).toEqual(wrapperEl)

      const navByElement = new NavOverflow(wrapperEl)
      expect(navByElement._element).toEqual(wrapperEl)

      navByElement.dispose()
    })

    it('should throw when the wrapper has no child nav', () => {
      fixtureEl.innerHTML = '<div class="nav-overflow" data-bs-toggle="nav-overflow"></div>'

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')

      expect(() => new NavOverflow(wrapperEl)).toThrowError(TypeError)
    })

    it('should keep a reference to the child nav', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navEl = wrapperEl.querySelector('.nav')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(navOverflow._nav).toEqual(navEl)

      navOverflow.dispose()
    })

    it('should add nav-overflow class to the wrapper', () => {
      fixtureEl.innerHTML = [
        '<div data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(wrapperEl).toHaveClass('nav-overflow')
      expect(wrapperEl.querySelector('.nav')).not.toHaveClass('nav-overflow')

      navOverflow.dispose()
    })

    it('should create overflow menu toggle and menu inside the nav', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navEl = wrapperEl.querySelector('.nav')
      const navOverflow = new NavOverflow(wrapperEl)

      const toggle = navEl.querySelector('.nav-overflow-toggle')
      const menu = navEl.querySelector('.nav-overflow-menu')

      expect(toggle).not.toBeNull()
      expect(menu).not.toBeNull()
      expect(toggle.getAttribute('data-bs-toggle')).toEqual('menu')
      expect(menu).toHaveClass('menu')
      expect(toggle.closest('.nav')).toEqual(navEl)

      navOverflow.dispose()
    })

    it('should store order data on nav items', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)
      const items = wrapperEl.querySelectorAll('.nav-item:not(.nav-overflow-item)')

      expect(items[0].dataset.bsNavOrder).toEqual('0')
      expect(items[1].dataset.bsNavOrder).toEqual('1')
      expect(items[2].dataset.bsNavOrder).toEqual('2')

      navOverflow.dispose()
    })

    it('should respect custom moreText option', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        moreText: 'See all'
      })

      const toggleText = wrapperEl.querySelector('.nav-overflow-text')
      expect(toggleText.textContent).toEqual('See all')

      navOverflow.dispose()
    })
  })

  describe('update', () => {
    it('should trigger update event on the wrapper', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
          '  <ul class="nav">',
          '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
          '  </ul>',
          '</div>'
        ].join('')

        const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
        const navOverflow = new NavOverflow(wrapperEl)

        wrapperEl.addEventListener('update.bs.navoverflow', () => {
          navOverflow.dispose()
          resolve()
        })

        navOverflow.update()
      })
    })
  })

  describe('getInstance', () => {
    it('should return nav overflow instance', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(NavOverflow.getInstance(wrapperEl)).toEqual(navOverflow)
      expect(NavOverflow.getInstance(wrapperEl)).toBeInstanceOf(NavOverflow)

      navOverflow.dispose()
    })

    it('should return null when there is no instance', () => {
      fixtureEl.innerHTML = '<div class="nav-overflow"><ul class="nav"></ul></div>'

      const wrapperEl = fixtureEl.querySelector('.nav-overflow')

      expect(NavOverflow.getInstance(wrapperEl)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return nav overflow instance', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(NavOverflow.getOrCreateInstance(wrapperEl)).toEqual(navOverflow)
      expect(NavOverflow.getInstance(wrapperEl)).toEqual(NavOverflow.getOrCreateInstance(wrapperEl, {}))
      expect(NavOverflow.getOrCreateInstance(wrapperEl)).toBeInstanceOf(NavOverflow)

      navOverflow.dispose()
    })

    it('should return new instance when there is no instance', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('.nav-overflow')

      expect(NavOverflow.getInstance(wrapperEl)).toBeNull()

      const instance = NavOverflow.getOrCreateInstance(wrapperEl)
      expect(instance).toBeInstanceOf(NavOverflow)

      instance.dispose()
    })
  })

  describe('overflow behavior', () => {
    it('should use placement option for overflow menu', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      expect(toggle.getAttribute('data-bs-toggle')).toEqual('menu')
      expect(toggle.getAttribute('data-bs-placement')).toEqual('bottom-end')

      navOverflow.dispose()
    })

    it('should preserve nav-overflow-keep items', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 100px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item nav-overflow-keep"><a class="nav-link" href="#">Keep</a></li>',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)
      const keepItem = wrapperEl.querySelector('.nav-overflow-keep')

      expect(keepItem).not.toHaveClass('d-none')

      navOverflow.dispose()
    })

    it('should hide items that overflow the wrapper width', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const hiddenItems = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenItems.length).toBeGreaterThan(0)

      for (const item of hiddenItems) {
        expect(item).toHaveClass('d-none')
      }

      navOverflow.dispose()
    })

    it('should measure the wrapper, not the nav, when the nav sizes to its content', () => {
      // An inline-flex nav is as wide as its items, so measuring the nav would
      // never report an overflow. The wrapper is the only honest measurement.
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: inline-flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navEl = wrapperEl.querySelector('.nav')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(navEl.offsetWidth).toBeGreaterThan(wrapperEl.clientWidth)
      expect(wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]').length).toBeGreaterThan(0)

      navOverflow.dispose()
    })

    it('should observe the wrapper so its own collapsing cannot retrigger it', async () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: inline-flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const observeSpy = spyOn(ResizeObserver.prototype, 'observe').and.callThrough()
      const navOverflow = new NavOverflow(wrapperEl)

      expect(observeSpy).toHaveBeenCalledWith(wrapperEl)

      // Let the observer deliver its initial notification, then watch for more
      await wait()
      const recalculateSpy = spyOn(navOverflow, '_calculateOverflow').and.callThrough()
      await wait(300)

      expect(recalculateSpy).not.toHaveBeenCalled()

      navOverflow.dispose()
    })

    it('should show overflow toggle when items overflow', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const overflowItem = wrapperEl.querySelector('.nav-overflow-item')
      expect(overflowItem).not.toHaveClass('d-none')

      navOverflow.dispose()
    })

    it('should hide overflow toggle when no items overflow', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 5000px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const overflowItem = wrapperEl.querySelector('.nav-overflow-item')
      expect(overflowItem).toHaveClass('d-none')

      navOverflow.dispose()
    })

    it('should clone overflowed items into the menu', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const menu = wrapperEl.querySelector('.nav-overflow-menu')
      const menuItems = menu.querySelectorAll('.menu-item')
      expect(menuItems.length).toBeGreaterThan(0)

      navOverflow.dispose()
    })

    it('should preserve active state on cloned menu items', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 150px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link active" href="#">Active</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const menu = wrapperEl.querySelector('.nav-overflow-menu')
      const activeMenuItems = menu.querySelectorAll('.menu-item.active')
      const originalActiveHidden = wrapperEl.querySelector('.nav-item[data-bs-nav-overflow="true"] .nav-link.active')

      if (originalActiveHidden) {
        expect(activeMenuItems.length).toBeGreaterThan(0)
      }

      navOverflow.dispose()
    })

    it('should preserve disabled state on cloned menu items', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 150px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link disabled" href="#">Disabled</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const menu = wrapperEl.querySelector('.nav-overflow-menu')
      const disabledMenuItems = menu.querySelectorAll('.menu-item.disabled')
      const originalDisabledHidden = wrapperEl.querySelector('.nav-item[data-bs-nav-overflow="true"] .nav-link.disabled')

      if (originalDisabledHidden) {
        expect(disabledMenuItems.length).toBeGreaterThan(0)
      }

      navOverflow.dispose()
    })

    it('should skip items without a nav-link when moving to overflow', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 150px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><span>No link</span></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')

      expect(() => {
        const navOverflow = new NavOverflow(wrapperEl)
        navOverflow.dispose()
      }).not.toThrow()
    })

    it('should fire overflow event on the wrapper with overflowCount and visibleCount', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      let eventFired = false
      let receivedOverflowCount = 0
      let receivedVisibleCount = 0

      wrapperEl.addEventListener('overflow.bs.navoverflow', event => {
        eventFired = true
        receivedOverflowCount = event.overflowCount
        receivedVisibleCount = event.visibleCount
      })

      const navOverflow = new NavOverflow(wrapperEl)

      expect(eventFired).toBeTrue()
      expect(receivedOverflowCount).toBeGreaterThan(0)
      expect(receivedVisibleCount).toEqual(jasmine.any(Number))

      navOverflow.dispose()
    })

    it('should restore items when update causes no overflow', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const hiddenBefore = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenBefore.length).toBeGreaterThan(0)

      // Widen the wrapper to remove overflow
      wrapperEl.style.width = '5000px'
      navOverflow.update()

      const hiddenAfter = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenAfter.length).toEqual(0)

      navOverflow.dispose()
    })

    it('should reuse existing overflow toggle and menu from markup', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item nav-overflow-item">',
        '      <button class="nav-link nav-overflow-toggle" type="button" data-bs-toggle="menu">More</button>',
        '      <div class="nav-overflow-menu menu"></div>',
        '    </li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const existingToggle = wrapperEl.querySelector('.nav-overflow-toggle')
      const navOverflow = new NavOverflow(wrapperEl)

      // Should reuse the existing toggle, not create a new one
      const toggles = wrapperEl.querySelectorAll('.nav-overflow-toggle')
      expect(toggles.length).toEqual(1)
      expect(toggles[0]).toBe(existingToggle)

      // The toggle's own item is never a collapsible item
      expect(navOverflow._items.length).toEqual(1)

      navOverflow.dispose()
    })
  })

  describe('config', () => {
    it('should respect custom moreIcon option', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const customIcon = '<span class="custom-icon">...</span>'
      const navOverflow = new NavOverflow(wrapperEl, {
        moreIcon: customIcon
      })

      const iconContainer = wrapperEl.querySelector('.nav-overflow-icon')
      expect(iconContainer.innerHTML).toContain('custom-icon')

      navOverflow.dispose()
    })

    it('should respect threshold option', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 150px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        threshold: 2
      })

      const visibleItems = wrapperEl.querySelectorAll('.nav-item:not(.nav-overflow-item):not(.d-none)')
      expect(visibleItems.length).toBeGreaterThanOrEqual(2)

      navOverflow.dispose()
    })

    it('should have correct DefaultType', () => {
      expect(NavOverflow.DefaultType).toEqual(jasmine.objectContaining({
        collapseBelow: '(number|string)',
        iconPlacement: 'string',
        menuPlacement: 'string',
        moreText: '(string|boolean)',
        moreIcon: 'string',
        threshold: 'number'
      }))
    })

    it('should drop the text element when moreText is false', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        moreText: false
      })

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      expect(wrapperEl.querySelector('.nav-overflow-text')).toBeNull()
      expect(wrapperEl.querySelector('.nav-overflow-icon')).not.toBeNull()

      // The icon alone cannot name the button, so fall back to the default text
      expect(toggle.getAttribute('aria-label')).toEqual('More')

      navOverflow.dispose()
    })

    it('should treat an empty moreText like false', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        moreText: ''
      })

      expect(wrapperEl.querySelector('.nav-overflow-text')).toBeNull()
      expect(wrapperEl.querySelector('.nav-overflow-toggle').getAttribute('aria-label')).toEqual('More')

      navOverflow.dispose()
    })

    it('should not set aria-label when the toggle shows text', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      expect(toggle.hasAttribute('aria-label')).toBeFalse()
      expect(wrapperEl.querySelector('.nav-overflow-text').textContent).toEqual('More')

      navOverflow.dispose()
    })

    it('should respect custom menuPlacement option', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        menuPlacement: 'bottom-start'
      })

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      expect(toggle.getAttribute('data-bs-placement')).toEqual('bottom-start')

      navOverflow.dispose()
    })

    it('should use a child element with [data-bs-overflow-icon] as the icon', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '  <svg data-bs-overflow-icon class="bi-chevron" width="16" height="16"><circle cx="8" cy="8" r="8"/></svg>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const iconContainer = wrapperEl.querySelector('.nav-overflow-icon')
      const svg = iconContainer.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveClass('bi-chevron')
      expect(svg.hasAttribute('data-bs-overflow-icon')).toBeFalse()

      // Original element should be removed from the wrapper
      expect(wrapperEl.querySelector('[data-bs-overflow-icon]')).toBeNull()

      navOverflow.dispose()
    })

    it('should prefer child [data-bs-overflow-icon] over moreIcon config', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '  <svg data-bs-overflow-icon class="from-markup" width="16" height="16"><circle cx="8" cy="8" r="8"/></svg>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        moreIcon: '<span class="from-config">X</span>'
      })

      const iconContainer = wrapperEl.querySelector('.nav-overflow-icon')
      expect(iconContainer.querySelector('.from-markup')).not.toBeNull()
      expect(iconContainer.querySelector('.from-config')).toBeNull()

      navOverflow.dispose()
    })

    it('should place icon after text when iconPlacement is "end"', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        iconPlacement: 'end'
      })

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      const children = [...toggle.children]
      const textIndex = children.findIndex(el => el.classList.contains('nav-overflow-text'))
      const iconIndex = children.findIndex(el => el.classList.contains('nav-overflow-icon'))

      expect(textIndex).toBeLessThan(iconIndex)

      navOverflow.dispose()
    })

    it('should place icon before text by default (iconPlacement "start")', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      const children = [...toggle.children]
      const textIndex = children.findIndex(el => el.classList.contains('nav-overflow-text'))
      const iconIndex = children.findIndex(el => el.classList.contains('nav-overflow-icon'))

      expect(iconIndex).toBeLessThan(textIndex)

      navOverflow.dispose()
    })

    it('should treat moreText as plain text, not HTML', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        moreText: '<img src=x onerror="window.__navTextXss=1">More'
      })

      const toggleText = wrapperEl.querySelector('.nav-overflow-text')
      expect(toggleText.querySelector('img')).toBeNull()
      expect(toggleText.textContent).toEqual('<img src=x onerror="window.__navTextXss=1">More')
      expect(window.__navTextXss).toBeUndefined()

      navOverflow.dispose()
    })

    it('should sanitize moreIcon HTML before inserting it', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        moreIcon: '<img src=x onerror="window.__navIconXss=1"><span class="safe-icon">…</span>'
      })

      const iconContainer = wrapperEl.querySelector('.nav-overflow-icon')
      expect(iconContainer.querySelector('img')).toBeNull()
      expect(iconContainer.innerHTML).not.toMatch(/onerror/i)
      expect(iconContainer.querySelector('.safe-icon')).not.toBeNull()
      expect(window.__navIconXss).toBeUndefined()

      navOverflow.dispose()
    })

    it('should not let menuPlacement break out of its attribute', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const maliciousPlacement = 'bottom-end"><img class="broken-out" src=x onerror="window.__navPlacementXss=1">'
      const navOverflow = new NavOverflow(wrapperEl, {
        menuPlacement: maliciousPlacement
      })

      const toggle = wrapperEl.querySelector('.nav-overflow-toggle')
      expect(toggle.getAttribute('data-bs-placement')).toEqual(maliciousPlacement)
      expect(wrapperEl.querySelector('img.broken-out')).toBeNull()
      expect(window.__navPlacementXss).toBeUndefined()

      navOverflow.dispose()
    })

    it('should sanitize markup from [data-bs-overflow-icon]', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '  <span data-bs-overflow-icon class="from-markup"><img src=x onerror="window.__navCustomIconXss=1"><i class="bi-ok"></i></span>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const iconContainer = wrapperEl.querySelector('.nav-overflow-icon')
      expect(iconContainer.querySelector('img')).toBeNull()
      expect(iconContainer.innerHTML).not.toMatch(/onerror/i)
      expect(iconContainer.querySelector('i.bi-ok')).not.toBeNull()
      expect(window.__navCustomIconXss).toBeUndefined()

      navOverflow.dispose()
    })
  })

  describe('collapseBelow', () => {
    it('should collapse all items when the wrapper width is below collapseBelow (number)', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 400px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        collapseBelow: 500
      })

      const hiddenItems = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenItems.length).toEqual(3)

      navOverflow.dispose()
    })

    it('should not collapse items when the wrapper width is above collapseBelow (number)', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 5000px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        collapseBelow: 500
      })

      const hiddenItems = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenItems.length).toEqual(0)

      navOverflow.dispose()
    })

    it('should resolve a breakpoint string via --bs-breakpoint-{name} CSS variable', () => {
      document.documentElement.style.setProperty('--bs-breakpoint-md', '768px')

      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 400px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        collapseBelow: 'md'
      })

      const hiddenItems = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenItems.length).toEqual(2)

      navOverflow.dispose()
      document.documentElement.style.removeProperty('--bs-breakpoint-md')
    })

    it('should respect nav-overflow-keep items when collapsing all', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 400px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item nav-overflow-keep" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Keep</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl, {
        collapseBelow: 500
      })

      const keepItem = wrapperEl.querySelector('.nav-overflow-keep')
      expect(keepItem).not.toHaveClass('d-none')

      const hiddenItems = wrapperEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenItems.length).toEqual(2)

      navOverflow.dispose()
    })

    it('should be disabled by default (collapseBelow: 0)', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 5000px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(navOverflow._collapseBelow).toEqual(0)

      const overflowItem = wrapperEl.querySelector('.nav-overflow-item')
      expect(overflowItem).toHaveClass('d-none')

      navOverflow.dispose()
    })
  })

  describe('dispose', () => {
    it('should dispose nav overflow and remove overflow menu', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      expect(NavOverflow.getInstance(wrapperEl)).not.toBeNull()
      expect(wrapperEl.querySelector('.nav-overflow-toggle')).not.toBeNull()

      navOverflow.dispose()

      expect(NavOverflow.getInstance(wrapperEl)).toBeNull()
      expect(wrapperEl.querySelector('.nav-overflow-toggle')).toBeNull()
    })

    it('should disconnect ResizeObserver on dispose', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" data-bs-toggle="nav-overflow">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      const observer = navOverflow._resizeObserver
      if (observer) {
        spyOn(observer, 'disconnect').and.callThrough()
        navOverflow.dispose()
        expect(observer.disconnect).toHaveBeenCalled()
      } else {
        navOverflow.dispose()
      }
    })

    it('should remove only its own fallback window resize listener on dispose', () => {
      const { ResizeObserver: originalResizeObserver } = window

      // Force the no-ResizeObserver fallback path
      delete window.ResizeObserver

      try {
        fixtureEl.innerHTML = [
          '<div class="nav-overflow" id="navA" data-bs-toggle="nav-overflow">',
          '  <ul class="nav">',
          '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
          '  </ul>',
          '</div>',
          '<div class="nav-overflow" id="navB" data-bs-toggle="nav-overflow">',
          '  <ul class="nav">',
          '    <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
          '  </ul>',
          '</div>'
        ].join('')

        const navA = new NavOverflow(fixtureEl.querySelector('#navA'))
        const navB = new NavOverflow(fixtureEl.querySelector('#navB'))

        // Each instance keeps its own handler; dispose() nulls the field, so
        // capture them before disposing
        const handlerA = navA._resizeHandler
        const handlerB = navB._resizeHandler
        expect(handlerA).toEqual(jasmine.any(Function))
        expect(handlerB).not.toBe(handlerA)

        const spyOff = spyOn(EventHandler, 'off').and.callThrough()

        navA.dispose()

        // off() removes only navA's handler; navB's listener stays registered
        expect(spyOff).toHaveBeenCalledWith(window, 'resize.bs.navoverflow', handlerA)
        expect(spyOff).not.toHaveBeenCalledWith(window, 'resize.bs.navoverflow', handlerB)
      } finally {
        window.ResizeObserver = originalResizeObserver
      }
    })

    it('should restore hidden items on dispose', () => {
      fixtureEl.innerHTML = [
        '<div class="nav-overflow" style="width: 250px;" data-bs-toggle="nav-overflow">',
        '  <ul class="nav" style="display: flex;">',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '    <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  </ul>',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(wrapperEl)

      // Verify some items are hidden
      const hiddenBefore = wrapperEl.querySelectorAll('.nav-item.d-none:not(.nav-overflow-item)')
      expect(hiddenBefore.length).toBeGreaterThan(0)

      navOverflow.dispose()

      // After dispose, original items should be visible
      const originalItems = wrapperEl.querySelectorAll('.nav-item:not(.nav-overflow-item)')
      for (const item of originalItems) {
        expect(item).not.toHaveClass('d-none')
      }
    })
  })
})
