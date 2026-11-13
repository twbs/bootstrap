import css from '../../../scss/bootstrap.scss?inline'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Combobox control sizing', () => {
  let fixture
  let style

  beforeEach(() => {
    fixture = getFixture()
    style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
  })

  afterEach(() => {
    style.remove()
    clearFixture()
  })

  for (const [name, height, padding, fontSize, lineHeight] of [
    ['compact', 30, 4, 14, 20],
    ['default', 38, 6, 16, 24],
    ['spacious', 48, 10, 18, 26]
  ]) {
    it(`should match other controls with ${name} sizing tokens`, () => {
      fixture.style.setProperty('--btn-input-min-height', `${height}px`)
      fixture.style.setProperty('--btn-input-padding-y', `${padding}px`)
      fixture.style.setProperty('--btn-input-font-size', `${fontSize}px`)
      fixture.style.setProperty('--btn-input-line-height', `${lineHeight}px`)
      fixture.innerHTML = `
        <input class="form-control" aria-label="Reference">
        <div class="combobox-control">
          <span class="chip">Design<button class="chip-dismiss" type="button" aria-label="Remove Design">×</button></span>
          <input class="form-ghost" aria-label="Editor">
        </div>
      `
      const input = fixture.querySelector('.form-control')
      const control = fixture.querySelector('.combobox-control')
      expect(input.getBoundingClientRect().height).toBeCloseTo(height, 1)
      expect(control.getBoundingClientRect().height).toBeCloseTo(height, 1)
      const chip = control.querySelector('.chip').getBoundingClientRect()
      const dismiss = control.querySelector('.chip-dismiss').getBoundingClientRect()
      expect(dismiss.height).toBeLessThanOrEqual(chip.height)
    })
  }
})
