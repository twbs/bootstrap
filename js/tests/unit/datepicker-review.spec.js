import { vi } from 'vitest'
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
