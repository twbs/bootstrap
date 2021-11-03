/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.1): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * Constants
 */

const NAME = 'tab'
const VERSION = '4.6.1'
const DATA_KEY = 'bs.tab'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_ACTIVE_UL = '> li > .active'
const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'
const SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active'

/**
 * Class definition
 */

class Tab {
  constructor(element) {
    this._element = element
  }

  // Getters
  static get VERSION() {
    return VERSION
  }

  // Public
  show() {
    if (this._element.parentNode &&
        this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
        $(this._element).hasClass(CLASS_NAME_ACTIVE) ||
        $(this._element).hasClass(CLASS_NAME_DISABLED)) {
      return
    }

    let target
    let previous
    const listElement = $(this._element).closest(SELECTOR_NAV_LIST_GROUP)[0]
    const selector = Util.getSelectorFromElement(this._element)

    if (listElement) {
      const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE
      previous = $.makeArray($(listElement).find(itemSelector))
      previous = previous[previous.length - 1]
    }

    const hideEvent = $.Event(EVENT_HIDE, {
      relatedTarget: this._element
    })

    const showEvent = $.Event(EVENT_SHOW, {
      relatedTarget: previous
    })

    if (previous) {
      $(previous).trigger(hideEvent)
    }

    $(this._element).trigger(showEvent)

    if (showEvent.isDefaultPrevented() ||
        hideEvent.isDefaultPrevented()) {
      return
    }

    if (selector) {
      target = document.querySelector(selector)
    }

    this._activate(
      this._element,
      listElement
    )

    const complete = () => {
      const hiddenEvent = $.Event(EVENT_HIDDEN, {
        relatedTarget: this._element
      })

      const shownEvent = $.Event(EVENT_SHOWN, {
        relatedTarget: previous
      })

      $(previous).trigger(hiddenEvent)
      $(this._element).trigger(shownEvent)
    }

    if (target) {
      this._activate(target, target.parentNode, complete)
    } else {
      complete()
    }
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Private
  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ?
      $(container).find(SELECTOR_ACTIVE_UL) :
      $(container).children(SELECTOR_ACTIVE)

    const active = activeElements[0]
    const isTransitioning = callback && (active && $(active).hasClass(CLASS_NAME_FADE))
    const complete = () => this._transitionComplete(
      element,
      active,
      callback
    )

    if (active && isTransitioning) {
      const transitionDuration = Util.getTransitionDurationFromElement(active)

      $(active)
        .removeClass(CLASS_NAME_SHOW)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      $(active).removeClass(CLASS_NAME_ACTIVE)

      const dropdownChild = $(active.parentNode).find(
        SELECTOR_DROPDOWN_ACTIVE_CHILD
      )[0]

      if (dropdownChild) {
        $(dropdownChild).removeClass(CLASS_NAME_ACTIVE)
      }

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false)
      }
    }

    $(element).addClass(CLASS_NAME_ACTIVE)
    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true)
    }

    Util.reflow(element)

    if (element.classList.contains(CLASS_NAME_FADE)) {
      element.classList.add(CLASS_NAME_SHOW)
    }

    let parent = element.parentNode
    if (parent && parent.nodeName === 'LI') {
      parent = parent.parentNode
    }

    if (parent && $(parent).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
      const dropdownElement = $(element).closest(SELECTOR_DROPDOWN)[0]

      if (dropdownElement) {
        const dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE))

        $(dropdownToggleList).addClass(CLASS_NAME_ACTIVE)
      }

      element.setAttribute('aria-expanded', true)
    }

    if (callback) {
      callback()
    }
  }

  // Static
  static _jQueryInterface(config) {
    return this.each(function () {
      const $this = $(this)
      let data = $this.data(DATA_KEY)

      if (!data) {
        data = new Tab(this)
        $this.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * Data API implementation
 */

$(document)
  .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault()
    Tab._jQueryInterface.call($(this), 'show')
  })

/**
 * jQuery
 */

$.fn[NAME] = Tab._jQueryInterface
$.fn[NAME].Constructor = Tab
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Tab._jQueryInterface
}

export default Tab
