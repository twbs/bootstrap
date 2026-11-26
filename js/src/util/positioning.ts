/**
 * --------------------------------------------------------------------------
 * Bootstrap util/positioning.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import type { FloatingOffsetValue } from './floating-ui.js'

type Side = 'top' | 'right' | 'bottom' | 'left'
type Placement = Side | `${Side}-${'start' | 'end'}`
type Strategy = 'absolute' | 'fixed'
type Boundary = 'clippingAncestors' | 'viewport' | 'document' | Element | Element[] | Rect
type ReferenceElement = Element | {
  contextElement?: Element
  getBoundingClientRect(): DOMRect
  getClientRects?(): ArrayLike<DOMRect>
}
type Rect = { x: number, y: number, width: number, height: number }
type Insets = Record<Side, number>
type ElementRects = { reference: Rect, floating: Rect }
type Elements = { reference: ReferenceElement, floating: HTMLElement }
type OverflowOptions = {
  boundary?: Boundary
  rootBoundary?: 'viewport' | 'document' | Rect
  elementContext?: 'reference' | 'floating'
  altBoundary?: boolean
  padding?: number | Partial<Insets>
}
type MiddlewareState = {
  x: number
  y: number
  initialPlacement: Placement
  placement: Placement
  strategy: Strategy
  middlewareData: Record<string, any>
  rects: ElementRects
  elements: Elements
  platform: PositioningPlatform
}
type Middleware = {
  name: string
  options?: unknown
  fn(state: MiddlewareState): MiddlewareResult | Promise<MiddlewareResult>
}
type MiddlewareResult = {
  x?: number
  y?: number
  data?: object
  reset?: boolean | { placement?: Placement, rects?: true | ElementRects }
}
type PositioningPlatform = {
  getElementRects(args: Elements & { strategy: Strategy }): ElementRects | Promise<ElementRects>
  getClippingRect(args: { element: Element, boundary: Boundary, rootBoundary: NonNullable<OverflowOptions['rootBoundary']>, strategy: Strategy }): Rect | Promise<Rect>
  getDimensions(element: Element): Promise<{ width: number, height: number }> | { width: number, height: number }
  getOffsetParent(element: HTMLElement): Element | Window | null | Promise<Element | Window | null>
  getDocumentElement(element: Element): HTMLElement
  getClientRects(element: ReferenceElement): ArrayLike<DOMRect>
  isElement(value: unknown): value is Element
  isRTL(element: Element): boolean | Promise<boolean>
  getScale(element: Element | Window | null): Promise<{ x: number, y: number }> | { x: number, y: number }
  convertOffsetParentRelativeRectToViewportRelativeRect(args: { elements?: Elements, rect: Rect, offsetParent: Element | Window | null, strategy: Strategy }): Rect | Promise<Rect>
  detectOverflow?(state: MiddlewareState, options?: OverflowOptions): Promise<Insets>
}
type Derivable<T> = T | ((state: MiddlewareState) => T)
type ComputeOptions = {
  placement?: string
  strategy?: Strategy
  middleware?: (Middleware | null | undefined | false)[]
  platform?: Partial<PositioningPlatform>
}

const opposite: Record<Side, Side> = {
  top: 'bottom', left: 'right', bottom: 'top', right: 'left'
}
const sideOf = (placement: Placement) => placement.split('-')[0] as Side
const alignmentOf = (placement: Placement) => placement.split('-')[1]
const isVertical = (side: Side) => side === 'top' || side === 'bottom'
const resolve = <T>(option: Derivable<T>, state: MiddlewareState): T => typeof option === 'function' ?
  (option as (state: MiddlewareState) => T)(state) :
  option
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, high))
const elementNode = (value: unknown): value is Element => {
  const view = (value as Element | null)?.ownerDocument?.defaultView
  return Boolean(view && value instanceof view.Element)
}

const htmlElement = (element: Element): element is HTMLElement =>
  element instanceof (element.ownerDocument?.defaultView?.HTMLElement || HTMLElement)

const referenceNode = (value: ReferenceElement) => elementNode(value) ? value : value.contextElement
const clientRect = ({ x, y, width, height }: Rect) => ({
  x, y, width, height, left: x, top: y, right: x + width, bottom: y + height
})

function parentElement(element: Element): Element | null {
  return element.assignedSlot || element.parentElement || (element.getRootNode() as ShadowRoot).host || null
}

function containingBlock(element: Element): boolean {
  const style = getComputedStyle(element)
  return style.transform !== 'none' || style.translate !== 'none' || style.scale !== 'none' ||
    style.rotate !== 'none' || style.filter !== 'none' || style.backdropFilter !== 'none' ||
    style.perspective !== 'none' || /paint|layout|strict|content/.test(style.contain) ||
    /transform|perspective|filter/.test(style.willChange) || style.contentVisibility === 'auto'
}

function offsetParent(element: HTMLElement, strategy: Strategy): Element | Window {
  const { ownerDocument } = element
  if (element.matches(':popover-open, :modal')) {
    return ownerDocument.defaultView!
  }

  if (strategy === 'absolute' && elementNode(element.offsetParent)) {
    const parent = element.offsetParent
    if (parent !== ownerDocument.body || getComputedStyle(parent).position !== 'static' || containingBlock(parent)) {
      return parent
    }
  }

  for (let parent = parentElement(element); parent; parent = parentElement(parent)) {
    if (containingBlock(parent)) {
      return parent
    }
  }

  return ownerDocument.defaultView!
}

function dimensions(element: Element) {
  if (htmlElement(element)) {
    const { width, height } = getComputedStyle(element)
    const styledWidth = Number.parseFloat(width)
    const styledHeight = Number.parseFloat(height)
    return {
      width: Math.round(styledWidth) === element.offsetWidth ? styledWidth : element.offsetWidth,
      height: Math.round(styledHeight) === element.offsetHeight ? styledHeight : element.offsetHeight
    }
  }

  const { width, height } = element.getBoundingClientRect()
  return { width, height }
}

function scale(parent: Element | Window | null) {
  if (!elementNode(parent)) {
    return { x: 1, y: 1 }
  }

  const rect = parent.getBoundingClientRect()
  const size = dimensions(parent)
  return { x: rect.width / size.width || 1, y: rect.height / size.height || 1 }
}

function coordinateSpace(parent: Element | Window | null, strategy: Strategy, element: HTMLElement) {
  if (elementNode(parent)) {
    const box = parent.getBoundingClientRect()
    const factor = scale(parent)
    return {
      x: box.left + ((parent.clientLeft - parent.scrollLeft) * factor.x),
      y: box.top + ((parent.clientTop - parent.scrollTop) * factor.y),
      scaleX: factor.x, scaleY: factor.y
    }
  }

  const win = element.ownerDocument.defaultView!
  const fixed = strategy === 'fixed'
  return {
    x: fixed ? 0 : element.ownerDocument.documentElement.getBoundingClientRect().left,
    y: fixed ? 0 : -win.scrollY, scaleX: 1, scaleY: 1
  }
}

function rootClip(element: Element, boundary: NonNullable<OverflowOptions['rootBoundary']>): Rect {
  if (typeof boundary !== 'string') {
    return boundary
  }

  const doc = element.ownerDocument
  const win = doc.defaultView!
  const root = doc.documentElement
  if (boundary === 'document') {
    return {
      x: -win.scrollX, y: -win.scrollY,
      width: Math.max(root.scrollWidth, root.clientWidth), height: Math.max(root.scrollHeight, root.clientHeight)
    }
  }

  const viewport = win.visualViewport
  return {
    x: viewport?.offsetLeft ?? 0, y: viewport?.offsetTop ?? 0,
    width: viewport?.width ?? root.clientWidth, height: viewport?.height ?? root.clientHeight
  }
}

function clippingAncestors(element: Element, strategy: Strategy): Element[] {
  if (element.matches(':popover-open, :modal')) {
    return []
  }

  const { body, documentElement } = element.ownerDocument
  const ancestors: Element[] = []
  // Absolute and fixed boxes can escape overflow between them and their containing block.
  let parent = htmlElement(element) && strategy === getComputedStyle(element).position ?
    offsetParent(element, strategy) :
    parentElement(element)
  while (elementNode(parent) && parent !== body && parent !== documentElement) {
    if (/auto|scroll|hidden|clip|overlay/.test(getComputedStyle(parent).overflow)) {
      ancestors.push(parent)
    }

    parent = parentElement(parent)
  }

  return ancestors
}

function innerRect(element: Element): Rect {
  const box = element.getBoundingClientRect()
  const factor = scale(element)
  return {
    x: box.left + (element.clientLeft * factor.x), y: box.top + (element.clientTop * factor.y),
    width: element.clientWidth * factor.x, height: element.clientHeight * factor.y
  }
}

function clippingRect(element: Element, boundary: Boundary, rootBoundary: NonNullable<OverflowOptions['rootBoundary']>, strategy: Strategy): Rect {
  const clip = clientRect(rootClip(element, rootBoundary))
  const boundaries = boundary === 'clippingAncestors' ? clippingAncestors(element, strategy) : [boundary].flat()
  for (const limit of boundaries) {
    const rect = typeof limit === 'string' ? rootClip(element, limit) : (elementNode(limit) ? innerRect(limit) : limit)
    const box = clientRect(rect)
    clip.left = Math.max(clip.left, box.left)
    clip.top = Math.max(clip.top, box.top)
    clip.right = Math.min(clip.right, box.right)
    clip.bottom = Math.min(clip.bottom, box.bottom)
  }

  return {
    x: clip.left, y: clip.top, width: clip.right - clip.left, height: clip.bottom - clip.top
  }
}

function platformFor(strategy: Strategy): PositioningPlatform {
  return {
    async getElementRects({ reference, floating }) {
      const ref = reference.getBoundingClientRect()
      const space = coordinateSpace(await this.getOffsetParent(floating), strategy, floating)
      const size = await this.getDimensions(floating)
      return {
        reference: {
          x: (ref.left - space.x) / space.scaleX, y: (ref.top - space.y) / space.scaleY,
          width: ref.width / space.scaleX, height: ref.height / space.scaleY
        },
        floating: { x: 0, y: 0, ...size }
      }
    },
    getClippingRect: ({ element, boundary, rootBoundary, strategy }) => clippingRect(element, boundary, rootBoundary, strategy),
    getDimensions: dimensions,
    getOffsetParent: element => offsetParent(element, strategy),
    getDocumentElement: element => element.ownerDocument.documentElement,
    getClientRects: element => element.getClientRects?.() || [element.getBoundingClientRect()],
    isElement: elementNode,
    isRTL: element => getComputedStyle(element).direction === 'rtl',
    getScale: scale,
    convertOffsetParentRelativeRectToViewportRelativeRect({ elements, rect, offsetParent, strategy }) {
      if (!elements) {
        return rect
      }

      const space = coordinateSpace(offsetParent, strategy, elements.floating)
      return {
        x: space.x + (rect.x * space.scaleX), y: space.y + (rect.y * space.scaleY),
        width: rect.width * space.scaleX, height: rect.height * space.scaleY
      }
    },
    detectOverflow
  }
}

function placementCoordinates({ reference, floating }: { reference: Rect, floating: Pick<Rect, 'width' | 'height'> }, placement: Placement, rtl: boolean, gap = 0) {
  const side = sideOf(placement)
  const alignment = alignmentOf(placement)
  const vertical = isVertical(side)
  let x = reference.x + ((reference.width - floating.width) / 2)
  let y = reference.y + ((reference.height - floating.height) / 2)
  if (vertical) {
    y = side === 'top' ? reference.y - floating.height - gap : reference.y + reference.height + gap
    if (alignment) {
      x = reference.x + (alignment === (rtl ? 'end' : 'start') ? 0 : reference.width - floating.width)
    }
  } else {
    x = side === 'left' ? reference.x - floating.width - gap : reference.x + reference.width + gap
    if (alignment) {
      y = reference.y + (alignment === 'start' ? 0 : reference.height - floating.height)
    }
  }

  return { x, y }
}

async function computePosition(reference: ReferenceElement, floating: HTMLElement, options: ComputeOptions = {}) {
  const strategy = options.strategy || 'absolute'
  const initialPlacement = (options.placement || 'bottom') as Placement
  const platform = { ...platformFor(strategy), ...options.platform }
  const elements = { reference, floating }
  let rects = await platform.getElementRects({ ...elements, strategy })
  const rtl = await platform.isRTL(floating)
  let placement = initialPlacement
  let { x, y } = placementCoordinates(rects, placement, rtl)
  const middlewareData: MiddlewareState['middlewareData'] = {}
  const middleware = (options.middleware || []).filter(Boolean) as Middleware[]
  let resets = 0
  // Each step uses the previous result and can restart the sequence.
  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < middleware.length; index++) {
    const { name, fn } = middleware[index]
    const result = await fn({
      x, y, initialPlacement, placement, strategy, middlewareData, rects, elements, platform
    })
    x = result.x ?? x
    y = result.y ?? y
    const previousData = Object.hasOwn(middlewareData, name) ? middlewareData[name] : undefined
    Object.defineProperty(middlewareData, name, {
      value: { ...previousData, ...result.data },
      configurable: true,
      enumerable: true,
      writable: true
    })

    if (result.reset && resets++ < 50) {
      if (typeof result.reset !== 'boolean') {
        placement = result.reset.placement || placement
        if (result.reset.rects) {
          rects = result.reset.rects === true ? await platform.getElementRects({ ...elements, strategy }) : result.reset.rects
        }

        ({ x, y } = placementCoordinates(rects, placement, rtl))
      }

      index = -1
    }
  }

  /* eslint-enable no-await-in-loop */
  return {
    x, y, placement, strategy, middlewareData
  }
}

