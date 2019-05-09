/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  jQuery as $,
  TRANSITION_END,
  emulateTransitionEnd,
  getSelectorFromElement,
  getTransitionDurationFromElement,
  isElement,
  makeArray,
  reflow,
  typeCheckConfig
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'collapse'
const VERSION = '4.3.1'
const DATA_KEY = 'bs.collapse'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const Default = {
  toggle: true,
  parent: ''
}

const DefaultType = {
  toggle: 'boolean',
  parent: '(string|element)'
}

const Event = {
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {
  SHOW: 'show',
  COLLAPSE: 'collapse',
  COLLAPSING: 'collapsing',
  COLLAPSED: 'collapsed'
}

const Dimension = {
  WIDTH: 'width',
  HEIGHT: 'height'
}

const Selector = {
  ACTIVES: '.show, .collapsing',
  DATA_TOGGLE: '[data-toggle="collapse"]'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse {
  constructor(element, config) {
    this._isTransitioning = false
    this._element = element
    this._config = this._getConfig(config)
    this._triggerArray = makeArray(SelectorEngine.find(
      `[data-toggle="collapse"][href="#${element.id}"],` +
      `[data-toggle="collapse"][data-target="#${element.id}"]`
    ))

    const toggleList = makeArray(SelectorEngine.find(Selector.DATA_TOGGLE))
    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i]
      const selector = getSelectorFromElement(elem)
      const filterElement = makeArray(SelectorEngine.find(selector))
        .filter(foundElem => foundElem === element)

      if (selector !== null && filterElement.length) {
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

    Data.setData(element, DATA_KEY, this)
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
    if (this._element.classList.contains(ClassName.SHOW)) {
      this.hide()
    } else {
      this.show()
    }
  }

  show() {
    if (this._isTransitioning ||
      this._element.classList.contains(ClassName.SHOW)) {
      return
    }

    let actives
    let activesData

    if (this._parent) {
      actives = makeArray(SelectorEngine.find(Selector.ACTIVES, this._parent))
        .filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === this._config.parent
          }

          return elem.classList.contains(ClassName.COLLAPSE)
        })

      if (actives.length === 0) {
        actives = null
      }
    }

    const container = SelectorEngine.findOne(this._selector)
    if (actives) {
      const tempActiveData = actives.filter(elem => container !== elem)
      activesData = tempActiveData[0] ? Data.getData(tempActiveData[0], DATA_KEY) : null

      if (activesData && activesData._isTransitioning) {
        return
      }
    }

    const startEvent = EventHandler.trigger(this._element, Event.SHOW)
    if (startEvent.defaultPrevented) {
      return
    }

    if (actives) {
      actives.forEach(elemActive => {
        if (container !== elemActive) {
          Collapse._collapseInterface(elemActive, 'hide')
        }

        if (!activesData) {
          Data.setData(elemActive, DATA_KEY, null)
        }
      })
    }

    const dimension = this._getDimension()

    this._element.classList.remove(ClassName.COLLAPSE)
    this._element.classList.add(ClassName.COLLAPSING)

    this._element.style[dimension] = 0

    if (this._triggerArray.length) {
      this._triggerArray.forEach(element => {
        element.classList.remove(ClassName.COLLAPSED)
        element.setAttribute('aria-expanded', true)
      })
    }

    this.setTransitioning(true)

    const complete = () => {
      this._element.classList.remove(ClassName.COLLAPSING)
      this._element.classList.add(ClassName.COLLAPSE)
      this._element.classList.add(ClassName.SHOW)

      this._element.style[dimension] = ''

      this.setTransitioning(false)

      EventHandler.trigger(this._element, Event.SHOWN)
    }

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
    const scrollSize = `scroll${capitalizedDimension}`
    const transitionDuration = getTransitionDurationFromElement(this._element)

    EventHandler.one(this._element, TRANSITION_END, complete)

    emulateTransitionEnd(this._element, transitionDuration)
    this._element.style[dimension] = `${this._element[scrollSize]}px`
  }

  hide() {
    if (this._isTransitioning ||
      !this._element.classList.contains(ClassName.SHOW)) {
      return
    }

    const startEvent = EventHandler.trigger(this._element, Event.HIDE)
    if (startEvent.defaultPrevented) {
      return
    }

    const dimension = this._getDimension()

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

    reflow(this._element)

    this._element.classList.add(ClassName.COLLAPSING)
    this._element.classList.remove(ClassName.COLLAPSE)
    this._element.classList.remove(ClassName.SHOW)

    const triggerArrayLength = this._triggerArray.length
    if (triggerArrayLength > 0) {
      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i]
        const selector = getSelectorFromElement(trigger)

        if (selector !== null) {
          const elem = SelectorEngine.findOne(selector)

          if (!elem.classList.contains(ClassName.SHOW)) {
            trigger.classList.add(ClassName.COLLAPSED)
            trigger.setAttribute('aria-expanded', false)
          }
        }
      }
    }

    this.setTransitioning(true)

    const complete = () => {
      this.setTransitioning(false)
      this._element.classList.remove(ClassName.COLLAPSING)
      this._element.classList.add(ClassName.COLLAPSE)
      EventHandler.trigger(this._element, Event.HIDDEN)
    }

    this._element.style[dimension] = ''
    const transitionDuration = getTransitionDurationFromElement(this._element)

    EventHandler.one(this._element, TRANSITION_END, complete)
    emulateTransitionEnd(this._element, transitionDuration)
  }

  setTransitioning(isTransitioning) {
    this._isTransitioning = isTransitioning
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)

    this._config = null
    this._parent = null
    this._element = null
    this._triggerArray = null
    this._isTransitioning = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    config.toggle = Boolean(config.toggle) // Coerce string values
    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _getDimension() {
    const hasWidth = this._element.classList.contains(Dimension.WIDTH)
    return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT
  }

  _getParent() {
    let { parent } = this._config

    if (isElement(parent)) {
      // it's a jQuery object
      if (typeof parent.jquery !== 'undefined' || typeof parent[0] !== 'undefined') {
        parent = parent[0]
      }
    } else {
      parent = SelectorEngine.findOne(parent)
    }

    const selector = `[data-toggle="collapse"][data-parent="${parent}"]`

    makeArray(SelectorEngine.find(selector, parent))
      .forEach(element => {
        this._addAriaAndCollapsedClass(
          Collapse._getTargetFromElement(element),
          [element]
        )
      })

    return parent
  }

  _addAriaAndCollapsedClass(element, triggerArray) {
    if (element) {
      const isOpen = element.classList.contains(ClassName.SHOW)

      if (triggerArray.length) {
        triggerArray.forEach(elem => {
          if (isOpen) {
            elem.classList.remove(ClassName.COLLAPSED)
          } else {
            elem.classList.add(ClassName.COLLAPSED)
          }

          elem.setAttribute('aria-expanded', isOpen)
        })
      }
    }
  }

  // Static

  static _getTargetFromElement(element) {
    const selector = getSelectorFromElement(element)
    return selector ? SelectorEngine.findOne(selector) : null
  }

  static _collapseInterface(element, config) {
    let data = Data.getData(element, DATA_KEY)
    const _config = {
      ...Default,
      ...Manipulator.getDataAttributes(element),
      ...typeof config === 'object' && config ? config : {}
    }

    if (!data && _config.toggle && /show|hide/.test(config)) {
      _config.toggle = false
    }

    if (!data) {
      data = new Collapse(element, _config)
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config]()
    }
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      Collapse._collapseInterface(this, config)
    })
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

EventHandler.on(document, Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A') {
    event.preventDefault()
  }

  const triggerData = Manipulator.getDataAttributes(this)
  const selector = getSelectorFromElement(this)
  const selectorElements = makeArray(SelectorEngine.find(selector))

  selectorElements.forEach(element => {
    const data = Data.getData(element, DATA_KEY)
    let config
    if (data) {
      // update parent attribute
      if (data._parent === null && typeof triggerData.parent === 'string') {
        data._config.parent = triggerData.parent
        data._parent = data._getParent()
      }

      config = 'toggle'
    } else {
      config = triggerData
    }

    Collapse._collapseInterface(element, config)
  })
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .collapse to jQuery only if jQuery is present
 */

if (typeof $ !== 'undefined') {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Collapse._jQueryInterface
  $.fn[NAME].Constructor = Collapse
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Collapse._jQueryInterface
  }
}

export default Collapse
