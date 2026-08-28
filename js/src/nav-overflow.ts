/**
 * --------------------------------------------------------------------------
 * Bootstrap nav-overflow.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import Menu from './menu.js'
import { DefaultIconAllowlist, sanitizeHtml } from './util/sanitizer.js'

/**
 * Constants
 */

const NAME = 'navoverflow'
const DATA_KEY = 'bs.navoverflow'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_UPDATE = `update${EVENT_KEY}`
const EVENT_OVERFLOW = `overflow${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`

const CLASS_NAME_OVERFLOW = 'nav-overflow'
const CLASS_NAME_OVERFLOW_MENU = 'nav-overflow-menu'
const CLASS_NAME_HIDDEN = 'd-none'
const CLASS_NAME_KEEP = 'nav-overflow-keep'
const CLASS_NAME_SUBMENU = 'submenu'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_NAV = '.nav'
const SELECTOR_NAV_ITEM = '.nav-item'
const SELECTOR_NAV_LINK = '.nav-link'
const SELECTOR_OVERFLOW_TOGGLE = '.nav-overflow-toggle'
const SELECTOR_OVERFLOW_MENU = '.nav-overflow-menu'
const SELECTOR_CUSTOM_ICON = '[data-bs-overflow-icon]'
const SELECTOR_MENU = '.menu'
const SELECTOR_MENU_TOGGLE = '[data-bs-toggle="menu"]'

type NavOverflowConfig = {
  collapseBelow: number | string
  iconPlacement: string
  menuPlacement: string
  moreText: string | false
  moreIcon: string
  threshold: number
}

// Also names an icon-only toggle, which has no text to name it
const DEFAULT_TEXT = 'More'

const Default: NavOverflowConfig = {
  collapseBelow: 0,
  iconPlacement: 'start',
  menuPlacement: 'bottom-end',
  moreText: DEFAULT_TEXT,
  moreIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/></svg>',
  threshold: 0 // Minimum items to keep visible before showing overflow
}

const DefaultType = {
  collapseBelow: '(number|string)',
  iconPlacement: 'string',
  menuPlacement: 'string',
  moreText: '(string|boolean)',
  moreIcon: 'string',
  threshold: 'number'
}

/**
 * Class definition
 */

class NavOverflow extends BaseComponent {
  protected declare _config: NavOverflowConfig
  protected declare _nav: HTMLElement
  protected declare _items: HTMLElement[]
  protected declare _overflowItems: HTMLElement[]
  protected declare _overflowMenu: HTMLElement | null
  protected declare _overflowToggle: HTMLElement | null
  protected declare _resizeObserver: ResizeObserver | null
  protected declare _resizeHandler: (() => void) | null
  protected declare _collapseBelow: number
  protected declare _relocatedMenus: Map<HTMLElement, { menu: HTMLElement, parent: Node, nextSibling: ChildNode | null }>

  constructor(element?: string | Element | null, config?: Partial<NavOverflowConfig> | null) {
    super(element, config)

    const nav = SelectorEngine.findOne(SELECTOR_NAV, this._element)

    if (!nav) {
      throw new TypeError(`${this._element.outerHTML} has no child ${SELECTOR_NAV} to collapse`)
    }

    this._nav = nav
    this._items = []
    this._overflowItems = []
    this._overflowMenu = null
    this._overflowToggle = null
    this._resizeObserver = null
    this._resizeHandler = null
    this._collapseBelow = 0
    this._relocatedMenus = new Map()

    this._init()
  }

  // Getters
  static override get Default(): NavOverflowConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  update(): void {
    this._calculateOverflow()
    EventHandler.trigger(this._element, EVENT_UPDATE)
  }

  override dispose(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }

    // Remove this instance's fallback resize listener from window
    if (this._resizeHandler) {
      EventHandler.off(window, EVENT_RESIZE, this._resizeHandler)
    }

    // Move items back to original positions
    this._restoreItems()

    // Remove overflow menu
    if (this._overflowToggle && this._overflowToggle.parentElement) {
      this._overflowToggle.parentElement.remove()
    }