async function detectOverflow(state: MiddlewareState, options: OverflowOptions = {}): Promise<Insets> {
  const { platform, elements, rects, x, y, strategy } = state
  const { boundary = 'clippingAncestors', rootBoundary = 'viewport', elementContext = 'floating', altBoundary, padding = 0 } = options
  const relativeToReference = (elementContext === 'reference') !== Boolean(altBoundary)
  const element = relativeToReference ? referenceNode(elements.reference) || elements.floating : elements.floating
  const bounds = clientRect(await platform.getClippingRect({
    element, boundary, rootBoundary, strategy
  }))
  const rect = elementContext === 'reference' ? rects.reference : { ...rects.floating, x, y }
  const parent = await platform.getOffsetParent(elements.floating)
  const physical = clientRect(await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect, elements, offsetParent: parent, strategy
  }))
  const factor = await platform.getScale(parent)
  const inset = typeof padding === 'number' ?
    {
      top: padding, right: padding, bottom: padding, left: padding
    } :
    padding
  return {
    top: (bounds.top - physical.top + (inset.top || 0)) / factor.y,
    right: (physical.right - bounds.right + (inset.right || 0)) / factor.x,
    bottom: (physical.bottom - bounds.bottom + (inset.bottom || 0)) / factor.y,
    left: (bounds.left - physical.left + (inset.left || 0)) / factor.x
  }
}

