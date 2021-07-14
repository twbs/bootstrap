/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.2): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElementFromSelector,
  getNextActiveElement,
  isDisabled,
  reflow
} from './util/index'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'
import BaseComponent from './base-component'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tab'
const DATA_KEY = 'bs.tab'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const ARROW_LEFT_KEY = 'ArrowLeft'
const ARROW_RIGHT_KEY = 'ArrowRight'

const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'
const CLASS_DROPDOWN = 'dropdown'

const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu'
const SELECTOR_DROPDOWN_ITEM = '.dropdown-item'
const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)'

const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]'
const SELECTOR_OUTER = '.nav-item, .list-group-item'
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`
const SELECTOR_INNER_ELEM_TWO_LEVELS = `:scope > * > ${SELECTOR_INNER_ELEM}`
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element)
    this._parent = this._element.closest(SELECTOR_TAB_PANEL)
    if (this._parent === undefined) {
      throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    }

    this._setInitialAttributes(this._parent, this._getChildren())// Set aria attributes

    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event))
  }

  // Getters

  static get NAME() {
    return NAME
  }

  // Public

  show() { // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element
    if (Tab._elemIsActive(innerElem)) {
      return
    }

    // Search for active tab on same parent to deactivate it
    const active = this._getActiveElem() || null

    const hideEvent = active ?
      EventHandler.trigger(active, EVENT_HIDE, {
        relatedTarget: innerElem
      }) :
      null

    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW, {
      relatedTarget: active
    })

    if (showEvent.defaultPrevented || (hideEvent && hideEvent.defaultPrevented)) {
      return
    }

    this._deActivate(active, innerElem)
    this._activate(innerElem, active)
  }

  // Private

  _activate(element, relatedElem) {
    if (!element) {
      return
    }

    element.focus()
    if (element.classList.contains(CLASS_NAME_FADE)) {
      element.classList.add(CLASS_NAME_SHOW)
    }

    this._activate(getElementFromSelector(element)) // Search and activate/show the proper section

    const complete = () => {
      element.classList.add(CLASS_NAME_ACTIVE)

      if (element.getAttribute('role') !== 'tab') {
        return
      }

      element.removeAttribute('tabindex')
      element.setAttribute('aria-selected', true)
      this._toggleDropDown(element, true)
      EventHandler.trigger(element, EVENT_SHOWN, {
        relatedTarget: relatedElem
      })
      reflow(element)
    }

    const isTransitioning = element.classList.contains(CLASS_NAME_FADE)
    this._queueCallback(complete, element, isTransitioning)
  }

  _deActivate(element, relatedElem) {
    if (!element) {
      return
    }

    element.classList.remove(CLASS_NAME_SHOW)
    element.blur()

    this._deActivate(getElementFromSelector(element))// Search and deactivate the shown section too

    const complete = () => {
      element.classList.remove(CLASS_NAME_ACTIVE)

      if (element.getAttribute('role') !== 'tab') {
        return
      }

      element.setAttribute('aria-selected', false)
      element.setAttribute('tabindex', '-1')
      this._toggleDropDown(element, false)
      EventHandler.trigger(element, EVENT_HIDDEN, {
        relatedTarget: relatedElem
      })
    }

    const isTransitioning = element.classList.contains(CLASS_NAME_FADE)
    this._queueCallback(complete, element, isTransitioning)
  }

  _keydown(event) {
    if (!([ARROW_LEFT_KEY, ARROW_RIGHT_KEY].includes(event.key))) {
      return
    }

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault()
    }

    const children = this._getChildren()

    const nextActiveElement = getNextActiveElement(children, event.target, event.key === ARROW_RIGHT_KEY, true)
    Tab.getOrCreateInstance(nextActiveElement).show()
  }

  _getChildren() { // collection of inner elements
    const children = SelectorEngine.children(this._parent, SELECTOR_INNER_ELEM)
    return children.length ? children : SelectorEngine.find(SELECTOR_INNER_ELEM_TWO_LEVELS, this._parent)
  }

  _getActiveElem() {
    return this._getChildren().find(child => Tab._elemIsActive(child)) || null
  }

  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist')

    children.forEach(child => {
      this._setInitialAttributesOnChild(child)
    })
  }

  _setInitialAttributesOnChild(child) {
    child = Tab._getInnerElement(child)
    const isActive = Tab._elemIsActive(child)
    const outerElem = Tab._getOuterElement(child)
    child.setAttribute('aria-selected', isActive)

    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation')
    }

    if (!isActive) {
      child.setAttribute('tabindex', '-1')
    }

    this._setAttributeIfNotExists(child, 'role', 'tab')

    // set attributes to the related panel too
    this._setInitialAttributesOnTargetPanel(child)
  }

  _setInitialAttributesOnTargetPanel(child) {
    const target = getElementFromSelector(child)

    if (!target) {
      return
    }

    this._setAttributeIfNotExists(target, 'tabindex', '0')
    this._setAttributeIfNotExists(target, 'role', 'tabpanel')

    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `#${child.id}`)
    }
  }

  _toggleDropDown(element, open) {
    const outerElem = Tab._getOuterElement(element)
    // Maybe use bootstrap.Dropdown??
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return
    }

    const toggle = (selector, className) => {
      const dropElem = SelectorEngine.findOne(selector, outerElem)

      if (dropElem) {
        return open ? dropElem.classList.add(className) : dropElem.classList.remove(className)
      }
    }

    //  maybe use Dropdown class?
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE)
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW)
    toggle(SELECTOR_DROPDOWN_ITEM, CLASS_NAME_ACTIVE)
    outerElem.setAttribute('aria-expanded', open)
  }

  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value)
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this)

      if (typeof config !== 'string') {
        return
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config]()
    })
  }

  static _getInnerElement(elem) { // Try to get the inner element (usually the .nav-link)
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem)
  }

  static _getOuterElement(elem) {// Try to get the outer element (usually the .nav-item)
    return elem.closest(SELECTOR_OUTER) || elem
  }

  static _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  if (isDisabled(this) || isDisabled(Tab._getOuterElement(this))) {
    return
  }

  const data = Tab.getOrCreateInstance(this)
  data.show(this)
})

/**
 * ------------------------------------------------------------------------
 * Initialize on focus
 * ------------------------------------------------------------------------
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE).forEach(el => Tab.getOrCreateInstance(el))
})
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tab to jQuery only if jQuery is present
 */

defineJQueryPlugin(Tab)

export default Tab
