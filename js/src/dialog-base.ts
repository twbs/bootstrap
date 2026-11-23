/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog-base.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import Data from './dom/data.js'
import EventHandler, { type BootstrapEvent } from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import { lockScroll, unlockScroll } from './util/scroll-lock.js'
import { executeAfterTransition, isVisible } from './util/index.js'

type DialogBaseConfig = {
  backdrop: boolean | string
  keyboard: boolean
}

/**
 * Class definition
 *
 * Shared base class for Dialog and Drawer components that use
 * the native <dialog> element. Provides common behavior for:
 * - Show/hide/toggle lifecycle with events
 * - Opening/closing via showModal()/show()/close()
 * - Escape key handling (modal and non-modal)
 * - Backdrop click handling
 * - Static backdrop transition ("bounce")
 * - Body scroll prevention
 * - Transition coordination
 * - Child component cleanup (tooltips, popovers, toasts)
 */

class DialogBase extends BaseComponent {
  protected declare _element: HTMLDialogElement
  protected declare _config: DialogBaseConfig
  protected declare _isTransitioning: boolean
  protected declare _openedAsModal: boolean
  protected declare _opening: boolean
  protected declare _active: boolean
  protected declare _operation: number
  protected declare _returnFocus: HTMLElement | null
  protected declare _closedBy: string | null | undefined
  protected declare _cancelTransition: (() => void) | null
  protected declare _closeHandler: () => void
  protected declare _toggleHandler: () => void
  protected declare _cancelHandler: (event: BootstrapEvent) => void

  constructor(element?: string | Element | null, config?: Partial<DialogBaseConfig> | null) {
    super(element, config)

    this._isTransitioning = false
    this._opening = false
    this._active = Boolean(this._element?.open)
    this._openedAsModal = Boolean(this._element?.matches(':modal'))
    this._operation = 0
    this._returnFocus = null
    this._closedBy = undefined
    this._cancelTransition = null
    this._addDialogListeners()
  }

  // Getters — subclasses override NAME with their own component name.
  static override get NAME(): string {
    return 'dialogbase'
  }

  // Public — shared lifecycle methods

  toggle(relatedTarget?: HTMLElement): Promise<void> {
    return this._element?.open ? this.hide() : this.show(relatedTarget)
  }

  async show(relatedTarget?: HTMLElement): Promise<void> {
    if (!this._canShow(relatedTarget)) {
      return
    }

    await this._show(relatedTarget)
  }

  async hide(): Promise<void> {
    if (!this._canHide()) {
      return
    }

    await this._hide()
  }

  // Protected — lifecycle stages

  protected _canShow(relatedTarget?: HTMLElement): boolean {
    if (this._active && this._element?.isConnected && !this._element.open) {
      unlockScroll(this._element)
      this._finishHide()
    }

    if (!this._element?.isConnected || this._element.open || this._isTransitioning) {
      return false
    }

    const showEvent = EventHandler.trigger(
      this._element,
      this.constructor.eventName('show'),
      { relatedTarget }
    )

    return !showEvent.defaultPrevented
  }

  protected async _show(relatedTarget?: HTMLElement, returnFocus: HTMLElement | null | undefined = relatedTarget): Promise<void> {
    if (!this._element?.isConnected || this._element.open || this._isTransitioning) {
      return
    }

    const operation = ++this._operation
    this._isTransitioning = true
    this._opening = true
    this._active = true
    const previousFocus = this._element.ownerDocument.activeElement
    this._returnFocus = returnFocus === undefined && previousFocus instanceof HTMLElement ? previousFocus : returnFocus ?? null
    this._onBeforeShow()

    const { modal, preventBodyScroll } = this._getShowOptions()
    this._showElement({ modal, preventBodyScroll })
    if (!this._element || this._operation !== operation) {
      return
    }

    if (!this._element.open) {
      this._clearOpenState()
      this._active = false
      this._returnFocus = null
      this._isTransitioning = false
      this._opening = false
      return
    }

    await this._queueLifecycle(() => {
      if (this._operation !== operation || !this._element.open || !this._element.isConnected) {
        return
      }

      this._isTransitioning = false
      this._opening = false
      EventHandler.trigger(
        this._element,
        this.constructor.eventName('shown'),
        { relatedTarget }
      )
    }, this._isAnimated())
  }

  protected _canHide(): boolean {
    if (!this._element?.open || (this._isTransitioning && !this._opening)) {
      return false
    }

    const hideEvent = EventHandler.trigger(
      this._element,
      this.constructor.eventName('hide')
    )

    return !hideEvent.defaultPrevented
  }

