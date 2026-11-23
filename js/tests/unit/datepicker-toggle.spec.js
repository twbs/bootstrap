import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import css from '../../../scss/bootstrap.scss?inline'
import Datepicker from '../../src/datepicker.js'

describe('Datepicker calendar button', () => {
  let host
  let style
  let picker
  let input
  let button

  beforeEach(() => {
    host = document.createElement('form')
    host.innerHTML = '<input id="pairedDate" name="date" value="2026-10-05" data-bs-toggle="datepicker" data-bs-show-on-focus="false" data-bs-toggle-element="#pairedToggle" data-bs-locale="en-GB"><button type="button" id="pairedToggle" aria-label="Choose date">Calendar</button><input id="nextField" aria-label="Next field">'
    document.body.append(host)
    style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
    input = host.querySelector('#pairedDate')
    button = host.querySelector('#pairedToggle')
    document.dispatchEvent(new Event('DOMContentLoaded'))
    picker = Datepicker.getInstance(input)
  })

  afterEach(() => {
    if (picker?._element) {
      picker.dispose()
    }

    host.remove()
    style.remove()
  })

  it('initializes both controls and keeps typing separate from opening', async () => {
    expect(picker).not.toBeNull()
    expect(button.getAttribute('aria-haspopup')).toBe('dialog')
    expect(button.getAttribute('aria-controls')).toBe(picker._popup.id)
    expect(input.getAttribute('aria-controls')).toBe(picker._popup.id)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    await userEvent.click(input)
    expect(picker._isShown).toBe(false)
    input.value = '06/10/2026'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(new FormData(host).get('date')).toBe('2026-10-06')
    await picker.show()
    expect(picker._isShown).toBe(true)
  })

  it('opens from the button and focuses the selected date', async () => {
    await userEvent.click(button)
    await vi.waitFor(() => expect(document.activeElement.matches('[data-vc-date-btn]')).toBe(true))
    expect(document.activeElement.closest('[data-vc-date-selected]')).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(input.getAttribute('aria-expanded')).toBe('true')
    await userEvent.keyboard('{Escape}')
    expect(picker._isShown).toBe(false)
    expect(document.activeElement).toBe(button)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('focuses today when there is no selection', async () => {
    picker.setSelectedDates([])
    picker._calendar.set({ selectedMonth: new Date().getMonth(), selectedYear: new Date().getFullYear() })
    await userEvent.click(button)
    await vi.waitFor(() => expect(document.activeElement.closest('[data-vc-date-today]')).not.toBeNull())
  })

  it('returns to the calendar button after a date selection', async () => {
    await userEvent.click(button)
    await vi.waitFor(() => expect(document.activeElement.matches('[data-vc-date-btn]')).toBe(true))
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await vi.waitFor(() => expect(picker._isShown).toBe(false))
    expect(document.activeElement).toBe(button)
    expect(new FormData(host).get('date')).toBe('2026-10-06')
  })

  it('updates the value and starts closing in the same day click', async () => {
    await picker.show(button)
    const hidden = vi.fn()
    input.addEventListener('hidden.bs.datepicker', hidden)
    const date = picker._popup.querySelector('[data-vc-date="2026-10-06"] [data-vc-date-btn]')
    date.focus()
    date.click()
    expect(input.value).toBe('06/10/2026')
    expect(new FormData(host).get('date')).toBe('2026-10-06')
    expect(picker._isShown).toBe(false)
    expect(picker._popup.inert).toBe(true)
    expect(picker._popup.matches(':popover-open')).toBe(true)
    expect(document.activeElement).toBe(button)
    expect(hidden).not.toHaveBeenCalled()
    await vi.waitFor(() => expect(hidden).toHaveBeenCalledOnce())
    await vi.waitFor(() => expect(getComputedStyle(picker._popup).display).toBe('none'))
    expect(picker._popup.matches(':popover-open')).toBe(false)
    expect(picker._popup.hasAttribute('data-vc-calendar-closing')).toBe(false)
  })

  it('keeps a reopened popup visible when an earlier exit finishes', async () => {
    await picker.show(button)
    const hidden = vi.fn()
    input.addEventListener('hidden.bs.datepicker', hidden)
    const closing = picker.hide()
    expect(picker._popup.matches(':popover-open')).toBe(true)
    await picker.show(button)
    await closing
    expect(picker._isShown).toBe(true)
    expect(picker._popup.matches(':popover-open')).toBe(true)
    expect(picker._popup.hasAttribute('data-vc-calendar-closing')).toBe(false)
    expect(picker._popup.inert).toBe(false)
    expect(hidden).not.toHaveBeenCalled()
  })

  it('keeps the page width and scrolling unchanged while the popup is open', async () => {
    const width = document.documentElement.clientWidth
    const overflow = getComputedStyle(document.body).overflowY
    await picker.show(button)
    const rect = picker._popup.getBoundingClientRect()
    expect(document.documentElement.clientWidth).toBe(width)
    expect(getComputedStyle(document.body).overflowY).toBe(overflow)
    expect(rect.left).toBeGreaterThanOrEqual(7)
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth - 7)
    expect(rect.top).toBeGreaterThanOrEqual(7)
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight - 7)
  })

  it('insets the calendar button without increasing the control height', () => {
    const wrapper = document.createElement('div')
    wrapper.className = 'form-control form-adorn'
    input.before(wrapper)
    input.className = 'form-ghost'
    button.className = 'btn-icon'
    button.innerHTML = '<svg width="16" height="16" aria-hidden="true"></svg>'
    wrapper.append(input, button)
    const reference = host.querySelector('#nextField')
    reference.className = 'form-control'
    const control = wrapper.getBoundingClientRect()
    const icon = button.getBoundingClientRect()
    const border = Number.parseFloat(getComputedStyle(wrapper).borderTopWidth)
    expect(control.height).toBe(reference.getBoundingClientRect().height)
    expect(icon.top - control.top).toBeGreaterThanOrEqual(border + 4)
    expect(control.bottom - icon.bottom).toBeGreaterThanOrEqual(border + 4)
    expect(control.right - icon.right).toBeGreaterThanOrEqual(border + 4)

    const radius = Number.parseFloat(getComputedStyle(wrapper).borderTopRightRadius)
    expect(Number.parseFloat(getComputedStyle(button).borderTopRightRadius)).toBe(Math.max(0, radius - border - 4))

    wrapper.dir = 'rtl'
    expect(button.getBoundingClientRect().left - wrapper.getBoundingClientRect().left).toBeGreaterThanOrEqual(border + 4)
  })

  it('closes on a second button click, including inside a form adorn', async () => {
    const wrapper = document.createElement('div')
    wrapper.className = 'form-control form-adorn'
    input.before(wrapper)
    wrapper.append(input, button)
    picker.dispose()
    picker = new Datepicker(input)
    await userEvent.click(button)
    await vi.waitFor(() => expect(picker._isShown).toBe(true))
    await userEvent.click(button)
    expect(picker._isShown).toBe(false)
  })

  it('keeps keyboard focus when showing is canceled', async () => {
    input.addEventListener('show.bs.datepicker', event => event.preventDefault(), { once: true })
    button.focus()
    await userEvent.keyboard('{Enter}')
    expect(picker._isShown).toBe(false)
    expect(document.activeElement).toBe(button)
  })

  it('keeps disabled input fields closed', async () => {
    input.disabled = true
    await userEvent.click(button)
    expect(picker._isShown).toBe(false)
  })

  it('restores ARIA and removes its button handlers on disposal', async () => {
    const application = vi.fn()
    button.addEventListener('click', application)
    picker.dispose()
    expect(button.getAttribute('aria-label')).toBe('Choose date')
    expect(button.hasAttribute('aria-controls')).toBe(false)
    expect(button.hasAttribute('aria-haspopup')).toBe(false)
    expect(button.hasAttribute('aria-expanded')).toBe(false)
    expect(input.hasAttribute('aria-controls')).toBe(false)
    expect(input.name).toBe('date')
    await userEvent.click(button)
    expect(application).toHaveBeenCalledOnce()
    expect(Datepicker.getInstance(input)).toBeNull()
  })

  it('continues to the next field from the last calendar control', async () => {
    await userEvent.click(button)
    const controls = [...picker._popup.querySelectorAll('button')].filter(element => element.tabIndex >= 0 && !element.disabled)
    controls.at(-1).focus()
    await userEvent.tab()
    expect(picker._isShown).toBe(false)
    expect(document.activeElement).toBe(host.querySelector('#nextField'))
  })
})
