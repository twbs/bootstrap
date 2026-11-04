import Combobox from '../../src/combobox.js'
import Menu from '../../src/menu.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Combobox editor', () => {
  let fixture
  let instance
  const key = (target, value, options = {}) => {
    const event = new KeyboardEvent('keydown', {
      key: value, bubbles: true, cancelable: true, ...options
    })
    target.dispatchEvent(event)
    return event
  }

  const make = (config = {}, { selected = [], values = ['design', 'art,music', 'science'] } = {}) => {
    fixture.innerHTML = `<form><label for="editor">Interests</label>
      <div class="combobox-control" data-bs-toggle="combobox">
        <input id="editor" class="form-ghost combobox-input">
      </div><div class="menu"></div></form>`
    const root = fixture.querySelector('.combobox-control')
    const input = root.querySelector('input')
    const menu = fixture.querySelector('.menu')
    const items = values.map((value, index) => {
      const item = document.createElement('button')
      item.type = 'button'
      item.className = `menu-item${selected.includes(index) ? ' selected' : ''}`
      item.dataset.bsValue = value
      item.textContent = `Label ${index}`
      menu.append(item)
      return item
    })
    instance = new Combobox(root, { name: 'interests', multiple: true, ...config })
    return {
      root, input, menu, items, form: fixture.querySelector('form')
    }
  }

  const type = (input, value) => {
    input.value = value
    input.dispatchEvent(new InputEvent('input', { bubbles: true }))
  }

  const values = form => new FormData(form).getAll('interests')

  beforeEach(() => {
    fixture = getFixture()
  })
  afterEach(() => {
    instance?.dispose()
    instance = null
    document.documentElement.dir = ''
    clearFixture()
  })

  it('should keep input focus while navigating suggestions without committing', async () => {
    const x = make()
    x.input.focus()
    key(x.input, 'ArrowDown')
    await instance.show()
    expect(document.activeElement).toBe(x.input)
    expect(x.input.getAttribute('aria-activedescendant')).toEqual(x.items[0].id)
    expect(values(x.form)).toEqual([])
    key(x.input, 'Enter')
    expect(values(x.form)).toEqual(['design'])
    expect(x.input.value).toEqual('')
    expect(x.root.querySelector('.chip').textContent).toContain('Label 0')
    expect(document.activeElement).toBe(x.input)
  })

  it('should filter from the visible editor and retain query through Menu transitions', async () => {
    const x = make()
    type(x.input, 'Label 1')
    await instance.show()
    await new Promise(resolve => {
      requestAnimationFrame(resolve)
    })
    expect(x.input.value).toEqual('Label 1')
    expect(x.items[0].style.display).toEqual('none')
    expect(x.items[1].style.display).toEqual('')
  })

  it('should remove a chip by option identity with duplicate submitted values', () => {
    const x = make({}, { values: ['same', 'same'], selected: [0, 1] })
    x.root.querySelectorAll('.chip-dismiss')[1].click()
    expect(values(x.form)).toEqual(['same'])
    expect(x.items[0]).toHaveClass('selected')
    expect(x.items[1]).not.toHaveClass('selected')
  })

  it('should keep existing chips stable while filtering or adding another value', () => {
    const x = make({}, { selected: [0] })
    const chip = x.root.querySelector('.chip')
    type(x.input, 'Label')
    expect(x.root.querySelector('.chip')).toBe(chip)
    instance.add('science')
    expect(x.root.querySelector('.chip')).toBe(chip)
    expect(values(x.form)).toEqual(['design', 'science'])
  })

  it('should expose labelled removal buttons and commit one change through native fields', () => {
    const x = make({}, { selected: [0] })
    const events = []
    for (const name of ['input', 'change', 'change.bs.combobox']) {
      x.form.addEventListener(name, () => events.push([name, values(x.form)]))
    }

    const button = x.root.querySelector('.chip-dismiss')
    expect(button.getAttribute('aria-label')).toEqual('Remove Label 0')
    button.click()
    expect(events).toEqual([['input', []], ['change', []], ['change.bs.combobox', []]])
    expect(document.activeElement).toBe(x.input)
  })

  it('should leave ordinary input editing and composition keys alone', () => {
    const x = make({ allowCustom: true })
    for (const options of [{ isComposing: true }, { keyCode: 229 }]) {
      x.input.value = '東京'
      expect(key(x.input, 'Enter', options).defaultPrevented).toBeFalse()
      expect(instance.getValues()).toEqual([])
      expect(x.input.value).toEqual('東京')
    }

    for (const value of ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete']) {
      expect(key(x.input, value).defaultPrevented).toBeFalse()
    }
  })

  it('should create custom values only when explicitly allowed', () => {
    const x = make()
    type(x.input, 'Custom')
    key(x.input, 'Enter')
    expect(values(x.form)).toEqual([])
    expect(instance.add('Custom')).toBeNull()
  })

  it('should submit custom values and preserve commas when no separator is configured', () => {
    const x = make({ allowCustom: true })
    type(x.input, 'Art, music')
    key(x.input, 'Enter')
    expect(values(x.form)).toEqual(['Art, music'])
    expect(x.input.value).toEqual('')
    expect(x.root.querySelector('.chip').textContent).toContain('Art, music')
    expect(instance.add('Art, music')).toBeNull()
    expect(instance.add('   ')).toBeNull()
  })

  it('should split custom text only with an explicit separator', () => {
    const x = make({ allowCustom: true, separator: ';' })
    type(x.input, 'alpha;beta;gamma')
    expect(values(x.form)).toEqual(['alpha', 'beta'])
    expect(x.input.value).toEqual('gamma')
  })

  it('should enforce maxItems for custom and predefined options', () => {
    const x = make({ allowCustom: true, maxItems: 1 })
    instance.add('design')
    expect(instance.add('custom')).toBeNull()
    x.items[1].click()
    expect(values(x.form)).toEqual(['design'])
  })

  it('should preserve disabled option selections and reject their removal', () => {
    const x = make({}, { selected: [0] })
    x.items[0].disabled = true
    instance.update()
    expect(x.root.querySelector('.chip-dismiss').disabled).toBeTrue()
    expect(instance.remove('design')).toBeFalse()
    instance.clear()
    expect(instance.getValues()).toEqual(['design'])
    expect(values(x.form)).toEqual([])
  })

  it('should focus a chip before removing it with Backspace', () => {
    const x = make({}, { selected: [0, 1] })
    x.input.focus()
    key(x.input, 'Backspace')
    const chip = x.root.querySelectorAll('.chip')[1]
    expect(document.activeElement).toBe(chip)
    expect(values(x.form)).toEqual(['design', 'art,music'])
    key(chip, 'Backspace')
    expect(values(x.form)).toEqual(['design'])
    expect(document.activeElement).toBe(x.root.querySelector('.chip'))
  })

  it('should navigate chips in RTL without changing input text editing', () => {
    document.documentElement.dir = 'rtl'
    const x = make({}, { selected: [0, 1] })
    x.input.focus()
    key(x.input, 'ArrowRight')
    expect(document.activeElement).toBe(x.root.querySelectorAll('.chip')[1])
    key(document.activeElement, 'ArrowRight')
    expect(document.activeElement).toBe(x.root.querySelector('.chip'))
    key(document.activeElement, 'End')
    expect(document.activeElement).toBe(x.input)
  })

  it('should clear active-descendant state when dismissed outside', async () => {
    const x = make()
    key(x.input, 'ArrowDown')
    await instance.show()
    await Menu.getInstance(x.input).hide()
    expect(x.input.hasAttribute('aria-activedescendant')).toBeFalse()
  })

  it('should restore initial chips and fields on reset without selection events', async () => {
    const x = make({}, { selected: [0] })
    instance.add('science')
    const changed = jasmine.createSpy('changed')
    x.root.addEventListener('change.bs.combobox', changed)
    x.form.reset()
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })
    expect(values(x.form)).toEqual(['design'])
    expect(x.root.querySelectorAll('.chip').length).toEqual(1)
    expect(changed).not.toHaveBeenCalled()
  })

  it('should clear a stale single value when its visible label is edited', () => {
    const x = make({ multiple: false }, { selected: [0] })
    expect(x.input.value).toEqual('Label 0')
    type(x.input, 'other')
    expect(values(x.form)).toEqual([''])
    expect(x.input.value).toEqual('other')
    instance.add('science')
    expect(x.input.value).toEqual('Label 2')
    expect(values(x.form)).toEqual(['science'])
  })

  it('should restore editor attributes and dispose its owned Menu', () => {
    const x = make()
    instance.add('design')
    instance.dispose()
    instance = null
    expect(x.root.querySelector('.chip')).toBeNull()
    expect(x.input.hasAttribute('role')).toBeFalse()
    expect(x.input.hasAttribute('aria-controls')).toBeFalse()
    expect(Menu.getInstance(x.input)).toBeNull()
    expect(x.menu.hasAttribute('role')).toBeFalse()
  })

  it('should generate and remove a popup for a standalone free-entry field', () => {
    fixture.innerHTML = '<div class="combobox-control"><input class="form-ghost combobox-input"></div>'
    const root = fixture.firstElementChild
    instance = new Combobox(root, { multiple: true, allowCustom: true })
    instance.add('<img src=x onerror=alert(1)>')
    expect(root.querySelector('img')).toBeNull()
    expect(instance.getValues()).toEqual(['<img src=x onerror=alert(1)>'])
    instance.dispose()
    instance = null
    expect(fixture.querySelector('.menu')).toBeNull()
  })
  it('should let applications cancel add and remove operations', () => {
    const x = make({ allowCustom: true })
    x.root.addEventListener('add.bs.combobox', event => event.preventDefault(), { once: true })
    expect(instance.add('custom')).toBeNull()
    expect(values(x.form)).toEqual([])
    instance.add('design')
    x.root.addEventListener('remove.bs.combobox', event => event.preventDefault(), { once: true })
    expect(instance.remove('design')).toBeFalse()
    expect(values(x.form)).toEqual(['design'])
  })

  it('should restore a single label if removing its committed value is canceled', () => {
    const x = make({ multiple: false }, { selected: [0] })
    x.root.addEventListener('remove.bs.combobox', event => event.preventDefault())
    type(x.input, 'other')
    expect(values(x.form)).toEqual(['design'])
    expect(x.input.value).toEqual('Label 0')
  })

  it('should show the new query before announcing a cleared single value', () => {
    const x = make({ multiple: false }, { selected: [0] })
    let query
    x.root.addEventListener('change.bs.combobox', () => {
      query = x.input.value
    })
    type(x.input, 'new query')
    expect(query).toEqual('new query')
    expect(values(x.form)).toEqual([''])
  })

  it('should preserve all chip nodes and their focused node during reconciliation', () => {
    const x = make({}, { selected: [0, 1] })
    const chips = [...x.root.querySelectorAll('.chip')]
    chips[0].focus()
    instance.update()
    expect([...x.root.querySelectorAll('.chip')]).toEqual(chips)
    expect(document.activeElement).toBe(chips[0])
  })

  it('should paste delimited values through the same selection and form path', () => {
    const x = make({ allowCustom: true, separator: ';' })
    const clipboardData = new DataTransfer()
    clipboardData.setData('text', 'alpha;beta')
    const event = new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
    x.input.dispatchEvent(event)
    expect(event.defaultPrevented).toBeTrue()
    expect(values(x.form)).toEqual(['alpha', 'beta'])
  })

  it('should not split paste without a configured separator', () => {
    const x = make({ allowCustom: true })
    const clipboardData = new DataTransfer()
    clipboardData.setData('text', 'alpha,beta')
    const event = new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
    x.input.dispatchEvent(event)
    expect(event.defaultPrevented).toBeFalse()
    expect(values(x.form)).toEqual([])
  })

  it('should create on blur only when explicitly enabled', () => {
    const x = make({ allowCustom: true, createOnBlur: true })
    type(x.input, 'new tag')
    x.input.dispatchEvent(new FocusEvent('blur', { relatedTarget: x.form }))
    expect(values(x.form)).toEqual(['new tag'])
  })

  it('should ignore blur toward a chip removal control', () => {
    const x = make({ allowCustom: true, createOnBlur: true }, { selected: [0] })
    type(x.input, 'unfinished')
    x.input.dispatchEvent(new FocusEvent('blur', { relatedTarget: x.root.querySelector('.chip-dismiss') }))
    expect(values(x.form)).toEqual(['design'])
  })

  it('should block edits and removal when its wrapping field is disabled', () => {
    const x = make({ allowCustom: true }, { selected: [0] })
    x.root.classList.add('disabled')
    instance.update()
    expect(instance.add('new tag')).toBeNull()
    expect(instance.remove('design')).toBeFalse()
    expect(x.root.querySelector('.chip-dismiss').disabled).toBeTrue()
    expect(values(x.form)).toEqual([])
  })

  it('should reject invalid selection limits', () => {
    const x = make()
    for (const maxItems of [0, -1, 1.5]) {
      expect(() => new Combobox(x.root, { maxItems })).toThrowError(TypeError)
    }
  })

  it('should safely stop when a removal listener disposes the component', () => {
    const x = make({}, { selected: [0] })
    x.root.addEventListener('remove.bs.combobox', () => {
      instance.dispose()
      instance = null
    })
    const component = instance
    expect(component.remove('design')).toBeFalse()
  })

  it('should clear enabled selections with one native change notification', () => {
    const x = make({}, { selected: [0, 1] })
    const changed = jasmine.createSpy('changed')
    x.form.addEventListener('change', changed)
    instance.clear()
    expect(values(x.form)).toEqual([])
    expect(changed).toHaveBeenCalledTimes(1)
    instance.clear()
    expect(changed).toHaveBeenCalledTimes(1)
  })
  it('should open and highlight an option when CSS hides the closed popup', () => {
    const x = make()
    x.menu.style.display = 'none'
    key(x.input, 'ArrowDown')
    expect(x.menu).toHaveClass('show')
    expect(x.input.getAttribute('aria-activedescendant')).toEqual(x.items[0].id)
  })
  it('should preserve the caret when updates leave the query unchanged', () => {
    const x = make()
    type(x.input, 'Label')
    x.input.setSelectionRange(2, 2)
    instance.update()
    expect(x.input.selectionStart).toEqual(2)
    expect(x.input.selectionEnd).toEqual(2)
  })

  it('should preserve composing text during observer reconciliation', () => {
    const x = make({ allowCustom: true })
    x.input.value = 'とうきょう'
    x.input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }))
    instance.update()
    expect(x.input.value).toEqual('とうきょう')
    expect(values(x.form)).toEqual([])
  })
  it('should highlight the last chip without changing form values on Backspace', () => {
    const x = make({}, { selected: [0, 1, 2] })
    const changed = jasmine.createSpy('changed')
    x.form.addEventListener('change', changed)
    x.input.focus()
    key(x.input, 'Backspace')
    const chip = x.root.querySelectorAll('.chip')[2]
    expect(chip).toHaveClass('active')
    expect(chip.getAttribute('aria-description')).toEqual('Selected for removal')
    expect(instance.getSelectedValues()).toEqual(['science'])
    expect(instance.getValues()).toEqual(['design', 'art,music', 'science'])
    expect(changed).not.toHaveBeenCalled()
  })

  it('should select a chip on click and support modifier toggles', () => {
    const x = make({}, { selected: [0, 1, 2] })
    const chips = x.root.querySelectorAll('.chip')
    chips[0].click()
    expect(instance.getSelectedValues()).toEqual(['design'])
    chips[2].dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }))
    expect(instance.getSelectedValues()).toEqual(['design', 'science'])
    chips[0].dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }))
    expect(instance.getSelectedValues()).toEqual(['science'])
    expect(document.activeElement).toBe(chips[0])
  })

  it('should extend and shrink a range without losing its anchor', () => {
    const x = make({}, { selected: [0, 1, 2] })
    const chips = x.root.querySelectorAll('.chip')
    chips[2].click()
    key(chips[2], 'ArrowLeft', { shiftKey: true })
    expect(instance.getSelectedValues()).toEqual(['art,music', 'science'])
    key(chips[1], 'ArrowLeft', { shiftKey: true })
    expect(instance.getSelectedValues()).toEqual(['design', 'art,music', 'science'])
    key(chips[0], 'ArrowRight', { shiftKey: true })
    expect(instance.getSelectedValues()).toEqual(['art,music', 'science'])
  })

  it('should support shift-click and shift-Home/End range selection', () => {
    const x = make({}, { selected: [0, 1, 2] })
    const chips = x.root.querySelectorAll('.chip')
    chips[0].click()
    chips[2].dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }))
    expect(instance.getSelectedValues()).toEqual(['design', 'art,music', 'science'])
    chips[1].click()
    key(chips[1], 'Home', { shiftKey: true })
    expect(instance.getSelectedValues()).toEqual(['design', 'art,music'])
    key(chips[0], 'End', { shiftKey: true })
    expect(instance.getSelectedValues()).toEqual(['art,music', 'science'])
  })

  it('should emit UI selection events with values and option identities', () => {
    const x = make({}, { values: ['same', 'same'], selected: [0, 1] })
    const events = []
    x.root.addEventListener('select.bs.combobox', event => events.push([event.selected, event.items]))
    const chips = x.root.querySelectorAll('.chip')
    instance.selectChip(chips[1])
    instance.clearSelection()
    expect(events).toEqual([[['same'], [x.items[1]]], [[], []]])
    expect(values(x.form)).toEqual(['same', 'same'])
  })

  it('should delete a selected range in one native change and focus a remaining chip', () => {
    const x = make({}, { selected: [0, 1, 2] })
    const chips = x.root.querySelectorAll('.chip')
    chips[2].click()
    key(chips[2], 'ArrowLeft', { shiftKey: true })
    const changes = []
    x.form.addEventListener('change', () => changes.push(values(x.form)))
    key(chips[1], 'Delete')
    expect(values(x.form)).toEqual(['design'])
    expect(changes).toEqual([['design']])
    expect(document.activeElement).toBe(chips[0])
    expect(chips[0]).toHaveClass('active')
  })

  it('should select all chips with modifier+A but preserve native query selection', () => {
    const x = make({}, { selected: [0, 1, 2] })
    x.input.focus()
    expect(key(x.input, 'a', { ctrlKey: true }).defaultPrevented).toBeTrue()
    expect(instance.getSelectedValues()).toEqual(['design', 'art,music', 'science'])
    key(document.activeElement, 'Delete')
    expect(values(x.form)).toEqual([])
    expect(document.activeElement).toBe(x.input)
    type(x.input, 'query')
    expect(key(x.input, 'a', { metaKey: true }).defaultPrevented).toBeFalse()
  })

  it('should clear highlighted chips when returning to the editor', () => {
    const x = make({}, { selected: [0, 1] })
    x.input.focus()
    key(x.input, 'Backspace')
    const last = x.root.querySelectorAll('.chip')[1]
    key(last, 'ArrowRight')
    expect(document.activeElement).toBe(x.input)
    expect(instance.getSelectedValues()).toEqual([])
    expect(last).not.toHaveClass('active')
    expect(last.hasAttribute('aria-description')).toBeFalse()
  })

  it('should clear UI selection on Escape without removing committed values', () => {
    const x = make({}, { selected: [0, 1] })
    const chip = x.root.querySelector('.chip')
    chip.click()
    key(chip, 'Escape')
    expect(instance.getSelectedValues()).toEqual([])
    expect(instance.getValues()).toEqual(['design', 'art,music'])
    expect(document.activeElement).toBe(x.input)
  })

  it('should preserve query text when arrowing back from a chip', () => {
    const x = make({}, { selected: [0, 1] })
    type(x.input, 'query')
    x.input.setSelectionRange(0, 0)
    key(x.input, 'ArrowLeft')
    const chip = x.root.querySelectorAll('.chip')[1]
    expect(chip).toHaveClass('active')
    key(chip, 'End')
    expect(x.input.value).toEqual('query')
    expect(instance.getSelectedValues()).toEqual([])
  })

  it('should honor individual removal cancellation during bulk deletion', () => {
    const x = make({}, { selected: [0, 1, 2] })
    const chip = x.root.querySelector('.chip')
    chip.click()
    key(chip, 'a', { ctrlKey: true })
    x.root.addEventListener('remove.bs.combobox', event => {
      if (event.item === x.items[1]) {
        event.preventDefault()
      }
    })
    key(chip, 'Delete')
    expect(instance.getValues()).toEqual(['art,music'])
    expect(x.root.querySelector('.chip')).toHaveClass('active')
  })

  it('should exclude disabled chips from focus and range selection', () => {
    const x = make({}, { selected: [0, 1, 2] })
    x.items[2].disabled = true
    instance.update()
    x.input.focus()
    key(x.input, 'Backspace')
    expect(document.activeElement).toBe(x.root.querySelectorAll('.chip')[1])
    key(document.activeElement, 'a', { ctrlKey: true })
    expect(instance.getSelectedValues()).toEqual(['design', 'art,music'])
  })

  it('should navigate and extend chip ranges in RTL', () => {
    document.documentElement.dir = 'rtl'
    const x = make({}, { selected: [0, 1, 2] })
    x.input.focus()
    key(x.input, 'ArrowRight')
    const chips = x.root.querySelectorAll('.chip')
    key(chips[2], 'ArrowRight', { shiftKey: true })
    expect(instance.getSelectedValues()).toEqual(['art,music', 'science'])
    expect(document.activeElement).toBe(chips[1])
    key(chips[1], 'ArrowLeft')
    expect(instance.getSelectedValues()).toEqual(['science'])
  })

  it('should stop safely when a chip-selection listener disposes the component', () => {
    const x = make({}, { selected: [0] })
    const component = instance
    x.root.addEventListener('select.bs.combobox', () => {
      component.dispose()
      instance = null
    })
    expect(() => key(x.input, 'Backspace')).not.toThrow()
  })

  it('should clear UI selection quietly on reset', async () => {
    const x = make({}, { selected: [0, 1] })
    x.root.querySelector('.chip').click()
    const selected = jasmine.createSpy('selected')
    x.root.addEventListener('select.bs.combobox', selected)
    x.form.reset()
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })
    expect(instance.getSelectedValues()).toEqual([])
    expect(x.root.querySelectorAll('.chip.active').length).toEqual(0)
    expect(selected).not.toHaveBeenCalled()
  })

  it('should prune highlighted chips when their options are removed on update', () => {
    const x = make({}, { selected: [0, 1] })
    x.root.querySelector('.chip').click()
    x.items[0].remove()
    instance.update()
    expect(instance.getSelectedValues()).toEqual([])
    expect(instance._anchorChip).toBeNull()
  })
})
