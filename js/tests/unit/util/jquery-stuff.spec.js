import { getJqueryInterfaceForPlugin } from '../../../src/util/jquery-stuff'

describe('Jquery Stuff', () => {
  const fakejQuery = { fn: {} }

  beforeEach(() => {
    Object.defineProperty(window, 'jQuery', {
      value: fakejQuery,
      writable: true
    })
  })

  afterEach(() => {
    window.jQuery = undefined
  })

  describe('getJqueryInterfaceForPlugin', () => {
    it('should return a plugin jQueryInterface if exists', () => {
      const pluginMock = function () {}
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = function () {}

      expect(getJqueryInterfaceForPlugin(pluginMock)).toEqual(pluginMock.jQueryInterface)
    })

    it('should return the default `defaultJQueryInterface`, if plugin jQueryInterface doesn\'t exists', () => {
      const pluginMock = function () {}
      pluginMock.NAME = 'test'

      expect(getJqueryInterfaceForPlugin(pluginMock)).not.toEqual(pluginMock.jQueryInterface)
      expect(getJqueryInterfaceForPlugin(pluginMock)).toEqual(jasmine.any(Function))
    })
  })
})
