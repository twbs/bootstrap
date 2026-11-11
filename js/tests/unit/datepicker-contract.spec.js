import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import css from '../../../scss/bootstrap.scss?inline'
import noEffects from '../fixtures/datepicker-no-effects.scss?inline'
import weights from '../fixtures/datepicker-weights.scss?inline'
import Datepicker from '../../src/datepicker.js'

describe('Datepicker rendered contract', () => {
  let host
  let style
  let pickers

  const calendar = picker => picker._calendar.context.mainElement
  const make = (config = {}, parent = host, tag = 'div') => {
    const element = document.createElement(tag)
    parent.append(element)
    const picker = new Datepicker(element, { inline: tag === 'div', ...config })
    pickers.push(picker)
    return picker
  }

  const range = { selectionMode: 'multiple-ranged', selectedDates: ['2026-06-10', '2026-06-18'] }
  const day = root => root.querySelector('[data-vc-date-selected] [data-vc-date-btn]')

  beforeEach(() => {
    style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
    host = document.createElement('div')
    document.body.append(host)
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

  it('PG372: uses the surrounding theme for selected dates', () => {
    host.className = 'theme-success'
    const root = calendar(make({ selectedDates: ['2026-06-10'] }))
    const button = document.createElement('button')
    button.className = 'btn-solid'
    host.append(button)
    expect(getComputedStyle(day(root)).backgroundColor).toBe(getComputedStyle(button).backgroundColor)
  })

  it('PG185: scales the calendar text with its font-size token', () => {
    const root = calendar(make())
    const cell = root.querySelector('[data-vc-date-btn]')
    const before = Number.parseFloat(getComputedStyle(cell).fontSize)
    root.style.setProperty('--datepicker-font-size', '2rem')
    expect(Number.parseFloat(getComputedStyle(cell).fontSize)).toBeGreaterThan(before)
  })

  it('PG186: reads configured font weights', () => {
    style.textContent = weights
    const root = calendar(make())
    expect(getComputedStyle(root.querySelector('[data-vc="month"]')).fontWeight).toBe('650')
    expect(getComputedStyle(root.querySelector('[data-vc-date]:not([data-vc-date-today]) [data-vc-date-btn]')).fontWeight).toBe('450')
  })

  it('PG181: inherits a dark wrapper without a theme attribute', () => {
    host.style.colorScheme = 'dark'
    const root = calendar(make())
    expect(getComputedStyle(root).colorScheme).toBe('dark')
  })

  it('PG181: follows a theme ancestor added after initialization', async () => {
    const root = calendar(make())
    host.setAttribute('data-bs-theme', 'dark')
    await vi.waitFor(() => expect(getComputedStyle(root).colorScheme).toBe('dark'))
  })

  it('PG174: removes day and range rounding when rounding is disabled', () => {
    style.textContent = noEffects
    const root = calendar(make(range))
    const radii = [...root.querySelectorAll('[data-vc-date-btn]')].map(element => getComputedStyle(element).borderRadius)
    expect(new Set(radii)).toEqual(new Set(['0px']))
  })

  it('PG173: removes the popup shadow when shadows are disabled', async () => {
    style.textContent = noEffects
    const picker = make({}, host, 'input')
    picker._element.click()
    await picker.show()
    await vi.waitFor(() => expect(calendar(picker)).not.toBe(picker._element))
    expect(getComputedStyle(calendar(picker)).boxShadow).toBe('none')
  })

  it('PG139: mirrors the arrows and selected range corners in RTL', () => {
    const left = calendar(make(range))
    const rtl = document.createElement('div')
    rtl.dir = 'rtl'
    host.append(rtl)
    const right = calendar(make(range, rtl))
    const rotation = (root, direction) => getComputedStyle(root.querySelector(`[data-vc-arrow="${direction}"]`), '::before').transform
    expect(rotation(right, 'prev')).toBe(rotation(left, 'next'))
    const first = right.querySelector('[data-vc-date-selected="first"] [data-vc-date-btn]')
    expect(getComputedStyle(first).borderTopLeftRadius).toBe('0px')
    expect(Number.parseFloat(getComputedStyle(first).borderTopRightRadius)).toBeGreaterThan(0)
  })

  // Resolve each paint layer before applying the button's group opacity. Text
  // and the button background are composited together, not faded twice.
  const contrast = element => {
    const context = document.createElement('canvas').getContext('2d')
    context.canvas.width = 1
    context.canvas.height = 1
    const color = value => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      return [...context.getImageData(0, 0, 1, 1).data]
    }

    const blend = (front, back, alpha = front[3] / 255) => front.slice(0, 3).map((value, i) => {
      const frontPart = value * alpha
      const backPart = back[i] * (1 - alpha)
      return frontPart + backPart
    })
    const ancestors = []
    for (let node = element.parentElement; node; node = node.parentElement) {
      ancestors.push(node)
    }

    let background = [255, 255, 255]
    for (const node of ancestors.toReversed()) {
      background = blend(color(getComputedStyle(node).backgroundColor), background)
    }

    const computed = getComputedStyle(element)
    const surface = blend(color(computed.backgroundColor), background)
    const foreground = blend(color(computed.color), surface)
    const opacity = Number(computed.opacity)
    const painted = [blend([...foreground, 255], background, opacity), blend([...surface, 255], background, opacity)]
    const luminance = channels => {
      let sum = 0
      for (const [i, value] of channels.entries()) {
        const unit = value / 255
        sum += [0.2126, 0.7152, 0.0722][i] * (unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4)
      }

      return sum
    }

    const values = painted.map(luminance).sort((a, b) => b - a)
    return (values[0] + 0.05) / (values[1] + 0.05)
  }

  for (const theme of ['light', 'dark']) {
    for (const [part, selector] of [
      ['outside-month', '[data-vc-date-month="prev"] [data-vc-date-btn], [data-vc-date-month="next"] [data-vc-date-btn]'],
      ['middle-range', '[data-vc-date-selected="middle"] [data-vc-date-btn]']
    ]) {
      it(`PG265/208: keeps enabled ${part} days readable in ${theme}`, () => {
        const root = calendar(make({ ...range, datepickerTheme: theme }))
        expect(contrast(root.querySelector(selector))).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('PG324: preserves the original node, value, and listeners on disposal', () => {
    const picker = make({}, host, 'input')
    const input = picker._element
    input.value = 'Application value'
    const listener = vi.fn()
    input.addEventListener('input', listener)
    picker.dispose()
    expect(input.isConnected).toBe(true)
    expect(input.value).toBe('Application value')
    input.dispatchEvent(new Event('input'))
    expect(listener).toHaveBeenCalledOnce()
  })

  it('PG155: emits hide events on Escape and show events on a later click', async () => {
    const picker = make({}, host, 'input')
    const input = picker._element
    input.dataset.bsToggle = 'datepicker'
    const events = []
    for (const event of ['show', 'shown', 'hide', 'hidden']) {
      input.addEventListener(`${event}.bs.datepicker`, () => events.push(event))
    }

    await userEvent.click(input)
    await vi.waitFor(() => expect(calendar(picker).matches('[data-vc="calendar"]')).toBe(true))
    await userEvent.keyboard('{Escape}')
    await userEvent.click(input)
    expect(events).toEqual(['show', 'shown', 'hide', 'hidden', 'show', 'shown'])
  })

  it('PG356: continues to the field after the popup on Tab', async () => {
    const picker = make({}, host, 'input')
    const input = picker._element
    input.dataset.bsToggle = 'datepicker'
    const next = document.createElement('input')
    next.setAttribute('aria-label', 'After date')
    host.append(next)
    await userEvent.click(input)
    await vi.waitFor(() => expect(calendar(picker).matches('[data-vc="calendar"]')).toBe(true))
    for (let press = 0; press < 8 && document.activeElement !== next; press++) {
      // Each Tab depends on the previous focus move.
      // eslint-disable-next-line no-await-in-loop
      await userEvent.tab()
    }

    expect(document.activeElement).toBe(next)
    expect(picker._isShown).toBe(false)
  })
})