    super.dispose()
  }

  // Private
  protected _init(): void {
    // Mark the wrapper so its nav stops wrapping and starts collapsing
    this._element.classList.add(CLASS_NAME_OVERFLOW)

    // Get all nav items, minus a toggle the author already wrote
    this._items = SelectorEngine.find(SELECTOR_NAV_ITEM, this._nav)
      .filter(item => !item.querySelector(SELECTOR_OVERFLOW_TOGGLE))

    // Store original order data
    for (const [index, item] of this._items.entries()) {
      item.dataset.bsNavOrder = index as any
    }

    // Resolve collapseBelow threshold once
    this._collapseBelow = this._resolveCollapseBelow()

    // Create overflow menu if it doesn't exist
    this._createOverflowMenu()

    // Setup resize observer
    this._setupResizeObserver()

    // Initial calculation
    this._calculateOverflow()
  }

  protected _createOverflowMenu(): void {
    // Check if overflow menu already exists
    this._overflowToggle = SelectorEngine.findOne(SELECTOR_OVERFLOW_TOGGLE, this._element)

    if (this._overflowToggle) {
      this._overflowMenu = SelectorEngine.findOne(SELECTOR_OVERFLOW_MENU, this._element)
      return
    }

    // Build with DOM APIs instead of string templates so user-supplied
    // moreText / menuPlacement / moreIcon cannot break out of their slots.
    const { moreText } = this._config
    const label = typeof moreText === 'string' ? moreText : ''

    const overflowItem = document.createElement('li')
    overflowItem.className = 'nav-item nav-overflow-item'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'nav-link nav-overflow-toggle'
    button.setAttribute('data-bs-toggle', 'menu')
    button.setAttribute('data-bs-placement', this._config.menuPlacement)
    button.setAttribute('aria-expanded', 'false')

    // An icon-only toggle still needs a name. Fall back to the default text,
    // and let authors who need another one write their own toggle.
    if (label === '') {
      button.setAttribute('aria-label', DEFAULT_TEXT)
    }

    const iconSpan = document.createElement('span')
    iconSpan.className = 'nav-overflow-icon'
    iconSpan.innerHTML = sanitizeHtml(this._resolveIcon(), DefaultIconAllowlist)

    if (label === '') {
      button.append(iconSpan)
    } else {
      const textSpan = document.createElement('span')
      textSpan.className = 'nav-overflow-text'
      textSpan.textContent = label

      if (this._config.iconPlacement === 'end') {
        button.append(textSpan, iconSpan)
      } else {
        button.append(iconSpan, textSpan)
      }
    }

    const menu = document.createElement('div')
    menu.className = `${CLASS_NAME_OVERFLOW_MENU} menu`

    overflowItem.append(button, menu)
    this._nav.append(overflowItem)

    this._overflowToggle = button
    this._overflowMenu = menu
  }

  protected _resolveIcon(): string {
    const customIconElement = SelectorEngine.findOne(SELECTOR_CUSTOM_ICON, this._element)

    if (!customIconElement) {
      return this._config.moreIcon
    }

    const iconClone = customIconElement.cloneNode(true) as HTMLElement
    iconClone.removeAttribute('data-bs-overflow-icon')
    const iconHtml = iconClone.outerHTML

    customIconElement.remove()

    // Returned HTML is sanitized in `_createOverflowMenu` before insertion.
    return iconHtml
  }

  protected _resolveCollapseBelow(): number {
    const value = this._config.collapseBelow

    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string' && value !== '') {
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue(`--bs-breakpoint-${value}`)
      return Number.parseFloat(cssValue) || 0
    }

    return 0
  }

  protected _setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') {
      // Fallback for older browsers. Keep a per-instance handler so dispose()
      // removes only this instance's window listener, not every instance's.
      this._resizeHandler = () => this._calculateOverflow()
      EventHandler.on(window, EVENT_RESIZE, this._resizeHandler)
      return
    }

    // Observe the wrapper, never the nav. Collapsing items changes the nav's
    // width, so observing the nav would feed this component's own output back
    // in as its input and loop forever.
    this._resizeObserver = new ResizeObserver(() => {
      this._calculateOverflow()
    })

    this._resizeObserver.observe(this._element)
  }

  // Space the nav has to work with, taken from the wrapper's content box
  protected _availableWidth(): number {
    const { paddingInlineStart, paddingInlineEnd } = getComputedStyle(this._element)
    const padding = (Number.parseFloat(paddingInlineStart) || 0) + (Number.parseFloat(paddingInlineEnd) || 0)

    return this._element.clientWidth - padding
  }

  protected _navGap(): number {
    return Number.parseFloat(getComputedStyle(this._nav).columnGap) || 0
  }

  protected _calculateOverflow(): void {
    // Measure with every item shown, so widths never depend on the last pass.
    // Restoring and re-collapsing within one callback is a net-zero change, so
    // it does not notify the observer again.
    this._restoreItems()

    const availableWidth = this._availableWidth()
    const overflowItem = this._overflowToggle?.closest<HTMLElement>(SELECTOR_NAV_ITEM) ?? null
    const candidates = this._items.filter(item => !item.classList.contains(CLASS_NAME_KEEP))

    // Below the collapseBelow threshold, everything goes into the menu
    if (this._collapseBelow > 0 && availableWidth < this._collapseBelow) {
      this._applyOverflow(candidates, overflowItem)
      return
    }

    const gap = this._navGap()

    // Keep items and the toggle are always visible, so their widths come off
    // the space left for the rest
    const keepWidth = this._items
      .filter(item => item.classList.contains(CLASS_NAME_KEEP))
      .reduce((sum, item) => sum + item.offsetWidth + gap, 0)
    const overflowWidth = overflowItem ? overflowItem.offsetWidth + gap : 0
    const limit = availableWidth - keepWidth - overflowWidth

    let usedWidth = 0
    let itemsToOverflow = []

    for (const item of candidates) {
      usedWidth += item.offsetWidth + gap

      // Allow a pixel of slack for sub-pixel layout rounding
      if (usedWidth > limit + 1) {
        itemsToOverflow.push(item)
      }
    }

    // Check if we need threshold minimum visible
    const visibleCount = this._items.length - itemsToOverflow.length
    if (visibleCount < this._config.threshold && this._items.length > this._config.threshold) {
      // Move everything past the threshold instead, minus the keep items
      itemsToOverflow = this._items
        .slice(this._config.threshold)
        .filter(item => !item.classList.contains(CLASS_NAME_KEEP))
    }

    this._applyOverflow(itemsToOverflow, overflowItem)
  }

  protected _applyOverflow(items: HTMLElement[], overflowItem: HTMLElement | null): void {
    this._moveToOverflow(items)

    overflowItem?.classList.toggle(CLASS_NAME_HIDDEN, items.length === 0)

    if (items.length > 0) {
      EventHandler.trigger(this._element, EVENT_OVERFLOW, {
        overflowCount: items.length,
        visibleCount: this._items.length - items.length
      })
    }
  }

  protected _moveToOverflow(items: HTMLElement[]): void {
    if (!this._overflowMenu) {
      return
    }

    this._overflowMenu.replaceChildren()
    this._overflowItems = []

    for (const item of items) {
      const link = SelectorEngine.findOne(SELECTOR_NAV_LINK, item)
      if (!link) {
        continue
      }

      const menu = this._findItemMenu(item, link)

      if (menu && link.matches(SELECTOR_MENU_TOGGLE)) {
        this._overflowMenu.append(this._relocateAsSubmenu(item, link, menu))
      } else {
        this._overflowMenu.append(this._cloneAsMenuItem(link))
      }

      item.classList.add(CLASS_NAME_HIDDEN)
      item.dataset.bsNavOverflow = 'true'

      this._overflowItems.push(item)
    }
  }

  // A nav item that already hosts a Menu becomes a submenu of the overflow
  // menu. Move the original `.menu` (do not clone it) so nested submenus,
  // ids, and live node state stay on one element.
  protected _relocateAsSubmenu(item: HTMLElement, link: HTMLElement, menu: HTMLElement): HTMLElement {
    Menu.getInstance(link)?.dispose()
    menu.classList.remove(CLASS_NAME_SHOW)

    this._relocatedMenus.set(item, {
      menu,
      parent: menu.parentNode!,
      nextSibling: menu.nextSibling
    })

    const submenu = document.createElement('div')
    submenu.className = CLASS_NAME_SUBMENU
    submenu.append(this._cloneAsMenuItem(link, true), menu)

    return submenu
  }

  protected _cloneAsMenuItem(link: HTMLElement, submenu = false): HTMLElement {
    const clonedLink = link.cloneNode(true) as HTMLElement
    clonedLink.className = 'menu-item'
    clonedLink.removeAttribute('id')

    if (link.classList.contains('active')) {
      clonedLink.classList.add('active')
    }

    if (link.classList.contains('disabled') || link.hasAttribute('disabled')) {
      clonedLink.classList.add('disabled')
    }

    if (submenu) {
      for (const name of clonedLink.getAttributeNames()) {
        if (name.startsWith('data-bs-') && name !== 'data-bs-theme') {
          clonedLink.removeAttribute(name)
        }
      }

      clonedLink.removeAttribute('href')
      clonedLink.setAttribute('aria-haspopup', 'true')
      clonedLink.setAttribute('aria-expanded', 'false')

      if (clonedLink.tagName === 'A') {
        clonedLink.setAttribute('role', 'button')
      }
    }

    return clonedLink
  }

  protected _findItemMenu(item: HTMLElement, link: HTMLElement): HTMLElement | null {
    const sibling = SelectorEngine.next(link, SELECTOR_MENU)[0] as HTMLElement | undefined

    if (sibling && !sibling.classList.contains(CLASS_NAME_OVERFLOW_MENU)) {
      return sibling
    }

    const nested = SelectorEngine.findOne(SELECTOR_MENU, item)

    if (nested && !nested.classList.contains(CLASS_NAME_OVERFLOW_MENU)) {
      return nested
    }

    return null
  }

  protected _restoreRelocatedMenus(): void {
    for (const { menu, parent, nextSibling } of this._relocatedMenus.values()) {
      if (nextSibling) {
        nextSibling.before(menu)
      } else {
        parent.append(menu)
      }
    }

    this._relocatedMenus.clear()
  }

  protected _restoreItems(): void {
    if (this._overflowToggle) {
      Menu.getInstance(this._overflowToggle)?.dispose()
    }

    this._restoreRelocatedMenus()

    for (const item of this._items) {
      item.classList.remove(CLASS_NAME_HIDDEN)
      delete item.dataset.bsNavOverflow
    }

    // Show the toggle too, so it is measured at its real width and not zero
    this._overflowToggle?.closest(SELECTOR_NAV_ITEM)?.classList.remove(CLASS_NAME_HIDDEN)

    this._overflowMenu?.replaceChildren()
    this._overflowItems = []
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, 'DOMContentLoaded', () => {
  for (const element of SelectorEngine.find('[data-bs-toggle="nav-overflow"]')) {
    NavOverflow.getOrCreateInstance(element)
  }
})

export default NavOverflow
export type { NavOverflowConfig }
