import * as Scrollbar from '../../../src/util/scrollbar'
import { clearFixture, getFixture } from '../../helpers/fixture'

describe('ScrollBar', () => {
  let fixtureEl
  const windowCalculations = () => {
    return {
      htmlClient: document.documentElement.clientWidth,
      htmlOffset: document.documentElement.offsetWidth,
      docClient: document.body.clientWidth,
      htmlBound: document.documentElement.getBoundingClientRect().width,
      bodyBound: document.body.getBoundingClientRect().width,
      window: window.innerWidth,
      width: Math.abs(window.innerWidth - document.documentElement.clientWidth)
    }
  }

  const isScrollBarHidden = () => { // IOS devices, Android devices and Browsers on Mac, hide scrollbar by default and appear it, only while scrolling. So the tests for scrollbar would fail
    const calc = windowCalculations()
    return calc.htmlClient === calc.htmlOffset && calc.htmlClient === calc.window
  }

  beforeAll(() => {
    fixtureEl = getFixture()
    // custom fixture to avoid extreme style values
    fixtureEl.removeAttribute('style')
  })

  afterAll(() => {
    fixtureEl.remove()
    document.documentElement.style.overflowY = 'auto'
    document.body.style.overflowY = 'auto'
  })

  afterEach(() => {
    clearFixture()
    document.documentElement.removeAttribute('style')
  })

  beforeEach(() => {
    document.documentElement.removeAttribute('style')
  })

  describe('isBodyOverflowing', () => {
    it('should return true if body is overflowing', () => {
      document.documentElement.style.overflowY = 'scroll'
      document.body.style.overflowY = 'scroll'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')
      const result = Scrollbar.isBodyOverflowing()

      if (isScrollBarHidden()) {
        expect(result).toEqual(false)
      } else {
        expect(result).toEqual(true)
      }
    })

    it('should return false if body is overflowing', () => {
      document.documentElement.style.overflowY = 'hidden'
      document.body.style.overflowY = 'hidden'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')
      const result = Scrollbar.isBodyOverflowing()

      expect(result).toEqual(false)
    })
  })

  describe('getWidth', () => {
    it('should return an integer greater than zero, if body is overflowing', () => {
      document.documentElement.style.overflowY = 'scroll'
      document.body.style.overflowY = 'scroll'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')
      const result = Scrollbar.getWidth()

      if (isScrollBarHidden()) {
        expect(result).toBe(0)
      } else {
        expect(result).toBeGreaterThan(1)
      }
    })

    it('should return 0 if body is not overflowing', () => {
      document.documentElement.style.overflowY = 'hidden'
      document.body.style.overflowY = 'hidden'
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%"></div>'
      ].join('')

      const result = Scrollbar.getWidth()

      expect(result).toEqual(0)
    })
  })

  describe('hide - reset', () => {
    it('should adjust the inline padding of fixed elements which are full-width', done => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%">' +
        '<div class="fixed-top" id="fixed1" style="padding-right: 0px; width: 100vw"></div>',
        '<div class="fixed-top" id="fixed2" style="padding-right: 5px; width: 100vw"></div>',
        '</div>'
      ].join('')
      document.documentElement.style.overflowY = 'scroll'

      const fixedEl = fixtureEl.querySelector('#fixed1')
      const fixedEl2 = fixtureEl.querySelector('#fixed2')
      const originalPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      const originalPadding2 = Number.parseInt(window.getComputedStyle(fixedEl2).paddingRight, 10)
      const expectedPadding = originalPadding + Scrollbar.getWidth()
      const expectedPadding2 = originalPadding2 + Scrollbar.getWidth()

      Scrollbar.hide()

      let currentPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      let currentPadding2 = Number.parseInt(window.getComputedStyle(fixedEl2).paddingRight, 10)
      expect(fixedEl.getAttribute('data-bs-padding-right')).toEqual('0px', 'original fixed element padding should be stored in data-bs-padding-right')
      expect(fixedEl2.getAttribute('data-bs-padding-right')).toEqual('5px', 'original fixed element padding should be stored in data-bs-padding-right')
      expect(currentPadding).toEqual(expectedPadding, 'fixed element padding should be adjusted while opening')
      expect(currentPadding2).toEqual(expectedPadding2, 'fixed element padding should be adjusted while opening')

      Scrollbar.reset()
      currentPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      currentPadding2 = Number.parseInt(window.getComputedStyle(fixedEl2).paddingRight, 10)
      expect(fixedEl.getAttribute('data-bs-padding-right')).toEqual(null, 'data-bs-padding-right should be cleared after closing')
      expect(fixedEl2.getAttribute('data-bs-padding-right')).toEqual(null, 'data-bs-padding-right should be cleared after closing')
      expect(currentPadding).toEqual(originalPadding, 'fixed element padding should be reset after closing')
      expect(currentPadding2).toEqual(originalPadding2, 'fixed element padding should be reset after closing')
      done()
    })

    it('should adjust the inline margin of sticky elements', done => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">' +
        '<div class="sticky-top" style="margin-right: 0px; width: 100vw; height: 10px"></div>',
        '</div>'
      ].join('')
      document.documentElement.style.overflowY = 'scroll'

      const stickyTopEl = fixtureEl.querySelector('.sticky-top')
      const originalMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      const expectedMargin = originalMargin - Scrollbar.getWidth()
      Scrollbar.hide()

      let currentMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      expect(stickyTopEl.getAttribute('data-bs-margin-right')).toEqual('0px', 'original sticky element margin should be stored in data-bs-margin-right')
      expect(currentMargin).toEqual(expectedMargin, 'sticky element margin should be adjusted while opening')

      Scrollbar.reset()
      currentMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)

      expect(stickyTopEl.getAttribute('data-bs-margin-right')).toEqual(null, 'data-bs-margin-right should be cleared after closing')
      expect(currentMargin).toEqual(originalMargin, 'sticky element margin should be reset after closing')
      done()
    })

    it('should not adjust the inline margin and padding of sticky and fixed elements when element do not have full width', () => {
      fixtureEl.innerHTML = [
        '<div class="sticky-top" style="margin-right: 0px; padding-right: 0px; width: 50vw"></div>'
      ].join('')

      const stickyTopEl = fixtureEl.querySelector('.sticky-top')
      const originalMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      const originalPadding = Number.parseInt(window.getComputedStyle(stickyTopEl).paddingRight, 10)

      Scrollbar.hide()

      const currentMargin = Number.parseInt(window.getComputedStyle(stickyTopEl).marginRight, 10)
      const currentPadding = Number.parseInt(window.getComputedStyle(stickyTopEl).paddingRight, 10)

      expect(currentMargin).toEqual(originalMargin, 'sticky element\'s margin should not be adjusted while opening')
      expect(currentPadding).toEqual(originalPadding, 'sticky element\'s padding should not be adjusted while opening')

      Scrollbar.reset()
    })
  })
})
