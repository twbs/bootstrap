import Popover from '../../src/popover'

/** Test helpers */
import { getFixture, clearFixture, jQueryMock } from '../helpers/fixture'

describe('Popover', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()

    const popoverList = document.querySelectorAll('.popover')

    popoverList.forEach(popoverEl => {
      document.body.removeChild(popoverEl)
    })
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Popover.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Popover.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('NAME', () => {
    it('should return plugin name', () => {
      expect(Popover.NAME).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Popover.DATA_KEY).toEqual('bs.popover')
    })
  })

  describe('Event', () => {
    it('should return plugin events', () => {
      expect(Popover.Event).toEqual(jasmine.any(Object))
    })
  })

  describe('EVENT_KEY', () => {
    it('should return plugin event key', () => {
      expect(Popover.EVENT_KEY).toEqual('.bs.popover')
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type', () => {
      expect(Popover.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('show', () => {
    it('should show a popover', done => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      popoverEl.addEventListener('shown.bs.popover', () => {
        expect(document.querySelector('.popover')).not.toBeNull()
        done()
      })

      popover.show()
    })

    it('should set title and content from functions', done => {
      fixtureEl.innerHTML = '<a href="#">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl, {
        title: () => 'Bootstrap',
        content: () => 'loves writing tests （╯°□°）╯︵ ┻━┻'
      })

      popoverEl.addEventListener('shown.bs.popover', () => {
        const popoverDisplayed = document.querySelector('.popover')

        expect(popoverDisplayed).not.toBeNull()
        expect(popoverDisplayed.querySelector('.popover-header').textContent).toEqual('Bootstrap')
        expect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('loves writing tests （╯°□°）╯︵ ┻━┻')
        done()
      })

      popover.show()
    })

    it('should show a popover with just content', done => {
      fixtureEl.innerHTML = '<a href="#">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl, {
        content: 'Popover content'
      })

      popoverEl.addEventListener('shown.bs.popover', () => {
        const popoverDisplayed = document.querySelector('.popover')

        expect(popoverDisplayed).not.toBeNull()
        expect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('Popover content')
        done()
      })

      popover.show()
    })

    it('should show a popover with just content without having header', done => {
      fixtureEl.innerHTML = '<a href="#">Nice link</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl, {
        content: 'Some beautiful content :)'
      })

      popoverEl.addEventListener('shown.bs.popover', () => {
        const popoverDisplayed = document.querySelector('.popover')

        expect(popoverDisplayed).not.toBeNull()
        expect(popoverDisplayed.querySelector('.popover-header')).toBeNull()
        expect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('Some beautiful content :)')
        done()
      })

      popover.show()
    })

    it('should show a popover with just title without having body', done => {
      fixtureEl.innerHTML = '<a href="#">Nice link</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl, {
        title: 'Title, which does not require content'
      })

      popoverEl.addEventListener('shown.bs.popover', () => {
        const popoverDisplayed = document.querySelector('.popover')

        expect(popoverDisplayed).not.toBeNull()
        expect(popoverDisplayed.querySelector('.popover-body')).toBeNull()
        expect(popoverDisplayed.querySelector('.popover-header').textContent).toEqual('Title, which does not require content')
        done()
      })

      popover.show()
    })

    it('should show a popover with provided custom class', done => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap" data-bs-custom-class="custom-class">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      popoverEl.addEventListener('shown.bs.popover', () => {
        const tip = document.querySelector('.popover')
        expect(tip).not.toBeNull()
        expect(tip.classList.contains('custom-class')).toBeTrue()
        done()
      })

      popover.show()
    })
  })

  describe('hide', () => {
    it('should hide a popover', done => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      popoverEl.addEventListener('shown.bs.popover', () => {
        popover.hide()
      })

      popoverEl.addEventListener('hidden.bs.popover', () => {
        expect(document.querySelector('.popover')).toBeNull()
        done()
      })

      popover.show()
    })
  })

  describe('jQueryInterface', () => {
    it('should create a popover', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock)

      expect(Popover.getInstance(popoverEl)).not.toBeNull()
    })

    it('should create a popover with a config object', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock, {
        content: 'Popover content'
      })

      expect(Popover.getInstance(popoverEl)).not.toBeNull()
    })

    it('should not re create a popover', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock)

      expect(Popover.getInstance(popoverEl)).toEqual(popover)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const action = 'undefinedMethod'

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      expect(() => {
        jQueryMock.fn.popover.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should should call show method', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      spyOn(popover, 'show')

      jQueryMock.fn.popover.call(jQueryMock, 'show')

      expect(popover.show).toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return popover instance', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      expect(Popover.getInstance(popoverEl)).toEqual(popover)
      expect(Popover.getInstance(popoverEl)).toBeInstanceOf(Popover)
    })

    it('should return null when there is no popover instance', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      expect(Popover.getInstance(popoverEl)).toEqual(null)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return popover instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const popover = new Popover(div)

      expect(Popover.getOrCreateInstance(div)).toEqual(popover)
      expect(Popover.getInstance(div)).toEqual(Popover.getOrCreateInstance(div, {}))
      expect(Popover.getOrCreateInstance(div)).toBeInstanceOf(Popover)
    })

    it('should return new instance when there is no popover instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Popover.getInstance(div)).toEqual(null)
      expect(Popover.getOrCreateInstance(div)).toBeInstanceOf(Popover)
    })

    it('should return new instance when there is no popover instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Popover.getInstance(div)).toEqual(null)
      const popover = Popover.getOrCreateInstance(div, {
        placement: 'top'
      })
      expect(popover).toBeInstanceOf(Popover)

      expect(popover._config.placement).toEqual('top')
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const popover = new Popover(div, {
        placement: 'top'
      })
      expect(Popover.getInstance(div)).toEqual(popover)

      const popover2 = Popover.getOrCreateInstance(div, {
        placement: 'bottom'
      })
      expect(popover).toBeInstanceOf(Popover)
      expect(popover2).toEqual(popover)

      expect(popover2._config.placement).toEqual('top')
    })
  })
})