  protected async _hide(restoreFocus = true): Promise<void> {
    if (!this._element?.open || (this._isTransitioning && !this._opening)) {
      return
    }

    const operation = ++this._operation
    this._cancelTransition?.()
    this._isTransitioning = true
    this._opening = false
    if (!restoreFocus) {
      this._returnFocus = null
    }

    this._hideElement()

    await this._queueLifecycle(() => {
      if (this._operation === operation) {
        this._closeAndCleanup()
        if (this._element && !this._element.open && this._operation === operation) {
          this._finishHide()
        }
      }
    }, this._shouldDeferClose())
  }

  override dispose(): void {
    if (!this._element) {
      return
    }

    this._cancelTransition?.()

    // If disposed while still open, close the native <dialog> and restore body
    // scroll. Otherwise `dialog-open` (overflow: hidden) would stay stuck on the
    // root — e.g. when an SPA tears the component down mid-navigation.
    const element = this._element
    if (element.open) {
      this._hideChildComponents()
      this._closeAndCleanup()
    }

    if (!this._element) {
      return
    }

    // Native close queues its event; dispose must also release an already-closed dialog.
    unlockScroll(this._element)
    this._clearOpenState()

    // The `cancel` listener is unnamespaced, so super.dispose()'s EVENT_KEY
    // teardown misses it — remove this instance's own handler here.
    EventHandler.off(this._element, 'cancel', this._cancelHandler)
    EventHandler.off(this._element, 'close', this._closeHandler)
    EventHandler.off(this._element, 'toggle', this._toggleHandler)

    super.dispose()
  }

  // Protected — hooks for subclasses to override

  protected _getShowOptions(): { modal: boolean, preventBodyScroll: boolean } {
    return { modal: true, preventBodyScroll: true }
  }

  protected _onBeforeShow(): void {
    // No-op by default — Dialog overrides to add nonmodal class
  }

  protected _onAfterHide(): void {
    // No-op by default — Dialog overrides to remove nonmodal class
  }

  protected _isAnimated(): boolean {
    return !this._element.classList.contains(this._getInstantClassName())
  }

  protected _getInstantClassName(): string {
    return 'dialog-instant'
  }

  protected _getStaticClassName(): string {
    return 'dialog-static'
  }

  protected _onCancel(): void {
    // No-op by default — Dialog overrides to fire cancel event
  }

  // Protected — shared mechanics

  protected _showElement({ modal = true, preventBodyScroll = true }: { modal?: boolean, preventBodyScroll?: boolean } = {}): void {
    this._openedAsModal = modal
    this._closedBy = this._element.getAttribute('closedby')
    this._element.setAttribute('closedby', modal && this._config.keyboard ? 'closerequest' : 'none')
    this._element.classList.toggle('dialog-no-backdrop', !this._config.backdrop)

    if (modal) {
      this._element.showModal()
    } else {
      this._element.show()
    }

    if (preventBodyScroll && this._element?.open) {
      const element = this._element
      lockScroll(element, () => {
        if (this._element === element && this._active && !element.isConnected) {
          this._hideChildComponents()
          this._closeAndCleanup()
          this._finishHide()
        }
      })
    }
  }

  protected _hideElement(): void {
    this._hideChildComponents()

    // Add .hiding before close() so CSS exit transitions can play.
    // Without this, the navbar's `:not([open])` transition-kill rule
    // would prevent the slide-out animation.
    this._element.classList.add('hiding')
  }

  // Closes the native <dialog> and tears down scroll prevention.
  // Safe to call multiple times — close() is a no-op on a closed dialog.
  protected _closeAndCleanup(): void {
    const element = this._element
    element.close()
    unlockScroll(element)
  }

  protected _clearOpenState(): void {
    this._openedAsModal = false
    this._element.classList.remove('hiding', 'dialog-no-backdrop', this._getStaticClassName())
    if (this._closedBy === null) {
      this._element.removeAttribute('closedby')
    } else if (this._closedBy !== undefined) {
      this._element.setAttribute('closedby', this._closedBy)
    }

    this._closedBy = undefined
    this._onAfterHide()
  }

  protected _finishHide(): void {
    const element = this._element
    const trigger = this._returnFocus
    const { activeElement, body } = element.ownerDocument
    const restoreFocus = activeElement === body || element.contains(activeElement)
    this._cancelTransition?.()
    this._clearOpenState()
    this._active = false
    this._returnFocus = null
    this._isTransitioning = false
    this._opening = false
    this._operation++
    if (trigger && restoreFocus && isVisible(trigger)) {
      trigger.focus({ preventScroll: true })
    }

    EventHandler.trigger(element, this.constructor.eventName('hidden'))
  }

  protected _queueLifecycle(callback: () => void, animated: boolean): Promise<void> {
    if (!animated) {
      callback()
      return Promise.resolve()
    }

    return new Promise(resolve => {
      const cancel = executeAfterTransition(() => {
        this._cancelTransition = null
        callback()
        resolve()
      }, this._element)
      this._cancelTransition = () => {
        cancel?.()
        this._cancelTransition = null
        resolve()
      }
    })
  }

