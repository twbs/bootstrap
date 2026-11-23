import { userEvent } from 'vitest/browser'
import styles from '../../../scss/bootstrap.scss?inline'
import Dialog from '../../src/dialog.js'
import Drawer from '../../src/drawer.js'
import Menu from '../../src/menu.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Dialog and Drawer regressions', () => {
  let fixture
  let stylesheet
  let direction

  beforeAll(() => {
    fixture = getFixture()
    stylesheet = document.createElement('style')
    stylesheet.textContent = styles
    document.head.append(stylesheet)
  })

  beforeEach(() => {
    direction = document.documentElement.dir
  })

  afterEach(() => {
    for (const dialog of fixture.querySelectorAll('dialog')) {
      Dialog.getInstance(dialog)?.dispose()
      Drawer.getInstance(dialog)?.dispose()
      dialog.close()
    }

    document.documentElement.dir = direction
    clearFixture()
  })

  afterAll(() => {
    stylesheet.remove()
  })

  for (const Component of [Dialog, Drawer]) {
    const name = Component.NAME

    it(`should allow a ${name} to close while opening`, async () => {
      fixture.innerHTML = `<dialog class="${name} drawer-start"></dialog>`
      const element = fixture.querySelector('dialog')
      const component = new Component(element)
      const shown = jasmine.createSpy('shown')
      const hidden = jasmine.createSpy('hidden')
      element.addEventListener(`shown.bs.${name}`, shown)
      element.addEventListener(`hidden.bs.${name}`, hidden)

      const opening = component.show()
      await component.hide()
      await opening

      expect(element.open).toBeFalse()
      expect(shown).not.toHaveBeenCalled()
      expect(hidden).toHaveBeenCalledTimes(1)
    })

    it(`should keep a modal ${name} open after repeated Escape presses with keyboard disabled`, async () => {
      fixture.innerHTML = `<dialog class="${name}"><button>Save</button></dialog>`
      const element = fixture.querySelector('dialog')
      const component = new Component(element, { keyboard: false })
      const preventHide = jasmine.createSpy('hidePrevented')
      element.addEventListener(`hidePrevented.bs.${name}`, preventHide)

      await component.show()
      await userEvent.keyboard('{Escape}{Escape}{Escape}')

      expect(element.open).toBeTrue()
      expect(preventHide).toHaveBeenCalledTimes(3)
    })

    it(`should ignore a file input cancel event inside a ${name}`, async () => {
      fixture.innerHTML = `<dialog class="${name} ${name}-instant"><input type="file"></dialog>`
      const element = fixture.querySelector('dialog')
      const component = new Component(element)
      const cancel = new Event('cancel', { bubbles: true, cancelable: true })

      await component.show()
      element.querySelector('input').dispatchEvent(cancel)

      expect(element.open).toBeTrue()
      expect(cancel.defaultPrevented).toBeFalse()
    })
  }

  it('should clean up a native close during entry and preserve the return value', async () => {
    fixture.innerHTML = '<dialog class="dialog"></dialog>'
    const element = fixture.querySelector('dialog')
    const dialog = new Dialog(element, { modal: false })
    const shown = jasmine.createSpy('shown')
    element.addEventListener('shown.bs.dialog', shown)
    const hidden = new Promise(resolve => {
      element.addEventListener('hidden.bs.dialog', resolve, { once: true })
    })

    const opening = dialog.show()
    element.close('saved')
    await hidden
    await opening

    expect(shown).not.toHaveBeenCalled()
    expect(element.returnValue).toEqual('saved')
    expect(element.classList.contains('dialog-nonmodal')).toBeFalse()
  })

  it('should release the scroll lock when its last owner is removed', async () => {
    fixture.innerHTML = '<dialog class="dialog dialog-instant"></dialog>'
    const element = fixture.querySelector('dialog')
    const dialog = new Dialog(element)
    await dialog.show()

    const hidden = new Promise(resolve => {
      element.addEventListener('hidden.bs.dialog', resolve, { once: true })
    })
    element.remove()
    await hidden

    expect(document.documentElement.classList.contains('dialog-open')).toBeFalse()
    expect(element.open).toBeFalse()
    dialog.dispose()
  })

  it('should restore focus to the original opener when a swapped dialog closes natively', async () => {
    fixture.innerHTML = [
      '<button id="opener" data-bs-toggle="dialog" data-bs-target="#first-dialog">Open</button>',
      '<dialog class="dialog dialog-instant" id="first-dialog">',
      '  <button data-bs-toggle="dialog" data-bs-target="#second-dialog">Next</button>',
      '</dialog>',
      '<dialog class="dialog dialog-instant" id="second-dialog"><button>Close</button></dialog>'
    ].join('')
    const opener = fixture.querySelector('#opener')
    const [first, second] = fixture.querySelectorAll('dialog')
    const hidden = new Promise(resolve => {
      second.addEventListener('hidden.bs.dialog', resolve, { once: true })
    })

    opener.focus()
    opener.click()
    first.querySelector('button').click()
    second.close()
    await hidden

    expect(document.activeElement).toEqual(opener)
  })

  for (const [event, index] of [['hide.bs.drawer', 0], ['show.bs.drawer', 1]]) {
    it(`should keep the current drawer open when ${event} cancels a switch`, async () => {
      fixture.innerHTML = [
        '<dialog class="drawer drawer-start drawer-instant">',
        '  <button data-bs-toggle="drawer" data-bs-target="#second-drawer">Next</button>',
        '</dialog>',
        '<dialog class="drawer drawer-end drawer-instant" id="second-drawer"></dialog>'
      ].join('')
      const drawers = fixture.querySelectorAll('dialog')
      await new Drawer(drawers[0]).show()
      drawers[index].addEventListener(event, e => e.preventDefault(), { once: true })

      fixture.querySelector('button').click()

      expect(drawers[0].open).toBeTrue()
      expect(drawers[1].open).toBeFalse()
    })
  }

  it('should transition a responsive drawer to inline after a resize during entry', async () => {
    fixture.innerHTML = '<dialog class="lg:drawer drawer-start" aria-label="Navigation"><button>Close</button></dialog>'
    const element = fixture.querySelector('dialog')
    element.style.setProperty('--drawer-inline', '0')
    const drawer = new Drawer(element)
    const opening = drawer.show()
    element.style.setProperty('--drawer-inline', '1')
    const hidden = new Promise(resolve => {
      element.addEventListener('hidden.bs.drawer', resolve, { once: true })
    })

    window.dispatchEvent(new Event('resize'))
    await hidden
    await opening
    window.dispatchEvent(new Event('resize'))

    expect(element.open).toBeFalse()
    expect(document.documentElement.classList.contains('dialog-open')).toBeFalse()
    expect(element.getAttribute('role')).toEqual('presentation')
    expect(element.hasAttribute('aria-label')).toBeFalse()

    element.style.setProperty('--drawer-inline', '0')
    window.dispatchEvent(new Event('resize'))
    expect(element.getAttribute('aria-label')).toEqual('Navigation')
    expect(element.hasAttribute('role')).toBeFalse()
  })

  it('should keep a modal drawer without a visible backdrop', async () => {
    fixture.innerHTML = '<dialog class="drawer drawer-start drawer-instant"></dialog>'
    const element = fixture.querySelector('dialog')
    await new Drawer(element, { backdrop: false }).show()

    expect(element.matches(':modal')).toBeTrue()
    expect(getComputedStyle(element, '::backdrop').backgroundColor).toEqual('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(element, '::backdrop').backdropFilter).toEqual('none')
  })

  it('should only dismiss on a gesture that starts and ends outside the dialog', async () => {
    fixture.innerHTML = '<dialog class="dialog dialog-instant" closedby="any"><button>Close</button></dialog>'
    const element = fixture.querySelector('dialog')
    await new Dialog(element).show()
    expect(element.getAttribute('closedby')).toEqual('closerequest')
    const { top, left } = element.getBoundingClientRect()
    const inside = { clientX: Math.ceil(left) + 2, clientY: Math.ceil(top) + 2, detail: 1 }
    const outside = { ...inside, clientY: Math.floor(top) - 10 }

    element.dispatchEvent(new PointerEvent('pointerdown', inside))
    element.dispatchEvent(new MouseEvent('click', outside))
    expect(element.open).toBeTrue()

    element.dispatchEvent(new PointerEvent('pointerdown', outside))
    element.dispatchEvent(new MouseEvent('click', inside))
    expect(element.open).toBeTrue()

    element.dispatchEvent(new PointerEvent('pointerdown', outside))
    element.dispatchEvent(new MouseEvent('click', outside))
    expect(element.open).toBeFalse()
    expect(element.getAttribute('closedby')).toEqual('any')
  })

  it('should keep the scroll lock until the last native modal closes', async () => {
    fixture.innerHTML = [
      '<dialog class="dialog dialog-instant"><form method="dialog"><button value="save">Save</button></form></dialog>',
      '<dialog class="drawer drawer-instant" id="native-close-drawer">',
      '  <button type="button" command="close" commandfor="native-close-drawer">Close</button>',
      '</dialog>'
    ].join('')
    const [dialog, drawer] = fixture.querySelectorAll('dialog')
    await new Drawer(drawer).show()
    await new Dialog(dialog).show()
    const dialogClosed = new Promise(resolve => {
      dialog.addEventListener('close', resolve, { once: true })
    })
    const submit = dialog.querySelector('button')
    dialog.querySelector('form').requestSubmit(submit)
    await dialogClosed

    expect(dialog.returnValue).toEqual('save')
    expect(document.documentElement.classList.contains('dialog-open')).toBeTrue()

    const drawerClosed = new Promise(resolve => {
      drawer.addEventListener('close', resolve, { once: true })
    })
    drawer.querySelector('button').click()
    await drawerClosed

    expect(document.documentElement.classList.contains('dialog-open')).toBeFalse()
  })

  it('should retain the scroll lock if a dialog reopens before its native close event', async () => {
    fixture.innerHTML = '<dialog class="dialog dialog-instant"></dialog>'
    const element = fixture.querySelector('dialog')
    const dialog = new Dialog(element)
    await dialog.show()

    const closed = new Promise(resolve => {
      element.addEventListener('close', resolve, { once: true })
    })
    element.close()
    await dialog.show()
    await closed

    expect(element.open).toBeTrue()
    expect(document.documentElement.classList.contains('dialog-open')).toBeTrue()
    await dialog.hide()
    expect(document.documentElement.classList.contains('dialog-open')).toBeFalse()
  })

  for (const dir of ['ltr', 'rtl']) {
    for (const placement of ['start', 'end']) {
      it(`should place an open ${placement} drawer on the correct side in ${dir}`, async () => {
        document.documentElement.dir = dir
        fixture.innerHTML = `<dialog class="drawer drawer-${placement}" open></dialog>`
        const drawer = fixture.querySelector('dialog')
        await Promise.all(drawer.getAnimations().map(animation => animation.finished))
        const { left, right } = drawer.getBoundingClientRect()
        const onLeft = (dir === 'ltr') === (placement === 'start')

        expect(getComputedStyle(drawer).transform).toEqual('none')
        expect(onLeft ? left : window.innerWidth - right).toBeCloseTo(16)
      })
    }
  }

  it('should set initial focus synchronously when an animated drawer opens', async () => {
    fixture.innerHTML = [
      '<dialog class="drawer drawer-start">',
      '  <div class="drawer-header"><button>Close</button></div>',
      '  <div class="drawer-body"><input autofocus></div>',
      '</dialog>'
    ].join('')
    const element = fixture.querySelector('dialog')
    const drawer = new Drawer(element)
    // Resolve the closed styles before the browser starts the transition.
    expect(getComputedStyle(element).visibility).toEqual('hidden')
    const shown = drawer.show()
    const initialFocus = document.activeElement
    expect(element.getAnimations().some(animation => animation.transitionProperty === 'transform')).toBeTrue()
    await shown

    expect(initialFocus).toEqual(element.querySelector('input'))

    const hidden = drawer.hide()
    expect(element.matches(':modal')).toBeTrue()
    expect(getComputedStyle(element).display).toEqual('flex')
    expect(element.getAnimations().some(animation => animation.transitionProperty === 'transform')).toBeTrue()
    await hidden
    expect(getComputedStyle(element).display).toEqual('none')
  })

  it('should focus a text-only drawer and keep it open when keyboard is disabled', async () => {
    fixture.innerHTML = '<dialog class="drawer drawer-start"><div class="drawer-body">Text</div></dialog>'
    const element = fixture.querySelector('dialog')
    const drawer = new Drawer(element, { keyboard: false })
    await drawer.show()

    expect(document.activeElement).toEqual(element)
    await userEvent.keyboard('{Escape}{Escape}{Escape}')
    expect(element.open).toBeTrue()
  })

  for (const className of ['drawer', 'md:drawer']) {
    it(`should close an uninstantiated ${className} when a toggle opens another drawer`, () => {
      fixture.innerHTML = [
        '<button data-bs-toggle="drawer" data-bs-target="#next-drawer">Switch</button>',
        `<dialog class="${className} drawer-instant" open></dialog>`,
        '<dialog class="drawer drawer-instant" id="next-drawer"></dialog>'
      ].join('')
      const [current, next] = fixture.querySelectorAll('dialog')

      fixture.querySelector('button').click()

      expect(current.open).toBeFalse()
      expect(next.open).toBeTrue()
    })
  }

  it('should leave the current drawer open when a toggle has no dialog target', async () => {
    fixture.innerHTML = [
      '<button data-bs-toggle="drawer" data-bs-target="#missing-drawer">Switch</button>',
      '<button data-bs-toggle="drawer" data-bs-target="#invalid-drawer">Switch</button>',
      '<div id="invalid-drawer"></div>',
      '<dialog class="drawer drawer-instant"></dialog>'
    ].join('')
    const element = fixture.querySelector('dialog')
    await new Drawer(element).show()

    for (const toggle of fixture.querySelectorAll('button')) {
      toggle.click()
    }

    expect(element.open).toBeTrue()
  })

  it('should close a Menu before its modal drawer on Escape', async () => {
    fixture.innerHTML = [
      '<dialog class="drawer drawer-start drawer-instant">',
      '  <div class="drawer-body">',
      '    <button data-bs-toggle="menu">Tools</button>',
      '    <div class="menu"><button class="menu-item">Save</button></div>',
      '  </div>',
      '</dialog>'
    ].join('')
    const element = fixture.querySelector('dialog')
    const drawer = new Drawer(element)
    const toggle = element.querySelector('[data-bs-toggle="menu"]')
    const menu = new Menu(toggle)

    try {
      await drawer.show()
      menu.show()
      element.querySelector('.menu-item').focus()
      await userEvent.keyboard('{Escape}')

      expect(toggle.getAttribute('aria-expanded')).toEqual('false')
      expect(element.open).toBeTrue()

      await userEvent.keyboard('{Escape}')
      expect(element.open).toBeFalse()
    } finally {
      menu.dispose()
    }
  })
})
