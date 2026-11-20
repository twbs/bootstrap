/**
 * --------------------------------------------------------------------------
 * Bootstrap drawer.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import DialogBase, { type DialogBaseConfig } from './dialog-base.js'
import EventHandler from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import SelectorEngine from './dom/selector-engine.js'
import Swipe, { type SwipeConfig } from './util/swipe.js'
import { enableDismissTrigger, onDocumentReady } from './util/component-functions.js'
import { isDisabled } from './util/index.js'

/**
 * Constants
 */

const NAME = 'drawer'
const DATA_KEY = 'bs.drawer'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const EVENT_RESIZE = `resize${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="drawer"]'
const SELECTOR_RESPONSIVE = 'dialog[class*="\\:drawer"]'
const SELECTOR_OPEN = 'dialog.drawer[open], dialog[open][class*="\\:drawer"]'
const SELECTOR_RESIZE = `${SELECTOR_OPEN}, ${SELECTOR_RESPONSIVE}`
const inlineAttributes = new WeakMap<HTMLDialogElement, Map<string, string | null>>()
const drawerIsInline = (element: HTMLDialogElement): boolean =>
  element.matches(SELECTOR_RESPONSIVE) && getComputedStyle(element).getPropertyValue('--drawer-inline').trim() === '1'

const syncInlineSemantics = (element: HTMLDialogElement, inline: boolean): void => {
  const saved = inlineAttributes.get(element)
  if (inline && !saved) {
    const attributes = new Map<string, string | null>()
    for (const name of ['role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-modal']) {
      attributes.set(name, element.getAttribute(name))
      element.removeAttribute(name)
    }

    element.setAttribute('role', 'presentation')
    inlineAttributes.set(element, attributes)
  } else if (!inline && saved) {
    for (const [name, value] of saved) {
      if (value === null) {
        element.removeAttribute(name)
      } else {
        element.setAttribute(name, value)
      }
    }

    inlineAttributes.delete(element)
  }
}

type DrawerConfig = DialogBaseConfig & {
  scroll: boolean
}

const Default: DrawerConfig = {
  backdrop: true,
  keyboard: true,
  scroll: false
}

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
}

/**
 * Class definition
 */

class Drawer extends DialogBase {
  protected declare _config: DrawerConfig
  protected declare _swipeHelper: Swipe | null
  protected declare _resizeObserver: ResizeObserver | null
  protected declare _resizeFrame: number | null

  constructor(element?: string | Element | null, config?: Partial<DrawerConfig> | null) {
    super(element, config)
    this._swipeHelper = null
    this._resizeObserver = null
    this._resizeFrame = null
    this._initResizeObserver()
  }

  // Getters
  static override get Default(): DrawerConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  static {
    EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      const target = SelectorEngine.getElementFromSelector(this)
      if (!(target instanceof HTMLDialogElement) || isDisabled(this)) {
        return
      }

      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault()
      }

      Drawer._toggleDrawer(target, this)
    })
  }

  protected static _toggleDrawer(target: HTMLDialogElement, trigger: HTMLElement): void {
    const drawer = Drawer.getOrCreateInstance(target, Manipulator.getDataAttributes(trigger))
    if (target.open) {
      drawer.hide()
      return
    }

    const other = SelectorEngine.findOne(SELECTOR_OPEN)
    if (!other) {
      drawer.show(trigger)
      return
    }

    const source = Drawer.getOrCreateInstance(other)
    if (!drawer._canShow(trigger) || !source._canHide()) {
      return
    }

    const returnFocus = other.contains(trigger) ? source._returnFocus : trigger
    drawer._show(trigger, returnFocus)
    if (target.open) {
      source._hide(false)
    }
  }

  // Public
  override dispose(): void {
    if (this._swipeHelper) {
      this._swipeHelper.dispose()
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }

    if (this._resizeFrame !== null) {
      cancelAnimationFrame(this._resizeFrame)
    }

    super.dispose()
  }

  // Protected — hook overrides

  protected override _getShowOptions(): { modal: boolean, preventBodyScroll: boolean } {
    const useModal = Boolean(this._config.backdrop) || !this._config.scroll
    return {
      modal: useModal,
      preventBodyScroll: !this._config.scroll
    }
  }

  protected override _onBeforeShow(): void {
    // The author may change direction or placement between openings.
    this._swipeHelper?.dispose()
    this._swipeHelper = null
    this._initSwipe()
  }

  protected override _canShow(relatedTarget?: HTMLElement): boolean {
    return !this._isInline() && super._canShow(relatedTarget)
  }

  protected override async _show(relatedTarget?: HTMLElement, returnFocus: HTMLElement | null | undefined = relatedTarget): Promise<void> {
    if (this._isInline()) {
      return
    }

    await super._show(relatedTarget, returnFocus)
    if (this._element?.open && this._isInline()) {
      await this.hide()
    }
  }

  protected override _onAfterHide(): void {
    syncInlineSemantics(this._element, this._isInline())
  }

  protected _isInline(): boolean {
    return Boolean(this._element && drawerIsInline(this._element))
  }

  protected override _getInstantClassName(): string {
    return 'drawer-instant'
  }

  protected override _getStaticClassName(): string {
    return 'drawer-static'
  }

  // Keep the drawer in the top layer until the exit transition ends, like
  // Dialog does. close() removes the dialog from the top layer, which drops
  // the native ::backdrop synchronously — the backdrop would disappear before
  // it could transition out.
  protected override _shouldDeferClose(): boolean {
    return this._isAnimated()
  }

  // Private

  protected _initResizeObserver(): void {
    const navbar = this._element?.closest('.navbar')

    if (!navbar || typeof ResizeObserver === 'undefined') {
      return
    }

    this._resizeObserver = new ResizeObserver(() => {
      if (this._resizeFrame !== null) {
        cancelAnimationFrame(this._resizeFrame)
      }

      this._resizeFrame = requestAnimationFrame(() => {
        this._resizeFrame = null

        if (this._element.open && getComputedStyle(this._element).position !== 'fixed') {
          this.hide()
        }
      })
    })
    this._resizeObserver.observe(navbar)
  }

  protected _initSwipe(): void {
    if (this._swipeHelper || !Swipe.isSupported()) {
      return
    }

    // Determine which swipe direction dismisses based on placement
    const swipeConfig: Partial<SwipeConfig> = {}
    const element = this._element
    const rtl = element.matches(':dir(rtl)')

    if (element.classList.contains('drawer-bottom')) {
      swipeConfig.downCallback = () => this.hide()
    } else if (element.classList.contains('drawer-top')) {
      swipeConfig.upCallback = () => this.hide()
    } else if (element.classList.contains('drawer-end')) {
      // RTL: swipe left to dismiss end drawer
      if (rtl) {
        swipeConfig.leftCallback = () => this.hide()
      } else {
        swipeConfig.rightCallback = () => this.hide()
      }
    } else if (rtl) {
      // drawer-start (default): swipe right to dismiss in RTL
      swipeConfig.rightCallback = () => this.hide()
    } else {
      // drawer-start (default): swipe left to dismiss in LTR
      swipeConfig.leftCallback = () => this.hide()
    }

    this._swipeHelper = new Swipe(SelectorEngine.findOne('.drawer-header', element) || element, swipeConfig)
  }
}

/**
 * Data API implementation
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_OPEN)) {
    Drawer.getOrCreateInstance(element)
  }
})

onDocumentReady(`DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, () => {
  for (const element of SelectorEngine.find<HTMLDialogElement>(SELECTOR_RESPONSIVE)) {
    syncInlineSemantics(element, !element.open && drawerIsInline(element))
  }
})

// Restore author-provided dialog semantics before a native opening.
document.addEventListener('beforetoggle', event => {
  if (event.target instanceof HTMLDialogElement && event.newState === 'open') {
    syncInlineSemantics(event.target, false)
  }
}, true)

document.addEventListener('close', event => {
  if (event.target instanceof HTMLDialogElement && event.target.matches(SELECTOR_RESPONSIVE)) {
    syncInlineSemantics(event.target, !event.target.open && drawerIsInline(event.target))
  }
}, true)

EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find<HTMLDialogElement>(SELECTOR_RESIZE)) {
    const inline = drawerIsInline(element)
    syncInlineSemantics(element, !element.open && inline)
    if (element.open && (inline || getComputedStyle(element).position !== 'fixed')) {
      Drawer.getOrCreateInstance(element).hide()
    }
  }
})

enableDismissTrigger(Drawer)

export default Drawer
export type { DrawerConfig }
