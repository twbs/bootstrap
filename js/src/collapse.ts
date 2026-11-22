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
import { enableHashTarget } from './util/hash-target.js'
import {
  getElement,
  getTransitionDurationFromElement,
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

const CLASS_NAME_HORIZONTAL = 'collapse-horizontal'
const CLASS_NAME_CLOSING = 'collapse-closing'
const SELECTOR_COLLAPSE = 'details.collapse'
const SELECTOR_ACTIVES = `${SELECTOR_COLLAPSE}[open]:not(.${CLASS_NAME_CLOSING})`
const SELECTOR_DEEPER_CHILDREN = `:scope ${SELECTOR_COLLAPSE} ${SELECTOR_COLLAPSE}`
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]'
const SELECTOR_SUMMARY_CONTROL = `a[href], button, input, select, textarea, label, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), ${SELECTOR_DATA_TOGGLE}`
const DETAILS_CONTENT = '::details-content'

const isCollapse = (element: Element | null): element is HTMLDetailsElement =>
  element?.matches(SELECTOR_COLLAPSE) ?? false

const isShown = (element: HTMLDetailsElement): boolean =>
  element.open && !element.classList.contains(CLASS_NAME_CLOSING)

const getCollapseTargets = (trigger: Element): HTMLDetailsElement[] => {
  try {
    return SelectorEngine.getMultipleElementsFromSelector(trigger).filter(isCollapse)
  } catch (error) {
    // A malformed selector must not block other Collapse controls.
    if (error instanceof DOMException && error.name === 'SyntaxError') {
      return []
    }

    throw error
  }
}

const getCollapseTriggers = (element: HTMLDetailsElement): HTMLElement[] =>
  SelectorEngine.find(SELECTOR_DATA_TOGGLE).filter(trigger => getCollapseTargets(trigger).includes(element))

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
  protected declare _element: HTMLDetailsElement
  protected declare _config: CollapseConfig
  protected declare _isTransitioning: boolean
  protected declare _triggerArray: HTMLElement[]

  constructor(element?: string | Element | null, config?: Partial<CollapseConfig> | null) {
    const target = getElement(element)
    if (!isCollapse(target)) {
      throw new TypeError('COLLAPSE: Expected a <details class="collapse"> element.')
    }

    super(target, config)

    this._isTransitioning = false
    this._triggerArray = getCollapseTriggers(this._element)

    this._initializeChildren()

    if (!this._config.parent) {
      this._syncTriggers()
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
  override dispose(): void {
    this._finishClose()
    super.dispose()
  }

  toggle(): Promise<void> {
    return this._element.open ? this.hide() : this.show()
  }

  async show(): Promise<void> {
    if (this._isTransitioning || this._element.open) {
      return
    }

    let activeChildren: Collapse[] = []

    // find active children
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren<HTMLDetailsElement>(SELECTOR_ACTIVES)
        .filter(element => element !== this._element && !this._sharesTrigger(element))
        .map(element => Collapse.getOrCreateInstance(element))
    }

    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW)
    if (startEvent.defaultPrevented || !this._element) {
      return
    }

    for (const activeInstance of activeChildren) {
      activeInstance.hide()
    }

    await this._setShown(true)
  }

  async hide(): Promise<void> {
    if (this._isTransitioning || !this._element.open) {
      return
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE)
    if (startEvent.defaultPrevented || !this._element) {
      return
    }

    await this._setShown(false)
  }

  // Private
  protected async _setShown(open: boolean): Promise<void> {
    const element = this._element
    const horizontalClose = !open && element.classList.contains(CLASS_NAME_HORIZONTAL)

    // Keep the native content visible while its width shrinks.
    if (horizontalClose) {
      element.classList.add(CLASS_NAME_CLOSING)
    } else {
      element.open = open
    }

    this._isTransitioning = true
    this._syncTriggers()
    // Browsers can animate ::details-content without exposing its transition events.
    const duration = getTransitionDurationFromElement(element, DETAILS_CONTENT)
    if (duration > 0) {
      // Allow one frame for the browser to start the transition.
      await new Promise(resolve => {
        setTimeout(resolve, duration + 20)
      })
    }

    if (this._element) {
      this._finishClose()
      this._isTransitioning = false
      if (element.open === open) {
        EventHandler.trigger(element, open ? EVENT_SHOWN : EVENT_HIDDEN)
      }
    }
  }

  protected _finishClose(): void {
    if (this._element.classList.contains(CLASS_NAME_CLOSING)) {
      this._element.open = false
      this._element.classList.remove(CLASS_NAME_CLOSING)
    }
  }

  // One trigger can target more than one collapse. Those collapses open
  // together, so a shared parent must not close them against each other.
  protected _sharesTrigger(element: HTMLDetailsElement): boolean {
    return this._triggerArray.some(
      trigger => getCollapseTargets(trigger).includes(element)
    )
  }

  protected override _configAfterMerge(config: ComponentConfig): ComponentConfig {
    config.parent = getElement(config.parent)
    return config
  }

  protected _initializeChildren(): void {
    if (!this._config.parent) {
      return
    }

    this._syncTriggers(this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE))
  }

  protected _getFirstLevelChildren<T extends HTMLElement = HTMLElement>(selector: string): T[] {
    const children = SelectorEngine.find(SELECTOR_DEEPER_CHILDREN, this._config.parent as HTMLElement)
    // remove children if greater depth
    return SelectorEngine.find<T>(selector, this._config.parent as HTMLElement).filter(element => !children.includes(element))
  }

  protected _syncTriggers(triggers = this._triggerArray): void {
    for (const trigger of triggers) {
      const targets = getCollapseTargets(trigger)
      if (targets.length) {
        this._setAriaExpanded([trigger], targets.some(isShown))
      }
    }
  }

  protected _setAriaExpanded(triggerArray: HTMLElement[], isOpen: boolean): void {
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

  for (const element of getCollapseTargets(this)) {
    if (this === SelectorEngine.findOne(':scope > summary', element)) {
      event.preventDefault()
    }

    Collapse.getOrCreateInstance(element).toggle()
  }
})

