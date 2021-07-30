import Tooltip from '../../src/tooltip'
import EventHandler from '../../src/dom/event-handler'
import { noop } from '../../src/util/index'

/** Test helpers */
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'

describe('Tooltip', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()

    document.querySelectorAll('.tooltip').forEach(tooltipEl => {
      tooltipEl.remove()
    })
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

  describe('Event', () => {
    it('should return plugin events', () => {
      expect(Tooltip.Event).toEqual(jasmine.any(Object))
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
      fixtureEl.innerHTML = '<a href="#" id="tooltipEl" rel="tooltip" title="Nice and short title">'

      const tooltipEl = fixtureEl.querySelector('#tooltipEl')
      const tooltipBySelector = new Tooltip('#tooltipEl')
      const tooltipByElement = new Tooltip(tooltipEl)

      expect(tooltipBySelector._element).toEqual(tooltipEl)
      expect(tooltipByElement._element).toEqual(tooltipEl)
    })

    it('should not take care of disallowed data attributes', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-bs-sanitize="false" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._config.sanitize).toEqual(true)
    })

    it('should convert title and content to string if numbers', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        title: 1,
        content: 7
      })

      expect(tooltip._config.title).toEqual('1')
      expect(tooltip._config.content).toEqual('7')
    })

    it('should enable selector delegation', done => {
      fixtureEl.innerHTML = '<div></div>'

      const containerEl = fixtureEl.querySelector('div')
      const tooltipContainer = new Tooltip(containerEl, {
        selector: 'a[rel="tooltip"]',
        trigger: 'click'
      })

      containerEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipInContainerEl = containerEl.querySelector('a')

      tooltipInContainerEl.addEventListener('shown.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).not.toBeNull()
        tooltipContainer.dispose()
        done()
      })

      tooltipInContainerEl.click()
    })

    it('should create offset modifier when offset is passed as a function', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Offset from function">'

      const getOffset = jasmine.createSpy('getOffset').and.returnValue([10, 20])
      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        offset: getOffset,
        popperConfig: {
          onFirstUpdate: state => {
            expect(getOffset).toHaveBeenCalledWith({
              popper: state.rects.popper,
              reference: state.rects.reference,
              placement: state.placement
            }, tooltipEl)
            done()
          }
        }
      })

      const offset = tooltip._getOffset()

      expect(typeof offset).toEqual('function')

      tooltip.show()
    })

    it('should create offset modifier when offset option is passed in data attribute', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" data-bs-offset="10,20" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._getOffset()).toEqual([10, 20])
    })

    it('should allow to pass config to Popper with `popperConfig`', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip">'

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
      fixtureEl.innerHTML = '<a href="#" rel="tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const getPopperConfig = jasmine.createSpy('getPopperConfig').and.returnValue({ placement: 'left' })
      const tooltip = new Tooltip(tooltipEl, {
        popperConfig: getPopperConfig
      })

      const popperConfig = tooltip._getPopperConfig('top')

      expect(getPopperConfig).toHaveBeenCalled()
      expect(popperConfig.placement).toEqual('left')
    })
  })

  describe('enable', () => {
    it('should enable a tooltip', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.enable()

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).not.toBeNull()
        done()
      })

      tooltip.show()
    })
  })

  describe('disable', () => {
    it('should disable tooltip', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.disable()

      tooltipEl.addEventListener('show.bs.tooltip', () => {
        throw new Error('should not show a disabled tooltip')
      })

      tooltip.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })
  })

  describe('toggleEnabled', () => {
    it('should toggle enabled', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip._isEnabled).toEqual(true)

      tooltip.toggleEnabled()

      expect(tooltip._isEnabled).toEqual(false)
    })
  })

  describe('toggle', () => {
    it('should do nothing if disabled', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.disable()

      tooltipEl.addEventListener('show.bs.tooltip', () => {
        throw new Error('should not show a disabled tooltip')
      })

      tooltip.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should show a tooltip', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).not.toBeNull()
        done()
      })

      tooltip.toggle()
    })

    it('should call toggle and show the tooltip when trigger is "click"', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        trigger: 'click'
      })

      spyOn(tooltip, 'toggle').and.callThrough()

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(tooltip.toggle).toHaveBeenCalled()
        done()
      })

      tooltipEl.click()
    })

    it('should hide a tooltip', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        tooltip.toggle()
      })

      tooltipEl.addEventListener('hidden.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).toBeNull()
        done()
      })

      tooltip.toggle()
    })

    it('should call toggle and hide the tooltip when trigger is "click"', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        trigger: 'click'
      })

      spyOn(tooltip, 'toggle').and.callThrough()

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        tooltipEl.click()
      })

      tooltipEl.addEventListener('hidden.bs.tooltip', () => {
        expect(tooltip.toggle).toHaveBeenCalled()
        done()
      })

      tooltipEl.click()
    })
  })

  describe('dispose', () => {
    it('should destroy a tooltip', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

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

      expect(Tooltip.getInstance(tooltipEl)).toEqual(null)
      expect(removeEventSpy.calls.allArgs()).toEqual(expectedArgs)
    })

    it('should destroy a tooltip after it is shown and hidden', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        tooltip.hide()
      })
      tooltipEl.addEventListener('hidden.bs.tooltip', () => {
        tooltip.dispose()
        expect(tooltip.tip).toEqual(null)
        expect(Tooltip.getInstance(tooltipEl)).toEqual(null)
        done()
      })

      tooltip.show()
    })

    it('should destroy a tooltip and remove it from the dom', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).not.toBeNull()

        tooltip.dispose()

        expect(document.querySelector('.tooltip')).toBeNull()
        done()
      })

      tooltip.show()
    })
  })

  describe('show', () => {
    it('should show a tooltip', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tooltipShown = document.querySelector('.tooltip')

        expect(tooltipShown).not.toBeNull()
        expect(tooltipEl.getAttribute('aria-describedby')).toEqual(tooltipShown.getAttribute('id'))
        expect(tooltipShown.getAttribute('id')).toContain('tooltip')
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip when hovering a children element', done => {
      fixtureEl.innerHTML =
        '<a href="#" rel="tooltip" title="Another tooltip">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">' +
            '<rect width="100%" fill="#563d7c"/>' +
            '<circle cx="50" cy="50" r="30" fill="#fff"/>' +
          '</svg>' +
        '</a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      spyOn(tooltip, 'show')

      tooltipEl.querySelector('rect').dispatchEvent(createEvent('mouseover', { bubbles: true }))

      setTimeout(() => {
        expect(tooltip.show).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should show a tooltip on mobile', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)
      document.documentElement.ontouchstart = noop

      spyOn(EventHandler, 'on').and.callThrough()

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).not.toBeNull()
        expect(EventHandler.on).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)
        document.documentElement.ontouchstart = undefined
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip relative to placement option', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        placement: 'bottom'
      })

      tooltipEl.addEventListener('inserted.bs.tooltip', () => {
        expect(tooltip.getTipElement().classList.contains('bs-tooltip-bottom')).toEqual(true)
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tooltipShown = document.querySelector('.tooltip')

        expect(tooltipShown.classList.contains('bs-tooltip-bottom')).toEqual(true)
        done()
      })

      tooltip.show()
    })

    it('should not error when trying to show a tooltip that has been removed from the dom', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      const firstCallback = () => {
        tooltipEl.removeEventListener('shown.bs.tooltip', firstCallback)
        let tooltipShown = document.querySelector('.tooltip')

        tooltipShown.remove()

        tooltipEl.addEventListener('shown.bs.tooltip', () => {
          tooltipShown = document.querySelector('.tooltip')

          expect(tooltipShown).not.toBeNull()
          done()
        })

        tooltip.show()
      }

      tooltipEl.addEventListener('shown.bs.tooltip', firstCallback)

      tooltip.show()
    })

    it('should show a tooltip with a dom element container', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        container: fixtureEl
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(fixtureEl.querySelector('.tooltip')).not.toBeNull()
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip with a jquery element container', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        container: {
          0: fixtureEl,
          jquery: 'jQuery'
        }
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(fixtureEl.querySelector('.tooltip')).not.toBeNull()
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip with a selector in container', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        container: '#fixture'
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(fixtureEl.querySelector('.tooltip')).not.toBeNull()
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip with placement as a function', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const spy = jasmine.createSpy('placement').and.returnValue('top')
      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        placement: spy
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).not.toBeNull()
        expect(spy).toHaveBeenCalled()
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip without the animation', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        animation: false
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tip = document.querySelector('.tooltip')

        expect(tip).not.toBeNull()
        expect(tip.classList.contains('fade')).toEqual(false)
        done()
      })

      tooltip.show()
    })

    it('should throw an error the element is not visible', () => {
      fixtureEl.innerHTML = '<a href="#" style="display: none" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      try {
        tooltip.show()
      } catch (error) {
        expect(error.message).toEqual('Please use show on visible elements')
      }
    })

    it('should not show a tooltip if show.bs.tooltip is prevented', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      const expectedDone = () => {
        setTimeout(() => {
          expect(document.querySelector('.tooltip')).toBeNull()
          done()
        }, 10)
      }

      tooltipEl.addEventListener('show.bs.tooltip', ev => {
        ev.preventDefault()
        expectedDone()
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        throw new Error('Tooltip should not be shown')
      })

      tooltip.show()
    })

    it('should show tooltip if leave event hasn\'t occurred before delay expires', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        delay: 150
      })

      spyOn(tooltip, 'show')

      setTimeout(() => {
        expect(tooltip.show).not.toHaveBeenCalled()
      }, 100)

      setTimeout(() => {
        expect(tooltip.show).toHaveBeenCalled()
        done()
      }, 200)

      tooltipEl.dispatchEvent(createEvent('mouseover'))
    })

    it('should not show tooltip if leave event occurs before delay expires', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        delay: 150
      })

      spyOn(tooltip, 'show')

      setTimeout(() => {
        expect(tooltip.show).not.toHaveBeenCalled()
        tooltipEl.dispatchEvent(createEvent('mouseover'))
      }, 100)

      setTimeout(() => {
        expect(tooltip.show).toHaveBeenCalled()
        expect(document.querySelectorAll('.tooltip').length).toEqual(0)
        done()
      }, 200)

      tooltipEl.dispatchEvent(createEvent('mouseover'))
    })

    it('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        delay: {
          show: 0,
          hide: 150
        }
      })

      setTimeout(() => {
        expect(tooltip.getTipElement().classList.contains('show')).toEqual(true)
        tooltipEl.dispatchEvent(createEvent('mouseout'))

        setTimeout(() => {
          expect(tooltip.getTipElement().classList.contains('show')).toEqual(true)
          tooltipEl.dispatchEvent(createEvent('mouseover'))
        }, 100)

        setTimeout(() => {
          expect(tooltip.getTipElement().classList.contains('show')).toEqual(true)
          done()
        }, 200)
      }, 0)

      tooltipEl.dispatchEvent(createEvent('mouseover'))
    })

    it('should not hide tooltip if leave event occurs and interaction remains inside trigger', done => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '<b>Trigger</b>',
        'the tooltip',
        '</a>'
      ]

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)
      const triggerChild = tooltipEl.querySelector('b')

      spyOn(tooltip, 'hide').and.callThrough()

      tooltipEl.addEventListener('mouseover', () => {
        const moveMouseToChildEvent = createEvent('mouseout')
        Object.defineProperty(moveMouseToChildEvent, 'relatedTarget', {
          value: triggerChild
        })

        tooltipEl.dispatchEvent(moveMouseToChildEvent)
      })

      tooltipEl.addEventListener('mouseout', () => {
        expect(tooltip.hide).not.toHaveBeenCalled()
        done()
      })

      tooltipEl.dispatchEvent(createEvent('mouseover'))
    })

    it('should properly maintain tooltip state if leave event occurs and enter event occurs during hide transition', done => {
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
        expect(tooltip.getTipElement().getAttribute('data-popper-placement')).toBe('top')
        tooltipEl.dispatchEvent(createEvent('mouseout'))

        setTimeout(() => {
          expect(tooltip.getTipElement().classList.contains('show')).toEqual(false)
          tooltipEl.dispatchEvent(createEvent('mouseover'))
        }, 100)

        setTimeout(() => {
          expect(tooltip._popper).not.toBeNull()
          expect(tooltip.getTipElement().getAttribute('data-popper-placement')).toBe('top')
          done()
        }, 200)
      }, 0)

      tooltipEl.dispatchEvent(createEvent('mouseover'))
    })

    it('should only trigger inserted event if a new tooltip element was created', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

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
          expect(insertedFunc).toHaveBeenCalledTimes(1)
          done()
        }, 200)
      }, 0)

      tooltip.show()
    })

    it('should show a tooltip with custom class provided in data attributes', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip" data-bs-custom-class="custom-class">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tip = document.querySelector('.tooltip')
        expect(tip).not.toBeNull()
        expect(tip.classList.contains('custom-class')).toBeTrue()
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip with custom class provided as a string in config', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        customClass: 'custom-class custom-class-2'
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tip = document.querySelector('.tooltip')
        expect(tip).not.toBeNull()
        expect(tip.classList.contains('custom-class')).toBeTrue()
        expect(tip.classList.contains('custom-class-2')).toBeTrue()
        done()
      })

      tooltip.show()
    })

    it('should show a tooltip with custom class provided as a function in config', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const spy = jasmine.createSpy('customClass').and.returnValue('custom-class')
      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        customClass: spy
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tip = document.querySelector('.tooltip')
        expect(tip).not.toBeNull()
        expect(spy).toHaveBeenCalled()
        expect(tip.classList.contains('custom-class')).toBeTrue()
        done()
      })

      tooltip.show()
    })
  })

  describe('hide', () => {
    it('should hide a tooltip', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => tooltip.hide())
      tooltipEl.addEventListener('hidden.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).toBeNull()
        expect(tooltipEl.getAttribute('aria-describedby')).toBeNull()
        done()
      })

      tooltip.show()
    })

    it('should hide a tooltip on mobile', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        document.documentElement.ontouchstart = noop
        spyOn(EventHandler, 'off')
        tooltip.hide()
      })

      tooltipEl.addEventListener('hidden.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).toBeNull()
        expect(EventHandler.off).toHaveBeenCalledWith(jasmine.any(Object), 'mouseover', noop)
        document.documentElement.ontouchstart = undefined
        done()
      })

      tooltip.show()
    })

    it('should hide a tooltip without animation', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        animation: false
      })

      tooltipEl.addEventListener('shown.bs.tooltip', () => tooltip.hide())
      tooltipEl.addEventListener('hidden.bs.tooltip', () => {
        expect(document.querySelector('.tooltip')).toBeNull()
        expect(tooltipEl.getAttribute('aria-describedby')).toBeNull()
        done()
      })

      tooltip.show()
    })

    it('should not hide a tooltip if hide event is prevented', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const assertDone = () => {
        setTimeout(() => {
          expect(document.querySelector('.tooltip')).not.toBeNull()
          done()
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
        throw new Error('should not trigger hidden event')
      })

      tooltip.show()
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
    it('should call popper update', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        spyOn(tooltip._popper, 'update')

        tooltip.update()

        expect(tooltip._popper.update).toHaveBeenCalled()
        done()
      })

      tooltip.show()
    })

    it('should do nothing if the tooltip is not shown', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.update()
      expect().nothing()
    })
  })

  describe('isWithContent', () => {
    it('should return true if there is content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip.isWithContent()).toEqual(true)
    })

    it('should return false if there is no content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip.isWithContent()).toEqual(false)
    })
  })

  describe('getTipElement', () => {
    it('should create the tip element and return it', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      spyOn(document, 'createElement').and.callThrough()

      expect(tooltip.getTipElement()).toBeDefined()
      expect(document.createElement).toHaveBeenCalled()
    })

    it('should return the created tip element', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      const spy = spyOn(document, 'createElement').and.callThrough()

      expect(tooltip.getTipElement()).toBeDefined()
      expect(spy).toHaveBeenCalled()

      spy.calls.reset()

      expect(tooltip.getTipElement()).toBeDefined()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('setContent', () => {
    it('should set tip content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      const tip = tooltip.getTipElement()

      tooltip.setContent(tip)

      expect(tip.classList.contains('show')).toEqual(false)
      expect(tip.classList.contains('fade')).toEqual(false)
      expect(tip.querySelector('.tooltip-inner').textContent).toEqual('Another tooltip')
    })
  })

  describe('updateAttachment', () => {
    it('should use end class name when right placement specified', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        placement: 'right'
      })

      tooltipEl.addEventListener('inserted.bs.tooltip', () => {
        expect(tooltip.getTipElement().classList.contains('bs-tooltip-end')).toEqual(true)
        done()
      })

      tooltip.show()
    })

    it('should use start class name when left placement specified', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        placement: 'left'
      })

      tooltipEl.addEventListener('inserted.bs.tooltip', () => {
        expect(tooltip.getTipElement().classList.contains('bs-tooltip-start')).toEqual(true)
        done()
      })

      tooltip.show()
    })
  })

  describe('setElementContent', () => {
    it('should do nothing if the element is null', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setElementContent(null, null)
      expect().nothing()
    })

    it('should add the content as a child of the element', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '<div id="childContent"></div>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      tooltip.setElementContent(tooltip.getTipElement(), childContent)

      expect(childContent.parentNode).toEqual(tooltip.getTipElement())
    })

    it('should do nothing if the content is a child of the element', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '<div id="childContent"></div>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      tooltip.getTipElement().append(childContent)
      tooltip.setElementContent(tooltip.getTipElement(), childContent)

      expect().nothing()
    })

    it('should add the content as a child of the element for jQuery elements', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '<div id="childContent"></div>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      tooltip.setElementContent(tooltip.getTipElement(), { 0: childContent, jquery: 'jQuery' })

      expect(childContent.parentNode).toEqual(tooltip.getTipElement())
    })

    it('should add the child text content in the element', () => {
      fixtureEl.innerHTML = [
        '<a href="#" rel="tooltip" title="Another tooltip">',
        '<div id="childContent">Tooltip</div>'
      ].join('')

      const tooltipEl = fixtureEl.querySelector('a')
      const childContent = fixtureEl.querySelector('div')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setElementContent(tooltip.getTipElement(), childContent)

      expect(childContent.textContent).toEqual(tooltip.getTipElement().textContent)
    })

    it('should add html without sanitize it', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        sanitize: false,
        html: true
      })

      tooltip.setElementContent(tooltip.getTipElement(), '<div id="childContent">Tooltip</div>')

      expect(tooltip.getTipElement().querySelector('div').id).toEqual('childContent')
    })

    it('should add html sanitized', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        html: true
      })

      tooltip.setElementContent(tooltip.getTipElement(), [
        '<div id="childContent">',
        ' <button type="button">test btn</button>',
        '</div>'
      ].join(''))

      expect(tooltip.getTipElement().querySelector('div').id).toEqual('childContent')
      expect(tooltip.getTipElement().querySelector('button')).toEqual(null)
    })

    it('should add text content', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltip.setElementContent(tooltip.getTipElement(), 'test')

      expect(tooltip.getTipElement().textContent).toEqual('test')
    })
  })

  describe('getTitle', () => {
    it('should return the title', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      expect(tooltip.getTitle()).toEqual('Another tooltip')
    })

    it('should call title function', () => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl, {
        title: () => 'test'
      })

      expect(tooltip.getTitle()).toEqual('test')
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

      expect(Tooltip.getInstance(div)).toEqual(null)
    })
  })

  describe('aria-label', () => {
    it('should add the aria-label attribute for referencing original title', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tooltipShown = document.querySelector('.tooltip')

        expect(tooltipShown).not.toBeNull()
        expect(tooltipEl.getAttribute('aria-label')).toEqual('Another tooltip')
        done()
      })

      tooltip.show()
    })

    it('should not add the aria-label attribute if the attribute already exists', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" aria-label="Different label" title="Another tooltip"></a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tooltipShown = document.querySelector('.tooltip')

        expect(tooltipShown).not.toBeNull()
        expect(tooltipEl.getAttribute('aria-label')).toEqual('Different label')
        done()
      })

      tooltip.show()
    })

    it('should not add the aria-label attribute if the element has text content', done => {
      fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip">text content</a>'

      const tooltipEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(tooltipEl)

      tooltipEl.addEventListener('shown.bs.tooltip', () => {
        const tooltipShown = document.querySelector('.tooltip')

        expect(tooltipShown).not.toBeNull()
        expect(tooltipEl.getAttribute('aria-label')).toBeNull()
        done()
      })

      tooltip.show()
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

      expect(Tooltip.getInstance(div)).toEqual(null)
      expect(Tooltip.getOrCreateInstance(div)).toBeInstanceOf(Tooltip)
    })

    it('should return new instance when there is no tooltip instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Tooltip.getInstance(div)).toEqual(null)
      const tooltip = Tooltip.getOrCreateInstance(div, {
        title: () => 'test'
      })
      expect(tooltip).toBeInstanceOf(Tooltip)

      expect(tooltip.getTitle()).toEqual('test')
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

      expect(tooltip2.getTitle()).toEqual('nothing')
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

      spyOn(tooltip, 'show')

      jQueryMock.fn.tooltip = Tooltip.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tooltip.call(jQueryMock, 'show')

      expect(Tooltip.getInstance(div)).toEqual(tooltip)
      expect(tooltip.show).toHaveBeenCalled()
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
