import EventHandler from '../../src/dom/event-handler.js'
import Dialog from '../../src/dialog.js'
import {
  clearBodyAndDocument, clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('Dialog', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    clearBodyAndDocument()
    document.body.classList.remove('dialog-open')
    document.body.style.scrollbarGutter = ''

    for (const backdrop of document.querySelectorAll('.dialog-backdrop')) {
      backdrop.remove()
    }
  })

  beforeEach(() => {
    clearBodyAndDocument()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Dialog.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Dialog.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Dialog.DATA_KEY).toEqual('bs.dialog')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

      const dialogEl = fixtureEl.querySelector('dialog')
      const dialogBySelector = new Dialog('dialog')
      const dialogByElement = new Dialog(dialogEl)

      expect(dialogBySelector._element).toEqual(dialogEl)
      expect(dialogByElement._element).toEqual(dialogEl)
    })
  })

  describe('toggle', () => {
    it('should handle scrollbar using scrollbar-gutter CSS property', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(document.body.style.scrollbarGutter).toEqual('stable')
          expect(document.body.classList.contains('dialog-open')).toBe(true)
          dialog.toggle()
        })

        dialogEl.addEventListener('hidden.bs.dialog', () => {
          expect(document.body.style.scrollbarGutter).toEqual('')
          expect(document.body.classList.contains('dialog-open')).toBe(false)
          resolve()
        })

        dialog.toggle()
      })
    })
  })

  describe('show', () => {
    it('should show a dialog', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        dialogEl.addEventListener('show.bs.dialog', event => {
          expect(event).toBeDefined()
        })

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(dialogEl.open).toBe(true)
          expect(dialogEl.style.display).not.toEqual('none')
          expect(document.querySelector('.dialog-backdrop')).not.toBeNull()
          resolve()
        })

        dialog.show()
      })
    })

    it('should show modal dialog when modal option is true', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl, { modal: true })
        const showModalSpy = spyOn(dialogEl, 'showModal').and.callThrough()

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(showModalSpy).toHaveBeenCalled()
          expect(dialogEl.open).toBe(true)
          resolve()
        })

        dialog.show()
      })
    })

    it('should show non-modal dialog when modal option is false', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl, { modal: false })
        const showSpy = spyOn(dialogEl, 'show').and.callThrough()

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(showSpy).toHaveBeenCalled()
          expect(dialogEl.open).toBe(true)
          resolve()
        })

        dialog.show()
      })
    })

    it('should set scrollbar-gutter CSS property', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(document.body.style.scrollbarGutter).toEqual('stable')
          resolve()
        })

        dialog.show()
      })
    })

    it('should trap focus', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        const spy = spyOn(dialog._focustrap, 'activate').and.callThrough()

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        dialog.show()
      })
    })

    it('should not trap focus if focus equal to false', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog fade"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl, {
          focus: false
        })

        const spy = spyOn(dialog._focustrap, 'activate').and.callThrough()

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        dialog.show()
      })
    })
  })

  describe('hide', () => {
    it('should hide a dialog', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        dialogEl.addEventListener('shown.bs.dialog', () => {
          dialog.hide()
        })

        dialogEl.addEventListener('hide.bs.dialog', event => {
          expect(event).toBeDefined()
        })

        dialogEl.addEventListener('hidden.bs.dialog', () => {
          expect(dialogEl.open).toBe(false)
          expect(document.body.style.scrollbarGutter).toEqual('')
          expect(document.querySelector('.dialog-backdrop')).toBeNull()
          resolve()
        })

        dialog.show()
      })
    })

    it('should use native dialog close method', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)
        const closeSpy = spyOn(dialogEl, 'close').and.callThrough()

        dialogEl.addEventListener('shown.bs.dialog', () => {
          dialog.hide()
        })

        dialogEl.addEventListener('hidden.bs.dialog', () => {
          expect(closeSpy).toHaveBeenCalled()
          resolve()
        })

        dialog.show()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a dialog', () => {
      fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

      const dialogEl = fixtureEl.querySelector('dialog')
      const dialog = new Dialog(dialogEl)

      expect(Dialog.getInstance(dialogEl)).toEqual(dialog)

      spyOn(EventHandler, 'off')

      dialog.dispose()

      expect(Dialog.getInstance(dialogEl)).toBeNull()
    })
  })

  describe('handleUpdate', () => {
    it('should call handleUpdate', () => {
      fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

      const dialogEl = fixtureEl.querySelector('dialog')
      const dialog = new Dialog(dialogEl)

      spyOn(dialog, 'handleUpdate')

      dialog.handleUpdate()

      expect(dialog.handleUpdate).toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should toggle dialog', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button type="button" data-bs-toggle="dialog" data-bs-target="#exampleDialog"></button>',
          '<dialog id="exampleDialog" class="dialog"><div class="dialog-content"></div></dialog>'
        ].join('')

        const dialogEl = fixtureEl.querySelector('#exampleDialog')
        const trigger = fixtureEl.querySelector('[data-bs-toggle="dialog"]')

        dialogEl.addEventListener('shown.bs.dialog', () => {
          expect(dialogEl.open).toBe(true)
          resolve()
        })

        trigger.click()
      })
    })

    it('should not re-open dialog if another dialog is open', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button type="button" data-bs-toggle="dialog" data-bs-target="#exampleDialog"></button>',
          '<button type="button" data-bs-toggle="dialog" data-bs-target="#exampleDialog2"></button>',
          '<dialog id="exampleDialog" class="dialog"><div class="dialog-content"></div></dialog>',
          '<dialog id="exampleDialog2" class="dialog"><div class="dialog-content"></div></dialog>'
        ].join('')

        const dialogEl1 = fixtureEl.querySelector('#exampleDialog')
        const dialogEl2 = fixtureEl.querySelector('#exampleDialog2')
        const trigger2 = fixtureEl.querySelector('[data-bs-target="#exampleDialog2"]')
        const dialog1 = new Dialog(dialogEl1)

        dialogEl1.addEventListener('shown.bs.dialog', () => {
          trigger2.click()
        })

        dialogEl1.addEventListener('hidden.bs.dialog', () => {
          expect(dialogEl1.open).toBe(false)
        })

        dialogEl2.addEventListener('shown.bs.dialog', () => {
          expect(dialogEl2.open).toBe(true)
          resolve()
        })

        dialog1.show()
      })
    })
  })

  describe('jQuery interface', () => {
    it('should create a dialog', () => {
      fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

      const div = fixtureEl.querySelector('dialog')
      const dialog = new Dialog(div)

      expect(dialog._element).toEqual(div)
    })

    it('should not re create a dialog', () => {
      fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

      const div = fixtureEl.querySelector('dialog')
      const dialog = new Dialog(div)
      const dialog2 = new Dialog(div)

      expect(dialog).toEqual(dialog2)
    })

    it('should throw an error on undefined method', () => {
      fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

      const div = fixtureEl.querySelector('dialog')
      const action = 'undefinedMethod'

      const mockCollection = {
        each: function(callback) {
          return callback.call(div)
        }
      }

      expect(() => {
        Dialog.jQueryInterface.call(mockCollection, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('keyboard interaction', () => {
    it('should close dialog on escape key', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        dialogEl.addEventListener('shown.bs.dialog', () => {
          const keydownEvent = createEvent('keydown')
          keydownEvent.key = 'Escape'

          dialogEl.dispatchEvent(keydownEvent)
        })

        dialogEl.addEventListener('hidden.bs.dialog', () => {
          expect(dialogEl.open).toBe(false)
          resolve()
        })

        dialog.show()
      })
    })

    it('should not close dialog on escape key when keyboard is false', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl, { keyboard: false })

        dialogEl.addEventListener('shown.bs.dialog', () => {
          const keydownEvent = createEvent('keydown')
          keydownEvent.key = 'Escape'

          dialogEl.dispatchEvent(keydownEvent)

          setTimeout(() => {
            expect(dialogEl.open).toBe(true)
            resolve()
          }, 10)
        })

        dialog.show()
      })
    })
  })

  describe('backdrop interaction', () => {
    it('should close dialog when clicking outside content', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl)

        dialogEl.addEventListener('shown.bs.dialog', () => {
          const mouseDown = createEvent('mousedown')
          const click = createEvent('click')

          dialogEl.dispatchEvent(mouseDown)
          dialogEl.dispatchEvent(click)
        })

        dialogEl.addEventListener('hidden.bs.dialog', () => {
          expect(dialogEl.open).toBe(false)
          resolve()
        })

        dialog.show()
      })
    })

    it('should not close dialog with static backdrop', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<dialog class="dialog"><div class="dialog-content"></div></dialog>'

        const dialogEl = fixtureEl.querySelector('dialog')
        const dialog = new Dialog(dialogEl, { backdrop: 'static' })

        dialogEl.addEventListener('shown.bs.dialog', () => {
          const mouseDown = createEvent('mousedown')
          const click = createEvent('click')

          dialogEl.dispatchEvent(mouseDown)
          dialogEl.dispatchEvent(click)

          setTimeout(() => {
            expect(dialogEl.open).toBe(true)
            resolve()
          }, 10)
        })

        dialog.show()
      })
    })
  })
})