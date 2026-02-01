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

    it('should create overflow menu toggle and dropdown', () => {
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
      expect(toggle).toHaveClass('dropdown-toggle')
      expect(menu).toHaveClass('dropdown-menu')

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
    it('should use dropdown with container option for overflow menu', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" data-bs-toggle="nav-overflow">',
        '  <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>',
        '</ul>'
      ].join('')

      const navEl = fixtureEl.querySelector('[data-bs-toggle="nav-overflow"]')
      const navOverflow = new NavOverflow(navEl)

      const toggle = navEl.querySelector('.nav-overflow-toggle')
      expect(toggle.getAttribute('data-bs-container')).toEqual('body')
      expect(toggle.getAttribute('data-bs-strategy')).toEqual('fixed')

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

      // The keep item should never be hidden
      expect(keepItem).not.toHaveClass('d-none')

      navOverflow.dispose()
    })
  })
})
