import BaseComponent from '../../src/base-component'
import { clearFixture, getFixture } from '../helpers/fixture'
import EventHandler from '../../src/dom/event-handler'
import { noop } from '../../src/util'

class DummyClass extends BaseComponent {
  constructor(element) {
    super(element)

    EventHandler.on(this._element, `click${DummyClass.EVENT_KEY}`, noop)
  }

  static get NAME() {
    return 'dummy'
  }
}

describe('Base Component', () => {
  let fixtureEl
  const name = 'dummy'
  let element
  let instance
  const createInstance = () => {
    fixtureEl.innerHTML = '<div id="foo"></div>'
    element = fixtureEl.querySelector('#foo')
    instance = new DummyClass(element)
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('Static Methods', () => {
    describe('VERSION', () => {
      it('should return version', () => {
        expect(typeof DummyClass.VERSION).toEqual('string')
      })
    })

    describe('DATA_KEY', () => {
      it('should return plugin data key', () => {
        expect(DummyClass.DATA_KEY).toEqual(`bs.${name}`)
      })
    })

    describe('NAME', () => {
      it('should return plugin NAME', () => {
        expect(DummyClass.NAME).toEqual(name)
      })
    })

    describe('EVENT_KEY', () => {
      it('should return plugin event key', () => {
        expect(DummyClass.EVENT_KEY).toEqual(`.bs.${name}`)
      })
    })
  })
  describe('Public Methods', () => {
    describe('constructor', () => {
      it('should accept element, either passed as a CSS selector or DOM element', () => {
        fixtureEl.innerHTML = [
          '<div id="foo"></div>',
          '<div id="bar"></div>'
        ].join('')

        const el = fixtureEl.querySelector('#foo')
        const elInstance = new DummyClass(el)
        const selectorInstance = new DummyClass('#bar')

        expect(elInstance._element).toEqual(el)
        expect(selectorInstance._element).toEqual(fixtureEl.querySelector('#bar'))
      })
    })
    describe('dispose', () => {
      it('should dispose an component', () => {
        createInstance()
        expect(DummyClass.getInstance(element)).not.toBeNull()

        instance.dispose()

        expect(DummyClass.getInstance(element)).toBeNull()
        expect(instance._element).toBeNull()
      })

      it('should de-register element event listeners', () => {
        createInstance()
        spyOn(EventHandler, 'off')

        instance.dispose()

        expect(EventHandler.off).toHaveBeenCalledWith(element, DummyClass.EVENT_KEY)
      })
    })

    describe('getInstance', () => {
      it('should return an instance', () => {
        createInstance()

        expect(DummyClass.getInstance(element)).toEqual(instance)
        expect(DummyClass.getInstance(element)).toBeInstanceOf(DummyClass)
      })

      it('should return null when there is no instance', () => {
        fixtureEl.innerHTML = '<div></div>'

        const div = fixtureEl.querySelector('div')

        expect(DummyClass.getInstance(div)).toEqual(null)
      })
    })
  })
})
