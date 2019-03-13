import Alert from './alert'
import { makeArray, getTransitionDurationFromElement } from '../util/index'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

describe('Alert', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should return version', () => {
    expect(typeof Alert.VERSION).toEqual('string')
  })

  describe('data-api', () => {
    it('should close an alert without instanciate it manually', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(makeArray(document.querySelectorAll('.alert')).length).toEqual(0)
    })

    it('should close an alert without instanciate it manually with the parent selector', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-target=".alert" data-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(makeArray(document.querySelectorAll('.alert')).length).toEqual(0)
    })
  })

  describe('close', () => {
    it('should close an alert', done => {
      const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = document.querySelector('.alert')
      const alert = new Alert(alertEl)

      alertEl.addEventListener('closed.bs.alert', () => {
        expect(makeArray(document.querySelectorAll('.alert')).length).toEqual(0)
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
        expect(makeArray(document.querySelectorAll('.alert')).length).toEqual(0)
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

      expect(Alert._getInstance(alertEl)).toBeDefined()

      alert.dispose()

      expect(Alert._getInstance(alertEl)).toBeNull()
    })
  })
})
