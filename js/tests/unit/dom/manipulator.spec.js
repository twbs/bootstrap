import Manipulator from '../../../src/dom/manipulator'

/** Test helpers */
import { getFixture, clearFixture } from '../../helpers/fixture'

describe('Manipulator', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('setDataAttribute', () => {
    it('should set data attribute prefixed with bs', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.setDataAttribute(div, 'key', 'value')
      expect(div.getAttribute('data-bs-key')).toEqual('value')
    })

    it('should set data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.setDataAttribute(div, 'testKey', 'value')
      expect(div.getAttribute('data-bs-test-key')).toEqual('value')
    })
  })

  describe('removeDataAttribute', () => {
    it('should only remove bs-prefixed data attribute', () => {
      fixtureEl.innerHTML = '<div data-bs-key="value" data-key-bs="postfixed" data-key="value"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeDataAttribute(div, 'key')
      expect(div.getAttribute('data-bs-key')).toBeNull()
      expect(div.getAttribute('data-key-bs')).toEqual('postfixed')
      expect(div.getAttribute('data-key')).toEqual('value')
    })

    it('should remove data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div data-bs-test-key="value"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeDataAttribute(div, 'testKey')
      expect(div.getAttribute('data-bs-test-key')).toBeNull()
    })
  })

  describe('getDataAttributes', () => {
    it('should return an empty object for null', () => {
      expect(Manipulator.getDataAttributes(null)).toEqual({})
      expect().nothing()
    })

    it('should get only bs-prefixed data attributes without bs namespace', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="tabs" data-bs-target="#element" data-another="value" data-target-bs="#element" data-in-bs-out="in-between"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttributes(div)).toEqual({
        toggle: 'tabs',
        target: '#element'
      })
    })
  })

  describe('getDataAttribute', () => {
    it('should only get bs-prefixed data attribute', () => {
      fixtureEl.innerHTML = '<div data-bs-key="value" data-test-bs="postFixed" data-toggle="tab"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttribute(div, 'key')).toEqual('value')
      expect(Manipulator.getDataAttribute(div, 'test')).toBeNull()
      expect(Manipulator.getDataAttribute(div, 'toggle')).toBeNull()
    })

    it('should get data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div data-bs-test-key="value" ></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttribute(div, 'testKey')).toEqual('value')
    })

    it('should normalize data', () => {
      fixtureEl.innerHTML = '<div data-bs-test="false" ></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttribute(div, 'test')).toEqual(false)

      div.setAttribute('data-bs-test', 'true')
      expect(Manipulator.getDataAttribute(div, 'test')).toEqual(true)

      div.setAttribute('data-bs-test', '1')
      expect(Manipulator.getDataAttribute(div, 'test')).toEqual(1)
    })
  })

  describe('offset', () => {
    it('should return an object with two properties top and left, both numbers', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offset = Manipulator.offset(div)

      expect(offset).toBeDefined()
      expect(offset.top).toEqual(jasmine.any(Number))
      expect(offset.left).toEqual(jasmine.any(Number))
    })
  })

  describe('position', () => {
    it('should return an object with two properties top and left, both numbers', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const position = Manipulator.position(div)

      expect(position).toBeDefined()
      expect(position.top).toEqual(jasmine.any(Number))
      expect(position.left).toEqual(jasmine.any(Number))
    })
  })

  describe('toggleClass', () => {
    it('should not error out if element is null or undefined', () => {
      Manipulator.toggleClass(null, 'test')
      Manipulator.toggleClass(undefined, 'test')
      expect().nothing()
    })

    it('should add class if it is missing', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.toggleClass(div, 'test')
      expect(div.classList.contains('test')).toEqual(true)
    })

    it('should remove class if it is set', () => {
      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.toggleClass(div, 'test')
      expect(div.classList.contains('test')).toEqual(false)
    })
  })

  describe('addClass', () => {
    it('should add one class', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.addClass(div, 'test')

      expect(div.classList.contains('test')).toEqual(true)
    })

    it('should add several class', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.addClass(div, 'test', 'd-block', 'd-none')

      expect(div.classList.contains('test')).toEqual(true)
      expect(div.classList.contains('d-block')).toEqual(true)
      expect(div.classList.contains('d-none')).toEqual(true)
    })
  })

  describe('removeClass', () => {
    it('should remove one class', () => {
      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeClass(div, 'test')

      expect(div.classList.contains('test')).toEqual(false)
    })

    it('should remove several class', () => {
      fixtureEl.innerHTML = '<div class="test d-block d-flex"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeClass(div, 'test', 'd-block', 'd-flex')

      expect(div.classList.contains('test')).toEqual(false)
      expect(div.classList.contains('d-block')).toEqual(false)
      expect(div.classList.contains('d-flex')).toEqual(false)
    })
  })

  describe('containsClass', () => {
    it('should return true', () => {
      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.containsClass(div, 'test')).toEqual(true)
    })

    it('should return false', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.containsClass(div, 'test')).toEqual(false)
    })
  })
})
