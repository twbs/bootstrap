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

  // The compiled CSS lays the slots out horizontally, but the unit test DOM has
  // no stylesheet so the generated `<div>`s stack vertically (identical x-range).
  // Force an inline horizontal layout so coordinate-based hit testing is
  // deterministic when exercising pointer/tap behavior.
  const layoutSlotsHorizontally = (otpEl, slotWidth = 30) => {
    for (const slot of otpEl.querySelectorAll('.otp-slot, .otp-separator')) {
      slot.style.display = 'inline-block'
      slot.style.width = `${slotWidth}px`
      slot.style.margin = '0'
      slot.style.padding = '0'
    }
  }

  const pointerDownOnSlot = (input, slot) => {
    const { left, width } = slot.getBoundingClientRect()
    input.dispatchEvent(new MouseEvent('pointerdown', {
      bubbles: true, cancelable: true, clientX: left + (width / 2)
    }))
  }

  const beforeInput = (input, options) =>
    input.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, ...options }))

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

  describe('interaction', () => {
    it('should position the active slot from the tapped coordinate', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123456')

      const slots = otpEl.querySelectorAll('.otp-slot')
      // The input is already focused (keyboard up), so a tap repositions the
      // caret immediately based on its x-coordinate
      input.focus()
      const { left, width } = slots[0].getBoundingClientRect()
      input.dispatchEvent(new MouseEvent('pointerdown', {
        bubbles: true, cancelable: true, clientX: left + (width / 2)
      }))

      expect(input.selectionStart).toEqual(0)
      // A filled slot is selected so the next keystroke overwrites it
      expect(input.selectionEnd).toEqual(1)
      expect(slots[0]).toHaveClass('otp-slot-active')
    })

    it('should overwrite the active slot instead of inserting', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123456')

      input.focus()
      input.setSelectionRange(2, 3)
      input.dispatchEvent(new InputEvent('beforeinput', {
        inputType: 'insertText', data: '9', bubbles: true, cancelable: true
      }))

      expect(input.value).toEqual('129456')
      // Caret advances to the next slot
      expect(input.selectionStart).toEqual(3)
    })

    it('should delete the previous character on backspace', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123')

      input.focus()
      input.setSelectionRange(3, 3)
      input.dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteContentBackward', bubbles: true, cancelable: true }))

      expect(input.value).toEqual('12')
      expect(input.selectionStart).toEqual(2)
    })

    it('should focus the first empty slot on keyboard focus', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('12')

      input.focus()

      expect(input.selectionStart).toEqual(2)
      expect(otpEl.querySelectorAll('.otp-slot')[2]).toHaveClass('otp-slot-active')
    })

    it('should swallow a disallowed character on beforeinput', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const input = otpEl.querySelector('input')

      input.focus()
      const event = new InputEvent('beforeinput', {
        inputType: 'insertText', data: 'a', bubbles: true, cancelable: true
      })
      input.dispatchEvent(event)

      expect(input.value).toEqual('')
      expect(event.defaultPrevented).toBeTrue()
    })

    it('should position the caret from the tap only after the input focuses natively (iPadOS keyboard fix)', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123456')

      const slots = otpEl.querySelectorAll('.otp-slot')
      // Input is not yet focused: a tap must NOT reposition the caret itself
      // (that would let the browser raise then immediately dismiss the keyboard).
      // The tapped slot is only remembered until focus settles.
      pointerDownOnSlot(input, slots[0])
      expect(document.activeElement).not.toEqual(input)

      // Focus settles (the browser focuses the input from the same tap)
      input.focus()

      // Caret lands on the tapped slot (0), not the first-empty/last slot (5)
      // that a plain keyboard focus would choose
      expect(input.selectionStart).toEqual(0)
      expect(input.selectionEnd).toEqual(1)
      expect(slots[0]).toHaveClass('otp-slot-active')
    })

    it('should clamp a tap beyond the filled slots to the first empty slot', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('12')
      layoutSlotsHorizontally(otpEl)

      const slots = otpEl.querySelectorAll('.otp-slot')
      input.focus()
      // Move the caret away from the default first-empty position first
      input.setSelectionRange(0, 1)

      // Tap the far right (last) slot while only two of six are filled
      pointerDownOnSlot(input, slots[5])

      // The caret is clamped to the first empty slot (index 2), not slot 5
      expect(input.selectionStart).toEqual(2)
      expect(slots[2]).toHaveClass('otp-slot-active')
    })

    it('should clear the selected slot and keep the caret on backspace', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123456')

      input.focus()
      // A filled slot is selected (as the active slot always is)
      input.setSelectionRange(2, 3)
      beforeInput(input, { inputType: 'deleteContentBackward' })

      expect(input.value).toEqual('12456')
      expect(input.selectionStart).toEqual(2)
    })

    it('should do nothing on backspace at the start of an empty field', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const input = otpEl.querySelector('input')

      input.focus()
      input.setSelectionRange(0, 0)
      const event = new InputEvent('beforeinput', {
        inputType: 'deleteContentBackward', bubbles: true, cancelable: true
      })
      input.dispatchEvent(event)

      expect(input.value).toEqual('')
      expect(event.defaultPrevented).toBeTrue()
    })

    it('should append into an empty slot when typing at the caret', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('12')

      input.focus()
      input.setSelectionRange(2, 2)
      beforeInput(input, { inputType: 'insertText', data: '3' })

      expect(input.value).toEqual('123')
      expect(input.selectionStart).toEqual(3)
    })

    it('should place the caret on the first empty slot after a paste/autofill', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      new OtpInput(otpEl) // eslint-disable-line no-new
      const input = otpEl.querySelector('input')

      input.focus()
      // A paste lands as a single multi-character input event
      typeInto(input, '123')

      expect(input.value).toEqual('123')
      expect(input.selectionStart).toEqual(3)
      expect(input.selectionEnd).toEqual(3)
    })

    it('should keep the active slot in sync on selectionchange', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123456')

      input.focus()
      input.setSelectionRange(3, 4)
      document.dispatchEvent(new Event('selectionchange'))

      expect(otpEl.querySelectorAll('.otp-slot')[3]).toHaveClass('otp-slot-active')
    })
  })

  describe('focus', () => {
    it('should focus the input and select the first empty slot', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123')

      otp.focus()

      expect(document.activeElement).toEqual(input)
      expect(input.selectionStart).toEqual(3)
      expect(otpEl.querySelectorAll('.otp-slot')[3]).toHaveClass('otp-slot-active')
    })

    it('should select the last slot when the value is already full', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')
      otp.setValue('123456')

      otp.focus()

      // Clamp to the last slot and select it so the next keystroke overwrites it
      expect(input.selectionStart).toEqual(5)
      expect(input.selectionEnd).toEqual(6)
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

    it('should stop intercepting beforeinput after dispose', () => {
      fixtureEl.innerHTML = getOtpHtml()

      const otpEl = fixtureEl.querySelector('.otp')
      const otp = new OtpInput(otpEl)
      const input = otpEl.querySelector('input')

      otp.dispose()

      // The beforeinput listener is gone, so the event is no longer prevented
      const event = new InputEvent('beforeinput', {
        inputType: 'insertText', data: '1', bubbles: true, cancelable: true
      })
      input.dispatchEvent(event)

      expect(event.defaultPrevented).toBeFalse()
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
