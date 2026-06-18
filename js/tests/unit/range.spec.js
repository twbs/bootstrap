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

  const getRangeHtml = (attributes = '') => {
    return `<div><input type="range" class="form-range" min="0" max="100" value="50" data-bs-range ${attributes}></div>`
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
      expect(Range.Default.ticks).toBeFalse()
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

    it('should set the --bs-range-value custom property on init', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      expect(rangeEl.style.getPropertyValue('--bs-range-value')).toEqual('50%')
    })

    it('should honor min/max when computing the percentage', () => {
      fixtureEl.innerHTML = '<div><input type="range" class="form-range" min="0" max="200" value="50" data-bs-range></div>'

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      expect(rangeEl.style.getPropertyValue('--bs-range-value')).toEqual('25%')
    })
  })

  describe('update', () => {
    it('should update the --bs-range-value custom property on input', () => {
      fixtureEl.innerHTML = getRangeHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      rangeEl.value = '75'
      rangeEl.dispatchEvent(createEvent('input'))

      expect(rangeEl.style.getPropertyValue('--bs-range-value')).toEqual('75%')
    })
  })

  describe('bubble', () => {
    it('should create a value bubble when enabled', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble="true"')

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const bubble = fixtureEl.querySelector('.range-bubble')
      expect(bubble).not.toBeNull()
      expect(bubble.textContent).toEqual('50')
    })

    it('should update the bubble text on input', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble="true"')

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      rangeEl.value = '80'
      rangeEl.dispatchEvent(createEvent('input'))

      expect(fixtureEl.querySelector('.range-bubble').textContent).toEqual('80')
    })

    it('should format the bubble text with a custom formatter', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble="true"')

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl, { formatter: value => `${value}%` }) // eslint-disable-line no-new

      expect(fixtureEl.querySelector('.range-bubble').textContent).toEqual('50%')
    })
  })

  describe('ticks', () => {
    const getTicksHtml = () => {
      return `
        <div>
          <input type="range" class="form-range" min="0" max="100" value="50" list="ticksList" data-bs-range data-bs-ticks="true">
          <datalist id="ticksList">
            <option value="0" label="Low"></option>
            <option value="50"></option>
            <option value="100" label="High"></option>
          </datalist>
        </div>
      `
    }

    it('should render a tick for each datalist option', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const ticks = fixtureEl.querySelectorAll('.range-tick')
      expect(ticks.length).toEqual(3)
      expect(ticks[0].style.left).toEqual('0%')
      expect(ticks[2].style.left).toEqual('100%')
    })

    it('should render labels from the option label/value', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const labels = fixtureEl.querySelectorAll('.range-tick-label')
      expect(labels[0].textContent).toEqual('Low')
      expect(labels[2].textContent).toEqual('High')
    })

    it('should mark ticks at or below the current value as active', () => {
      fixtureEl.innerHTML = getTicksHtml()

      const rangeEl = fixtureEl.querySelector('.form-range')
      new Range(rangeEl) // eslint-disable-line no-new

      const ticks = fixtureEl.querySelectorAll('.range-tick')
      expect(ticks[0]).toHaveClass('active')
      expect(ticks[1]).toHaveClass('active')
      expect(ticks[2]).not.toHaveClass('active')
    })

    it('should do nothing when there is no linked datalist', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-ticks="true"')

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(range._ticks).toBeNull()
      expect(fixtureEl.querySelector('.range-ticks')).toBeNull()
    })
  })

  describe('events', () => {
    it('should trigger a changed event with the current value', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getRangeHtml()

        const rangeEl = fixtureEl.querySelector('.form-range')
        new Range(rangeEl) // eslint-disable-line no-new

        rangeEl.addEventListener('changed.bs.range', event => {
          expect(event.value).toEqual(90)
          resolve()
        })

        rangeEl.value = '90'
        rangeEl.dispatchEvent(createEvent('input'))
      })
    })
  })

  describe('dispose', () => {
    it('should dispose the instance and remove decorations', () => {
      fixtureEl.innerHTML = getRangeHtml('data-bs-bubble="true"')

      const rangeEl = fixtureEl.querySelector('.form-range')
      const range = new Range(rangeEl)

      expect(Range.getInstance(rangeEl)).not.toBeNull()
      expect(fixtureEl.querySelector('.range-bubble')).not.toBeNull()

      range.dispose()

      expect(Range.getInstance(rangeEl)).toBeNull()
      expect(fixtureEl.querySelector('.range-bubble')).toBeNull()
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
