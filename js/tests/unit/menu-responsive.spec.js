import { page, userEvent } from 'vitest/browser'
import bootstrapCss from '../../../scss/bootstrap.scss?inline'
import Drawer from '../../src/drawer.js'
import Menu from '../../src/menu.js'

describe('Menu layout and focus', () => {
  let fixture
  let style
  let viewport

  beforeEach(async () => {
    viewport = { width: window.innerWidth, height: window.innerHeight }
    await page.viewport(390, 700)
    style = document.createElement('style')
    style.textContent = bootstrapCss
    document.head.append(style)
    fixture = document.createElement('div')
    fixture.style.padding = '1rem'
    document.body.append(fixture)
  })

  afterEach(async () => {
    fixture.remove()
    style.remove()
    await page.viewport(viewport.width, viewport.height)
  })

  for (const inDrawer of [false, true]) {
    it(`should keep nested items visible ${inDrawer ? 'inside a drawer' : 'on a phone'}`, async () => {
      const markup = `
        <button data-bs-toggle="menu" type="button">Tools</button>
        <div class="menu">
          <button class="menu-item" type="button">
            <span class="menu-item-content">
              Calculator
              <span class="menu-item-description">Calculate the number of concurrent calls on a SIP trunk</span>
            </span>
          </button>
          <div class="submenu">
            <button class="menu-item" type="button">Network tools</button>
            <div class="menu">
              <div class="submenu">
                <button class="menu-item" type="button">DNS tools</button>
                <div class="menu"><button class="menu-item" type="button">DNS lookup</button></div>
              </div>
            </div>
          </div>
        </div>`
      fixture.innerHTML = inDrawer ?
        `<dialog class="drawer drawer-start drawer-instant"><div class="drawer-body navbar-nav">${markup}</div></dialog>` :
        markup

      const drawer = inDrawer ? new Drawer(fixture.querySelector('.drawer')) : null
      const toggle = fixture.querySelector('[data-bs-toggle="menu"]')
      const menu = new Menu(toggle)
      const rootMenu = toggle.nextElementSibling
      const [trigger, nestedTrigger] = fixture.querySelectorAll('.submenu > .menu-item')

      try {
        await drawer?.show()
        await menu.show()
        expect(rootMenu.firstElementChild).toBeVisible()

        trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' }))
        trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        trigger.click()
        expect(rootMenu.firstElementChild).not.toBeVisible()
        expect(document.activeElement.textContent).toEqual('Back')

        nestedTrigger.focus()
        nestedTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
        const panel = nestedTrigger.nextElementSibling
        const back = panel.querySelector('.menu-back > button')
        await new Promise(resolve => {
          requestAnimationFrame(resolve)
        })
        expect(document.activeElement).toEqual(back)
        expect(nestedTrigger).not.toBeVisible()

        const action = panel.lastElementChild
        const { left, right, top, height } = action.getBoundingClientRect()
        const bounds = inDrawer ? fixture.querySelector('.drawer-body').getBoundingClientRect() : { left: 0, right: 390 }
        expect(left).toBeGreaterThanOrEqual(bounds.left)
        expect(right).toBeLessThanOrEqual(bounds.right)
        expect(document.elementFromPoint((left + right) / 2, top + (height / 2))).toEqual(action)

        back.click()
        expect(document.activeElement).toEqual(nestedTrigger)
        nestedTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
        expect(document.activeElement).toEqual(trigger)
        expect(rootMenu.firstElementChild).toBeVisible()
      } finally {
        await menu.hide()
        menu.dispose()
        await drawer?.hide()
        drawer?.dispose()
      }
    })
  }

  it('should distinguish keyboard focus from active and hover states', async () => {
    fixture.innerHTML = `
      <button type="button" data-bs-toggle="menu">Options</button>
      <div class="menu">
        <button type="button" class="menu-item active">Active item</button>
        <button type="button" class="menu-item">Hover item</button>
      </div>`

    const toggle = fixture.firstElementChild
    const [active, hover] = fixture.querySelectorAll('.menu-item')
    const menu = new Menu(toggle)
    try {
      await menu.show()
      const activeBackground = getComputedStyle(active).backgroundColor
      const defaultBackground = getComputedStyle(hover).backgroundColor
      await page.getByRole('button', { name: 'Hover item' }).hover()
      const hoverBackground = getComputedStyle(hover).backgroundColor
      expect(hoverBackground).not.toEqual(defaultBackground)
      await userEvent.keyboard('{ArrowDown}')
      expect(document.activeElement).toEqual(active)
      expect(getComputedStyle(active).backgroundColor).not.toEqual(activeBackground)
      expect(getComputedStyle(active).backgroundColor).not.toEqual(hoverBackground)
      expect(getComputedStyle(hover).backgroundColor).toEqual(hoverBackground)
      expect(getComputedStyle(active).outlineStyle).toEqual('none')
    } finally {
      await menu.hide()
      menu.dispose()
    }
  })

  it('should preserve arrow and Home or End keys on a native select', async () => {
    fixture.innerHTML = `
      <button type="button" data-bs-toggle="menu">Options</button>
      <div class="menu">
        <select class="menu-item" aria-label="Choice"><option>A</option><option>B</option></select>
        <button class="menu-item" type="button">Action</button>
      </div>`

    const menu = new Menu(fixture.firstElementChild)
    const select = fixture.querySelector('select')
    try {
      await menu.show()
      select.focus()
      for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
        expect(select.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))).toBe(true)
        expect(document.activeElement).toEqual(select)
      }
    } finally {
      await menu.hide()
      menu.dispose()
    }
  })

  it('should follow the toggle in the tab order when appended to body', async () => {
    fixture.innerHTML = `
      <input aria-label="Before">
      <button type="button" data-bs-toggle="menu">Options</button>
      <div class="menu"><input aria-label="First"><input aria-label="Last"></div>
      <input aria-label="After">`

    const toggle = fixture.querySelector('button')
    const panel = fixture.querySelector('.menu')
    const [first, last] = panel.querySelectorAll('input')
    const after = fixture.lastElementChild
    const menu = new Menu(toggle, { container: 'body' })
    try {
      await menu.show()
      expect(panel.parentElement).toEqual(document.body)
      await userEvent.tab()
      expect(document.activeElement).toEqual(first)
      await userEvent.tab({ shift: true })
      expect(document.activeElement).toEqual(toggle)
      await userEvent.tab()
      await userEvent.tab()
      expect(document.activeElement).toEqual(last)
      await userEvent.tab()
      expect(document.activeElement).toEqual(after)
      expect(toggle.getAttribute('aria-expanded')).toEqual('false')
      await expect.poll(() => toggle.nextElementSibling).toEqual(panel)
    } finally {
      await menu.hide()
      menu.dispose()
    }
  })

  it('should stack a submenu inside a scrollable desktop menu', async () => {
    await page.viewport(960, 650)
    fixture.innerHTML = `
      <button type="button" data-bs-toggle="menu">Options</button>
      <div class="menu menu-scrollable">
        <button class="menu-item" type="button">Parent action</button>
        <div class="submenu">
          <button class="menu-item" type="button">More</button>
          <div class="menu"><button class="menu-item" type="button">Child action</button></div>
        </div>
      </div>`

    const menu = new Menu(fixture.firstElementChild)
    const trigger = fixture.querySelector('.submenu > button')
    const child = fixture.querySelector('.submenu .menu-item:last-child')
    try {
      await menu.show()
      trigger.click()
      const { x, y, width, height } = child.getBoundingClientRect()
      expect(document.elementFromPoint(x + (width / 2), y + (height / 2))).toEqual(child)
      document.activeElement.click()
      expect(document.activeElement).toEqual(trigger)
    } finally {
      await menu.hide()
      menu.dispose()
    }
  })

  it('should wrap long labels and scroll a tall menu into view in a fixed toolbar', async () => {
    await page.viewport(320, 500)
    fixture.style.position = 'fixed'
    fixture.style.inset = '0 auto auto 0'
    const actions = Array.from({ length: 27 }, (_, index) =>
      `<button class="menu-item" type="button">${index === 0 ? 'An item with a very long label that cannot fit on a narrow phone without wrapping' : `Item ${index}`}</button>`
    )
    fixture.innerHTML = `<button type="button" data-bs-toggle="menu">Options</button><div class="menu">${actions.join('')}</div>`

    const toggle = fixture.firstElementChild
    const panel = toggle.nextElementSibling
    const last = panel.lastElementChild
    const menu = new Menu(toggle)
    try {
      await menu.show()
      await expect.poll(() => panel.getBoundingClientRect().right).toBeLessThanOrEqual(320)
      await userEvent.keyboard('{ArrowDown}{End}')
      expect(document.activeElement).toEqual(last)
      await expect.poll(() => panel.scrollTop).toBeGreaterThan(0)
      const { x, y, width, height } = last.getBoundingClientRect()
      expect(document.elementFromPoint(x + (width / 2), y + (height / 2))).toEqual(last)
    } finally {
      await menu.hide()
      menu.dispose()
    }
  })
})
