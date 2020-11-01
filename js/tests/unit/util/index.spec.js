import * as Util from '../../../src/util/index'

/** Test helpers */
import { getFixture, clearFixture } from '../../helpers/fixture'

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
    it('should get selector from data-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if no data-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if data-target equal to #', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-target="#" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getSelectorFromElement(testEl)).toEqual('.target')
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
    it('should get element from data-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(Util.getElementFromSelector(testEl)).toEqual(fixtureEl.querySelector('.target'))
    })

    it('should get element from href if no data-target set', () => {
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
      fixtureEl.innerHTML = '<div style="transition: all 300ms ease-out;"></div>'

      const el = fixtureEl.querySelector('div')

      el.addEventListener('transitionend', () => {
        expect().nothing()
        done()
      })

      Util.triggerTransitionEnd(el)
    })
  })

  describe('isElement', () => {
    it('should detect if the parameter is an element or not', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = document.querySelector('div')

      expect(Util.isElement(el)).toEqual(el.nodeType)
      expect(Util.isElement({})).toEqual(undefined)
    })

    it('should detect jQuery element', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = document.querySelector('div')
      const fakejQuery = {
        0: el
      }

      expect(Util.isElement(fakejQuery)).toEqual(el.nodeType)
    })
  })

  describe('emulateTransitionEnd', () => {
    it('should emulate transition end', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = document.querySelector('div')
      const spy = spyOn(window, 'setTimeout')

      Util.emulateTransitionEnd(el, 10)
      expect(spy).toHaveBeenCalled()
    })

    it('should not emulate transition end if already triggered', done => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const spy = spyOn(el, 'removeEventListener')

      Util.emulateTransitionEnd(el, 10)
      Util.triggerTransitionEnd(el)

      setTimeout(() => {
        expect(spy).toHaveBeenCalled()
        done()
      }, 20)
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
      }).toThrow(new Error('COLLAPSE: Option "parent" provided type "number" but expected type "(string|element)".'))
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

    it('should return false if the parent element is not visible', () => {
      fixtureEl.innerHTML = [
        '<div style="display: none;">',
        '  <div class="content"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      expect(Util.isVisible(div)).toEqual(false)
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
    it('should return a function', () => {
      expect(typeof Util.noop()).toEqual('function')
    })
  })

  describe('reflow', () => {
    it('should return element offset height to force the reflow', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Util.reflow(div)).toEqual(0)
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

    it('should not return jQuery object when present if data-no-jquery', () => {
      document.body.setAttribute('data-no-jquery', '')

      expect(window.jQuery).toEqual(fakejQuery)
      expect(Util.getjQuery()).toEqual(null)

      document.body.removeAttribute('data-no-jquery')
    })

    it('should not return jQuery if not present', () => {
      window.jQuery = undefined
      expect(Util.getjQuery()).toEqual(null)
    })
  })

  describe('onDOMContentLoaded', () => {
    it('should execute callback when DOMContentLoaded is fired', () => {
      const spy = jasmine.createSpy()
      spyOnProperty(document, 'readyState').and.returnValue('loading')
      Util.onDOMContentLoaded(spy)
      window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      }))
      expect(spy).toHaveBeenCalled()
    })

    it('should execute callback if readyState is not "loading"', () => {
      const spy = jasmine.createSpy()
      Util.onDOMContentLoaded(spy)
      expect(spy).toHaveBeenCalled()
    })
  })
})
