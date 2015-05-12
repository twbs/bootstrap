import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const ScrollSpy = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME               = 'scrollspy'
  const VERSION            = '4.0.0'
  const DATA_KEY           = 'bs.scrollspy'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {
    offset : 10
  }

  const Event = {
    ACTIVATE : 'activate.bs.scrollspy',
    SCROLL   : 'scroll.bs.scrollspy',
    LOAD     : 'load.bs.scrollspy.data-api'
  }

  const ClassName = {
    DROPDOWN_MENU : 'dropdown-menu',
    ACTIVE        : 'active'
  }

  const Selector = {
    DATA_SPY    : '[data-spy="scroll"]',
    ACTIVE      : '.active',
    LI_DROPDOWN : 'li.dropdown',
    LI          : 'li'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy {

    constructor(element, config) {
      this._scrollElement = element.tagName === 'BODY' ? window : element
      this._config        = $.extend({}, Defaults, config)
      this._selector      = `${this._config.target || ''} .nav li > a`
      this._offsets       = []
      this._targets       = []
      this._activeTarget  = null
      this._scrollHeight  = 0

      $(this._scrollElement).on(Event.SCROLL, this._process.bind(this))

      this.refresh()
      this._process()
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }


    // public

    refresh() {
      let offsetMethod = 'offset'
      let offsetBase   = 0

      if (this._scrollElement !== this._scrollElement.window) {
        offsetMethod = 'position'
        offsetBase   = this._getScrollTop()
      }

      this._offsets = []
      this._targets = []

      this._scrollHeight = this._getScrollHeight()

      let targets = $.makeArray($(this._selector))

      targets
        .map((element) => {
          let target
          let targetSelector = Util.getSelectorFromElement(element)

          if (targetSelector) {
            target = $(targetSelector)[0]
          }

          if (target && (target.offsetWidth || target.offsetHeight)) {
            // todo (fat): remove sketch reliance on jQuery position/offset
            return [
              $(target)[offsetMethod]().top + offsetBase,
              targetSelector
            ]
          }
        })
        .filter((item)  => item)
        .sort((a, b)    => a[0] - b[0])
        .forEach((item) => {
          this._offsets.push(item[0])
          this._targets.push(item[1])
        })
    }


    // private

    _getScrollTop() {
      return this._scrollElement === window ?
          this._scrollElement.scrollY : this._scrollElement.scrollTop
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
    }

    _process() {
      let scrollTop    = this._getScrollTop() + this._config.offset
      let scrollHeight = this._getScrollHeight()
      let maxScroll    = this._config.offset
        + scrollHeight
        - this._scrollElement.offsetHeight

      if (this._scrollHeight !== scrollHeight) {
        this.refresh()
      }

      if (scrollTop >= maxScroll) {
        let target = this._targets[this._targets.length - 1]

        if (this._activeTarget !== target) {
          this._activate(target)
        }
      }

      if (this._activeTarget && scrollTop < this._offsets[0]) {
        this._activeTarget = null
        this._clear()
        return
      }

      for (let i = this._offsets.length; i--;) {
        let isActiveTarget = this._activeTarget !== this._targets[i]
            && scrollTop >= this._offsets[i]
            && (this._offsets[i + 1] === undefined ||
                scrollTop < this._offsets[i + 1])

        if (isActiveTarget) {
          this._activate(this._targets[i])
        }
      }
    }

    _activate(target) {
      this._activeTarget = target

      this._clear()

      let selector =
        `${this._selector}[data-target="${target}"],` +
        `${this._selector}[href="${target}"]`

      // todo (fat): getting all the raw li's up the tree is not great.
      let parentListItems = $(selector).parents(Selector.LI)

      for (let i = parentListItems.length; i--;) {
        $(parentListItems[i]).addClass(ClassName.ACTIVE)

        let itemParent = parentListItems[i].parentNode

        if (itemParent && $(itemParent).hasClass(ClassName.DROPDOWN_MENU)) {
          let closestDropdown = $(itemParent)
            .closest(Selector.LI_DROPDOWN)[0]
          $(closestDropdown).addClass(ClassName.ACTIVE)
        }
      }

      $(this._scrollElement).trigger(Event.ACTIVATE, {
        relatedTarget: target
      })
    }

    _clear() {
      let activeParents = $(this._selector).parentsUntil(
        this._config.target,
        Selector.ACTIVE
      )

      for (let i = activeParents.length; i--;) {
        $(activeParents[i]).removeClass(ClassName.ACTIVE)
      }
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data    = $(this).data(DATA_KEY)
        let _config = typeof config === 'object' && config || null

        if (!data) {
          data = new ScrollSpy(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
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

  $(window).on(Event.LOAD, function () {
    let scrollSpys = $.makeArray($(Selector.DATA_SPY))

    for (let i = scrollSpys.length; i--;) {
      let $spy = $(scrollSpys[i])
      ScrollSpy._jQueryInterface.call($spy, $spy.data())
    }
  })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = ScrollSpy._jQueryInterface
  $.fn[NAME].Constructor = ScrollSpy
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return ScrollSpy._jQueryInterface
  }

  return ScrollSpy

})(jQuery)

export default ScrollSpy
