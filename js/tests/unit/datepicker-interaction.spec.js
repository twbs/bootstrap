import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import css from '../../../scss/bootstrap.scss?inline'
import Datepicker from '../../src/datepicker.js'
import Dialog from '../../src/dialog.js'

describe('Datepicker browser interactions', () => {
  let host
  let style
  let pickers
  const make = (html = '<input name="date" value="2026-10-05">', config = {}) => {
    host.innerHTML = html
    const input = host.querySelector('input:not([type="hidden"])')
    const picker = new Datepicker(input, { locale: 'en-GB', ...config })
    pickers.push(picker)
    return {
      input, picker, form: host.querySelector('form'), popup: picker._calendar.context.mainElement
    }
  }

  const formHtml = '<form><input name="date" value="2026-10-05"><input name="date" value="other"><button type="reset">Reset</button></form>'

  beforeEach(() => {
    host = document.createElement('div')
    document.body.append(host)
    style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
    pickers = []
  })

  afterEach(() => {
    for (const picker of pickers) {
      if (picker._element) {
        picker.dispose()
      }
    }

    host.remove()
    style.remove()
  })

  it('submits ISO dates with duplicate names before and after focus', async () => {
    const { picker, input, form } = make(formHtml)
    expect(input.value).toBe('05/10/2026')
    expect(new FormData(form).getAll('date')).toEqual(['2026-10-05', 'other'])
    await picker.show()
    expect(new FormData(form).getAll('date')).toEqual(['2026-10-05', 'other'])
    picker.setSelectedDates(['2026-12-06'])
    expect(input.value).toBe('06/12/2026')
    expect(new FormData(form).getAll('date')).toEqual(['2026-12-06', 'other'])
  })

  it('serializes before existing application formdata listeners', () => {
    host.innerHTML = formHtml
    const form = host.querySelector('form')
    let observed
    form.addEventListener('formdata', event => {
      observed = [...event.formData]
    })
    const picker = new Datepicker(host.querySelector('input'), { locale: 'en-GB' })
    pickers.push(picker)
    expect(new FormData(form).get('date')).toBe('2026-10-05')
    expect(observed).toEqual([['date', '2026-10-05'], ['date', 'other']])
  })

  it('omits disabled inputs immediately and after enabling', () => {
    const { input, form } = make(formHtml)
    input.disabled = true
    expect(new FormData(form).getAll('date')).toEqual(['other'])
    input.disabled = false
    expect(new FormData(form).getAll('date')).toEqual(['2026-10-05', 'other'])
  })

  it('uses native disabled fieldset and external form rules', () => {
    const { form, input } = make('<form id="date-form"></form><fieldset disabled><input name="date" form="date-form" value="2026-10-05"></fieldset>')
    expect(new FormData(form).has('date')).toBe(false)
    input.closest('fieldset').disabled = false
    expect(new FormData(form).get('date')).toBe('2026-10-05')
  })

  it('resets selection and submission through a native reset button', async () => {
    const { picker, input, form } = make(formHtml)
    picker.setSelectedDates(['2026-12-06'])
    await userEvent.click(form.querySelector('button'))
    await vi.waitFor(() => expect(picker.getSelectedDates()).toEqual(['2026-10-05']))
    expect(input.value).toBe('05/10/2026')
    expect(new FormData(form).getAll('date')).toEqual(['2026-10-05', 'other'])
  })

  it('honors a canceled reset', async () => {
    const { picker, form } = make(formHtml)
    picker.setSelectedDates(['2026-12-06'])
    form.addEventListener('reset', event => event.preventDefault())
    await userEvent.click(form.querySelector('button'))
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })
    expect(picker.getSelectedDates()).toEqual(['2026-12-06'])
  })

  it('supports ISO and its own numeric output, and clears invalid manual dates', () => {
    const { picker, input, form } = make(formHtml)
    for (const [value, expected] of [['06/12/2026', '2026-12-06'], ['2026-06-12', '2026-06-12'], ['2026-02-31', ''], ['', '']]) {
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
      expect(picker.getSelectedDates()).toEqual(expected ? [expected] : [])
      expect(new FormData(form).getAll('date')).toEqual([expected, 'other'])
      expect(input.value).toBe(value)
    }
  })

  it('does not normalize an impossible date through the public setter', () => {
    const { picker } = make()
    expect(() => picker.setSelectedDates(['2026-02-31'])).toThrow(TypeError)
    expect(picker.getSelectedDates()).toEqual(['2026-10-05'])
  })

  it('preserves ordered date entries alongside file fields', () => {
    const { picker, form } = make('<form><input name="date" value="2026-10-05"><input name="upload" type="file"><input name="date" value="tail"></form>')
    const file = new File(['contents'], 'date.txt', { type: 'text/plain' })
    const transfer = new DataTransfer()
    transfer.items.add(file)
    form.querySelector('[type="file"]').files = transfer.files
    const values = [...new FormData(form)]
    expect(values.map(([name]) => name)).toEqual(['date', 'upload', 'date'])
    expect(values[1][1].name).toBe('date.txt')
    expect(values[0][1]).toBe(picker.getSelectedDates()[0])
  })

  it('submits multiple and range selections as ISO lists', () => {
    const { picker, form } = make('<form><input name="date"></form>', { selectionMode: 'multiple' })
    picker.setSelectedDates(['2026-06-10', '2026-06-18'])
    expect(new FormData(form).get('date')).toBe(picker.getSelectedDates().join(','))
  })

  it('keeps formatter HTML as literal text', () => {
    const { input } = make(undefined, { dateFormat: () => '<b>date</b>' })
    expect(input.value).toBe('<b>date</b>')
    expect(host.querySelector('b')).toBeNull()
  })

  it('keeps the submitted name and live node after disposal', () => {
    const { picker, input, form } = make(formHtml)
    picker.dispose()
    expect(document.querySelector('[data-vc="calendar"]')).toBeNull()
    expect(host.querySelector('input')).toBe(input)
    expect(input.name).toBe('date')
    expect(form.querySelector('input[type="hidden"]')).toBeNull()
    expect(new FormData(form).getAll('date')).toEqual([input.value, 'other'])
  })

  it('preserves an authored inline hidden input and wrapper content', () => {
    host.innerHTML = '<div><span>Calendar label</span><input type="hidden" name="date"></div>'
    const wrapper = host.firstElementChild
    const hidden = wrapper.querySelector('input')
    const picker = new Datepicker(wrapper, { inline: true, selectedDates: ['2026-06-10'] })
    pickers.push(picker)
    expect(hidden.value).toBe('2026-06-10')
    picker.dispose()
    expect(wrapper.querySelector('input')).toBe(hidden)
    expect(wrapper.querySelector('span').textContent).toBe('Calendar label')
  })

  it('restores an inline form selection after native reset', async () => {
    host.innerHTML = '<form><div><input type="hidden" name="date"></div><button type="reset">Reset</button></form>'
    const picker = new Datepicker(host.querySelector('div'), { inline: true, selectedDates: ['2026-06-10'] })
    pickers.push(picker)
    picker.setSelectedDates(['2026-06-18'])
    await userEvent.click(host.querySelector('button[type="reset"]'))
    await vi.waitFor(() => expect(picker.getSelectedDates()).toEqual(['2026-06-10']))
    expect(new FormData(host.querySelector('form')).get('date')).toBe('2026-06-10')
  })

  it('opens a prefilled field on first keyboard focus with a visible calendar', async () => {
    const { input, picker, popup } = make('<input data-bs-toggle="datepicker" value="2026-10-05"><button>Next</button>')
    await userEvent.tab()
    expect(document.activeElement).toBe(input)
    await vi.waitFor(() => expect(picker._isShown).toBe(true))
    expect(popup.getBoundingClientRect().width).toBeGreaterThan(0)
    expect(popup.querySelector('[data-vc-date="2026-10-05"]')).not.toBeNull()
    await userEvent.tab()
    expect(popup.contains(document.activeElement)).toBe(true)
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(input)
    expect(picker._isShown).toBe(false)
  })

  it('opens a programmatically initialized input on keyboard focus without a data toggle', async () => {
    const { picker, input } = make('<input value="2026-10-05">')
    await userEvent.tab()
    expect(document.activeElement).toBe(input)
    await vi.waitFor(() => expect(picker._isShown).toBe(true))
  })

  it('keeps keyboard, dismissal, and inherited themes working inside an open shadow root', async () => {
    host.innerHTML = '<input aria-label="Outside"><div></div>'
    const root = host.querySelector('div').attachShadow({ mode: 'open' })
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    root.adoptedStyleSheets = [sheet]
    root.innerHTML = '<input aria-label="Date" value="2026-10-05"><input aria-label="Next">'
    const input = root.querySelector('input')
    const picker = new Datepicker(input)
    pickers.push(picker)
    const popup = picker._calendar.context.mainElement
    await userEvent.click(input)
    expect(picker._isShown).toBe(true)
    expect(popup.getRootNode()).toBe(root)
    await userEvent.tab()
    expect(popup.contains(root.activeElement)).toBe(true)
    await userEvent.keyboard('{Escape}')
    expect(picker._isShown).toBe(false)
    expect(root.activeElement).toBe(input)
    await userEvent.click(input)
    host.querySelector('div').style.colorScheme = 'dark'
    await vi.waitFor(() => expect(getComputedStyle(popup).colorScheme).toBe('dark'))
    await userEvent.click(host.querySelector('input'))
    expect(picker._isShown).toBe(false)
  })

  it('keeps wrapper direction and theme when mounted outside the wrapper', async () => {
    const { picker, popup } = make('<div dir="rtl" class="theme-success"><input value="2026-10-05"></div>')
    await picker.show()
    expect(popup.dir).toBe('rtl')
    expect(popup.style.getPropertyValue('--theme-bg')).not.toBe('')
    host.querySelector('[dir]').dir = 'ltr'
    await vi.waitFor(() => expect(popup.dir).toBe('ltr'))
  })

  it('keeps adorn clicks inside the popup interaction boundary', async () => {
    const { picker, input } = make('<button>Outside</button><div class="form-adorn"><span>Calendar icon</span><input></div>')
    const hidden = vi.fn()
    input.addEventListener('hidden.bs.datepicker', hidden)
    await userEvent.click(input)
    await userEvent.click(host.querySelector('span'))
    expect(picker._isShown).toBe(true)
    expect(hidden).not.toHaveBeenCalled()
    await userEvent.click(host.querySelector('button'))
    expect(picker._isShown).toBe(false)
    expect(hidden).toHaveBeenCalledOnce()
  })

  it('keeps a closed popup out of keyboard navigation', () => {
    const { popup } = make()
    expect(popup.inert).toBe(true)
    expect(getComputedStyle(popup).display).toBe('none')
  })

  it('honors show/hide cancellation and ignores recursive lifecycle calls', async () => {
    const { picker, input } = make()
    const cancel = event => event.preventDefault()
    input.addEventListener('show.bs.datepicker', cancel)
    await picker.show()
    expect(picker._isShown).toBe(false)
    input.removeEventListener('show.bs.datepicker', cancel)
    input.addEventListener('show.bs.datepicker', () => picker.show())
    await picker.show()
    input.addEventListener('hide.bs.datepicker', cancel)
    await picker.hide()
    expect(picker._isShown).toBe(true)
    input.removeEventListener('hide.bs.datepicker', cancel)
    input.addEventListener('hide.bs.datepicker', () => picker.hide())
    await picker.hide()
    expect(picker._isShown).toBe(false)
  })

  it('does not emit shown after an interrupted show', async () => {
    const { picker, input } = make()
    const shown = vi.fn()
    input.addEventListener('shown.bs.datepicker', shown)
    const opening = picker.show()
    await picker.hide()
    await opening
    expect(shown).not.toHaveBeenCalled()
  })

  it('cancels selection timers and handles disposal in a change callback', async () => {
    const { picker, input } = make()
    await picker.show()
    picker._handleDateClick(picker._calendar, new MouseEvent('click'))
    expect(picker._hideTimeout).not.toBeNull()
    input.addEventListener('change.bs.datepicker', () => picker.dispose())
    picker._handleDateClick(picker._calendar, new MouseEvent('click'))
    await new Promise(resolve => {
      setTimeout(resolve, 150)
    })
    expect(input.isConnected).toBe(true)
    expect(Datepicker.getInstance(input)).toBeNull()
  })

  it('restores application ARIA attributes after disposal', () => {
    const { picker, input } = make('<input aria-haspopup="grid" aria-expanded="false">')
    picker.dispose()
    expect(input.getAttribute('aria-haspopup')).toBe('grid')
    expect(input.getAttribute('aria-expanded')).toBe('false')
  })

  for (const placement of ['left', 'right']) {
    it(`preserves physical ${placement} alignment in an RTL wrapper`, async () => {
      host.style.cssText = 'position:absolute;left:24px;top:80px;width:280px'
      const { picker, input, popup } = make('<div dir="rtl"><input value="2026-10-05" style="width:200px"></div>', { placement })
      await picker.show()
      expect(Math.abs(popup.getBoundingClientRect()[placement] - input.getBoundingClientRect()[placement])).toBeLessThan(2)
    })
  }

  it('tracks a scrolling anchor without clipping the popup', async () => {
    const { picker, input, popup } = make('<div style="height:160px;overflow:auto"><div style="height:500px"><input style="margin-top:80px" value="2026-10-05"></div></div>')
    await picker.show()
    const before = popup.getBoundingClientRect().top
    input.parentElement.parentElement.scrollTop = 40
    await vi.waitFor(() => expect(popup.getBoundingClientRect().top).not.toBe(before))
    expect(Math.abs(popup.getBoundingClientRect().top - input.getBoundingClientRect().bottom - 4)).toBeLessThan(2)
  })

  it('closes on a native dialog close and can reopen after it', async () => {
    const { picker, popup } = make('<dialog><input value="2026-10-05"></dialog>')
    const dialog = host.querySelector('dialog')
    dialog.showModal()
    await picker.show()
    dialog.close()
    await vi.waitFor(() => expect(picker._isShown).toBe(false))
    expect(popup.inert).toBe(true)
    dialog.showModal()
    await picker.show()
    expect(popup.matches(':popover-open')).toBe(true)
    dialog.close()
  })

  it('closes only the popup on Escape inside a non-modal dialog', async () => {
    const { picker, input } = make('<dialog><input value="2026-10-05"></dialog>')
    const element = host.querySelector('dialog')
    const dialog = new Dialog(element, { modal: false })
    await dialog.show()
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    expect(picker._isShown).toBe(false)
    expect(element.open).toBe(true)
    await dialog.hide()
    dialog.dispose()
  })

  it('keeps the popup above a clipped modal and closes it with the dialog', async () => {
    const { picker, popup } = make('<dialog style="overflow:hidden;width:360px;height:160px"><input data-bs-toggle="datepicker" value="2026-10-05"></dialog>')
    const element = host.querySelector('dialog')
    const dialog = new Dialog(element)
    await dialog.show()
    await picker.show()
    const rect = popup.getBoundingClientRect()
    expect(popup.closest('dialog')).toBe(element)
    expect(rect.width).toBeLessThan(360)
    expect(rect.width).toBeGreaterThan(200)
    const x = rect.left + (rect.width / 2)
    const y = rect.top + (rect.height / 2)
    expect(popup.contains(document.elementFromPoint(x, y))).toBe(true)
    await dialog.hide()
    expect(picker._isShown).toBe(false)
    expect(popup.inert).toBe(true)
    dialog.dispose()
  })
})
