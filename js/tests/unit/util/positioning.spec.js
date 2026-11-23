import {
  arrow, autoUpdate, computePosition, flip, offset, shift, size
} from '../../../src/util/positioning.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('positioning', () => {
  const reference = (left, top, width = 40, height = 30) => ({
    getBoundingClientRect: () => new DOMRect(left, top, width, height)
  })
  let fixture
  let floating

  beforeAll(() => {
    fixture = getFixture()
  })

  beforeEach(() => {
    fixture.innerHTML = '<div style="position: fixed; width: 100px; height: 60px"></div>'
    floating = fixture.firstElementChild
  })

  afterEach(() => {
    clearFixture()
  })

  it('tries centered sides before shifting at an RTL corner', async () => {
    floating.dir = 'rtl'
    const result = await computePosition(reference(0, 0), floating, {
      placement: 'top',
      strategy: 'fixed',
      middleware: [offset(6), flip({ fallbackPlacements: ['right', 'bottom', 'left'] }), shift()]
    })

    expect(result.placement).toEqual('right')
    expect(result.x).toEqual(46)
    expect(result.y).toEqual(0)
  })

  it('remeasures after size middleware changes the panel', async () => {
    const result = await computePosition(reference(30, 40), floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [
        shift({ boundary: new DOMRect(0, 0, 125, 100), crossAxis: true }),
        size({
          boundary: new DOMRect(0, 0, 125, 100),
          padding: 10,
          apply({ elements, availableWidth, availableHeight }) {
            elements.floating.style.width = `${availableWidth}px`
            elements.floating.style.height = `${availableHeight}px`
          }
        })
      ]
    })

    expect(floating.offsetWidth).toEqual(105)
    expect(floating.offsetHeight).toEqual(80)
    expect(result.x).toEqual(20)
    expect(result.y).toEqual(20)
  })

  it('applies middleware overrides after a placement reset', async () => {
    const result = await computePosition(reference(100, 160), floating, {
      placement: 'bottom',
      strategy: 'fixed',
      middleware: [
        offset(4),
        {
          name: 'chooseSide',
          fn({ placement }) {
            return placement === 'right' ? {} : { reset: { placement: 'right' } }
          }
        },
        {
          name: 'custom',
          fn({ y }) {
            return { y: y + 8, data: { ran: true } }
          }
        }
      ]
    })

    expect(result.x).toEqual(144)
    expect(result.y).toEqual(153)
    expect(result.middlewareData.chooseSide).toEqual({})
    expect(result.middlewareData.custom).toEqual({ ran: true })
  })

  it('moves an aligned box to center its arrow on a small reference', async () => {
    floating.innerHTML = '<div style="position: absolute; width: 16px; height: 8px"></div>'
    const result = await computePosition(reference(90, 100, 8, 8), floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(6), arrow({ element: floating.firstElementChild, padding: 4 })]
    })

    expect(result.x).toEqual(82)
    expect(result.y).toEqual(114)
    expect(result.middlewareData.arrow.x).toEqual(4)
    expect(result.middlewareData.arrow.centerOffset).toEqual(0)
  })

  it('respects a custom clipping rectangle supplied through the platform', async () => {
    const result = await computePosition(reference(125, 20, 20, 20), floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      platform: {
        async getScale() {
          return { x: 1, y: 1 }
        },
        async getClippingRect() {
          return new DOMRect(10, 10, 150, 150)
        }
      },
      middleware: [shift({ rootBoundary: 'document', padding: { right: 5 } })]
    })

    expect(result.x).toEqual(55)
    expect(result.y).toEqual(40)
  })

  it('can use document bounds when the reference is below the viewport', async () => {
    const extra = document.createElement('div')
    extra.style.height = '300vh'
    document.body.append(extra)
    try {
      const viewportHeight = document.documentElement.clientHeight
      const result = await computePosition(reference(120, viewportHeight + 30), floating, {
        placement: 'bottom',
        strategy: 'absolute',
        middleware: [shift({ boundary: 'document', rootBoundary: 'document', crossAxis: true })]
      })

      expect(result.y).toBeGreaterThan(viewportHeight)
    } finally {
      extra.remove()
    }
  })

  it('observes a scroll event inside a shadow root', async () => {
    const host = document.createElement('div')
    fixture.append(host)
    const root = host.attachShadow({ mode: 'open' })
    root.innerHTML = '<div><button type="button">Reference</button></div>'
    const anchor = root.querySelector('button')
    const update = jasmine.createSpy('update')
    const stop = autoUpdate(anchor, floating, update)
    try {
      anchor.parentElement.dispatchEvent(new Event('scroll'))
      await new Promise(resolve => {
        requestAnimationFrame(resolve)
      })
      expect(update.calls.count()).toBeGreaterThan(1)
    } finally {
      stop()
    }
  })

  it('stops observing a virtual reference when it is disposed', async () => {
    const update = jasmine.createSpy('update')
    const stop = autoUpdate({ ...reference(0, 0), nodeType: 1 }, floating, update)
    expect(update.calls.count()).toEqual(1)

    stop()
    window.dispatchEvent(new Event('resize'))
    await new Promise(resolve => {
      requestAnimationFrame(resolve)
    })
    expect(update.calls.count()).toEqual(1)
  })
})
