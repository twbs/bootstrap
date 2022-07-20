import Button from '../../src/button'
import { getFixture, clearFixture, jQueryMock } from '../helpers/fixture'

describe('Button', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should take care of element either passed as a CSS selector or DOM element', () => {
    fixtureEl.innerHTML = '<button data-bs-toggle="button">Placeholder</button>'
    const buttonEl = fixtureEl.querySelector('[data-bs-toggle="button"]')
    const buttonBySelector = new Button('[data-bs-toggle="button"]')
    const buttonByElement = new Button(buttonEl)

    expect(buttonBySelector._element).toEqual(buttonEl)
    expect(buttonByElement._element).toEqual(buttonEl)
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Button.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Button.DATA_KEY).toEqual('bs.button')
    })
  })

  describe('data-api', () => {
    it('should toggle active class on click', () => {
      fixtureEl.innerHTML = [
        '<button class="btn" data-bs-toggle="button">btn</button>',
        '<button class="btn testParent" data-bs-toggle="button"><div class="test"></div></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')
      const btnTestParent = fixtureEl.querySelector('.testParent')

      expect(btn).not.toHaveClass('active')

      btn.click()

      expect(btn).toHaveClass('active')

      btn.click()

      expect(btn).not.toHaveClass('active')

      divTest.click()

      expect(btnTestParent).toHaveClass('active')
    })
  })

  describe('toggle', () => {
    it('should toggle aria-pressed', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button" aria-pressed="false"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      expect(btnEl.getAttribute('aria-pressed')).toEqual('false')
      expect(btnEl).not.toHaveClass('active')

      button.toggle()

      expect(btnEl.getAttribute('aria-pressed')).toEqual('true')
      expect(btnEl).toHaveClass('active')
    })
  })

  describe('dispose', () => {
    it('should dispose a button', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      expect(Button.getInstance(btnEl)).not.toBeNull()

      button.dispose()

      expect(Button.getInstance(btnEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing button', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      const spy = spyOn(button, 'toggle')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock, 'toggle')

      expect(spy).toHaveBeenCalled()
    })

    it('should create new button instance and call toggle', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock, 'toggle')

      expect(Button.getInstance(btnEl)).not.toBeNull()
      expect(btnEl).toHaveClass('active')
    })

    it('should just create a button instance without calling toggle', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock)

      expect(Button.getInstance(btnEl)).not.toBeNull()
      expect(btnEl).not.toHaveClass('active')
    })
  })

  describe('getInstance', () => {
    it('should return button instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const button = new Button(div)

      expect(Button.getInstance(div)).toEqual(button)
      expect(Button.getInstance(div)).toBeInstanceOf(Button)
    })

    it('should return null when there is no button instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Button.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return button instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const button = new Button(div)

      expect(Button.getOrCreateInstance(div)).toEqual(button)
      expect(Button.getInstance(div)).toEqual(Button.getOrCreateInstance(div, {}))
      expect(Button.getOrCreateInstance(div)).toBeInstanceOf(Button)
    })

    it('should return new instance when there is no button instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Button.getInstance(div)).toBeNull()
      expect(Button.getOrCreateInstance(div)).toBeInstanceOf(Button)
    })
  })
})
