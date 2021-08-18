import * as Util from '../../../src/util/index'

/** Test helpers */
import { clearFixture, getFixture } from '../../helpers/fixture'

describe('Util', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('getUID', () => {
    it('should generate uid', () => {
      const uid = Util.getUID('bs')
      const uid2 = Util.getUID('bs')

      expect(uid).not.toEqual(uid2)
    })
  })

  describe('getSelectorFromElement', () => {
    it('should get selector from data-bs-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if no data-bs-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if data-bs-target equal to #', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-bs-target="#" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should return null if a selector from a href is a url without an anchor', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-bs-target="#" href="foo/bar.html"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toBeNull()
    })

    it('should return the anchor if a selector from a href is a url', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-bs-target="#" href="foo/bar.html#target"></a>',
        '<div id="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('#target')
    })

    it('should return null if selector not found', () => {
      fixtureEl.innerHTML = '<a id="test" href=".target"></a>'

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toBeNull()
    })

    it('should return null if no selector', () => {
      fixtureEl.innerHTML = '<div></div>'

      const testEl = fixtureEl.querySelector('div')

      expect(Util.getSelectorFromElement(testEl)).toBeNull()
    })
  })

  describe('getElementFromSelector', () => {
    it('should get element from data-bs-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getElementFromSelector(testEl)).toEqual(fixtureEl.querySelector('.target'))
    })

    it('should get element from href if no data-bs-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getElementFromSelector(testEl)).toEqual(fixtureEl.querySelector('.target'))
    })

    it('should return null if element not found', () => {
      fixtureEl.innerHTML = '<a id="test" href=".target"></a>'

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getElementFromSelector(testEl)).toBeNull()
    })

    it('should return null if no selector', () => {
      fixtureEl.innerHTML = '<div></div>'

      const testEl = fixtureEl.querySelector('div')

      expect(Util.getElementFromSelector(testEl)).toBeNull()
    })
  })

  describe('getTransitionDurationFromElement', () => {
    it('should get transition from element', () => {
      fixtureEl.innerHTML = '<div style="transition: all 300ms ease-out;"></div>'

      expect(Util.getTransitionDurationFromElement(fixtureEl.querySelector('div'))).toEqual(300)
    })

    it('should return 0 if the element is undefined or null', () => {
      expect(Util.getTransitionDurationFromElement(null)).toEqual(0)
      expect(Util.getTransitionDurationFromElement(undefined)).toEqual(0)
    })

    it('should return 0 if the element do not possess transition', () => {
      fixtureEl.innerHTML = '<div></div>'

      expect(Util.getTransitionDurationFromElement(fixtureEl.querySelector('div'))).toEqual(0)
    })
  })

  describe('triggerTransitionEnd', () => {
    it('should trigger transitionend event', done => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const spy = spyOn(el, 'dispatchEvent').and.callThrough()

      el.addEventListener('transitionend', () => {
        expect(spy).toHaveBeenCalled()
        done()
      })

      Util.triggerTransitionEnd(el)
    })
  })

  describe('isElement', () => {
    it('should detect if the parameter is an element or not and return Boolean', () => {
      fixtureEl.innerHTML =
        [
          '<div id="foo" class="test"></div>',
          '<div id="bar" class="test"></div>'
        ].join('')

      const el = fixtureEl.querySelector('#foo')

      expect(Util.isElement(el)).toEqual(true)
      expect(Util.isElement({})).toEqual(false)
      expect(Util.isElement(fixtureEl.querySelectorAll('.test'))).toEqual(false)
    })

    it('should detect jQuery element', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const fakejQuery = {
        0: el,
        jquery: 'foo'
      }

      expect(Util.isElement(fakejQuery)).toEqual(true)
    })
  })

  describe('getElement', () => {
    it('should try to parse element', () => {
      fixtureEl.innerHTML =
        [
          '<div id="foo" class="test"></div>',
          '<div id="bar" class="test"></div>'
        ].join('')

      const el = fixtureEl.querySelector('div')

      expect(Util.getElement(el)).toEqual(el)
      expect(Util.getElement('#foo')).toEqual(el)
      expect(Util.getElement('#fail')).toBeNull()
      expect(Util.getElement({})).toBeNull()
      expect(Util.getElement([])).toBeNull()
      expect(Util.getElement()).toBeNull()
      expect(Util.getElement(null)).toBeNull()
      expect(Util.getElement(fixtureEl.querySelectorAll('.test'))).toBeNull()

      const fakejQueryObject = {
        0: el,
        jquery: 'foo'
      }

      expect(Util.getElement(fakejQueryObject)).toEqual(el)
    })
  })

  describe('typeCheckConfig', () => {
    const namePlugin = 'collapse'

    it('should check type of the config object', () => {
      const defaultType = {
        toggle: 'boolean',
        parent: '(string|element)'
      }
      const config = {
        toggle: true,
        parent: 777
      }

      expect(() => {
        Util.typeCheckConfig(namePlugin, config, defaultType)
      }).toThrowError(TypeError, 'COLLAPSE: Option "parent" provided type "number" but expected type "(string|element)".')
    })

    it('should return null stringified when null is passed', () => {
      const defaultType = {
        toggle: 'boolean',
        parent: '(null|element)'
      }
      const config = {
        toggle: true,
        parent: null
      }

      Util.typeCheckConfig(namePlugin, config, defaultType)
      expect().nothing()
    })

    it('should return undefined stringified when undefined is passed', () => {
      const defaultType = {
        toggle: 'boolean',
        parent: '(undefined|element)'
      }
      const config = {
        toggle: true,
        parent: undefined
      }

      Util.typeCheckConfig(namePlugin, config, defaultType)
      expect().nothing()
    })
  })

  describe('isVisible', () => {
    it('should return false if the element is not defined', () => {
      expect(Util.isVisible(null)).toEqual(false)
      expect(Util.isVisible(undefined)).toEqual(false)
    })

    it('should return false if the element provided is not a dom element', () => {
      expect(Util.isVisible({})).toEqual(false)
    })

    it('should return false if the element is not visible with display none', () => {
      fixtureEl.innerHTML = '<div style="display: none;"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Util.isVisible(div)).toEqual(false)
    })

    it('should return false if the element is not visible with visibility hidden', () => {
      fixtureEl.innerHTML = '<div style="visibility: hidden;"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Util.isVisible(div)).toEqual(false)
    })

    it('should return false if an ancestor element is display none', () => {
      fixtureEl.innerHTML = [
        '<div style="display: none;">',
        '  <div>',
        '    <div>',
        '      <div class="content"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      expect(Util.isVisible(div)).toEqual(false)
    })

    it('should return false if an ancestor element is visibility hidden', () => {
      fixtureEl.innerHTML = [
        '<div style="visibility: hidden;">',
        '  <div>',
        '    <div>',
        '      <div class="content"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      expect(Util.isVisible(div)).toEqual(false)
    })

    it('should return true if an ancestor element is visibility hidden, but reverted', () => {
      fixtureEl.innerHTML = [
        '<div style="visibility: hidden;">',
        '  <div style="visibility: visible;">',
        '    <div>',
        '      <div class="content"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      expect(Util.isVisible(div)).toEqual(true)
    })

    it('should return true if the element is visible', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isVisible(div)).toEqual(true)
    })

    it('should return false if the element is hidden, but not via display or visibility', () => {
      fixtureEl.innerHTML = [
        '<details>',
        '  <div id="element"></div>',
        '</details>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isVisible(div)).toEqual(false)
    })
  })

  describe('isDisabled', () => {
    it('should return true if the element is not defined', () => {
      expect(Util.isDisabled(null)).toEqual(true)
      expect(Util.isDisabled(undefined)).toEqual(true)
      expect(Util.isDisabled()).toEqual(true)
    })

    it('should return true if the element provided is not a dom element', () => {
      expect(Util.isDisabled({})).toEqual(true)
      expect(Util.isDisabled('test')).toEqual(true)
    })

    it('should return true if the element has disabled attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" disabled="disabled"></div>',
        '  <div id="element1" disabled="true"></div>',
        '  <div id="element2" disabled></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')
      const div1 = fixtureEl.querySelector('#element1')
      const div2 = fixtureEl.querySelector('#element2')

      expect(Util.isDisabled(div)).toEqual(true)
      expect(Util.isDisabled(div1)).toEqual(true)
      expect(Util.isDisabled(div2)).toEqual(true)
    })

    it('should return false if the element has disabled attribute with "false" value, or doesn\'t have attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" disabled="false"></div>',
        '  <div id="element1" ></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')
      const div1 = fixtureEl.querySelector('#element1')

      expect(Util.isDisabled(div)).toEqual(false)
      expect(Util.isDisabled(div1)).toEqual(false)
    })

    it('should return false if the element is not disabled ', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button id="button"></button>',
        '  <select id="select"></select>',
        '  <select id="input"></select>',
        '</div>'
      ].join('')

      const el = selector => fixtureEl.querySelector(selector)

      expect(Util.isDisabled(el('#button'))).toEqual(false)
      expect(Util.isDisabled(el('#select'))).toEqual(false)
      expect(Util.isDisabled(el('#input'))).toEqual(false)
    })
    it('should return true if the element has disabled attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <input id="input" disabled="disabled"/>',
        '  <input id="input1" disabled="disabled"/>',
        '  <button id="button" disabled="true"></button>',
        '  <button id="button1" disabled="disabled"></button>',
        '  <button id="button2" disabled></button>',
        '  <select id="select" disabled></select>',
        '  <select id="input" disabled></select>',
        '</div>'
      ].join('')

      const el = selector => fixtureEl.querySelector(selector)

      expect(Util.isDisabled(el('#input'))).toEqual(true)
      expect(Util.isDisabled(el('#input1'))).toEqual(true)
      expect(Util.isDisabled(el('#button'))).toEqual(true)
      expect(Util.isDisabled(el('#button1'))).toEqual(true)
      expect(Util.isDisabled(el('#button2'))).toEqual(true)
      expect(Util.isDisabled(el('#input'))).toEqual(true)
    })

    it('should return true if the element has class "disabled"', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" class="disabled"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isDisabled(div)).toEqual(true)
    })

    it('should return true if the element has class "disabled" but disabled attribute is false', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <input id="input" class="disabled" disabled="false"/>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#input')

      expect(Util.isDisabled(div)).toEqual(true)
    })
  })

  describe('findShadowRoot', () => {
    it('should return null if shadow dom is not available', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        expect().nothing()
        return
      }

      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      spyOn(document.documentElement, 'attachShadow').and.returnValue(null)

      expect(Util.findShadowRoot(div)).toEqual(null)
    })

    it('should return null when we do not find a shadow root', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        expect().nothing()
        return
      }

      spyOn(document, 'getRootNode').and.returnValue(undefined)

      expect(Util.findShadowRoot(document)).toEqual(null)
    })

    it('should return the shadow root when found', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        expect().nothing()
        return
      }

      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const shadowRoot = div.attachShadow({
        mode: 'open'
      })

      expect(Util.findShadowRoot(shadowRoot)).toEqual(shadowRoot)

      shadowRoot.innerHTML = '<button>Shadow Button</button>'

      expect(Util.findShadowRoot(shadowRoot.firstChild)).toEqual(shadowRoot)
    })
  })

  describe('noop', () => {
    it('should be a function', () => {
      expect(typeof Util.noop).toEqual('function')
    })
  })

  describe('reflow', () => {
    it('should return element offset height to force the reflow', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const spy = spyOnProperty(div, 'offsetHeight')
      Util.reflow(div)
      expect(spy).toHaveBeenCalled()
    })
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
      expect(Util.getjQuery()).toEqual(fakejQuery)
    })

    it('should not return jQuery object when present if data-bs-no-jquery', () => {
      document.body.setAttribute('data-bs-no-jquery', '')

      expect(window.jQuery).toEqual(fakejQuery)
      expect(Util.getjQuery()).toEqual(null)

      document.body.removeAttribute('data-bs-no-jquery')
    })

    it('should not return jQuery if not present', () => {
      window.jQuery = undefined
      expect(Util.getjQuery()).toEqual(null)
    })
  })

  describe('onDOMContentLoaded', () => {
    it('should execute callbacks when DOMContentLoaded is fired and should not add more than one listener', () => {
      const spy = jasmine.createSpy()
      const spy2 = jasmine.createSpy()

      spyOn(document, 'addEventListener').and.callThrough()
      spyOnProperty(document, 'readyState').and.returnValue('loading')

      Util.onDOMContentLoaded(spy)
      Util.onDOMContentLoaded(spy2)

      document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      }))

      expect(spy).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      expect(document.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('should execute callback if readyState is not "loading"', () => {
      const spy = jasmine.createSpy()
      Util.onDOMContentLoaded(spy)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('defineJQueryPlugin', () => {
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

    it('should define a plugin on the jQuery instance', () => {
      const pluginMock = function () {}
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = function () {}

      Util.defineJQueryPlugin(pluginMock)
      expect(fakejQuery.fn.test).toBe(pluginMock.jQueryInterface)
      expect(fakejQuery.fn.test.Constructor).toBe(pluginMock)
      expect(typeof fakejQuery.fn.test.noConflict).toEqual('function')
    })
  })

  describe('execute', () => {
    it('should execute if arg is function', () => {
      const spy = jasmine.createSpy('spy')
      Util.execute(spy)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('executeAfterTransition', () => {
    it('should immediately execute a function when waitForTransition parameter is false', () => {
      const el = document.createElement('div')
      const callbackSpy = jasmine.createSpy('callback spy')
      const eventListenerSpy = spyOn(el, 'addEventListener')

      Util.executeAfterTransition(callbackSpy, el, false)

      expect(callbackSpy).toHaveBeenCalled()
      expect(eventListenerSpy).not.toHaveBeenCalled()
    })

    it('should execute a function when a transitionend event is dispatched', () => {
      const el = document.createElement('div')
      const callbackSpy = jasmine.createSpy('callback spy')

      spyOn(window, 'getComputedStyle').and.returnValue({
        transitionDuration: '0.05s',
        transitionDelay: '0s'
      })

      Util.executeAfterTransition(callbackSpy, el)

      el.dispatchEvent(new TransitionEvent('transitionend'))

      expect(callbackSpy).toHaveBeenCalled()
    })

    it('should execute a function after a computed CSS transition duration and there was no transitionend event dispatched', done => {
      const el = document.createElement('div')
      const callbackSpy = jasmine.createSpy('callback spy')

      spyOn(window, 'getComputedStyle').and.returnValue({
        transitionDuration: '0.05s',
        transitionDelay: '0s'
      })

      Util.executeAfterTransition(callbackSpy, el)

      setTimeout(() => {
        expect(callbackSpy).toHaveBeenCalled()
        done()
      }, 70)
    })

    it('should not execute a function a second time after a computed CSS transition duration and if a transitionend event has already been dispatched', done => {
      const el = document.createElement('div')
      const callbackSpy = jasmine.createSpy('callback spy')

      spyOn(window, 'getComputedStyle').and.returnValue({
        transitionDuration: '0.05s',
        transitionDelay: '0s'
      })

      Util.executeAfterTransition(callbackSpy, el)

      setTimeout(() => {
        el.dispatchEvent(new TransitionEvent('transitionend'))
      }, 50)

      setTimeout(() => {
        expect(callbackSpy).toHaveBeenCalledTimes(1)
        done()
      }, 70)
    })

    it('should not trigger a transitionend event if another transitionend event had already happened', done => {
      const el = document.createElement('div')

      spyOn(window, 'getComputedStyle').and.returnValue({
        transitionDuration: '0.05s',
        transitionDelay: '0s'
      })

      Util.executeAfterTransition(() => {}, el)

      // simulate a event dispatched by the browser
      el.dispatchEvent(new TransitionEvent('transitionend'))

      const dispatchSpy = spyOn(el, 'dispatchEvent').and.callThrough()

      setTimeout(() => {
        // setTimeout should not have triggered another transitionend event.
        expect(dispatchSpy).not.toHaveBeenCalled()
        done()
      }, 70)
    })

    it('should ignore transitionend events from nested elements', done => {
      fixtureEl.innerHTML = [
        '<div class="outer">',
        '  <div class="nested"></div>',
        '</div>'
      ].join('')

      const outer = fixtureEl.querySelector('.outer')
      const nested = fixtureEl.querySelector('.nested')
      const callbackSpy = jasmine.createSpy('callback spy')

      spyOn(window, 'getComputedStyle').and.returnValue({
        transitionDuration: '0.05s',
        transitionDelay: '0s'
      })

      Util.executeAfterTransition(callbackSpy, outer)

      nested.dispatchEvent(new TransitionEvent('transitionend', {
        bubbles: true
      }))

      setTimeout(() => {
        expect(callbackSpy).not.toHaveBeenCalled()
      }, 20)

      setTimeout(() => {
        expect(callbackSpy).toHaveBeenCalled()
        done()
      }, 70)
    })
  })

  describe('getNextActiveElement', () => {
    it('should return first element if active not exists or not given and shouldGetNext is either true, or false with cycling being disabled', () => {
      const array = ['a', 'b', 'c', 'd']

      expect(Util.getNextActiveElement(array, '', true, true)).toEqual('a')
      expect(Util.getNextActiveElement(array, 'g', true, true)).toEqual('a')
      expect(Util.getNextActiveElement(array, '', true, false)).toEqual('a')
      expect(Util.getNextActiveElement(array, 'g', true, false)).toEqual('a')
      expect(Util.getNextActiveElement(array, '', false, false)).toEqual('a')
      expect(Util.getNextActiveElement(array, 'g', false, false)).toEqual('a')
    })

    it('should return last element if active not exists or not given and shouldGetNext is false but cycling is enabled', () => {
      const array = ['a', 'b', 'c', 'd']

      expect(Util.getNextActiveElement(array, '', false, true)).toEqual('d')
      expect(Util.getNextActiveElement(array, 'g', false, true)).toEqual('d')
    })

    it('should return next element or same if is last', () => {
      const array = ['a', 'b', 'c', 'd']

      expect(Util.getNextActiveElement(array, 'a', true, true)).toEqual('b')
      expect(Util.getNextActiveElement(array, 'b', true, true)).toEqual('c')
      expect(Util.getNextActiveElement(array, 'd', true, false)).toEqual('d')
    })

    it('should return next element or first, if is last and "isCycleAllowed = true"', () => {
      const array = ['a', 'b', 'c', 'd']

      expect(Util.getNextActiveElement(array, 'c', true, true)).toEqual('d')
      expect(Util.getNextActiveElement(array, 'd', true, true)).toEqual('a')
    })

    it('should return previous element or same if is first', () => {
      const array = ['a', 'b', 'c', 'd']

      expect(Util.getNextActiveElement(array, 'b', false, true)).toEqual('a')
      expect(Util.getNextActiveElement(array, 'd', false, true)).toEqual('c')
      expect(Util.getNextActiveElement(array, 'a', false, false)).toEqual('a')
    })

    it('should return next element or first, if is last and "isCycleAllowed = true"', () => {
      const array = ['a', 'b', 'c', 'd']

      expect(Util.getNextActiveElement(array, 'd', false, true)).toEqual('c')
      expect(Util.getNextActiveElement(array, 'a', false, true)).toEqual('d')
    })
  })
})
