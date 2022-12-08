import Alert from '../../src/alert'
import { getTransitionDurationFromElement } from '../../src/util/index'
import { clearFixture, getFixture, jQueryMock } from '../helpers/fixture'

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
    expect(Alert.VERSION).toEqual(jasmine.any(String))
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
      expect(document.querySelectorAll('.alert')).toHaveSize(0)
    })

    it('should close an alert without instantiating it manually with the parent selector', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-target=".alert" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.alert')).toHaveSize(0)
    })
  })

  describe('close', () => {
    it('should close an alert', () => {
      return new Promise(resolve => {
        const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)
        fixtureEl.innerHTML = '<div class="alert"></div>'

        const alertEl = document.querySelector('.alert')
        const alert = new Alert(alertEl)

        alertEl.addEventListener('closed.bs.alert', () => {
          expect(document.querySelectorAll('.alert')).toHaveSize(0)
          expect(spy).not.toHaveBeenCalled()
          resolve()
        })

        alert.close()
      })
    })

    it('should close alert with fade class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="alert fade"></div>'

        const alertEl = document.querySelector('.alert')
        const alert = new Alert(alertEl)

        alertEl.addEventListener('transitionend', () => {
          expect().nothing()
        })

        alertEl.addEventListener('closed.bs.alert', () => {
          expect(document.querySelectorAll('.alert')).toHaveSize(0)
          resolve()
        })

        alert.close()
      })
    })

    it('should not remove alert if close event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="alert"></div>'

        const getAlert = () => document.querySelector('.alert')
        const alertEl = getAlert()
        const alert = new Alert(alertEl)

        alertEl.addEventListener('close.bs.alert', event => {
          event.preventDefault()
          setTimeout(() => {
            expect(getAlert()).not.toBeNull()
            resolve()
          }, 10)
        })

        alertEl.addEventListener('closed.bs.alert', () => {
          reject(new Error('should not fire closed event'))
        })

        alert.close()
      })
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

      const spy = spyOn(alert, 'close')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      jQueryMock.fn.alert.call(jQueryMock, 'close')

      expect(spy).toHaveBeenCalled()
    })

    it('should create new alert instance and call close', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      expect(Alert.getInstance(alertEl)).toBeNull()
      jQueryMock.fn.alert.call(jQueryMock, 'close')

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

    it('should throw an error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.alert.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw an error on protected method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = '_getConfig'

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.alert.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
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

      expect(Alert.getInstance(div)).toBeNull()
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

      expect(Alert.getInstance(div)).toBeNull()
      expect(Alert.getOrCreateInstance(div)).toBeInstanceOf(Alert)
    })
  })
})
