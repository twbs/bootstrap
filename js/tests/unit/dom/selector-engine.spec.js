import SelectorEngine from '../../../src/dom/selector-engine'

/** Test helpers */
import { getFixture, clearFixture } from '../../helpers/fixture'

describe('SelectorEngine', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('matches', () => {
    it('should return matched elements', () => {
      fixtureEl.innerHTML = '<div></div>'

      expect(SelectorEngine.matches(fixtureEl, 'div')).toEqual(true)
    })
  })

  describe('find', () => {
    it('should find elements', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(SelectorEngine.find('div', fixtureEl)).toEqual([div])
    })

    it('should find elements globaly', () => {
      fixtureEl.innerHTML = '<div id="test"></div>'

      const div = fixtureEl.querySelector('#test')

      expect(SelectorEngine.find('#test')).toEqual([div])
    })

    it('should handle :scope selectors', () => {
      fixtureEl.innerHTML = `<ul>
        <li></li>
        <li>
          <a href="#" class="active">link</a>
        </li>
        <li></li>
      </ul>`

      const listEl = fixtureEl.querySelector('ul')
      const aActive = fixtureEl.querySelector('.active')

      expect(SelectorEngine.find(':scope > li > .active', listEl)).toEqual([aActive])
    })
  })

  describe('findOne', () => {
    it('should return one element', () => {
      fixtureEl.innerHTML = '<div id="test"></div>'

      const div = fixtureEl.querySelector('#test')

      expect(SelectorEngine.findOne('#test')).toEqual(div)
    })
  })

  describe('children', () => {
    it('should find children', () => {
      fixtureEl.innerHTML = `<ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>`

      const list = fixtureEl.querySelector('ul')
      const liList = [].concat(...fixtureEl.querySelectorAll('li'))
      const result = SelectorEngine.children(list, 'li')

      expect(result).toEqual(liList)
    })
  })

  describe('parents', () => {
    it('should return parents', () => {
      expect(SelectorEngine.parents(fixtureEl, 'body').length).toEqual(1)
    })
  })

  describe('prev', () => {
    it('should return previous element', () => {
      fixtureEl.innerHTML = '<div class="test"></div><button class="btn"></button>'

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')

      expect(SelectorEngine.prev(btn, '.test')).toEqual([divTest])
    })

    it('should return previous element with an extra element between', () => {
      fixtureEl.innerHTML = [
        '<div class="test"></div>',
        '<span></span>',
        '<button class="btn"></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')

      expect(SelectorEngine.prev(btn, '.test')).toEqual([divTest])
    })

    it('should return previous element with comments or text nodes between', () => {
      fixtureEl.innerHTML = [
        '<div class="test"></div>',
        '<div class="test"></div>',
        '<!-- Comment-->',
        'Text',
        '<button class="btn"></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelectorAll('.test')[1]

      expect(SelectorEngine.prev(btn, '.test')).toEqual([divTest])
    })
  })
})