function offset(options: Derivable<FloatingOffsetValue>): Middleware {
  return {
    name: 'offset', options,
    async fn(state) {
      const { x, y, placement, elements, platform, middlewareData } = state
      if (middlewareData.offset?.placement === placement && middlewareData.arrow?.alignmentOffset) {
        return {}
      }

      const value = resolve(options, state)
      const side = sideOf(placement)
      const alignment = alignmentOf(placement)
      const vertical = isVertical(side)
      const { mainAxis = 0, crossAxis = 0, alignmentAxis } = typeof value === 'number' ? { mainAxis: value } : value
      const distance = (side === 'top' || side === 'left' ? -1 : 1) * mainAxis
      const alignmentOffset = alignment && typeof alignmentAxis === 'number' ? alignmentAxis * (alignment === 'end' ? -1 : 1) : crossAxis
      const skid = vertical && await platform.isRTL(elements.floating) ? -alignmentOffset : alignmentOffset
      return {
        x: x + (vertical ? skid : distance), y: y + (vertical ? distance : skid),
        data: { x: vertical ? skid : distance, y: vertical ? distance : skid, placement }
      }
    }
  }
}

type FlipOptions = OverflowOptions & { fallbackPlacements?: Placement[] }

function oppositePlacements(placement: Placement): Placement[] {
  const side = sideOf(placement)
  const alignment = alignmentOf(placement)
  if (!alignment) {
    return [opposite[side]]
  }

  const reverse = alignment === 'start' ? 'end' : 'start'
  return [`${side}-${reverse}`, `${opposite[side]}-${alignment}`, `${opposite[side]}-${reverse}`] as Placement[]
}

