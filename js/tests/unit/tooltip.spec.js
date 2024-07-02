import EventHandler from '../../src/dom/event-handler.js'
import Tooltip from '../../src/tooltip.js'
import { noop } from '../../src/util/index.js'
import {
  clearFixture, createEvent, getFixture, jQueryMock
} from '../helpers/fixture.js'

describe('Tooltip', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()

    for (const tooltipEl of document.querySelectorAll('.tooltip')) {
      tooltipEl.remove()
    }
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Tooltip.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Tooltip.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('NAME', () => {
    it('should return plugin name', () => {
      expect(Tooltip.NAME).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Tooltip.DATA_KEY).toEqual('bs.tooltip')
    })
  })

  describe('EVENT_KEY', () => {
    it('should return plugin event key', () => {
      expect(Tooltip.EVENT_KEY).toEqual('.bs.tooltip')
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type', () => {
      expect(Tooltip.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<a href="#" id="tooltipEl" rel="tooltip" title="Nice and short title"></a>'

      const tooltipEl = fixtureEl.querySelector('#tooltipEl')
      const tooltipBySelector = new Tooltip('#tooltipEl')
      const tooltipByElement = new Tooltip(tooltipEl)

      expect(tooltipBySelector._element).toEqual(tooltipEl)
      expect(tooltipByElement._element).toEqual(tooltipEl)
    })

    it('should not take care of disallowed data attributes', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-bs-sanitize="false" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._config.sanitize).toBeTrue()
    })

    it('should convert title and content to string if numbers', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        title: 1,
        content: 7
      })

      expect(tooltip._config.title).toEqual('1')
      expect(tooltip._config.content).toEqual('7')
    })

    it('should enable selector delegation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const containerEl = fixtureEl.querySelector('div')
        const tooltipContainer = new Tooltip(containerEl, {
          selector: 'a[rel="tooltip"]',
          trigger: 'click'
        })

        containerEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipInContainerEl = containerEl.querySelector('a')

        tooltipInContainerEl.addEventListener('shown.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).not.toBeNull()
          tooltipContainer.dispose()
          resolve()
        })

        tooltipInContainerEl.click()
      })
    })

    it('should create offset modifier when offset is passed as a function', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Offset from function"></a>'

        const getOffset = jasmine.createSpy('getOffset').and.returnValue([10, 20])
        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          offset: getOffset,
          popperConfig: {
            onFirstUpdate(state) {
              expect(getOffset).toHaveBeenCalledWith({
                popper: state.rects.popper,
                reference: state.rects.reference,
                placement: state.placement
              }, tooltipEl)
              resolve()
            }
          }
        })

        const offset = tooltip._getOffset()

        expect(offset).toEqual(jasmine.any(Function))

        tooltip.show()
      })
    })

    it('should create offset modifier when offset option is passed in data attribute', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-bs-offset="10,20" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._getOffset()).toEqual([10, 20])
    })

    it('should allow to pass config to Popper with `popperConfig`', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        popperConfig: {
          placement: 'left'
        }
      })

      const popperConfig = tooltip._getPopperConfig('top')

      expect(popperConfig.placement).toEqual('left')
    })

    it('should allow to pass config to Popper with `popperConfig` as a function', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const getPopperConfig = jasmine.createSpy('getPopperConfig').and.returnValue({ placement: 'left' })
      const tooltip = new Tooltip(tooltipEl, {
        popperConfig: getPopperConfig
      })

      const popperConfig = tooltip._getPopperConfig('top')

      // Ensure that the function was called with the default config.
      expect(getPopperConfig).toHaveBeenCalledWith(jasmine.objectContaining({
        placement: jasmine.any(String)
      }))
      expect(popperConfig.placement).toEqual('left')
    })

    it('should use original title, if not "data-bs-title" is given', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._getTitle()).toEqual('Another tooltip')
    })
  })

  describe('enable', () => {
    it('should enable a tooltip', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltip.enable()

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).not.toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })
  })

  describe('disable', () => {
    it('should disable tooltip', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltip.disable()

        tooltipEl.addEventListener('show.bs.tooltip', () => {
          reject(new Error('should not show a disabled tooltip'))
        })

        tooltip.show()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })
  })

  describe('toggleEnabled', () => {
    it('should toggle enabled', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._isEnabled).toBeTrue()

      tooltip.toggleEnabled()

      expect(tooltip._isEnabled).toBeFalse()
    })
  })

  describe('toggle', () => {
    it('should do nothing if disabled', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltip.disable()

        tooltipEl.addEventListener('show.bs.tooltip', () => {
          reject(new Error('should not show a disabled tooltip'))
        })

        tooltip.toggle()

        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 10)
      })
    })

    it('should show a tooltip', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).not.toBeNull()
          resolve()
        })

        tooltip.toggle()
      })
    })

    it('should call toggle and show the tooltip when trigger is "click"', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          trigger: 'click'
        })

        const spy = spyOn(tooltip, 'toggle').and.callThrough()

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        tooltipEl.click()
      })
    })

    it('should hide a tooltip', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          tooltip.toggle()
        })

        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).toBeNull()
          resolve()
        })

        tooltip.toggle()
      })
    })

    it('should call toggle and hide the tooltip when trigger is "click"', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          trigger: 'click'
        })

        const spy = spyOn(tooltip, 'toggle').and.callThrough()

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          tooltipEl.click()
        })

        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        tooltipEl.click()
      })
    })
  })

  describe('dispose', () => {
    it('should destroy a tooltip', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const addEventSpy = spyOn(tooltipEl, 'addEventListener').and.callThrough()
      const removeEventSpy = spyOn(tooltipEl, 'removeEventListener').and.callThrough()

      const tooltip = new Tooltip(tooltipEl)

      expect(Tooltip.getInstance(tooltipEl)).toEqual(tooltip)

      const expectedArgs = [
        ['mouseover', jasmine.any(Function), jasmine.any(Boolean)],
        ['mouseout', jasmine.any(Function), jasmine.any(Boolean)],
        ['focusin', jasmine.any(Function), jasmine.any(Boolean)],
        ['focusout', jasmine.any(Function), jasmine.any(Boolean)]
      ]

      expect(addEventSpy.calls.allArgs()).toEqual(expectedArgs)

      tooltip.dispose()

      expect(Tooltip.getInstance(tooltipEl)).toBeNull()
      expect(removeEventSpy.calls.allArgs()).toEqual(expectedArgs)
    })

    it('should destroy a tooltip after it is shown and hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          tooltip.hide()
        })
        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          tooltip.dispose()
          expect(tooltip.tip).toBeNull()
          expect(Tooltip.getInstance(tooltipEl)).toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should destroy a tooltip and remove it from the dom', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).not.toBeNull()

          tooltip.dispose()

          expect(document.querySelector('.tooltip')).toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should destroy a tooltip and reset it\'s initial title', () => {
      fixtureEl.innerHTML = [
        '<span id="tooltipWithTitle" rel="tooltip" title="tooltipTitle"></span>',
        '<span id="tooltipWithoutTitle" rel="tooltip" data-bs-title="tooltipTitle"></span>'
      ].join('')

      const tooltipWithTitleEl = fixtureEl.querySelector('#tooltipWithTitle')
      const tooltip = new Tooltip('#tooltipWithTitle')
      expect(tooltipWithTitleEl.getAttribute('title')).toBeNull()
      tooltip.dispose()
      expect(tooltipWithTitleEl.getAttribute('title')).toBe('tooltipTitle')

      const tooltipWithoutTitleEl = fixtureEl.querySelector('#tooltipWithoutTitle')
      const tooltip2 = new Tooltip('#tooltipWithTitle')
      expect(tooltipWithoutTitleEl.getAttribute('title')).toBeNull()
      tooltip2.dispose()
      expect(tooltipWithoutTitleEl.getAttribute('title')).toBeNull()
    })
  })

  describe('show', () => {
    it('should show a tooltip', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tooltipShown = document.querySelector('.tooltip')

          expect(tooltipShown).not.toBeNull()
          expect(tooltipEl.getAttribute('aria-describedby')).toEqual(tooltipShown.getAttribute('id'))
          expect(tooltipShown.getAttribute('id')).toContain('tooltip')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip when hovering a child element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a href="#" rel="tooltip" title="Another tooltip">',
          '  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">',
          '    <rect width="100%" fill="#563d7c"/>',
          '    <circle cx="50" cy="50" r="30" fill="#fff"/>',
          '  </svg>',
          '</a>'
        ].join('')

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        const spy = spyOn(tooltip, 'show')

        tooltipEl.querySelector('rect').dispatchEvent(createEvent('mouseover', { bubbles: true }))

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          resolve()
        }, 0)
      })
    })

    it('should show a tooltip on mobile', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)
        document.documentElement.ontouchstart = noop

        const spy = spyOn(EventHandler, 'on').and.callThrough()

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).not.toBeNull()
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)
          document.documentElement.ontouchstart = undefined
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip relative to placement option', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          placement: 'bottom'
        })

        tooltipEl.addEventListener('inserted.bs.tooltip', () => {
          expect(tooltip._getTipElement()).toHaveClass('bs-tooltip-auto')
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(tooltip._getTipElement()).toHaveClass('bs-tooltip-auto')
          expect(tooltip._getTipElement().getAttribute('data-popper-placement')).toEqual('bottom')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should not error when trying to show a tooltip that has been removed from the dom', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        const firstCallback = () => {
          tooltipEl.removeEventListener('shown.bs.tooltip', firstCallback)
          let tooltipShown = document.querySelector('.tooltip')

          tooltipShown.remove()

          tooltipEl.addEventListener('shown.bs.tooltip', () => {
            tooltipShown = document.querySelector('.tooltip')

            expect(tooltipShown).not.toBeNull()
            resolve()
          })

          tooltip.show()
        }

        tooltipEl.addEventListener('shown.bs.tooltip', firstCallback)

        tooltip.show()
      })
    })

    it('should show a tooltip with a dom element container', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          container: fixtureEl
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(fixtureEl.querySelector('.tooltip')).not.toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip with a jquery element container', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          container: {
            0: fixtureEl,
            jquery: 'jQuery'
          }
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(fixtureEl.querySelector('.tooltip')).not.toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip with a selector in container', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          container: '#fixture'
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(fixtureEl.querySelector('.tooltip')).not.toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip with placement as a function', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const spy = jasmine.createSpy('placement').and.returnValue('top')
        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          placement: spy
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).not.toBeNull()
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip without the animation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          animation: false
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tip = document.querySelector('.tooltip')

          expect(tip).not.toBeNull()
          expect(tip).not.toHaveClass('fade')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should throw an error the element is not visible', () => {
      fixtureEl.innerHTML = '<a href="#" style="display: none" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      try {
        tooltip.show()
      } catch (error) {
        expect(error.message).toEqual('Please use show on visible elements')
      }
    })

    it('should not show a tooltip if show.bs.tooltip is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        const expectedDone = () => {
          setTimeout(() => {
            expect(document.querySelector('.tooltip')).toBeNull()
            resolve()
          }, 10)
        }

        tooltipEl.addEventListener('show.bs.tooltip', ev => {
          ev.preventDefault()
          expectedDone()
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          reject(new Error('Tooltip should not be shown'))
        })

        tooltip.show()
      })
    })

    it('should show tooltip if leave event hasn\'t occurred before delay expires', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          delay: 150
        })

        const spy = spyOn(tooltip, 'show')

        setTimeout(() => {
          expect(spy).not.toHaveBeenCalled()
        }, 100)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          resolve()
        }, 200)

        tooltipEl.dispatchEvent(createEvent('mouseover'))
      })
    })

    it('should not show tooltip if leave event occurs before delay expires', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          delay: 150
        })

        const spy = spyOn(tooltip, 'show')

        setTimeout(() => {
          expect(spy).not.toHaveBeenCalled()
          tooltipEl.dispatchEvent(createEvent('mouseover'))
        }, 100)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(document.querySelectorAll('.tooltip')).toHaveSize(0)
          resolve()
        }, 200)

        tooltipEl.dispatchEvent(createEvent('mouseover'))
      })
    })

    it('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip" data-bs-delay=\'{"show":0,"hide":150}\'>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        expect(tooltip._config.delay).toEqual({ show: 0, hide: 150 })

        setTimeout(() => {
          expect(tooltip._getTipElement()).toHaveClass('show')
          tooltipEl.dispatchEvent(createEvent('mouseout'))

          setTimeout(() => {
            expect(tooltip._getTipElement()).toHaveClass('show')
            tooltipEl.dispatchEvent(createEvent('mouseover'))
          }, 100)

          setTimeout(() => {
            expect(tooltip._getTipElement()).toHaveClass('show')
            expect(document.querySelectorAll('.tooltip')).toHaveSize(1)
            resolve()
          }, 200)
        }, 10)

        tooltipEl.dispatchEvent(createEvent('mouseover'))
      })
    })

    it('should not hide tooltip if leave event occurs and interaction remains inside trigger', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a href="#" rel="tooltip" title="Another tooltip">',
          '<b>Trigger</b>',
          'the tooltip',
          '</a>'
        ].join('')

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)
        const triggerChild = tooltipEl.querySelector('b')

        const spy = spyOn(tooltip, 'hide').and.callThrough()

        tooltipEl.addEventListener('mouseover', () => {
          const moveMouseToChildEvent = createEvent('mouseout')
          Object.defineProperty(moveMouseToChildEvent, 'relatedTarget', {
            value: triggerChild
          })

          tooltipEl.dispatchEvent(moveMouseToChildEvent)
        })

        tooltipEl.addEventListener('mouseout', () => {
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        tooltipEl.dispatchEvent(createEvent('mouseover'))
      })
    })

    it('should properly maintain tooltip state if leave event occurs and enter event occurs during hide transition', () => {
      return new Promise(resolve => {
        // Style this tooltip to give it plenty of room for popper to do what it wants
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip" data-bs-placement="top" style="position:fixed;left:50%;top:50%;">Trigger</a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.15s',
          transitionDelay: '0s'
        })

        setTimeout(() => {
          expect(tooltip._popper).not.toBeNull()
          expect(tooltip._getTipElement().getAttribute('data-popper-placement')).toEqual('top')
          tooltipEl.dispatchEvent(createEvent('mouseout'))

          setTimeout(() => {
            expect(tooltip._getTipElement()).not.toHaveClass('show')
            tooltipEl.dispatchEvent(createEvent('mouseover'))
          }, 100)

          setTimeout(() => {
            expect(tooltip._popper).not.toBeNull()
            expect(tooltip._getTipElement().getAttribute('data-popper-placement')).toEqual('top')
            resolve()
          }, 200)
        }, 10)

        tooltipEl.dispatchEvent(createEvent('mouseover'))
      })
    })

    it('should only trigger inserted event if a new tooltip element was created', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.15s',
          transitionDelay: '0s'
        })

        const insertedFunc = jasmine.createSpy()
        tooltipEl.addEventListener('inserted.bs.tooltip', insertedFunc)

        setTimeout(() => {
          expect(insertedFunc).toHaveBeenCalledTimes(1)
          tooltip.hide()

          setTimeout(() => {
            tooltip.show()
          }, 100)

          setTimeout(() => {
            expect(insertedFunc).toHaveBeenCalledTimes(2)
            resolve()
          }, 200)
        }, 0)

        tooltip.show()
      })
    })

    it('should show a tooltip with custom class provided in data attributes', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip" data-bs-custom-class="custom-class"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tip = document.querySelector('.tooltip')
          expect(tip).not.toBeNull()
          expect(tip).toHaveClass('custom-class')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip with custom class provided as a string in config', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          customClass: 'custom-class custom-class-2'
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tip = document.querySelector('.tooltip')
          expect(tip).not.toBeNull()
          expect(tip).toHaveClass('custom-class')
          expect(tip).toHaveClass('custom-class-2')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should show a tooltip with custom class provided as a function in config', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip" data-class-a="custom-class-a" data-class-b="custom-class-b"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const spy = jasmine.createSpy('customClass').and.callFake(function (el) {
          return `${el.dataset.classA} ${this.dataset.classB}`
        })
        const tooltip = new Tooltip(tooltipEl, {
          customClass: spy
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tip = document.querySelector('.tooltip')
          expect(tip).not.toBeNull()
          expect(spy).toHaveBeenCalled()
          expect(tip).toHaveClass('custom-class-a')
          expect(tip).toHaveClass('custom-class-b')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should remove `title` attribute if exists', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          expect(tooltipEl.getAttribute('title')).toBeNull()
          resolve()
        })
        tooltip.show()
      })
    })
  })

  describe('hide', () => {
    it('should hide a tooltip', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => tooltip.hide())
        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).toBeNull()
          expect(tooltipEl.getAttribute('aria-describedby')).toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should hide a tooltip on mobile', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)
        const spy = spyOn(EventHandler, 'off')

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          document.documentElement.ontouchstart = noop
          tooltip.hide()
        })

        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).toBeNull()
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)
          document.documentElement.ontouchstart = undefined
          resolve()
        })

        tooltip.show()
      })
    })

    it('should hide a tooltip without animation', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          animation: false
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => tooltip.hide())
        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          expect(document.querySelector('.tooltip')).toBeNull()
          expect(tooltipEl.getAttribute('aria-describedby')).toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should not hide a tooltip if hide event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const assertDone = () => {
          setTimeout(() => {
            expect(document.querySelector('.tooltip')).not.toBeNull()
            resolve()
          }, 20)
        }

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl, {
          animation: false
        })

        tooltipEl.addEventListener('shown.bs.tooltip', () => tooltip.hide())
        tooltipEl.addEventListener('hide.bs.tooltip', event => {
          event.preventDefault()
          assertDone()
        })
        tooltipEl.addEventListener('hidden.bs.tooltip', () => {
          reject(new Error('should not trigger hidden event'))
        })

        tooltip.show()
      })
    })

    it('should not throw error running hide if popper hasn\'t been shown', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(div)

      try {
        tooltip.hide()
        expect().nothing()
      } catch {
        throw new Error('should not throw error')
      }
    })
  })

  describe('update', () => {
    it('should call popper update', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const spy = spyOn(tooltip._popper, 'update')

          tooltip.update()

          expect(spy).toHaveBeenCalled()
          resolve()
        })

        tooltip.show()
      })
    })

    it('should do nothing if the tooltip is not shown', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.update()
      expect().nothing()
    })
  })

  describe('_isWithContent', () => {
    it('should return true if there is content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._isWithContent()).toBeTrue()
    })

    it('should return false if there is no content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title=""></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._isWithContent()).toBeFalse()
    })
  })

  describe('_getTipElement', () => {
    it('should create the tip element and return it', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      const spy = spyOn(document, 'createElement').and.callThrough()

      expect(tooltip._getTipElement()).toBeDefined()
      expect(spy).toHaveBeenCalled()
    })

    it('should return the created tip element', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      const spy = spyOn(document, 'createElement').and.callThrough()

      expect(tooltip._getTipElement()).toBeDefined()
      expect(spy).toHaveBeenCalled()

      spy.calls.reset()

      expect(tooltip._getTipElement()).toBeDefined()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('setContent', () => {
    it('should set tip content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, { animation: false })

      const tip = tooltip._getTipElement()

      tooltip.setContent(tip)

      expect(tip).not.toHaveClass('show')
      expect(tip).not.toHaveClass('fade')
      expect(tip.querySelector('.tooltip-inner').textContent).toEqual('Another tooltip')
    })

    it('should re-show tip if it was already shown', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-bs-title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)
      tooltip.show()
      const tip = () => tooltip._getTipElement()

      expect(tip()).toHaveClass('show')
      tooltip.setContent({ '.tooltip-inner': 'foo' })

      expect(tip()).toHaveClass('show')
      expect(tip().querySelector('.tooltip-inner').textContent).toEqual('foo')
    })

    it('should keep tip hidden, if it was already hidden before', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-bs-title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)
      const tip = () => tooltip._getTipElement()

      expect(tip()).not.toHaveClass('show')
      tooltip.setContent({ '.tooltip-inner': 'foo' })

      expect(tip()).not.toHaveClass('show')
      tooltip.show()
      expect(tip().querySelector('.tooltip-inner').textContent).toEqual('foo')
    })

    it('"setContent" should keep the initial template', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setContent({ '.tooltip-inner': 'foo' })
      const tip = tooltip._getTipElement()

      expect(tip).toHaveClass('tooltip')
      expect(tip).toHaveClass('bs-tooltip-auto')
      expect(tip.querySelector('.tooltip-arrow')).not.toBeNull()
      expect(tip.querySelector('.tooltip-inner')).not.toBeNull()
    })
  })

  describe('setContent', () => {
    it('should do nothing if the element is null', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setContent({ '.tooltip': null })
      expect().nothing()
    })

    it('should do nothing if the content is a child of the element', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '  <div id="childContent"></div>',
        '</a>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      tooltip._getTipElement().append(childContent)
      tooltip.setContent({ '.tooltip': childContent })

      expect().nothing()
    })

    it('should add the content as a child of the element for jQuery elements', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '  <div id="childContent"></div>',
        '</a>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      tooltip.setContent({ '.tooltip': { 0: childContent, jquery: 'jQuery' } })
      tooltip.show()

      expect(childContent.parentNode).toEqual(tooltip._getTipElement())
    })

    it('should add the child text content in the element', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '  <div id="childContent">Tooltip</div>',
        '</a>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setContent({ '.tooltip': childContent })

      expect(childContent.textContent).toEqual(tooltip._getTipElement().textContent)
    })

    it('should add html without sanitize it', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        sanitize: false,
        html: true
      })

      tooltip.setContent({ '.tooltip': '<div id="childContent">Tooltip</div>' })

      expect(tooltip._getTipElement().querySelector('div').id).toEqual('childContent')
    })

    it('should add html sanitized', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      const content = [
        '<div id="childContent">',
        '  <button type="button">test btn</button>',
        '</div>'
      ].join('')

      tooltip.setContent({ '.tooltip': content })
      expect(tooltip._getTipElement().querySelector('div').id).toEqual('childContent')
      expect(tooltip._getTipElement().querySelector('button')).toBeNull()
    })

    it('should add text content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setContent({ '.tooltip': 'test' })

      expect(tooltip._getTipElement().textContent).toEqual('test')
    })
  })

  describe('_getTitle', () => {
    it('should return the title', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._getTitle()).toEqual('Another tooltip')
    })

    it('should call title function', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        title: () => 'test'
      })

      expect(tooltip._getTitle()).toEqual('test')
    })

    it('should call title function with trigger element', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-foo="bar"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        title(el) {
          return el.dataset.foo
        }
      })

      expect(tooltip._getTitle()).toEqual('bar')
    })

    it('should call title function with correct this value', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-foo="bar"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        title() {
          return this.dataset.foo
        }
      })

      expect(tooltip._getTitle()).toEqual('bar')
    })
  })

  describe('getInstance', () => {
    it('should return tooltip instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const alert = new Tooltip(div)

      expect(Tooltip.getInstance(div)).toEqual(alert)
      expect(Tooltip.getInstance(div)).toBeInstanceOf(Tooltip)
    })

    it('should return null when there is no tooltip instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Tooltip.getInstance(div)).toBeNull()
    })
  })

  describe('aria-label', () => {
    it('should add the aria-label attribute for referencing original title', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tooltipShown = document.querySelector('.tooltip')

          expect(tooltipShown).not.toBeNull()
          expect(tooltipEl.getAttribute('aria-label')).toEqual('Another tooltip')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should add the aria-label attribute when element text content is a whitespace string', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="A tooltip"><span>    </span></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tooltipShown = document.querySelector('.tooltip')

          expect(tooltipShown).not.toBeNull()
          expect(tooltipEl.getAttribute('aria-label')).toEqual('A tooltip')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should not add the aria-label attribute if the attribute already exists', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" aria-label="Different label" title="Another tooltip"></a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tooltipShown = document.querySelector('.tooltip')

          expect(tooltipShown).not.toBeNull()
          expect(tooltipEl.getAttribute('aria-label')).toEqual('Different label')
          resolve()
        })

        tooltip.show()
      })
    })

    it('should not add the aria-label attribute if the element has text content', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">text content</a>'

        const tooltipEl = fixtureEl.querySelector('a')
        const tooltip = new Tooltip(tooltipEl)

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          const tooltipShown = document.querySelector('.tooltip')

          expect(tooltipShown).not.toBeNull()
          expect(tooltipEl.getAttribute('aria-label')).toBeNull()
          resolve()
        })

        tooltip.show()
      })
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return tooltip instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(div)

      expect(Tooltip.getOrCreateInstance(div)).toEqual(tooltip)
      expect(Tooltip.getInstance(div)).toEqual(Tooltip.getOrCreateInstance(div, {}))
      expect(Tooltip.getOrCreateInstance(div)).toBeInstanceOf(Tooltip)
    })

    it('should return new instance when there is no tooltip instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Tooltip.getInstance(div)).toBeNull()
      expect(Tooltip.getOrCreateInstance(div)).toBeInstanceOf(Tooltip)
    })

    it('should return new instance when there is no tooltip instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Tooltip.getInstance(div)).toBeNull()
      const tooltip = Tooltip.getOrCreateInstance(div, {
        title: () => 'test'
      })
      expect(tooltip).toBeInstanceOf(Tooltip)

      expect(tooltip._getTitle()).toEqual('test')
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(div, {
        title: () => 'nothing'
      })
      expect(Tooltip.getInstance(div)).toEqual(tooltip)

      const tooltip2 = Tooltip.getOrCreateInstance(div, {
        title: () => 'test'
      })
      expect(tooltip).toBeInstanceOf(Tooltip)
      expect(tooltip2).toEqual(tooltip)

      expect(tooltip2._getTitle()).toEqual('nothing')
    })
  })

  describe('jQueryInterface', () => {
    it('should create a tooltip', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.tooltip = Tooltip.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tooltip.call(jQueryMock)

      expect(Tooltip.getInstance(div)).not.toBeNull()
    })

    it('should not re create a tooltip', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(div)

      jQueryMock.fn.tooltip = Tooltip.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tooltip.call(jQueryMock)

      expect(Tooltip.getInstance(div)).toEqual(tooltip)
    })

    it('should call a tooltip method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(div)

      const spy = spyOn(tooltip, 'show')

      jQueryMock.fn.tooltip = Tooltip.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tooltip.call(jQueryMock, 'show')

      expect(Tooltip.getInstance(div)).toEqual(tooltip)
      expect(spy).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.tooltip = Tooltip.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.tooltip.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })
})
