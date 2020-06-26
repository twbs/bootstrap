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

  describe('show', () => {
    it('should activate element by tab id', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#" data-target="#home" role="tab">Home</a></li>',
        '  <li><a href="#" id="triggerProfile" role="tab" data-target="#profile">Profile</a></li>',
        '</ul>',
        '<ul>',
        '  <li id="home"></li>',
        '  <li id="profile"></li>',
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
        '  <li><a href="#" data-target="#home">Home</a></li>',
        '  <li><a href="#" id="triggerProfile" data-target="#profile">Profile</a></li>',
        '</ol>',
        '<ol>',
        '  <li id="home"></li>',
        '  <li id="profile"></li>',
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
        '  <a href="#" data-target="#home">Home</a>',
        '  <a href="#" id="triggerProfile" data-target="#profile">Profile</a>',
        '</nav>',
        '<nav><div id="home"></div><div id="profile"></div></nav>'
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
        '<div class="list-group">',
        '  <a href="#" data-target="#home">Home</a>',
        '  <a href="#" id="triggerProfile" data-target="#profile">Profile</a>',
        '</div>',
        '<nav><div id="home"></div><div id="profile"></div></nav>'
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
        '  <li class="nav-item" role="presentation"><a href="#" data-target="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item" role="presentation"><a href="#" data-target="#profile" class="nav-link" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerActive = fixtureEl.querySelector('a.active')
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

    it('should not fire shown when tab is disabled', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><a href="#" data-target="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item" role="presentation"><a href="#" data-target="#profile" class="nav-link disabled" role="tab">Profile</a></li>',
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
        '  <li class="nav-item" role="presentation"><a href="#" data-target="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item" role="presentation"><a href="#" id="triggerProfile" data-target="#profile" class="nav-link" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">',
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')
      const secondTab = new Tab(secondTabTrigger)

      secondTabTrigger.addEventListener('show.bs.tab', ev => {
        expect(ev.relatedTarget.getAttribute('data-target')).toEqual('#home')
      })

      secondTabTrigger.addEventListener('shown.bs.tab', ev => {
        expect(ev.relatedTarget.getAttribute('data-target')).toEqual('#home')
        expect(secondTabTrigger.getAttribute('aria-selected')).toEqual('true')
        expect(fixtureEl.querySelector('a:not(.active)').getAttribute('aria-selected')).toEqual('false')
        done()
      })

      secondTab.show()
    })

    it('should fire hide and hidden events', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#" data-target="#home">Home</a></li>',
        '  <li><a href="#" data-target="#profile">Profile</a></li>',
        '</ul>'
      ].join('')

      const triggerList = fixtureEl.querySelectorAll('a')
      const firstTab = new Tab(triggerList[0])
      const secondTab = new Tab(triggerList[1])

      let hideCalled = false
      triggerList[0].addEventListener('shown.bs.tab', () => {
        secondTab.show()
      })

      triggerList[0].addEventListener('hide.bs.tab', ev => {
        hideCalled = true
        expect(ev.relatedTarget.getAttribute('data-target')).toEqual('#profile')
      })

      triggerList[0].addEventListener('hidden.bs.tab', ev => {
        expect(hideCalled).toEqual(true)
        expect(ev.relatedTarget.getAttribute('data-target')).toEqual('#profile')
        done()
      })

      firstTab.show()
    })

    it('should not fire hidden when hide is prevented', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#" data-target="#home">Home</a></li>',
        '  <li><a href="#" data-target="#profile">Profile</a></li>',
        '</ul>'
      ].join('')

      const triggerList = fixtureEl.querySelectorAll('a')
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
        '    <a href="#" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">',
        '      <button class="close"><span aria-hidden="true">&times;</span></button>',
        '    </a>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <a href="#" id="secondNav" class="nav-link nav-tab" data-target="#buzz" role="tab" data-toggle="tab">',
        '      <button class="close"><span aria-hidden="true">&times;</span></button>',
        '    </a>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <a href="#" class="nav-link nav-tab" data-target="#references" role="tab" data-toggle="tab">',
        '      <button id="btnClose" class="close"><span aria-hidden="true">&times;</span></button>',
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
        const tabId = linkEl.getAttribute('data-target')
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

      try {
        jQueryMock.fn.tab.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
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
    })
  })

  describe('data-api', () => {
    it('should create dynamically a tab', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item" role="presentation"><a href="#" data-target="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item" role="presentation"><a href="#" id="triggerProfile" data-toggle="tab" data-target="#profile" class="nav-link" role="tab">Profile</a></li>',
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
        '  <li class="nav-item"><a href="#" class="nav-link" data-target="#home" data-toggle="tab">Home</a></li>',
        '  <li class="nav-item"><a href="#" class="nav-link" data-target="#profile" data-toggle="tab">Profile</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle active" data-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a href="#" class="dropdown-item active" data-target="#dropdown1" id="dropdown1-tab" data-toggle="tab">@fat</a>',
        '      <a href="#" class="dropdown-item" data-target="#dropdown2" id="dropdown2-tab" data-toggle="tab">@mdo</a>',
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
        '  <a href="#" id="tab1" data-target="#x-tab1" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</a>',
        '  <a href="#" data-target="#x-tab2" class="nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</a>',
        '  <a href="#" data-target="#x-tab3" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</a>',
        '</nav>',
        '<div class="tab-content">',
        '  <div class="tab-pane" id="x-tab1" role="tabpanel">',
        '    <nav class="nav nav-tabs" role="tablist">',
        '      <a href="#" data-target="#nested-tab1" class="nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>',
        '      <a href="#" id="tabNested2" data-target="#nested-tab2" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>',
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
        '  <li class="nav-item" role="presentation"><a href="#" id="tab-home" data-target="#home" class="nav-link" data-toggle="tab" role="tab">Home</a></li>',
        '  <li class="nav-item" role="presentation"><a href="#" id="tab-profile" data-target="#profile" class="nav-link" data-toggle="tab" role="tab">Profile</a></li>',
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
        '    <a href="#" class="nav-link nav-tab" data-target="#home" role="tab" data-toggle="tab">Home</a>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <a href="#" id="secondNav" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">Profile</a>',
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
        '    <a href="#" class="nav-link nav-tab" data-target="#home" role="tab" data-toggle="tab">Home</a>',
        '  </li>',
        '  <li class="nav-item" role="presentation">',
        '    <a href="#" id="secondNav" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">Profile</a>',
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
