import Button from '../../src/button'
import EventHandler from '../../src/dom/event-handler'

/** Test helpers */
import {
  getFixture,
  clearFixture,
  createEvent,
  jQueryMock
} from '../helpers/fixture'

describe('Button', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Button.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('data-api', () => {
    it('should toggle active class on click', () => {
      fixtureEl.innerHTML = [
        '<button class="btn" data-toggle="button">btn</button>',
        '<button class="btn testParent" data-toggle="button"><div class="test"></div></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')
      const btnTestParent = fixtureEl.querySelector('.testParent')

      expect(btn.classList.contains('active')).toEqual(false)

      btn.click()

      expect(btn.classList.contains('active')).toEqual(true)

      btn.click()

      expect(btn.classList.contains('active')).toEqual(false)

      divTest.click()

      expect(btnTestParent.classList.contains('active')).toEqual(true)
    })

    it('should trigger input change event when toggled button has input field', done => {
      fixtureEl.innerHTML = [
        '<div class="btn-group" data-toggle="buttons">',
        '  <label class="btn btn-primary">',
        '    <input type="radio" id="radio" autocomplete="off"> Radio',
        '  </label>',
        '</div>'
      ].join('')

      const input = fixtureEl.querySelector('input')
      const label = fixtureEl.querySelector('label')

      input.addEventListener('change', () => {
        expect().nothing()
        done()
      })

      label.click()
    })

    it('should not trigger input change event when input already checked and button is active', () => {
      fixtureEl.innerHTML = [
        '<button type="button" class="btn btn-primary active" data-toggle="buttons">',
        '  <input type="radio" id="radio" autocomplete="off" checked> Radio',
        '</button>'
      ].join('')

      const button = fixtureEl.querySelector('button')

      spyOn(EventHandler, 'trigger')

      button.click()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should remove active when an other radio button is clicked', () => {
      fixtureEl.innerHTML = [
        '<div class="btn-group btn-group-toggle" data-toggle="buttons">',
        ' <label class="btn btn-secondary active">',
        '   <input type="radio" name="options" id="option1" autocomplete="off" checked> Active',
        ' </label>',
        ' <label class="btn btn-secondary">',
        '   <input type="radio" name="options" id="option2" autocomplete="off"> Radio',
        ' </label>',
        ' <label class="btn btn-secondary">',
        '   <input type="radio" name="options" id="option3" autocomplete="off"> Radio',
        ' </label>',
        '</div>'
      ].join('')

      const option1 = fixtureEl.querySelector('#option1')
      const option2 = fixtureEl.querySelector('#option2')

      expect(option1.checked).toEqual(true)
      expect(option1.parentElement.classList.contains('active')).toEqual(true)

      const clickEvent = createEvent('click')

      option2.dispatchEvent(clickEvent)

      expect(option1.checked).toEqual(false)
      expect(option1.parentElement.classList.contains('active')).toEqual(false)
      expect(option2.checked).toEqual(true)
      expect(option2.parentElement.classList.contains('active')).toEqual(true)
    })

    it('should do nothing if the child is not an input', () => {
      fixtureEl.innerHTML = [
        '<div class="btn-group btn-group-toggle" data-toggle="buttons">',
        ' <label class="btn btn-secondary active">',
        '   <span id="option1">el 1</span>',
        ' </label>',
        ' <label class="btn btn-secondary">',
        '   <span id="option2">el 2</span>',
        ' </label>',
        ' <label class="btn btn-secondary">',
        '   <span>el 3</span>',
        ' </label>',
        '</div>'
      ].join('')

      const option2 = fixtureEl.querySelector('#option2')
      const clickEvent = createEvent('click')

      option2.dispatchEvent(clickEvent)

      expect().nothing()
    })

    it('should add focus class on focus event', () => {
      fixtureEl.innerHTML = '<button class="btn" data-toggle="button"><input type="text" /></button>'

      const btn = fixtureEl.querySelector('.btn')
      const input = fixtureEl.querySelector('input')

      const focusEvent = createEvent('focus')
      input.dispatchEvent(focusEvent)

      expect(btn.classList.contains('focus')).toEqual(true)
    })

    it('should not add focus class', () => {
      fixtureEl.innerHTML = '<button data-toggle="button"><input type="text" /></button>'

      const btn = fixtureEl.querySelector('button')
      const input = fixtureEl.querySelector('input')

      const focusEvent = createEvent('focus')
      input.dispatchEvent(focusEvent)

      expect(btn.classList.contains('focus')).toEqual(false)
    })

    it('should remove focus class on blur event', () => {
      fixtureEl.innerHTML = '<button class="btn focus" data-toggle="button"><input type="text" /></button>'

      const btn = fixtureEl.querySelector('.btn')
      const input = fixtureEl.querySelector('input')

      const focusEvent = createEvent('blur')
      input.dispatchEvent(focusEvent)

      expect(btn.classList.contains('focus')).toEqual(false)
    })

    it('should not remove focus class on blur event', () => {
      fixtureEl.innerHTML = '<button class="focus" data-toggle="button"><input type="text" /></button>'

      const btn = fixtureEl.querySelector('button')
      const input = fixtureEl.querySelector('input')

      const focusEvent = createEvent('blur')
      input.dispatchEvent(focusEvent)

      expect(btn.classList.contains('focus')).toEqual(true)
    })
  })

  describe('toggle', () => {
    it('should toggle aria-pressed', () => {
      fixtureEl.innerHTML = '<button class="btn" data-toggle="button" aria-pressed="false"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      expect(btnEl.getAttribute('aria-pressed')).toEqual('false')
      expect(btnEl.classList.contains('active')).toEqual(false)

      button.toggle()

      expect(btnEl.getAttribute('aria-pressed')).toEqual('true')
      expect(btnEl.classList.contains('active')).toEqual(true)
    })

    it('should handle disabled attribute on non-button elements', () => {
      fixtureEl.innerHTML = [
        '<div class="btn-group disabled" data-toggle="buttons" aria-disabled="true" disabled>',
        '  <label class="btn btn-danger disabled" aria-disabled="true" disabled>',
        '    <input type="checkbox" aria-disabled="true" autocomplete="off" disabled class="disabled"/>',
        '  </label>',
        '</div>'
      ].join('')

      const btnGroupEl = fixtureEl.querySelector('.btn-group')
      const btnDanger = fixtureEl.querySelector('.btn-danger')
      const input = fixtureEl.querySelector('input')

      const button = new Button(btnGroupEl)

      button.toggle()

      expect(btnDanger.hasAttribute('disabled')).toEqual(true)
      expect(input.checked).toEqual(false)
    })
  })

  describe('dispose', () => {
    it('should dispose a button', () => {
      fixtureEl.innerHTML = '<button class="btn" data-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      expect(Button.getInstance(btnEl)).toBeDefined()

      button.dispose()

      expect(Button.getInstance(btnEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing button', () => {
      fixtureEl.innerHTML = '<button class="btn" data-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      spyOn(button, 'toggle')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock, 'toggle')

      expect(button.toggle).toHaveBeenCalled()
    })

    it('should create new button instance and call toggle', () => {
      fixtureEl.innerHTML = '<button class="btn" data-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock, 'toggle')

      expect(Button.getInstance(btnEl)).toBeDefined()
      expect(btnEl.classList.contains('active')).toEqual(true)
    })

    it('should just create a button instance without calling toggle', () => {
      fixtureEl.innerHTML = '<button class="btn" data-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock)

      expect(Button.getInstance(btnEl)).toBeDefined()
      expect(btnEl.classList.contains('active')).toEqual(false)
    })
  })
})
