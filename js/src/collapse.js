/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.2): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                = 'collapse'
const VERSION             = '4.5.2'
const DATA_KEY            = 'bs.collapse'
const EVENT_KEY           = `.${DATA_KEY}`
const DATA_API_KEY        = '.data-api'
const JQUERY_NO_CONFLICT  = $.fn[NAME]

const Default = {
  toggle : true,
  parent : ''
}

const DefaultType = {
  toggle : 'boolean',
  parent : '(string|element)'
}

const EVENT_SHOW           = `show${EVENT_KEY}`
const EVENT_SHOWN          = `shown${EVENT_KEY}`
const EVENT_HIDE           = `hide${EVENT_KEY}`
const EVENT_HIDDEN         = `hidden${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW       = 'show'
const CLASS_NAME_COLLAPSE   = 'collapse'
const CLASS_NAME_COLLAPSING = 'collapsing'
const CLASS_NAME_COLLAPSED  = 'collapsed'

const DIMENSION_WIDTH  = 'width'
const DIMENSION_HEIGHT = 'height'

const SELECTOR_ACTIVES     = '.show, .collapsing'
const SELECTOR_DATA_TOGGLE = '[data-toggle="collapse"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse {
  constructor(element, config) {
    this._isTransitioning = false
    this._element         = element
    this._config          = this._getConfig(config)
    this._triggerArray    = [].slice.call(document.querySelectorAll(
      `[data-toggle="collapse"][href="#${element.id}"],` +
      `[data-toggle="collapse"][data-target="#${element.id}"]`
    ))

    const toggleList = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))
    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i]
      const selector = Util.getSelectorFromElement(elem)
      const filterElement = [].slice.call(document.querySelectorAll(selector))
        .filter((foundElem) => foundElem === element)

      if (selector !== null && filterElement.length > 0) {
        this._selector = selector
        this._triggerArray.push(elem)
      }
    }

    this._parent = this._config.parent ? this._getParent() : null

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._element, this._triggerArray)
    }

    if (this._config.toggle) {
      this.toggle()
    }
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  toggle() {
    if ($(this._element).hasClass(CLASS_NAME_SHOW)) {
      this.hide()
    } else {
      this.show()
    }
  }

  show() {
    if (this._isTransitioning ||
      $(this._element).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    let actives
    let activesData

    if (this._parent) {
      actives = [].slice.call(this._parent.querySelectorAll(SELECTOR_ACTIVES))
        .filter((elem) => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === this._config.parent
          }

          return elem.classList.contains(CLASS_NAME_COLLAPSE)
        })

      if (actives.length === 0) {
        actives = null
      }
    }

    if (actives) {
      activesData = $(actives).not(this._selector).data(DATA_KEY)
      if (activesData && activesData._isTransitioning) {
        return
      }
    }

    const startEvent = $.Event(EVENT_SHOW)
    $(this._element).trigger(startEvent)
    if (startEvent.isDefaultPrevented()) {
      return
    }

    if (actives) {
      Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide')
      if (!activesData) {
        $(actives).data(DATA_KEY, null)
      }
    }

    const dimension = this._getDimension()

    $(this._element)
      .removeClass(CLASS_NAME_COLLAPSE)
      .addClass(CLASS_NAME_COLLAPSING)

    this._element.style[dimension] = 0

    if (this._triggerArray.length) {
      $(this._triggerArray)
        .removeClass(CLASS_NAME_COLLAPSED)
        .attr('aria-expanded', true)
    }

    this.setTransitioning(true)

    const complete = () => {
      $(this._element)
        .removeClass(CLASS_NAME_COLLAPSING)
        .addClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW}`)

      this._element.style[dimension] = ''

      this.setTransitioning(false)

      $(this._element).trigger(EVENT_SHOWN)
    }

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
    const scrollSize = `scroll${capitalizedDimension}`
    const transitionDuration = Util.getTransitionDurationFromElement(this._element)

    $(this._element)
      .one(Util.TRANSITION_END, complete)
      .emulateTransitionEnd(transitionDuration)

    this._element.style[dimension] = `${this._element[scrollSize]}px`
  }

  hide() {
    if (this._isTransitioning ||
      !$(this._element).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    const startEvent = $.Event(EVENT_HIDE)
    $(this._element).trigger(startEvent)
    if (startEvent.isDefaultPrevented()) {
      return
    }

    const dimension = this._getDimension()

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

    Util.reflow(this._element)

    $(this._element)
      .addClass(CLASS_NAME_COLLAPSING)
      .removeClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW}`)

    const triggerArrayLength = this._triggerArray.length
    if (triggerArrayLength > 0) {
      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i]
        const selector = Util.getSelectorFromElement(trigger)

        if (selector !== null) {
          const $elem = $([].slice.call(document.querySelectorAll(selector)))
          if (!$elem.hasClass(CLASS_NAME_SHOW)) {
            $(trigger).addClass(CLASS_NAME_COLLAPSED)
              .attr('aria-expanded', false)
          }
        }
      }
    }

    this.setTransitioning(true)

    const complete = () => {
      this.setTransitioning(false)
      $(this._element)
        .removeClass(CLASS_NAME_COLLAPSING)
        .addClass(CLASS_NAME_COLLAPSE)
        .trigger(EVENT_HIDDEN)
    }

    this._element.style[dimension] = ''
    const transitionDuration = Util.getTransitionDurationFromElement(this._element)

    $(this._element)
      .one(Util.TRANSITION_END, complete)
      .emulateTransitionEnd(transitionDuration)
  }

  setTransitioning(isTransitioning) {
    this._isTransitioning = isTransitioning
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)

    this._config          = null
    this._parent          = null
    this._element         = null
    this._triggerArray    = null
    this._isTransitioning = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    config.toggle = Boolean(config.toggle) // Coerce string values
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _getDimension() {
    const hasWidth = $(this._element).hasClass(DIMENSION_WIDTH)
    return hasWidth ? DIMENSION_WIDTH : DIMENSION_HEIGHT
  }

  _getParent() {
    let parent

    if (Util.isElement(this._config.parent)) {
      parent = this._config.parent

      // It's a jQuery object
      if (typeof this._config.parent.jquery !== 'undefined') {
        parent = this._config.parent[0]
      }
    } else {
      parent = document.querySelector(this._config.parent)
    }

    const selector = `[data-toggle="collapse"][data-parent="${this._config.parent}"]`
    const children = [].slice.call(parent.querySelectorAll(selector))

    $(children).each((i, element) => {
      this._addAriaAndCollapsedClass(
        Collapse._getTargetFromElement(element),
        [element]
      )
    })

    return parent
  }

  _addAriaAndCollapsedClass(element, triggerArray) {
    const isOpen = $(element).hasClass(CLASS_NAME_SHOW)

    if (triggerArray.length) {
      $(triggerArray)
        .toggleClass(CLASS_NAME_COLLAPSED, !isOpen)
        .attr('aria-expanded', isOpen)
    }
  }

  // Static

  static _getTargetFromElement(element) {
    const selector = Util.getSelectorFromElement(element)
    return selector ? document.querySelector(selector) : null
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      const $this   = $(this)
      let data      = $this.data(DATA_KEY)
      const _config = {
        ...Default,
        ...$this.data(),
        ...typeof config === 'object' && config ? config : {}
      }

      if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false
      }

      if (!data) {
        data = new Collapse(this, _config)
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
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.currentTarget.tagName === 'A') {
    event.preventDefault()
  }

  const $trigger = $(this)
  const selector = Util.getSelectorFromElement(this)
  const selectors = [].slice.call(document.querySelectorAll(selector))

  $(selectors).each(function () {
    const $target = $(this)
    const data    = $target.data(DATA_KEY)
    const config  = data ? 'toggle' : $trigger.data()
    Collapse._jQueryInterface.call($target, config)
  })
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Collapse._jQueryInterface
$.fn[NAME].Constructor = Collapse
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Collapse._jQueryInterface
}

export default Collapse
