import FocusTrap from '../../../src/util/focustrap'
import EventHandler from '../../../src/dom/event-handler'
import SelectorEngine from '../../../src/dom/selector-engine'
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

    it('should force focus inside focus trap if it can', done => {
      fixtureEl.innerHTML = [
        '<a href="#" id="outside">outside</a>',
        '<div id="focustrap" tabindex="-1">',
        '   <a href="#" id="inside">inside</a>',
        '</div>'
      ].join('')

      const trapElement = fixtureEl.querySelector('div')
      const focustrap = new FocusTrap({ trapElement })
      focustrap.activate()

      const inside = document.getElementById('inside')

      const focusInListener = () => {
        expect(inside.focus).toHaveBeenCalled()
        document.removeEventListener('focusin', focusInListener)
        done()
      }

      spyOn(inside, 'focus')
      spyOn(SelectorEngine, 'focusableChildren').and.callFake(() => [inside])

      document.addEventListener('focusin', focusInListener)

      const focusInEvent = createEvent('focusin', { bubbles: true })
      Object.defineProperty(focusInEvent, 'target', {
        value: document.getElementById('outside')
      })

      document.dispatchEvent(focusInEvent)
    })

    it('should wrap focus around foward on tab', done => {
      fixtureEl.innerHTML = [
        '<a href="#" id="outside">outside</a>',
        '<div id="focustrap" tabindex="-1">',
        '   <a href="#" id="first">first</a>',
        '   <a href="#" id="inside">inside</a>',
        '   <a href="#" id="last">last</a>',
        '</div>'
      ].join('')

      const trapElement = fixtureEl.querySelector('div')
      const focustrap = new FocusTrap({ trapElement })
      focustrap.activate()

      const first = document.getElementById('first')
      const inside = document.getElementById('inside')
      const last = document.getElementById('last')
      const outside = document.getElementById('outside')

      spyOn(SelectorEngine, 'focusableChildren').and.callFake(() => [first, inside, last])
      spyOn(first, 'focus').and.callThrough()

      const focusInListener = () => {
        expect(first.focus).toHaveBeenCalled()
        first.removeEventListener('focusin', focusInListener)
        done()
      }

      first.addEventListener('focusin', focusInListener)

      const keydown = createEvent('keydown')
      keydown.key = 'Tab'

      document.dispatchEvent(keydown)
      outside.focus()
    })

    it('should wrap focus around backwards on shift-tab', done => {
      fixtureEl.innerHTML = [
        '<a href="#" id="outside">outside</a>',
        '<div id="focustrap" tabindex="-1">',
        '   <a href="#" id="first">first</a>',
        '   <a href="#" id="inside">inside</a>',
        '   <a href="#" id="last">last</a>',
        '</div>'
      ].join('')

      const trapElement = fixtureEl.querySelector('div')
      const focustrap = new FocusTrap({ trapElement })
      focustrap.activate()

      const first = document.getElementById('first')
      const inside = document.getElementById('inside')
      const last = document.getElementById('last')
      const outside = document.getElementById('outside')

      spyOn(SelectorEngine, 'focusableChildren').and.callFake(() => [first, inside, last])
      spyOn(last, 'focus').and.callThrough()

      const focusInListener = () => {
        expect(last.focus).toHaveBeenCalled()
        last.removeEventListener('focusin', focusInListener)
        done()
      }

      last.addEventListener('focusin', focusInListener)

      const keydown = createEvent('keydown')
      keydown.key = 'Tab'
      keydown.shiftKey = true

      document.dispatchEvent(keydown)
      outside.focus()
    })

    it('should force focus on itself if there is no focusable content', done => {
      fixtureEl.innerHTML = [
        '<a href="#" id="outside">outside</a>',
        '<div id="focustrap" tabindex="-1"></div>'
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
        value: document.getElementById('outside')
      })

      document.dispatchEvent(focusInEvent)
    })
  })

  describe('deactivate', () => {
    it('should flag itself as no longer active', () => {
      const focustrap = new FocusTrap({ trapElement: fixtureEl })
      focustrap.activate()
      expect(focustrap._isActive).toBe(true)

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

    it('doesn\'t try removing event listeners unless it needs to (in case it hasn\'t been activated)', () => {
      const focustrap = new FocusTrap({ trapElement: fixtureEl })

      spyOn(EventHandler, 'off')
      focustrap.deactivate()

      expect(EventHandler.off).not.toHaveBeenCalled()
    })
  })
})
