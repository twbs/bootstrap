/**
 * --------------------------------------------------------------------------
 * Bootstrap popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Tooltip from './tooltip.js'
import EventHandler from './dom/event-handler.js'

/**
 * Constants
 */

const NAME = 'popover'

const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="popover"]'

const EVENT_CLICK = 'click'
const EVENT_FOCUSIN = 'focusin'
const EVENT_MOUSEENTER = 'mouseenter'

const Default = {
  ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip">' +
    '<div class="popover-arrow"></div>' +
    '<h3 class="popover-header"></h3>' +
    '<div class="popover-body"></div>' +
    '</div>',
  trigger: 'click'
}

const DefaultType = {
  ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
}

/**
 * Class definition
 */

class Popover extends Tooltip {
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

  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent()
  }

  // Private
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    }
  }

  _getContent() {
    return this._resolvePossibleFunction(this._config.content)
  }
}

/**
 * Data API implementation - auto-initialize popovers
 */

const initPopover = event => {
  const target = event.target.closest(SELECTOR_DATA_TOGGLE)
  if (!target) {
    return
  }

  // Prevent default for click events to avoid navigation
  if (event.type === 'click') {
    event.preventDefault()
  }

  // Get or create instance
  const popover = Popover.getOrCreateInstance(target)

  // Trigger the appropriate action based on event type
  if (event.type === 'click') {
    popover.toggle()
  } else if (event.type === 'focusin') {
    popover._activeTrigger.focus = true
    popover._enter()
  }
}

// Support click (default), hover, and focus triggers
EventHandler.on(document, EVENT_CLICK, SELECTOR_DATA_TOGGLE, initPopover)
EventHandler.on(document, EVENT_FOCUSIN, SELECTOR_DATA_TOGGLE, initPopover)
EventHandler.on(document, EVENT_MOUSEENTER, SELECTOR_DATA_TOGGLE, initPopover)

export default Popover
