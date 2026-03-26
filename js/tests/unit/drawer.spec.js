import Data from '../../src/dom/data.js'
import EventHandler from '../../src/dom/event-handler.js'
import Drawer from '../../src/drawer.js'
import Swipe from '../../src/util/swipe.js'
import { isVisible, noop } from '../../src/util/index.js'
import {
  clearBodyAndDocument, clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Drawer', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    document.body.classList.remove('dialog-open')
    clearBodyAndDocument()

    for (const dialog of document.querySelectorAll('dialog[open]')) {
      dialog.close()
    }
  })

  beforeEach(() => {
    clearBodyAndDocument()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Drawer.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Drawer.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Drawer.DATA_KEY).toEqual('bs.drawer')
    })
  })

  describe('constructor', () => {
    it('should call hide when a element with data-bs-dismiss="drawer" is clicked', () => {
      fixtureEl.innerHTML = [
        '<dialog class="drawer">',
        '  <a href="#" data-bs-dismiss="drawer">Close</a>',
        '</dialog>'
      ].join('')

      const drawerEl = fixtureEl.querySelector('.drawer')
      const closeEl = fixtureEl.querySelector('a')
      const drawer = new Drawer(drawerEl)

      const spy = spyOn(drawer, 'hide')

      closeEl.click()

      expect(drawer._config.keyboard).toBeTrue()
      expect(spy).toHaveBeenCalled()
    })

    it('should hide if esc is pressed (non-modal via keydown)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, { scroll: true, backdrop: false })

        const spy = spyOn(drawer, 'hide').and.callThrough()

        drawerEl.addEventListener('shown.bs.drawer', () => {
          const keyDownEsc = createEvent('keydown')
          keyDownEsc.key = 'Escape'
          drawerEl.dispatchEvent(keyDownEsc)

          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })

    it('should hide if cancel event fires (modal mode)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        const spy = spyOn(drawer, 'hide').and.callThrough()

        drawerEl.addEventListener('shown.bs.drawer', () => {
          const cancelEvent = createEvent('cancel')
          drawerEl.dispatchEvent(cancelEvent)

          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })

    it('should not hide if esc is not pressed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, { scroll: true, backdrop: false })

        const spy = spyOn(drawer, 'hide')

        drawerEl.addEventListener('shown.bs.drawer', () => {
          const keydownTab = createEvent('keydown')
          keydownTab.key = 'Tab'
          drawerEl.dispatchEvent(keydownTab)

          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })

    it('should not hide if esc is pressed but with keyboard = false', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, { keyboard: false })

        const spy = spyOn(drawer, 'hide')
        const hidePreventedSpy = jasmine.createSpy('hidePrevented')
        drawerEl.addEventListener('hidePrevented.bs.drawer', hidePreventedSpy)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._config.keyboard).toBeFalse()
          const cancelEvent = createEvent('cancel')
          drawerEl.dispatchEvent(cancelEvent)

          setTimeout(() => {
            expect(hidePreventedSpy).toHaveBeenCalled()
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })

    it('should not hide if user clicks on static backdrop', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, { backdrop: 'static' })

        const spyHide = spyOn(drawer, 'hide')
        const hidePreventedSpy = jasmine.createSpy('hidePrevented')
        drawerEl.addEventListener('hidePrevented.bs.drawer', hidePreventedSpy)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          // Click on dialog element itself (backdrop area)
          const clickEvent = createEvent('click')
          Object.defineProperty(clickEvent, 'target', { value: drawerEl })
          drawerEl.dispatchEvent(clickEvent)

          setTimeout(() => {
            expect(hidePreventedSpy).toHaveBeenCalled()
            expect(spyHide).not.toHaveBeenCalled()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })

    it('should call `hide` on resize, if element\'s position is not fixed any more', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="lg:drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl)

        const spy = spyOn(drawer, 'hide').and.callThrough()

        drawerEl.addEventListener('shown.bs.drawer', () => {
          // Override computed position to non-fixed so resize handler triggers hide
          drawerEl.style.position = 'static'

          const resizeEvent = createEvent('resize')
          window.dispatchEvent(resizeEvent)
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        drawer.show()
      })
    })
  })

  describe('config', () => {
    it('should have default values', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      expect(drawer._config.backdrop).toBeTrue()
      expect(drawer._config.keyboard).toBeTrue()
      expect(drawer._config.scroll).toBeFalse()
    })

    it('should read data attributes and override default config', () => {
      fixtureEl.innerHTML = '<dialog class="drawer" data-bs-scroll="true" data-bs-backdrop="false" data-bs-keyboard="false"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      expect(drawer._config.backdrop).toBeFalse()
      expect(drawer._config.keyboard).toBeFalse()
      expect(drawer._config.scroll).toBeTrue()
    })

    it('given a config object must override data attributes', () => {
      fixtureEl.innerHTML = '<dialog class="drawer" data-bs-scroll="true" data-bs-backdrop="false" data-bs-keyboard="false"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl, {
        backdrop: true,
        keyboard: true,
        scroll: false
      })
      expect(drawer._config.backdrop).toBeTrue()
      expect(drawer._config.keyboard).toBeTrue()
      expect(drawer._config.scroll).toBeFalse()
    })
  })

  describe('options', () => {
    it('if scroll is enabled, should not add dialog-open class to body', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, { scroll: true, backdrop: false })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(document.body.classList.contains('dialog-open')).toBeFalse()
          drawer.hide()
        })
        drawerEl.addEventListener('hidden.bs.drawer', () => {
          resolve()
        })
        drawer.show()
      })
    })

    it('if scroll is disabled, should add dialog-open class to body', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, { scroll: false })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(document.body.classList.contains('dialog-open')).toBeTrue()
          drawer.hide()
        })
        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(document.body.classList.contains('dialog-open')).toBeFalse()
          resolve()
        })
        drawer.show()
      })
    })

    it('should hide a shown element if user click on backdrop', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl, { backdrop: true })

        const spy = spyOn(drawer, 'hide').and.callThrough()

        drawerEl.addEventListener('shown.bs.drawer', () => {
          // Click on dialog element itself (backdrop area)
          const clickEvent = createEvent('click')
          Object.defineProperty(clickEvent, 'target', { value: drawerEl })
          drawerEl.dispatchEvent(clickEvent)
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        drawer.show()
      })
    })

    it('should not respond to backdrop clicks for non-modal drawers (scroll + no backdrop)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, {
          scroll: true,
          backdrop: false
        })

        const spy = spyOn(drawer, 'hide')

        drawerEl.addEventListener('shown.bs.drawer', () => {
          // Click on dialog element itself
          const clickEvent = createEvent('click')
          Object.defineProperty(clickEvent, 'target', { value: drawerEl })
          drawerEl.dispatchEvent(clickEvent)

          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })
  })

  describe('toggle', () => {
    it('should call show method if drawer is not open', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      const spy = spyOn(drawer, 'show')

      drawer.toggle()

      expect(spy).toHaveBeenCalled()
    })

    it('should call hide method if drawer is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawerEl.open).toBeTrue()
          const spy = spyOn(drawer, 'hide')

          drawer.toggle()

          expect(spy).toHaveBeenCalled()
          resolve()
        })

        drawer.show()
      })
    })
  })

  describe('show', () => {
    it('should open the dialog element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'
        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('show.bs.drawer', () => {
          expect(drawerEl.open).toBeFalse()
        })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawerEl.open).toBeTrue()
          resolve()
        })

        drawer.show()
      })
    })

    it('should do nothing if already open', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')
      const drawer = new Drawer(drawerEl)

      // Manually open the dialog
      drawerEl.showModal()

      const spyTrigger = spyOn(EventHandler, 'trigger')
      drawer.show()

      expect(spyTrigger).not.toHaveBeenCalled()
    })

    it('should show a hidden element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawerEl.open).toBeTrue()
          resolve()
        })

        drawer.show()
      })
    })

    it('should not fire shown when show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl)

        const expectEnd = () => {
          setTimeout(() => {
            expect(drawerEl.open).toBeFalse()
            resolve()
          }, 10)
        }

        drawerEl.addEventListener('show.bs.drawer', event => {
          event.preventDefault()
          expectEnd()
        })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          reject(new Error('should not fire shown event'))
        })

        drawer.show()
      })
    })

    it('on window load, should call show on a drawer element, if its markup contains open attribute', () => {
      fixtureEl.innerHTML = '<dialog class="drawer" open></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')
      const spy = spyOn(Drawer.prototype, 'show').and.callThrough()

      window.dispatchEvent(createEvent('load'))

      const instance = Drawer.getInstance(drawerEl)
      expect(instance).not.toBeNull()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('hide', () => {
    it('should close the dialog element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'
        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(drawerEl.open).toBeFalse()
          resolve()
        })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })

        drawer.show()
      })
    })

    it('should do nothing if not open', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const spyTrigger = spyOn(EventHandler, 'trigger')

      const drawerEl = fixtureEl.querySelector('dialog')
      const drawer = new Drawer(drawerEl)

      drawer.hide()
      expect(spyTrigger).not.toHaveBeenCalled()
    })

    it('should hide a shown element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(drawerEl.open).toBeFalse()
          resolve()
        })

        drawer.show()
      })
    })

    it('should not fire hidden when hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('hide.bs.drawer', event => {
          event.preventDefault()
          setTimeout(() => {
            expect(drawerEl.open).toBeTrue()
            resolve()
          }, 10)
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          reject(new Error('should not fire hidden event'))
        })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })

        drawer.show()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a drawer', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')
      const drawer = new Drawer(drawerEl)

      expect(Drawer.getInstance(drawerEl)).toEqual(drawer)

      const spyOff = spyOn(EventHandler, 'off')

      drawer.dispose()

      expect(Drawer.getInstance(drawerEl)).toBeNull()
      expect(spyOff).toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should not prevent event for input', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<input type="checkbox" data-bs-toggle="drawer" data-bs-target="#drawerdiv1">',
          '<dialog id="drawerdiv1" class="drawer"></dialog>'
        ].join('')

        const target = fixtureEl.querySelector('input')
        const drawerEl = fixtureEl.querySelector('#drawerdiv1')

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawerEl.open).toBeTrue()
          expect(target.checked).toBeTrue()
          resolve()
        })

        target.click()
      })
    })

    it('should not call toggle on disabled elements', () => {
      fixtureEl.innerHTML = [
        '<a href="#" data-bs-toggle="drawer" data-bs-target="#drawerdiv1" class="disabled"></a>',
        '<dialog id="drawerdiv1" class="drawer"></dialog>'
      ].join('')

      const target = fixtureEl.querySelector('a')

      const spy = spyOn(Drawer.prototype, 'toggle')

      target.click()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should call hide first, if another drawer is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="btn2" data-bs-toggle="drawer" data-bs-target="#drawer2"></button>',
          '<dialog id="drawer1" class="drawer"></dialog>',
          '<dialog id="drawer2" class="drawer"></dialog>'
        ].join('')

        const trigger2 = fixtureEl.querySelector('#btn2')
        const drawerEl1 = document.querySelector('#drawer1')
        const drawerEl2 = document.querySelector('#drawer2')
        const drawer1 = new Drawer(drawerEl1)

        drawerEl1.addEventListener('shown.bs.drawer', () => {
          trigger2.click()
        })
        drawerEl1.addEventListener('hidden.bs.drawer', () => {
          expect(Drawer.getInstance(drawerEl2)).not.toBeNull()
          resolve()
        })
        drawer1.show()
      })
    })

    it('should focus on trigger element after closing drawer', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="btn" data-bs-toggle="drawer" data-bs-target="#drawer"></button>',
          '<dialog id="drawer" class="drawer"></dialog>'
        ].join('')

        const trigger = fixtureEl.querySelector('#btn')
        const drawerEl = fixtureEl.querySelector('#drawer')
        const drawer = new Drawer(drawerEl)
        const spy = spyOn(trigger, 'focus')

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })
        drawerEl.addEventListener('hidden.bs.drawer', () => {
          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            resolve()
          }, 5)
        })

        trigger.click()
      })
    })

    it('should not focus on trigger element after closing drawer, if it is not visible', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="btn" data-bs-toggle="drawer" data-bs-target="#drawer"></button>',
          '<dialog id="drawer" class="drawer"></dialog>'
        ].join('')

        const trigger = fixtureEl.querySelector('#btn')
        const drawerEl = fixtureEl.querySelector('#drawer')
        const drawer = new Drawer(drawerEl)
        const spy = spyOn(trigger, 'focus')

        drawerEl.addEventListener('shown.bs.drawer', () => {
          trigger.style.display = 'none'
          drawer.hide()
        })
        drawerEl.addEventListener('hidden.bs.drawer', () => {
          setTimeout(() => {
            expect(isVisible(trigger)).toBeFalse()
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 5)
        })

        trigger.click()
      })
    })
  })

  describe('getInstance', () => {
    it('should return drawer instance', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')
      const drawer = new Drawer(drawerEl)

      expect(Drawer.getInstance(drawerEl)).toEqual(drawer)
      expect(Drawer.getInstance(drawerEl)).toBeInstanceOf(Drawer)
    })

    it('should return null when there is no drawer instance', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')

      expect(Drawer.getInstance(drawerEl)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return drawer instance', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')
      const drawer = new Drawer(drawerEl)

      expect(Drawer.getOrCreateInstance(drawerEl)).toEqual(drawer)
      expect(Drawer.getInstance(drawerEl)).toEqual(Drawer.getOrCreateInstance(drawerEl, {}))
      expect(Drawer.getOrCreateInstance(drawerEl)).toBeInstanceOf(Drawer)
    })

    it('should return new instance when there is no Drawer instance', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')

      expect(Drawer.getInstance(drawerEl)).toBeNull()
      expect(Drawer.getOrCreateInstance(drawerEl)).toBeInstanceOf(Drawer)
    })

    it('should return new instance when there is no drawer instance with given configuration', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')

      expect(Drawer.getInstance(drawerEl)).toBeNull()
      const drawer = Drawer.getOrCreateInstance(drawerEl, {
        scroll: true
      })
      expect(drawer).toBeInstanceOf(Drawer)

      expect(drawer._config.scroll).toBeTrue()
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('dialog')
      const drawer = new Drawer(drawerEl, {
        scroll: true
      })
      expect(Drawer.getInstance(drawerEl)).toEqual(drawer)

      const drawer2 = Drawer.getOrCreateInstance(drawerEl, {
        scroll: false
      })
      expect(drawer).toBeInstanceOf(Drawer)
      expect(drawer2).toEqual(drawer)

      expect(drawer2._config.scroll).toBeTrue()
    })
  })

  describe('child component cleanup', () => {
    it('should hide tooltip instances inside drawer when drawer closes', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<dialog class="drawer">',
          '  <button data-bs-toggle="tooltip" title="tip">Hover</button>',
          '</dialog>'
        ].join('')

        const drawerEl = fixtureEl.querySelector('.drawer')
        const tooltipTrigger = fixtureEl.querySelector('[data-bs-toggle="tooltip"]')
        const drawer = new Drawer(drawerEl)

        const fakeTooltip = { hide: jasmine.createSpy('tooltipHide') }
        Data.set(tooltipTrigger, 'bs.tooltip', fakeTooltip)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(fakeTooltip.hide).toHaveBeenCalled()
          Data.remove(tooltipTrigger, 'bs.tooltip')
          resolve()
        })

        drawer.show()
      })
    })

    it('should hide popover instances inside drawer when drawer closes', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<dialog class="drawer">',
          '  <button data-bs-toggle="popover" title="pop">Click</button>',
          '</dialog>'
        ].join('')

        const drawerEl = fixtureEl.querySelector('.drawer')
        const popoverTrigger = fixtureEl.querySelector('[data-bs-toggle="popover"]')
        const drawer = new Drawer(drawerEl)

        const fakePopover = { hide: jasmine.createSpy('popoverHide') }
        Data.set(popoverTrigger, 'bs.popover', fakePopover)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(fakePopover.hide).toHaveBeenCalled()
          Data.remove(popoverTrigger, 'bs.popover')
          resolve()
        })

        drawer.show()
      })
    })

    it('should hide toast instances inside drawer when drawer closes', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<dialog class="drawer">',
          '  <div class="toast show">Toast content</div>',
          '</dialog>'
        ].join('')

        const drawerEl = fixtureEl.querySelector('.drawer')
        const toastEl = fixtureEl.querySelector('.toast')
        const drawer = new Drawer(drawerEl)

        const fakeToast = { hide: jasmine.createSpy('toastHide') }
        Data.set(toastEl, 'bs.toast', fakeToast)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(fakeToast.hide).toHaveBeenCalled()
          Data.remove(toastEl, 'bs.toast')
          resolve()
        })

        drawer.show()
      })
    })
  })

  describe('drawer-instant', () => {
    it('should show and fire shown event when drawer-instant class is present', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer drawer-instant"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._isTransitioning).toBeFalse()
          expect(drawerEl.open).toBeTrue()
          resolve()
        })

        drawer.show()
      })
    })

    it('should not report as animated when drawer-instant is present', () => {
      fixtureEl.innerHTML = '<dialog class="drawer drawer-instant"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      expect(drawer._isAnimated()).toBeFalse()
    })

    it('should report as animated when drawer-instant is not present', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      expect(drawer._isAnimated()).toBeTrue()
    })
  })

  describe('hiding class', () => {
    it('should add hiding class during hide and remove after hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawer.hide()
          expect(drawerEl.classList.contains('hiding')).toBeTrue()
        })

        drawerEl.addEventListener('hidden.bs.drawer', () => {
          expect(drawerEl.classList.contains('hiding')).toBeFalse()
          resolve()
        })

        drawer.show()
      })
    })
  })

  describe('swipe', () => {
    afterEach(() => {
      delete document.documentElement.ontouchstart
    })

    it('should initialize swipe helper with leftCallback for drawer-start (LTR)', () => {
      return new Promise(resolve => {
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = '<dialog class="drawer drawer-instant"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._swipeHelper).not.toBeNull()
          expect(drawer._swipeHelper._config.leftCallback).toBeDefined()

          const spy = spyOn(drawer, 'hide')
          drawer._swipeHelper._config.leftCallback()
          expect(spy).toHaveBeenCalled()

          resolve()
        })

        drawer.show()
      })
    })

    it('should initialize swipe helper with rightCallback for drawer-end (LTR)', () => {
      return new Promise(resolve => {
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = '<dialog class="drawer drawer-end drawer-instant"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._swipeHelper).not.toBeNull()
          expect(drawer._swipeHelper._config.rightCallback).toBeDefined()

          const spy = spyOn(drawer, 'hide')
          drawer._swipeHelper._config.rightCallback()
          expect(spy).toHaveBeenCalled()

          resolve()
        })

        drawer.show()
      })
    })

    it('should initialize swipe helper with downCallback for drawer-bottom', () => {
      return new Promise(resolve => {
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = '<dialog class="drawer drawer-bottom drawer-instant"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._swipeHelper).not.toBeNull()
          expect(drawer._swipeHelper._config.downCallback).toBeDefined()

          const spy = spyOn(drawer, 'hide')
          drawer._swipeHelper._config.downCallback()
          expect(spy).toHaveBeenCalled()

          resolve()
        })

        drawer.show()
      })
    })

    it('should initialize swipe helper with upCallback for drawer-top', () => {
      return new Promise(resolve => {
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = '<dialog class="drawer drawer-top drawer-instant"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._swipeHelper).not.toBeNull()
          expect(drawer._swipeHelper._config.upCallback).toBeDefined()

          const spy = spyOn(drawer, 'hide')
          drawer._swipeHelper._config.upCallback()
          expect(spy).toHaveBeenCalled()

          resolve()
        })

        drawer.show()
      })
    })

    it('should not initialize swipe when Swipe is not supported', () => {
      fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

      spyOn(Swipe, 'isSupported').and.returnValue(false)

      const drawerEl = fixtureEl.querySelector('.drawer')
      const drawer = new Drawer(drawerEl)

      drawerEl.showModal()
      drawer._onBeforeShow()

      expect(drawer._swipeHelper).toBeNull()
    })
  })

  describe('dispose with swipe', () => {
    it('should dispose swipe helper when drawer is disposed', () => {
      return new Promise(resolve => {
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = '<dialog class="drawer drawer-instant" style="width:300px;height:300px;"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl)

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawer._swipeHelper).not.toBeNull()

          const swipeSpy = spyOn(drawer._swipeHelper, 'dispose').and.callThrough()
          drawer.dispose()

          expect(swipeSpy).toHaveBeenCalled()
          expect(Drawer.getInstance(drawerEl)).toBeNull()

          delete document.documentElement.ontouchstart
          resolve()
        })

        drawer.show()
      })
    })
  })

  describe('drawer-static class', () => {
    it('should add drawer-static class when static backdrop is clicked, then remove it', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('.drawer')
        const drawer = new Drawer(drawerEl, {
          backdrop: 'static'
        })

        drawerEl.addEventListener('shown.bs.drawer', () => {
          const clickEvent = createEvent('click')
          Object.defineProperty(clickEvent, 'target', { value: drawerEl })
          drawerEl.dispatchEvent(clickEvent)

          expect(drawerEl.classList.contains('drawer-static')).toBeTrue()
          expect(drawerEl.classList.contains('dialog-static')).toBeFalse()

          setTimeout(() => {
            expect(drawerEl.classList.contains('drawer-static')).toBeFalse()
            resolve()
          }, 300)
        })

        drawer.show()
      })
    })
  })

  describe('resize negative path', () => {
    it('should not hide drawer on resize when position is still fixed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="lg:drawer"></dialog>'

        const drawerEl = fixtureEl.querySelector('dialog')
        const drawer = new Drawer(drawerEl)

        const spy = spyOn(drawer, 'hide')

        drawerEl.addEventListener('shown.bs.drawer', () => {
          drawerEl.style.position = 'fixed'

          const resizeEvent = createEvent('resize')
          window.dispatchEvent(resizeEvent)

          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            expect(drawerEl.open).toBeTrue()
            resolve()
          }, 10)
        })

        drawer.show()
      })
    })
  })

  describe('data-api link trigger', () => {
    it('should prevent default when the trigger is <a>', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a href="#" data-bs-toggle="drawer" data-bs-target="#drawerEl">Toggle</a>',
          '<dialog id="drawerEl" class="drawer"></dialog>'
        ].join('')

        const drawerEl = fixtureEl.querySelector('.drawer')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="drawer"]')

        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        drawerEl.addEventListener('shown.bs.drawer', () => {
          expect(drawerEl.open).toBeTrue()
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        trigger.click()
      })
    })
  })
})
