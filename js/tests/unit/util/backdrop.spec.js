import Backdrop from '../../../src/util/backdrop'
import { getTransitionDurationFromElement } from '../../../src/util/index'
import { clearFixture, getFixture } from '../../helpers/fixture'

const CLASS_BACKDROP = '.modal-backdrop'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

describe('Backdrop', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    const list = document.querySelectorAll(CLASS_BACKDROP)

    list.forEach(el => {
      document.body.removeChild(el)
    })
  })

  describe('show', () => {
    it('if it is "shown", should append the backdrop html once, on show, and contain "show" class', done => {
      const instance = new Backdrop({
        isVisible: true,
        isAnimated: false
      })
      const getElements = () => document.querySelectorAll(CLASS_BACKDROP)

      expect(getElements().length).toEqual(0)

      instance.show()
      instance.show(() => {
        expect(getElements().length).toEqual(1)
        getElements().forEach(el => {
          expect(el.classList.contains(CLASS_NAME_SHOW)).toEqual(true)
        })
        done()
      })
    })

    it('if it is not "shown", should not append the backdrop html', done => {
      const instance = new Backdrop({
        isVisible: false,
        isAnimated: true
      })
      const getElements = () => document.querySelectorAll(CLASS_BACKDROP)

      expect(getElements().length).toEqual(0)
      instance.show(() => {
        expect(getElements().length).toEqual(0)
        done()
      })
    })

    it('if it is "shown" and "animated", should append the backdrop html once, and contain "fade" class', done => {
      const instance = new Backdrop({
        isVisible: true,
        isAnimated: true
      })
      const getElements = () => document.querySelectorAll(CLASS_BACKDROP)

      expect(getElements().length).toEqual(0)

      instance.show(() => {
        expect(getElements().length).toEqual(1)
        getElements().forEach(el => {
          expect(el.classList.contains(CLASS_NAME_FADE)).toEqual(true)
        })
        done()
      })
    })

    it('Should be appended on "document.body" by default', done => {
      const instance = new Backdrop({
        isVisible: true
      })
      const getElement = () => document.querySelector(CLASS_BACKDROP)
      instance.show(() => {
        expect(getElement().parentElement).toEqual(document.body)
        done()
      })
    })

    it('Should appended on any element given by the proper config', done => {
      fixtureEl.innerHTML = [
        '<div id="wrapper">',
        '</div>'
      ].join('')

      const wrapper = fixtureEl.querySelector('#wrapper')
      const instance = new Backdrop({
        isVisible: true,
        rootElement: wrapper
      })
      const getElement = () => document.querySelector(CLASS_BACKDROP)
      instance.show(() => {
        expect(getElement().parentElement).toEqual(wrapper)
        done()
      })
    })
  })

  describe('hide', () => {
    it('should remove the backdrop html', done => {
      const instance = new Backdrop({
        isVisible: true,
        isAnimated: true
      })

      const getElements = () => document.body.querySelectorAll(CLASS_BACKDROP)

      expect(getElements().length).toEqual(0)
      instance.show(() => {
        expect(getElements().length).toEqual(1)
        instance.hide(() => {
          expect(getElements().length).toEqual(0)
          done()
        })
      })
    })

    it('should remove "show" class', done => {
      const instance = new Backdrop({
        isVisible: true,
        isAnimated: true
      })
      const elem = instance._getElement()

      instance.show()
      instance.hide(() => {
        expect(elem.classList.contains(CLASS_NAME_SHOW)).toEqual(false)
        done()
      })
    })

    it('if it is not "shown", should not try to remove Node on remove method', done => {
      const instance = new Backdrop({
        isVisible: false,
        isAnimated: true
      })
      const getElements = () => document.querySelectorAll(CLASS_BACKDROP)
      const spy = spyOn(instance, 'dispose').and.callThrough()

      expect(getElements().length).toEqual(0)
      expect(instance._isAppended).toEqual(false)
      instance.show(() => {
        instance.hide(() => {
          expect(getElements().length).toEqual(0)
          expect(spy).not.toHaveBeenCalled()
          expect(instance._isAppended).toEqual(false)
          done()
        })
      })
    })
  })

  describe('animation callbacks', () => {
    it('if it is animated, should show and hide backdrop after counting transition duration', done => {
      const instance = new Backdrop({
        isVisible: true,
        isAnimated: true
      })
      const spy2 = jasmine.createSpy('spy2')

      const execDone = () => {
        setTimeout(() => {
          expect(spy2).toHaveBeenCalledTimes(2)
          done()
        }, 10)
      }

      instance.show(spy2)
      instance.hide(() => {
        spy2()
        execDone()
      })
      expect(spy2).not.toHaveBeenCalled()
    })

    it('if it is not animated, should show and hide backdrop without delay', done => {
      const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)
      const instance = new Backdrop({
        isVisible: true,
        isAnimated: false
      })
      const spy2 = jasmine.createSpy('spy2')

      instance.show(spy2)
      instance.hide(spy2)

      setTimeout(() => {
        expect(spy2).toHaveBeenCalled()
        expect(spy).not.toHaveBeenCalled()
        done()
      }, 10)
    })

    it('if it is not "shown", should not call delay callbacks', done => {
      const instance = new Backdrop({
        isVisible: false,
        isAnimated: true
      })
      const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)

      instance.show()
      instance.hide(() => {
        expect(spy).not.toHaveBeenCalled()
        done()
      })
    })
  })
})
