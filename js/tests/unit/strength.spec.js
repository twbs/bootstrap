import Strength from '../../src/strength.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

describe('Strength', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  const getStrengthHtml = (options = {}) => {
    const { segments = 4, withText = false, inputId = 'password' } = options
    const segmentHtml = Array.from({ length: segments })
      .map(() => '<div class="strength-segment"></div>')
      .join('')
    const textHtml = withText ? '<span class="strength-text"></span>' : ''

    return `
      <div>
        <input type="password" id="${inputId}" class="form-control">
        <div class="strength" data-bs-strength>
          ${segmentHtml}
        </div>
        ${textHtml}
      </div>
    `
  }

  const getStrengthBarHtml = (inputId = 'password') => {
    return `
      <div>
        <input type="password" id="${inputId}" class="form-control">
        <div class="strength-bar" data-bs-strength></div>
      </div>
    `
  }

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Strength.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Strength.DATA_KEY).toEqual('bs.strength')
    })
  })

  describe('Default', () => {
    it('should return default config', () => {
      expect(Strength.Default).toEqual(jasmine.any(Object))
      expect(Strength.Default.minLength).toEqual(8)
      expect(Strength.Default.thresholds).toEqual([2, 4, 6])
    })
  })

  describe('DefaultType', () => {
    it('should return default type config', () => {
      expect(Strength.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const strengthBySelector = new Strength('.strength')
      const strengthByElement = new Strength(strengthEl)

      expect(strengthBySelector._element).toEqual(strengthEl)
      expect(strengthByElement._element).toEqual(strengthEl)
    })

    it('should find password input in parent container', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      expect(strength._input).toEqual(passwordInput)
    })

    it('should use custom input selector', () => {
      fixtureEl.innerHTML = `
        <div>
          <input type="password" id="other-password" class="form-control">
        </div>
        <div class="strength" data-bs-strength>
          <div class="strength-segment"></div>
          <div class="strength-segment"></div>
          <div class="strength-segment"></div>
          <div class="strength-segment"></div>
        </div>
      `

      const strengthEl = fixtureEl.querySelector('.strength')
      const otherInput = fixtureEl.querySelector('#other-password')
      const strength = new Strength(strengthEl, { input: '#other-password' })

      expect(strength._input).toEqual(otherInput)
    })

    it('should handle missing input gracefully', () => {
      fixtureEl.innerHTML = `
        <div class="strength" data-bs-strength>
          <div class="strength-segment"></div>
          <div class="strength-segment"></div>
          <div class="strength-segment"></div>
          <div class="strength-segment"></div>
        </div>
      `

      const strengthEl = fixtureEl.querySelector('.strength')
      const strength = new Strength(strengthEl)

      expect(strength._input).toBeNull()
      expect(strength.getStrength()).toBeNull()
    })

    it('should use element directly when input config is an element', () => {
      fixtureEl.innerHTML = `
        <div>
          <input type="password" id="my-password" class="form-control">
        </div>
        <div class="strength" data-bs-strength>
          <div class="strength-segment"></div>
        </div>
      `

      const strengthEl = fixtureEl.querySelector('.strength')
      const inputEl = fixtureEl.querySelector('#my-password')
      const strength = new Strength(strengthEl, { input: inputEl })

      expect(strength._input).toEqual(inputEl)
    })
  })

  describe('getStrength', () => {
    it('should return null initially', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const strength = new Strength(strengthEl)

      expect(strength.getStrength()).toBeNull()
    })

    it('should return current strength level', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      // Weak password - just meets min length
      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toEqual('weak')
    })
  })

  describe('evaluate', () => {
    it('should manually trigger evaluation', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      passwordInput.value = 'password123'
      strength.evaluate()

      expect(strength.getStrength()).not.toBeNull()
    })
  })

  describe('scoring', () => {
    it('should return weak for short passwords meeting min length', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      passwordInput.value = 'password' // 8 chars, lowercase only = score 2
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toEqual('weak')
    })

    it('should return fair for passwords with more variety', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      passwordInput.value = 'Password1' // 9 chars, lower+upper+number = score 4
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toEqual('fair')
    })

    it('should return good for strong passwords', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      passwordInput.value = 'Password1!' // lower+upper+number+special+length = score 5-6
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toEqual('good')
    })

    it('should return strong for very strong passwords', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      // Long password with all criteria
      passwordInput.value = 'MyStr0ngP@ssword!!'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toEqual('strong')
    })

    it('should return null for empty password', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      passwordInput.value = ''
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toBeNull()
    })
  })

  describe('custom scorer', () => {
    it('should use custom scoring function', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const customScorer = password => password.length >= 10 ? 8 : 1
      const strength = new Strength(strengthEl, { scorer: customScorer })

      passwordInput.value = 'short'
      passwordInput.dispatchEvent(createEvent('input'))
      expect(strength.getStrength()).toEqual('weak')

      passwordInput.value = 'longenough'
      passwordInput.dispatchEvent(createEvent('input'))
      expect(strength.getStrength()).toEqual('strong')
    })
  })

  describe('custom thresholds', () => {
    it('should use custom threshold values', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl, { thresholds: [1, 2, 3] })

      // With low thresholds, even weak passwords rate higher
      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      // lowercase + minLength = 2, which is now "fair" with [1,2,3]
      expect(strength.getStrength()).toEqual('fair')
    })
  })

  describe('custom minLength', () => {
    it('should use custom minimum length', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl, { minLength: 12 })

      passwordInput.value = 'password' // Only 8 chars, doesn't meet min
      passwordInput.dispatchEvent(createEvent('input'))

      // Should be weak since it doesn't meet minLength requirement
      expect(strength.getStrength()).toEqual('weak')
    })
  })

  describe('UI updates', () => {
    it('should set data-bs-strength attribute', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      new Strength(strengthEl) // eslint-disable-line no-new

      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strengthEl.dataset.bsStrength).toEqual('weak')
    })

    it('should remove data-bs-strength attribute when empty', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      new Strength(strengthEl) // eslint-disable-line no-new

      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strengthEl.dataset.bsStrength).toEqual('weak')

      passwordInput.value = ''
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strengthEl.dataset.bsStrength).toBeUndefined()
    })

    it('should add active class to appropriate segments', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const segments = strengthEl.querySelectorAll('.strength-segment')
      new Strength(strengthEl) // eslint-disable-line no-new

      // Weak - 1 segment active
      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(segments[0]).toHaveClass('active')
      expect(segments[1]).not.toHaveClass('active')
      expect(segments[2]).not.toHaveClass('active')
      expect(segments[3]).not.toHaveClass('active')
    })

    it('should update text element with message', () => {
      fixtureEl.innerHTML = getStrengthHtml({ withText: true })

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const textEl = fixtureEl.querySelector('.strength-text')
      new Strength(strengthEl) // eslint-disable-line no-new

      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(textEl.textContent).toEqual('Weak')
    })

    it('should use custom messages', () => {
      fixtureEl.innerHTML = getStrengthHtml({ withText: true })

      const strengthEl = fixtureEl.querySelector('.strength')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const textEl = fixtureEl.querySelector('.strength-text')
      new Strength(strengthEl, { // eslint-disable-line no-new
        messages: {
          weak: 'Too weak!',
          fair: 'Getting better',
          good: 'Nice!',
          strong: 'Excellent!'
        }
      })

      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(textEl.textContent).toEqual('Too weak!')
    })
  })

  describe('events', () => {
    it('should trigger strengthChange event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getStrengthHtml()

        const strengthEl = fixtureEl.querySelector('.strength')
        const passwordInput = fixtureEl.querySelector('input[type="password"]')
        new Strength(strengthEl) // eslint-disable-line no-new

        strengthEl.addEventListener('strengthChange.bs.strength', event => {
          expect(event.strength).toEqual('weak')
          expect(event.score).toBeGreaterThan(0)
          resolve()
        })

        passwordInput.value = 'password'
        passwordInput.dispatchEvent(createEvent('input'))
      })
    })

    it('should not expose actual password in event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getStrengthHtml()

        const strengthEl = fixtureEl.querySelector('.strength')
        const passwordInput = fixtureEl.querySelector('input[type="password"]')
        new Strength(strengthEl) // eslint-disable-line no-new

        strengthEl.addEventListener('strengthChange.bs.strength', event => {
          expect(event.password).toEqual('***')
          resolve()
        })

        passwordInput.value = 'password'
        passwordInput.dispatchEvent(createEvent('input'))
      })
    })
  })

  describe('strength-bar variant', () => {
    it('should work with strength-bar element', () => {
      fixtureEl.innerHTML = getStrengthBarHtml()

      const strengthEl = fixtureEl.querySelector('.strength-bar')
      const passwordInput = fixtureEl.querySelector('input[type="password"]')
      const strength = new Strength(strengthEl)

      passwordInput.value = 'password'
      passwordInput.dispatchEvent(createEvent('input'))

      expect(strength.getStrength()).toEqual('weak')
      expect(strengthEl.dataset.bsStrength).toEqual('weak')
    })
  })

  describe('dispose', () => {
    it('should dispose the instance', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const strength = new Strength(strengthEl)

      expect(Strength.getInstance(strengthEl)).not.toBeNull()

      strength.dispose()

      expect(Strength.getInstance(strengthEl)).toBeNull()
    })
  })

  describe('getInstance', () => {
    it('should return strength instance', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const strength = new Strength(strengthEl)

      expect(Strength.getInstance(strengthEl)).toEqual(strength)
      expect(Strength.getInstance(strengthEl)).toBeInstanceOf(Strength)
    })

    it('should return null when there is no instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Strength.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return existing instance', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')
      const strength = new Strength(strengthEl)

      expect(Strength.getOrCreateInstance(strengthEl)).toEqual(strength)
      expect(Strength.getOrCreateInstance(strengthEl)).toBeInstanceOf(Strength)
    })

    it('should create new instance when none exists', () => {
      fixtureEl.innerHTML = getStrengthHtml()

      const strengthEl = fixtureEl.querySelector('.strength')

      expect(Strength.getInstance(strengthEl)).toBeNull()
      expect(Strength.getOrCreateInstance(strengthEl)).toBeInstanceOf(Strength)
    })
  })
})
