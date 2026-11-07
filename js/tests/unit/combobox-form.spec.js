import Combobox from '../../src/combobox.js'
import Menu from '../../src/menu.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Combobox form contract', () => {
  let fixture
  let instances

  const tick = () => new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
  const make = (config = {}, { form, input, selected = [], values = ['a,b', 'c', 'd'] } = {}) => {
    form ??= document.createElement('form')
    if (!form.parentNode) {
      fixture.append(form)
    }

    if (input) {
      form.append(input)
    }

    const toggle = document.createElement('button')
    toggle.type = 'button'
    toggle.className = 'form-control combobox-toggle'
    toggle.innerHTML = '<span class="combobox-value"></span>'
    form.append(toggle)
    const menu = document.createElement('div')
    menu.className = 'menu'
    menu.innerHTML = '<input class="combobox-search-input" aria-label="Search">'
    const items = values.map((value, index) => {
      const item = document.createElement('button')
      item.type = 'button'
      item.className = `menu-item${selected.includes(index) ? ' selected' : ''}`
      item.dataset.bsValue = value
      item.textContent = `Option ${index}`
      menu.append(item)
      return item
    })
    form.append(menu)
    const instance = new Combobox(toggle, { name: 'choices', ...config, ...(input ? { input } : {}) })
    instances.push(instance)
    return {
      form, toggle, menu, items, instance, search: menu.querySelector('input')
    }
  }

  const field = () => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.id = 'provided'
    input.name = 'provided-name'
    input.dataset.validation = 'preserve'
    return input
  }

  const values = form => new FormData(form).getAll('choices')

  beforeEach(() => {
    fixture = getFixture()
    instances = []
  })

  afterEach(() => {
    for (const instance of instances) {
      if (instance._element) {
        instance.dispose()
      }
    }

    document.documentElement.removeAttribute('dir')
    clearFixture()
  })

  it('should submit repeated values in menu order and preserve commas', () => {
    const x = make({ multiple: true })
    x.items[1].click()
    x.items[0].click()
    expect(values(x.form)).toEqual(['a,b', 'c'])
    expect(new URLSearchParams(new FormData(x.form)).toString()).toEqual('choices=a%2Cb&choices=c')
  })

  it('should preserve its event field across empty multiple selections', () => {
    const x = make({ multiple: true })
    const input = x.form.querySelector('input[type="hidden"]')
    const events = []
    x.form.addEventListener('change', event => events.push([event.target, values(x.form)]))
    expect(values(x.form)).toEqual([])
    x.items[0].click()
    x.items[0].click()
    x.items[2].click()
    expect(events).toEqual([[input, ['a,b']], [input, []], [input, ['d']]])
    expect(input.isConnected).toBeTrue()
  })

  it('should support empty and repeated option values without conflating selection identity', () => {
    const x = make({}, { values: ['', 'same', 'same'] })
    const events = []
    x.form.addEventListener('change', event => events.push(event.target.value))
    x.items[1].click()
    x.items[2].click()
    x.items[2].click()
    x.items[0].click()
    expect(events).toEqual(['same', 'same', ''])
    expect(values(x.form)).toEqual([''])
  })

  it('should update fields before input, change, and the component event', () => {
    const x = make()
    const events = []
    for (const type of ['input', 'change', 'change.bs.combobox']) {
      x.form.addEventListener(type, event => events.push([type, values(x.form), event.value]))
    }

    x.items[1].click()
    expect(events).toEqual([['input', ['c'], undefined], ['change', ['c'], undefined], ['change.bs.combobox', ['c'], 'c']])
  })

  it('should announce unnamed selections from the toggle without creating a form field', () => {
    const x = make({ name: null })
    const targets = []
    x.form.addEventListener('change', event => targets.push(event.target))
    x.items[1].click()
    expect(targets).toEqual([x.toggle])
    expect(x.form.querySelector('input[type="hidden"]')).toBeNull()
  })

  it('should not emit changes during initialization, updates, or reset', async () => {
    const form = document.createElement('form')
    fixture.append(form)
    const events = []
    form.addEventListener('change', event => events.push(event.type))
    const x = make({}, { form, selected: [0] })
    x.instance.update()
    form.reset()
    await tick()
    expect(events).toEqual([])
  })

  it('should retain a provided field and its attributes when disposed', () => {
    const input = field()
    const x = make({}, { input })
    x.items[1].click()
    x.instance.dispose()
    expect(input.isConnected).toBeTrue()
    expect(input.id).toEqual('provided')
    expect(input.dataset.validation).toEqual('preserve')
    expect(new FormData(x.form).getAll('provided-name')).toEqual(['c'])
    expect(values(x.form)).toEqual([])
  })

  it('should preserve a provided field while removing only generated multiple fields', () => {
    const input = field()
    const x = make({ multiple: true }, { input })
    x.items[0].click()
    x.items[1].click()
    expect(new FormData(x.form).getAll('provided-name')).toEqual(['a,b', 'c'])
    x.instance.dispose()
    expect(x.form.querySelectorAll('input[type="hidden"]').length).toEqual(1)
    expect(input.disabled).toBeFalse()
    expect(input.value).toEqual('a,b')
  })

  it('should preserve caller-disabled fields, including changes made before disposal', () => {
    const input = field()
    const x = make({ multiple: true }, { input })
    input.disabled = true
    x.instance.dispose()
    expect(input.disabled).toBeTrue()
  })

  it('should resolve an explicit input selector and reject an invalid field', () => {
    const input = field()
    fixture.append(input)
    const x = make({ input: '#provided' })
    expect(x.instance._hiddenInput).toBe(input)
    expect(() => new Combobox(x.toggle, { input: '.combobox-value' })).toThrowError(TypeError)
  })

  it('should isolate widgets that share a field name', () => {
    const first = make({ multiple: true })
    const second = make({ multiple: true }, { form: first.form })
    first.items[0].click()
    second.items[2].click()
    first.instance.dispose()
    expect(values(second.form)).toEqual(['d'])
  })

  it('should omit disabled controls and restore them after reenabling', async () => {
    const x = make({ multiple: true })
    x.items[0].click()
    x.items[1].click()
    x.toggle.disabled = true
    await tick()
    expect(values(x.form)).toEqual([])
    x.toggle.disabled = false
    await tick()
    expect(values(x.form)).toEqual(['a,b', 'c'])
    x.items[2].disabled = true
    x.items[2].classList.add('selected')
    x.instance.update()
    expect(values(x.form)).toEqual(['a,b', 'c'])
  })

  it('should reconcile synchronous changes before FormData when update is called', () => {
    const x = make()
    x.items[1].click()
    x.toggle.disabled = true
    x.instance.update()
    expect(values(x.form)).toEqual([])
  })

  it('should reconcile before an immediate native submit', () => {
    const x = make()
    x.items[1].click()
    x.toggle.disabled = true
    let submitted
    x.form.addEventListener('submit', event => {
      event.preventDefault()
      submitted = values(x.form)
    })
    x.form.requestSubmit()
    expect(submitted).toEqual([])
  })

  it('should follow a disabled fieldset when the provided input is outside it', async () => {
    const input = field()
    const x = make({}, { input })
    const fieldset = document.createElement('fieldset')
    x.form.append(fieldset)
    fieldset.append(x.toggle, x.menu)
    x.instance.update()
    x.items[1].click()
    fieldset.disabled = true
    await tick()
    expect(new FormData(x.form).getAll(input.name)).toEqual([])
    fieldset.disabled = false
    await tick()
    expect(new FormData(x.form).getAll(input.name)).toEqual(['c'])
  })

  it('should keep a control inside the first legend enabled', async () => {
    const x = make()
    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    x.form.append(fieldset)
    fieldset.append(legend)
    legend.append(x.toggle, x.menu)
    x.instance.update()
    fieldset.disabled = true
    await tick()
    x.items[1].click()
    expect(values(x.form)).toEqual(['c'])
  })

  it('should ignore selected decoration that is not an option', () => {
    const x = make()
    const decoration = document.createElement('span')
    decoration.className = 'selected'
    x.menu.append(decoration)
    x.instance.update()
    expect(values(x.form)).toEqual([''])
    expect(x.toggle.textContent).toEqual('')
  })

  it('should follow an external form owner', () => {
    const x = make({ multiple: true })
    x.form.id = 'external-combobox-form'
    fixture.append(x.toggle, x.menu)
    x.toggle.setAttribute('form', x.form.id)
    x.items[0].click()
    x.items[1].click()
    expect(values(x.form)).toEqual(['a,b', 'c'])
    x.form.reset()
  })

  it('should restore initial selection on reset and honor cancellation', async () => {
    const x = make({ multiple: true }, { selected: [0, 2] })
    x.items[0].click()
    x.items[1].click()
    x.form.addEventListener('reset', event => event.preventDefault(), { once: true })
    x.form.reset()
    await tick()
    expect(values(x.form)).toEqual(['c', 'd'])
    x.form.reset()
    await tick()
    expect(values(x.form)).toEqual(['a,b', 'd'])
  })

  it('should ignore a queued reset after the component changes form owner', async () => {
    const x = make()
    x.items[1].click()
    x.form.reset()
    const otherForm = document.createElement('form')
    fixture.append(otherForm)
    otherForm.append(x.toggle, x.menu)
    x.instance.update()
    await tick()
    expect(values(otherForm)).toEqual(['c'])
  })

  it('should clear the displayed value after the last deselection without a placeholder', () => {
    const x = make({ multiple: true })
    x.items[1].click()
    x.items[1].click()
    expect(x.toggle.textContent).toEqual('')
  })

  it('should stop notifications safely when an input listener disposes the component', () => {
    const x = make()
    const events = []
    x.form.addEventListener('input', () => {
      events.push('input')
      x.instance.dispose()
    })
    x.form.addEventListener('change', () => events.push('change'))
    expect(() => x.items[1].click()).not.toThrow()
    expect(events).toEqual(['input'])
  })

  it('should honor a nested selection without announcing stale outer state', () => {
    const x = make()
    const customValues = []
    x.form.addEventListener('input', () => x.items[2].click(), { once: true })
    x.toggle.addEventListener('change.bs.combobox', event => customValues.push(event.value))
    x.items[1].click()
    expect(values(x.form)).toEqual(['d'])
    expect(customValues).toEqual(['d'])
  })

  it('should forward Menu cancellation and completion after the real transition', async () => {
    const x = make()
    x.menu.style.transitionDuration = '.03s'
    const events = []
    x.toggle.addEventListener('shown.bs.combobox', () => events.push('shown'))
    const showing = x.instance.show()
    expect(events).toEqual([])
    await showing
    expect(events).toEqual(['shown'])
    x.toggle.addEventListener('hide.bs.combobox', event => event.preventDefault(), { once: true })
    await Menu.getInstance(x.toggle).hide()
    expect(x.menu).toHaveClass('show')
    await x.instance.hide()
    expect(x.menu).not.toHaveClass('show')
  })

  it('should not move focus after disposal during the opening transition', async () => {
    const x = make()
    x.menu.style.transitionDuration = '.03s'
    const showing = x.instance.show()
    expect(document.activeElement).toBe(x.search)
    x.instance.dispose()
    x.toggle.focus()
    await showing
    expect(document.activeElement).toBe(x.toggle)
  })

  it('should permit Home and End text editing in RTL while retaining option navigation', async () => {
    document.documentElement.dir = 'rtl'
    const x = make()
    await x.instance.show()
    x.search.focus()
    for (const key of ['Home', 'End']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      x.search.dispatchEvent(event)
      expect(event.defaultPrevented).toBeFalse()
      expect(document.activeElement).toBe(x.search)
    }

    x.items[1].focus()
    x.items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(x.items[2])
  })
})
