import { userEvent } from 'vitest/browser'
import css from '../../../scss/bootstrap.scss?inline'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Chip focus themes', () => {
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

  const variants = {
    button: theme => `<button class="chip theme-${theme}">Action</button>`,
    link: theme => `<a class="chip theme-${theme}" href="#target">Link</a>`,
    inherited: theme => `<div class="theme-${theme}"><button class="chip">Action</button></div>`,
    active: theme => `<button class="chip theme-${theme} active">Selected</button>`,
    dismiss: theme => `<span class="chip theme-${theme}">Value<button class="chip-dismiss" aria-label="Remove Value">×</button></span>`
  }

  for (const mode of ['light', 'dark']) {
    for (const theme of ['primary', 'accent', 'success', 'danger', 'warning', 'info', 'inverse', 'secondary']) {
      for (const [name, markup] of Object.entries(variants)) {
        it(`uses the ${theme} focus color for a ${name} chip in ${mode} mode`, async () => {
          fixture.style.colorScheme = mode
          fixture.innerHTML = `${markup(theme)}<span style="color: var(--${theme}-focus-ring)"></span>`
          const target = fixture.querySelector('button, a')
          target.focus()
          await userEvent.keyboard('{ArrowRight}')
          expect(target.matches(':focus-visible')).toBe(true)
          const focused = getComputedStyle(target)
          expect(focused.outlineStyle).toBe('solid')
          expect(focused.outlineWidth).toBe('3px')
          expect(focused.outlineColor).toBe(getComputedStyle(fixture.lastElementChild).color)
        })
      }
    }
  }

  for (const classes of ['', 'theme-reset']) {
    it(`keeps the global focus color for ${classes || 'unthemed'} chips`, async () => {
      fixture.classList.add('theme-danger')
      fixture.innerHTML = `<button class="chip ${classes}">Action</button>`
      if (!classes) {
        fixture.classList.remove('theme-danger')
      }

      fixture.style.setProperty('--focus-ring-color', 'rgb(12, 34, 56)')
      const target = fixture.querySelector('button')
      target.focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(target.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(target).outlineColor).toBe('rgb(12, 34, 56)')
    })
  }
})
