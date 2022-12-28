import Config from '../../../src/util/config'
import { clearFixture, getFixture } from '../../helpers/fixture'

class DummyConfigClass extends Config {
  static get NAME() {
    return 'dummy'
  }
}

describe('Config', () => {
  let fixtureEl
  const name = 'dummy'

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('NAME', () => {
    it('should return plugin NAME', () => {
      expect(DummyConfigClass.NAME).toEqual(name)
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type', () => {
      expect(DummyConfigClass.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('Default', () => {
    it('should return plugin defaults', () => {
      expect(DummyConfigClass.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('mergeConfigObj', () => {
    it('should parse element\'s data attributes and merge it with default config. Element\'s data attributes must excel Defaults', () => {
      fixtureEl.innerHTML = '<div id="test" data-bs-test-bool="false" data-bs-test-int="8" data-bs-test-string1="bar"></div>'

      spyOnProperty(DummyConfigClass, 'Default', 'get').and.returnValue({
        testBool: true,
        testString: 'foo',
        testString1: 'foo',
        testInt: 7
      })
      const instance = new DummyConfigClass()
      const configResult = instance._mergeConfigObj({}, fixtureEl.querySelector('#test'))

      expect(configResult.testBool).toEqual(false)
      expect(configResult.testString).toEqual('foo')
      expect(configResult.testString1).toEqual('bar')
      expect(configResult.testInt).toEqual(8)
    })

    it('should parse element\'s data attributes and merge it with default config, plug these given during method call. The programmatically given should excel all', () => {
      fixtureEl.innerHTML = '<div id="test" data-bs-test-bool="false" data-bs-test-int="8" data-bs-test-string-1="bar"></div>'

      spyOnProperty(DummyConfigClass, 'Default', 'get').and.returnValue({
        testBool: true,
        testString: 'foo',
        testString1: 'foo',
        testInt: 7
      })
      const instance = new DummyConfigClass()
      const configResult = instance._mergeConfigObj({
        testString1: 'test',
        testInt: 3
      }, fixtureEl.querySelector('#test'))

      expect(configResult.testBool).toEqual(false)
      expect(configResult.testString).toEqual('foo')
      expect(configResult.testString1).toEqual('test')
      expect(configResult.testInt).toEqual(3)
    })

    it('should parse element\'s data attribute `config` and any rest attributes. The programmatically given should excel all. Data attribute `config` should excel only Defaults', () => {
      fixtureEl.innerHTML = '<div id="test" data-bs-config=\'{"testBool":false,"testInt":50,"testInt2":100}\' data-bs-test-int="8" data-bs-test-string-1="bar"></div>'

      spyOnProperty(DummyConfigClass, 'Default', 'get').and.returnValue({
        testBool: true,
        testString: 'foo',
        testString1: 'foo',
        testInt: 7,
        testInt2: 600
      })
      const instance = new DummyConfigClass()
      const configResult = instance._mergeConfigObj({
        testString1: 'test'
      }, fixtureEl.querySelector('#test'))

      expect(configResult.testBool).toEqual(false)
      expect(configResult.testString).toEqual('foo')
      expect(configResult.testString1).toEqual('test')
      expect(configResult.testInt).toEqual(8)
      expect(configResult.testInt2).toEqual(100)
    })

    it('should omit element\'s data attribute `config` if is not an object', () => {
      fixtureEl.innerHTML = '<div id="test" data-bs-config="foo" data-bs-test-int="8"></div>'

      spyOnProperty(DummyConfigClass, 'Default', 'get').and.returnValue({
        testInt: 7,
        testInt2: 79
      })
      const instance = new DummyConfigClass()
      const configResult = instance._mergeConfigObj({}, fixtureEl.querySelector('#test'))

      expect(configResult.testInt).toEqual(8)
      expect(configResult.testInt2).toEqual(79)
    })
  })

  describe('typeCheckConfig', () => {
    it('should check type of the config object', () => {
      spyOnProperty(DummyConfigClass, 'DefaultType', 'get').and.returnValue({
        toggle: 'boolean',
        parent: '(string|element)'
      })
      const config = {
        toggle: true,
        parent: 777
      }

      const obj = new DummyConfigClass()
      expect(() => {
        obj._typeCheckConfig(config)
      }).toThrowError(TypeError, `${obj.constructor.NAME.toUpperCase()}: Option "parent" provided type "number" but expected type "(string|element)".`)
    })

    it('should return null stringified when null is passed', () => {
      spyOnProperty(DummyConfigClass, 'DefaultType', 'get').and.returnValue({
        toggle: 'boolean',
        parent: '(null|element)'
      })

      const obj = new DummyConfigClass()
      const config = {
        toggle: true,
        parent: null
      }

      obj._typeCheckConfig(config)
      expect().nothing()
    })

    it('should return undefined stringified when undefined is passed', () => {
      spyOnProperty(DummyConfigClass, 'DefaultType', 'get').and.returnValue({
        toggle: 'boolean',
        parent: '(undefined|element)'
      })

      const obj = new DummyConfigClass()
      const config = {
        toggle: true,
        parent: undefined
      }

      obj._typeCheckConfig(config)
      expect().nothing()
    })
  })
})
