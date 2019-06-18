/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  jQuery as $,
  TRANSITION_END,
  emulateTransitionEnd,
  getSelectorFromElement,
  getTransitionDurationFromElement,
  makeArray,
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
const VERSION = '4.3.1'
const DATA_KEY = 'bs.tab'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const ARROW_LEFT_KEYCODE = 37 // KeyboardEvent.which value for left arrow key
const ARROW_UP_KEYCODE = 38 // KeyboardEvent.which value for up arrow key
const ARROW_RIGHT_KEYCODE = 39 // KeyboardEvent.which value for right arrow key
const ARROW_DOWN_KEYCODE = 40 // KeyboardEvent.which value for down arrow key

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
  KEYDOWN_DATA_API: `keydown${EVENT_KEY}${DATA_API_KEY}`,
  LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  FADE: 'fade',
  SHOW: 'show'
}

const Selector = {
  NAV_LIST_GROUP: '.nav, .list-group',
  ACTIVE: '.active',
  ACTIVE_UL: ':scope > li > .active',
  DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
  TABLIST: '[role="tablist"]'
}

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
    if (this._element.parentNode &&
      this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
      this._element.classList.contains(ClassName.ACTIVE) ||
      this._element.classList.contains(ClassName.DISABLED)) {
      return
    }

    let target
    let previous
    const listElement = SelectorEngine.closest(this._element, Selector.NAV_LIST_GROUP)
    const selector = getSelectorFromElement(this._element)

    if (listElement) {
      const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector.ACTIVE_UL : Selector.ACTIVE
      previous = makeArray(SelectorEngine.find(itemSelector, listElement))
      previous = previous[previous.length - 1]
    }

    let hideEvent = null

    if (previous) {
      hideEvent = EventHandler.trigger(previous, Event.HIDE, {
        relatedTarget: this._element
      })
    }

    const showEvent = EventHandler.trigger(this._element, Event.SHOW, {
      relatedTarget: previous
    })

    if (showEvent.defaultPrevented ||
      hideEvent !== null && hideEvent.defaultPrevented) {
      return
    }

    if (selector) {
      target = SelectorEngine.findOne(selector)
    }

    this._activate(
      this._element,
      listElement
    )

    const complete = () => {
      EventHandler.trigger(previous, Event.HIDDEN, {
        relatedTarget: this._element
      })
      EventHandler.trigger(this._element, Event.SHOWN, {
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
      SelectorEngine.find(Selector.ACTIVE_UL, container) :
      SelectorEngine.children(container, Selector.ACTIVE)

    const active = activeElements[0]
    const isTransitioning = callback &&
      (active && active.classList.contains(ClassName.FADE))

    const complete = () => this._transitionComplete(
      element,
      active,
      callback
    )

    if (active && isTransitioning) {
      const transitionDuration = getTransitionDurationFromElement(active)
      active.classList.remove(ClassName.SHOW)

      EventHandler.one(active, TRANSITION_END, complete)
      emulateTransitionEnd(active, transitionDuration)
    } else {
      complete()
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      active.classList.remove(ClassName.ACTIVE)

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false)
        active.setAttribute('tabindex', '-1')
      }
    }

    element.classList.add(ClassName.ACTIVE)
    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true)
      element.setAttribute('tabindex', '0')
    }

    reflow(element)

    if (element.classList.contains(ClassName.FADE)) {
      element.classList.add(ClassName.SHOW)
    }

    if (callback) {
      callback()
    }
  }

  // Static

  static _jQueryInterface(config) {
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

  static _dataApiKeydownHandler(event) {
    const tablist = SelectorEngine.closest(event.target, Selector.TABLIST)
    let tablistorientation = tablist.getAttribute('aria-orientation')
    if (tablistorientation !== 'vertical') {
      tablistorientation = 'horizontal'
    }

    if ((tablistorientation === 'horizontal' && event.which !== ARROW_LEFT_KEYCODE && event.which !== ARROW_RIGHT_KEYCODE) || (tablistorientation === 'vertical' && event.which !== ARROW_UP_KEYCODE && event.which !== ARROW_DOWN_KEYCODE)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || this.classList.contains(ClassName.DISABLED)) {
      return
    }

    const tabs = makeArray(SelectorEngine.find(Selector.DATA_TOGGLE, tablist))

    if (!tabs.length) {
      return
    }

    let index = tabs.indexOf(event.target)

    if ((event.which === ARROW_LEFT_KEYCODE || event.which === ARROW_UP_KEYCODE) && index > 0) { // Left / Up
      index--
    }

    if ((event.which === ARROW_RIGHT_KEYCODE || event.which === ARROW_DOWN_KEYCODE) && index < tabs.length - 1) { // Right / Down
      index++
    }

    if (index < 0) {
      index = 0
    }

    tabs[index].focus()
    tabs[index].click() // WIP naive way of doing this? any better way? calling _activate or something?
  }

  static _getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(window, Event.LOAD_DATA_API, () => {
  const tablists = makeArray(SelectorEngine.find(Selector.TABLIST))
  if (tablists.length === 0) {
    return
  }

  // iterate over all found sets of tab lists
  for (let i = 0; i < tablists.length; i++) {
    const tabs = makeArray(SelectorEngine.find(Selector.DATA_TOGGLE, tablists[i]))
    let selectedTabFound = false

    // iterate over each tab in the tablist, make sure they have correct tabindex/aria-selected
    for (let j = 0; j < tabs.length; j++) {
      if (tabs[j].hasAttribute('aria-selected') && tabs[j].getAttribute('aria-selected') === 'true' && selectedTabFound === false) {
        tabs[j].setAttribute('tabindex', '0')
        selectedTabFound = true
      } else {
        tabs[j].setAttribute('tabindex', '-1')
        tabs[j].setAttribute('aria-selected', 'false')
      }
    }

    // if none of the tabs were explicitly marked as selected, pick first one
    if (selectedTabFound === false) {
      tabs[0].setAttribute('tabindex', '0')
      tabs[0].setAttribute('aria-selected', 'true')
    }
  }
})
EventHandler.on(document, Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Tab._dataApiKeydownHandler)
EventHandler.on(document, Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
  event.preventDefault()

  const data = Data.getData(this, DATA_KEY) || new Tab(this)
  data.show()
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .tab to jQuery only if jQuery is present
 */

if (typeof $ !== 'undefined') {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Tab._jQueryInterface
  $.fn[NAME].Constructor = Tab
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tab._jQueryInterface
  }
}

export default Tab
