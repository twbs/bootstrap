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
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CANCEL = `cancel${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_NONMODAL = 'dialog-nonmodal'
const CLASS_NAME_INSTANT = 'dialog-instant'
const CLASS_NAME_SWAP_IN = 'dialog-swap-in'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dialog"]'

const Default = {
  backdrop: true,
  keyboard: true,
  modal: true
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
  handleUpdate() {
    // Provided for API consistency with Modal.
  }

  // Protected — hook overrides

  _getShowOptions() {
    return {
      modal: this._config.modal,
      preventBodyScroll: this._config.modal
    }
  }

  _onBeforeShow() {
    if (!this._config.modal) {
      this._element.classList.add(CLASS_NAME_NONMODAL)
    }
  }

  _onAfterHide() {
    this._element.classList.remove(CLASS_NAME_NONMODAL)
  }

  // Keep the dialog in the top layer until the exit transition ends. This
  // preserves the browser's modal centering and the native ::backdrop, both
  // of which disappear synchronously the moment close() is called. Without
  // this, the dialog would jump to the top of the page and the backdrop
  // blur would vanish instantly while the dialog faded — making the exit
  // animation appear to skip entirely.
  _shouldDeferClose() {
    return this._isAnimated()
  }

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

  // Check if trigger is inside an open dialog (dialog swapping)
  const currentDialog = this.closest('dialog[open]')
  const shouldSwap = currentDialog && currentDialog !== target

  if (shouldSwap) {
    // Swap strategy (seamless backdrop, no flash):
    //   1. Mark the incoming dialog with .dialog-swap-in so its ::backdrop
    //      skips the @starting-style fade-in and appears fully opaque on
    //      its very first frame in the top layer.
    //   2. Open the incoming dialog (showModal).
    //   3. Close the outgoing dialog synchronously — no exit transition, no
    //      .hiding — so its ::backdrop is removed in the same frame the
    //      incoming dialog's backdrop appears. Since both backdrops render
    //      the same color, the user sees one continuous backdrop. Two
    //      simultaneously-visible backdrops would composite to ~75% darker,
    //      and a fading-out + fading-in pair would dip to ~75% opacity —
    //      either would look like a flash.
    //   4. Clean up the .dialog-swap-in flag once the incoming dialog
    //      finishes its entry transition.
    const newDialog = Dialog.getOrCreateInstance(target, config)
    target.classList.add(CLASS_NAME_SWAP_IN)
    newDialog.show(this)
    EventHandler.one(target, `shown${EVENT_KEY}`, () => {
      target.classList.remove(CLASS_NAME_SWAP_IN)
    })

    const currentInstance = Dialog.getInstance(currentDialog)
    if (currentInstance) {
      // Force synchronous close: .dialog-instant makes _isAnimated() false,
      // which makes _shouldDeferClose() false, so hide() calls close()
      // immediately (no deferred .hiding path). The class is removed after
      // the (now-synchronous) hidden event fires.
      currentDialog.classList.add(CLASS_NAME_INSTANT)
      EventHandler.one(currentDialog, EVENT_HIDDEN, () => {
        currentDialog.classList.remove(CLASS_NAME_INSTANT)
      })
      currentInstance.hide()
    }

    return
  }

  const data = Dialog.getOrCreateInstance(target, config)
  data.toggle(this)
})

enableDismissTrigger(Dialog)

export default Dialog