EventHandler.on(document, EVENT_CLICK_DATA_API, event => {
  if (event.defaultPrevented || !(event.target instanceof Element)) {
    return
  }

  const summary = SelectorEngine.closest(event.target, 'summary')
  const details = summary?.parentElement ?? null
  if (!summary || !isCollapse(details) || summary !== SelectorEngine.findOne(':scope > summary', details)) {
    return
  }

  const control = SelectorEngine.closest(event.target, SELECTOR_SUMMARY_CONTROL)
  if (control && control !== summary && summary.contains(control)) {
    return
  }

  event.preventDefault()
  Collapse.getOrCreateInstance(details).toggle()
})

// Native grouping and direct changes to `open` also update external controls.
document.addEventListener('toggle', event => {
  if (event.target instanceof HTMLDetailsElement && isCollapse(event.target)) {
    for (const trigger of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
      const targets = getCollapseTargets(trigger)
      if (targets.includes(event.target)) {
        setAriaAttribute(trigger, 'aria-expanded', targets.some(isShown))
      }
    }
  }
}, true)

/**
 * Open opted-in collapses when the URL fragment matches their id.
 * Put `data-bs-hash` on the collapsible target.
 */
enableHashTarget(`${EVENT_KEY}${DATA_API_KEY}`, {
  matches: isCollapse,
  getAnchor(element) {
    if (!isCollapse(element)) {
      return null
    }

    return SelectorEngine.find(SELECTOR_DATA_TOGGLE).find(trigger => getCollapseTargets(trigger).includes(element)) ?? null
  },
  async open(element, done) {
    if (!isCollapse(element)) {
      return
    }

    if (isShown(element)) {
      done()
      return
    }

    await Collapse.getOrCreateInstance(element).show()
    if (isShown(element)) {
      done()
    }
  }
})

export default Collapse
export type { CollapseConfig }
