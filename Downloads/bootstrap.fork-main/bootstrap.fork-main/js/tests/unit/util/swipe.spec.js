import EventHandler from '../../../src/dom/event-handler.js'
import { noop } from '../../../src/util/index.js'
import Swipe from '../../../src/util/swipe.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('Swipe', () => {
  const { Simulator, PointerEvent } = window
  const originWinPointerEvent = PointerEvent
  const supportPointerEvent = Boolean(PointerEvent)

  let fixtureEl
  let swipeEl
  const clearPointerEvents = () => {
    window.PointerEvent = null
  }

  const restorePointerEvents = () => {
    window.PointerEvent = originWinPointerEvent
  }

  // The headless browser does not support touch events, so we need to fake it
  // in order to test that touch events are added properly
  const defineDocumentElementOntouchstart = () => {
    document.documentElement.ontouchstart = noop
  }

  const deleteDocumentElementOntouchstart = () => {
    delete document.documentElement.ontouchstart
  }

  const mockSwipeGesture = (element, options = {}, type = 'touch') => {
    Simulator.setType(type)
    const _options = { deltaX: 0, deltaY: 0, ...options }

    Simulator.gestures.swipe(element, _options)
  }

  beforeEach(() => {
    fixtureEl = getFixture()
    const cssStyle = [
      '<style>',
      '  #fixture .pointer-event {',
      '    touch-action: pan-y;',
      '  }',
      '  #fixture div {',
      '    width: 300px;',
      '    height: 300px;',
      '  }',
      '</style>'
    ].join('')

    fixtureEl.innerHTML = `<div id="swipeEl"></div>${cssStyle}`
    swipeEl = fixtureEl.querySelector('div')
  })

  afterEach(() => {
    clearFixture()
    deleteDocumentElementOntouchstart()
  })

  describe('constructor', () => {
    it('should add touch event listeners by default', () => {
      defineDocumentElementOntouchstart()

      spyOn(Swipe.prototype, '_initEvents').and.callThrough()
      const swipe = new Swipe(swipeEl)
      expect(swipe._initEvents).toHaveBeenCalled()
    })

    it('should not add touch event listeners if touch is not supported', () => {
      spyOn(Swipe, 'isSupported').and.returnValue(false)

      spyOn(Swipe.prototype, '_initEvents').and.callThrough()
      const swipe = new Swipe(swipeEl)

      expect(swipe._initEvents).not.toHaveBeenCalled()
    })
  })

  describe('Config', () => {
    it('Test leftCallback', () => {
      return new Promise(resolve => {
        const spyRight = jasmine.createSpy('spy')
        clearPointerEvents()
        defineDocumentElementOntouchstart()
        // eslint-disable-next-line no-new
        new Swipe(swipeEl, {
          leftCallback() {
            expect(spyRight).not.toHaveBeenCalled()
            restorePointerEvents()
            resolve()
          },
          rightCallback: spyRight
        })

        mockSwipeGesture(swipeEl, {
          pos: [300, 10],
          deltaX: -300
        })
      })
    })

    it('Test rightCallback', () => {
      return new Promise(resolve => {
        const spyLeft = jasmine.createSpy('spy')
        clearPointerEvents()
        defineDocumentElementOntouchstart()
        // eslint-disable-next-line no-new
        new Swipe(swipeEl, {
          rightCallback() {
            expect(spyLeft).not.toHaveBeenCalled()
            restorePointerEvents()
            resolve()
          },
          leftCallback: spyLeft
        })

        mockSwipeGesture(swipeEl, {
          pos: [10, 10],
          deltaX: 300
        })
      })
    })

    it('Test endCallback', () => {
      return new Promise(resolve => {
        clearPointerEvents()
        defineDocumentElementOntouchstart()
        let isFirstTime = true

        const callback = () => {
          if (isFirstTime) {
            isFirstTime = false
            return
          }

          expect().nothing()
          restorePointerEvents()
          resolve()
        }

        // eslint-disable-next-line no-new
        new Swipe(swipeEl, {
          endCallback: callback
        })
        mockSwipeGesture(swipeEl, {
          pos: [10, 10],
          deltaX: 300
        })

        mockSwipeGesture(swipeEl, {
          pos: [300, 10],
          deltaX: -300
        })
      })
    })
  })

  describe('Functionality on PointerEvents', () => {
    it('should not allow pinch with touch events', () => {
      Simulator.setType('touch')
      clearPointerEvents()
      deleteDocumentElementOntouchstart()

      const swipe = new Swipe(swipeEl)
      const spy = spyOn(swipe, '_handleSwipe')

      mockSwipeGesture(swipeEl, {
        pos: [300, 10],
        deltaX: -300,
        deltaY: 0,
        touches: 2
      })

      restorePointerEvents()
      expect(spy).not.toHaveBeenCalled()
    })

    it('should allow swipeRight and call "rightCallback" with pointer events', () => {
      return new Promise(resolve => {
        if (!supportPointerEvent) {
          expect().nothing()
          resolve()
          return
        }

        const style = '#fixture .pointer-event { touch-action: none !important; }'
        fixtureEl.innerHTML += style

        defineDocumentElementOntouchstart()
        // eslint-disable-next-line no-new
        new Swipe(swipeEl, {
          rightCallback() {
            deleteDocumentElementOntouchstart()
            expect().nothing()
            resolve()
          }
        })

        mockSwipeGesture(swipeEl, { deltaX: 300 }, 'pointer')
      })
    })

    it('should allow swipeLeft and call "leftCallback" with pointer events', () => {
      return new Promise(resolve => {
        if (!supportPointerEvent) {
          expect().nothing()
          resolve()
          return
        }

        const style = '#fixture .pointer-event { touch-action: none !important; }'
        fixtureEl.innerHTML += style

        defineDocumentElementOntouchstart()
        // eslint-disable-next-line no-new
        new Swipe(swipeEl, {
          leftCallback() {
            expect().nothing()
            deleteDocumentElementOntouchstart()
            resolve()
          }
        })

        mockSwipeGesture(swipeEl, {
          pos: [300, 10],
          deltaX: -300
        }, 'pointer')
      })
    })
  })

  describe('Dispose', () => {
    it('should call EventHandler.off', () => {
      defineDocumentElementOntouchstart()
      spyOn(EventHandler, 'off').and.callThrough()
      const swipe = new Swipe(swipeEl)

      swipe.dispose()
      expect(EventHandler.off).toHaveBeenCalledWith(swipeEl, '.bs.swipe')
    })

    it('should destroy', () => {
      const addEventSpy = spyOn(fixtureEl, 'addEventListener').and.callThrough()
      const removeEventSpy = spyOn(EventHandler, 'off').and.callThrough()
      defineDocumentElementOntouchstart()

      const swipe = new Swipe(fixtureEl)

      const expectedArgs =
        swipe._supportPointerEvents ?
          [
            ['pointerdown', jasmine.any(Function), jasmine.any(Boolean)],
            ['pointerup', jasmine.any(Function), jasmine.any(Boolean)]
          ] :
          [
            ['touchstart', jasmine.any(Function), jasmine.any(Boolean)],
            ['touchmove', jasmine.any(Function), jasmine.any(Boolean)],
            ['touchend', jasmine.any(Function), jasmine.any(Boolean)]
          ]

      expect(addEventSpy.calls.allArgs()).toEqual(expectedArgs)

      swipe.dispose()

      expect(removeEventSpy).toHaveBeenCalledWith(fixtureEl, '.bs.swipe')
      deleteDocumentElementOntouchstart()
    })
  })

  describe('"isSupported" static', () => {
    it('should return "true" if "touchstart" exists in document element)', () => {
      Object.defineProperty(window.navigator, 'maxTouchPoints', () => 0)
      defineDocumentElementOntouchstart()

      expect(Swipe.isSupported()).toBeTrue()
    })

    it('should return "false" if "touchstart" not exists in document element and "navigator.maxTouchPoints" are zero (0)', () => {
      Object.defineProperty(window.navigator, 'maxTouchPoints', () => 0)
      deleteDocumentElementOntouchstart()

      if ('ontouchstart' in document.documentElement) {
        expect().nothing()
        return
      }

      expect(Swipe.isSupported()).toBeFalse()
    })
  })
})
