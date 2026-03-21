import NavOverflow from '../../src/nav-overflow.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('NavOverflow', () => {
  let fixtureEl

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
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navBySelector = new NavOverflow('[data-bs-toggle="nav-overflow"]')
      const navByElement = new NavOverflow(navEl)

      expect(navBySelector._element).toEqual(navEl)
      expect(navByElement._element).toEqual(navEl)

      navBySelector.dispose()
      navByElement.dispose()
    })

    it('should add nav-overflow class to element', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      expect(navEl).toHaveClass('nav-overflow')

      navOverflow.dispose()
    })

    it('should create overflow menu toggle and menu', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const toggle = navEl.querySelector('.nav-overflow-toggle')
      const menu = navEl.querySelector('.nav-overflow-menu')

      expect(toggle).not.toBeNull()
      expect(menu).not.toBeNull()
      expect(toggle.getAttribute('data-bs-toggle')).toEqual('menu')
      expect(menu).toHaveClass('menu')

      navOverflow.dispose()
    })

    it('should store order data on nav items', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 3</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)
      const items = navEl.querySelectorAll('.nav-item:not(.nav-overflow-item)')

      expect(items[0].dataset.bsNavOrder).toEqual('0')
      expect(items[1].dataset.bsNavOrder).toEqual('1')
      expect(items[2].dataset.bsNavOrder).toEqual('2')

      navOverflow.dispose()
    })

    it('should respect custom moreText option', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl, {
        moreText: 'See all'
      })

      const toggleText = navEl.querySelector('.nav-overflow-text')
      expect(toggleText.textContent).toEqual('See all')

      navOverflow.dispose()
    })
  })

  describe('update', () => {
    it('should trigger update event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" data-bs-toggle="nav-overflow">',
          '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
          '</ul>'
        ].join('')

        const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
        const navOverflow = new NavOverflow(navEl)

        navEl.addEventListener('update.bs.navoverflow', () => {
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
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      expect(NavOverflow.getInstance(navEl)).toEqual(navOverflow)
      expect(NavOverflow.getInstance(navEl)).toBeInstanceOf(NavOverflow)

      navOverflow.dispose()
    })

    it('should return null when there is no instance', () => {
      fixtureEl.innerHTML = '<ul class="nav"></ul>'

      const navEl = fixtureEl.querySelector('.nav')

      expect(NavOverflow.getInstance(navEl)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return nav overflow instance', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      expect(NavOverflow.getOrCreateInstance(navEl)).toEqual(navOverflow)
      expect(NavOverflow.getInstance(navEl)).toEqual(NavOverflow.getOrCreateInstance(navEl, {}))
      expect(NavOverflow.getOrCreateInstance(navEl)).toBeInstanceOf(NavOverflow)

      navOverflow.dispose()
    })

    it('should return new instance when there is no instance', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('.nav')

      expect(NavOverflow.getInstance(navEl)).toBeNull()

      const instance = NavOverflow.getOrCreateInstance(navEl)
      expect(instance).toBeInstanceOf(NavOverflow)

      instance.dispose()
    })
  })

  describe('overflow behavior', () => {
    it('should use placement option for overflow menu', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const toggle = navEl.querySelector('.nav-overflow-toggle')
      expect(toggle.getAttribute('data-bs-toggle')).toEqual('menu')
      expect(toggle.getAttribute('data-bs-placement')).toEqual('bottom-end')

      navOverflow.dispose()
    })

    it('should preserve nav-overflow-keep items', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="width: 100px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item nav-overflow-keep"><a class="nav-link" href="#">Keep</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)
      const keepItem = navEl.querySelector('.nav-overflow-keep')

      expect(keepItem).not.toHaveClass('d-none')

      navOverflow.dispose()
    })

    it('should hide items that overflow the nav width', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 250px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const hiddenItems = navEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenItems.length).toBeGreaterThan(0)

      for (const item of hiddenItems) {
        expect(item).toHaveClass('d-none')
      }

      navOverflow.dispose()
    })

    it('should show overflow toggle when items overflow', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 250px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const overflowItem = navEl.querySelector('.nav-overflow-item')
      expect(overflowItem).not.toHaveClass('d-none')

      navOverflow.dispose()
    })

    it('should hide overflow toggle when no items overflow', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 5000px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 50px; width: 50px;"><a class="nav-link" href="#">Link 2</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const overflowItem = navEl.querySelector('.nav-overflow-item')
      expect(overflowItem).toHaveClass('d-none')

      navOverflow.dispose()
    })

    it('should clone overflowed items into the menu', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 250px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const menu = navEl.querySelector('.nav-overflow-menu')
      const menuItems = menu.querySelectorAll('.menu-item')
      expect(menuItems.length).toBeGreaterThan(0)

      navOverflow.dispose()
    })

    it('should preserve active state on cloned menu items', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 150px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link active" href="#">Active</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const menu = navEl.querySelector('.nav-overflow-menu')
      const activeMenuItems = menu.querySelectorAll('.menu-item.active')
      const originalActiveHidden = navEl.querySelector('.nav-item[data-bs-nav-overflow="true"] .nav-link.active')

      if (originalActiveHidden) {
        expect(activeMenuItems.length).toBeGreaterThan(0)
      }

      navOverflow.dispose()
    })

    it('should preserve disabled state on cloned menu items', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 150px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link disabled" href="#">Disabled</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const menu = navEl.querySelector('.nav-overflow-menu')
      const disabledMenuItems = menu.querySelectorAll('.menu-item.disabled')
      const originalDisabledHidden = navEl.querySelector('.nav-item[data-bs-nav-overflow="true"] .nav-link.disabled')

      if (originalDisabledHidden) {
        expect(disabledMenuItems.length).toBeGreaterThan(0)
      }

      navOverflow.dispose()
    })

    it('should skip items without a nav-link when moving to overflow', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 150px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><span>No link</span></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')

      expect(() => {
        const navOverflow = new NavOverflow(navEl)
        navOverflow.dispose()
      }).not.toThrow()
    })

    it('should fire overflow event with overflowCount and visibleCount', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 250px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      let eventFired = false
      let receivedOverflowCount = 0
      let receivedVisibleCount = 0

      navEl.addEventListener('overflow.bs.navoverflow', event => {
        eventFired = true
        receivedOverflowCount = event.overflowCount
        receivedVisibleCount = event.visibleCount
      })

      const navOverflow = new NavOverflow(navEl)

      expect(eventFired).toBeTrue()
      expect(receivedOverflowCount).toBeGreaterThan(0)
      expect(receivedVisibleCount).toEqual(jasmine.any(Number))

      navOverflow.dispose()
    })

    it('should restore items when update causes no overflow', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 250px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const hiddenBefore = navEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenBefore.length).toBeGreaterThan(0)

      // Widen the nav to remove overflow
      navEl.style.width = '5000px'
      navOverflow.update()

      const hiddenAfter = navEl.querySelectorAll('.nav-item[data-bs-nav-overflow="true"]')
      expect(hiddenAfter.length).toEqual(0)

      navOverflow.dispose()
    })

    it('should reuse existing overflow toggle and menu from markup', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item">',
        '    <button class="nav-link nav-overflow-toggle" type="button" data-bs-toggle="menu">More</button>',
        '    <div class="nav-overflow-menu menu"></div>',
        '  </li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const existingToggle = navEl.querySelector('.nav-overflow-toggle')
      const navOverflow = new NavOverflow(navEl)

      // Should reuse the existing toggle, not create a new one
      const toggles = navEl.querySelectorAll('.nav-overflow-toggle')
      expect(toggles.length).toEqual(1)
      expect(toggles[0]).toBe(existingToggle)

      navOverflow.dispose()
    })
  })

  describe('config', () => {
    it('should respect custom moreIcon option', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const customIcon = '<span class="custom-icon">...</span>'
      const navOverflow = new NavOverflow(navEl, {
        moreIcon: customIcon
      })

      const iconContainer = navEl.querySelector('.nav-overflow-icon')
      expect(iconContainer.innerHTML).toContain('custom-icon')

      navOverflow.dispose()
    })

    it('should respect threshold option', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 150px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 5</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl, {
        threshold: 2
      })

      const visibleItems = navEl.querySelectorAll('.nav-item:not(.nav-overflow-item):not(.d-none)')
      expect(visibleItems.length).toBeGreaterThanOrEqual(2)

      navOverflow.dispose()
    })

    it('should have correct DefaultType', () => {
      expect(NavOverflow.DefaultType).toEqual(jasmine.objectContaining({
        moreText: 'string',
        moreIcon: 'string',
        threshold: 'number'
      }))
    })
  })

  describe('dispose', () => {
    it('should dispose nav overflow and remove overflow menu', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      expect(NavOverflow.getInstance(navEl)).not.toBeNull()
      expect(navEl.querySelector('.nav-overflow-toggle')).not.toBeNull()

      navOverflow.dispose()

      expect(NavOverflow.getInstance(navEl)).toBeNull()
      expect(navEl.querySelector('.nav-overflow-toggle')).toBeNull()
    })

    it('should disconnect ResizeObserver on dispose', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const observer = navOverflow._resizeObserver
      if (observer) {
        spyOn(observer, 'disconnect').and.callThrough()
        navOverflow.dispose()
        expect(observer.disconnect).toHaveBeenCalled()
      } else {
        navOverflow.dispose()
      }
    })

    it('should restore hidden items on dispose', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" style="display: flex; width: 250px;" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 1</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 2</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 3</a></li>',
        '  <li class="nav-item" style="flex: 0 0 100px; width: 100px;"><a class="nav-link" href="#">Link 4</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      // Verify some items are hidden
      const hiddenBefore = navEl.querySelectorAll('.nav-item.d-none:not(.nav-overflow-item)')
      expect(hiddenBefore.length).toBeGreaterThan(0)

      navOverflow.dispose()

      // After dispose, original items should be visible
      const originalItems = navEl.querySelectorAll('.nav-item:not(.nav-overflow-item)')
      for (const item of originalItems) {
        expect(item).not.toHaveClass('d-none')
      }
    })
  })
})
