import ScrollSpy from '../../src/scrollspy'

/** Test helpers */
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'
import EventHandler from '../../src/dom/event-handler'

describe('ScrollSpy', () => {
  let fixtureEl

  const scrollTo = (el, height) => {
    // el.scrollTo({ top: height })
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
      '<div class="content" data-bs-target="#navBar">',
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
      const sSpyByElement = new ScrollSpy(sSpyEl)

      expect(sSpyBySelector._element).toEqual(sSpyEl)
      expect(sSpyByElement._element).toEqual(sSpyEl)
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

      expect(scrollSpy._targetLinks).toHaveSize(2)
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
          target: '#ss-target'
        })

        spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          expect(rootEl).toHaveClass('active')
          expect(scrollSpy._process).toHaveBeenCalled()
          resolve()
        }, scrollSpyEl)

        scrollTo(scrollSpyEl, 350)
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

        spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          expect(rootEl).toHaveClass('active')
          expect(scrollSpy._activeTarget).toEqual(fixtureEl.querySelector('[href="#detail"]'))
          expect(scrollSpy._process).toHaveBeenCalled()
          resolve()
        }, scrollSpyEl)

        scrollTo(scrollSpyEl, 350)
      })
    })

    it('should correctly select middle navigation option when large offset is used', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="header" style="height: 500px;"></div>',
          '<nav id="navigation" class="navbar">',
          '  <ul class="navbar-nav">',
          '    <li class="nav-item"><a class="nav-link active" id="one-link" href="#one">One</a></li>',
          '    <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>',
          '    <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>',
          '  </ul>',
          '</nav>',
          '<div id="content" style="height: 200px; overflow-y: auto;">',
          '  <div id="one" style="height: 500px;"></div>',
          '  <div id="two" style="height: 300px;"></div>',
          '  <div id="three" style="height: 10px;"></div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('#content')
        const scrollSpy = new ScrollSpy(fixtureEl, {
          target: '#navigation',
          offset: contentEl.offsetTop
        })

        spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          expect(fixtureEl.querySelector('#one-link')).not.toHaveClass('active')
          expect(fixtureEl.querySelector('#two-link')).toHaveClass('active')
          expect(fixtureEl.querySelector('#three-link')).not.toHaveClass('active')
          expect(scrollSpy._process).toHaveBeenCalled()
          resolve()
        }, contentEl)

        scrollTo(contentEl, 550)
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

    it('should clear selection if above the first section', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav id="navigation" class="navbar">',
          '  <ul class="navbar-nav">',
          '    <li class="nav-item"><a id="one-link"   class="nav-link active" href="#one">One</a></li>',
          '    <li class="nav-item"><a id="two-link"   class="nav-link" href="#two">Two</a></li>',
          '    <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>',
          '  </ul>',
          '</nav>',
          '<div id="content" style="height: 150px; overflow-y: auto;">',
          '  <div id="spacer" style="height: 100px;"></div>',
          '  <div id="one" style="height: 100px;"></div>',
          '  <div id="two" style="height: 100px;"></div>',
          '  <div id="three" style="height: 100px;"></div>',
          '  <div id="spacer" style="height: 100px;"></div>',
          '</div>'
        ].join('')

        const contentEl = fixtureEl.querySelector('#content')
        // eslint-disable-next-line no-unused-vars
        const scrollSpy = new ScrollSpy(contentEl, {
          target: '#navigation'
        })

        onScrollStop(() => {
          const active = () => fixtureEl.querySelector('.active')

          expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
          expect(active().getAttribute('id')).toEqual('two-link')

          onScrollStop(() => {
            expect(active()).toBeNull()
            resolve()
          }, contentEl)
          scrollTo(contentEl, 0)
        }, contentEl)

        scrollTo(contentEl, 201)
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
          '<div id="content" style="height: 200px; overflow-y: auto;">',
          '  <div id="one" style="height: 100px;"></div>',
          '  <div id="two" style="height: 100px;"></div>',
          '  <div id="three" style="height: 100px;"></div>',
          '  <div id="spacer" style="height: 100px;"></div>',
          '</div>'
        ].join('')

        const startOfSectionTwo = 101
        const contentEl = fixtureEl.querySelector('#content')
        const scrollSpy = new ScrollSpy(contentEl, {
          target: '#navigation'
        })
        const spy = spyOn(scrollSpy, '_process').and.callThrough()

        onScrollStop(() => {
          const activeId = () => fixtureEl.querySelector('.active').getAttribute('id')

          expect(spy).toHaveBeenCalled()
          spy.calls.reset()
          expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
          expect(activeId()).toEqual('two-link')

          onScrollStop(() => {
            expect(fixtureEl.querySelectorAll('.active')).toHaveSize(1)
            expect(spy).toHaveBeenCalled()
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
          cb: () => {
            scrollTo(contentEl, 0)
            testElementIsActiveAfterScroll({
              elementSelector: '#li-100-2',
              targetSelector: '#div-100-2',
              contentEl,
              scrollSpy,
              cb: () => {
                scrollTo(contentEl, 0)
                testElementIsActiveAfterScroll({
                  elementSelector: '#li-100-3',
                  targetSelector: '#div-100-3',
                  contentEl,
                  scrollSpy,
                  cb: () => {
                    scrollTo(contentEl, 0)
                    testElementIsActiveAfterScroll({
                      elementSelector: '#li-100-2',
                      targetSelector: '#div-100-2',
                      contentEl,
                      scrollSpy,
                      cb: () => {
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

  describe('jQueryInterface', () => {
    it('should create a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock, { target: '#navBar' })

      expect(ScrollSpy.getInstance(div)).not.toBeNull()
    })

    it('should create a scrollspy with given config', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock, { rootMargin: '100px' })
      spyOn(ScrollSpy.prototype, 'constructor')
      expect(ScrollSpy.prototype.constructor).not.toHaveBeenCalledWith(div, { rootMargin: '100px' })

      const scrollspy = ScrollSpy.getInstance(div)
      expect(scrollspy).not.toBeNull()
      expect(scrollspy._config.rootMargin).toEqual('100px')
    })

    it('should not re create a scrollspy', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(div)

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock)

      expect(ScrollSpy.getInstance(div)).toEqual(scrollSpy)
    })

    it('should call a scrollspy method', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(div)

      spyOn(scrollSpy, 'refresh')

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.scrollspy.call(jQueryMock, 'refresh')

      expect(ScrollSpy.getInstance(div)).toEqual(scrollSpy)
      expect(scrollSpy.refresh).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const action = 'undefinedMethod'

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.scrollspy.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error on protected method', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const action = '_getConfig'

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.scrollspy.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw error if method "constructor" is being called', () => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const action = 'constructor'

      jQueryMock.fn.scrollspy = ScrollSpy.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.scrollspy.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
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
        '<div id="wrapper" data-bs-spy="scroll" data-bs-target="#nav"></div>'
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
      const link = fixtureEl.querySelector('[href="#div-jsm-1"]')
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1
      })

      expect(offSpy).not.toHaveBeenCalledWith(link, 'click.bs.scrollspy')
      expect(onSpy).not.toHaveBeenCalledWith(link, 'click.bs.scrollspy')
    })

    it('should enable smoothScroll', () => {
      fixtureEl.innerHTML = getDummyFixture()
      const offSpy = spyOn(EventHandler, 'off').and.callThrough()
      const onSpy = spyOn(EventHandler, 'on').and.callThrough()

      const div = fixtureEl.querySelector('.content')
      const link = fixtureEl.querySelector('[href="#div-jsm-1"]')
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      expect(offSpy).toHaveBeenCalledWith(link, 'click.bs.scrollspy')
      expect(onSpy).toHaveBeenCalledWith(link, 'click.bs.scrollspy', jasmine.any(Function))
    })

    it('should smoothScroll to the proper observable element on anchor click', done => {
      fixtureEl.innerHTML = getDummyFixture()

      const div = fixtureEl.querySelector('.content')
      const link = fixtureEl.querySelector('[href="#div-jsm-1"]')
      const observable = fixtureEl.querySelector('#div-jsm-1')
      const clickSpy = spyOn(div, 'scrollTo').and.callThrough()
      // eslint-disable-next-line no-new
      new ScrollSpy(div, {
        offset: 1,
        smoothScroll: true
      })

      setTimeout(() => {
        expect(clickSpy).toHaveBeenCalledWith({ top: observable.offsetTop, behavior: 'smooth' })
        done()
      }, 100)
      link.click()
    })
  })
})
