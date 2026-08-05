import SelectorEngine from '../../../src/dom/selector-engine.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('SelectorEngine', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('find', () => {
    it('should find elements', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(SelectorEngine.find('div', fixtureEl)).toEqual([div])
    })

    it('should find elements globally', () => {
      fixtureEl.innerHTML = '<div id="test"></div>'

      const div = fixtureEl.querySelector('#test')

      expect(SelectorEngine.find('#test')).toEqual([div])
    })

    it('should handle :scope selectors', () => {
      fixtureEl.innerHTML = [
        '<ul>',
        '  <li></li>',
        '  <li>',
        '    <a href="#" class="active">link</a>',
        '  </li>',
        '  <li></li>',
        '</ul>'
      ].join('')

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

  describe('parents', () => {
    it('should return parents', () => {
      expect(SelectorEngine.parents(fixtureEl, 'body')).toHaveSize(1)
    })
  })

  describe('closest', () => {
    it('should return the element itself when it matches the selector', () => {
      fixtureEl.innerHTML = '<div id="test"><div id="element"></div></div>'

      const element = fixtureEl.querySelector('#element')

      expect(SelectorEngine.closest(element, '#element')).toEqual(element)
    })

    it('should return the closest ancestor matching the selector', () => {
      fixtureEl.innerHTML = '<div id="test"><div><div id="element"></div></div></div>'

      const element = fixtureEl.querySelector('#element')
      const ancestor = fixtureEl.querySelector('#test')

      expect(SelectorEngine.closest(element, '#test')).toEqual(ancestor)
    })

    it('should return null when no ancestor matches the selector', () => {
      fixtureEl.innerHTML = '<div><div id="element"></div></div>'

      const element = fixtureEl.querySelector('#element')

      expect(SelectorEngine.closest(element, '.missing')).toBeNull()
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

  describe('next', () => {
    it('should return next element', () => {
      fixtureEl.innerHTML = '<div class="test"></div><button class="btn"></button>'

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')

      expect(SelectorEngine.next(divTest, '.btn')).toEqual([btn])
    })

    it('should return next element with an extra element between', () => {
      fixtureEl.innerHTML = [
        '<div class="test"></div>',
        '<span></span>',
        '<button class="btn"></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')

      expect(SelectorEngine.next(divTest, '.btn')).toEqual([btn])
    })

    it('should return next element with comments or text nodes between', () => {
      fixtureEl.innerHTML = [
        '<div class="test"></div>',
        '<!-- Comment-->',
        'Text',
        '<button class="btn"></button>',
        '<button class="btn"></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')

      expect(SelectorEngine.next(divTest, '.btn')).toEqual([btn])
    })
  })

  describe('getSelectorFromElement', () => {
    it('should get selector from data-bs-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if no data-bs-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should get selector from href if data-bs-target equal to #', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-bs-target="#" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toEqual('.target')
    })

    it('should return null if a selector from a href is a url without an anchor', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-bs-target="#" href="foo/bar.html"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toBeNull()
    })

    it('should return the anchor if a selector from a href is a url', () => {
      fixtureEl.innerHTML = [
        '<a id="test" data-bs-target="#" href="foo/bar.html#target"></a>',
        '<div id="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toEqual('#target')
    })

    it('should return null if selector not found', () => {
      fixtureEl.innerHTML = '<a id="test" href=".target"></a>'

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toBeNull()
    })

    it('should return null if no selector', () => {
      fixtureEl.innerHTML = '<div></div>'

      const testEl = fixtureEl.querySelector('div')

      expect(SelectorEngine.getSelectorFromElement(testEl)).toBeNull()
    })
  })

  describe('getElementFromSelector', () => {
    it('should get element from data-bs-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target=".target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getElementFromSelector(testEl)).toEqual(fixtureEl.querySelector('.target'))
    })

    it('should get element from href if no data-bs-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getElementFromSelector(testEl)).toEqual(fixtureEl.querySelector('.target'))
    })

    it('should return null if element not found', () => {
      fixtureEl.innerHTML = '<a id="test" href=".target"></a>'

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getElementFromSelector(testEl)).toBeNull()
    })

    it('should return null if no selector', () => {
      fixtureEl.innerHTML = '<div></div>'

      const testEl = fixtureEl.querySelector('div')

      expect(SelectorEngine.getElementFromSelector(testEl)).toBeNull()
    })
  })

  describe('getMultipleElementsFromSelector', () => {
    it('should get elements from data-bs-target', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target=".target"></div>',
        '<div class="target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual([...fixtureEl.querySelectorAll('.target')])
    })

    it('should get elements if several ids are given', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target="#target1,#target2"></div>',
        '<div class="target" id="target1"></div>',
        '<div class="target" id="target2"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual([...fixtureEl.querySelectorAll('.target')])
    })

    it('should get elements if several ids with special chars are given', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target="#j_id11:exampleModal,#j_id22:exampleModal"></div>',
        '<div class="target" id="j_id11:exampleModal"></div>',
        '<div class="target" id="j_id22:exampleModal"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual([...fixtureEl.querySelectorAll('.target')])
    })

    it('should get elements in array, from href if no data-bs-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual([...fixtureEl.querySelectorAll('.target')])
    })

    it('should return empty array if elements not found', () => {
      fixtureEl.innerHTML = '<a id="test" href=".target"></a>'

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toHaveSize(0)
    })

    it('should return empty array if no selector', () => {
      fixtureEl.innerHTML = '<div></div>'

      const testEl = fixtureEl.querySelector('div')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toHaveSize(0)
    })
  })
})
