import Chips from '../../src/chips.js'
import EventHandler from '../../src/dom/event-handler.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Chips', () => {
  let fixtureEl

  const makeChips = (options, html = '<div class="chips"></div>') => {
    fixtureEl.innerHTML = html
    const chipsEl = fixtureEl.querySelector('.chips')
    return { chipsEl, chips: new Chips(chipsEl, options) }
  }

  const keydown = (target, key, modifiers = {}) => {
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...modifiers
    }))
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('static properties', () => {
    it('should expose version, name, default and default type', () => {
      expect(Chips.VERSION).toEqual(jasmine.any(String))
      expect(Chips.NAME).toEqual('chips')
      expect(Chips.Default).toEqual(jasmine.any(Object))
      expect(Chips.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should create a ghost input when none is present', () => {
      const { chipsEl } = makeChips()

      expect(chipsEl.querySelector('.form-ghost')).not.toBeNull()
    })

    it('should reuse an existing ghost input and set the placeholder from config', () => {
      const { chipsEl } = makeChips(
        { placeholder: 'Add tag' },
        '<div class="chips"><input class="form-ghost" type="text"></div>'
      )

      expect(chipsEl.querySelectorAll('.form-ghost').length).toEqual(1)
    })

    it('should initialize from existing chips in the markup', () => {
      const { chips, chipsEl } = makeChips(
        {},
        '<div class="chips"><span class="chip" data-bs-chip-value="alpha">alpha</span></div>'
      )

      expect(chips.getValues()).toEqual(['alpha'])
      // Existing chips get a dismiss button and become focusable
      expect(chipsEl.querySelector('.chip').getAttribute('tabindex')).toEqual('0')
      expect(chipsEl.querySelector('.chip-dismiss')).not.toBeNull()
    })

    it('should derive a chip value from text content when no data attribute is set', () => {
      const { chips } = makeChips(
        {},
        '<div class="chips"><span class="chip">beta</span></div>'
      )

      expect(chips.getValues()).toEqual(['beta'])
    })

    it('should derive a chip value from text while ignoring an existing dismiss button', () => {
      const { chips } = makeChips(
        {},
        '<div class="chips"><span class="chip">gamma<button class="chip-dismiss">x</button></span></div>'
      )

      expect(chips.getValues()).toEqual(['gamma'])
    })
  })

  describe('add / getValues', () => {
    it('should add a chip and reflect it in the DOM and values', () => {
      const { chips, chipsEl } = makeChips()

      chips.add('alpha')

      expect(chips.getValues()).toEqual(['alpha'])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(1)
    })

    it('should ignore empty values', () => {
      const { chips } = makeChips()

      expect(chips.add('   ')).toBeNull()
      expect(chips.getValues()).toEqual([])
    })

    it('should reject duplicates when allowDuplicates is false', () => {
      const { chips, chipsEl } = makeChips()

      chips.add('alpha')
      chips.add('alpha')

      expect(chips.getValues()).toEqual(['alpha'])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(1)
    })

    it('should allow duplicates when allowDuplicates is true', () => {
      const { chips, chipsEl } = makeChips({ allowDuplicates: true })

      chips.add('alpha')
      chips.add('alpha')

      expect(chips.getValues()).toEqual(['alpha', 'alpha'])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(2)
    })

    it('should enforce the maxChips limit', () => {
      const { chips } = makeChips({ maxChips: 2 })

      chips.add('a')
      chips.add('b')

      expect(chips.add('c')).toBeNull()
      expect(chips.getValues()).toEqual(['a', 'b'])
    })

    it('should not add a chip when the add event is prevented', () => {
      const { chips, chipsEl } = makeChips()

      EventHandler.on(chipsEl, 'add.bs.chips', event => event.preventDefault())

      expect(chips.add('alpha')).toBeNull()
      expect(chips.getValues()).toEqual([])
    })

    it('should fire the add event with the value and related target', () => {
      const { chips, chipsEl } = makeChips()
      const spy = jasmine.createSpy('add')

      EventHandler.on(chipsEl, 'add.bs.chips', spy)
      chips.add('alpha')

      expect(spy).toHaveBeenCalled()
      expect(spy.calls.mostRecent().args[0].value).toEqual('alpha')
    })

    it('should not create a dismiss button when dismissible is false', () => {
      const { chips, chipsEl } = makeChips({ dismissible: false })
      chips.add('alpha')

      expect(chipsEl.querySelector('.chip-dismiss')).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove a single chip and keep values in sync with the DOM', () => {
      const { chips, chipsEl } = makeChips()

      chips.add('alpha')
      chips.add('beta')

      expect(chips.remove('alpha')).toBeTrue()
      expect(chips.getValues()).toEqual(['beta'])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(1)
    })

    it('should only remove one entry per duplicate value, keeping values and DOM in sync', () => {
      const { chips, chipsEl } = makeChips({ allowDuplicates: true })

      chips.add('alpha')
      chips.add('alpha')
      chips.add('beta')

      const firstChip = chipsEl.querySelector('.chip')
      expect(chips.remove(firstChip)).toBeTrue()

      // One 'alpha' entry must remain — both state and DOM stay aligned
      expect(chips.getValues()).toEqual(['alpha', 'beta'])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(2)
    })

    it('should return false when the value is not present', () => {
      const { chips } = makeChips()

      expect(chips.remove('missing')).toBeFalse()
    })

    it('should not remove a chip when the remove event is prevented', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('alpha')

      EventHandler.on(chipsEl, 'remove.bs.chips', event => event.preventDefault())

      expect(chips.remove('alpha')).toBeFalse()
      expect(chips.getValues()).toEqual(['alpha'])
    })

    it('should clear a removed chip from the current selection', () => {
      const { chips } = makeChips()
      const chip = chips.add('alpha')

      chips.selectChip(chip)
      expect(chips.getSelectedValues()).toEqual(['alpha'])

      chips.remove(chip)
      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should remove a chip when its dismiss button is clicked', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('alpha')

      chipsEl.querySelector('.chip-dismiss').click()

      expect(chips.getValues()).toEqual([])
    })
  })

  describe('selection', () => {
    it('should select a single chip', () => {
      const { chips } = makeChips()
      const chip = chips.add('alpha')

      chips.selectChip(chip)

      expect(chip).toHaveClass('active')
      expect(chips.getSelectedValues()).toEqual(['alpha'])
    })

    it('should toggle selection when addToSelection is set', () => {
      const { chips } = makeChips()
      const chip = chips.add('alpha')

      chips.selectChip(chip, { addToSelection: true })
      expect(chips.getSelectedValues()).toEqual(['alpha'])

      chips.selectChip(chip, { addToSelection: true })
      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should range-select from the anchor chip', () => {
      const { chips } = makeChips()
      const first = chips.add('a')
      chips.add('b')
      const third = chips.add('c')

      chips.selectChip(first)
      chips.selectChip(third, { rangeSelect: true })

      expect(chips.getSelectedValues()).toEqual(['a', 'b', 'c'])
    })

    it('should ignore selection requests for foreign elements', () => {
      const { chips } = makeChips()
      chips.add('a')

      chips.selectChip(document.createElement('span'))

      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should clear the selection', () => {
      const { chips } = makeChips()
      const chip = chips.add('alpha')
      chips.selectChip(chip)

      chips.clearSelection()

      expect(chip).not.toHaveClass('active')
      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should remove every selected chip with removeSelected', () => {
      const { chips } = makeChips()
      const a = chips.add('a')
      const b = chips.add('b')
      chips.selectChip(a)
      chips.selectChip(b, { addToSelection: true })

      chips.removeSelected()

      expect(chips.getValues()).toEqual([])
    })

    it('should select a chip and focus it on click', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('alpha')

      chipsEl.querySelector('.chip').click()

      expect(chips.getSelectedValues()).toEqual(['alpha'])
    })

    it('should clear the selection when clicking the container background', () => {
      const { chips, chipsEl } = makeChips()
      const chip = chips.add('alpha')
      chips.selectChip(chip)

      chipsEl.click()

      expect(chips.getSelectedValues()).toEqual([])
    })
  })

  describe('clear', () => {
    it('should remove all chips and reset state', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      chips.add('b')

      chips.clear()

      expect(chips.getValues()).toEqual([])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(0)
    })
  })

  describe('input handling', () => {
    it('should split input on the separator and keep the trailing part', () => {
      const { chips } = makeChips()
      const input = chips._input

      input.value = 'a,b,c'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      expect(chips.getValues()).toEqual(['a', 'b'])
      expect(input.value).toEqual('c')
    })

    it('should create a chip from the input on Enter', () => {
      const { chips } = makeChips()
      const input = chips._input

      input.value = 'alpha'
      keydown(input, 'Enter')

      expect(chips.getValues()).toEqual(['alpha'])
      expect(input.value).toEqual('')
    })

    it('should select the last chip on Backspace with an empty input', () => {
      const { chips } = makeChips()
      chips.add('alpha')
      const input = chips._input

      input.value = ''
      keydown(input, 'Backspace')

      expect(chips.getSelectedValues()).toEqual(['alpha'])
    })

    it('should clear input and blur on Escape', () => {
      const { chips } = makeChips()
      const input = chips._input
      input.value = 'typing'

      keydown(input, 'Escape')

      expect(input.value).toEqual('')
    })

    it('should select the last chip on ArrowLeft at the start of an empty input', () => {
      const { chips } = makeChips()
      chips.add('alpha')
      const input = chips._input
      input.value = ''

      keydown(input, 'ArrowLeft')

      expect(chips.getSelectedValues()).toEqual(['alpha'])
    })

    it('should add the last chip to the selection on shift+ArrowLeft from the input', () => {
      const { chips } = makeChips()
      chips.add('alpha')
      const input = chips._input
      input.value = ''

      keydown(input, 'ArrowLeft', { shiftKey: true })

      expect(chips.getSelectedValues()).toEqual(['alpha'])
    })

    it('should create a chip on blur when createOnBlur is enabled', () => {
      const { chips } = makeChips()
      const input = chips._input
      input.value = 'alpha'

      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }))

      expect(chips.getValues()).toEqual(['alpha'])
    })

    it('should not create a chip on blur when createOnBlur is disabled', () => {
      const { chips } = makeChips({ createOnBlur: false })
      const input = chips._input
      input.value = 'alpha'

      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }))

      expect(chips.getValues()).toEqual([])
    })

    it('should not create a chip on blur when focus moves to a chip', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('existing')
      const input = chips._input
      input.value = 'pending'

      input.dispatchEvent(new FocusEvent('blur', {
        bubbles: true,
        relatedTarget: chipsEl.querySelector('.chip')
      }))

      expect(chips.getValues()).toEqual(['existing'])
    })

    it('should ignore pastes when the separator is null', () => {
      const { chips } = makeChips({ separator: null })
      const input = chips._input

      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
      pasteEvent.clipboardData = { getData: () => 'a,b,c' }
      input.dispatchEvent(pasteEvent)

      expect(chips.getValues()).toEqual([])
    })

    it('should add chips from pasted text containing the separator', () => {
      const { chips } = makeChips()
      const input = chips._input

      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
      pasteEvent.clipboardData = { getData: () => 'a,b,c' }
      input.dispatchEvent(pasteEvent)

      expect(chips.getValues()).toEqual(['a', 'b', 'c'])
    })

    it('should ignore pasted text without the separator', () => {
      const { chips } = makeChips()
      const input = chips._input

      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
      pasteEvent.clipboardData = { getData: () => 'single' }
      input.dispatchEvent(pasteEvent)

      expect(chips.getValues()).toEqual([])
    })
  })

  describe('chip keyboard navigation', () => {
    it('should delete the selected chip on Backspace', () => {
      const { chips, chipsEl } = makeChips()
      const chip = chips.add('alpha')
      chips.selectChip(chip)

      keydown(chipsEl.querySelector('.chip'), 'Backspace')

      expect(chips.getValues()).toEqual([])
    })

    it('should move selection left with the arrow key', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      const second = chips.add('b')
      chips.selectChip(second)

      keydown(chipsEl.querySelectorAll('.chip')[1], 'ArrowLeft')

      expect(chips.getSelectedValues()).toEqual(['a'])
    })

    it('should move selection right with the arrow key', () => {
      const { chips, chipsEl } = makeChips()
      const first = chips.add('a')
      chips.add('b')
      chips.selectChip(first)

      keydown(chipsEl.querySelectorAll('.chip')[0], 'ArrowRight')

      expect(chips.getSelectedValues()).toEqual(['b'])
    })

    it('should extend the selection with shift+arrow', () => {
      const { chips, chipsEl } = makeChips()
      const first = chips.add('a')
      chips.add('b')
      chips.selectChip(first)

      keydown(chipsEl.querySelectorAll('.chip')[0], 'ArrowRight', { shiftKey: true })

      expect(chips.getSelectedValues().sort()).toEqual(['a', 'b'])
    })

    it('should keep focus on the first chip when arrowing left past the start', () => {
      const { chips, chipsEl } = makeChips()
      const first = chips.add('a')
      chips.add('b')
      chips.selectChip(first)

      keydown(chipsEl.querySelectorAll('.chip')[0], 'ArrowLeft')

      expect(chips.getSelectedValues()).toEqual(['a'])
    })

    it('should focus and keep the remaining chip after deleting one of several', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      chips.add('b')
      const third = chips.add('c')
      chips.selectChip(third)

      keydown(chipsEl.querySelectorAll('.chip')[2], 'Backspace')

      expect(chips.getValues()).toEqual(['a', 'b'])
    })

    it('should select all chips with modifier+a', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      const second = chips.add('b')
      chips.selectChip(second)

      keydown(chipsEl.querySelectorAll('.chip')[1], 'a', { ctrlKey: true })

      expect(chips.getSelectedValues().sort()).toEqual(['a', 'b'])
    })

    it('should jump to the first chip on Home', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      const second = chips.add('b')
      chips.selectChip(second)

      keydown(chipsEl.querySelectorAll('.chip')[1], 'Home')

      expect(chips.getSelectedValues()).toEqual(['a'])
    })

    it('should range-select to the start on shift+Home', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      const second = chips.add('b')
      chips.selectChip(second)

      keydown(chipsEl.querySelectorAll('.chip')[1], 'Home', { shiftKey: true })

      expect(chips.getSelectedValues().sort()).toEqual(['a', 'b'])
    })

    it('should return focus to the input when navigating right past the last chip', () => {
      const { chips, chipsEl } = makeChips()
      const only = chips.add('a')
      chips.selectChip(only)

      keydown(chipsEl.querySelector('.chip'), 'ArrowRight')

      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should clear selection and focus the input on End', () => {
      const { chips, chipsEl } = makeChips()
      const chip = chips.add('a')
      chips.selectChip(chip)

      keydown(chipsEl.querySelector('.chip'), 'End')

      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should clear selection and focus the input on Escape', () => {
      const { chips, chipsEl } = makeChips()
      const chip = chips.add('a')
      chips.selectChip(chip)

      keydown(chipsEl.querySelector('.chip'), 'Escape')

      expect(chips.getSelectedValues()).toEqual([])
    })

    it('should do nothing on Backspace when no chip is selected', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      chips.clearSelection()

      keydown(chipsEl.querySelector('.chip'), 'Backspace')

      expect(chips.getValues()).toEqual(['a'])
    })

    it('should not select all on a plain "a" keypress without a modifier', () => {
      const { chips, chipsEl } = makeChips()
      chips.add('a')
      const second = chips.add('b')
      chips.selectChip(second)

      keydown(chipsEl.querySelectorAll('.chip')[1], 'a')

      expect(chips.getSelectedValues()).toEqual(['b'])
    })
  })
})
