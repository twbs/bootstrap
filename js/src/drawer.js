/**
 * --------------------------------------------------------------------------
 * Bootstrap drawer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import DialogBase from './dialog-base.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import Swipe from './util/swipe.js'
import { enableDismissTrigger } from './util/component-functions.js'
import {
  isDisabled,
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

const Default = {
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
  constructor(element, config) {
    super(element, config)
    this._swipeHelper = null
  }

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
  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose()
    }

    super.dispose()
  }

  // Protected — hook overrides

  _getShowOptions() {
    const useModal = Boolean(this._config.backdrop) || !this._config.scroll
    return {
      modal: useModal,
      preventBodyScroll: !this._config.scroll
    }
  }

  _onBeforeShow() {
    this._initSwipe()
  }

  _getInstantClassName() {
    return 'drawer-instant'
  }

  _getStaticClassName() {
    return 'drawer-static'
  }

  // Private

  _initSwipe() {
    if (this._swipeHelper || !Swipe.isSupported()) {
      return
    }

    // Determine which swipe direction dismisses based on placement
    const swipeConfig = {}
    const element = this._element

    if (element.classList.contains('drawer-bottom')) {
      swipeConfig.downCallback = () => this.hide()
    } else if (element.classList.contains('drawer-top')) {
      swipeConfig.upCallback = () => this.hide()
    } else if (element.classList.contains('drawer-end')) {
      // RTL: swipe left to dismiss end drawer
      const isRtl = document.documentElement.dir === 'rtl'
      if (isRtl) {
        swipeConfig.leftCallback = () => this.hide()
      } else {
        swipeConfig.rightCallback = () => this.hide()
      }
    } else {
      // drawer-start (default): swipe left to dismiss in LTR
      const isRtl = document.documentElement.dir === 'rtl'
      if (isRtl) {
        swipeConfig.rightCallback = () => this.hide()
      } else {
        swipeConfig.leftCallback = () => this.hide()
      }
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
      this.focus()
    }
  })

  // Avoid conflict when clicking a toggler of a drawer, while another is open
  const alreadyOpen = SelectorEngine.findOne('dialog.drawer[open]')
  if (alreadyOpen && alreadyOpen !== target) {
    Drawer.getInstance(alreadyOpen).hide()
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
