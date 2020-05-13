/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha1): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  TRANSITION_END,
  emulateTransitionEnd,
  getElementFromSelector,
  getTransitionDurationFromElement,
  reflow
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tab'
const VERSION = '5.0.0-alpha1'
const DATA_KEY = 'bs.tab'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_ACTIVE_UL = ':scope > li > .active'
const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'
const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tab {
  constructor(element) {
    this._element = element

    Data.setData(this._element, DATA_KEY, this)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  show() {
    if ((this._element.parentNode &&
      this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
      this._element.classList.contains(CLASS_NAME_ACTIVE)) ||
      this._element.classList.contains(CLASS_NAME_DISABLED)) {
      return
    }

    let previous
    const target = getElementFromSelector(this._element)
    const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP)

    if (listElement) {
      const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE
      previous = SelectorEngine.find(itemSelector, listElement)
      previous = previous[previous.length - 1]
    }

    let hideEvent = null

    if (previous) {
      hideEvent = EventHandler.trigger(previous, EVENT_HIDE, {
        relatedTarget: this._element
      })
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget: previous
    })

    if (showEvent.defaultPrevented ||
      (hideEvent !== null && hideEvent.defaultPrevented)) {
      return
    }

    this._activate(
      this._element,
      listElement
    )

    const complete = () => {
      EventHandler.trigger(previous, EVENT_HIDDEN, {
        relatedTarget: this._element
      })
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget: previous
      })
    }

    if (target) {
      this._activate(target, target.parentNode, complete)
    } else {
      complete()
    }
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Private

  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ?
      SelectorEngine.find(SELECTOR_ACTIVE_UL, container) :
      SelectorEngine.children(container, SELECTOR_ACTIVE)

    const active = activeElements[0]
    const isTransitioning = callback &&
      (active && active.classList.contains(CLASS_NAME_FADE))

    const complete = () => this._transitionComplete(
      element,
      active,
      callback
    )

    if (active && isTransitioning) {
      const transitionDuration = getTransitionDurationFromElement(active)
      active.classList.remove(CLASS_NAME_SHOW)

      EventHandler.one(active, TRANSITION_END, complete)
      emulateTransitionEnd(active, transitionDuration)
    } else {
      complete()
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      active.classList.remove(CLASS_NAME_ACTIVE)

      const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode)

      if (dropdownChild) {
        dropdownChild.classList.remove(CLASS_NAME_ACTIVE)
      }

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false)
      }
    }

    element.classList.add(CLASS_NAME_ACTIVE)
    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true)
    }

    reflow(element)

    if (element.classList.contains(CLASS_NAME_FADE)) {
      element.classList.add(CLASS_NAME_SHOW)
    }

    if (element.parentNode && element.parentNode.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
      const dropdownElement = element.closest(SELECTOR_DROPDOWN)

      if (dropdownElement) {
        SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE)
          .forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE))
      }

      element.setAttribute('aria-expanded', true)
    }

    if (callback) {
      callback()
    }
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Data.getData(this, DATA_KEY) || new Tab(this)

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()

  const data = Data.getData(this, DATA_KEY) || new Tab(this)
  data.show()
})

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .tab to jQuery only if jQuery is present
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Tab.jQueryInterface
  $.fn[NAME].Constructor = Tab
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tab.jQueryInterface
  }
}

export default Tab
