import Dropdown from '../../src/dropdown.js'
import { getFixture, clearFixture } from '../helpers/fixture.js'

describe('Dropdown submenu keyboard behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    clearFixture()
  })

  const getMenu = () => {
    return getFixture(`
      <ul class="dropdown-menu show" id="menu">
        <li class="dropend">
          <a class="dropdown-item dropdown-toggle" href="#" id="submenu1" data-bs-toggle="dropdown" data-bs-auto-close="outside">Submenu 1</a>
          <ul class="dropdown-menu dropdown-menu-end" id="menu1">
            <li class="dropdown-item">1A</li>
          </ul>
        </li>
        <li class="dropend">
          <a class="dropdown-item dropdown-toggle" href="#" id="submenu2" data-bs-toggle="dropdown" data-bs-auto-close="outside">Submenu 2</a>
          <ul class="dropdown-menu dropdown-menu-end" id="menu2">
            <li class="dropdown-item">2A</li>
          </ul>
        </li>
      </ul>
    `)
  }

  const pressKey = (element, key) => {
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true })
    )
  }

  it('should close previous submenu when navigating upward', () => {
    const fixture = getMenu()

    const submenu1Toggle = fixture.querySelector('#submenu1')
    const submenu2Toggle = fixture.querySelector('#submenu2')

    // Create dropdown instances (prefix with _ to avoid "unused var" lint errors)
    const _dd1 = Dropdown.getOrCreateInstance(submenu1Toggle)
    const _dd2 = Dropdown.getOrCreateInstance(submenu2Toggle)

    // Open submenu 1
    submenu1Toggle.click()
    const menu1 = fixture.querySelector('#menu1')
    expect(menu1.classList.contains('show')).toBeTrue()

    // Move down to submenu 2
    submenu2Toggle.focus()
    pressKey(submenu2Toggle, 'ArrowDown')
    submenu2Toggle.click()

    const menu2 = fixture.querySelector('#menu2')
    expect(menu2.classList.contains('show')).toBeTrue()

    // Navigate upward
    pressKey(submenu2Toggle, 'ArrowUp')

    // Expected behavior: submenu2 closed, submenu1 still open
    expect(menu2.classList.contains('show')).toBeFalse()
    expect(menu1.classList.contains('show')).toBeTrue()
  })
})
