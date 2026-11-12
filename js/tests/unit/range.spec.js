import Range from '../../src/range.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

describe('Range', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  const getRangeHtml = (wrapperAttributes = '', inputAttributes = '') => {
    return `
      <div class="form-range" ${wrapperAttributes}>
        <input type="range" class="form-range-input" min="0" max="100" value="50" ${inputAttributes}>
      </div>
    `
  }

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Range.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Range.DATA_KEY).toEqual('bs.range')
    })
  })

  describe('Default', () => {
    it('should return default config', () => {
      expect(Range.Default).toEqual(jasmine.any(Object))
      expect(Range.Default.bubble).toBeFalse()
    })
  })

  describe('DefaultType', () => {
    it('should return default type config', () => {
      expect(Range.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const rangeBySelector = new Range('.form-range')
      expect(rangeBySelector._element).toEqual(rangeEl)

      rangeBySelector.dispose()

      const rangeByElement = new Range(rangeEl)
      expect(rangeByElement._element).toEqual(rangeEl)
    })

    it('should find the range input inside the wrapper', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const inputEl = fixtureEl.querySelector('.form-range-input')
      const range = new Range(rangeEl)

      expect(range._input).toEqual(inputEl)
    })

    it('should set the --bs-range-fill custom property on init', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      expect(rangeEl.style.getPropertyValue('--bs-range-fill')).toEqual('0.5')
    })

    it('should honor min/max when computing the fill ratio', () => {
      fixtureEl.innerHTML = `
        <div class="form-range">
          <input type="range" class="form-range-input" min="0" max="200" value="50">
        </div>
      `

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      expect(rangeEl.style.getPropertyValue('--bs-range-fill')).toEqual('0.25')
    })

    it('should do nothing when there is no range input', () => {
      fixtureEl.innerHTML = '<div class="form-range"></div>'

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(range._input).toBeNull()
    })
  })

  describe('update', () => {
    it('should update the --bs-range-fill custom property on input', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const inputEl = fixtureEl.querySelector('.form-range-input')
      new Range(rangeEl) // eslint-disable-line no-new

      inputEl.value = '75'
      inputEl.dispatchEvent(createEvent('input'))

      expect(rangeEl.style.getPropertyValue('--bs-range-fill')).toEqual('0.75')
    })
  })

  describe('explicit refresh', () => {
    it('should refresh a programmatic value without a native input event', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble')
      const wrapper = fixtureEl.querySelector('.form-range')
      const input = wrapper.querySelector('input')
      const range = new Range(wrapper)
      input.value = '75'
      expect(wrapper.style.getPropertyValue('--bs-range-fill')).toEqual('0.5')
      range.update()
      expect(wrapper.style.getPropertyValue('--bs-range-fill')).toEqual('0.75')
      expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('75')
    })

    it('should apply added, false, removed, and bare bubble attributes without duplicates', () => {
      fixtureEl.innerHTML = getRangeHtml()
      const wrapper = fixtureEl.querySelector('.form-range')
      const range = new Range(wrapper)
      for (const value of ['true', 'false', '', null, 'true']) {
        if (value === null) {
          wrapper.removeAttribute('data-bs-bubble')
        } else {
          wrapper.setAttribute('data-bs-bubble', value)
        }

        range.update()
        range.update()
        const enabled = value === 'true' || value === ''
        expect(wrapper.querySelectorAll('.form-range-bubble').length).toEqual(enabled ? 1 : 0)
        if (enabled) {
          expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('50')
        }
      }
    })

    it('should preserve copied JavaScript options over current data configuration', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble="false"')
      const wrapper = fixtureEl.querySelector('.form-range')
      const options = { bubble: true, formatter: value => `${value}%` }
      const range = new Range(wrapper, options)
      options.bubble = false
      wrapper.dataset.bsConfig = '{"bubble":false}'
      range.update()
      expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('50%')
    })

    it('should reread JSON configuration and validate before changing decorations', () => {
      fixtureEl.innerHTML = getRangeHtml()
      const wrapper = fixtureEl.querySelector('.form-range')
      const range = new Range(wrapper)
      wrapper.dataset.bsConfig = '{"bubble":true}'
      range.update()
      expect(wrapper.querySelector('.form-range-bubble')).not.toBeNull()
      wrapper.dataset.bsBubble = 'invalid'
      expect(() => range.update()).toThrowError(TypeError)
      expect(wrapper.querySelectorAll('.form-range-bubble').length).toEqual(1)
    })

    it('should not refresh configuration or rebuild ticks during input events', () => {
      fixtureEl.innerHTML = `
        ${getRangeHtml('', 'list="live-ticks"')}
        <datalist id="live-ticks"><option value="25"></option></datalist>
      `
      const wrapper = fixtureEl.querySelector('.form-range')
      const range = new Range(wrapper)
      const ticks = wrapper.querySelector('.form-range-ticks')
      wrapper.dataset.bsBubble = 'true'
      wrapper.querySelector('input').dispatchEvent(createEvent('input'))
      expect(wrapper.querySelector('.form-range-bubble')).toBeNull()
      expect(wrapper.querySelector('.form-range-ticks')).toEqual(ticks)
      range.dispose()
    })

    it('should tolerate an instance without an input', () => {
      fixtureEl.innerHTML = '<div class="form-range"></div>'
      const range = new Range(fixtureEl.firstElementChild)
      expect(() => range.update()).not.toThrow()
      expect(() => range.dispose()).not.toThrow()
    })

    it('should rebuild current tick values, labels, bounds, and list association', () => {
      fixtureEl.innerHTML = `
        ${getRangeHtml('', 'list="first-list"')}
        <datalist id="first-list"><option value="0"></option><option value="100"></option></datalist>
        <datalist id="second-list"><option value="50" label="Center"></option></datalist>
      `
      const wrapper = fixtureEl.querySelector('.form-range')
      const input = wrapper.querySelector('input')
      const range = new Range(wrapper)
      const option = fixtureEl.querySelector('#second-list option')
      input.setAttribute('list', 'second-list')
      input.max = '200'
      range.update()
      expect(wrapper.querySelector('.form-range-ticks').style.gridTemplateColumns).toEqual('0.25fr 0.75fr')
      expect(wrapper.querySelector('.form-range-tick-label').textContent).toEqual('Center')
      option.value = '100'
      option.label = 'New label'
      input.min = '50'
      range.update()
      range.update()
      expect(wrapper.querySelectorAll('.form-range-ticks').length).toEqual(1)
      expect(wrapper.querySelectorAll('.form-range-tick').length).toEqual(1)
      expect(wrapper.querySelector('.form-range-tick-label').textContent).toEqual('New label')
      fixtureEl.querySelector('#second-list').replaceChildren()
      range.update()
      expect(wrapper.querySelector('.form-range-ticks')).toBeNull()
      fixtureEl.querySelector('#second-list').append(option)
      range.update()
      input.removeAttribute('list')
      range.update()
      expect(wrapper.querySelector('.form-range-ticks')).toBeNull()
    })
  })

  describe('native reset', () => {
    const settle = () => new Promise(resolve => {
      setTimeout(resolve, 10)
    })
    const prepare = (external = false) => {
      const control = getRangeHtml('data-bs-bubble', external ? 'form="range-form"' : '')
      fixtureEl.innerHTML = `
        <form id="range-form">${external ? '' : control}<button type="reset">Reset</button></form>
        ${external ? control : ''}
      `
      const wrapper = fixtureEl.querySelector('.form-range')
      const input = wrapper.querySelector('input')
      const form = fixtureEl.querySelector('form')
      const range = new Range(wrapper)
      input.value = '80'
      range.update()
      return {
        wrapper, input, form, range
      }
    }

    for (const external of [false, true]) {
      it(`should refresh after a real reset button restores an ${external ? 'externally associated' : 'enclosed'} input`, async () => {
        const { wrapper, form, range } = prepare(external)
        form.querySelector('button').click()
        await settle()
        expect(wrapper.style.getPropertyValue('--bs-range-fill')).toEqual('0.5')
        expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('50')
        expect(wrapper.querySelector('.tooltip-arrow')).not.toBeNull()
        expect(wrapper.querySelector('.form-range-bubble').tagName).toEqual('DIV')
        range.dispose()
      })
    }

    it('should respect reset cancellation by a later listener', async () => {
      const { wrapper, input, form, range } = prepare()
      let events = 0
      input.addEventListener('changed.bs.range', () => events++)
      form.addEventListener('reset', event => event.preventDefault())
      form.reset()
      await settle()
      expect(input.value).toEqual('80')
      expect(wrapper.style.getPropertyValue('--bs-range-fill')).toEqual('0.8')
      expect(events).toEqual(0)
      range.dispose()
    })

    it('should keep a completed reset when a subsequent reset is canceled', async () => {
      const { wrapper, form, range } = prepare()
      form.reset()
      form.addEventListener('reset', event => event.preventDefault(), { once: true })
      form.reset()
      await settle()
      expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('50')
      range.dispose()
    })

    it('should cancel pending resets and release the listener on disposal', async () => {
      const { input, form, range } = prepare()
      let events = 0
      input.addEventListener('changed.bs.range', () => events++)
      form.reset()
      range.dispose()
      await settle()
      form.reset()
      await settle()
      expect(events).toEqual(0)
    })

    it('should preserve other Range listeners when one instance is disposed', async () => {
      const { wrapper, form, range } = prepare()
      form.insertAdjacentHTML('beforeend', getRangeHtml('data-bs-bubble'))
      const second = form.querySelectorAll('.form-range')[1]
      const other = new Range(second)
      second.querySelector('input').value = '90'
      other.update()
      range.dispose()
      form.reset()
      await settle()
      expect(second.querySelector('.tooltip-inner').textContent).toEqual('50')
      expect(wrapper.querySelector('.form-range-bubble')).toBeNull()
      other.dispose()
    })

    it('should rebind the form association on explicit update', async () => {
      const { wrapper, input, form, range } = prepare(true)
      form.insertAdjacentHTML('afterend', '<form id="other-form"></form>')
      input.setAttribute('form', 'other-form')
      range.update()
      input.value = '70'
      form.reset()
      await settle()
      expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('80')
      fixtureEl.querySelector('#other-form').reset()
      await settle()
      expect(wrapper.querySelector('.tooltip-inner').textContent).toEqual('50')
      range.dispose()
    })
  })

  describe('bubble', () => {
    it('should create a tooltip-based value bubble when enabled', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble')

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const bubble = fixtureEl.querySelector('.form-range-bubble')
      expect(bubble).not.toBeNull()
      expect(bubble).toHaveClass('tooltip')
      expect(bubble.querySelector('.tooltip-inner').textContent).toEqual('50')
    })

    it('should not create a bubble by default', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('.form-range-bubble')).toBeNull()
    })

    it('should update the bubble text on input', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble')

      const rangeEl = fixtureEl.querySelector('.form-range')
      const inputEl = fixtureEl.querySelector('.form-range-input')
      new Range(rangeEl) // eslint-disable-line no-new

      inputEl.value = '80'
      inputEl.dispatchEvent(createEvent('input'))

      expect(fixtureEl.querySelector('.tooltip-inner').textContent).toEqual('80')
    })

    it('should format the bubble text with a custom formatter', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble')

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl, { formatter: value => `${value}%` }) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('.tooltip-inner').textContent).toEqual('50%')
    })
  })

  describe('ticks', () => {
    const getTicksHtml = () => {
      return `
        <div class="form-range">
          <input type="range" class="form-range-input" min="0" max="100" value="50" list="ticksList">
        </div>
        <datalist id="ticksList">
          <option value="0" label="Low"></option>
          <option value="10"></option>
          <option value="100" label="High"></option>
        </datalist>
      `
    }

    it('should render a tick for each datalist option', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const ticks = fixtureEl.querySelectorAll('.form-range-tick')
      expect(ticks.length).toEqual(3)
    })

    it('should place each tick on a grid line via grid-template-columns (handles uneven values)', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      // datalist values 0/10/100 -> gaps between 0, .1, 1, and 1
      const ticksEl = fixtureEl.querySelector('.form-range-ticks')
      expect(ticksEl.style.gridTemplateColumns).toEqual('0fr 0.1fr 0.9fr 0fr')

      const ticks = fixtureEl.querySelectorAll('.form-range-tick')
      expect(ticks[0].style.gridColumnStart).toEqual('2')
      expect(ticks[1].style.gridColumnStart).toEqual('3')
      expect(ticks[2].style.gridColumnStart).toEqual('4')
    })

    it('should render labels from the option label only', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const labels = fixtureEl.querySelectorAll('.form-range-tick-label')
      expect(labels.length).toEqual(2)
      expect(labels[0].textContent).toEqual('Low')
      expect(labels[1].textContent).toEqual('High')
    })

    it('should do nothing when there is no linked datalist', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(range._ticks).toBeNull()
      expect(fixtureEl.querySelector('.form-range-ticks')).toBeNull()
    })
  })

  describe('events', () => {
    it('should trigger a changed event with the current value', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getRangeHtml()

        const rangeEl = fixtureEl.querySelector('.form-range')
        const inputEl = fixtureEl.querySelector('.form-range-input')
        new Range(rangeEl) // eslint-disable-line no-new

        inputEl.addEventListener('changed.bs.range', event => {
          expect(event.value).toEqual(90)
          resolve()
        })

        inputEl.value = '90'
        inputEl.dispatchEvent(createEvent('input'))
      })
    })
  })

  describe('dispose', () => {
    it('should dispose the instance and remove decorations', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble')

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(Range.getInstance(rangeEl)).not.toBeNull()
      expect(fixtureEl.querySelector('.form-range-bubble')).not.toBeNull()

      range.dispose()

      expect(Range.getInstance(rangeEl)).toBeNull()
      expect(fixtureEl.querySelector('.form-range-bubble')).toBeNull()
    })
  })

  describe('getInstance', () => {
    it('should return range instance', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(Range.getInstance(rangeEl)).toEqual(range)
      expect(Range.getInstance(rangeEl)).toBeInstanceOf(Range)
    })

    it('should return null when there is no instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Range.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return existing instance', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(Range.getOrCreateInstance(rangeEl)).toEqual(range)
      expect(Range.getOrCreateInstance(rangeEl)).toBeInstanceOf(Range)
    })

    it('should create new instance when none exists', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')

      expect(Range.getInstance(rangeEl)).toBeNull()
      expect(Range.getOrCreateInstance(rangeEl)).toBeInstanceOf(Range)
    })
  })

  describe('data API', () => {
    it('should start ranges when Bootstrap loads after the page', async () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      const inputEl = rangeEl.querySelector('input')

      // `DOMContentLoaded` has long fired: load a second copy of the plugin, as a playground
      // that runs its script once the page is rendered does
      await import('../../src/range.js?late')

      expect(Range.getInstance(rangeEl)).not.toBeNull()
      expect(rangeEl.style.getPropertyValue('--bs-range-fill')).toEqual('0.5')

      inputEl.value = '80'
      inputEl.dispatchEvent(createEvent('input'))

      expect(rangeEl.style.getPropertyValue('--bs-range-fill')).toEqual('0.8')
    })
  })
})
