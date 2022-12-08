import Tab from '../../src/tab'
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture'

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
        '<ul class="nav">',
        '  <li><a href="#home" role="tab">Home</a></li>',
        '</ul>',
        '<ul>',
        '  <li id="home"></li>',
        '</ul>'
      ].join('')

      const tabEl = fixtureEl.querySelector('[href="#home"]')
      const tabBySelector = new Tab('[href="#home"]')
      const tabByElement = new Tab(tabEl)

      expect(tabBySelector._element).toEqual(tabEl)
      expect(tabByElement._element).toEqual(tabEl)
    })

    it('Do not Throw exception if not parent', () => {
      fixtureEl.innerHTML = [
        fixtureEl.innerHTML = '<div class=""><div class="nav-link"></div></div>'
      ].join('')
      const navEl = fixtureEl.querySelector('.nav-link')

      expect(() => {
        new Tab(navEl) // eslint-disable-line no-new
      }).not.toThrowError(TypeError)
    })
  })

  describe('show', () => {
    it('should activate element by tab id (using buttons, the preferred semantic way)', () => {
      return new Promise(resolve => {
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
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id (using links for tabs - not ideal, but still supported)', () => {
      return new Promise(resolve => {
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
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id in ordered list', () => {
      return new Promise(resolve => {
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
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id in nav list', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<nav class="nav">',
          '  <button type="button" data-bs-target="#home" role="tab">Home</button>',
          '  <button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button>',
          '</nav>',
          '<div>',
          '  <div id="home" role="tabpanel"></div>',
          '  <div id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        tab.show()
      })
    })

    it('should activate element by tab id in list group', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="list-group" role="tablist">',
          '  <button type="button" data-bs-target="#home" role="tab">Home</button>',
          '  <button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button>',
          '</div>',
          '<div>',
          '  <div id="home" role="tabpanel"></div>',
          '  <div id="profile" role="tabpanel"></div>',
          '</div>'
        ].join('')

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        tab.show()
      })
    })

    it('should work with tab id being an int', done => {
      fixtureEl.innerHTML = [
        '<div class="card-header d-block d-inline-block">',
        '  <ul class="nav nav-tabs card-header-tabs" id="page_tabs">',
        '    <li class="nav-item">',
        '      <a class="nav-link" draggable="false" data-toggle="tab" href="#tab1">',
        '        Working Tab 1 (#tab1)',
        '     </a>',
        '    </li>',
        '    <li class="nav-item">',
        '      <a id="trigger2" class="nav-link" draggable="false" data-toggle="tab" href="#2">',
        '        Tab with numeric ID should work (#2)',
        '      </a>',
        '    </li>',
        '  </ul>',
        '</div>',
        '<div class="card-body">',
        '  <div class="tab-content" id="page_content">',
        '     <div class="tab-pane fade" id="tab1">',
        '      Working Tab 1 (#tab1) Content Here',
        '  </div>',
        '  <div class="tab-pane fade" id="2">',
        '      Working Tab 2 (#2) with numeric ID',
        '  </div>',
        '</div>'
      ].join('')
      const profileTriggerEl = fixtureEl.querySelector('#trigger2')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector(`#${CSS.escape('2')}`)).toHaveClass('active')
        done()
      })

      tab.show()
    })

    it('should not fire shown when show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

        const navEl = fixtureEl.querySelector('.nav > div')
        const tab = new Tab(navEl)
        const expectDone = () => {
          setTimeout(() => {
            expect().nothing()
            resolve()
          }, 30)
        }

        navEl.addEventListener('show.bs.tab', ev => {
          ev.preventDefault()
          expectDone()
        })

        navEl.addEventListener('shown.bs.tab', () => {
          reject(new Error('should not trigger shown event'))
        })

        tab.show()
      })
    })

    it('should not fire shown when tab is already active', () => {
      return new Promise((resolve, reject) => {
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
          reject(new Error('should not trigger shown event'))
        })

        tab.show()
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 30)
      })
    })

    it('show and shown events should reference correct relatedTarget', () => {
      return new Promise(resolve => {
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
          resolve()
        })

        secondTab.show()
      })
    })

    it('should fire hide and hidden events', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><button type="button" data-bs-target="#home" role="tab">Home</button></li>',
          '  <li><button type="button" data-bs-target="#profile" role="tab">Profile</button></li>',
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
          expect(hideCalled).toBeTrue()
          expect(ev.relatedTarget.getAttribute('data-bs-target')).toEqual('#profile')
          resolve()
        })

        firstTab.show()
      })
    })

    it('should not fire hidden when hide is prevented', () => {
      return new Promise((resolve, reject) => {
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
            resolve()
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
          reject(new Error('should not trigger hidden'))
        })

        firstTab.show()
      })
    })

    it('should handle removed tabs', () => {
      return new Promise(resolve => {
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
          expect(fixtureEl.querySelectorAll('.nav-tab')).toHaveSize(2)
          resolve()
        })

        btnCloseEl.addEventListener('click', () => {
          const linkEl = btnCloseEl.parentNode
          const liEl = linkEl.parentNode
          const tabId = linkEl.getAttribute('href')
          const tabIdEl = fixtureEl.querySelector(tabId)

          liEl.remove()
          tabIdEl.remove()
          secondNavTab.show()
        })

        btnCloseEl.click()
      })
    })

    it('should not focus on opened tab', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><button type="button" id="home" data-bs-target="#home" role="tab">Home</button></li>',
          '  <li><button type="button" id="triggerProfile" data-bs-target="#profile" role="tab">Profile</button></li>',
          '</ul>',
          '<ul>',
          '  <li id="home" role="tabpanel"></li>',
          '  <li id="profile" role="tabpanel"></li>',
          '</ul>'
        ].join('')

        const firstTab = fixtureEl.querySelector('#home')
        firstTab.focus()

        const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
        const tab = new Tab(profileTriggerEl)

        profileTriggerEl.addEventListener('shown.bs.tab', () => {
          expect(document.activeElement).toBe(firstTab)
          expect(document.activeElement).not.toBe(profileTriggerEl)
          resolve()
        })

        tab.show()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a tab', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const el = fixtureEl.querySelector('.nav > div')
      const tab = new Tab(fixtureEl.querySelector('.nav > div'))

      expect(Tab.getInstance(el)).not.toBeNull()

      tab.dispose()

      expect(Tab.getInstance(el)).toBeNull()
    })
  })

  describe('_activate', () => {
    it('should not be called if element argument is null', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav" role="tablist">',
        '  <li class="nav-link"></li>',
        '</ul>'
      ].join('')

      const tabEl = fixtureEl.querySelector('.nav-link')
      const tab = new Tab(tabEl)
      const spy = jasmine.createSpy('spy')

      const spyQueue = spyOn(tab, '_queueCallback')
      tab._activate(null, spy)
      expect(spyQueue).not.toHaveBeenCalled()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('_setInitialAttributes', () => {
    it('should put aria attributes', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li class="nav-link" id="foo" data-bs-target="#panel"></li>',
        '  <li class="nav-link" data-bs-target="#panel2"></li>',
        '</ul>',
        '<div id="panel"></div>',
        '<div id="panel2"></div>'
      ].join('')

      const tabEl = fixtureEl.querySelector('.nav-link')
      const parent = fixtureEl.querySelector('.nav')
      const children = fixtureEl.querySelectorAll('.nav-link')
      const tabPanel = fixtureEl.querySelector('#panel')
      const tabPanel2 = fixtureEl.querySelector('#panel2')

      expect(parent.getAttribute('role')).toEqual(null)
      expect(tabEl.getAttribute('role')).toEqual(null)
      expect(tabPanel.getAttribute('role')).toEqual(null)
      const tab = new Tab(tabEl)
      tab._setInitialAttributes(parent, children)

      expect(parent.getAttribute('role')).toEqual('tablist')
      expect(tabEl.getAttribute('role')).toEqual('tab')

      expect(tabPanel.getAttribute('role')).toEqual('tabpanel')
      expect(tabPanel2.getAttribute('role')).toEqual('tabpanel')
      expect(tabPanel.hasAttribute('tabindex')).toBeFalse()
      expect(tabPanel.hasAttribute('tabindex2')).toBeFalse()

      expect(tabPanel.getAttribute('aria-labelledby')).toEqual('#foo')
      expect(tabPanel2.hasAttribute('aria-labelledby')).toBeFalse()
    })
  })

  describe('_keydown', () => {
    it('if event is not one of left/right/up/down arrow, ignore it', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li class="nav-link" data-bs-toggle="tab"></li>',
        '</ul>'
      ].join('')

      const tabEl = fixtureEl.querySelector('.nav-link')
      const tab = new Tab(tabEl)

      const keydown = createEvent('keydown')
      keydown.key = 'Enter'
      const spyStop = spyOn(Event.prototype, 'stopPropagation').and.callThrough()
      const spyPrevent = spyOn(Event.prototype, 'preventDefault').and.callThrough()
      const spyKeydown = spyOn(tab, '_keydown')
      const spyGet = spyOn(tab, '_getChildren')

      tabEl.dispatchEvent(keydown)
      expect(spyKeydown).toHaveBeenCalled()
      expect(spyGet).not.toHaveBeenCalled()

      expect(spyStop).not.toHaveBeenCalled()
      expect(spyPrevent).not.toHaveBeenCalled()
    })

    it('if keydown event is right/down arrow, handle it', () => {
      fixtureEl.innerHTML = [
        '<div class="nav">',
        '  <span id="tab1" class="nav-link" data-bs-toggle="tab"></span>',
        '  <span id="tab2" class="nav-link" data-bs-toggle="tab"></span>',
        '  <span id="tab3" class="nav-link" data-bs-toggle="tab"></span>',
        '</div>'
      ].join('')

      const tabEl1 = fixtureEl.querySelector('#tab1')
      const tabEl2 = fixtureEl.querySelector('#tab2')
      const tabEl3 = fixtureEl.querySelector('#tab3')
      const tab1 = new Tab(tabEl1)
      const tab2 = new Tab(tabEl2)
      const tab3 = new Tab(tabEl3)
      const spyShow1 = spyOn(tab1, 'show').and.callThrough()
      const spyShow2 = spyOn(tab2, 'show').and.callThrough()
      const spyShow3 = spyOn(tab3, 'show').and.callThrough()
      const spyFocus1 = spyOn(tabEl1, 'focus').and.callThrough()
      const spyFocus2 = spyOn(tabEl2, 'focus').and.callThrough()
      const spyFocus3 = spyOn(tabEl3, 'focus').and.callThrough()

      const spyStop = spyOn(Event.prototype, 'stopPropagation').and.callThrough()
      const spyPrevent = spyOn(Event.prototype, 'preventDefault').and.callThrough()

      let keydown = createEvent('keydown')
      keydown.key = 'ArrowRight'

      tabEl1.dispatchEvent(keydown)
      expect(spyShow2).toHaveBeenCalled()
      expect(spyFocus2).toHaveBeenCalled()

      keydown = createEvent('keydown')
      keydown.key = 'ArrowDown'

      tabEl2.dispatchEvent(keydown)
      expect(spyShow3).toHaveBeenCalled()
      expect(spyFocus3).toHaveBeenCalled()

      tabEl3.dispatchEvent(keydown)
      expect(spyShow1).toHaveBeenCalled()
      expect(spyFocus1).toHaveBeenCalled()

      expect(spyStop).toHaveBeenCalledTimes(3)
      expect(spyPrevent).toHaveBeenCalledTimes(3)
    })

    it('if keydown event is left arrow, handle it', () => {
      fixtureEl.innerHTML = [
        '<div class="nav">',
        '  <span id="tab1" class="nav-link" data-bs-toggle="tab"></span>',
        '  <span id="tab2" class="nav-link" data-bs-toggle="tab"></span>',
        '</div>'
      ].join('')

      const tabEl1 = fixtureEl.querySelector('#tab1')
      const tabEl2 = fixtureEl.querySelector('#tab2')
      const tab1 = new Tab(tabEl1)
      const tab2 = new Tab(tabEl2)
      const spyShow1 = spyOn(tab1, 'show').and.callThrough()
      const spyShow2 = spyOn(tab2, 'show').and.callThrough()
      const spyFocus1 = spyOn(tabEl1, 'focus').and.callThrough()
      const spyFocus2 = spyOn(tabEl2, 'focus').and.callThrough()

      const spyStop = spyOn(Event.prototype, 'stopPropagation').and.callThrough()
      const spyPrevent = spyOn(Event.prototype, 'preventDefault').and.callThrough()

      let keydown = createEvent('keydown')
      keydown.key = 'ArrowLeft'

      tabEl2.dispatchEvent(keydown)
      expect(spyShow1).toHaveBeenCalled()
      expect(spyFocus1).toHaveBeenCalled()

      keydown = createEvent('keydown')
      keydown.key = 'ArrowUp'

      tabEl1.dispatchEvent(keydown)
      expect(spyShow2).toHaveBeenCalled()
      expect(spyFocus2).toHaveBeenCalled()

      expect(spyStop).toHaveBeenCalledTimes(2)
      expect(spyPrevent).toHaveBeenCalledTimes(2)
    })

    it('if keydown event is right arrow and next element is disabled', () => {
      fixtureEl.innerHTML = [
        '<div class="nav">',
        '  <span id="tab1" class="nav-link" data-bs-toggle="tab"></span>',
        '  <span id="tab2" class="nav-link" data-bs-toggle="tab" disabled></span>',
        '  <span id="tab3" class="nav-link disabled" data-bs-toggle="tab"></span>',
        '  <span id="tab4" class="nav-link" data-bs-toggle="tab"></span>',
        '</div>'
      ].join('')

      const tabEl1 = fixtureEl.querySelector('#tab1')
      const tabEl2 = fixtureEl.querySelector('#tab2')
      const tabEl3 = fixtureEl.querySelector('#tab3')
      const tabEl4 = fixtureEl.querySelector('#tab4')
      const tab1 = new Tab(tabEl1)
      const tab2 = new Tab(tabEl2)
      const tab3 = new Tab(tabEl3)
      const tab4 = new Tab(tabEl4)
      const spy1 = spyOn(tab1, 'show').and.callThrough()
      const spy2 = spyOn(tab2, 'show').and.callThrough()
      const spy3 = spyOn(tab3, 'show').and.callThrough()
      const spy4 = spyOn(tab4, 'show').and.callThrough()
      const spyFocus1 = spyOn(tabEl1, 'focus').and.callThrough()
      const spyFocus2 = spyOn(tabEl2, 'focus').and.callThrough()
      const spyFocus3 = spyOn(tabEl3, 'focus').and.callThrough()
      const spyFocus4 = spyOn(tabEl4, 'focus').and.callThrough()

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowRight'

      tabEl1.dispatchEvent(keydown)
      expect(spy1).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()
      expect(spy3).not.toHaveBeenCalled()
      expect(spy4).toHaveBeenCalledTimes(1)
      expect(spyFocus1).not.toHaveBeenCalled()
      expect(spyFocus2).not.toHaveBeenCalled()
      expect(spyFocus3).not.toHaveBeenCalled()
      expect(spyFocus4).toHaveBeenCalledTimes(1)
    })

    it('if keydown event is left arrow and next element is disabled', () => {
      fixtureEl.innerHTML = [
        '<div class="nav">',
        '  <span id="tab1" class="nav-link" data-bs-toggle="tab"></span>',
        '  <span id="tab2" class="nav-link" data-bs-toggle="tab" disabled></span>',
        '  <span id="tab3" class="nav-link disabled" data-bs-toggle="tab"></span>',
        '  <span id="tab4" class="nav-link" data-bs-toggle="tab"></span>',
        '</div>'
      ].join('')

      const tabEl1 = fixtureEl.querySelector('#tab1')
      const tabEl2 = fixtureEl.querySelector('#tab2')
      const tabEl3 = fixtureEl.querySelector('#tab3')
      const tabEl4 = fixtureEl.querySelector('#tab4')
      const tab1 = new Tab(tabEl1)
      const tab2 = new Tab(tabEl2)
      const tab3 = new Tab(tabEl3)
      const tab4 = new Tab(tabEl4)
      const spy1 = spyOn(tab1, 'show').and.callThrough()
      const spy2 = spyOn(tab2, 'show').and.callThrough()
      const spy3 = spyOn(tab3, 'show').and.callThrough()
      const spy4 = spyOn(tab4, 'show').and.callThrough()
      const spyFocus1 = spyOn(tabEl1, 'focus').and.callThrough()
      const spyFocus2 = spyOn(tabEl2, 'focus').and.callThrough()
      const spyFocus3 = spyOn(tabEl3, 'focus').and.callThrough()
      const spyFocus4 = spyOn(tabEl4, 'focus').and.callThrough()

      const keydown = createEvent('keydown')
      keydown.key = 'ArrowLeft'

      tabEl4.dispatchEvent(keydown)
      expect(spy4).not.toHaveBeenCalled()
      expect(spy3).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spyFocus4).not.toHaveBeenCalled()
      expect(spyFocus3).not.toHaveBeenCalled()
      expect(spyFocus2).not.toHaveBeenCalled()
      expect(spyFocus1).toHaveBeenCalledTimes(1)
    })
  })

  describe('jQueryInterface', () => {
    it('should create a tab', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const div = fixtureEl.querySelector('.nav > div')

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab.getInstance(div)).not.toBeNull()
    })

    it('should not re create a tab', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const div = fixtureEl.querySelector('.nav > div')
      const tab = new Tab(div)

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab.getInstance(div)).toEqual(tab)
    })

    it('should call a tab method', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const div = fixtureEl.querySelector('.nav > div')
      const tab = new Tab(div)

      const spy = spyOn(tab, 'show')

      jQueryMock.fn.tab = Tab.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock, 'show')

      expect(Tab.getInstance(div)).toEqual(tab)
      expect(spy).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const div = fixtureEl.querySelector('.nav > div')
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
      expect(Tab.getInstance(fixtureEl)).toBeNull()
    })

    it('should return this instance', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const divEl = fixtureEl.querySelector('.nav > div')
      const tab = new Tab(divEl)

      expect(Tab.getInstance(divEl)).toEqual(tab)
      expect(Tab.getInstance(divEl)).toBeInstanceOf(Tab)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return tab instance', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      expect(Tab.getOrCreateInstance(div)).toEqual(tab)
      expect(Tab.getInstance(div)).toEqual(Tab.getOrCreateInstance(div, {}))
      expect(Tab.getOrCreateInstance(div)).toBeInstanceOf(Tab)
    })

    it('should return new instance when there is no tab instance', () => {
      fixtureEl.innerHTML = '<div class="nav"><div class="nav-link"></div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Tab.getInstance(div)).toBeNull()
      expect(Tab.getOrCreateInstance(div)).toBeInstanceOf(Tab)
    })
  })

  describe('data-api', () => {
    it('should create dynamically a tab', () => {
      return new Promise(resolve => {
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
          expect(secondTabTrigger).toHaveClass('active')
          expect(fixtureEl.querySelector('#profile')).toHaveClass('active')
          resolve()
        })

        secondTabTrigger.click()
      })
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
      expect(firstLiLinkEl).toHaveClass('active')
      expect(fixtureEl.querySelector('li:last-child a')).not.toHaveClass('active')
      expect(fixtureEl.querySelector('li:last-child .dropdown-menu a:first-child')).not.toHaveClass('active')
    })

    it('selecting a dropdown tab does not activate another', () => {
      const nav1 = [
        '<ul class="nav nav-tabs" id="nav1">',
        '  <li class="nav-item active"><a class="nav-link" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')
      const nav2 = [
        '<ul class="nav nav-tabs" id="nav2">',
        '  <li class="nav-item active"><a class="nav-link" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')

      fixtureEl.innerHTML = nav1 + nav2

      const firstDropItem = fixtureEl.querySelector('#nav1 .dropdown-item')

      firstDropItem.click()
      expect(firstDropItem).toHaveClass('active')
      expect(fixtureEl.querySelector('#nav1 .dropdown-toggle')).toHaveClass('active')
      expect(fixtureEl.querySelector('#nav2 .dropdown-toggle')).not.toHaveClass('active')
      expect(fixtureEl.querySelector('#nav2 .dropdown-item')).not.toHaveClass('active')
    })

    it('should support li > .dropdown-item', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs">',
        '  <li class="nav-item"><a class="nav-link active" href="#home" data-bs-toggle="tab">Home</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#profile" data-bs-toggle="tab">Profile</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>',
        '    <ul class="dropdown-menu">',
        '      <li><a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-bs-toggle="tab">@fat</a></li>',
        '      <li><a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-bs-toggle="tab">@mdo</a></li>',
        '    </ul>',
        '  </li>',
        '</ul>'
      ].join('')

      const dropItems = fixtureEl.querySelectorAll('.dropdown-item')

      dropItems[1].click()
      expect(dropItems[0]).not.toHaveClass('active')
      expect(dropItems[1]).toHaveClass('active')
      expect(fixtureEl.querySelector('.nav-link')).not.toHaveClass('active')
    })

    it('should handle nested tabs', () => {
      return new Promise(resolve => {
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
          expect(xTab1El).toHaveClass('active')
          resolve()
        })

        tab1El.addEventListener('shown.bs.tab', () => {
          expect(xTab1El).toHaveClass('active')
          tabNested2El.click()
        })

        tab1El.click()
      })
    })

    it('should not remove fade class if no active pane is present', () => {
      return new Promise(resolve => {
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

        triggerTabHomeEl.addEventListener('shown.bs.tab', () => {
          setTimeout(() => {
            expect(tabProfileEl).toHaveClass('fade')
            expect(tabProfileEl).not.toHaveClass('show')

            expect(tabHomeEl).toHaveClass('fade')
            expect(tabHomeEl).toHaveClass('show')

            resolve()
          }, 10)
        })

        triggerTabProfileEl.addEventListener('shown.bs.tab', () => {
          setTimeout(() => {
            expect(tabProfileEl).toHaveClass('fade')
            expect(tabProfileEl).toHaveClass('show')
            triggerTabHomeEl.click()
          }, 10)
        })

        triggerTabProfileEl.click()
      })
    })

    it('should add `show` class to tab panes if there is no `.fade` class', () => {
      return new Promise(resolve => {
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
          expect(fixtureEl.querySelectorAll('.tab-content .show')).toHaveSize(1)
          resolve()
        })

        secondNavEl.click()
      })
    })

    it('should add show class to tab panes if there is a `.fade` class', () => {
      return new Promise(resolve => {
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
          setTimeout(() => {
            expect(fixtureEl.querySelectorAll('.show')).toHaveSize(1)
            resolve()
          }, 10)
        })

        secondNavEl.click()
      })
    })

    it('should prevent default when the trigger is <a> or <area>', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<ul class="nav" role="tablist">',
          '  <li><a type="button" href="#test"  class="active" role="tab" data-bs-toggle="tab">Home</a></li>',
          '  <li><a type="button" href="#test2" role="tab" data-bs-toggle="tab">Home</a></li>',
          '</ul>'
        ].join('')

        const tabEl = fixtureEl.querySelector('[href="#test2"]')
        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        tabEl.addEventListener('shown.bs.tab', () => {
          expect(tabEl).toHaveClass('active')
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        tabEl.click()
      })
    })

    it('should not fire shown when tab has disabled attribute', () => {
      return new Promise((resolve, reject) => {
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
        triggerDisabled.addEventListener('shown.bs.tab', () => {
          reject(new Error('should not trigger shown event'))
        })

        triggerDisabled.click()
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 30)
      })
    })

    it('should not fire shown when tab has disabled class', () => {
      return new Promise((resolve, reject) => {
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

        triggerDisabled.addEventListener('shown.bs.tab', () => {
          reject(new Error('should not trigger shown event'))
        })

        triggerDisabled.click()
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 30)
      })
    })
  })
})