function leadingCrossSide(placement: Placement, rects: ElementRects, rtl: boolean): Side {
  const vertical = isVertical(sideOf(placement))
  const alignment = alignmentOf(placement)
  const horizontalSide = alignment === (rtl ? 'end' : 'start') ? 'right' : 'left'
  const verticalSide = alignment === 'start' ? 'bottom' : 'top'
  const cross = vertical ? horizontalSide : verticalSide
  const length = vertical ? 'width' : 'height'
  return rects.reference[length] > rects.floating[length] ? opposite[cross] : cross
}

function flip(options: Derivable<FlipOptions> = {}): Middleware {
  return {
    name: 'flip', options,
    async fn(state) {
      const { initialPlacement, placement, middlewareData, rects, elements, platform } = state
      if (middlewareData.flip?.done || middlewareData.arrow?.alignmentOffset) {
        return {}
      }

      const config = resolve(options, state)
      const placements = [initialPlacement, ...(config.fallbackPlacements || oppositePlacements(initialPlacement))]
      const overflow = await (platform.detectOverflow?.(state, config) || detectOverflow(state, config))
      const side = sideOf(placement)
      const cross = leadingCrossSide(placement, rects, await platform.isRTL(elements.floating))

      const amounts = [overflow[side], overflow[cross], overflow[opposite[cross]]]
      if (amounts.every(amount => amount <= 0)) {
        return { data: { done: true } }
      }

      const history = [...(middlewareData.flip?.overflows || []), { placement, overflows: amounts }] as { placement: Placement, overflows: number[] }[]
      const index = (middlewareData.flip?.index || 0) + 1
      if (index < placements.length) {
        return { data: { index, overflows: history }, reset: { placement: placements[index] } }
      }

      const axisFits = history.filter(attempt => attempt.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])
      const cost = (attempt: typeof history[number]) => attempt.overflows.reduce((sum, value) => sum + Math.max(value, 0), 0)
      const best = axisFits[0] || history.sort((a, b) => cost(a) - cost(b))[0]
      return { data: { index, overflows: history, done: true }, reset: best.placement === placement ? undefined : { placement: best.placement } }
    }
  }
}

