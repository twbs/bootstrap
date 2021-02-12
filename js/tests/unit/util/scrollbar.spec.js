import * as Scrollbar from '../../../src/util/scrollbar'
import { clearFixture, getFixture } from '../../helpers/fixture'

describe('ScrollBar', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    document.body.style.overflowY = 'auto'
  })

  describe('isBodyOverflowing', () => {
    it('should return true if body is overflowing', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">' +
        '<div style="width: 100%; height: 80px"></div>' +
        '</div>'
      ].join('')
      document.body.style.overflowY = 'scroll'
      const result = Scrollbar.isBodyOverflowing()

      expect(result).toEqual(true)
    })

    it('should return false if body is overflowing', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 90vh">' +
        '<div style="width: 100%; height: 80px"></div>' +
        '</div>'
      ].join('')
      document.body.style.overflowY = 'hidden'

      const result = Scrollbar.isBodyOverflowing()

      expect(result).toEqual(false)
    })
  })

  describe('getWidth', () => {
    it('should return an integer if body is overflowing', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">' +
        '<div style="width: 100%; height: 80px"></div>' +
        '</div>'
      ].join('')
      document.body.style.overflowY = 'scroll'
      const result = Scrollbar.getWidth()

      expect(result).toBeGreaterThan(1)
    })

    it('should return 0 if body is overflowing', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 90vh">' +
        '<div style="width: 100%; height: 80px"></div>' +
        '</div>'
      ].join('')
      document.body.style.overflowY = 'hidden'

      const result = Scrollbar.getWidth()

      expect(result).toEqual(0)
    })
  })

  describe('hide - reset', () => {
    it('should adjust the inline padding of fixed elements', done => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">' +
        '<div class="fixed-top" style="padding-right: 0px"></div>',
        '</div>'
      ].join('')
      document.body.style.overflowY = 'scroll'

      const fixedEl = fixtureEl.querySelector('.fixed-top')
      const originalPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      const expectedPadding = originalPadding + Scrollbar.getWidth()

      Scrollbar.hide()

      let currentPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      expect(fixedEl.getAttribute('data-bs-padding-right')).toEqual('0px', 'original fixed element padding should be stored in data-bs-padding-right')
      expect(currentPadding).toEqual(expectedPadding, 'fixed element padding should be adjusted while opening')

      Scrollbar.reset()
      currentPadding = Number.parseInt(window.getComputedStyle(fixedEl).paddingRight, 10)
      expect(fixedEl.getAttribute('data-bs-padding-right')).toEqual(null, 'data-bs-padding-right should be cleared after closing')
      expect(currentPadding).toEqual(originalPadding, 'fixed element padding should be reset after closing')
      done()
    })

    it('should adjust the inline padding of sticky elements', done => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">' +
        '<div class="sticky-top" style="margin-right: 0px;"></div>',
        '</div>'
      ].join('')
      document.body.style.overflowY = 'scroll'

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
  })
})
