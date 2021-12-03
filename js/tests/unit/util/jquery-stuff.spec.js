import * as jQueryUtil from '../../../src/util/jquery-stuff'

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

  describe('getjQuery', () => {
    const fakejQuery = { trigger() {} }

    beforeEach(() => {
      Object.defineProperty(window, 'jQuery', {
        value: fakejQuery,
        writable: true
      })
    })

    afterEach(() => {
      window.jQuery = undefined
    })

    it('should return jQuery object when present', () => {
      expect(jQueryUtil.getjQuery()).toEqual(fakejQuery)
    })

    it('should not return jQuery object when present if data-bs-no-jquery', () => {
      document.body.setAttribute('data-bs-no-jquery', '')

      expect(window.jQuery).toEqual(fakejQuery)
      expect(jQueryUtil.getjQuery()).toBeNull()

      document.body.removeAttribute('data-bs-no-jquery')
    })

    it('should not return jQuery if not present', () => {
      window.jQuery = undefined
      expect(jQueryUtil.getjQuery()).toBeNull()
    })
  })

  describe('getJqueryInterfaceForPlugin', () => {
    it('should return a plugin jQueryInterface if exists', () => {
      const pluginMock = function () {}
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = function () {}

      expect(jQueryUtil.getJqueryInterfaceForPlugin(pluginMock)).toEqual(pluginMock.jQueryInterface)
    })

    it('should return the default `defaultJQueryInterface`, if plugin jQueryInterface doesn\'t exists', () => {
      const pluginMock = function () {}
      pluginMock.NAME = 'test'

      expect(jQueryUtil.getJqueryInterfaceForPlugin(pluginMock)).not.toEqual(pluginMock.jQueryInterface)
      expect(jQueryUtil.getJqueryInterfaceForPlugin(pluginMock)).toEqual(jasmine.any(Function))
    })
  })
})
