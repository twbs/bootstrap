import Config from '../../../src/util/config'

class DummyConfigClass extends Config {
  static get NAME() {
    return 'dummy'
  }
}

describe('Config', () => {
  const name = 'dummy'
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
      }).toThrowError(TypeError, obj.constructor.NAME.toUpperCase() + ': Option "parent" provided type "number" but expected type "(string|element)".')
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
