import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Collapse = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'collapse'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.collapse'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 600

  const Defaults = {
    toggle : true,
    parent : null
  }

  const Event = {
    SHOW   : 'show.bs.collapse',
    SHOWN  : 'shown.bs.collapse',
    HIDE   : 'hide.bs.collapse',
    HIDDEN : 'hidden.bs.collapse',
    CLICK  : 'click.bs.collapse.data-api'
  }

  const ClassName = {
    IN         : 'in',
    COLLAPSE   : 'collapse',
    COLLAPSING : 'collapsing',
    COLLAPSED  : 'collapsed'
  }

  const Dimension = {
    WIDTH  : 'width',
    HEIGHT : 'height'
  }

  const Selector = {
    ACTIVES     : '.panel > .in, .panel > .collapsing',
    DATA_TOGGLE : '[data-toggle="collapse"]'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse {

    constructor(element, config) {

      this._isTransitioning = false
      this._element         = element
      this._config          = $.extend({}, Defaults, config)
      this._triggerArray    = $.makeArray($(
        `[data-toggle="collapse"][href="#${element.id}"],` +
        `[data-toggle="collapse"][data-target="#${element.id}"]`
      ))

      this._parent = this._config.parent ? this._getParent() : null

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray)
      }

      if (this._config.toggle) {
        this.toggle()
      }

    }

    // public

    toggle() {
      if ($(this._element).hasClass(ClassName.IN)) {
        this.hide()
      } else {
        this.show()
      }
    }

    show() {
      if (this._isTransitioning ||
        $(this._element).hasClass(ClassName.IN)) {
        return
      }

      let activesData
      let actives

      if (this._parent) {
        actives = $.makeArray($(Selector.ACTIVES))
        if (!actives.length) {
          actives = null
        }
      }

      if (actives) {
        activesData = $(actives).data(DATA_KEY)
        if (activesData && activesData._isTransitioning) {
          return
        }
      }

      let startEvent = $.Event(Event.SHOW)
      $(this._element).trigger(startEvent)
      if (startEvent.isDefaultPrevented()) {
        return
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives), 'hide')
        if (!activesData) {
          $(actives).data(DATA_KEY, null)
        }
      }

      let dimension = this._getDimension()

      $(this._element)
        .removeClass(ClassName.COLLAPSE)
        .addClass(ClassName.COLLAPSING)

      this._element.style[dimension] = 0
      this._element.setAttribute('aria-expanded', true)

      if (this._triggerArray.length) {
        $(this._triggerArray)
          .removeClass(ClassName.COLLAPSED)
          .attr('aria-expanded', true)
      }

      this.setTransitioning(true)

      let complete = () => {
        $(this._element)
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .addClass(ClassName.IN)

        this._element.style[dimension] = ''

        this.setTransitioning(false)

        $(this._element).trigger(Event.SHOWN)
      }

      if (!Util.supportsTransitionEnd()) {
        complete()
        return
      }

      let scrollSize = 'scroll'
        + (dimension[0].toUpperCase()
        + dimension.slice(1))

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)

      this._element.style[dimension] = this._element[scrollSize] + 'px'
    }

    hide() {
      if (this._isTransitioning ||
        !$(this._element).hasClass(ClassName.IN)) {
        return
      }

      let startEvent = $.Event(Event.HIDE)
      $(this._element).trigger(startEvent)
      if (startEvent.isDefaultPrevented()) {
        return
      }

      let dimension = this._getDimension()
      let offsetDimension = dimension === Dimension.WIDTH ?
        'offsetWidth' : 'offsetHeight'

      this._element.style[dimension] = this._element[offsetDimension] + 'px'

      Util.reflow(this._element)

      $(this._element)
        .addClass(ClassName.COLLAPSING)
        .removeClass(ClassName.COLLAPSE)
        .removeClass(ClassName.IN)

      this._element.setAttribute('aria-expanded', false)

      if (this._triggerArray.length) {
        $(this._triggerArray)
          .addClass(ClassName.COLLAPSED)
          .attr('aria-expanded', false)
      }

      this.setTransitioning(true)

      let complete = () => {
        this.setTransitioning(false)
        $(this._element)
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .trigger(Event.HIDDEN)
      }

      this._element.style[dimension] = 0

      if (!Util.supportsTransitionEnd()) {
        return complete()
      }

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning
    }


    // private

    _getDimension() {
      let hasWidth = $(this._element).hasClass(Dimension.WIDTH)
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT
    }

    _getParent() {
      let parent   = $(this._config.parent)[0]
      let selector =
        `[data-toggle="collapse"][data-parent="${this._config.parent}"]`

      $(parent).find(selector).each((i, element) => {
        this._addAriaAndCollapsedClass(
          Collapse._getTargetFromElement(element),
          [element]
        )
      })

      return parent
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        let isOpen = $(element).hasClass(ClassName.IN)
        element.setAttribute('aria-expanded', isOpen)

        if (triggerArray.length) {
          $(triggerArray)
            .toggleClass(ClassName.COLLAPSED, !isOpen)
            .attr('aria-expanded', isOpen)
        }
      }
    }


    // static

    static _getTargetFromElement(element) {
      let selector = Util.getSelectorFromElement(element)
      return selector ? $(selector)[0] : null
    }

    static _jQueryInterface(config) {
      return this.each(function () {
        let $this   = $(this)
        let data    = $this.data(DATA_KEY)
        let _config = $.extend(
          {},
          Defaults,
          $this.data(),
          typeof config === 'object' && config
        )

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false
        }

        if (!data) {
          data = new Collapse(this, _config)
          $this.data(DATA_KEY, data)
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

  $(document).on(Event.CLICK, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault()

    let target = Collapse._getTargetFromElement(this)

    let data = $(target).data(DATA_KEY)
    let config = data ? 'toggle' : $(this).data()

    Collapse._jQueryInterface.call($(target), config)
  })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Collapse._jQueryInterface
  $.fn[NAME].Constructor = Collapse
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Collapse._jQueryInterface
  }

  return Collapse

})(jQuery)

export default Collapse