  // Hook: return true to keep the dialog in the top layer (i.e., delay
  // calling close()) until the exit transition completes. The base class
  // closes synchronously; Dialog and Drawer override this for their
  // animated cases.
  protected _shouldDeferClose(): boolean {
    return false
  }

  protected _triggerBackdropTransition(): void {
    const hidePreventedEvent = EventHandler.trigger(
      this._element,
      this.constructor.eventName('hidePrevented')
    )

    if (hidePreventedEvent.defaultPrevented) {
      return
    }

    const staticClass = this._getStaticClassName()
    this._element.classList.add(staticClass)
    this._queueCallback(() => {
      this._element.classList.remove(staticClass)
    }, this._element)
  }

  // Hide child popups before closing the dialog.
  // These components append to the dialog (for top-layer rendering) and would
  // otherwise persist visibly after close().
  protected _hideChildComponents(): void {
    const selector = '[data-bs-toggle="tooltip"], [data-bs-toggle="popover"], [data-bs-toggle="datepicker"]'

    for (const el of SelectorEngine.find(selector, this._element)) {
      const instance = Data.get(el, `bs.${el.getAttribute('data-bs-toggle')}`)
      if (instance && typeof instance.hide === 'function') {
        instance.hide()
      }
    }

    // Hide any visible toasts
    for (const el of SelectorEngine.find('.toast.show', this._element)) {
      const instance = Data.get(el, 'bs.toast')
      if (instance && typeof instance.hide === 'function') {
        instance.hide()
      }
    }
  }

  // Private

  protected _addDialogListeners(): void {
    if (!this._element) {
      return
    }

    const eventKey = this.constructor.EVENT_KEY

    // Native close() and <form method="dialog"> bypass hide(). A queued close
    // event from an earlier opening must not unlock a reopened dialog.
    this._closeHandler = () => {
      if (!this._element.open) {
        unlockScroll(this._element)
        if (this._active) {
          this._hideChildComponents()
          this._finishHide()
        }
      }
    }

    EventHandler.on(this._element, 'close', this._closeHandler)
    this._toggleHandler = () => {
      if (this._element.open && !this._active) {
        this._active = true
        this._openedAsModal = this._element.matches(':modal')
      }
    }

    EventHandler.on(this._element, 'toggle', this._toggleHandler)

    // Handle native cancel event (Escape key) — only fires for modal dialogs.
    // Bound unnamespaced because `cancel` is a real native event, not one of
    // our namespaced custom events. Keep a per-instance handler so dispose()
    // removes only this listener, not a consumer's own `cancel` listener.
    this._cancelHandler = event => {
      if (event.target !== this._element) {
        return
      }

      event.preventDefault()

      if (!this._config.keyboard) {
        this._triggerBackdropTransition()
        return
      }

      this._onCancel()
      this.hide()
    }

    EventHandler.on(this._element, 'cancel', this._cancelHandler)

    EventHandler.on(this._element, `keydown${eventKey}`, event => {
      if (event.key !== 'Escape' || event.defaultPrevented || !this._element.open ||
          (event.target as Element).closest('dialog') !== this._element) {
        return
      }

      if (this._openedAsModal && this._config.keyboard) {
        return
      }

      // The browser can dispatch a native cancel event that cannot be prevented.
      // Prevent the keydown to stop that close request when keyboard is false.
      event.preventDefault()

      if (!this._config.keyboard) {
        if (this._openedAsModal) {
          this._triggerBackdropTransition()
        }

        return
      }

      this._onCancel()
      this.hide()
    })

    // The browser targets backdrop clicks at the dialog itself.
    const isOutside = (event: BootstrapEvent): boolean => {
      const { left, right, top, bottom } = this._element.getBoundingClientRect()
      return event.clientX < left || event.clientX >= right || event.clientY < top || event.clientY >= bottom
    }

    let backdropPress = false
    EventHandler.on(this._element, `pointerdown${eventKey}`, event => {
      backdropPress = event.button === 0 && event.target === this._element && isOutside(event)
    })
    EventHandler.on(this._element, `pointercancel${eventKey}`, () => {
      backdropPress = false
    })

    EventHandler.on(this._element, `click${eventKey}`, event => {
      const startedOutside = backdropPress
      backdropPress = false
      if (!startedOutside || !event.detail || event.target !== this._element || !this._openedAsModal || !isOutside(event)) {
        return
      }

      if (this._config.backdrop === false) {
        return
      }

      if (this._config.backdrop === 'static') {
        this._triggerBackdropTransition()
        return
      }

      this.hide()
    })
  }
}

export default DialogBase
export type { DialogBaseConfig }