type ShiftOptions = OverflowOptions & { mainAxis?: boolean, crossAxis?: boolean }

function shift(options: Derivable<ShiftOptions> = {}): Middleware {
  return {
    name: 'shift', options,
    async fn(state) {
      const config = resolve(options, state)
      const overflow = await (state.platform.detectOverflow?.(state, config) || detectOverflow(state, config))
      const vertical = isVertical(sideOf(state.placement))
      const enableX = vertical ? config.mainAxis !== false : Boolean(config.crossAxis)
      const enableY = vertical ? Boolean(config.crossAxis) : config.mainAxis !== false
      const x = enableX ? clamp(state.x, state.x + overflow.left, state.x - overflow.right) : state.x
      const y = enableY ? clamp(state.y, state.y + overflow.top, state.y - overflow.bottom) : state.y
      return { x, y, data: { x: x - state.x, y: y - state.y, enabled: { x: enableX, y: enableY } } }
    }
  }
}

type SizeOptions = OverflowOptions & {
  apply?: (state: MiddlewareState & { availableWidth: number, availableHeight: number }) => void | Promise<void>
}

function size(options: Derivable<SizeOptions> = {}): Middleware {
  return {
    name: 'size', options,
    async fn(state) {
      const config = resolve(options, state)
      const { elements, placement, platform, rects, middlewareData } = state
      const overflow = await (platform.detectOverflow?.(state, config) || detectOverflow(state, config))
      const side = sideOf(placement)
      const alignment = alignmentOf(placement)
      const vertical = isVertical(side)
      const rtl = await platform.isRTL(elements.floating)
      const widthLimit = rects.floating.width - overflow.left - overflow.right
      const heightLimit = rects.floating.height - overflow.top - overflow.bottom
      const widthSide = vertical ? (alignment === (rtl ? 'end' : 'start') ? 'right' : 'left') : side
      const heightSide = vertical ? side : (alignment === 'start' ? 'bottom' : 'top')
      const availableWidth = middlewareData.shift?.enabled?.x ? widthLimit : Math.min(widthLimit, rects.floating.width - overflow[widthSide])
      const availableHeight = middlewareData.shift?.enabled?.y ? heightLimit : Math.min(heightLimit, rects.floating.height - overflow[heightSide])
      await config.apply?.({ ...state, availableWidth, availableHeight })
      const next = await platform.getDimensions(elements.floating)
      if (next.width !== rects.floating.width || next.height !== rects.floating.height) {
        return { reset: { rects: true } }
      }

      return {}
    }
  }
}

