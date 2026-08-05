/**
 * --------------------------------------------------------------------------
 * Bootstrap collapse.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import SelectorEngine from './dom/selector-engine.js'
import type { ComponentConfig } from './util/config.js'
import {
  getElement,
  reflow,
  setAriaAttribute
} from './util/index.js'

/**
 * Constants
 */

const NAME = 'collapse'
const DATA_KEY = 'bs.collapse'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_COLLAPSE = 'collapse'
const CLASS_NAME_COLLAPSING = 'collapsing'
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal'

const WIDTH = 'width'
const HEIGHT = 'height'

const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]'

type CollapseConfig = {
  parent: string | Element | null
}

const Default: CollapseConfig = {
  parent: null
}

const DefaultType = {
  parent: '(null|element)'
}

/**
 * Class definition
 */

class Collapse extends BaseComponent {
  protected declare _config: CollapseConfig
  protected declare _isTransitioning: boolean
  protected declare _triggerArray: HTMLElement[]

  constructor(element?: string | Element | null, config?: Partial<CollapseConfig> | null) {
    super(element, config)

    this._isTransitioning = false
    this._triggerArray = []

    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE)

    for (const elem of toggleList) {
      const selector = SelectorEngine.getSelectorFromElement(elem)
      const filterElement = SelectorEngine.find(selector!)
        .filter(foundElement => foundElement === this._element)

      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem)
      }
    }

    this._initializeChildren()

    if (!this._config.parent) {
      this._setAriaExpanded(this._triggerArray, this._isShown())
    }
  }

  // Getters
  static override get Default(): CollapseConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  toggle(): Promise<void> {
    return this._isShown() ? this.hide() : this.show()
  }

  async show(): Promise<void> {
    if (this._isTransitioning || this._isShown()) {
      return
    }

    let activeChildren: Collapse[] = []

    // find active children
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES)
        .filter(element => element !== this._element)
        .map(element => Collapse.getOrCreateInstance(element))
    }

    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW)
    if (startEvent.defaultPrevented) {
      return
    }

    for (const activeInstance of activeChildren) {
      activeInstance.hide()
    }

    const dimension = this._getDimension()

    this._element.classList.remove(CLASS_NAME_COLLAPSE)
    this._element.classList.add(CLASS_NAME_COLLAPSING)

    this._element.style[dimension] = 0 as unknown as string

    this._setAriaExpanded(this._triggerArray, true)
    this._isTransitioning = true

    const complete = () => {
      this._isTransitioning = false

      this._element.classList.remove(CLASS_NAME_COLLAPSING)
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW)

      this._element.style[dimension] = ''

      EventHandler.trigger(this._element, EVENT_SHOWN)
    }

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
    const scrollSize = `scroll${capitalizedDimension}` as 'scrollWidth' | 'scrollHeight'

    // Register the completion callback first, then set the target size to start the
    // transition. Awaiting here instead would stop the size from ever being applied.
    const transition = this._queueCallback(complete, this._element, true)
    this._element.style[dimension] = `${this._element[scrollSize]}px`

    await transition
  }

  async hide(): Promise<void> {
    if (this._isTransitioning || !this._isShown()) {
      return
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE)
    if (startEvent.defaultPrevented) {
      return
    }

    const dimension = this._getDimension()

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

    reflow(this._element)

    this._element.classList.add(CLASS_NAME_COLLAPSING)
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW)

    for (const trigger of this._triggerArray) {
      const element = SelectorEngine.getElementFromSelector(trigger)

      if (element && !this._isShown(element)) {
        this._setAriaExpanded([trigger], false)
      }
    }

    this._isTransitioning = true

    const complete = () => {
      this._isTransitioning = false
      this._element.classList.remove(CLASS_NAME_COLLAPSING)
      this._element.classList.add(CLASS_NAME_COLLAPSE)
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }

    this._element.style[dimension] = ''

    await this._queueCallback(complete, this._element, true)
  }

  // Private
  protected _isShown(element: HTMLElement = this._element): boolean {
    return element.classList.contains(CLASS_NAME_SHOW)
  }

  protected override _configAfterMerge(config: ComponentConfig): ComponentConfig {
    config.parent = getElement(config.parent)
    return config
  }

  protected _getDimension(): 'width' | 'height' {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT
  }

  protected _initializeChildren(): void {
    if (!this._config.parent) {
      return
    }

    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE)

    for (const element of children) {
      const selected = SelectorEngine.getElementFromSelector(element)

      if (selected) {
        this._setAriaExpanded([element], this._isShown(selected))
      }
    }
  }

  protected _getFirstLevelChildren(selector: string): HTMLElement[] {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent as HTMLElement)
    // remove children if greater depth
    return SelectorEngine.find(selector, this._config.parent as HTMLElement).filter(element => !children.includes(element))
  }

  protected _setAriaExpanded(triggerArray: HTMLElement[], isOpen: boolean): void {
    if (!triggerArray.length) {
      return
    }

    for (const element of triggerArray) {
      setAriaAttribute(element, 'aria-expanded', isOpen)
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if ((event.target as Element).tagName === 'A' || (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
    event.preventDefault()
  }

  for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
    Collapse.getOrCreateInstance(element).toggle()
  }
})

export default Collapse
export type { CollapseConfig }
