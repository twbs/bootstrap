import Toast from './toast'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

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
        delay: 1
      })

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        done()
      })

      toast.show()
    })

    it('should close toast when close element with data-dismiss attribute is set', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-delay="1" data-autohide="false" data-animation="false">',
        '  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">',
        '    close',
        '  </button>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('show')).toEqual(true)

        const button = toastEl.querySelector('.close')

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
        '<div class="toast" data-autohide="false" data-animation="false">',
        '  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">',
        '    close',
        '  </button>',
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
        '<div class="toast" data-delay="1">',
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

    it('should not add fade class', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-delay="1" data-animation="false">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      toastEl.addEventListener('shown.bs.toast', () => {
        expect(toastEl.classList.contains('fade')).toEqual(false)
        done()
      })

      toast.show()
    })
  })

  describe('hide', () => {
    it('should allow to hide toast manually', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-delay="1" data-autohide="false">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '  </div>'
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
  })

  describe('dispose', () => {
    it('should allow to destroy toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      expect(Toast._getInstance(toastEl)).toBeDefined()

      toast.dispose()

      expect(Toast._getInstance(toastEl)).toBeNull()
    })

    it('should allow to destroy toast and hide it before that', done => {
      fixtureEl.innerHTML = [
        '<div class="toast" data-delay="0" data-autohide="false">',
        '  <div class="toast-body">',
        '    a simple toast',
        '  </div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)
      const expected = () => {
        expect(toastEl.classList.contains('show')).toEqual(true)
        expect(Toast._getInstance(toastEl)).toBeDefined()

        toast.dispose()

        expect(Toast._getInstance(toastEl)).toBeNull()
        expect(toastEl.classList.contains('show')).toEqual(false)

        done()
      }

      toastEl.addEventListener('shown.bs.toast', () => {
        setTimeout(expected, 1)
      })

      toast.show()
    })
  })
})