function arrow(options: { element: HTMLElement, padding?: number | Partial<Insets> }): Middleware {
  return {
    name: 'arrow', options,
    async fn(state) {
      const vertical = isVertical(sideOf(state.placement))
      const axis = vertical ? 'x' : 'y'
      const length = vertical ? 'width' : 'height'
      const { element, padding = 0 } = options
      const arrowDimensions = await state.platform.getDimensions(element)
      const size = arrowDimensions[length]
      const parent = await state.platform.getOffsetParent(element)
      const { floating } = state.elements
      const edge = elementNode(parent) ? parent : floating
      const available = (vertical ? edge.clientWidth : edge.clientHeight) || state.rects.floating[length]
      const paddingLimit = ((available - size) / 2) - 1
      const start = Math.min(paddingLimit, typeof padding === 'number' ? padding : (vertical ? padding.left : padding.top) || 0)
      const end = Math.min(paddingLimit, typeof padding === 'number' ? padding : (vertical ? padding.right : padding.bottom) || 0)
      const referenceSize = state.rects.reference[length]
      const center = state.rects.reference[axis] - state[axis] + ((referenceSize - size + available - state.rects.floating[length]) / 2)
      const position = clamp(center, start, available - size - end)
      // On an aligned side, move the box if a small reference would miss the arrow.
      const difference = center - position
      const edgePadding = center < start ? start : end
      if (!state.middlewareData.arrow && alignmentOf(state.placement) && difference && referenceSize < size + (2 * edgePadding)) {
        return {
          [axis]: state[axis] + difference,
          data: { [axis]: position, centerOffset: 0, alignmentOffset: difference },
          reset: true
        }
      }

      return { data: { [axis]: position, centerOffset: difference } }
    }
  }
}

function autoUpdate(reference: ReferenceElement, floating: HTMLElement, update: () => unknown): () => void {
  const root = floating.ownerDocument
  const win = root.defaultView!
  let frame = 0
  let stopped = false
  let observer: IntersectionObserver | undefined
  const schedule = () => {
    if (!stopped && !frame) {
      frame = win.requestAnimationFrame(() => {
        frame = 0
        update()
        watchMovement()
      })
    }
  }

  const anchor = referenceNode(reference)
  let previous: DOMRect | undefined
  const watchMovement = () => {
    if (!anchor || !win.IntersectionObserver) {
      return
    }

    const next = anchor.getBoundingClientRect()
    if (previous && next.x === previous.x && next.y === previous.y && next.width === previous.width && next.height === previous.height) {
      return
    }

    previous = next
    observer?.disconnect()
    if (!next.width || !next.height) {
      return
    }

    const viewport = root.documentElement
    const margins = [-next.top, next.right - viewport.clientWidth, next.bottom - viewport.clientHeight, -next.left]
    observer = new win.IntersectionObserver(([entry]) => {
      const current = entry.boundingClientRect
      if (current.x !== next.x || current.y !== next.y || current.width !== next.width || current.height !== next.height) {
        schedule()
      }
    }, { rootMargin: margins.map(value => `${Math.floor(value)}px`).join(' '), threshold: [0, 1] })
    observer.observe(anchor)
  }

  const scrollTargets = new Set<EventTarget>([win])
  for (let target of [anchor, floating]) {
    while (target) {
      const tree = target.getRootNode?.() as ShadowRoot | undefined
      if (!tree?.host) {
        break
      }

      // Scroll events do not cross a shadow boundary.
      scrollTargets.add(tree)
      target = tree.host
    }
  }

  for (const target of scrollTargets) {
    target.addEventListener('scroll', schedule, { passive: true, capture: true })
  }

  win.addEventListener('resize', schedule)
  win.visualViewport?.addEventListener('scroll', schedule)
  win.visualViewport?.addEventListener('resize', schedule)
  const resize = new win.ResizeObserver(schedule)
  resize.observe(floating)
  if (anchor) {
    resize.observe(anchor)
  }

  watchMovement()
  update()
  return () => {
    stopped = true
    win.cancelAnimationFrame(frame)
    for (const target of scrollTargets) {
      target.removeEventListener('scroll', schedule, true)
    }

    win.removeEventListener('resize', schedule)
    win.visualViewport?.removeEventListener('scroll', schedule)
    win.visualViewport?.removeEventListener('resize', schedule)
    observer?.disconnect()
    resize.disconnect()
  }
}

export {
  arrow, autoUpdate, computePosition, detectOverflow, flip, offset, placementCoordinates, shift, size
}
export type {
  Boundary, ComputeOptions, Middleware, MiddlewareState, Placement, ReferenceElement, Strategy
}
