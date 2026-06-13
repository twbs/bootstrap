import OtpInput from '../../src/otp-input.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

describe('OtpInput', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  const getOtpHtml = (attributes = '', maxlength = 6) =>
    `<div class="otp" ${attributes}><input type="text" class="otp-input" maxlength="${maxlength}"></div>`

  const typeInto = (input, value) => {
    input.value = value
    input.dispatchEvent(createEvent('input'))
  }

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(OtpInput.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(OtpInput.DATA_KEY).toEqual('bs.otpInput')
    })
  })

  describe('Default', () => {
    it('should return default config', () => {
      expect(OtpInput.Default).toEqual(jasmine.any(Object))
      expect(OtpInput.Default.mask).toBeFalse()
      expect(OtpInput.Default.type).toEqual('numeric')
    })
  })

  describe('DefaultType', () => {
    it('should return default type config', () => {
      expect(OtpInput.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otpBySelector = new OtpInput('.otp')
      expect(otpBySelector._element).toEqual(otpEl)

      const otpByElement = new OtpInput(otpEl)
      expect(otpByElement._element).toEqual(otpEl)
    })

    it('should set up the input with correct attributes', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new

      const input = otpEl.querySelector('input')

      expect(input.getAttribute('maxlength')).toEqual('6')
      expect(input.getAttribute('inputmode')).toEqual('numeric')
      expect(input.getAttribute('pattern')).toEqual('[0-9]*')
      expect(input.getAttribute('autocomplete')).toEqual('one-time-code')
    })

    it('should render one slot per character and mark the container as rendered', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new

      expect(otpEl).toHaveClass('otp-rendered')
      expect(otpEl.querySelectorAll('.otp-slot').length).toEqual(6)
    })

    it('should derive length from the maxlength attribute', () => {
      fixtureEl.innerHTML = getOtpHtml('', 4)

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new

      expect(otpEl.querySelectorAll('.otp-slot').length).toEqual(4)
    })

    it('should let the length option override the maxlength attribute', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl, { length: 4 })
      expect(otp).toBeInstanceOf(OtpInput)

      const input = otpEl.querySelector('input')
      expect(input.getAttribute('maxlength')).toEqual('4')
      expect(otpEl.querySelectorAll('.otp-slot').length).toEqual(4)
    })

    it('should set a text inputmode and pattern for the alphanumeric type', () => {
      fixtureEl.innerHTML = getOtpHtml('data-bs-type="alphanumeric"')

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new

      const input = otpEl.querySelector('input')
      expect(input.getAttribute('inputmode')).toEqual('text')
      expect(input.getAttribute('pattern')).toEqual('[A-Za-z0-9]*')
    })
  })

  describe('value handling', () => {
    it('should return the input value from getValue', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      expect(otp.getValue()).toEqual('')

      otpEl.querySelector('input').value = '123'
      expect(otp.getValue()).toEqual('123')
    })

    it('should set the value and render it into the slots', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      otp.setValue('123456')

      expect(otp.getValue()).toEqual('123456')
      const slots = otpEl.querySelectorAll('.otp-slot')
      expect(slots[0].textContent).toEqual('1')
      expect(slots[5].textContent).toEqual('6')
    })

    it('should sanitize disallowed characters and respect the length', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      otp.setValue('12ab34xy567890')

      expect(otp.getValue()).toEqual('123456')
    })

    it('should accept numeric values', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      otp.setValue(123456)

      expect(otp.getValue()).toEqual('123456')
    })

    it('should clear the value', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      otp.setValue('123456')
      otp.clear()

      expect(otp.getValue()).toEqual('')
      expect(document.activeElement).toEqual(otpEl.querySelector('input'))
    })
  })

  describe('input handling', () => {
    it('should strip disallowed characters as they are typed', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const input = otpEl.querySelector('input')

      typeInto(input, 'a1b2')

      expect(input.value).toEqual('12')
    })

    it('should distribute a pasted/autofilled value across the slots', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const input = otpEl.querySelector('input')

      // A paste or SMS autofill lands as a single multi-character input event
      typeInto(input, '123-456')

      expect(input.value).toEqual('123456')
      const slots = otpEl.querySelectorAll('.otp-slot')
      expect([...slots].map(slot => slot.textContent).join('')).toEqual('123456')
    })

    it('should keep letters for the alphanumeric type', () => {
      fixtureEl.innerHTML = getOtpHtml('data-bs-type="alphanumeric"')

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const input = otpEl.querySelector('input')

      typeInto(input, 'a1B2c3')

      expect(input.value).toEqual('a1B2c3')
    })
  })

  describe('mask', () => {
    it('should render the mask character but keep the real value', () => {
      fixtureEl.innerHTML = getOtpHtml('data-bs-mask="true"')

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      otp.setValue('123456')

      expect(otp.getValue()).toEqual('123456')
      const slots = otpEl.querySelectorAll('.otp-slot')
      expect([...slots].every(slot => slot.textContent === '•')).toBeTrue()
    })

    it('should not turn the input into a password field', () => {
      fixtureEl.innerHTML = getOtpHtml('data-bs-mask="true"')

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new

      expect(otpEl.querySelector('input').type).toEqual('text')
    })
  })

  describe('separators', () => {
    it('should render separators between configured groups', () => {
      fixtureEl.innerHTML = getOtpHtml('data-bs-groups="[3,3]"')

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new

      expect(otpEl.querySelectorAll('.otp-separator').length).toEqual(1)
      expect(otpEl.querySelectorAll('.otp-slot').length).toEqual(6)
    })
  })

  describe('events', () => {
    it('should trigger complete event when the value is full', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getOtpHtml()

        const otpEl = fixtureEl.querySelector('.otp')
        const otp = new OtpInput(otpEl)

        otpEl.addEventListener('complete.bs.otpInput', event => {
          expect(event.value).toEqual('123456')
          resolve()
        })

        otp.setValue('123456')
      })
    })

    it('should trigger input event with the current value on each change', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getOtpHtml()

        const otpEl = fixtureEl.querySelector('.otp')
        new OtpInput(otpEl) // eslint-disable-line no-new
        const input = otpEl.querySelector('input')

        otpEl.addEventListener('input.bs.otpInput', event => {
          expect(event.value).toEqual('12')
          resolve()
        })

        typeInto(input, '12')
      })
    })
  })

  describe('dispose', () => {
    it('should dispose the instance and remove generated markup', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      expect(OtpInput.getInstance(otpEl)).not.toBeNull()

      otp.dispose()

      expect(OtpInput.getInstance(otpEl)).toBeNull()
      expect(fixtureEl.querySelector('.otp-slots')).toBeNull()
      expect(fixtureEl.querySelector('.otp').classList.contains('otp-rendered')).toBeFalse()
    })
  })

  describe('getInstance', () => {
    it('should return otp-input instance', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      expect(OtpInput.getInstance(otpEl)).toEqual(otp)
      expect(OtpInput.getInstance(otpEl)).toBeInstanceOf(OtpInput)
    })

    it('should return null when there is no instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(OtpInput.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return existing instance', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)

      expect(OtpInput.getOrCreateInstance(otpEl)).toEqual(otp)
      expect(OtpInput.getOrCreateInstance(otpEl)).toBeInstanceOf(OtpInput)
    })

    it('should create new instance when none exists', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')

      expect(OtpInput.getInstance(otpEl)).toBeNull()
      expect(OtpInput.getOrCreateInstance(otpEl)).toBeInstanceOf(OtpInput)
    })
  })
})
