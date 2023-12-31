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

  describe('children', () => {
    it('should find children', () => {
      fixtureEl.innerHTML = [
        '<ul>',
        '  <li></li>',
        '  <li></li>',
        '  <li></li>',
        '</ul>'
      ].join('')

      const list = fixtureEl.querySelector('ul')
      const liList = [].concat(...fixtureEl.querySelectorAll('li'))
      const result = SelectorEngine.children(list, 'li')

      expect(result).toEqual(liList)
    })
  })

  describe('parents', () => {
    it('should return parents', () => {
      expect(SelectorEngine.parents(fixtureEl, 'body')).toHaveSize(1)
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

  describe('focusableChildren', () => {
    it('should return only elements with specific tag names', () => {
      fixtureEl.innerHTML = [
        '<div>lorem</div>',
        '<span>lorem</span>',
        '<a>lorem</a>',
        '<button>lorem</button>',
        '<input>',
        '<textarea></textarea>',
        '<select></select>',
        '<details>lorem</details>'
      ].join('')

      const expectedElements = [
        fixtureEl.querySelector('a'),
        fixtureEl.querySelector('button'),
        fixtureEl.querySelector('input'),
        fixtureEl.querySelector('textarea'),
        fixtureEl.querySelector('select'),
        fixtureEl.querySelector('details')
      ]

      expect(SelectorEngine.focusableChildren(fixtureEl)).toEqual(expectedElements)
    })

    it('should return any element with non negative tab index', () => {
      fixtureEl.innerHTML = [
        '<div tabindex>lorem</div>',
        '<div tabindex="0">lorem</div>',
        '<div tabindex="10">lorem</div>'
      ].join('')

      const expectedElements = [
        fixtureEl.querySelector('[tabindex]'),
        fixtureEl.querySelector('[tabindex="0"]'),
        fixtureEl.querySelector('[tabindex="10"]')
      ]

      expect(SelectorEngine.focusableChildren(fixtureEl)).toEqual(expectedElements)
    })

    it('should return not return elements with negative tab index', () => {
      fixtureEl.innerHTML = '<button tabindex="-1">lorem</button>'

      const expectedElements = []

      expect(SelectorEngine.focusableChildren(fixtureEl)).toEqual(expectedElements)
    })

    it('should return contenteditable elements', () => {
      fixtureEl.innerHTML = '<div contenteditable="true">lorem</div>'

      const expectedElements = [fixtureEl.querySelector('[contenteditable="true"]')]

      expect(SelectorEngine.focusableChildren(fixtureEl)).toEqual(expectedElements)
    })

    it('should not return disabled elements', () => {
      fixtureEl.innerHTML = '<button disabled="true">lorem</button>'

      const expectedElements = []

      expect(SelectorEngine.focusableChildren(fixtureEl)).toEqual(expectedElements)
    })

    it('should not return invisible elements', () => {
      fixtureEl.innerHTML = '<button style="display:none;">lorem</button>'

      const expectedElements = []

      expect(SelectorEngine.focusableChildren(fixtureEl)).toEqual(expectedElements)
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

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual(Array.from(fixtureEl.querySelectorAll('.target')))
    })

    it('should get elements if several ids are given', () => {
      fixtureEl.innerHTML = [
        '<div id="test" data-bs-target="#target1,#target2"></div>',
        '<div class="target" id="target1"></div>',
        '<div class="target" id="target2"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual(Array.from(fixtureEl.querySelectorAll('.target')))
    })

    it('should get elements in array, from href if no data-bs-target set', () => {
      fixtureEl.innerHTML = [
        '<a id="test" href=".target"></a>',
        '<div class="target"></div>',
        '<div class="target"></div>'
      ].join('')

      const testEl = fixtureEl.querySelector('#test')

      expect(SelectorEngine.getMultipleElementsFromSelector(testEl)).toEqual(Array.from(fixtureEl.querySelectorAll('.target')))
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
