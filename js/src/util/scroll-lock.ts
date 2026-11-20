/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scroll-lock.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import SelectorEngine from '../dom/selector-engine.js'

const CLASS_NAME_OPEN = 'dialog-open'
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed'

const owners = new Set<HTMLDialogElement>()
let restore: (() => void) | null = null

type StyleChange = {
  element: HTMLElement
  property: string
  value: string
  priority: string
  adjustedValue: string
}

const getStyleChange = (element: HTMLElement, property: string, offset: number): StyleChange => {
  const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0
  return {
    element,
    property,
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
    adjustedValue: `${value + offset}px`
  }
}

const releaseUnusedLock = (): void => {
  // A removed or natively closed dialog must not keep a later lock alive.
  for (const owner of owners) {
    if (!owner.isConnected || !owner.open) {
      owners.delete(owner)
    }
  }

  if (owners.size === 0 && restore) {
    restore()
    restore = null
  }
}

const lockScroll = (owner: HTMLDialogElement): void => {
  releaseUnusedLock()
  if (owners.has(owner)) {
    return
  }

  owners.add(owner)
  if (owners.size > 1) {
    return
  }

  const root = document.documentElement
  const alreadyLocked = root.classList.contains(CLASS_NAME_OPEN)
  const initialWidth = root.offsetWidth
  const viewportWidth = root.clientWidth
  const initialLeft = root.getBoundingClientRect().left + root.clientLeft + window.scrollX
  const changes: StyleChange[] = []
  const fixed = SelectorEngine.find(SELECTOR_FIXED_CONTENT)
    .filter(element => !element.closest('dialog') && getComputedStyle(element).position === 'fixed' &&
      element.clientWidth >= viewportWidth)
    .map(element => ({ element, width: element.offsetWidth }))

  root.classList.add(CLASS_NAME_OPEN)

  // Use layout boxes: clientWidth can grow even when an application-owned
  // stable gutter still reserves space in the root's box.
  const width = Math.max(0, root.offsetWidth - initialWidth)
  const lockedLeft = root.getBoundingClientRect().left + root.clientLeft + window.scrollX
  // RTL scrollbars can be on either side, depending on the browser and OS.
  const side = initialLeft > lockedLeft ? 'left' : 'right'
  const fixedChanges = fixed.map(item => ({
    element: item.element,
    width: Math.max(0, item.element.offsetWidth - item.width)
  }))

  // Finish geometry reads before applying spacing to avoid repeated layouts.
  if (width > 0) {
    changes.push(getStyleChange(root, `padding-${side}`, width))
  }

  // Normal-flow and sticky content follow the root padding. Full-width fixed
  // content uses the viewport instead; compensate only its actual expansion.
  for (const item of fixedChanges) {
    if (item.width > 0) {
      changes.push(getStyleChange(item.element, `margin-${side}`, item.width))
    }
  }

  for (const { element, property, adjustedValue } of changes) {
    element.style.setProperty(property, adjustedValue, 'important')
  }

  restore = () => {
    for (const { element, property, value, priority } of changes) {
      if (value) {
        element.style.setProperty(property, value, priority)
      } else {
        element.style.removeProperty(property)
      }
    }

    if (!alreadyLocked) {
      root.classList.remove(CLASS_NAME_OPEN)
    }
  }
}

const unlockScroll = (owner: HTMLDialogElement): void => {
  owners.delete(owner)
  releaseUnusedLock()
}

export { lockScroll, unlockScroll }
