import Combobox from '../../src/combobox.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

describe('Combobox', () => {
  let fixtureEl

  const markup = ({ toggleAttrs = '', menuExtra = '' } = {}) => [
    '<div>',
    `  <button type="button" class="combobox-toggle" data-bs-toggle="combobox" ${toggleAttrs}>`,
    '    <span class="combobox-value"></span>',
    '  </button>',
    '  <div class="menu">',
    menuExtra,
    '    <a class="menu-item" data-bs-value="1" href="#">One</a>',
    '    <a class="menu-item" data-bs-value="2" href="#">Two</a>',
    '    <a class="menu-item" data-bs-value="3" href="#">Three</a>',
    '  </div>',
    '</div>'
  ].join('')

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Combobox.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Combobox.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type config', () => {
      expect(Combobox.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Combobox.DATA_KEY).toEqual('bs.combobox')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const comboboxBySelector = new Combobox('[data-bs-toggle="combobox"]')
      expect(comboboxBySelector._element).toEqual(toggle)

      const comboboxByElement = new Combobox(toggle)
      expect(comboboxByElement._element).toEqual(toggle)
    })

    it('should resolve the sibling menu and value display', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      expect(combobox._menu).toEqual(fixtureEl.querySelector('.menu'))
      expect(combobox._valueDisplay).toEqual(toggle.querySelector('.combobox-value'))
    })

    it('should show the placeholder when nothing is selected', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'data-bs-placeholder="Pick one"' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      expect(combobox._valueDisplay.textContent).toEqual('Pick one')
      expect(combobox._valueDisplay).toHaveClass('combobox-placeholder')
    })

    it('should sync the toggle text from a pre-selected item', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button type="button" data-bs-toggle="combobox"><span class="combobox-value"></span></button>',
        '  <div class="menu">',
        '    <a class="menu-item selected" data-bs-value="2" href="#">Two</a>',
        '  </div>',
        '</div>'
      ].join('')

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      expect(combobox._valueDisplay.textContent).toEqual('Two')
      expect(combobox._valueDisplay).not.toHaveClass('combobox-placeholder')
    })

    it('should create a hidden input when a name is configured', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'data-bs-name="field"' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      // eslint-disable-next-line no-new
      new Combobox(toggle)

      const hidden = fixtureEl.querySelector('input[type="hidden"]')
      expect(hidden).not.toBeNull()
      expect(hidden.name).toEqual('field')
      expect(hidden.value).toEqual('')
    })

    it('should not create a hidden input without a name', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      // eslint-disable-next-line no-new
      new Combobox(toggle)

      expect(fixtureEl.querySelector('input[type="hidden"]')).toBeNull()
    })
  })

  describe('config', () => {
    it('should parse data-bs-* attributes', () => {
      fixtureEl.innerHTML = markup({
        toggleAttrs: 'data-bs-multiple="true" data-bs-name="tags" data-bs-placeholder="Choose" data-bs-search="true"'
      })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      expect(combobox._config.multiple).toBeTrue()
      expect(combobox._config.name).toEqual('tags')
      expect(combobox._config.placeholder).toEqual('Choose')
      expect(combobox._config.search).toBeTrue()
    })
  })

  describe('show', () => {
    it('should trigger show and shown events', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      const showSpy = jasmine.createSpy('show')
      const shownSpy = jasmine.createSpy('shown')
      toggle.addEventListener('show.bs.combobox', showSpy)
      toggle.addEventListener('shown.bs.combobox', shownSpy)

      combobox.show()

      expect(showSpy).toHaveBeenCalled()
      expect(shownSpy).toHaveBeenCalled()
    })

    it('should not show when the show event is prevented', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      const shownSpy = jasmine.createSpy('shown')
      toggle.addEventListener('show.bs.combobox', event => event.preventDefault())
      toggle.addEventListener('shown.bs.combobox', shownSpy)

      combobox.show()

      expect(shownSpy).not.toHaveBeenCalled()
    })

    it('should not show when the toggle is disabled', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'disabled' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      const showSpy = jasmine.createSpy('show')
      toggle.addEventListener('show.bs.combobox', showSpy)

      combobox.show()

      expect(showSpy).not.toHaveBeenCalled()
    })
  })

  describe('hide', () => {
    it('should trigger hide and hidden events when shown', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      const hideSpy = jasmine.createSpy('hide')
      const hiddenSpy = jasmine.createSpy('hidden')
      toggle.addEventListener('hide.bs.combobox', hideSpy)
      toggle.addEventListener('hidden.bs.combobox', hiddenSpy)

      combobox.show()
      combobox.hide()

      expect(hideSpy).toHaveBeenCalled()
      expect(hiddenSpy).toHaveBeenCalled()
    })

    it('should do nothing when it is already hidden', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      const hideSpy = jasmine.createSpy('hide')
      toggle.addEventListener('hide.bs.combobox', hideSpy)

      combobox.hide()

      expect(hideSpy).not.toHaveBeenCalled()
    })
  })

  describe('selection (single)', () => {
    it('should select an item on click and emit a change event', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)
      const item = fixtureEl.querySelector('.menu-item[data-bs-value="2"]')

      let changeEvent
      toggle.addEventListener('change.bs.combobox', event => {
        changeEvent = event
      })

      item.click()

      expect(item).toHaveClass('selected')
      expect(item.getAttribute('aria-selected')).toEqual('true')
      expect(combobox._valueDisplay.textContent).toEqual('Two')
      expect(changeEvent).toBeDefined()
      expect(changeEvent.value).toEqual('2')
      expect(changeEvent.item).toEqual(item)
    })

    it('should replace the previous selection', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)
      const first = fixtureEl.querySelector('.menu-item[data-bs-value="1"]')
      const second = fixtureEl.querySelector('.menu-item[data-bs-value="2"]')

      first.click()
      second.click()

      expect(first).not.toHaveClass('selected')
      expect(second).toHaveClass('selected')
      expect(combobox._getSelectedItems()).toEqual([second])
    })

    it('should write the selected value to the hidden input', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'data-bs-name="field"' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      // eslint-disable-next-line no-new
      new Combobox(toggle)
      const item = fixtureEl.querySelector('.menu-item[data-bs-value="3"]')

      item.click()

      expect(fixtureEl.querySelector('input[type="hidden"]').value).toEqual('3')
    })
  })

  describe('selection (multiple)', () => {
    it('should toggle items and keep an array value', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'data-bs-multiple="true" data-bs-name="field"' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)
      const first = fixtureEl.querySelector('.menu-item[data-bs-value="1"]')
      const second = fixtureEl.querySelector('.menu-item[data-bs-value="2"]')

      const values = []
      toggle.addEventListener('change.bs.combobox', event => values.push(event.value))

      first.click()
      second.click()

      expect(first).toHaveClass('selected')
      expect(second).toHaveClass('selected')
      expect(combobox._valueDisplay.textContent).toEqual('2 selected')
      expect(fixtureEl.querySelector('input[type="hidden"]').value).toEqual('1,2')
      expect(values.at(-1)).toEqual(['1', '2'])
    })

    it('should deselect a selected item on a second click', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'data-bs-multiple="true"' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)
      const item = fixtureEl.querySelector('.menu-item[data-bs-value="1"]')

      item.click()
      expect(item).toHaveClass('selected')

      item.click()
      expect(item).not.toHaveClass('selected')
      expect(combobox._getSelectedItems()).toEqual([])
    })
  })

  describe('filtering', () => {
    const searchMarkup = markup({
      toggleAttrs: 'data-bs-search="true"',
      menuExtra: [
        '    <input type="text" class="combobox-search-input">',
        '    <div class="combobox-no-results d-none">No results</div>'
      ].join('')
    })

    it('should hide items that do not match the query', () => {
      fixtureEl.innerHTML = searchMarkup

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      // eslint-disable-next-line no-new
      new Combobox(toggle)
      const searchInput = fixtureEl.querySelector('.combobox-search-input')

      searchInput.value = 'tw'
      searchInput.dispatchEvent(createEvent('input'))

      expect(fixtureEl.querySelector('.menu-item[data-bs-value="1"]').style.display).toEqual('none')
      expect(fixtureEl.querySelector('.menu-item[data-bs-value="2"]').style.display).toEqual('')
      expect(fixtureEl.querySelector('.menu-item[data-bs-value="3"]').style.display).toEqual('none')
    })

    it('should reveal the no-results element when nothing matches', () => {
      fixtureEl.innerHTML = searchMarkup

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      // eslint-disable-next-line no-new
      new Combobox(toggle)
      const searchInput = fixtureEl.querySelector('.combobox-search-input')
      const noResults = fixtureEl.querySelector('.combobox-no-results')

      searchInput.value = 'zzz'
      searchInput.dispatchEvent(createEvent('input'))

      expect(noResults).not.toHaveClass('d-none')

      searchInput.value = 'one'
      searchInput.dispatchEvent(createEvent('input'))

      expect(noResults).toHaveClass('d-none')
    })
  })

  describe('keyboard', () => {
    it('should open the menu when pressing ArrowDown on the toggle', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      // eslint-disable-next-line no-new
      new Combobox(toggle)

      const showSpy = jasmine.createSpy('show')
      toggle.addEventListener('show.bs.combobox', showSpy)

      const keydown = createEvent('keydown', { bubbles: true })
      keydown.key = 'ArrowDown'
      toggle.dispatchEvent(keydown)

      expect(showSpy).toHaveBeenCalled()
    })
  })

  describe('toggle', () => {
    it('should show a hidden combobox and hide a shown one', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      const showSpy = jasmine.createSpy('show')
      const hideSpy = jasmine.createSpy('hide')
      toggle.addEventListener('show.bs.combobox', showSpy)
      toggle.addEventListener('hide.bs.combobox', hideSpy)

      combobox.toggle()
      expect(showSpy).toHaveBeenCalledTimes(1)

      combobox.toggle()
      expect(hideSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('dispose', () => {
    it('should remove the instance and its hidden input', () => {
      fixtureEl.innerHTML = markup({ toggleAttrs: 'data-bs-name="field"' })

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const combobox = new Combobox(toggle)

      expect(Combobox.getInstance(toggle)).not.toBeNull()
      expect(fixtureEl.querySelector('input[type="hidden"]')).not.toBeNull()

      combobox.dispose()

      expect(Combobox.getInstance(toggle)).toBeNull()
      expect(fixtureEl.querySelector('input[type="hidden"]')).toBeNull()
    })
  })

  describe('data-api', () => {
    it('should create an instance and toggle on click', () => {
      fixtureEl.innerHTML = markup()

      const toggle = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const showSpy = jasmine.createSpy('show')
      toggle.addEventListener('show.bs.combobox', showSpy)

      toggle.click()

      expect(Combobox.getInstance(toggle)).not.toBeNull()
      expect(showSpy).toHaveBeenCalled()
    })
  })
})
