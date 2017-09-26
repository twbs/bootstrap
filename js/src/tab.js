import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import SelectorEngine from './dom/selectorEngine'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
const Tab = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tab'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.tab'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const TRANSITION_DURATION = 150

  const Event = {
    HIDE           : `hide${EVENT_KEY}`,
    HIDDEN         : `hidden${EVENT_KEY}`,
    SHOW           : `show${EVENT_KEY}`,
    SHOWN          : `shown${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DROPDOWN_MENU : 'dropdown-menu',
    ACTIVE        : 'active',
    DISABLED      : 'disabled',
    FADE          : 'fade',
    SHOW          : 'show'
  }

  const Selector = {
    DROPDOWN              : '.dropdown',
    NAV_LIST_GROUP        : '.nav, .list-group',
    ACTIVE                : '.active',
    ACTIVE_UL             : ':scope > li > .active',
    DATA_TOGGLE           : '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE       : '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD : ':scope > .dropdown-menu .active'
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
      const selector    = Util.getSelectorFromElement(this._element)

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' ? Selector.ACTIVE_UL : Selector.ACTIVE
        previous = Util.makeArray(SelectorEngine.find(itemSelector, listElement))
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
      const activeElements = container.nodeName === 'UL' ?
        SelectorEngine.find(Selector.ACTIVE_UL, container) :
        SelectorEngine.children(container, Selector.ACTIVE)

      const active          = activeElements[0]
      const isTransitioning = callback
        && Util.supportsTransitionEnd()
        && (active && active.classList.contains(ClassName.FADE))

      const complete = () => this._transitionComplete(
        element,
        active,
        callback
      )

      if (active && isTransitioning) {
        EventHandler.one(active, Util.TRANSITION_END, complete)
        Util.emulateTransitionEnd(active, TRANSITION_DURATION)
      } else {
        complete()
      }

      if (active) {
        active.classList.remove(ClassName.SHOW)
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(ClassName.ACTIVE)

        const dropdownChild = SelectorEngine.findOne(Selector.DROPDOWN_ACTIVE_CHILD, active.parentNode)
        if (dropdownChild) {
          dropdownChild.classList.remove(ClassName.ACTIVE)
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false)
        }
      }

      element.classList.add(ClassName.ACTIVE)
      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true)
      }

      if (isTransitioning) {
        Util.reflow(element)
        element.classList.add(ClassName.SHOW)
      } else {
        element.classList.remove(ClassName.FADE)
      }

      if (element.parentNode &&
          element.parentNode.classList.contains(ClassName.DROPDOWN_MENU)) {

        const dropdownElement = SelectorEngine.closest(element, Selector.DROPDOWN)
        if (dropdownElement) {
          SelectorEngine.findOne(Selector.DROPDOWN_TOGGLE, dropdownElement).classList.add(ClassName.ACTIVE)
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
        const data = Data.getData(this, DATA_KEY) || new Tab(this)

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
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler.on(document, Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault()

    const data = Data.getData(this, DATA_KEY) || new Tab(this)
    data.show()
  })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  const $ = Util.jQuery
  if (typeof $ !== 'undefined') {
    const JQUERY_NO_CONFLICT = $.fn[NAME]
    $.fn[NAME] = Tab._jQueryInterface
    $.fn[NAME].Constructor = Tab
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT
      return Tab._jQueryInterface
    }
  }

  return Tab

})()

export default Tab
