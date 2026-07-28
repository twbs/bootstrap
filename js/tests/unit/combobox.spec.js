import Combobox from '../../src/combobox.js'
import EventHandler from '../../src/dom/event-handler.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Combobox', () => {
  let fixtureEl

  const ITEMS = [
    '<button class="menu-item" type="button" data-bs-value="us">United States</button>',
    '<button class="menu-item" type="button" data-bs-value="uk">United Kingdom</button>',
    '<button class="menu-item" type="button" data-bs-value="ca">Canada</button>'
  ].join('')

  const markup = ({ items = ITEMS, search = '', noResults = '', toggleAttrs = '' } = {}) => [
    `<button class="form-control combobox-toggle" type="button" data-bs-toggle="combobox" ${toggleAttrs}>`,
    '  <span class="combobox-value"></span>',
    '</button>',
    '<div class="menu">',
    search,
    items,
    noResults,
    '</div>'
  ].join('')

  const SEARCH_HTML = '<div class="combobox-search"><input type="text" class="form-control combobox-search-input"></div>'
  const NO_RESULTS_HTML = '<div class="combobox-no-results d-none">No results found</div>'

  const makeCombobox = (config, html = markup()) => {
    fixtureEl.innerHTML = html
    const toggleEl = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
    const menuEl = fixtureEl.querySelector('.menu')

    return {
      toggleEl,
      menuEl,
      valueEl: fixtureEl.querySelector('.combobox-value'),
      items: [...menuEl.querySelectorAll('.menu-item[data-bs-value]')],
      combobox: new Combobox(toggleEl, config)
    }
  }

  const keydown = (target, key) => {
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
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
      expect(Combobox.VERSION).toEqual(jasmine.any(String))
      expect(Combobox.NAME).toEqual('combobox')
      expect(Combobox.Default).toEqual(jasmine.any(Object))
      expect(Combobox.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should show the placeholder when nothing is selected', () => {
      const { valueEl } = makeCombobox({ placeholder: 'Pick one…' })

      expect(valueEl.textContent).toEqual('Pick one…')
      expect(valueEl).toHaveClass('combobox-placeholder')
    })

    it('should not create a hidden input without a name', () => {
      const { toggleEl } = makeCombobox()

      expect(toggleEl.parentNode.querySelector('input[type="hidden"]')).toBeNull()
    })

    it('should create a hidden input before the toggle when a name is given', () => {
      const { toggleEl } = makeCombobox({ name: 'country' })
      const hiddenInput = fixtureEl.querySelector('input[type="hidden"]')

      expect(hiddenInput).not.toBeNull()
      expect(hiddenInput.name).toEqual('country')
      expect(hiddenInput.value).toEqual('')
      expect(hiddenInput.nextElementSibling).toEqual(toggleEl)
    })

    it('should sync an item pre-selected in the markup', () => {
      const preSelected = [
        '<button class="menu-item selected" type="button" data-bs-value="ca">Canada</button>',
        '<button class="menu-item" type="button" data-bs-value="us">United States</button>'
      ].join('')
      const { valueEl } = makeCombobox({ name: 'country', placeholder: 'Pick one…' }, markup({ items: preSelected }))

      expect(valueEl.textContent).toEqual('Canada')
      expect(valueEl).not.toHaveClass('combobox-placeholder')
      expect(fixtureEl.querySelector('input[type="hidden"]').value).toEqual('ca')
    })
  })

  describe('show', () => {
    it('should show the menu and fire show then shown', () => {
      const { combobox, toggleEl, menuEl } = makeCombobox()
      const showSpy = jasmine.createSpy('show')
      const shownSpy = jasmine.createSpy('shown')

      EventHandler.on(toggleEl, 'show.bs.combobox', showSpy)
      EventHandler.on(toggleEl, 'shown.bs.combobox', shownSpy)

      combobox.show()

      expect(menuEl).toHaveClass('show')
      expect(showSpy).toHaveBeenCalled()
      expect(shownSpy).toHaveBeenCalled()
    })

    it('should not show when the show event is prevented', () => {
      const { combobox, toggleEl, menuEl } = makeCombobox()

      EventHandler.on(toggleEl, 'show.bs.combobox', event => event.preventDefault())

      combobox.show()

      expect(menuEl).not.toHaveClass('show')
    })

    it('should do nothing when the toggle is disabled', () => {
      const { combobox, toggleEl, menuEl } = makeCombobox()
      toggleEl.setAttribute('disabled', 'disabled')

      combobox.show()

      expect(menuEl).not.toHaveClass('show')
    })

    it('should not fire show twice when already shown', () => {
      const { combobox, toggleEl } = makeCombobox()
      combobox.show()

      const showSpy = jasmine.createSpy('show')
      EventHandler.on(toggleEl, 'show.bs.combobox', showSpy)

      combobox.show()

      expect(showSpy).not.toHaveBeenCalled()
    })

    it('should reset and focus the search input', () => {
      const { combobox, menuEl } = makeCombobox(
        { search: true },
        markup({ search: SEARCH_HTML })
      )
      const searchEl = menuEl.querySelector('.combobox-search-input')
      searchEl.value = 'stale'

      combobox.show()

      expect(searchEl.value).toEqual('')

      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(document.activeElement).toEqual(searchEl)
          resolve()
        })
      })
    })
  })

  describe('hide', () => {
    it('should hide the menu and fire hide then hidden', () => {
      const { combobox, toggleEl, menuEl } = makeCombobox()
      combobox.show()

      const hideSpy = jasmine.createSpy('hide')
      const hiddenSpy = jasmine.createSpy('hidden')
      EventHandler.on(toggleEl, 'hide.bs.combobox', hideSpy)
      EventHandler.on(toggleEl, 'hidden.bs.combobox', hiddenSpy)

      combobox.hide()

      expect(menuEl).not.toHaveClass('show')
      expect(hideSpy).toHaveBeenCalled()
      expect(hiddenSpy).toHaveBeenCalled()
    })

    it('should do nothing when already hidden', () => {
      const { combobox, toggleEl } = makeCombobox()
      const hideSpy = jasmine.createSpy('hide')
      EventHandler.on(toggleEl, 'hide.bs.combobox', hideSpy)

      combobox.hide()

      expect(hideSpy).not.toHaveBeenCalled()
    })

    it('should not hide when the hide event is prevented', () => {
      const { combobox, toggleEl, menuEl } = makeCombobox()
      combobox.show()

      EventHandler.on(toggleEl, 'hide.bs.combobox', event => event.preventDefault())

      combobox.hide()

      expect(menuEl).toHaveClass('show')
    })
  })

  describe('toggle', () => {
    it('should show when hidden and hide when shown', () => {
      const { combobox, menuEl } = makeCombobox()

      combobox.toggle()
      expect(menuEl).toHaveClass('show')

      combobox.toggle()
      expect(menuEl).not.toHaveClass('show')
    })
  })

  describe('single selection', () => {
    it('should select an item on click and update the toggle text', () => {
      const { toggleEl, valueEl, items } = makeCombobox({ name: 'country' })

      items[1].click()

      expect(items[1]).toHaveClass('selected')
      expect(items[1].getAttribute('aria-selected')).toEqual('true')
      expect(valueEl.textContent).toEqual('United Kingdom')
      expect(fixtureEl.querySelector('input[type="hidden"]').value).toEqual('uk')
      expect(toggleEl.parentNode).not.toBeNull()
    })

    it('should deselect the previous item', () => {
      const { items } = makeCombobox()

      items[0].click()
      items[2].click()

      expect(items[0]).not.toHaveClass('selected')
      expect(items[0].getAttribute('aria-selected')).toEqual('false')
      expect(items[2]).toHaveClass('selected')
    })

    // `change` is in EventHandler's native event list, so `EventHandler.on` binds
    // to plain `change` while `trigger` dispatches the full `change.bs.combobox`
    // type. Listen natively, the same way datepicker.spec.js does.
    it('should fire change with the selected value and item', () => {
      const { toggleEl, items } = makeCombobox()
      const changeSpy = jasmine.createSpy('change')
      toggleEl.addEventListener('change.bs.combobox', changeSpy)

      items[0].click()

      expect(changeSpy).toHaveBeenCalled()
      const event = changeSpy.calls.mostRecent().args[0]
      expect(event.value).toEqual('us')
      expect(event.item).toEqual(items[0])
    })

    it('should hide the menu after selecting', () => {
      const { combobox, menuEl, items } = makeCombobox()
      combobox.show()

      items[0].click()

      expect(menuEl).not.toHaveClass('show')
    })

    it('should ignore a disabled item', () => {
      const disabledItems = [
        '<button class="menu-item disabled" type="button" data-bs-value="us">United States</button>',
        '<button class="menu-item" type="button" data-bs-value="uk">United Kingdom</button>'
      ].join('')
      const { items, valueEl } = makeCombobox({ placeholder: 'Pick one…' }, markup({ items: disabledItems }))

      items[0].click()

      expect(items[0]).not.toHaveClass('selected')
      expect(valueEl.textContent).toEqual('Pick one…')
    })
  })

  describe('multiple selection', () => {
    it('should toggle selection and keep the menu open', () => {
      const { combobox, menuEl, items } = makeCombobox({ multiple: true })
      combobox.show()

      items[0].click()

      expect(items[0]).toHaveClass('selected')
      expect(items[0].getAttribute('aria-selected')).toEqual('true')
      expect(menuEl).toHaveClass('show')

      items[0].click()

      expect(items[0]).not.toHaveClass('selected')
      expect(items[0].getAttribute('aria-selected')).toEqual('false')
    })

    it('should count the selection when more than one item is chosen', () => {
      const { valueEl, items } = makeCombobox({ multiple: true, name: 'countries' })

      items[0].click()
      expect(valueEl.textContent).toEqual('United States')

      items[1].click()
      expect(valueEl.textContent).toEqual('2 selected')
      expect(fixtureEl.querySelector('input[type="hidden"]').value).toEqual('us,uk')
    })

    it('should fire change with every selected value', () => {
      const { toggleEl, items } = makeCombobox({ multiple: true })
      const changeSpy = jasmine.createSpy('change')
      toggleEl.addEventListener('change.bs.combobox', changeSpy)

      items[0].click()
      items[2].click()

      expect(changeSpy.calls.mostRecent().args[0].value).toEqual(['us', 'ca'])
    })

    it('should fall back to the placeholder when the last item is deselected', () => {
      const { valueEl, items } = makeCombobox({ multiple: true, placeholder: 'Pick some…' })

      items[0].click()
      items[0].click()

      expect(valueEl.textContent).toEqual('Pick some…')
      expect(valueEl).toHaveClass('combobox-placeholder')
    })
  })

  describe('search', () => {
    const searchMarkup = () => markup({ search: SEARCH_HTML, noResults: NO_RESULTS_HTML })

    const typeSearch = (searchEl, value) => {
      searchEl.value = value
      searchEl.dispatchEvent(new Event('input', { bubbles: true }))
    }

    it('should filter items by text', () => {
      const { menuEl, items } = makeCombobox({ search: true }, searchMarkup())
      const searchEl = menuEl.querySelector('.combobox-search-input')

      typeSearch(searchEl, 'united k')

      expect(items[0].style.display).toEqual('none')
      expect(items[1].style.display).toEqual('')
      expect(items[2].style.display).toEqual('none')
    })

    it('should show every item again for an empty query', () => {
      const { menuEl, items } = makeCombobox({ search: true }, searchMarkup())
      const searchEl = menuEl.querySelector('.combobox-search-input')

      typeSearch(searchEl, 'canada')
      typeSearch(searchEl, '')

      expect(items.every(item => item.style.display === '')).toBeTrue()
    })

    it('should toggle the no-results element', () => {
      const { menuEl } = makeCombobox({ search: true }, searchMarkup())
      const searchEl = menuEl.querySelector('.combobox-search-input')
      const noResultsEl = menuEl.querySelector('.combobox-no-results')

      typeSearch(searchEl, 'nowhere')
      expect(noResultsEl).not.toHaveClass('d-none')

      typeSearch(searchEl, 'canada')
      expect(noResultsEl).toHaveClass('d-none')
    })

    it('should ignore diacritics when searchNormalize is on', () => {
      const accented = '<button class="menu-item" type="button" data-bs-value="fr">Réunion</button>'
      const { menuEl, items } = makeCombobox(
        { search: true, searchNormalize: true },
        markup({ items: accented, search: SEARCH_HTML })
      )
      const searchEl = menuEl.querySelector('.combobox-search-input')

      typeSearch(searchEl, 'reunion')

      expect(items[0].style.display).toEqual('')
    })

    it('should respect diacritics when searchNormalize is off', () => {
      const accented = '<button class="menu-item" type="button" data-bs-value="fr">Réunion</button>'
      const { menuEl, items } = makeCombobox(
        { search: true },
        markup({ items: accented, search: SEARCH_HTML })
      )
      const searchEl = menuEl.querySelector('.combobox-search-input')

      typeSearch(searchEl, 'reunion')

      expect(items[0].style.display).toEqual('none')
    })

    it('should move focus to the first item on ArrowDown', () => {
      const { combobox, menuEl, items } = makeCombobox({ search: true }, searchMarkup())
      const searchEl = menuEl.querySelector('.combobox-search-input')
      combobox.show()

      keydown(searchEl, 'ArrowDown')

      expect(document.activeElement).toEqual(items[0])
    })

    it('should hide on Escape from the search input', () => {
      const { combobox, menuEl, toggleEl } = makeCombobox({ search: true }, searchMarkup())
      const searchEl = menuEl.querySelector('.combobox-search-input')
      combobox.show()

      keydown(searchEl, 'Escape')

      expect(menuEl).not.toHaveClass('show')
      expect(document.activeElement).toEqual(toggleEl)
    })
  })

  describe('keyboard on the toggle', () => {
    it('should open and focus the first item on ArrowDown', () => {
      const { toggleEl, menuEl, items } = makeCombobox()

      keydown(toggleEl, 'ArrowDown')

      expect(menuEl).toHaveClass('show')
      expect(document.activeElement).toEqual(items[0])
    })

    it('should open and focus the last item on ArrowUp', () => {
      const { toggleEl, menuEl, items } = makeCombobox()

      keydown(toggleEl, 'ArrowUp')

      expect(menuEl).toHaveClass('show')
      expect(document.activeElement).toEqual(items.at(-1))
    })

    it('should open on Enter and on Space', () => {
      const first = makeCombobox()
      keydown(first.toggleEl, 'Enter')
      expect(first.menuEl).toHaveClass('show')

      clearFixture()

      const second = makeCombobox()
      keydown(second.toggleEl, ' ')
      expect(second.menuEl).toHaveClass('show')
    })
  })

  describe('keyboard in the menu', () => {
    it('should hide and refocus the toggle on Escape', () => {
      const { combobox, toggleEl, menuEl, items } = makeCombobox()
      combobox.show()

      keydown(items[0], 'Escape')

      expect(menuEl).not.toHaveClass('show')
      expect(document.activeElement).toEqual(toggleEl)
    })

    it('should hide on Tab', () => {
      const { combobox, menuEl, items } = makeCombobox()
      combobox.show()

      keydown(items[0], 'Tab')

      expect(menuEl).not.toHaveClass('show')
    })

    it('should move focus with ArrowDown and ArrowUp', () => {
      const { combobox, items } = makeCombobox()
      combobox.show()
      items[0].focus()

      keydown(items[0], 'ArrowDown')
      expect(document.activeElement).toEqual(items[1])

      keydown(items[1], 'ArrowUp')
      expect(document.activeElement).toEqual(items[0])
    })

    it('should jump to the first item on Home and the last on End', () => {
      const { combobox, items } = makeCombobox()
      combobox.show()
      items[1].focus()

      keydown(items[1], 'End')
      expect(document.activeElement).toEqual(items.at(-1))

      keydown(items.at(-1), 'Home')
      expect(document.activeElement).toEqual(items[0])
    })

    it('should select the focused item on Enter', () => {
      const { combobox, items, valueEl } = makeCombobox()
      combobox.show()

      keydown(items[1], 'Enter')

      expect(items[1]).toHaveClass('selected')
      expect(valueEl.textContent).toEqual('United Kingdom')
    })

    it('should select the focused item on Space', () => {
      const { combobox, items } = makeCombobox()
      combobox.show()

      keydown(items[2], ' ')

      expect(items[2]).toHaveClass('selected')
    })
  })

  describe('dispose', () => {
    it('should remove the hidden input and drop the instance', () => {
      const { combobox, toggleEl } = makeCombobox({ name: 'country' })

      expect(fixtureEl.querySelector('input[type="hidden"]')).not.toBeNull()

      combobox.dispose()

      expect(fixtureEl.querySelector('input[type="hidden"]')).toBeNull()
      expect(Combobox.getInstance(toggleEl)).toBeNull()
    })
  })

  describe('data api', () => {
    it('should toggle on a click on the toggle', () => {
      fixtureEl.innerHTML = markup()
      const toggleEl = fixtureEl.querySelector('[data-bs-toggle="combobox"]')
      const menuEl = fixtureEl.querySelector('.menu')

      toggleEl.click()

      expect(menuEl).toHaveClass('show')
    })

    it('should read the config from data attributes', () => {
      fixtureEl.innerHTML = markup({
        toggleAttrs: 'data-bs-name="country" data-bs-placeholder="Pick one…"'
      })
      const toggleEl = fixtureEl.querySelector('[data-bs-toggle="combobox"]')

      const combobox = new Combobox(toggleEl)

      expect(combobox._config.name).toEqual('country')
      expect(fixtureEl.querySelector('.combobox-value').textContent).toEqual('Pick one…')
    })
  })
})
