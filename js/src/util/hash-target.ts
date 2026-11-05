/**
 * --------------------------------------------------------------------------
 * Bootstrap util/hash-target.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler.js'

/**
 * Constants
 */

const ATTR_HASH = 'data-bs-hash'

type HashTargetHandler = {
  /** Return true when this component should open the hashed element. */
  matches: (element: HTMLElement) => boolean
  /**
   * Optional visible anchor to scroll before opening (usually the trigger).
   * Closed collapses and inactive tab panes use `display: none`, so they cannot
   * be scrolled to until after they open.
   */
  getAnchor?: (element: HTMLElement) => HTMLElement | null
  /**
   * Open the target. Call `done` after the open animation finishes,
   * or immediately when the target is already open.
   */
  open: (element: HTMLElement, done: () => void) => void
}

/**
 * Decode a URL fragment id, tolerating malformed escapes (returns it as-is).
 */
const decodeFragment = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Resolve the element named by `location.hash` when it opts in with `data-bs-hash`.
 */
const getHashTarget = (): HTMLElement | null => {
  const { hash } = window.location
  if (!hash || hash === '#') {
    return null
  }

  const id = decodeFragment(hash.slice(1))
  if (!id) {
    return null
  }

  const element = document.getElementById(id)
  if (!element?.hasAttribute(ATTR_HASH)) {
    return null
  }

  return element
}

/**
 * Open an opted-in hash target on `load` and `hashchange`.
 * Put `data-bs-hash` on the collapse or tab pane that the URL fragment names.
 *
 * Scrolls a visible anchor first when one exists, then opens the target, then
 * scrolls the target into view after it is shown.
 */
const enableHashTarget = (namespace: string, handler: HashTargetHandler): void => {
  const onHash = (): void => {
    const element = getHashTarget()
    if (!element || !handler.matches(element)) {
      return
    }

    const anchor = handler.getAnchor?.(element)
    if (anchor) {
      anchor.scrollIntoView()
    }

    handler.open(element, () => {
      element.scrollIntoView()
    })
  }

  EventHandler.on(window, `load${namespace}`, onHash)
  EventHandler.on(window, `hashchange${namespace}`, onHash)
}

export {
  ATTR_HASH,
  decodeFragment,
  enableHashTarget,
  getHashTarget
}
export type { HashTargetHandler }
