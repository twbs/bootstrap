import Collapse from '../../src/collapse.js'
import EventHandler from '../../src/dom/event-handler.js'
import { clearFixture, createEvent, getFixture } from '../helpers/fixture.js'

const setHash = hash => {
  const url = new URL(window.location.href)
  url.hash = hash
  window.history.replaceState(null, '', url)
}

const clearHash = () => {
  setHash('')
}

describe('Collapse', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
    clearHash()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Collapse.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Collapse.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Collapse.DATA_KEY).toEqual('bs.collapse')
    })
  })

  describe('constructor', () => {
    it('should reject elements that are not Collapse disclosures', () => {
      const panel = document.createElement('div')
      panel.className = 'collapse'

      expect(() => new Collapse(panel)).toThrow(TypeError)
      expect(Collapse.getInstance(panel)).toBeNull()
    })

    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<details class="collapse my-collapse"><summary>Toggle</summary></details>'

      const collapseEl = fixtureEl.querySelector('details.my-collapse')
      const collapseBySelector = new Collapse('details.my-collapse')
      expect(collapseBySelector._element).toEqual(collapseEl)

      const collapseByElement = new Collapse(collapseEl)
      expect(collapseByElement._element).toEqual(collapseEl)
    })

    it('should allow object in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-bs-toggle="collapse" href="#">Toggle item</a>',
        '    <details class="collapse"><summary>Toggle</summary>Lorem ipsum</details>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('details.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const collapse = new Collapse(collapseEl, {
        parent: myCollapseEl
      })

      expect(collapse._config.parent).toEqual(myCollapseEl)
    })

    it('should allow string selector in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-bs-toggle="collapse" href="#">Toggle item</a>',
        '    <details class="collapse"><summary>Toggle</summary>Lorem ipsum</details>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('details.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const collapse = new Collapse(collapseEl, {
        parent: 'div.my-collapse'
      })

      expect(collapse._config.parent).toEqual(myCollapseEl)
    })
  })

  describe('toggle', () => {
    it('should call show method when the details is closed', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const collapseEl = fixtureEl.querySelector('details')
      const collapse = new Collapse(collapseEl)

      const spy = spyOn(collapse, 'show')

      collapse.toggle()

      expect(spy).toHaveBeenCalled()
    })

    it('should call hide method when the details is open', () => {
      fixtureEl.innerHTML = '<details class="collapse" open><summary>Toggle</summary></details>'

      const collapseEl = fixtureEl.querySelector('[open]')
      const collapse = new Collapse(collapseEl)

      const spy = spyOn(collapse, 'hide')

      collapse.toggle()

      expect(spy).toHaveBeenCalled()
    })

    it('should find collapse children if they have collapse class too not only data-bs-parent', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="my-collapse">',
          '  <div class="item">',
          '    <a data-bs-toggle="collapse" href="#">Toggle item 1</a>',
          '    <details id="collapse1" class="collapse" open><summary>Toggle</summary>Lorem ipsum 1</details>',
          '  </div>',
          '  <div class="item">',
          '    <a id="triggerCollapse2" data-bs-toggle="collapse" href="#">Toggle item 2</a>',
          '    <details id="collapse2" class="collapse"><summary>Toggle</summary>Lorem ipsum 2</details>',
          '  </div>',
          '</div>'
        ].join('')

        const parent = fixtureEl.querySelector('.my-collapse')
        const collapseEl1 = fixtureEl.querySelector('#collapse1')
        const collapseEl2 = fixtureEl.querySelector('#collapse2')

        const collapseList = [...fixtureEl.querySelectorAll('.collapse')]
          .map(el => new Collapse(el, {
            parent
          }))

        collapseEl2.addEventListener('shown.bs.collapse', () => {
          expect(collapseEl2.open).toBeTrue()
          expect(collapseEl1.open).toBeFalse()
          resolve()
        })

        collapseList[1].toggle()
      })
    })
  })

  describe('show', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('details')
      const collapse = new Collapse(collapseEl)

      collapse._isTransitioning = true
      collapse.show()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<details class="collapse" open><summary>Toggle</summary></details>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('details')
      const collapse = new Collapse(collapseEl)

      collapse.show()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should show a collapsed element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

        const collapseEl = fixtureEl.querySelector('details')
        const collapse = new Collapse(collapseEl)

        // The CSS animates the size, so the element keeps its own styles
        collapseEl.addEventListener('show.bs.collapse', () => {
          expect(collapseEl.style.height).toEqual('')
        })
        collapseEl.addEventListener('shown.bs.collapse', () => {
          expect(collapseEl.open).toBeTrue()
          expect(collapseEl.style.height).toEqual('')
          resolve()
        })

        collapse.show()
      })
    })

    it('should show a collapsed element on width', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<details class="collapse collapse-horizontal"><summary>Toggle</summary></details>'

        const collapseEl = fixtureEl.querySelector('details')
        const collapse = new Collapse(collapseEl)

        collapseEl.addEventListener('show.bs.collapse', () => {
          expect(collapseEl.style.width).toEqual('')
        })
        collapseEl.addEventListener('shown.bs.collapse', () => {
          expect(collapseEl.open).toBeTrue()
          expect(collapseEl.style.width).toEqual('')
          resolve()
        })

        collapse.show()
      })
    })

    it('should close a horizontal panel after the transition or on disposal', async () => {
      fixtureEl.innerHTML = `
        <style>#horizontalPanel::details-content { transition-duration: .04s; }</style>
        <button data-bs-toggle="collapse" data-bs-target="#horizontalPanel">Toggle</button>
        <details class="collapse collapse-horizontal" id="horizontalPanel" open><summary>Toggle</summary></details>`
      const trigger = fixtureEl.querySelector('button')
      const panel = fixtureEl.querySelector('details')
      const collapse = new Collapse(panel)

      const hiding = collapse.hide()
      expect(panel.open).toBeTrue()
      expect(trigger.getAttribute('aria-expanded')).toEqual('false')
      await hiding
      expect(panel.open).toBeFalse()
      expect(panel).not.toHaveClass('collapse-closing')

      await collapse.show()
      const hidingAgain = collapse.hide()
      collapse.dispose()
      expect(panel.open).toBeFalse()
      expect(panel).not.toHaveClass('collapse-closing')
      await hidingAgain
    })

    it('should collapse only the first collapse', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="card" id="accordion1">',
          '  <details id="collapse1" class="collapse"><summary>Toggle</summary></details>',
          '</div>',
          '<div class="card" id="accordion2">',
          '  <details id="collapse2" class="collapse" open><summary>Toggle</summary></details>',
          '</div>'
        ].join('')

        const el1 = fixtureEl.querySelector('#collapse1')
        const el2 = fixtureEl.querySelector('#collapse2')
        const collapse = new Collapse(el1)

        el1.addEventListener('shown.bs.collapse', () => {
          expect(el1.open).toBeTrue()
          expect(el2.open).toBeTrue()
          resolve()
        })

        collapse.show()
      })
    })

    it('should be able to handle toggling of other children siblings', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="parentGroup" class="accordion">',
          '  <div class="accordion-header">',
          '    <button data-bs-target="#parentContent" data-bs-toggle="collapse" class="accordion-toggle">Parent</button>',
          '  </div>',
          '  <details id="parentContent" class="collapse" data-bs-parent="#parentGroup"><summary>Toggle</summary>',
          '    <div class="accordion-body">',
          '      <div id="childGroup" class="accordion">',
          '        <div class="accordion-item">',
          '          <div class="accordion-header">',
          '            <button data-bs-target="#childContent1" data-bs-toggle="collapse" class="accordion-toggle">Child 1</button>',
          '          </div>',
          '          <details id="childContent1" class="collapse" data-bs-parent="#childGroup"><summary>Toggle</summary>',
          '            <div>content</div>',
          '          </details>',
          '        </div>',
          '        <div class="accordion-item">',
          '          <div class="accordion-header">',
          '            <button data-bs-target="#childContent2" data-bs-toggle="collapse" class="accordion-toggle">Child 2</button>',
          '          </div>',
          '          <details id="childContent2" class="collapse" data-bs-parent="#childGroup"><summary>Toggle</summary>',
          '            <div>content</div>',
          '          </details>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </details>',
          '</div>'
        ].join('')

        const el = selector => fixtureEl.querySelector(selector)

        const parentBtn = el('[data-bs-target="#parentContent"]')
        const childBtn1 = el('[data-bs-target="#childContent1"]')
        const childBtn2 = el('[data-bs-target="#childContent2"]')

        const parentCollapseEl = el('#parentContent')
        const childCollapseEl1 = el('#childContent1')
        const childCollapseEl2 = el('#childContent2')

        parentCollapseEl.addEventListener('shown.bs.collapse', () => {
          expect(parentCollapseEl.open).toBeTrue()
          childBtn1.click()
        })
        childCollapseEl1.addEventListener('shown.bs.collapse', () => {
          expect(childCollapseEl1.open).toBeTrue()
          childBtn2.click()
        })
        childCollapseEl2.addEventListener('shown.bs.collapse', () => {
          expect(childCollapseEl2.open).toBeTrue()
          expect(childCollapseEl1.open).toBeFalse()
          resolve()
        })

        parentBtn.click()
      })
    })

    it('should not change tab tabpanels descendants on accordion', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="accordion" id="accordionExample">',
          '  <div class="accordion-item">',
          '    <h2 class="accordion-header">',
          '      <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">',
          '        Accordion Item #1',
          '      </button>',
          '    </h2>',
          '    <details id="collapseOne" class="collapse" open data-bs-parent="#accordionExample"><summary>Toggle</summary>',
          '      <div class="accordion-body">',
          '        <nav>',
          '          <div class="nav nav-tabs" id="nav-tab" role="tablist">',
          '            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>',
          '            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>',
          '          </div>',
          '        </nav>',
          '        <div class="tab-content" id="nav-tabContent">',
          '          <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">Home</div>',
          '          <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">Profile</div>',
          '        </div>',
          '      </div>',
          '    </details>',
          '  </div>',
          '</div>'
        ].join('')

        const el = fixtureEl.querySelector('#collapseOne')
        const activeTabPane = fixtureEl.querySelector('#nav-home')
        const collapse = new Collapse(el)
        let times = 1

        el.addEventListener('hidden.bs.collapse', () => {
          collapse.show()
        })

        el.addEventListener('shown.bs.collapse', () => {
          expect(activeTabPane).toHaveClass('show')
          times++
          if (times === 2) {
            resolve()
          }

          collapse.hide()
        })

        // The element starts shown, so close it to begin the hide/show cycle
        collapse.hide()
      })
    })

    it('should not fire shown when show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

        const collapseEl = fixtureEl.querySelector('details')
        const collapse = new Collapse(collapseEl)

        const expectEnd = () => {
          setTimeout(() => {
            expect().nothing()
            resolve()
          }, 10)
        }

        collapseEl.addEventListener('show.bs.collapse', event => {
          event.preventDefault()
          expectEnd()
        })

        collapseEl.addEventListener('shown.bs.collapse', () => {
          reject(new Error('should not fire shown event'))
        })

        collapse.show()
      })
    })
  })

  describe('hide', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('details')
      const collapse = new Collapse(collapseEl)

      collapse._isTransitioning = true
      collapse.hide()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('details')
      const collapse = new Collapse(collapseEl)

      collapse.hide()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should hide a collapsed element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<details class="collapse" open><summary>Toggle</summary></details>'

        const collapseEl = fixtureEl.querySelector('details')
        const collapse = new Collapse(collapseEl)

        collapseEl.addEventListener('hidden.bs.collapse', () => {
          expect(collapseEl.open).toBeFalse()
          expect(collapseEl.style.height).toEqual('')
          resolve()
        })

        collapse.hide()
      })
    })

    it('should not fire hidden when hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<details class="collapse" open><summary>Toggle</summary></details>'

        const collapseEl = fixtureEl.querySelector('details')
        const collapse = new Collapse(collapseEl)

        const expectEnd = () => {
          setTimeout(() => {
            expect().nothing()
            resolve()
          }, 10)
        }

        collapseEl.addEventListener('hide.bs.collapse', event => {
          event.preventDefault()
          expectEnd()
        })

        collapseEl.addEventListener('hidden.bs.collapse', () => {
          reject(new Error('should not fire hidden event'))
        })

        collapse.hide()
      })
    })
  })

  describe('dispose', () => {
    it('should destroy a collapse', () => {
      fixtureEl.innerHTML = '<details class="collapse" open><summary>Toggle</summary></details>'

      const collapseEl = fixtureEl.querySelector('details')
      const collapse = new Collapse(collapseEl)

      expect(Collapse.getInstance(collapseEl)).toEqual(collapse)

      collapse.dispose()

      expect(Collapse.getInstance(collapseEl)).toBeNull()
    })
  })

  describe('data-api', () => {
    it('should ignore other elements matched by a Collapse trigger', () => {
      fixtureEl.innerHTML = `
        <button type="button" data-bs-toggle="collapse" data-bs-target=".target">Toggle</button>
        <div class="collapse target"></div>
        <details class="collapse target"><summary>Toggle</summary></details>`

      const [trigger, other, panel] = fixtureEl.children
      trigger.click()

      expect(Collapse.getInstance(other)).toBeNull()
      expect(panel.open).toBeTrue()
    })

    it('should prevent url change if click on nested elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a role="button" data-bs-toggle="collapse" href="#collapse">',
          '  <span id="nested"></span>',
          '</a>',
          '<details id="collapse" class="collapse"><summary>Toggle</summary></details>'
        ].join('')

        const triggerEl = fixtureEl.querySelector('a')
        const nestedTriggerEl = fixtureEl.querySelector('#nested')

        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        triggerEl.addEventListener('click', event => {
          expect(event.target.isEqualNode(nestedTriggerEl)).toBeTrue()
          expect(event.delegateTarget.isEqualNode(triggerEl)).toBeTrue()
          expect(spy).toHaveBeenCalled()
          resolve()
        })

        nestedTriggerEl.click()
      })
    })

    it('should show multiple collapsed elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a role="button" data-bs-toggle="collapse" href=".multi"></a>',
          '<details id="collapse1" class="collapse multi"><summary>Toggle</summary></details>',
          '<details id="collapse2" class="collapse multi"><summary>Toggle</summary></details>'
        ].join('')

        const trigger = fixtureEl.querySelector('a')
        const collapse1 = fixtureEl.querySelector('#collapse1')
        const collapse2 = fixtureEl.querySelector('#collapse2')

        collapse2.addEventListener('shown.bs.collapse', () => {
          expect(trigger.getAttribute('aria-expanded')).toEqual('true')
          expect(collapse1.open).toBeTrue()
          expect(collapse2.open).toBeTrue()
          resolve()
        })

        trigger.click()
      })
    })

    it('should hide multiple collapsed elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a role="button" data-bs-toggle="collapse" href=".multi"></a>',
          '<details id="collapse1" class="collapse multi" open><summary>Toggle</summary></details>',
          '<details id="collapse2" class="collapse multi" open><summary>Toggle</summary></details>'
        ].join('')

        const trigger = fixtureEl.querySelector('a')
        const collapse1 = fixtureEl.querySelector('#collapse1')
        const collapse2 = fixtureEl.querySelector('#collapse2')

        collapse2.addEventListener('hidden.bs.collapse', () => {
          expect(trigger.getAttribute('aria-expanded')).toEqual('false')
          expect(collapse1.open).toBeFalse()
          expect(collapse2.open).toBeFalse()
          resolve()
        })

        trigger.click()
      })
    })

    it('should set aria-expanded to true on triggers when collapse is shown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="link1" role="button" data-bs-toggle="collapse" href="#" data-bs-target="#test1"></a>',
          '<a id="link2" role="button" data-bs-toggle="collapse" href="#" data-bs-target="#test1"></a>',
          '<details id="test1" class="collapse"><summary>Toggle</summary></details>'
        ].join('')

        const link1 = fixtureEl.querySelector('#link1')
        const link2 = fixtureEl.querySelector('#link2')
        const collapseTest1 = fixtureEl.querySelector('#test1')

        collapseTest1.addEventListener('shown.bs.collapse', () => {
          expect(link1.getAttribute('aria-expanded')).toEqual('true')
          expect(link2.getAttribute('aria-expanded')).toEqual('true')
          resolve()
        })

        link1.click()
      })
    })

    it('should set aria-expanded to false on triggers when collapse is hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="link1" role="button" data-bs-toggle="collapse" href="#" data-bs-target="#test1"></a>',
          '<a id="link2" role="button" data-bs-toggle="collapse" href="#" data-bs-target="#test1"></a>',
          '<details id="test1" class="collapse" open><summary>Toggle</summary></details>'
        ].join('')

        const link1 = fixtureEl.querySelector('#link1')
        const link2 = fixtureEl.querySelector('#link2')
        const collapseTest1 = fixtureEl.querySelector('#test1')

        collapseTest1.addEventListener('hidden.bs.collapse', () => {
          expect(link1.getAttribute('aria-expanded')).toEqual('false')
          expect(link2.getAttribute('aria-expanded')).toEqual('false')
          resolve()
        })

        link1.click()
      })
    })

    it('should allow accordion to use children other than card', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <div class="item">',
          '    <a id="linkTrigger" data-bs-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>',
          '    <details id="collapseOne" class="collapse" data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '  </div>',
          '  <div class="item">',
          '    <a id="linkTriggerTwo" data-bs-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>',
          '    <details id="collapseTwo" class="collapse" open data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '  </div>',
          '</div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#linkTrigger')
        const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
        const collapseOne = fixtureEl.querySelector('#collapseOne')
        const collapseTwo = fixtureEl.querySelector('#collapseTwo')

        collapseOne.addEventListener('shown.bs.collapse', () => {
          expect(collapseOne.open).toBeTrue()
          expect(collapseTwo.open).toBeFalse()

          collapseTwo.addEventListener('shown.bs.collapse', () => {
            expect(collapseOne.open).toBeFalse()
            expect(collapseTwo.open).toBeTrue()
            resolve()
          })

          triggerTwo.click()
        })

        trigger.click()
      })
    })

    it('should not prevent event for input', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<input type="checkbox" data-bs-toggle="collapse" data-bs-target="#collapsediv1">',
          '<details id="collapsediv1" class="collapse"><summary>Toggle</summary></details>'
        ].join('')

        const target = fixtureEl.querySelector('input')
        const collapseEl = fixtureEl.querySelector('#collapsediv1')

        collapseEl.addEventListener('shown.bs.collapse', () => {
          expect(collapseEl.open).toBeTrue()
          expect(target.checked).toBeTrue()
          resolve()
        })

        target.click()
      })
    })

    it('should allow accordion to contain nested elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <div class="row">',
          '    <div class="lg:col-6">',
          '      <div class="item">',
          '        <a id="linkTrigger" data-bs-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>',
          '        <details id="collapseOne" class="collapse" data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '      </div>',
          '    </div>',
          '    <div class="lg:col-6">',
          '      <div class="item">',
          '        <a id="linkTriggerTwo" data-bs-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>',
          '        <details id="collapseTwo" class="collapse" open data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerEl = fixtureEl.querySelector('#linkTrigger')
        const triggerTwoEl = fixtureEl.querySelector('#linkTriggerTwo')
        const collapseOneEl = fixtureEl.querySelector('#collapseOne')
        const collapseTwoEl = fixtureEl.querySelector('#collapseTwo')

        collapseOneEl.addEventListener('shown.bs.collapse', () => {
          expect(collapseOneEl.open).toBeTrue()
          expect(triggerEl.getAttribute('aria-expanded')).toEqual('true')

          expect(collapseTwoEl.open).toBeFalse()
          expect(triggerTwoEl.getAttribute('aria-expanded')).toEqual('false')

          collapseTwoEl.addEventListener('shown.bs.collapse', () => {
            expect(collapseOneEl.open).toBeFalse()
            expect(triggerEl.getAttribute('aria-expanded')).toEqual('false')

            expect(collapseTwoEl.open).toBeTrue()
            expect(triggerTwoEl.getAttribute('aria-expanded')).toEqual('true')
            resolve()
          })

          triggerTwoEl.click()
        })

        triggerEl.click()
      })
    })

    it('should allow accordion to target multiple elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <a id="linkTriggerOne" data-bs-toggle="collapse" data-bs-target=".collapseOne" href="#" aria-expanded="false" aria-controls="collapseOne"></a>',
          '  <a id="linkTriggerTwo" data-bs-toggle="collapse" data-bs-target=".collapseTwo" href="#" aria-expanded="false" aria-controls="collapseTwo"></a>',
          '  <details id="collapseOneOne" class="collapse collapseOne" data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '  <details id="collapseOneTwo" class="collapse collapseOne" data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '  <details id="collapseTwoOne" class="collapse collapseTwo" data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '  <details id="collapseTwoTwo" class="collapse collapseTwo" data-bs-parent="#accordion"><summary>Toggle</summary></details>',
          '</div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#linkTriggerOne')
        const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
        const collapseOneOne = fixtureEl.querySelector('#collapseOneOne')
        const collapseOneTwo = fixtureEl.querySelector('#collapseOneTwo')
        const collapseTwoOne = fixtureEl.querySelector('#collapseTwoOne')
        const collapseTwoTwo = fixtureEl.querySelector('#collapseTwoTwo')
        const collapsedElements = {
          one: false,
          two: false
        }

        function firstTest() {
          expect(collapseOneOne.open).toBeTrue()
          expect(collapseOneTwo.open).toBeTrue()

          expect(collapseTwoOne.open).toBeFalse()
          expect(collapseTwoTwo.open).toBeFalse()

          triggerTwo.click()
        }

        function secondTest() {
          expect(collapseOneOne.open).toBeFalse()
          expect(collapseOneTwo.open).toBeFalse()

          expect(collapseTwoOne.open).toBeTrue()
          expect(collapseTwoTwo.open).toBeTrue()
          resolve()
        }

        collapseOneOne.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.one) {
            firstTest()
          } else {
            collapsedElements.one = true
          }
        })

        collapseOneTwo.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.one) {
            firstTest()
          } else {
            collapsedElements.one = true
          }
        })

        collapseTwoOne.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.two) {
            secondTest()
          } else {
            collapsedElements.two = true
          }
        })

        collapseTwoTwo.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.two) {
            secondTest()
          } else {
            collapsedElements.two = true
          }
        })

        trigger.click()
      })
    })

    it('should collapse accordion children but not nested accordion children', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <div class="item">',
          '    <a id="linkTrigger" data-bs-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>',
          '    <details id="collapseOne" data-bs-parent="#accordion" class="collapse"><summary>Toggle</summary>',
          '      <div id="nestedAccordion">',
          '        <div class="item">',
          '          <a id="nestedLinkTrigger" data-bs-toggle="collapse" href="#nestedCollapseOne" aria-expanded="false" aria-controls="nestedCollapseOne"></a>',
          '          <details id="nestedCollapseOne" data-bs-parent="#nestedAccordion" class="collapse"><summary>Toggle</summary></details>',
          '        </div>',
          '      </div>',
          '    </details>',
          '  </div>',
          '  <div class="item">',
          '    <a id="linkTriggerTwo" data-bs-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>',
          '    <details id="collapseTwo" data-bs-parent="#accordion" class="collapse" open><summary>Toggle</summary></details>',
          '  </div>',
          '</div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#linkTrigger')
        const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
        const nestedTrigger = fixtureEl.querySelector('#nestedLinkTrigger')
        const collapseOne = fixtureEl.querySelector('#collapseOne')
        const collapseTwo = fixtureEl.querySelector('#collapseTwo')
        const nestedCollapseOne = fixtureEl.querySelector('#nestedCollapseOne')

        // `shown.bs.collapse` bubbles, so each handler stops listening before it
        // opens the next collapse
        function handlerCollapseOne() {
          collapseOne.removeEventListener('shown.bs.collapse', handlerCollapseOne)

          expect(collapseOne.open).toBeTrue()
          expect(collapseTwo.open).toBeFalse()
          expect(nestedCollapseOne.open).toBeFalse()

          nestedCollapseOne.addEventListener('shown.bs.collapse', handlerNestedCollapseOne)
          nestedTrigger.click()
        }

        function handlerNestedCollapseOne() {
          nestedCollapseOne.removeEventListener('shown.bs.collapse', handlerNestedCollapseOne)

          expect(collapseOne.open).toBeTrue()
          expect(collapseTwo.open).toBeFalse()
          expect(nestedCollapseOne.open).toBeTrue()

          collapseTwo.addEventListener('shown.bs.collapse', () => {
            expect(collapseOne.open).toBeFalse()
            expect(collapseTwo.open).toBeTrue()
            expect(nestedCollapseOne.open).toBeTrue()
            resolve()
          })

          triggerTwo.click()
        }

        collapseOne.addEventListener('shown.bs.collapse', handlerCollapseOne)
        trigger.click()
      })
    })

    it('should set aria-expanded on triggers only when all the targeted collapse are hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="trigger1" role="button" data-bs-toggle="collapse" href="#test1"></a>',
          '<a id="trigger2" role="button" data-bs-toggle="collapse" href="#0/my/id"></a>',
          '<a id="trigger3" role="button" data-bs-toggle="collapse" href=".multi"></a>',
          '<details id="test1" class="collapse multi"><summary>Toggle</summary></details>',
          '<details id="0/my/id" class="collapse multi"><summary>Toggle</summary></details>'
        ].join('')

        const trigger1 = fixtureEl.querySelector('#trigger1')
        const trigger2 = fixtureEl.querySelector('#trigger2')
        const trigger3 = fixtureEl.querySelector('#trigger3')
        const target1 = fixtureEl.querySelector('#test1')
        const target2 = fixtureEl.querySelector(`#${CSS.escape('0/my/id')}`)

        const target2Shown = () => {
          expect(trigger1.getAttribute('aria-expanded')).toEqual('true')

          expect(trigger2.getAttribute('aria-expanded')).toEqual('true')

          expect(trigger3.getAttribute('aria-expanded')).toEqual('true')

          target2.addEventListener('hidden.bs.collapse', () => {
            expect(trigger1.getAttribute('aria-expanded')).toEqual('true')

            expect(trigger2.getAttribute('aria-expanded')).toEqual('false')

            expect(trigger3.getAttribute('aria-expanded')).toEqual('true')

            target1.addEventListener('hidden.bs.collapse', () => {
              expect(trigger1.getAttribute('aria-expanded')).toEqual('false')

              expect(trigger2.getAttribute('aria-expanded')).toEqual('false')

              expect(trigger3.getAttribute('aria-expanded')).toEqual('false')
              resolve()
            })

            trigger1.click()
          })

          trigger2.click()
        }

        target2.addEventListener('shown.bs.collapse', target2Shown)
        trigger3.click()
      })
    })
  })

  describe('getInstance', () => {
    it('should return collapse instance', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const panel = fixtureEl.querySelector('details')
      const collapse = new Collapse(panel)

      expect(Collapse.getInstance(panel)).toEqual(collapse)
      expect(Collapse.getInstance(panel)).toBeInstanceOf(Collapse)
    })

    it('should return null when there is no collapse instance', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const panel = fixtureEl.querySelector('details')

      expect(Collapse.getInstance(panel)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return collapse instance', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const panel = fixtureEl.querySelector('details')
      const collapse = new Collapse(panel)

      expect(Collapse.getOrCreateInstance(panel)).toEqual(collapse)
      expect(Collapse.getInstance(panel)).toEqual(Collapse.getOrCreateInstance(panel, {}))
      expect(Collapse.getOrCreateInstance(panel)).toBeInstanceOf(Collapse)
    })

    it('should return new instance when there is no collapse instance', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const panel = fixtureEl.querySelector('details')

      expect(Collapse.getInstance(panel)).toBeNull()
      expect(Collapse.getOrCreateInstance(panel)).toBeInstanceOf(Collapse)
    })

    it('should return new instance when there is no collapse instance with given configuration', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const panel = fixtureEl.querySelector('details')

      expect(Collapse.getInstance(panel)).toBeNull()
      const collapse = Collapse.getOrCreateInstance(panel, {
        parent: fixtureEl
      })
      expect(collapse).toBeInstanceOf(Collapse)

      expect(collapse._config.parent).toEqual(fixtureEl)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary>Toggle</summary></details>'

      const panel = fixtureEl.querySelector('details')
      const collapse = new Collapse(panel, {
        parent: fixtureEl
      })
      expect(Collapse.getInstance(panel)).toEqual(collapse)

      const collapse2 = Collapse.getOrCreateInstance(panel, {
        parent: null
      })
      expect(collapse).toBeInstanceOf(Collapse)
      expect(collapse2).toEqual(collapse)

      expect(collapse2._config.parent).toEqual(fixtureEl)
    })
  })

  describe('native disclosure', () => {
    it('should keep the initial state and resolve after each completion event', async () => {
      fixtureEl.innerHTML = '<details class="collapse" open><summary>Toggle</summary>Panel</details>'
      const panel = fixtureEl.firstElementChild
      const events = []
      for (const name of ['hide', 'hidden', 'show', 'shown']) {
        panel.addEventListener(`${name}.bs.collapse`, () => events.push([name, panel.open]))
      }

      const collapse = new Collapse(panel)
      expect(panel.open).toBeTrue()
      await collapse.hide()
      expect(events).toEqual([['hide', true], ['hidden', false]])
      await collapse.toggle()
      expect(events.slice(2)).toEqual([['show', false], ['shown', true]])
    })

    it('should respect canceled summary clicks and before events', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary><span>Toggle</span></summary>Panel</details>'
      const panel = fixtureEl.firstElementChild
      const label = panel.querySelector('span')

      label.addEventListener('click', event => event.preventDefault(), { once: true })
      label.click()
      expect(Collapse.getInstance(panel)).toBeNull()

      panel.addEventListener('show.bs.collapse', event => event.preventDefault(), { once: true })
      label.click()
      expect(panel.open).toBeFalse()

      label.click()
      expect(panel.open).toBeTrue()

      panel.addEventListener('hide.bs.collapse', event => event.preventDefault(), { once: true })
      label.click()
      expect(panel.open).toBeTrue()
    })

    it('should leave an interactive control inside the summary active', () => {
      fixtureEl.innerHTML = '<details class="collapse"><summary><input type="checkbox"> Toggle</summary>Panel</details>'
      const panel = fixtureEl.firstElementChild
      const checkbox = panel.querySelector('input')
      checkbox.click()

      expect(checkbox.checked).toBeTrue()
      expect(panel.open).toBeFalse()
    })

    it('should toggle a summary with an explicit target only once', () => {
      fixtureEl.innerHTML = `
        <details class="collapse" id="nativePanel">
          <summary data-bs-toggle="collapse" data-bs-target="#nativePanel">Toggle</summary>
          Panel
        </details>`
      const panel = fixtureEl.firstElementChild
      panel.querySelector('summary').click()
      expect(panel.open).toBeTrue()
    })

    it('should keep a shared trigger expanded while any target is open', async () => {
      fixtureEl.innerHTML = `
        <button type="button" data-bs-toggle="collapse" data-bs-target="[">Invalid</button>
        <button type="button" data-bs-toggle="collapse" data-bs-target=".mixed-panel">Both</button>
        <button type="button" data-bs-toggle="collapse" data-bs-target="#nativePanel">Native</button>
        <details class="collapse mixed-panel" id="nativePanel"><summary>Toggle</summary>Native</details>
        <details class="collapse mixed-panel"><summary>Toggle</summary>Second panel</details>`

      const [invalid, both, native, panel, second] = fixtureEl.children
      invalid.click()
      both.click()
      expect(panel.open).toBeTrue()
      expect(second.open).toBeTrue()
      expect(native.getAttribute('aria-expanded')).toEqual('true')
      native.click()
      expect(panel.open).toBeFalse()
      expect(both.getAttribute('aria-expanded')).toEqual('true')
      await Collapse.getInstance(second).hide()
      expect(both.getAttribute('aria-expanded')).toEqual('false')
    })

    it('should close siblings through data-bs-parent', () => {
      fixtureEl.innerHTML = `
        <div id="mixedGroup">
          <details class="collapse" open><summary>Toggle</summary>Second panel</details>
          <details class="collapse" data-bs-parent="#mixedGroup"><summary>Toggle</summary>Native</details>
        </div>`

      const [first, panel] = fixtureEl.firstElementChild.children
      panel.querySelector('summary').click()
      expect(panel.open).toBeTrue()
      expect(first.open).toBeFalse()
    })

    it('should synchronize external controls when the browser closes a named peer', async () => {
      fixtureEl.innerHTML = `
        <button type="button" data-bs-toggle="collapse" data-bs-target="#namedPanel" aria-expanded="true">First</button>
        <details class="collapse" name="collapse-test" id="namedPanel" open><summary>First</summary>Panel</details>
        <details class="collapse" name="collapse-test"><summary>Second</summary>Panel</details>`

      const [trigger, first, second] = fixtureEl.children
      const toggled = new Promise(resolve => {
        first.addEventListener('toggle', resolve, { once: true })
      })
      second.open = true
      await toggled
      expect(first.open).toBeFalse()
      expect(trigger.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('hash target', () => {
    it('should scroll the trigger, show the collapse, then scroll the target on load', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="collapseHashTrigger" href="#collapseHash" data-bs-toggle="collapse">Toggle</a>',
          '<details id="collapseHash" class="collapse" data-bs-hash><summary>Toggle</summary></details>'
        ].join('')

        const triggerEl = fixtureEl.querySelector('#collapseHashTrigger')
        const collapseEl = fixtureEl.querySelector('#collapseHash')
        const triggerScrollSpy = spyOn(triggerEl, 'scrollIntoView')

        spyOn(collapseEl, 'scrollIntoView').and.callFake(() => {
          expect(triggerScrollSpy).toHaveBeenCalled()
          expect(collapseEl.open).toBeTrue()
          resolve()
        })

        setHash('collapseHash')
        window.dispatchEvent(createEvent('load'))
      })
    })

    it('should scroll the trigger, show the collapse, then scroll the target on hashchange', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="collapseHashChangeTrigger" href="#collapseHashChange" data-bs-toggle="collapse">Toggle</a>',
          '<details id="collapseHashChange" class="collapse" data-bs-hash><summary>Toggle</summary></details>'
        ].join('')

        const triggerEl = fixtureEl.querySelector('#collapseHashChangeTrigger')
        const collapseEl = fixtureEl.querySelector('#collapseHashChange')
        const triggerScrollSpy = spyOn(triggerEl, 'scrollIntoView')

        spyOn(collapseEl, 'scrollIntoView').and.callFake(() => {
          expect(triggerScrollSpy).toHaveBeenCalled()
          expect(collapseEl.open).toBeTrue()
          resolve()
        })

        setHash('collapseHashChange')
        window.dispatchEvent(createEvent('hashchange'))
      })
    })

    it('should scroll an already-open hash target into view', () => {
      fixtureEl.innerHTML = '<details id="collapseHashOpen" class="collapse" open data-bs-hash><summary>Toggle</summary></details>'

      const collapseEl = fixtureEl.querySelector('#collapseHashOpen')
      const scrollSpy = spyOn(collapseEl, 'scrollIntoView')
      const showSpy = spyOn(Collapse.prototype, 'show').and.callThrough()

      setHash('collapseHashOpen')
      window.dispatchEvent(createEvent('load'))

      expect(showSpy).not.toHaveBeenCalled()
      expect(scrollSpy).toHaveBeenCalled()
    })

    it('should ignore hash targets without data-bs-hash', () => {
      fixtureEl.innerHTML = '<details id="collapseNoHash" class="collapse"><summary>Toggle</summary></details>'

      const collapseEl = fixtureEl.querySelector('#collapseNoHash')
      const showSpy = spyOn(Collapse.prototype, 'show').and.callThrough()

      setHash('collapseNoHash')
      window.dispatchEvent(createEvent('load'))

      expect(collapseEl.open).toBeFalse()
      expect(showSpy).not.toHaveBeenCalled()
    })
  })
})
