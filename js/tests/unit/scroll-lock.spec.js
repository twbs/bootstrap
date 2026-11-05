import { vi } from 'vitest'
import Dialog from '../../src/dialog.js'
import Drawer from '../../src/drawer.js'

describe('Dialog and Drawer scroll locking', () => {
  const root = document.documentElement
  let container
  let instances
  let originalStyle
  let originalDir
  let originallyLocked

  beforeEach(() => {
    originalStyle = root.style.cssText
    originalDir = root.getAttribute('dir')
    originallyLocked = root.classList.contains('dialog-open')
    root.classList.remove('dialog-open')
    root.style.removeProperty('padding-left')
    root.style.removeProperty('padding-right')
    container = document.createElement('div')
    document.body.append(container)
    instances = []
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000)
    vi.spyOn(root, 'clientWidth', 'get').mockImplementation(() => root.classList.contains('dialog-open') ? 1000 : 980)
    vi.spyOn(root, 'offsetWidth', 'get').mockImplementation(() => root.classList.contains('dialog-open') ? 1000 : 980)
    vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, 1000, 800))
  })

  afterEach(() => {
    for (const instance of instances) {
      instance.dispose()
    }

    container.remove()
    root.style.cssText = originalStyle
    root.classList.toggle('dialog-open', originallyLocked)
    if (originalDir === null) {
      root.removeAttribute('dir')
    } else {
      root.setAttribute('dir', originalDir)
    }
  })

  const create = (Component = Dialog, config = {}) => {
    const element = document.createElement('dialog')
    element.className = `${Component.NAME} ${Component.NAME}-instant`
    container.append(element)
    const instance = new Component(element, config)
    instances.push(instance)
    return instance
  }

  it('compensates the removed gutter and restores existing inline values and priorities', async () => {
    root.style.setProperty('padding-right', '5px', 'important')
    const fixed = document.createElement('div')
    fixed.className = 'fixed-top'
    fixed.style.cssText = 'position: fixed; inset: 0 0 auto; margin-right: 3px !important'
    container.append(fixed)
    vi.spyOn(fixed, 'clientWidth', 'get').mockReturnValue(1000)
    vi.spyOn(fixed, 'offsetWidth', 'get').mockImplementation(() => root.classList.contains('dialog-open') ? 1000 : 980)
    const dialog = create()

    await dialog.show()

    expect(root.style.paddingRight).toBe('25px')
    expect(fixed.style.marginRight).toBe('23px')
    root.style.color = 'red'
    await dialog.hide()

    expect(root.style.paddingRight).toBe('5px')
    expect(root.style.getPropertyPriority('padding-right')).toBe('important')
    expect(fixed.style.marginRight).toBe('3px')
    expect(fixed.style.getPropertyPriority('margin-right')).toBe('important')
    expect(root.style.color).toBe('red')
    expect(root.classList.contains('dialog-open')).toBe(false)
  })

  it('does not add spacing for overlay scrollbars', async () => {
    vi.spyOn(root, 'clientWidth', 'get').mockReturnValue(1000)
    vi.spyOn(root, 'offsetWidth', 'get').mockReturnValue(1000)
    const dialog = create()

    await dialog.show()

    expect(root.classList.contains('dialog-open')).toBe(true)
    expect(root.style.paddingRight).toBe('')
    await dialog.hide()
    expect(root.style.paddingRight).toBe('')
  })

  it('does not double-compensate an application-owned stable gutter', async () => {
    root.style.scrollbarGutter = 'stable'
    // Chromium can report a larger viewport while the root box keeps its gutter.
    vi.spyOn(root, 'offsetWidth', 'get').mockReturnValue(980)
    const fixed = document.createElement('div')
    fixed.className = 'fixed-top'
    fixed.style.position = 'fixed'
    container.append(fixed)
    vi.spyOn(fixed, 'clientWidth', 'get').mockReturnValue(980)
    vi.spyOn(fixed, 'offsetWidth', 'get').mockReturnValue(980)
    const dialog = create()

    await dialog.show()

    expect(root.style.paddingRight).toBe('')
    await dialog.hide()
    expect(root.style.scrollbarGutter).toBe('stable')
    expect(fixed.style.marginRight).toBe('')
  })

  it('compensates a scrollbar on the left in RTL', async () => {
    root.dir = 'rtl'
    root.style.paddingLeft = '4px'
    vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => new DOMRect(root.classList.contains('dialog-open') ? 0 : 20, 0, 1000, 800))
    const dialog = create()

    await dialog.show()

    expect(root.style.paddingLeft).toBe('24px')
    expect(root.style.paddingRight).toBe('')
    await dialog.hide()
    expect(root.style.paddingLeft).toBe('4px')
  })

  it('uses the actual scrollbar side when an RTL browser keeps it on the right', async () => {
    root.dir = 'rtl'
    const dialog = create()

    await dialog.show()

    expect(root.style.paddingRight).toBe('20px')
    expect(root.style.paddingLeft).toBe('')
  })

  it('shares one compensation until the last scroll-locking component closes', async () => {
    const dialog = create()
    const drawer = create(Drawer)

    await dialog.show()
    await drawer.show()
    expect(root.style.paddingRight).toBe('20px')
    await dialog.hide()
    expect(root.style.paddingRight).toBe('20px')
    expect(root.classList.contains('dialog-open')).toBe(true)
    await drawer.hide()
    expect(root.style.paddingRight).toBe('')
    expect(root.classList.contains('dialog-open')).toBe(false)
  })

  it('does not retain a lock for a drawer with scrolling enabled', async () => {
    const dialog = create()
    const drawer = create(Drawer, { scroll: true })

    await dialog.show()
    await drawer.show()
    await dialog.hide()

    expect(drawer._element.open).toBe(true)
    expect(root.classList.contains('dialog-open')).toBe(false)
    expect(root.style.paddingRight).toBe('')
  })

  it('restores spacing when the dialog closes through its native API', async () => {
    const dialog = create()
    await dialog.show()
    const closed = new Promise(resolve => {
      dialog._element.addEventListener('close', resolve, { once: true })
    })

    dialog._element.close()
    await closed

    expect(root.classList.contains('dialog-open')).toBe(false)
    expect(root.style.paddingRight).toBe('')
  })

  it('restores spacing if disposed after native close but before its queued close event', async () => {
    const dialog = create()
    await dialog.show()

    dialog._element.close()
    dialog.dispose()
    instances.pop()

    expect(root.classList.contains('dialog-open')).toBe(false)
    expect(root.style.paddingRight).toBe('')
  })

  it('keeps compensation when reopened before a queued native close event', async () => {
    const dialog = create()
    await dialog.show()
    const closed = new Promise(resolve => {
      dialog._element.addEventListener('close', resolve, { once: true })
    })
    dialog._element.close()
    await dialog.show()
    await closed

    expect(root.style.paddingRight).toBe('20px')
    expect(root.classList.contains('dialog-open')).toBe(true)
    await dialog.hide()
    expect(root.style.paddingRight).toBe('')
  })

  it('keeps the lock when hiding is canceled and does not lock when showing is canceled', async () => {
    const dialog = create()
    dialog._element.addEventListener('show.bs.dialog', event => event.preventDefault(), { once: true })
    await dialog.show()
    expect(root.style.paddingRight).toBe('')
    expect(root.classList.contains('dialog-open')).toBe(false)
    await dialog.show()
    dialog._element.addEventListener('hide.bs.dialog', event => event.preventDefault(), { once: true })
    await dialog.hide()
    expect(root.style.paddingRight).toBe('20px')
    expect(root.classList.contains('dialog-open')).toBe(true)
  })

  it('releases the lock when disposed during an exit transition', async () => {
    const dialog = create()
    await dialog.show()
    dialog._element.classList.remove('dialog-instant')
    const hidden = dialog.hide()
    dialog.dispose()
    instances.pop()
    await hidden

    expect(root.style.paddingRight).toBe('')
    expect(root.classList.contains('dialog-open')).toBe(false)
  })

  it('preserves an application-owned scroll lock', async () => {
    root.classList.add('dialog-open')
    const dialog = create()

    await dialog.show()
    await dialog.hide()

    expect(root.classList.contains('dialog-open')).toBe(true)
  })

  it('leaves narrow fixed elements and normal sticky elements unchanged', async () => {
    const fixed = document.createElement('div')
    fixed.className = 'is-fixed'
    fixed.style.cssText = 'position: fixed; width: 50px; margin-right: 3px'
    const sticky = document.createElement('div')
    sticky.className = 'sticky-top'
    sticky.style.cssText = 'position: sticky; margin-right: 7px'
    container.append(fixed, sticky)
    const dialog = create()

    await dialog.show()

    expect(fixed.style.marginRight).toBe('3px')
    expect(sticky.style.marginRight).toBe('7px')
  })
})
