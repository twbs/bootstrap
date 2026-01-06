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

  const getOtpHtml = (inputCount = 6, attributes = '') => {
    const inputs = Array.from({ length: inputCount })
      .map(() => '<input type="text" class="form-control">')
      .join('')
    return `<div class="otp-input" ${attributes}>${inputs}</div>`
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
      expect(OtpInput.Default.length).toEqual(6)
      expect(OtpInput.Default.mask).toEqual(false)
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

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otpBySelector = new OtpInput('.otp-input')
      const otpByElement = new OtpInput(otpEl)

      expect(otpBySelector._element).toEqual(otpEl)
      expect(otpByElement._element).toEqual(otpEl)
    })

    it('should set up inputs with correct attributes', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new

      const inputs = otpEl.querySelectorAll('input')

      for (const input of inputs) {
        expect(input.getAttribute('maxlength')).toEqual('1')
        expect(input.getAttribute('inputmode')).toEqual('numeric')
        expect(input.getAttribute('pattern')).toEqual('\\d*')
      }

      // First input should have autocomplete for OTP autofill
      expect(inputs[0].getAttribute('autocomplete')).toEqual('one-time-code')

      // Other inputs should have autocomplete off
      for (let i = 1; i < inputs.length; i++) {
        expect(inputs[i].getAttribute('autocomplete')).toEqual('off')
      }
    })

    it('should set input type to password when mask is true', () => {
      fixtureEl.innerHTML = getOtpHtml(6, 'data-bs-mask="true"')

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new

      const inputs = otpEl.querySelectorAll('input')

      for (const input of inputs) {
        expect(input.getAttribute('type')).toEqual('password')
      }
    })
  })

  describe('getValue', () => {
    it('should return empty string when no values entered', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)

      expect(otp.getValue()).toEqual('')
    })

    it('should return concatenated values from all inputs', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].value = '1'
      inputs[1].value = '2'
      inputs[2].value = '3'

      expect(otp.getValue()).toEqual('123')
    })
  })

  describe('setValue', () => {
    it('should set values across all inputs', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      otp.setValue('123456')

      expect(inputs[0].value).toEqual('1')
      expect(inputs[1].value).toEqual('2')
      expect(inputs[2].value).toEqual('3')
      expect(inputs[3].value).toEqual('4')
      expect(inputs[4].value).toEqual('5')
      expect(inputs[5].value).toEqual('6')
    })

    it('should handle partial values', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      otp.setValue('123')

      expect(inputs[0].value).toEqual('1')
      expect(inputs[1].value).toEqual('2')
      expect(inputs[2].value).toEqual('3')
      expect(inputs[3].value).toEqual('')
      expect(inputs[4].value).toEqual('')
      expect(inputs[5].value).toEqual('')
    })

    it('should handle numeric values', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      otp.setValue(123456)

      expect(inputs[0].value).toEqual('1')
      expect(inputs[5].value).toEqual('6')
    })
  })

  describe('clear', () => {
    it('should clear all input values', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      otp.setValue('123456')
      otp.clear()

      for (const input of inputs) {
        expect(input.value).toEqual('')
      }
    })
  })

  describe('focus', () => {
    it('should focus first empty input', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].value = '1'
      inputs[1].value = '2'

      otp.focus()

      expect(document.activeElement).toEqual(inputs[2])
    })

    it('should focus last input when all filled', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      otp.setValue('123456')
      otp.focus()

      expect(document.activeElement).toEqual(inputs[5])
    })
  })

  describe('input handling', () => {
    it('should auto-advance to next input on digit entry', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].focus()
      inputs[0].value = '1'
      inputs[0].dispatchEvent(createEvent('input'))

      expect(document.activeElement).toEqual(inputs[1])
    })

    it('should strip non-digit characters', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].focus()
      inputs[0].value = 'a1b'
      inputs[0].dispatchEvent(createEvent('input'))

      expect(inputs[0].value).toEqual('1')
    })

    it('should distribute multi-character input across inputs', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].focus()
      // Simulate autofill that puts multiple characters in first input
      inputs[0].value = '1234'
      inputs[0].dispatchEvent(createEvent('input'))

      expect(inputs[0].value).toEqual('1')
      expect(inputs[1].value).toEqual('2')
      expect(inputs[2].value).toEqual('3')
      expect(inputs[3].value).toEqual('4')
      expect(document.activeElement).toEqual(inputs[3])
    })

    it('should not advance when entering digit in last input', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[5].focus()
      inputs[5].value = '9'
      inputs[5].dispatchEvent(createEvent('input'))

      expect(inputs[5].value).toEqual('9')
      expect(document.activeElement).toEqual(inputs[5])
    })
  })

  describe('keydown handling', () => {
    it('should move focus to previous input on backspace when current is empty', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].value = '1'
      inputs[1].focus()

      const backspaceEvent = new KeyboardEvent('keydown', {
        key: 'Backspace',
        bubbles: true
      })
      inputs[1].dispatchEvent(backspaceEvent)

      expect(document.activeElement).toEqual(inputs[0])
      expect(inputs[0].value).toEqual('')
    })

    it('should navigate left with ArrowLeft', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[2].focus()

      const arrowEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true
      })
      inputs[2].dispatchEvent(arrowEvent)

      expect(document.activeElement).toEqual(inputs[1])
    })

    it('should navigate right with ArrowRight', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[2].focus()

      const arrowEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true
      })
      inputs[2].dispatchEvent(arrowEvent)

      expect(document.activeElement).toEqual(inputs[3])
    })

    it('should not navigate left when at first input', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].focus()

      const arrowEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true
      })
      inputs[0].dispatchEvent(arrowEvent)

      expect(document.activeElement).toEqual(inputs[0])
    })

    it('should not navigate right when at last input', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[5].focus()

      const arrowEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true
      })
      inputs[5].dispatchEvent(arrowEvent)

      expect(document.activeElement).toEqual(inputs[5])
    })

    it('should shift values left on Delete key', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)
      const inputs = otpEl.querySelectorAll('input')

      otp.setValue('123456')
      inputs[2].focus()

      const deleteEvent = new KeyboardEvent('keydown', {
        key: 'Delete',
        bubbles: true
      })
      inputs[2].dispatchEvent(deleteEvent)

      expect(inputs[0].value).toEqual('1')
      expect(inputs[1].value).toEqual('2')
      expect(inputs[2].value).toEqual('4')
      expect(inputs[3].value).toEqual('5')
      expect(inputs[4].value).toEqual('6')
      expect(inputs[5].value).toEqual('')
    })

    it('should not move focus on backspace when current input has value', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[1].value = '5'
      inputs[1].focus()

      const backspaceEvent = new KeyboardEvent('keydown', {
        key: 'Backspace',
        bubbles: true
      })
      inputs[1].dispatchEvent(backspaceEvent)

      // Should stay on same input (browser handles clearing the value)
      expect(document.activeElement).toEqual(inputs[1])
    })
  })

  describe('paste handling', () => {
    it('should distribute pasted digits across inputs', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].focus()

      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        clipboardData: new DataTransfer()
      })
      pasteEvent.clipboardData.setData('text', '123456')
      inputs[0].dispatchEvent(pasteEvent)

      expect(inputs[0].value).toEqual('1')
      expect(inputs[1].value).toEqual('2')
      expect(inputs[2].value).toEqual('3')
      expect(inputs[3].value).toEqual('4')
      expect(inputs[4].value).toEqual('5')
      expect(inputs[5].value).toEqual('6')
    })

    it('should strip non-digits from pasted content', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const inputs = otpEl.querySelectorAll('input')

      inputs[0].focus()

      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        clipboardData: new DataTransfer()
      })
      pasteEvent.clipboardData.setData('text', 'abc123def456')
      inputs[0].dispatchEvent(pasteEvent)

      expect(inputs[0].value).toEqual('1')
      expect(inputs[1].value).toEqual('2')
      expect(inputs[2].value).toEqual('3')
      expect(inputs[3].value).toEqual('4')
      expect(inputs[4].value).toEqual('5')
      expect(inputs[5].value).toEqual('6')
    })
  })

  describe('events', () => {
    it('should trigger complete event when all inputs filled', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getOtpHtml()

        const otpEl = fixtureEl.querySelector('.otp-input')
        const otp = new OtpInput(otpEl)

        otpEl.addEventListener('complete.bs.otp-input', event => {
          expect(event.value).toEqual('123456')
          resolve()
        })

        otp.setValue('123456')
      })
    })

    it('should trigger input event on each input change', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getOtpHtml()

        const otpEl = fixtureEl.querySelector('.otp-input')
        new OtpInput(otpEl) // eslint-disable-line no-new
        const inputs = otpEl.querySelectorAll('input')

        otpEl.addEventListener('input.bs.otp-input', event => {
          expect(event.value).toEqual('1')
          expect(event.index).toEqual(0)
          resolve()
        })

        inputs[0].value = '1'
        inputs[0].dispatchEvent(createEvent('input'))
      })
    })
  })

  describe('dispose', () => {
    it('should dispose the instance', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)

      expect(OtpInput.getInstance(otpEl)).not.toBeNull()

      otp.dispose()

      expect(OtpInput.getInstance(otpEl)).toBeNull()
    })
  })

  describe('getInstance', () => {
    it('should return otp-input instance', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')
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

      const otpEl = fixtureEl.querySelector('.otp-input')
      const otp = new OtpInput(otpEl)

      expect(OtpInput.getOrCreateInstance(otpEl)).toEqual(otp)
      expect(OtpInput.getOrCreateInstance(otpEl)).toBeInstanceOf(OtpInput)
    })

    it('should create new instance when none exists', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp-input')

      expect(OtpInput.getInstance(otpEl)).toBeNull()
      expect(OtpInput.getOrCreateInstance(otpEl)).toBeInstanceOf(OtpInput)
    })
  })
})
