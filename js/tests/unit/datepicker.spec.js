import EventHandler from '../../src/dom/event-handler.js'
import Datepicker from '../../src/datepicker.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Datepicker', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()

    // Clean up any VCP calendar elements that may have been created
    for (const calendarEl of document.querySelectorAll('[data-vc="calendar"]')) {
      calendarEl.remove()
    }
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Datepicker.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Datepicker.Default).toEqual(jasmine.any(Object))
    })

    it('should have expected default values', () => {
      expect(Datepicker.Default.dateMin).toBeNull()
      expect(Datepicker.Default.dateMax).toBeNull()
      expect(Datepicker.Default.selectionMode).toEqual('single')
      expect(Datepicker.Default.firstWeekday).toEqual(1)
      expect(Datepicker.Default.locale).toEqual('default')
      expect(Datepicker.Default.placement).toEqual('left')
      expect(Datepicker.Default.inline).toBeFalse()
      expect(Datepicker.Default.displayMonthsCount).toEqual(1)
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type config', () => {
      expect(Datepicker.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Datepicker.DATA_KEY).toEqual('bs.datepicker')
    })
  })

  describe('NAME', () => {
    it('should return plugin name', () => {
      expect(Datepicker.NAME).toEqual('datepicker')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<input type="text" id="datepickerEl" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('#datepickerEl')
      const datepickerBySelector = new Datepicker('#datepickerEl')
      const datepickerByElement = new Datepicker(inputEl)

      expect(datepickerBySelector._element).toEqual(inputEl)
      expect(datepickerByElement._element).toEqual(inputEl)
    })

    it('should initialize VCP calendar instance', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._calendar).not.toBeNull()
    })

    it('should detect input element type', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._isInput).toBeTrue()
    })

    it('should detect button element type', () => {
      fixtureEl.innerHTML = '<button type="button" data-bs-toggle="datepicker">Select date</button>'

      const buttonEl = fixtureEl.querySelector('button')
      const datepicker = new Datepicker(buttonEl)

      expect(datepicker._isInput).toBeFalse()
    })

    it('should use config from data attributes', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged" data-bs-first-weekday="0">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.selectionMode).toEqual('multiple-ranged')
      expect(datepicker._config.firstWeekday).toEqual(0)
    })

    it('should merge passed config with data attributes', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-first-weekday="0">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        selectionMode: 'multiple'
      })

      expect(datepicker._config.selectionMode).toEqual('multiple')
      expect(datepicker._config.firstWeekday).toEqual(0)
    })
  })

  describe('show', () => {
    it('should show the calendar popup', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('shown.bs.datepicker', () => {
          expect(datepicker._isShown).toBeTrue()
          resolve()
        })

        datepicker.show()
      })
    })

    it('should trigger show.bs.datepicker event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('show.bs.datepicker', event => {
          expect(event).toBeDefined()
          resolve()
        })

        datepicker.show()
      })
    })

    it('should trigger shown.bs.datepicker event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('shown.bs.datepicker', event => {
          expect(event).toBeDefined()
          resolve()
        })

        datepicker.show()
      })
    })

    it('should be cancelable via preventDefault', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('show.bs.datepicker', event => {
          event.preventDefault()
        })

        inputEl.addEventListener('shown.bs.datepicker', () => {
          throw new Error('shown event should not fire')
        })

        datepicker.show()

        setTimeout(() => {
          expect(datepicker._isShown).toBeFalse()
          resolve()
        }, 50)
      })
    })

    it('should not show if already shown', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      datepicker._isShown = true

      const spy = spyOn(EventHandler, 'trigger')
      datepicker.show()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not show if disabled', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" disabled>'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      const spy = spyOn(EventHandler, 'trigger')
      datepicker.show()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing for inline mode', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

      const divEl = fixtureEl.querySelector('div')
      const datepicker = new Datepicker(divEl)

      const spy = spyOn(datepicker._calendar, 'show')
      datepicker.show()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('hide', () => {
    it('should hide the calendar popup', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('shown.bs.datepicker', () => {
          datepicker.hide()
        })

        inputEl.addEventListener('hidden.bs.datepicker', () => {
          expect(datepicker._isShown).toBeFalse()
          resolve()
        })

        datepicker.show()
      })
    })

    it('should trigger hide.bs.datepicker event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('shown.bs.datepicker', () => {
          datepicker.hide()
        })

        inputEl.addEventListener('hide.bs.datepicker', event => {
          expect(event).toBeDefined()
          resolve()
        })

        datepicker.show()
      })
    })

    it('should trigger hidden.bs.datepicker event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('shown.bs.datepicker', () => {
          datepicker.hide()
        })

        inputEl.addEventListener('hidden.bs.datepicker', event => {
          expect(event).toBeDefined()
          resolve()
        })

        datepicker.show()
      })
    })

    it('should be cancelable via preventDefault', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('shown.bs.datepicker', () => {
          datepicker.hide()
        })

        inputEl.addEventListener('hide.bs.datepicker', event => {
          event.preventDefault()
        })

        inputEl.addEventListener('hidden.bs.datepicker', () => {
          throw new Error('hidden event should not fire')
        })

        datepicker.show()

        setTimeout(() => {
          expect(datepicker._isShown).toBeTrue()
          resolve()
        }, 50)
      })
    })

    it('should not hide if not shown', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      const spy = spyOn(EventHandler, 'trigger')
      datepicker.hide()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing for inline mode', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

      const divEl = fixtureEl.querySelector('div')
      const datepicker = new Datepicker(divEl)
      datepicker._isShown = true

      const spy = spyOn(datepicker._calendar, 'hide')
      datepicker.hide()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('toggle', () => {
    it('should show when hidden', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      const showSpy = spyOn(datepicker, 'show')
      datepicker.toggle()

      expect(showSpy).toHaveBeenCalled()
    })

    it('should hide when shown', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      datepicker._isShown = true

      const hideSpy = spyOn(datepicker, 'hide')
      datepicker.toggle()

      expect(hideSpy).toHaveBeenCalled()
    })

    it('should do nothing for inline mode', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

      const divEl = fixtureEl.querySelector('div')
      const datepicker = new Datepicker(divEl)

      const showSpy = spyOn(datepicker, 'show')
      const hideSpy = spyOn(datepicker, 'hide')
      const result = datepicker.toggle()

      expect(result).toBeUndefined()
      expect(showSpy).not.toHaveBeenCalled()
      expect(hideSpy).not.toHaveBeenCalled()
    })
  })

  describe('getSelectedDates / setSelectedDates', () => {
    it('should return empty array when no dates selected', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker.getSelectedDates()).toEqual([])
    })

    it('should set selected dates', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)
      const dates = ['2025-01-15']

      datepicker.setSelectedDates(dates)

      expect(datepicker.getSelectedDates()).toEqual(dates)
    })

    it('should return copy of dates array, not reference', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)
      const dates = ['2025-01-15']

      datepicker.setSelectedDates(dates)

      const result = datepicker.getSelectedDates()
      result.push('2025-01-20')

      expect(datepicker.getSelectedDates()).toEqual(dates)
    })
  })

  describe('dispose', () => {
    it('should destroy VCP instance', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      const destroySpy = spyOn(datepicker._calendar, 'destroy')

      datepicker.dispose()

      expect(destroySpy).toHaveBeenCalled()
      expect(datepicker._calendar).toBeNull()
    })

    it('should remove data from element', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(Datepicker.getInstance(inputEl)).toEqual(datepicker)

      datepicker.dispose()

      expect(Datepicker.getInstance(inputEl)).toBeNull()
    })
  })

  describe('options', () => {
    it('should respect dateMin option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-date-min="2025-01-01">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.dateMin).toEqual('2025-01-01')
    })

    it('should respect dateMax option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-date-max="2025-12-31">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.dateMax).toEqual('2025-12-31')
    })

    it('should respect selectionMode option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.selectionMode).toEqual('multiple-ranged')
    })

    it('should respect placement option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-placement="right">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.placement).toEqual('right')
    })

    it('should respect inline option', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

      const divEl = fixtureEl.querySelector('div')
      const datepicker = new Datepicker(divEl)

      expect(datepicker._config.inline).toBeTrue()
      expect(datepicker._isInline).toBeTrue()
    })

    it('should respect displayMonthsCount option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-display-months-count="2">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.displayMonthsCount).toEqual(2)
    })

    it('should respect locale option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-locale="de-DE">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.locale).toEqual('de-DE')
    })

    it('should respect datepickerTheme option', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-datepicker-theme="dark">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._config.datepickerTheme).toEqual('dark')
    })
  })

  describe('theme detection', () => {
    it('should detect theme from closest [data-bs-theme] ancestor', () => {
      fixtureEl.innerHTML = [
        '<div data-bs-theme="dark">',
        '  <input type="text" data-bs-toggle="datepicker">',
        '</div>'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._getEffectiveTheme()).toEqual('dark')
    })

    it('should use explicit datepickerTheme config over ancestor', () => {
      fixtureEl.innerHTML = [
        '<div data-bs-theme="dark">',
        '  <input type="text" data-bs-toggle="datepicker" data-bs-datepicker-theme="light">',
        '</div>'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._getEffectiveTheme()).toEqual('light')
    })

    it('should return null when no theme detected', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._getEffectiveTheme()).toBeNull()
    })

    it('should set data-bs-theme on calendar element when ancestor has theme', () => {
      fixtureEl.innerHTML = [
        '<div data-bs-theme="dark">',
        '  <input type="text" data-bs-toggle="datepicker">',
        '</div>'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      // Manually sync theme (simulates what onInit does)
      datepicker._syncThemeAttribute(datepicker._calendar.context.mainElement)

      const calendarEl = datepicker._calendar.context.mainElement
      expect(calendarEl.getAttribute('data-bs-theme')).toEqual('dark')
    })

    it('should not have data-bs-theme when no theme is set', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      // Manually sync theme (simulates what onInit does)
      datepicker._syncThemeAttribute(datepicker._calendar.context.mainElement)

      const calendarEl = datepicker._calendar.context.mainElement
      expect(calendarEl.hasAttribute('data-bs-theme')).toBeFalse()
    })
  })

  describe('form-adorn integration', () => {
    it('should use .form-adorn parent as position element', () => {
      fixtureEl.innerHTML = [
        '<div class="form-adorn" id="adorn-wrapper">',
        '  <input type="text" data-bs-toggle="datepicker">',
        '</div>'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const adornEl = fixtureEl.querySelector('.form-adorn')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._positionElement).toEqual(adornEl)
    })

    it('should still use input element when not in form-adorn', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._positionElement).toEqual(inputEl)
    })

    it('should respect explicit positionElement option', () => {
      fixtureEl.innerHTML = [
        '<div id="custom-position"></div>',
        '<input type="text" data-bs-toggle="datepicker">'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const customEl = fixtureEl.querySelector('#custom-position')
      const datepicker = new Datepicker(inputEl, {
        positionElement: '#custom-position'
      })

      expect(datepicker._positionElement).toEqual(customEl)
    })
  })

  describe('button trigger', () => {
    it('should use button element as display element by default', () => {
      fixtureEl.innerHTML = '<button type="button" data-bs-toggle="datepicker">Select date</button>'

      const buttonEl = fixtureEl.querySelector('button')
      const datepicker = new Datepicker(buttonEl)

      expect(datepicker._displayElement).toEqual(buttonEl)
    })

    it('should use [data-bs-datepicker-display] child if present', () => {
      fixtureEl.innerHTML = [
        '<button type="button" data-bs-toggle="datepicker">',
        '  <span>Icon</span>',
        '  <span data-bs-datepicker-display>Select date</span>',
        '</button>'
      ].join('')

      const buttonEl = fixtureEl.querySelector('button')
      const displayEl = fixtureEl.querySelector('[data-bs-datepicker-display]')
      const datepicker = new Datepicker(buttonEl)

      expect(datepicker._displayElement).toEqual(displayEl)
    })

    it('should not set display element for inputs', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._displayElement).toBeNull()
    })
  })

  describe('date formatting', () => {
    it('should format single date with default locale', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      const result = datepicker._formatDate('2025-01-15')

      // Should be a string (format varies by system locale)
      expect(typeof result).toEqual('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should format date with custom dateFormat options', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        dateFormat: { year: 'numeric', month: 'short', day: 'numeric' },
        locale: 'en-US'
      })

      const result = datepicker._formatDate('2025-01-15')

      expect(result).toEqual('Jan 15, 2025')
    })

    it('should format date with custom function', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        dateFormat: date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      })

      const result = datepicker._formatDate('2025-01-15')

      expect(result).toEqual('2025-1-15')
    })

    it('should use en-dash for date ranges', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        locale: 'en-US'
      })

      const result = datepicker._formatDateForInput(['2025-01-15', '2025-01-20'])

      expect(result).toContain(' – ')
    })

    it('should use comma for multiple dates', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-selection-mode="multiple">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        locale: 'en-US'
      })

      const result = datepicker._formatDateForInput(['2025-01-15', '2025-01-20'])

      expect(result).toContain(', ')
    })
  })

  describe('inline mode', () => {
    it('should set _isInline to true', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

      const divEl = fixtureEl.querySelector('div')
      const datepicker = new Datepicker(divEl)

      expect(datepicker._isInline).toBeTrue()
    })

    it('should find hidden input for value binding', () => {
      fixtureEl.innerHTML = [
        '<div data-bs-toggle="datepicker" data-bs-inline="true">',
        '  <input type="hidden" name="selected_date">',
        '</div>'
      ].join('')

      const divEl = fixtureEl.querySelector('div')
      const hiddenInput = fixtureEl.querySelector('input[type="hidden"]')
      const datepicker = new Datepicker(divEl)

      expect(datepicker._boundInput).toEqual(hiddenInput)
    })

    it('should not look for hidden input when element is an input', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-inline="true">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker._boundInput).toBeUndefined()
    })
  })

  describe('data-api', () => {
    it('should toggle on click for buttons', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<button type="button" data-bs-toggle="datepicker">Select date</button>'

        const buttonEl = fixtureEl.querySelector('button')

        buttonEl.addEventListener('shown.bs.datepicker', () => {
          const datepicker = Datepicker.getInstance(buttonEl)
          expect(datepicker._isShown).toBeTrue()
          resolve()
        })

        buttonEl.click()
      })
    })

    it('should show on focus for inputs', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')

        inputEl.addEventListener('shown.bs.datepicker', () => {
          const datepicker = Datepicker.getInstance(inputEl)
          expect(datepicker._isShown).toBeTrue()
          resolve()
        })

        // Trigger focusin event
        const focusEvent = createEvent('focusin', { bubbles: true })
        inputEl.dispatchEvent(focusEvent)
      })
    })

    it('should not toggle on click for inputs', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      const toggleSpy = spyOn(datepicker, 'toggle')

      const clickEvent = createEvent('click', { bubbles: true })
      inputEl.dispatchEvent(clickEvent)

      expect(toggleSpy).not.toHaveBeenCalled()
    })

    it('should not toggle for inline datepickers', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

      const divEl = fixtureEl.querySelector('div')
      // Manually create instance (auto-init happens on DOMContentLoaded)
      const datepicker = new Datepicker(divEl)

      const toggleSpy = spyOn(datepicker, 'toggle')

      const clickEvent = createEvent('click', { bubbles: true })
      divEl.dispatchEvent(clickEvent)

      expect(toggleSpy).not.toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return datepicker instance', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(Datepicker.getInstance(inputEl)).toEqual(datepicker)
      expect(Datepicker.getInstance(inputEl)).toBeInstanceOf(Datepicker)
    })

    it('should return null when there is no datepicker instance', () => {
      fixtureEl.innerHTML = '<input type="text">'

      const inputEl = fixtureEl.querySelector('input')

      expect(Datepicker.getInstance(inputEl)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return datepicker instance', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(Datepicker.getOrCreateInstance(inputEl)).toEqual(datepicker)
      expect(Datepicker.getInstance(inputEl)).toEqual(Datepicker.getOrCreateInstance(inputEl, {}))
      expect(Datepicker.getOrCreateInstance(inputEl)).toBeInstanceOf(Datepicker)
    })

    it('should return new instance when there is no datepicker instance', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')

      expect(Datepicker.getInstance(inputEl)).toBeNull()
      expect(Datepicker.getOrCreateInstance(inputEl)).toBeInstanceOf(Datepicker)
    })

    it('should return new instance when there is no datepicker instance with given configuration', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')

      expect(Datepicker.getInstance(inputEl)).toBeNull()
      const datepicker = Datepicker.getOrCreateInstance(inputEl, {
        selectionMode: 'multiple-ranged'
      })
      expect(datepicker).toBeInstanceOf(Datepicker)
      expect(datepicker._config.selectionMode).toEqual('multiple-ranged')
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        selectionMode: 'multiple-ranged'
      })
      expect(Datepicker.getInstance(inputEl)).toEqual(datepicker)

      const datepicker2 = Datepicker.getOrCreateInstance(inputEl, {
        selectionMode: 'single'
      })
      expect(datepicker).toBeInstanceOf(Datepicker)
      expect(datepicker2).toEqual(datepicker)

      // Config should not change
      expect(datepicker2._config.selectionMode).toEqual('multiple-ranged')
    })
  })

  describe('input value parsing', () => {
    it('should parse initial input value', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" value="2025-01-15">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      // Should have one date selected (exact date may vary due to timezone)
      const dates = datepicker.getSelectedDates()
      expect(dates.length).toEqual(1)
      expect(dates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should handle invalid input value gracefully', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" value="not-a-date">'

      const inputEl = fixtureEl.querySelector('input')

      // Should not throw
      expect(() => new Datepicker(inputEl)).not.toThrow()
    })

    it('should handle empty input value', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" value="">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      expect(datepicker.getSelectedDates()).toEqual([])
    })
  })

  describe('vcpOptions pass-through', () => {
    it('should pass vcpOptions to VCP', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl, {
        vcpOptions: {
          jumpMonths: 2
        }
      })

      expect(datepicker._config.vcpOptions.jumpMonths).toEqual(2)
    })
  })

  describe('date selection handling', () => {
    it('should trigger change.bs.datepicker event on date click', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        inputEl.addEventListener('change.bs.datepicker', event => {
          expect(event.dates).toBeDefined()
          expect(Array.isArray(event.dates)).toBeTrue()
          resolve()
        })

        // Simulate VCP date click callback
        datepicker._handleDateClick({
          context: { selectedDates: ['2025-01-15'] }
        }, new Event('click'))
      })
    })

    it('should update input value on date selection', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      const datepicker = new Datepicker(inputEl)

      datepicker._handleDateClick({
        context: { selectedDates: ['2025-01-15'] }
      }, new Event('click'))

      expect(inputEl.value).not.toEqual('')
    })

    it('should update display element on date selection for buttons', () => {
      fixtureEl.innerHTML = [
        '<button type="button" data-bs-toggle="datepicker">',
        '  <span data-bs-datepicker-display>Select date</span>',
        '</button>'
      ].join('')

      const buttonEl = fixtureEl.querySelector('button')
      const displayEl = fixtureEl.querySelector('[data-bs-datepicker-display]')
      const datepicker = new Datepicker(buttonEl)

      datepicker._handleDateClick({
        context: { selectedDates: ['2025-01-15'] }
      }, new Event('click'))

      expect(displayEl.textContent).not.toEqual('Select date')
    })

    it('should update bound hidden input in inline mode', () => {
      fixtureEl.innerHTML = [
        '<div data-bs-toggle="datepicker" data-bs-inline="true">',
        '  <input type="hidden" name="date">',
        '</div>'
      ].join('')

      const divEl = fixtureEl.querySelector('div')
      const hiddenInput = fixtureEl.querySelector('input[type="hidden"]')
      const datepicker = new Datepicker(divEl)

      datepicker._handleDateClick({
        context: { selectedDates: ['2025-01-15'] }
      }, new Event('click'))

      expect(hiddenInput.value).toEqual('2025-01-15')
    })

    it('should auto-hide after single date selection', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        const hideSpy = spyOn(datepicker, 'hide')

        datepicker._handleDateClick({
          context: { selectedDates: ['2025-01-15'] }
        }, new Event('click'))

        setTimeout(() => {
          expect(hideSpy).toHaveBeenCalled()
          resolve()
        }, 150)
      })
    })

    it('should auto-hide after range selection with 2 dates', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        const hideSpy = spyOn(datepicker, 'hide')

        datepicker._handleDateClick({
          context: { selectedDates: ['2025-01-15', '2025-01-20'] }
        }, new Event('click'))

        setTimeout(() => {
          expect(hideSpy).toHaveBeenCalled()
          resolve()
        }, 150)
      })
    })

    it('should not auto-hide in range mode with only 1 date', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged">'

        const inputEl = fixtureEl.querySelector('input')
        const datepicker = new Datepicker(inputEl)

        const hideSpy = spyOn(datepicker, 'hide')

        datepicker._handleDateClick({
          context: { selectedDates: ['2025-01-15'] }
        }, new Event('click'))

        setTimeout(() => {
          expect(hideSpy).not.toHaveBeenCalled()
          resolve()
        }, 150)
      })
    })

    it('should not auto-hide in inline mode', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

        const divEl = fixtureEl.querySelector('div')
        const datepicker = new Datepicker(divEl)

        const hideSpy = spyOn(datepicker, 'hide')

        datepicker._handleDateClick({
          context: { selectedDates: ['2025-01-15'] }
        }, new Event('click'))

        setTimeout(() => {
          expect(hideSpy).not.toHaveBeenCalled()
          resolve()
        }, 150)
      })
    })

    it('should handle empty date selection', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

      const inputEl = fixtureEl.querySelector('input')
      inputEl.value = 'previous value'
      const datepicker = new Datepicker(inputEl)

      // Should not throw
      expect(() => {
        datepicker._handleDateClick({
          context: { selectedDates: [] }
        }, new Event('click'))
      }).not.toThrow()

      // Value should not be updated when no dates
      expect(inputEl.value).toEqual('previous value')
    })
  })

  describe('_maybeHideAfterSelection', () => {
    it('should not hide when inline', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div data-bs-toggle="datepicker" data-bs-inline="true"></div>'

        const divEl = fixtureEl.querySelector('div')
        const datepicker = new Datepicker(divEl)

        const hideSpy = spyOn(datepicker, 'hide')

        datepicker._maybeHideAfterSelection(['2025-01-15'])

        setTimeout(() => {
          expect(hideSpy).not.toHaveBeenCalled()
          resolve()
        }, 150)
      })
    })
  })

  describe('_resolvePositionElement', () => {
    it('should resolve selector string to element', () => {
      fixtureEl.innerHTML = [
        '<div id="position-target"></div>',
        '<input type="text" data-bs-toggle="datepicker">'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const targetEl = fixtureEl.querySelector('#position-target')
      const datepicker = new Datepicker(inputEl, {
        positionElement: '#position-target'
      })

      expect(datepicker._positionElement).toEqual(targetEl)
    })
  })

  describe('_resolveDisplayElement', () => {
    it('should resolve selector string to element', () => {
      fixtureEl.innerHTML = [
        '<span id="display-target"></span>',
        '<button type="button" data-bs-toggle="datepicker">Click</button>'
      ].join('')

      const buttonEl = fixtureEl.querySelector('button')
      const targetEl = fixtureEl.querySelector('#display-target')
      const datepicker = new Datepicker(buttonEl, {
        displayElement: '#display-target'
      })

      expect(datepicker._displayElement).toEqual(targetEl)
    })

    it('should use element directly when passed', () => {
      fixtureEl.innerHTML = [
        '<span id="display-target"></span>',
        '<button type="button" data-bs-toggle="datepicker">Click</button>'
      ].join('')

      const buttonEl = fixtureEl.querySelector('button')
      const targetEl = fixtureEl.querySelector('#display-target')
      const datepicker = new Datepicker(buttonEl, {
        displayElement: targetEl
      })

      expect(datepicker._displayElement).toEqual(targetEl)
    })
  })
})
