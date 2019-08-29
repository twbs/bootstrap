import * as ClassList from '../../../src/dom/class-list'

/** Test helpers */
import { getFixture, clearFixture } from '../../helpers/fixture'

describe('ClassList', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('toggleClass', () => {
    it('should add class if it is missing', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      ClassList.toggleClass(div, 'test')
      expect(div.classList.contains('test')).toEqual(true)
    })

    it('should remove class if it is set', () => {
      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      ClassList.toggleClass(div, 'test')
      expect(div.classList.contains('test')).toEqual(false)
    })
  })

  describe('addClass', () => {
    it('should add one class', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      ClassList.addClass(div, 'test')

      expect(div.classList.contains('test')).toEqual(true)
    })

    it('should add several class', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      ClassList.addClass(div, 'test', 'd-block', 'd-none')

      expect(div.classList.contains('test')).toEqual(true)
      expect(div.classList.contains('d-block')).toEqual(true)
      expect(div.classList.contains('d-none')).toEqual(true)
    })
  })

  describe('removeClass', () => {
    it('should remove one class', () => {
      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      ClassList.removeClass(div, 'test')

      expect(div.classList.contains('test')).toEqual(false)
    })

    it('should remove several class', () => {
      fixtureEl.innerHTML = '<div class="test d-block d-flex"></div>'

      const div = fixtureEl.querySelector('div')

      ClassList.removeClass(div, 'test', 'd-block', 'd-flex')

      expect(div.classList.contains('test')).toEqual(false)
      expect(div.classList.contains('d-block')).toEqual(false)
      expect(div.classList.contains('d-flex')).toEqual(false)
    })
  })

  describe('hasClass', () => {
    it('should return true', () => {
      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      expect(ClassList.hasClass(div, 'test')).toEqual(true)
    })

    it('should return false', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(ClassList.hasClass(div, 'test')).toEqual(false)
    })
  })
})
