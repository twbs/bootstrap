/**
 * --------------------------------------------------------------------------
 * Bootstrap util/anchor-positioning.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { autoUpdate, placementCoordinates, type Placement } from './positioning.js'

const supportsAnchors = globalThis.CSS?.supports('anchor-name', '--bs-probe') &&
  CSS.supports('position-anchor', '--bs-probe') &&
  CSS.supports('position-area', 'top') &&
  CSS.supports('left', 'max(0px, calc(2 * anchor(center) - 100%))') &&
  CSS.supports('position-try-fallbacks', '--bs-overlay-top')

let nextAnchorId = 0
const visibilitySupport = new WeakMap<Document, boolean>()

function supportsVisibleFallbacks(doc: Document) {
  const cached = visibilitySupport.get(doc)
  if (cached !== undefined) {
    return cached
  }

  const anchor = doc.createElement('div')
  const tip = doc.createElement('div')
  const name = '--bs-overlay-visibility-probe'
  anchor.style.cssText = `position:fixed;inset:50% auto auto 50%;width:1px;height:1px;visibility:hidden;anchor-name:${name}`
  tip.className = 'tooltip tooltip-instant'
  tip.dataset.bsAnchorPosition = 'viewport'
  tip.style.cssText = `position:fixed;inset:50%;width:8px;height:8px;visibility:hidden;position-anchor:${name};position-try-fallbacks:--bs-overlay-top`

  // Some engines accept named tries but keep the opacity from the first layout.
  doc.body.append(anchor, tip)
  const actual = tip.getBoundingClientRect()
  const expected = anchor.getBoundingClientRect().top - actual.height - 6
  tip.classList.add('show')
  const visible = Math.abs(actual.top - expected) < 1 && Number(doc.defaultView!.getComputedStyle(tip).opacity) > 0
  tip.remove()
  anchor.remove()
  visibilitySupport.set(doc, visible)
  return visible
}

function canAnchor(reference: HTMLElement) {
  return supportsAnchors && reference.getRootNode() === reference.ownerDocument &&
    !reference.style.getPropertyValue('anchor-name') &&
    getComputedStyle(reference).getPropertyValue?.('anchor-name') === 'none'
}

function getBox(floating: HTMLElement, scales: boolean) {
  const box = floating.getBoundingClientRect()
  if (!scales) {
    return box
  }

  // Remove the scale from the measured box during the fade.
  const { transform, transformOrigin } = getComputedStyle(floating)
  if (transform === 'none') {
    return box
  }

  const matrix = new DOMMatrixReadOnly(transform)
  if (!matrix.is2D || matrix.b || matrix.c || matrix.e || matrix.f || matrix.a <= 0 || matrix.d <= 0) {
    return null
  }

  const [originX, originY] = transformOrigin.split(' ').map(Number.parseFloat)
  return {
    left: box.left - (originX * (1 - matrix.a)),
    top: box.top - (originY * (1 - matrix.d)),
    width: box.width / matrix.a,
    height: box.height / matrix.d
  }
}

function aimArrow(arrow: HTMLElement, floating: HTMLElement, side: Placement, anchor: DOMRect, box: Pick<DOMRect, 'left' | 'top'>) {
  const vertical = side === 'top' || side === 'bottom'
  const center = vertical ?
    anchor.left + (anchor.width / 2) - box.left - floating.clientLeft :
    anchor.top + (anchor.height / 2) - box.top - floating.clientTop
  const arrowSize = vertical ? arrow.offsetWidth : arrow.offsetHeight
  const edgeSize = vertical ? floating.clientWidth : floating.clientHeight
  const start = Math.max(0, Math.min(center - (arrowSize / 2), edgeSize - arrowSize))
  arrow.style.left = vertical ? `${start}px` : ''
  arrow.style.top = vertical ? '' : `${start}px`
}

type AnchorOptions = {
  candidates: Placement[]
  gap: number
  arrow?: HTMLElement | null
  scales?: boolean
  padding?: number
  fallback: () => void
  onPlacement?: (placement: Placement) => void
  onUpdate?: () => void
}

function startAnchoring(reference: HTMLElement, floating: HTMLElement, {
  candidates, gap, arrow, scales = false, padding = 0, fallback, onPlacement, onUpdate
}: AnchorOptions) {
  const doc = reference.ownerDocument
  if (floating.ownerDocument !== doc || !supportsVisibleFallbacks(doc)) {
    return null
  }

  const root = doc.documentElement
  const win = doc.defaultView!
  const rtl = getComputedStyle(floating).direction === 'rtl'
  const name = `--bs-anchor-${++nextAnchorId}`
  const properties = ['position', 'top', 'right', 'bottom', 'left', 'position-anchor', 'position-try-fallbacks', '--bs-anchor-gap']
  const previousStyles = properties.map(property => [property, floating.style.getPropertyValue(property), floating.style.getPropertyPriority(property)] as const)
  reference.style.setProperty('anchor-name', name)
  floating.setAttribute('data-bs-anchor-position', '')
  floating.style.setProperty('position', 'fixed')
  floating.style.setProperty('inset', '50%')
  floating.style.setProperty('position-anchor', name)
  floating.style.setProperty('--bs-anchor-gap', `${gap}px`)
  floating.style.setProperty('position-try-fallbacks', candidates.map(option => `--bs-overlay-${option}`).join(', '))

  let usingAnchors = true
  const clear = () => {
    if (!usingAnchors) {
      return
    }

    usingAnchors = false
    if (reference.style.getPropertyValue('anchor-name') === name) {
      reference.style.removeProperty('anchor-name')
    }

    floating.removeAttribute('data-bs-anchor-position')
    for (const [property, value, priority] of previousStyles) {
      floating.style.setProperty(property, value, priority)
    }
  }

  const update = () => {
    if (win.visualViewport && win.visualViewport.scale !== 1) {
      return false
    }

    const anchor = reference.getBoundingClientRect()
    const box = getBox(floating, scales)
    if (!box) {
      return false
    }

    const edge = padding - 0.1
    const right = root.clientWidth - edge
    const bottom = root.clientHeight - edge
    const rects = { reference: anchor, floating: box }
    // Confirm the first placement that fits without shifting.
    for (const placement of candidates) {
      const { x, y } = placementCoordinates(rects, placement, rtl, gap)
      if (!(x >= edge && y >= edge && x + box.width <= right && y + box.height <= bottom)) {
        continue
      }

      if (Math.abs(x - box.left) > 1 || Math.abs(y - box.top) > 1) {
        return false
      }

      if (floating.dataset.bsPlacement !== placement) {
        floating.dataset.bsPlacement = placement
      }

      onPlacement?.(placement)
      if (arrow) {
        aimArrow(arrow, floating, placement, anchor, box)
      }

      return true
    }

    return false
  }

  if (!update()) {
    clear()
    return null
  }

  let frame: number | null = null
  const run = () => {
    onUpdate?.()
    if (usingAnchors && update()) {
      return
    }

    clear()
    fallback()
  }

  const schedule = () => {
    frame ??= win.requestAnimationFrame(() => {
      frame = null
      run()
    })
  }

  const stop = autoUpdate(reference, floating, run)
  return {
    schedule,
    dispose() {
      stop()
      if (frame !== null) {
        win.cancelAnimationFrame(frame)
      }

      clear()
    }
  }
}

function hasClippingAncestor(element: HTMLElement) {
  for (let parent = element.parentElement; parent && parent !== element.ownerDocument.body; parent = parent.parentElement) {
    const { overflow, transform, filter, contain } = getComputedStyle(parent)
    if (overflow !== 'visible' || transform !== 'none' || filter !== 'none' || contain !== 'none') {
      return true
    }
  }

  return false
}

export { canAnchor, hasClippingAncestor, startAnchoring }
