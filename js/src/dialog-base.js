/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog-base.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import Data from './dom/data.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'

/**
 * Constants
 */

const CLASS_NAME_OPEN = 'dialog-open'

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
  constructor(element, config) {
    super(element, config)

    this._isTransitioning = false
    this._openedAsModal = false
    this._addDialogListeners()
  }

  // Getters — subclasses override NAME with their own component name.
  static get NAME() {
    return 'dialogbase'
  }

  // Public — shared lifecycle methods

  toggle(relatedTarget) {
    return this._element.open ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._element.open || this._isTransitioning) {
      return
    }

    const showEvent = EventHandler.trigger(
      this._element,
      this.constructor.eventName('show'),
      { relatedTarget }
    )

    if (showEvent.defaultPrevented) {
      return
    }

    this._isTransitioning = true
    this._onBeforeShow()

    const { modal, preventBodyScroll } = this._getShowOptions()
    this._showElement({ modal, preventBodyScroll })

    this._queueCallback(() => {
      this._isTransitioning = false
      EventHandler.trigger(
        this._element,
        this.constructor.eventName('shown'),
        { relatedTarget }
      )
    }, this._element, this._isAnimated())
  }

  hide() {
    if (!this._element.open || this._isTransitioning) {
      return
    }

    const hideEvent = EventHandler.trigger(
      this._element,
      this.constructor.eventName('hide')
    )

    if (hideEvent.defaultPrevented) {
      return
    }

    this._isTransitioning = true
    this._hideElement()
    this._onAfterHide()

    this._queueCallback(() => {
      this._element.classList.remove('hiding')
      this._isTransitioning = false
      EventHandler.trigger(
        this._element,
        this.constructor.eventName('hidden')
      )
    }, this._element, this._isAnimated())
  }

  // Protected — hooks for subclasses to override

  _getShowOptions() {
    return { modal: true, preventBodyScroll: true }
  }

  _onBeforeShow() {
    // No-op by default — Dialog overrides to add nonmodal class
  }

  _onAfterHide() {
    // No-op by default — Dialog overrides to remove nonmodal class
  }

  _isAnimated() {
    return !this._element.classList.contains(this._getInstantClassName())
  }

  _getInstantClassName() {
    return 'dialog-instant'
  }

  _getStaticClassName() {
    return 'dialog-static'
  }

  _onCancel() {
    // No-op by default — Dialog overrides to fire cancel event
  }

  // Protected — shared mechanics

  _showElement({ modal = true, preventBodyScroll = true } = {}) {
    this._openedAsModal = modal

    if (modal) {
      this._element.showModal()
    } else {
      this._element.show()
    }

    if (preventBodyScroll) {
      document.body.classList.add(CLASS_NAME_OPEN)
    }
  }

  _hideElement() {
    this._hideChildComponents()

    // Add .hiding before close() so CSS exit transitions can play.
    // Without this, the navbar's `:not([open])` transition-kill rule
    // would prevent the slide-out animation.
    this._element.classList.add('hiding')
    this._element.close()
    this._openedAsModal = false

    // Only restore body scroll if no other modal dialogs are open
    if (!document.querySelector('dialog[open]:modal')) {
      document.body.classList.remove(CLASS_NAME_OPEN)
    }
  }

  _triggerBackdropTransition() {
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

  // Hide any tooltips, popovers, or toasts inside the dialog before closing.
  // These components append to the dialog (for top-layer rendering) and would
  // otherwise persist visibly after close().
  _hideChildComponents() {
    const selector = '[data-bs-toggle="tooltip"], [data-bs-toggle="popover"]'

    for (const el of SelectorEngine.find(selector, this._element)) {
      const instance = Data.getAny(el)
      if (instance && typeof instance.hide === 'function') {
        instance.hide()
      }
    }

    // Hide any visible toasts
    for (const el of SelectorEngine.find('.toast.show', this._element)) {
      const instance = Data.getAny(el)
      if (instance && typeof instance.hide === 'function') {
        instance.hide()
      }
    }
  }

  // Private

  _addDialogListeners() {
    const eventKey = this.constructor.EVENT_KEY

    // Handle native cancel event (Escape key) — only fires for modal dialogs
    EventHandler.on(this._element, 'cancel', event => {
      event.preventDefault()

      if (!this._config.keyboard) {
        this._triggerBackdropTransition()
        return
      }

      this._onCancel()
      this.hide()
    })

    // Handle Escape key for non-modal dialogs (native cancel doesn't fire for show())
    EventHandler.on(this._element, `keydown${eventKey}`, event => {
      if (event.key !== 'Escape' || this._openedAsModal) {
        return
      }

      event.preventDefault()

      if (!this._config.keyboard) {
        return
      }

      this._onCancel()
      this.hide()
    })

    // Handle backdrop clicks — only applies to modal dialogs
    EventHandler.on(this._element, `click${eventKey}`, event => {
      if (event.target !== this._element || !this._openedAsModal) {
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
