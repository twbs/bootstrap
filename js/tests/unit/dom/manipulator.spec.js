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
    it('should set data attribute', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.setDataAttribute(div, 'key', 'value')
      expect(div.getAttribute('data-key')).toEqual('value')
    })

    it('should set data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.setDataAttribute(div, 'testKey', 'value')
      expect(div.getAttribute('data-test-key')).toEqual('value')
    })
  })

  describe('removeDataAttribute', () => {
    it('should remove data attribute', () => {
      fixtureEl.innerHTML = '<div data-key="value"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeDataAttribute(div, 'key')
      expect(div.getAttribute('data-key')).toBeNull()
    })

    it('should remove data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div data-test-key="value"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeDataAttribute(div, 'testKey')
      expect(div.getAttribute('data-test-key')).toBeNull()
    })
  })

  describe('getDataAttributes', () => {
    it('should return empty object for null', () => {
      expect(Manipulator.getDataAttributes(null)).toEqual({})
      expect().nothing()
    })

    it('should get all data attributes', () => {
      fixtureEl.innerHTML = '<div data-test="js" data-test2="js2" ></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttributes(div)).toEqual({
        test: 'js',
        test2: 'js2'
      })
    })
  })

  describe('getDataAttribute', () => {
    it('should get data attribute', () => {
      fixtureEl.innerHTML = '<div data-test="null" ></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttribute(div, 'test')).toBeNull()
    })

    it('should get data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div data-test-key="value" ></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttribute(div, 'testKey')).toEqual('value')
    })

    it('should normalize data', () => {
      fixtureEl.innerHTML = '<div data-test="false" ></div>'

      const div = fixtureEl.querySelector('div')

      expect(Manipulator.getDataAttribute(div, 'test')).toEqual(false)

      div.setAttribute('data-test', 'true')
      expect(Manipulator.getDataAttribute(div, 'test')).toEqual(true)

      div.setAttribute('data-test', '1')
      expect(Manipulator.getDataAttribute(div, 'test')).toEqual(1)
    })
  })

  describe('offset', () => {
    it('should return object with two properties top and left, both numbers', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const offset = Manipulator.offset(div)

      expect(offset).toBeDefined()
      expect(offset.top).toEqual(jasmine.any(Number))
      expect(offset.left).toEqual(jasmine.any(Number))
    })
  })

  describe('position', () => {
    it('should return object with two properties top and left, both numbers', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const position = Manipulator.position(div)

      expect(position).toBeDefined()
      expect(position.top).toEqual(jasmine.any(Number))
      expect(position.left).toEqual(jasmine.any(Number))
    })
  })
})
