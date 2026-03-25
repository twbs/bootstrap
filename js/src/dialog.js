/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import DialogBase from './dialog-base.js'
import EventHandler from './dom/event-handler.js'
import Manipulator from './dom/manipulator.js'
import SelectorEngine from './dom/selector-engine.js'
import { enableDismissTrigger } from './util/component-functions.js'
import { isVisible } from './util/index.js'

/**
 * Constants
 */

const NAME = 'dialog'
const DATA_KEY = 'bs.dialog'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CANCEL = `cancel${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_NONMODAL = 'dialog-nonmodal'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dialog"]'

const Default = {
  backdrop: true, // true (click dismisses) or 'static' (click does nothing) - only applies to modal dialogs
  keyboard: true,
  modal: true // true uses showModal(), false uses show() for non-modal dialogs
}

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  modal: 'boolean'
}

/**
 * Class definition
 */

class Dialog extends DialogBase {
  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public
  toggle(relatedTarget) {
    return this._element.open ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._element.open || this._isTransitioning) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget
    })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isTransitioning = true

    if (!this._config.modal) {
      this._element.classList.add(CLASS_NAME_NONMODAL)
    }

    this._showElement({
      modal: this._config.modal,
      preventBodyScroll: this._config.modal
    })

    // CSS @starting-style handles the entry animation automatically.
    this._queueCallback(() => {
      this._isTransitioning = false
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget
      })
    }, this._element, true)
  }

  hide() {
    if (!this._element.open || this._isTransitioning) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    this._isTransitioning = true

    // Call close() immediately — CSS handles the exit animation via
    // transition-behavior: allow-discrete on display and overlay.
    this._hideElement()
    this._element.classList.remove(CLASS_NAME_NONMODAL)

    this._queueCallback(() => {
      this._isTransitioning = false
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }, this._element, true)
  }

  handleUpdate() {
    // Provided for API consistency with Modal.
    // Native dialogs handle their own positioning.
  }

  // Private
  _onCancel() {
    EventHandler.trigger(this._element, EVENT_CANCEL)
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this)

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  EventHandler.one(target, EVENT_SHOW, showEvent => {
    if (showEvent.defaultPrevented) {
      return
    }

    EventHandler.one(target, EVENT_HIDDEN, () => {
      if (isVisible(this)) {
        this.focus()
      }
    })
  })

  // Get config from trigger's data attributes
  const config = Manipulator.getDataAttributes(this)

  // Check if trigger is inside an open dialog
  const currentDialog = this.closest('dialog[open]')
  const shouldSwap = currentDialog && currentDialog !== target

  if (shouldSwap) {
    // Open new dialog first (its backdrop appears over current)
    const newDialog = Dialog.getOrCreateInstance(target, config)
    newDialog.show(this)

    // Close the current dialog (no backdrop flash since new one is already open)
    const currentInstance = Dialog.getInstance(currentDialog)
    if (currentInstance) {
      currentInstance.hide()
    }

    return
  }

  const data = Dialog.getOrCreateInstance(target, config)
  data.toggle(this)
})

enableDismissTrigger(Dialog)

export default Dialog
