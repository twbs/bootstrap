import Chips from '../../src/chips.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

describe('Chips', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Chips.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Chips.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type config', () => {
      expect(Chips.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Chips.DATA_KEY).toEqual('bs.chips')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chipsBySelector = new Chips('[data-bs-chips]')
      expect(chipsBySelector._element).toEqual(chipsEl)

      const chipsByElement = new Chips(chipsEl)
      expect(chipsByElement._element).toEqual(chipsEl)
    })

    it('should create a ghost input when none is present', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)

      expect(chipsEl.querySelector('.form-ghost')).not.toBeNull()
      expect(chips._input).toEqual(chipsEl.querySelector('.form-ghost'))
    })

    it('should initialize existing chips', () => {
      fixtureEl.innerHTML = [
        '<div class="chips" data-bs-chips>',
        '  <span class="chip" data-bs-chip-value="alpha">alpha</span>',
        '  <span class="chip" data-bs-chip-value="beta">beta</span>',
        '</div>'
      ].join('')

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)

      expect(chips.getValues()).toEqual(['alpha', 'beta'])
    })

    it('should make existing chips focusable and add a dismiss button', () => {
      fixtureEl.innerHTML = [
        '<div class="chips" data-bs-chips>',
        '  <span class="chip" data-bs-chip-value="alpha">alpha</span>',
        '</div>'
      ].join('')

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      // eslint-disable-next-line no-new
      new Chips(chipsEl)

      const chip = chipsEl.querySelector('.chip')
      expect(chip.getAttribute('tabindex')).toEqual('0')
      expect(chip.querySelector('.chip-dismiss')).not.toBeNull()
    })
  })

  describe('add', () => {
    it('should add a chip and emit add + change events', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)

      const addSpy = jasmine.createSpy('add')
      const changeSpy = jasmine.createSpy('change')
      chipsEl.addEventListener('add.bs.chips', addSpy)
      chipsEl.addEventListener('change.bs.chips', changeSpy)

      const chip = chips.add('alpha')

      expect(chip).not.toBeNull()
      expect(chip.dataset.bsChipValue).toEqual('alpha')
      expect(chips.getValues()).toEqual(['alpha'])
      expect(addSpy).toHaveBeenCalled()
      expect(changeSpy).toHaveBeenCalled()
    })

    it('should trim values and reject empty ones', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))

      expect(chips.add('  spaced  ')).not.toBeNull()
      expect(chips.getValues()).toEqual(['spaced'])
      expect(chips.add('   ')).toBeNull()
      expect(chips.getValues()).toEqual(['spaced'])
    })

    it('should reject duplicates unless allowDuplicates is set', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))

      chips.add('alpha')
      expect(chips.add('alpha')).toBeNull()
      expect(chips.getValues()).toEqual(['alpha'])
    })

    it('should allow duplicates when configured', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips data-bs-allow-duplicates="true"></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))

      chips.add('alpha')
      chips.add('alpha')
      expect(chips.getValues()).toEqual(['alpha', 'alpha'])
    })

    it('should respect the maxChips limit', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips data-bs-max-chips="2"></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))

      chips.add('a')
      chips.add('b')
      expect(chips.add('c')).toBeNull()
      expect(chips.getValues()).toEqual(['a', 'b'])
    })

    it('should not add a chip when the add event is prevented', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)
      chipsEl.addEventListener('add.bs.chips', event => event.preventDefault())

      expect(chips.add('alpha')).toBeNull()
      expect(chips.getValues()).toEqual([])
    })
  })

  describe('remove', () => {
    it('should remove a chip by value and emit remove + change events', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)
      chips.add('alpha')

      const removeSpy = jasmine.createSpy('remove')
      const changeSpy = jasmine.createSpy('change')
      chipsEl.addEventListener('remove.bs.chips', removeSpy)
      chipsEl.addEventListener('change.bs.chips', changeSpy)

      expect(chips.remove('alpha')).toBeTrue()
      expect(chips.getValues()).toEqual([])
      expect(chipsEl.querySelector('.chip')).toBeNull()
      expect(removeSpy).toHaveBeenCalled()
      expect(changeSpy).toHaveBeenCalled()
    })

    it('should remove a chip by element', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))
      const chip = chips.add('alpha')

      expect(chips.remove(chip)).toBeTrue()
      expect(chips.getValues()).toEqual([])
    })

    it('should return false for an unknown value', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))

      expect(chips.remove('nope')).toBeFalse()
    })

    it('should not remove when the remove event is prevented', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)
      chips.add('alpha')
      chipsEl.addEventListener('remove.bs.chips', event => event.preventDefault())

      expect(chips.remove('alpha')).toBeFalse()
      expect(chips.getValues()).toEqual(['alpha'])
    })

    it('should remove a chip when its dismiss button is clicked', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)
      chips.add('alpha')

      chipsEl.querySelector('.chip-dismiss').click()

      expect(chips.getValues()).toEqual([])
    })
  })

  describe('clear', () => {
    it('should remove all chips and emit a change event', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)
      chips.add('a')
      chips.add('b')

      const changeSpy = jasmine.createSpy('change')
      chipsEl.addEventListener('change.bs.chips', changeSpy)

      chips.clear()

      expect(chips.getValues()).toEqual([])
      expect(chipsEl.querySelectorAll('.chip').length).toEqual(0)
      expect(changeSpy).toHaveBeenCalled()
    })
  })

  describe('selection', () => {
    it('should select a chip and expose its value', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)
      const chip = chips.add('alpha')

      const selectSpy = jasmine.createSpy('select')
      chipsEl.addEventListener('select.bs.chips', selectSpy)

      chips.selectChip(chip)

      expect(chip).toHaveClass('active')
      expect(chips.getSelectedValues()).toEqual(['alpha'])
      expect(selectSpy).toHaveBeenCalled()
    })

    it('should clear the selection', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))
      const chip = chips.add('alpha')
      chips.selectChip(chip)

      chips.clearSelection()

      expect(chip).not.toHaveClass('active')
      expect(chips.getSelectedValues()).toEqual([])
    })
  })

  describe('keyboard and input', () => {
    it('should create a chip when Enter is pressed in the input', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))
      const input = chips._input

      input.value = 'alpha'
      const keydown = createEvent('keydown')
      keydown.key = 'Enter'
      input.dispatchEvent(keydown)

      expect(chips.getValues()).toEqual(['alpha'])
      expect(input.value).toEqual('')
    })

    it('should split on the separator while typing', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))
      const input = chips._input

      input.value = 'alpha,'
      input.dispatchEvent(createEvent('input'))

      expect(chips.getValues()).toEqual(['alpha'])
      expect(input.value).toEqual('')
    })

    it('should select the last chip on Backspace in an empty input', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chips = new Chips(fixtureEl.querySelector('[data-bs-chips]'))
      chips.add('alpha')
      chips.add('beta')
      const input = chips._input
      input.value = ''

      const keydown = createEvent('keydown')
      keydown.key = 'Backspace'
      input.dispatchEvent(keydown)

      expect(chips.getSelectedValues()).toEqual(['beta'])
    })
  })

  describe('dispose', () => {
    it('should dispose the instance', () => {
      fixtureEl.innerHTML = '<div class="chips" data-bs-chips></div>'

      const chipsEl = fixtureEl.querySelector('[data-bs-chips]')
      const chips = new Chips(chipsEl)

      expect(Chips.getInstance(chipsEl)).not.toBeNull()

      chips.dispose()

      expect(Chips.getInstance(chipsEl)).toBeNull()
    })
  })
})
