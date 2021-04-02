import Tab from '../../src/tab'

/** Test helpers */
import { getFixture, clearFixture, jQueryMock } from '../helpers/fixture'

describe('Tab', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Tab.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav"><li><a href="#home" role="tab">Home</a></li></ul>',
        '<ul><li id="home"></li></ul>'
      ].join('')

      const tabEl = fixtureEl.querySelector('[href="#home"]')
      const tabBySelector = new Tab('[href="#home"]')
      const tabByElement = new Tab(tabEl)

      expect(tabBySelector._element).toEqual(tabEl)
      expect(tabByElement._element).toEqual(tabEl)
    })
  })

  describe('show', () => {
    it('should activate element by tab id (using buttons, the preferred semantic way)', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav" role="tablist">',
        '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
        '  <li><button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button></li>',
        '</ul>',
        '<ul>',
        '  <li id="home" role="tabpanel"></li>',
        '  <li id="profile" role="tabpanel"></li>',
        '</ul>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
        done()
      })

      tab.show()
    })

    it('should activate element by tab id (using links for tabs - not ideal, but still supported)', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav" role="tablist">',
        '  <li><a href="#home" role="tab">Home</a></li>',
        '  <li><a id="triggerProfile" href="#profile" role="tab">Profile</a></li>',
        '</ul>',
        '<ul>',
        '  <li id="home" role="tabpanel"></li>',
        '  <li id="profile" role="tabpanel"></li>',
        '</ul>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
        done()
      })

      tab.show()
    })

    it('should activate element by tab id in ordered list', done => {
      fixtureEl.innerHTML = [
        '<ol class="nav nav-pills">',
        '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
        '  <li><button type="button" id="triggerProfile" href="#profile" role="tab">Profile</button></li>',
        '</ol>',
        '<ol>',
        '  <li id="home" role="tabpanel"></li>',
        '  <li id="profile" role="tabpanel"></li>',
        '</ol>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      tab.show()
    })

    it('should activate element by tab id in nav list', done => {
      fixtureEl.innerHTML = [
        '<nav class="nav">',
        '  <button type="button" data-bs-target="#home" role="tab">Home</button>',
        '  <button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</a>',
        '</nav>',
        '<div><div id="home" role="tabpanel"></div><div id="profile" role="tabpanel"></div></div>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      tab.show()
    })

    it('should activate element by tab id in list group', done => {
      fixtureEl.innerHTML = [
        '<div class="list-group" role="tablist">',
        '  <button type="button" data-bs-target="#home" role="tab">Home</button>',
        '  <button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button>',
        '</div>',
        '<div><div id="home" role="tabpanel"></div><div id="profile" role="tabpanel"></div></div>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      tab.show()
    })

    it('should not fire shown when show is prevented', done => {
      fixtureEl.innerHTML = '<div class="nav"></div>'

      const navEl = fixtureEl.querySelector('div')
      const tab = new Tab(navEl)
      const expectDone = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 30)
      }

      navEl.addEventListener('show.bs.tab', ev => {
        ev.preventDefault()
        expectDone()
      })

      navEl.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
    })

    it('should not fire shown when tab is already active', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
        '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#profile" class="nav-link" role="tab">Profile</button></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerActive = fixtureEl.querySelector('button.active')
      const tab = new Tab(triggerActive)

      triggerActive.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
      setTimeout(() => {
        expect().nothing()
        done()
      }, 30)
    })

    it('should not fire shown when tab has disabled attribute', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
        '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#profile" class="nav-link" disabled role="tab">Profile</button></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerDisabled = fixtureEl.querySelector('button[disabled]')
      const tab = new Tab(triggerDisabled)

      triggerDisabled.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
      setTimeout(() => {
        expect().nothing()
        done()
      }, 30)
    })

    it('should not fire shown when tab has disabled class', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><a href="#home" class="nav-link active" role="tab" aria-selected="true">Home</a></li>',
        '  <li class="nav-item" role="presentation"><a href="#profile" class="nav-link disabled" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerDisabled = fixtureEl.querySelector('a.disabled')
      const tab = new Tab(triggerDisabled)

      triggerDisabled.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
      setTimeout(() => {
        expect().nothing()
        done()
      }, 30)
    })

    it('show and shown events should reference correct relatedTarget', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
        '  <li class="nav-item" role="presentation"><button type="button" id="triggerProfile" data-bs-target="#profile" class="nav-link" role="tab">Profile</button></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')
      const secondTab = new Tab(secondTabTrigger)

      secondTabTrigger.addEventListener('show.bs.tab', ev => {
        expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#home')
      })

      secondTabTrigger.addEventListener('shown.bs.tab', ev => {
        expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#home')
        expect(secondTabTrigger.getAttribute('aria-selected')).toEqual('true')
        expect(fixtureEl.querySelector('button:not(.active)').getAttribute('aria-selected')).toEqual('false')
        done()
      })

      secondTab.show()
    })

    it('should fire hide and hidden events', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav" role="tablist">',
        '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
        '  <li><button type="button" data-bs-target="#profile">Profile</button></li>',
        '</ul>'
      ].join('')

      const triggerList = fixtureEl.querySelectorAll('button')
      const firstTab = new Tab(triggerList[0])
      const secondTab = new Tab(triggerList[1])

      let hideCalled = false
      triggerList[0].addEventListener('shown.bs.tab', () => {
        secondTab.show()
      })

      triggerList[0].addEventListener('hide.bs.tab', ev => {
        hideCalled = true
        expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#profile')
      })

      triggerList[0].addEventListener('hidden.bs.tab', ev => {
        expect(hideCalled).toEqual(true)
        expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#profile')
        done()
      })

      firstTab.show()
    })

    it('should not fire hidden when hide is prevented', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav" role="tablist">',
        '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
        '  <li><button type="button" data-bs-target="#profile" role="tab">Profile</button></li>',
        '</ul>'
      ].join('')

      const triggerList = fixtureEl.querySelectorAll('button')
      const firstTab = new Tab(triggerList[0])
      const secondTab = new Tab(triggerList[1])
      const expectDone = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 30)
      }

      triggerList[0].addEventListener('shown.bs.tab', () => {
        secondTab.show()
      })

      triggerList[0].addEventListener('hide.bs.tab', ev => {
        ev.preventDefault()
        expectDone()
      })

      triggerList[0].addEventListener('hidden.bs.tab', () => {
        throw new Error('should not trigger hidden')
      })

      firstTab.show()
    })

    it('should handle removed tabs', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation">',
        '    <a class="nav-link nav-tab" href="#profile" role="tab" data-bs-toggle="tab">',
        '      <button class="btn-close" aria-label="Close"></button>',
        '    </a>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <a id="secondNav" class="nav-link nav-tab" href="#buzz" role="tab" data-bs-toggle="tab">',
        '      <button class="btn-close" aria-label="Close"></button>',
        '    </a>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <a class="nav-link nav-tab" href="#references" role="tab" data-bs-toggle="tab">',
        '      <button id="btnClose" class="btn-close" aria-label="Close"></button>',
        '    </a>',
        '  </li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div role="tabpanel" class="tab-pane fade show active" id="profile">test 1</div>',
        '  <div role="tabpanel" class="tab-pane fade" id="buzz">test 2</div>',
        '  <div role="tabpanel" class="tab-pane fade" id="references">test 3</div>',
        '</div>'
      ].join('')

      const secondNavEl = fixtureEl.querySelector('#secondNav')
      const btnCloseEl = fixtureEl.querySelector('#btnClose')
      const secondNavTab = new Tab(secondNavEl)

      secondNavEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelectorAll('.nav-tab').length).toEqual(2)
        done()
      })

      btnCloseEl.addEventListener('click', () => {
        const linkEl = btnCloseEl.parentNode
        const liEl = linkEl.parentNode
        const tabId = linkEl.getAttribute('href')
        const tabIdEl = fixtureEl.querySelector(tabId)

        liEl.parentNode.removeChild(liEl)
        tabIdEl.parentNode.removeChild(tabIdEl)
        secondNavTab.show()
      })

      btnCloseEl.click()
    })
  })

  describe('dispose', () => {
    it('should dispose a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const tab = new Tab(fixtureEl.querySelector('div'))

      expect(Tab.getInstance(el)).not.toBeNull()

      tab.dispose()

      expect(Tab.getInstance(el)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should create a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab.getInstance(div)).toBeDefined()
    })

    it('should not re create a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab.getInstance(div)).toEqual(tab)
    })

    it('should call a tab method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      spyOn(tab, 'show')

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock, 'show')

      expect(Tab.getInstance(div)).toEqual(tab)
      expect(tab.show).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      expect(() => {
        jQueryMock.fn.tab.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return null if there is no instance', () => {
      expect(Tab.getInstance(fixtureEl)).toEqual(null)
    })

    it('should return this instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const divEl = fixtureEl.querySelector('div')
      const tab = new Tab(divEl)

      expect(Tab.getInstance(divEl)).toEqual(tab)
      expect(Tab.getInstance(divEl)).toBeInstanceOf(Tab)
    })
  })

  describe('data-api', () => {
    it('should create dynamically a tab', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><button type="button" data-bs-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>',
        '  <li class="nav-item" role="presentation"><button type="button" id="triggerProfile" data-bs-toggle="tab" data-bs-target="#profile" class="nav-link" role="tab">Profile</button></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')

      secondTabTrigger.addEventListener('shown.bs.tab', () => {
        expect(secondTabTrigger.classList.contains('active')).toEqual(true)
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      secondTabTrigger.click()
    })

    it('selected tab should deactivate previous selected link in dropdown', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs">',
        '  <li class="nav-item"><a class="nav-link" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#profile" data-bs-toggle="tab">Profile</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle active" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item active" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a>',
        '      <a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-bs-toggle="tab">@mdo</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')

      const firstLiLinkEl = fixtureEl.querySelector('li:first-child a')

      firstLiLinkEl.click()
      expect(firstLiLinkEl.classList.contains('active')).toEqual(true)
      expect(fixtureEl.querySelector('li:last-child a').classList.contains('active')).toEqual(false)
      expect(fixtureEl.querySelector('li:last-child .dropdown-menu a:first-child').classList.contains('active')).toEqual(false)
    })

    it('should handle nested tabs', done => {
      fixtureEl.innerHTML = [
        '<nav class="nav nav-tabs" role="tablist">',
        '  <button type="button" id="tab1" data-bs-target="#x-tab1" class="nav-link" data-bs-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</button>',
        '  <button type="button" data-bs-target="#x-tab2" class="nav-link active" data-bs-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</button>',
        '  <button type="button" data-bs-target="#x-tab3" class="nav-link" data-bs-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</button>',
        '</nav>',
        '<div class="tab-content">',
        '  <div class="tab-pane" id="x-tab1" role="tabpanel">',
        '    <nav class="nav nav-tabs" role="tablist">',
        '      <button type="button" data-bs-target="#nested-tab1" class="nav-link active" data-bs-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</button>',
        '      <button type="button" id="tabNested2" data-bs-target="#nested-tab2" class="nav-link" data-bs-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</button>',
        '    </nav>',
        '    <div class="tab-content">',
        '      <div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>',
        '      <div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>',
        '    </div>',
        '  </div>',
        '  <div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>',
        '  <div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>',
        '</div>'
      ].join('')

      const tab1El = fixtureEl.querySelector('#tab1')
      const tabNested2El = fixtureEl.querySelector('#tabNested2')
      const xTab1El = fixtureEl.querySelector('#x-tab1')

      tabNested2El.addEventListener('shown.bs.tab', () => {
        expect(xTab1El.classList.contains('active')).toEqual(true)
        done()
      })

      tab1El.addEventListener('shown.bs.tab', () => {
        expect(xTab1El.classList.contains('active')).toEqual(true)
        tabNested2El.click()
      })

      tab1El.click()
    })

    it('should not remove fade class if no active pane is present', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><button type="button" id="tab-home" data-bs-target="#home" class="nav-link" data-bs-toggle="tab" role="tab">Home</button></li>',
        '  <li class="nav-item" role="presentation"><button type="button" id="tab-profile" data-bs-target="#profile" class="nav-link" data-bs-toggle="tab" role="tab">Profile</button></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane fade" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane fade" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerTabProfileEl = fixtureEl.querySelector('#tab-profile')
      const triggerTabHomeEl = fixtureEl.querySelector('#tab-home')
      const tabProfileEl = fixtureEl.querySelector('#profile')
      const tabHomeEl = fixtureEl.querySelector('#home')

      triggerTabProfileEl.addEventListener('shown.bs.tab', () => {
        expect(tabProfileEl.classList.contains('fade')).toEqual(true)
        expect(tabProfileEl.classList.contains('show')).toEqual(true)

        triggerTabHomeEl.addEventListener('shown.bs.tab', () => {
          expect(tabProfileEl.classList.contains('fade')).toEqual(true)
          expect(tabProfileEl.classList.contains('show')).toEqual(false)

          expect(tabHomeEl.classList.contains('fade')).toEqual(true)
          expect(tabHomeEl.classList.contains('show')).toEqual(true)

          done()
        })

        triggerTabHomeEl.click()
      })

      triggerTabProfileEl.click()
    })

    it('should not add show class to tab panes if there is no `.fade` class', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation">',
        '    <button type="button" class="nav-link nav-tab" data-bs-target="#home" role="tab" data-bs-toggle="tab">Home</button>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <button type="button" id="secondNav" class="nav-link nav-tab" data-bs-target="#profile" role="tab" data-bs-toggle="tab">Profile</button>',
        '  </li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div role="tabpanel" class="tab-pane" id="home">test 1</div>',
        '  <div role="tabpanel" class="tab-pane" id="profile">test 2</div>',
        '</div>'
      ].join('')

      const secondNavEl = fixtureEl.querySelector('#secondNav')

      secondNavEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelectorAll('.show').length).toEqual(0)
        done()
      })

      secondNavEl.click()
    })

    it('should add show class to tab panes if there is a `.fade` class', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation">',
        '    <button type="button" class="nav-link nav-tab" data-bs-target="#home" role="tab" data-bs-toggle="tab">Home</button>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <button type="button" id="secondNav" class="nav-link nav-tab" data-bs-target="#profile" role="tab" data-bs-toggle="tab">Profile</button>',
        '  </li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div role="tabpanel" class="tab-pane fade" id="home">test 1</div>',
        '  <div role="tabpanel" class="tab-pane fade" id="profile">test 2</div>',
        '</div>'
      ].join('')

      const secondNavEl = fixtureEl.querySelector('#secondNav')

      secondNavEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelectorAll('.show').length).toEqual(1)
        done()
      })

      secondNavEl.click()
    })
  })
})
