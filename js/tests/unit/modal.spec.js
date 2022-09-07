import Modal from '../../src/modal'
import EventHandler from '../../src/dom/event-handler'
import ScrollBarHelper from '../../src/util/scrollbar'
import { clearBodyAndDocument, clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'

describe('Modal', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    clearBodyAndDocument()
    document.body.classList.remove('modal-open')

    for (const backdrop of document.querySelectorAll('.modal-backdrop')) {
      backdrop.remove()
    }
  })

  beforeEach(() => {
    clearBodyAndDocument()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Modal.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Modal.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Modal.DATA_KEY).toEqual('bs.modal')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modalBySelector = new Modal('.modal')
      const modalByElement = new Modal(modalEl)

      expect(modalBySelector._element).toEqual(modalEl)
      expect(modalByElement._element).toEqual(modalEl)
    })
  })

  describe('toggle', () => {
    it('should call ScrollBarHelper to handle scrollBar on body', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const spyHide = spyOn(ScrollBarHelper.prototype, 'hide').and.callThrough()
        const spyReset = spyOn(ScrollBarHelper.prototype, 'reset').and.callThrough()
        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(spyHide).toHaveBeenCalled()
          modal.toggle()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spyReset).toHaveBeenCalled()
          resolve()
        })

        modal.toggle()
      })
    })
  })

  describe('show', () => {
    it('should show a modal', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('show.bs.modal', event => {
          expect(event).toBeDefined()
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modalEl.getAttribute('aria-modal')).toEqual('true')
          expect(modalEl.getAttribute('role')).toEqual('dialog')
          expect(modalEl.getAttribute('aria-hidden')).toBeNull()
          expect(modalEl.style.display).toEqual('block')
          expect(document.querySelector('.modal-backdrop')).not.toBeNull()
          resolve()
        })

        modal.show()
      })
    })

    it('should show a modal without backdrop', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          backdrop: false
        })

        modalEl.addEventListener('show.bs.modal', event => {
          expect(event).toBeDefined()
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modalEl.getAttribute('aria-modal')).toEqual('true')
          expect(modalEl.getAttribute('role')).toEqual('dialog')
          expect(modalEl.getAttribute('aria-hidden')).toBeNull()
          expect(modalEl.style.display).toEqual('block')
          expect(document.querySelector('.modal-backdrop')).toBeNull()
          resolve()
        })

        modal.show()
      })
    })

    it('should show a modal and append the element', () => {
      return new Promise(resolve => {
        const modalEl = document.createElement('div')
        const id = 'dynamicModal'

        modalEl.setAttribute('id', id)
        modalEl.classList.add('modal')
        modalEl.innerHTML = '<div class="modal-dialog"></div>'

        const modal = new Modal(modalEl)

        modalEl.addEventListener('shown.bs.modal', () => {
          const dynamicModal = document.getElementById(id)
          expect(dynamicModal).not.toBeNull()
          dynamicModal.remove()
          resolve()
        })

        modal.show()
      })
    })

    it('should do nothing if a modal is shown', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modal = new Modal(modalEl)

      const spy = spyOn(EventHandler, 'trigger')
      modal._isShown = true

      modal.show()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing if a modal is transitioning', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modal = new Modal(modalEl)

      const spy = spyOn(EventHandler, 'trigger')
      modal._isTransitioning = true

      modal.show()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not fire shown event when show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('show.bs.modal', event => {
          event.preventDefault()

          const expectedDone = () => {
            expect().nothing()
            resolve()
          }

          setTimeout(expectedDone, 10)
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          reject(new Error('shown event triggered'))
        })

        modal.show()
      })
    })

    it('should be shown after the first call to show() has been prevented while fading is enabled ', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal fade"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        let prevented = false
        modalEl.addEventListener('show.bs.modal', event => {
          if (!prevented) {
            event.preventDefault()
            prevented = true

            setTimeout(() => {
              modal.show()
            })
          }
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(prevented).toBeTrue()
          expect(modal._isAnimated()).toBeTrue()
          resolve()
        })

        modal.show()
      })
    })
    it('should set is transitioning if fade class is present', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal fade"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('show.bs.modal', () => {
          setTimeout(() => {
            expect(modal._isTransitioning).toBeTrue()
          })
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modal._isTransitioning).toBeFalse()
          resolve()
        })

        modal.show()
      })
    })

    it('should close modal when a click occurred on data-bs-dismiss="modal" inside modal', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="modal fade">',
          '  <div class="modal-dialog">',
          '    <div class="modal-header">',
          '      <button type="button" data-bs-dismiss="modal"></button>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const btnClose = fixtureEl.querySelector('[data-bs-dismiss="modal"]')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal, 'hide').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          btnClose.click()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should close modal when a click occurred on a data-bs-dismiss="modal" with "bs-target" outside of modal element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button type="button" data-bs-dismiss="modal" data-bs-target="#modal1"></button>',
          '<div id="modal1" class="modal fade">',
          '  <div class="modal-dialog"></div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const btnClose = fixtureEl.querySelector('[data-bs-dismiss="modal"]')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal, 'hide').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          btnClose.click()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should set .modal\'s scroll top to 0', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="modal fade">',
          '  <div class="modal-dialog"></div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modalEl.scrollTop).toEqual(0)
          resolve()
        })

        modal.show()
      })
    })

    it('should set modal body scroll top to 0 if modal body do not exists', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="modal fade">',
          '  <div class="modal-dialog">',
          '    <div class="modal-body"></div>',
          '  </div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const modalBody = modalEl.querySelector('.modal-body')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modalBody.scrollTop).toEqual(0)
          resolve()
        })

        modal.show()
      })
    })

    it('should not trap focus if focus equal to false', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal fade"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          focus: false
        })

        const spy = spyOn(modal._focustrap, 'activate').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should add listener when escape touch is pressed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal, 'hide').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          const keydownEscape = createEvent('keydown')
          keydownEscape.key = 'Escape'

          modalEl.dispatchEvent(keydownEscape)
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should do nothing when the pressed key is not escape', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal, 'hide')

        const expectDone = () => {
          expect(spy).not.toHaveBeenCalled()

          resolve()
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          const keydownTab = createEvent('keydown')
          keydownTab.key = 'Tab'

          modalEl.dispatchEvent(keydownTab)
          setTimeout(expectDone, 30)
        })

        modal.show()
      })
    })

    it('should adjust dialog on resize', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal, '_adjustDialog').and.callThrough()

        const expectDone = () => {
          expect(spy).toHaveBeenCalled()

          resolve()
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          const resizeEvent = createEvent('resize')

          window.dispatchEvent(resizeEvent)
          setTimeout(expectDone, 10)
        })

        modal.show()
      })
    })

    it('should not close modal when clicking on modal-content', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="modal">',
          '  <div class="modal-dialog">',
          '    <div class="modal-content"></div>',
          '  </div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        const shownCallback = () => {
          setTimeout(() => {
            expect(modal._isShown).toEqual(true)
            resolve()
          }, 10)
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          fixtureEl.querySelector('.modal-dialog').click()
          fixtureEl.querySelector('.modal-content').click()
          shownCallback()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          reject(new Error('Should not hide a modal'))
        })

        modal.show()
      })
    })

    it('should not close modal when clicking outside of modal-content if backdrop = false', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          backdrop: false
        })

        const shownCallback = () => {
          setTimeout(() => {
            expect(modal._isShown).toBeTrue()
            resolve()
          }, 10)
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          modalEl.click()
          shownCallback()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          reject(new Error('Should not hide a modal'))
        })

        modal.show()
      })
    })

    it('should not close modal when clicking outside of modal-content if backdrop = static', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          backdrop: 'static'
        })

        const shownCallback = () => {
          setTimeout(() => {
            expect(modal._isShown).toBeTrue()
            resolve()
          }, 10)
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          modalEl.click()
          shownCallback()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          reject(new Error('Should not hide a modal'))
        })

        modal.show()
      })
    })
    it('should close modal when escape key is pressed with keyboard = true and backdrop is static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          backdrop: 'static',
          keyboard: true
        })

        const shownCallback = () => {
          setTimeout(() => {
            expect(modal._isShown).toBeFalse()
            resolve()
          }, 10)
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          const keydownEscape = createEvent('keydown')
          keydownEscape.key = 'Escape'

          modalEl.dispatchEvent(keydownEscape)
          shownCallback()
        })

        modal.show()
      })
    })

    it('should not close modal when escape key is pressed with keyboard = false', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          keyboard: false
        })

        const shownCallback = () => {
          setTimeout(() => {
            expect(modal._isShown).toBeTrue()
            resolve()
          }, 10)
        }

        modalEl.addEventListener('shown.bs.modal', () => {
          const keydownEscape = createEvent('keydown')
          keydownEscape.key = 'Escape'

          modalEl.dispatchEvent(keydownEscape)
          shownCallback()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          reject(new Error('Should not hide a modal'))
        })

        modal.show()
      })
    })

    it('should not overflow when clicking outside of modal-content if backdrop = static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog" style="transition-duration: 20ms;"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          backdrop: 'static'
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          modalEl.click()
          setTimeout(() => {
            expect(modalEl.clientHeight).toEqual(modalEl.scrollHeight)
            resolve()
          }, 20)
        })

        modal.show()
      })
    })

    it('should not queue multiple callbacks when clicking outside of modal-content and backdrop = static', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog" style="transition-duration: 50ms;"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl, {
          backdrop: 'static'
        })

        modalEl.addEventListener('shown.bs.modal', () => {
          const spy = spyOn(modal, '_queueCallback').and.callThrough()
          const mouseDown = createEvent('mousedown')

          modalEl.dispatchEvent(mouseDown)
          modalEl.click()
          modalEl.dispatchEvent(mouseDown)
          modalEl.click()

          setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1)
            resolve()
          }, 20)
        })

        modal.show()
      })
    })

    it('should trap focus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal._focustrap, 'activate').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })
  })

  describe('hide', () => {
    it('should hide a modal', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)
        const backdropSpy = spyOn(modal._backdrop, 'hide').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          modal.hide()
        })

        modalEl.addEventListener('hide.bs.modal', event => {
          expect(event).toBeDefined()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(modalEl.getAttribute('aria-modal')).toBeNull()
          expect(modalEl.getAttribute('role')).toBeNull()
          expect(modalEl.getAttribute('aria-hidden')).toEqual('true')
          expect(modalEl.style.display).toEqual('none')
          expect(backdropSpy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should close modal when clicking outside of modal-content', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const dialogEl = modalEl.querySelector('.modal-dialog')
        const modal = new Modal(modalEl)

        const spy = spyOn(modal, 'hide')

        modalEl.addEventListener('shown.bs.modal', () => {
          const mouseDown = createEvent('mousedown')

          dialogEl.dispatchEvent(mouseDown)
          modalEl.click()
          expect(spy).not.toHaveBeenCalled()

          modalEl.dispatchEvent(mouseDown)
          modalEl.click()
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should do nothing is the modal is not shown', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modal = new Modal(modalEl)

      modal.hide()

      expect().nothing()
    })

    it('should do nothing is the modal is transitioning', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modal = new Modal(modalEl)

      modal._isTransitioning = true
      modal.hide()

      expect().nothing()
    })

    it('should not hide a modal if hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)

        modalEl.addEventListener('shown.bs.modal', () => {
          modal.hide()
        })

        const hideCallback = () => {
          setTimeout(() => {
            expect(modal._isShown).toBeTrue()
            resolve()
          }, 10)
        }

        modalEl.addEventListener('hide.bs.modal', event => {
          event.preventDefault()
          hideCallback()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          reject(new Error('should not trigger hidden'))
        })

        modal.show()
      })
    })

    it('should release focus trap', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)
        const spy = spyOn(modal._focustrap, 'deactivate').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          modal.hide()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a modal', () => {
      fixtureEl.innerHTML = '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modal = new Modal(modalEl)
      const focustrap = modal._focustrap
      const spyDeactivate = spyOn(focustrap, 'deactivate').and.callThrough()

      expect(Modal.getInstance(modalEl)).toEqual(modal)

      const spyOff = spyOn(EventHandler, 'off')

      modal.dispose()

      expect(Modal.getInstance(modalEl)).toBeNull()
      expect(spyOff).toHaveBeenCalledTimes(3)
      expect(spyDeactivate).toHaveBeenCalled()
    })
  })

  describe('handleUpdate', () => {
    it('should call adjust dialog', () => {
      fixtureEl.innerHTML = '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'

      const modalEl = fixtureEl.querySelector('.modal')
      const modal = new Modal(modalEl)

      const spy = spyOn(modal, '_adjustDialog')

      modal.handleUpdate()

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should toggle modal', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>',
          '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="modal"]')

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modalEl.getAttribute('aria-modal')).toEqual('true')
          expect(modalEl.getAttribute('role')).toEqual('dialog')
          expect(modalEl.getAttribute('aria-hidden')).toBeNull()
          expect(modalEl.style.display).toEqual('block')
          expect(document.querySelector('.modal-backdrop')).not.toBeNull()
          setTimeout(() => trigger.click(), 10)
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(modalEl.getAttribute('aria-modal')).toBeNull()
          expect(modalEl.getAttribute('role')).toBeNull()
          expect(modalEl.getAttribute('aria-hidden')).toEqual('true')
          expect(modalEl.style.display).toEqual('none')
          expect(document.querySelector('.modal-backdrop')).toBeNull()
          resolve()
        })

        trigger.click()
      })
    })

    it('should not recreate a new modal', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>',
          '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const modal = new Modal(modalEl)
        const trigger = fixtureEl.querySelector('[data-bs-toggle="modal"]')

        const spy = spyOn(modal, 'show').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        trigger.click()
      })
    })

    it('should prevent default when the trigger is <a> or <area>', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a data-bs-toggle="modal" href="#" data-bs-target="#exampleModal"></a>',
          '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="modal"]')

        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          expect(modalEl.getAttribute('aria-modal')).toEqual('true')
          expect(modalEl.getAttribute('role')).toEqual('dialog')
          expect(modalEl.getAttribute('aria-hidden')).toBeNull()
          expect(modalEl.style.display).toEqual('block')
          expect(document.querySelector('.modal-backdrop')).not.toBeNull()
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        trigger.click()
      })
    })

    it('should focus the trigger on hide', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a data-bs-toggle="modal" href="#" data-bs-target="#exampleModal"></a>',
          '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="modal"]')

        const spy = spyOn(trigger, 'focus')

        modalEl.addEventListener('shown.bs.modal', () => {
          const modal = Modal.getInstance(modalEl)

          modal.hide()
        })

        const hideListener = () => {
          setTimeout(() => {
            expect(spy).toHaveBeenCalled()
            resolve()
          }, 20)
        }

        modalEl.addEventListener('hidden.bs.modal', () => {
          hideListener()
        })

        trigger.click()
      })
    })
    it('should not prevent default when a click occurred on data-bs-dismiss="modal" where tagName is DIFFERENT than <a> or <area>', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="modal">',
          '  <div class="modal-dialog">',
          '    <button type="button" data-bs-dismiss="modal"></button>',
          '  </div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const btnClose = fixtureEl.querySelector('button[data-bs-dismiss="modal"]')
        const modal = new Modal(modalEl)

        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          btnClose.click()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })

    it('should prevent default when a click occurred on data-bs-dismiss="modal" where tagName is <a> or <area>', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="modal">',
          '  <div class="modal-dialog">',
          '    <a type="button" data-bs-dismiss="modal"></a>',
          '  </div>',
          '</div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const btnClose = fixtureEl.querySelector('a[data-bs-dismiss="modal"]')
        const modal = new Modal(modalEl)

        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        modalEl.addEventListener('shown.bs.modal', () => {
          btnClose.click()
        })

        modalEl.addEventListener('hidden.bs.modal', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        modal.show()
      })
    })
    it('should not focus the trigger if the modal is not visible', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a data-bs-toggle="modal" href="#" data-bs-target="#exampleModal" style="display: none;"></a>',
          '<div id="exampleModal" class="modal" style="display: none;"><div class="modal-dialog"></div></div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="modal"]')

        const spy = spyOn(trigger, 'focus')

        modalEl.addEventListener('shown.bs.modal', () => {
          const modal = Modal.getInstance(modalEl)

          modal.hide()
        })

        const hideListener = () => {
          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 20)
        }

        modalEl.addEventListener('hidden.bs.modal', () => {
          hideListener()
        })

        trigger.click()
      })
    })
    it('should not focus the trigger if the modal is not shown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a data-bs-toggle="modal" href="#" data-bs-target="#exampleModal"></a>',
          '<div id="exampleModal" class="modal"><div class="modal-dialog"></div></div>'
        ].join('')

        const modalEl = fixtureEl.querySelector('.modal')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="modal"]')

        const spy = spyOn(trigger, 'focus')

        const showListener = () => {
          setTimeout(() => {
            expect(spy).not.toHaveBeenCalled()
            resolve()
          }, 10)
        }

        modalEl.addEventListener('show.bs.modal', event => {
          event.preventDefault()
          showListener()
        })

        trigger.click()
      })
    })

    it('should call hide first, if another modal is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button data-bs-toggle="modal"  data-bs-target="#modal2"></button>',
          '<div id="modal1" class="modal fade"><div class="modal-dialog"></div></div>',
          '<div id="modal2" class="modal"><div class="modal-dialog"></div></div>'
        ].join('')

        const trigger2 = fixtureEl.querySelector('button')
        const modalEl1 = document.querySelector('#modal1')
        const modalEl2 = document.querySelector('#modal2')
        const modal1 = new Modal(modalEl1)

        modalEl1.addEventListener('shown.bs.modal', () => {
          trigger2.click()
        })
        modalEl1.addEventListener('hidden.bs.modal', () => {
          expect(Modal.getInstance(modalEl2)).not.toBeNull()
          expect(modalEl2).toHaveClass('show')
          resolve()
        })
        modal1.show()
      })
    })
  })
  describe('jQueryInterface', () => {
    it('should create a modal', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.modal = Modal.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.modal.call(jQueryMock)

      expect(Modal.getInstance(div)).not.toBeNull()
    })

    it('should create a modal with given config', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.modal = Modal.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.modal.call(jQueryMock, { keyboard: false })
      const spy = spyOn(Modal.prototype, 'constructor')
      expect(spy).not.toHaveBeenCalledWith(div, { keyboard: false })

      const modal = Modal.getInstance(div)
      expect(modal).not.toBeNull()
      expect(modal._config.keyboard).toBeFalse()
    })

    it('should not re create a modal', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')
      const modal = new Modal(div)

      jQueryMock.fn.modal = Modal.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.modal.call(jQueryMock)

      expect(Modal.getInstance(div)).toEqual(modal)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.modal = Modal.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.modal.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should call show method', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')
      const modal = new Modal(div)

      jQueryMock.fn.modal = Modal.jQueryInterface
      jQueryMock.elements = [div]

      const spy = spyOn(modal, 'show')

      jQueryMock.fn.modal.call(jQueryMock, 'show')

      expect(spy).toHaveBeenCalled()
    })

    it('should not call show method', () => {
      fixtureEl.innerHTML = '<div class="modal" data-bs-show="false"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.modal = Modal.jQueryInterface
      jQueryMock.elements = [div]

      const spy = spyOn(Modal.prototype, 'show')

      jQueryMock.fn.modal.call(jQueryMock)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return modal instance', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')
      const modal = new Modal(div)

      expect(Modal.getInstance(div)).toEqual(modal)
      expect(Modal.getInstance(div)).toBeInstanceOf(Modal)
    })

    it('should return null when there is no modal instance', () => {
      fixtureEl.innerHTML = '<div class="modal"><div class="modal-dialog"></div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Modal.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return modal instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const modal = new Modal(div)

      expect(Modal.getOrCreateInstance(div)).toEqual(modal)
      expect(Modal.getInstance(div)).toEqual(Modal.getOrCreateInstance(div, {}))
      expect(Modal.getOrCreateInstance(div)).toBeInstanceOf(Modal)
    })

    it('should return new instance when there is no modal instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Modal.getInstance(div)).toBeNull()
      expect(Modal.getOrCreateInstance(div)).toBeInstanceOf(Modal)
    })

    it('should return new instance when there is no modal instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Modal.getInstance(div)).toBeNull()
      const modal = Modal.getOrCreateInstance(div, {
        backdrop: true
      })
      expect(modal).toBeInstanceOf(Modal)

      expect(modal._config.backdrop).toBeTrue()
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const modal = new Modal(div, {
        backdrop: true
      })
      expect(Modal.getInstance(div)).toEqual(modal)

      const modal2 = Modal.getOrCreateInstance(div, {
        backdrop: false
      })
      expect(modal).toBeInstanceOf(Modal)
      expect(modal2).toEqual(modal)

      expect(modal2._config.backdrop).toBeTrue()
    })
  })
})
