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

    it('should set the --bs-range-tick ratio per tick (handles uneven values)', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const ticks = fixtureEl.querySelectorAll('.form-range-tick')
      expect(ticks[0].style.getPropertyValue('--bs-range-tick')).toEqual('0')
      expect(ticks[1].style.getPropertyValue('--bs-range-tick')).toEqual('0.1')
      expect(ticks[2].style.getPropertyValue('--bs-range-tick')).toEqual('1')
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
})
