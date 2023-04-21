import * as Util from '../../../src/util/index.js'
import { noop } from '../../../src/util/index.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

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
    it('should trigger transitionend event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const el = fixtureEl.querySelector('div')
        const spy = spyOn(el, 'dispatchEvent').and.callThrough()

        el.addEventListener('transitionend', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        Util.triggerTransitionEnd(el)
      })
    })
  })

  describe('isElement', () => {
    it('should detect if the parameter is an element or not and return Boolean', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test"></div>',
        '<div id="bar" class="test"></div>'
      ].join('')

      const el = fixtureEl.querySelector('#foo')

      expect(Util.isElement(el)).toBeTrue()
      expect(Util.isElement({})).toBeFalse()
      expect(Util.isElement(fixtureEl.querySelectorAll('.test'))).toBeFalse()
    })

    it('should detect jQuery element', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const fakejQuery = {
        0: el,
        jquery: 'foo'
      }

      expect(Util.isElement(fakejQuery)).toBeTrue()
    })
  })

  describe('getElement', () => {
    it('should try to parse element', () => {
      fixtureEl.innerHTML = [
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

  describe('isVisible', () => {
    it('should return false if the element is not defined', () => {
      expect(Util.isVisible(null)).toBeFalse()
      expect(Util.isVisible(undefined)).toBeFalse()
    })

    it('should return false if the element provided is not a dom element', () => {
      expect(Util.isVisible({})).toBeFalse()
    })

    it('should return false if the element is not visible with display none', () => {
      fixtureEl.innerHTML = '<div style="display: none;"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Util.isVisible(div)).toBeFalse()
    })

    it('should return false if the element is not visible with visibility hidden', () => {
      fixtureEl.innerHTML = '<div style="visibility: hidden;"></div>'

      const div = fixtureEl.querySelector('div')

      expect(Util.isVisible(div)).toBeFalse()
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

      expect(Util.isVisible(div)).toBeFalse()
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

      expect(Util.isVisible(div)).toBeFalse()
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

      expect(Util.isVisible(div)).toBeTrue()
    })

    it('should return true if the element is visible', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isVisible(div)).toBeTrue()
    })

    it('should return false if the element is hidden, but not via display or visibility', () => {
      fixtureEl.innerHTML = [
        '<details>',
        '  <div id="element"></div>',
        '</details>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isVisible(div)).toBeFalse()
    })

    it('should return true if its a closed details element', () => {
      fixtureEl.innerHTML = '<details id="element"></details>'

      const div = fixtureEl.querySelector('#element')

      expect(Util.isVisible(div)).toBeTrue()
    })

    it('should return true if the element is visible inside an open details element', () => {
      fixtureEl.innerHTML = [
        '<details open>',
        '  <div id="element"></div>',
        '</details>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isVisible(div)).toBeTrue()
    })

    it('should return true if the element is a visible summary in a closed details element', () => {
      fixtureEl.innerHTML = [
        '<details>',
        '  <summary id="element-1">',
        '    <span id="element-2"></span>',
        '  </summary>',
        '</details>'
      ].join('')

      const element1 = fixtureEl.querySelector('#element-1')
      const element2 = fixtureEl.querySelector('#element-2')

      expect(Util.isVisible(element1)).toBeTrue()
      expect(Util.isVisible(element2)).toBeTrue()
    })
  })

  describe('isDisabled', () => {
    it('should return true if the element is not defined', () => {
      expect(Util.isDisabled(null)).toBeTrue()
      expect(Util.isDisabled(undefined)).toBeTrue()
      expect(Util.isDisabled()).toBeTrue()
    })

    it('should return true if the element provided is not a dom element', () => {
      expect(Util.isDisabled({})).toBeTrue()
      expect(Util.isDisabled('test')).toBeTrue()
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

      expect(Util.isDisabled(div)).toBeTrue()
      expect(Util.isDisabled(div1)).toBeTrue()
      expect(Util.isDisabled(div2)).toBeTrue()
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

      expect(Util.isDisabled(div)).toBeFalse()
      expect(Util.isDisabled(div1)).toBeFalse()
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

      expect(Util.isDisabled(el('#button'))).toBeFalse()
      expect(Util.isDisabled(el('#select'))).toBeFalse()
      expect(Util.isDisabled(el('#input'))).toBeFalse()
    })

    it('should return true if the element has disabled attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <input id="input" disabled="disabled">',
        '  <input id="input1" disabled="disabled">',
        '  <button id="button" disabled="true"></button>',
        '  <button id="button1" disabled="disabled"></button>',
        '  <button id="button2" disabled></button>',
        '  <select id="select" disabled></select>',
        '  <select id="input" disabled></select>',
        '</div>'
      ].join('')

      const el = selector => fixtureEl.querySelector(selector)

      expect(Util.isDisabled(el('#input'))).toBeTrue()
      expect(Util.isDisabled(el('#input1'))).toBeTrue()
      expect(Util.isDisabled(el('#button'))).toBeTrue()
      expect(Util.isDisabled(el('#button1'))).toBeTrue()
      expect(Util.isDisabled(el('#button2'))).toBeTrue()
      expect(Util.isDisabled(el('#input'))).toBeTrue()
    })

    it('should return true if the element has class "disabled"', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" class="disabled"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      expect(Util.isDisabled(div)).toBeTrue()
    })

    it('should return true if the element has class "disabled" but disabled attribute is false', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <input id="input" class="disabled" disabled="false">',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#input')

      expect(Util.isDisabled(div)).toBeTrue()
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

      expect(Util.findShadowRoot(div)).toBeNull()
    })

    it('should return null when we do not find a shadow root', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        expect().nothing()
        return
      }

      spyOn(document, 'getRootNode').and.returnValue(undefined)

      expect(Util.findShadowRoot(document)).toBeNull()
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
      expect(Util.noop).toEqual(jasmine.any(Function))
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
      expect(Util.getjQuery()).toBeNull()

      document.body.removeAttribute('data-bs-no-jquery')
    })

    it('should not return jQuery if not present', () => {
      window.jQuery = undefined
      expect(Util.getjQuery()).toBeNull()
    })
  })

  describe('onDOMContentLoaded', () => {
    it('should execute callbacks when DOMContentLoaded is fired and should not add more than one listener', () => {
      const spy = jasmine.createSpy()
      const spy2 = jasmine.createSpy()

      const spyAdd = spyOn(document, 'addEventListener').and.callThrough()
      spyOnProperty(document, 'readyState').and.returnValue('loading')

      Util.onDOMContentLoaded(spy)
      Util.onDOMContentLoaded(spy2)

      document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      }))

      expect(spy).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      expect(spyAdd).toHaveBeenCalledTimes(1)
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
      const pluginMock = Util.noop
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = Util.noop

      Util.defineJQueryPlugin(pluginMock)
      expect(fakejQuery.fn.test).toEqual(pluginMock.jQueryInterface)
      expect(fakejQuery.fn.test.Constructor).toEqual(pluginMock)
      expect(fakejQuery.fn.test.noConflict).toEqual(jasmine.any(Function))
    })
  })

  describe('execute', () => {
    it('should execute if arg is function', () => {
      const spy = jasmine.createSpy('spy')
      Util.execute(spy)
      expect(spy).toHaveBeenCalled()
    })

    it('should execute if arg is function & return the result', () => {
      const functionFoo = (num1, num2 = 10) => num1 + num2
      const resultFoo = Util.execute(functionFoo, [4, 5])
      expect(resultFoo).toBe(9)

      const resultFoo1 = Util.execute(functionFoo, [4])
      expect(resultFoo1).toBe(14)

      const functionBar = () => 'foo'
      const resultBar = Util.execute(functionBar)
      expect(resultBar).toBe('foo')
    })

    it('should not execute if arg is not function & return default argument', () => {
      const foo = 'bar'
      expect(Util.execute(foo)).toBe('bar')
      expect(Util.execute(foo, [], 4)).toBe(4)
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

    it('should execute a function after a computed CSS transition duration and there was no transitionend event dispatched', () => {
      return new Promise(resolve => {
        const el = document.createElement('div')
        const callbackSpy = jasmine.createSpy('callback spy')

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.05s',
          transitionDelay: '0s'
        })

        Util.executeAfterTransition(callbackSpy, el)

        setTimeout(() => {
          expect(callbackSpy).toHaveBeenCalled()
          resolve()
        }, 70)
      })
    })

    it('should not execute a function a second time after a computed CSS transition duration and if a transitionend event has already been dispatched', () => {
      return new Promise(resolve => {
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
          resolve()
        }, 70)
      })
    })

    it('should not trigger a transitionend event if another transitionend event had already happened', () => {
      return new Promise(resolve => {
        const el = document.createElement('div')

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.05s',
          transitionDelay: '0s'
        })

        Util.executeAfterTransition(noop, el)

        // simulate a event dispatched by the browser
        el.dispatchEvent(new TransitionEvent('transitionend'))

        const dispatchSpy = spyOn(el, 'dispatchEvent').and.callThrough()

        setTimeout(() => {
          // setTimeout should not have triggered another transitionend event.
          expect(dispatchSpy).not.toHaveBeenCalled()
          resolve()
        }, 70)
      })
    })

    it('should ignore transitionend events from nested elements', () => {
      return new Promise(resolve => {
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
          resolve()
        }, 70)
      })
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
