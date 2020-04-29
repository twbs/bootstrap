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
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      popoverEl.addEventListener('shown.bs.popover', () => {
        expect(document.querySelector('.popover')).toBeDefined()
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

        expect(popoverDisplayed).toBeDefined()
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

        expect(popoverDisplayed).toBeDefined()
        expect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('Popover content')
        done()
      })

      popover.show()
    })
  })

  describe('hide', () => {
    it('should hide a popover', done => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

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
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock)

      expect(Popover.getInstance(popoverEl)).toBeDefined()
    })

    it('should create a popover with a config object', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock, {
        content: 'Popover content'
      })

      expect(Popover.getInstance(popoverEl)).toBeDefined()
    })

    it('should not re create a popover', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock)

      expect(Popover.getInstance(popoverEl)).toEqual(popover)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const action = 'undefinedMethod'

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      try {
        jQueryMock.fn.popover.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
    })

    it('should should call show method', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      spyOn(popover, 'show')

      jQueryMock.fn.popover.call(jQueryMock, 'show')

      expect(popover.show).toHaveBeenCalled()
    })

    it('should do nothing if dipose is called when a popover do not exist', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      spyOn(Popover.prototype, 'dispose')

      jQueryMock.fn.popover.call(jQueryMock, 'dispose')

      expect(Popover.prototype.dispose).not.toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return popover instance', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      expect(Popover.getInstance(popoverEl)).toEqual(popover)
    })

    it('should return null when there is no popover instance', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      expect(Popover.getInstance(popoverEl)).toEqual(null)
    })
  })
})
