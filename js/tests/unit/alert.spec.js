import Alert from '../../src/alert'
import { getTransitionDurationFromElement } from '../../src/util/index'

/** Test helpers */
import { getFixture, clearFixture, jQueryMock } from '../helpers/fixture'

describe('Alert', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should take care of element either passed as a CSS selector or DOM element', () => {
    fixtureEl.innerHTML = '<div class="alert"></div>'

    const alertEl = fixtureEl.querySelector('.alert')
    const alertBySelector = new Alert('.alert')
    const alertByElement = new Alert(alertEl)

    expect(alertBySelector._element).toEqual(alertEl)
    expect(alertByElement._element).toEqual(alertEl)
  })

  it('should return version', () => {
    expect(typeof Alert.VERSION).toEqual('string')
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Alert.DATA_KEY).toEqual('bs.alert')
    })
  })

  describe('data-api', () => {
    it('should close an alert without instantiating it manually', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.alert').length).toEqual(0)
    })

    it('should close an alert without instantiating it manually with the parent selector', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-target=".alert" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.alert').length).toEqual(0)
    })
  })

  describe('close', () => {
    it('should close an alert', done => {
      const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = document.querySelector('.alert')
      const alert = new Alert(alertEl)

      alertEl.addEventListener('closed.bs.alert', () => {
        expect(document.querySelectorAll('.alert').length).toEqual(0)
        expect(spy).not.toHaveBeenCalled()
        done()
      })

      alert.close()
    })

    it('should close alert with fade class', done => {
      fixtureEl.innerHTML = '<div class="alert fade"></div>'

      const alertEl = document.querySelector('.alert')
      const alert = new Alert(alertEl)

      alertEl.addEventListener('transitionend', () => {
        expect().nothing()
      })

      alertEl.addEventListener('closed.bs.alert', () => {
        expect(document.querySelectorAll('.alert').length).toEqual(0)
        done()
      })

      alert.close()
    })

    it('should not remove alert if close event is prevented', done => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = document.querySelector('.alert')
      const alert = new Alert(alertEl)

      const endTest = () => {
        setTimeout(() => {
          expect(alert._removeElement).not.toHaveBeenCalled()
          done()
        }, 10)
      }

      spyOn(alert, '_removeElement')

      alertEl.addEventListener('close.bs.alert', event => {
        event.preventDefault()
        endTest()
      })

      alertEl.addEventListener('closed.bs.alert', () => {
        endTest()
      })

      alert.close()
    })
  })

  describe('dispose', () => {
    it('should dispose an alert', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = document.querySelector('.alert')
      const alert = new Alert(alertEl)

      expect(Alert.getInstance(alertEl)).not.toBeNull()

      alert.dispose()

      expect(Alert.getInstance(alertEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing alert', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')
      const alert = new Alert(alertEl)

      spyOn(alert, 'close')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      jQueryMock.fn.alert.call(jQueryMock, 'close')

      expect(alert.close).toHaveBeenCalled()
    })

    it('should create new alert instance and call close', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      jQueryMock.fn.alert.call(jQueryMock, 'close')

      expect(Alert.getInstance(alertEl)).not.toBeNull()
      expect(fixtureEl.querySelector('.alert')).toBeNull()
    })

    it('should just create an alert instance without calling close', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      jQueryMock.fn.alert.call(jQueryMock)

      expect(Alert.getInstance(alertEl)).not.toBeNull()
      expect(fixtureEl.querySelector('.alert')).not.toBeNull()
    })
  })

  describe('getInstance', () => {
    it('should return alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const alert = new Alert(div)

      expect(Alert.getInstance(div)).toEqual(alert)
      expect(Alert.getInstance(div)).toBeInstanceOf(Alert)
    })

    it('should return null when there is no alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Alert.getInstance(div)).toEqual(null)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const alert = new Alert(div)

      expect(Alert.getOrCreateInstance(div)).toEqual(alert)
      expect(Alert.getInstance(div)).toEqual(Alert.getOrCreateInstance(div, {}))
      expect(Alert.getOrCreateInstance(div)).toBeInstanceOf(Alert)
    })

    it('should return new instance when there is no alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Alert.getInstance(div)).toEqual(null)
      expect(Alert.getOrCreateInstance(div)).toBeInstanceOf(Alert)
    })
  })
})
