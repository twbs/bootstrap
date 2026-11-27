import { vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import css from '../../../scss/bootstrap.scss?inline'
import Datepicker from '../../src/datepicker.js'

describe('Datepicker review regressions', () => {
  let host
  let style
  let picker

  beforeEach(() => {
    host = document.createElement('div')
    document.body.append(host)
    style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
  })

  afterEach(() => {
    if (picker?._element) {
      picker.dispose()
    }

    host.remove()
    style.remove()
  })

  it('restores the prior range when the new start is clicked again', async () => {
    host.innerHTML = '<button type="button"><span data-bs-datepicker-display data-bs-datepicker-end-placeholder="MM/DD/YYYY">MM/DD/YYYY – MM/DD/YYYY</span></button>'
    const button = host.firstElementChild
    picker = new Datepicker(button, {
      selectionMode: 'multiple-ranged',
      selectedDates: ['2026-06-10', '2026-06-18'],
      locale: 'en-US',
      dateFormat: { month: '2-digit', day: '2-digit', year: 'numeric' }
    })
    await picker.show()
    const start = () => picker._popup.querySelector('[data-vc-date="2026-06-12"] [data-vc-date-btn]')
    start().click()
    expect(picker.getSelectedDates()).toEqual(['2026-06-10', '2026-06-18'])
    expect(button.textContent).toBe('06/12/2026 – MM/DD/YYYY')
    start().click()
    expect(picker.getSelectedDates()).toEqual(['2026-06-10', '2026-06-18'])
    expect(button.textContent).toBe('06/10/2026 – 06/18/2026')
    expect(button.getAttribute('aria-expanded')).toBe('true')

    start().click()
    picker._popup.querySelector('[data-vc-date="2026-06-14"] [data-vc-date-btn]').click()
    expect(picker.getSelectedDates()).toEqual(['2026-06-12', '2026-06-14'])
    expect(button.textContent).toBe('06/12/2026 – 06/14/2026')
    expect(button.getAttribute('aria-expanded')).toBe('false')

    picker.setSelectedDates([])
    expect(picker.getSelectedDates()).toEqual([])
    expect(button.textContent).toBe('MM/DD/YYYY – MM/DD/YYYY')
  })

  it('blocks a typed unavailable date and clears its error after correction', () => {
    host.innerHTML = '<form><input name="date" required aria-describedby="hint"><span id="hint">Enter a date</span></form>'
    const input = host.querySelector('input')
    picker = new Datepicker(input, { dateMax: '2026-10-31' })
    input.value = '2026-11-01'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(input.form.checkValidity()).toBe(false)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const errorId = input.getAttribute('aria-describedby').split(' ').at(-1)
    expect(document.getElementById(errorId).textContent).toBe(picker._config.invalidDateMessage)

    input.value = '2026-10-31'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(input.form.checkValidity()).toBe(true)
    expect(input.getAttribute('aria-describedby')).toBe('hint')
    expect(input.hasAttribute('aria-invalid')).toBe(false)
    expect(new FormData(input.form).get('date')).toBe('2026-10-31')
  })

  it('submits the previous range while picking and restores it on Escape', async () => {
    host.innerHTML = '<form><label for="dates">Trip dates</label><input id="dates" name="trip" readonly></form>'
    const input = host.querySelector('input')
    picker = new Datepicker(input, { selectionMode: 'multiple-ranged', selectedDates: ['2026-06-10', '2026-06-18'] })
    await picker.show()
    const start = picker._popup.querySelector('[data-vc-date="2026-06-12"] [data-vc-date-btn]')
    start.focus()
    start.click()
    expect(picker._popup.getAttribute('aria-label')).toBe('Trip dates')
    expect(picker._popup.querySelector('[role="status"]').textContent).toBe('Choose an end date.')
    expect(new FormData(input.form).get('trip')).toBe('2026-06-10,2026-06-18')
    await userEvent.keyboard('{Escape}')
    expect(document.activeElement).toBe(input)
    expect(new FormData(input.form).get('trip')).toBe('2026-06-10,2026-06-18')
    await picker.show()
    expect(picker._popup.querySelector('[data-vc-date="2026-06-18"]').hasAttribute('data-vc-date-selected')).toBe(true)
  })

  it('uses Page Down and Shift+Page Up to move by month and year', async () => {
    host.innerHTML = '<button type="button" aria-label="Departure date">Calendar</button>'
    picker = new Datepicker(host.firstElementChild, { selectedDates: ['2026-01-31'] })
    await picker.show()
    const focusedDate = () => document.activeElement.closest('[data-vc-date]').dataset.vcDate
    await userEvent.keyboard('{PageDown}')
    expect(focusedDate()).toBe('2026-02-28')
    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')
    expect(focusedDate()).toBe('2025-02-28')
    await userEvent.keyboard('{ArrowRight}')
    expect(focusedDate()).toBe('2025-03-01')
    expect(picker._popup.querySelector('[data-vc="month"]').textContent).toBe('March')
  })

  it('prefers the selected date when today appears earlier in the month', async () => {
    host.innerHTML = '<button type="button">Choose date</button>'
    picker = new Datepicker(host.firstElementChild, {
      selectedDates: ['2026-10-19'],
      vcpOptions: { dateToday: '2026-10-17' }
    })
    await picker.show()
    expect(document.activeElement.closest('[data-vc-date]').dataset.vcDate).toBe('2026-10-19')
  })

  it('returns focus to a separate button after selection in a shadow root', async () => {
    const root = host.attachShadow({ mode: 'open' })
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    root.adoptedStyleSheets = [sheet]
    root.innerHTML = '<input id="date"><button type="button" id="calendar">Choose date</button>'
    const input = root.querySelector('input')
    const button = root.querySelector('button')
    picker = new Datepicker(input, { toggleElement: button, showOnFocus: false, selectedDates: ['2026-10-05'] })
    await picker.show(button)
    const date = picker._popup.querySelector('[data-vc-date="2026-10-06"] [data-vc-date-btn]')
    date.focus()
    date.click()
    expect(root.activeElement).toBe(button)
  })

  it('handles disposal from a hide callback during Escape', async () => {
    host.innerHTML = '<input>'
    const input = host.firstElementChild
    picker = new Datepicker(input)
    await picker.show()
    input.addEventListener('hide.bs.datepicker', () => picker.dispose(), { once: true })
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    Object.defineProperty(event, 'target', { value: input })
    expect(() => picker._handleKeydown(event)).not.toThrow()
  })

  it('does not submit a manually typed date outside the selectable range', () => {
    host.innerHTML = '<form><input name="date"></form>'
    const input = host.querySelector('input')
    picker = new Datepicker(input, { dateMin: '2026-10-01', dateMax: '2026-10-31' })
    input.value = '2026-11-01'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(picker.getSelectedDates()).toEqual([])
    expect(new FormData(host.querySelector('form')).get('date')).toBe('')
  })

  it('closes a shadow-root popup when its containing native dialog closes', async () => {
    host.innerHTML = '<dialog><div></div></dialog>'
    const dialog = host.querySelector('dialog')
    const root = dialog.querySelector('div').attachShadow({ mode: 'open' })
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    root.adoptedStyleSheets = [sheet]
    root.innerHTML = '<input>'
    dialog.showModal()
    picker = new Datepicker(root.querySelector('input'))
    await picker.show()
    expect(picker._popup.matches(':popover-open')).toBe(true)
    dialog.close()
    await vi.waitFor(() => expect(picker._isShown).toBe(false))
    expect(picker._popup.matches(':popover-open')).toBe(false)
    expect(picker._popup.getRootNode()).toBe(root)
  })

  it('uses shadow-root selectors for positioning and display targets', async () => {
    const root = host.attachShadow({ mode: 'open' })
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    root.adoptedStyleSheets = [sheet]
    root.innerHTML = '<div id="anchor"><input></div><span id="display"></span>'
    picker = new Datepicker(root.querySelector('input'), {
      positionElement: '#anchor', displayElement: '#display', selectedDates: ['2026-10-05']
    })
    expect(picker._positionElement).toBe(root.querySelector('#anchor'))
    expect(root.querySelector('#display').textContent).toBe(root.querySelector('input').value)
  })

  for (const [value, vcpOptions, expected] of [
    ['2026-10-04', { disableWeekdays: [0] }, []],
    ['2026-10-05', { disableDates: ['2026-10-05'] }, []],
    ['2026-10-04', { disableWeekdays: [0], enableDates: ['2026-10-04'] }, ['2026-10-04']]
  ]) {
    it(`respects calendar restrictions for typed ${value} with ${JSON.stringify(vcpOptions)}`, () => {
      host.innerHTML = '<form><input name="date"></form>'
      const input = host.querySelector('input')
      picker = new Datepicker(input, { vcpOptions })
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
      expect(picker.getSelectedDates()).toEqual(expected)
      expect(new FormData(host.querySelector('form')).get('date')).toBe(expected.join(','))
    })
  }

  for (const [locale, values] of [
    ['de-DE', ['1.3.2027', '01.03.2027']],
    ['en-US', ['3/1/2027', '03/01/2027']],
    ['en-GB', ['1/3/2027', '01/03/2027']]
  ]) {
    it(`accepts typed ${locale} dates with or without zero padding`, () => {
      host.innerHTML = '<form><input name="date"></form>'
      const input = host.querySelector('input')
      picker = new Datepicker(input, { locale })
      for (const value of values) {
        input.value = value
        input.dispatchEvent(new Event('input', { bubbles: true }))
        expect(picker.getSelectedDates()).toEqual(['2027-03-01'])
      }
    })
  }

  it('keeps the updated name when disposal precedes the attribute observer', () => {
    host.innerHTML = '<form><input name="before" value="2026-10-05"></form>'
    const input = host.querySelector('input')
    picker = new Datepicker(input)
    input.name = 'after'
    picker.dispose()
    expect(input.name).toBe('after')
  })

  it('does not submit stale dates after manual input fails the date limits', () => {
    host.innerHTML = '<form><input name="date" value="2026-10-05"></form>'
    const input = host.querySelector('input')
    picker = new Datepicker(input, { dateMin: '2026-10-01', dateMax: '2026-10-31' })
    input.value = '2026-11-01'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(new FormData(host.querySelector('form')).get('date')).toBe(picker.getSelectedDates().join(','))
  })

  it('handles disposal from a hide callback after date selection', async () => {
    host.innerHTML = '<button type="button">Choose date</button>'
    const button = host.firstElementChild
    picker = new Datepicker(button, { selectedDates: ['2026-10-05'] })
    await picker.show()
    button.addEventListener('hide.bs.datepicker', () => picker.dispose(), { once: true })
    expect(() => picker._maybeHideAfterSelection(['2026-10-05'])).not.toThrow()
    await vi.waitFor(() => expect(Datepicker.getInstance(button)).toBeNull())
  })
})
