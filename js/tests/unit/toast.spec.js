import Toast from '../../src/toast'

/** Test helpers */
import { getFixture, clearFixture, jQueryMock } from '../helpers/fixture'

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

  describe('constructor', () => {
    it('should allow to config in js', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl, {
        autohide: false
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should close toast when close element with data-bs-dismiss attribute is set', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-delay="1" data-bs-autohide="false" data-bs-animation="false">',
        '  <button type="button" class="ml-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl, { autohide: false })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)

        const button = toastEl.querySelector('.btn-close')

        button.click()
      })

      toastEl.addEventListener('hidden.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(false)
        done()
      })

      toast.show()
    })
  })

  describe('Default', () => {
    it('should expose default setting to allow to override them', () => {
      const defaultDelay = 1000

      Toast.Default.delay = defaultDelay

      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-autohide="false" data-bs-animation="false">',
        '  <button type="button" class="ml-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
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
    it('should auto hide', done => {
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
        expect(toastEl.classList.contains('show')).toEqual(false)
        done()
      })

      toast.show()
    })

    it('should do nothing if a toast is already shown', () => {
      fixtureEl.innerHTML = [
        '<div class="toast show">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      toast.show()
      expect().nothing()
    })

    it('should not add fade class', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-animation="false">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, { autohide: false })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('fade')).toEqual(false)
        done()
      })

      toast.show()
    })

    it('should not trigger shown if show is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-animation="false">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, { autohide: false })

      const assertDone = () => {
        setTimeout(() => {
          expect(toastEl.classList.contains('show')).toEqual(false)
          done()
        }, 20)
      }

      toastEl.addEventListener('show.bs.toast', event => {
        event.preventDefault()
        assertDone()
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        throw new Error('shown event should not be triggered if show is prevented')
      })

      toast.show()
    })

    it('should show on top-right', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(toastEl.classList.contains('top-right')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should stack top toasts', done => {
      fixtureEl.innerHTML = [
        '<div id="t1" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>',
        '<div id="t2" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast 2',
        '  </div>',
        '</div>'
      ].join('')

      const firstToastEl = fixtureEl.querySelector('#t1')
      const secondToastEl = fixtureEl.querySelector('#t2')
      const firstToast = new Toast(firstToastEl)
      const secondToast = new Toast(secondToastEl)

      firstToastEl.addEventListener('shown.bs.toast', () => {
        secondToast.show()
      })

      secondToastEl.addEventListener('shown.bs.toast', () => {
        expect(firstToastEl.offsetTop < secondToastEl.offsetTop).toEqual(true)
        done()
      })

      firstToast.show()
    })

    it('should reposition top toasts when one is hidden', done => {
      fixtureEl.innerHTML = [
        '<div id="t1" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>',
        '<div id="t2" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast 2',
        '  </div>',
        '</div>',
        '<div id="t3" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast 3',
        '  </div>',
        '</div>'
      ].join('')

      const firstToastEl = fixtureEl.querySelector('#t1')
      const secondToastEl = fixtureEl.querySelector('#t2')
      const thirdToastEl = fixtureEl.querySelector('#t3')
      const firstToast = new Toast(firstToastEl)
      const secondToast = new Toast(secondToastEl)
      const thirdToast = new Toast(thirdToastEl)
      let offsetSecondToast

      firstToastEl.addEventListener('shown.bs.toast', () => {
        secondToast.show()
      })

      secondToastEl.addEventListener('shown.bs.toast', () => {
        offsetSecondToast = secondToastEl.offsetTop
        thirdToast.show()
      })

      thirdToastEl.addEventListener('shown.bs.toast', () => {
        firstToast.hide()
      })

      firstToastEl.addEventListener('hidden.bs.toast', () => {
        expect(offsetSecondToast > secondToastEl.offsetTop).toEqual(true)
        done()
      })

      firstToast.show()
    })

    it('should reposition bottom toasts when one is hidden', done => {
      fixtureEl.innerHTML = [
        '<div id="t1" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>',
        '<div id="t2" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast 2',
        '  </div>',
        '</div>',
        '<div id="t3" class="toast">',
        '  <div class="toast-body">',
        '    a simple toast 3',
        '  </div>',
        '</div>'
      ].join('')

      const firstToastEl = fixtureEl.querySelector('#t1')
      const secondToastEl = fixtureEl.querySelector('#t2')
      const thirdToastEl = fixtureEl.querySelector('#t3')
      const firstToast = new Toast(firstToastEl, {
        position: 'bottom-right'
      })
      const secondToast = new Toast(secondToastEl, {
        position: 'bottom-right'
      })
      const thirdToast = new Toast(thirdToastEl, {
        position: 'bottom-right'
      })

      let offsetSecondToast

      firstToastEl.addEventListener('shown.bs.toast', () => {
        secondToast.show()
      })

      secondToastEl.addEventListener('shown.bs.toast', () => {
        thirdToast.show()
      })

      thirdToastEl.addEventListener('shown.bs.toast', () => {
        const secondToastRect = secondToastEl.getBoundingClientRect()

        offsetSecondToast = secondToastRect.bottom
        firstToast.hide()
      })

      firstToastEl.addEventListener('hidden.bs.toast', () => {
        const secondToastRect = secondToastEl.getBoundingClientRect()

        expect(offsetSecondToast < secondToastRect.bottom).toEqual(true)
        done()
      })

      firstToast.show()
    })

    it('should show on top-left', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, {
        position: 'top-left'
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(toastEl.classList.contains('top-left')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should show on top-center', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, {
        position: 'top-center'
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(toastEl.classList.contains('top-center')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should show on bottom-right', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, {
        position: 'bottom-right'
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(toastEl.classList.contains('bottom-right')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should show on bottom-left', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, {
        position: 'bottom-left'
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(toastEl.classList.contains('bottom-left')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should show on bottom-center', done => {
      fixtureEl.innerHTML = [
        '<div class="toast">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl, {
        position: 'bottom-center'
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(toastEl.classList.contains('bottom-center')).toEqual(true)
        done()
      })

      toast.show()
    })
  })

  describe('hide', () => {
    it('should allow to hide toast manually', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-delay="1" data-bs-autohide="false">',
        '  <div class="toast-body">a simple toast</div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      toastEl.addEventListener('shown.bs.toast', () => {
        toast.hide()
      })

      toastEl.addEventListener('hidden.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(false)
        done()
      })

      toast.show()
    })

    it('should do nothing when we call hide on a non shown toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      spyOn(toastEl.classList, 'contains')

      toast.hide()

      expect(toastEl.classList.contains).toHaveBeenCalled()
    })

    it('should not trigger hidden if hide is prevented', done => {
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
          expect(toastEl.classList.contains('show')).toEqual(true)
          done()
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
        throw new Error('hidden event should not be triggered if hide is prevented')
      })

      toast.show()
    })
  })

  describe('dispose', () => {
    it('should allow to destroy toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      expect(Toast.getInstance(toastEl)).toBeDefined()

      toast.dispose()

      expect(Toast.getInstance(toastEl)).toBeNull()
    })

    it('should allow to destroy toast and hide it before that', done => {
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
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(Toast.getInstance(toastEl)).toBeDefined()

        toast.dispose()

        expect(Toast.getInstance(toastEl)).toBeNull()
        expect(toastEl.classList.contains('show')).toEqual(false)

        done()
      }

      toastEl.addEventListener('shown.bs.toast', () => {
        setTimeout(expected, 1)
      })

      toast.show()
    })
  })

  describe('jQueryInterface', () => {
    it('should create a toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock)

      expect(Toast.getInstance(div)).toBeDefined()
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

      spyOn(toast, 'show')

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock, 'show')

      expect(Toast.getInstance(div)).toEqual(toast)
      expect(toast.show).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      try {
        jQueryMock.fn.toast.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
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

      expect(Toast.getInstance(div)).toEqual(null)
    })
  })
})
