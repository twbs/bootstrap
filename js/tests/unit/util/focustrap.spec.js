import FocusTrap from '../../../src/util/focustrap'
import EventHandler from '../../../src/dom/event-handler'
import { clearFixture, getFixture, createEvent } from '../../helpers/fixture'

describe('FocusTrap', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('activate', () => {
    it('should autofocus itself by default', () => {
      fixtureEl.innerHTML = '<div id="focustrap" tabindex="-1"></div>'

      const trapElement = fixtureEl.querySelector('div')

      spyOn(trapElement, 'focus')

      const focustrap = new FocusTrap({ trapElement })
      focustrap.activate()

      expect(trapElement.focus).toHaveBeenCalled()
    })

    it('if configured not to autofocus, should not autofocus itself', () => {
      fixtureEl.innerHTML = '<div id="focustrap" tabindex="-1"></div>'

      const trapElement = fixtureEl.querySelector('div')

      spyOn(trapElement, 'focus')

      const focustrap = new FocusTrap({ trapElement, autofocus: false })
      focustrap.activate()

      expect(trapElement.focus).not.toHaveBeenCalled()
    })

    it('should trap focus', done => {
      fixtureEl.innerHTML = [
        '<a href="#">outside</a>',
        '<div id="focustrap" tabindex="-1">',
        '</div>'
      ].join('')

      const trapElement = fixtureEl.querySelector('div')
      const focustrap = new FocusTrap({ trapElement })
      focustrap.activate()

      const focusInListener = () => {
        expect(focustrap._config.trapElement.focus).toHaveBeenCalled()
        document.removeEventListener('focusin', focusInListener)
        done()
      }

      spyOn(focustrap._config.trapElement, 'focus')

      document.addEventListener('focusin', focusInListener)

      const focusInEvent = createEvent('focusin', { bubbles: true })
      Object.defineProperty(focusInEvent, 'target', {
        value: fixtureEl.querySelector('a')
      })

      document.dispatchEvent(focusInEvent)
    })
  })

  describe('deactivate', () => {
    it('should flag itself as no longer active', () => {
      const focustrap = new FocusTrap({ trapElement: fixtureEl })
      focustrap.activate()
      focustrap.deactivate()

      expect(focustrap._isActive).toBe(false)
    })

    it('should remove all event listeners', () => {
      const focustrap = new FocusTrap({ trapElement: fixtureEl })
      focustrap.activate()

      spyOn(EventHandler, 'off')
      focustrap.deactivate()

      expect(EventHandler.off).toHaveBeenCalled()
    })

    it('doesn\'t try removing event listeners unless it needs to', () => {
      const focustrap = new FocusTrap({ trapElement: fixtureEl })

      spyOn(EventHandler, 'off')
      focustrap.deactivate()

      expect(EventHandler.off).not.toHaveBeenCalled()
    })
  })
})
