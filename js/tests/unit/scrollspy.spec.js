import EventHandler from '../../src/dom/event-handler.js'
import ScrollSpy, { SPY_ENGINE_CONFIG, SPY_SENTRY_CONFIG } from '../../src/scrollspy.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('ScrollSpy', () => {
  let fixtureEl

  const getDummyFixture = () => {
    return [
      '<section id="root" class="active">',
      '<nav id="navbar" class="navbar">',
      '<ul class="nav">',
      ' <li class="nav-item">',
      ' <a class="nav-link" id="link-1" href="#div-1">div 1</a>' +
      ' <a class="nav-link" id="link-2" href="#div-2">div 2</a>' +
      ' <a class="nav-link" id="link-3" href="#div-3">div 3</a>' +
      ' <a class="nav-link" href="#useless">Unless</a>' +
      ' </li>',
      '</ul>',
      '</nav>',
      '</section>',
      '<div id="content" class="content" data-bs-spy="scroll" data-bs-target="#navbar" style="height: 200px; overflow: auto">',
      ' <div id="div-1" style="height: 200px;">div 1</div>',
      ' <div id="div-2" style="height: 200px;">div 2</div>',
      ' <div id="div-3" style="height: 200px;">div 3</div>',
      '</div>'
    ].join('')
  }

  const getAdvancedDummyFixture = (containerHeight = 50) => {
    return `
    <nav id="navbar">
      <ul class="nav">
        <li class="nav-item"><a class="nav-link" id="link-1" href="#div-1">div 1</a></li>
        <li class="nav-item"><a class="nav-link" id="link-2" href="#div-2">div 2</a></li>
        <li class="nav-item"><a class="nav-link" id="link-3" href="#div-3">div 3</a></li>
        <li class="nav-item"><a class="nav-link" id="link-4" href="#div-4">div 4</a></li>
        <li class="nav-item"><a class="nav-link" id="link-5" href="#div-5">div 5</a></li>
      </ul>
    </nav>
    <div id="content" class="content" data-bs-spy="scroll" data-bs-target="#navbar" style="overflow: auto; height: ${containerHeight}px">
      <div id="div-1" style="height: 100px;">div 1</div>
      <div id="div-2" style="height: 200px;">div 2</div>
      <div id="div-3" style="height: 500px;">div 3</div>
      <div id="div-4" style="height: 100px;">div 4</div>
      <div id="div-5" style="height: 200px;">div 5</div>
    </div>
  `
  }

  const scrollTo = (element, height) => {
    element.scrollTop = height
  }

  const scrolling = component => container => ({ clickBy: anchorSelector, scrollTo: targetSelector }) => {
    const anchor = fixtureEl.querySelector(anchorSelector)
    const target = fixtureEl.querySelector(targetSelector)

    return new Promise((resolve, reject) => {
      // add top padding to fix Chrome on Android failures
      const paddingTop = 0
      const parentOffset = getComputedStyle(container).getPropertyValue('position') === 'relative' ? 0 : container.offsetTop
      const scrollHeight = (target.offsetTop - parentOffset) + paddingTop

      container.addEventListener('activate.bs.scrollspy', event => {
        if (component._activeTarget !== anchor) {
          const actualId = component._activeTarget ? component._activeTarget.id : 'null'

          reject(new Error(`Wrong target activated! Expected #${anchor.id}, but got #${actualId}`))
        }

        expect(anchor).toHaveClass('active')
        expect(component._activeTarget).toEqual(anchor)
        expect(event.relatedTarget).toEqual(anchor)
        resolve()
      }, { once: true })

      scrollTo(container, scrollHeight)
    })
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('Scrollspy getters', () => {
    it('should return plugin version', () => {
      expect(ScrollSpy.VERSION).toEqual(jasmine.any(String))
    })

    it('should return plugin default config', () => {
      expect(ScrollSpy.Default).toEqual(jasmine.any(Object))
    })

    it('should return plugin data key', () => {
      expect(ScrollSpy.DATA_KEY).toEqual('bs.scrollspy')
    })
  })

  describe('Scrollspy constructor', () => {
    it('should take care of element either passed as a CSS selector', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyBySelector = new ScrollSpy('.content')

      expect(scrollSpyBySelector._element).toEqual(scrollSpyContainer)
    })

    it('should take care of element either passed as an identifier', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyById = new ScrollSpy('#content')

      expect(scrollSpyById._element).toEqual(scrollSpyContainer)
    })

    it('should take care of element either passed as a DOM element', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyByElement = new ScrollSpy(scrollSpyContainer)

      expect(scrollSpyByElement._element).toEqual(scrollSpyContainer)
    })
  })

  describe('Scrollspy initialize', () => {
    it('should connect existing observer', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)

      expect(scrollSpyComponent._observer).not.toBeNull()
    })
  })

  describe('Scrollspy uninitialize', () => {
    it('should disconnect existing observer', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const spy = spyOn(scrollSpyComponent._observer, 'disconnect')

      scrollSpyComponent.refresh()

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('Scrollspy dispose', () => {
    it('should dispose a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)

      expect(ScrollSpy.getInstance(scrollSpyContainer)).not.toBeNull()

      scrollSpyComponent.dispose()

      expect(ScrollSpy.getInstance(scrollSpyContainer)).toBeNull()
    })
  })

  describe('Scrollspy factory', () => {
    it('should return null if there is no instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')

      expect(ScrollSpy.getInstance(scrollSpyContainer)).toBeNull()
    })

    it('should return scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)

      expect(scrollSpyComponent).toBeInstanceOf(ScrollSpy)
    })

    it('should return scrollspy instance from container', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)

      expect(ScrollSpy.getInstance(scrollSpyContainer)).toEqual(scrollSpyComponent)
      expect(ScrollSpy.getInstance(scrollSpyContainer)).toBeInstanceOf(ScrollSpy)
    })

    it('should return scrollspy instance from static factory', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')

      expect(ScrollSpy.getOrCreateInstance(scrollSpyContainer)).toBeInstanceOf(ScrollSpy)
    })

    it('should not recreate the scrollspy instance again if it exists', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)

      expect(ScrollSpy.getOrCreateInstance(scrollSpyContainer)).toEqual(scrollSpyComponent)
      expect(ScrollSpy.getInstance(scrollSpyContainer)).toEqual(ScrollSpy.getOrCreateInstance(scrollSpyContainer))
      expect(ScrollSpy.getOrCreateInstance(scrollSpyContainer)).toBeInstanceOf(ScrollSpy)
    })

    it('should create scrollspy on window load event', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyElement = fixtureEl.querySelector('.content')

      window.dispatchEvent(createEvent('load'))

      expect(ScrollSpy.getInstance(scrollSpyElement)).not.toBeNull()
    })
  })

  describe('Scrollspy component configuration', () => {
    it('should have the element available', () => {
      fixtureEl.innerHTML = getDummyFixture()

      expect(() => new ScrollSpy('.content', { target: '.non-valid-selector' }))
        .toThrowError('Bootstrap ScrollSpy: You must specify a valid "target" element')
    })

    it(`should set the default rootMargin option to ${SPY_ENGINE_CONFIG.rootMargin}`, () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('.content')

      expect(scrollSpyComponent._config.rootMargin).toEqual(SPY_ENGINE_CONFIG.rootMargin)
    })

    it(`should set the default threshold option to ${SPY_ENGINE_CONFIG.threshold}`, () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('.content')

      expect(scrollSpyComponent._config.threshold).toEqual(SPY_ENGINE_CONFIG.threshold)
    })

    it(`should set the default rootMargin option to ${SPY_SENTRY_CONFIG.rootMargin}`, () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('.content')

      expect(scrollSpyComponent._sentryObserver.rootMargin).toEqual(SPY_SENTRY_CONFIG.rootMargin)
    })

    it(`should set the default threshold option to ${SPY_SENTRY_CONFIG.threshold}`, () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('.content')

      expect(scrollSpyComponent._sentryObserver.thresholds).toEqual(SPY_SENTRY_CONFIG.threshold)
    })

    it('should disable smooth scroll', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      ScrollSpy.getOrCreateInstance(scrollSpyContainer)

      expect(scrollSpyContainer.style.scrollBehavior).not.toBe('smooth')
    })

    it('should enable smooth scroll', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      ScrollSpy.getOrCreateInstance(scrollSpyContainer, {
        smoothScroll: true
      })

      expect(scrollSpyContainer.style.scrollBehavior).toBe('smooth')
    })

    it('should enable smooth scroll with custom duration', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      scrollSpyContainer.style.scrollBehavior = 'smooth'

      ScrollSpy.getOrCreateInstance(scrollSpyContainer, {
        smoothScroll: false
      })

      expect(scrollSpyContainer.style.scrollBehavior).not.toBe('smooth')
    })

    it('should set the root option to null if the element is not scrollable', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <a class="nav-link" href="#">One</a>',
        '</nav>',
        '<div id="content">',
        '  <div style="height: 300px;">test</div>',
        '</div>'
      ].join('')

      const scrollSpyComponent = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpyComponent._observer.root).toBeNull()
      expect(scrollSpyComponent._rootElement).toBeNull()
    })

    it('should not take count to not visible sections', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a class="nav-link" id="one-link" href="#one">One</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="three-link" href="#four">Four</a></li>' +
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        '  <div id="one" style="height: 300px;">test</div>',
        '  <div id="two" hidden style="height: 300px;">test</div>',
        '  <div id="three" style="display: none;">test</div>',
        '  <div id="four" style="visibility: hidden;">test</div>',
        '</div>'
      ].join('')

      const scrollSpyComponent = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpyComponent._observableSections.size).toBe(1)
      expect(scrollSpyComponent._targetLinks.size).toBe(1)
    })

    it('should not process element without target', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a class="nav-link" href="#">One</a></li>' +
        '    <li class="nav-item"><a class="nav-link" href="#two">Two</a></li>' +
        '    <li class="nav-item"><a class="nav-link" href="#three">Three</a></li>' +
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        '  <div id="two" style="height: 200px;">test</div>',
        '  <div id="three" style="height: 200px;">test2</div>',
        '</div>'
      ].join('')

      const scrollSpyComponent = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpyComponent._targetLinks).toHaveSize(2)
    })
  })

  describe('Scrollspy observer configuration', () => {
    it(`should set the rootMargin option to ${SPY_ENGINE_CONFIG.rootMargin}`, () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('.content', {
        target: '.content'
      })

      expect(scrollSpyComponent._observer.rootMargin).toEqual(SPY_ENGINE_CONFIG.rootMargin)
    })

    it(`should set the threshold option to ${SPY_ENGINE_CONFIG.threshold}`, () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpy = new ScrollSpy('.content', {
        target: '.content'
      })

      expect(scrollSpy._observer.thresholds).toEqual(SPY_ENGINE_CONFIG.threshold)
    })

    it('should threshold option transmitted and processed', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('#content', {
        target: '#navbar',
        rootMargin: '100px'
      })

      expect(scrollSpyComponent._config.rootMargin).toEqual('100px')
    })

    it('should respect threshold option transmitted and processed', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyComponent = new ScrollSpy('#content', {
        target: '#navbar',
        threshold: [1]
      })

      expect(scrollSpyComponent._observer.thresholds).toEqual([1])
    })

    it('should respect threshold option markup', () => {
      fixtureEl.innerHTML = [
        '<ul id="navigation" class="navbar">',
        '   <a class="nav-link active" id="one-link" href="#">One</a>' +
        '</ul>',
        '<div id="content" data-bs-threshold="0,0.2,1">',
        '  <div id="one-link">test</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy('#content', {
        target: '#navigation'
      })

      // See https://stackoverflow.com/a/45592926
      const expectToBeCloseToArray = (actual, expected) => {
        expect(actual.length).toBe(expected.length)

        for (const x of actual) {
          const i = actual.indexOf(x)
          expect(x).withContext(`[${i}]`).toBeCloseTo(expected[i])
        }
      }

      expectToBeCloseToArray(scrollSpy._observer.thresholds, [0, 0.2, 1])
    })
  })

  describe('Scrollspy scroll behaviour', () => {
    it('should not process data if current active target is same as given target', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getDummyFixture()

        const scrollSpyContainer = fixtureEl.querySelector('.content')
        const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
        const triggerSpy = spyOn(EventHandler, 'trigger').and.callThrough()

        scrollSpyComponent._activeTarget = fixtureEl.querySelector('#link-1')
        scrollSpyComponent._observerCallback([{ isIntersecting: true, target: { id: 'div-1' } }])

        setTimeout(() => {
          expect(triggerSpy).not.toHaveBeenCalled()
          resolve()
        }, 100)
      })
    })

    it('should activate the corresponding navigation link when an entry becomes intersecting', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const firstLink = fixtureEl.querySelector('#link-1')
      const secondLink = fixtureEl.querySelector('#link-2')
      const thirdLink = fixtureEl.querySelector('#link-3')
      const scrollSpyComponent = new ScrollSpy('.content')
      const secondEntry = { isIntersecting: false, target: { id: 'div-2' } }
      const thirdFalseEntry = { isIntersecting: false, target: { id: 'div-3' } }
      const thirdEntry = { isIntersecting: true, target: { id: 'div-3' } }

      scrollSpyComponent._observerCallback([secondEntry, thirdFalseEntry, thirdEntry])
      expect(firstLink).not.toHaveClass('active')
      expect(secondLink).not.toHaveClass('active')
      expect(thirdLink).toHaveClass('active')
    })

    it('should only switch "active" class on current target', async () => {
      fixtureEl.innerHTML = getDummyFixture()

      const rootElement = fixtureEl.querySelector('#root')
      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      await scroll({ clickBy: '#link-2', scrollTo: '#div-2' })
      expect(rootElement).toHaveClass('active')
    })

    it('should add to nav the active class to the correct element (list-group markup)', async () => {
      fixtureEl.innerHTML = [
        '<nav id="navbar" class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" id="link-1" href="#div-1">div 1</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="link-2" href="#div-2">div 2</a></li>' +
        '    <li class="nav-item dropdown">',
        '      <a class="nav-link dropdown-toggle" id="dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">Dropdown</a>',
        '      <ul class="dropdown-menu">',
        '        <li><a class="dropdown-item" id="link-3" href="#div-3">div 3</a></li>' +
        '        <li><a class="dropdown-item" id="link-4" href="#div-4">div 4</a></li>' +
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</nav>',
        '<div id="content" class="content" data-bs-spy="scroll" data-bs-target="#navbar" style="height: 200px; overflow: auto">',
        '  <div id="div-1" style="height: 200px;">div 1</div>',
        '  <div id="div-2" style="height: 200px;">div 2</div>',
        '  <div id="div-3" style="height: 200px;">div 3</div>',
        '  <div id="div-4" style="height: 200px;">div 4</div>',
        '</div>'
      ].join('')

      const scrollSpyContainer = fixtureEl.querySelector('#content')
      const dropdownToggle = fixtureEl.querySelector('#dropdown-toggle')
      const thirdLink = fixtureEl.querySelector('#link-3')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      await scroll({ clickBy: '#link-3', scrollTo: '#div-3' })

      expect(dropdownToggle).toHaveClass('active')
      expect(thirdLink).toHaveClass('active')
    })

    it('should add to list-group, the active class to the correct element (nav markup)', async () => {
      fixtureEl.innerHTML = [
        '<nav id="navbar" class="navbar">',
        '<nav class="nav">',
        ' <a class="nav-link" id="link-1" href="#div-1">Item 1</a>' +
        '<nav class="nav">',
        ' <a class="nav-link" id="link-1-1" href="#div-1-1">Item 1-1</a>' +
        ' <a class="nav-link" id="link-1-2" href="#div-1-2">Item 1-2</a>' +
        '</nav>',
        ' <a class="nav-link" id="link-2" href="#div-2">Item 2</a>' +
        '</nav>',
        '</nav>',
        '<div id="content" class="content" data-bs-spy="scroll" data-bs-target="#navbar" style="height: 200px; overflow: auto">',
        '  <div id="div-1" style="height: 200px;">div 1</div>',
        '  <div id="div-1-1" style="height: 200px;">div 1-1</div>',
        '  <div id="div-1-2" style="height: 200px;">div 1-2</div>',
        '  <div id="div-2" style="height: 200px;">div 2</div>',
        '</div>'
      ].join('')

      const scrollSpyContainer = fixtureEl.querySelector('#content')
      const parentNavLink = fixtureEl.querySelector('#link-1')
      const navLink = fixtureEl.querySelector('#link-1-1')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      await scroll({ clickBy: '#link-1-1', scrollTo: '#div-1-1' })

      expect(parentNavLink).toHaveClass('active')
      expect(navLink).toHaveClass('active')
    })

    it('should correctly switch active targets when scrolling sequentially from top to bottom', async () => {
      fixtureEl.innerHTML = getAdvancedDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      await scroll({ clickBy: '#link-1', scrollTo: '#div-1' })
      await scroll({ clickBy: '#link-2', scrollTo: '#div-2' })
      await scroll({ clickBy: '#link-3', scrollTo: '#div-3' })
      await scroll({ clickBy: '#link-4', scrollTo: '#div-4' })
      await scroll({ clickBy: '#link-5', scrollTo: '#div-5' })
    })

    it('should correctly switch active targets when scrolling sequentially from bottom to top', async () => {
      fixtureEl.innerHTML = getAdvancedDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      await scroll({ clickBy: '#link-5', scrollTo: '#div-5' })
      await scroll({ clickBy: '#link-4', scrollTo: '#div-4' })
      await scroll({ clickBy: '#link-3', scrollTo: '#div-3' })
      await scroll({ clickBy: '#link-2', scrollTo: '#div-2' })
      await scroll({ clickBy: '#link-1', scrollTo: '#div-1' })
    })

    it('should correctly activate the target when skipping intermediate sections (long jump)', async () => {
      fixtureEl.innerHTML = getAdvancedDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      await scroll({ clickBy: '#link-3', scrollTo: '#div-3' })
      await scroll({ clickBy: '#link-5', scrollTo: '#div-5' })
      await scroll({ clickBy: '#link-1', scrollTo: '#div-1' })
      await scroll({ clickBy: '#link-4', scrollTo: '#div-4' })
      await scroll({ clickBy: '#link-2', scrollTo: '#div-2' })
    })

    it('should correctly select navigation element on backward scrolling when each target section height is 100%', async () => {
      fixtureEl.innerHTML = [
        '<nav class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a id="li-100-1" class="nav-link" href="#div-100-1">div 1</a></li>' +
        '    <li class="nav-item"><a id="li-100-2" class="nav-link" href="#div-100-2">div 2</a></li>' +
        '    <li class="nav-item"><a id="li-100-3" class="nav-link" href="#div-100-3">div 3</a></li>' +
        '    <li class="nav-item"><a id="li-100-4" class="nav-link" href="#div-100-4">div 4</a></li>' +
        '    <li class="nav-item"><a id="li-100-5" class="nav-link" href="#div-100-5">div 5</a></li>' +
        '  </ul>',
        '</nav>',
        '<div class="content" style="position: relative; overflow: auto; height: 100px">',
        '  <div id="div-100-1" style="position: relative; height: 100%; padding: 0; margin: 0">div 1</div>',
        '  <div id="div-100-2" style="position: relative; height: 100%; padding: 0; margin: 0">div 2</div>',
        '  <div id="div-100-3" style="position: relative; height: 100%; padding: 0; margin: 0">div 3</div>',
        '  <div id="div-100-4" style="position: relative; height: 100%; padding: 0; margin: 0">div 4</div>',
        '  <div id="div-100-5" style="position: relative; height: 100%; padding: 0; margin: 0">div 5</div>',
        '</div>'
      ].join('')

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer, { target: '.navbar' })
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      scrollTo(scrollSpyContainer, 0)
      await scroll({ clickBy: '#li-100-5', scrollTo: '#div-100-5' })

      scrollTo(scrollSpyContainer, 0)
      await scroll({ clickBy: '#li-100-2', scrollTo: '#div-100-2' })

      scrollTo(scrollSpyContainer, 0)
      await scroll({ clickBy: '#li-100-3', scrollTo: '#div-100-3' })

      scrollTo(scrollSpyContainer, 0)
      await scroll({ clickBy: '#li-100-2', scrollTo: '#div-100-2' })

      scrollTo(scrollSpyContainer, 0)
      await scroll({ clickBy: '#li-100-1', scrollTo: '#div-100-1' })
    })
  })

  describe('Scrollspy boundary cases', () => {
    it('should take account of escaped IDs', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a class="nav-link active" id="one-link" href="#div-2.1">One</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="two-link" href="#!@#$_^&*()">Two</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="three-link" href="#id.div.Element@data-custom=true">Three</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="four-link" href="#https://domain.to/#%2F%40user%3Aname.test">Four</a></li>' +
        '    <li class="nav-item"><a class="nav-link" id="five-link" href="#https://domain.to/#/@user:name.test">Five</a></li>' +
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        '  <div id="div-2.1" style="height: 300px;">test</div>',
        '  <div id="!@#$_^&*()" style="height: 300px;">test</div>',
        '  <div id="id.div.Element@data-custom=true" style="height: 300px;">test</div>',
        '  <div id="https://domain.to/#%2F%40user%3Aname.test" style="height: 300px;">test</div>',
        '  <div id="https://domain.to/#/@user:name.test">test</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpy._observableSections.size).toBe(5)
      expect(scrollSpy._targetLinks.size).toBe(5)
    })

    it('should the sentinel element is correct to the simple scrolling container', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      ScrollSpy.getOrCreateInstance(scrollSpyContainer)
      const sentry = scrollSpyContainer.lastElementChild

      expect(sentry).toHaveClass('sentry-observer')
      expect(sentry.tagName.toUpperCase()).toBe('DIV')
    })

    it('should the sentinel element is correct to the list scrolling container', () => {
      fixtureEl.innerHTML = [
        '<ul class="list-group">',
        '  <li class="list-group-item">Item 1</li>',
        '  <li class="list-group-item">Item 2</li>',
        '  <li class="list-group-item">Item 3</li>',
        '</ul>',
        '<ul class="content" style="height: 200px; overflow-y: auto;">',
        '  <li id="div-1" style="height: 300px;">test</li>',
        '  <li id="div-2" style="height: 300px;">test</li>',
        '  <li id="div-3" style="height: 300px;">test</li>',
        '</div>'
      ]

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      ScrollSpy.getOrCreateInstance(scrollSpyContainer, {
        target: '.list-group'
      })
      const sentry = scrollSpyContainer.lastElementChild

      expect(sentry).toHaveClass('sentry-observer')
      expect(sentry.tagName.toUpperCase()).toBe('LI')
    })

    it('should the sentinel element is correct to the table scrolling container', () => {
      fixtureEl.innerHTML = [
        '<ul class="list-group">',
        '  <li class="list-group-item">Item 1</li>',
        '  <li class="list-group-item">Item 2</li>',
        '  <li class="list-group-item">Item 3</li>',
        '</ul>',
        '<table style="height: 200px; overflow-y: auto;">',
        '  <tr class="content" style="height: 300px;">',
        '    <td id="div-1" style="height: 300px;">test</td>',
        '    <td id="div-2" style="height: 300px;">test</td>',
        '    <td id="div-3" style="height: 300px;">test</td>',
        '  </tr>',
        '</div>'
      ]

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      ScrollSpy.getOrCreateInstance(scrollSpyContainer, {
        target: '.list-group'
      })
      const sentry = scrollSpyContainer.lastElementChild

      expect(sentry).toHaveClass('sentry-observer')
      expect(sentry.tagName.toUpperCase()).toBe('TD')
    })

    it('should append the sentinel element to the scrolling container', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const sentry = scrollSpyContainer.lastElementChild

      expect(sentry).toHaveClass('sentry-observer')
      expect(scrollSpyComponent._sentryObserverElement).toBeDefined()
    })

    it('should ensure that only one sentinel element exists (no duplicates)', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const sentry = fixtureEl.querySelectorAll('.sentry-observer')

      expect(sentry).toHaveSize(1)
      expect(scrollSpyComponent._sentryObserverElement).toBeDefined()
    })

    it('should activate the last target when the bottom sentinel is reached', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getAdvancedDummyFixture(800)

        const scrollSpyContainer = fixtureEl.querySelector('.content')
        const scrollHeight = [...scrollSpyContainer.children]
          .slice(0, -1)
          .reduce((acc, child) => acc + child.offsetHeight, 0)
        const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
        const spy = spyOn(scrollSpyComponent, '_sentryObserverCallback')
          .and
          .callThrough()

        // the last element is visible but outside the scroll area
        scrollTo(scrollSpyContainer, scrollHeight)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          resolve()
        }, 250)
      })
    })

    it('should initialize with the correct active item if the container is already scrolled (pre-scrolled state)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = getAdvancedDummyFixture()

        const scrollSpyContainer = fixtureEl.querySelector('.content')
        const thirdSection = fixtureEl.querySelector('#div-3')
        const thirdLink = fixtureEl.querySelector('#link-3')

        scrollSpyContainer.scrollTop = thirdSection.offsetTop
        ScrollSpy.getOrCreateInstance(scrollSpyContainer)

        setTimeout(() => {
          expect(thirdLink).toHaveClass('active')
          resolve()
        }, 250)
      })
    })

    it('should activate item considering the header offset (CSS scroll-margin logic)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = `
        <nav id="navbar">
          <ul class="nav">
            <li class="nav-item"><a class="nav-link" id="link-1" href="#div-1">div 1</a></li>
            <li class="nav-item"><a class="nav-link" id="link-2" href="#div-2">div 2</a></li>
            <li class="nav-item"><a class="nav-link" id="link-3" href="#div-3">div 3</a></li>
            <li class="nav-item"><a class="nav-link" id="link-4" href="#div-4">div 4</a></li>
            <li class="nav-item"><a class="nav-link" id="link-5" href="#div-5">div 5</a></li>
          </ul>
        </nav>
        <div id="content" class="content" style="overflow: auto; height: 100px">
          <nav id="navigation" style="position: sticky; top: 0; left: 0; right: 0; height: 100px; z-index: 100;">
            <div>Fixed Header (100px)</div>
          </nav>
          <div id="div-1" style="height: 100px; padding: 0; margin: 0;">div 1</div>
          <div id="div-2" style="height: 200px; padding: 0; margin: 0;">div 2</div>
          <div id="div-3" style="height: 500px; padding: 0; margin: 0;">div 3</div>
          <div id="div-4" style="height: 100px; padding: 0; margin: 0;">div 4</div>
          <div id="div-5" style="height: 200px; padding: 0; margin: 0;">div 5</div>
        </div>
      `

        const scrollSpyContainer = fixtureEl.querySelector('.content')
        const scrollSpyComponent = new ScrollSpy(scrollSpyContainer, {
          target: '#navbar',
          offsetElement: '#navigation',
          smoothScroll: true
        })

        expect(scrollSpyContainer.style.scrollPaddingTop).toBe('100px')

        // The scroll-offset-top parameter should dynamically pick up and ignore the navigation bar, leaving it on top.
        scrollTo(scrollSpyContainer, 100)

        scrollSpyContainer.addEventListener('scrollend', () => {
          expect(scrollSpyComponent._activeTarget.id).toBe('link-2')
          resolve()
        }, { once: true })
      })
    })

    it('should correctly observe a dynamically added section after calling refresh()', async () => {
      fixtureEl.innerHTML = getAdvancedDummyFixture()

      const navigation = fixtureEl.querySelector('.nav')
      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      navigation.insertAdjacentHTML('beforeend',
        '<li class="nav-item"><a class="nav-link" id="link-6" href="#div-6">div 6</a></li>' +
        '<li class="nav-item"><a class="nav-link" id="link-7" href="#div-7">div 7</a></li>' +
        '<li class="nav-item"><a class="nav-link" id="link-8" href="#div-8">div 8</a></li>' +
        '<li class="nav-item"><a class="nav-link" id="link-9" href="#div-9">div 9</a></li>' +
        '<li class="nav-item"><a class="nav-link" id="link-10" href="#div-10">div 10</a></li>'
      )

      scrollSpyContainer.insertAdjacentHTML('beforeend', `
        <div id="div-6" style="height: 100px;">div 6</div>
        <div id="div-7" style="height: 200px;">div 7</div>
        <div id="div-8" style="height: 500px;">div 8</div>
        <div id="div-9" style="height: 100px;">div 9</div>
        <div id="div-10" style="height: 200px;">div 10</div>
      `)

      scrollSpyComponent.refresh()

      expect(scrollSpyComponent._targetLinks).toHaveSize(10)
      expect(scrollSpyComponent._observableSections).toHaveSize(10)
      expect(scrollSpyContainer.lastElementChild).toHaveClass('sentry-observer')

      await scroll({ clickBy: '#link-10', scrollTo: '#div-10' })
      await scroll({ clickBy: '#link-6', scrollTo: '#div-6' })
    })

    it('should stop observing a removed section after calling refresh()', async () => {
      fixtureEl.innerHTML = getAdvancedDummyFixture()

      const navigation = fixtureEl.querySelector('.nav')
      const scrollSpyContainer = fixtureEl.querySelector('.content')
      const scrollSpyComponent = new ScrollSpy(scrollSpyContainer)
      const scroll = scrolling(scrollSpyComponent)(scrollSpyContainer)

      navigation.querySelector('#link-5').remove()
      navigation.querySelector('#link-4').remove()
      scrollSpyContainer.querySelector('#div-5').remove()
      scrollSpyContainer.querySelector('#div-4').remove()

      scrollSpyComponent.refresh()

      expect(scrollSpyComponent._targetLinks).toHaveSize(3)
      expect(scrollSpyComponent._observableSections).toHaveSize(3)
      expect(scrollSpyContainer.lastElementChild).toHaveClass('sentry-observer')

      await scroll({ clickBy: '#link-3', scrollTo: '#div-3' })
      await scroll({ clickBy: '#link-1', scrollTo: '#div-1' })
    })
  })
})
