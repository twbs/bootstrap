import Toast from '../../src/toast.js'
import {
  clearFixture, getFixture
} from '../helpers/fixture.js'

describe('Toast', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('constructor', () => {
    it('should create a Toast instance', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      expect(toast).toBeInstanceOf(Toast)
      expect(Toast.getInstance(toastEl)).toBe(toast)
    })
  })

  describe('show', () => {
    it('should add .show class', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      expect(toastEl).not.toHaveClass('show')

      toast.show()

      expect(toastEl).toHaveClass('show')
    })

    it('should trigger show and shown events', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)
      const showSpy = jasmine.createSpy('show')
      const shownSpy = jasmine.createSpy('shown')

      toastEl.addEventListener('show.bs.toast', showSpy)
      toastEl.addEventListener('shown.bs.toast', shownSpy)

      toast.show()

      expect(showSpy).toHaveBeenCalled()
      expect(shownSpy).toHaveBeenCalled()
    })

    it('should be preventable via show.bs.toast', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      toastEl.addEventListener('show.bs.toast', event => event.preventDefault())

      toast.show()

      expect(toastEl).not.toHaveClass('show')
    })
  })

  describe('hide', () => {
    it('should remove .show class', () => {
      fixtureEl.innerHTML = '<div class="toast show"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      expect(toastEl).toHaveClass('show')

      toast.hide()

      expect(toastEl).not.toHaveClass('show')
    })

    it('should trigger hide and hidden events', () => {
      fixtureEl.innerHTML = '<div class="toast show"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)
      const hideSpy = jasmine.createSpy('hide')
      const hiddenSpy = jasmine.createSpy('hidden')

      toastEl.addEventListener('hide.bs.toast', hideSpy)
      toastEl.addEventListener('hidden.bs.toast', hiddenSpy)

      toast.hide()

      expect(hideSpy).toHaveBeenCalled()
      expect(hiddenSpy).toHaveBeenCalled()
    })

    it('should be preventable via hide.bs.toast', () => {
      fixtureEl.innerHTML = '<div class="toast show"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      toastEl.addEventListener('hide.bs.toast', event => event.preventDefault())

      toast.hide()

      expect(toastEl).toHaveClass('show')
    })
  })

  describe('dismiss button', () => {
    it('should hide toast when dismiss button is clicked', () => {
      fixtureEl.innerHTML = [
        '<div class="toast show">',
        '  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
        '  <div class="toast-body">a toast</div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const dismissBtn = fixtureEl.querySelector('[data-bs-dismiss="toast"]')

      expect(toastEl).toHaveClass('show')

      dismissBtn.click()

      expect(toastEl).not.toHaveClass('show')
    })

    it('should work with nested dismiss button', () => {
      fixtureEl.innerHTML = [
        '<div class="toast show">',
        '  <div class="toast-header">',
        '    <strong>Title</strong>',
        '    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
        '  </div>',
        '  <div class="toast-body">a toast</div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')
      const dismissBtn = fixtureEl.querySelector('[data-bs-dismiss="toast"]')

      dismissBtn.click()

      expect(toastEl).not.toHaveClass('show')
    })
  })

  describe('container with :has()', () => {
    it('should have correct structure with toast-container', () => {
      fixtureEl.innerHTML = [
        '<div class="toast-container">',
        '  <div class="toast"><div class="toast-body">toast 1</div></div>',
        '  <div class="toast"><div class="toast-body">toast 2</div></div>',
        '</div>'
      ].join('')

      const container = fixtureEl.querySelector('.toast-container')
      const toasts = fixtureEl.querySelectorAll('.toast')

      expect(container).not.toBeNull()
      expect(toasts.length).toBe(2)
    })

    it('should support multiple toasts in a container', () => {
      fixtureEl.innerHTML = [
        '<div class="toast-container">',
        '  <div class="toast"><div class="toast-body">toast 1</div></div>',
        '  <div class="toast"><div class="toast-body">toast 2</div></div>',
        '  <div class="toast"><div class="toast-body">toast 3</div></div>',
        '</div>'
      ].join('')

      const toasts = fixtureEl.querySelectorAll('.toast')

      for (const toastEl of toasts) {
        new Toast(toastEl).show()
      }

      expect(fixtureEl.querySelectorAll('.toast.show').length).toBe(3)

      Toast.getInstance(toasts[0]).hide()

      expect(fixtureEl.querySelectorAll('.toast.show').length).toBe(2)
    })
  })

  describe('CSS custom property --bs-toast-delay', () => {
    it('should accept custom delay via style attribute', () => {
      fixtureEl.innerHTML = '<div class="toast" style="--bs-toast-delay: 10s"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const computedDelay = toastEl.style.getPropertyValue('--bs-toast-delay')

      expect(computedDelay).toBe('10s')
    })

    it('should accept custom delay via setProperty', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      toastEl.style.setProperty('--bs-toast-delay', '3s')

      expect(toastEl.style.getPropertyValue('--bs-toast-delay')).toBe('3s')
    })
  })

  describe('accessibility', () => {
    it('should have correct ARIA attributes', () => {
      fixtureEl.innerHTML = [
        '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">',
        '  <div class="toast-body">a toast</div>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('.toast')

      expect(toastEl.getAttribute('role')).toBe('alert')
      expect(toastEl.getAttribute('aria-live')).toBe('assertive')
      expect(toastEl.getAttribute('aria-atomic')).toBe('true')
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return existing instance', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = new Toast(toastEl)

      expect(Toast.getOrCreateInstance(toastEl)).toBe(toast)
    })

    it('should create new instance if none exists', () => {
      fixtureEl.innerHTML = '<div class="toast"><div class="toast-body">a toast</div></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toast = Toast.getOrCreateInstance(toastEl)

      expect(toast).toBeInstanceOf(Toast)
    })
  })
})
