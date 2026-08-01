import EventHandler from '../../../src/dom/event-handler.js'
import { noop } from '../../../src/util/index.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('EventHandler', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('on', () => {
    it('should not add event listener if the event is not a string', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      EventHandler.on(div, null, noop)
      EventHandler.on(null, 'click', noop)

      expect().nothing()
    })

    it('should add event listener', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const div = fixtureEl.querySelector('div')

        EventHandler.on(div, 'click', () => {
          expect().nothing()
          resolve()
        })

        div.click()
      })
    })

    it('should add namespaced event listener', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const div = fixtureEl.querySelector('div')

        EventHandler.on(div, 'bs.namespace', () => {
          expect().nothing()
          resolve()
        })

        EventHandler.trigger(div, 'bs.namespace')
      })
    })

    it('should add native namespaced event listener', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const div = fixtureEl.querySelector('div')

        EventHandler.on(div, 'click.namespace', () => {
          expect().nothing()
          resolve()
        })

        EventHandler.trigger(div, 'click')
      })
    })

    it('should handle event delegation', () => {
      return new Promise(resolve => {
        EventHandler.on(document, 'click', '.test', () => {
          expect().nothing()
          resolve()
        })

        fixtureEl.innerHTML = '<div class="test"></div>'

        const div = fixtureEl.querySelector('div')

        div.click()
      })
    })

    it('should handle mouseenter/mouseleave like the native counterpart', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="outer">',
          '<div class="inner">',
          '<div class="nested">',
          '<div class="deep"></div>',
          '</div>',
          '</div>',
          '<div class="sibling"></div>',
          '</div>'
        ].join('')

        const outer = fixtureEl.querySelector('.outer')
        const inner = fixtureEl.querySelector('.inner')
        const nested = fixtureEl.querySelector('.nested')
        const deep = fixtureEl.querySelector('.deep')
        const sibling = fixtureEl.querySelector('.sibling')

        const enterSpy = jasmine.createSpy('mouseenter')
        const leaveSpy = jasmine.createSpy('mouseleave')
        const delegateEnterSpy = jasmine.createSpy('mouseenter')
        const delegateLeaveSpy = jasmine.createSpy('mouseleave')

        EventHandler.on(inner, 'mouseenter', enterSpy)
        EventHandler.on(inner, 'mouseleave', leaveSpy)
        EventHandler.on(outer, 'mouseenter', '.inner', delegateEnterSpy)
        EventHandler.on(outer, 'mouseleave', '.inner', delegateLeaveSpy)

        EventHandler.on(sibling, 'mouseenter', () => {
          expect(enterSpy.calls.count()).toEqual(2)
          expect(leaveSpy.calls.count()).toEqual(2)
          expect(delegateEnterSpy.calls.count()).toEqual(2)
          expect(delegateLeaveSpy.calls.count()).toEqual(2)
          resolve()
        })

        const moveMouse = (from, to) => {
          from.dispatchEvent(new MouseEvent('mouseout', {
            bubbles: true,
            relatedTarget: to
          }))

          to.dispatchEvent(new MouseEvent('mouseover', {
            bubbles: true,
            relatedTarget: from
          }))
        }

        // from outer to deep and back to outer (nested)
        moveMouse(outer, inner)
        moveMouse(inner, nested)
        moveMouse(nested, deep)
        moveMouse(deep, nested)
        moveMouse(nested, inner)
        moveMouse(inner, outer)

        setTimeout(() => {
          expect(enterSpy.calls.count()).toEqual(1)
          expect(leaveSpy.calls.count()).toEqual(1)
          expect(delegateEnterSpy.calls.count()).toEqual(1)
          expect(delegateLeaveSpy.calls.count()).toEqual(1)

          // from outer to inner to sibling (adjacent)
          moveMouse(outer, inner)
          moveMouse(inner, sibling)
        }, 20)
      })
    })
  })

  describe('one', () => {
    it('should call listener just once', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        let called = 0
        const div = fixtureEl.querySelector('div')
        const obj = {
          oneListener() {
            called++
          }
        }

        EventHandler.one(div, 'bootstrap', obj.oneListener)

        EventHandler.trigger(div, 'bootstrap')
        EventHandler.trigger(div, 'bootstrap')

        setTimeout(() => {
          expect(called).toEqual(1)
          resolve()
        }, 20)
      })
    })

    it('should call delegated listener just once', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        let called = 0
        const div = fixtureEl.querySelector('div')
        const obj = {
          oneListener() {
            called++
          }
        }

        EventHandler.one(fixtureEl, 'bootstrap', 'div', obj.oneListener)

        EventHandler.trigger(div, 'bootstrap')
        EventHandler.trigger(div, 'bootstrap')

        setTimeout(() => {
          expect(called).toEqual(1)
          resolve()
        }, 20)
      })
    })
  })

  describe('off', () => {
    it('should not remove a listener', () => {
      fixtureEl.innerHTML = '<div></div>'
      const div = fixtureEl.querySelector('div')

      EventHandler.off(div, null, noop)
      EventHandler.off(null, 'click', noop)
      expect().nothing()
    })

    it('should remove a listener', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'
        const div = fixtureEl.querySelector('div')

        let called = 0
        const handler = () => {
          called++
        }

        EventHandler.on(div, 'foobar', handler)
        EventHandler.trigger(div, 'foobar')

        EventHandler.off(div, 'foobar', handler)
        EventHandler.trigger(div, 'foobar')

        setTimeout(() => {
          expect(called).toEqual(1)
          resolve()
        }, 20)
      })
    })

    it('should remove all the events', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'
        const div = fixtureEl.querySelector('div')

        let called = 0

        EventHandler.on(div, 'foobar', () => {
          called++
        })
        EventHandler.on(div, 'foobar', () => {
          called++
        })
        EventHandler.trigger(div, 'foobar')

        EventHandler.off(div, 'foobar')
        EventHandler.trigger(div, 'foobar')

        setTimeout(() => {
          expect(called).toEqual(2)
          resolve()
        }, 20)
      })
    })

    it('should remove all the namespaced listeners if namespace is passed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'
        const div = fixtureEl.querySelector('div')

        let called = 0

        EventHandler.on(div, 'foobar.namespace', () => {
          called++
        })
        EventHandler.on(div, 'foofoo.namespace', () => {
          called++
        })
        EventHandler.trigger(div, 'foobar.namespace')
        EventHandler.trigger(div, 'foofoo.namespace')

        EventHandler.off(div, '.namespace')
        EventHandler.trigger(div, 'foobar.namespace')
        EventHandler.trigger(div, 'foofoo.namespace')

        setTimeout(() => {
          expect(called).toEqual(2)
          resolve()
        }, 20)
      })
    })

    it('should remove the namespaced listeners', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'
        const div = fixtureEl.querySelector('div')

        let calledCallback1 = 0
        let calledCallback2 = 0

        EventHandler.on(div, 'foobar.namespace', () => {
          calledCallback1++
        })
        EventHandler.on(div, 'foofoo.namespace', () => {
          calledCallback2++
        })

        EventHandler.trigger(div, 'foobar.namespace')
        EventHandler.off(div, 'foobar.namespace')
        EventHandler.trigger(div, 'foobar.namespace')

        EventHandler.trigger(div, 'foofoo.namespace')

        setTimeout(() => {
          expect(calledCallback1).toEqual(1)
          expect(calledCallback2).toEqual(1)
          resolve()
        }, 20)
      })
    })

    it('should remove the all the namespaced listeners for native events', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'
        const div = fixtureEl.querySelector('div')

        let called = 0

        EventHandler.on(div, 'click.namespace', () => {
          called++
        })
        EventHandler.on(div, 'click.namespace2', () => {
          called++
        })

        EventHandler.trigger(div, 'click')
        EventHandler.off(div, 'click')
        EventHandler.trigger(div, 'click')

        setTimeout(() => {
          expect(called).toEqual(2)
          resolve()
        }, 20)
      })
    })

    it('should remove the specified namespaced listeners for native events', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'
        const div = fixtureEl.querySelector('div')

        let called1 = 0
        let called2 = 0

        EventHandler.on(div, 'click.namespace', () => {
          called1++
        })
        EventHandler.on(div, 'click.namespace2', () => {
          called2++
        })
        EventHandler.trigger(div, 'click')

        EventHandler.off(div, 'click.namespace')
        EventHandler.trigger(div, 'click')

        setTimeout(() => {
          expect(called1).toEqual(1)
          expect(called2).toEqual(2)
          resolve()
        }, 20)
      })
    })

    it('should remove a listener registered by .one', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div></div>'

        const div = fixtureEl.querySelector('div')
        const handler = () => {
          reject(new Error('called'))
        }

        EventHandler.one(div, 'foobar', handler)
        EventHandler.off(div, 'foobar', handler)

        EventHandler.trigger(div, 'foobar')
        setTimeout(() => {
          expect().nothing()
          resolve()
        }, 20)
      })
    })

    it('should remove the correct delegated event listener', () => {
      const element = document.createElement('div')
      const subelement = document.createElement('span')
      element.append(subelement)

      const anchor = document.createElement('a')
      element.append(anchor)

      let i = 0
      const handler = () => {
        i++
      }

      EventHandler.on(element, 'click', 'a', handler)
      EventHandler.on(element, 'click', 'span', handler)

      fixtureEl.append(element)

      EventHandler.trigger(anchor, 'click')
      EventHandler.trigger(subelement, 'click')

      // first listeners called
      expect(i).toEqual(2)

      EventHandler.off(element, 'click', 'span', handler)
      EventHandler.trigger(subelement, 'click')

      // removed listener not called
      expect(i).toEqual(2)

      EventHandler.trigger(anchor, 'click')

      // not removed listener called
      expect(i).toEqual(3)

      EventHandler.on(element, 'click', 'span', handler)
      EventHandler.trigger(anchor, 'click')
      EventHandler.trigger(subelement, 'click')

      // listener re-registered
      expect(i).toEqual(5)

      EventHandler.off(element, 'click', 'span')
      EventHandler.trigger(subelement, 'click')

      // listener removed again
      expect(i).toEqual(5)
    })
  })

  // `mouseenter` and `mouseleave` do not bubble, so `EventHandler` emulates them with
  // `mouseover` and `mouseout` listeners. The registry must still treat them as their own
  // event types, or removal, deduplication and one-off bookkeeping hit the wrong handler.
  describe('custom mouse events', () => {
    const moveMouse = (from, to) => {
      from.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: to }))
      to.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: from }))
    }

    it('should ignore transitions between descendants for namespaced listeners', () => {
      fixtureEl.innerHTML = '<div class="outer"><span></span></div>'

      const outer = fixtureEl.querySelector('.outer')
      const child = fixtureEl.querySelector('span')
      const enterSpy = jasmine.createSpy('mouseenter')
      const leaveSpy = jasmine.createSpy('mouseleave')

      EventHandler.on(outer, 'mouseenter.namespace', enterSpy)
      EventHandler.on(outer, 'mouseleave.namespace', leaveSpy)

      moveMouse(outer, child)
      moveMouse(child, outer)

      expect(enterSpy).not.toHaveBeenCalled()
      expect(leaveSpy).not.toHaveBeenCalled()

      moveMouse(document.body, outer)

      expect(enterSpy.calls.count()).toEqual(1)
      expect(leaveSpy).not.toHaveBeenCalled()
    })

    it('should ignore transitions between descendants for delegated listeners', () => {
      fixtureEl.innerHTML = '<div class="outer"><div class="inner"><span></span></div></div>'

      const outer = fixtureEl.querySelector('.outer')
      const inner = fixtureEl.querySelector('.inner')
      const child = fixtureEl.querySelector('span')
      const enterSpy = jasmine.createSpy('delegated mouseenter')

      EventHandler.on(outer, 'mouseenter.namespace', '.inner', enterSpy)

      moveMouse(inner, child)

      expect(enterSpy).not.toHaveBeenCalled()

      moveMouse(outer, inner)

      expect(enterSpy.calls.count()).toEqual(1)
    })

    it('should register the same callback only once', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const handler = jasmine.createSpy('mouseenter')

      EventHandler.on(div, 'mouseenter', handler)
      EventHandler.on(div, 'mouseenter', handler)
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(handler.calls.count()).toEqual(1)
    })

    it('should keep mouseenter listeners apart from mouseover listeners', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const handler = jasmine.createSpy('mouse handler')

      EventHandler.on(div, 'mouseenter', handler)
      EventHandler.on(div, 'mouseover', handler)
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(handler.calls.count()).toEqual(2)

      EventHandler.off(div, 'mouseover')
      div.dispatchEvent(new MouseEvent('mouseover'))

      // only the mouseenter listener is left
      expect(handler.calls.count()).toEqual(3)

      EventHandler.off(div, 'mouseenter')
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(handler.calls.count()).toEqual(3)
    })

    it('should keep a delegated listener apart from a direct one', () => {
      fixtureEl.innerHTML = '<div class="outer"><div class="inner"></div></div>'

      const outer = fixtureEl.querySelector('.outer')
      const inner = fixtureEl.querySelector('.inner')
      const handler = jasmine.createSpy('mouseenter')

      EventHandler.on(outer, 'mouseenter', handler)
      EventHandler.on(outer, 'mouseenter', '.inner', handler)
      inner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

      expect(handler.calls.count()).toEqual(2)

      EventHandler.off(outer, 'mouseenter', '.inner', handler)
      inner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

      // the direct listener survives
      expect(handler.calls.count()).toEqual(3)
    })

    it('should remove a listener by reference', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const handler = jasmine.createSpy('mouseenter')

      EventHandler.on(div, 'mouseenter', handler)
      EventHandler.off(div, 'mouseenter', handler)
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(handler).not.toHaveBeenCalled()
    })

    it('should remove a delegated listener by reference', () => {
      fixtureEl.innerHTML = '<div class="outer"><div class="inner"></div></div>'

      const outer = fixtureEl.querySelector('.outer')
      const inner = fixtureEl.querySelector('.inner')
      const handler = jasmine.createSpy('delegated mouseenter')

      EventHandler.on(outer, 'mouseenter', '.inner', handler)
      EventHandler.off(outer, 'mouseenter', '.inner', handler)
      inner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })

    it('should remove every listener for the event type', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const first = jasmine.createSpy('first')
      const second = jasmine.createSpy('second')

      EventHandler.on(div, 'mouseenter', first)
      EventHandler.on(div, 'mouseenter.namespace', second)
      EventHandler.off(div, 'mouseenter')
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(first).not.toHaveBeenCalled()
      expect(second).not.toHaveBeenCalled()
    })

    it('should remove only the namespaced listener when a namespace is given', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const plain = jasmine.createSpy('plain')
      const namespaced = jasmine.createSpy('namespaced')

      EventHandler.on(div, 'mouseenter', plain)
      EventHandler.on(div, 'mouseenter.namespace', namespaced)
      EventHandler.off(div, 'mouseenter.namespace')
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(plain.calls.count()).toEqual(1)
      expect(namespaced).not.toHaveBeenCalled()
    })

    it('should remove listeners when only a namespace is given', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const enterSpy = jasmine.createSpy('mouseenter')
      const leaveSpy = jasmine.createSpy('mouseleave')

      EventHandler.on(div, 'mouseenter.namespace', enterSpy)
      EventHandler.on(div, 'mouseleave.namespace', leaveSpy)
      EventHandler.off(div, '.namespace')

      div.dispatchEvent(new MouseEvent('mouseover'))
      div.dispatchEvent(new MouseEvent('mouseout'))

      expect(enterSpy).not.toHaveBeenCalled()
      expect(leaveSpy).not.toHaveBeenCalled()
    })

    // Components such as Menu add a listener each time they open a submenu, then drop it on
    // close. A failed removal used to leave one live listener behind per cycle.
    it('should not accumulate listeners across repeated add and remove cycles', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const handler = jasmine.createSpy('mouseenter')

      for (let i = 0; i < 5; i++) {
        EventHandler.on(div, 'mouseenter', () => handler())
        EventHandler.off(div, 'mouseenter')
      }

      EventHandler.on(div, 'mouseenter', () => handler())
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(handler.calls.count()).toEqual(1)
    })

    it('should not consume a one-off listener on a transition between descendants', () => {
      fixtureEl.innerHTML = '<div class="outer"><div class="inner"><span></span></div></div>'

      const outer = fixtureEl.querySelector('.outer')
      const inner = fixtureEl.querySelector('.inner')
      const child = fixtureEl.querySelector('span')
      const enterSpy = jasmine.createSpy('mouseenter')
      const delegateEnterSpy = jasmine.createSpy('delegated mouseenter')

      EventHandler.one(inner, 'mouseenter', enterSpy)
      EventHandler.one(outer, 'mouseenter', '.inner', delegateEnterSpy)

      moveMouse(inner, child)

      expect(enterSpy).not.toHaveBeenCalled()
      expect(delegateEnterSpy).not.toHaveBeenCalled()

      moveMouse(outer, inner)
      moveMouse(outer, inner)

      expect(enterSpy.calls.count()).toEqual(1)
      expect(delegateEnterSpy.calls.count()).toEqual(1)
    })

    it('should call a namespaced one-off listener just once', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const handler = jasmine.createSpy('mouseenter')

      EventHandler.one(div, 'mouseenter.namespace', handler)
      div.dispatchEvent(new MouseEvent('mouseover'))
      div.dispatchEvent(new MouseEvent('mouseover'))

      expect(handler.calls.count()).toEqual(1)
    })
  })

  describe('general functionality', () => {
    it('should hydrate properties, and make them configurable', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="div1">',
          '   <div id="div2"></div>',
          '   <div id="div3"></div>',
          '</div>'
        ].join('')

        const div1 = fixtureEl.querySelector('#div1')
        const div2 = fixtureEl.querySelector('#div2')

        EventHandler.on(div1, 'click', event => {
          expect(event.currentTarget).toBe(div2)
          expect(event.delegateTarget).toBe(div1)
          expect(event.originalTarget).toBeNull()

          Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            get() {
              return div1
            }
          })

          expect(event.currentTarget).toBe(div1)
          resolve()
        })

        expect(() => {
          EventHandler.trigger(div1, 'click', { originalTarget: null, currentTarget: div2 })
        }).not.toThrowError(TypeError)
      })
    })
  })
})
