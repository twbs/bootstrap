import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.2): tab.js
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
  const VERSION             = '4.0.0-alpha.2'
  const DATA_KEY            = 'bs.tab'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
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
    FADE          : 'fade',
    IN            : 'in'
  }

  const Selector = {
    A                     : 'a',
    LI                    : 'li',
    DROPDOWN              : '.dropdown',
    UL                    : 'ul:not(.dropdown-menu)',
    FADE_CHILD            : '> .nav-item .fade, > .fade',
    ACTIVE                : '.active',
    ACTIVE_CHILD          : '> .nav-item > .active, > .active',
    DATA_TOGGLE           : '[data-toggle="tab"], [data-toggle="pill"]',
    DROPDOWN_TOGGLE       : '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD : '> .dropdown-menu .active'
  }


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
         (this._element.parentNode.nodeType === Node.ELEMENT_NODE) &&
         ($(this._element).hasClass(ClassName.ACTIVE))) {
        return
      }

      let target
      let previous
      let ulElement = $(this._element).closest(Selector.UL)[0]
      let selector  = Util.getSelectorFromElement(this._element)

      if (ulElement) {
        previous = $.makeArray($(ulElement).find(Selector.ACTIVE))
        previous = previous[previous.length - 1]
      }

      let hideEvent = $.Event(Event.HIDE, {
        relatedTarget: this._element
      })

      let showEvent = $.Event(Event.SHOW, {
        relatedTarget: previous
      })

      if (previous) {
        $(previous).trigger(hideEvent)
      }

      $(this._element).trigger(showEvent)

      if (showEvent.isDefaultPrevented() ||
         (hideEvent.isDefaultPrevented())) {
        return
      }

      if (selector) {
        target = $(selector)[0]
      }

      this._activate(
        this._element,
        ulElement
      )

      let complete = () => {
        let hiddenEvent = $.Event(Event.HIDDEN, {
          relatedTarget: this._element
        })

        let shownEvent  = $.Event(Event.SHOWN, {
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
      let active          = $(container).find(Selector.ACTIVE_CHILD)[0]
      let isTransitioning = callback
        && Util.supportsTransitionEnd()
        && ((active && $(active).hasClass(ClassName.FADE))
           || Boolean($(container).find(Selector.FADE_CHILD)[0]))

      let complete = $.proxy(
        this._transitionComplete,
        this,
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
        $(active).removeClass(ClassName.IN)
      }
    }

    _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName.ACTIVE)

        let dropdownChild = $(active).find(
          Selector.DROPDOWN_ACTIVE_CHILD
        )[0]

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName.ACTIVE)
        }

        active.setAttribute('aria-expanded', false)
      }

      $(element).addClass(ClassName.ACTIVE)
      element.setAttribute('aria-expanded', true)

      if (isTransitioning) {
        Util.reflow(element)
        $(element).addClass(ClassName.IN)
      } else {
        $(element).removeClass(ClassName.FADE)
      }

      if (element.parentNode &&
         ($(element.parentNode).hasClass(ClassName.DROPDOWN_MENU))) {

        let dropdownElement = $(element).closest(Selector.DROPDOWN)[0]
        if (dropdownElement) {
          $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE)
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
        let $this = $(this)
        let data  = $this.data(DATA_KEY)

        if (!data) {
          data = data = new Tab(this)
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
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
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
