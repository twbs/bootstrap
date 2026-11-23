/**
 * --------------------------------------------------------------------------
 * Bootstrap util/anchor-positioning.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { autoUpdate, type Placement } from './positioning.js'

const supportsAnchors = globalThis.CSS?.supports('anchor-name', '--bs-probe') &&
  CSS.supports('position-anchor', '--bs-probe') &&
  CSS.supports('position-area', 'top') &&
  CSS.supports('left', 'max(0px, calc(2 * anchor(center) - 100%))') &&
  CSS.supports('position-try-fallbacks', '--bs-overlay-top')

let nextAnchorId = 0
const visibilitySupport = new WeakMap<Document, boolean>()

function supportsVisibleFallbacks(doc: Document) {
  if (visibilitySupport.has(doc)) {
    return visibilitySupport.get(doc)!
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
  const [originX, originY] = transformOrigin.split(' ').map(Number.parseFloat)
  return {
    left: box.left - (originX * (1 - matrix.a)),
    top: box.top - (originY * (1 - matrix.d)),
    width: box.width / matrix.a,
    height: box.height / matrix.d
  }
}

function expectedBox(placement: Placement, anchor: DOMRect, box: Pick<DOMRect, 'width' | 'height'>, gap: number, rtl: boolean) {
  const [side, alignment] = placement.split('-')
  const vertical = side === 'top' || side === 'bottom'
  let left = anchor.left + ((anchor.width - box.width) / 2)
  let top = anchor.top + ((anchor.height - box.height) / 2)

  if (vertical) {
    top = side === 'top' ? anchor.top - box.height - gap : anchor.bottom + gap
    if (alignment) {
      const alignLeft = alignment === (rtl ? 'end' : 'start')
      left = alignLeft ? anchor.left : anchor.right - box.width
    }
  } else {
    left = side === 'left' ? anchor.left - box.width - gap : anchor.right + gap
  }

  return { left, top }
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
  if (!supportsVisibleFallbacks(doc)) {
    return null
  }

  const root = doc.documentElement
  const win = doc.defaultView!
  const rtl = getComputedStyle(floating).direction === 'rtl'
  const name = `--bs-anchor-${++nextAnchorId}`
  const properties = ['position', 'top', 'right', 'bottom', 'left', 'position-anchor', 'position-try-fallbacks', '--bs-anchor-gap']
  const previousStyles = properties.map(property => [property, floating.style.getPropertyValue(property), floating.style.getPropertyPriority(property)] as const)
  reference.style.setProperty('anchor-name', name)
  floating.dataset.bsAnchorPosition = floating.closest('dialog[open]') ? 'dialog' : 'viewport'
  floating.style.setProperty('position', 'fixed')
  floating.style.setProperty('inset', '50%')
  floating.style.setProperty('position-anchor', name)
  floating.style.setProperty('--bs-anchor-gap', `${gap}px`)
  floating.style.setProperty('position-try-fallbacks', candidates.map(option => `--bs-overlay-${option}`).join(', '))

  const clear = () => {
    if (!floating.hasAttribute('data-bs-anchor-position')) {
      return
    }

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
    // Match the first candidate that fits without shifting.
    const placement = candidates.find(candidate => {
      const { left, top } = expectedBox(candidate, anchor, box, gap, rtl)
      return left >= padding - 0.1 && top >= padding - 0.1 &&
        left + box.width <= root.clientWidth - padding + 0.1 && top + box.height <= root.clientHeight - padding + 0.1
    })
    if (!placement) {
      return false
    }

    const { left, top } = expectedBox(placement, anchor, box, gap, rtl)
    if (Math.abs(left - box.left) > 1 || Math.abs(top - box.top) > 1) {
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

  if (!update()) {
    clear()
    return null
  }

  let frame: number | null = null
  let usingAnchors = true
  const run = () => {
    onUpdate?.()
    if (usingAnchors && update()) {
      return
    }

    usingAnchors = false
    clear()
    fallback()
  }

  const schedule = () => {
    frame ??= requestAnimationFrame(() => {
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
        cancelAnimationFrame(frame)
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
