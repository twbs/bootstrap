import Toast from '../../src/toast.js'
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture.js'

describe('Toast', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Toast.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Toast.DATA_KEY).toEqual('bs.toast')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div class="toast"></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toastBySelector = new Toast('.toast')
      const toastByElement = new Toast(toastEl)

      expect(toastBySelector._element).toEqual(toastEl)
      expect(toastByElement._element).toEqual(toastEl)
    })

    it('should allow to config in js', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('div')
        const toast = new Toast(toastEl, {
          delay: 1
        })

        toastEl.addEventListener('shown.bs.toast', () => {
          expect(toastEl).toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })

    it('should close toast when close element with data-bs-dismiss attribute is set', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-autohide="false" data-bs-animation="false">',
          '  <button type="button" class="ms-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('div')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('shown.bs.toast', () => {
          expect(toastEl).toHaveClass('show')

          const button = toastEl.querySelector('.btn-close')

          button.click()
        })

        toastEl.addEventListener('hidden.bs.toast', () => {
          expect(toastEl).not.toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })
  })

  describe('Default', () => {
    it('should expose default setting to allow to override them', () => {
      const defaultDelay = 1000

      Toast.Default.delay = defaultDelay

      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-autohide="false" data-bs-animation="false">',
        '  <button type="button" class="ms-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      expect(toast._config.delay).toEqual(defaultDelay)
    })
  })

  describe('DefaultType', () => {
    it('should expose default setting types for read', () => {
      expect(Toast.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('show', () => {
    it('should auto hide', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('hidden.bs.toast', () => {
          expect(toastEl).not.toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })

    it('should not add fade class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-animation="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('shown.bs.toast', () => {
          expect(toastEl).not.toHaveClass('fade')
          resolve()
        })

        toast.show()
      })
    })

    it('should not trigger shown if show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-animation="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        const assertDone = () => {
          setTimeout(() => {
            expect(toastEl).not.toHaveClass('show')
            resolve()
          }, 20)
        }

        toastEl.addEventListener('show.bs.toast', event => {
          event.preventDefault()
          assertDone()
        })

        toastEl.addEventListener('shown.bs.toast', () => {
          reject(new Error('shown event should not be triggered if show is prevented'))
        })

        toast.show()
      })
    })

    it('should clear timeout if toast is shown again before it is hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toast._config.autohide = false
          toastEl.addEventListener('shown.bs.toast', () => {
            expect(spy).toHaveBeenCalled()
            expect(toast._timeout).toBeNull()
            resolve()
          })
          toast.show()
        }, toast._config.delay / 2)

        const spy = spyOn(toast, '_clearTimeout').and.callThrough()

        toast.show()
      })
    })

    it('should clear timeout if toast is interacted with mouse', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)
        const spy = spyOn(toast, '_clearTimeout').and.callThrough()

        setTimeout(() => {
          spy.calls.reset()

          toastEl.addEventListener('mouseover', () => {
            expect(toast._clearTimeout).toHaveBeenCalledTimes(1)
            expect(toast._timeout).toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should clear timeout if toast is interacted with keyboard', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)
        const spy = spyOn(toast, '_clearTimeout').and.callThrough()

        setTimeout(() => {
          spy.calls.reset()

          toastEl.addEventListener('focusin', () => {
            expect(toast._clearTimeout).toHaveBeenCalledTimes(1)
            expect(toast._timeout).toBeNull()
            resolve()
          })

          const insideFocusable = toastEl.querySelector('button')
          insideFocusable.focus()
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should still auto hide after being interacted with mouse and keyboard', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toastEl.addEventListener('mouseover', () => {
            const insideFocusable = toastEl.querySelector('button')
            insideFocusable.focus()
          })

          toastEl.addEventListener('focusin', () => {
            const mouseOutEvent = createEvent('mouseout')
            toastEl.dispatchEvent(mouseOutEvent)
          })

          toastEl.addEventListener('mouseout', () => {
            const outsideFocusable = document.getElementById('outside-focusable')
            outsideFocusable.focus()
          })

          toastEl.addEventListener('focusout', () => {
            expect(toast._timeout).not.toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should not auto hide if focus leaves but mouse pointer remains inside', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toastEl.addEventListener('mouseover', () => {
            const insideFocusable = toastEl.querySelector('button')
            insideFocusable.focus()
          })

          toastEl.addEventListener('focusin', () => {
            const outsideFocusable = document.getElementById('outside-focusable')
            outsideFocusable.focus()
          })

          toastEl.addEventListener('focusout', () => {
            expect(toast._timeout).toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should not auto hide if mouse pointer leaves but focus remains inside', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toastEl.addEventListener('mouseover', () => {
            const insideFocusable = toastEl.querySelector('button')
            insideFocusable.focus()
          })

          toastEl.addEventListener('focusin', () => {
            const mouseOutEvent = createEvent('mouseout')
            toastEl.dispatchEvent(mouseOutEvent)
          })

          toastEl.addEventListener('mouseout', () => {
            expect(toast._timeout).toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })
  })

  describe('hide', () => {
    it('should allow to hide toast manually', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-autohide="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('shown.bs.toast', () => {
          toast.hide()
        })

        toastEl.addEventListener('hidden.bs.toast', () => {
          expect(toastEl).not.toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })

    it('should do nothing when we call hide on a non shown toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      const spy = spyOn(toastEl.classList, 'contains')

      toast.hide()

      expect(spy).toHaveBeenCalled()
    })

    it('should not trigger hidden if hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-animation="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        const assertDone = () => {
          setTimeout(() => {
            expect(toastEl).toHaveClass('show')
            resolve()
          }, 20)
        }

        toastEl.addEventListener('shown.bs.toast', () => {
          toast.hide()
        })

        toastEl.addEventListener('hide.bs.toast', event => {
          event.preventDefault()
          assertDone()
        })

        toastEl.addEventListener('hidden.bs.toast', () => {
          reject(new Error('hidden event should not be triggered if hide is prevented'))
        })

        toast.show()
      })
    })
  })

  describe('dispose', () => {
    it('should allow to destroy toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')

      const toast = new Toast(toastEl)

      expect(Toast.getInstance(toastEl)).not.toBeNull()

      toast.dispose()

      expect(Toast.getInstance(toastEl)).toBeNull()
    })

    it('should allow to destroy toast and hide it before that', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="0" data-bs-autohide="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('div')
        const toast = new Toast(toastEl)
        const expected = () => {
          expect(toastEl).toHaveClass('show')
          expect(Toast.getInstance(toastEl)).not.toBeNull()

          toast.dispose()

          expect(Toast.getInstance(toastEl)).toBeNull()
          expect(toastEl).not.toHaveClass('show')

          resolve()
        }

        toastEl.addEventListener('shown.bs.toast', () => {
          setTimeout(expected, 1)
        })

        toast.show()
      })
    })
  })

  describe('jQueryInterface', () => {
    it('should create a toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock)

      expect(Toast.getInstance(div)).not.toBeNull()
    })

    it('should not re create a toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock)

      expect(Toast.getInstance(div)).toEqual(toast)
    })

    it('should call a toast method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      const spy = spyOn(toast, 'show')

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock, 'show')

      expect(Toast.getInstance(div)).toEqual(toast)
      expect(spy).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.toast.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return a toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      expect(Toast.getInstance(div)).toEqual(toast)
      expect(Toast.getInstance(div)).toBeInstanceOf(Toast)
    })

    it('should return null when there is no toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Toast.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      expect(Toast.getOrCreateInstance(div)).toEqual(toast)
      expect(Toast.getInstance(div)).toEqual(Toast.getOrCreateInstance(div, {}))
      expect(Toast.getOrCreateInstance(div)).toBeInstanceOf(Toast)
    })

    it('should return new instance when there is no toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Toast.getInstance(div)).toBeNull()
      expect(Toast.getOrCreateInstance(div)).toBeInstanceOf(Toast)
    })

    it('should return new instance when there is no toast instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Toast.getInstance(div)).toBeNull()
      const toast = Toast.getOrCreateInstance(div, {
        delay: 1
      })
      expect(toast).toBeInstanceOf(Toast)

      expect(toast._config.delay).toEqual(1)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div, {
        delay: 1
      })
      expect(Toast.getInstance(div)).toEqual(toast)

      const toast2 = Toast.getOrCreateInstance(div, {
        delay: 2
      })
      expect(toast).toBeInstanceOf(Toast)
      expect(toast2).toEqual(toast)

      expect(toast2._config.delay).toEqual(1)
    })
  })
})
