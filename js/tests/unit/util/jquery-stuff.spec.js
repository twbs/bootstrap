import * as jQueryUtil from '../../../src/util/jquery-stuff'
import { noop } from '../../../src/util/index'

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
    const fakejQuery = {
      trigger: noop
    }

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

  describe('defineJQueryPlugin', () => {
    it('should define a plugin on the jQuery instance', () => {
      const pluginMock = noop
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = noop

      jQueryUtil.defineJQueryPlugin(pluginMock)
      expect(fakejQuery.fn.test).toEqual(pluginMock.jQueryInterface)
      expect(fakejQuery.fn.test.Constructor).toEqual(pluginMock)
      expect(fakejQuery.fn.test.noConflict).toEqual(jasmine.any(Function))
    })
  })

  describe('getJqueryInterfaceForPlugin', () => {
    it('should return a plugin jQueryInterface if exists', () => {
      const pluginMock = noop
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = noop

      expect(jQueryUtil.getJqueryInterfaceForPlugin(pluginMock)).toEqual(pluginMock.jQueryInterface)
    })

    it('should return the default `defaultJQueryInterface`, if plugin jQueryInterface doesn\'t exists', () => {
      const pluginMock = noop
      pluginMock.NAME = 'test'

      expect(jQueryUtil.getJqueryInterfaceForPlugin(pluginMock)).toEqual(jasmine.any(Function))
    })
  })
})
