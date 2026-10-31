import ColorPicker from '../../src/color-picker.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

describe('ColorPicker', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    for (const menu of document.querySelectorAll('.color-picker-menu')) {
      menu.remove()
    }

    clearFixture()
  })

  const getInputHtml = (attributes = '') =>
    `<input type="text" class="form-control" data-bs-color-picker value="#0d6efd" ${attributes}>`

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(ColorPicker.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('NAME', () => {
    it('should return plugin name', () => {
      expect(ColorPicker.NAME).toEqual('colorPicker')
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(ColorPicker.DATA_KEY).toEqual('bs.colorPicker')
    })
  })

  describe('EVENT_KEY', () => {
    it('should return plugin event key', () => {
      expect(ColorPicker.EVENT_KEY).toEqual('.bs.colorPicker')
    })
  })

  describe('Default', () => {
    it('should return default config', () => {
      expect(ColorPicker.Default).toEqual(jasmine.any(Object))
      expect(ColorPicker.Default.alpha).toBeFalse()
      expect(ColorPicker.Default.area).toBeTrue()
      expect(ColorPicker.Default.format).toBeNull()
      expect(ColorPicker.Default.swatches).toEqual('theme')
    })
  })

  describe('DefaultType', () => {
    it('should return default type config', () => {
      expect(ColorPicker.DefaultType).toEqual(jasmine.any(Object))
      expect(ColorPicker.DefaultType.format).toEqual('(string|null)')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = getInputHtml('id="picker"')

      const inputEl = fixtureEl.querySelector('#picker')
      const bySelector = new ColorPicker('#picker')
      expect(bySelector._element).toEqual(inputEl)

      bySelector.dispose()

      const byElement = new ColorPicker(inputEl)
      expect(byElement._element).toEqual(inputEl)

      byElement.dispose()
    })

    it('should not initialize on a non-input element', () => {
      fixtureEl.innerHTML = '<div data-bs-color-picker></div>'

      const divEl = fixtureEl.querySelector('div')
      const picker = new ColorPicker(divEl)

      expect(picker._menu).toBeUndefined()
    })

    it('should generate the panel next to the field', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      expect(inputEl.nextElementSibling).toEqual(picker._menu)
      expect(picker._menu.classList.contains('menu')).toBeTrue()
      expect(picker._menu.classList.contains('color-picker-menu')).toBeTrue()
      expect(picker._menu.getAttribute('role')).toEqual('dialog')

      picker.dispose()
    })

    it('should wire aria attributes to the generated panel', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      expect(inputEl.getAttribute('aria-controls')).toEqual(picker._menu.id)
      expect(inputEl.getAttribute('aria-haspopup')).toEqual('dialog')
      expect(inputEl.getAttribute('aria-expanded')).toEqual('false')

      picker.dispose()
    })

    it('should build the area, sliders and swatches', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { alpha: true })
      const { _menu: menu } = picker

      expect(menu.querySelector('.color-picker-area')).not.toBeNull()
      expect(menu.querySelector('.color-picker-area-thumb').getAttribute('role')).toEqual('slider')
      expect(menu.querySelector('.color-picker-hue .form-range-input')).not.toBeNull()
      expect(menu.querySelector('.color-picker-alpha .form-range-input')).not.toBeNull()
      expect(menu.querySelectorAll('.color-picker-swatch').length).toEqual(8)

      picker.dispose()
    })

    it('should omit the area when area is false', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { area: false })

      expect(picker._menu.querySelector('.color-picker-area')).toBeNull()
      expect(picker._menu.querySelector('.color-picker-hue')).not.toBeNull()

      picker.dispose()
    })

    it('should omit the alpha slider by default', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker._menu.querySelector('.color-picker-alpha')).toBeNull()

      picker.dispose()
    })

    it('should hide the format select when only one format is offered', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { formats: ['hex'] })

      expect(picker._menu.querySelector('.color-picker-format')).toBeNull()

      picker.dispose()
    })

    it('should read the initial value from the input', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker.getValue('hex')).toEqual('#0d6efd')

      picker.dispose()
    })

    it('should fall back to black for an unparseable initial value', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-color-picker value="nonsense">'

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker.getValue('hex')).toEqual('#000000')

      picker.dispose()
    })
  })

  describe('format inference', () => {
    it('should infer the format from the initial value', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-color-picker value="oklch(60% 0.2 240)">'

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker._format).toEqual('oklch')

      picker.dispose()
    })

    it('should honor an explicit format over the value', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-color-picker value="oklch(60% 0.2 240)">'

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { format: 'rgb' })

      expect(picker._format).toEqual('rgb')

      picker.dispose()
    })

    it('should default to hex when the value tells us nothing', () => {
      fixtureEl.innerHTML = '<input type="text" data-bs-color-picker value="">'

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker._format).toEqual('hex')

      picker.dispose()
    })
  })

  describe('show / hide', () => {
    it('should fire the show and shown events', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)
      const order = []

      inputEl.addEventListener('show.bs.colorPicker', () => order.push('show'))
      inputEl.addEventListener('shown.bs.colorPicker', () => order.push('shown'))

      picker.show()

      expect(order).toEqual(['show', 'shown'])
      expect(picker._menu.classList.contains('show')).toBeTrue()
      expect(inputEl.getAttribute('aria-expanded')).toEqual('true')

      picker.dispose()
    })

    it('should fire the hide and hidden events', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)
      const order = []

      inputEl.addEventListener('hide.bs.colorPicker', () => order.push('hide'))
      inputEl.addEventListener('hidden.bs.colorPicker', () => order.push('hidden'))

      picker.show()
      picker.hide()

      expect(order).toEqual(['hide', 'hidden'])
      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should be cancelable through the show event', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.addEventListener('show.bs.colorPicker', event => event.preventDefault())
      picker.show()

      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should toggle', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      picker.toggle()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.toggle()
      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should not open when the input is disabled', () => {
      fixtureEl.innerHTML = getInputHtml('disabled')

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      picker.show()

      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should not open when the input is readonly', () => {
      fixtureEl.innerHTML = getInputHtml('readonly')

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      picker.show()

      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should open on ArrowDown in the input', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.dispose()
    })

    it('should close on Escape in the input', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      picker.show()
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should close on Escape inside the panel and return focus to the input', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      picker.show()
      picker._menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(picker._menu.classList.contains('show')).toBeFalse()
      expect(document.activeElement).toEqual(inputEl)

      picker.dispose()
    })

    it('should open but not close when clicking into the text field', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.click()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      // Placing the caret in an open field must not dismiss the panel
      inputEl.click()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.dispose()
    })
  })

  describe('swatches', () => {
    it('should write the input value and fire native events on selection', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl, {
        swatches: ['#ff0000', '#00ff00']
      })

      const events = []
      inputEl.addEventListener('input', () => events.push('input'))
      inputEl.addEventListener('change', () => events.push('change'))

      picker.show()
      picker._menu.querySelector('.color-picker-swatch').click()

      expect(inputEl.value).toEqual('#ff0000')
      expect(events).toEqual(['input', 'change'])

      picker.dispose()
    })

    it('should fire changed.bs.colorPicker with a rich payload', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl, { swatches: ['#ff0000'] })
      let payload = null

      inputEl.addEventListener('changed.bs.colorPicker', event => {
        payload = event
      })

      picker.show()
      picker._menu.querySelector('.color-picker-swatch').click()

      expect(payload.value).toEqual('#ff0000')
      expect(payload.format).toEqual('hex')
      expect(payload.color.h).toEqual(jasmine.any(Number))

      picker.dispose()
    })

    it('should mark the matching swatch as selected', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), {
        swatches: ['#0d6efd', '#ff0000']
      })

      picker.show()

      const swatches = picker._menu.querySelectorAll('.color-picker-swatch')

      expect(swatches[0].classList.contains('selected')).toBeTrue()
      expect(swatches[0].getAttribute('aria-pressed')).toEqual('true')
      expect(swatches[1].classList.contains('selected')).toBeFalse()

      picker.dispose()
    })

    it('should close after selection when closeOnSelect is on', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), {
        swatches: ['#ff0000'],
        closeOnSelect: true
      })

      picker.show()
      picker._menu.querySelector('.color-picker-swatch').click()

      expect(picker._menu.classList.contains('show')).toBeFalse()

      picker.dispose()
    })

    it('should source swatches from a datalist', () => {
      fixtureEl.innerHTML = [
        getInputHtml('list="swatchList"'),
        '<datalist id="swatchList">',
        '<option value="#ff0000" label="Red"></option>',
        '<option value="#00ff00" label="Green"></option>',
        '</datalist>'
      ].join('')

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const swatches = picker._menu.querySelectorAll('.color-picker-swatch')

      // A `list` attribute is treated as intent, overriding the theme default
      expect(picker._config.swatches).toEqual('datalist')
      expect(swatches.length).toEqual(2)
      expect(swatches[0].dataset.bsValue).toEqual('#ff0000')
      expect(swatches[0].getAttribute('aria-label')).toEqual('Red')

      picker.dispose()
    })

    it('should build a palette grid from swatchStops', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), {
        swatches: 'palette',
        swatchStops: [300, 500]
      })

      expect(picker._menu.querySelectorAll('.color-picker-swatch').length).toEqual(32)

      picker.dispose()
    })

    it('should render no swatch grid when swatches is false', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { swatches: false })

      expect(picker._menu.querySelector('.color-picker-swatches')).toBeNull()

      picker.dispose()
    })

    it('should accept object swatches with labels', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), {
        swatches: [{ value: '#ff0000', label: 'Brand red' }]
      })

      const swatch = picker._menu.querySelector('.color-picker-swatch')

      expect(swatch.getAttribute('aria-label')).toEqual('Brand red')

      picker.dispose()
    })
  })

  describe('sliders', () => {
    it('should update the hue from the hue slider', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const hue = picker._menu.querySelector('.color-picker-hue .form-range-input')

      hue.value = '120'
      hue.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(Math.round(picker._color.h)).toEqual(120)

      picker.dispose()
    })

    it('should stream input during a drag and change only when it settles', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)
      const hue = picker._menu.querySelector('.color-picker-hue .form-range-input')

      let inputCount = 0
      let changeCount = 0
      inputEl.addEventListener('input', () => inputCount++)
      inputEl.addEventListener('change', () => changeCount++)

      hue.value = '90'
      hue.dispatchEvent(createEvent('input', { bubbles: true }))
      hue.value = '120'
      hue.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputCount).toEqual(2)
      expect(changeCount).toEqual(0)

      hue.dispatchEvent(createEvent('change', { bubbles: true }))

      expect(changeCount).toEqual(1)

      picker.dispose()
    })

    it('should emit alpha in the output when the alpha slider moves', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl, { alpha: true })
      const alpha = picker._menu.querySelector('.color-picker-alpha .form-range-input')

      alpha.value = '0.5'
      alpha.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputEl.value).toEqual('#0d6efd80')

      picker.dispose()
    })
  })

  describe('format switching', () => {
    it('should rewrite the value in the chosen format', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)
      const select = picker._menu.querySelector('.color-picker-format')

      select.value = 'rgb'
      select.dispatchEvent(createEvent('change', { bubbles: true }))

      expect(inputEl.value).toEqual('rgb(13 110 253)')

      select.value = 'oklch'
      select.dispatchEvent(createEvent('change', { bubbles: true }))

      expect(inputEl.value).toMatch(/^oklch\(/)

      picker.dispose()
    })

    it('should convert on demand through getValue', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker.getValue()).toEqual('#0d6efd')
      expect(picker.getValue('rgb')).toEqual('rgb(13 110 253)')
      expect(picker.getValue('oklch')).toMatch(/^oklch\(/)

      picker.dispose()
    })
  })

  describe('typed values', () => {
    it('should track typed text without rewriting it', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = '#ff0000'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(picker.getValue('hex')).toEqual('#ff0000')
      // Still exactly what the user typed
      expect(inputEl.value).toEqual('#ff0000')

      picker.dispose()
    })

    it('should not reformat a half typed value mid keystroke', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = 'oklch(60% 0.2'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputEl.value).toEqual('oklch(60% 0.2')

      picker.dispose()
    })

    it('should normalize on Enter', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = '#F00'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(inputEl.value).toEqual('#ff0000')

      picker.dispose()
    })

    it('should normalize on blur', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = 'rgb(255 0 0)'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))
      inputEl.dispatchEvent(new FocusEvent('blur', { bubbles: false }))

      expect(inputEl.value).toEqual('#ff0000')

      picker.dispose()
    })

    it('should resolve a named color typed into the field', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = 'rebeccapurple'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(picker.getValue('hex')).toEqual('#663399')

      picker.dispose()
    })
  })

  describe('validation', () => {
    it('should set a custom validity for unparseable text', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = 'nonsense'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputEl.validationMessage).toEqual('Enter a valid CSS color.')
      expect(inputEl.checkValidity()).toBeFalse()

      picker.dispose()
    })

    it('should clear the validity once the text parses again', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = 'nonsense'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))
      inputEl.value = '#00ff00'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputEl.checkValidity()).toBeTrue()

      picker.dispose()
    })

    it('should treat an empty field as valid', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = ''
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputEl.checkValidity()).toBeTrue()

      picker.dispose()
    })

    it('should stay quiet when validate is off', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl, { validate: false })

      inputEl.value = 'nonsense'
      inputEl.dispatchEvent(createEvent('input', { bubbles: true }))

      expect(inputEl.checkValidity()).toBeTrue()

      picker.dispose()
    })
  })

  describe('form reset', () => {
    it('should resync from defaultValue', () => {
      fixtureEl.innerHTML = [
        '<form>',
        getInputHtml(),
        '</form>'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const formEl = fixtureEl.querySelector('form')
      const picker = new ColorPicker(inputEl)

      picker.setValue('#ff0000')
      expect(picker.getValue('hex')).toEqual('#ff0000')

      formEl.reset()

      return new Promise(resolve => {
        setTimeout(() => {
          expect(inputEl.value).toEqual('#0d6efd')
          expect(picker.getValue('hex')).toEqual('#0d6efd')

          picker.dispose()
          resolve()
        }, 10)
      })
    })
  })

  describe('area', () => {
    it('should move the thumb with the arrow keys', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const thumb = picker._menu.querySelector('.color-picker-area-thumb')

      picker.show()

      const before = picker._color.c
      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

      expect(picker._color.c).toBeGreaterThan(before)

      picker.dispose()
    })

    it('should take bigger steps with Shift held', () => {
      fixtureEl.innerHTML = getInputHtml()

      const pickerA = new ColorPicker(fixtureEl.querySelector('input'))
      const startChroma = pickerA._color.c
      const thumbA = pickerA._menu.querySelector('.color-picker-area-thumb')

      thumbA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      const fineStep = pickerA._color.c - startChroma

      pickerA._color = { ...pickerA._color, c: startChroma }
      thumbA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }))
      const coarseStep = pickerA._color.c - startChroma

      expect(coarseStep).toBeGreaterThan(fineStep)

      pickerA.dispose()
    })

    it('should jump to the chroma extremes with Home and End', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const thumb = picker._menu.querySelector('.color-picker-area-thumb')

      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
      expect(picker._color.c).toEqual(0)

      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
      expect(picker._color.c).toBeGreaterThan(0)

      picker.dispose()
    })

    it('should change lightness with ArrowUp and ArrowDown', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const thumb = picker._menu.querySelector('.color-picker-area-thumb')

      const before = picker._color.l
      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(picker._color.l).toBeGreaterThan(before)

      picker.dispose()
    })

    // Committing writes a rounded string to the input. If the component listens to
    // its own echo, the model is quantized to the output format on every step and
    // a drag visibly snaps to 8-bit values.
    it('should not quantize the model to the output format on commit', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { format: 'hex' })
      const thumb = picker._menu.querySelector('.color-picker-area-thumb')

      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))

      expect(picker._color.c).toEqual(0)

      for (let index = 0; index < 60; index++) {
        thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      }

      expect(picker._color.l).toEqual(1)

      picker.dispose()
    })

    it('should ignore unrelated keys', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const thumb = picker._menu.querySelector('.color-picker-area-thumb')
      const before = { ...picker._color }

      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))

      expect(picker._color).toEqual(before)

      picker.dispose()
    })

    it('should clamp lightness and chroma to their bounds', () => {
      fixtureEl.innerHTML = getInputHtml()

      const picker = new ColorPicker(fixtureEl.querySelector('input'))
      const thumb = picker._menu.querySelector('.color-picker-area-thumb')

      for (let index = 0; index < 40; index++) {
        thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true }))
        thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }))
      }

      expect(picker._color.l).toEqual(1)
      expect(picker._color.c).toBeLessThanOrEqual(0.37)

      picker.dispose()
    })
  })

  describe('custom triggers', () => {
    it('should use a data-bs-toggle element as the trigger', () => {
      fixtureEl.innerHTML = [
        getInputHtml('id="brandColor"'),
        '<button type="button" data-bs-toggle="color-picker" data-bs-target="#brandColor">Pick</button>'
      ].join('')

      const inputEl = fixtureEl.querySelector('input')
      const buttonEl = fixtureEl.querySelector('button')
      const picker = new ColorPicker(inputEl)

      expect(picker._trigger).toEqual(buttonEl)

      buttonEl.click()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.dispose()
    })

    it('should use the wrapper as the trigger when one is present', () => {
      fixtureEl.innerHTML = [
        '<div class="color-picker">',
        '<button type="button" class="color-picker-preview"></button>',
        '<input type="text" class="form-ghost" data-bs-color-picker value="#0d6efd">',
        '</div>'
      ].join('')

      const wrapperEl = fixtureEl.querySelector('.color-picker')
      const previewEl = fixtureEl.querySelector('.color-picker-preview')
      const picker = new ColorPicker(fixtureEl.querySelector('input'))

      expect(picker._trigger).toEqual(wrapperEl)
      expect(picker._preview).toEqual(previewEl)
      // The panel follows the wrapper, not the input inside it
      expect(wrapperEl.nextElementSibling).toEqual(picker._menu)

      previewEl.click()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.dispose()
    })
  })

  describe('native color input', () => {
    it('should force hex and drop alpha', () => {
      fixtureEl.innerHTML = '<input type="color" class="form-control-color" data-bs-color-picker value="#0d6efd">'

      const picker = new ColorPicker(fixtureEl.querySelector('input'), { alpha: true, format: 'oklch' })

      expect(picker._config.format).toEqual('hex')
      expect(picker._config.alpha).toBeFalse()
      expect(picker._config.formats).toEqual(['hex'])
      expect(picker._menu.querySelector('.color-picker-format')).toBeNull()

      picker.dispose()
    })

    it('should suppress the platform dialog', () => {
      fixtureEl.innerHTML = '<input type="color" data-bs-color-picker value="#0d6efd">'

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })

      inputEl.dispatchEvent(clickEvent)

      expect(clickEvent.defaultPrevented).toBeTrue()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.dispose()
    })
  })

  describe('setValue', () => {
    it('should accept any CSS color', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      picker.setValue('rebeccapurple')

      expect(inputEl.value).toEqual('#663399')

      picker.dispose()
    })

    it('should ignore a value it cannot resolve', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      picker.setValue('nonsense')

      expect(inputEl.value).toEqual('#0d6efd')

      picker.dispose()
    })
  })

  describe('update', () => {
    it('should resync after the value is changed externally', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      inputEl.value = '#00ff00'
      picker.update()

      expect(picker.getValue('hex')).toEqual('#00ff00')

      picker.dispose()
    })
  })

  describe('dispose', () => {
    it('should remove the panel and clean up the input', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)
      const { _menu: menu } = picker

      picker.dispose()

      expect(menu.parentNode).toBeNull()
      expect(inputEl.getAttribute('aria-controls')).toBeNull()
      expect(inputEl.getAttribute('aria-expanded')).toBeNull()
      expect(ColorPicker.getInstance(inputEl)).toBeNull()
    })
  })

  describe('getInstance / getOrCreateInstance', () => {
    it('should return the instance for an element', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = new ColorPicker(inputEl)

      expect(ColorPicker.getInstance(inputEl)).toEqual(picker)

      picker.dispose()
    })

    it('should create an instance when none exists', () => {
      fixtureEl.innerHTML = getInputHtml()

      const inputEl = fixtureEl.querySelector('input')
      const picker = ColorPicker.getOrCreateInstance(inputEl)

      expect(picker).toBeInstanceOf(ColorPicker)
      expect(ColorPicker.getOrCreateInstance(inputEl)).toEqual(picker)

      picker.dispose()
    })
  })

  describe('data-api', () => {
    it('should toggle through a data-bs-toggle click', () => {
      fixtureEl.innerHTML = [
        getInputHtml('id="apiColor"'),
        '<button type="button" data-bs-toggle="color-picker" data-bs-target="#apiColor">Pick</button>'
      ].join('')

      const buttonEl = fixtureEl.querySelector('button')

      buttonEl.click()

      const picker = ColorPicker.getInstance(fixtureEl.querySelector('input'))

      expect(picker).not.toBeNull()
      expect(picker._menu.classList.contains('show')).toBeTrue()

      picker.dispose()
    })
  })
})
