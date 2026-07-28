/**
 * --------------------------------------------------------------------------
 * Bootstrap drawer.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import DialogBase, { type DialogBaseConfig } from './dialog-base.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import Swipe, { type SwipeConfig } from './util/swipe.js'
import { enableDismissTrigger } from './util/component-functions.js'
import {
  isDisabled,
  isRTL,
  isVisible
} from './util/index.js'

/**
 * Constants
 */

const NAME = 'drawer'
const DATA_KEY = 'bs.drawer'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="drawer"]'

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
  declare _config: DrawerConfig
  declare _swipeHelper: Swipe | null

  constructor(element?: string | Element | null, config?: Partial<DrawerConfig> | null) {
    super(element, config)
    this._swipeHelper = null
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

  // Public
  override dispose(): void {
    if (this._swipeHelper) {
      this._swipeHelper.dispose()
    }

    super.dispose()
  }

  // Protected — hook overrides

  override _getShowOptions(): { modal: boolean, preventBodyScroll: boolean } {
    const useModal = Boolean(this._config.backdrop) || !this._config.scroll
    return {
      modal: useModal,
      preventBodyScroll: !this._config.scroll
    }
  }

  override _onBeforeShow(): void {
    this._initSwipe()
  }

  override _getInstantClassName(): string {
    return 'drawer-instant'
  }

  override _getStaticClassName(): string {
    return 'drawer-static'
  }

  // Private

  _initSwipe(): void {
    if (this._swipeHelper || !Swipe.isSupported()) {
      return
    }

    // Determine which swipe direction dismisses based on placement
    const swipeConfig: Partial<SwipeConfig> = {}
    const element = this._element

    if (element.classList.contains('drawer-bottom')) {
      swipeConfig.downCallback = () => this.hide()
    } else if (element.classList.contains('drawer-top')) {
      swipeConfig.upCallback = () => this.hide()
    } else if (element.classList.contains('drawer-end')) {
      // RTL: swipe left to dismiss end drawer
      if (isRTL()) {
        swipeConfig.leftCallback = () => this.hide()
      } else {
        swipeConfig.rightCallback = () => this.hide()
      }
    } else if (isRTL()) {
      // drawer-start (default): swipe right to dismiss in RTL
      swipeConfig.rightCallback = () => this.hide()
    } else {
      // drawer-start (default): swipe left to dismiss in LTR
      swipeConfig.leftCallback = () => this.hide()
    }

    this._swipeHelper = new Swipe(element, swipeConfig)
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

  if (isDisabled(this)) {
    return
  }

  EventHandler.one(target, EVENT_HIDDEN, () => {
    if (isVisible(this)) {
      this.focus({ preventScroll: true })
    }
  })

  // Avoid conflict when clicking a toggler of a drawer, while another is open
  const alreadyOpen = SelectorEngine.findOne('dialog.drawer[open]')
  if (alreadyOpen && alreadyOpen !== target) {
    Drawer.getInstance(alreadyOpen)!.hide()
  }

  const data = Drawer.getOrCreateInstance(target)
  data.toggle(this)
})

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const selector of SelectorEngine.find('dialog.drawer[open]')) {
    Drawer.getOrCreateInstance(selector).show()
  }
})

EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('dialog[open][class*="\\:drawer"]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Drawer.getOrCreateInstance(element).hide()
    }
  }
})

enableDismissTrigger(Drawer)

export default Drawer
export type { DrawerConfig }
