import Alert from '../../src/alert.js'
import Collapse from '../../src/collapse.js'
import Dialog from '../../src/dialog.js'
import Drawer from '../../src/drawer.js'
import Tab from '../../src/tab.js'
import Toast from '../../src/toast.js'
import Tooltip from '../../src/tooltip.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

/**
 * Every method that shows or hides a component returns a promise. The promise settles
 * once the component finishes, so `await instance.show()` resumes at the same moment a
 * `shown.bs.*` listener would run. These specs pin down that contract.
 */

describe('Promise-returning API', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()

    for (const tipEl of document.querySelectorAll('.tooltip')) {
      tipEl.remove()
    }
  })

  // Runs `action` and records whether `eventName` fired before the promise settled.
  // A method that resolved too early would produce ['resolved', <eventName>].
  const orderOf = async (element, eventName, action) => {
    const order = []

    element.addEventListener(eventName, () => order.push(eventName))
    await action()
    order.push('resolved')

    return order
  }

  describe('resolves after the lifecycle event', () => {
    it('Collapse show, hide, and toggle', async () => {
      fixtureEl.innerHTML = '<div class="collapse"><div>content</div></div>'

      const collapseEl = fixtureEl.querySelector('.collapse')
      const collapse = new Collapse(collapseEl)

      expect(await orderOf(collapseEl, 'shown.bs.collapse', () => collapse.show()))
        .toEqual(['shown.bs.collapse', 'resolved'])
      expect(await orderOf(collapseEl, 'hidden.bs.collapse', () => collapse.hide()))
        .toEqual(['hidden.bs.collapse', 'resolved'])
      expect(await orderOf(collapseEl, 'shown.bs.collapse', () => collapse.toggle()))
        .toEqual(['shown.bs.collapse', 'resolved'])
    })

    it('Toast show and hide', async () => {
      fixtureEl.innerHTML = '<div class="toast" data-bs-autohide="false"></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      expect(await orderOf(toastEl, 'shown.bs.toast', () => toast.show()))
        .toEqual(['shown.bs.toast', 'resolved'])
      expect(await orderOf(toastEl, 'hidden.bs.toast', () => toast.hide()))
        .toEqual(['hidden.bs.toast', 'resolved'])
    })

    it('Dialog show and hide', async () => {
      fixtureEl.innerHTML = '<dialog class="dialog"></dialog>'

      const dialogEl = fixtureEl.querySelector('.dialog')
      const dialog = new Dialog(dialogEl)

      expect(await orderOf(dialogEl, 'shown.bs.dialog', () => dialog.show()))
        .toEqual(['shown.bs.dialog', 'resolved'])
      expect(await orderOf(dialogEl, 'hidden.bs.dialog', () => dialog.hide()))
        .toEqual(['hidden.bs.dialog', 'resolved'])
    })

    it('Drawer show and hide', async () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      expect(await orderOf(drawerEl, 'shown.bs.drawer', () => drawer.show()))
        .toEqual(['shown.bs.drawer', 'resolved'])
      expect(await orderOf(drawerEl, 'hidden.bs.drawer', () => drawer.hide()))
        .toEqual(['hidden.bs.drawer', 'resolved'])
    })

    it('Tab show', async () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" role="tablist">',
        '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
        '  <li><button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button></li>',
        '</ul>',
        '<ul>',
        '  <li id="home" role="tabpanel"></li>',
        '  <li id="profile" role="tabpanel"></li>',
        '</ul>'
      ].join('')

      const triggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(triggerEl)

      expect(await orderOf(triggerEl, 'shown.bs.tab', () => tab.show()))
        .toEqual(['shown.bs.tab', 'resolved'])
      expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
    })

    it('Alert close', async () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')
      const alert = new Alert(alertEl)

      expect(await orderOf(alertEl, 'closed.bs.alert', () => alert.close()))
        .toEqual(['closed.bs.alert', 'resolved'])
      expect(alertEl.parentNode).toBeNull()
    })

    it('Tooltip show, hide, and toggle', async () => {
      fixtureEl.innerHTML = '<a href="#" title="tooltip">Trigger</a>'

      const triggerEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(triggerEl)

      expect(await orderOf(triggerEl, 'shown.bs.tooltip', () => tooltip.show()))
        .toEqual(['shown.bs.tooltip', 'resolved'])
      expect(await orderOf(triggerEl, 'hidden.bs.tooltip', () => tooltip.hide()))
        .toEqual(['hidden.bs.tooltip', 'resolved'])

      // `toggle()` goes through the hover delay timer, so it has to thread the promise
      // through that timer to stay truthful
      expect(await orderOf(triggerEl, 'shown.bs.tooltip', () => tooltip.toggle()))
        .toEqual(['shown.bs.tooltip', 'resolved'])
    })
  })

  describe('resolves without hanging when the call does nothing', () => {
    it('a prevented show event still settles', async () => {
      fixtureEl.innerHTML = '<div class="collapse"><div>content</div></div>'

      const collapseEl = fixtureEl.querySelector('.collapse')
      const collapse = new Collapse(collapseEl)
      const shownSpy = jasmine.createSpy('shown')

      collapseEl.addEventListener('show.bs.collapse', event => {
        event.preventDefault()
      })
      collapseEl.addEventListener('shown.bs.collapse', shownSpy)

      await collapse.show()

      expect(shownSpy).not.toHaveBeenCalled()
      expect(collapseEl).not.toHaveClass('show')
    })

    it('showing an already shown component settles', async () => {
      fixtureEl.innerHTML = '<div class="collapse"><div>content</div></div>'

      const collapseEl = fixtureEl.querySelector('.collapse')
      const collapse = new Collapse(collapseEl)

      await collapse.show()

      const shownSpy = jasmine.createSpy('shown')
      collapseEl.addEventListener('shown.bs.collapse', shownSpy)

      await collapse.show()

      expect(shownSpy).not.toHaveBeenCalled()
      expect(collapseEl).toHaveClass('show')
    })

    it('disposing mid-transition settles the pending promise', async () => {
      fixtureEl.innerHTML = '<div class="collapse"><div>content</div></div>'

      const collapseEl = fixtureEl.querySelector('.collapse')
      const collapse = new Collapse(collapseEl)
      const shownSpy = jasmine.createSpy('shown')

      collapseEl.addEventListener('shown.bs.collapse', shownSpy)

      const showing = collapse.show()
      collapse.dispose()

      await showing

      expect(shownSpy).not.toHaveBeenCalled()
    })

    it('disposing a tooltip during its show delay settles the pending promise', async () => {
      fixtureEl.innerHTML = '<a href="#" title="tooltip">Trigger</a>'

      const triggerEl = fixtureEl.querySelector('a')
      const tooltip = new Tooltip(triggerEl, { delay: { show: 5000, hide: 0 } })
      const shownSpy = jasmine.createSpy('shown')

      triggerEl.addEventListener('shown.bs.tooltip', shownSpy)

      const toggling = tooltip.toggle()
      tooltip.dispose()

      await toggling

      expect(shownSpy).not.toHaveBeenCalled()
    })
  })

  describe('sequencing', () => {
    it('awaits a full show and hide cycle without listeners', async () => {
      fixtureEl.innerHTML = '<div class="collapse"><div>content</div></div>'

      const collapseEl = fixtureEl.querySelector('.collapse')
      const collapse = new Collapse(collapseEl)

      await collapse.show()
      expect(collapseEl).toHaveClass('show')

      await collapse.hide()
      expect(collapseEl).not.toHaveClass('show')
      expect(collapseEl).not.toHaveClass('collapsing')
    })
  })
})
