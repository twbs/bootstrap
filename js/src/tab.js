import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Tab = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tab'
  const VERSION             = '4.0.0-alpha.6'
  const DATA_KEY            = 'bs.tab'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150

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
  const SELECTOR_LIST = 'ul:not(.dropdown-menu), ol:not(.dropdown-menu), nav:not(.dropdown-menu)'
  const SELECTOR_FADE_CHILD = '> .nav-item .fade, > .fade'
  const SELECTOR_ACTIVE = '.active'
  const SELECTOR_ACTIVE_CHILD = '> .nav-item > .active, > .active'
  const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"]'
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active'


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    show() {
      if (this._element.parentNode &&
          this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
          $(this._element).hasClass(CLASS_NAME_ACTIVE) ||
          $(this._element).hasClass(CLASS_NAME_DISABLED)) {
        return
      }

      let target
      let previous
      const listElement = $(this._element).closest(SELECTOR_LIST)[0]
      const selector    = Util.getSelectorFromElement(this._element)

      if (listElement) {
        previous = $.makeArray($(listElement).find(SELECTOR_ACTIVE))
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
        target = $(selector)[0]
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
      $.removeClass(this._element, DATA_KEY)
      this._element = null
    }


    // private

    _activate(element, container, callback) {
      const active          = $(container).find(SELECTOR_ACTIVE_CHILD)[0]
      const isTransitioning = callback
        && Util.supportsTransitionEnd()
        && (active && $(active).hasClass(CLASS_NAME_FADE)
           || Boolean($(container).find(SELECTOR_FADE_CHILD)[0]))

      const complete = () => this._transitionComplete(
        element,
        active,
        isTransitioning,
        callback
      )

      if (active && isTransitioning) {
        $(active)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(TRANSITION_DURATION)

      } else {
        complete()
      }

      if (active) {
        $(active).removeClass(CLASS_NAME_SHOW)
      }
    }

    _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(CLASS_NAME_ACTIVE)

        const dropdownChild = $(active.parentNode).find(
          SELECTOR_DROPDOWN_ACTIVE_CHILD
        )[0]

        if (dropdownChild) {
          $(dropdownChild).removeClass(CLASS_NAME_ACTIVE)
        }

        active.setAttribute('aria-expanded', false)
      }

      $(element).addClass(CLASS_NAME_ACTIVE)
      element.setAttribute('aria-expanded', true)

      if (isTransitioning) {
        Util.reflow(element)
        $(element).addClass(CLASS_NAME_SHOW)
      } else {
        $(element).removeClass(CLASS_NAME_FADE)
      }

      if (element.parentNode &&
          $(element.parentNode).hasClass(CLASS_NAME_DROPDOWN_MENU)) {

        const dropdownElement = $(element).closest(SELECTOR_DROPDOWN)[0]
        if (dropdownElement) {
          $(dropdownElement).find(SELECTOR_DROPDOWN_TOGGLE).addClass(CLASS_NAME_ACTIVE)
        }

        element.setAttribute('aria-expanded', true)
      }

      if (callback) {
        callback()
      }
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $(this)
        let data    = $this.data(DATA_KEY)

        if (!data) {
          data = new Tab(this)
          $this.data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
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

  $(document)
    .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      event.preventDefault()
      Tab._jQueryInterface.call($(this), 'show')
    })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Tab._jQueryInterface
  $.fn[NAME].Constructor = Tab
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tab._jQueryInterface
  }

  return Tab

})(jQuery)

export default Tab
