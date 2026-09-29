/**
 * --------------------------------------------------------------------------
 * Bootstrap dialog.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import DialogBase, { type DialogBaseConfig } from './dialog-base.js'
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

type DialogConfig = DialogBaseConfig & {
  modal: boolean
}

const Default: DialogConfig = {
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
  protected declare _config: DialogConfig

  // eslint-disable-next-line no-useless-constructor -- narrows the config param type
  constructor(element?: string | Element | null, config?: Partial<DialogConfig> | null) {
    super(element, config)
  }

  // Getters
  static override get Default(): DialogConfig {
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
      Dialog._handleDataApiClick(this, event)
    })
  }

  protected static _handleDataApiClick(trigger: HTMLElement, event: Event): void {
    const target = SelectorEngine.getElementFromSelector(trigger)
    if (!target) {
      return
    }

    if (['A', 'AREA'].includes(trigger.tagName)) {
      event.preventDefault()
    }

    const config = Manipulator.getDataAttributes(trigger)
    const currentDialog = trigger.closest<HTMLDialogElement>('dialog[open]')
    const shouldSwap = currentDialog && currentDialog !== target

    if (!shouldSwap) {
      EventHandler.one(target, EVENT_SHOW, showEvent => {
        if (!showEvent.defaultPrevented) {
          Dialog._registerFocusRestoration(target, trigger)
        }
      })

      Dialog.getOrCreateInstance(target, config).toggle(trigger)
      return
    }

    if (currentDialog.classList.contains(CLASS_NAME_SWAP_IN)) {
      return
    }

    const newDialog = Dialog.getOrCreateInstance(target, config)
    const currentInstance = Dialog.getOrCreateInstance(currentDialog)

    // Check both cancelable events before changing either dialog. This keeps
    // the current dialog open when either side rejects the swap.
    if (!newDialog._canShow(trigger) || !currentInstance._canHide()) {
      return
    }

    Dialog._registerFocusRestoration(target, trigger)
    target.classList.add(CLASS_NAME_SWAP_IN)
    EventHandler.one(target, `shown${EVENT_KEY}`, () => {
      target.classList.remove(CLASS_NAME_SWAP_IN)
    })
    newDialog._show(trigger)

    currentDialog.classList.add(CLASS_NAME_INSTANT)
    EventHandler.one(currentDialog, EVENT_HIDDEN, () => {
      currentDialog.classList.remove(CLASS_NAME_INSTANT)
    })
    currentInstance._hide()
  }

  protected static _registerFocusRestoration(target: HTMLElement, trigger: HTMLElement): void {
    EventHandler.one(target, EVENT_HIDDEN, () => {
      if (isVisible(trigger)) {
        trigger.focus({ preventScroll: true })
      }
    })
  }

  // Public
  handleUpdate(): void {
    // Provided for API consistency with Modal.
  }

  // Protected — hook overrides

  protected override _getShowOptions(): { modal: boolean, preventBodyScroll: boolean } {
    return {
      modal: this._config.modal,
      preventBodyScroll: this._config.modal
    }
  }

  protected override _onBeforeShow(): void {
    if (!this._config.modal) {
      this._element.classList.add(CLASS_NAME_NONMODAL)
    }
  }

  protected override _onAfterHide(): void {
    this._element.classList.remove(CLASS_NAME_NONMODAL)
  }

  // Keep the dialog in the top layer until the exit transition ends. This
  // preserves the browser's modal centering and the native ::backdrop, both
  // of which disappear synchronously the moment close() is called. Without
  // this, the dialog would jump to the top of the page and the backdrop
  // blur would vanish instantly while the dialog faded — making the exit
  // animation appear to skip entirely.
  protected override _shouldDeferClose(): boolean {
    return this._isAnimated()
  }

  protected override _onCancel(): void {
    EventHandler.trigger(this._element, EVENT_CANCEL)
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Dialog)

export default Dialog
export type { DialogConfig }
