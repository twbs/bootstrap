import Backdrop from '../../../src/util/backdrop'
import { getTransitionDurationFromElement } from '../../../src/util/index'

const CLASS_BACKDROP = '.modal-backdrop'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

describe('Backdrop', () => {
  afterEach(() => {
    const list = document.querySelectorAll(CLASS_BACKDROP)

    list.forEach(el => {
      document.body.removeChild(el)
    })
  })

  describe('show', () => {
    it('if it is "shown", should append the backdrop html once, on show, and contain "show" class', done => {
      const instance = new Backdrop(true, false)
      const elems = () => document.querySelectorAll(CLASS_BACKDROP)

      expect(elems().length).toEqual(0)

      instance.show()
      instance.show(() => {
        expect(elems().length).toEqual(1)
        elems().forEach(el => {
          expect(el.classList.contains(CLASS_NAME_SHOW)).toEqual(true)
        })
        done()
      })
    })

    it('if it is not "shown", should not append the backdrop html', done => {
      const instance = new Backdrop(false, true)
      const elems = () => document.querySelectorAll(CLASS_BACKDROP)

      expect(elems().length).toEqual(0)
      instance.show(() => {
        expect(elems().length).toEqual(0)
        done()
      })
    })

    it('if it is "shown" and "animated", should append the backdrop html once, and contain "fade" class', done => {
      const instance = new Backdrop(true, true)
      const elems = () => document.querySelectorAll(CLASS_BACKDROP)

      expect(elems().length).toEqual(0)

      instance.show(() => {
        expect(elems().length).toEqual(1)
        elems().forEach(el => {
          expect(el.classList.contains(CLASS_NAME_FADE)).toEqual(true)
        })
        done()
      })
    })
  })

  describe('hide', () => {
    it('should remove the backdrop html', done => {
      const instance = new Backdrop(true, true)

      const elems = () => document.body.querySelectorAll(CLASS_BACKDROP)

      expect(elems().length).toEqual(0)
      instance.show(() => {
        expect(elems().length).toEqual(1)
        instance.hide(() => {
          expect(elems().length).toEqual(0)
          done()
        })
      })
    })

    it('should remove "show" class', done => {
      const instance = new Backdrop(true, true)
      const elem = instance._elem

      instance.show()
      instance.hide(() => {
        expect(elem.classList.contains(CLASS_NAME_SHOW)).toEqual(false)
        done()
      })
    })
  })

  describe('click callback', () => {
    it('it should execute callback on click', done => {
      const spy = jasmine.createSpy('spy')

      const instance = new Backdrop(true, false)
      instance.onClick(() => spy())
      const endTest = () => {
        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          done()
        }, 10)
      }

      instance.show(() => {
        const clickEvent = document.createEvent('MouseEvents')
        clickEvent.initEvent('mousedown', true, true)
        document.querySelector(CLASS_BACKDROP).dispatchEvent(clickEvent)
        endTest()
      })
    })
  })

  describe('animation callbacks', () => {
    it('if it is animated, should show and hide backdrop after counting transition duration', done => {
      const instance = new Backdrop(true, true)
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
      const instance = new Backdrop(true, false)
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
      const instance = new Backdrop(false, true)
      const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)

      instance.show()
      instance.hide(() => {
        expect(spy).not.toHaveBeenCalled()
        done()
      })
    })
  })
})
