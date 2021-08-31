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

    it('should return offset relative to attached element\'s offset', () => {
      const top = 500
      const left = 1000

      fixtureEl.innerHTML = `<div style="position:absolute;top:${top}px;left:${left}px"></div>`

      const div = fixtureEl.querySelector('div')
      const offset = Manipulator.offset(div)
      const fixtureOffset = Manipulator.offset(fixtureEl)

      expect(offset).toEqual({
        top: fixtureOffset.top + top,
        left: fixtureOffset.left + left
      })
    })

    it('should not change offset when viewport is scrolled', done => {
      const top = 500
      const left = 1000
      const scrollY = 200
      const scrollX = 400

      fixtureEl.innerHTML = `<div style="position:absolute;top:${top}px;left:${left}px"></div>`

      const div = fixtureEl.querySelector('div')
      const offset = Manipulator.offset(div)

      // append an element that forces scrollbars on the window so we can scroll
      const { defaultView: win, body } = fixtureEl.ownerDocument
      const forceScrollBars = document.createElement('div')
      forceScrollBars.style.cssText = 'position:absolute;top:5000px;left:5000px;width:1px;height:1px'
      body.append(forceScrollBars)

      const scrollHandler = () => {
        expect(window.pageYOffset).toBe(scrollY)
        expect(window.pageXOffset).toBe(scrollX)

        const newOffset = Manipulator.offset(div)

        expect(newOffset).toEqual({
          top: offset.top,
          left: offset.left
        })

        win.removeEventListener('scroll', scrollHandler)
        forceScrollBars.remove()
        win.scrollTo(0, 0)
        done()
      }

      win.addEventListener('scroll', scrollHandler)
      win.scrollTo(scrollX, scrollY)
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
})
