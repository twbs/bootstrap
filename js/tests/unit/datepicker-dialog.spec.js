import Datepicker from '../../src/datepicker.js'
import {
  clearFixture, getFixture
} from '../helpers/fixture.js'

describe('Datepicker in a dialog', () => {
  let fixtureEl
  const popupStyle = document.createElement('style')
  popupStyle.textContent = [
    'dialog[open] { overflow: visible; }',
    '[data-vc="calendar"] { position: absolute; min-width: 280px; }'
  ].join('')

  beforeAll(() => {
    fixtureEl = getFixture()
    document.head.append(popupStyle)
  })

  afterAll(() => {
    popupStyle.remove()
  })

  afterEach(() => {
    for (const dialogEl of document.querySelectorAll('dialog[open]')) {
      dialogEl.close()
    }

    document.body.style.minHeight = ''
    window.scrollTo(0, 0)
    clearFixture()

    for (const calendarEl of document.querySelectorAll('[data-vc="calendar"]')) {
      calendarEl.remove()
    }
  })

  const showInDialog = ({ modal = true, scrollY = 0 } = {}) => {
    fixtureEl.innerHTML = [
      '<dialog class="dialog">',
      '  <input type="text" data-bs-toggle="datepicker">',
      '</dialog>'
    ].join('')

    const dialogEl = fixtureEl.querySelector('dialog')
    const inputEl = fixtureEl.querySelector('input')
    const datepicker = new Datepicker(inputEl)

    if (scrollY) {
      document.body.style.minHeight = '2000px'
      window.scrollTo(0, scrollY)
    }

    if (modal) {
      dialogEl.showModal()
    } else {
      // Place the dialog in the viewport so the library can position the popup.
      dialogEl.style.position = 'fixed'
      dialogEl.style.inset = 'auto'
      dialogEl.style.top = '80px'
      dialogEl.style.left = '80px'
      dialogEl.style.zIndex = '1040'
      dialogEl.show()
    }

    return datepicker.show().then(() => ({ dialogEl, inputEl, datepicker }))
  }

  const popupOf = datepicker => datepicker._calendar.context.mainElement

  it('should keep a popup on the body when no dialog is open', () => {
    fixtureEl.innerHTML = '<input type="text" data-bs-toggle="datepicker">'

    const inputEl = fixtureEl.querySelector('input')
    const datepicker = new Datepicker(inputEl)

    return datepicker.show().then(() => {
      expect(popupOf(datepicker).parentElement).toEqual(document.body)
    })
  })

  it('should place the popup in an open modal dialog above the backdrop', () => {
    return showInDialog().then(({ dialogEl, inputEl, datepicker }) => {
      const popup = popupOf(datepicker)
      const popupRect = popup.getBoundingClientRect()
      const inputRect = inputEl.getBoundingClientRect()
      const x = popupRect.left + 24
      const y = Math.min(popupRect.bottom - 8, window.innerHeight - 2)
      const hit = document.elementFromPoint(x, y)

      expect(popup.parentElement).toEqual(dialogEl)
      expect(popupRect.left).toBeCloseTo(inputRect.left, 0)
      expect(popupRect.top).toBeCloseTo(inputRect.bottom, 0)
      expect(popup.contains(hit) || hit === popup).toBeTrue()
    })
  })

  it('should keep the popup aligned when the page is scrolled', () => {
    return showInDialog({ scrollY: 240 }).then(({ inputEl, datepicker }) => {
      const popupRect = popupOf(datepicker).getBoundingClientRect()
      const inputRect = inputEl.getBoundingClientRect()

      expect(window.scrollY).toBeGreaterThan(0)
      expect(popupRect.left).toBeCloseTo(inputRect.left, 0)
      expect(popupRect.top).toBeCloseTo(inputRect.bottom, 0)
    })
  })

  it('should place the popup in an open non-modal dialog', () => {
    return showInDialog({ modal: false }).then(({ dialogEl, inputEl, datepicker }) => {
      const popup = popupOf(datepicker)
      const popupRect = popup.getBoundingClientRect()
      const inputRect = inputEl.getBoundingClientRect()
      const hit = document.elementFromPoint(popupRect.left + 24, popupRect.top + 24)

      expect(popup.parentElement).toEqual(dialogEl)
      expect(Math.abs(popupRect.left - inputRect.left)).toBeLessThan(1)
      expect(Math.abs(popupRect.top - inputRect.bottom)).toBeLessThan(1)
      expect(popup.contains(hit) || hit === popup).toBeTrue()
    })
  })

  it('should keep the popup in the dialog after a window resize', () => {
    return showInDialog().then(({ dialogEl, inputEl, datepicker }) => {
      window.dispatchEvent(new Event('resize'))

      return new Promise(resolve => {
        requestAnimationFrame(() => {
          const popupRect = popupOf(datepicker).getBoundingClientRect()
          const inputRect = inputEl.getBoundingClientRect()

          expect(popupOf(datepicker).parentElement).toEqual(dialogEl)
          expect(popupRect.left).toBeCloseTo(inputRect.left, 0)
          expect(popupRect.top).toBeCloseTo(inputRect.bottom, 0)
          resolve()
        })
      })
    })
  })

  it('should return the popup to the body when the dialog is closed', () => {
    return showInDialog().then(({ dialogEl, datepicker }) => {
      dialogEl.close()
      window.dispatchEvent(new Event('resize'))

      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(popupOf(datepicker).parentElement).toEqual(document.body)
          resolve()
        })
      })
    })
  })

  it('should leave the popup on the body when the dialog clips overflow', () => {
    fixtureEl.innerHTML = [
      '<dialog class="dialog" style="overflow: hidden">',
      '  <input type="text" data-bs-toggle="datepicker">',
      '</dialog>'
    ].join('')

    const dialogEl = fixtureEl.querySelector('dialog')
    const inputEl = fixtureEl.querySelector('input')
    const datepicker = new Datepicker(inputEl)
    dialogEl.showModal()

    return datepicker.show().then(() => {
      expect(popupOf(datepicker).parentElement).toEqual(document.body)
    })
  })

  it('should leave an inline calendar in place inside a dialog', () => {
    fixtureEl.innerHTML = [
      '<dialog class="dialog" open>',
      '  <div data-bs-toggle="datepicker" data-bs-inline="true"></div>',
      '</dialog>'
    ].join('')

    const dialogEl = fixtureEl.querySelector('dialog')
    const calendarEl = fixtureEl.querySelector('[data-bs-inline]')
    const parent = calendarEl.parentElement
    const datepicker = new Datepicker(calendarEl)

    return datepicker.show().then(() => {
      datepicker._isShown = true
      datepicker._syncPopupLayer()

      expect(calendarEl.parentElement).toEqual(parent)
      expect(dialogEl.contains(calendarEl)).toBeTrue()
      expect(datepicker._calendar.context.mainElement).toEqual(calendarEl)
    })
  })
})
