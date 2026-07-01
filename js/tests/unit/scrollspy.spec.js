import EventHandler from '../../src/dom/event-handler.js'
import ScrollSpy from '../../src/scrollspy.js'
import {
  clearFixture, createEvent, getFixture
} from '../helpers/fixture.js'

describe('ScrollSpy', () => {
  let fixtureEl

  const getElementScrollSpy = element => element.scrollTo ?
    spyOn(element, 'scrollTo').and.callThrough() :
    spyOnProperty(element, 'scrollTop', 'set').and.callThrough()

  const scrollTo = (el, height) => {
    el.scrollTop = height
  }

  const onScrollStop = (callback, element, timeout = 30) => {
    let handle = null
    const onScroll = function () {
      if (handle) {
        window.clearTimeout(handle)
      }

      handle = setTimeout(() => {
        element.removeEventListener('scroll', onScroll)
        callback()
      }, timeout + 1)
    }

    element.addEventListener('scroll', onScroll)
  }

  const getDummyFixture = () => {
    return [
      '<nav id="navBar" class="navbar">',
      '  <ul class="nav">',
      '    <li class="nav-item"><a id="li-jsm-1" class="nav-link" href="#div-jsm-1">div 1</a></li>',
      '  </ul>',
      '</nav>',
      '<div class="content" data-bs-target="#navBar" style="overflow-y: auto">',
      '  <div id="div-jsm-1">div 1</div>',
      '</div>'
    ].join('')
  }

  const testElementIsActiveAfterScroll = ({ elementSelector, targetSelector, contentEl, scrollSpy, cb }) => {
    const element = fixtureEl.querySelector(elementSelector)
    const target = fixtureEl.querySelector(targetSelector)
    // add top padding to fix Chrome on Android failures
    const paddingTop = 0
    const parentOffset = getComputedStyle(contentEl).getPropertyValue('position') === 'relative' ? 0 : contentEl.offsetTop
    const scrollHeight = (target.offsetTop - parentOffset) + paddingTop

    contentEl.addEventListener('activate.bs.scrollspy', event => {
      if (scrollSpy._activeTarget !== element) {
        return
      }

      expect(element).toHaveClass('active')
      expect(scrollSpy._activeTarget).toEqual(element)
      expect(event.relatedTarget).toEqual(element)
      cb()
    })

    setTimeout(() => { // in case we scroll something before the test
      scrollTo(contentEl, scrollHeight)
    }, 100)
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(ScrollSpy.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(ScrollSpy.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(ScrollSpy.DATA_KEY).toEqual('bs.scrollspy')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const sSpyEl = fixtureEl.querySelector('.content')
      const sSpyBySelector = new ScrollSpy('.content')
      expect(sSpyBySelector._element).toEqual(sSpyEl)

      const sSpyByElement = new ScrollSpy(sSpyEl)
      expect(sSpyByElement._element).toEqual(sSpyEl)
    })

    it('should null, if element is not scrollable', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">' +
        '     <li class="nav-item"><a class="nav-link active" id="one-link" href="#">One</a></li>' +
        '  </ul>',
        '</nav>',
        '<div id="content">',
        '  <div id="1" style="height: 300px;">test</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpy._observer.root).toBeNull()
      expect(scrollSpy._rootElement).toBeNull()
    })

    it('should respect threshold option', () => {
      fixtureEl.innerHTML = [
        '<ul id="navigation" class="navbar">',
        '   <a class="nav-link active" id="one-link" href="#">One</a>' +
        '</ul>',
        '<div id="content">',
        '  <div id="one-link">test</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy('#content', {
        target: '#navigation',
        threshold: [1]
      })

      expect(scrollSpy._observer.thresholds).toEqual([1])
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

    it('should not take count to not visible sections', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a class="nav-link active" id="one-link" href="#one">One</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>',
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        '  <div id="one" style="height: 300px;">test</div>',
        '  <div id="two" hidden style="height: 300px;">test</div>',
        '  <div id="three"  style="display: none;">test</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpy._sections).toHaveSize(1)
      expect(scrollSpy._sectionByLink.size).toBe(1)
    })

    it('should not process element without target', () => {
      fixtureEl.innerHTML = [
        '<nav id="navigation" class="navbar">',
        '  <ul class="navbar-nav">',
        '    <li class="nav-item"><a class="nav-link active" id="one-link" href="#">One</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>',
        '  </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        '  <div id="two" style="height: 300px;">test</div>',
        '  <div id="three" style="height: 10px;">test2</div>',
        '</div>'
      ].join('')

      const scrollSpy = new ScrollSpy(fixtureEl.querySelector('#content'), {
        target: '#navigation'
      })

      expect(scrollSpy._sections).toHaveSize(2)
    })

    it('should only switch "active" class on current target', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="root" class="active" style="display: block">',
          '  <div class="topbar">',
          '    <div class="topbar-inner">',
          '      <div class="container" id="ss-target">',
          '        <ul class="nav">',
          '          <li class="nav-item"><a href="#masthead">Overview</a></li>',
          '          <li class="nav-item"><a href="#detail">Detail</a></li>',
          '        </ul>',
          '      </div>',
          '    </div>',
          '  </div>',
          '  <div id="scrollspy-example" style="height: 100px; overflow: auto;">',
          '     <div style="height: 200px;" id="masthead">Overview</div>',
          '     <div style="height: 200px;" id="detail">Detail</div>',
          '  </div>',
          '</div>'
        ].join('')

        const scrollSpyEl = fixtureEl.querySelector('#scrollspy-example')
        const rootEl = fixtureEl.querySelector('#root')
        const scrollSpy = new ScrollSpy(scrollSpyEl, {
          target: 'ss-target'
        })

        const spy = spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          expect(rootEl).toHaveClass('active')
          expect(spy).toHaveBeenCalled()
          resolve()
        }, scrollSpyEl)

        scrollTo(scrollSpyEl, 350)
      })
    })

    it('should not process data if `activeTarget` is same as given target', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<nav class="navbar">',
          '  <ul class="nav">',
          '    <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>',
          '    <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>',
          '  </ul>',
          '</nav>',
          '<div class="content" style="overflow: auto; height: 50px">',
          '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
          '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        const scrollSpy = new ScrollSpy(contentEl, {
          offset: 0,
          target: '.navbar'
        })

        const triggerSpy = spyOn(EventHandler, 'trigger').and.callThrough()

        scrollSpy._activeTarget = fixtureEl.querySelector('#a-1')
        testElementIsActiveAfterScroll({
          elementSelector: '#a-1',
          targetSelector: '#div-1',
          contentEl,
          scrollSpy,
          cb: reject
        })

        setTimeout(() => {
          expect(triggerSpy).not.toHaveBeenCalled()
          resolve()
        }, 100)
      })
    })

    it('should only switch "active" class on current target specified w element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="root" class="active" style="display: block">',
          '  <div class="topbar">',
          '    <div class="topbar-inner">',
          '      <div class="container" id="ss-target">',
          '        <ul class="nav">',
          '          <li class="nav-item"><a href="#masthead">Overview</a></li>',
          '          <li class="nav-item"><a href="#detail">Detail</a></li>',
          '        </ul>',
          '      </div>',
          '    </div>',
          '  </div>',
          '  <div id="scrollspy-example" style="height: 100px; overflow: auto;">',
          '    <div style="height: 200px;" id="masthead">Overview</div>',
          '    <div style="height: 200px;" id="detail">Detail</div>',
          '  </div>',
          '</div>'
        ].join('')

        const scrollSpyEl = fixtureEl.querySelector('#scrollspy-example')
        const rootEl = fixtureEl.querySelector('#root')
        const scrollSpy = new ScrollSpy(scrollSpyEl, {
          target: fixtureEl.querySelector('#ss-target')
        })

        const spy = spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          expect(rootEl).toHaveClass('active')
          expect(scrollSpy._activeTarget).toEqual(fixtureEl.querySelector('[href="#detail"]'))
          expect(spy).toHaveBeenCalled()
          resolve()
        }, scrollSpyEl)

        scrollTo(scrollSpyEl, 350)
      })
    })

    it('should add the active class to the correct element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar">',
          '  <ul class="nav">',
          '    <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>',
          '    <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>',
          '  </ul>',
          '</nav>',
          '<div class="content" style="overflow: auto; height: 50px">',
          '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
          '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        const scrollSpy = new ScrollSpy(contentEl, {
          offset: 0,
          target: '.navbar'
        })

        testElementIsActiveAfterScroll({
          elementSelector: '#a-1',
          targetSelector: '#div-1',
          contentEl,
          scrollSpy,
          cb() {
            testElementIsActiveAfterScroll({
              elementSelector: '#a-2',
              targetSelector: '#div-2',
              contentEl,
              scrollSpy,
              cb: resolve
            })
          }
        })
      })
    })

    it('should add to nav the active class to the correct element (nav markup)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar">',
          '  <nav class="nav">',
          '    <a class="nav-link" id="a-1" href="#div-1">div 1</a>',
          '    <a class="nav-link" id="a-2" href="#div-2">div 2</a>',
          '  </nav>',
          '</nav>',
          '<div class="content" style="overflow: auto; height: 50px">',
          '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
          '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        const scrollSpy = new ScrollSpy(contentEl, {
          offset: 0,
          target: '.navbar'
        })

        testElementIsActiveAfterScroll({
          elementSelector: '#a-1',
          targetSelector: '#div-1',
          contentEl,
          scrollSpy,
          cb() {
            testElementIsActiveAfterScroll({
              elementSelector: '#a-2',
              targetSelector: '#div-2',
              contentEl,
              scrollSpy,
              cb: resolve
            })
          }
        })
      })
    })

    it('should add to list-group, the active class to the correct element (list-group markup)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar">',
          '  <div class="list-group">',
          '    <a class="list-group-item" id="a-1" href="#div-1">div 1</a>',
          '    <a class="list-group-item" id="a-2" href="#div-2">div 2</a>',
          '  </div>',
          '</nav>',
          '<div class="content" style="overflow: auto; height: 50px">',
          '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
          '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        const scrollSpy = new ScrollSpy(contentEl, {
          offset: 0,
          target: '.navbar'
        })

        testElementIsActiveAfterScroll({
          elementSelector: '#a-1',
          targetSelector: '#div-1',
          contentEl,
          scrollSpy,
          cb() {
            testElementIsActiveAfterScroll({
              elementSelector: '#a-2',
              targetSelector: '#div-2',
              contentEl,
              scrollSpy,
              cb: resolve
            })
          }
        })
      })
    })

    it('should keep the first section active when scrolled above the first section', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="header" style="height: 500px;"></div>',
          '<nav id="navigation" class="navbar">',
          '  <ul class="navbar-nav">',
          '    <li class="nav-item"><a id="one-link"   class="nav-link active" href="#one">One</a></li>',
          '    <li class="nav-item"><a id="two-link"   class="nav-link" href="#two">Two</a></li>',
          '    <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>',
          '  </ul>',
          '</nav>',
          '<div id="content" style="height: 200px; overflow-y: auto;">',
          '  <div id="spacer" style="height: 200px;"></div>',
          '  <div id="one" style="height: 100px;">text</div>',
          '  <div id="two" style="height: 100px;">text</div>',
          '  <div id="three" style="height: 100px;">text</div>',
          '  <div id="spacer" style="height: 100px;"></div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('#content')
        const scrollSpy = new ScrollSpy(contentEl, {
          target: '#navigation',
          offset: contentEl.offsetTop
        })
        const spy = spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          const active = () => fixtureEl.querySelector('.active')
          expect(spy).toHaveBeenCalled()

          expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
          // With the top activation line, scrolling section one's start to the
          // top of the viewport activates one-link (the section you're now in).
          expect(active().getAttribute('id')).toEqual('one-link')
          onScrollStop(() => {
            // Scrolled back above the first section: the first link stays active
            // rather than clearing.
            expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
            expect(active().getAttribute('id')).toEqual('one-link')
            resolve()
          }, contentEl)
          scrollTo(contentEl, 0)
        }, contentEl)

        scrollTo(contentEl, 200)
      })
    })

    it('should not clear selection if above the first section and first section is at the top', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="header" style="height: 500px;"></div>',
          '<nav id="navigation" class="navbar">',
          '  <ul class="navbar-nav">',
          '    <li class="nav-item"><a id="one-link" class="nav-link active" href="#one">One</a></li>',
          '    <li class="nav-item"><a id="two-link" class="nav-link" href="#two">Two</a></li>',
          '    <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>',
          '  </ul>',
          '</nav>',
          '<div id="content" style="height: 150px; overflow-y: auto;">',
          '  <div id="one" style="height: 100px;">test</div>',
          '  <div id="two" style="height: 100px;">test</div>',
          '  <div id="three" style="height: 100px;">test</div>',
          '  <div id="spacer" style="height: 100px;">test</div>',
          '</div>'
        ].join('')

        const negativeHeight = 0
        const startOfSectionTwo = 101
        const contentEl = fixtureEl.querySelector('#content')
        // eslint-disable-next-line no-unused-vars
        const scrollSpy = new ScrollSpy(contentEl, {
          target: '#navigation',
          rootMargin: '0px 0px -50%'
        })

        onScrollStop(() => {
          const activeId = () => fixtureEl.querySelector('.active').getAttribute('id')

          expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
          expect(activeId()).toEqual('two-link')
          scrollTo(contentEl, negativeHeight)

          onScrollStop(() => {
            expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
            expect(activeId()).toEqual('one-link')
            resolve()
          }, contentEl)

          scrollTo(contentEl, 0)
        }, contentEl)

        scrollTo(contentEl, startOfSectionTwo)
      })
    })

    it('should correctly select navigation element on backward scrolling when each target section height is 100%', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar">',
          '  <ul class="nav">',
          '    <li class="nav-item"><a id="li-100-1" class="nav-link" href="#div-100-1">div 1</a></li>',
          '    <li class="nav-item"><a id="li-100-2" class="nav-link" href="#div-100-2">div 2</a></li>',
          '    <li class="nav-item"><a id="li-100-3" class="nav-link" href="#div-100-3">div 3</a></li>',
          '    <li class="nav-item"><a id="li-100-4" class="nav-link" href="#div-100-4">div 4</a></li>',
          '    <li class="nav-item"><a id="li-100-5" class="nav-link" href="#div-100-5">div 5</a></li>',
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

        const contentEl = fixtureEl.querySelector('.content')
        const scrollSpy = new ScrollSpy(contentEl, {
          offset: 0,
          target: '.navbar'
        })

        scrollTo(contentEl, 0)
        testElementIsActiveAfterScroll({
          elementSelector: '#li-100-5',
          targetSelector: '#div-100-5',
          contentEl,
          scrollSpy,
          cb() {
            scrollTo(contentEl, 0)
            testElementIsActiveAfterScroll({
              elementSelector: '#li-100-2',
              targetSelector: '#div-100-2',
              contentEl,
              scrollSpy,
              cb() {
                scrollTo(contentEl, 0)
                testElementIsActiveAfterScroll({
                  elementSelector: '#li-100-3',
                  targetSelector: '#div-100-3',
                  contentEl,
                  scrollSpy,
                  cb() {
                    scrollTo(contentEl, 0)
                    testElementIsActiveAfterScroll({
                      elementSelector: '#li-100-2',
                      targetSelector: '#div-100-2',
                      contentEl,
                      scrollSpy,
                      cb() {
                        scrollTo(contentEl, 0)
                        testElementIsActiveAfterScroll({
                          elementSelector: '#li-100-1',
                          targetSelector: '#div-100-1',
                          contentEl,
                          scrollSpy,
                          cb: resolve
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      })
    })
  })

  describe('active section detection', () => {
    it('activates the deepest section whose top has crossed the line when several are visible', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar"><ul class="nav">',
          '  <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">1</a></li>',
          '  <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">2</a></li>',
          '  <li class="nav-item"><a class="nav-link" id="a-3" href="#div-3">3</a></li>',
          '</ul></nav>',
          '<div class="content" style="overflow: auto; height: 100px">',
          '  <div id="div-1" style="height: 80px">1</div>',
          '  <div id="div-2" style="height: 80px">2</div>',
          '  <div id="div-3" style="height: 200px">3</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        // eslint-disable-next-line no-new
        new ScrollSpy(contentEl, { target: '.navbar' })

        // At scrollTop 130, both div-2 and div-3 are visible, but only div-2's
        // top has crossed the activation line — so div-2 (deepest crossed) wins.
        onScrollStop(() => {
          expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
          expect(fixtureEl.querySelector('.active').id).toEqual('a-2')
          resolve()
        }, contentEl)

        scrollTo(contentEl, 130)
      })
    })

    it('activates the last section at the bottom even if its top never reaches the line', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar"><ul class="nav">',
          '  <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">1</a></li>',
          '  <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">2</a></li>',
          '</ul></nav>',
          '<div class="content" style="overflow: auto; height: 200px">',
          '  <div id="div-1" style="height: 400px">1</div>',
          '  <div id="div-2" style="height: 30px">2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        // eslint-disable-next-line no-new
        new ScrollSpy(contentEl, { target: '.navbar' })

        // Max scroll (230) puts div-2's top ~170px down — below the line — yet at
        // the bottom it must still be the active section.
        onScrollStop(() => {
          expect(fixtureEl.querySelector('.active')?.id).toEqual('a-2')
          resolve()
        }, contentEl)

        scrollTo(contentEl, 230)
      })
    })

    it('does not throw and activates sections whose id contains special characters', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar"><ul class="nav">',
          '  <li class="nav-item"><a class="nav-link" id="a-1" href="#sec.one:1">1</a></li>',
          '  <li class="nav-item"><a class="nav-link" id="a-2" href="#sec.two:2">2</a></li>',
          '</ul></nav>',
          '<div class="content" style="overflow: auto; height: 50px">',
          '  <div id="sec.one:1" style="height: 100px">1</div>',
          '  <div id="sec.two:2" style="height: 200px">2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        expect(() => new ScrollSpy(contentEl, { target: '.navbar' })).not.toThrow()

        onScrollStop(() => {
          expect(fixtureEl.querySelector('.active')?.id).toEqual('a-2')
          resolve()
        }, contentEl)

        scrollTo(contentEl, 100)
      })
    })

    it('updates the URL hash and moves focus to the section when a smooth-scroll settles', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="navbar"><ul class="nav">',
          '  <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">1</a></li>',
          '  <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">2</a></li>',
          '</ul></nav>',
          '<div class="content" style="overflow: auto; height: 50px">',
          '  <div id="div-1" style="height: 100px">1</div>',
          '  <div id="div-2" style="height: 200px">2</div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('.content')
        const section2 = fixtureEl.querySelector('#div-2')
        const scrollSpy = new ScrollSpy(contentEl, { target: '.navbar', smoothScroll: true })

        const replaceSpy = spyOn(window.history, 'replaceState')
        const focusSpy = spyOn(section2, 'focus').and.callThrough()

        // A smooth-scroll click records the pending navigation; the settle
        // (scrollend) then restores the hash and moves focus.
        scrollSpy._pendingNavigation = { hash: '#div-2', section: section2 }
        scrollSpy._onSettle()

        expect(replaceSpy).toHaveBeenCalledWith(null, '', '#div-2')
        expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
        expect(section2.getAttribute('tabindex')).toEqual('-1')
        expect(scrollSpy._pendingNavigation).toBeNull()
        resolve()
      })
    })

    it('keeps the first section active when nothing crosses the activation line', () => {
      fixtureEl.innerHTML = [
        '<nav class="navbar"><ul class="nav">',
        '  <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">1</a></li>',
        '  <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">2</a></li>',
        '</ul></nav>',
        '<div class="content" style="overflow: auto; height: 100px">',
        '  <div id="spacer" style="height: 40px"></div>',
        '  <div id="div-1" style="height: 100px">1</div>',
        '  <div id="div-2" style="height: 200px">2</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, { target: '.navbar' })

      // No section is crossing the activation line (empty intersecting set) and
      // we're not at the bottom — the first link stays active rather than clearing.
      scrollSpy._intersecting.clear()
      scrollSpy._atBottom = false
      scrollSpy._lastActive = null
      scrollSpy._computeActive()

      expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
      expect(fixtureEl.querySelector('.active').id).toEqual('a-1')
    })

    it('keeps the last active section while scrolling through a content gap', () => {
      fixtureEl.innerHTML = [
        '<nav class="navbar"><ul class="nav">',
        '  <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">1</a></li>',
        '  <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">2</a></li>',
        '</ul></nav>',
        '<div class="content" style="overflow: auto; height: 100px">',
        '  <div id="div-1" style="height: 100px">1</div>',
        '  <div id="div-2" style="height: 200px">2</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      const section2 = fixtureEl.querySelector('#div-2')
      const scrollSpy = new ScrollSpy(contentEl, { target: '.navbar' })

      // Section two crosses the line, then nothing does (a gap): two stays active.
      scrollSpy._intersecting = new Set([section2])
      scrollSpy._computeActive()
      expect(fixtureEl.querySelector('.active').id).toEqual('a-2')

      scrollSpy._intersecting.clear()
      scrollSpy._computeActive()
      expect(fixtureEl.querySelector('.active').id).toEqual('a-2')
    })

    it('parses a percentage topMargin into a collapsed rootMargin strip', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, { target: '#navBar', topMargin: '10%' })

      expect(scrollSpy._parseTopMargin()).toEqual({ value: 10, unit: '%' })
      expect(scrollSpy._getDerivedRootMargin()).toBe('0px 0px -90% 0px')
    })

    it('parses a pixel topMargin and flags it for resize rebuilds', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, { target: '#navBar', topMargin: '96px' })

      expect(scrollSpy._parseTopMargin()).toEqual({ value: 96, unit: 'px' })
      expect(scrollSpy._usesPixelMargin()).toBeTrue()
    })

    it('passes a custom rootMargin straight to the observer (taking precedence over topMargin)', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, {
        target: '#navBar',
        topMargin: '10%',
        rootMargin: '0px 0px -40%'
      })

      expect(scrollSpy._observer.rootMargin).toBe('0px 0px -40% 0px')
      expect(scrollSpy._usesPixelMargin()).toBeFalse()
    })

    it('resolves section ids via getElementById, tolerating encoded and malformed fragments', () => {
      fixtureEl.innerHTML = [
        '<nav class="navbar"><ul class="nav">',
        '  <li class="nav-item"><a class="nav-link" id="a-1" href="#%2Ffoo">1</a></li>',
        '  <li class="nav-item"><a class="nav-link" id="a-2" href="#%">malformed</a></li>',
        '</ul></nav>',
        '<div class="content" style="overflow: auto; height: 50px">',
        '  <div id="/foo" style="height: 100px">1</div>',
        '</div>'
      ].join('')

      const contentEl = fixtureEl.querySelector('.content')
      let scrollSpy
      expect(() => {
        scrollSpy = new ScrollSpy(contentEl, { target: '.navbar' })
      }).not.toThrow()

      // The encoded id (`%2Ffoo` -> `/foo`) resolves; the malformed `%` is skipped.
      const section = fixtureEl.querySelector('[id="/foo"]')
      expect(scrollSpy._sections).toHaveSize(1)
      expect(scrollSpy._linkBySection.get(section).id).toEqual('a-1')
    })

    it('only adds a resize listener for a pixel activation line, and rebuilds the observer', () => {
      fixtureEl.innerHTML = getDummyFixture()
      const contentEl = fixtureEl.querySelector('.content')

      const percentSpy = new ScrollSpy(contentEl, { target: '#navBar', topMargin: '10%' })
      expect(percentSpy._resizeHandler).toBeNull()
      percentSpy.dispose()

      const pixelSpy = new ScrollSpy(contentEl, { target: '#navBar', topMargin: '96px' })
      expect(pixelSpy._resizeHandler).toEqual(jasmine.any(Function))

      const firstObserver = pixelSpy._observer
      pixelSpy._rebuildObserver()
      expect(pixelSpy._observer).not.toBe(firstObserver)
    })
  })

  describe('refresh', () => {
    it('should disconnect existing observer', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const el = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(el)

      const spy = spyOn(scrollSpy._observer, 'disconnect')

      scrollSpy.refresh()

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const el = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(el)

      expect(ScrollSpy.getInstance(el)).not.toBeNull()

      scrollSpy.dispose()

      expect(ScrollSpy.getInstance(el)).toBeNull()
    })
  })

  describe('activation line options', () => {
    const getContainerFixture = (style = '') => {
      fixtureEl.innerHTML = [
        '<nav id="navBar" class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" href="#div-1">div 1</a></li>',
        '  </ul>',
        '</nav>',
        `<div class="content" data-bs-target="#navBar" style="${style}">`,
        '  <div id="div-1">div 1</div>',
        '</div>'
      ].join('')
      return fixtureEl.querySelector('.content')
    }

    it('should parse a percentage topMargin', () => {
      const scrollSpy = new ScrollSpy(getContainerFixture(), { topMargin: '10%' })

      expect(scrollSpy._parseTopMargin()).toEqual({ value: 10, unit: '%' })
      expect(scrollSpy._usesPixelMargin()).toBeFalse()
    })

    it('should parse a pixel topMargin and derive a rootMargin from an explicit scroll root', () => {
      const scrollSpy = new ScrollSpy(getContainerFixture('overflow-y: auto; height: 200px'), { topMargin: '50px' })

      expect(scrollSpy._rootElement).not.toBeNull()
      expect(scrollSpy._parseTopMargin()).toEqual({ value: 50, unit: 'px' })
      expect(scrollSpy._usesPixelMargin()).toBeTrue()
      expect(scrollSpy._getDerivedRootMargin()).toMatch(/^0px 0px -\d/)
    })

    it('should derive a rootMargin from the viewport when there is no scroll root', () => {
      // overflow:visible (default) means _rootElement is null, so viewport height is used
      const scrollSpy = new ScrollSpy(getContainerFixture(), { topMargin: '50px' })

      expect(scrollSpy._rootElement).toBeNull()
      expect(scrollSpy._getDerivedRootMargin()).toMatch(/^0px 0px -\d/)
    })

    it('should treat a non-numeric topMargin as 0', () => {
      const scrollSpy = new ScrollSpy(getContainerFixture(), { topMargin: 'auto' })

      expect(scrollSpy._parseTopMargin().value).toEqual(0)
    })

    it('should not derive a pixel margin when an explicit rootMargin is set', () => {
      const scrollSpy = new ScrollSpy(getContainerFixture(), { rootMargin: '0px 0px -50% 0px', topMargin: '50px' })

      expect(scrollSpy._usesPixelMargin()).toBeFalse()
    })

    it('should report a boolean overflow state from the scroll root', () => {
      const scrollSpy = new ScrollSpy(getContainerFixture('overflow-y: auto; height: 50px'))

      expect(typeof scrollSpy._isOverflowing()).toEqual('boolean')
    })

    it('should no-op rebuilding the observer when there is none', () => {
      const scrollSpy = new ScrollSpy(getContainerFixture())

      scrollSpy._observer.disconnect()
      scrollSpy._observer = null

      expect(() => scrollSpy._rebuildObserver()).not.toThrow()
    })

    it('should add a resize listener for pixel margins and remove it on dispose', () => {
      const spy = spyOn(EventHandler, 'off').and.callThrough()
      const scrollSpy = new ScrollSpy(getContainerFixture(), { topMargin: '50px' })

      expect(scrollSpy._resizeHandler).not.toBeNull()

      scrollSpy.dispose()

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(div, { target: fixtureEl.querySelector('#navBar') })

      expect(ScrollSpy.getInstance(div)).toEqual(scrollSpy)
      expect(ScrollSpy.getInstance(div)).toBeInstanceOf(ScrollSpy)
    })

    it('should return null if there is no instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      expect(ScrollSpy.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollspy = new ScrollSpy(div)

      expect(ScrollSpy.getOrCreateInstance(div)).toEqual(scrollspy)
      expect(ScrollSpy.getInstance(div)).toEqual(ScrollSpy.getOrCreateInstance(div, {}))
      expect(ScrollSpy.getOrCreateInstance(div)).toBeInstanceOf(ScrollSpy)
    })

    it('should return new instance when there is no scrollspy instance', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      expect(ScrollSpy.getInstance(div)).toBeNull()
      expect(ScrollSpy.getOrCreateInstance(div)).toBeInstanceOf(ScrollSpy)
    })

    it('should return new instance when there is no scrollspy instance with given configuration', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      expect(ScrollSpy.getInstance(div)).toBeNull()
      const scrollspy = ScrollSpy.getOrCreateInstance(div, {
        offset: 1
      })
      expect(scrollspy).toBeInstanceOf(ScrollSpy)

      expect(scrollspy._config.offset).toEqual(1)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollspy = new ScrollSpy(div, {
        offset: 1
      })
      expect(ScrollSpy.getInstance(div)).toEqual(scrollspy)

      const scrollspy2 = ScrollSpy.getOrCreateInstance(div, {
        offset: 2
      })
      expect(scrollspy).toBeInstanceOf(ScrollSpy)
      expect(scrollspy2).toEqual(scrollspy)

      expect(scrollspy2._config.offset).toEqual(1)
    })
  })

  describe('event handler', () => {
    it('should create scrollspy on window load event', () => {
      fixtureEl.innerHTML = [
        '<div id="nav"></div>' +
        '<div id="wrapper" data-bs-spy="scroll" data-bs-target="#nav" style="overflow-y: auto"></div>'
      ].join('')

      const scrollSpyEl = fixtureEl.querySelector('#wrapper')

      window.dispatchEvent(createEvent('load'))

      expect(ScrollSpy.getInstance(scrollSpyEl)).not.toBeNull()
    })
  })

  describe('SmoothScroll', () => {
    it('should not enable smoothScroll', () => {
      fixtureEl.innerHTML = getDummyFixture()
      const offSpy = spyOn(EventHandler, 'off').and.callThrough()
      const onSpy = spyOn(EventHandler, 'on').and.callThrough()

      const div = fixtureEl.querySelector('.content')
      const target = fixtureEl.querySelector('#navBar')
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1
      })

      expect(offSpy).not.toHaveBeenCalledWith(target, 'click.bs.scrollspy')
      expect(onSpy).not.toHaveBeenCalledWith(target, 'click.bs.scrollspy')
    })

    it('should enable smoothScroll', () => {
      fixtureEl.innerHTML = getDummyFixture()
      const offSpy = spyOn(EventHandler, 'off').and.callThrough()
      const onSpy = spyOn(EventHandler, 'on').and.callThrough()

      const div = fixtureEl.querySelector('.content')
      const target = fixtureEl.querySelector('#navBar')
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      expect(offSpy).toHaveBeenCalledWith(target, 'click.bs.scrollspy')
      expect(onSpy).toHaveBeenCalledWith(target, 'click.bs.scrollspy', '[href]', jasmine.any(Function))
    })

    it('should not smoothScroll to element if it not handles a scrollspy section', () => {
      fixtureEl.innerHTML = [
        '<nav id="navBar" class="navbar">',
        '  <ul class="nav">',
        '    <a id="anchor-1" href="#div-jsm-1">div 1</a></li>',
        '    <a id="anchor-2" href="#foo">div 2</a></li>',
        '  </ul>',
        '</nav>',
        '<div class="content" data-bs-target="#navBar" style="overflow-y: auto">',
        '  <div id="div-jsm-1">div 1</div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      const clickSpy = getElementScrollSpy(div)

      fixtureEl.querySelector('#anchor-2').click()
      expect(clickSpy).not.toHaveBeenCalled()
    })

    it('should call `scrollTop` if element doesn\'t not support `scrollTo`', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const link = fixtureEl.querySelector('[href="#div-jsm-1"]')
      delete div.scrollTo
      const clickSpy = getElementScrollSpy(div)
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      link.click()
      expect(clickSpy).toHaveBeenCalled()
    })

    it('should smoothScroll to the proper observable element on anchor click', done => {
      fixtureEl.innerHTML = [
        '<nav id="navBar" class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a id="li-jsm-1" class="nav-link" href="#div-jsm-1">div 1</a></li>',
        '  </ul>',
        '</nav>',
        '<div class="content" data-bs-target="#navBar" style="overflow-y: auto; height: 100px">',
        '  <div style="height: 300px">spacer</div>',
        '  <div id="div-jsm-1">div 1</div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')
      const link = fixtureEl.querySelector('[href="#div-jsm-1"]')
      const observable = fixtureEl.querySelector('#div-jsm-1')
      const clickSpy = getElementScrollSpy(div)
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      setTimeout(() => {
        if (div.scrollTo) {
          expect(clickSpy).toHaveBeenCalledWith({ top: observable.offsetTop - div.offsetTop, behavior: 'smooth' })
        } else {
          expect(clickSpy).toHaveBeenCalledWith(observable.offsetTop - div.offsetTop)
        }

        done()
      }, 100)
      link.click()
    })

    it('should smoothscroll to observable with anchor link that contains a french word as id', done => {
      fixtureEl.innerHTML = [
        '<nav id="navBar" class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a id="li-jsm-1" class="nav-link" href="#présentation">div 1</a></li>',
        '  </ul>',
        '</nav>',
        '<div class="content" data-bs-target="#navBar" style="overflow-y: auto; height: 100px">',
        '  <div style="height: 300px">spacer</div>',
        '  <div id="présentation">div 1</div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')
      const link = fixtureEl.querySelector('[href="#présentation"]')
      const observable = fixtureEl.querySelector('#présentation')
      const clickSpy = getElementScrollSpy(div)
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      setTimeout(() => {
        if (div.scrollTo) {
          expect(clickSpy).toHaveBeenCalledWith({ top: observable.offsetTop - div.offsetTop, behavior: 'smooth' })
        } else {
          expect(clickSpy).toHaveBeenCalledWith(observable.offsetTop - div.offsetTop)
        }

        done()
      }, 100)
      link.click()
    })

    it('should settle immediately (no smooth scroll) when already at the destination', done => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const link = fixtureEl.querySelector('[href="#div-jsm-1"]')
      const section = fixtureEl.querySelector('#div-jsm-1')
      const clickSpy = getElementScrollSpy(div)
      const scrollSpy = new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      spyOn(window.history, 'replaceState')
      const settleSpy = spyOn(scrollSpy, '_settleNavigation').and.callThrough()

      setTimeout(() => {
        // Clicking a link whose target is already at the top needs no scroll, so
        // we jump with `behavior: 'auto'` and settle right away — no pending nav.
        if (div.scrollTo) {
          expect(clickSpy).toHaveBeenCalledWith({ top: section.offsetTop - div.offsetTop, behavior: 'auto' })
        }

        expect(settleSpy).toHaveBeenCalled()
        expect(scrollSpy._pendingNavigation).toBeNull()
        done()
      }, 100)
      link.click()
    })
  })
})
