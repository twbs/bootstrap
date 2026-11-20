import EventHandler from '../../../src/dom/event-handler.js'
import { decodeFragment, enableHashTarget, getHashTarget } from '../../../src/util/hash-target.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('Hash targets', () => {
  let fixture
  const namespace = '.hash-target-test'
  const setHash = hash => {
    const url = new URL(window.location.href)
    url.hash = hash
    window.history.replaceState(null, '', url)
  }

  beforeEach(() => {
    fixture = getFixture()
    setHash('')
  })

  afterEach(() => {
    EventHandler.off(window, namespace)
    setHash('')
    clearFixture()
  })

  it('should decode valid escapes and retain malformed escapes', () => {
    expect(decodeFragment('a%3Ab')).toEqual('a:b')
    expect(decodeFragment('a%zz')).toEqual('a%zz')
  })

  it('should resolve punctuation without treating the fragment as a selector', () => {
    fixture.innerHTML = '<div id="a:b.c/%" data-bs-hash></div>'
    setHash('a%3Ab.c%2F%25')
    expect(getHashTarget()).toBe(fixture.firstElementChild)
    fixture.firstElementChild.removeAttribute('data-bs-hash')
    expect(getHashTarget()).toBeNull()
  })

  it('should open the current hash when initialized after load', () => {
    fixture.innerHTML = '<div id="late-target" data-bs-hash></div>'
    setHash('late-target')
    const open = jasmine.createSpy('open')
    spyOnProperty(document, 'readyState', 'get').and.returnValue('complete')
    enableHashTarget(namespace, { matches: () => true, open })
    expect(open).toHaveBeenCalledWith(fixture.firstElementChild, jasmine.any(Function))
  })

  it('should ignore a completed animation after navigation to another hash', () => {
    fixture.innerHTML = '<div id="first" data-bs-hash></div><div id="second" data-bs-hash></div>'
    const first = fixture.firstElementChild
    const second = fixture.lastElementChild
    const firstScroll = spyOn(first, 'scrollIntoView')
    const secondScroll = spyOn(second, 'scrollIntoView')
    const pending = []
    enableHashTarget(namespace, { matches: () => true, open: (element, done) => pending.push(done) })
    setHash('first')
    window.dispatchEvent(new Event('hashchange'))
    setHash('second')
    window.dispatchEvent(new Event('hashchange'))
    pending[0]()
    pending[1]()
    expect(firstScroll).not.toHaveBeenCalled()
    expect(secondScroll).toHaveBeenCalledTimes(1)
  })

  it('should ignore a removed target and a cleared fragment', () => {
    fixture.innerHTML = '<div id="removed" data-bs-hash></div>'
    let finish
    const target = fixture.firstElementChild
    const scroll = spyOn(target, 'scrollIntoView')
    enableHashTarget(namespace, {
      matches: () => true,
      open(element, done) {
        finish = done
      }
    })
    setHash('removed')
    window.dispatchEvent(new Event('hashchange'))
    target.remove()
    setHash('')
    finish()
    expect(scroll).not.toHaveBeenCalled()
  })
})
