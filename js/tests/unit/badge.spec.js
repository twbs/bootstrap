import Badge from '../../src/badge'
import { getTransitionDurationFromElement } from '../../src/util/index'
import { clearFixture, getFixture, jQueryMock } from '../helpers/fixture'

describe('Badge', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should take care of element either passed as a CSS selector or DOM element', () => {
    fixtureEl.innerHTML = '<div class="badge"></div>'

    const badgeEl = fixtureEl.querySelector('.badge')
    const badgeBySelector = new Badge('.badge')
    const badgeByElement = new Badge(badgeEl)

    expect(badgeBySelector._element).toEqual(badgeEl)
    expect(badgeByElement._element).toEqual(badgeEl)
  })

  it('should return version', () => {
    expect(Badge.VERSION).toEqual(jasmine.any(String))
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Badge.DATA_KEY).toEqual('bs.badge')
    })
  })

  describe('data-api', () => {
    it('should close a badge without instantiating it manually', () => {
      fixtureEl.innerHTML = [
        '<div class="badge">',
        '  <button type="button" data-bs-dismiss="badge">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.badge')).toHaveSize(0)
    })

    it('should close a badge without instantiating it manually with the parent selector', () => {
      fixtureEl.innerHTML = [
        '<div class="badge">',
        '  <button type="button" data-bs-target=".badge" data-bs-dismiss="badge">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.badge')).toHaveSize(0)
    })
  })

  describe('close', () => {
    it('should close a badge', done => {
      fixtureEl.innerHTML = '<div class="badge"></div>'

      const badgeEl = document.querySelector('.badge')
      const badge = new Badge(badgeEl)

      badgeEl.addEventListener('closed.bs.badge', () => {
        expect(document.querySelectorAll('.badge')).toHaveSize(0)
        done()
      })

      badge.close()
    })

    it('should not remove badge if close event is prevented', done => {
      fixtureEl.innerHTML = '<div class="badge"></div>'

      const getBadge = () => document.querySelector('.badge')
      const badgeEl = getBadge()
      const badge = new Badge(badgeEl)

      badgeEl.addEventListener('close.bs.badge', event => {
        event.preventDefault()
        setTimeout(() => {
          expect(getBadge()).not.toBeNull()
          done()
        }, 10)
      })

      badgeEl.addEventListener('closed.bs.badge', () => {
        throw new Error('should not fire closed event')
      })

      badge.close()
    })
  })

  describe('dispose', () => {
    it('should dispose a badge', () => {
      fixtureEl.innerHTML = '<div class="badge"></div>'

      const badgeEl = document.querySelector('.badge')
      const badge = new Badge(badgeEl)

      expect(Badge.getInstance(badgeEl)).not.toBeNull()

      badge.dispose()

      expect(Badge.getInstance(badgeEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing badge', () => {
      fixtureEl.innerHTML = '<div class="badge"></div>'

      const badgeEl = fixtureEl.querySelector('.badge')
      const badge = new Badge(badgeEl)

      spyOn(badge, 'close')

      jQueryMock.fn.badge = Badge.jQueryInterface
      jQueryMock.elements = [badgeEl]

      jQueryMock.fn.badge.call(jQueryMock, 'close')

      expect(badge.close).toHaveBeenCalled()
    })

    it('should create new badge instance and call close', () => {
      fixtureEl.innerHTML = '<div class="badge"></div>'

      const badgeEl = fixtureEl.querySelector('.badge')

      jQueryMock.fn.badge = Badge.jQueryInterface
      jQueryMock.elements = [badgeEl]

      expect(Badge.getInstance(badgeEl)).toBeNull()
      jQueryMock.fn.badge.call(jQueryMock, 'close')

      expect(fixtureEl.querySelector('.badge')).toBeNull()
    })

    it('should just create a badge instance without calling close', () => {
      fixtureEl.innerHTML = '<div class="badge"></div>'

      const badgeEl = fixtureEl.querySelector('.badge')

      jQueryMock.fn.badge = Badge.jQueryInterface
      jQueryMock.elements = [badgeEl]

      jQueryMock.fn.badge.call(jQueryMock)

      expect(Badge.getInstance(badgeEl)).not.toBeNull()
      expect(fixtureEl.querySelector('.badge')).not.toBeNull()
    })

    it('should throw an error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.badge = Badge.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.badge.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw an error on protected method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = '_getConfig'

      jQueryMock.fn.badge = Badge.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.badge.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return badge instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const badge = new Badge(div)

      expect(Badge.getInstance(div)).toEqual(badge)
      expect(Badge.getInstance(div)).toBeInstanceOf(Badge)
    })

    it('should return null when there is no badge instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Badge.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return badge instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const badge = new Badge(div)

      expect(Badge.getOrCreateInstance(div)).toEqual(badge)
      expect(Badge.getInstance(div)).toEqual(Badge.getOrCreateInstance(div, {}))
      expect(Badge.getOrCreateInstance(div)).toBeInstanceOf(Badge)
    })

    it('should return new instance when there is no badge instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Badge.getInstance(div)).toBeNull()
      expect(Badge.getOrCreateInstance(div)).toBeInstanceOf(Badge)
    })
  })
})
